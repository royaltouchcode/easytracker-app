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
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GovTechPoliceGateway: React.FC = () => {
  const { devices } = useApp();

  const [activeSubSection, setActiveSubSection] = useState<'police_terminal' | 'brta_sync' | 'btrc_m2m' | 'stolen_dispatch'>('police_terminal');

  // Highway Traffic Police Inspection Search State
  const [searchPlate, setSearchPlate] = useState('ঢাকা মেট্রো-গ ১২-৩৪৫৬');
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
    plate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
    ownerName: 'মো: রফিকুল ইসলাম',
    speedKmH: 74,
    speedLimitKmH: 80,
    location: 'ঢাকা-মাওয়া এক্সপ্রেসওয়ে, পদ্মা সেতু টোল প্লাজা সংলগ্ন',
    fitnessExpiry: '2026-09-01',
    fitnessStatus: 'VALID',
    taxTokenExpiry: '2026-10-15',
    driverName: 'মো: রফিকুল ইসলাম',
    driverLicense: 'DL-DHK-2018-9901',
    driverBlood: 'B+',
    activeViolations: 0,
    stolenStatus: 'NORMAL'
  });

  // Emergency Police Stolen Lockdown State
  const [stolenLockSuccess, setStolenLockSuccess] = useState(false);

  const handleSearchPoliceInspection = () => {
    if (!searchPlate.trim()) return;
    setIsSearchingInspection(true);

    setTimeout(() => {
      setIsSearchingInspection(false);
      setInspectionData({
        found: true,
        plate: searchPlate.trim(),
        ownerName: 'মো: রফিকুল ইসলাম',
        speedKmH: Math.floor(Math.random() * 30) + 60,
        speedLimitKmH: 80,
        location: 'ঢাকা-চট্টগ্রাম হাইওয়ে, দাউদকান্দি টোলপ্লাজা',
        fitnessExpiry: '2026-09-01',
        fitnessStatus: 'VALID',
        taxTokenExpiry: '2026-10-15',
        driverName: 'মো: রফিকুল ইসলাম',
        driverLicense: 'DL-DHK-2018-9901',
        driverBlood: 'B+',
        activeViolations: 0,
        stolenStatus: 'NORMAL'
      });
    }, 800);
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
    }
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-rose-950/70 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/30 text-rose-400 border border-rose-500/50 flex items-center justify-center shadow-lg shrink-0">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white">
                🏛️ BRTA, BTRC ও বাংলাদেশ পুলিশ ২-Way GovTech গেটওয়ে
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                GOV-SECURE API
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              হাইওয়ে ট্রাফিক পুলিশ চেকিং টার্মিনাল, বিআরটিএ ফিটনেস ২-Way সিঙ্ক এবং জরুরি ছিনতাই রিমোট ইঞ্জিন কিল
            </p>
          </div>
        </div>

        {/* 2-Way Status Indicator */}
        <div className="bg-slate-950/80 border border-rose-500/30 px-3.5 py-1.5 rounded-2xl text-right font-mono">
          <span className="text-[10px] text-slate-400 block font-bold">পুলিশ ও বিআরটিএ টার্মিনাল:</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>2-WAY ACTIVE</span>
          </span>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveSubSection('police_terminal')}
          className={`px-4 py-2 rounded-2xl font-bold border transition ${
            activeSubSection === 'police_terminal' ? 'bg-rose-600 text-white border-rose-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          🚓 ট্রাফিক পুলিশ হাইওয়ে চেকিং টার্মিনাল
        </button>
        <button
          type="button"
          onClick={() => setActiveSubSection('brta_sync')}
          className={`px-4 py-2 rounded-2xl font-bold border transition ${
            activeSubSection === 'brta_sync' ? 'bg-emerald-600 text-white border-emerald-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          🚗 বিআরটিএ ২-Way ডাটা সিঙ্ক
        </button>
        <button
          type="button"
          onClick={() => setActiveSubSection('btrc_m2m')}
          className={`px-4 py-2 rounded-2xl font-bold border transition ${
            activeSubSection === 'btrc_m2m' ? 'bg-blue-600 text-white border-blue-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          📡 BTRC M2M কমপ্লায়েন্স
        </button>
        <button
          type="button"
          onClick={() => setActiveSubSection('stolen_dispatch')}
          className={`px-4 py-2 rounded-2xl font-bold border transition ${
            activeSubSection === 'stolen_dispatch' ? 'bg-rose-700 text-white border-rose-600 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          🚨 জরুরি স্টোলেন ইঞ্জিন লক API
        </button>
      </div>

      {/* Main Content Sections */}
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

      {activeSubSection === 'brta_sync' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2.5">
            <Car className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">
              বিআরটিএ সেন্ট্রাল ডাটাবেজ ২-Way এপিআই সিঙ্ক
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
              <span className="text-[10px] text-slate-400 block font-bold">BTRC M2M License No:</span>
              <span className="text-blue-300 font-bold">BTRC/EASY-M2M/2024-098</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">Spectrum Compliance:</span>
              <span className="text-emerald-400 font-bold">100% COMPLIANT</span>
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
