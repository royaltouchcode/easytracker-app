import React, { useState } from 'react';
import { 
  Crown, 
  ArrowLeft, 
  Trash2, 
  RefreshCw, 
  Users, 
  DollarSign, 
  Server, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Plus,
  Sliders,
  Layers,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_SUBSCRIPTION_CONFIG } from '../../config/subscriptionPlans';
import { APP_CONFIG } from '../../config/appConfig';

export const AdminDashboardView: React.FC = () => {
  const { 
    devices, 
    positions, 
    language, 
    setActiveTab, 
    setCurrentRole, 
    purgeDemoFleetData, 
    restoreDemoFleetData, 
    isDemoPurged 
  } = useApp();

  const [rates, setRates] = useState<Record<number, number>>(() => {
    return {
      1: 350,
      3: 990,
      6: 1850,
      12: 3500
    };
  });
  const [saveRateSuccess, setSaveRateSuccess] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  const handleUpdateRate = (months: number, value: string) => {
    const val = parseInt(value, 10) || 0;
    setRates(prev => ({ ...prev, [months]: val }));
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gps_admin_subscription_rates', JSON.stringify(rates));
    setSaveRateSuccess(true);
    setTimeout(() => setSaveRateSuccess(false), 2000);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('map');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
          </button>
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-amber-300">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'সুপার অ্যাডমিন SaaS কন্ট্রোল সেন্টার' : 'Super Admin SaaS Hub'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'মাল্টি-টেন্যান্ট টেলিম্যাটিক্স ও রাজস্ব কন্ট্রোল' : 'Multi-Tenant Telematics & Revenue Gateway'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentRole('customer');
            setActiveTab('map');
          }}
          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition active:scale-95"
        >
          {language === 'bn' ? 'ম্যাপে যান' : 'Live Map'}
        </button>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>সক্রিয় ট্র্যাকার</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-mono font-black text-blue-300 mt-2">
            {devices.length} <span className="text-xs text-slate-400 font-normal">ডিভাইস</span>
          </div>
          <div className="text-[9.5px] text-emerald-400 mt-1">● ১০০% অনলাইন সার্ভার</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>মাসিক সাবস্ক্রিপশন (MRR)</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-black text-emerald-300 mt-2">
            ৳{(devices.length * 350).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/মাস</span>
          </div>
          <div className="text-[9.5px] text-slate-400 mt-1">পেমেন্ট গেটওয়ে: bKash, Nagad</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>ডাটাবেজ স্ট্যাটাস</span>
            <Database className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-sm font-bold text-purple-300 mt-2">
            {isDemoPurged ? '১০০% রিয়েল মোড' : 'ডেমো ফ্লিট সক্রিয়'}
          </div>
          <div className="text-[9.5px] text-slate-400 mt-1">{isDemoPurged ? '১টি আসল বাইক' : '৫টি ডেমো + আসল বাইক'}</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>হোস্টিং ও ডোমেইন</span>
            <Globe className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xs font-mono font-bold text-sky-300 mt-2 truncate">
            {APP_CONFIG.publisherDomain}
          </div>
          <div className="text-[9.5px] text-emerald-400 mt-1">SSL সিকিউরড গেটওয়ে</div>
        </div>
      </div>

      {/* 1-Click Demo Data Purge Card */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-rose-200">
                {language === 'bn' ? '১-ক্লিকে ডেমো ডাটা মুছুন (Go 100% Production Live)' : '1-Click Demo Fleet Purge'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' 
                  ? 'আপনার আসল বাইকের ডাটা অক্ষত রেখে বাকি সব ডেমো গাড়ি ডাটাবেজ থেকে মুছে দিন।'
                  : 'Keeps your real bike data safe and deletes mock demo vehicles for production launch.'}
              </p>
            </div>
          </div>

          {!isDemoPurged ? (
            <button
              type="button"
              onClick={() => setShowPurgeConfirm(true)}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center space-x-1.5 transition active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ডেমো ডাটা মুছুন' : 'Purge Demo Fleet'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={restoreDemoFleetData}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold text-xs flex items-center space-x-1.5 transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'ডেমো রিস্টোর' : 'Restore Demo'}</span>
            </button>
          )}
        </div>

        {showPurgeConfirm && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-2xl space-y-2 animate-in fade-in">
            <p className="text-xs text-rose-200 font-bold">
              ⚠️ আপনি কি নিশ্চিত যে সমস্ত ডেমো গাড়ি (Axio, Truck, CNG, Ambulance) মুছে ফেলে শুধুমাত্র আপনার আসল বাইকের ডাটা চালু রাখবেন?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  purgeDemoFleetData();
                  setShowPurgeConfirm(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/40"
              >
                হ্যাঁ, নিশ্চিতভাবে মুছে দিন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Rates Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {language === 'bn' ? 'সাবস্ক্রিপশন রেট ও প্যাকেজ কনফিগারেশন' : 'Subscription Tier Pricing Manager'}
            </span>
          </div>
          {saveRateSuccess && (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>সংরক্ষিত হয়েছে</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveRates} className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">১ মাস সাবস্ক্রিপশন (৳):</label>
              <input
                type="number"
                value={rates[1]}
                onChange={(e) => handleUpdateRate(1, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">৩ মাস প্যাকেজ (৳):</label>
              <input
                type="number"
                value={rates[3]}
                onChange={(e) => handleUpdateRate(3, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">৬ মাস প্যাকেজ (৳):</label>
              <input
                type="number"
                value={rates[6]}
                onChange={(e) => handleUpdateRate(6, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">১২ মাস বাৎসরিক (৳):</label>
              <input
                type="number"
                value={rates[12]}
                onChange={(e) => handleUpdateRate(12, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন রেট সংরক্ষণ ও লাইভ সিঙ্ক' : 'Save & Publish Rates'}</span>
          </button>
        </form>
      </div>

      {/* Fleet Vehicles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          {language === 'bn' ? 'সিস্টেমের লাইভ যানবাহন ও টেলিম্যাটিক্স ট্র্যাকার তালিকা' : 'Active Telematics Trackers Fleet'} ({devices.length})
        </span>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {devices.map((dev) => {
            const pos = positions[dev.id];
            const isOnline = dev.status === 'online';
            return (
              <div key={dev.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-100 flex items-center space-x-2">
                    <span>{dev.name}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.2 rounded border border-slate-700">
                      {dev.attributes?.plateNumber || 'No Plate'}
                    </span>
                    {dev.id === 1 && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                        Primary Bike
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    IMEI: <strong className="font-mono text-slate-300">{dev.uniqueId || '864720058291034'}</strong> • সিম: {dev.phone || dev.attributes?.phone || '01700000000'} • অবস্থান: {pos?.address || 'Gulshan-2, Dhaka'}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-blue-300">
                    {pos?.speed ? `${Math.round(pos.speed)} km/h` : '০ কিমি/ঘণ্টা'}
                  </div>
                  <div className="text-[9.5px] text-emerald-400 font-semibold mt-0.5">
                    ব্যাটারি: {pos?.attributes?.batteryLevel || 98}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
