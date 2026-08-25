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
  Zap,
  Search,
  Sliders,
  Filter,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UniversalSaleModal } from './UniversalSaleModal';

export const RescuePortalView: React.FC = () => {
  const { language, setActiveTab, setCurrentRole, devices, positions, sendCommand } = useApp();

  const [activeDistressId, setActiveDistressId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'sos' | 'moving' | 'parked'>('all');
  const [engineCutSuccess, setEngineCutSuccess] = useState(false);

  const distressDevice = devices.find(d => d.id === activeDistressId) || devices[0];
  const distressPos = positions[distressDevice?.id] || Object.values(positions)[0];

  const handleExecuteEmergencyCutoff = async () => {
    await sendCommand('engineStop');
    setEngineCutSuccess(true);
    setTimeout(() => setEngineCutSuccess(false), 3000);
  };

  // Search and Filter Vehicles
  const filteredDevices = devices.filter(dev => {
    const pos = positions[dev.id];
    const isMoving = pos?.speed && pos.speed > 5;
    const isSos = dev.id === 1 || dev.id === 3; // Simulated high alert fleet

    if (filterType === 'sos' && !isSos) return false;
    if (filterType === 'moving' && !isMoving) return false;
    if (filterType === 'parked' && isMoving) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      dev.name.toLowerCase().includes(q) ||
      (dev.attributes?.plateNumber && dev.attributes.plateNumber.toLowerCase().includes(q)) ||
      (dev.attributes?.driverName && dev.attributes.driverName.toLowerCase().includes(q)) ||
      (dev.attributes?.driverPhone && dev.attributes.driverPhone.includes(q)) ||
      (dev.phone && dev.phone.includes(q)) ||
      (dev.uniqueId && dev.uniqueId.includes(q)) ||
      dev.id.toString().includes(q)
    );
  });

  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md gap-3">
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

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition active:scale-95"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>ডিভাইস সেল করুন (৳৫০০ আয়)</span>
          </button>

          <span className="text-[9px] bg-rose-500/20 text-rose-300 font-extrabold px-2 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
            SOS Active
          </span>
        </div>
      </div>

      {/* Instant Search Bar & Filter Chips */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 কাস্টমার মোবাইল নম্বর, গাড়ি, বা ডিভাইস IMEI দিয়ে খুঁজুন..."
            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-rose-500 focus:outline-none shadow-md"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pb-1 text-[10.5px]">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              filterType === 'all' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            সব গাড়ি ({devices.length})
          </button>

          <button
            onClick={() => setFilterType('sos')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap flex items-center space-x-1 ${
              filterType === 'sos' ? 'bg-rose-600 text-white shadow-md' : 'bg-slate-900 text-rose-400 border border-slate-800'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            <span>🚨 জরুরি এসওএস</span>
          </button>

          <button
            onClick={() => setFilterType('moving')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              filterType === 'moving' ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-900 text-emerald-400 border border-slate-800'
            }`}
          >
            🚗 গতিশীল (Running)
          </button>

          <button
            onClick={() => setFilterType('parked')}
            className={`px-3 py-1 rounded-xl font-bold transition whitespace-nowrap ${
              filterType === 'parked' ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            🅿️ পার্কড (Parked)
          </button>
        </div>
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
                মালিক: <strong className="text-slate-200">{distressDevice?.attributes?.driverName || 'Mohammad Azhar'}</strong> • ফোন: <strong className="text-rose-300 font-mono">{distressDevice?.attributes?.driverPhone || '01700000000'}</strong>
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
              href={distressPos?.latitude && distressPos?.longitude 
                ? `https://www.google.com/maps/dir/?api=1&destination=${distressPos.latitude},${distressPos.longitude}`
                : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(distressPos?.address || 'Dhaka, Bangladesh')}`
              }
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
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            ফিল্টারকৃত সক্রিয় যানবাহন ({filteredDevices.length})
          </span>
        </div>

        <div className="space-y-2">
          {filteredDevices.map((dev) => {
            const isSel = dev.id === activeDistressId;
            const pos = positions[dev.id];
            return (
              <button
                key={dev.id}
                onClick={() => setActiveDistressId(dev.id)}
                className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition text-xs ${
                  isSel ? 'bg-rose-600/20 border-rose-500/50 text-rose-300' : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="font-extrabold text-slate-100 flex items-center space-x-2">
                    <span>{dev.name}</span>
                    <span className="text-[9.5px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-slate-300">
                      {dev.attributes?.plateNumber || 'No Plate'}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    মোবাইল: <strong className="text-slate-300 font-mono">{dev.attributes?.driverPhone || dev.phone || '01700000000'}</strong> • IMEI: {dev.uniqueId || '864720058291034'}
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold ${
                  isSel ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                }`}>
                  {isSel ? 'টার্গেট' : 'সিলেক্ট'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <UniversalSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />
    </div>
  );
};
