import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MapPin, 
  Navigation, 
  Crosshair, 
  CheckCircle2, 
  X, 
  RefreshCw, 
  Sparkles, 
  AlertTriangle, 
  Trash2, 
  Sliders, 
  Compass, 
  Building2,
  Lock,
  Globe
} from 'lucide-react';
import { VehicleIcon } from '../../utils/vehicleIcons';

interface VehicleLocationCalibratorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_LOCATIONS = [
  { nameBn: 'ঢাকা - মিরপুর ১০', lat: 23.8067, lon: 90.3687, addr: 'Mirpur-10 Circle, Dhaka' },
  { nameBn: 'ঢাকা - উত্তরা সেক্টর ৭', lat: 23.8728, lon: 90.3984, addr: 'Sector-7, Uttara, Dhaka' },
  { nameBn: 'ঢাকা - ধানমন্ডি ২৭', lat: 23.7538, lon: 90.3770, addr: 'Dhanmondi 27, Dhaka' },
  { nameBn: 'ঢাকা - গুলশান ২', lat: 23.7937, lon: 90.4066, addr: 'Gulshan-2, Dhaka' },
  { nameBn: 'ঢাকা - মতিঝিল / পল্টন', lat: 23.7330, lon: 90.4170, addr: 'Motijheel C/A, Dhaka' },
  { nameBn: 'চট্টগ্রাম - জিইসি মোড়', lat: 22.3587, lon: 91.8215, addr: 'GEC Circle, CDA Ave, Chattogram' },
  { nameBn: 'সিলেট - জিন্দাবাজার', lat: 24.8949, lon: 91.8687, addr: 'Zindabazar, Sylhet' },
  { nameBn: 'রাজশাহী - সাহেব বাজার', lat: 24.3636, lon: 88.6241, addr: 'Saheb Bazar, Rajshahi' },
  { nameBn: 'খুলনা - শিববাড়ি মোড়', lat: 22.8200, lon: 89.5500, addr: 'Shibbari More, Khulna' },
  { nameBn: 'বগুড়া - সাতমাথা', lat: 24.8465, lon: 89.3730, addr: 'Satmatha, Bogura' }
];

