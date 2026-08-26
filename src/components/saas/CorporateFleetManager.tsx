import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  Car, 
  Users, 
  Plus, 
  Search, 
  ShieldCheck, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  FileText, 
  DollarSign, 
  Fuel, 
  Radio, 
  Receipt, 
  X, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Activity,
  Edit3,
  Trash2,
  Lock,
  Unlock,
  Zap,
  Mic,
  Volume2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeviceSimBundlerModal } from './DeviceSimBundlerModal';
import { TransitCounterManager } from './TransitCounterManager';
import { DriverPerformanceManager } from './DriverPerformanceManager';
import { FuelTelematicsManager } from './FuelTelematicsManager';
import { ComplianceDocumentVault } from './ComplianceDocumentVault';
import { EnterpriseReportCenter } from './EnterpriseReportCenter';

export interface CorporateFleetCompany {
  id: string;
  name: string;
  category: 'bus_transit' | 'cargo_logistics' | 'courier_delivery';
  contactPerson: string;
  phone: string;
  email: string;
  headOffice: string;
  activeVehiclesCount: number;
  assignedServerNode: string;
  m2mOperatorPool: string;
  subscriptionPlan: string;
  monthlyBillingTk: number;
  status: 'active' | 'pending_contract' | 'suspended';
  establishedDate: string;
}

export interface FleetVehicleItem {
  id: string;
  fleetCompanyId: string;
  companyName: string;
  vehicleName: string;
  plateNumber: string;
  vehicleType: 'bus' | 'truck' | 'bike' | 'van';
  imei: string;
  simNumber: string;
  operator: 'Grameenphone' | 'Robi' | 'Banglalink' | 'Teletalk';
  assignedDriverName: string;
  driverPhone: string;
  driverLicenseNumber: string;
  licenseExpiry: string;
  fitnessExpiry: string;
  currentRouteOrHub: string;
  speed: number;
  fuelLevelLiters: number;
  engineStatus: 'running' | 'idle' | 'stopped';
  lastPacketTime: string;
  isEngineLocked: boolean;
}

export interface TripDispatchEntry {
  id: string;
  fleetCompanyId: string;
  companyName: string;
  vehiclePlate: string;
  driverName: string;
  routeFrom: string;
  routeTo: string;
  departureTime: string;
  estimatedArrival: string;
  counterTicketsSold: number;
  totalSeats: number;
  totalFareCollectedTk: number;
  dieselCostTk: number;
  tollCostTk: number;
  netTripProfitTk: number;
  status: 'scheduled' | 'on_route' | 'completed';
}

const DEFAULT_CORPORATE_COMPANIES: CorporateFleetCompany[] = [
  {
    id: 'CORP-HANIF-01',
    name: 'হানিফ এন্টারপ্রাইজ ও ট্রাভেলস (Hanif Paribahan)',
    category: 'bus_transit',
    contactPerson: 'আলহাজ্ব কফিল উদ্দিন (ফ্লিট হেড)',
    phone: '01711-223344',
    email: 'ops@hanifenterprisebd.com',
    headOffice: 'গাবতলী টার্মিনাল, ঢাকা',
    activeVehiclesCount: 180,
    assignedServerNode: 'srv-primary (Traccar Cluster)',
    m2mOperatorPool: 'Robi IoT M2M Gateway',
    subscriptionPlan: 'Enterprise Bus VIP (৳৩৫০/বাস/মাস)',
    monthlyBillingTk: 63000,
    status: 'active',
    establishedDate: '12 Jan 2024'
  },
  {
    id: 'CORP-WALTON-02',
    name: 'ওয়ালটন হাই-টেক ডিস্ট্রিবিউশন লজিস্টিকস (Walton Cargo)',
    category: 'cargo_logistics',
    contactPerson: 'ইঞ্জিনিয়ার মশিউর রহমান (লজিস্টিকস ডিরেক্টর)',
    phone: '01700-112233',
    email: 'logistics.supply@waltonbd.com',
    headOffice: 'ওয়ালটন হেডকোয়ার্টার্স, চন্দ্রা, গাজীপুর',
    activeVehiclesCount: 142,
    assignedServerNode: 'srv-walton (Dedicated Traccar Node)',
    m2mOperatorPool: 'Grameenphone Cisco Jasper APN',
    subscriptionPlan: 'Heavy Cargo Dedicated Cloud (৳৪৫০/গাড়ি/মাস)',
    monthlyBillingTk: 63900,
    status: 'active',
    establishedDate: '01 Mar 2024'
  },
  {
    id: 'CORP-PATHAO-03',
    name: 'পাঠাও ও রেডএক্স কুরিয়ার ডেলিভারি হাব (Pathao / RedX)',
    category: 'courier_delivery',
    contactPerson: 'ফারহান আহমেদ (লাস্ট মাইল ডিসপ্যাচ হেড)',
    phone: '01911-556677',
    email: 'fleet.fleetops@pathao.com',
    headOffice: 'তেজগাঁও শিল্পাঞ্চল, ঢাকা',
    activeVehiclesCount: 95,
    assignedServerNode: 'srv-courier (Express Gateway)',
    m2mOperatorPool: 'Banglalink BL M2M Enterprise',
    subscriptionPlan: 'Courier Fleet Pro (৳২৫০/বাইক/মাস)',
    monthlyBillingTk: 23750,
    status: 'active',
    establishedDate: '15 May 2025'
  }
];

