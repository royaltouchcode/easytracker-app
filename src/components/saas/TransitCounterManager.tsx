import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Bus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  FileText, 
  UserCheck,
  X,
  Navigation,
  ArrowRight,
  Truck,
  Package,
  Radio,
  Download,
  PhoneCall,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Sparkles,
  RefreshCw,
  Eye,
  SlidersHorizontal,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface TransitCounter {
  id: string;
  nameBn: string;
  cityBn: string;
  supervisorName: string;
  supervisorPhone: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  activeDeparturesToday: number;
  type: 'BUS_TERMINAL' | 'CARGO_DEPOT';
}

export interface BusTripSchedule {
  id: string;
  coachNumber: string;
  vehiclePlate: string;
  routeTitleBn: string;
  originCounter: string;
  destinationCounter: string;
  scheduledDeparture: string;
  actualDeparture?: string;
  delayMinutes: number;
  supervisorGatepass: string;
  passengerCount: number;
  driverName?: string;
  status: 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'DELAYED';
  isAutoDetected?: boolean;
}

export interface CargoWaybill {
  id: string;
  waybillNumber: string;
  truckPlate: string;
  cargoType: string;
  weightTons: number;
  consignorDepot: string;
  consigneeHub: string;
  consigneeName: string;
  consigneePhone: string;
  driverName: string;
  driverPhone: string;
  sealNumber: string;
  dispatchTime: string;
  estimatedArrival: string;
  actualArrival?: string;
  status: 'LOADING' | 'IN_TRANSIT' | 'DELIVERED' | 'CUSTOMS_HOLD';
  isAutoDetected?: boolean;
}

export const INITIAL_COUNTERS: TransitCounter[] = [
  {
    id: 'cnt_1',
    nameBn: 'গাবতলী সেন্ট্রাল বাস টার্মিনাল কাউন্টার',
    cityBn: 'ঢাকা',
    supervisorName: 'মোঃ শফিকুল আলম',
    supervisorPhone: '01711-889900',
    latitude: 23.7788,
    longitude: 90.3444,
    radiusMeters: 150,
    activeDeparturesToday: 28,
    type: 'BUS_TERMINAL'
  },
  {
    id: 'cnt_2',
    nameBn: 'মহাখালী আন্তঃজেলা বাস টার্মিনাল',
    cityBn: 'ঢাকা',
    supervisorName: 'আব্দুর রাজ্জাক',
    supervisorPhone: '01822-771122',
    latitude: 23.7776,
    longitude: 90.4005,
    radiusMeters: 180,
    activeDeparturesToday: 34,
    type: 'BUS_TERMINAL'
  },
  {
    id: 'cnt_3',
    nameBn: 'সায়েদাবাদ বাস টার্মিনাল কাউন্টার',
    cityBn: 'ঢাকা',
    supervisorName: 'মো: জসীম উদ্দিন',
    supervisorPhone: '01933-445566',
    latitude: 23.7147,
    longitude: 90.4285,
    radiusMeters: 200,
    activeDeparturesToday: 42,
    type: 'BUS_TERMINAL'
  },
  {
    id: 'cnt_4',
    nameBn: 'দামপাড়া / জিইসি বাস কাউন্টার',
    cityBn: 'চট্টগ্রাম',
    supervisorName: 'কামাল হোসেন',
    supervisorPhone: '01611-998877',
    latitude: 22.3592,
    longitude: 91.8215,
    radiusMeters: 120,
    activeDeparturesToday: 26,
    type: 'BUS_TERMINAL'
  },
  {
    id: 'cnt_5',
    nameBn: 'তেজগাঁও সেন্ট্রাল কার্গো ডিপো ও ফ্রেইট ইয়ার্ড',
    cityBn: 'ঢাকা',
    supervisorName: 'ইঞ্জিঃ রফিকুল ইসলাম',
    supervisorPhone: '01712-334455',
    latitude: 23.7639,
    longitude: 90.3958,
    radiusMeters: 300,
    activeDeparturesToday: 18,
    type: 'CARGO_DEPOT'
  },
  {
    id: 'cnt_6',
    nameBn: 'চট্টগ্রাম সি-পোর্ট কনটেইনার টার্মিনাল',
    cityBn: 'চট্টগ্রাম',
    supervisorName: 'মোরশেদ চৌধুরী',
    supervisorPhone: '01819-445566',
    latitude: 22.3168,
    longitude: 91.7996,
    radiusMeters: 450,
    activeDeparturesToday: 22,
    type: 'CARGO_DEPOT'
  }
];

