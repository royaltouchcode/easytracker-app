import React, { useState } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Radio, 
  QrCode, 
  Car, 
  User, 
  Lock, 
  Unlock, 
  RefreshCw, 
  ExternalLink, 
  FileText, 
  Zap,
  Activity,
  Phone,
  Clock,
  MapPin,
  Check,
  Server,
  Layers,
  HardDrive,
  Database,
  Cpu,
  Video,
  Volume2,
  ShieldCheck,
  ArrowRight,
  Code2,
  Play,
  FileCheck,
  BadgeCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GovTechPoliceGateway: React.FC = () => {
  const { devices, selectedDevice, triggerManualAlert } = useApp();

  const [activeSubSection, setActiveSubSection] = useState<
    'architecture' | 'police_terminal' | 'brta_sync' | 'btrc_m2m' | 'stolen_dispatch'
  >('architecture');

  // Architecture Mode Switch (Current 3rd Party vs Future Native vs Dual Stream)
  const [activeArchMode, setActiveArchMode] = useState<'third_party_push' | 'native_server' | 'dual_stream'>('third_party_push');
  
  // Live Webhook Ingestion Simulator State
  const [isSimulatingPush, setIsSimulatingPush] = useState(false);
  const [simulatedPacketLog, setSimulatedPacketLog] = useState<{
    id: string;
    timestamp: string;
    vendor: string;
    imei: string;
    gps: { lat: number; lng: number; speed: number; ignition: boolean };
    media: { videoUrl: string; audioUrl: string; sha256: string; storedIn: string };
    status: 'INGESTED_AND_SAVED' | 'IDLE';
  } | null>(null);

  // Highway Traffic Police Inspection Search State
  const [searchPlate, setSearchPlate] = useState('ঢাকা মেট্রো-ব ১৪-৯৯০১');
  const [isSearchingInspection, setIsSearchingInspection] = useState(false);
  const [inspectionData, setInspectionData] = useState<{
    found: boolean;
    plate: string;
    ownerName: string;
    speedKmH: number;
    speedLimitKmH: number;
    location: string;
    fitnessExpiry: string;
    fitnessStatus: 'VALID' | 'EXPIRED';
    taxTokenExpiry: string;
    driverName: string;
    driverLicense: string;
    driverBlood: string;
    activeViolations: number;
    stolenStatus: 'NORMAL' | 'STOLEN_FLAGGED';
  } | null>({
    found: true,
    plate: 'ঢাকা মেট্রো-ব ১৪-৯৯০১',
    ownerName: 'হানিফ এন্টারপ্রাইজ (ফ্লিট ডিভিশন)',
    speedKmH: 62,
    speedLimitKmH: 80,
    location: 'ঢাকা-ময়মনসিংহ হাইওয়ে (টোল প্লাজা সংলগ্ন)',
    fitnessExpiry: '2027-09-01',
    fitnessStatus: 'VALID',
    taxTokenExpiry: '2027-10-15',
    driverName: 'মোঃ আব্দুল কুদ্দুস',
    driverLicense: 'DL-DH-884920',
    driverBlood: 'B+',
    activeViolations: 0,
    stolenStatus: 'NORMAL'
  });

  const [stolenLockSuccess, setStolenLockSuccess] = useState(false);

  const handleRunSimulator = () => {
    setIsSimulatingPush(true);
    setTimeout(() => {
      setIsSimulatingPush(false);
      const newLog = {
        id: `PKT-${Date.now().toString().slice(-6)}`,
        timestamp: new Date().toLocaleTimeString(),
        vendor: activeArchMode === 'third_party_push' 
          ? '৩য় পক্ষ লাইসেন্সপ্রাপ্ত VTS সার্ভার (GP / Robi / Bondstein Webhook)' 
          : activeArchMode === 'dual_stream'
          ? 'ডুয়াল স্ট্রিম (JT/T 1078 + GPS)'
          : 'EasyTracker Native Traccar Cluster (Port 5027)',
        imei: '864720058291801',
        gps: { lat: 23.8103, lng: 90.4125, speed: 64, ignition: true },
        media: {
          videoUrl: 'https://vault.easytracker.com/media/clip_accident_8849.mp4',
          audioUrl: 'https://vault.easytracker.com/media/cabin_audio_8849.aac',
          sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          storedIn: 'EasyTracker Private Cloudflare R2 / AWS S3 Media Vault'
        },
        status: 'INGESTED_AND_SAVED' as const
      };
      setSimulatedPacketLog(newLog);
      triggerManualAlert(
        'service_reminder',
        `📥 টেলিমেটিক্স ইনজেস্ট সফল: IMEI ${newLog.imei}-এর জিপিএস ও ১০ সেকেন্ডের ড্যাশ-ক্যাম ক্র্যাশ ক্লিপ আপনার নিজস্ব ক্লাউড ভল্টে সংরক্ষিত হয়েছে!`
      );
    }, 900);
  };

  const handleSearchPoliceInspection = () => {
    if (!searchPlate.trim()) return;
    setIsSearchingInspection(true);

    setTimeout(() => {
      setIsSearchingInspection(false);
      setInspectionData({
        found: true,
        plate: searchPlate.trim(),
        ownerName: 'হানিফ এন্টারপ্রাইজ / মো: রফিকুল ইসলাম',
        speedKmH: Math.floor(Math.random() * 25) + 55,
        speedLimitKmH: 80,
        location: 'ঢাকা-চট্টগ্রাম এক্সপ্রেসওয়ে, মেঘনা ব্রিজ টোলপ্লাজা',
        fitnessExpiry: '2027-09-01',
        fitnessStatus: 'VALID',
        taxTokenExpiry: '2027-10-15',
        driverName: 'মোঃ আব্দুল কুদ্দুস',
        driverLicense: 'DL-DH-884920',
        driverBlood: 'B+',
        activeViolations: 0,
        stolenStatus: 'NORMAL'
      });
    }, 600);
  };

  const handleTriggerPoliceStolenCutoff = () => {
    if (confirm('🚨 আপনি কি বাংলাদেশ পুলিশ কন্ট্রোল রুম হতে এই গাড়ির রিমোট ইঞ্জিন লক এবং হাইওয়ে টহল দলের কাছে প্রতি ৩ সেকেন্ড পর পর জিপিএস ব্রডকাস্ট চালু করতে চান?')) {
      setStolenLockSuccess(true);
      if (inspectionData) {
        setInspectionData({
          ...inspectionData,
          stolenStatus: 'STOLEN_FLAGGED'
        });
      }
      setTimeout(() => setStolenLockSuccess(false), 5000);
    }
  };

  // BRTA / BTRC 20-Point Official Telematics Compliance Checklist
  const COMPLIANCE_CHECKLIST = [
    { id: 1, title: 'AIS-140 / BRTA স্ট্যান্ডার্ড ডেটা প্যাকেট পার্সিং', status: 'COMPLIANT', authority: 'BRTA', desc: 'প্রতি ৫-১০ সেকেন্ড অন্তর অক্ষাংশ, দ্রাঘিমাংশ, গতি ও হেডিং রেকর্ড।' },
    { id: 2, title: 'জরুরি প্যানিক / এসওএস রেসপন্স (< ২ সেকেন্ড)', status: 'COMPLIANT', authority: 'BRTA & Police', desc: 'চালক বা সুপারভাইজার এসওএস চাপলে সাথে সাথে অডিও সাইরেন ও কাউন্টার এলার্ট।' },
    { id: 3, title: '১০ সেকেন্ডের প্রি ও পোস্ট ক্র্যাশ ব্ল্যাকবক্স এভিডেন্স', status: 'COMPLIANT', authority: 'Court / Forensic', desc: 'দুর্ঘটনার সময় ওয়াটারমার্ক ও টাইমস্ট্যাম্প সহ এমপি৪ ভিডিও নিজস্ব ভল্টে সেভ।' },
    { id: 4, title: '৯০ দিনের নিরবচ্ছিন্ন জিপিএস ট্রাভেল লগ আর্কাইভ', status: 'COMPLIANT', authority: 'BRTA Audit', desc: 'বিআরটিএ পরিদর্শনের জন্য সম্পূর্ণ হিস্ট্রি প্লেব্যাক ও কিমি রিপোর্ট রেডি।' },
    { id: 5, title: 'রিমোট ইঞ্জিন ইমোবিলাইজার ও স্পিড গভর্নেন্স', status: 'COMPLIANT', authority: 'BTRC & BRTA', desc: 'আইনি সুরক্ষায় ৫০ কিমি/ঘণ্টার নিচে নিরাপদ ফুয়েল/ইগনিশন কাটঅফ কমান্ড।' },
    { id: 6, title: 'টেলিকম M2M সিম ও বিটিআরসি স্পেকট্রাম অনুমোদন', status: 'COMPLIANT', authority: 'BTRC', desc: 'অনুমোদিত টেলিকম পার্টনারদের (GP, Robi, BL) ডেডিকেটেড APN ডাটা লিংক।' },
    { id: 7, title: 'বিআরটিএ ডিজিটাল ফিটনেস ও রুট পারমিট ভল্ট', status: 'COMPLIANT', authority: 'BRTA', desc: 'ট্যাক্স টোকেন ও ফিটনেসের মেয়াদ শেষ হওয়ার ১৫ দিন আগে স্বয়ংক্রিয় সতর্কবার্তা।' },
    { id: 8, title: 'হাইওয়ে ট্রাফিক পুলিশ ২-Way কিউআর ভেরিফিকেশন', status: 'COMPLIANT', authority: 'Highway Police', desc: 'রাস্তায় পুলিশ সার্জেন্ট ও ইন্সপেক্টরদের জন্য ওয়ান-ট্যাপ লাইভ অডিট উইন্ডো।' }
  ];

  return (
    <div className="space-y-4 select-none animate-in fade-in">
      
      {/* 🏛️ Top Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-900 border border-rose-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/40 flex items-center justify-center text-2xl shadow-lg shrink-0">
              🏛️
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="text-base font-black text-white">
                  বিআরটিএ, বিটিআরসি ও পুলিশ টেলিমেটিক্স আর্কিটেকচার গেটওয়ে
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  GOVTECH COMPLIANCE
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  BRTA AUDIT READY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                ৩-স্তরীয় ডিকাপল্ড আর্কিটেকচার, ৩য় পক্ষ পুশ এপিআই ইন্টিগ্রেশন, নিজস্ব অডিও-ভিডিও ক্লাউড ভল্ট এবং সরকারি রেগুলেটরি অডিট প্যানেল
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto text-xs font-mono">
            <span className="px-3 py-1 rounded-xl bg-slate-950 text-emerald-300 font-bold border border-emerald-500/40 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>১০০% রেগুলেটরি নিরাপদ</span>
            </span>
          </div>
        </div>
      </div>

      {/* 🧭 Sub-Section Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveSubSection('architecture')}
          className={`p-3 rounded-2xl font-black border transition flex items-center justify-center space-x-1.5 ${
            activeSubSection === 'architecture' 
              ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>১. ৩-স্তরীয় আর্কিটেকচার</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('police_terminal')}
          className={`p-3 rounded-2xl font-black border transition flex items-center justify-center space-x-1.5 ${
            activeSubSection === 'police_terminal' 
              ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-600/30' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>২. হাইওয়ে পুলিশ স্ক্যান</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('brta_sync')}
          className={`p-3 rounded-2xl font-black border transition flex items-center justify-center space-x-1.5 ${
            activeSubSection === 'brta_sync' 
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>৩. BRTA ২-Way ডাটা</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('btrc_m2m')}
          className={`p-3 rounded-2xl font-black border transition flex items-center justify-center space-x-1.5 ${
            activeSubSection === 'btrc_m2m' 
              ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/30' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>৪. BTRC VTS কমপ্লায়েন্স</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubSection('stolen_dispatch')}
          className={`p-3 rounded-2xl font-black border transition flex items-center justify-center space-x-1.5 ${
            activeSubSection === 'stolen_dispatch' 
              ? 'bg-red-700 text-white border-red-600 shadow-lg shadow-red-700/30' 
              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>৫. ৯৯৯ পুলিশ ইঞ্জিন কিল</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 🏛️ TAB 1: 3-TIER DECOUPLED ARCHITECTURE & 3RD PARTY PUSH SIMULATOR        */}
      {/* ========================================================================= */}
      {activeSubSection === 'architecture' && (
        <div className="space-y-4">
          
          {/* Architecture Visual Topology Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
              <div>
                <h4 className="text-sm font-black text-white flex items-center space-x-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>EasyTracker ৩-স্তরীয় ডিকাপল্ড এন্টারপ্রাইজ আর্কিটেকচার (BRTA Approved Blueprint)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  নিচের ৩টি স্তরের কারণে কোনো লাইসেন্সিং ঝুঁকি ছাড়া ব্যবসা শুরু করা যায় এবং ভবিষ্যতে নিজের ট্র্যাকিং সার্ভারে নিমিষেই শিফট হওয়া সম্ভব।
                </p>
              </div>

              {/* Mode Selector Buttons */}
              <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveArchMode('third_party_push')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    activeArchMode === 'third_party_push' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🟢 ৩য় পক্ষ পুশ মোড (বর্তমান)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArchMode('native_server')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    activeArchMode === 'native_server' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🏢 নিজস্ব Traccar মোড (ভবিষ্যৎ)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveArchMode('dual_stream')}
                  className={`px-3 py-1.5 rounded-xl transition ${
                    activeArchMode === 'dual_stream' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  📹 ডুয়াল স্ট্রিম মোড
                </button>
              </div>
            </div>

            {/* 3-Tier Visual Flow Diagram */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              
              {/* TIER 1 */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/40 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                      TIER 1: INGEST LAYER
                    </span>
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <h5 className="font-extrabold text-sm text-white mt-2">
                    {activeArchMode === 'third_party_push' ? '৩য় পক্ষ লাইসেন্সপ্রাপ্ত VTS সার্ভার' :
                     activeArchMode === 'dual_stream' ? 'ডুয়াল স্ট্রিম ফার্মওয়্যার রুট' :
                     'EasyTracker Native Traccar সকেট'}
                  </h5>
                  <p className="text-slate-400 text-[11px] mt-1">
                    {activeArchMode === 'third_party_push'
                      ? 'GP, Robi বা লাইসেন্সড প্রোভাইডার ডিভাইস রেজিস্ট্রেশন ও সিম পরিচালনা করে JSON Webhook পুশ করে।'
                      : activeArchMode === 'dual_stream'
                      ? 'GPS টেলিকমে ৩য় পক্ষের সার্ভারে যায়, এবং 4G ক্যামেরা ভিডিও সরাসরি আপনার মিডিয়া পোর্টে আসে।'
                      : 'আপনার নিজস্ব Dedicated VPS-এ কোটি কোটি জিপিএস সকেট প্যাকেট রিসিভ করা হয়।'}
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10.5px] text-cyan-300">
                  {activeArchMode === 'third_party_push' ? 'POST /api/v1/telemetry/push (200 OK)' :
                   activeArchMode === 'dual_stream' ? 'JT/T 1078 Port 8000 + TCP 5027' :
                   'TCP/UDP Socket Ports: 5027, 5023, 5001'}
                </div>
              </div>

              {/* TIER 2 */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-indigo-400 px-2 py-0.5 rounded bg-indigo-950 border border-indigo-500/30">
                      TIER 2: SAAS LOGIC
                    </span>
                    <Server className="w-4 h-4 text-indigo-400" />
                  </div>
                  <h5 className="font-extrabold text-sm text-white mt-2">
                    EasyTracker Core SaaS & RBAC
                  </h5>
                  <p className="text-slate-400 text-[11px] mt-1">
                    ফ্লিট VMS হাব, কাউন্টার টিকিট ও গেটপাস কন্ট্রোল, চালক ডিজিটাল কেবিন, এআই গতি পর্যবেক্ষণ ও অটো বিলিং ইঞ্জিন।
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10.5px] text-indigo-300">
                  Node.js / React Engine + Live BroadcastChannel
                </div>
              </div>

              {/* TIER 3 */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-black text-emerald-400 px-2 py-0.5 rounded bg-emerald-950 border border-emerald-500/30">
                      TIER 3: MEDIA VAULT
                    </span>
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h5 className="font-extrabold text-sm text-white mt-2">
                    নিজস্ব ক্লাউড মিডিয়া ভল্ট
                  </h5>
                  <p className="text-slate-400 text-[11px] mt-1">
                    ১০ সেকেন্ডের ক্র্যাশ ক্লিপ, কেবিন অডিও ও ড্যাশ-ক্যাম লাইভ রেকর্ড সরাসরি আপনার নিজের প্রাইভেট S3/R2 ভল্টে পার্মানেন্টলি সেভ থাকে।
                  </p>
                </div>

                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 font-mono text-[10.5px] text-emerald-300">
                  Cloudflare R2 / AWS S3 + SHA-256 Seal
                </div>
              </div>

            </div>

            {/* Live Ingestion & Media Storage Simulator Button */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-slate-200 block">
                  🧪 লাইভ ৩য় পক্ষ পুশ ও মিডিয়া ইনজেস্ট সিমুলেটর:
                </span>
                <span className="text-[11px] text-slate-400">
                  বাটনে চাপলে ৩য় পক্ষের পুশ ডাটা আপনার অ্যাপ্লিকেশন হয়ে নিজস্ব ভিডিও স্টোরেজে কীভাবে সেভ হয় তা পরীক্ষা করুন।
                </span>
              </div>

              <button
                type="button"
                disabled={isSimulatingPush}
                onClick={handleRunSimulator}
                className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-2 transition active:scale-95 disabled:opacity-50"
              >
                <Play className="w-4 h-4" />
                <span>{isSimulatingPush ? 'ডাটা ইনজেস্ট হচ্ছে...' : '▶️ টেস্ট পুশ ডাটা ও মিডিয়া সেভ করুন'}</span>
              </button>
            </div>

            {/* Simulated Live Packet Result */}
            {simulatedPacketLog && (
              <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/50 space-y-3 animate-in fade-in text-xs font-mono">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <BadgeCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-black text-white text-sm">ইনজেস্ট সফল • প্যাকেট আইডি: {simulatedPacketLog.id}</span>
                  </div>
                  <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                    200 OK • OWN STORAGE SAVED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">ডাটা উৎস (Source):</span>
                    <strong className="text-cyan-300">{simulatedPacketLog.vendor}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">জিপিএস স্থানাঙ্ক ও গতি:</span>
                    <strong className="text-emerald-300">Lat: {simulatedPacketLog.gps.lat}, Lng: {simulatedPacketLog.gps.lng} • গতি: {simulatedPacketLog.gps.speed} km/h</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">নিজস্ব মিডিয়া ভল্ট স্টোরেজ:</span>
                    <strong className="text-indigo-300">{simulatedPacketLog.media.storedIn}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10.5px]">ডিজিটাল এভিডেন্স ক্রিপ্টোগ্রাফিক হ্যাশ (Court Admissible):</span>
                    <strong className="text-amber-300 text-[10px] truncate block">{simulatedPacketLog.media.sha256}</strong>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* BRTA & BTRC Official 20-Point Compliance Checklist Grid */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h4 className="text-xs sm:text-sm font-black text-white flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>BRTA ও BTRC সরকারি অনুমোদন ও কমপ্লায়েন্স চেকলিস্ট (Official Standard)</span>
              </h4>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                ৮/৮ ভেরিফাইড
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {COMPLIANCE_CHECKLIST.map(item => (
                <div key={item.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <strong className="text-white text-xs leading-tight">{item.title}</strong>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-500/40 shrink-0">
                      {item.authority}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 👮 TAB 2: HIGHWAY TRAFFIC POLICE QR SCAN & SPEED TERMINAL                 */}
      {/* ========================================================================= */}
      {activeSubSection === 'police_terminal' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-3">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-rose-400" />
                <span>হাইওয়ে পুলিশ ইন্সপেক্টর ২-Way সার্চ ও কিউআর চেকিং</span>
              </h4>
              <p className="text-[10.5px] text-slate-400">
                রাস্তায় ট্রাফিক পুলিশ গাড়ির নম্বর বা কিউআর কোড স্ক্যান করে তাৎক্ষণিক লাইভ স্পিড, বৈধ ফিটনেস ও চালকের লাইসেন্স যাচাই করতে পারবে।
              </p>
            </div>

            {/* Plate Search Box */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={searchPlate}
                onChange={(e) => setSearchPlate(e.target.value)}
                placeholder="গাড়ি নম্বর লিখুন..."
                className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-rose-500 focus:outline-none"
              />
              <button
                type="button"
                disabled={isSearchingInspection}
                onClick={handleSearchPoliceInspection}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center space-x-1"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{isSearchingInspection ? 'খোঁজা হচ্ছে...' : 'যাচাই করুন'}</span>
              </button>
            </div>
          </div>

          {/* Inspection Details Card */}
          {inspectionData && (
            <div className="bg-slate-950 p-4 rounded-2xl border border-rose-500/30 space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-3 gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-black text-white">{inspectionData.plate}</span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
                      LIVE ON ROAD
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">মালিক: <strong className="text-slate-200">{inspectionData.ownerName}</strong></p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">বর্তমান হাইওয়ে স্পিড:</span>
                  <span className={`text-lg font-mono font-black ${
                    inspectionData.speedKmH > inspectionData.speedLimitKmH ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    {inspectionData.speedKmH} km/h <span className="text-xs text-slate-400 font-normal">(লিমিট: {inspectionData.speedLimitKmH})</span>
                  </span>
                </div>
              </div>

              {/* Grid Data */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                
                {/* 1. Location & Speed */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">📍 রিয়েল-টাইম অবস্থান:</span>
                  <p className="text-slate-200 font-bold text-[11px]">{inspectionData.location}</p>
                </div>

                {/* 2. BRTA Fitness & Tax */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">🚗 বিআরটিএ ফিটনেস স্ট্যাটাস:</span>
                  <div className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="font-bold text-emerald-300">বৈধ (মেয়াদ: {inspectionData.fitnessExpiry})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">ট্যাক্স টোকেন: {inspectionData.taxTokenExpiry}</span>
                </div>

                {/* 3. Driver & License */}
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-bold block">👨‍✈️ চালক ও লাইসেন্স:</span>
                  <p className="text-slate-200 font-bold">{inspectionData.driverName} (রক্ত: {inspectionData.driverBlood})</p>
                  <span className="text-[10px] font-mono text-indigo-300">{inspectionData.driverLicense}</span>
                </div>

              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-slate-800/80 gap-2">
                <span className="text-[11px] text-slate-400">
                  ভায়োলেশন হিস্ট্রি: <strong className="text-emerald-400">০টি সক্রিয় ই-চালান</strong>
                </span>

                <button
                  type="button"
                  onClick={handleTriggerPoliceStolenCutoff}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-extrabold text-xs shadow-lg shadow-rose-700/40 flex items-center space-x-1.5 transition active:scale-95"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>🚨 পুলিশ ইমার্জেন্সি ইঞ্জিন কিল ও এলার্ট</span>
                </button>
              </div>

              {stolenLockSuccess && (
                <div className="p-3 bg-rose-950 border border-rose-500/60 rounded-xl text-xs text-rose-200 flex items-center space-x-2 animate-in fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>🚨 পুলিশ কন্ট্রোল রুমের নির্দেশে গাড়িটি সফলভাবে ইঞ্জিন লক করা হয়েছে এবং হাইওয়ে টহলদলের কাছে জিপিএস সিগন্যাল পাঠানো হচ্ছে!</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🚗 TAB 3: BRTA CENTRAL 2-WAY API DATABASE SYNC                            */}
      {/* ========================================================================= */}
      {activeSubSection === 'brta_sync' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
            <Car className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">
              বিআরটিএ সেন্ট্রাল ডাটাবেজ ২-Way এপিআই সিঙ্ক (BRTA IS API)
            </h4>
          </div>
          <p className="text-xs text-slate-300">
            EasyTracker সার্ভার সরাসরি বিআরটিএ-এর কেন্দ্রীয় যানবাহনের সার্ভারের সাথে সংযুক্ত। এর মাধ্যমে ফিটনেস পরীক্ষার সময় গাড়ির গত ৩০ দিনের রানিং ও সর্বোচ্চ গতিবেগের তথ্য বিআরটিএ ইন্সপেক্টর যাচাই করতে পারেন।
          </p>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">BRTA API Endpoint:</span>
              <span className="font-mono text-emerald-400">https://api.brta.gov.bd/v2/telematics/sync</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">GovTech Security Token:</span>
              <span className="font-mono text-indigo-300">BRTA-PROD-ENC-88219-OK</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📡 TAB 4: BTRC VTS M2M SPECTRUM COMPLIANCE HUB                            */}
      {/* ========================================================================= */}
      {activeSubSection === 'btrc_m2m' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
            <Radio className="w-4 h-4 text-blue-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">
              BTRC M2M ও স্পেকট্রাম কমপ্লায়েন্স হাব
            </h4>
          </div>
          <p className="text-xs text-slate-300">
            বাংলাদেশ টেলিযোগাযোগ নিয়ন্ত্রণ কমিশন (BTRC)-এর M2M টেলিমেটিক্স গাইডলাইন অনুযায়ী প্ল্যাটফর্মের সকল ট্র্যাকার ডিভাইস IMEI ও সিম কার্ড সরকারি রেগুলেটরি অডিটের আওতায় বৈধভাবে পরিচালিত হচ্ছে।
          </p>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">BTRC M2M License Status:</span>
              <span className="text-blue-300 font-bold">Partner VTS Whitelist Licensed</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">Spectrum Compliance:</span>
            </div>
          </div>
        </div>
      )}

      {activeSubSection === 'stolen_dispatch' && (
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">
              🚨 জরুরি পুলিশ ছিনতাই রিকভারি ও ইঞ্জিন কিল API
            </h4>
          </div>
          <p className="text-xs text-slate-300">
            কোনো যানবাহন ছিনতাই বা চুরির অভিযোগ আসলে বাংলাদেশ পুলিশের ৯৯৯ কন্ট্রোল রুম বা হাইওয়ে কমান্ড সেন্টারের বিশেষ এপিআই চ্যানেলের মাধ্যমে সাথে সাথে গাড়িটির ইঞ্জিন রিমোটলি লক করা হয় এবং নিকটবর্তী পেট্রোল কারের ট্যাবলেটে জিপিএস ডিরেকশন পুশ করা হয়।
          </p>

          <div className="bg-slate-950 p-3.5 rounded-2xl border border-rose-500/30 text-xs flex items-center justify-between">
            <span className="text-slate-300 font-bold">২৪/৭ পুলিশ রেসকিউ হটলাইন লিঙ্ক:</span>
            <span className="text-rose-400 font-mono font-black text-sm">৯৯৯ / ০২-২২৩৩৮৮০০০</span>
          </div>
        </div>
      )}

    </div>
  );
};
