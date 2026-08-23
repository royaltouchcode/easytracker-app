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
  HelpCircle
} from 'lucide-react';
import { PinVerificationModal } from './PinVerificationModal';

export const CommandCenterView: React.FC = () => {
  const { 
    selectedDevice, 
    selectedPosition, 
    commandHistory, 
    sendCommand, 
    language, 
    t 
  } = useApp();

  const [customCommand, setCustomCommand] = useState('');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'cut' | 'resume'>('cut');
  const [sosNumber1, setSosNumber1] = useState(selectedDevice?.attributes?.sosNumber1 || '+880 1812-998877');
  const [sosNumber2, setSosNumber2] = useState(selectedDevice?.attributes?.sosNumber2 || '+880 1913-445566');
  const [sosSaved, setSosSaved] = useState(false);

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

      {/* 2. Quick Command Templates */}
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
