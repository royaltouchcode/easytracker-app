import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Device, 
  Position, 
  EventLog, 
  CommandHistory, 
  Geofence, 
  MediaEvidence, 
  ServerConfig, 
  UserSession, 
  MapLayerType, 
  VehicleType, 
  EngineLog, 
  SensorLog,
  FuelRefillLog,
  AlertFeedbackMode,
  SaasRole,
  DeviceWarrantyInfo,
  WarrantyClaimTicket,
  PartnerRegistrationEntry,
  PartnerServiceTier,
  SupportTicket,
  TicketStatus,
  TicketPriority,
  RateCardService,
  SparePartItem,
  PaidJobCard,
  SelectedServiceItem,
  SelectedSparePartItem,
  SellerImeiQuota,
  TechnicianLedgerConfig,
  TechnicianTransaction,
  DigitalPaymentOffer,
  DeviceInventoryItem,
  SimInventoryItem,
  AppTheme,
  ReturnLogEntry,
  ReturnChannel,
  ReturnCondition,
  ReturnResolution,
  ReturnOwnership,
  ReturnItemType
} from '../types/traccar';
import { traccarApi } from '../services/traccarApi';
import { traccarSocket } from '../services/traccarSocket';
import { audioAlertService } from '../services/audioAlertService';
import { reverseGeocodeCoords } from '../utils/reverseGeocoding';

export type TabType = 'map' | 'reports' | 'playback' | 'commands' | 'surveillance' | 'geofence' | 'alerts' | 'settings' | 'saas_admin' | 'saas_partner' | 'saas_sales' | 'saas_technician' | 'saas_support' | 'saas_rescue';
export type Language = 'en' | 'bn';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, language: Language = 'bn'): { km: number; formatted: string; isNearby: boolean } {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  
  if (d < 0.03) {
    return { 
      km: d, 
      formatted: language === 'bn' ? '০ মি (বাইকের কাছেই আছেন)' : '0 m (At vehicle)', 
      isNearby: true 
    };
  }
  if (d < 1) {
    const meters = Math.round(d * 1000);
    return { 
      km: d, 
      formatted: language === 'bn' ? `${meters} মিটার` : `${meters} m`, 
      isNearby: false 
    };
  }
  return { 
    km: d, 
    formatted: language === 'bn' ? `${d.toFixed(2)} কিমি` : `${d.toFixed(2)} km`, 
    isNearby: false 
  };
}

export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): { angle: number; labelBn: string; labelEn: string } {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  brng = (brng + 360) % 360;

  const directions = [
    { labelBn: 'উত্তর (N ↑)', labelEn: 'North (N ↑)' },
    { labelBn: 'উত্তর-পূর্ব (NE ↗)', labelEn: 'North-East (NE ↗)' },
    { labelBn: 'পূর্ব (E →)', labelEn: 'East (E →)' },
    { labelBn: 'দক্ষিণ-পূর্ব (SE ↘)', labelEn: 'South-East (SE ↘)' },
    { labelBn: 'দক্ষিণ (S ↓)', labelEn: 'South (S ↓)' },
    { labelBn: 'দক্ষিণ-পশ্চিম (SW ↙)', labelEn: 'South-West (SW ↙)' },
    { labelBn: 'পশ্চিম (W ←)', labelEn: 'West (W ←)' },
    { labelBn: 'উত্তর-পশ্চিম (NW ↖)', labelEn: 'North-West (NW ↖)' }
  ];
  const index = Math.round(brng / 45) % 8;
  return { angle: Math.round(brng), labelBn: directions[index].labelBn, labelEn: directions[index].labelEn };
}

interface AppContextType {
  user: UserSession | null;
  serverConfig: ServerConfig;
  setServerConfig: (config: ServerConfig) => void;
  login: (emailOrUser: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  currentRole: SaasRole;
  setCurrentRole: (role: SaasRole) => void;
  isRoleSwitcherOpen: boolean;
  setIsRoleSwitcherOpen: (open: boolean) => void;

  purgeDemoFleetData: () => void;
  restoreDemoFleetData: () => void;
  isDemoPurged: boolean;

  devices: Device[];
  tenantDevices: Device[]; // Partner-filtered: only devices belonging to the logged-in partner
  selectedDeviceId: number;
  setSelectedDeviceId: (id: number) => void;
  selectedDevice: Device | undefined;
  positions: Record<number, Position>;
  selectedPosition: Position | undefined;
  updateDeviceProfile: (id: number, partial: Partial<Device>) => void;
  calibrateVehicleLocation: (deviceId: number, lat: number, lon: number, address?: string) => void;
  syncServerData: () => Promise<void>;

  userLocation: UserLocation | null;
  requestUserLocation: () => void;
  distanceInfo: { km: number; formatted: string; isNearby: boolean };
  bearingInfo: { angle: number; labelBn: string; labelEn: string };
  openGoogleMapsNavigation: () => void;

  mapLayer: MapLayerType;
  setMapLayer: (layer: MapLayerType) => void;
  showTraffic: boolean;
  setShowTraffic: (show: boolean) => void;
  showDistanceLine: boolean;
  setShowDistanceLine: (show: boolean) => void;
  showGeofenceOnMap: boolean;
  setShowGeofenceOnMap: (show: boolean) => void;

  commandHistory: CommandHistory[];
  sendCommand: (type: string, rawCmd?: string, data?: any) => Promise<{ success: boolean; message?: string }>;

  geofences: Geofence[];
  addGeofence: (geo: Omit<Geofence, 'id'>) => void;
  updateGeofence: (id: number, geo: Partial<Geofence>) => void;
  deleteGeofence: (id: number) => void;
  toggleGeofence: (id: number) => void;
  geofenceStatus: { isInside: boolean; activeZoneNames: string[]; activeCount: number };

  evidenceList: MediaEvidence[];
  addEvidence: (evidence: Omit<MediaEvidence, 'id' | 'timestamp'>) => void;
  deleteEvidence: (id: string) => void;

  alerts: EventLog[];
  unreadAlertCount: number;
  markAlertsAsRead: () => void;
  triggerManualAlert: (alarmType: string, msg: string) => void;

  engineLogs: EngineLog[];
  addEngineLog: (log: Omit<EngineLog, 'id' | 'timestamp'>) => void;

  sensorLogs: SensorLog[];
  addSensorLog: (log: Omit<SensorLog, 'id' | 'timestamp'>) => void;

  fuelRefillLogs: FuelRefillLog[];
  addFuelRefillLog: (log: Omit<FuelRefillLog, 'id' | 'timestamp'>) => void;
  deleteFuelRefillLog: (id: string) => void;

  alertFeedbackMode: AlertFeedbackMode;
  setAlertFeedbackMode: (mode: AlertFeedbackMode) => void;

  // Device-wise Warranty Management & Claims Engine
  deviceWarranties: Record<number, DeviceWarrantyInfo>;
  warrantyClaims: WarrantyClaimTicket[];
  setDeviceWarranty: (deviceId: number, warranty: Partial<DeviceWarrantyInfo>) => void;
  submitWarrantyClaim: (claim: Omit<WarrantyClaimTicket, 'id' | 'claimDate' | 'status'>) => Promise<WarrantyClaimTicket>;
  assignTechnicianToClaim: (claimId: string, techName: string, techPhone: string, techNotes?: string) => void;
  completeWarrantyClaim: (claimId: string, replacementImei?: string, techNotes?: string) => void;

  // Customer Support & Complaint Tickets Lifecycle
  supportTickets: SupportTicket[];
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'time' | 'status'>) => Promise<SupportTicket>;
  updateSupportTicketStatus: (ticketId: string, status: TicketStatus, agentNotes?: string) => void;

  // B2B Multi-Tenant Partner & Whitelabel Ecosystem
  partnerRegistrations: PartnerRegistrationEntry[];
  approvedPartners: PartnerRegistrationEntry[];
  registerPartner: (entry: Omit<PartnerRegistrationEntry, 'id' | 'status' | 'submittedAt'>) => Promise<PartnerRegistrationEntry>;
  addDirectPartner: (entry: Omit<PartnerRegistrationEntry, 'id' | 'status' | 'submittedAt'>) => Promise<PartnerRegistrationEntry>;
  updatePartnerDetails: (id: string, updates: Partial<PartnerRegistrationEntry>) => void;
  verifyLocation: (partnerIdOrEmail: string, lat: number, lng: number, shopAddress?: string, shopName?: string, googleMapsUrl?: string) => void;
  approvePartner: (id: string, serviceTier: PartnerServiceTier, username: string, assignedRoles: SaasRole[], adminNotes?: string, customServerUrl?: string, customServerPort?: string) => void;
  rejectPartner: (id: string, reason?: string) => void;

  // Paid Out-of-Warranty Rate-Card & Spare Parts Management
  rateCardServices: RateCardService[];
  sparePartsCatalog: SparePartItem[];
  paidJobCards: PaidJobCard[];
  platformCommissionPercent: number;
  setPlatformCommissionPercent: (percent: number) => void;
  addRateCardService: (service: Omit<RateCardService, 'id'>) => void;
  updateRateCardService: (id: string, service: Partial<RateCardService>) => void;
  deleteRateCardService: (id: string) => void;
  addSparePart: (part: Omit<SparePartItem, 'id'>) => void;
  updateSparePart: (id: string, part: Partial<SparePartItem>) => void;
  deleteSparePart: (id: string) => void;
  createPaidJobCard: (card: Omit<PaidJobCard, 'id' | 'createdAt' | 'jobStatus' | 'platformCommissionAmount' | 'technicianPayoutAmount' | 'totalAmount'>) => Promise<PaidJobCard>;
  sendJobCardBill: (jobCardId: string, services: SelectedServiceItem[], parts: SelectedSparePartItem[], techNote?: string) => void;
  confirmJobCardByCustomer: (jobCardId: string, paymentMethod: 'cash_at_center' | 'online_bkash') => void;
  completeJobCard: (jobCardId: string) => void;

  // 📦 Seller / Dealer IMEI Paywall Quota Management
  sellerImeiQuotas: SellerImeiQuota[];
  updateSellerQuota: (partnerId: string, maxQuota: number) => void;
  allocateImeiToSeller: (partnerId: string, imei: string, model: string, costBdt: number) => void;
  unlockImeiPaywall: (partnerId: string, imei: string, customerName: string, customerPhone: string) => void;

  // 💳 The Negative Floating Ledger for Technicians
  technicianLedgers: TechnicianLedgerConfig[];
  updateTechnicianLimits: (techId: string, maxNegativeLimit: number, maxDueDays: number) => void;
  recordTechTransaction: (techId: string, transaction: Omit<TechnicianTransaction, 'id' | 'date' | 'timestamp'>) => void;
  settleWeeklyTechPayout: (techId: string) => void;

  // 🎁 Customer Digital Cashless Payment Incentives (bKash / Nagad / BanglaQR)
  digitalPaymentOffers: DigitalPaymentOffer[];
  updatePaymentOffer: (id: string, offer: Partial<DigitalPaymentOffer>) => void;

  // 💼 Universal Multi-Role Sales & Staff Commission Hub
  staffCommissions: StaffCommissionEntry[];
  registerUniversalSale: (sale: {
    customerName: string;
    customerPhone: string;
    vehicleName: string;
    plateNumber: string;
    imei: string;
    simNumber: string;
    commissionBdt?: number;
    packagePlan?: string;
  }) => Promise<StaffCommissionEntry>;
  payoutStaffCommission: (commissionId: string) => void;
  getMyCommissionSummary: (userId?: string) => {
    totalSold: number;
    totalEarned: number;
    pendingPayout: number;
    paidOut: number;
    myCommissions: StaffCommissionEntry[];
  };

  // 📦 Enterprise Hardware & SIM Inventory ERP
  deviceInventory: DeviceInventoryItem[];
  simInventory: SimInventoryItem[];
  addDeviceToInventory: (device: Omit<DeviceInventoryItem, 'id' | 'addedDate'>) => void;
  updateDeviceInventoryItem: (id: string, updates: Partial<DeviceInventoryItem>) => void;
  deleteDeviceInventoryItem: (id: string) => void;
  unbindDeviceFromVehicle: (id: string) => void;
  addSimToInventory: (sim: Omit<SimInventoryItem, 'id' | 'addedDate'>) => void;
  updateSimInventoryItem: (id: string, updates: Partial<SimInventoryItem>) => void;
  deleteSimInventoryItem: (id: string) => void;
  unbindSimFromDevice: (id: string) => void;
  bulkImportDevices: (devices: Omit<DeviceInventoryItem, 'id' | 'addedDate'>[]) => void;
  bulkImportSims: (sims: Omit<SimInventoryItem, 'id' | 'addedDate'>[]) => void;
  updatePartnerTierPricing: (
    partnerId: string, 
    allInclusivePricing: PartnerRegistrationEntry['allInclusivePricing'], 
    serverOnlyPricing: PartnerRegistrationEntry['serverOnlyPricing'],
    payoutMethod?: 'bkash' | 'nagad' | 'bank',
    payoutNumber?: string
  ) => void;

