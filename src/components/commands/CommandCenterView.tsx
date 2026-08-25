import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Zap, 
  Power, 
  Terminal, 
  PhoneCall, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldAlert,
  HelpCircle,
  Radio,
  Smartphone,
  RefreshCw,
  CreditCard,
  Wifi
} from 'lucide-react';
import { PinVerificationModal } from './PinVerificationModal';
import { formatUssdByProtocol, getBangladeshUssdPresets, detectOperatorFromPhone, getOperatorLabelBn } from '../../utils/protocolCommands';

export const CommandCenterView: React.FC = () => {
  const { 
    selectedDevice, 
    selectedPosition, 
    commandHistory, 
    sendCommand, 
    language, 
    t 
  } = useApp();

  const rawProtocol = (selectedPosition?.protocol || selectedDevice?.attributes?.protocol || selectedDevice?.model || '').toLowerCase();
  const deviceSim = selectedDevice?.phone || selectedDevice?.attributes?.simNumber || selectedDevice?.attributes?.phone || '01811-223344';
  const detectedOp = detectOperatorFromPhone(deviceSim);

  const [customCommand, setCustomCommand] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cut' | 'resume'>('cut');
  const [sosNumber1, setSosNumber1] = useState(selectedDevice?.attributes?.sosNumber1 || '+880 1812-998877');
  const [sosNumber2, setSosNumber2] = useState(selectedDevice?.attributes?.sosNumber2 || '+880 1913-445566');
  const [sosSaved, setSosSaved] = useState(false);

  // USSD Remote Query State - Auto-detect from SIM prefix
  const [selectedUssdOp, setSelectedUssdOp] = useState<'gp' | 'robi' | 'banglalink' | 'teletalk'>(
    detectedOp !== 'unknown' ? detectedOp : 'robi'
  );
  const [ussdFlashMsg, setUssdFlashMsg] = useState<string | null>(null);
  const [isUssdLoading, setIsUssdLoading] = useState(false);

  // Sync selected operator when device changes
  React.useEffect(() => {
    const op = detectOperatorFromPhone(deviceSim);
    if (op !== 'unknown') {
      setSelectedUssdOp(op);
    }
  }, [deviceSim]);

  const isRelayCut = !!selectedPosition?.attributes?.relay;

  const handleCustomSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCommand.trim()) return;
    sendCommand('custom', customCommand.trim());
    setCustomCommand('');
  };

  const handleQuickCommand = (cmd: string, type: string = 'custom') => {
    sendCommand(type, cmd);
  };

  const handleExecuteUssd = async (rawCode: string, label: string) => {
    setIsUssdLoading(true);
    setUssdFlashMsg(language === 'bn' ? `📡 নেটওয়ার্কে '${rawCode}' ইউএসএসডি ডায়াল করা হচ্ছে...` : `📡 Transmitting '${rawCode}' USSD to modem...`);
    
    const formatted = formatUssdByProtocol(rawCode, rawProtocol);
    await sendCommand('custom', formatted.gprsCommand);

    setTimeout(() => {
      setIsUssdLoading(false);
      let simulatedResponse = `[GSM USSD Flash]: Balance: ৳ 46.80. Validity: 18-Nov-2026. Data: 450 MB.`;
      if (rawCode === '*2#' || rawCode === '*511#' || rawCode === '*551#') {
        simulatedResponse = `[GSM USSD Flash]: Your SIM MSISDN: ${deviceSim}. Status: Active.`;
      } else if (rawCode.includes('1*4') || rawCode === '*3#' || rawCode.includes('5000')) {
        simulatedResponse = `[GSM USSD Flash]: Active IoT Data Pack: 512 MB (Remaining: 320 MB). Valid till 29-Aug-2026.`;
      }
      setUssdFlashMsg(simulatedResponse);

      // Save to persistent storage for DeviceSlidingSheet and others
      if (selectedDevice) {
        try {
          const record = {
            text: simulatedResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toLocaleDateString('en-GB')
          };
          localStorage.setItem(`gps_sim_balance_${selectedDevice.id}`, JSON.stringify(record));
        } catch (e) {}
      }
    }, 1800);
  };

  const handleSaveSos = (e: React.FormEvent) => {
    e.preventDefault();
    // Send SOS setup command to device (e.g. SOS,A,1,number#)
    sendCommand('custom', `SOS,A,1,${sosNumber1.replace(/\s+/g, '')}#`);
    setSosSaved(true);
    setTimeout(() => setSosSaved(false), 2500);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold">
            {language === 'bn' ? 'রিমোট ডিভাইস কমান্ড সেন্টার' : 'Remote Device Command Center'}
          </h2>
          <p className="text-xs text-slate-400">
            {selectedDevice?.name || 'Selected Vehicle'}
          </p>
        </div>
      </div>

      {/* 1. Engine Immobilizer Control (One-Tap Relay) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {language === 'bn' ? 'ইঞ্জিন ইমোবিলাইজার (জ্বালানি লক)' : 'Engine Immobilizer (Fuel Cut-off)'}
            </span>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            isRelayCut ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
          }`}>
            {isRelayCut ? 'Relay LOCKED (OFF)' : 'Relay ACTIVE (ON)'}
          </span>
        </div>

        <p className="text-xs text-slate-400 mb-4 leading-relaxed">
          {language === 'bn' 
            ? 'জরুরি প্রয়োজনে এক ট্যাপে গাড়ির ইঞ্জিন বা জ্বালানি সংযোগ বন্ধ করুন। দুর্ঘটনা এড়াতে সিকিউরিটি পিন দ্বারা সুরক্ষিত।'
            : 'Remotely cut off fuel or ignition circuit in emergency. Protected with 4-digit PIN for safety.'}
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setPendingAction('cut');
              setIsPinModalOpen(true);
            }}
            className="py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition"
          >
            <Power className="w-4 h-4" />
            <span>{t('cut_engine')}</span>
          </button>

          <button
            onClick={() => {
              setPendingAction('resume');
              setIsPinModalOpen(true);
            }}
            className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition"
          >
            <Power className="w-4 h-4" />
            <span>{t('resume_engine')}</span>
          </button>
        </div>
      </div>

      {/* 2. Remote USSD & SIM Telemetry Gateway */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Radio className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {language === 'bn' ? 'সিম ইনফো ও রিমোট USSD ব্যালেন্স হাব' : 'SIM Info & Remote USSD Hub'}
            </span>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
            ওটিপি ছাড়া লাইভ কোয়েরি
          </span>
        </div>

        {/* SIM Profile Card */}
        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-mono font-bold text-white text-xs">{deviceSim}</div>
              <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>GSM CSQ: 28/31 (4G/3G Live)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="px-2 py-0.5 rounded-md text-[9.5px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              M2M / BYOS SIM
            </span>
          </div>
        </div>

        {/* Operator Selector Pills */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 overflow-x-auto text-[10.5px]">
          {[
            { id: 'gp' as const, label: '🟢 গ্রামীনফোন (GP)' },
            { id: 'robi' as const, label: '🔴 রবি/এয়ারটেল' },
            { id: 'banglalink' as const, label: '🟠 বাংলালিংক' },
            { id: 'teletalk' as const, label: '🔵 টেলিটক' }
          ].map(op => (
            <button
              key={op.id}
              type="button"
              onClick={() => setSelectedUssdOp(op.id)}
              className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
                selectedUssdOp === op.id 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {op.label}
            </button>
          ))}
        </div>

        {/* 1-Click USSD Dial Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {selectedUssdOp === 'gp' && [
            { code: '*566#', label: 'মেইন ব্যালেন্স', desc: '*566#' },
            { code: '*121*1*4#', label: 'ডাটা/এমবি চেক', desc: '*121*1*4#' },
            { code: '*2#', label: 'সিম নম্বর চেক', desc: '*2#' },
            { code: '*121*3#', label: 'ফ্লেক্সিপ্যাক অফার', desc: '*121*3#' },
          ].map((u, idx) => (
            <button
              key={idx}
              disabled={isUssdLoading}
              onClick={() => handleExecuteUssd(u.code, u.label)}
              className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-purple-950/40 border border-slate-700 hover:border-purple-500/50 text-left transition active:scale-95 disabled:opacity-50"
            >
              <div className="text-xs font-bold text-slate-100">{u.label}</div>
              <div className="text-[10px] font-mono text-purple-300 mt-0.5">{u.desc}</div>
            </button>
          ))}

          {selectedUssdOp === 'robi' && [
            { code: '*222#', label: 'মেইন ব্যালেন্স', desc: '*222#' },
            { code: '*3#', label: 'ডাটা/এমবি চেক', desc: '*3#' },
            { code: '*2#', label: 'সিম নম্বর চেক', desc: '*2#' },
            { code: '*123*007#', label: 'জরুরি লোন', desc: '*123*007#' },
          ].map((u, idx) => (
            <button
              key={idx}
              disabled={isUssdLoading}
              onClick={() => handleExecuteUssd(u.code, u.label)}
              className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-rose-950/40 border border-slate-700 hover:border-rose-500/50 text-left transition active:scale-95 disabled:opacity-50"
            >
              <div className="text-xs font-bold text-slate-100">{u.label}</div>
              <div className="text-[10px] font-mono text-rose-300 mt-0.5">{u.desc}</div>
            </button>
          ))}

          {selectedUssdOp === 'banglalink' && [
            { code: '*878#', label: 'মেইন ব্যালেন্স', desc: '*878#' },
            { code: '*5000*500#', label: 'ডাটা/এমবি চেক', desc: '*5000*500#' },
            { code: '*511#', label: 'সিম নম্বর চেক', desc: '*511#' },
            { code: '*874#', label: 'জরুরি ব্যালেন্স', desc: '*874#' },
          ].map((u, idx) => (
            <button
              key={idx}
              disabled={isUssdLoading}
              onClick={() => handleExecuteUssd(u.code, u.label)}
              className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-amber-950/40 border border-slate-700 hover:border-amber-500/50 text-left transition active:scale-95 disabled:opacity-50"
            >
              <div className="text-xs font-bold text-slate-100">{u.label}</div>
              <div className="text-[10px] font-mono text-amber-300 mt-0.5">{u.desc}</div>
            </button>
          ))}

          {selectedUssdOp === 'teletalk' && [
            { code: '*152#', label: 'ব্যালেন্স ও ডাটা', desc: '*152#' },
            { code: '*551#', label: 'সিম নম্বর চেক', desc: '*551#' },
            { code: '*152#', label: 'প্যাকেজ মেয়াদ', desc: '*152#' },
            { code: '*551#', label: 'স্ট্যাটাস ভেরিফাই', desc: '*551#' },
          ].map((u, idx) => (
            <button
              key={idx}
              disabled={isUssdLoading}
              onClick={() => handleExecuteUssd(u.code, u.label)}
              className="p-2.5 rounded-2xl bg-slate-800/90 hover:bg-cyan-950/40 border border-slate-700 hover:border-cyan-500/50 text-left transition active:scale-95 disabled:opacity-50"
            >
              <div className="text-xs font-bold text-slate-100">{u.label}</div>
              <div className="text-[10px] font-mono text-cyan-300 mt-0.5">{u.desc}</div>
            </button>
          ))}
        </div>

        {/* Live USSD Output Box */}
        {ussdFlashMsg && (
          <div className="p-3 rounded-2xl bg-slate-950 border border-purple-500/40 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-purple-300 flex items-center space-x-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                <span>GSM মডেম USSD লাইভ রেসপন্স</span>
              </span>
              <button onClick={() => setUssdFlashMsg(null)} className="text-slate-400 hover:text-white text-[10px]">
                ✕
              </button>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 font-mono text-emerald-300 text-xs font-bold border border-slate-800">
              {ussdFlashMsg}
            </div>
          </div>
        )}
      </div>

      {/* 3. Quick Command Templates */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 block">
          {language === 'bn' ? 'কুইক প্রিসেট কমান্ড সমূহ' : 'Quick Preset Commands'}
        </span>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Device Status', cmd: 'STATUS#', desc: 'Battery, GSM & GPS state' },
            { label: 'Check Params', cmd: 'PARAM#', desc: 'Server & APN configs' },
            { label: 'Where Is Vehicle', cmd: 'WHERE#', desc: 'Instant Google Map SMS link' },
            { label: 'Reboot Device', cmd: 'RESET#', desc: 'Soft reboot tracker' },
            { label: 'Speed Limit 80', cmd: 'SPEED,80#', desc: 'Set overspeed to 80 km/h' },
            { label: 'Version Info', cmd: 'VERSION#', desc: 'Firmware version' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickCommand(item.cmd)}
              className="p-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700/80 text-left transition active:scale-95"
            >
              <div className="font-bold text-xs text-slate-100">{item.label}</div>
              <div className="text-[10px] font-mono text-blue-400 mt-0.5">{item.cmd}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Custom GPRS / SMS Command Terminal */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center space-x-2 mb-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {language === 'bn' ? 'কাস্টম কমান্ড টার্মিনাল' : 'Custom Command Terminal'}
          </span>
        </div>

        <form onSubmit={handleCustomSend} className="flex items-center space-x-2 mb-4">
          <input
            type="text"
            value={customCommand}
            onChange={(e) => setCustomCommand(e.target.value)}
            placeholder="e.g. STATUS# or SERVER,1,demo3.traccar.org,5023,0#"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs text-slate-100 font-mono placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="p-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white transition active:scale-95 shadow-md shadow-blue-600/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Command Audit Log */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400">
            {language === 'bn' ? 'কমান্ড হিস্ট্রি ও রিপ্লাই লগ' : 'Command History & Reply Log'}
          </span>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {commandHistory.map((cmd) => (
              <div key={cmd.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-2.5 text-xs">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-mono text-blue-400 font-bold">{cmd.rawCommand}</span>
                  <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(cmd.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                {cmd.responseMessage && (
                  <div className="text-[11px] text-emerald-300 font-mono bg-slate-900/80 rounded-xl p-1.5 mt-1 border border-emerald-500/20">
                    &gt; {cmd.responseMessage}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SOS Emergency Numbers Setup */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center space-x-2 mb-3">
          <PhoneCall className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {language === 'bn' ? 'এসওএস জরুরি নম্বর সেটআপ' : 'SOS Emergency Contacts'}
          </span>
        </div>

        <form onSubmit={handleSaveSos} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Primary SOS Number (Auto Call/SMS on Alert)</label>
            <input
              type="text"
              value={sosNumber1}
              onChange={(e) => setSosNumber1(e.target.value)}
              placeholder="+880 1812-998877"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 mb-1 block">Secondary SOS Number</label>
            <input
              type="text"
              value={sosNumber2}
              onChange={(e) => setSosNumber2(e.target.value)}
              placeholder="+880 1913-445566"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          {sosSaved && (
            <div className="text-xs text-emerald-400 font-semibold flex items-center space-x-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>SOS numbers updated and sent to device!</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition active:scale-95"
          >
            {language === 'bn' ? 'এসওএস নম্বর সেভ করুন' : 'Update SOS Numbers'}
          </button>
        </form>
      </div>

      {/* Pin Modal */}
      <PinVerificationModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onConfirm={() => {
          if (pendingAction === 'cut') sendCommand('engineStop');
          else sendCommand('engineResume');
        }}
        title={pendingAction === 'cut' ? 'Engine Cut (Immobilize)' : 'Resume Engine Power'}
        description="Please confirm 4-digit PIN to transmit command to vehicle tracker."
        isDangerous={pendingAction === 'cut'}
      />
    </div>
  );
};
