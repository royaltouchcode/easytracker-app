export type VehicleType = 
  | 'car' 
  | 'motorcycle' 
  | 'scooter'
  | 'ambulance'
  | 'truck' 
  | 'bus' 
  | 'cng' 
  | 'auto'
  | 'pickup' 
  | 'microbus' 
  | 'bicycle' 
  | 'person' 
  | 'boat';

export interface EngineLog {
  id: string;
  deviceId: number;
  deviceName: string;
  action: 'cut' | 'resume';
  status: 'executed' | 'pending' | 'failed';
  timestamp: string;
  speed: number;
}

export type AlertFeedbackMode = 
  | 'sound_vibration' 
  | 'only_sound' 
  | 'only_vibration' 
  | 'sms_push' 
  | 'sms_sound_vibration' 
  | 'silent';

export interface FuelRefillLog {
  id: string;
  deviceId: number;
  deviceName: string;
  litersAdded: number;
  totalLitersAfter: number;
  odometerKm: number;
  costBdt?: number;
  timestamp: string;
  stationName?: string;
}

export interface SensorLog {
  id: string;
  deviceId: number;
  deviceName: string;
  sensorType: 'ac' | 'door' | 'fuel' | 'fuel_lid' | 'vibration';
  title: string;
  status: string;
  value?: string | number;
  timestamp: string;
}

export interface Device {
  id: number;
  name: string;
  uniqueId: string;
  status: 'online' | 'offline' | 'unknown';
  disabled: boolean;
  lastUpdate: string;
  positionId?: number;
  groupId?: number;
  phone?: string;
  model?: string;
  contact?: string;
  category?: VehicleType;
  attributes: {
    color?: string;
    plateNumber?: string;
    driverName?: string;
    driverPhone?: string;
    speedLimit?: number;
    sosNumber1?: string;
    sosNumber2?: string;
    cameraStreamUrlFront?: string;
    cameraStreamUrlCabin?: string;
    hasAcSensor?: boolean;
    hasDoorSensor?: boolean;
    hasFuelSensor?: boolean;
    fuelCapacityLiters?: number;
    hasFuelLidSensor?: boolean;
    [key: string]: any;
  };
}

export interface Position {
  id: number;
  deviceId: number;
  protocol: string;
  serverTime: string;
  deviceTime: string;
  fixTime: string;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number; // in km/h
  course: number; // 0 - 360 degrees
  address?: string;
  accuracy?: number;
  attributes: {
    ignition?: boolean;
    batteryLevel?: number; // percentage (0-100)
    power?: number; // External main battery e.g. 12.8V
    battery?: number; // Internal battery voltage e.g. 3.9V
    sat?: number; // Satellite count
    distance?: number;
    totalDistance?: number;
    motion?: boolean;
    charge?: boolean;
    ac?: boolean; // Air conditioner ON/OFF
    door?: boolean; // Door Open/Close
    fuel?: number; // Current Fuel in Liters e.g. 42.5
    fuelLevel?: number; // Fuel percentage e.g. 85%
    fuelLid?: boolean; // Tank cap open/close
    vibration?: boolean; // Motorcycle vibration sensor
    tilt?: boolean; // Motorcycle tilt sensor
    isLastKnown?: boolean; // Preserved last valid location flag
    alarm?: 'sos' | 'vibration' | 'movement' | 'overspeed' | 'powerCut' | 'powerRestored' | 'tampering' | 'geofenceEnter' | 'geofenceExit' | 'lowBattery' | 'doorOpen' | 'fuelDrop' | 'fuelLidOpen' | 'acOn' | 'acOff' | string;
    status?: number;
    relay?: boolean;
    [key: string]: any;
  };
}

export interface EventLog {
  id: number;
  deviceId: number;
  type: string;
  serverTime: string;
  positionId?: number;
  geofenceId?: number;
  attributes: {
    alarm?: string;
    speed?: number;
    message?: string;
    [key: string]: any;
  };
}

export interface CommandPayload {
  id?: number;
  deviceId: number;
  type: string;
  description?: string;
  attributes: {
    data?: string;
    frequency?: number;
    radius?: number;
    message?: string;
    phone?: string;
    [key: string]: any;
  };
}

export interface CommandHistory {
  id: string;
  deviceId: number;
  deviceName: string;
  commandType: string;
  rawCommand: string;
  status: 'sending' | 'delivered' | 'failed' | 'acknowledged';
  timestamp: string;
  responseMessage?: string;
}