  appTheme: AppTheme;
  setAppTheme: (theme: AppTheme) => void;
  returnLogs: ReturnLogEntry[];
  initiateReturnLog: (entry: Omit<ReturnLogEntry, 'id' | 'challanNumber' | 'returnDate'>) => ReturnLogEntry;
  updateReturnLog: (id: string, updates: Partial<ReturnLogEntry>) => void;
  resolveReturnLog: (id: string, resolution: ReturnResolution, refundAmount?: number, qcNotes?: string) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    app_title: 'EasyTracker',
    live_tracking: 'Live Map',
    playback: 'Playback',
    commands: 'Commands',
    surveillance: 'Cam & Voice',
    geofence: 'Geofence',
    alerts: 'Alerts',
    settings: 'Settings',
    speed: 'Speed',
    ignition: 'Ignition',
    engine_on: 'Engine ON',
    engine_off: 'Engine OFF',
    battery: 'Battery',
    satellites: 'Sats',
    gsm_signal: 'GSM',
    cut_engine: 'Cut Engine',
    resume_engine: 'Start Engine',
    distance_to_car: 'Distance to Vehicle',
    direction: 'Direction',
    navigate_to_car: 'Navigate in Maps',
    my_location: 'My Location',
  },
  bn: {
    app_title: 'ইজিট্র্যাকার',
    live_tracking: 'লাইভ ম্যাপ',
    playback: 'প্লেব্যাক',
    commands: 'কমান্ড',
    surveillance: 'ক্যাম ও ভয়েস',
    geofence: 'জিওফেন্স',
    alerts: 'অ্যালার্ট',
    settings: 'সেটিংস',
    speed: 'গতিবেগ',
    ignition: 'ইগনিশন',
    engine_on: 'ইঞ্জিন চালু',
    engine_off: 'ইঞ্জিন বন্ধ',
    battery: 'ব্যাটারি',
    satellites: 'স্যাটেলাইট',
    gsm_signal: 'জিএসএম',
    cut_engine: 'ইঞ্জিন লক (অফ)',
    resume_engine: 'ইঞ্জিন আনলক (অন)',
    distance_to_car: 'গাড়ির দূরত্ব',
    direction: 'দিকনির্দেশ',
    navigate_to_car: 'গুগল ম্যাপে ডিরেকশন',
    my_location: 'আমার অবস্থান',
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gps_user_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [serverConfig, setServerConfig] = useState<ServerConfig>(() => {
    const saved = localStorage.getItem('gps_server_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Traccar Demo 3',
      url: 'https://demo3.traccar.org',
      port: '5023',
      isDemo: true
    };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('map');

  // SaaS Multi-Role State (Customer, Super Admin, Sales, Technician, Support, Rescue)
  // BUG #1 FIX: Validate stored role against user's approvedRoles to prevent localStorage injection
  const [currentRole, setCurrentRole] = useState<SaasRole>(() => {
    const storedRole = localStorage.getItem('gps_saas_current_role') as SaasRole;
    const storedSession = localStorage.getItem('gps_user_session');
    if (storedRole && storedSession) {
      try {
        const parsedUser = JSON.parse(storedSession);
        const approvedRoles: SaasRole[] = parsedUser?.approvedRoles || ['customer'];
        const isAdmin = parsedUser?.administrator || parsedUser?.role === 'super_admin';
        if (isAdmin || approvedRoles.includes(storedRole)) {
          return storedRole;
        }
      } catch (e) {}
    }
    return 'customer';
  });
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);
  const [isDemoPurged, setIsDemoPurged] = useState(() => localStorage.getItem('gps_demo_purged') !== 'false');
  
  const [devices, setDevices] = useState<Device[]>(() => {
    const isPurged = localStorage.getItem('gps_demo_purged') !== 'false';
    const savedCustom = localStorage.getItem('gps_saved_device_profile');
    let customParsed: any = null;
    if (savedCustom) {
      try { customParsed = JSON.parse(savedCustom); } catch (e) {}
    }

    const realBike: Device = {
      id: 1,
      name: customParsed?.name || 'My Bike (আমার বাইক)',
      uniqueId: customParsed?.uniqueId || '864720058291034',
      status: 'online',
      disabled: false,
      lastUpdate: new Date().toISOString(),
      category: customParsed?.category || 'motorcycle',
      phone: customParsed?.phone || '+8801700000000',
      attributes: {
        color: '#ef4444',
        plateNumber: customParsed?.attributes?.plateNumber || 'DHAKA METRO-LA 11-2233',
        driverName: customParsed?.attributes?.driverName || 'Mohammad Azhar',
        driverPhone: customParsed?.attributes?.driverPhone || '01700000000',
        sos1: customParsed?.attributes?.sos1 || '01800000000',
        speedLimit: customParsed?.attributes?.speedLimit || 60,
        initialOdometerKm: customParsed?.attributes?.initialOdometerKm !== undefined ? customParsed.attributes.initialOdometerKm : 12450,
        initialFuelLiters: customParsed?.attributes?.initialFuelLiters || 9.5,
        vehicleSpec: customParsed?.attributes?.vehicleSpec || {
          manufacturer: 'Bajaj',
          modelName: 'Avenger 160 Street',
          engineOilGrade: '20W-50 DTS-i 4T',
          engineOilCapacityLiters: 1.15,
          oilChangeIntervalKm: 2500,
          fuelTankCapacityLiters: 13,
          tirePressureFrontPsi: 21,
          tirePressureRearPsi: 28
        },
        ...(customParsed?.attributes || {})
      }
    };

    if (isPurged) {
      return [realBike];
    }

    return [
      realBike,
      {
        id: 2,
        name: 'Toyota Axio (ঢাকা মেট্রো-গ ৩৪-৬৫৩৭)',
        uniqueId: '864720058291035',
        status: 'online',
        disabled: false,
        lastUpdate: new Date().toISOString(),
        category: 'car',
        phone: '+8801711223344',
        attributes: {
          color: '#3b82f6',
          plateNumber: 'DM GA 34-6537',
          driverName: 'Rafiqul Islam',
          driverPhone: '01711223344',
          speedLimit: 80,
          initialOdometerKm: 48200,
          initialFuelLiters: 32,
          vehicleSpec: {
            manufacturer: 'Toyota',
            modelName: 'Corolla / Axio',
            engineOilGrade: '5W-30 Synthetic',
            engineOilCapacityLiters: 3.7,
            oilChangeIntervalKm: 5000,
            fuelTankCapacityLiters: 50
          }
        }
      },
      {
        id: 3,
        name: 'Tata 1615 Cargo Truck (ঢাকা মেট্রো-ট ২৭-৮৫৭৮)',
        uniqueId: '864720058291036',
        status: 'online',
        disabled: false,
        lastUpdate: new Date().toISOString(),
        category: 'truck',
        phone: '+8801722334455',
        attributes: {
          color: '#f59e0b',
          plateNumber: 'DM GA 27-8578',
          driverName: 'Abdul Karim',
          driverPhone: '01722334455',
          speedLimit: 60,
          initialOdometerKm: 98400,
          initialFuelLiters: 140,
          vehicleSpec: {
            manufacturer: 'Tata',
            modelName: '1615 Heavy Truck',
            engineOilGrade: '15W-40 CI-4 Diesel',
            engineOilCapacityLiters: 14.0,
            oilChangeIntervalKm: 10000,
            fuelTankCapacityLiters: 250
          }
        }
      },
      {
        id: 4,
        name: 'Bajaj RE 4S CNG (ঢাকা মেট্রো-থ ২৩-১৪৪৯)',
        uniqueId: '864720058291037',
        status: 'online',
        disabled: false,
        lastUpdate: new Date().toISOString(),
        category: 'cng',
        phone: '+8801733445566',
        attributes: {
          color: '#10b981',
          plateNumber: 'DM GA 23-1449',
          driverName: 'Sujon Mia',
          driverPhone: '01733445566',
          speedLimit: 45,
          initialOdometerKm: 28900,
          initialFuelLiters: 6,
          vehicleSpec: {
            manufacturer: 'Bajaj',
            modelName: 'RE 4S CNG Auto',
            engineOilGrade: '20W-50 CNG Grade',
            engineOilCapacityLiters: 1.25,
            oilChangeIntervalKm: 2500,
            fuelTankCapacityLiters: 8
          }
        }
      },
      {
        id: 5,
        name: 'Toyota HiAce Ambulance (ঢাকা মেট্রো-ছ ১১-৯৮২০)',
        uniqueId: '864720058291038',
        status: 'online',
        disabled: false,
        lastUpdate: new Date().toISOString(),
        category: 'ambulance',
        phone: '+8801744556677',
        attributes: {
          color: '#ef4444',
          plateNumber: 'DM CHHA 11-9820',
          driverName: 'Shahidul Alam',
          driverPhone: '01744556677',
          speedLimit: 90,
          initialOdometerKm: 62100,
          initialFuelLiters: 45,
          vehicleSpec: {
            manufacturer: 'Toyota',
            modelName: 'HiAce High-Roof Ambulance',
            engineOilGrade: '15W-40 Turbo Diesel',
            engineOilCapacityLiters: 5.8,
            oilChangeIntervalKm: 5000,
            fuelTankCapacityLiters: 70
          }
        }
      }
    ];
  });

  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(1);
  const [positions, setPositions] = useState<Record<number, Position>>(() => {
    try {
      const stored = localStorage.getItem('gps_last_known_positions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          // Purge any stale legacy mock positions (23.8103, 90.4125)
          const cleaned: Record<number, Position> = {};
          for (const [k, v] of Object.entries(parsed)) {
            const pos = v as Position;
            if (pos && typeof pos.latitude === 'number' && typeof pos.longitude === 'number' && pos.latitude !== 0) {
              if (Math.abs(pos.latitude - 23.8103) > 0.0001 || Math.abs(pos.longitude - 90.4125) > 0.0001) {
                cleaned[Number(k)] = pos;
              }
            }
          }
          if (Object.keys(cleaned).length > 0) return cleaned;
        }
      }
    } catch (e) {}

    // Default fallback position for primary vehicles
    return {
      1: {
        id: 101,
        deviceId: 1,
        protocol: 'gt06',
        serverTime: new Date().toISOString(),
        deviceTime: new Date().toISOString(),
        fixTime: new Date().toISOString(),
        outdated: false,
        valid: true,
        latitude: 23.7937,
        longitude: 90.4066,
        altitude: 14,
        speed: 0,
        course: 45,
        address: 'Road 11, Block-D, Banani / Gulshan, Dhaka',
        accuracy: 4,
        network: null,
        attributes: {
          ignition: true,
          motion: false,
          batteryLevel: 98,
          satellites: 14,
          power: 12.8,
          isLastKnown: false
        }
      },
      2: {
        id: 102,
        deviceId: 2,
        protocol: 'gt06',
        serverTime: new Date().toISOString(),
        deviceTime: new Date().toISOString(),
        fixTime: new Date().toISOString(),
        outdated: false,
        valid: true,
        latitude: 23.8103,
        longitude: 90.4125,
        altitude: 12,
        speed: 42,
        course: 120,
        address: 'Baridhara DOHS Bypass, Dhaka',
        accuracy: 5,
        network: null,
        attributes: {
          ignition: true,
          motion: true,
          batteryLevel: 100,
          satellites: 16,
          power: 13.6,
          isLastKnown: false
        }
      }
    };
  });
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // Auto Reverse Geocoding for current vehicle position
  useEffect(() => {
    const pos = positions[selectedDeviceId];
    if (pos && pos.latitude && pos.longitude) {
      if (!pos.address || pos.address.includes('Last Known Location') || pos.address.includes('Waiting for GPS')) {
        reverseGeocodeCoords(pos.latitude, pos.longitude).then(resolvedAddr => {
          if (resolvedAddr && resolvedAddr !== pos.address) {
            setPositions(prev => {
              if (!prev[selectedDeviceId]) return prev;
              return {
                ...prev,
                [selectedDeviceId]: {
                  ...prev[selectedDeviceId],
                  address: resolvedAddr
                }
              };
            });
          }
        });
      }
    }
  }, [selectedDeviceId, positions[selectedDeviceId]?.latitude, positions[selectedDeviceId]?.longitude]);

  const [mapLayer, setMapLayer] = useState<MapLayerType>(() => {
    return (localStorage.getItem('easytracker_default_map_layer') as MapLayerType) || 'carto_positron';
  });
  const [showTraffic, setShowTraffic] = useState(true);
  const [showDistanceLine, setShowDistanceLine] = useState(true);
  const [showGeofenceOnMap, setShowGeofenceOnMap] = useState(true);

  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);

  // Persistent Multiple Geofences (Default Home & Office Safe Zones)
  const [geofences, setGeofences] = useState<Geofence[]>(() => {
    const saved = localStorage.getItem('gps_saved_geofences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 101,
        name: 'Home Safe Zone (বাসা)',
        description: 'Home Parking Boundary',
        area: 'CIRCLE (23.7937 90.4066, 350)',
        latitude: 23.7937,
        longitude: 90.4066,
        radius: 350,
        attributes: { color: '#3b82f6', alertOnEnter: true, alertOnExit: true, enabled: true }
      },
      {
        id: 102,
        name: 'Office Zone (অফিস)',
        description: 'Office Parking Perimeter',
        area: 'CIRCLE (23.7808 90.4152, 400)',
        latitude: 23.7808,
        longitude: 90.4152,
        radius: 400,
        attributes: { color: '#10b981', alertOnEnter: true, alertOnExit: true, enabled: true }
      }
    ];
  });

  const [evidenceList, setEvidenceList] = useState<MediaEvidence[]>([]);
  const [alerts, setAlerts] = useState<EventLog[]>(() => {
    const saved = localStorage.getItem('gps_saved_alerts_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 991,
        deviceId: 1,
        type: 'parking_violation',
        serverTime: new Date(Date.now() - 1100000).toISOString(),
        attributes: {
          alarm: 'parking_violation',
          message: 'এআই অবৈধ পার্কিং সনাক্তকরণ: বিমানবন্দর ভিআইপি করিডোর ও ফ্লাইওভার সংযোগস্থলে গাড়ি পার্ক করা হয়েছে।',
          location: 'Airport VIP Road, Near Kuril Flyover, Dhaka',
          parkedStartTime: Date.now() - 1100000,
          speed: 0
        }
      },
      {
        id: 992,
        deviceId: 1,
        type: 'traffic_signal',
        serverTime: new Date(Date.now() - 3600000).toISOString(),
        attributes: {
          alarm: 'traffic_signal',
          message: '৩৬০° ক্যামেরা ও ADAS অ্যালার্ট: লাল বাতি সিগন্যাল অতিক্রম করা হয়েছে। ৫ সেকেন্ডের ভিডিও রেকর্ড সংরক্ষিত।',
          location: 'Bijoy Sarani Traffic Intersection, Dhaka',
          speed: 38,
          hasVideoEvidence: true
        }
      },
      {
        id: 993,
        deviceId: 1,
        type: 'overspeed',
        serverTime: new Date(Date.now() - 7200000).toISOString(),
        attributes: {
          alarm: 'overspeed',
          message: 'ওভার-স্পিড অতিক্রম: নির্ধারিত ৬০ কিমি/ঘণ্টা স্পিড লিমিট অতিক্রম করে ৭৪ কিমি/ঘণ্টা গতি রেকর্ড হয়েছে।',
          speed: 74,
          location: 'Mohakhali Flyover, Dhaka'
        }
      }
    ];
  });

  // Alert Feedback Mode (Sound + Vibration, Only Sound, Only Vibration, SMS, Full Alarm, Silent)
  const [alertFeedbackMode, setAlertFeedbackModeState] = useState<AlertFeedbackMode>(() => {
    const saved = localStorage.getItem('gps_alert_feedback_mode') as AlertFeedbackMode;
    return saved || 'sound_vibration';
  });

  const setAlertFeedbackMode = (mode: AlertFeedbackMode) => {
    setAlertFeedbackModeState(mode);
    localStorage.setItem('gps_alert_feedback_mode', mode);
  };

  const [language, setLanguage] = useState<Language>('bn');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);

  // Physical Device Feedback Engine (Audio + Web Vibration API)
  const triggerAlertFeedback = (alarmType: string, _msg?: string) => {
    if (alertFeedbackMode === 'silent') return;
    const shouldSound = alertFeedbackMode === 'only_sound' || alertFeedbackMode === 'sound_vibration' || alertFeedbackMode === 'sms_sound_vibration';
    const shouldVibrate = alertFeedbackMode === 'only_vibration' || alertFeedbackMode === 'sound_vibration' || alertFeedbackMode === 'sms_sound_vibration';

    if (shouldSound && audioAlertsEnabled) {
      audioAlertService.playAlert(alarmType as any);
    }
    if (shouldVibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 150, 400]);
      } catch (e) {
        console.warn('Vibration API not supported on this platform:', e);
      }
    }
  };

  // Persistent Engine Event / Lock-Unlock Audit Logs
  const [engineLogs, setEngineLogs] = useState<EngineLog[]>(() => {
    const saved = localStorage.getItem('gps_engine_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const addEngineLog = (log: Omit<EngineLog, 'id' | 'timestamp'>) => {
    const newLog: EngineLog = {
      ...log,
      id: 'eng-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setEngineLogs(prev => {
      const next = [newLog, ...prev];
      localStorage.setItem('gps_engine_logs', JSON.stringify(next));
      return next;
    });
    triggerAlertFeedback('ignition', 'Engine Event');
  };

  // Sensor Event Audit Logs (AC, Door, Fuel Drops, Tank Lid, Vibration)
  const [sensorLogs, setSensorLogs] = useState<SensorLog[]>(() => {
    const saved = localStorage.getItem('gps_sensor_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'sens-1',
        deviceId: 1,
        deviceName: 'mdaaziz',
        sensorType: 'vibration',
        title: 'ভাইব্রেশন সেন্সর সচল ও নিরাপদ',
        status: 'armed',
        value: 'Armed & Safe',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  });

  const addSensorLog = (log: Omit<SensorLog, 'id' | 'timestamp'>) => {
    const newLog: SensorLog = {
      ...log,
      id: 'sens-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setSensorLogs(prev => {
      const next = [newLog, ...prev];
      localStorage.setItem('gps_sensor_logs', JSON.stringify(next));
      return next;
    });
    triggerAlertFeedback('vibration', 'Sensor Alert');
  };

  // Fuel Refill History Logs (Zero demo data rule - only real user entries)
  const [fuelRefillLogs, setFuelRefillLogs] = useState<FuelRefillLog[]>(() => {
    const saved = localStorage.getItem('gps_fuel_refill_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const addFuelRefillLog = (log: Omit<FuelRefillLog, 'id' | 'timestamp'>) => {
    const newEntry: FuelRefillLog = {
      ...log,
      id: 'refill-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setFuelRefillLogs(prev => {
      const next = [newEntry, ...prev];
      localStorage.setItem('gps_fuel_refill_logs', JSON.stringify(next));
      return next;
    });
  };

  const deleteFuelRefillLog = (id: string) => {
    setFuelRefillLogs(prev => {
      const next = prev.filter(l => l.id !== id);
      localStorage.setItem('gps_fuel_refill_logs', JSON.stringify(next));
      return next;
    });
  };

  // Device-wise Warranty Management State
  const [deviceWarranties, setDeviceWarranties] = useState<Record<number, DeviceWarrantyInfo>>(() => {
    const saved = localStorage.getItem('gps_device_warranties');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      1: {
        deviceId: 1,
        imei: '864720058291034',
        policyType: 'replacement_1yr',
        policyTitleBn: '১ বছর আনলিমিটেড রিপ্লেসমেন্ট ওয়ারেন্টি',
        activationDate: '01 Jan 2026',
        durationMonths: 12,
        expiryDate: '31 Dec 2026',
        status: 'active',
        coveredTerms: [
          'জিপিএস ট্র্যাকার মাদারবোর্ড ত্রুটি',
          'ইন্টারনাল পাওয়ার আইসি বা রিবুট লুপ সমস্যা',
          'রিলে ও ইঞ্জিন কাটঅফ ওয়্যারিং ফল্ট',
          'ফ্রি হার্ডওয়্যার সোয়াপ ও অন-সাইট সাপোর্ট'
        ]
      }
    };
  });

  // Warranty Claim Tickets Lifecycle Queue
  const [warrantyClaims, setWarrantyClaims] = useState<WarrantyClaimTicket[]>(() => {
    const saved = localStorage.getItem('gps_warranty_claims');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'WCLAIM-101',
        deviceId: 1,
        vehicleName: 'Bajaj Avenger 160 Street',
        plateNumber: 'DHAKA METRO-LA 11-2233',
        imei: '864720058291034',
        customerName: 'Mohammad Azhar',
        customerPhone: '01700-000000',
        issueType: 'no_gps_signal',
        issueTitleBn: 'স্যাটেলাইট সিগন্যাল বারবার ড্রপ ও অফলাইন সমস্যা',
        issueDetails: 'ইঞ্জিন চালু থাকলেও ট্র্যাকার মাঝেমধ্যে স্যাটেলাইট ফিক্স হারাচ্ছে। হার্ডওয়্যার ওয়্যারিং চেক প্রয়োজন।',
        preferredLocation: 'গুলশান সার্ভিস সেন্টার (রোড ১১, গুলশান-২, ঢাকা)',
        servicePointAddress: 'প্লট ৪২, রোড ১১, গুলশান-২, ঢাকা',
        claimDate: '24 Aug 2026',
        status: 'tech_assigned',
        assignedTechName: 'আব্দুল করিম (সিনিয়র ফিল্ড ইঞ্জিনিয়ার)',
        assignedTechPhone: '01711-223344',
        technicianNotes: 'আজ বিকেল ০৪:৩০ এ গুলশান সার্ভিস পয়েন্টে ডায়াগনস্টিক অ্যাপয়েন্টমেন্ট নির্ধারিত।'
      }
    ];
  });

  const setDeviceWarranty = (deviceId: number, warranty: Partial<DeviceWarrantyInfo>) => {
    setDeviceWarranties(prev => {
      const existing = prev[deviceId] || {
        deviceId,
        imei: '864720058291034',
        policyType: 'replacement_1yr',
        policyTitleBn: '১ বছর আনলিমিটেড রিপ্লেসমেন্ট ওয়ারেন্টি',
        activationDate: '01 Jan 2026',
        durationMonths: 12,
        expiryDate: '31 Dec 2026',
        status: 'active',
        coveredTerms: [
          'জিপিএস ট্র্যাকার মাদারবোর্ড ত্রুটি',
          'পাওয়ার আইসি ও রিলে সমস্যা',
          'ফ্রি হার্ডওয়্যার সোয়াপ'
        ]
      };
      const updated = {
        ...prev,
        [deviceId]: { ...existing, ...warranty }
      };
      localStorage.setItem('gps_device_warranties', JSON.stringify(updated));
      return updated;
    });
  };

  const submitWarrantyClaim = async (claim: Omit<WarrantyClaimTicket, 'id' | 'claimDate' | 'status'>): Promise<WarrantyClaimTicket> => {
    const newClaim: WarrantyClaimTicket = {
      ...claim,
      id: `WCLAIM-${Date.now().toString().slice(-4)}`,
      claimDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending_support'
    };
    setWarrantyClaims(prev => {
      const next = [newClaim, ...prev];
      localStorage.setItem('gps_warranty_claims', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'service_reminder',
      `🛡️ ওয়ারেন্টি ক্লেইম সাবমিট সফল (ID: ${newClaim.id})! নির্বাচিত সার্ভিস পয়েন্ট: ${newClaim.preferredLocation}। সাপোর্ট টিম শীঘ্রই যাচাই করে টেকনিশিয়ান অ্যাসাইন করবে।`
    );

    return newClaim;
  };

  const assignTechnicianToClaim = (claimId: string, techName: string, techPhone: string, techNotes?: string) => {
    setWarrantyClaims(prev => {
      const next = prev.map(c => {
        if (c.id === claimId) {
          return {
            ...c,
            status: 'tech_assigned' as const,
            assignedTechName: techName,
            assignedTechPhone: techPhone,
            technicianNotes: techNotes || c.technicianNotes
          };
        }
        return c;
      });
      localStorage.setItem('gps_warranty_claims', JSON.stringify(next));
      return next;
    });

    const targetClaim = warrantyClaims.find(c => c.id === claimId);
    if (targetClaim) {
      triggerManualAlert(
        'service_reminder',
        `🔔 ওয়ারেন্টি আপডেট (ID: ${claimId}): টেকনিশিয়ান ${techName} (${techPhone}) অ্যাসাইন হয়েছেন। সার্ভিস পয়েন্ট: ${targetClaim.preferredLocation}।`
      );
    }
  };

  const completeWarrantyClaim = (claimId: string, replacementImei?: string, techNotes?: string) => {
    setWarrantyClaims(prev => {
      const next = prev.map(c => {
        if (c.id === claimId) {
          return {
            ...c,
            status: 'completed' as const,
            replacementImei: replacementImei || c.replacementImei,
            technicianNotes: techNotes || c.technicianNotes,
            completedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        }
        return c;
      });
      localStorage.setItem('gps_warranty_claims', JSON.stringify(next));
      return next;
    });

    if (replacementImei && selectedDevice) {
      updateDeviceProfile(selectedDevice.id, { uniqueId: replacementImei });
    }

    triggerManualAlert(
      'geofenceEnter',
      `✅ ওয়ারেন্টি সার্ভিস সম্পন্ন (ID: ${claimId})! ডিভাইস পুরোপুরি ডায়াগনস্টিক টেস্টে উত্তীর্ণ হয়েছে।`
    );
  };

  // Customer Support & Complaint Tickets Lifecycle Queue
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('gps_support_tickets_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { 
        id: 'TKT-1082', 
        customer: 'Rakib Hasan', 
        phone: '01719-887766', 
        vehicle: 'Bajaj Pulsar 150', 
        issue: 'ইঞ্জিন কাটঅফ কমান্ড কাজ করছে না (রিলে তার চেক রিকোয়েস্ট)', 
        priority: 'High', 
        status: 'Pending', 
        time: '10 min ago',
        preferredLocation: 'মিরপুর সার্ভিস সেন্টার (মিরপুর ১০, ঢাকা)',
        agentNotes: 'কাস্টমারের সাথে কথা বলা হয়েছে, টেকনিশিয়ান ভিজিট শিডিউল করা দরকার।'
      },
      { 
        id: 'TKT-1081', 
        customer: 'Jahangir Alam', 
        phone: '01822-112233', 
        vehicle: 'Toyota Axio', 
        issue: 'অ্যাপে লাইভ লোকেশন আপডেট হচ্ছে না (সিম ব্যালেন্স চেক)', 
        priority: 'Medium', 
        status: 'In Progress', 
        time: '25 min ago',
        preferredLocation: 'গুলশান সার্ভিস সেন্টার (রোড ১১, গুলশান-২, ঢাকা)',
        agentNotes: 'সিম কার্ড রিচার্জ ভেরিফাই করা হয়েছে, ট্র্যাকার এখন লাইভ ডেটা পাঠাচ্ছে।'
      },
      { 
        id: 'TKT-1080', 
        customer: 'Shahadat Hossain', 
        phone: '01933-445566', 
        vehicle: 'Honda CB Hornet', 
        issue: 'পার্কিং অ্যালার্ট সাউন্ড কাজ করছে না', 
        priority: 'Low', 
        status: 'Pending', 
        time: '1 hour ago',
        preferredLocation: 'উত্তরা সার্ভিস সেন্টার (সেক্টর ৭, ঢাকা)',
        agentNotes: 'অ্যাপ নোটিফিকেশন পারমিশন রিবুট করতে পরামর্শ দেওয়া হয়েছে।'
      }
    ];
  });

  const submitSupportTicket = async (ticket: Omit<SupportTicket, 'id' | 'time' | 'status'>): Promise<SupportTicket> => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `TKT-${Math.floor(1085 + Math.random() * 900)}`,
      time: 'Just now',
      status: 'Pending'
    };
    setSupportTickets(prev => {
      const next = [newTicket, ...prev];
      localStorage.setItem('gps_support_tickets_list', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'service_reminder',
      `🎧 সাপোর্ট টিকিট গৃহীত (ID: ${newTicket.id})! সমস্যা: ${newTicket.issue}। আমাদের কাস্টমার কেয়ার টিম দ্রুত যোগাযোগ করবে।`
    );

    return newTicket;
  };

  const updateSupportTicketStatus = (ticketId: string, status: TicketStatus, agentNotes?: string) => {
    setSupportTickets(prev => {
      const next = prev.map(t => {
        if (t.id === ticketId) {
          return {
            ...t,
            status,
            agentNotes: agentNotes !== undefined ? agentNotes : t.agentNotes
          };
        }
        return t;
      });
      localStorage.setItem('gps_support_tickets_list', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'service_reminder',
      `🔔 টিকিট আপডেট (ID: ${ticketId}): স্ট্যাটাস পরিবর্তিত হয়েছে [${status}]`
    );
  };

  // B2B Multi-Tenant Partner & Whitelabel Registrations Queue
  const [partnerRegistrations, setPartnerRegistrations] = useState<PartnerRegistrationEntry[]>(() => {
    const saved = localStorage.getItem('gps_partner_registrations_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'PREG-901',
        type: 'b2b_brand',
        applicantName: 'Tariqul Islam',
        brandName: 'Green Fleet GPS Solutions',
        businessCategory: 'জিপিএস ডিলারশিপ ও ফ্লিট ম্যানেজমেন্ট',
        phone: '01811-998877',
        whatsapp: '01811-998877',
        email: 'tariq@greenfleetgps.com',
        district: 'ঢাকা (মিরপুর ১০)',
        fullAddress: 'প্লট ১৪, ব্লক সি, মিরপুর ১০ গোলচত্বর, ঢাকা',
        geoLat: 23.8067,
        geoLng: 90.3687,
        googleMapsUrl: 'https://maps.google.com/?q=23.8067,90.3687',
        desiredRoles: ['sales', 'technician'],
        requestedServices: ['server_tracking', 'shared_technicians', 'shared_support'],
        serviceTier: 'all_inclusive',
        status: 'pending_approval',
        submittedAt: '24 Aug 2026'
      },
      {
        id: 'PREG-902',
        type: 'staff_partner',
        applicantName: 'Mizanur Rahman',
        phone: '01911-334455',
        whatsapp: '01911-334455',
        district: 'চট্টগ্রাম (জিইসি মোড়)',
        fullAddress: 'জিইসি সার্কেল, সিডিএ এভিনিউ, চট্টগ্রাম',
        geoLat: 22.3587,
        geoLng: 91.8215,
        googleMapsUrl: 'https://maps.google.com/?q=22.3587,91.8215',
        desiredRoles: ['sales', 'technician', 'rescue'],
        requestedServices: ['server_tracking', 'shared_rescue'],
        serviceTier: 'subscription_wise',
        status: 'pending_approval',
        submittedAt: '24 Aug 2026'
      }
    ];
  });

  const [approvedPartners, setApprovedPartners] = useState<PartnerRegistrationEntry[]>(() => {
    const saved = localStorage.getItem('gps_approved_partners');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'PREG-880',
        type: 'b2b_brand',
        applicantName: 'Shafiqul Alam',
        brandName: 'Dhaka Motor Club Tracking',
        phone: '01711-556677',
        whatsapp: '01711-556677',
        district: 'ঢাকা (গুলশান)',
        fullAddress: 'রোড ১১, গুলশান-২, ঢাকা',
        geoLat: 23.7937,
        geoLng: 90.4066,
        googleMapsUrl: 'https://maps.google.com/?q=23.7937,90.4066',
        desiredRoles: ['sales', 'technician'],
        requestedServices: ['server_tracking', 'shared_technicians', 'shared_rescue', 'shared_support'],
        serviceTier: 'all_inclusive',
        status: 'approved',
        submittedAt: '20 Aug 2026',
        partnerId: 'partner_dmc',
        assignedUsername: 'partner/dmc'
      }
    ];
  });

  const registerPartner = async (entry: Omit<PartnerRegistrationEntry, 'id' | 'status' | 'submittedAt'>): Promise<PartnerRegistrationEntry> => {
    const newEntry: PartnerRegistrationEntry = {
      ...entry,
      id: `PREG-${Date.now().toString().slice(-4)}`,
      status: 'pending_approval',
      submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setPartnerRegistrations(prev => {
      const next = [newEntry, ...prev];
      localStorage.setItem('gps_partner_registrations_queue', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'subscription_reminder',
      `💼 নতুন পার্টনার আবেদন জমা হয়েছে (ID: ${newEntry.id})! আবেদনকারী: ${newEntry.applicantName} (${newEntry.phone})। সুপার অ্যাডমিন যাচাই ও অনুমোদন অপেক্ষমান।`
    );

    return newEntry;
  };

  const approvePartner = (
    id: string,
    serviceTier: PartnerServiceTier,
    username: string,
    assignedRoles: SaasRole[],
    adminNotes?: string,
    customServerUrl?: string,
    customServerPort?: string
  ) => {
    const target = partnerRegistrations.find(p => p.id === id);
    if (!target) return;

    const partnerId = target.partnerId || `partner_${id.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
    const approvedEntry: PartnerRegistrationEntry = {
      ...target,
      status: 'approved',
      serviceTier,
      assignedUsername: username,
      partnerId,
      desiredRoles: assignedRoles,
      adminReviewNotes: adminNotes,
      customServerUrl: customServerUrl?.trim() || target.customServerUrl,
      customServerPort: customServerPort?.trim() || target.customServerPort || '8082'
    };

    setPartnerRegistrations(prev => {
      const next = prev.map(p => p.id === id ? approvedEntry : p);
      localStorage.setItem('gps_partner_registrations_queue', JSON.stringify(next));
      return next;
    });

    setApprovedPartners(prev => {
      const next = [approvedEntry, ...prev.filter(p => p.id !== id)];
      localStorage.setItem('gps_approved_partners', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'subscription_reminder',
      `✅ পার্টনার অনুমোদন সম্পন্ন! ব্র্যান্ড/পার্টনার: ${target.brandName || target.applicantName}। ইউজারনেম: ${username}। সার্ভিস টিয়ার: ${serviceTier}।`
    );
  };

  const addDirectPartner = async (entry: Omit<PartnerRegistrationEntry, 'id' | 'status' | 'submittedAt'>): Promise<PartnerRegistrationEntry> => {
    const partnerId = entry.partnerId || `PRT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEntry: PartnerRegistrationEntry = {
      ...entry,
      id: `PREG-${Date.now().toString().slice(-4)}`,
      partnerId,
      status: 'approved',
      locationVerified: !!(entry.geoLat && entry.geoLng),
      submittedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setApprovedPartners(prev => {
      const next = [newEntry, ...prev.filter(p => p.id !== newEntry.id && p.partnerId !== partnerId)];
      localStorage.setItem('gps_approved_partners', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'subscription_reminder',
      `👑 অ্যাডমিন কর্তৃক সরাসরি পার্টনার অনবোর্ড সম্পন্ন! পার্টনার ID: ${partnerId} (${newEntry.brandName || newEntry.applicantName})।`
    );

    return newEntry;
  };

  const updatePartnerDetails = (id: string, updates: Partial<PartnerRegistrationEntry>) => {
    setApprovedPartners(prev => {
      const next = prev.map(p => (p.id === id || p.partnerId === id) ? { ...p, ...updates } : p);
      localStorage.setItem('gps_approved_partners', JSON.stringify(next));
      return next;
    });

    // If current logged-in user belongs to this partner, update active session
    if (user?.partnerId && (user.partnerId === id || user.email === id)) {
      setUser(prev => prev ? {
        ...prev,
        partnerBrandName: updates.brandName || prev.partnerBrandName,
        serviceTier: updates.serviceTier || prev.serviceTier,
        locationVerified: updates.locationVerified !== undefined ? updates.locationVerified : prev.locationVerified,
        geoLat: updates.geoLat !== undefined ? updates.geoLat : prev.geoLat,
        geoLng: updates.geoLng !== undefined ? updates.geoLng : prev.geoLng,
        googleMapsUrl: updates.googleMapsUrl || prev.googleMapsUrl
      } : null);
    }
  };

  const verifyLocation = (partnerIdOrEmail: string, lat: number, lng: number, shopAddress?: string, shopName?: string, googleMapsUrl?: string) => {
    const mapsUrl = googleMapsUrl || `https://maps.google.com/?q=${lat},${lng}`;
    const verifiedAt = new Date().toISOString();

    setApprovedPartners(prev => {
      const next = prev.map(p => {
        if (p.partnerId === partnerIdOrEmail || p.id === partnerIdOrEmail || p.email === partnerIdOrEmail || p.assignedUsername === partnerIdOrEmail) {
          return {
            ...p,
            geoLat: lat,
            geoLng: lng,
            googleMapsUrl: mapsUrl,
            shopAddress: shopAddress || p.fullAddress,
            shopName: shopName || p.brandName || p.applicantName,
            locationVerified: true,
            locationVerifiedAt: verifiedAt,
            locationVerifiedBy: user?.name || 'On-Site GPS Capture'
          };
        }
        return p;
      });
      localStorage.setItem('gps_approved_partners', JSON.stringify(next));
      return next;
    });

    // Update active user state
    setUser(prev => {
      if (!prev) return null;
      const updated: UserSession = {
        ...prev,
        geoLat: lat,
        geoLng: lng,
        googleMapsUrl: mapsUrl,
        shopAddress: shopAddress || prev.shopAddress,
        shopName: shopName || prev.shopName,
        locationVerified: true,
        locationVerifiedAt: verifiedAt,
        locationVerifiedBy: prev.name
      };
      localStorage.setItem('gps_auth_user', JSON.stringify(updated));
      return updated;
    });

    triggerAlertFeedback('overspeed', 'দোকানের রিয়েল জিপিএস ও গুগল ম্যাপস লোকেশন সফলভাবে ভেরিফাই হয়েছে!');
  };

  const rejectPartner = (id: string, reason?: string) => {
    setPartnerRegistrations(prev => {
      const next = prev.map(p => p.id === id ? { ...p, status: 'rejected' as const, adminReviewNotes: reason } : p);
      localStorage.setItem('gps_partner_registrations_queue', JSON.stringify(next));
      return next;
    });
  };

  // =========================================================================
  // 🛠️ PAID OUT-OF-WARRANTY RATE-CARD, SPARE PARTS & JOB-CARD ENGINE
  // =========================================================================
  const [platformCommissionPercent, setPlatformCommissionPercent] = useState<number>(() => {
    const saved = localStorage.getItem('gps_platform_commission_percent');
    return saved ? Number(saved) : 20; // Default 20% commission
  });

  const [rateCardServices, setRateCardServices] = useState<RateCardService[]>(() => {
    const saved = localStorage.getItem('gps_rate_card_services');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'srv_reinstall',
        nameBn: 'ডিভাইস স্থানান্তর ও রি-ইনস্টলেশন (গাড়ি পরিবর্তন)',
        nameEn: 'Device Re-installation & Vehicle Transfer',
        category: 'labor',
        basePrice: 350,
        warrantyDays: 30,
        descriptionBn: 'পুরাতন গাড়ি থেকে ট্র্যাকার নিরাপদে খুলে নতুন গাড়িতে ওয়্যারিং সহ ইনস্টলেশন।',
        isActive: true
      },
      {
        id: 'srv_relay_fix',
        nameBn: 'ইঞ্জিন কাটঅফ রিলে ওয়্যারিং ও সার্কিট ফিক্স',
        nameEn: 'Relay Wiring & Circuit Repair',
        category: 'repair',
        basePrice: 200,
        warrantyDays: 30,
        descriptionBn: 'বাইক বা গাড়ির ইগনিশন কাটঅফ ওয়্যারিং ফল্ট টেস্টিং ও রিলে সংযোগ মেরামত।',
        isActive: true
      },
      {
        id: 'srv_full_diag',
        nameBn: 'জেনারেল হেলথ চেক ও ভোল্টেজ ডায়াগনস্টিক',
        nameEn: 'General Health Check & Diagnostic',
        category: 'diagnostic',
        basePrice: 100,
        warrantyDays: 7,
        descriptionBn: 'মাদারবোর্ড, জিএসএম সিগন্যাল, স্যাটেলাইট রিসিভার ও অল্টারনেটর ভোল্টেজ টেস্ট।',
        isActive: true
      },
      {
        id: 'srv_home_visit',
        nameBn: 'অন-সাইট হোম সার্ভিস চার্জ (টেকনিশিয়ান ভিজিট ফি)',
        nameEn: 'On-Site Home Service Visit Fee',
        category: 'onsite',
        basePrice: 200,
        warrantyDays: 0,
        descriptionBn: 'কাস্টমারের বাসা বা অফিসে অভিজ্ঞ টেকনিশিয়ান প্রেরণের অতিরিক্ত ভিজিট ফি।',
        isActive: true
      },
      {
        id: 'srv_ic_repair',
        nameBn: 'মাদারবোর্ড ও আইসি সার্কিট রিপেয়ারিং',
        nameEn: 'Motherboard IC Circuit Repair',
        category: 'repair',
        basePrice: 500,
        warrantyDays: 60,
        descriptionBn: 'পাওয়ার আইসি রিস্টার্ট লুপ বা রিভার্স পোলারিটি ড্যামেজ সার্কিট মাইক্রো-সোল্ডারিং।',
        isActive: true
      },
      {
        id: 'srv_sim_service',
        nameBn: 'সিম রিপ্লেসমেন্ট ও নেটওয়ার্ক কনফিগারেশন',
        nameEn: 'SIM Replacement & Network Config',
        category: 'diagnostic',
        basePrice: 150,
        warrantyDays: 30,
        descriptionBn: 'নতুন টেলিমেটিক্স সিম ইনসার্ট ও Traccar APN / IP পোর্ট কনফিগারেশন।',
        isActive: true
      }
    ];
  });

  const [sparePartsCatalog, setSparePartsCatalog] = useState<SparePartItem[]>(() => {
    const saved = localStorage.getItem('gps_spare_parts_catalog');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'part_relay_40a',
        nameBn: '12V 40A হেভি ডিউটি রিলে ও ওয়্যারিং হারনেস',
        nameEn: '12V 40A Heavy Duty Relay with Harness',
        partCode: 'RELAY-40A',
        unitPrice: 200,
        warrantyDays: 90,
        stockCount: 95,
        descriptionBn: 'উচ্চ ক্ষমতা সম্পন্ন ফায়ারপ্রুফ অটোমোবাইল ইগনিশন কাটঅফ রিলে।',
        isActive: true
      },
      {
        id: 'part_gps_antenna',
        nameBn: 'হাই-গেইন সিরামিক জিপিএস প্যাচ অ্যান্টেনা',
        nameEn: 'High-Gain Ceramic GPS Patch Antenna',
        partCode: 'ANT-GPS-25',
        unitPrice: 250,
        warrantyDays: 180,
        stockCount: 45,
        descriptionBn: 'বিল্ডিং বা আন্ডারগ্রাউন্ড পার্কিংয়ে দ্রুত স্যাটেলাইট লক পাওয়ার সিরামিক অ্যান্টেনা।',
        isActive: true
      },
      {
        id: 'part_backup_battery',
        nameBn: '3.7V 450mAh ইন্টারনাল পলিমার ব্যাটারি',
        nameEn: '3.7V 450mAh Li-Po Backup Battery',
        partCode: 'BAT-LIPO-450',
        unitPrice: 350,
        warrantyDays: 180,
        stockCount: 60,
        descriptionBn: 'গাড়ির মেইন ব্যাটারি সংযোগ বিচ্ছিন্ন হলেও ট্র্যাকার ৮ ঘন্টা চালু রাখার জন্য।',
        isActive: true
      },
      {
        id: 'part_fuse_cable',
        nameBn: 'ইন-লাইন ওয়াটারপ্রুফ ফিউজ হোল্ডার ও ক্যাবল',
        nameEn: 'Waterproof Fuse Holder & Power Cable',
        partCode: 'CBL-FUSE-WP',
        unitPrice: 80,
        warrantyDays: 365,
        stockCount: 120,
        descriptionBn: 'শর্ট সার্কিট থেকে ট্র্যাকার ও বাইকের ব্যাটারি সুরক্ষার ফিউজ কেবল।',
        isActive: true
      },
      {
        id: 'part_m2m_sim',
        nameBn: 'স্পেশালাইজড টেলিমেটিক্স M2M সিম কার্ড',
        nameEn: 'Telematics M2M SIM Card',
        partCode: 'SIM-M2M-ROAM',
        unitPrice: 100,
        warrantyDays: 30,
        stockCount: 50,
        descriptionBn: 'সারাদেশে নিরবচ্ছিন্ন ডেটা সংযোগের প্রি-কনফিগারড ট্র্যাকিং সিম।',
        isActive: true
      }
    ];
  });

  const [paidJobCards, setPaidJobCards] = useState<PaidJobCard[]>(() => {
    const saved = localStorage.getItem('gps_paid_job_cards');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'JC-8821',
        customerName: 'Rakib Hasan',
        customerPhone: '01719-887766',
        vehicleName: 'Bajaj Pulsar 150',
        plateNumber: 'DM LA 19-8877',
        deviceId: 1,
        serviceCenterName: 'মিরপুর সার্ভিস সেন্টার (মিরপুর ১০, ঢাকা)',
        technicianName: 'সুজন মিয়া',
        technicianPhone: '01733-445566',
        selectedServices: [
          { serviceId: 'srv_relay_fix', nameBn: 'ইঞ্জিন কাটঅফ রিলে ওয়্যারিং ও সার্কিট ফিক্স', price: 200 }
        ],
        selectedSpareParts: [
          { partId: 'part_relay_40a', nameBn: '12V 40A হেভি ডিউটি রিলে ও ওয়্যারিং হারনেস', unitPrice: 200, quantity: 1 }
        ],
        totalAmount: 400,
        platformCommissionPercent: 20,
        platformCommissionAmount: 80,
        technicianPayoutAmount: 320,
        paymentMethod: 'cash_at_center',
        jobStatus: 'completed',
        createdAt: '24 Aug 2026',
        completedAt: '24 Aug 2026',
        warrantyExpiryDate: '23 Sep 2026',
        technicianNote: 'পুরাতন নষ্ট রিলে পরিবর্তন করে নতুন 40A রিলে সংযোগ দেওয়া হয়েছে।'
      }
    ];
  });

  const addRateCardService = (service: Omit<RateCardService, 'id'>) => {
    const newService: RateCardService = {
      ...service,
      id: `srv_${Date.now().toString().slice(-4)}`
    };
    setRateCardServices(prev => {
      const next = [...prev, newService];
      localStorage.setItem('gps_rate_card_services', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('service_reminder', `🛠️ নতুন সার্ভিস যোগ হয়েছে: ${newService.nameBn} (৳${newService.basePrice})`);
  };

  const updateRateCardService = (id: string, partial: Partial<RateCardService>) => {
    setRateCardServices(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...partial } : s);
      localStorage.setItem('gps_rate_card_services', JSON.stringify(next));
      return next;
    });
  };

  const deleteRateCardService = (id: string) => {
    setRateCardServices(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem('gps_rate_card_services', JSON.stringify(next));
      return next;
    });
  };

  const addSparePart = (part: Omit<SparePartItem, 'id'>) => {
    const newPart: SparePartItem = {
      ...part,
      id: `part_${Date.now().toString().slice(-4)}`
    };
    setSparePartsCatalog(prev => {
      const next = [...prev, newPart];
      localStorage.setItem('gps_spare_parts_catalog', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('service_reminder', `🔩 নতুন স্পেয়ার পার্ট যোগ হয়েছে: ${newPart.nameBn} (৳${newPart.unitPrice})`);
  };

  const updateSparePart = (id: string, partial: Partial<SparePartItem>) => {
    setSparePartsCatalog(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...partial } : p);
      localStorage.setItem('gps_spare_parts_catalog', JSON.stringify(next));
      return next;
    });
  };

  const deleteSparePart = (id: string) => {
    setSparePartsCatalog(prev => {
      const next = prev.filter(p => p.id !== id);
      localStorage.setItem('gps_spare_parts_catalog', JSON.stringify(next));
      return next;
    });
  };

  const createPaidJobCard = async (
    card: Omit<PaidJobCard, 'id' | 'createdAt' | 'jobStatus' | 'platformCommissionAmount' | 'technicianPayoutAmount' | 'totalAmount'>
  ): Promise<PaidJobCard> => {
    const total = card.selectedServices.reduce((sum, s) => sum + s.price, 0) +
                  card.selectedSpareParts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);
    
    const commissionAmount = Math.round(total * (card.platformCommissionPercent / 100));
    const techPayout = total - commissionAmount;

    const newJobCard: PaidJobCard = {
      ...card,
      id: `JC-${Math.floor(1000 + Math.random() * 9000)}`,
      totalAmount: total,
      platformCommissionAmount: commissionAmount,
      technicianPayoutAmount: techPayout,
      jobStatus: 'created',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setPaidJobCards(prev => {
      const next = [newJobCard, ...prev];
      localStorage.setItem('gps_paid_job_cards', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'service_reminder',
      `🎫 ডিজিটাল জব-কার্ড তৈরি হয়েছে (ID: ${newJobCard.id})! সার্ভিস পয়েন্ট: ${newJobCard.serviceCenterName}।`
    );

    return newJobCard;
  };

  const sendJobCardBill = (
    jobCardId: string, 
    services: SelectedServiceItem[], 
    parts: SelectedSparePartItem[], 
    techNote?: string
  ) => {
    const total = services.reduce((sum, s) => sum + s.price, 0) +
                  parts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);

    setPaidJobCards(prev => {
      const next = prev.map(jc => {
        if (jc.id === jobCardId) {
          const commissionAmount = Math.round(total * (jc.platformCommissionPercent / 100));
          return {
            ...jc,
            selectedServices: services,
            selectedSpareParts: parts,
            totalAmount: total,
            platformCommissionAmount: commissionAmount,
            technicianPayoutAmount: total - commissionAmount,
            technicianNote: techNote || jc.technicianNote,
            jobStatus: 'bill_sent' as const
          };
        }
        return jc;
      });
      localStorage.setItem('gps_paid_job_cards', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'service_reminder',
      `📲 ডিজিটাল বিল পাঠানো হয়েছে (Job Card: ${jobCardId})! মোট বিল: ৳${total}। কাস্টমার অ্যাপ থেকে ১-ট্যাপে কনফার্ম করবেন।`
    );
  };

  const confirmJobCardByCustomer = (jobCardId: string, paymentMethod: 'cash_at_center' | 'online_bkash') => {
    const expiryDate = new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

    setPaidJobCards(prev => {
      const next = prev.map(jc => {
        if (jc.id === jobCardId) {
          return {
            ...jc,
            paymentMethod,
            jobStatus: 'completed' as const,
            completedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            warrantyExpiryDate: expiryDate
          };
        }
        return jc;
      });
      localStorage.setItem('gps_paid_job_cards', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'geofenceEnter',
      `✅ সার্ভিস সম্পন্ন ও ৩০ দিনের গ্যারান্টি সক্রিয় (Job Card: ${jobCardId})! পেমেন্ট মেথড: ${paymentMethod === 'online_bkash' ? 'অনলাইন বিকাশ' : 'সার্ভিস সেন্টারে ক্যাশ'}।`
    );
  };

  const completeJobCard = (jobCardId: string) => {
    const expiryDate = new Date(Date.now() + 30 * 86400000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    setPaidJobCards(prev => {
      const next = prev.map(jc => {
        if (jc.id === jobCardId) {
          return {
            ...jc,
            jobStatus: 'completed' as const,
            completedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            warrantyExpiryDate: expiryDate
          };
        }
        return jc;
      });
      localStorage.setItem('gps_paid_job_cards', JSON.stringify(next));
      return next;
    });
  };

  // =========================================================================
  // 📦 1. SELLER / DEALER IMEI PAYWALL QUOTA ENGINE
  // =========================================================================
  const [sellerImeiQuotas, setSellerImeiQuotas] = useState<SellerImeiQuota[]>(() => {
    const saved = localStorage.getItem('gps_seller_imei_quotas');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        partnerId: 'PREG-901',
        sellerName: 'Tariqul Islam',
        shopName: 'Green Fleet GPS Solutions (মিরপুর ১০)',
        phone: '01811-998877',
        maxDueDeviceQuota: 3, // Max 3 devices on credit/consignment
        totalSold: 18,
        totalPendingDueBdt: 3000,
        isQuotaLocked: false,
        allocatedImeis: [
          {
            imei: '864720058291034',
            model: 'EasyTracker GT06 Heavy Duty',
            status: 'unlocked_paid',
            customerName: 'Mohammad Azhar',
            customerPhone: '01700-000000',
            assignedDate: '20 Aug 2026',
            unlockedDate: '24 Aug 2026',
            deviceCostBdt: 3000
          },
          {
            imei: '864720058291055',
            model: 'EasyTracker 4G Pro Bike Relay',
            status: 'dormant_locked',
            assignedDate: '22 Aug 2026',
            deviceCostBdt: 3000
          },
          {
            imei: '864720058291056',
            model: 'EasyTracker 4G Pro Bike Relay',
            status: 'dormant_locked',
            assignedDate: '22 Aug 2026',
            deviceCostBdt: 3000
          }
        ]
      },
      {
        partnerId: 'PREG-902',
        sellerName: 'Mizanur Rahman',
        shopName: 'Chittagong GPS Point (জিইসি মোড়)',
        phone: '01911-334455',
        maxDueDeviceQuota: 5,
        totalSold: 24,
        totalPendingDueBdt: 0,
        isQuotaLocked: false,
        allocatedImeis: [
          {
            imei: '864720058291071',
            model: 'EasyTracker GT06 Heavy Duty',
            status: 'dormant_locked',
            assignedDate: '23 Aug 2026',
            deviceCostBdt: 3000
          },
          {
            imei: '864720058291072',
            model: 'EasyTracker 4G Pro Bike Relay',
            status: 'dormant_locked',
            assignedDate: '23 Aug 2026',
            deviceCostBdt: 3000
          }
        ]
      }
    ];
  });

  const updateSellerQuota = (partnerId: string, maxQuota: number) => {
    setSellerImeiQuotas(prev => {
      const next = prev.map(s => {
        if (s.partnerId === partnerId) {
          const pendingCount = s.allocatedImeis.filter(d => d.status === 'dormant_locked' || d.status === 'pending_payment').length;
          return {
            ...s,
            maxDueDeviceQuota: maxQuota,
            isQuotaLocked: pendingCount >= maxQuota
          };
        }
        return s;
      });
      localStorage.setItem('gps_seller_imei_quotas', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('service_reminder', `⚙️ ডিলার IMEI কোটা আপডেট: সর্বোচ্চ ${maxQuota} টি ডিভাইস অনুমোদন।`);
  };

  const allocateImeiToSeller = (partnerId: string, imei: string, model: string, costBdt: number) => {
    setSellerImeiQuotas(prev => {
      const next = prev.map(s => {
        if (s.partnerId === partnerId) {
          const newAllocated = [
            ...s.allocatedImeis,
            {
              imei,
              model: model || 'EasyTracker 4G Telematics',
              status: 'dormant_locked' as const,
              assignedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
              deviceCostBdt: costBdt || 3000
            }
          ];
          const pendingCount = newAllocated.filter(d => d.status === 'dormant_locked' || d.status === 'pending_payment').length;
          return {
            ...s,
            allocatedImeis: newAllocated,
            isQuotaLocked: pendingCount >= s.maxDueDeviceQuota
          };
        }
        return s;
      });
      localStorage.setItem('gps_seller_imei_quotas', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('service_reminder', `📦 ডিলারের দোকানে নতুন ট্র্যাকার (IMEI: ${imei}) স্টক যুক্ত হয়েছে (Status: Dormant Locked)।`);
  };

  const unlockImeiPaywall = (partnerId: string, imei: string, customerName: string, customerPhone: string) => {
    setSellerImeiQuotas(prev => {
      const next = prev.map(s => {
        if (s.partnerId === partnerId) {
          const updatedImeis = s.allocatedImeis.map(d => {
            if (d.imei === imei) {
              return {
                ...d,
                status: 'unlocked_paid' as const,
                customerName,
                customerPhone,
                unlockedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
              };
            }
            return d;
          });
          const pendingCount = updatedImeis.filter(d => d.status === 'dormant_locked' || d.status === 'pending_payment').length;
          return {
            ...s,
            allocatedImeis: updatedImeis,
            totalSold: s.totalSold + 1,
            isQuotaLocked: pendingCount >= s.maxDueDeviceQuota
          };
        }
        return s;
      });
      localStorage.setItem('gps_seller_imei_quotas', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'geofenceEnter',
      `🔓 IMEI পে-ওয়াল আনলক সফল (IMEI: ${imei})! কাস্টমার: ${customerName}। ট্র্যাকার সার্ভারে লাইভ সক্রিয় হয়েছে।`
    );
  };

  // =========================================================================
  // 💳 2. THE NEGATIVE FLOATING LEDGER ENGINE FOR TECHNICIANS
  // =========================================================================
  const [technicianLedgers, setTechnicianLedgers] = useState<TechnicianLedgerConfig[]>(() => {
    const saved = localStorage.getItem('gps_technician_ledgers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        techId: 'tech_1',
        techName: 'আব্দুল করিম (সিনিয়র ফিল্ড ইঞ্জিনিয়ার)',
        techPhone: '01711-223344',
        area: 'ঢাকা সেন্ট্রাল ও গুলশান জোন',
        maxNegativeLimitBdt: 1500, // Max ৳1500 negative balance
        maxDueDaysLimit: 7, // Max 7 days
        currentFloatingBalance: 520, // +520 BDT (company owes tech)
        daysInNegative: 0,
        isAccountLocked: false,
        transactions: [
          {
            id: 'TX-901',
            type: 'install_earning',
            titleBn: 'নতুন জিপিএস ইনস্টলেশন ফি (Bajaj Avenger)',
            amount: 300,
            jobId: 'JOB-801',
            customerName: 'Mohammad Azhar',
            date: '24 Aug 2026',
            timestamp: Date.now() - 3600000
          },
          {
            id: 'TX-902',
            type: 'cash_collected_cut',
            titleBn: 'কাস্টমার ক্যাশ কালেকশন থেকে কোম্পানি কমিশন ২০%',
            amount: -80,
            jobId: 'JC-8821',
            customerName: 'Rakib Hasan',
            date: '24 Aug 2026',
            timestamp: Date.now() - 1800000
          },
          {
            id: 'TX-903',
            type: 'install_earning',
            titleBn: 'নতুন জিপিএস ইনস্টলেশন ফি (Yamaha FZ)',
            amount: 300,
            jobId: 'JOB-802',
            customerName: 'Tanvir Hossain',
            date: '24 Aug 2026',
            timestamp: Date.now() - 900000
          }
        ]
      },
      {
        techId: 'tech_2',
        techName: 'সুজন মিয়া',
        techPhone: '01733-445566',
        area: 'মিরপুর ও উত্তরা জোন',
        maxNegativeLimitBdt: 1500,
        maxDueDaysLimit: 7,
        currentFloatingBalance: -160, // -160 BDT (Tech owes company from 2 cash repairs)
        firstNegativeDate: '24 Aug 2026',
        daysInNegative: 1,
        isAccountLocked: false,
        transactions: [
          {
            id: 'TX-904',
            type: 'cash_collected_cut',
            titleBn: 'কাস্টমার ক্যাশ কালেকশন থেকে কোম্পানি কমিশন ২০%',
            amount: -80,
            jobId: 'JC-8821',
            customerName: 'Rakib Hasan',
            date: '24 Aug 2026',
            timestamp: Date.now() - 7200000
          },
          {
            id: 'TX-905',
            type: 'cash_collected_cut',
            titleBn: 'কাস্টমার ক্যাশ কালেকশন থেকে কোম্পানি কমিশন ২০%',
            amount: -80,
            jobId: 'JC-8822',
            customerName: 'Jahangir Alam',
            date: '24 Aug 2026',
            timestamp: Date.now() - 3600000
          }
        ]
      }
    ];
  });

  const updateTechnicianLimits = (techId: string, maxNegativeLimit: number, maxDueDays: number) => {
    setTechnicianLedgers(prev => {
      const next = prev.map(t => {
        if (t.techId === techId) {
          const isOverLimit = t.currentFloatingBalance < -maxNegativeLimit || t.daysInNegative > maxDueDays;
          return {
            ...t,
            maxNegativeLimitBdt: maxNegativeLimit,
            maxDueDaysLimit: maxDueDays,
            isAccountLocked: isOverLimit
          };
        }
        return t;
      });
      localStorage.setItem('gps_technician_ledgers', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('service_reminder', `⚙️ টেকনিশিয়ান লিমিট আপডেট: নেগেটিভ ব্যালেন্স ৳${maxNegativeLimit}, সময়সীমা ${maxDueDays} দিন।`);
  };

  const recordTechTransaction = (techId: string, transaction: Omit<TechnicianTransaction, 'id' | 'date' | 'timestamp'>) => {
    const newTx: TechnicianTransaction = {
      ...transaction,
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      timestamp: Date.now()
    };

    setTechnicianLedgers(prev => {
      const next = prev.map(t => {
        if (t.techId === techId) {
          const newBal = t.currentFloatingBalance + newTx.amount;
          const isNeg = newBal < 0;
          const isOverLimit = newBal < -t.maxNegativeLimitBdt || (isNeg && t.daysInNegative > t.maxDueDaysLimit);
          return {
            ...t,
            currentFloatingBalance: newBal,
            firstNegativeDate: isNeg ? (t.firstNegativeDate || new Date().toISOString()) : undefined,
            daysInNegative: isNeg ? (t.daysInNegative || 1) : 0,
            isAccountLocked: isOverLimit,
            transactions: [newTx, ...t.transactions]
          };
        }
        return t;
      });
      localStorage.setItem('gps_technician_ledgers', JSON.stringify(next));
      return next;
    });
  };

  const settleWeeklyTechPayout = (techId: string) => {
    setTechnicianLedgers(prev => {
      const next = prev.map(t => {
        if (t.techId === techId) {
          const currentBal = t.currentFloatingBalance;
          const settlementTx: TechnicianTransaction = {
            id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
            type: currentBal >= 0 ? 'weekly_payout' : 'due_payment',
            titleBn: currentBal >= 0 
              ? `সাপ্তাহিক বিকাশ পে-আউট ট্রান্সফার (৳${currentBal})` 
              : `বকেয়া ব্যালেন্স ক্লিয়ার ও সেটেলমেন্ট (৳${Math.abs(currentBal)})`,
            amount: -currentBal, // Resets to 0
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            timestamp: Date.now()
          };

          return {
            ...t,
            currentFloatingBalance: 0,
            daysInNegative: 0,
            firstNegativeDate: undefined,
            isAccountLocked: false,
            transactions: [settlementTx, ...t.transactions]
          };
        }
        return t;
      });
      localStorage.setItem('gps_technician_ledgers', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'subscription_reminder',
      `💰 সাপ্তাহিক সেটেলমেন্ট সম্পন্ন! টেকনিশিয়ান একাউন্ট ব্যালেন্স ৳০ এ রিসেট হয়েছে।`
    );
  };

  // =========================================================================
  // 🎁 3. CUSTOMER CASHLESS DIGITAL PAYMENT INCENTIVES (bKash / Nagad / BanglaQR)
  // =========================================================================
  const [digitalPaymentOffers, setDigitalPaymentOffers] = useState<DigitalPaymentOffer[]>(() => {
    const saved = localStorage.getItem('gps_digital_payment_offers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'offer_digital_50',
        titleBn: '⚡ বিকাশ / নগদ / বাংলা কিউআর (BanglaQR) অনলাইন পেমেন্ট অফার',
        badgeBn: '৳৫০ ডিসকাউন্ট + ১৫ দিন ফ্রি গ্যারান্টি',
        discountAmountBdt: 50,
        bonusWarrantyDays: 15,
        supportedGateways: ['bkash', 'nagad', 'bangla_qr', 'card'],
        descriptionBn: 'অনলাইন ও কিউআর দিয়ে পেমেন্ট করলে তাৎক্ষণিক ৳৫০ ছাড় এবং অতিরিক্ত ১৫ দিনের ডিজিটাল সার্ভিস কাভারেজ পাওয়া যাবে।',
        isActive: true
      }
    ];
  });

  const updatePaymentOffer = (id: string, offer: Partial<DigitalPaymentOffer>) => {
    setDigitalPaymentOffers(prev => {
      const next = prev.map(o => o.id === id ? { ...o, ...offer } : o);
      localStorage.setItem('gps_digital_payment_offers', JSON.stringify(next));
      return next;
    });
  };

  // =========================================================================
  // 💼 4. UNIVERSAL MULTI-ROLE DEVICE SALES & STAFF COMMISSION HUB
  // =========================================================================
  const [staffCommissions, setStaffCommissions] = useState<StaffCommissionEntry[]>(() => {
    const saved = localStorage.getItem('gps_staff_commissions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'COMM-101',
        soldByUserId: 'tech_1',
        soldByName: 'আব্দুল করিম (ফিল্ড টেকনিশিয়ান)',
        soldByRole: 'technician',
        soldByPhone: '01711-223344',
        customerName: 'মোঃ রাশেদুল ইসলাম',
        customerPhone: '01712-334455',
        vehicleName: 'Yamaha FZS V3',
        plateNumber: 'DHAKA METRO-LA 44-5566',
        imei: '864720058291088',
        simNumber: '01712334455',
        commissionBdt: 500,
        packagePlan: 'লাইভ জিপিএস প্রিমিয়াম (৳ ৩৫০/মাস)',
        status: 'approved',
        createdAt: '24 Aug 2026'
      },
      {
        id: 'COMM-102',
        soldByUserId: 'supp_1',
        soldByName: 'নুসরাত জাহান (কাস্টমার সাপোর্ট)',
        soldByRole: 'support',
        soldByPhone: '01700-000000',
        customerName: 'তানভীর আহমেদ',
        customerPhone: '01733-445566',
        vehicleName: 'Honda CB Shine 125',
        plateNumber: 'DHAKA METRO-HA 12-3456',
        imei: '864720058291034',
        simNumber: '01733445566',
        commissionBdt: 500,
        packagePlan: 'লাইভ জিপিএস প্রিমিয়াম (৳ ৩৫০/মাস)',
        status: 'approved',
        createdAt: '25 Aug 2026'
      }
    ];
  });

  // 📦 Enterprise Hardware & SIM Inventory ERP State
  const [deviceInventory, setDeviceInventory] = useState<DeviceInventoryItem[]>(() => {
    const saved = localStorage.getItem('gps_device_inventory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'DEV-INV-1001',
        barcode: 'BC-GT06-3865',
        imei: '354778343153865',
        serialNumber: 'SN-2026-GT01',
        manufacturer: 'Concox / Jimi IoT',
        model: 'GT06N GPS Tracker',
        protocol: 'gt06',
        firmwareVersion: 'v2.4.1',
        purchasePriceBdt: 1650,
        batchLot: 'LOT-2026-AUG-01',
        partnerId: 'PRT-8801',
        assignedVehiclePlate: 'DHAKA METRO-LA 44-5566',
        assignedCustomerName: 'mdaaziz',
        assignedCustomerPhone: '01711-223344',
        pairedSimNumber: '01711-223344',
        status: 'sold_active',
        addedDate: '20 Aug 2026',
        notes: 'অনবোর্ডেড কাস্টমার ভেহিক্যাল'
      },
      {
        id: 'DEV-INV-1002',
        barcode: 'BC-TEL-9201',
        imei: '864720058291088',
        serialNumber: 'SN-2026-FMB02',
        manufacturer: 'Teltonika',
        model: 'FMB920 High-Precision',
        protocol: 'teltonika',
        firmwareVersion: 'v03.28.02',
        purchasePriceBdt: 2400,
        batchLot: 'LOT-2026-AUG-02',
        partnerId: 'PRT-8801',
        status: 'in_stock',
        addedDate: '22 Aug 2026',
        notes: 'ইউরোপিয়ান স্ট্যান্ডার্ড টেলিমেটিক্স ট্র্যাকার'
      },
      {
        id: 'DEV-INV-1003',
        barcode: 'BC-JC400-88',
        imei: '869104047812390',
        serialNumber: 'SN-2026-JC400',
        manufacturer: 'Jimi IoT',
        model: 'JC400 Dual 4G AI Dashcam',
        protocol: 'gt06',
        firmwareVersion: 'v4.1.0',
        purchasePriceBdt: 7500,
        batchLot: 'LOT-2026-AUG-02',
        partnerId: 'PRT-8801',
        status: 'in_stock',
        addedDate: '23 Aug 2026',
        notes: 'লাইভ ভিডিও স্ট্রিমিং ড্যাশকাম'
      },
      {
        id: 'DEV-INV-1004',
        barcode: 'BC-MV72-10',
        imei: '860192039485712',
        serialNumber: 'SN-2026-MV72',
        manufacturer: 'Micodus',
        model: 'MV720 Hidden Relay Tracker',
        protocol: 'h02',
        firmwareVersion: 'v1.8.0',
        purchasePriceBdt: 1200,
        batchLot: 'LOT-2026-JUL-03',
        partnerId: 'PRT-8801',
        status: 'returned_reinstall',
        addedDate: '15 Aug 2026',
        notes: 'বাইক বিক্রি করায় খুলে আনা হয়েছে - টেস্ট ওকে, রি-ইনস্টল উপযোগী'
      },
      {
        id: 'DEV-INV-1005',
        barcode: 'BC-TK303-99',
        imei: '863920192847561',
        serialNumber: 'SN-2026-TK303',
        manufacturer: 'Coban',
        model: 'TK303G GPS',
        protocol: 'gt06',
        firmwareVersion: 'v1.2',
        purchasePriceBdt: 1400,
        batchLot: 'LOT-2026-JUN-01',
        partnerId: 'PRT-8801',
        status: 'damaged_scrap',
        addedDate: '10 Aug 2026',
        notes: 'শর্ট-সার্কিট ও ওয়াটার ড্যামেজ / স্ক্র্যাপ'
      }
    ];
  });

  const [simInventory, setSimInventory] = useState<SimInventoryItem[]>(() => {
    const saved = localStorage.getItem('gps_sim_inventory');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'SIM-INV-2001',
        simBarcode: '8988018001234567890',
        msisdn: '01811-223344',
        operator: 'robi',
        simType: 'm2m_special_voice',
        puk1: '44556677',
        puk2: '11223344',
        pin1: '1234',
        apn: 'm2m.robi.com.bd',
        partnerId: 'PRT-8801',
        pairedImei: '354778343153865',
        assignedVehiclePlate: 'DHAKA METRO-LA 44-5566',
        assignedCustomerName: 'mdaaziz',
        status: 'paired_with_device',
        addedDate: '20 Aug 2026',
        notes: 'ভয়েস ও কল সক্রিয় টেলিমেটিক্স সিম'
      },
      {
        id: 'SIM-INV-2002',
        simBarcode: '8988017009876543210',
        msisdn: '01700-112233',
        operator: 'grameenphone',
        simType: 'm2m_general',
        puk1: '11223344',
        apn: 'gpinternet',
        partnerId: 'PRT-8801',
        status: 'in_stock_ready',
        addedDate: '22 Aug 2026',
        notes: 'জিপি আইওটি ডেটা-অনলি সিম'
      },
      {
        id: 'SIM-INV-2003',
        simBarcode: '8988019004561237890',
        msisdn: '01900-556677',
        operator: 'banglalink',
        simType: 'm2m_general',
        puk1: '99887766',
        apn: 'blweb',
        partnerId: 'PRT-8801',
        status: 'in_stock_ready',
        addedDate: '23 Aug 2026',
        notes: 'বাংলালিংক টেলিমেটিক্স সিম'
      },
      {
        id: 'SIM-INV-2004',
        simBarcode: '8988015007788994455',
        msisdn: '01511-998877',
        operator: 'teletalk',
        simType: 'byos_customer_sim',
        puk1: '33445566',
        apn: 'teletalk',
        partnerId: 'PRT-8801',
        status: 'in_stock_ready',
        addedDate: '24 Aug 2026',
        notes: 'গ্রাহকের নিজস্ব সিম (BYOS)'
      },
      {
        id: 'SIM-INV-2005',
        simBarcode: '8988018006655443322',
        msisdn: '01800-998811',
        operator: 'robi',
        simType: 'm2m_general',
        puk1: '00112233',
        apn: 'm2m.robi.com.bd',
        partnerId: 'PRT-8801',
        status: 'damaged_lost',
        addedDate: '10 Aug 2026',
        notes: 'সিম কার্ড ক্ষতিগ্রস্ত / নষ্ট'
      }
    ];
  });

  // Device Inventory CRUD & Lifecycle
  const addDeviceToInventory = (device: Omit<DeviceInventoryItem, 'id' | 'addedDate'>) => {
    const newItem: DeviceInventoryItem = {
      ...device,
      id: `DEV-INV-${Date.now().toString().slice(-4)}`,
      addedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setDeviceInventory(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem('gps_device_inventory', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('geofenceEnter', `📦 নতুন ডিভাইস (IMEI: ${device.imei}) ইনভেন্টরি স্টকে যুক্ত হয়েছে!`);
  };

  const updateDeviceInventoryItem = (id: string, updates: Partial<DeviceInventoryItem>) => {
    setDeviceInventory(prev => {
      const next = prev.map(d => d.id === id ? { ...d, ...updates, updatedDate: new Date().toLocaleDateString('en-GB') } : d);
      localStorage.setItem('gps_device_inventory', JSON.stringify(next));
      return next;
    });
  };

  const deleteDeviceInventoryItem = (id: string) => {
    setDeviceInventory(prev => {
      const next = prev.filter(d => d.id !== id);
      localStorage.setItem('gps_device_inventory', JSON.stringify(next));
      return next;
    });
  };

  const unbindDeviceFromVehicle = (id: string) => {
    setDeviceInventory(prev => {
      const next = prev.map(d => d.id === id ? {
        ...d,
        status: 'returned_reinstall' as const,
        assignedVehiclePlate: undefined,
        assignedCustomerName: undefined,
        assignedCustomerPhone: undefined,
        pairedSimNumber: undefined,
        updatedDate: new Date().toLocaleDateString('en-GB')
      } : d);
      localStorage.setItem('gps_device_inventory', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('geofenceEnter', `🔄 ডিভাইস আনবাইন্ড সফল হয়েছে! স্ট্যাটাস: 'রি-ইনস্টল উপযোগী স্টকে মজুদ'।`);
  };

  const bulkImportDevices = (devices: Omit<DeviceInventoryItem, 'id' | 'addedDate'>[]) => {
    const newItems: DeviceInventoryItem[] = devices.map((d, i) => ({
      ...d,
      id: `DEV-INV-${Date.now().toString().slice(-4)}-${i}`,
      addedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }));
    setDeviceInventory(prev => {
      const next = [...newItems, ...prev];
      localStorage.setItem('gps_device_inventory', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('geofenceEnter', `📦 বাল্ক বারকোড স্ক্যানে ${devices.length} টি ডিভাইস সফলভাবে ইনওয়ার্ড হয়েছে!`);
  };

  // SIM Inventory CRUD & Lifecycle
  const addSimToInventory = (sim: Omit<SimInventoryItem, 'id' | 'addedDate'>) => {
    const newItem: SimInventoryItem = {
      ...sim,
      id: `SIM-INV-${Date.now().toString().slice(-4)}`,
      addedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setSimInventory(prev => {
      const next = [newItem, ...prev];
      localStorage.setItem('gps_sim_inventory', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('geofenceEnter', `📡 নতুন সিম (${sim.msisdn}) ইনভেন্টরি স্টকে যুক্ত হয়েছে!`);
  };

  const updateSimInventoryItem = (id: string, updates: Partial<SimInventoryItem>) => {
    setSimInventory(prev => {
      const next = prev.map(s => s.id === id ? { ...s, ...updates } : s);
      localStorage.setItem('gps_sim_inventory', JSON.stringify(next));
      return next;
    });
  };

  const deleteSimInventoryItem = (id: string) => {
    setSimInventory(prev => {
      const next = prev.filter(s => s.id !== id);
      localStorage.setItem('gps_sim_inventory', JSON.stringify(next));
      return next;
    });
  };

  const unbindSimFromDevice = (id: string) => {
    setSimInventory(prev => {
      const next = prev.map(s => s.id === id ? {
        ...s,
        status: 'unsubscribed_unpaired' as const,
        pairedImei: undefined,
        assignedVehiclePlate: undefined,
        assignedCustomerName: undefined
      } : s);
      localStorage.setItem('gps_sim_inventory', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('geofenceEnter', `🔄 সিম কার্ড আনবাইন্ড সফল হয়েছে! স্ট্যাটাস: 'স্টকে ফেরত'।`);
  };

  const bulkImportSims = (sims: Omit<SimInventoryItem, 'id' | 'addedDate'>[]) => {
    const newItems: SimInventoryItem[] = sims.map((s, i) => ({
      ...s,
      id: `SIM-INV-${Date.now().toString().slice(-4)}-${i}`,
      addedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    }));
    setSimInventory(prev => {
      const next = [...newItems, ...prev];
      localStorage.setItem('gps_sim_inventory', JSON.stringify(next));
      return next;
    });
    triggerManualAlert('geofenceEnter', `📡 বাল্ক স্ক্যানে ${sims.length} টি সিম কার্ড ইনভেন্টরিতে যুক্ত হয়েছে!`);
  };

  // 🔄 Reverse Logistics & Return / RMA Management State
  const [returnLogs, setReturnLogs] = useState<ReturnLogEntry[]>(() => {
    const saved = localStorage.getItem('gps_saas_return_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'RET-LOG-9001',
        challanNumber: 'CH-TECH-2026-081',
        returnDate: '24 Aug 2026',
        channel: 'technician',
        itemType: 'bundle',
        imei: '860192039485712',
        deviceModel: 'Micodus MV720 Relay',
        simMsisdn: '01811-223344',
        simIccid: '8988018001234567890',
        ownership: 'partner',
        partnerId: 'PRT-8801',
        partnerName: 'ঢাকা সেন্ট্রাল ট্র্যাকিং হাব',
        technicianName: 'ইঞ্জিঃ মোঃ জাহিদুল ইসলাম',
        previousVehiclePlate: 'DHAKA METRO-HA 19-8821',
        previousCustomerName: 'তানভীর আহমেদ',
        previousCustomerPhone: '01712-334455',
        currentCustodian: 'Tech: জাহিদুল ইসলাম (Field Bag)',
        condition: 'working_good',
        qcNotes: 'বাইক সেল করায় আনবাইন্ড করা হয়েছে। টেস্টে জিপিএস ও রিলে ১০০% ওকে।',
        resolution: 'restocked_reusable',
        financialStatus: 'none',
        resolvedAt: '24 Aug 2026'
      },
      {
        id: 'RET-LOG-9002',
        challanNumber: 'CH-QC-2026-082',
        returnDate: '23 Aug 2026',
        channel: 'support_qc',
        itemType: 'device',
        imei: '863920192847561',
        deviceModel: 'Coban TK303G GPS',
        ownership: 'easytracker_central',
        partnerId: 'PRT-8801',
        partnerName: 'ঢাকা সেন্ট্রাল ট্র্যাকিং হাব',
        currentCustodian: 'EasyTracker QC Lab (Testing Room)',
        condition: 'hardware_damaged',
        qcNotes: 'পাওয়ার সেকশন বার্ন হয়েছে। ম্যানুফ্যাকচারার ওয়ারেন্টি রিপ্লেসমেন্টে পাঠানো প্রয়োজন।',
        resolution: 'rma_supplier',
        financialStatus: 'pending_approval'
      },
      {
        id: 'RET-LOG-9003',
        challanNumber: 'CH-SHOP-2026-083',
        returnDate: '22 Aug 2026',
        channel: 'partner_shop',
        itemType: 'bundle',
        imei: '354778343153899',
        deviceModel: 'Concox GT06N',
        simMsisdn: '01700-112233',
        ownership: 'partner',
        partnerId: 'PRT-8801',
        partnerName: 'ঢাকা সেন্ট্রাল ট্র্যাকিং হাব',
        previousVehiclePlate: 'DHAKA METRO-GA 11-2233',
        previousCustomerName: 'কবির হোসেন',
        previousCustomerPhone: '01819-887766',
        currentCustodian: 'Partner Outlet (Uttara Branch)',
        condition: 'working_good',
        qcNotes: 'কাস্টমার বাইক চেঞ্জ করেছে। পার্টনারের রি-ইনস্টল স্টকে সংরক্ষিত।',
        resolution: 'refunded_credit',
        refundAmountBdt: 1200,
        financialStatus: 'credited',
        resolvedAt: '22 Aug 2026'
      },
      {
        id: 'RET-LOG-9004',
        challanNumber: 'CH-HQ-2026-084',
        returnDate: '21 Aug 2026',
        channel: 'central_office',
        itemType: 'device',
        imei: '864720058291044',
        deviceModel: 'Teltonika FMB920',
        ownership: 'easytracker_central',
        currentCustodian: 'EasyTracker Central Warehouse (HQ Shelf A-4)',
        condition: 'working_good',
        qcNotes: 'সেন্ট্রাল হেড অফিসে রিসিভ ও বারকোড ভেরিফিকেশন সম্পন্ন।',
        resolution: 'restocked_reusable',
        financialStatus: 'none',
        resolvedAt: '21 Aug 2026'
      }
    ];
  });

  const initiateReturnLog = (entry: Omit<ReturnLogEntry, 'id' | 'challanNumber' | 'returnDate'>) => {
    const channelPrefix = 
      entry.channel === 'technician' ? 'TECH' :
      entry.channel === 'support_qc' ? 'QC' :
      entry.channel === 'partner_shop' ? 'SHOP' : 'HQ';
    
    const newEntry: ReturnLogEntry = {
      ...entry,
      id: `RET-LOG-${Date.now().toString().slice(-4)}`,
      challanNumber: `CH-${channelPrefix}-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      returnDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setReturnLogs(prev => {
      const next = [newEntry, ...prev];
      localStorage.setItem('gps_saas_return_logs', JSON.stringify(next));
      return next;
    });

    // Also update Device / SIM status if applicable
    if (entry.imei) {
      setDeviceInventory(prev => prev.map(d => {
        if (d.imei === entry.imei) {
          const newStatus = entry.resolution === 'restocked_reusable' ? 'returned_reinstall' :
                           entry.resolution === 'rma_supplier' ? 'rma_repair' :
                           entry.resolution === 'scrapped' ? 'damaged_scrap' : 'returned_reinstall';
          return { ...d, status: newStatus, assignedVehiclePlate: undefined, assignedCustomerName: undefined };
        }
        return d;
      }));
    }

    if (entry.simMsisdn) {
      setSimInventory(prev => prev.map(s => {
        if (s.msisdn === entry.simMsisdn) {
          return { ...s, status: 'unsubscribed_unpaired', pairedImei: undefined, assignedVehiclePlate: undefined };
        }
        return s;
      }));
    }

    triggerManualAlert(
      'geofenceEnter',
      `🔄 নতুন রিটার্ন ও কাস্টডি রেকর্ড তৈরি হয়েছে! চালান নং: ${newEntry.challanNumber}`
    );

    return newEntry;
  };

  const updateReturnLog = (id: string, updates: Partial<ReturnLogEntry>) => {
    setReturnLogs(prev => {
      const next = prev.map(r => r.id === id ? { ...r, ...updates } : r);
      localStorage.setItem('gps_saas_return_logs', JSON.stringify(next));
      return next;
    });
  };

  const resolveReturnLog = (id: string, resolution: ReturnResolution, refundAmount?: number, qcNotes?: string) => {
    setReturnLogs(prev => {
      const next = prev.map(r => {
        if (r.id === id) {
          return {
            ...r,
            resolution,
            refundAmountBdt: refundAmount !== undefined ? refundAmount : r.refundAmountBdt,
            qcNotes: qcNotes || r.qcNotes,
            financialStatus: refundAmount ? 'credited' : r.financialStatus || 'none',
            resolvedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          };
        }
        return r;
      });
      localStorage.setItem('gps_saas_return_logs', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'subscription_reminder',
      `✅ রিটার্ন ডিসপ্যাচ সমাধান সম্পন্ন হয়েছে (${resolution})!`
    );
  };

  // Update Partner Tier Pricing & Auto-Settlement Channels
  const updatePartnerTierPricing = (
    partnerId: string, 
    allInclusivePricing: PartnerRegistrationEntry['allInclusivePricing'], 
    serverOnlyPricing: PartnerRegistrationEntry['serverOnlyPricing'],
    payoutMethod?: 'bkash' | 'nagad' | 'bank',
    payoutNumber?: string
  ) => {
    updatePartnerDetails(partnerId, {
      allInclusivePricing,
      serverOnlyPricing,
      customRetailMonthlyPrice: allInclusivePricing?.month1 || 350,
      customRetailYearlyPrice: allInclusivePricing?.month12 || 3500,
      settlementPayoutMethod: payoutMethod,
      settlementPayoutNumber: payoutNumber
    });
    triggerManualAlert('geofenceEnter', `💾 সাবস্ক্রিপশন প্যাকেজ রেট ও সেন্ট্রাল অটো-সেটেলমেন্ট সফলভাবে সেভ হয়েছে!`);
  };

  const registerUniversalSale = async (sale: {
    customerName: string;
    customerPhone: string;
    vehicleName: string;
    plateNumber: string;
    imei: string;
    simNumber: string;
    commissionBdt?: number;
    packagePlan?: string;
  }): Promise<StaffCommissionEntry> => {
    const commissionAmount = sale.commissionBdt || 500;
    const newComm: StaffCommissionEntry = {
      id: `COMM-${Date.now().toString().slice(-4)}`,
      soldByUserId: user?.id ? String(user.id) : (user?.email || 'user'),
      soldByName: user?.name || 'Authorized Staff Agent',
      soldByRole: currentRole,
      soldByPhone: user?.email,
      partnerId: user?.partnerId,
      customerName: sale.customerName,
      customerPhone: sale.customerPhone,
      vehicleName: sale.vehicleName,
      plateNumber: sale.plateNumber,
      imei: sale.imei,
      simNumber: sale.simNumber,
      commissionBdt: commissionAmount,
      packagePlan: sale.packagePlan || 'লাইভ জিপিএস প্রিমিয়াম (৳ ৩৫০/মাস)',
      status: 'approved',
      createdAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    setStaffCommissions(prev => {
      const next = [newComm, ...prev];
      localStorage.setItem('gps_staff_commissions', JSON.stringify(next));
      return next;
    });

    // Auto-sync with Device Inventory: mark sold_active and link plate/customer
    setDeviceInventory(prev => {
      const matched = prev.some(d => d.imei === sale.imei);
      let next: DeviceInventoryItem[];
      if (matched) {
        next = prev.map(d => d.imei === sale.imei ? {
          ...d,
          status: 'sold_active' as const,
          assignedVehiclePlate: sale.plateNumber,
          assignedCustomerName: sale.customerName,
          assignedCustomerPhone: sale.customerPhone,
          pairedSimNumber: sale.simNumber,
          updatedDate: new Date().toLocaleDateString('en-GB')
        } : d);
      } else {
        const autoAdded: DeviceInventoryItem = {
          id: `DEV-INV-${Date.now().toString().slice(-4)}`,
          barcode: `BC-${sale.imei.slice(-6)}`,
          imei: sale.imei,
          serialNumber: `SN-${Date.now().toString().slice(-6)}`,
          manufacturer: 'EasyTracker OEM',
          model: 'EasyTracker GT06 Pro',
          protocol: 'gt06',
          status: 'sold_active',
          assignedVehiclePlate: sale.plateNumber,
          assignedCustomerName: sale.customerName,
          assignedCustomerPhone: sale.customerPhone,
          pairedSimNumber: sale.simNumber,
          addedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        next = [autoAdded, ...prev];
      }
      localStorage.setItem('gps_device_inventory', JSON.stringify(next));
      return next;
    });

    // Auto-sync with SIM Inventory: mark paired_with_device
    setSimInventory(prev => {
      const matched = prev.some(s => s.msisdn === sale.simNumber);
      let next: SimInventoryItem[];
      if (matched) {
        next = prev.map(s => s.msisdn === sale.simNumber ? {
          ...s,
          status: 'paired_with_device' as const,
          pairedImei: sale.imei,
          assignedVehiclePlate: sale.plateNumber,
          assignedCustomerName: sale.customerName
        } : s);
      } else {
        const autoAddedSim: SimInventoryItem = {
          id: `SIM-INV-${Date.now().toString().slice(-4)}`,
          simBarcode: `898801${sale.simNumber.replace(/\D/g, '')}`,
          msisdn: sale.simNumber,
          operator: 'robi',
          simType: 'm2m_general',
          puk1: '12345678',
          apn: 'm2m.robi.com.bd',
          status: 'paired_with_device',
          pairedImei: sale.imei,
          assignedVehiclePlate: sale.plateNumber,
          assignedCustomerName: sale.customerName,
          addedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        };
        next = [autoAddedSim, ...prev];
      }
      localStorage.setItem('gps_sim_inventory', JSON.stringify(next));
      return next;
    });

    // Also register device in live devices list if not already present
    const newDevId = Math.floor(1000 + Math.random() * 9000);
    const newDeviceObj: Device = {
      id: newDevId,
      name: `${sale.vehicleName} (${sale.plateNumber})`,
      uniqueId: sale.imei,
      status: 'online',
      disabled: false,
      lastUpdate: new Date().toISOString(),
      positionId: newDevId,
      groupId: 0,
      phone: sale.simNumber,
      model: 'EasyTracker GT06 Pro',
      contact: sale.customerPhone,
      category: 'motorcycle',
      attributes: {
        plateNumber: sale.plateNumber,
        driverName: sale.customerName,
        driverPhone: sale.customerPhone,
        partnerId: user?.partnerId,
        soldByUserId: String(user?.id || user?.email),
        soldByName: user?.name,
        soldByRole: currentRole,
        commissionBdt: commissionAmount,
        commissionStatus: 'approved'
      }
    };

    setDevices(prev => {
      const exists = prev.some(d => d.uniqueId === sale.imei);
      if (exists) return prev;
      const updated = [newDeviceObj, ...prev];
      localStorage.setItem('gps_devices', JSON.stringify(updated));
      return updated;
    });

    triggerManualAlert(
      'geofenceEnter',
      `🎉 নতুন ডিভাইস সফলভাবে বিক্রি ও অনবোর্ড হয়েছে! বিক্রেতা: ${user?.name} (${currentRole})। ওয়ালেটে ৳${commissionAmount} কমিশন যোগ হয়েছে।`
    );

    return newComm;
  };

  const payoutStaffCommission = (commissionId: string) => {
    setStaffCommissions(prev => {
      const next = prev.map(c => c.id === commissionId ? {
        ...c,
        status: 'paid' as const,
        paidAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
      } : c);
      localStorage.setItem('gps_staff_commissions', JSON.stringify(next));
      return next;
    });

    triggerManualAlert(
      'subscription_reminder',
      `💰 কমিশন পে-আউট বিকাশ/নগদে সফলভাবে ট্রান্সফার সম্পন্ন হয়েছে!`
    );
  };

  const getMyCommissionSummary = (userId?: string) => {
    const targetId = userId || (user?.id ? String(user.id) : user?.email) || '';
    const myComms = staffCommissions.filter(c => 
      !targetId || 
      c.soldByUserId === targetId || 
      c.soldByPhone === user?.email ||
      c.soldByName === user?.name ||
      c.soldByRole === currentRole
    );
    const totalEarned = myComms.reduce((sum, c) => sum + c.commissionBdt, 0);
    const paidOut = myComms.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commissionBdt, 0);
    const pendingPayout = totalEarned - paidOut;

    return {
      totalSold: myComms.length,
      totalEarned,
      pendingPayout,
      paidOut,
      myCommissions: myComms
    };
  };

  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    const saved = localStorage.getItem('gps_last_read_alerts_ts');
    return saved ? Number(saved) : Date.now() - 86400000;
  });

  const unreadAlerts = alerts.filter(a => new Date(a.serverTime).getTime() > lastReadTimestamp).length;
  const unreadEngine = engineLogs.filter(e => new Date(e.timestamp).getTime() > lastReadTimestamp).length;
  const unreadSensors = sensorLogs.filter(s => new Date(s.timestamp).getTime() > lastReadTimestamp).length;
  const unreadAlertCount = unreadAlerts + unreadEngine + unreadSensors;

  const markAlertsAsRead = () => {
    const now = Date.now();
    setLastReadTimestamp(now);
    localStorage.setItem('gps_last_read_alerts_ts', String(now));
  };

  const requestUserLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        (err) => {
          console.warn('Phone GPS error:', err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const syncServerData = async () => {
    try {
      const realDevices = await traccarApi.getDevices();
      if (realDevices && realDevices.length > 0) {
        const savedCustom = localStorage.getItem('gps_saved_device_profile');
        const customParsed = savedCustom ? JSON.parse(savedCustom) : null;

        const merged = realDevices.map(d => ({
          ...d,
          category: customParsed?.category || d.category || 'motorcycle',
          attributes: {
            ...d.attributes,
            ...(customParsed?.attributes || {})
          }
        }));

        setDevices(merged);
        
        // Priority selection: keep selected if valid, or select the first real device on server
        setSelectedDeviceId(prev => {
          const stillExists = merged.some(d => d.id === prev);
          return stillExists ? prev : merged[0].id;
        });

        const realPositions = await traccarApi.getPositions();
        if (realPositions && realPositions.length > 0) {
          setPositions(prev => mergePositionsSafely(realPositions, prev));

          // Center initial geofence on vehicle's actual real position
          const firstValidPos = realPositions.find(p => p.latitude && p.longitude && p.latitude !== 0);
          if (firstValidPos) {
            setGeofences(prev => {
              if (prev.length > 0) {
                const updated = prev.map((g, idx) => idx === 0 ? { ...g, latitude: firstValidPos.latitude, longitude: firstValidPos.longitude } : g);
                localStorage.setItem('gps_saved_geofences', JSON.stringify(updated));
                return updated;
              }
              return prev;
            });
          }
        }

        // Fetch database latest position for each real device
        merged.forEach(d => {
          traccarApi.getDeviceLatestPosition(d.id, d.positionId).then(pos => {
            if (pos && typeof pos.latitude === 'number' && typeof pos.longitude === 'number' && pos.latitude !== 0) {
              setPositions(prev => mergePositionsSafely([pos], prev));
            }
          });
        });
      }
    } catch (e) {
      console.warn('Sync server data error:', e);
    }
  };

  // Helper to safely preserve Last Known Valid GPS Position when device wakes with 0 satellites
  const mergePositionsSafely = (
    incoming: Position[], 
    previous: Record<number, Position>
  ): Record<number, Position> => {
    let storedLastKnown: Record<number, Position> = {};
    try {
      const storedLastKnownRaw = localStorage.getItem('gps_last_known_positions');
      if (storedLastKnownRaw) {
        const parsed = JSON.parse(storedLastKnownRaw);
        if (parsed && typeof parsed === 'object') {
          // Clean legacy mock coordinates
          for (const [k, v] of Object.entries(parsed)) {
            const pos = v as Position;
            if (pos && typeof pos.latitude === 'number' && typeof pos.longitude === 'number' && pos.latitude !== 0) {
              if (Math.abs(pos.latitude - 23.8103) > 0.0001 || Math.abs(pos.longitude - 90.4125) > 0.0001) {
                storedLastKnown[Number(k)] = pos;
              }
            }
          }
        }
      }
    } catch (e) {}

    const next = { ...previous };

    incoming.forEach(p => {
      const hasValidCoords = typeof p.latitude === 'number' && 
                             typeof p.longitude === 'number' && 
                             p.latitude !== 0 && 
                             p.longitude !== 0 &&
                             !isNaN(p.latitude) && 
                             !isNaN(p.longitude) &&
                             (Math.abs(p.latitude - 23.8103) > 0.0001 || Math.abs(p.longitude - 90.4125) > 0.0001);

      if (hasValidCoords) {
        storedLastKnown[p.deviceId] = p;
        next[p.deviceId] = {
          ...p,
          attributes: {
            ...p.attributes,
            isLastKnown: false
          }
        };
      } else {
        const fallback = (previous[p.deviceId] && (Math.abs(previous[p.deviceId].latitude - 23.8103) > 0.0001 || Math.abs(previous[p.deviceId].longitude - 90.4125) > 0.0001)) 
          ? previous[p.deviceId] 
          : storedLastKnown[p.deviceId];

        if (fallback && fallback.latitude && fallback.longitude && fallback.latitude !== 0) {
          next[p.deviceId] = {
            ...p,
            latitude: fallback.latitude,
            longitude: fallback.longitude,
            altitude: fallback.altitude || 0,
            course: fallback.course || 0,
            address: fallback.address || p.address,
            attributes: {
              ...p.attributes,
              isLastKnown: true
            }
          };
        } else {
          next[p.deviceId] = p;
        }
      }
    });

    try {
      localStorage.setItem('gps_last_known_positions', JSON.stringify(storedLastKnown));
    } catch (e) {}

    return next;
  };

  // Immediate fetch when selected device changes
  useEffect(() => {
    if (!selectedDeviceId) return;
    const dev = devices.find(d => d.id === selectedDeviceId);
    traccarApi.getDeviceLatestPosition(selectedDeviceId, dev?.positionId).then(pos => {
      if (pos && typeof pos.latitude === 'number' && typeof pos.longitude === 'number' && pos.latitude !== 0) {
        setPositions(prev => mergePositionsSafely([pos], prev));
      }
    });
  }, [selectedDeviceId]);

  useEffect(() => {
    requestUserLocation();
    traccarApi.setServer(serverConfig.url, serverConfig.port);
    traccarSocket.connect(serverConfig.url);

    syncServerData();

    let watchId: number | null = null;
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }

    const interval = setInterval(() => {
      traccarApi.getPositions().then(realPositions => {
        if (realPositions && realPositions.length > 0) {
          setPositions(prev => mergePositionsSafely(realPositions, prev));
        }
      });
      if (selectedDeviceId) {
        const dev = devices.find(d => d.id === selectedDeviceId);
        traccarApi.getDeviceLatestPosition(selectedDeviceId, dev?.positionId).then(pos => {
          if (pos && typeof pos.latitude === 'number' && typeof pos.longitude === 'number' && pos.latitude !== 0) {
            setPositions(prev => mergePositionsSafely([pos], prev));
          }
        });
      }
    }, 4000);

    const unsubscribe = traccarSocket.subscribe((data) => {
      if (data.positions && data.positions.length > 0) {
        setPositions((prev) => mergePositionsSafely(data.positions!, prev));
      }
      if (data.devices && data.devices.length > 0) {
        setDevices(data.devices);
      }
    });

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
      unsubscribe();
      traccarSocket.disconnect();
    };
  }, [serverConfig]);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const selectedPosition = selectedDevice ? positions[selectedDevice.id] : Object.values(positions)[0];

  // Bug Fix #1: Strict Tenant Data Isolation
  // tenantDevices filters devices to only show those belonging to the logged-in partner.
  // Super admins and regular staff (no partnerId) see all devices.
  const tenantDevices = user?.partnerId
    ? devices.filter(d =>
        (d.attributes as any)?.partnerId === user.partnerId ||
        (d.attributes as any)?.partner_id === user.partnerId
      )
    : devices;

  const effectiveUserLat = userLocation?.latitude || selectedPosition?.latitude;
  const effectiveUserLon = userLocation?.longitude || selectedPosition?.longitude;
  const effectiveVehLat = selectedPosition?.latitude;
  const effectiveVehLon = selectedPosition?.longitude;

  const distanceInfo = (effectiveUserLat && effectiveUserLon && effectiveVehLat && effectiveVehLon)
    ? calculateDistance(effectiveUserLat, effectiveUserLon, effectiveVehLat, effectiveVehLon, language)
    : { km: 0, formatted: language === 'bn' ? '০ মি (বাইকের কাছেই আছেন)' : '0 m (At vehicle)', isNearby: true };

  const bearingInfo = (effectiveUserLat && effectiveUserLon && effectiveVehLat && effectiveVehLon)
    ? calculateBearing(effectiveUserLat, effectiveUserLon, effectiveVehLat, effectiveVehLon)
    : { angle: 0, labelBn: 'উত্তর (N ↑)', labelEn: 'North (N ↑)' };

  // Calculate status for ALL active geofences
  const activeGeofences = geofences.filter(g => (g.attributes as any)?.enabled !== false);
  const insideZones: string[] = [];

  if (effectiveVehLat && effectiveVehLon) {
    activeGeofences.forEach(geo => {
      const dist = calculateDistance(geo.latitude, geo.longitude, effectiveVehLat, effectiveVehLon, language);
      if ((dist.km * 1000) <= geo.radius) {
        insideZones.push(geo.name);
      }
    });
  }

  const geofenceStatus = {
    isInside: insideZones.length > 0,
    activeZoneNames: insideZones,
    activeCount: activeGeofences.length
  };

  const openGoogleMapsNavigation = () => {
    if (!effectiveVehLat || !effectiveVehLon) return;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${effectiveVehLat},${effectiveVehLon}`;
    if (userLocation) {
      url += `&origin=${userLocation.latitude},${userLocation.longitude}`;
    }
    window.open(url, '_blank');
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || key;
  };

  const login = async (emailOrUser: string, pass: string) => {
    const res = await traccarApi.login(emailOrUser, pass);
    if (res.success && res.user) {
      const lower = emailOrUser.toLowerCase();
      let determinedRole: SaasRole = 'customer';
      let defaultTab: TabType = 'map';

      let approvedRoles: SaasRole[] = ['customer'];

      const matchingPartner = approvedPartners.find(p => 
        (p.assignedUsername && p.assignedUsername.toLowerCase() === lower) || 
        p.phone === emailOrUser || 
        (p.partnerId && p.partnerId.toLowerCase() === lower)
      );

      let partnerId: string | undefined = undefined;
      let partnerBrandName: string | undefined = undefined;
      let serviceTier: PartnerServiceTier | undefined = undefined;

      if (matchingPartner) {
        determinedRole = 'partner';
        defaultTab = 'saas_partner';
        approvedRoles = ['partner', 'sales', 'technician', 'customer'];
        partnerId = matchingPartner.partnerId;
        partnerBrandName = matchingPartner.brandName || matchingPartner.applicantName;
        serviceTier = matchingPartner.serviceTier;
      } else if (lower.startsWith('partner')) {
        determinedRole = 'partner';
        defaultTab = 'saas_partner';
        approvedRoles = ['partner', 'sales', 'technician', 'customer'];
        partnerId = 'partner_custom';
        partnerBrandName = 'Partner Fleet Network';
        serviceTier = 'all_inclusive';
      } else if (lower.startsWith('admin') || res.user.administrator) {
        determinedRole = 'super_admin';
        defaultTab = 'saas_admin';
        approvedRoles = ['super_admin', 'partner', 'sales', 'technician', 'support', 'rescue', 'customer'];
      } else if (lower.startsWith('sales')) {
        determinedRole = 'sales';
        defaultTab = 'saas_sales';
        approvedRoles = ['sales', 'technician', 'customer']; // Sales + Field Tech + Customer
      } else if (lower.startsWith('tech')) {
        determinedRole = 'technician';
        defaultTab = 'saas_technician';
        approvedRoles = ['technician', 'customer'];
      } else if (lower.startsWith('support')) {
        determinedRole = 'support';
        defaultTab = 'saas_support';
        approvedRoles = ['support', 'rescue', 'customer'];
      } else if (lower.startsWith('rescue')) {
        determinedRole = 'rescue';
        defaultTab = 'saas_rescue';
        approvedRoles = ['rescue', 'customer'];
      } else {
        determinedRole = 'customer';
        defaultTab = 'map';
        approvedRoles = ['customer'];
      }

      const userWithRole: UserSession = { 
        ...res.user, 
        role: determinedRole,
        approvedRoles: approvedRoles,
        administrator: determinedRole === 'super_admin' || res.user.administrator,
        partnerId,
        partnerBrandName,
        serviceTier
      };

      setUser(userWithRole);
      setCurrentRole(determinedRole);
      setActiveTab(defaultTab);
      localStorage.setItem('gps_user_session', JSON.stringify(userWithRole));
      localStorage.setItem('gps_saas_current_role', determinedRole);
      await syncServerData();
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    setCurrentRole('customer');
    setActiveTab('map');
    localStorage.removeItem('gps_user_session');
    localStorage.removeItem('gps_saas_current_role');
    traccarApi.clearAuth();
  };

  const updateDeviceProfile = (id: number, partial: Partial<Device>) => {
    setDevices(prev => {
      const updated = prev.map(d => {
        if (d.id === id) {
          const newDev = {
            ...d,
            ...partial,
            attributes: {
              ...d.attributes,
              ...(partial.attributes || {})
            }
          };
          localStorage.setItem('gps_saved_device_profile', JSON.stringify(newDev));
          return newDev;
        }
        return d;
      });
      return updated;
    });
  };

  const calibrateVehicleLocation = (deviceId: number, lat: number, lon: number, address?: string) => {
    const currentPos = positions[deviceId] || {
      id: 101,
      deviceId,
      protocol: 'osmand',
      serverTime: new Date().toISOString(),
      deviceTime: new Date().toISOString(),
      fixTime: new Date().toISOString(),
      outdated: false,
      valid: true,
      altitude: 12,
      speed: 0,
      course: 0,
      accuracy: 5,
      attributes: {
        ignition: false,
        motion: false,
        batteryLevel: 100,
        satellites: 14,
        power: 12.6,
        isLastKnown: true
      }
    };

    const updatedPos: Position = {
      ...currentPos,
      latitude: lat,
      longitude: lon,
      address: address || `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      attributes: {
        ...currentPos.attributes,
        isLastKnown: true
      }
    };

    setPositions(prev => {
      const next = { ...prev, [deviceId]: updatedPos };
      localStorage.setItem('gps_last_known_positions', JSON.stringify(next));
      return next;
    });

    // Also update geofence safe zone around the vehicle's calibrated location
    setGeofences(prev => {
      if (prev.length > 0) {
        const updated = prev.map((g, idx) => idx === 0 ? { ...g, latitude: lat, longitude: lon } : g);
        localStorage.setItem('gps_saved_geofences', JSON.stringify(updated));
        return updated;
      }
      return prev;
    });

    triggerManualAlert('geofenceEnter', `📍 বাইকের অবস্থান সফলভাবে আপডেট ও পিন করা হয়েছে (${lat.toFixed(4)}, ${lon.toFixed(4)})`);
  };

  const sendCommand = async (type: string, rawCmd?: string, data?: any) => {
    if (!selectedDevice) return { success: false, message: 'No vehicle selected' };
    const cmdId = 'cmd-' + Date.now();
    setCommandHistory(prev => [
      { id: cmdId, deviceId: selectedDevice.id, deviceName: selectedDevice.name, commandType: type, rawCommand: rawCmd || type, status: 'sending', timestamp: new Date().toISOString() },
      ...prev
    ]);
    const res = await traccarApi.sendCommand({ deviceId: selectedDevice.id, type: type === 'custom' ? 'custom' : type, attributes: { data: rawCmd, ...data } });
    return res;
  };

  // Multiple Geofences CRUD
  const addGeofence = (geo: Omit<Geofence, 'id'>) => {
    const newGeo: Geofence = { ...geo, id: Date.now(), attributes: { ...geo.attributes, enabled: true } };
    setGeofences(prev => {
      const next = [...prev, newGeo];
      localStorage.setItem('gps_saved_geofences', JSON.stringify(next));
      return next;
    });
  };

  const updateGeofence = (id: number, partial: Partial<Geofence>) => {
    setGeofences(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...partial, attributes: { ...g.attributes, ...(partial.attributes || {}) } } : g);
      localStorage.setItem('gps_saved_geofences', JSON.stringify(next));
      return next;
    });
  };

  const toggleGeofence = (id: number) => {
    setGeofences(prev => {
      const next = prev.map(g => {
        if (g.id === id) {
          const isCurrentlyEnabled = (g.attributes as any)?.enabled !== false;
          return {
            ...g,
            attributes: {
              ...g.attributes,
              enabled: !isCurrentlyEnabled
            }
          };
        }
        return g;
      });
      localStorage.setItem('gps_saved_geofences', JSON.stringify(next));
      return next;
    });
  };

  const deleteGeofence = (id: number) => {
    setGeofences(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem('gps_saved_geofences', JSON.stringify(next));
      return next;
    });
  };

  const addEvidence = (evidence: Omit<MediaEvidence, 'id' | 'timestamp'>) => {
    setEvidenceList(prev => [{ ...evidence, id: 'ev-' + Date.now(), timestamp: new Date().toISOString() }, ...prev]);
  };

  const deleteEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(e => e.id !== id));
  };

  const triggerManualAlert = (alarmType: string, msg: string) => {
    if (!selectedDevice) return;
    const currentLoc = selectedPosition?.address || 'Gulshan-2, Dhaka, Bangladesh';
    const newAlert: EventLog = {
      id: Date.now(),
      deviceId: selectedDevice.id,
      type: alarmType,
      serverTime: new Date().toISOString(),
      attributes: {
        alarm: alarmType,
        message: msg,
        location: currentLoc,
        parkedStartTime: Date.now(),
        speed: selectedPosition ? Math.round(selectedPosition.speed || 0) : 0,
        hasVideoEvidence: alarmType === 'traffic_signal'
      }
    };
    setAlerts(prev => {
      const next = [newAlert, ...prev];
      localStorage.setItem('gps_saved_alerts_list', JSON.stringify(next));
      return next;
    });
    triggerAlertFeedback(alarmType, msg);
  };


  const handleSetCurrentRole = (role: SaasRole) => {
    // Validate role switch is within user's approvedRoles before allowing
    const isAdmin = user?.administrator || user?.role === 'super_admin';
    const userApprovedRoles: SaasRole[] = user?.approvedRoles || ['customer'];
    if (!isAdmin && !userApprovedRoles.includes(role)) {
      console.warn(`[RBAC] Blocked unauthorized role switch attempt to: ${role}`);
      return; // Silently block unauthorized role injection
    }
    setCurrentRole(role);
    localStorage.setItem('gps_saas_current_role', role);

    // CRITICAL FIX: Auto-align activeTab with the newly selected role
    // This completely prevents blank page / missing UI issues when moving between admin & users
    if (role === 'customer') {
      const validCustomerTabs: TabType[] = ['map', 'reports', 'playback', 'commands', 'surveillance', 'geofence', 'alerts', 'settings'];
      if (!validCustomerTabs.includes(activeTab)) {
        setActiveTab('map');
      }
    } else if (role === 'partner') {
      setActiveTab('saas_partner');
    } else if (role === 'sales') {
      setActiveTab('saas_sales');
    } else if (role === 'technician') {
      setActiveTab('saas_technician');
    } else if (role === 'support') {
      setActiveTab('saas_support');
    } else if (role === 'rescue') {
      setActiveTab('saas_rescue');
    } else if (role === 'super_admin') {
      const validAdminTabs: TabType[] = ['saas_admin', 'saas_partner', 'saas_sales', 'saas_technician', 'saas_support', 'saas_rescue', 'map', 'reports', 'playback', 'commands', 'surveillance', 'geofence', 'alerts', 'settings'];
      if (!validAdminTabs.includes(activeTab)) {
        setActiveTab('saas_admin');
      }
    }
  };

  const purgeDemoFleetData = () => {
    const realBike = devices.find(d => d.id === 1) || devices[0];
    const realPos = positions[1] || Object.values(positions)[0];
    
    setDevices([realBike]);
    setSelectedDeviceId(realBike.id);
    setPositions({ [realBike.id]: realPos });
    setIsDemoPurged(true);
    localStorage.setItem('gps_demo_purged', 'true');
    localStorage.setItem('gps_last_known_positions', JSON.stringify({ [realBike.id]: realPos }));
  };

  const [appTheme, setAppThemeState] = useState<AppTheme>(() => {
    return (localStorage.getItem('easytracker_app_theme') as AppTheme) || 'cyber_midnight';
  });

  const setAppTheme = (theme: AppTheme) => {
    setAppThemeState(theme);
    localStorage.setItem('easytracker_app_theme', theme);
  };

  const restoreDemoFleetData = () => {
    localStorage.removeItem('gps_demo_purged');
    setIsDemoPurged(false);
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        serverConfig,
        setServerConfig,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole: handleSetCurrentRole,
        isRoleSwitcherOpen,
        setIsRoleSwitcherOpen,
        purgeDemoFleetData,
        restoreDemoFleetData,
        isDemoPurged,
        devices,
        tenantDevices,
        selectedDeviceId,
        setSelectedDeviceId,
        selectedDevice,
        positions,
        selectedPosition,
        updateDeviceProfile,
        calibrateVehicleLocation,
        syncServerData,
        userLocation,
        requestUserLocation,
        distanceInfo,
        bearingInfo,
        openGoogleMapsNavigation,
        mapLayer,
        setMapLayer,
        showTraffic,
        setShowTraffic,
        showDistanceLine,
        setShowDistanceLine,
        showGeofenceOnMap,
        setShowGeofenceOnMap,
        commandHistory,
        sendCommand,
        geofences,
        addGeofence,
        updateGeofence,
        deleteGeofence,
        toggleGeofence,
        geofenceStatus,
        evidenceList,
        addEvidence,
        deleteEvidence,
        alerts,
        unreadAlertCount,
        markAlertsAsRead,
        triggerManualAlert,
        engineLogs,
        addEngineLog,
        sensorLogs,
        addSensorLog,
        fuelRefillLogs,
        addFuelRefillLog,
        deleteFuelRefillLog,
        alertFeedbackMode,
        setAlertFeedbackMode,
        deviceWarranties,
        warrantyClaims,
        setDeviceWarranty,
        submitWarrantyClaim,
        assignTechnicianToClaim,
        completeWarrantyClaim,
        partnerRegistrations,
        approvedPartners,
        registerPartner,
        approvePartner,
        rejectPartner,
        supportTickets,
        submitSupportTicket,
        updateSupportTicketStatus,
        rateCardServices,
        sparePartsCatalog,
        paidJobCards,
        platformCommissionPercent,
        setPlatformCommissionPercent,
        addRateCardService,
        updateRateCardService,
        deleteRateCardService,
        addSparePart,
        updateSparePart,
        deleteSparePart,
        createPaidJobCard,
        sendJobCardBill,
        confirmJobCardByCustomer,
        completeJobCard,
        sellerImeiQuotas,
        updateSellerQuota,
        allocateImeiToSeller,
        unlockImeiPaywall,
        technicianLedgers,
        updateTechnicianLimits,
        recordTechTransaction,
        settleWeeklyTechPayout,
        digitalPaymentOffers,
        updatePaymentOffer,
        staffCommissions,
        registerUniversalSale,
        payoutStaffCommission,
        getMyCommissionSummary,
        deviceInventory,
        simInventory,
        addDeviceToInventory,
        updateDeviceInventoryItem,
        deleteDeviceInventoryItem,
        unbindDeviceFromVehicle,
        addSimToInventory,
        updateSimInventoryItem,
        deleteSimInventoryItem,
        unbindSimFromDevice,
        bulkImportDevices,
        bulkImportSims,
        updatePartnerTierPricing,
        returnLogs,
        initiateReturnLog,
        updateReturnLog,
        resolveReturnLog,
        appTheme,
        setAppTheme,
        language,
        setLanguage,
        t,
        audioAlertsEnabled,
        setAudioAlertsEnabled
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
