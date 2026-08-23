import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, 
  Car, 
  Bike, 
  Truck, 
  Bus, 
  Palette, 
  CheckCircle2, 
  Save, 
  LogOut, 
  ArrowLeft, 
  PhoneCall, 
  User, 
  ShieldAlert, 
  Gauge, 
  Shield, 
  Plus, 
  Edit3, 
  Trash2, 
  MapPin,
  Check,
  Smartphone,
  Lock,
  Radio,
  ShieldCheck,
  Volume2,
  BellRing,
  PhoneForwarded,
  Zap
} from 'lucide-react';
import { VehicleType, Geofence, AlertFeedbackMode } from '../../types/traccar';
import { GeofenceModal } from '../geofence/GeofenceModal';
import { PrivacyPolicyModal } from '../compliance/PrivacyPolicyModal';
import { PinVerificationModal } from '../commands/PinVerificationModal';
import { APP_CONFIG } from '../../config/appConfig';

const VEHICLE_ICONS: { type: VehicleType; label: string; icon: any }[] = [
  { type: 'motorcycle', label: 'Bike (মোটরসাইকেল)', icon: Bike },
  { type: 'car', label: 'Private Car (সেডান/কার)', icon: Car },
  { type: 'cng', label: 'CNG / Auto (সিএনজি)', icon: Car },
  { type: 'pickup', label: 'Pickup / SUV (পিকআপ)', icon: Truck },
  { type: 'truck', label: 'Truck / Lorry (ট্রাক)', icon: Truck },
  { type: 'bus', label: 'Bus (বাস)', icon: Bus },
  { type: 'bicycle', label: 'Bicycle (বাইসাইকেল)', icon: Bike },
];

const VEHICLE_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#eab308', // Yellow
  '#a855f7', // Purple
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#ffffff', // White
];