export interface Geofence {
  id: number;
  name: string;
  description?: string;
  area: string; // CIRCLE (lat lon, radius)
  latitude: number;
  longitude: number;
  radius: number; // in meters
  attributes: {
    color?: string;
    speedLimit?: number;
    alertOnEnter?: boolean;
    alertOnExit?: boolean;
    [key: string]: any;
  };
}

export interface MediaEvidence {
  id: string;
  deviceId: number;
  deviceName: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
  thumbnailUrl?: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  triggerEvent: string; // 'SOS Panic', 'Crash Alert', 'Wire Cut', 'Manual Live Snapshot'
  note?: string;
}

export interface ServerConfig {
  name: string;
  url: string; // e.g. https://demo3.traccar.org or custom Oracle IP
  port: string;
  isDemo: boolean;
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  readonly: boolean;
  administrator: boolean;
  serverUrl: string;
  role?: SaasRole;
  approvedRoles?: SaasRole[];
  partnerId?: string;
  partnerBrandName?: string;
  serviceTier?: PartnerServiceTier;
  locationVerified?: boolean;
  locationVerifiedAt?: string;
  locationVerifiedBy?: string;
  shopName?: string;
  shopAddress?: string;
  geoLat?: number;
  geoLng?: number;
  googleMapsUrl?: string;
}

export type MapLayerType = 'carto_positron' | 'google_roadmap' | 'google_satellite' | 'google_hybrid' | 'google_terrain' | 'osm' | 'baidu_dark';

export type SaasRole = 'customer' | 'super_admin' | 'partner' | 'sales' | 'technician' | 'support' | 'rescue';

export type WarrantyPolicyType = 'replacement_1yr' | 'service_2yr' | 'extended_3yr' | 'lifetime_service';
export type WarrantyStatus = 'active' | 'expiring_soon' | 'expired' | 'void';

export interface DeviceWarrantyInfo {
  deviceId: number;
  imei: string;
  policyType: WarrantyPolicyType;
  policyTitleBn: string;
  activationDate: string;
  durationMonths: number;
  expiryDate: string;
  status: WarrantyStatus;
  coveredTerms: string[];
}

export type WarrantyClaimStatus = 'pending_support' | 'tech_assigned' | 'in_repair' | 'completed' | 'rejected';

export interface WarrantyClaimTicket {
  id: string;
  deviceId: number;
  vehicleName: string;
  plateNumber: string;
  imei: string;
  customerName: string;
  customerPhone: string;
  issueDescription: string;
  status: WarrantyClaimStatus;
  createdAt: string;
  assignedTechId?: string;
  assignedTechName?: string;
  assignedTechPhone?: string;
  technicianNotes?: string;
  replacementImei?: string;
  completedDate?: string;
}

// B2B Multi-Tenant Partner & Whitelabel Service Types
export type PartnerServiceTier = 'tracking_only' | 'all_inclusive' | 'subscription_wise';
export type PartnerRegistrationType = 'staff_partner' | 'b2b_brand';

export interface PartnerRegistrationEntry {
  id: string;
  type: PartnerRegistrationType;
  applicantName: string;
  brandName?: string;
  businessCategory?: string;
  phone: string;
  whatsapp: string;
  email?: string;
  emergencyPhone?: string;
  district: string;
  thana?: string;
  fullAddress: string;
  shopName?: string;
  geoLat?: number;
  geoLng?: number;
  googleMapsUrl?: string;
  locationVerified?: boolean;
  locationVerifiedAt?: string;
  locationVerifiedBy?: string;
  desiredRoles: SaasRole[];
  requestedServices: ('server_tracking' | 'shared_technicians' | 'shared_rescue' | 'shared_support' | 'shared_sales')[];
  serviceTier: PartnerServiceTier;
  status: 'pending_approval' | 'approved' | 'rejected';
  submittedAt: string;
  assignedUsername?: string;
  partnerId?: string;
  adminReviewNotes?: string;
  customServerUrl?: string; // Custom B2B Traccar server endpoint e.g. https://gps.meghnalogistics.com
  customServerPort?: string; // Custom API/Web port e.g. 8082
  maxSlotQuota?: number; // Allocated 4096 slots
  floatingCreditLimit?: number; // Floating limit e.g. 10000 BDT
}