export const VehicleLocationCalibratorModal: React.FC<VehicleLocationCalibratorModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedDevice, 
    selectedPosition, 
    calibrateVehicleLocation, 
    userLocation, 
    syncServerData, 
    serverConfig, 
    purgeDemoFleetData, 
    isDemoPurged,
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'phone_gps' | 'custom_coords' | 'server_sync'>('phone_gps');
  
  // Custom Coords State
  const [customLat, setCustomLat] = useState<string>(selectedPosition?.latitude ? String(selectedPosition.latitude) : '23.8067');
  const [customLon, setCustomLon] = useState<string>(selectedPosition?.longitude ? String(selectedPosition.longitude) : '90.3687');
  const [customAddress, setCustomAddress] = useState<string>(selectedPosition?.address || 'মিরপুর, ঢাকা');
  
  const [isDetectingPhone, setIsDetectingPhone] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen || !selectedDevice) return null;

  // 1. One-tap set location from Phone GPS
  const handleSetFromPhoneGPS = () => {
    setIsDetectingPhone(true);
    setSuccessMessage('');

    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const accuracy = Math.round(pos.coords.accuracy);
          const autoAddr = `আমার অবস্থান (জিপিএস সঠিকতা: ±${accuracy} মি)`;

          calibrateVehicleLocation(selectedDevice.id, lat, lon, autoAddr);
          setIsDetectingPhone(false);
          setSuccessMessage(`✅ আপনার ফোনের লাইভ লোকেশনে (${lat.toFixed(4)}, ${lon.toFixed(4)}) বাইক সফলভাবে সেট হয়েছে!`);
          setTimeout(() => {
            onClose();
          }, 1800);
        },
        (err) => {
          setIsDetectingPhone(false);
          alert('ফোনের জিপিএস অ্যাক্সেস পাওয়া যায়নি। অনুগ্রহ করে ব্রাউজার/ফোনের লোকেশন পারমিশন চালু করুন।');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setIsDetectingPhone(false);
      alert('আপনার ডিভাইসে Geolocation সাপোর্ট নেই।');
    }
  };

  // 2. Save Custom Coords
  const handleSaveCustomCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customLat);
    const lon = parseFloat(customLon);

    if (isNaN(lat) || isNaN(lon)) {
      alert('সঠিক অক্ষাংশ (Latitude) ও দ্রাঘিমাংশ (Longitude) লিখুন।');
      return;
    }

    calibrateVehicleLocation(selectedDevice.id, lat, lon, customAddress.trim() || `${lat.toFixed(4)}, ${lon.toFixed(4)}`);
    setSuccessMessage('✅ নতুন লোকেশন সফলভাবে সেভ হয়েছে!');
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // 3. Quick Preset Selected
  const handleSelectPreset = (p: typeof POPULAR_LOCATIONS[0]) => {
    setCustomLat(String(p.lat));
    setCustomLon(String(p.lon));
    setCustomAddress(p.nameBn);
    calibrateVehicleLocation(selectedDevice.id, p.lat, p.lon, p.addr);
    setSuccessMessage(`✅ লোকেশন '${p.nameBn}' এ সেট করা হয়েছে!`);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  // 4. Force Fetch from Traccar Server
  const handleForceSyncServer = async () => {
    setIsSyncing(true);
    try {
      await syncServerData();
      setSuccessMessage('✅ Traccar সার্ভার থেকে ফ্রেশ জিপিএস ডাটা সিঙ্ক সম্পন্ন!');
    } catch (e) {
      alert('সার্ভার থেকে ডাটা আনতে সমস্যা হয়েছে। সার্ভার চালু আছে কিনা চেক করুন।');
    }
    setIsSyncing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div 
              className="w-9 h-9 rounded-2xl flex items-center justify-center text-white font-bold shadow-md shrink-0"
              style={{ backgroundColor: selectedDevice.attributes?.color || '#ef4444' }}
            >
              <VehicleIcon type={selectedDevice.category} className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>{selectedDevice.name}</span>
              </h3>
              <p className="text-[10.5px] text-emerald-400 font-medium">
                📍 লোকেশন ক্যালিব্রেশন ও রিয়েল ফিক্স
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

        {/* Current Location Badge */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800/80 text-xs">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] text-slate-400 block font-semibold">বর্তমান রেজিস্টার্ড অবস্থান:</span>
              <span className="font-extrabold text-slate-200 text-xs block">
                {selectedPosition?.address || 'Gulshan-2, Dhaka'}
              </span>
              <span className="text-[10px] text-indigo-300 font-mono">
                {selectedPosition?.latitude?.toFixed(4) || '23.7937'}° N, {selectedPosition?.longitude?.toFixed(4) || '90.4066'}° E
              </span>
            </div>
            <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${
              selectedPosition?.attributes?.isLastKnown 
                ? 'bg-amber-950 text-amber-300 border-amber-700' 
                : 'bg-emerald-950 text-emerald-300 border-emerald-700'
            }`}>
              {selectedPosition?.attributes?.isLastKnown ? '📌 Last Known' : '🟢 Live GPS'}
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 text-xs font-bold p-1 gap-1">
          <button
            onClick={() => setActiveTab('phone_gps')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1 transition ${
              activeTab === 'phone_gps'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>আমার লোকেশন</span>
          </button>

          <button
            onClick={() => setActiveTab('custom_coords')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1 transition ${
              activeTab === 'custom_coords'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>কাস্টম ম্যাপ পিন</span>
          </button>

          <button
            onClick={() => setActiveTab('server_sync')}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center space-x-1 transition ${
              activeTab === 'server_sync'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>সার্ভার সিঙ্ক</span>
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="m-3 p-2.5 bg-emerald-950/80 border border-emerald-500 rounded-2xl text-xs text-emerald-200 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-bold">{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto">
          
          {/* TAB 1: PHONE GPS 1-TAP CALIBRATION */}
          {activeTab === 'phone_gps' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-2xl space-y-2">
                <div className="flex items-center space-x-2 text-blue-300">
                  <Crosshair className="w-4 h-4" />
                  <span className="font-extrabold text-xs">১-ট্যাপে ফোনের লোকেশনে বাইক সেট করুন</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  আপনার বাইক যদি বর্তমানে আপনার সাথেই পার্ক করা থাকে, তাহলে এই বাটনে ক্লিক করলে আপনার মোবাইলের সঠিক GPS অবস্থানটি বাইকের মূল লোকেশন হিসেবে সেভ হয়ে যাবে।
                </p>

                <button
                  type="button"
                  disabled={isDetectingPhone}
                  onClick={handleSetFromPhoneGPS}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition active:scale-95 disabled:opacity-50"
                >
                  <Navigation className={`w-4 h-4 ${isDetectingPhone ? 'animate-spin' : ''}`} />
                  <span>{isDetectingPhone ? 'জিপিএস অবস্থান নেওয়া হচ্ছে...' : '📍 আমার বর্তমান অবস্থানে বাইক পিন করুন'}</span>
                </button>
              </div>

              {userLocation && (
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1 text-slate-400">
                  <div className="flex justify-between">
                    <span>ফোনের অক্ষাংশ (Lat):</span>
                    <span className="font-mono text-slate-200 font-bold">{userLocation.latitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ফোনের দ্রাঘিমাংশ (Lon):</span>
                    <span className="font-mono text-slate-200 font-bold">{userLocation.longitude.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>জিপিএস সঠিকতা (Accuracy):</span>
                    <span className="font-mono text-emerald-400 font-bold">±{Math.round(userLocation.accuracy)} মিটার</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CUSTOM COORDS & BD PRESETS */}
          {activeTab === 'custom_coords' && (
            <div className="space-y-3">
              <form onSubmit={handleSaveCustomCoords} className="space-y-2.5 text-xs">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                    ঠিকানা বা এলাকার নাম:
                  </label>
                  <input
                    type="text"
                    required
                    value={customAddress}
                    onChange={(e) => setCustomAddress(e.target.value)}
                    placeholder="যেমন: মিরপুর ১০, ঢাকা"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                      অক্ষাংশ (Latitude) *
                    </label>
                    <input
                      type="text"
                      required
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      placeholder="23.8067"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                      দ্রাঘিমাংশ (Longitude) *
                    </label>
                    <input
                      type="text"
                      required
                      value={customLon}
                      onChange={(e) => setCustomLon(e.target.value)}
                      placeholder="90.3687"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>লোকেশন সেভ ও ম্যাপে আপডেট করুন</span>
                </button>
              </form>

              {/* Quick BD Area Presets */}
              <div className="pt-2 border-t border-slate-800 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 block">
                  জনপ্রিয় এলাকা বেছে নিন (Quick Select):
                </span>
                <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto pr-1">
                  {POPULAR_LOCATIONS.map((loc, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(loc)}
                      className="p-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left text-[10.5px] transition flex items-center justify-between"
                    >
                      <span className="truncate text-slate-200 font-medium">{loc.nameBn}</span>
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SERVER SYNC & PURGE DEMO */}
          {activeTab === 'server_sync' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 font-bold">কানেক্টেড ট্র্যাকিং সার্ভার:</span>
                  <span className="text-emerald-400 font-bold font-mono">{serverConfig.name}</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono break-all">
                  URL: {serverConfig.url} (পোর্ট: {serverConfig.port})
                </div>

                <button
                  type="button"
                  disabled={isSyncing}
                  onClick={handleForceSyncServer}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95 disabled:opacity-50 mt-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'সার্ভার থেকে সিঙ্ক হচ্ছে...' : '🔄 সার্ভার থেকে ফ্রেশ জিপিএস ডাটা রিফ্রেশ'}</span>
                </button>
              </div>

              {/* Purge Demo Data */}
              <div className="p-3 bg-rose-950/30 border border-rose-500/30 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 text-rose-300 font-bold">
                  <Trash2 className="w-4 h-4" />
                  <span>ডেমো ডামি গাড়ি মুছে ফেলুন</span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  ম্যাপে যাতে ডেমো কার/ট্রাক না দেখায় এবং শুধুমাত্র আপনার নিজের বাইকটি দৃশ্যমান থাকে, সেজন্য ডেমো ডাটা ক্লিয়ার করুন।
                </p>

                <button
                  type="button"
                  onClick={() => {
                    purgeDemoFleetData();
                    setSuccessMessage('✅ ডেমো ফ্লিট মুছে শুধুমাত্র আপনার বাইক রাখা হয়েছে!');
                    setTimeout(() => onClose(), 1200);
                  }}
                  className="w-full py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white font-bold text-xs transition active:scale-95"
                >
                  🧹 ডেমো গাড়ি মুছে শুধু আমার বাইক রাখুন
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
