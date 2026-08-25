import React, { useState } from 'react';
import { 
  Flame, 
  PhoneCall, 
  ShieldAlert, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  Radio, 
  Power, 
  MapPin, 
  Navigation, 
  Clock, 
  Lock,
  Zap,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface EmergencyRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyRescueModal: React.FC<EmergencyRescueModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedDevice, 
    selectedPosition, 
    sendCommand, 
    triggerManualAlert, 
    addEngineLog,
    engineLogs,
    language 
  } = useApp();

  const [distressSent, setDistressSent] = useState(false);
  const [engineCutSent, setEngineCutSent] = useState(false);
  const [engineResumeSent, setEngineResumeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen || !selectedDevice) return null;

  const plate = selectedDevice.attributes?.plateNumber || 'DHAKA METRO-LA 28-9798';
  const imei = selectedDevice.uniqueId || '354778343153865';
  const speed = selectedPosition ? Math.round(selectedPosition.speed) : 0;
  const address = selectedPosition?.address || 'Gulshan-2, Dhaka';

  const isEngineLocked = localStorage.getItem(`gps_relay_cut_${selectedDevice.id}`) === 'true' || 
                         !!selectedPosition?.attributes?.relay || 
                         !!selectedPosition?.attributes?.blocked;

  const sos1 = selectedDevice.attributes?.sos1 || '+880 1812-998877';
  const sos2 = selectedDevice.attributes?.sos2 || '+880 1913-445566';
  const sos3 = selectedDevice.attributes?.sos3 || '+880 1711-223344';

  const handleSendInstantDistressBeacon = async () => {
    setIsSending(true);
    triggerManualAlert('HIJACK_DISTRESS_BEACON', `🚨 ইমার্জেন্সি হাইজ্যাক রেসকিউ সিগন্যাল প্রেরিত! গাড়ি: ${plate} (${speed} km/h, ${address})`);
    
    setTimeout(() => {
      setIsSending(false);
      setDistressSent(true);
    }, 1200);
  };

  const handleEmergencyEngineCut = async () => {
    await sendCommand('engineStop');
    addEngineLog({
      deviceId: selectedDevice.id,
      deviceName: selectedDevice.name,
      action: 'cut',
      status: 'executed',
      speed: speed,
      sourceFlag: 'EMERGENCY_RESCUE',
      authorizedBy: 'Customer In-App Rescue',
      note: `🚨 রেসকিউ বাটন থেকে জরুরি ইঞ্জিন কাট-অফ কার্যকর হয়েছে (${plate})`
    });
    localStorage.setItem(`gps_relay_cut_${selectedDevice.id}`, 'true');
    setEngineCutSent(true);
    setTimeout(() => setEngineCutSent(false), 4000);
  };

  const handleEmergencyEngineResume = async () => {
    await sendCommand('engineResume');
    addEngineLog({
      deviceId: selectedDevice.id,
      deviceName: selectedDevice.name,
      action: 'resume',
      status: 'executed',
      speed: speed,
      sourceFlag: 'EMERGENCY_RESCUE',
      authorizedBy: 'Customer In-App Rescue',
      note: `🟢 রেসকিউ থেকে গাড়ি উদ্ধার শেষে ইঞ্জিন আনলক করা হয়েছে (${plate})`
    });
    localStorage.setItem(`gps_relay_cut_${selectedDevice.id}`, 'false');
    setEngineResumeSent(true);
    setTimeout(() => setEngineResumeSent(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in select-none overflow-y-auto">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl max-w-lg w-full shadow-2xl shadow-rose-950/80 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Urgent Alert Header */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 p-4 border-b border-rose-500/40 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 text-rose-400 border border-rose-500 flex items-center justify-center animate-pulse">
              <Flame className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-black text-base text-white uppercase tracking-wide">
                  {language === 'bn' ? '🚨 জরুরি রেসকিউ ও ছিনতাই উদ্ধার' : 'Emergency Rescue & Hijack Response'}
                </h3>
              </div>
              <p className="text-[10px] text-rose-300 font-mono">
                {selectedDevice.name} • {plate} • স্পিড: {speed} km/h
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto">
          
          {/* Live Vehicle Location Strip */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span className="font-bold uppercase tracking-wider">রিয়েল-টাইম জিপিএস অবস্থান</span>
              <span className="text-emerald-400 font-bold">● লাইভ কানেক্টেড</span>
            </div>
            <div className="font-bold text-white flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{address}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono flex items-center space-x-2">
              <span>কোঅর্ডিনেট: {selectedPosition?.latitude?.toFixed(5) || '23.79370'}°N, {selectedPosition?.longitude?.toFixed(5) || '90.40660'}°E</span>
              <span>•</span>
              <span className="text-amber-400">ব্যাটারি: {selectedPosition?.attributes?.batteryLevel || 98}%</span>
            </div>
          </div>

          {/* Primary Action 1: 24/7 Dedicated Red-Line Rescue Helpline */}
          <div className="bg-gradient-to-r from-rose-900/40 via-slate-850 to-slate-900 border border-rose-500/60 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <div className="text-xs font-black text-white flex items-center space-x-1.5">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>২৪/৭ ডেডিকেটেড রেড-লাইন রেসকিউ হটলাইন</span>
              </div>
              <p className="text-[10.5px] text-rose-200/80 mt-0.5">
                ১-সেকেন্ডে সেন্ট্রাল রেসকিউ কমান্ড ও রিকভারি ফোর্সের সাথে যুক্ত হোন
              </p>
            </div>

            <a
              href="tel:09612000999"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg shadow-rose-600/40 flex items-center justify-center space-x-2 transition active:scale-95 shrink-0"
            >
              <PhoneCall className="w-4 h-4 animate-bounce" />
              <span>কল দিন: ০৯৬১২-০০০৯৯৯</span>
            </a>
          </div>

          {/* Primary Action 2: 1-Tap 999 Police Dispatch */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-black text-xs">
                999
              </div>
              <div>
                <div className="text-xs font-bold text-white">বাংলাদেশ পুলিশ ও জাতীয় জরুরি সেবা</div>
                <div className="text-[10px] text-slate-400">সরাসরি থানা বা হাইওয়ে পুলিশ ডিসপ্যাচ</div>
              </div>
            </div>

            <a
              href="tel:999"
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>৯৯৯ কল দিন</span>
            </a>
          </div>

          {/* Action 3: In-App Distress Beacon & Remote Engine Relay Cut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            
            {/* Distress Beacon Trigger */}
            <button
              onClick={handleSendInstantDistressBeacon}
              disabled={isSending || distressSent}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 ${
                distressSent 
                  ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                  : 'bg-slate-850 hover:bg-slate-800 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Radio className={`w-5 h-5 ${distressSent ? 'text-emerald-400' : 'text-amber-400 animate-pulse'}`} />
                {distressSent && <span className="text-[9px] font-bold bg-emerald-500/20 px-1.5 rounded text-emerald-300">প্রেরিত</span>}
              </div>
              <div>
                <div className="font-bold text-xs">
                  {distressSent ? '🚨 রেসকিউ সংকেত পাঠানো হয়েছে' : '⚡ ১-ট্যাপ হাইজ্যাক অ্যালার্ট'}
                </div>
                <div className="text-[9.5px] text-slate-400 mt-0.5">
                  সেন্ট্রাল টিম ও ৩টি SOS নম্বরে লাইভ জিপিএস যাবে
                </div>
              </div>
            </button>

            {/* Remote Emergency Engine Cutoff / Resume Toggle */}
            {isEngineLocked ? (
              <button
                onClick={handleEmergencyEngineResume}
                className="p-3 rounded-2xl bg-emerald-950/50 hover:bg-emerald-900/60 border border-emerald-500/60 text-left flex flex-col justify-between transition active:scale-95 group shadow-lg shadow-emerald-950/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <Power className="w-5 h-5 text-emerald-400 group-hover:scale-110" />
                  <span className="text-[9px] font-bold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-1.5 rounded font-mono">
                    LOCKED
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xs text-emerald-300">
                    {engineResumeSent ? '✅ ইঞ্জিন আনলক কমান্ড প্রেরিত!' : '🟢 ইঞ্জিন আনলক / চালু করুন'}
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5">
                    উদ্ধার সম্পন্ন হলে ইঞ্জিন রিস্টার্ট অনুমোদন করুন
                  </div>
                </div>
              </button>
            ) : (
              <button
                onClick={handleEmergencyEngineCut}
                className="p-3 rounded-2xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/40 text-left flex flex-col justify-between transition active:scale-95 group"
              >
                <div className="flex items-center justify-between mb-2">
                  <Power className="w-5 h-5 text-rose-500 group-hover:animate-pulse" />
                  <span className="text-[9px] font-bold bg-rose-600/30 text-rose-300 border border-rose-500/40 px-1.5 rounded font-mono">
                    RELAY CUT
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xs text-rose-300">
                    {engineCutSent ? '✅ ইঞ্জিন অফ কমান্ড প্রেরিত!' : '🛑 তাৎক্ষণিক ইঞ্জিন বন্ধ করুন'}
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-0.5">
                    ছিনতাইকারী যাতে গাড়ি নিয়ে পালাতে না পারে
                  </div>
                </div>
              </button>
            )}
          </div>

          {/* Highlighted SOS Numbers Card */}
          <div className="bg-slate-950 border border-amber-500/40 rounded-2xl p-3 space-y-1.5 shadow-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>নিবন্ধিত জরুরি SOS নম্বরসমূহ (জরুরি বিকল্প)</span>
              </span>
              <span className="text-[9px] font-bold text-amber-400 bg-amber-950 px-1.5 py-0.2 rounded border border-amber-700">
                ৩টি নম্বর
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              মোবাইল হারিয়ে গেলে এই নম্বরগুলো থেকে হটলাইনে কল দিয়ে ভেরিফাই করা যাবে:
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-1.5 text-center">
                <span className="text-[8.5px] text-slate-400 block font-bold">SOS 1</span>
                <span className="text-[9.5px] font-mono font-bold text-amber-300 truncate block">{sos1}</span>
              </div>
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-1.5 text-center">
                <span className="text-[8.5px] text-slate-400 block font-bold">SOS 2</span>
                <span className="text-[9.5px] font-mono font-bold text-amber-300 truncate block">{sos2}</span>
              </div>
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-1.5 text-center">
                <span className="text-[8.5px] text-slate-400 block font-bold">SOS 3</span>
                <span className="text-[9.5px] font-mono font-bold text-amber-300 truncate block">{sos3}</span>
              </div>
            </div>
          </div>

          {/* Privacy & Safety Guarantee */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[10px] text-slate-400 flex items-start space-x-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>গোপনীয়তা সুরক্ষা:</strong> উদ্ধার অভিযান শেষ হওয়ার সাথে সাথে লাইভ সেশন স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে এবং অডিট ট্রেইল রিপোর্ট আপনার ইমেইলে সংরক্ষিত হবে।
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