// Customer Support & Helpdesk Ticket Types
export type TicketStatus = 'Pending' | 'In Progress' | 'Customer Feedback' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface SupportTicket {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  issue: string;
  priority: TicketPriority;
  status: TicketStatus;
  time: string;
  preferredLocation?: string;
  agentNotes?: string;
  deviceId?: number;
  userId?: number | string;
  issueCategory?: 'engine_cutoff' | 'location_update' | 'offline_device' | 'sim_balance' | 'wiring_check' | 'other';
}

// Out-of-Warranty Paid Maintenance & Spare Parts Catalog Types
export interface RateCardService {
  id: string;
  nameBn: string;
  nameEn: string;
  category: 'labor' | 'repair' | 'diagnostic' | 'onsite';
  basePrice: number; // In BDT
  warrantyDays: number; // Free service guarantee in days
  descriptionBn: string;
  isActive: boolean;
}

export interface SparePartItem {
  id: string;
  nameBn: string;
  nameEn: string;
  partCode: string;
  unitPrice: number; // In BDT
  warrantyDays: number;
  stockCount: number;
  descriptionBn: string;
  isActive: boolean;
}

export type JobCardStatus = 'created' | 'in_service' | 'bill_sent' | 'customer_confirmed' | 'completed';

export interface SelectedServiceItem {
  serviceId: string;
  nameBn: string;
  price: number;
}

export interface SelectedSparePartItem {
  partId: string;
  nameBn: string;
  unitPrice: number;
  quantity: number;
}

export interface PaidJobCard {
  id: string;
  customerName: string;
  customerPhone: string;
  vehicleName: string;
  plateNumber?: string;
  deviceId?: number;
  serviceCenterName: string;
  technicianName?: string;
  technicianPhone?: string;
  selectedServices: SelectedServiceItem[];
  selectedSpareParts: SelectedSparePartItem[];
  totalAmount: number;
  platformCommissionPercent: number; // Default 20%
  platformCommissionAmount: number;
  technicianPayoutAmount: number;
  paymentMethod: 'cash_at_center' | 'online_bkash' | 'unpaid';
  jobStatus: JobCardStatus;
  createdAt: string;
  completedAt?: string;
  warrantyExpiryDate?: string;
  customerNote?: string;
  technicianNote?: string;
}

// 📦 Seller / Dealer IMEI Paywall Quota Management Types
export interface SellerImeiQuota {
  partnerId: string;
  sellerName: string;
  phone: string;
  shopName?: string;
  maxDueDeviceQuota: number; // Max allowed locked/unpaid devices in dealer's shop (e.g. 3 or 5)
  allocatedImeis: {
    imei: string;
    model: string;
    status: 'dormant_locked' | 'unlocked_paid' | 'pending_payment';
    customerName?: string;
    customerPhone?: string;
    assignedDate: string;
    unlockedDate?: string;
    deviceCostBdt: number;
  }[];
  totalSold: number;
  totalPendingDueBdt: number;
  isQuotaLocked: boolean; // Auto-locked if pending devices >= maxDueDeviceQuota
}

// 💳 The Negative Floating Ledger Types for Technicians
export interface TechnicianTransaction {
  id: string;
  type: 'install_earning' | 'warranty_fee' | 'cash_collected_cut' | 'weekly_payout' | 'due_payment';
  titleBn: string;
  amount: number; // Positive for tech earnings, Negative for company commission cut
  jobId?: string;
  customerName?: string;
  date: string;
  timestamp: number;
}

export interface TechnicianLedgerConfig {
  techId: string;
  techName: string;
  techPhone: string;
  area: string;
  maxNegativeLimitBdt: number; // e.g. 1500 BDT
  maxDueDaysLimit: number; // e.g. 7 days
  currentFloatingBalance: number; // Positive = company owes tech, Negative = tech owes company
  firstNegativeDate?: string;
  daysInNegative: number;
  isAccountLocked: boolean;
  transactions: TechnicianTransaction[];
}

// 🎁 Customer Digital Cashless Payment Incentives (bKash / Nagad / BanglaQR)
export interface DigitalPaymentOffer {
  id: string;
  titleBn: string;
  badgeBn: string;
  discountAmountBdt: number;
  bonusWarrantyDays: number;
  supportedGateways: ('bkash' | 'nagad' | 'bangla_qr' | 'card')[];
  descriptionBn: string;
  isActive: boolean;
}

