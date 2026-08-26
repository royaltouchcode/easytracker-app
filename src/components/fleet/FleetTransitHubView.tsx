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
  LogOut
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
    user?.role === 'supervisor' || 
    user?.role === 'driver' || 
    user?.role === 'lineman' ||
    (user as any)?.assigned ||
    /^[0-9\-\+]+@/.test(user?.email || '')
  );
  const isDriver = isStaffUser && (user?.role === 'driver' || user?.name?.includes('কুদ্দুস') || (user as any)?.assigned?.includes('ঢাকা মেট্রো-ব'));
  const isLineman = isStaffUser && !isDriver && (user?.role === 'lineman' || user?.name?.includes('লাইনম্যান') || user?.name?.includes('শফিকুল'));
  const staffTerminalOrBus = (user as any)?.assigned || (isDriver ? 'হানিফ এন্টারপ্রাইজ Hino 1J (ঢাকা মেট্রো-ব ১৪-৯৯০১)' : 'গাবতলী সেন্ট্রাল বাস টার্মিনাল');

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

              <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 flex items-center justify-center text-2xl shadow-lg shrink-0">
                {isDriver ? '👨‍✈️' : '👨‍💼'}
              </div>

              <div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <h2 className="font-black text-base text-white">
                    {isDriver ? '🚌 বাস চালক ডিজিটাল কেবিন ও ট্রিপ পোর্টাল' : '🏢 কাউন্টার লাইনম্যান ও গেটপাস পোর্টাল'}
                  </h2>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    {isDriver ? 'DRIVER ACCESS' : 'LINE SUPERVISOR'}
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

        {/* Dedicated Staff Content View */}
        {isDriver ? (
          /* ========================================================================= */
          /* 👨‍✈️ DRIVER DIGITAL CABIN VIEW                                             */
          /* ========================================================================= */
          <div className="space-y-4">
            
            {/* 1. Live Trip Telematics & Cabin Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-300 border border-blue-500/40 flex items-center justify-center text-xl">
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
                  <div className="flex items-center justify-between">
                    <span className="text-[10.5px] text-slate-400 font-bold">👥 অনবোর্ড যাত্রী:</span>
                    <button
                      type="button"
                      onClick={() => setShowBoardingLogs(!showBoardingLogs)}
                      className="text-[9.5px] text-cyan-400 hover:text-cyan-300 font-bold underline"
                    >
                      {showBoardingLogs ? 'লগ লুকান' : '📋 পিকআপ লগ'}
                    </button>
                  </div>

                  <div className="flex items-center justify-between my-1">
                    <span className="font-black text-emerald-300 text-base">
                      {onboardPassengerCount} <span className="text-xs text-slate-400 font-normal">/ ৪০ জন</span>
                    </span>

                    {/* 1-Touch Quick Highway Steppers for Conductor / Driver */}
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => updatePassengerOnboard(-1)}
                        disabled={onboardPassengerCount <= 0}
                        className="w-7 h-7 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-black text-xs flex items-center justify-center transition active:scale-90 disabled:opacity-30"
                        title="১ জন যাত্রী নামল"
                      >
                        -১
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePassengerOnboard(1)}
                        disabled={onboardPassengerCount >= 40}
                        className="px-2.5 h-7 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[11px] flex items-center justify-center space-x-1 shadow-md shadow-emerald-600/30 transition active:scale-90 disabled:opacity-30"
                        title="হাইওয়েতে ১ জন নতুন যাত্রী উঠল"
                      >
                        <span>➕ ১ জন উঠল</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Collapsible Live Boarding History Stream */}
              {showBoardingLogs && (
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs animate-in fade-in">
                  <span className="text-[10px] font-extrabold text-cyan-300 uppercase block">📋 আজকের ট্রিপের বোর্ডিং হিস্টোরি (জিপিএস অটো-লগ):</span>
                  {boardingLogs.map(log => (
                    <div key={log.id} className="flex justify-between items-center bg-slate-900/90 p-2 rounded-xl border border-slate-800/80">
                      <div>
                        <span className="text-white font-bold">{log.location}</span>
                        <span className="text-[10px] text-cyan-400 font-mono block">
                          {log.delta > 0 ? `+${log.delta} জন বোর্ডিং` : `${log.delta} জন নামল`} • বাসে মোট: {log.count} জন
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono">{log.time}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Driver Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('map')}
                  className="py-3 px-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/30 transition active:scale-95"
                >
                  <Navigation className="w-4 h-4" />
                  <span>🗺️ জিপিএস ম্যাপ নেভিগেশন</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('চালান নং #WAY-8801\nরুট: গাবতলী ➔ বগুড়া\nমোট যাত্রী: ৩৮ জন\nডিজেল লোড: ১৮০ লিটার\nস্ট্যাটাস: ইন ট্রানজিট')}
                  className="py-3 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>📋 ডিজিটাল চালান ও ওয়েবিল</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDriverSosOpen(true)}
                  className="py-3 px-3 rounded-2xl bg-rose-950/60 hover:bg-rose-900/70 text-rose-300 border border-rose-500/50 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95 shadow-md shadow-rose-950/50"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>🚨 জরুরি এক্সিডেন্ট / SOS</span>
                </button>
                <a
                  href="tel:01711889900"
                  className="py-3 px-3 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/70 text-indigo-300 border border-indigo-500/50 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4 text-indigo-400" />
                  <span>📞 কাউন্টারম্যানকে কল</span>
                </a>
              </div>
            </div>

            {/* 2. Smart Driving License Vault Card */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-indigo-500/40 rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h4 className="text-sm font-black text-white">📄 স্মার্ট ড্রাইভিং লাইসেন্স ভল্ট (BRTA ভেরিফাইড)</h4>
                </div>
                <span className="px-3 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                  🟢 লাইসেন্স বৈধ (Valid)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">লাইসেন্স নম্বর:</span>
                  <span className="font-mono font-black text-cyan-300 text-sm">{driverLicense.number}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">মেয়াদ উত্তীর্ণের তারিখ:</span>
                  <span className="font-mono font-black text-amber-300 text-sm">{driverLicense.expiryDate}</span>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">অনুমোদিত ক্যাটাগরি:</span>
                  <span className="font-bold text-white text-xs">{driverLicense.category}</span>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsLicenseModalOpen(true)}
                  className="py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>📷 লাইসেন্স ছবি ও তথ্য আপডেট করুন</span>
                </button>
              </div>
            </div>

            {/* 3. Front AI ADAS Camera & Cabin Signal Simulator */}
            <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Video className="w-5 h-5 text-purple-400" />
                  <h4 className="text-sm font-black text-white">📹 ফ্রন্ট এআই ড্যাশ-ক্যাম ও কেবিন সংকেত (ADAS Live)</h4>
                </div>
                <span className="text-[10.5px] font-mono text-purple-300 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-500/40 font-bold">
                  WATERMARK ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                গাড়ির এআই ক্যামেরা ট্রাফিক সিগন্যাল ও গতি নিরীক্ষণ করছে। নিয়ম ভাঙলে কেবিনে সতর্কবার্তা বাজবে এবং মালিকের কাছে ওয়াটারমার্কযুক্ত ভিডিও সংরক্ষিত হবে।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => triggerCabinSignal('RED_LIGHT')}
                  className="py-2.5 px-3 rounded-2xl bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <span>🚦 লাল বাতি সিগন্যাল অমান্য (টেস্ট বীপ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => triggerCabinSignal('OVERSPEED')}
                  className="py-2.5 px-3 rounded-2xl bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <span>⚡ ওভার-স্পিড অতিক্রম (টেস্ট বীপ)</span>
                </button>
              </div>
            </div>

            {/* 4. 1-Tap Inter-Connected Walkie-Talkie Dispatcher */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Radio className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-sm font-black text-white">📢 ১-ট্যাপ ওয়াকিটকি ডিসপ্যাচ ও হাইওয়ে ট্রিপ লগ</h4>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                  INSTANT DISPATCH
                </span>
              </div>

              {/* Dynamic Real-World Trip Event Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => logTripEvent('CHECKPOST')}
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-left text-xs font-bold text-slate-200 transition active:scale-95 flex items-center justify-between"
                >
                  <span>👮 পুলিশ / বিআরটিএ চেকপোস্ট</span>
                  {tripCounters.checkpost > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-black">
                      {tripCounters.checkpost} বার
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => logTripEvent('FUEL')}
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left text-xs font-bold text-slate-200 transition active:scale-95 flex items-center justify-between"
                >
                  <span>⛽ ফুয়েল / সিএনজি রিফিল</span>
                  {tripCounters.fuelRefill > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black">
                      {tripCounters.fuelRefill} বার
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => logTripEvent('JAM')}
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 text-left text-xs font-bold text-slate-200 transition active:scale-95 flex items-center justify-between"
                >
                  <span>🚦 তীব্র যানজট (&gt; ১০ মি বিলম্ব)</span>
                  {tripCounters.heavyJam > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-mono font-black">
                      {tripCounters.heavyJam} বার
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => logTripEvent('BREAK')}
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-left text-xs font-bold text-slate-200 transition active:scale-95 flex items-center justify-between"
                >
                  <span>🍱 হোটেল ও খাবার বিরতি</span>
                  {tripCounters.hotelBreak > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-black">
                      {tripCounters.hotelBreak} বার
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => logTripEvent('TOLL')}
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 text-left text-xs font-bold text-slate-200 transition active:scale-95 flex items-center justify-between"
                >
                  <span>🌉 টোল প্লাজা / ফেরি পারাপার</span>
                  {tripCounters.tollFerry > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono font-black">
                      {tripCounters.tollFerry} বার
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => logTripEvent('PASSENGER')}
                  className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-left text-xs font-bold text-slate-200 transition active:scale-95"
                >
                  <span>👥 যাত্রী ও সিট স্ট্যাটাস</span>
                </button>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => logTripEvent('ARRIVED')}
                  className="w-full py-2.5 px-3 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/50 text-emerald-300 font-extrabold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>✅ গন্তব্যে নিরাপদে পৌঁছেছি • আজকের ট্রিপ সফলভাবে সমাপ্ত</span>
                </button>
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
                {walkieMessages.map(msg => {
                  const isSenderDriver = msg.sender.includes('চালক') || msg.roleType === 'driver';
                  const isSenderLineman = msg.sender.includes('লাইনম্যান') || msg.roleType === 'lineman';

                  return (
                    <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
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
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 👨‍💼 SUPERVISOR / LINEMAN VIEW                                             */
          /* ========================================================================= */
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{staffTerminalOrBus}</h3>
                    <span className="text-xs text-slate-400">টার্মিনাল লাইনম্যান ও বাস ডিপার্চার গেটপাস কন্ট্রোল</span>
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
                  {!isLineman && (
                    <button
                      type="button"
                      onClick={() => setIsCrashAlertModalOpen(true)}
                      className="py-1.5 px-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center space-x-1 transition shadow-sm"
                      title="জরুরি দুর্ঘটনার ভিডিও অডিট"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span>🚨 এক্সসিডেন্ট এলার্ট ভিউয়ার</span>
                    </button>
                  )}
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