const DEFAULT_FLEET_VEHICLES: FleetVehicleItem[] = [
  {
    id: 'FV-101',
    fleetCompanyId: 'CORP-HANIF-01',
    companyName: 'হানিফ এন্টারপ্রাইজ ও ট্রাভেলস',
    vehicleName: 'Scania K410 VIP Coach #24',
    plateNumber: 'DHAKA METRO-BA 15-2026',
    vehicleType: 'bus',
    imei: '869011039845120',
    simNumber: '01811-334455',
    operator: 'Robi',
    assignedDriverName: 'মোঃ বাবুল হোসেন',
    driverPhone: '01811-998877',
    driverLicenseNumber: 'BRTA-DHK-5544321',
    licenseExpiry: '15 Dec 2027 (বৈধ)',
    fitnessExpiry: '20 Nov 2026 (বৈধ)',
    currentRouteOrHub: 'ঢাকা (সায়েদাবাদ) ⇄ চট্টগ্রাম (দামপাড়া)',
    speed: 74,
    fuelLevelLiters: 165,
    engineStatus: 'running',
    lastPacketTime: 'এখন সক্রিয় (1s ago)',
    isEngineLocked: false
  },
  {
    id: 'FV-102',
    fleetCompanyId: 'CORP-HANIF-01',
    companyName: 'হানিফ এন্টারপ্রাইজ ও ট্রাভেলস',
    vehicleName: 'Hino 1J AC Coach #18',
    plateNumber: 'DHAKA METRO-BA 15-2027',
    vehicleType: 'bus',
    imei: '869011039845121',
    simNumber: '01811-334456',
    operator: 'Robi',
    assignedDriverName: 'মোঃ নজরুল ইসলাম',
    driverPhone: '01811-998878',
    driverLicenseNumber: 'BRTA-SYL-9988123',
    licenseExpiry: '10 Aug 2028 (বৈধ)',
    fitnessExpiry: '14 Oct 2026 (বৈধ)',
    currentRouteOrHub: 'ঢাকা (মহাখালী) ⇄ সিলেট (কদমতলী)',
    speed: 68,
    fuelLevelLiters: 140,
    engineStatus: 'running',
    lastPacketTime: '৪ সেকেন্ড আগে',
    isEngineLocked: false
  },
  {
    id: 'FV-201',
    fleetCompanyId: 'CORP-WALTON-02',
    companyName: 'ওয়ালটন হাই-টেক ডিস্ট্রিবিউশন লজিস্টিকস',
    vehicleName: 'Tata Prima 4928.S Heavy Prime Mover',
    plateNumber: 'DHAKA METRO-TA 14-8899',
    vehicleType: 'truck',
    imei: '864720058291088',
    simNumber: '01700-112233',
    operator: 'Grameenphone',
    assignedDriverName: 'আব্দুল কাদের',
    driverPhone: '01712-445566',
    driverLicenseNumber: 'BRTA-GZP-1122334',
    licenseExpiry: '25 Mar 2027 (বৈধ)',
    fitnessExpiry: '12 Jan 2027 (বৈধ)',
    currentRouteOrHub: 'চন্দ্রা কারখানা ⇄ চট্টগ্রাম পোর্ট ইয়ার্ড',
    speed: 52,
    fuelLevelLiters: 280,
    engineStatus: 'running',
    lastPacketTime: 'এখন সক্রিয় (1s ago)',
    isEngineLocked: false
  },
  {
    id: 'FV-301',
    fleetCompanyId: 'CORP-PATHAO-03',
    companyName: 'পাঠাও ও রেডএক্স কুরিয়ার ডেলিভারি হাব',
    vehicleName: 'Hero Glamour 125 Delivery Bike #42',
    plateNumber: 'DHAKA METRO-HA 44-5566',
    vehicleType: 'bike',
    imei: '357201089456123',
    simNumber: '01911-556677',
    operator: 'Banglalink',
    assignedDriverName: 'শাকিল আহমেদ',
    driverPhone: '01911-002233',
    driverLicenseNumber: 'BRTA-DHK-7788990',
    licenseExpiry: '30 Jun 2026 (বৈধ)',
    fitnessExpiry: 'N/A (Motorcycle)',
    currentRouteOrHub: 'গুলশান - বনানী - ধানমন্ডি ডেলিভারি জোন',
    speed: 28,
    fuelLevelLiters: 8,
    engineStatus: 'running',
    lastPacketTime: '৩ সেকেন্ড আগে',
    isEngineLocked: false
  }
];

