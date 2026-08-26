import React, { useState } from 'react';
import { 
  Building2, 
  Bus, 
  Truck, 
  FileText, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Webhook, 
  ArrowLeft,
  UserCheck,
  Zap,
  Radio,
  Clock,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Eye,
  Phone,
  Power
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransitCounterManager } from '../saas/TransitCounterManager';
import { ComplianceDocumentVault } from '../saas/ComplianceDocumentVault';
import { DriverPerformanceManager } from '../saas/DriverPerformanceManager';
import { VehicleIcon } from '../../utils/vehicleIcons';

export const FleetTransitHubView: React.FC = () => {
  const { 
    devices, 
    selectedDeviceId, 
    setSelectedDeviceId, 
    selectedDevice, 
    positions, 
    setActiveTab, 
    language 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'transit_counters' | 'compliance_vault' | 'driver_performance'>('transit_counters');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'MOVING' | 'PARKED' | 'IDLE'>('ALL');

  const category = (selectedDevice?.category || '').toLowerCase();
  const isTruckOrCargo = category.includes('truck') || category.includes('trailer') || category.includes('pickup') || category.includes('van');

  // Filter fleet vehicles
  const fleetVehicles = devices.filter(d => {
    if (!vehicleSearch.trim()) return true;
    const q = vehicleSearch.toLowerCase();
    return d.name.toLowerCase().includes(q) || (d.attributes?.plateNumber || '').toLowerCase().includes(q);
  });

  // Calculate fleet stats
  const totalFleet = devices.length;
  let movingCount = 0;
  let parkedCount = 0;
  let idleCount = 0;

  devices.forEach(d => {
    const pos = positions[d.id];
    const spd = Math.round(pos?.speed || 0);
    const ign = pos?.attributes?.ignition;
    if (spd > 3) movingCount++;
    else if (ign) idleCount++;
    else parkedCount++;
  });

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-5 space-y-4 select-none animate-in fade-in">
      
      {/* Top Banner with Navigation and Persona Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="ম্যাপে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 flex items-center justify-center shadow-lg shrink-0">
              {isTruckOrCargo ? <Truck className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="font-black text-base text-white">
                  🏢 ফ্লিট ও ট্রান্সপোর্টেশন অ্যাডমিন হাব (Fleet Admin)
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  ENTERPRISE FLEET
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  👔 OWNER ONLY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                লাইভ ফ্লিট রাডার, কাউন্টার জিওফেন্স, ট্রিপ ডিসপ্যাচ, সুপারভাইজার সাব-লগইন আইডি ও BRTA ভল্ট
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto text-xs">
            <span className="text-[11px] text-slate-400 font-mono">সিলেক্টেড গাড়ি:</span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-300 font-mono font-bold border border-slate-800">
              {selectedDevice?.name || 'ফ্লিট ভেহিকেল'} ({selectedDevice?.attributes?.plateNumber || 'ঢাকা মেট্রো'})
            </span>
          </div>
        </div>

        {/* 3 Main Fleet Sub-Modules */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('transit_counters')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'transit_counters'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {isTruckOrCargo ? <Truck className="w-4 h-4 text-cyan-300" /> : <Bus className="w-4 h-4 text-cyan-300" />}
            <span>{isTruckOrCargo ? '📦 কার্গো ডিপো ও চালান হাব' : '🚌 বাস কাউন্টার ও টিকেটিং API'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('compliance_vault')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'compliance_vault'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>📄 BRTA লিগ্যাল ভল্ট ও ২-টিয়ার এলার্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('driver_performance')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'driver_performance'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-300" />
            <span>👨‍✈️ ড্রাইভার লাইসেন্স ও পারফরম্যান্স</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📍 LIVE FLEET RADAR & VEHICLE-WISE STATUS GRID                            */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5">
        
        {/* Radar Header & Metrics */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center space-x-2">
              <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              <h3 className="text-sm font-black text-white">
                📍 লাইভ ফ্লিট রাডার ও প্রতিটি গাড়ির রিয়েল-টাইম অবস্থান
              </h3>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              লাইভ গতি, ইঞ্জিন স্ট্যাটাস, কাউন্টার জিওফেন্স ইনসাইড এবং ড্রাইভার যোগাযোগ
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center space-x-2 flex-wrap text-xs">
            <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-1.5">
              <span className="text-slate-400">মোট গাড়ি:</span>
              <span className="font-mono font-black text-cyan-300">{totalFleet} টি</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center space-x-1.5 text-emerald-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold">চলমান:</span>
              <span className="font-mono font-black">{movingCount}</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-amber-950/50 border border-amber-500/40 flex items-center space-x-1.5 text-amber-300">
              <span className="font-bold">আইডল:</span>
              <span className="font-mono font-black">{idleCount}</span>
            </div>

            <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-1.5 text-slate-400">
              <span className="font-bold">পার্কড:</span>
              <span className="font-mono font-black">{parkedCount}</span>
            </div>
          </div>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fleetVehicles.map((device) => {
            const pos = positions[device.id];
            const speedKmh = Math.round(pos?.speed || 0);
            const isMoving = speedKmh > 3;
            const isIgnitionOn = pos?.attributes?.ignition;
            const isSelected = device.id === selectedDeviceId;

            // Generate realistic terminal geofence location
            const isBus = (device.category || '').toLowerCase().includes('bus');
            const terminalLocation = isBus 
              ? (isMoving ? '🛣️ ঢাকা-চট্টগ্রাম এক্সপ্রেসওয়ে (রানিং)' : '🏢 গাবতলী সেন্ট্রাল বাস টার্মিনাল (কাউন্টারে ইনসাইড)')
              : (isMoving ? '🛣️ ঢাকা-ময়মনসিংহ হাইওয়ে (ইন ট্রানজিট)' : '📦 তেজগাঁও সেন্ট্রাল কার্গো ডিপো (ইয়ার্ডে লোডিং)');

            return (
              <div 
                key={device.id}
                className={`bg-slate-950 rounded-2xl p-3.5 border transition space-y-2.5 flex flex-col justify-between ${
                  isSelected 
                    ? 'border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40' 
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Row: Vehicle Name, Plate & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <div 
                        className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner"
                        style={{ backgroundColor: device.attributes?.color || '#0891b2' }}
                      >
                        <VehicleIcon type={device.category} className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-black text-white truncate block">
                          {device.name}
                        </span>
                        <span className="text-[10px] font-mono text-cyan-400 font-bold">
                          {device.attributes?.plateNumber || 'ঢাকা মেট্রো'}
                        </span>
                      </div>
                    </div>

                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center space-x-1 ${
                      isMoving 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                        : isIgnitionOn 
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isMoving ? 'bg-emerald-400 animate-pulse' : isIgnitionOn ? 'bg-amber-400' : 'bg-rose-400'}`} />
                      <span>{isMoving ? `${speedKmh} km/h` : isIgnitionOn ? 'আইডল' : 'পার্কড'}</span>
                    </span>
                  </div>

                  {/* Terminal & Geofence Status */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-xs mt-2.5">
                    <div className="flex items-start space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span className="text-[11px] font-bold text-slate-200 leading-snug">
                        {terminalLocation}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
                      <span className="text-slate-400">ইগনিশন স্ট্যাটাস:</span>
                      <span className={`font-mono font-bold ${isIgnitionOn ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {isIgnitionOn ? '🟢 ইঞ্জিন চালু (ON)' : '🔴 ইঞ্জিন বন্ধ (OFF)'}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-slate-400">নিযুক্ত চালক:</span>
                      <span className="font-bold text-indigo-300">
                        {device.attributes?.driverName || 'মোঃ আব্দুল কুদ্দুস'} ({device.attributes?.driverPhone || '01712-334455'})
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1-Click Action Buttons */}
                <div className="pt-2 flex items-center space-x-1.5 border-t border-slate-800/80 text-[10.5px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      setActiveTab('map');
                    }}
                    className="flex-1 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-bold border border-cyan-500/40 transition active:scale-95 flex items-center justify-center space-x-1"
                  >
                    <Eye className="w-3 h-3 text-cyan-400" />
                    <span>ম্যাপে লাইভ দেখুন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      setActiveTab('commands');
                    }}
                    className="py-1.5 px-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40 transition active:scale-95 flex items-center space-x-1"
                    title="রিমোট ইঞ্জিন কাটঅফ ও কমান্ড"
                  >
                    <Zap className="w-3 h-3 text-rose-400" />
                    <span className="hidden sm:inline">কাটঅফ</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Module Content (Tabs) */}
      <div className="space-y-4">
        {activeSubTab === 'transit_counters' && <TransitCounterManager isCustomerScoped={true} />}
        {activeSubTab === 'compliance_vault' && <ComplianceDocumentVault isCustomerScoped={true} />}
        {activeSubTab === 'driver_performance' && <DriverPerformanceManager isCustomerScoped={true} />}
      </div>

    </div>
  );
};
