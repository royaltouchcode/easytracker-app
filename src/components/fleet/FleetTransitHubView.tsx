import React, { useState } from 'react';
import { 
  Building2, 
  Bus, 
  Truck, 
  FileText, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Webhook, 
  ArrowLeft,
  UserCheck,
  Zap,
  Radio,
  Clock,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Eye,
  Phone,
  Power,
  Upload,
  ShieldAlert,
  Volume2,
  Video,
  Send,
  MessageSquare,
  AlertTriangle,
  X,
  Check,
  KeyRound,
  LogOut,
  BarChart3
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransitCounterManager } from '../saas/TransitCounterManager';
import { ComplianceDocumentVault } from '../saas/ComplianceDocumentVault';
import { DriverPerformanceManager } from '../saas/DriverPerformanceManager';
import { VehicleIcon } from '../../utils/vehicleIcons';
import { Device, Position } from '../../types/traccar';

const DEMO_TRANSIT_FLEET: Device[] = [
  {
    id: 801,
    name: 'হানিফ এন্টারপ্রাইজ Hino 1J (ঢাকা মেট্রো-ব ১৪-৯৯০১)',
    uniqueId: '864720058291801',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'bus',
    phone: '+8801712334455',
    attributes: {
      color: '#0284c7',
      plateNumber: 'ঢাকা মেট্রো-ব ১৪-৯৯০১',
      driverName: 'মোঃ আব্দুল কুদ্দুস',
      driverPhone: '01712-334455',
      route: 'গাবতলী টার্মিনাল ➔ বগুড়া',
      locationName: 'ঢাকা-ময়মনসিংহ হাইওয়ে (ইন ট্রানজিট)',
      speedLimit: 80,
      initialOdometerKm: 142000,
      initialFuelLiters: 180
    }
  },
  {
    id: 802,
    name: 'শ্যামলী পরিবহন Scania (ঢাকা মেট্রো-ব ১৫-৪২৩১)',
    uniqueId: '864720058291802',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'bus',
    phone: '+8801799887766',
    attributes: {
      color: '#059669',
      plateNumber: 'ঢাকা মেট্রো-ব ১৫-৪২৩১',
      driverName: 'মোঃ রফিকুল ইসলাম',
      driverPhone: '01799-887766',
      route: 'সায়েদাবাদ ➔ চট্টগ্রাম জিইসি মোড়',
      locationName: 'ঢাকা-চট্টগ্রাম এক্সপ্রেসওয়ে (মেঘনা ব্রিজ)',
      speedLimit: 80,
      initialOdometerKm: 98000,
      initialFuelLiters: 220
    }
  },
  {
    id: 803,
    name: 'Tata 1615 Cargo Truck (ঢাকা মেট্রো-ট ২৭-৮৫৭৮)',
    uniqueId: '864720058291803',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'truck',
    phone: '+8801700112233',
    attributes: {
      color: '#d97706',
      plateNumber: 'ঢাকা মেট্রো-ট ২৭-৮৫৭৮',
      driverName: 'মোঃ ফারুক হোসেন',
      driverPhone: '01700-112233',
      route: 'তেজগাঁও সেন্ট্রাল ডিপো ➔ খুলনা ঘাট',
      locationName: 'পদ্মা সেতু এক্সপ্রেসওয়ে লিংক (রানিং)',
      speedLimit: 60,
      initialOdometerKm: 115000,
      initialFuelLiters: 140
    }
  },
  {
    id: 804,
    name: 'Mahindra Bolero Pickup (ঢাকা মেট্রো-ন ১২-৩৪৫৬)',
    uniqueId: '864720058291804',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'pickup',
    phone: '+8801733445566',
    attributes: {
      color: '#4f46e5',
      plateNumber: 'ঢাকা মেট্রো-ন ১২-৩৪৫৬',
      driverName: 'মোঃ কামাল হোসেন',
      driverPhone: '01733-445566',
      route: 'উত্তরা এক্সপ্রেস ➔ গাজীপুর চৌরাস্তা',
      locationName: 'বিমানবন্দর রোড (কাওলা মোড়)',
      speedLimit: 70,
      initialOdometerKm: 54000,
      initialFuelLiters: 45
    }
  },
  {
    id: 805,
    name: 'Toyota HiAce Ambulance (ঢাকা মেট্রো-ছ ১১-৯৮২০)',
    uniqueId: '864720058291805',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'ambulance',
    phone: '+8801744556677',
    attributes: {
      color: '#ef4444',
      plateNumber: 'ঢাকা মেট্রো-ছ ১১-৯৮২০',
      driverName: 'মোঃ শহিদুল আলম',
      driverPhone: '01744-556677',
      route: 'ঢাকা মেডিকেল ➔ পিজি হাসপাতাল',
      locationName: 'শাহবাগ মোড় ইন্টারসেকশন',
      speedLimit: 90,
      initialOdometerKm: 62100,
      initialFuelLiters: 45
    }
  }
];