const DEFAULT_TRIP_DISPATCHES: TripDispatchEntry[] = [
  {
    id: 'TRIP-8801',
    fleetCompanyId: 'CORP-HANIF-01',
    companyName: 'হানিফ এন্টারপ্রাইজ',
    vehiclePlate: 'DHAKA METRO-BA 15-2026',
    driverName: 'মোঃ বাবুল হোসেন',
    routeFrom: 'ঢাকা (সায়েদাবাদ কাউন্টার)',
    routeTo: 'চট্টগ্রাম (দামপাড়া বাস টার্মিনাল)',
    departureTime: 'আজ সকাল ০৮:৩০',
    estimatedArrival: 'আজ দুপুর ০২:১৫',
    counterTicketsSold: 38,
    totalSeats: 40,
    totalFareCollectedTk: 38000,
    dieselCostTk: 11500,
    tollCostTk: 2850,
    netTripProfitTk: 23650,
    status: 'on_route'
  },
  {
    id: 'TRIP-8802',
    fleetCompanyId: 'CORP-HANIF-01',
    companyName: 'হানিফ এন্টারপ্রাইজ',
    vehiclePlate: 'DHAKA METRO-BA 15-2027',
    driverName: 'মোঃ নজরুল ইসলাম',
    routeFrom: 'ঢাকা (মহাখালী কাউন্টার)',
    routeTo: 'সিলেট (কদমতলী কেন্দ্রীয় টার্মিনাল)',
    departureTime: 'আজ সকাল ০৯:০০',
    estimatedArrival: 'আজ বিকাল ০৩:০০',
    counterTicketsSold: 36,
    totalSeats: 36,
    totalFareCollectedTk: 32400,
    dieselCostTk: 9800,
    tollCostTk: 1200,
    netTripProfitTk: 21400,
    status: 'on_route'
  }
];

