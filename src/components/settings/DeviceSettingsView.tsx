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
  Zap,
  Bot,
  Flame,
  Users,
  ShoppingBag,
  Gift,
  Copy,
  X
} from 'lucide-react';
import { VehicleType, Geofence, AlertFeedbackMode } from '../../types/traccar';
import { GeofenceModal } from '../geofence/GeofenceModal';
import { PrivacyPolicyModal } from '../compliance/PrivacyPolicyModal';
import { RefundPolicyModal } from '../compliance/RefundPolicyModal';
import { DataDeletionModal } from '../compliance/DataDeletionModal';
import { VehicleSpecSelectorModal } from './VehicleSpecSelectorModal';
import { PinVerificationModal } from '../commands/PinVerificationModal';
import { EmergencyRescueModal } from '../emergency/EmergencyRescueModal';
import { PublicDeviceStore } from '../store/PublicDeviceStore';
import { APP_CONFIG } from '../../config/appConfig';
import { VehicleIcon, getVehicleMarkerSvg } from '../../utils/vehicleIcons';

const VEHICLE_ICONS: { type: VehicleType; label: string }[] = [
  { type: 'motorcycle', label: 'Bike (মোটরসাইকেল)' },
  { type: 'scooter', label: 'Scooter / Scooty (স্কুটার)' },
  { type: 'car', label: 'Private Car (সেডান/কার)' },
  { type: 'ambulance', label: 'Ambulance (অ্যাম্বুলেন্স)' },
  { type: 'cng', label: 'CNG / Auto (সিএনজি)' },
  { type: 'pickup', label: 'Pickup / SUV (পিকআপ)' },
  { type: 'truck', label: 'Truck / Lorry (ট্রাক)' },
  { type: 'bus', label: 'Bus (বাস)' },
  { type: 'bicycle', label: 'Bicycle (বাইসাইকেল)' },
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
  const [fatherName, setFatherName] = useState<string>(selectedDevice?.attributes?.fatherName || '');
  const [motherName, setMotherName] = useState<string>(selectedDevice?.attributes?.motherName || '');
  const [speedLimit, setSpeedLimit] = useState<number>(selectedDevice?.attributes?.speedLimit || 60);

  // Security Master PIN Modal State
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<'save_profile' | 'sync_sos'>('save_profile');

  // Geofence Modal State
  const [isGeofenceModalOpen, setIsGeofenceModalOpen] = useState(false);
  const [editingGeofence, setEditingGeofence] = useState<Geofence | null>(null);

  // Compliance & Policy Modal State
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isDataDeletionModalOpen, setIsDataDeletionModalOpen] = useState(false);

  // Vehicle AI Spec Selector Modal State
  const [isSpecModalOpen, setIsSpecModalOpen] = useState(false);
  const [vehicleSpec, setVehicleSpec] = useState<any>(selectedDevice?.attributes?.vehicleSpec || null);

  // Emergency Rescue Modal State
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);

  // Direct Device Store Modal State
  const [isDeviceStoreOpen, setIsDeviceStoreOpen] = useState(false);

  // Referral Program Modal State
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);

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
          fatherName: fatherName.trim(),
          motherName: motherName.trim(),
          phone: devicePhone.trim(),
          simNumber: devicePhone.trim(),
          commandPin: commandPin.trim(),
          sos1: sos1.trim(),
          sos2: sos2.trim(),
          sos3: sos3.trim(),
          speedLimit,
          vehicleSpec
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

      {/* 🛍️ Customer Quick Actions: Add Another Vehicle & Referral Program */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => setIsDeviceStoreOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-2 border-emerald-500/60 hover:border-emerald-400 text-left flex items-center justify-between transition active:scale-95 shadow-lg group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">🛒 নতুন গাড়ি বা ট্র্যাকার কিনুন</span>
              <span className="text-[10px] text-slate-400">ডোরস্টেপ টেকনিশিয়ান ইনস্টলেশন সহ</span>
            </div>
          </div>
          <span className="text-[9.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono shrink-0 ml-2">
            BUY STORE
          </span>
        </button>

        <button
          type="button"
          onClick={() => setIsReferralModalOpen(true)}
          className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-slate-900 border-2 border-purple-500/60 hover:border-purple-400 text-left flex items-center justify-between transition active:scale-95 shadow-lg group"
        >
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Gift className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <span className="text-xs font-black text-white block">🎁 বন্ধুকে রেফার করুন ও ক্যাশব্যাক পান</span>
              <span className="text-[10px] text-purple-300/80">প্রতি সফল অর্ডারে ১ মাস ফ্রি সার্ভিস বা ৳১০০!</span>
            </div>
          </div>
          <span className="text-[9.5px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono shrink-0 ml-2">
            REFERRAL
          </span>
        </button>
      </div>

      <form onSubmit={handleTriggerSaveProfile} className="space-y-4">
        {/* 1. Vehicle Icon & Color Selection (EasyTracker HD 3D Style) */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? '১. ইন্টারেক্টিভ ৩ডি ভেহিকেল আইকন ও মার্কার' : '1. Interactive 3D Vehicle Icon & Marker'}</span>
            </span>
            <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold">
              EasyTracker 3D Vector
            </span>
          </div>

          {/* Interactive Vehicle Grid (Horizontal Balanced Showcase Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {VEHICLE_ICONS.map((item) => {
              const isSelected = category === item.type;
              return (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => setCategory(item.type)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center space-x-3.5 transition-all duration-200 active:scale-95 group relative overflow-hidden ${
                    isSelected 
                      ? 'bg-gradient-to-r from-blue-950/70 via-slate-900 to-slate-900 border-2 border-blue-400 shadow-xl shadow-blue-950/70 ring-1 ring-blue-500/40' 
                      : 'bg-slate-950/80 border-slate-800 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  {/* Selection indicator pill */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                      <span className="text-[8.5px] font-black text-blue-300 bg-blue-500/20 border border-blue-400/40 px-2 py-0.5 rounded-full font-mono">
                        SELECTED
                      </span>
                    </div>
                  )}

                  {/* Large 3D Vehicle Showcase Canvas */}
                  <div 
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center p-1.5 transition-all duration-300 group-hover:scale-105 shadow-md shrink-0 ${
                      isSelected 
                        ? 'bg-slate-900 border-2 border-blue-400/60' 
                        : 'bg-slate-900/90 border border-slate-800'
                    }`}
                    style={{
                      boxShadow: isSelected ? `0 0 16px ${selectedColor}44` : undefined
                    }}
                  >
                    <div 
                      dangerouslySetInnerHTML={{ 
                        __html: getVehicleMarkerSvg(item.type, isSelected ? selectedColor : '#94a3b8') 
                      }} 
                      className="w-full h-full flex items-center justify-center"
                    />
                  </div>

                  {/* Vehicle Name, Category & Tag */}
                  <div className="flex-1 min-w-0 pr-12">
                    <span className={`text-xs sm:text-sm font-extrabold block leading-snug truncate ${isSelected ? 'text-white drop-shadow' : 'text-slate-200'}`}>
                      {item.label.split('(')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 block truncate mt-0.5 font-medium">
                      {item.label.includes('(') ? item.label.split('(')[1].replace(')', '') : ''}
                    </span>
                    <span className="text-[8.5px] font-mono text-blue-400/80 font-bold block mt-1">
                      EasyTracker 3D HD
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Color Picker Palette */}
          <div className="pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Palette className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-xs font-bold text-slate-300">
                  {language === 'bn' ? 'মার্কারের কাস্টম রং (Marker Color)' : 'Custom Marker Color'}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedColor.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center space-x-3 overflow-x-auto py-1">
              {VEHICLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all duration-200 active:scale-90 shrink-0 ${
                    selectedColor === c 
                      ? 'border-white scale-110 shadow-[0_0_12px_rgba(255,255,255,0.6)] ring-2 ring-blue-500/50' 
                      : 'border-slate-800 opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Live Map Radar Simulation Box */}
          <div className="bg-slate-950 border border-blue-500/40 rounded-3xl p-3.5 flex items-center justify-between shadow-xl">
            <div className="flex items-center space-x-3.5">
              {/* Radar pulse container */}
              <div className="relative w-16 h-16 rounded-2xl bg-slate-900 border-2 border-blue-500/50 flex items-center justify-center overflow-hidden shadow-lg shadow-blue-950/60 shrink-0">
                <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:8px_8px] opacity-40" />
                <div className="absolute w-12 h-12 rounded-full border border-blue-500/40 animate-ping opacity-50" />
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: getVehicleMarkerSvg(category, selectedColor) 
                  }} 
                  className="w-12 h-12 relative z-10 drop-shadow-[0_0_12px_rgba(59,130,246,0.8)]"
                />
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs sm:text-sm font-extrabold text-white">লাইভ মার্কার প্রিভিউ</span>
                  <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded-full font-mono">
                    HD LIVE
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-400 mt-0.5">
                  ম্যাপে আপনার গাড়িটি এই নির্দিষ্ট কালার, ৩ডি মডেল ও শেপে ঘুরবে
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-400 block font-bold">
                {selectedDevice.attributes?.plateNumber || selectedDevice.name}
              </span>
              <span className="text-[8.5px] font-bold text-blue-400">EasyTracker HD</span>
            </div>
          </div>

          {/* Vehicle Model & AI Spec Selector Card */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'bn' ? 'মডেল ও ইঞ্জিন স্পেসিফিকেশন:' : 'Vehicle Model & Engine Specs:'}</span>
              </div>
              <div className="text-[10.5px] text-slate-400 mt-0.5">
                {vehicleSpec?.modelName 
                  ? <span className="text-purple-300 font-bold">{vehicleSpec.manufacturer || ''} {vehicleSpec.modelName} <span className="text-amber-300 font-mono">({vehicleSpec.engineOilGrade})</span></span>
                  : (language === 'bn' ? 'মডেল সিলেক্ট করা নেই (ক্লিক করুন)' : 'No model selected (Click to set)')}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSpecModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-300 font-bold text-xs flex items-center space-x-1 transition active:scale-95 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'মডেল AI সেট' : 'Select Model'}</span>
            </button>
          </div>
        </div>

        {/* 📍 Location Calibration & Real GPS Fix Card */}
        <div className="bg-gradient-to-br from-blue-950/60 via-slate-900 to-slate-900 border border-blue-500/40 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
                {language === 'bn' ? '📍 বাইকের অবস্থান ক্যালিব্রেশন ও রিয়েল ফিক্স' : 'Location Calibration & Real Fix'}
              </span>
            </div>
            <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700 font-bold">
              GPS FIX
            </span>
          </div>

          <p className="text-[11px] text-slate-300">
            {language === 'bn' 
              ? 'বাইকের অবস্থান ভুল দেখালে বা অন্য কোনো এলাকা দেখালে আপনার ফোনের লাইভ জিপিএস দিয়ে ১-ক্লিকে সঠিক অবস্থান সেট করুন অথবা Traccar সার্ভার থেকে ফ্রেশ ডাটা রিফ্রেশ করুন।' 
              : 'Calibrate vehicle location to your current phone position or fetch fresh GPS stream from Traccar server.'}
          </p>

          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCalibratorOpen(true)}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30 active:scale-95 transition"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? '📍 অবস্থান ঠিক / ক্যালিব্রেট করুন' : 'Calibrate Location'}</span>
            </button>
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

          {/* 🌟 Prominently Highlighted SOS 2 and SOS 3 Box for Crash Alerts & Emergency Bypass */}
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border-2 border-amber-500/60 rounded-3xl p-3.5 space-y-2.5 shadow-xl shadow-amber-950/40">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-amber-300 flex items-center space-x-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>🚨 জরুরি এক্সিডেন্ট এলার্ট ও রেসকিউ বাইপাস নম্বর (SOS 2 ও SOS 3)</span>
              </span>
              <span className="text-[9.5px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded-full uppercase">
                অতীব গুরুত্বপূর্ণ
              </span>
            </div>

            <p className="text-[10.5px] text-slate-300 leading-relaxed bg-slate-950/80 p-2.5 rounded-2xl border border-amber-500/30">
              💡 <strong className="text-amber-200">কেন এই ২টি নম্বর যুক্ত করবেন?</strong> মারাত্মক দুর্ঘটনা (Accident) বা ছিনতাইয়ের সময় আপনার নিজের ফোন নষ্ট বা ছিনতাইকারীর কবলে চলে গেলে ট্র্যাকার তাৎক্ষণিক <strong>SOS 2 ও SOS 3</strong> নম্বরে লাইভ ক্র্যাশ এলার্ট ও জিপিএস লিংক পাঠাবে। এছাড়াও জরুরি মুহূর্তে আপনার অবর্তমানে কাস্টমার কেয়ার/পুলিশ ভেরিফিকেশনে এই অভিভাবক নম্বরগুলো দিয়ে <strong>রেসকিউ সেশন ও ইঞ্জিন লক আনলক (Bypass)</strong> করা যাবে।
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-amber-500/40 space-y-1">
                <label className="text-[11px] font-extrabold text-amber-300 flex items-center justify-between">
                  <span>🚨 SOS 2 (পিতা / মাতা / জীবনসঙ্গী)</span>
                  <span className="text-[9px] text-emerald-400 font-mono">ভেরিফাইড ব্যাকআপ</span>
                </label>
                <div className="relative">
                  <PhoneCall className="w-3.5 h-3.5 absolute left-3 top-2.5 text-amber-400" />
                  <input
                    type="tel"
                    value={sos2}
                    onChange={(e) => setSos2(e.target.value)}
                    placeholder="+880 18XXXXXXXX"
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl pl-8 pr-3 py-2 text-xs text-amber-100 font-mono font-bold focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-2xl border border-amber-500/40 space-y-1">
                <label className="text-[11px] font-extrabold text-amber-300 flex items-center justify-between">
                  <span>🚨 SOS 3 (ভাই / বিশ্বস্ত অভিভাবক)</span>
                  <span className="text-[9px] text-emerald-400 font-mono">রেসকিউ বাইপাস</span>
                </label>
                <div className="relative">
                  <PhoneCall className="w-3.5 h-3.5 absolute left-3 top-2.5 text-amber-400" />
                  <input
                    type="tel"
                    value={sos3}
                    onChange={(e) => setSos3(e.target.value)}
                    placeholder="+880 19XXXXXXXX"
                    className="w-full bg-slate-900 border border-amber-500/50 rounded-xl pl-8 pr-3 py-2 text-xs text-amber-100 font-mono font-bold focus:outline-none focus:border-amber-400 shadow-inner"
                  />
                </div>
              </div>
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

          {/* Mandatory Family KYC for Emergency Rescue & Police Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-blue-500/30 space-y-1">
              <label className="text-[11px] font-extrabold text-blue-300 flex items-center justify-between">
                <span>👤 পিতার নাম (Father's Name) *</span>
                <span className="text-[9px] text-amber-400 font-bold uppercase">বাধ্যতামূলক</span>
              </label>
              <input
                type="text"
                required
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder={language === 'bn' ? 'পিতার পুরো নাম লিখুন' : "Father's Full Name"}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
              />
              <span className="text-[9px] text-slate-400 block">রেসকিউ হটলাইন ও পুলিশ জিডি ভেরিফিকেশনে ব্যবহৃত হবে</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-blue-500/30 space-y-1">
              <label className="text-[11px] font-extrabold text-blue-300 flex items-center justify-between">
                <span>👤 মাতার নাম (Mother's Name) *</span>
                <span className="text-[9px] text-amber-400 font-bold uppercase">বাধ্যতামূলক</span>
              </label>
              <input
                type="text"
                required
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                placeholder={language === 'bn' ? 'মাতার পুরো নাম লিখুন' : "Mother's Full Name"}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
              />
              <span className="text-[9px] text-slate-400 block">জরুরি মালিকানা ও রেসকিউ বাইপাসে প্রয়োজনীয়</span>
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

        {/* 🚨 24/7 Red-Line Emergency Rescue & Hijack Helpline Card */}
        <div className="bg-gradient-to-br from-rose-950 via-slate-900 to-slate-900 border-2 border-rose-500 rounded-3xl p-4 shadow-2xl shadow-rose-950/60 space-y-3">
          <div className="flex items-center justify-between border-b border-rose-500/30 pb-2">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-rose-500 animate-pulse" />
              <span className="text-xs font-black uppercase tracking-wider text-rose-200">
                {language === 'bn' ? '🚨 ২৪/৭ ইমার্জেন্সি রেসকিউ ও ছিনতাই উদ্ধার হটলাইন' : '24/7 Emergency Rescue & Hijack Hotline'}
              </span>
            </div>
            <span className="text-[9.5px] font-mono bg-rose-600 text-white px-2 py-0.5 rounded-full font-bold">
              24/7 RED-LINE
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">
            {language === 'bn' 
              ? 'গাড়ি চুরি, ছিনতাই বা গুরুতর সড়ক দুর্ঘটনার ক্ষেত্রে আমাদের বিশেষ উদ্ধারকারী স্কোয়াড এবং বাংলাদেশ পুলিশের সাথে ২-ওয়ে কানেক্টরে তাৎক্ষণিক রেসকিউ টিম পাঠানো হয়।' 
              : 'Immediate rapid intercept team dispatch & 2-way police gateway authorization in case of theft, hijack, or crash emergencies.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <a
              href="tel:09612000999"
              className="py-2.5 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-rose-600/30 transition active:scale-95"
            >
              <PhoneCall className="w-4 h-4" />
              <span>০৯৬১২-০০০৯৯৯ (রেসকিউ)</span>
            </a>

            <a
              href="tel:999"
              className="py-2.5 px-3 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <ShieldAlert className="w-4 h-4 text-blue-400" />
              <span>৯৯৯ পুলিশ কন্ট্রোল</span>
            </a>

            <button
              type="button"
              onClick={() => setIsEmergencyModalOpen(true)}
              className="py-2.5 px-3 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-500 hover:to-rose-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md transition active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>১-ট্যাপ রেসকিউ কমান্ড</span>
            </button>
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

          {/* Legal Compliance Buttons: Privacy & Refund */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setIsPrivacyModalOpen(true)}
              className="py-2.5 px-2 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-blue-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>{language === 'bn' ? 'প্রাইভেসী পলিসি' : 'Privacy Policy'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsRefundModalOpen(true)}
              className="py-2.5 px-2 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'রিফান্ড পলিসি' : 'Refund Policy'}</span>
            </button>
          </div>

          {/* Account Deletion Request Button (Apple & Google Play Mandate with PIN Verification) */}
          <button
            type="button"
            onClick={() => setIsDataDeletionModalOpen(true)}
            className="w-full py-2 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? '⚠️ অ্যাকাউন্ট ও ডেটা ডিলিটেশন অনুরোধ (পিন আবশ্যক)' : '⚠️ Request Account & Data Deletion (PIN Required)'}</span>
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

      {/* Refund & Money-Back Policy Modal */}
      <RefundPolicyModal
        isOpen={isRefundModalOpen}
        onClose={() => setIsRefundModalOpen(false)}
        language={language}
      />

      {/* Account & Telemetry Data Deletion Modal (PIN Mandatory) */}
      <DataDeletionModal
        isOpen={isDataDeletionModalOpen}
        onClose={() => setIsDataDeletionModalOpen(false)}
        language={language}
      />

      {/* Vehicle AI Spec Selector Modal */}
      <VehicleSpecSelectorModal
        isOpen={isSpecModalOpen}
        onClose={() => setIsSpecModalOpen(false)}
        initialCategory={category}
        initialSpec={vehicleSpec}
        onSaveSpec={(newSpec) => {
          setVehicleSpec(newSpec);
          if (newSpec.category) setCategory(newSpec.category);
          // Directly persist & sync
          updateDeviceProfile(selectedDevice.id, {
            category: newSpec.category || category,
            attributes: {
              ...selectedDevice.attributes,
              vehicleSpec: newSpec
            }
          });
        }}
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

      {/* In-App Emergency Rescue & Hijack Modal */}
      <EmergencyRescueModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
      />

      {/* Direct Device Store & Add Vehicle Modal */}
      <PublicDeviceStore
        isOpen={isDeviceStoreOpen}
        onClose={() => setIsDeviceStoreOpen(false)}
      />

      {/* 🎁 Customer Referral & Cashback Hub Modal */}
      {isReferralModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-purple-500/50 rounded-3xl max-w-md w-full p-4 md:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/50 flex items-center justify-center shadow-lg">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    🎁 বন্ধুকে রেফার করুন ও ক্যাশব্যাক পান
                  </h3>
                  <p className="text-[10px] text-purple-300 font-mono">
                    EasyTracker Referral & Loyalty Rewards
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 2-Way Reward Explain Banner */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-purple-950/70 border border-purple-500/40 p-3 rounded-2xl space-y-1">
                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.2 rounded font-mono">
                  আপনি পাচ্ছেন
                </span>
                <div className="text-base font-black text-white">৳১০০ / ১ মাস</div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  প্রতি সফল ইনস্টলেশনে ৳১০০ ক্যাশব্যাক বা ১ মাস ফ্রি সাবস্ক্রিপশন
                </p>
              </div>

              <div className="bg-emerald-950/70 border border-emerald-500/40 p-3 rounded-2xl space-y-1">
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded font-mono">
                  আপনার বন্ধু পাচ্ছে
                </span>
                <div className="text-base font-black text-emerald-300">৳১০০ ছাড়</div>
                <p className="text-[10px] text-slate-300 leading-tight">
                  রেফারেল কোড বসিয়ে অর্ডার করলেই পাচ্ছেন ইনস্ট্যান্ট ৳১০০ ডিসকাউন্ট
                </p>
              </div>
            </div>

            {/* Customer's Referral Code Card */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                <span>আপনার ইউনিক রেফারেল কোড:</span>
                <span className="text-[10px] text-purple-400 font-mono">লাইফটাইম সক্রিয়</span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-slate-900 border border-purple-500/50 rounded-xl py-2 px-3 text-center font-mono font-black text-base text-purple-300 tracking-wider">
                  {`EASY-${selectedDevice.id.toString().padStart(4, '0')}`}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const code = `EASY-${selectedDevice.id.toString().padStart(4, '0')}`;
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      navigator.clipboard.writeText(code);
                      alert(`✅ রেফারেল কোড "${code}" কপি হয়েছে!`);
                    }
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1 transition active:scale-95 shadow-md"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>কপি</span>
                </button>
              </div>
            </div>

            {/* Live Stats Counter */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block">মোট রেফারেল</span>
                <span className="text-base font-mono font-black text-white mt-0.5 block">৩ জন</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block">অর্জিত ক্যাশব্যাক</span>
                <span className="text-base font-mono font-black text-emerald-400 mt-0.5 block">৳৩০০</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[9.5px] text-slate-400 block">ফ্রি সাবস্ক্রিপশন</span>
                <span className="text-base font-mono font-black text-purple-400 mt-0.5 block">৩ মাস</span>
              </div>
            </div>

            {/* 1-Click WhatsApp & Social Share */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  const code = `EASY-${selectedDevice.id.toString().padStart(4, '0')}`;
                  const msg = `*🚗 EasyTracker GPS Tracker Special Offer!*\n\nআমার রেফারেল কোড *${code}* ব্যবহার করে নতুন ট্র্যাকার বা সাবস্ক্রিপশন কিনলেই পাচ্ছেন ৳১০০ নগদ ছাড় ও ফ্রি ডোরস্টেপ ইনস্টলেশন!\n\nভিজিট করুন: ${APP_CONFIG.website}`;
                  const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
                  if (typeof window !== 'undefined') window.open(waUrl, '_blank');
                }}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition active:scale-95"
              >
                <span>💬 হোয়াটসঅ্যাপে বন্ধুদের শেয়ার করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setIsReferralModalOpen(false)}
                className="w-full py-2 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