export const FleetTransitHubView: React.FC = () => {
  const { 
    user,
    logout,
    devices, 
    selectedDeviceId, 
    setSelectedDeviceId, 
    selectedDevice, 
    positions, 
    setActiveTab, 
    language 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'transit_counters' | 'compliance_vault' | 'driver_performance'>('transit_counters');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'MOVING' | 'PARKED' | 'IDLE'>('ALL');

  const isStaffUser = Boolean(
    user?.email?.includes('fleetstaff') || 
    user?.role === 'manager' ||
    user?.role === 'counter_incharge' ||
    user?.role === 'vehicle_supervisor' ||
    user?.role === 'supervisor' || 
    user?.role === 'driver' || 
    user?.role === 'lineman' ||
    (user as any)?.assigned ||
    /^[0-9\-\+]+@/.test(user?.email || '')
  );
  const isManager = isStaffUser && (user?.role === 'manager' || user?.name?.includes('ম্যানেজার') || user?.name?.includes('ওসমান'));
  const isDriver = isStaffUser && !isManager && (user?.role === 'driver' || user?.name?.includes('কুদ্দুস') || (user as any)?.assigned?.includes('ঢাকা মেট্রো-ব'));
  const isVehicleSupervisor = isStaffUser && !isManager && !isDriver && (user?.role === 'vehicle_supervisor' || user?.name?.includes('সুপারভাইজার') || user?.name?.includes('শফিকুল'));
  const isCounterIncharge = isStaffUser && !isManager && !isDriver && !isVehicleSupervisor;
  
  const staffTerminalOrBus = (user as any)?.assigned || (
    isManager ? 'হানিফ এন্টারপ্রাইজ সেন্ট্রাল হেড অফিস' :
    isDriver ? 'হানিফ এন্টারপ্রাইজ Hino 1J (ঢাকা মেট্রো-ব ১৪-৯৯০১)' :
    isVehicleSupervisor ? 'হানিফ এন্টারপ্রাইজ Hino 1J (অনবোর্ড বাস)' :
    'জয়দেবপুর বাস টার্মিনাল'
  );

  // =========================================================================
  // 🏢 COMPANY OPERATIONS MANAGER SETUP HUB STATE
  // =========================================================================
  const [managerSetupTab, setManagerSetupTab] = useState<'buses' | 'drivers' | 'counters' | 'supervisors' | 'staff_pins'>('buses');
  const [managerBusesList, setManagerBusesList] = useState(() => {
    const saved = localStorage.getItem('gps_mgr_buses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, plate: 'ঢাকা মেট্রো-ব ১৪-৯৯০১', model: 'হানিফ এন্টারপ্রাইজ Hino 1J', route: 'গাবতলী ➔ বগুড়া', seats: 40, driver: 'মোঃ আব্দুল কুদ্দুস', supervisor: 'মোঃ শফিকুল আলম', status: 'IN_TRANSIT' },
      { id: 2, plate: 'ঢাকা মেট্রো-ব ১৫-৪২৩১', model: 'শ্যামলী পরিবহন Scania Multi-Axle', route: 'সায়েদাবাদ ➔ চট্টগ্রাম', seats: 40, driver: 'মোঃ রফিকুল ইসলাম', supervisor: 'মোঃ আনিসুর রহমান', status: 'READY' },
      { id: 3, plate: 'ঢাকা মেট্রো-ট ২৭-৮৫৭৮', model: 'Tata 1615 Cargo Truck', route: 'তেজগাঁও ➔ খুলনা', seats: 3, driver: 'মোঃ ফারুক হোসেন', supervisor: 'সেলফ', status: 'IN_TRANSIT' },
      { id: 4, plate: 'ঢাকা মেট্রো-ন ১২-৩৪৫৬', model: 'Mahindra Bolero Pickup', route: 'উত্তরা ➔ গাজীপুর', seats: 3, driver: 'মোঃ কামাল হোসেন', supervisor: 'সেলফ', status: 'IDLE' },
    ];
  });

  const [managerStationsList, setManagerStationsList] = useState(() => {
    const saved = localStorage.getItem('gps_mgr_stations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, name: 'জয়দেবপুর বাস টার্মিনাল', incharge: 'আব্দুর রাজ্জাক', phone: '01822-771122', pin: '4419', status: 'ACTIVE' },
      { id: 2, name: 'গাবতলী সেন্ট্রাল টার্মিনাল', incharge: 'মোঃ আশরাফুল আলম', phone: '01715-998877', pin: '3312', status: 'ACTIVE' },
      { id: 3, name: 'বগুড়া চারমাথা টার্মিনাল', incharge: 'মোঃ জহিরুল ইসলাম', phone: '01911-223344', pin: '7721', status: 'ACTIVE' },
    ];
  });

  const [managerSupervisorsList, setManagerSupervisorsList] = useState(() => {
    const saved = localStorage.getItem('gps_mgr_supervisors');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, name: 'মোঃ শফিকুল আলম', phone: '01711-889900', bus: 'ঢাকা মেট্রো-ব ১৪-৯৯০১ (হানিফ Hino 1J)', pin: '8821', status: 'ACTIVE' },
      { id: 2, name: 'মোঃ আনিসুর রহমান', phone: '01719-332211', bus: 'ঢাকা মেট্রো-ব ১৫-৪২৩১ (শ্যামলী Scania)', pin: '6610', status: 'ACTIVE' },
      { id: 3, name: 'মোঃ মোকাররম হোসেন', phone: '01811-445566', bus: 'ঢাকা মেট্রো-ব ১৬-৭৭৮৮ (গ্রীন লাইন Volvo)', pin: '2290', status: 'ACTIVE' },
    ];
  });

  // =========================================================================
  // 🧠 SMART FLEET & DRIVER INTELLIGENCE STATE
  // =========================================================================
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCrashAlertModalOpen, setIsCrashAlertModalOpen] = useState(false);
  
  // Driver License State
  const [driverLicense, setDriverLicense] = useState({
    number: 'DL-DH-884920',
    expiryDate: '2027-11-15',
    category: 'Heavy Commercial Bus',
    authority: 'BRTA Mirpur-1, Dhaka',
    status: 'VALID' as 'VALID' | 'EXPIRING_SOON' | 'EXPIRED'
  });

  // Dynamic Available Driver & Bus Pool with LocalStorage Persistence
  const [assignedDriverName, setAssignedDriverName] = useState(() => {
    return localStorage.getItem('gps_transit_driver_name') || 'মোঃ আব্দুল কুদ্দুস';
  });
  const [assignedDriverPhone, setAssignedDriverPhone] = useState(() => {
    return localStorage.getItem('gps_transit_driver_phone') || '01712-334455';
  });
  const [assignedBusPlate, setAssignedBusPlate] = useState(() => {
    return localStorage.getItem('gps_transit_bus_plate') || 'ঢাকা মেট্রো-ব ১৪-৯৯০১';
  });

  // Available Drivers Pool (Idle / Ready drivers only)
  const AVAILABLE_DRIVERS_POOL = [
    { id: 1, name: 'মোঃ আব্দুল কুদ্দুস', phone: '01712-334455', license: 'DL-DH-884920', expiry: '২০২৭-১১-১৫', status: 'VALID' },
    { id: 2, name: 'মোঃ রফিকুল ইসলাম', phone: '01799-887766', license: 'DL-CTG-541290', expiry: '২০২৮-০৩-২০', status: 'VALID' },
    { id: 3, name: 'মোঃ ফারুক হোসেন', phone: '01700-112233', license: 'DL-KH-198421', expiry: '২০২৬-০৯-০৫', status: 'EXPIRING_SOON' },
    { id: 4, name: 'মোঃ কামাল হোসেন', phone: '01733-445566', license: 'DL-GA-332901', expiry: '২০২৫-১২-৩১', status: 'EXPIRED' }
  ];

  // 1-Tap Walkie-Talkie Dispatched Messages & Real-World Trip Counters with LocalStorage Persistence
  const [tripCounters, setTripCounters] = useState(() => {
    const saved = localStorage.getItem('gps_transit_trip_counters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      checkpost: 0,
      fuelRefill: 0,
      heavyJam: 0,
      hotelBreak: 0,
      tollFerry: 0
    };
  });

  const [walkieMessages, setWalkieMessages] = useState<Array<{ id: number; sender: string; text: string; time: string; target: string; roleType?: 'driver' | 'supervisor' | 'lineman' | 'system' }>>(() => {
    const saved = localStorage.getItem('gps_transit_walkie_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, sender: '🏢 গাবতলী কাউন্টার (ইনচার্জ)', text: 'যাত্রী বোর্ডিং সম্পূর্ণ • ছাড়ার প্রস্তুতি নিন', time: '১০:২৫ AM', target: 'বাস চালক', roleType: 'supervisor' },
      { id: 2, sender: '👨‍✈️ চালক (কুদ্দুস)', text: 'বাস রেডি • গেটপাস ক্লিয়ারেন্স দিন', time: '১০:২৮ AM', target: 'লাইনম্যান', roleType: 'driver' }
    ];
  });

  // Dynamic Onboard Passenger Management with LocalStorage Persistence
  const [onboardPassengerCount, setOnboardPassengerCount] = useState(() => {
    const saved = localStorage.getItem('gps_transit_passenger_count');
    return saved ? parseInt(saved, 10) : 38;
  });

  const [boardingLogs, setBoardingLogs] = useState<Array<{ id: number; location: string; count: number; delta: number; time: string }>>(() => {
    const saved = localStorage.getItem('gps_transit_boarding_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, location: 'গাবতলী সেন্ট্রাল টার্মিনাল (১ম বোর্ডিং)', count: 30, delta: 30, time: '১০:৩০ AM' },
      { id: 2, location: 'সাভার বাজার বাসস্ট্যান্ড (সাব-কাউন্টার)', count: 35, delta: 5, time: '১১:১৫ AM' },
      { id: 3, location: 'চন্দ্রা ত্রিমোড় (হাইওয়ে পিকআপ)', count: 38, delta: 3, time: '১১:৪৫ AM' }
    ];
  });
  const [isGatepassApprovalModalOpen, setIsGatepassApprovalModalOpen] = useState(false);
  const [gatepassBatchInput, setGatepassBatchInput] = useState(onboardPassengerCount);
  const [showBoardingLogs, setShowBoardingLogs] = useState(false);

  const [isDriverSosOpen, setIsDriverSosOpen] = useState(false);

  // ADAS Cabin Alarm Simulation State
  const [cabinAlarm, setCabinAlarm] = useState<string | null>(null);

  const triggerCabinSignal = (type: 'RED_LIGHT' | 'OVERSPEED') => {
    if (type === 'RED_LIGHT') {
      setCabinAlarm('🚦 সতর্কবার্তা: লাল বাতি সিগন্যাল অতিক্রম করা হয়েছে! (Front AI Dashcam Logged)');
    } else {
      setCabinAlarm('⚡ সতর্কবার্তা: অতিরিক্ত গতি (৮০ কিমি/ঘণ্টা ছাড়িয়েছে)! গতি নিয়ন্ত্রণে আনুন।');
    }
    setTimeout(() => setCabinAlarm(null), 5000);
  };

  const sendWalkieMessage = (text: string, sender: string, target: string, roleType?: 'driver' | 'supervisor' | 'lineman' | 'system') => {
    const newMsg = {
      id: Date.now(),
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      target,
      roleType: roleType || (sender.includes('চালক') ? 'driver' : sender.includes('লাইনম্যান') ? 'lineman' : 'supervisor')
    };
    setWalkieMessages(prev => {
      const next = [newMsg, ...prev].slice(0, 30);
      try { localStorage.setItem('gps_transit_walkie_messages', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const logTripEvent = (type: 'CHECKPOST' | 'FUEL' | 'JAM' | 'BREAK' | 'TOLL' | 'PASSENGER' | 'ARRIVED') => {
    let text = '';
    const sender = `👨‍✈️ চালক (${user?.name?.split(' ')[1] || 'কুদ্দুস'})`;
    const target = 'কাউন্টার ও ওনার';

    if (type === 'CHECKPOST') {
      const next = tripCounters.checkpost + 1;
      const nextObj = { ...tripCounters, checkpost: next };
      setTripCounters(nextObj);
      try { localStorage.setItem('gps_transit_trip_counters', JSON.stringify(nextObj)); } catch (e) {}
      text = `👮 পুলিশ/বিআরটিএ চেকপোস্টে চেকিং চলছে (লগ #${next})`;
    } else if (type === 'FUEL') {
      const next = tripCounters.fuelRefill + 1;
      const nextObj = { ...tripCounters, fuelRefill: next };
      setTripCounters(nextObj);
      try { localStorage.setItem('gps_transit_trip_counters', JSON.stringify(nextObj)); } catch (e) {}
      text = `⛽ পাম্পে ফুয়েল/সিএনজি রিফিল সম্পন্ন (রিফিল #${next})`;
    } else if (type === 'JAM') {
      const next = tripCounters.heavyJam + 1;
      const nextObj = { ...tripCounters, heavyJam: next };
      setTripCounters(nextObj);
      try { localStorage.setItem('gps_transit_trip_counters', JSON.stringify(nextObj)); } catch (e) {}
      text = `🚦 হাইওয়েতে তীব্র যানজট (> ১০ মিনিট বিলম্ব) (জ্যাম রিপোর্ট #${next})`;
    } else if (type === 'BREAK') {
      const next = tripCounters.hotelBreak + 1;
      const nextObj = { ...tripCounters, hotelBreak: next };
      setTripCounters(nextObj);
      try { localStorage.setItem('gps_transit_trip_counters', JSON.stringify(nextObj)); } catch (e) {}
      text = `🍱 হাইওয়ে রেস্তোরাঁয় যাত্রী খাবার বিরতি (বিরতি #${next})`;
    } else if (type === 'TOLL') {
      const next = tripCounters.tollFerry + 1;
      const nextObj = { ...tripCounters, tollFerry: next };
      setTripCounters(nextObj);
      try { localStorage.setItem('gps_transit_trip_counters', JSON.stringify(nextObj)); } catch (e) {}
      text = `🌉 টোল প্লাজা / ফেরি পারাপারের লাইনে অপেক্ষমাণ (লগ #${next})`;
    } else if (type === 'PASSENGER') {
      text = `👥 যাত্রী সংখ্যা ও আসন স্ট্যাটাস লাইভ আপডেট জানতে অনুরোধ করা হলো`;
    } else if (type === 'ARRIVED') {
      text = `✅ গন্তব্যে নিরাপদে পৌঁছেছি • আজকের ট্রিপ সফলভাবে সমাপ্ত`;
    }

    sendWalkieMessage(text, sender, target, 'driver');
  };

  const updatePassengerOnboard = (delta: number) => {
    const nextCount = Math.max(0, Math.min(40, onboardPassengerCount + delta));
    setOnboardPassengerCount(nextCount);
    try { localStorage.setItem('gps_transit_passenger_count', String(nextCount)); } catch (e) {}

    const newLog = {
      id: Date.now(),
      location: delta > 0 ? 'হাইওয়ে স্পট পিকআপ (জিপিএস লাইভ)' : 'হাইওয়ে ড্রপ অফ (জিপিএস লাইভ)',
      count: nextCount,
      delta,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setBoardingLogs(prev => {
      const next = [newLog, ...prev];
      try { localStorage.setItem('gps_transit_boarding_logs', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    sendWalkieMessage(
      delta > 0 
        ? `👥 নতুন যাত্রী অনবোর্ড (+${delta} জন) • বাসে মোট যাত্রী: ${nextCount}/৪০ জন` 
        : `👥 যাত্রী নেমেছেন (${Math.abs(delta)} জন) • বাসে মোট যাত্রী: ${nextCount}/৪০ জন`,
      `👨‍✈️ চালক (${user?.name?.split(' ')[1] || 'কুদ্দুস'})`,
      'কাউন্টার ও ওনার',
      'driver'
    );
  };

  // =========================================================================
  // 🛡️ DEDICATED CLEAN WORK PORTAL FOR STAFF SUB-USERS (LINEMAN & DRIVER)
  // =========================================================================
  if (isStaffUser) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-5 space-y-4 select-none animate-in fade-in">
        
        {/* Cabin Alarm Banner (Live ADAS Signal) */}
        {cabinAlarm && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border-2 border-rose-500 text-white shadow-2xl flex items-center justify-between animate-bounce">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-6 h-6 text-yellow-300 animate-pulse shrink-0" />
              <span className="font-black text-sm">{cabinAlarm}</span>
            </div>
            <button 
              onClick={() => setCabinAlarm(null)}
              className="p-1 rounded-full bg-rose-800 text-white hover:bg-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Banner with Staff Persona */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="ম্যাপে ফিরে যান"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-lg shrink-0 ${
                isManager ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50' :
                isDriver ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50' :
                isVehicleSupervisor ? 'bg-amber-600/30 text-amber-300 border-amber-500/50' :
                'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
              }`}>
                {isManager ? '🏢' : isDriver ? '👨‍✈️' : isVehicleSupervisor ? '🎫' : '🏢'}
              </div>

              <div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <h2 className="font-black text-base text-white">
                    {isManager ? '🏢 কোম্পানি অপারেশনস ও ফ্লিট সেটআপ কনসোল' :
                     isDriver ? '🚌 বাস চালক ডিজিটাল কেবিন ও ককপিট' :
                     isVehicleSupervisor ? '🎫 অনবোর্ড বাস সুপারভাইজার ও প্যাসেঞ্জার ট্রানজিট পোর্টাল' :
                     '🏢 কাউন্টার ইনচার্জ ও ডিপার্চার গেটপাস পোর্টাল'}
                  </h2>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    isManager ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                    isDriver ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    isVehicleSupervisor ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {isManager ? 'OPERATIONS MANAGER' : isDriver ? 'BUS DRIVER' : isVehicleSupervisor ? 'BUS SUPERVISOR' : 'COUNTER INCHARGE'}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    🟢 DUTY ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  স্বাগতম, <strong>{user?.name || 'স্টাফ মেম্বার'}</strong> • নির্ধারিত দায়িত্ব: <strong className="text-cyan-300">{staffTerminalOrBus}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-300 font-mono font-bold border border-emerald-500/40 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>পিন ভেরিফাইড সাব-ইউজার</span>
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40 flex items-center space-x-1.5 transition active:scale-95 shadow-sm"
                title="লগআউট করুন"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🏢 1. COMPANY OPERATIONS MANAGER CONSOLE (SETUP & STAFF RBAC HUB)         */}
        {/* ========================================================================= */}
        {isManager ? (
          <div className="space-y-4 animate-in fade-in">
            {/* Top Metric Cards for Manager */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-indigo-500/30 p-3.5 rounded-2xl">
                <span className="text-[10.5px] text-slate-400 block font-bold">🚌 মোট ফ্লিট বাস:</span>
                <span className="font-black text-white text-lg">{managerBusesList.length} টি বাস</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">২টি ট্রিপে • ২টি রেডি</span>
              </div>
              <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl">
                <span className="text-[10.5px] text-slate-400 block font-bold">👨‍✈️ নিয়োজিত চালক:</span>
                <span className="font-black text-emerald-300 text-lg">{AVAILABLE_DRIVERS_POOL.length} জন</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">BRTA লাইসেন্স ভেরিফাইড</span>
              </div>
              <div className="bg-slate-900 border border-cyan-500/30 p-3.5 rounded-2xl">
                <span className="text-[10.5px] text-slate-400 block font-bold">🏢 টার্মিনাল স্টেশন:</span>
                <span className="font-black text-cyan-300 text-lg">{managerStationsList.length} টি কাউন্টার</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">গেটপাস অথরিটি সক্রিয়</span>
              </div>
              <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl">
                <span className="text-[10.5px] text-slate-400 block font-bold">🎫 বাস সুপারভাইজার:</span>
                <span className="font-black text-amber-300 text-lg">{managerSupervisorsList.length} জন</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">অনবোর্ড প্যাসেঞ্জার গাইড</span>
              </div>
            </div>

            {/* Manager Operations Sub-Navigation Tabs */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-black text-sm text-white">কোম্পানি সেটআপ ও রোল ম্যানেজমেন্ট হাব</h3>
                </div>

                <div className="flex items-center space-x-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('buses')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'buses' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🚌 বাস ও রুট
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('drivers')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'drivers' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    👨‍✈️ চালক ও লাইসেন্স
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('counters')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'counters' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🏢 কাউন্টার স্টেশন
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('supervisors')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'supervisors' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🎫 বাস সুপারভাইজার
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('staff_pins')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'staff_pins' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🔐 স্টাফ পিন ও অ্যাক্সেস
                  </button>
                </div>
              </div>

              {/* Tab 1: Buses & Routes */}
              {managerSetupTab === 'buses' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">কোম্পানির নিবন্ধিত ফ্লিট বাস ও নির্ধারিত রুটসমূহ:</span>
                    <button
                      type="button"
                      onClick={() => alert('🚌 নতুন বাস অ্যাড ফর্ম: নম্বর প্লেট, মডেল ও সিট ক্যাপাসিটি দিয়ে ফ্লিটে যুক্ত করুন।')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition active:scale-95 flex items-center space-x-1"
                    >
                      <span>➕ নতুন বাস যুক্ত করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {managerBusesList.map(b => (
                      <div key={b.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">{b.model}</span>
                            <span className="font-mono text-cyan-400 font-bold text-xs">{b.plate}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {b.seats} সিট ক্যাপাসিটি
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex items-center space-x-3 flex-wrap">
                            <span>🛣️ রুট: <strong className="text-slate-200">{b.route}</strong></span>
                            <span>👨‍✈️ চালক: <strong className="text-cyan-300">{b.driver}</strong></span>
                            <span>🎫 সুপারভাইজার: <strong className="text-amber-300">{b.supervisor}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => alert(`✏️ ${b.plate}-এর রুট বা ড্রাইভার এডিট কনসোল ওপেন হয়েছে।`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition"
                          >
                            ✏️ রুট/স্টাফ এডিট
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Drivers & BRTA Licenses */}
              {managerSetupTab === 'drivers' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">নিবন্ধিত ফ্লিট চালক ও BRTA স্মার্ট ড্রাইভিং লাইসেন্স ভল্ট:</span>
                    <button
                      type="button"
                      onClick={() => alert('👨‍✈️ নতুন চালক নিয়োগ ফর্ম: নাম, ফোন ও BRTA লাইসেন্স দিয়ে যুক্ত করুন।')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition active:scale-95 flex items-center space-x-1"
                    >
                      <span>➕ নতুন চালক যোগ করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {AVAILABLE_DRIVERS_POOL.map(d => (
                      <div key={d.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">{d.name}</span>
                            <span className="font-mono text-slate-400 text-xs">({d.phone})</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              d.status === 'VALID' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                              d.status === 'EXPIRING_SOON' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                              'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}>
                              {d.status === 'VALID' ? '🟢 বৈধ' : d.status === 'EXPIRING_SOON' ? '🟡 দ্রুত নবায়ন দরকার' : '🔴 মেয়াদোত্তীর্ণ'}
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex items-center space-x-3 flex-wrap">
                            <span>BRTA লাইসেন্স: <strong className="text-cyan-300 font-mono">{d.license}</strong></span>
                            <span>মেয়াদ: <strong className="text-slate-200 font-mono">{d.expiry}</strong></span>
                            <span>শ্রেণি: <strong>Heavy Commercial Bus</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setIsLicenseModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition"
                          >
                            📷 লাইসেন্স আপডেট
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Counter Stations */}
              {managerSetupTab === 'counters' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">টার্মিনাল টিকিট স্টেশন ও কাউন্টার ইনচার্জ সেটআপ:</span>
                    <button
                      type="button"
                      onClick={() => alert('🏢 নতুন কাউন্টার স্টেশন অ্যাড ফর্ম: টার্মিনালের নাম, ইনচার্জ ও ফোন দিয়ে যুক্ত করুন।')}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition active:scale-95 flex items-center space-x-1"
                    >
                      <span>➕ নতুন কাউন্টার যুক্ত করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {managerStationsList.map(s => (
                      <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">🏢 {s.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              গেটপাস স্টেশন
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex items-center space-x-3 flex-wrap">
                            <span>কাউন্টার ইনচার্জ: <strong className="text-cyan-300">{s.incharge}</strong></span>
                            <span>ফোন: <strong className="text-slate-200 font-mono">{s.phone}</strong></span>
                            <span>লগইন পিন: <strong className="text-amber-300 font-mono">PIN: {s.pin}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => alert(`🔑 ${s.name}-এর ইনচার্জ (${s.incharge}) এর জন্য নতুন ৪-ডিজিট পিন রিসেট করা হয়েছে।`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition"
                          >
                            🔑 পিন রিসেট
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Vehicle Supervisors */}
              {managerSetupTab === 'supervisors' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">বাসের ভেতরের সুপারভাইজার (কন্ডাক্টর/গাইড) ও গাড়ি পেয়ারিং:</span>
                    <button
                      type="button"
                      onClick={() => alert('🎫 নতুন বাস সুপারভাইজার নিয়োগ ও বাস পেয়ারিং ফর্ম।')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition active:scale-95 flex items-center space-x-1"
                    >
                      <span>➕ নতুন সুপারভাইজার যোগ করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {managerSupervisorsList.map(sup => (
                      <div key={sup.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">🎫 {sup.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              অনবোর্ড গাইড
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex items-center space-x-3 flex-wrap">
                            <span>নির্ধারিত বাস: <strong className="text-white">{sup.bus}</strong></span>
                            <span>ফোন: <strong className="text-slate-200 font-mono">{sup.phone}</strong></span>
                            <span>লগইন পিন: <strong className="text-amber-300 font-mono">PIN: {sup.pin}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => alert(`🔄 ${sup.name}-কে অন্য বাসে স্থানান্তর বা পিন পরিবর্তন অপশন।`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition"
                          >
                            🔄 বাস পেয়ারিং পরিবর্তন
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Staff PINs & RBAC Access Matrix */}
              {managerSetupTab === 'staff_pins' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">স্টাফ পিন কোড ও পারমিশন কন্ট্রোল ম্যাট্রিক্স (Role Security):</span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      SECURE PIN RBAC
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-300 border border-slate-800 rounded-2xl overflow-hidden">
                      <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">স্টাফ নাম</th>
                          <th className="p-3">রোল</th>
                          <th className="p-3">মোবাইল নম্বর</th>
                          <th className="p-3">৪-ডিজিট পিন</th>
                          <th className="p-3">নির্ধারিত দায়িত্ব</th>
                          <th className="p-3 text-right">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                        <tr>
                          <td className="p-3 font-bold text-white">মোঃ শামীম ওসমান</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">কোম্পানি ম্যানেজার</span></td>
                          <td className="p-3 font-mono">01710-001122</td>
                          <td className="p-3 font-mono font-bold text-amber-300">5501</td>
                          <td className="p-3 text-slate-400">সেন্ট্রাল হেড অফিস</td>
                          <td className="p-3 text-right"><span className="text-emerald-400 font-bold">🟢 সক্রিয়</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">আব্দুর রাজ্জাক</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">কাউন্টার ইনচার্জ</span></td>
                          <td className="p-3 font-mono">01822-771122</td>
                          <td className="p-3 font-mono font-bold text-amber-300">4419</td>
                          <td className="p-3 text-slate-400">জয়দেবপুর বাস টার্মিনাল</td>
                          <td className="p-3 text-right"><span className="text-emerald-400 font-bold">🟢 সক্রিয়</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">মোঃ শফিকুল আলম</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">বাস সুপারভাইজার</span></td>
                          <td className="p-3 font-mono">01711-889900</td>
                          <td className="p-3 font-mono font-bold text-amber-300">8821</td>
                          <td className="p-3 text-slate-400">হানিফ Hino 1J (অনবোর্ড)</td>
                          <td className="p-3 text-right"><span className="text-emerald-400 font-bold">🟢 সক্রিয়</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">মোঃ আব্দুল কুদ্দুস</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">বাস চালক</span></td>
                          <td className="p-3 font-mono">01712-334455</td>
                          <td className="p-3 font-mono font-bold text-amber-300">9081</td>
                          <td className="p-3 text-slate-400">ঢাকা মেট্রো-ব ১৪-৯৯০১</td>
                          <td className="p-3 text-right"><span className="text-emerald-400 font-bold">🟢 সক্রিয়</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Synchronized Message & Action Log Feed for Manager */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-indigo-400" />
                    <span>📢 ফ্লিটব্যাপী আন্তঃসংযুক্ত লাইভ মেসেজ ও অ্যাকশন হিস্টোরি ফিড:</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                    REAL-TIME FLEET SYNC
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto">
                  {walkieMessages.map(msg => (
                    <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-start space-x-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0 mt-0.5">
                          {msg.sender}
                        </span>
                        <span className="text-slate-200 text-xs">{msg.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isVehicleSupervisor ? (
          /* ========================================================================= */
          /* 🎫 2. ON-BOARD VEHICLE SUPERVISOR (CONDUCTOR / GUIDE) VIEW                */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600/30 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xl">
                    🎫
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">হানিফ এন্টারপ্রাইজ Hino 1J ({assignedBusPlate})</h3>
                    <span className="text-xs text-amber-300">বাসের ভেতরের সুপারভাইজার • টিকিট ও অনবোর্ড প্যাসেঞ্জার কন্ট্রোল</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs">
                    ✅ গেটপাস অনুমোদিত (কাউন্টার ক্লিয়ার)
                  </span>
                  <a
                    href="tel:01822771122"
                    className="py-1.5 px-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center space-x-1 transition active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কাউন্টার কল</span>
                  </a>
                </div>
              </div>

              {/* Big Touch Highway Passenger Stepper Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">👥 অনবোর্ড যাত্রী সংখ্যা ও সিট স্ট্যাটাস:</span>
                    <span className="text-[11px] text-slate-400">হাইওয়েতে যাত্রী ওঠা বা নামার সাথে সাথে বোতামে চাপুন।</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBoardingLogs(!showBoardingLogs)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    {showBoardingLogs ? 'পিকআপ লগ লুকান' : '📋 বিস্তারিত বোর্ডিং হিস্টোরি'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-black text-emerald-300 font-mono">{onboardPassengerCount}</span>
                    <span className="text-xs text-slate-400">/ ৪০ মোট আসন ক্যাপাসিটি</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {40 - onboardPassengerCount} আসন খালি
                    </span>
                  </div>

                  {/* Big Touch Stepper Buttons */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => updatePassengerOnboard(-1)}
                      disabled={onboardPassengerCount <= 0}
                      className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-black text-sm transition active:scale-90 disabled:opacity-30 flex items-center justify-center space-x-1 shadow-md"
                      title="যাত্রী নামল"
                    >
                      <UserMinus className="w-4 h-4" />
                      <span>➖ ১ জন নামল</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePassengerOnboard(1)}
                      disabled={onboardPassengerCount >= 40}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition active:scale-90 disabled:opacity-30 flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30"
                      title="হাইওয়েতে নতুন যাত্রী উঠল"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>➕ ১ জন উঠল</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible Boarding History Log */}
                {showBoardingLogs && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs max-h-40 overflow-y-auto animate-in fade-in">
                    <span className="text-[10.5px] font-bold text-slate-400 block">রুট বোর্ডিং হিস্টোরি (GPS অটো-ট্যাগিং):</span>
                    {boardingLogs.map(log => (
                      <div key={log.id} className="flex justify-between items-center bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-200">
                          {log.location} ({log.delta > 0 ? `+${log.delta}` : log.delta} জন)
                        </span>
                        <span className="font-mono text-emerald-400 text-[11px] font-bold">{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Highway Trip Occurrence Logging by Conductor / Supervisor */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">⚡ হাইওয়ে ট্রিপ ঘটনা ও বিরতি লগ (১-ক্লিক অটো রিপোর্ট):</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => logTripEvent('CHECKPOST')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">👮</span>
                      <span>পুলিশ / বিআরটিএ চেকপোস্ট</span>
                    </div>
                    {tripCounters.checkpost > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-black">
                        #{tripCounters.checkpost}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('FUEL')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">⛽</span>
                      <span>ফুয়েল / সিএনজি রিফিল</span>
                    </div>
                    {tripCounters.fuelRefill > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black">
                        #{tripCounters.fuelRefill}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('JAM')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🚦</span>
                      <span>তীব্র যানজট (১০+ মি বিলম্ব)</span>
                    </div>
                    {tripCounters.heavyJam > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-black">
                        #{tripCounters.heavyJam}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('BREAK')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🍱</span>
                      <span>হোটেল ও খাবার বিরতি</span>
                    </div>
                    {tripCounters.hotelBreak > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-black">
                        #{tripCounters.hotelBreak}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('TOLL')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🌉</span>
                      <span>টোল প্লাজা / ফেরি পারাপার</span>
                    </div>
                    {tripCounters.tollFerry > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] font-black">
                        #{tripCounters.tollFerry}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('ARRIVED')}
                    className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/50 text-xs font-black text-emerald-300 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>✅ গন্তব্যে সফল আগমন</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Synchronized Message & Action Log Feed */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>📢 আন্তঃসংযুক্ত লাইভ মেসেজ ও অ্যাকশন হিস্টোরি ফিড:</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                    REAL-TIME SYNC ACTIVE
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto">
                  {walkieMessages.map(msg => (
                    <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-start space-x-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 mt-0.5">
                          {msg.sender}
                        </span>
                        <span className="text-slate-200 text-xs">{msg.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isDriver ? (
          /* ========================================================================= */
          /* 👨‍✈️ 3. DRIVER DIGITAL CABIN & COCKPIT VIEW                                */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in">
            {/* 1. Live Trip Telematics & Cabin Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-xl">
                    🚌
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">হানিফ এন্টারপ্রাইজ Hino 1J</h3>
                    <span className="text-xs font-mono font-bold text-cyan-400">{assignedBusPlate}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs">
                    ⚡ ৬০ কিমি/ঘণ্টা (চলমান)
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-[10.5px] flex items-center space-x-1">
                    <Video className="w-3 h-3 text-purple-400" />
                    <span>AI ADAS সচল</span>
                  </span>
                </div>
              </div>

              {/* Trip Live Telematics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10.5px] text-slate-400 block font-bold">🛣️ নির্ধারিত রুট:</span>
                  <span className="font-extrabold text-cyan-300 text-sm block mt-0.5">গাবতলী টার্মিনাল ➔ বগুড়া</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10.5px] text-slate-400 block font-bold">📍 লাইভ অবস্থান:</span>
                  <span className="font-extrabold text-slate-100 text-xs block mt-0.5">ঢাকা-ময়মনসিংহ হাইওয়ে (টোল প্লাজা)</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10.5px] text-slate-400 font-bold">👥 অনবোর্ড যাত্রী (সুপারভাইজার নিয়ন্ত্রিত):</span>
                  <span className="font-black text-emerald-300 text-base my-0.5">
                    {onboardPassengerCount} <span className="text-xs text-slate-400 font-normal">/ ৪০ জন</span>
                  </span>
                </div>
              </div>

              {/* ADAS Cabin Beep Alarms */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                    <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>ফ্রন্ট AI ড্যাশ-ক্যাম ও কেবিন সংকেত (ADAS Live):</span>
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-mono">Real-Time Audio-Visual</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => triggerCabinAlarm('🚦 লাল বাতি সিগন্যাল অমান্য সংকেত! গতি কমান ও সিগন্যালে থামুন।')}
                    className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-left transition active:scale-95 flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>🚦 লাল বাতি সিগন্যাল বীপ টেস্ট</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerCabinAlarm('⚡ ওভার-স্পিড সতর্কতা! হাইওয়ে স্পিড লিমিট ৮০ কিমি/ঘণ্টা অতিক্রম করেছে।')}
                    className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-left transition active:scale-95 flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>⚡ ওভার-স্পিড বীপ টেস্ট</span>
                  </button>
                </div>
              </div>

              {/* BRTA Smart Driving License Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">BRTA স্মার্ট ড্রাইভিং লাইসেন্স:</span>
                    <span className="font-mono text-cyan-300 font-bold">{driverLicense.number}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[9.5px] border border-emerald-500/40">
                      🟢 বৈধ (মেয়াদ: {driverLicense.expiryDate})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLicenseModalOpen(true)}
                    className="px-3 py-1 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center space-x-1"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>লাইসেন্স আপডেট</span>
                  </button>
                </div>
              </div>

              {/* Driver Emergency SOS & Call */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setIsDriverSosOpen(true)}
                  className="py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>🚨 জরুরি এক্সিডেন্ট এসওএস পাঠান</span>
                </button>
                <a
                  href="tel:01711889900"
                  className="py-3 px-3 rounded-2xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>📞 বাস সুপারভাইজারকে কল দিন</span>
                </a>
              </div>

              {/* Synchronized Message & Action Log Feed */}
              <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800/80">
                  <span className="text-[10.5px] uppercase font-extrabold text-slate-300 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>আন্তঃসংযুক্ত লাইভ মেসেজ ও অ্যাকশন ফিড:</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    LIVE SYNC
                  </span>
                </div>
                {walkieMessages.map(msg => (
                  <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-start space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 mt-0.5">
                        {msg.sender}
                      </span>
                      <span className="text-slate-200 text-xs">{msg.text}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 🏢 4. COUNTER INCHARGE & DEPARTURE GATEPASS PORTAL                        */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{staffTerminalOrBus}</h3>
                    <span className="text-xs text-slate-400">টার্মিনাল টিকিট ইনচার্জ ও বাস ডিপার্চার গেটপাস কন্ট্রোল</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-600/30 transition active:scale-95"
                  >
                    <span>🔄 এভেইলেবল চালক ও গাড়ি অ্যাসাইন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCrashAlertModalOpen(true)}
                    className="py-1.5 px-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center space-x-1 transition shadow-sm"
                    title="জরুরি দুর্ঘটনার ভিডিও অডিট"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>🚨 এক্সসিডেন্ট এলার্ট ভিউয়ার</span>
                  </button>
                </div>
              </div>

              {/* Assigned Departure Table */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-300 block">🚌 এই টার্মিনাল থেকে ছাড়ার অপেক্ষায় থাকা বাসসমূহ:</span>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-black text-sm text-white">হানিফ এন্টারপ্রাইজ Hino 1J</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{assignedBusPlate}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">কাউন্টারে ইনসাইড</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">🟢 লাইসেন্স বৈধ</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center space-x-3 flex-wrap">
                      <span>রুট: <strong>গাবতলী ➔ বগুড়া</strong></span>
                      <span>সময়: <strong>১০:৩০ AM</strong></span>
                      <span>নিয়োজিত চালক: <strong className="text-cyan-300">{assignedDriverName} ({assignedDriverPhone})</strong></span>
                      <span>সুপারভাইজার: <strong className="text-amber-300">মোঃ শফিকুল আলম (01711-889900)</strong></span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-black border border-emerald-500/40 text-[11px]">
                        👥 অনবোর্ড যাত্রী: {onboardPassengerCount} / ৪০ জন
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end md:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsGatepassApprovalModalOpen(true)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ডিপার্চার গেটপাস অনুমোদন ({onboardPassengerCount} যাত্রী)</span>
                    </button>
                    <a
                      href={`tel:${assignedDriverPhone}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
                      title="চালককে কল দিন"
                    >
                      <Phone className="w-4 h-4 text-cyan-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 1-Tap Supervisor Walkie-Talkie Response */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">📢 চালকের সাথে কুইক ওয়ান-ট্যাপ যোগাযোগ:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => sendWalkieMessage('👥 আরও যাত্রী আসছে • অনুগ্রহ করে অল্প সময় অপেক্ষা করুন', isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)', 'বাস চালক', isLineman ? 'lineman' : 'supervisor')}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left"
                  >
                    <span>👥 আরও যাত্রী আসছে (অল্প অপেক্ষা করুন)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWalkieMessage('✅ ৩ নং প্ল্যাটফর্ম ক্লিয়ার • বাস ভেতরে নিয়ে আসুন', isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)', 'বাস চালক', isLineman ? 'lineman' : 'supervisor')}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left"
                  >
                    <span>✅ প্ল্যাটফর্ম খালি (বাস ভেতরে আনুন)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWalkieMessage('🛑 ট্রিপ ছাড়ার সময় হয়েছে • ডিপার্চারের প্রস্তুতি নিন', isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)', 'বাস চালক ও লাইনম্যান', isLineman ? 'lineman' : 'supervisor')}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left"
                  >
                    <span>🛑 ট্রিপ ছাড়ার ক্লিয়ারেন্স ও প্রস্তুতি</span>
                  </button>
                </div>
              </div>

              {/* Live Synchronized Message & Action Log Feed for Supervisor / Lineman */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>📢 আন্তঃসংযুক্ত লাইভ মেসেজ ও অ্যাকশন হিস্টোরি ফিড:</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                    REAL-TIME SYNC ACTIVE
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto">
                  {walkieMessages.length === 0 ? (
                    <div className="text-center text-slate-500 py-3 text-xs">কোনো সাম্প্রতিক অ্যাকশন লগ নেই</div>
                  ) : (
                    walkieMessages.map(msg => {
                      const isSenderDriver = msg.sender.includes('চালক') || msg.roleType === 'driver';
                      const isSenderLineman = msg.sender.includes('লাইনম্যান') || msg.roleType === 'lineman';

                      return (
                        <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                          <div className="flex items-start space-x-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 mt-0.5 ${
                              isSenderDriver ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                              isSenderLineman ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                              'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            }`}>
                              {msg.sender}
                            </span>
                            <span className="text-slate-200 text-xs">{msg.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{msg.time}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📷 MODAL 1: SMART DRIVING LICENSE VAULT & UPLOAD                           */}
        {/* ========================================================================= */}
        {isLicenseModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-black text-sm text-white">স্মার্ট ড্রাইভিং লাইসেন্স আপলোড</h3>
                </div>
                <button onClick={() => setIsLicenseModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block font-bold mb-1">ড্রাইভিং লাইসেন্স নম্বর:</label>
                  <input
                    type="text"
                    value={driverLicense.number}
                    onChange={(e) => setDriverLicense(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block font-bold mb-1">মেয়াদ উত্তীর্ণের তারিখ (Expiry Date):</label>
                  <input
                    type="date"
                    value={driverLicense.expiryDate}
                    onChange={(e) => setDriverLicense(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-dashed border-indigo-500/50 text-center space-y-2">
                  <Upload className="w-6 h-6 text-indigo-400 mx-auto" />
                  <span className="text-slate-300 font-bold block">লাইসেন্সের স্পষ্ট ছবি আপলোড করুন</span>
                  <span className="text-[10px] text-slate-500 block">JPG, PNG বা স্মার্ট কার্ড স্ক্যান কপি</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLicenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('✅ ড্রাইভিং লাইসেন্স সফলভাবে সংরক্ষিত ও বিআরটিএ ডেটাবেজে ভেরিফাই হয়েছে!');
                    setIsLicenseModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🔄 MODAL 2: DYNAMIC AVAILABLE DRIVER & BUS ASSIGNMENT                      */}
        {/* ========================================================================= */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-black text-sm text-white">এভেইলেবল চালক ও গাড়ি নির্বাচন পুল</h3>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-300 text-[11px]">
                  ড্রপডাউনে শুধুমাত্র যারা <strong>ফ্রি/উপলব্ধ (Available)</strong> আছেন তাদের নাম শো করছে (রানিং ট্রিপে থাকা চালকরা বাদ)।
                </p>

                <div className="space-y-2">
                  <label className="text-slate-400 block font-bold">চালক নির্বাচন করুন:</label>
                  {AVAILABLE_DRIVERS_POOL.map(drv => {
                    const isSelected = drv.name === assignedDriverName;
                    const isExp = drv.status === 'EXPIRED';

                    return (
                      <div
                        key={drv.id}
                        onClick={() => {
                          if (isExp) {
                            alert('⚠️ এই চালকের লাইসেন্সের মেয়াদ শেষ! অন্য চালক নির্বাচন করুন।');
                            return;
                          }
                          setAssignedDriverName(drv.name);
                          setAssignedDriverPhone(drv.phone);
                          try {
                            localStorage.setItem('gps_transit_driver_name', drv.name);
                            localStorage.setItem('gps_transit_driver_phone', drv.phone);
                          } catch (e) {}
                          sendWalkieMessage(
                            `🔄 চালক পরিবর্তন: নতুন চালক ${drv.name} (${drv.phone}) কে বাসে দায়িত্ব দেওয়া হয়েছে`,
                            isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)',
                            'ফ্লিট সিস্টেম ও চালক',
                            isLineman ? 'lineman' : 'supervisor'
                          );
                        }}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-950/70 border-cyan-500 text-white'
                            : isExp
                            ? 'bg-rose-950/20 border-rose-500/30 text-slate-400 opacity-60'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div>
                          <strong className="block text-xs">{drv.name} ({drv.phone})</strong>
                          <span className="text-[10px] text-slate-400 font-mono">লাইসেন্স: {drv.license} • মেয়াদ: {drv.expiry}</span>
                        </div>
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                          drv.status === 'VALID' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}>
                          {drv.status === 'VALID' ? '🟢 বৈধ' : '🔴 মেয়াদোত্তীর্ণ'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-black text-xs shadow-lg shadow-cyan-600/30"
                >
                  অ্যাসাইন কনফার্ম করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🚨 MODAL 3A: DRIVER EMERGENCY SOS & RESCUE CONSOLE (NO VIDEO TO DRIVER)     */}
        {/* ========================================================================= */}
        {isDriverSosOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                  <h3 className="font-black text-sm text-white">🚨 জরুরি এক্সিডেন্ট এসওএস ও রেসকিউ</h3>
                </div>
                <button onClick={() => setIsDriverSosOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 space-y-2">
                <span className="font-black text-xs text-rose-300 block flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>জরুরি সংকেত সফলভাবে পাঠানো হয়েছে!</span>
                </span>
                <p className="text-[11px] text-slate-300">
                  আপনার বাসের লাইভ জিপিএস লোকেশন (ঢাকা-ময়মনসিংহ হাইওয়ে) এবং দুর্ঘটনার জরুরি সংকেত <strong>গাবতলী কাউন্টার, বগুড়া কাউন্টার ও প্রধান কার্যালয়ে</strong> পৌঁছেছে।
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10.5px] text-slate-400">
                🔒 <strong>আইনি ও ইন্স্যুরেন্স সুরক্ষা:</strong> ড্যাশ-ক্যাম ব্ল্যাকবক্সের ১০ সেকেন্ডের ইমপ্যাক্ট ভিডিও সেন্ট্রাল ক্লাউড সার্ভার ও মালিকের ভল্টে নিরাপদে সংরক্ষিত হয়েছে।
              </div>

              {/* Emergency Hotline Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href="tel:999"
                  className="w-full py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>🚨 ৯৯৯ এম্বুলেন্স ও পুলিশ জরুরি সেবা</span>
                </a>
                <a
                  href="tel:01711889900"
                  className="w-full py-2.5 px-3 rounded-2xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>📞 কাউন্টার ইনচার্জ ও লাইনম্যান</span>
                </a>
                <a
                  href="tel:01700000000"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>📞 প্রধান কার্যালয় / ফ্লিট ওনার হটলাইন</span>
                </a>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsDriverSosOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🚨 MODAL 3B: OWNER & SUPERVISOR CRASH ALERT WITH WATERMARKED VIDEO         */}
        {/* ========================================================================= */}
        {isCrashAlertModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-5 max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                  <h3 className="font-black text-sm text-white">🚨 জরুরি এক্সিডেন্ট ব্ল্যাকবক্স এলার্ট (4.6G Impact)</h3>
                </div>
                <button onClick={() => setIsCrashAlertModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3-Way Notification Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 font-bold block">১. আপ কাউন্টার (গাবতলী):</span>
                  <span className="font-black text-white text-[11px]">✅ এলার্ট ও ভিডিও প্রেরিত</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-cyan-500/40">
                  <span className="text-[10px] text-cyan-400 font-bold block">২. ডাউন কাউন্টার (বগুড়া):</span>
                  <span className="font-black text-white text-[11px]">✅ রেসকিউ টিম অ্যাক্টিভ</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-purple-500/40">
                  <span className="text-[10px] text-purple-400 font-bold block">৩. ফ্লিট মালিক (Master):</span>
                  <span className="font-black text-white text-[11px]">✅ ক্লাউড এভিডেন্স সেভড</span>
                </div>
              </div>

              {/* Video Player Mock with Digital Watermark */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
                
                {/* On-Screen Watermark */}
                <div className="absolute top-2.5 left-2.5 text-[9.5px] font-mono text-emerald-400 bg-black/70 px-2 py-1 rounded border border-emerald-500/30 space-y-0.5 z-10">
                  <div>BUS: {assignedBusPlate}</div>
                  <div>SPEED: 62 KM/H | GPS: 23.7806°N, 90.3501°E</div>
                  <div>IMPACT: 4.6G CRASH SENSOR</div>
                  <div>TIME: 2026-08-26 16:15:00 UTC+6</div>
                </div>

                <div className="text-center z-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-rose-600/80 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/50">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 block">১০ সেকেন্ডের অটোমেটিক ব্ল্যাকবক্স ক্র্যাশ ক্লিপ</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCrashAlertModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>
                <a
                  href="tel:999"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-600/30"
                >
                  <Phone className="w-4 h-4" />
                  <span>জরুরি পুলিশ / এম্বুলেন্স (৯৯৯)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📋 MODAL 5: SUPERVISOR 1-CLICK GATEPASS & PASSENGER BATCH APPROVAL         */}
        {/* ========================================================================= */}
        {isGatepassApprovalModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-black text-sm text-white">ডিপার্চার গেটপাস ও যাত্রী অনুমোদন</h3>
                </div>
                <button onClick={() => setIsGatepassApprovalModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-white font-bold">হানিফ এন্টারপ্রাইজ Hino 1J ({assignedBusPlate})</div>
                  <div className="text-slate-400 font-mono text-[11px]">রুট: গাবতলী ➔ বগুড়া | চালক: {assignedDriverName}</div>
                </div>

                <div>
                  <label className="text-slate-300 block font-bold mb-1.5">
                    ১ম বোর্ডিং মোট যাত্রী সংখ্যা (কাউন্টার টিকিট অনুযায়ী):
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={gatepassBatchInput}
                      onChange={(e) => setGatepassBatchInput(Number(e.target.value))}
                      className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-black text-center text-lg"
                    />
                    <span className="text-slate-400 text-xs font-mono">/ ৪০ সিট ক্যাপাসিটি</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    *১ ক্লিকেই পুরো ব্যাচ সংখ্যা চালক ও মালিকের ড্যাশবোর্ডে সিঙ্ক হয়ে যাবে।
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGatepassApprovalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const approvedCount = Math.max(0, Math.min(40, gatepassBatchInput));
                    setOnboardPassengerCount(approvedCount);
                    try { localStorage.setItem('gps_transit_passenger_count', String(approvedCount)); } catch (e) {}
                    const newLog = {
                      id: Date.now(),
                      location: `${staffTerminalOrBus} (১ম বোর্ডিং গেটপাস)`,
                      count: approvedCount,
                      delta: approvedCount,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    const nextLogs = [newLog, ...boardingLogs];
                    setBoardingLogs(nextLogs);
                    try { localStorage.setItem('gps_transit_boarding_logs', JSON.stringify(nextLogs)); } catch (e) {}
                    sendWalkieMessage(
                      `✅ গেটপাস অনুমোদিত! মোট যাত্রী: ${approvedCount} জন • ট্রিপ ছাড়ার ক্লিয়ারেন্স দেওয়া হলো।`,
                      isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)',
                      'বাস চালক ও ওনার',
                      isLineman ? 'lineman' : 'supervisor'
                    );
                    alert(`✅ গেটপাস অনুমোদিত! ${approvedCount} জন যাত্রী সহ বাসটি টার্মিনাল ছাড়ার ক্লিয়ারেন্স পেয়েছে।`);
                    setIsGatepassApprovalModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
                >
                  অনুমোদন ও গেটপাস ছাড়ুন
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  const category = (selectedDevice?.category || '').toLowerCase();
  const isTruckOrCargo = category.includes('truck') || category.includes('trailer') || category.includes('pickup') || category.includes('van');

  // Combined fleet list (real commercial vehicles or full demo transit fleet)
  const combinedList = devices.some(d => (d.category || '').includes('bus') || (d.category || '').includes('truck'))
    ? devices
    : [...DEMO_TRANSIT_FLEET, ...devices.filter(d => (d.category || '').includes('motorcycle') || (d.category || '').includes('bike'))];

  // Filter fleet vehicles
  const fleetVehicles = combinedList.filter(d => {
    if (!vehicleSearch.trim()) return true;
    const q = vehicleSearch.toLowerCase();
    return d.name.toLowerCase().includes(q) || (d.attributes?.plateNumber || '').toLowerCase().includes(q);
  });

  // Calculate fleet stats
  const totalFleet = combinedList.length;
  let movingCount = 3;
  let parkedCount = 1;
  let idleCount = 1;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-5 space-y-4 select-none animate-in fade-in">
      
      {/* Top Banner with Navigation and Persona Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="ম্যাপে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 flex items-center justify-center shadow-lg shrink-0">
              {isTruckOrCargo ? <Truck className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="font-black text-base text-white">
                  🏢 ফ্লিট ও ট্রান্সপোর্টেশন অ্যাডমিন হাব (Fleet Admin)
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  ENTERPRISE FLEET
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  👔 OWNER ONLY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                লাইভ ফ্লিট রাডার, কাউন্টার জিওফেন্স, ট্রিপ ডিসপ্যাচ, সুপারভাইজার সাব-লগইন আইডি ও BRTA ভল্ট
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto text-xs">
            <span className="text-[11px] text-slate-400 font-mono">সিলেক্টেড গাড়ি:</span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-300 font-mono font-bold border border-slate-800">
              {selectedDevice?.name || 'ফ্লিট ভেহিকেল'} ({selectedDevice?.attributes?.plateNumber || 'ঢাকা মেট্রো'})
            </span>
          </div>
        </div>

        {/* 3 Main Fleet Sub-Modules */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('transit_counters')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'transit_counters'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {isTruckOrCargo ? <Truck className="w-4 h-4 text-cyan-300" /> : <Bus className="w-4 h-4 text-cyan-300" />}
            <span>{isTruckOrCargo ? '📦 কার্গো ডিপো ও চালান হাব' : '🚌 বাস কাউন্টার ও টিকেটিং API'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('compliance_vault')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'compliance_vault'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>📄 BRTA লিগ্যাল ভল্ট ও ২-টিয়ার এলার্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('driver_performance')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'driver_performance'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-300" />
            <span>👨‍✈️ ড্রাইভার লাইসেন্স ও পারফরম্যান্স</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border-amber-500/40 shadow-sm transition active:scale-95"
            title="ফ্লিট মাইলেজ, ফুয়েল ও ট্রিপ রিপোর্টস হাব"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>📊 ফ্লিট রিপোর্ট হাব</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📍 LIVE FLEET RADAR & VEHICLE-WISE STATUS GRID                            */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        
        {/* Radar Header & Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <h3 className="text-sm font-black text-white">
                📍 লাইভ ফ্লিট রাডার ও প্রতিটি গাড়ির রিয়েল-টাইম অবস্থান
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              লাইভ গতি, ইঞ্জিন স্ট্যাটাস, কাউন্টার জিওফেন্স ইনসাইড এবং ড্রাইভার যোগাযোগ
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-2 flex-wrap text-xs">
            <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-1.5">
              <span className="text-slate-400">মোট গাড়ি:</span>
              <span className="font-mono font-black text-cyan-300">{totalFleet} টি</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center space-x-1.5 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">চলমান:</span>
              <span className="font-mono font-black">{movingCount}</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-amber-950/50 border border-amber-500/40 flex items-center space-x-1.5 text-amber-300">
              <span className="font-bold">আইডল:</span>
              <span className="font-mono font-black">{idleCount}</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-1.5 text-slate-400">
              <span className="font-bold">পার্কড:</span>
              <span className="font-mono font-black">{parkedCount}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fleetVehicles.map((device) => {
            const pos = positions[device.id];
            const isBus = (device.category || '').toLowerCase().includes('bus');
            const isTruck = (device.category || '').toLowerCase().includes('truck');
            const isAmbulance = (device.category || '').toLowerCase().includes('ambulance');

            const speedKmh = pos?.speed !== undefined 
              ? Math.round(pos.speed) 
              : (device.id === 801 ? 62 : device.id === 802 ? 58 : device.id === 803 ? 46 : device.id === 805 ? 74 : (device.id === 991 ? 42 : 36));
            
            const isMoving = speedKmh > 3;
            const isIgnitionOn = pos?.attributes?.ignition !== undefined ? !!pos.attributes.ignition : true;
            const isSelected = device.id === selectedDeviceId;

            // Generate realistic terminal geofence location
            const terminalLocation = device.attributes?.locationName || (isBus 
              ? (isMoving ? '🛣️ ঢাকা-চট্টগ্রাম এক্সপ্রেসওয়ে (রানিং)' : '🏢 গাবতলী সেন্ট্রাল বাস টার্মিনাল (কাউন্টার ইনসাইড)')
              : (isTruck 
                ? '📦 পদ্মা সেতু এক্সপ্রেসওয়ে লিংক (রানিং)' 
                : isAmbulance 
                ? '🚨 শাহবাগ মোড় ইন্টারসেকশন (ইমার্জেন্সি ট্রিপ)' 
                : (isMoving ? '🛣️ ঢাকা-ময়মনসিংহ হাইওয়ে (ইন ট্রানজিট)' : '📦 তেজগাঁও সেন্ট্রাল কার্গো ডিপো')));

            const driverName = device.attributes?.driverName || 'নিয়োজিত চালক';
            const driverPhone = device.attributes?.driverPhone || '01712-XXXXXX';
            const routeName = device.attributes?.route || 'ঢাকা মেট্রো এরিয়া ট্রানজিট';

            return (
              <div 
                key={device.id}
                className={`bg-slate-950 rounded-2xl p-3.5 border transition space-y-2.5 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Row: Vehicle Name, Plate & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div 
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner"
                        style={{ backgroundColor: device.attributes?.color || '#0891b2' }}
                      >
                        <VehicleIcon type={device.category} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white truncate block">
                          {device.name}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                          {device.attributes?.plateNumber || 'ঢাকা মেট্রো'}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center space-x-1 ${
                      isMoving 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : isIgnitionOn 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isMoving ? 'bg-emerald-400 animate-pulse' : isIgnitionOn ? 'bg-amber-400' : 'bg-rose-400'}`} />
                      <span>{isMoving ? `${speedKmh} km/h` : isIgnitionOn ? 'আইডল' : 'পার্কড'}</span>
                    </span>
                  </div>

                  {/* Terminal & Geofence Status */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-xs mt-2.5">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-bold text-slate-200 leading-snug">
                        {terminalLocation}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
                      <span className="text-slate-400">ইগনিশন স্ট্যাটাস:</span>
                      <span className={`font-mono font-bold ${isIgnitionOn ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {isIgnitionOn ? '🟢 ইঞ্জিন চালু (ON)' : '🔴 ইঞ্জিন বন্ধ (OFF)'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">নিযুক্ত চালক:</span>
                      <span className="font-bold text-indigo-300">
                        {device.attributes?.driverName || 'মোঃ আব্দুল কুদ্দুস'} ({device.attributes?.driverPhone || '01712-334455'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Action Buttons */}
                <div className="pt-2 flex items-center space-x-1.5 border-t border-slate-800/80 text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      setActiveTab('map');
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-bold border border-cyan-500/40 transition active:scale-95 flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>ম্যাপে লাইভ দেখুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      setActiveTab('commands');
                    }}
                    className="py-1.5 px-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40 transition active:scale-95 flex items-center space-x-1"
                    title="রিমোট ইঞ্জিন কাটঅফ ও কমান্ড"
                  >
                    <Zap className="w-3 h-3 text-rose-400" />
                    <span className="hidden sm:inline">কাটঅফ</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Module Content (Tabs) */}
      <div className="space-y-4">
        {activeSubTab === 'transit_counters' && <TransitCounterManager isCustomerScoped={true} />}
        {activeSubTab === 'compliance_vault' && <ComplianceDocumentVault isCustomerScoped={true} />}
        {activeSubTab === 'driver_performance' && <DriverPerformanceManager isCustomerScoped={true} />}
      </div>

    </div>
  );
};
