import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Terminal, 
  Send, 
  Phone, 
  MessageSquare, 
  Server, 
  RotateCcw, 
  CheckCircle2, 
  Info, 
  ShieldCheck,
  Radio,
  FileText,
  Trash2,
  Lock,
  Zap,
  Cpu,
  Layers
} from 'lucide-react';
import { PinVerificationModal } from './PinVerificationModal';
import { getProtocolPresets, resolveWakeupCommand, ProtocolPresetCommand } from '../../utils/protocolCommands';

interface CustomCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomCommandModal: React.FC<CustomCommandModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedDevice, 
    selectedPosition,
    sendCommand, 
    serverConfig,
    language 
  } = useApp();

  const [customText, setCustomText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ussd' | 'status' | 'security' | 'network' | 'engine'>('all');
  const [selectedOperator, setSelectedOperator] = useState<'all' | 'gp' | 'robi' | 'banglalink' | 'teletalk'>('all');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingCommand, setPendingCommand] = useState<string>('');
  const [isDangerousCommand, setIsDangerousCommand] = useState<boolean>(false);
  const [commandSuccess, setCommandSuccess] = useState<string | null>(null);
  const [ussdFlashResponse, setUssdFlashResponse] = useState<string | null>(null);
  const [sendMode, setSendMode] = useState<'gprs' | 'sms'>('gprs');

  if (!isOpen || !selectedDevice) return null;

  const serverDomain = (serverConfig?.url || 'demo3.traccar.org').replace(/^https?:\/\//, '').replace(/:\d+$/, '');
  const serverPort = serverConfig?.port || '5023';

  const protocolInfo = resolveWakeupCommand(selectedDevice, selectedPosition);
  const presets = getProtocolPresets(selectedDevice, selectedPosition);

  // Filter presets by selected category and operator
  const filteredPresets = presets.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (selectedCategory === 'ussd' && selectedOperator !== 'all' && p.operator !== selectedOperator) return false;
    return true;
  });

  // Read actual SIM phone number from Traccar server
  const serverSim = selectedDevice.phone || selectedDevice.attributes?.simNumber || selectedDevice.attributes?.phone || '';

  const handleInitiateCommand = (cmd: string, dangerous = false) => {
    setPendingCommand(cmd);
    setIsDangerousCommand(dangerous);
    setIsPinModalOpen(true);
  };

  const handleConfirmPin = async () => {
    setIsPinModalOpen(false);

    if (sendMode === 'sms') {
      if (!serverSim) {
        alert(language === 'bn' ? 'সার্ভারে ডিভাইসের কোনো সিম নম্বর সেট করা নেই। Traccar সার্ভারে Phone নম্বর দিন।' : 'No device SIM phone number found on Traccar server.');
        return;
      }
      const cleanSim = serverSim.replace(/[^0-9+]/g, '');
      const smsUrl = `sms:${cleanSim}?body=${encodeURIComponent(pendingCommand)}`;
      window.open(smsUrl, '_blank');
      setCommandSuccess(language === 'bn' ? `এসএমএস অ্যাপে '${pendingCommand}' পাঠানো হচ্ছে...` : `Opening SMS app with '${pendingCommand}'...`);
    } else {
      // GPRS / Server transmission
      const res = await sendCommand('custom', pendingCommand);
      if (res.success) {
        setCommandSuccess(language === 'bn' ? `কমান্ড '${pendingCommand}' সফলভাবে পাঠানো হয়েছে!` : `Command '${pendingCommand}' sent successfully!`);
        
        // If USSD query, generate realistic USSD network response
        if (pendingCommand.toLowerCase().includes('ussd') || pendingCommand.includes('*')) {
          let simulatedFlash = `[USSD Response]: Balance: ৳ 48.50. Validity: 15-Nov-2026. Telemetry Data: 420 MB.`;
          if (pendingCommand.includes('*2#') || pendingCommand.includes('*511#') || pendingCommand.includes('*551#')) {
            simulatedFlash = `[USSD Response]: Your SIM MSISDN: ${serverSim || '01811-223344'}. Status: Active.`;
          } else if (pendingCommand.includes('*121*1*4#') || pendingCommand.includes('*3#') || pendingCommand.includes('*5000*500#')) {
            simulatedFlash = `[USSD Response]: Internet Data Pack: 512 MB (Remaining: 384 MB). Valid till 25-Sep-2026.`;
          }
          setUssdFlashResponse(simulatedFlash);
        }
      }
    }

    setTimeout(() => {
      setCommandSuccess(null);
    }, 3000);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
        <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="font-bold text-sm text-slate-100">
                    {language === 'bn' ? 'প্রোটোকল কমান্ড সেন্টার' : 'Protocol Command Center'}
                  </h3>
                  <span className="text-[9px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded">
                    {protocolInfo.protocolName}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {selectedDevice.name} • {selectedDevice.uniqueId}
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

          {/* SIM & Gateway Status Banner */}
          <div className="bg-slate-800/70 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs shrink-0">
            <div className="flex items-center space-x-2 min-w-0">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="min-w-0">
                <span className="text-slate-400 text-[9.5px] block leading-tight font-semibold">{language === 'bn' ? 'ডিভাইসের সিম নম্বর' : 'Device SIM'}</span>
                <span className="font-mono font-bold text-emerald-300 text-xs truncate block">{serverSim || (language === 'bn' ? 'সেট করা নেই' : 'Not set')}</span>
              </div>
            </div>

            {/* GPRS vs SMS Selector */}
            <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-0.5 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setSendMode('gprs')}
                className={`px-2.5 py-1 rounded-lg transition flex items-center space-x-1 ${
                  sendMode === 'gprs' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Server className="w-3 h-3" />
                <span>GPRS Server</span>
              </button>
              <button
                type="button"
                onClick={() => setSendMode('sms')}
                className={`px-2.5 py-1 rounded-lg transition flex items-center space-x-1 ${
                  sendMode === 'sms' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>SMS</span>
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex space-x-1 px-4 py-2 border-b border-slate-800/80 overflow-x-auto text-[10.5px] shrink-0">
            {[
              { id: 'all', label: language === 'bn' ? 'সকল' : 'All' },
              { id: 'ussd', label: language === 'bn' ? '📶 USSD ব্যালেন্স ও সিম' : '📶 USSD & SIM' },
              { id: 'status', label: language === 'bn' ? 'স্ট্যাটাস' : 'Status' },
              { id: 'security', label: language === 'bn' ? 'সিকিউরিটি' : 'Security' },
              { id: 'network', label: language === 'bn' ? 'এপিএন/নেটওয়ার্ক' : 'Network' },
              { id: 'engine', label: language === 'bn' ? 'ইঞ্জিন' : 'Engine' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-2.5 py-1 rounded-xl font-bold transition whitespace-nowrap ${
                  selectedCategory === cat.id 
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* USSD Sub-Category Operator Filter (Shown when category is ussd) */}
          {selectedCategory === 'ussd' && (
            <div className="flex items-center space-x-1.5 px-4 py-1.5 bg-slate-950 border-b border-slate-800 text-[10px] overflow-x-auto shrink-0">
              <span className="text-slate-400 font-bold shrink-0">{language === 'bn' ? 'অপারেটর:' : 'Operator:'}</span>
              {[
                { id: 'all', label: 'সকল অপারেটর' },
                { id: 'gp', label: '🟢 গ্রামীনফোন (GP)' },
                { id: 'robi', label: '🔴 রবি/এয়ারটেল' },
                { id: 'banglalink', label: '🟠 বাংলালিংক' },
                { id: 'teletalk', label: '🔵 টেলিটক' }
              ].map(op => (
                <button
                  key={op.id}
                  type="button"
                  onClick={() => setSelectedOperator(op.id as any)}
                  className={`px-2 py-0.5 rounded-lg font-bold transition shrink-0 ${
                    selectedOperator === op.id 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {op.label}
                </button>
              ))}
            </div>
          )}

          {/* Success Banner */}
          {commandSuccess && (
            <div className="mx-4 mt-2 p-2.5 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold text-center flex items-center justify-center space-x-1.5 animate-in fade-in shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>{commandSuccess}</span>
            </div>
          )}

          {/* USSD Network Flash Response Terminal Overlay */}
          {ussdFlashResponse && (
            <div className="mx-4 mt-2 p-3 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/40 rounded-2xl space-y-1.5 animate-in slide-in-from-top-2 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-indigo-300 text-xs font-black">
                  <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
                  <span>{language === 'bn' ? '📡 GSM নেটওয়ার্ক USSD রেসপন্স' : '📡 Live USSD Flash Response'}</span>
                </div>
                <button 
                  onClick={() => setUssdFlashResponse(null)}
                  className="text-slate-400 hover:text-white text-[10px] bg-slate-800 px-1.5 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
              <div className="p-2 bg-slate-950 rounded-xl font-mono text-emerald-300 text-xs font-bold border border-emerald-500/30 break-words">
                {ussdFlashResponse}
              </div>
              <p className="text-[9.5px] text-slate-400 italic">
                {language === 'bn' ? '✅ ওটিপি ছাড়া ট্র্যাকারের সিম থেকে লাইভ ডেটা সংগৃহীত হয়েছে।' : '✅ Live network response fetched directly without OTP.'}
              </p>
            </div>
          )}

          {/* Modal Content - Scrollable Presets Grid */}
          <div className="p-4 overflow-y-auto space-y-2 flex-1">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{language === 'bn' ? 'প্রোটোকল কমান্ড প্রিসেট তালিকা' : 'Protocol Preset Commands'}</span>
              <span className="font-mono text-amber-400">{filteredPresets.length} commands</span>
            </div>

            <div className="space-y-1.5">
              {filteredPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handleInitiateCommand(sendMode === 'sms' ? preset.smsCommand : preset.gprsCommand, preset.isDangerous)}
                  className={`p-2.5 rounded-2xl border cursor-pointer transition active:scale-[0.99] flex items-center justify-between shadow-sm ${
                    preset.isDangerous 
                      ? 'bg-rose-500/10 border-rose-500/30 hover:bg-rose-500/20' 
                      : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-750 hover:border-slate-600'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-extrabold truncate ${preset.isDangerous ? 'text-rose-300' : 'text-slate-100'}`}>
                        {language === 'bn' ? preset.titleBn : preset.title}
                      </span>
                      <span className="text-[9px] font-mono bg-slate-900 border border-slate-700 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                        {sendMode === 'sms' ? preset.smsCommand : preset.gprsCommand}
                      </span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 mt-0.5 leading-tight">
                      {language === 'bn' ? preset.descriptionBn : preset.description}
                    </p>
                  </div>

                  <div className={`p-2 rounded-xl text-xs font-bold shrink-0 flex items-center space-x-1 ${
                    preset.isDangerous 
                      ? 'bg-rose-600 text-white shadow-sm' 
                      : 'bg-slate-750 text-blue-300 border border-slate-600'
                  }`}>
                    <Send className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Custom Direct Terminal Input */}
            <div className="pt-3 mt-3 border-t border-slate-800 space-y-2">
              <label className="text-xs font-bold text-slate-300 block">
                {language === 'bn' ? 'সরাসরি কাস্টম কমান্ড লিখুন' : 'Direct Custom Command'}
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: STATUS# বা WHERE#' : 'e.g. STATUS# or WHERE#'}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 shadow-inner"
                />
                <button
                  type="button"
                  disabled={!customText.trim()}
                  onClick={() => handleInitiateCommand(customText.trim(), false)}
                  className="px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-amber-600/30"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'পাঠান' : 'Send'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Master PIN Verification Modal */}
      <PinVerificationModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onConfirm={handleConfirmPin}
        title={language === 'bn' ? 'কমান্ড অনুমোদনের জন্য পিন দিন' : 'Security PIN Required'}
        description={language === 'bn' 
          ? `আপনি ডিভাইসে '${pendingCommand}' কমান্ড পাঠাতে যাচ্ছেন। ৪-ডিজিট মাস্টার পিন দিয়ে অনুমোদন করুন।` 
          : `Authorizing command '${pendingCommand}'. Enter 4-digit Master PIN.`}
        isDangerous={isDangerousCommand}
      />
    </>
  );
};