export const INITIAL_BUS_SCHEDULES: BusTripSchedule[] = [
  {
    id: 'trip_101',
    coachNumber: 'হানিফ স্পেশাল-৭৮',
    vehiclePlate: 'ঢাকা মেট্রো-ব ১৪-৯৯০১',
    routeTitleBn: 'ঢাকা (গাবতলী) ➔ রাজশাহী (রেলগেট)',
    originCounter: 'গাবতলী সেন্ট্রাল বাস টার্মিনাল কাউন্টার',
    destinationCounter: 'রাজশাহী শিরোইল টার্মিনাল',
    scheduledDeparture: '১১:৩০ AM',
    actualDeparture: '১১:৩৫ AM',
    delayMinutes: 5,
    supervisorGatepass: 'GP-DHK-9081',
    passengerCount: 38,
    driverName: 'মোঃ আব্দুল কুদ্দুস',
    status: 'DEPARTED',
    isAutoDetected: true
  },
  {
    id: 'trip_102',
    coachNumber: 'গ্রিন লাইন ভলভো-০৯',
    vehiclePlate: 'ঢাকা মেট্রো-ব ১১-২২৩৩',
    routeTitleBn: 'ঢাকা (সায়েদাবাদ) ➔ চট্টগ্রাম (দামপাড়া)',
    originCounter: 'সায়েদাবাদ বাস টার্মিনাল কাউন্টার',
    destinationCounter: 'দামপাড়া / জিইসি বাস কাউন্টার',
    scheduledDeparture: '১২:১৫ PM',
    delayMinutes: 0,
    supervisorGatepass: 'GP-SYD-1102',
    passengerCount: 32,
    driverName: 'মো: সাইফুল ইসলাম',
    status: 'BOARDING',
    isAutoDetected: false
  },
  {
    id: 'trip_103',
    coachNumber: 'এনা পরিবহন স্ক্যানিয়া',
    vehiclePlate: 'ঢাকা মেট্রো-ব ১৫-৪৪৩২',
    routeTitleBn: 'ঢাকা (মহাখালী) ➔ সিলেট (কদমতলী)',
    originCounter: 'মহাখালী আন্তঃজেলা বাস টার্মিনাল',
    destinationCounter: 'সিলেট কদমতলী বাস টার্মিনাল',
    scheduledDeparture: '১২:৪৫ PM',
    delayMinutes: 0,
    supervisorGatepass: 'GP-MHK-3319',
    passengerCount: 40,
    driverName: 'জাহিদুল ইসলাম',
    status: 'SCHEDULED',
    isAutoDetected: false
  }
];

export const INITIAL_CARGO_WAYBILLS: CargoWaybill[] = [
  {
    id: 'wb_201',
    waybillNumber: 'CH-CTG-9082',
    truckPlate: 'ঢাকা মেট্রো-ট ১৮-৪৪৩২',
    cargoType: 'তৈরি পোশাক এক্সপোর্ট (RMG Consignment)',
    weightTons: 14.5,
    consignorDepot: 'তেজগাঁও সেন্ট্রাল কার্গো ডিপো ও ফ্রেইট ইয়ার্ড',
    consigneeHub: 'চট্টগ্রাম সি-পোর্ট কনটেইনার টার্মিনাল',
    consigneeName: 'এপেক্স লজিস্টিকস লিঃ (চট্টগ্রাম পোর্ট)',
    consigneePhone: '01711-223344',
    driverName: 'মোঃ ফারুক হোসেন',
    driverPhone: '01811-667788',
    sealNumber: 'SEAL-APX-8812',
    dispatchTime: '০৯:১৫ AM',
    estimatedArrival: '০৩:৩০ PM',
    status: 'IN_TRANSIT',
    isAutoDetected: true
  },
  {
    id: 'wb_202',
    waybillNumber: 'CH-BEN-3391',
    truckPlate: 'ঢাকা মেট্রো-ট ১৬-৭৮২১',
    cargoType: 'ফার্মাসিউটিক্যালস র মেটেরিয়ালস',
    weightTons: 8.2,
    consignorDepot: 'তেজগাঁও সেন্ট্রাল কার্গো ডিপো ও ফ্রেইট ইয়ার্ড',
    consigneeHub: 'বেনাপোল ল্যান্ড পোর্ট ইনল্যান্ড ডিপো',
    consigneeName: 'স্কয়ার ফার্মাসিউটিক্যালস ডিস্ট্রিবিউশন',
    consigneePhone: '01911-556677',
    driverName: 'মোঃ বাবুল মিয়া',
    driverPhone: '01722-990011',
    sealNumber: 'SEAL-SQ-9011',
    dispatchTime: '১০:৩০ AM',
    estimatedArrival: '০৫:০০ PM',
    status: 'LOADING',
    isAutoDetected: false
  }
];