export const CorporateFleetManager: React.FC = () => {
  const { triggerManualAlert } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'companies' | 'vehicles' | 'dispatches' | 'transit_counters' | 'drivers_vault' | 'fuel_audit' | 'compliance_docs' | 'reports_audit'
  >('companies');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<'all' | 'bus_transit' | 'cargo_logistics' | 'courier_delivery'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [companies, setCompanies] = useState<CorporateFleetCompany[]>(() => {
    const saved = localStorage.getItem('gps_corporate_fleet_companies');
    return saved ? JSON.parse(saved) : DEFAULT_CORPORATE_COMPANIES;
  });

  const [vehicles, setVehicles] = useState<FleetVehicleItem[]>(() => {
    const saved = localStorage.getItem('gps_corporate_fleet_vehicles');
    return saved ? JSON.parse(saved) : DEFAULT_FLEET_VEHICLES;
  });

  const [dispatches, setDispatches] = useState<TripDispatchEntry[]>(() => {
    const saved = localStorage.getItem('gps_corporate_trip_dispatches');
    return saved ? JSON.parse(saved) : DEFAULT_TRIP_DISPATCHES;
  });

  // Modal States
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [isBundlerModalOpen, setIsBundlerModalOpen] = useState(false);
  const [isOwnerAccessUnlocked, setIsOwnerAccessUnlocked] = useState(true); // Super Admin / Enterprise Owner Full Visibility

  // New Company Form State
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newCompanyCategory, setNewCompanyCategory] = useState<'bus_transit' | 'cargo_logistics' | 'courier_delivery'>('bus_transit');
  const [newCompanyContact, setNewCompanyContact] = useState('');
  const [newCompanyPhone, setNewCompanyPhone] = useState('');
  const [newCompanyOffice, setNewCompanyOffice] = useState('');
  const [newCompanyVehiclesCount, setNewCompanyVehiclesCount] = useState('25');
  const [newCompanyServerNode, setNewCompanyServerNode] = useState('srv-primary');

  // Filtered Companies
  const filteredCompanies = companies.filter(c => {
    const matchesCat = selectedCategoryFilter === 'all' || c.category === selectedCategoryFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery);
    return matchesCat && matchesSearch;
  });

  // Filtered Vehicles
  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch = v.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.plateNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.imei.includes(searchQuery) ||
                          v.assignedDriverName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const handleSaveNewCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim() || !newCompanyPhone.trim()) return;

    const count = parseInt(newCompanyVehiclesCount, 10) || 10;
    const newComp: CorporateFleetCompany = {
      id: `CORP-${Date.now().toString().slice(-4)}`,
      name: newCompanyName.trim(),
      category: newCompanyCategory,
      contactPerson: newCompanyContact.trim() || 'ফ্লিট ম্যানেজার',
      phone: newCompanyPhone.trim(),
      email: `${newCompanyPhone.trim().replace(/[^0-9]/g, '')}@fleet.easytracker.com`,
      headOffice: newCompanyOffice.trim() || 'ঢাকা, বাংলাদেশ',
      activeVehiclesCount: count,
      assignedServerNode: newCompanyServerNode,
      m2mOperatorPool: 'Robi / GP Multi-APN Pool',
      subscriptionPlan: `Enterprise Fleet Contract (${count} Vehicles)`,
      monthlyBillingTk: count * 350,
      status: 'active',
      establishedDate: 'আজ'
    };

    const updated = [newComp, ...companies];
    setCompanies(updated);
    localStorage.setItem('gps_corporate_fleet_companies', JSON.stringify(updated));

    setIsAddCompanyModalOpen(false);
    setNewCompanyName('');
    setNewCompanyPhone('');
    setNewCompanyContact('');
    setNewCompanyOffice('');
    triggerManualAlert('subscription_reminder', `🏢 কর্পোরেট ক্লায়েন্ট "${newComp.name}" সফলভাবে যুক্ত হয়েছে!`);
  };

  const handleToggleEngineLock = (vehicleId: string) => {
    const updated = vehicles.map(v => {
      if (v.id === vehicleId) {
        const nextState = !v.isEngineLocked;
        triggerManualAlert('sos_alarm', nextState 
          ? `🔒 '${v.vehicleName}' (${v.plateNumber}) এর ইঞ্জিন রিমোটলি লক করা হয়েছে!` 
          : `🔓 '${v.vehicleName}' এর ইঞ্জিন আনলক করা হয়েছে!`
        );
        return { ...v, isEngineLocked: nextState };
      }
      return v;
    });
    setVehicles(updated);
    localStorage.setItem('gps_corporate_fleet_vehicles', JSON.stringify(updated));
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      
      {/* 1. TOP HEADER & KPI METRICS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <span>Enterprise Corporate Fleet Hub & Logistics ERP</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  কর্পোরেট এন্টারপ্রাইজ
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                পাবলিক বাস ট্রানজিট, কার্গো ডিস্ট্রিবিউশন লজিস্টিকস ও কুরিয়ার ফ্লিটের ডেডিকেটেড ডিসপ্যাচ, কাউন্টার টিকেটিং ও ফুয়েল অডিট
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsBundlerModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ ১-ক্লিক ডিভাইস ও M2M সিম বরাদ্দ</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddCompanyModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কর্পোরেট ফ্লিট যুক্ত করুন</span>
            </button>
          </div>
        </div>

        {/* Aggregate KPI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-xs">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">মোট কর্পোরেট ফ্লিট কোম্পানি:</span>
            <strong className="text-amber-300 font-mono text-base">{companies.length} টি এন্টারপ্রাইজ</strong>
            <span className="text-[9.5px] text-slate-500 block mt-0.5">বাস, কার্গো ও কুরিয়ার পার্টনার</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">অ্যাক্টিভ বাণিজ্যিক যানবাহন:</span>
            <strong className="text-emerald-300 font-mono text-base">
              {companies.reduce((sum, c) => sum + c.activeVehiclesCount, 0)} টি লাইভ ফ্লিট
            </strong>
            <span className="text-[9.5px] text-emerald-400 font-bold block mt-0.5">১০০% টেলিমেট্রিক্স সিঙ্কড</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">আজকের ট্রিপ ডিসপ্যাচ ও শিডিউল:</span>
            <strong className="text-sky-300 font-mono text-base">{dispatches.length} টি সক্রিয় ট্রিপ</strong>
            <span className="text-[9.5px] text-sky-400 font-bold block mt-0.5">লাইভ বাস রুট মনিটরিং</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block font-bold">মোট মাসিক ফ্লিট বিলিং (MRR):</span>
            <strong className="text-purple-300 font-mono text-base">
              ৳{companies.reduce((sum, c) => sum + c.monthlyBillingTk, 0).toLocaleString()} /মাস
            </strong>
            <span className="text-[9.5px] text-purple-400 font-bold block mt-0.5">পোস্টপেইড ও এন্টারপ্রাইজ SLA</span>
          </div>
        </div>
      </div>

      {/* 2. SUB-VIEW TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex flex-wrap gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('companies')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
              activeSubTab === 'companies' ? 'bg-amber-600 text-white border-amber-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>🏢 কোম্পানি তালিকা ({filteredCompanies.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('vehicles')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
            activeSubTab === 'vehicles' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Truck className="w-3.5 h-3.5" />
          <span>🚛 ফ্লিট গাড়ি ও লাইভ ({vehicles.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('dispatches')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
            activeSubTab === 'dispatches' ? 'bg-sky-600 text-white border-sky-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>📋 ট্রিপ ডিসপ্যাচ ({dispatches.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('transit_counters')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
            activeSubTab === 'transit_counters' ? 'bg-orange-600 text-white border-orange-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>🎫 বাস কাউন্টার ও গেটপাস</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('drivers_vault')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
            activeSubTab === 'drivers_vault' ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>👨‍✈️ চালক ও BRTA ভল্ট</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('fuel_audit')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
            activeSubTab === 'fuel_audit' ? 'bg-purple-600 text-white border-purple-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Fuel className="w-3.5 h-3.5" />
          <span>⛽ ফুয়েল টেলিমেট্রিক্স</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('compliance_docs')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
            activeSubTab === 'compliance_docs' ? 'bg-teal-600 text-white border-teal-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>📑 ফিটনেস ও কমপ্লায়েন্স</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('reports_audit')}
          className={`px-3 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
            activeSubTab === 'reports_audit' ? 'bg-rose-600 text-white border-rose-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>📊 এন্টারপ্রাইজ রিপোর্ট</span>
        </button>
      </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="কোম্পানি, গাড়ি, চালক বা ফোন..."
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* 3. TAB 1: CORPORATE COMPANIES DIRECTORY */}
      {activeSubTab === 'companies' && (
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[10px] text-slate-400 font-bold shrink-0">ফ্লিট ক্যাটাগরি:</span>
            {[
              { id: 'all' as const, labelBn: 'সকল এন্টারপ্রাইজ', count: companies.length },
              { id: 'bus_transit' as const, labelBn: '🚌 পাবলিক বাস ট্রানজিট', count: companies.filter(c => c.category === 'bus_transit').length },
              { id: 'cargo_logistics' as const, labelBn: '🚛 হেভি কার্গো ও লজিস্টিকস', count: companies.filter(c => c.category === 'cargo_logistics').length },
              { id: 'courier_delivery' as const, labelBn: '🛵 কুরিয়ার ও লাস্ট-মাইল', count: companies.filter(c => c.category === 'courier_delivery').length }
            ].map(pill => (
              <button
                key={pill.id}
                onClick={() => setSelectedCategoryFilter(pill.id)}
                className={`px-3 py-1 rounded-xl text-[10.5px] font-bold transition shrink-0 ${
                  selectedCategoryFilter === pill.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {pill.labelBn} ({pill.count})
              </button>
            ))}
          </div>

          {/* Companies Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredCompanies.map((comp) => (
              <div key={comp.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-black text-white block">{comp.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">ID: {comp.id}</span>
                    </div>

                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
                      comp.category === 'bus_transit' 
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' 
                        : comp.category === 'cargo_logistics'
                        ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      {comp.category === 'bus_transit' ? '🚌 বাস ফ্লিট' : comp.category === 'cargo_logistics' ? '🚛 কার্গো লজিস্টিকস' : '🛵 কুরিয়ার ডেলিভারি'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs mt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10.5px]">ফ্লিট হেড / যোগাযোগ:</span>
                      <span className="text-slate-200 font-bold text-[11px] truncate max-w-[160px]">{comp.contactPerson}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10.5px]">হটলাইন / মোবাইল:</span>
                      <span className="font-mono text-indigo-300 font-bold">{comp.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10.5px]">হেড অফিস:</span>
                      <span className="text-slate-300 text-[10px] truncate max-w-[160px]">{comp.headOffice}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400 text-[10.5px]">সংযুক্ত ট্র্যাকার ও বাস:</span>
                      <span className="font-mono text-emerald-400 font-black">{comp.activeVehiclesCount} টি যানবাহন</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10.5px]">সার্ভার ক্লাস্টার নোড:</span>
                      <span className="font-mono text-cyan-300 text-[10px] truncate max-w-[160px]">{comp.assignedServerNode}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[10.5px]">
                  <div className="font-mono text-amber-300 font-extrabold">
                    ৳{comp.monthlyBillingTk.toLocaleString()} /মাস
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery(comp.name);
                      setActiveSubTab('vehicles');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 hover:text-white font-bold transition flex items-center space-x-1 border border-amber-500/30"
                  >
                    <span>গাড়ির তালিকা দেখুন</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TAB 2: FLEET VEHICLES & DRIVER VAULT */}
      {activeSubTab === 'vehicles' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>কর্পোরেট ফ্লিট যানবাহন, চালক লাইসেন্স ও লাইভ ট্র্যাকিং ভল্ট</span>
            </h4>
            
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setIsOwnerAccessUnlocked(!isOwnerAccessUnlocked)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition border ${
                  isOwnerAccessUnlocked
                    ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-sm'
                    : 'bg-amber-950/80 border-amber-500/50 text-amber-300 shadow-sm'
                }`}
                title="এন্টারপ্রাইজ ওনার পারমিশন ভিউ টগল"
              >
                {isOwnerAccessUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                <span>
                  {isOwnerAccessUnlocked 
                    ? '🔓 এন্টারপ্রাইজ ওনার মোড (সিম ও IMEI উন্মুক্ত)' 
                    : '🔒 স্টাফ/ড্রাইভার মোড (সিম ও IMEI সুরক্ষিত)'}
                </span>
              </button>
              <span className="text-[10px] font-mono text-slate-400">
                {filteredVehicles.length} টি যানবাহন ফিল্টার্ড
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase bg-slate-950/60">
                  <th className="py-2.5 px-3">গাড়ি ও রেজি নং</th>
                  <th className="py-2.5 px-3">কোম্পানি ও রুট</th>
                  <th className="py-2.5 px-3">টেলিকম M2M সিম ও IMEI</th>
                  <th className="py-2.5 px-3">চালক ও BRTA লাইসেন্স</th>
                  <th className="py-2.5 px-3">ফিটনেস মেয়াদ</th>
                  <th className="py-2.5 px-3">স্পিড ও ফুয়েল</th>
                  <th className="py-2.5 px-3 text-right">ইঞ্জিন কন্ট্রোল</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-extrabold text-white text-xs">{v.vehicleName}</div>
                      <div className="font-mono text-[10.5px] text-cyan-300 font-bold mt-0.5">{v.plateNumber}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <span className="font-bold text-amber-300 block text-xs">{v.companyName}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{v.currentRouteOrHub}</span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[10.5px]">
                      {isOwnerAccessUnlocked ? (
                        <div>
                          <div className="text-emerald-400 font-bold flex items-center space-x-1">
                            <span>{v.simNumber}</span>
                            <span className="text-[9.5px] text-slate-400">({v.operator})</span>
                            <a
                              href={`tel:${v.simNumber.replace(/[^0-9+]/g, '')}`}
                              className="p-1 rounded-md bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white transition"
                              title="🎙️ কেবিন অডিও / স্পাই কল"
                            >
                              <Mic className="w-3 h-3 text-amber-300" />
                            </a>
                          </div>
                          <div className="text-slate-400 text-[10px] flex items-center space-x-1 mt-0.5">
                            <Cpu className="w-3 h-3 text-indigo-400" />
                            <span>IMEI: {v.imei}</span>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-slate-300 font-bold flex items-center space-x-1">
                            <span>{v.simNumber.slice(0, 6)}***{v.simNumber.slice(-3)}</span>
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-bold">
                              🔒 ওনার অনলি
                            </span>
                          </div>
                          <div className="text-slate-500 text-[9.5px] mt-0.5">
                            IMEI: {v.imei.slice(0, 6)}******{v.imei.slice(-3)}
                          </div>
                        </div>
                      )}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-200 text-xs">{v.assignedDriverName}</div>
                      <div className="font-mono text-[10px] text-indigo-300">{v.driverLicenseNumber}</div>
                      <span className="text-[9px] text-emerald-400 font-bold">{v.licenseExpiry}</span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-[10.5px] text-amber-300">
                      {v.fitnessExpiry}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="flex items-center space-x-1 font-mono font-bold text-white text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{v.speed} km/h</span>
                      </div>
                      <span className="text-[10px] text-purple-300 font-mono block mt-0.5">⛽ {v.fuelLevelLiters} লিটার</span>
                    </td>

                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleEngineLock(v.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[10.5px] shadow-md transition active:scale-95 flex items-center space-x-1 ml-auto ${
                          v.isEngineLocked 
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30' 
                            : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        }`}
                      >
                        <span>{v.isEngineLocked ? '🔓 আনলক করুন' : '⚡ ইঞ্জিন লক'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB 3: TRIP DISPATCHES & BUS COUNTER TICKETING */}
      {activeSubTab === 'dispatches' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h4 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-sky-400" />
              <span>বাস ট্রিপ শিডিউলার, রুট ডিসপ্যাচ ও কাউন্টার সেলস লেজার</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">
              মোট সেলস: ৳{dispatches.reduce((s, d) => s + d.totalFareCollectedTk, 0).toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-[10px] text-slate-400 font-mono uppercase bg-slate-950/60">
                  <th className="py-2.5 px-3">ট্রিপ আইডি</th>
                  <th className="py-2.5 px-3">কোম্পানি ও গাড়ি</th>
                  <th className="py-2.5 px-3">রুট (From ⇄ To)</th>
                  <th className="py-2.5 px-3">সময়সূচি</th>
                  <th className="py-2.5 px-3">টিকিট বুকিং</th>
                  <th className="py-2.5 px-3">ভাড়া কালেকশন</th>
                  <th className="py-2.5 px-3">ডিজেল ও টোল</th>
                  <th className="py-2.5 px-3 text-right">নিট লাভ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {dispatches.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-850/60 transition">
                    <td className="py-2.5 px-3 font-mono font-bold text-sky-400">
                      {d.id}
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-extrabold text-white text-xs">{d.companyName}</div>
                      <div className="font-mono text-[10.5px] text-cyan-300">{d.vehiclePlate}</div>
                    </td>

                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-200 text-xs">{d.routeFrom}</div>
                      <div className="text-[10px] text-slate-400">➔ {d.routeTo}</div>
                    </td>

                    <td className="py-2.5 px-3 text-[10.5px]">
                      <div className="text-emerald-400 font-bold">{d.departureTime}</div>
                      <div className="text-slate-400 text-[10px]">পৌঁছাবে: {d.estimatedArrival}</div>
                    </td>

                    <td className="py-2.5 px-3 font-mono">
                      <span className="font-bold text-amber-300">{d.counterTicketsSold}</span>
                      <span className="text-slate-500"> / {d.totalSeats} সিট</span>
                    </td>

                    <td className="py-2.5 px-3 font-mono text-emerald-400 font-black">
                      ৳{d.totalFareCollectedTk.toLocaleString()}
                    </td>

                    <td className="py-2.5 px-3 font-mono text-slate-400 text-[11px]">
                      ৳{(d.dieselCostTk + d.tollCostTk).toLocaleString()}
                    </td>

                    <td className="py-2.5 px-3 text-right font-mono text-purple-300 font-extrabold">
                      ৳{d.netTripProfitTk.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. TAB: TRANSIT COUNTERS & DEPARTURE GATEPASS */}
      {activeSubTab === 'transit_counters' && (
        <div className="animate-in fade-in duration-150">
          <TransitCounterManager />
        </div>
      )}

      {/* 5. TAB: DRIVERS PERFORMANCE & BRTA VAULT */}
      {activeSubTab === 'drivers_vault' && (
        <div className="animate-in fade-in duration-150">
          <DriverPerformanceManager />
        </div>
      )}

      {/* 6. TAB: FUEL TELEMATICS & AUDIT */}
      {activeSubTab === 'fuel_audit' && (
        <div className="animate-in fade-in duration-150">
          <FuelTelematicsManager />
        </div>
      )}

      {/* 7. TAB: COMPLIANCE DOCUMENTS & FITNESS VAULT */}
      {activeSubTab === 'compliance_docs' && (
        <div className="animate-in fade-in duration-150">
          <ComplianceDocumentVault />
        </div>
      )}

      {/* 8. TAB: ENTERPRISE REPORTS & EXPORT HUB */}
      {activeSubTab === 'reports_audit' && (
        <div className="animate-in fade-in duration-150">
          <EnterpriseReportCenter />
        </div>
      )}

      {/* MODAL: ADD NEW CORPORATE COMPANY */}
      {isAddCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-amber-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-amber-300 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>নতুন কর্পোরেট ফ্লিট কোম্পানি অনবোর্ডিং</span>
              </h3>
              <button onClick={() => setIsAddCompanyModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewCompany} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কোম্পানির নাম (Enterprise Name) *</label>
                <input
                  type="text"
                  required
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="যেমন: শ্যামলী এন.আর ট্রাভেলস"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ফ্লিট ক্যাটাগরি *</label>
                  <select
                    value={newCompanyCategory}
                    onChange={(e) => setNewCompanyCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="bus_transit">🚌 পাবলিক বাস ট্রানজিট</option>
                    <option value="cargo_logistics">🚛 কার্গো ও ডিস্ট্রিবিউশন</option>
                    <option value="courier_delivery">🛵 কুরিয়ার ও ডেলিভারি</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">প্রাথমিক গাড়ির সংখ্যা *</label>
                  <input
                    type="number"
                    required
                    value={newCompanyVehiclesCount}
                    onChange={(e) => setNewCompanyVehiclesCount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">যোগাযোগ কর্মকর্তা *</label>
                  <input
                    type="text"
                    required
                    value={newCompanyContact}
                    onChange={(e) => setNewCompanyContact(e.target.value)}
                    placeholder="ফ্লিট ইনচার্জ"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={newCompanyPhone}
                    onChange={(e) => setNewCompanyPhone(e.target.value)}
                    placeholder="01711-XXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">হেড অফিস ও গ্যারেজ ঠিকানা</label>
                <input
                  type="text"
                  value={newCompanyOffice}
                  onChange={(e) => setNewCompanyOffice(e.target.value)}
                  placeholder="যেমন: সায়েদাবাদ বাস টার্মিনাল, ঢাকা"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCompanyModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-xs shadow-lg shadow-amber-600/30"
                >
                  সংরক্ষণ ও অনবোর্ড
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ⚡ 1-CLICK DEVICE & M2M SIM BUNDLER MODAL */}
      <DeviceSimBundlerModal
        isOpen={isBundlerModalOpen}
        onClose={() => setIsBundlerModalOpen(false)}
        initialTargetTier="fleet_company"
        initialCompanyName="হানিফ এন্টারপ্রাইজ বাস ফ্লিট"
      />

    </div>
  );
};
