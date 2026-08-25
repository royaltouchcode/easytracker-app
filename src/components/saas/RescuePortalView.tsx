import React, { useState } from 'react';
import { 
  Flame, 
  ArrowLeft, 
  ShieldAlert, 
  MapPin, 
  Navigation, 
  Power, 
  PhoneCall, 
  Crosshair, 
  CheckCircle2, 
  AlertOctagon,
  Radio,
  Clock,
  Zap,
  Search,
  Sliders,
  Filter,
  DollarSign,
  UserCheck,
  ShieldCheck,
  FileCheck2,
  Lock,
  Eye,
  AlertTriangle,
  Send,
  Building2,
  FileText,
  User,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UniversalSaleModal } from './UniversalSaleModal';

export interface RescueMissionRecord {
  id: string;
  deviceId: number;
  vehicleName: string;
  plate: string;
  customerName: string;
  customerPhone: string;
  fatherName: string;
  motherName: string;
  sosNumbers: string[];
  verificationMethod: 'APP_IN_SESSION' | 'HOTLINE_KYC' | 'SOS_ALTERNATE' | 'POLICE_999';
  verifiedBy: string;
  verifierRole: 'Customer Care' | 'Super Admin';
  startTime: string;
  sessionDurationMins: number;
  status: 'ACTIVE_SESSION' | 'SUCCESS' | 'PARTIAL_SUCCESS' | 'NOT_SUCCESS';
  caseNotes: string;
  policeGdNo?: string;
  policeStation?: string;
  policeBadgeId?: string;
}

