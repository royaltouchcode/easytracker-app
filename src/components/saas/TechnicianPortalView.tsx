import React, { useState } from 'react';
import { 
  Wrench, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Key, 
  Satellite, 
  Signal, 
  Flame, 
  Activity, 
  AlertCircle, 
  RefreshCw,
  Play,
  RotateCcw,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TechnicianPortalView: React.FC = () => {
  const { language, setActiveTab, setCurrentRole, selectedDevice } = useApp();

  // Field Testing State
  const [powerVoltage, setPowerVoltage] = useState(12.8);
  const [isAccOn, setIsAccOn] = useState(true);
  const [relayCutStatus, setRelayCutStatus] = useState<'connected' | 'cut' | 'testing'>('connected');
  const [satCount, setSatCount] = useState(15);
  const [gsmSignal, setGsmSignal] = useState(28);

  const [checklist, setChecklist] = useState({
    hiddenPlace: true,
    fuseInstalled: true,
    relayCutTested: true,
    gpsDirectSky: true,
    sosButtonTested: true,
    engineCutoffApproved: true
  });

  const [testLog, setTestLog] = useState<string[]>([
    '১০:৪৫ AM - মেইন পাওয়ার (12.8V) ভোল্টেজ টেস্ট সম্পন্ন।',
    '১০:৪৭ AM - ACC ইগনিশন ওয়্যার অন/অফ সিগন্যাল ভেরিফাইড।',
    '১০:৪৯ AM - জিপিএস ৩ডি স্যাটেলাইট ফিক্স (১৫টি স্যাটেলাইট)।',
    '১০:৫০ AM - রিলে কাটঅফ সার্কিট টেস্ট সফল।'
  ]);

  const handleTestRelay = () => {
    setRelayCutStatus('testing');
    setTimeout(() => {
      setRelayCutStatus('cut');
      setTestLog(prev => [`${new Date().toLocaleTimeString()} - রিলে কাটঅফ টেস্ট: ইঞ্জিন ইগনিশন অফ হয়েছে।`, ...prev]);
    }, 1500);
  };

  const handleRestoreRelay = () => {
    setRelayCutStatus('testing');
    setTimeout(() => {
      setRelayCutStatus('connected');
      setTestLog(prev => [`${new Date().toLocaleTimeString()} - রিলে রিস্টোর: তেল সরবরাহ পুনরায় সচল।`, ...prev]);
    }, 1500);
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
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
          </button>
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-purple-300">
              <Wrench className="w-4 h-4 text-purple-400" />
              <span>{language === 'bn' ? 'ইনস্টলেশন ও সার্ভিসিং টেকনিশিয়ান হাব' : 'Field Technician Hub'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'হার্ডওয়্যার ওয়্যারিং টেস্ট, রিলে কাটঅফ ভেরিফিকেশন ও চেকলিস্ট' : 'Wiring diagnostic, relay cutoff test & checklist'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
            Hardware Tools
          </span>
        </div>
      </div>

      {/* Live Hardware Telemetry Diagnostic Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center space-x-1.5">
          <Activity className="w-4 h-4 text-purple-400" />
          <span>১. হার্ডওয়্যার ওয়্যারিং লাইভ ডায়াগনস্টিক টেস্ট</span>
        </span>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {/* Main Power Test */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
              <span>মেইন পাওয়ার (লাল তার)</span>
              <Zap className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-mono font-black text-amber-300 mt-2">
              {powerVoltage} V
            </div>
            <div className="text-[9.5px] text-emerald-400 mt-1 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>পাওয়ার কানেকশন ওকে</span>
            </div>
          </div>

          {/* ACC Ignition Wire Test */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
              <span>ACC চাবি (কমলা তার)</span>
              <Key className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-base font-bold text-blue-300 mt-2">
              {isAccOn ? 'ইগনিশন অন (ACC ON)' : 'ইগনিশন অফ (ACC OFF)'}
            </div>
            <button
              onClick={() => setIsAccOn(!isAccOn)}
              className="text-[9.5px] text-blue-400 hover:underline mt-1 text-left"
            >
              চাবি ঘুরিয়ে টেস্ট করুন ➔
            </button>
          </div>

          {/* GPS Satellite Signal */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
              <span>জিপিএস স্যাটেলাইট</span>
              <Satellite className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-mono font-black text-emerald-300 mt-2">
              {satCount} টি <span className="text-xs font-normal text-slate-400">3D Fix</span>
            </div>
            <div className="text-[9.5px] text-emerald-400 mt-1">HD একুরেসি: ৩ মিটার</div>
          </div>

          {/* GSM GPRS Signal */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
              <span>সিম জিএসএম সিগন্যাল</span>
              <Signal className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="text-xl font-mono font-black text-sky-300 mt-2">
              {gsmSignal} <span className="text-xs font-normal text-slate-400">CSQ (Strong)</span>
            </div>
            <div className="text-[9.5px] text-sky-400 mt-1">4G / 2G নেটওয়ার্ক ওকে</div>
          </div>
        </div>
      </div>

      {/* Relay Cutoff Trigger Tester */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center space-x-1.5">
            <Flame className="w-4 h-4 text-rose-400" />
            <span>২. ইঞ্জিন কাটঅফ রিলে সিমুলেশন ও টেস্ট</span>
          </span>
          <span className={`text-[10.5px] font-bold px-2 py-0.5 rounded-full border ${
            relayCutStatus === 'cut' 
              ? 'bg-rose-950 text-rose-300 border-rose-600' 
              : 'bg-emerald-950 text-emerald-300 border-emerald-600'
          }`}>
            {relayCutStatus === 'cut' ? 'ইঞ্জিন কাটঅফ সক্রিয়' : 'তেল সরবরাহ স্বাভাবিক'}
          </span>
        </div>

        <p className="text-xs text-slate-400">
          ইনস্টলেশনের পর রিলেটি সঠিকভাবে কাজ করছে কি না তা নিশ্চিত হতে নিচের বাটন চেপে টেস্ট কমান্ড পাঠান:
        </p>

        <div className="flex space-x-2.5">
          <button
            type="button"
            disabled={relayCutStatus === 'cut' || relayCutStatus === 'testing'}
            onClick={handleTestRelay}
            className="flex-1 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-rose-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
          >
            <Play className="w-4 h-4" />
            <span>{relayCutStatus === 'testing' ? 'কমান্ড পাঠানো হচ্ছে...' : 'রিলে কাটঅফ টেস্ট (Cut Relay)'}</span>
          </button>

          <button
            type="button"
            disabled={relayCutStatus === 'connected' || relayCutStatus === 'testing'}
            onClick={handleRestoreRelay}
            className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{language === 'bn' ? 'রিলে রিস্টোর (Restore Oil)' : 'Restore Relay'}</span>
          </button>
        </div>
      </div>

      {/* Field Checklist */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          ৩. ইনস্টলেশন কোয়ালিটি চেকলিস্ট ও হ্যান্ডওভার
        </span>

        <div className="space-y-2 text-xs">
          {Object.entries({
            hiddenPlace: 'ট্র্যাকারটি গাড়ির এমন গোপন স্থানে রাখা হয়েছে যেখানে পানি ঢুকবে না',
            fuseInstalled: 'মেইন পাওয়ার লাইনে সঠিক ফিউজ (Fuse) লাগানো হয়েছে',
            relayCutTested: 'রিলে কাটঅফ সংযোগ সফলভাবে পরীক্ষা করা হয়েছে',
            gpsDirectSky: 'জিপিএস এন্টেনা খোলা আকাশের দিকে নির্দেশ করা আছে',
            sosButtonTested: 'জরুরি এসওএস বাটনটি চেপে টেস্ট কল নিশ্চিত করা হয়েছে',
            engineCutoffApproved: 'গাড়ির মালিককে অ্যাপের সকল ফাংশন বুঝিয়ে দেওয়া হয়েছে'
          }).map(([key, label]) => (
            <label key={key} className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer hover:bg-slate-950">
              <input
                type="checkbox"
                checked={(checklist as any)[key]}
                onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })}
                className="w-4 h-4 text-purple-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
              />
              <span className="text-slate-300 font-medium">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Installation Log Terminal */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-2">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          টেকনিশিয়ান ডায়াগনস্টিক লগ টার্মিনাল
        </span>
        <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 font-mono text-[10.5px] text-emerald-400 space-y-1 max-h-36 overflow-y-auto">
          {testLog.map((log, idx) => (
            <div key={idx}>➔ {log}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