interface TransitCounterManagerProps {
  isCustomerScoped?: boolean;
}

export const TransitCounterManager: React.FC<TransitCounterManagerProps> = ({ isCustomerScoped = false }) => {
  const { devices, selectedDevice, language } = useApp();

  // Determine Default Transit Engine based on Selected Vehicle Category
  const category = (selectedDevice?.category || '').toLowerCase();
  const isTruckOrCargo = category.includes('truck') || category.includes('trailer') || category.includes('pickup') || category.includes('van');

  const [transitEngineMode, setTransitEngineMode] = useState<'bus' | 'cargo'>(() => {
    return isTruckOrCargo ? 'cargo' : 'bus';
  });

  const [counters, setCounters] = useState<TransitCounter[]>(() => {
    const saved = localStorage.getItem('gps_transit_counters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COUNTERS;
  });

  const [busSchedules, setBusSchedules] = useState<BusTripSchedule[]>(() => {
    const saved = localStorage.getItem('gps_bus_trip_schedules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_BUS_SCHEDULES;
  });

  const [cargoWaybills, setCargoWaybills] = useState<CargoWaybill[]>(() => {
    const saved = localStorage.getItem('gps_cargo_waybills');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CARGO_WAYBILLS;
  });

  // User View Role: Executive (Owner - Zero manual data entry, read-only analytics) vs Supervisor (Staff Dispatcher)
  const [operatorRole, setOperatorRole] = useState<'owner' | 'supervisor'>('owner');

  const [activeSubView, setActiveSubView] = useState<'schedules' | 'counters'>('schedules');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'DELAYED'>('ALL');
  const [isGpsAutoSyncing, setIsGpsAutoSyncing] = useState(false);
  const [autoSyncSuccessMsg, setAutoSyncSuccessMsg] = useState<string | null>(null);

  // Modals
  const [isAddBusModalOpen, setIsAddBusModalOpen] = useState(false);
  const [isAddCargoModalOpen, setIsAddCargoModalOpen] = useState(false);

  // Bus Form State
  const [busCoach, setBusCoach] = useState('');
  const [busPlate, setBusPlate] = useState(selectedDevice?.attributes?.plateNumber || '');
  const [busOrigin, setBusOrigin] = useState('গাবতলী সেন্ট্রাল বাস টার্মিনাল কাউন্টার');
  const [busDest, setBusDest] = useState('দামপাড়া / জিইসি বাস কাউন্টার');
  const [busTime, setBusTime] = useState('০১:৩০ PM');
  const [busPassengers, setBusPassengers] = useState(36);
  const [busDriver, setBusDriver] = useState('মোঃ রফিকুল ইসলাম');

  // Cargo Form State
  const [cargoWaybillNo, setCargoWaybillNo] = useState(`CH-DHK-${Math.floor(1000 + Math.random() * 9000)}`);
  const [cargoPlate, setCargoPlate] = useState(selectedDevice?.attributes?.plateNumber || '');
  const [cargoType, setCargoType] = useState('তৈরি পোশাক এক্সপোর্ট (RMG Goods)');
  const [cargoWeight, setCargoWeight] = useState(12.5);
  const [cargoConsignor, setCargoConsignor] = useState('তেজগাঁও সেন্ট্রাল কার্গো ডিপো ও ফ্রেইট ইয়ার্ড');
  const [cargoConsigneeHub, setCargoConsigneeHub] = useState('চট্টগ্রাম সি-পোর্ট কনটেইনার টার্মিনাল');
  const [cargoConsigneeName, setCargoConsigneeName] = useState('স্টার শিপিং অ্যান্ড লজিস্টিকস');
  const [cargoDriver, setCargoDriver] = useState('মোঃ ফারুক হোসেন');
  const [cargoDriverPhone, setCargoDriverPhone] = useState('01700-112233');

  // Save Bus Schedule
  const handleSaveBusSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busCoach.trim() || !busPlate.trim()) return;

    const newTrip: BusTripSchedule = {
      id: `trip_${Date.now().toString().slice(-4)}`,
      coachNumber: busCoach.trim(),
      vehiclePlate: busPlate.trim(),
      routeTitleBn: `${busOrigin.split(' ')[0]} ➔ ${busDest.split(' ')[0]}`,
      originCounter: busOrigin,
      destinationCounter: busDest,
      scheduledDeparture: busTime,
      delayMinutes: 0,
      supervisorGatepass: `GP-${Date.now().toString().slice(-4)}`,
      passengerCount: Number(busPassengers),
      driverName: busDriver.trim(),
      status: 'SCHEDULED',
      isAutoDetected: false
    };

    const updated = [newTrip, ...busSchedules];
    setBusSchedules(updated);
    localStorage.setItem('gps_bus_trip_schedules', JSON.stringify(updated));
    setIsAddBusModalOpen(false);
  };

  // Save Cargo Waybill
  const handleSaveCargoWaybill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cargoWaybillNo.trim() || !cargoPlate.trim()) return;

    const newWaybill: CargoWaybill = {
      id: `wb_${Date.now().toString().slice(-4)}`,
      waybillNumber: cargoWaybillNo.trim(),
      truckPlate: cargoPlate.trim(),
      cargoType: cargoType.trim(),
      weightTons: Number(cargoWeight),
      consignorDepot: cargoConsignor,
      consigneeHub: cargoConsigneeHub,
      consigneeName: cargoConsigneeName.trim(),
      consigneePhone: '01811-223344',
      driverName: cargoDriver.trim(),
      driverPhone: cargoDriverPhone.trim(),
      sealNumber: `SEAL-${Date.now().toString().slice(-4)}`,
      dispatchTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedArrival: '০৬:০০ PM',
      status: 'LOADING',
      isAutoDetected: false
    };

    const updated = [newWaybill, ...cargoWaybills];
    setCargoWaybills(updated);
    localStorage.setItem('gps_cargo_waybills', JSON.stringify(updated));
    setIsAddCargoModalOpen(false);
  };

  // 1-Click Simulated GPS Geofence Auto-Detection Engine
  const triggerGpsAutoSync = () => {
    setIsGpsAutoSyncing(true);
    setAutoSyncSuccessMsg(null);

    setTimeout(() => {
      setIsGpsAutoSyncing(false);
      
      if (transitEngineMode === 'bus') {
        const updated = busSchedules.map((sch, idx) => {
          if (idx === 0) {
            return {
              ...sch,
              status: 'DEPARTED' as const,
              actualDeparture: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              delayMinutes: 2,
              isAutoDetected: true
            };
          }
          return sch;
        });
        setBusSchedules(updated);
        localStorage.setItem('gps_bus_trip_schedules', JSON.stringify(updated));
        setAutoSyncSuccessMsg('🛰️ জিপিএস জিওফেন্স অটো-ডিটেকশন সফল! টার্মিনাল এক্সিট স্বয়ংক্রিয়ভাবে রেকর্ড হয়েছে।');
      } else {
        const updated = cargoWaybills.map((wb, idx) => {
          if (idx === 0) {
            return {
              ...wb,
              status: 'IN_TRANSIT' as const,
              isAutoDetected: true
            };
          }
          return wb;
        });
        setCargoWaybills(updated);
        localStorage.setItem('gps_cargo_waybills', JSON.stringify(updated));
        setAutoSyncSuccessMsg('🛰️ জিপিএস লোডিং পয়েন্ট অটো-সিঙ্ক সম্পন্ন! চালান স্ট্যাটাস IN_TRANSIT আপডেট হয়েছে।');
      }

      setTimeout(() => setAutoSyncSuccessMsg(null), 4000);
    }, 1200);
  };

  // Filtered Bus Schedules
  const filteredBusSchedules = busSchedules.filter(sch => {
    const matchesSearch = sch.coachNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sch.vehiclePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sch.routeTitleBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (sch.driverName && sch.driverName.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;
    if (statusFilter === 'ACTIVE') return sch.status === 'BOARDING' || sch.status === 'SCHEDULED';
    if (statusFilter === 'COMPLETED') return sch.status === 'DEPARTED';
    if (statusFilter === 'DELAYED') return sch.delayMinutes > 0;
    return true;
  });

  // Filtered Cargo Waybills
  const filteredCargoWaybills = cargoWaybills.filter(wb => {
    const matchesSearch = wb.waybillNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wb.truckPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wb.cargoType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          wb.driverName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (statusFilter === 'ACTIVE') return wb.status === 'IN_TRANSIT' || wb.status === 'LOADING';
    if (statusFilter === 'COMPLETED') return wb.status === 'DELIVERED';
    if (statusFilter === 'DELAYED') return wb.status === 'CUSTOMS_HOLD';
    return true;
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Banner with Adaptive Mode Switcher */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 text-cyan-400 border border-cyan-500/50 flex items-center justify-center shadow-lg shrink-0">
              {transitEngineMode === 'bus' ? <Bus className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="font-extrabold text-base text-white">
                  {transitEngineMode === 'bus' 
                    ? '🚌 বাস ও প্যাসেঞ্জার ট্রানজিট হাব (Transit Hub)' 
                    : '📦 কার্গো, ট্রাক ও লজিস্টিকস চালান হাব (Waybill Dispatch)'}
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {transitEngineMode === 'bus' ? 'PASSENGER ERP' : 'FREIGHT LOGISTICS'}
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  🛰️ জিপিএস অটো-ডিটেক্টেড
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {transitEngineMode === 'bus'
                  ? 'কাউন্টার জিওফেন্সিং, ডিপার্চার শিডিউল, ডিলে অ্যালার্ট ও সুপারভাইজার গেটপাস ম্যানেজমেন্ট'
                  : 'ডিপো ও লোডিং পয়েন্ট, চালান ট্র্যাকিং, কার্গো ওজন, সিল নম্বর ও ডেলিভারি স্ট্যাটাস'}
              </p>
            </div>
          </div>

          {/* Mode Switchers & Role Toggle */}
          <div className="flex items-center space-x-2 flex-wrap self-end lg:self-auto">
            {/* Transit Engine Mode Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setTransitEngineMode('bus')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  transitEngineMode === 'bus'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bus className="w-3.5 h-3.5" />
                <span>বাস প্যাসেঞ্জার</span>
              </button>
              <button
                type="button"
                onClick={() => setTransitEngineMode('cargo')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                  transitEngineMode === 'cargo'
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>কার্গো ও চালান</span>
              </button>
            </div>

            {/* Operator Role Switcher */}
            <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setOperatorRole('owner')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center space-x-1 ${
                  operatorRole === 'owner'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="কোম্পানি মালিক মোড (Zero manual input, read-only analytics)"
              >
                <Eye className="w-3 h-3" />
                <span>মালিক ভিউ</span>
              </button>
              <button
                type="button"
                onClick={() => setOperatorRole('supervisor')}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition flex items-center space-x-1 ${
                  operatorRole === 'supervisor'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="কাউন্টার সুপারভাইজার ও গেটপাস মোড"
              >
                <UserCheck className="w-3 h-3" />
                <span>সুপারভাইজার</span>
              </button>
            </div>
          </div>
        </div>

        {/* GPS Auto-Detection & Action Row */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2 text-xs">
            <button
              type="button"
              onClick={triggerGpsAutoSync}
              disabled={isGpsAutoSyncing}
              className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold flex items-center space-x-1.5 transition active:scale-95 disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGpsAutoSyncing ? 'animate-spin' : ''}`} />
              <span>{isGpsAutoSyncing ? 'জিপিএস সিঙ্ক হচ্ছে...' : '🛰️ জিপিএস জিওফেন্স অটো-ডিটেকশন'}</span>
            </button>

            {autoSyncSuccessMsg && (
              <span className="text-[11px] text-emerald-400 font-bold animate-in fade-in flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{autoSyncSuccessMsg}</span>
              </span>
            )}
          </div>

          {operatorRole === 'supervisor' && (
            <button
              type="button"
              onClick={() => transitEngineMode === 'bus' ? setIsAddBusModalOpen(true) : setIsAddCargoModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-1.5 transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>{transitEngineMode === 'bus' ? '+ নতুন বাস ট্রিপ এন্ট্রি' : '+ নতুন কার্গো চালান এন্ট্রি'}</span>
            </button>
          )}
        </div>
      </div>

      {/* 4 KPI Executive Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-slate-400 font-bold block">
            {transitEngineMode === 'bus' ? 'মোট নিবন্ধিত কাউন্টার' : 'নিবন্ধিত ডিপো ও ফ্রেইট ইয়ার্ড'}
          </span>
          <span className="text-lg font-black text-white">
            {counters.filter(c => transitEngineMode === 'bus' ? c.type === 'BUS_TERMINAL' : c.type === 'CARGO_DEPOT').length} টি
          </span>
        </div>

        <div className="bg-slate-900 border border-cyan-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-cyan-400 font-bold block">
            {transitEngineMode === 'bus' ? 'আজকের মোট ট্রিপ' : 'মোট পরিবহনকৃত কার্গো'}
          </span>
          <span className="text-lg font-black text-cyan-300">
            {transitEngineMode === 'bus' ? `${busSchedules.length * 15} টি ডিপার্চার` : '২২.৭ টন পণ্য'}
          </span>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-emerald-400 font-bold block">
            {transitEngineMode === 'bus' ? 'অন-টাইম ডিপার্চার' : 'অন-টাইম ডেলিভারি রেট'}
          </span>
          <span className="text-lg font-black text-emerald-300">৯৬.৪% অন-টাইম</span>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-amber-400 font-bold block">
            {transitEngineMode === 'bus' ? 'বোর্ডিং / ডিপার্চার রানিং' : 'চলতি ট্রিপ ও ট্রানজিট'}
          </span>
          <span className="text-lg font-black text-amber-300">
            {transitEngineMode === 'bus' 
              ? `${busSchedules.filter(s => s.status === 'BOARDING').length} টি কোচ`
              : `${cargoWaybills.filter(w => w.status === 'IN_TRANSIT').length} টি চালান`}
          </span>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubView('schedules')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition ${
              activeSubView === 'schedules' ? 'bg-cyan-600 text-white border-cyan-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            {transitEngineMode === 'bus' 
              ? `🚌 বাস ডিপার্চার শিডিউল (${filteredBusSchedules.length})` 
              : `📦 কার্গো চালান ও ওয়েবিল (${filteredCargoWaybills.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveSubView('counters')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition ${
              activeSubView === 'counters' ? 'bg-cyan-600 text-white border-cyan-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🏢 {transitEngineMode === 'bus' ? 'কাউন্টার লোকেশন' : 'ডিপো ও ওয়্যারহাউজ'} ({counters.filter(c => transitEngineMode === 'bus' ? c.type === 'BUS_TERMINAL' : c.type === 'CARGO_DEPOT').length})
          </button>
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="সার্চ প্লেট/কোচ/রুট..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-slate-300 font-bold focus:outline-none focus:border-cyan-500"
          >
            <option value="ALL">সকল স্ট্যাটাস</option>
            <option value="ACTIVE">চলমান (Active)</option>
            <option value="COMPLETED">সম্পন্ন (Completed)</option>
            <option value="DELAYED">ডিলে / হোল্ড (Delayed)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {activeSubView === 'schedules' ? (
        transitEngineMode === 'bus' ? (
          /* BUS SCHEDULES LIST */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="space-y-2.5">
              {filteredBusSchedules.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  কোনো বাস শিডিউল পাওয়া যায়নি।
                </div>
              ) : (
                filteredBusSchedules.map((sch) => {
                  const statusBadge = 
                    sch.status === 'DEPARTED' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                    sch.status === 'BOARDING' ? 'bg-emerald-950 text-emerald-300 border-emerald-600 animate-pulse' :
                    'bg-cyan-950 text-cyan-300 border-cyan-700';

                  return (
                    <div key={sch.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 hover:border-cyan-500/40 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-white">{sch.coachNumber}</span>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">({sch.vehiclePlate})</span>
                            {sch.isAutoDetected && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center space-x-1 font-mono">
                                <Radio className="w-2.5 h-2.5" />
                                <span>GPS AUTO</span>
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-300 font-bold mt-0.5">
                            <span>{sch.routeTitleBn}</span>
                            {sch.driverName && <span className="text-slate-400 font-normal">| চালক: {sch.driverName}</span>}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${statusBadge}`}>
                            {sch.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">কাউন্টার ডিপার্চার:</span>
                          <span className="font-mono font-black text-amber-300">{sch.scheduledDeparture}</span>
                          {sch.actualDeparture && (
                            <span className="text-[9.5px] text-emerald-400 block font-mono">ছাড়ার সময়: {sch.actualDeparture}</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">যাত্রী সংখ্যা:</span>
                          <span className="font-mono font-bold text-white">{sch.passengerCount} জন</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">গেটপাস টোকেন:</span>
                          <span className="font-mono text-indigo-300">{sch.supervisorGatepass}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">ডিলে স্ট্যাটাস:</span>
                          <span className="font-mono font-bold text-emerald-400">
                            {sch.delayMinutes === 0 ? '০ মিনিট (অন-টাইম)' : `+${sch.delayMinutes} মিনিট`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* CARGO WAYBILLS LIST */
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="space-y-2.5">
              {filteredCargoWaybills.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  কোনো কার্গো চালান পাওয়া যায়নি।
                </div>
              ) : (
                filteredCargoWaybills.map((wb) => {
                  const statusBadge = 
                    wb.status === 'DELIVERED' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                    wb.status === 'IN_TRANSIT' ? 'bg-cyan-950 text-cyan-300 border-cyan-600 animate-pulse' :
                    wb.status === 'CUSTOMS_HOLD' ? 'bg-rose-950 text-rose-300 border-rose-600' :
                    'bg-amber-950 text-amber-300 border-amber-700';

                  return (
                    <div key={wb.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5 hover:border-cyan-500/40 transition">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-black text-white flex items-center space-x-1">
                              <Package className="w-3.5 h-3.5 text-cyan-400" />
                              <span>চালান নং: {wb.waybillNumber}</span>
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">({wb.truckPlate})</span>
                            {wb.isAutoDetected && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center space-x-1 font-mono">
                                <Radio className="w-2.5 h-2.5" />
                                <span>GPS AUTO</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-300 font-bold mt-0.5">
                            <span>পণ্য: {wb.cargoType}</span> • <span className="text-amber-300 font-mono">{wb.weightTons} টন</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${statusBadge}`}>
                            {wb.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 block">রুট ও গন্তব্য:</span>
                          <span className="font-bold text-white text-[11px] block">{wb.consignorDepot.split(' ')[0]} ➔ {wb.consigneeHub.split(' ')[0]}</span>
                          <span className="text-[10px] text-slate-400 font-mono">রিসিভার: {wb.consigneeName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">ডিসপ্যাচ ও ইটিএ (ETA):</span>
                          <span className="font-mono font-bold text-cyan-300 block">ছাড়ার সময়: {wb.dispatchTime}</span>
                          <span className="font-mono text-[10px] text-amber-300">সম্ভাব্য আগমন: {wb.estimatedArrival}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">চালক ও ফোন:</span>
                          <span className="font-bold text-slate-200 block">{wb.driverName}</span>
                          <span className="font-mono text-[10px] text-indigo-300">{wb.driverPhone}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block">সিকিউরিটি সিল নম্বর:</span>
                          <span className="font-mono font-bold text-emerald-400 block">{wb.sealNumber}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )
      ) : (
        /* COUNTERS & DEPOTS LIST */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {counters
            .filter(c => transitEngineMode === 'bus' ? c.type === 'BUS_TERMINAL' : c.type === 'CARGO_DEPOT')
            .map((c) => (
              <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black text-white block">{c.nameBn}</span>
                    <span className="text-[10.5px] text-cyan-400 font-bold">{c.cityBn} বিভাগ</span>
                  </div>
                  <span className="text-[9.5px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                    {c.radiusMeters}m Geofence
                  </span>
                </div>

                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">ইনচার্জ / সুপারভাইজার:</span>
                    <span className="font-bold text-slate-200">{c.supervisorName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">যোগাযোগ:</span>
                    <span className="font-mono text-indigo-300">{c.supervisorPhone}</span>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                  <span>আজকের ট্রিপ: <strong className="text-cyan-300">{c.activeDeparturesToday} টি</strong></span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <Radio className="w-3 h-3 animate-pulse" />
                    <span>GEOFENCE ACTIVE</span>
                  </span>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Add Bus Schedule Modal */}
      {isAddBusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-cyan-300 flex items-center space-x-2">
                <Bus className="w-4 h-4 text-cyan-400" />
                <span>নতুন বাস ট্রিপ শিডিউল যুক্ত করুন</span>
              </h3>
              <button onClick={() => setIsAddBusModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBusSchedule} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কোচ নম্বর / নাম *</label>
                <input
                  type="text"
                  required
                  value={busCoach}
                  onChange={(e) => setBusCoach(e.target.value)}
                  placeholder="যেমন: শ্যামলী এন আর ট্রাভেলস-০২"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">গাড়ির প্লেট নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={busPlate}
                    onChange={(e) => setBusPlate(e.target.value)}
                    placeholder="ঢাকা মেট্রো-ব ১১-XXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">চালকের নাম</label>
                  <input
                    type="text"
                    value={busDriver}
                    onChange={(e) => setBusDriver(e.target.value)}
                    placeholder="মোঃ আব্দুল কুদ্দুস"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">অরিজিন কাউন্টার</label>
                  <select
                    value={busOrigin}
                    onChange={(e) => setBusOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {counters.filter(c => c.type === 'BUS_TERMINAL').map(c => (
                      <option key={c.id} value={c.nameBn}>{c.nameBn.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">গন্তব্য কাউন্টার</label>
                  <select
                    value={busDest}
                    onChange={(e) => setBusDest(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {counters.filter(c => c.type === 'BUS_TERMINAL').map(c => (
                      <option key={c.id} value={c.nameBn}>{c.nameBn.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ডিপার্চার সময়</label>
                  <input
                    type="text"
                    value={busTime}
                    onChange={(e) => setBusTime(e.target.value)}
                    placeholder="যেমন: ১২:৩০ PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মোট যাত্রী</label>
                  <input
                    type="number"
                    value={busPassengers}
                    onChange={(e) => setBusPassengers(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddBusModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs shadow-lg shadow-cyan-600/30"
                >
                  শিডিউল সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Cargo Waybill Modal */}
      {isAddCargoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-cyan-300 flex items-center space-x-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <span>নতুন কার্গো চালান ও ডিসপ্যাচ যুক্ত করুন</span>
              </h3>
              <button onClick={() => setIsAddCargoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCargoWaybill} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">চালান / ওয়েবিল নং *</label>
                  <input
                    type="text"
                    required
                    value={cargoWaybillNo}
                    onChange={(e) => setCargoWaybillNo(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ট্রাক / কাভার্ড ভ্যান প্লেট *</label>
                  <input
                    type="text"
                    required
                    value={cargoPlate}
                    onChange={(e) => setCargoPlate(e.target.value)}
                    placeholder="ঢাকা মেট্রো-ট ১৮-XXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">পণ্যের ধরন ও বিবরণ</label>
                <input
                  type="text"
                  required
                  value={cargoType}
                  onChange={(e) => setCargoType(e.target.value)}
                  placeholder="যেমন: তৈরি পোশাক এক্সপোর্ট (RMG Goods)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ওজন (টন)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={cargoWeight}
                    onChange={(e) => setCargoWeight(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">রিসিভার / ক্লায়েন্ট নাম</label>
                  <input
                    type="text"
                    value={cargoConsigneeName}
                    onChange={(e) => setCargoConsigneeName(e.target.value)}
                    placeholder="এপেক্স লজিস্টিকস"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">চালকের নাম</label>
                  <input
                    type="text"
                    value={cargoDriver}
                    onChange={(e) => setCargoDriver(e.target.value)}
                    placeholder="মোঃ ফারুক হোসেন"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">চালকের ফোন</label>
                  <input
                    type="text"
                    value={cargoDriverPhone}
                    onChange={(e) => setCargoDriverPhone(e.target.value)}
                    placeholder="01700-112233"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddCargoModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs shadow-lg shadow-cyan-600/30"
                >
                  চালান সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