export const RescuePortalView: React.FC = () => {
  const { language, setActiveTab, setCurrentRole, devices, positions, sendCommand, triggerManualAlert } = useApp();

  const [activeDistressId, setActiveDistressId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sos' | 'moving' | 'parked'>('all');
  const [engineCutSuccess, setEngineCutSuccess] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  // Verification Modal State
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'HOTLINE_KYC' | 'SOS_ALTERNATE' | 'POLICE_999' | 'APP_IN_SESSION'>('HOTLINE_KYC');
  
  // KYC Verification Form Fields
  const [kycPhone, setKycPhone] = useState('01711-223344');
  const [kycName, setKycName] = useState('Md. Rafiqul Islam');
  const [kycFather, setKycFather] = useState('Late Abdul Karim');
  const [kycMother, setKycMother] = useState('Begum Rokeya');
  const [selectedSosCaller, setSelectedSosCaller] = useState('SOS 1: +880 1812-998877 (Spouse)');
  
  // Police 999 Fields
  const [policeStation, setPoliceStation] = useState('Gulshan Police Station, DMP');
  const [policeGdNo, setPoliceGdNo] = useState('GD-2026/08/9842');
  const [policeBadgeId, setPoliceBadgeId] = useState('DMP-SI-4482');

  // Mission Resolution Modal State
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionStatus, setResolutionStatus] = useState<'SUCCESS' | 'PARTIAL_SUCCESS' | 'NOT_SUCCESS'>('SUCCESS');
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Active Missions State
  const [activeMission, setActiveMission] = useState<RescueMissionRecord | null>({
    id: 'RESCUE-2026-0824',
    deviceId: 1,
    vehicleName: 'Yamaha FZS V3 (Dhaka Metro-LA 28-9798)',
    plate: 'DHAKA METRO-LA 28-9798',
    customerName: 'Md. Rafiqul Islam',
    customerPhone: '01711-223344',
    fatherName: 'Late Abdul Karim',
    motherName: 'Begum Rokeya',
    sosNumbers: ['+880 1812-998877', '+880 1913-445566', '+880 1711-223344'],
    verificationMethod: 'HOTLINE_KYC',
    verifiedBy: 'Agent Tanvir (CC-102)',
    verifierRole: 'Customer Care',
    startTime: 'আজ রাত ১১:১৫',
    sessionDurationMins: 30,
    status: 'ACTIVE_SESSION',
    caseNotes: 'হাইজ্যাকের সংকেত পেয়ে হটলাইন KYC ভেরিফিকেশন সম্পন্ন করে ইঞ্জিন রিমোট কাট-অফ করা হয়েছে।'
  });

  // Historical Past Missions
  const [pastMissions, setPastMissions] = useState<RescueMissionRecord[]>([
    {
      id: 'RESCUE-2026-0818',
      deviceId: 3,
      vehicleName: 'Toyota HiAce Microbus',
      plate: 'DHAKA METRO-CHA 54-1122',
      customerName: 'Kazi Farhan',
      customerPhone: '01812-998877',
      fatherName: 'Kazi Nuruddin',
      motherName: 'Suraiya Begum',
      sosNumbers: ['+880 1711-000000'],
      verificationMethod: 'POLICE_999',
      verifiedBy: 'Admin Shakil',
      verifierRole: 'Super Admin',
      startTime: '18 Aug 2026, 04:30 PM',
      sessionDurationMins: 45,
      status: 'SUCCESS',
      caseNotes: 'হাইওয়ে পুলিশ ও ফিল্ড রেসকিউ টিম কুড়িল ফ্লাইওভার থেকে অক্ষত অবস্থায় গাড়ি ও যাত্রী উদ্ধার করেছে।',
      policeStation: 'Airport Thana',
      policeGdNo: 'GD-88741',
      policeBadgeId: 'SI-7741'
    }
  ]);

  const distressDevice = devices.find(d => d.id === activeDistressId) || devices[0];
  const distressPos = positions[distressDevice?.id] || Object.values(positions)[0];

  const handleExecuteEmergencyCutoff = async () => {
    await sendCommand('engineStop');
    setEngineCutSuccess(true);
    setTimeout(() => setEngineCutSuccess(false), 3000);
  };

  // Handle Authorizing a New Rescue Session
  const handleAuthorizeRescueSession = (e: React.FormEvent) => {
    e.preventDefault();
    const newMission: RescueMissionRecord = {
      id: `RESCUE-${Date.now().toString().slice(-6)}`,
      deviceId: distressDevice.id,
      vehicleName: distressDevice.name,
      plate: distressDevice.attributes?.plateNumber || 'DHAKA METRO-LA 28-9798',
      customerName: kycName,
      customerPhone: kycPhone,
      fatherName: kycFather,
      motherName: kycMother,
      sosNumbers: [
        distressDevice.attributes?.sos1 || '+880 1812-998877',
        distressDevice.attributes?.sos2 || '+880 1913-445566',
        distressDevice.attributes?.sos3 || '+880 1711-223344'
      ],
      verificationMethod: selectedMethod,
      verifiedBy: 'Active Support Specialist (CC-404)',
      verifierRole: 'Customer Care',
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sessionDurationMins: 30,
      status: 'ACTIVE_SESSION',
      caseNotes: `মেথড: ${selectedMethod} দিয়ে ভেরিফিকেশন সফল। জরুরি রেসকিউ সেশন উন্মুক্ত করা হয়েছে।`,
      policeStation: selectedMethod === 'POLICE_999' ? policeStation : undefined,
      policeGdNo: selectedMethod === 'POLICE_999' ? policeGdNo : undefined,
      policeBadgeId: selectedMethod === 'POLICE_999' ? policeBadgeId : undefined
    };

    setActiveMission(newMission);
    setIsVerificationModalOpen(false);
    triggerManualAlert('RESCUE_SESSION_ACTIVATED', `🚨 ${newMission.vehicleName} এর জন্য রেসকিউ সেশন সক্রিয় করা হয়েছে (${selectedMethod})`);
  };

  // Handle Closing and Resolving Mission
  const handleCloseAndResolveMission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMission) return;

    const resolved: RescueMissionRecord = {
      ...activeMission,
      status: resolutionStatus,
      caseNotes: `${activeMission.caseNotes} | রেজাল্ট: ${resolutionStatus}. ${resolutionNotes}`
    };

    setPastMissions([resolved, ...pastMissions]);
    setActiveMission(null);
    setIsResolveModalOpen(false);
    setResolutionNotes('');
    alert(`মিশন সফলভাবে ক্লোজ করা হয়েছে! স্ট্যাটাস: ${resolutionStatus}। গ্রাহকের কাছে অডিট রিপোর্ট পাঠানো হয়েছে।`);
  };

  // Search and Filter Vehicles
  const filteredDevices = devices.filter(dev => {
    const pos = positions[dev.id];
    const isMoving = pos?.speed && pos.speed > 5;
    const isSos = dev.id === 1 || dev.id === 3; // Simulated high alert fleet

    if (filterType === 'sos' && !isSos) return false;
    if (filterType === 'moving' && !isMoving) return false;
    if (filterType === 'parked' && isMoving) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dev.name.toLowerCase().includes(q) ||
      (dev.attributes?.plateNumber && dev.attributes.plateNumber.toLowerCase().includes(q)) ||
      (dev.attributes?.driverName && dev.attributes.driverName.toLowerCase().includes(q)) ||
      (dev.attributes?.driverPhone && dev.attributes.driverPhone.includes(q)) ||
      (dev.phone && dev.phone.includes(q)) ||
      (dev.uniqueId && dev.uniqueId.includes(q)) ||
      dev.id.toString().includes(q)
    );
  });

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-3.5 rounded-3xl shadow-md gap-3">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('map');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
          </button>
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-rose-400">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>{language === 'bn' ? 'ইমার্জেন্সি রেসকিউ ও রিকভারি টিম পোর্টাল' : 'Emergency Rescue & Recovery Force'}</span>
            </h2>
            <p className="text-[10.5px] text-slate-400">
              {language === 'bn' ? '৪-চ্যানেল ভেরিফিকেশন ডেস্ক • লাইভ সেশন ও মিশন রেজাল্ট ক্লোজিং' : '4-Channel Verification Desk • Live Session & Incident Closing'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setIsVerificationModalOpen(true)}
            className="px-3.5 py-2 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 flex items-center space-x-1.5 transition active:scale-95 animate-pulse"
          >
            <UserCheck className="w-4 h-4" />
            <span>নতুন রেসকিউ ভেরিফাই ও আনলক</span>
          </button>

          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="px-3 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md flex items-center space-x-1"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>সেলস</span>
          </button>
        </div>
      </div>

      {/* 🚨 Active Emergency Rescue Session Banner */}
      {activeMission && (
        <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 border-2 border-rose-500 rounded-3xl p-4 shadow-2xl shadow-rose-950/60 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-500/30 pb-2.5">
            <div className="flex items-center space-x-2.5">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <div className="font-black text-sm text-white flex items-center space-x-2">
                <span>🚨 সক্রিয় লাইভ রেসকিউ সেশন ({activeMission.id})</span>
                <span className="text-[9.5px] font-mono bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
                  {activeMission.sessionDurationMins} MINS REMAINING
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-[10.5px] text-slate-300 font-mono">
                ভেরিফাই করেছে: <strong className="text-amber-300">{activeMission.verifiedBy}</strong> ({activeMission.verifierRole})
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {/* 1. Vehicle & Customer KYC Box */}
            <div className="bg-slate-950/90 p-3 rounded-2xl border border-rose-500/40 space-y-1">
              <div className="text-[10px] text-slate-400 uppercase font-bold">গাড়ি ও গ্রাহকের KYC তথ্য</div>
              <div className="font-bold text-white text-sm">{activeMission.vehicleName}</div>
              <div className="text-[11px] text-slate-300 font-mono">গ্রাহক: {activeMission.customerName} ({activeMission.customerPhone})</div>
              <div className="text-[10px] text-slate-400">
                👨 পিতা: {activeMission.fatherName} • 👩 মাতা: {activeMission.motherName}
              </div>
            </div>

            {/* 2. Highlighted SOS Numbers Box */}
            <div className="bg-slate-950/90 p-3 rounded-2xl border border-amber-500/50 space-y-1 shadow-md">
              <div className="text-[10px] text-amber-300 uppercase font-bold flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>নিবন্ধিত SOS অল্টারনেট নম্বরসমূহ</span>
              </div>
              <div className="space-y-0.5 text-[10.5px] font-mono text-slate-200">
                {activeMission.sosNumbers.map((s, idx) => (
                  <div key={idx} className="flex justify-between bg-slate-900 px-2 py-0.5 rounded border border-amber-500/20">
                    <span className="text-slate-400">SOS {idx + 1}:</span>
                    <span className="text-amber-300 font-bold">{s}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Real-Time Telemetry & Action */}
            <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-2">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold">লাইভ অবস্থান ও স্পিড</div>
                <div className="text-sm font-black text-rose-400">{distressPos?.speed ? `${Math.round(distressPos.speed)} km/h` : '০ কিমি/ঘণ্টা'}</div>
                <div className="text-[10.5px] text-slate-300 truncate">{distressPos?.address || 'Gulshan-2, Dhaka'}</div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={handleExecuteEmergencyCutoff}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1 transition active:scale-95"
                >
                  <Power className="w-3.5 h-3.5" />
                  <span>{engineCutSuccess ? 'ইঞ্জিন লকড!' : 'ইঞ্জিন লক'}</span>
                </button>

                <button
                  onClick={() => setIsResolveModalOpen(true)}
                  className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1 transition active:scale-95 shadow-md shadow-emerald-600/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>মিশন ক্লোজিং</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instant Search Bar & Fleet Selector */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 কাস্টমার মোবাইল নম্বর, গাড়ির নম্বর, বা ডিভাইস IMEI দিয়ে খুঁজুন..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none shadow-md"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-[10.5px]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition shrink-0 ${
              filterType === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            সকল যানবাহন ({devices.length})
          </button>

          <button
            onClick={() => setFilterType('sos')}
            className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap flex items-center space-x-1 ${
              filterType === 'sos' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-900 text-rose-400 border border-slate-800'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>🚨 জরুরি এসওএস</span>
          </button>

          <button
            onClick={() => setFilterType('moving')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              filterType === 'moving' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 text-emerald-400 border border-slate-800'
            }`}
          >
            🚗 গতিশীল (Running)
          </button>

          <button
            onClick={() => setFilterType('parked')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              filterType === 'parked' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            🅿️ পার্কড (Parked)
          </button>
        </div>
      </div>

      {/* Emergency Distress Live Target Card */}
      <div className="bg-gradient-to-r from-rose-950/60 via-slate-900 to-slate-900 border border-rose-500/60 rounded-3xl p-4 shadow-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500 flex items-center justify-center text-rose-300 shadow-lg shadow-rose-600/30">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-sm text-rose-200 flex items-center space-x-2">
                <span>{distressDevice?.name}</span>
                <span className="text-[10px] bg-slate-900 px-1.5 py-0.2 rounded border border-rose-700 font-mono text-slate-300">
                  {distressDevice?.attributes?.plateNumber || 'DHAKA METRO-LA 11-2233'}
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                মালিক: <strong className="text-slate-200">{distressDevice?.attributes?.driverName || 'Mohammad Azhar'}</strong> • ফোন: <strong className="text-rose-300 font-mono">{distressDevice?.attributes?.driverPhone || '01700000000'}</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-rose-400 font-bold block">লাইভ গতিবেগ</span>
            <span className="text-lg font-mono font-black text-white">
              {distressPos?.speed ? `${Math.round(distressPos.speed)} km/h` : '০ কিমি/ঘণ্টা'}
            </span>
          </div>
        </div>

        {/* Live Coordinate & Address Pill */}
        <div className="bg-slate-950/90 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>সর্বশেষ চিহ্নিত লোকেশন:</span>
            </span>
            <span className="font-mono text-[10px] text-slate-300">
              {distressPos?.latitude?.toFixed(4)}, {distressPos?.longitude?.toFixed(4)}
            </span>
          </div>
          <p className="font-bold text-slate-200 text-xs">
            📍 {distressPos?.address || 'Gulshan-2, Dhaka, Bangladesh'}
          </p>
        </div>

        {/* Intercept ETA & Navigation */}
        <div className="grid grid-cols-2 gap-2 text-center text-xs">
          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400">রেসকিউ টিম দূরত্ব</div>
            <div className="font-mono font-bold text-emerald-400 text-sm mt-0.5">২.৪ কিমি</div>
          </div>

          <div className="bg-slate-900/80 p-2.5 rounded-2xl border border-slate-800">
            <div className="text-[10px] text-slate-400">আনুমানিক পৌঁছানোর সময় (ETA)</div>
            <div className="font-mono font-bold text-amber-400 text-sm mt-0.5">~৬ মিনিট</div>
          </div>
        </div>

        {/* Action Buttons: Emergency Cutoff & Police Hotline */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleExecuteEmergencyCutoff}
            className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-xl shadow-rose-600/40 flex items-center justify-center space-x-2 transition active:scale-95 border border-rose-400"
          >
            <Power className="w-4 h-4" />
            <span>{engineCutSuccess ? 'ইঞ্জিন কাটঅফ সিগন্যাল পাঠানো হয়েছে!' : 'জরুরি রিমোট ইঞ্জিন লক (Cut Engine)'}</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:999"
              className="py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
              <span>পুলিশ কন্ট্রোল (৯৯৯)</span>
            </a>

            <a
              href={distressPos?.latitude && distressPos?.longitude 
                ? `https://www.google.com/maps/dir/?api=1&destination=${distressPos.latitude},${distressPos.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(distressPos?.address || 'Dhaka, Bangladesh')}`
              }
              target="_blank"
              rel="noreferrer"
              className="py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>লাইভ ইন্টারসেপ্ট রুট</span>
            </a>
          </div>
        </div>
      </div>

      {/* Distress Vehicle Selector List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            ফিল্টারকৃত সক্রিয় যানবাহন ({filteredDevices.length})
          </span>
        </div>

        <div className="space-y-2">
          {filteredDevices.map((dev) => {
            const isSel = dev.id === activeDistressId;
            const pos = positions[dev.id];
            return (
              <button
                key={dev.id}
                onClick={() => setActiveDistressId(dev.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition text-xs ${
                  isSel ? 'bg-rose-600/20 border-rose-500/50 text-rose-300' : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-extrabold text-slate-100 flex items-center space-x-2">
                    <span>{dev.name}</span>
                    <span className="text-[9.5px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-slate-300">
                      {dev.attributes?.plateNumber || 'No Plate'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    মোবাইল: <strong className="text-slate-300 font-mono">{dev.attributes?.driverPhone || dev.phone || '01700000000'}</strong> • IMEI: {dev.uniqueId || '864720058291034'}
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold ${
                  isSel ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {isSel ? 'টার্গেট' : 'সিলেক্ট'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <UniversalSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />
    </div>
  );
};