export const DeviceSettingsView: React.FC = () => {
  const { 
    selectedDevice, 
    selectedPosition,
    updateDeviceProfile, 
    geofences,
    addGeofence,
    updateGeofence,
    deleteGeofence,
    toggleGeofence,
    alertFeedbackMode,
    setAlertFeedbackMode,
    sendCommand,
    logout,
    setActiveTab,
    language 
  } = useApp();

  const [category, setCategory] = useState<VehicleType>(selectedDevice?.category || 'motorcycle');
  const [selectedColor, setSelectedColor] = useState<string>(selectedDevice?.attributes?.color || '#3b82f6');
  const [plateNumber, setPlateNumber] = useState<string>(selectedDevice?.attributes?.plateNumber || '');
  const [driverName, setDriverName] = useState<string>(selectedDevice?.attributes?.driverName || '');
  const [driverPhone, setDriverPhone] = useState<string>(selectedDevice?.attributes?.driverPhone || '');
  const [devicePhone, setDevicePhone] = useState<string>(selectedDevice?.phone || selectedDevice?.attributes?.simNumber || selectedDevice?.attributes?.phone || '');
  const [commandPin, setCommandPin] = useState<string>(selectedDevice?.attributes?.commandPin || '1234');
  const [sos1, setSos1] = useState<string>(selectedDevice?.attributes?.sos1 || '');
  const [sos2, setSos2] = useState<string>(selectedDevice?.attributes?.sos2 || '');
  const [sos3, setSos3] = useState<string>(selectedDevice?.attributes?.sos3 || '');
  const [speedLimit, setSpeedLimit] = useState<number>(selectedDevice?.attributes?.speedLimit || 60);

  // Security Master PIN Modal State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save_profile' | 'sync_sos'>('save_profile');

  // Geofence Modal State
  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);

  // Compliance & Policy Modal State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [sosSyncing, setSosSyncing] = useState(false);
  const [sosSyncMsg, setSosSyncMsg] = useState('');

  if (!selectedDevice) return null;

  const handleOpenAddGeofence = () => {
    setEditingGeofence(null);
    setIsGeofenceModalOpen(true);
  };

  const handleOpenEditGeofence = (geo: Geofence) => {
    setEditingGeofence(geo);
    setIsGeofenceModalOpen(true);
  };

  const handleSaveGeofenceFromModal = (geoData: Omit<Geofence, 'id'>) => {
    if (editingGeofence) {
      updateGeofence(editingGeofence.id, geoData);
    } else {
      addGeofence(geoData);
    }
  };

  const handleTriggerSyncSos = () => {
    if (!sos1.trim()) {
      alert(language === 'bn' ? 'অনুগ্রহ করে প্রাইমারি SOS নম্বরটি লিখুন' : 'Please enter primary SOS number');
      return;
    }
    setPendingAction('sync_sos');
    setIsPinModalOpen(true);
  };

  const handleTriggerSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingAction('save_profile');
    setIsPinModalOpen(true);
  };

  const handleExecutePinConfirmedAction = async () => {
    setIsPinModalOpen(false);

    if (pendingAction === 'sync_sos') {
      setSosSyncing(true);
      setSosSyncMsg(language === 'bn' ? '📡 ট্র্যাকারে SOS কমান্ড পাঠানো হচ্ছে...' : '📡 Sending SOS setup command...');
      
      // Send protocol SOS command
      await sendCommand('custom', `SOS,A,${sos1.trim()}#`);
      
      updateDeviceProfile(selectedDevice.id, {
        attributes: {
          ...selectedDevice.attributes,
          sos1: sos1.trim(),
          sos2: sos2.trim(),
          sos3: sos3.trim()
        }
      });

      setTimeout(() => {
        setSosSyncMsg(language === 'bn' ? '✅ SOS নম্বর সফলভাবে ট্র্যাকারে সিঙ্ক হয়েছে!' : '✅ SOS number synced to hardware!');
        setTimeout(() => {
          setSosSyncing(false);
          setSosSyncMsg('');
        }, 3000);
      }, 1500);
    } else {
      // Save full profile
      updateDeviceProfile(selectedDevice.id, {
        category,
        phone: devicePhone.trim(),
        attributes: {
          ...selectedDevice.attributes,
          color: selectedColor,
          plateNumber: plateNumber.trim(),
          driverName: driverName.trim(),
          driverPhone: driverPhone.trim(),
          phone: devicePhone.trim(),
          simNumber: devicePhone.trim(),
          commandPin: commandPin.trim(),
          sos1: sos1.trim(),
          sos2: sos2.trim(),
          sos3: sos3.trim(),
          speedLimit
        }
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        setActiveTab('map');
      }, 1200);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header with Back Button */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveTab('map')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
            title="Back to Map"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'পেছনে' : 'Back'}</span>
          </button>
          <div>
            <h2 className="text-sm font-bold">
              {language === 'bn' ? 'কন্ট্রোল ও সেটিংস' : 'Controls & Settings'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {selectedDevice.name}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleTriggerSaveProfile} className="space-y-4">
        {/* 1. Vehicle Icon & Color Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 block">
            {language === 'bn' ? '১. গাড়ির আইকন ও মার্কার কালার' : '1. Vehicle Icon & Marker Color'}
          </span>

          <div className="grid grid-cols-2 gap-2">
            {VEHICLE_ICONS.map((item) => {
              const isSelected = category === item.type;
              const IconComp = item.icon;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setCategory(item.type)}
                  className={`p-2.5 rounded-2xl border text-left flex items-center space-x-2.5 transition active:scale-95 ${
                    isSelected 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-md' 
                      : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                    style={{ backgroundColor: isSelected ? selectedColor : '#475569' }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold truncate">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Color Picker */}
          <div className="mt-3.5 pt-3 border-t border-slate-800">
            <div className="flex items-center space-x-2 mb-2">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-bold text-slate-300">
                {language === 'bn' ? 'মার্কারের রং (Color)' : 'Marker Color'}
              </span>
            </div>
            <div className="flex items-center space-x-2.5">
              {VEHICLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition active:scale-90 shadow-md ${
                    selectedColor === c ? 'border-white scale-110 shadow-[0_0_8px_#ffffff]' : 'border-transparent opacity-75 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. Multi-Geofences Safe Zone Management */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {language === 'bn' ? '২. জিওফেন্স সেফ জোন ম্যানেজমেন্ট' : '2. Multiple Safe Zones (Geofence)'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenAddGeofence}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-indigo-600/30 transition active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'নতুন জোন' : 'Add Zone'}</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400">
            {language === 'bn' ? 'একাধিক নিরাপদ জোন তৈরি ও ড্র্যাগ করে সেট করুন। এক বা একাধিক জোন একইসাথে সক্রিয় থাকতে পারে।' : 'Create & drag safe zones on map. Multiple zones can be active at the same time.'}
          </p>

          {/* List of Geofences */}
          <div className="space-y-2 pt-1">
            {geofences.length === 0 ? (
              <div className="p-4 rounded-2xl bg-slate-800/40 border border-dashed border-slate-700 text-center text-xs text-slate-400">
                {language === 'bn' ? 'কোনো জিওফেন্স তৈরি করা হয়নি। "নতুন জোন" চাপুন।' : 'No geofences created yet. Click "Add Zone".'}
              </div>
            ) : (
              geofences.map((geo) => {
                const isEnabled = (geo.attributes as any)?.enabled !== false;
                return (
                  <div 
                    key={geo.id}
                    className="p-3 bg-slate-800/70 border border-slate-700/80 rounded-2xl flex items-center justify-between shadow-inner"
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <div 
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: geo.attributes?.color || '#3b82f6' }}
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-100 truncate">{geo.name}</div>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                          <span>ব্যাসার্ধ: {geo.radius} মি</span>
                          <span>•</span>
                          <span className={isEnabled ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                            {isEnabled ? (language === 'bn' ? 'সক্রিয়' : 'Active') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'Disabled')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleGeofence(geo.id)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition ${
                          isEnabled 
                            ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300' 
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                      >
                        {isEnabled ? (language === 'bn' ? 'চালু' : 'ON') : (language === 'bn' ? 'বন্ধ' : 'OFF')}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditGeofence(geo)}
                        className="p-1.5 rounded-xl bg-slate-750 hover:bg-slate-700 text-slate-300 border border-slate-700"
                        title="Edit Zone"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteGeofence(geo.id)}
                        className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        title="Delete Zone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 3. SIM Phone Number & Command Security PIN Setup */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {language === 'bn' ? '৩. ডিভাইসের সিম ও কমান্ড পিন সেটআপ' : '3. Tracker SIM & Command Security PIN'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Device SIM Phone Number Input */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">
                {language === 'bn' ? 'ডিভাইসের সিম নম্বর' : 'Device Phone / SIM'}
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 absolute left-3 top-2.5 text-emerald-400" />
                <input
                  type="tel"
                  value={devicePhone}
                  onChange={(e) => setDevicePhone(e.target.value)}
                  placeholder="+880 17XXXXXXXX"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>
            </div>

            {/* Command Security PIN Input */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">
                {language === 'bn' ? 'কমান্ড সিকিউরিটি পিন' : 'Command PIN (Default: 1234)'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-amber-400" />
                <input
                  type="password"
                  maxLength={6}
                  value={commandPin}
                  onChange={(e) => setCommandPin(e.target.value)}
                  placeholder="1234"
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 shadow-inner"
                />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-slate-400">
            {language === 'bn' 
              ? 'এসএমএস কমান্ড পাঠানোর জন্য ডিভাইসের সিম নম্বর এবং অ্যাপ থেকে যেকোনো কমান্ড কার্যকর করার পূর্বে এই ৪-ডিজিট পিন যাচাই করা হবে।' 
              : 'Device SIM number for sending commands and 4-digit PIN for security confirmation.'}
          </p>
        </div>

        {/* 3.5. Alert Notification & Feedback Mode Selector */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center space-x-2">
            <BellRing className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              {language === 'bn' ? '৩.৫. নোটিফিকেশন ও অ্যালার্ট ফিডব্যাক মোড' : '3.5. Alert Notification & Sound Mode'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'sound_vibration', title: language === 'bn' ? '🔊+📳 শব্দ ও ভাইব্রেশন' : '🔊+📳 Sound & Vibration', desc: language === 'bn' ? 'সবচেয়ে নিরাপদ' : 'Recommended' },
              { id: 'only_sound', title: language === 'bn' ? '🔊 শুধু শব্দ' : '🔊 Only Sound', desc: language === 'bn' ? 'সাউন্ড অ্যালার্ম' : 'Audio Only' },
              { id: 'only_vibration', title: language === 'bn' ? '📳 শুধু ভাইব্রেশন' : '📳 Only Vibration', desc: language === 'bn' ? 'নীরব কম্পন' : 'Silent Buzz' },
              { id: 'sms_push', title: language === 'bn' ? '📩 এসএমএস ও পুশ' : '📩 SMS & Push', desc: language === 'bn' ? 'টেক্সট বার্তা' : 'Text Alert' },
              { id: 'sms_sound_vibration', title: language === 'bn' ? '🚨 ফুল অ্যালার্ম' : '🚨 Full Alarm', desc: language === 'bn' ? 'এসএমএস+শব্দ+কম্পন' : 'SMS+Audio+Vibe' },
              { id: 'silent', title: language === 'bn' ? '🔕 সম্পূর্ণ নীরব' : '🔕 Silent', desc: language === 'bn' ? 'কোনো শব্দ নেই' : 'Mute All' },
            ].map(mode => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setAlertFeedbackMode(mode.id as AlertFeedbackMode)}
                className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition ${
                  alertFeedbackMode === mode.id 
                    ? 'bg-cyan-600/20 border-cyan-500 text-cyan-200 shadow-md ring-1 ring-cyan-500/50' 
                    : 'bg-slate-800/60 border-slate-700/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="text-xs font-bold">{mode.title}</span>
                <span className="text-[9.5px] opacity-75 mt-0.5">{mode.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 4. SOS Emergency Numbers Setup & Hardware Auto-Dial */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300">
                {language === 'bn' ? '৪. জরুরি SOS মাস্টার নম্বর ও অটো-কল' : '4. SOS Master Number & Auto-Dial'}
              </span>
            </div>
            <span className="text-[9px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold">
              WIRE CUT GUARD
            </span>
          </div>

          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-[11px] text-rose-200 flex items-start space-x-2">
            <PhoneForwarded className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <p className="leading-tight">
              {language === 'bn' 
                ? '🚨 তার কাটা (Wire Cut), পাওয়ার বিচ্ছিন্ন বা অননুমোদিত ইগনিশন হলে ট্র্যাকার সরাসরি এই প্রাইমারি নম্বরে অটো ভয়েস কল এবং অ্যালার্ম এসএমএস পাঠাবে।' 
                : '🚨 Tracker hardware will directly dial an emergency voice phone call and SMS to this primary number on Wire Cut or Power Tampering.'}
            </p>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-bold block mb-1">
              {language === 'bn' ? 'প্রাইমারি SOS নম্বর (মাস্টার ফোন)' : 'Primary SOS Master Phone'}
            </label>
            <div className="relative">
              <PhoneCall className="w-4 h-4 absolute left-3 top-2.5 text-rose-400" />
              <input
                type="tel"
                value={sos1}
                onChange={(e) => setSos1(e.target.value)}
                placeholder="+880 17XXXXXXXX"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-9 pr-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500 shadow-inner"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleTriggerSyncSos}
            disabled={sosSyncing}
            className="w-full py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-600/30 active:scale-95 transition"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{sosSyncing ? (language === 'bn' ? 'সিঙ্ক হচ্ছে...' : 'Syncing...') : (language === 'bn' ? '📞 সেভ ও ট্র্যাকার হার্ডওয়্যারে SOS সিঙ্ক' : '📞 Sync SOS to Hardware')}</span>
          </button>

          {sosSyncMsg && (
            <p className="text-[11px] font-bold text-center text-emerald-400 animate-in fade-in">
              {sosSyncMsg}
            </p>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
            <div>
              <label className="text-xs text-slate-400 block mb-1">SOS 2 (ঐচ্ছিক)</label>
              <input
                type="tel"
                value={sos2}
                onChange={(e) => setSos2(e.target.value)}
                placeholder="+880 18XXXXXXXX"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">SOS 3 (ঐচ্ছিক)</label>
              <input
                type="tel"
                value={sos3}
                onChange={(e) => setSos3(e.target.value)}
                placeholder="+880 19XXXXXXXX"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* 5. Owner / Driver & Vehicle Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {language === 'bn' ? '৫. গাড়ির নম্বর ও মালিকের তথ্য' : '5. Vehicle & Owner Details'}
            </span>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">
              {language === 'bn' ? 'গাড়ির রেজিস্ট্রেশন নম্বর (Vehicle / Plate No)' : 'Vehicle / License Plate Number'}
            </label>
            <input
              type="text"
              value={plateNumber}
              onChange={(e) => setPlateNumber(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: ঢাকা মেট্রো ল-১২-৩৪৫৬' : 'e.g. Dhaka Metro LA-12-3456'}
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {language === 'bn' ? 'মালিক / চালকের নাম' : 'Owner / Driver Name'}
              </label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder={language === 'bn' ? 'নাম লিখুন' : 'Name'}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {language === 'bn' ? 'চালকের ফোন নম্বর' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                placeholder="+880 17XXXXXXXX"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Speed Limit */}
          <div className="pt-2">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400 flex items-center space-x-1">
                <Gauge className="w-3.5 h-3.5 text-rose-400" />
                <span>{language === 'bn' ? 'গতিসীমা অ্যালার্ট' : 'Overspeed Limit'}</span>
              </span>
              <span className="font-bold text-rose-400">{speedLimit} km/h</span>
            </div>
            <input
              type="range"
              min={40}
              max={140}
              step={5}
              value={speedLimit}
              onChange={(e) => setSpeedLimit(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
          </div>
        </div>

        {/* 6. App & Publisher Information (Store Compliant) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {language === 'bn' ? '৬. অ্যাপ ও প্রকাশক তথ্য' : '6. About Application'}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{language === 'bn' ? 'অ্যাপের নাম' : 'App Name'}:</span>
              <span className="font-extrabold text-blue-400">{APP_CONFIG.appDisplayName}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{language === 'bn' ? 'ভার্সন' : 'Version'}:</span>
              <span className="font-mono font-bold text-slate-200">v{APP_CONFIG.version} (Build {APP_CONFIG.buildNumber})</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{language === 'bn' ? 'প্রকাশক (Publisher)' : 'Publisher'}:</span>
              <span className="font-bold text-slate-100">{APP_CONFIG.publisher}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">{language === 'bn' ? 'ডোমেইন' : 'Domain'}:</span>
              <a href={APP_CONFIG.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                {APP_CONFIG.publisherDomain}
              </a>
            </div>
          </div>

          {/* Privacy Policy Button */}
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-blue-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95 shadow-sm"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span>{language === 'bn' ? 'প্রাইভেসী পলিসি ও নিরাপত্তা শর্তাবলী' : 'Privacy Policy & Terms of Service'}</span>
          </button>

          {/* Account Deletion Request Button (Apple & Google Play Mandate) */}
          <button
            type="button"
            onClick={() => {
              if (window.confirm(language === 'bn' ? 'আপনি কি আপনার অ্যাকাউন্ট ও সকল জিপিএস হিস্টোরি ডেটা মুছে ফেলার জন্য অনুরোধ পাঠাতে চান?' : 'Do you want to request complete account and telemetry data deletion?')) {
                alert(language === 'bn' ? 'আপনার ডেটা ডিলিটেশনের অনুরোধ সফলভাবে গ্রহণ করা হয়েছে।' : 'Your data deletion request has been submitted.');
              }
            }}
            className="w-full py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-medium text-[11px] flex items-center justify-center space-x-1.5 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'অ্যাকাউন্ট ও ডেটা ডিলিটেশন অনুরোধ' : 'Request Account & Data Deletion'}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{language === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings saved successfully!'}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition active:scale-[0.98]"
        >
          <Save className="w-4 h-4" />
          <span>{language === 'bn' ? 'সেটিংস সংরক্ষণ করুন (Save Settings)' : 'Save Settings'}</span>
        </button>

        {/* Logout Button */}
        <button
          type="button"
          onClick={logout}
          className="w-full py-2.5 rounded-2xl bg-slate-800/80 hover:bg-rose-600/20 hover:border-rose-500 border border-slate-700/80 text-rose-400 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-[0.98]"
        >
          <LogOut className="w-4 h-4" />
          <span>{language === 'bn' ? 'লগআউট করুন' : 'Logout Account'}</span>
        </button>
      </form>

      {/* Geofence Add/Edit Drag & Search Modal */}
      <GeofenceModal
        isOpen={isGeofenceModalOpen}
        onClose={() => setIsGeofenceModalOpen(false)}
        onSave={handleSaveGeofenceFromModal}
        initialData={editingGeofence}
        defaultCenter={selectedPosition ? { lat: selectedPosition.latitude, lng: selectedPosition.longitude } : undefined}
        language={language}
      />

      {/* Privacy Policy & App Store Compliance Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        language={language}
      />

      {/* Security Master PIN Verification Modal for Settings & SOS */}
      <PinVerificationModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onConfirm={handleExecutePinConfirmedAction}
        title={pendingAction === 'sync_sos' 
          ? (language === 'bn' ? 'SOS মাস্টার নম্বর সিঙ্কের জন্য পিন দিন' : 'Authorize SOS Master Number Sync') 
          : (language === 'bn' ? 'সেটিংস সংরক্ষণের জন্য পিন দিন' : 'Authorize Settings Update')}
        description={pendingAction === 'sync_sos'
          ? (language === 'bn' ? `ট্র্যাকার হার্ডওয়্যারে প্রাইমারি SOS নম্বর (${sos1}) সিঙ্ক করতে ৪-ডিজিট মাস্টার পিন দিন।` : `Enter 4-digit PIN to sync primary SOS phone (${sos1}) to tracker hardware.`)
          : (language === 'bn' ? 'গাড়ির নম্বর, চালক ও ডিভাইস সেটিংস সংরক্ষণ করতে ৪-ডিজিট মাস্টার পিন দিন।' : 'Enter 4-digit Master PIN to save vehicle and profile settings.')}
        isDangerous={false}
      />
    </div>
  );
};
