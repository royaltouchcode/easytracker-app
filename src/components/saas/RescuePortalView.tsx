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
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RescuePortalView: React.FC = () => {
  const { language, setActiveTab, setCurrentRole, devices, positions, sendCommand } = useApp();

  const [activeDistressId, setActiveDistressId] = useState<number>(1);
  const [engineCutSuccess, setEngineCutSuccess] = useState(false);
  const [isIntercepting, setIsIntercepting] = useState(false);

  const distressDevice = devices.find(d => d.id === activeDistressId) || devices[0];
  const distressPos = positions[distressDevice?.id] || Object.values(positions)[0];

  const handleExecuteEmergencyCutoff = async () => {
    await sendCommand('engineStop');
    setEngineCutSuccess(true);
    setTimeout(() => setEngineCutSuccess(false), 3000);
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
            <ArrowLeft className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
          </button>
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-rose-400">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>{language === 'bn' ? 'ইমার্জেন্সি রেসকিউ ও রিকভারি টিম পোর্টাল' : 'Emergency Rescue & Recovery Force'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'চুরি হওয়া গাড়ি রিকভারি, এসওএস ইন্টারসেপ্ট ও দূর থেকে ইঞ্জিন লক' : 'Anti-theft intercept, rapid pursuit & engine kill'}
            </p>
          </div>
        </div>

        <span className="text-[9px] bg-rose-500/20 text-rose-300 font-extrabold px-2 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
          SOS Active
        </span>
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
                মালিক: <strong className="text-slate-200">{distressDevice?.attributes?.driverName || 'Mohammad Azhar'}</strong> • ফোন: {distressDevice?.attributes?.driverPhone || '01700000000'}
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
              href={`https://www.google.com/maps/dir/?api=1&destination=${distressPos?.latitude},${distressPos?.longitude}`}
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
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          অন্যান্য সক্রিয় জিপিএস ট্র্যাকার সমূহ
        </span>

        <div className="space-y-2">
          {devices.map((dev) => {
            const isSel = dev.id === activeDistressId;
            return (
              <button
                key={dev.id}
                onClick={() => setActiveDistressId(dev.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition text-xs ${
                  isSel ? 'bg-rose-600/20 border-rose-500/50 text-rose-300' : 'bg-slate-950/80 border-slate-800 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-extrabold text-slate-100">{dev.name}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{dev.attributes?.plateNumber || 'No Plate'}</div>
                </div>

                <span className="px-2 py-1 rounded-xl bg-slate-800 text-slate-300 font-mono text-[10.5px]">
                  {isSel ? 'টার্গেট সিলেক্টেড' : 'সিলেক্ট করুন'}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
