import React, { useState, useEffect } from 'react';
import { 
  Fuel, 
  Droplet, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp, 
  DollarSign, 
  Activity, 
  Gauge, 
  ShieldAlert, 
  Clock, 
  Plus, 
  CheckCircle2, 
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface FuelDrainAlert {
  id: string;
  deviceId: number;
  vehiclePlate: string;
  time: string;
  dropLiters: number;
  location: string;
  initialLiters: number;
  currentLiters: number;
  status: 'INVESTIGATING' | 'CONFIRMED_THEFT' | 'FALSE_ALARM';
}

export interface RefillEvent {
  id: string;
  deviceId: number;
  vehiclePlate: string;
  time: string;
  addedLiters: number;
  costBdt: number;
  stationName: string;
  verified: boolean;
}

export const FuelTelematicsManager: React.FC<{ isCustomerScoped?: boolean }> = ({ isCustomerScoped = false }) => {
  const { devices, selectedDevice, currentRole } = useApp();

  const activeDevice = selectedDevice || devices[0];

  // Fuel Sensor Telemetry State
  const [tankCapacityLiters] = useState(100);
  const [currentLevelPercent, setCurrentLevelPercent] = useState(68);
  const [currentLiters, setCurrentLiters] = useState(68);
  const [sensorType] = useState('Capacitive Ultrasonic Digital Probe (RS485/CAN)');

  // Fuel Theft Drain Alerts
  const [drainAlerts, setDrainAlerts] = useState<FuelDrainAlert[]>(() => {
    const saved = localStorage.getItem('gps_fuel_theft_alerts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'drain_1',
        deviceId: 1,
        vehiclePlate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
        time: 'আজ ভোর ০৩:২২ AM',
        dropLiters: 14.5,
        location: 'কাঁচপুর ব্রিজ পেট্রোল পাম্প পার্কিং, নারায়ণগঞ্জ',
        initialLiters: 75.0,
        currentLiters: 60.5,
        status: 'CONFIRMED_THEFT'
      },
      {
        id: 'drain_2',
        deviceId: 2,
        vehiclePlate: 'ঢাকা মেট্রো-ল ৯৮-৭৬৫৪',
        time: 'গতকাল রাত ১১:৪৫ PM',
        dropLiters: 8.0,
        location: 'আমিনবাজার ট্রাক টার্মিনাল, সাভার',
        initialLiters: 45.0,
        currentLiters: 37.0,
        status: 'INVESTIGATING'
      }
    ];
  });

  // Refill Events
  const [refills, setRefills] = useState<RefillEvent[]>(() => {
    const saved = localStorage.getItem('gps_fuel_refill_events');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'refill_1',
        deviceId: 1,
        vehiclePlate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
        time: 'আজ সকাল ০৯:৩০ AM',
        addedLiters: 35.0,
        costBdt: 4550,
        stationName: 'মেসার্স মেঘনা পেট্রোলিয়াম, মহাখালী',
        verified: true
      },
      {
        id: 'refill_2',
        deviceId: 3,
        vehiclePlate: 'ঢাকা মেট্রো-ট ৫৫-৪৪৩২',
        time: '২৪ আগস্ট বিকাল ০৫:১৫ PM',
        addedLiters: 50.0,
        costBdt: 6500,
        stationName: 'যমুনা অয়েল সিএনজি ও ফুয়েল, কুমিল্লা',
        verified: true
      }
    ];
  });

  // Device Scope Filtering
  const scopedDrainAlerts = drainAlerts.filter(a => {
    if (isCustomerScoped || currentRole === 'customer') {
      const userDeviceIds = devices.map(d => d.id);
      return userDeviceIds.includes(a.deviceId);
    }
    return true;
  });

  const scopedRefills = refills.filter(r => {
    if (isCustomerScoped || currentRole === 'customer') {
      const userDeviceIds = devices.map(d => d.id);
      return userDeviceIds.includes(r.deviceId);
    }
    return true;
  });

  // Hourly Fuel Curve Simulator Data
  const hourlyCurve = [
    { hour: '00:00', level: 75 },
    { hour: '03:00', level: 60.5 }, // sudden theft drop
    { hour: '06:00', level: 59 },
    { hour: '09:00', level: 94 },   // refilled
    { hour: '12:00', level: 88 },
    { hour: '15:00', level: 78 },
    { hour: '18:00', level: 68 }
  ];

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/70 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/30 text-amber-400 border border-amber-500/50 flex items-center justify-center shadow-lg shrink-0">
            <Fuel className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white">
                ⛽ স্মার্ট ফুয়েল টেলিমেটিক্স ও চুরি প্রতিরোধ হাব (Fuel Anti-Theft)
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                ULTRASONIC LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ডিজিটাল ফুয়েল সেন্সর দিয়ে রিয়েল-টাইম তেলের স্তর, তেল চুরির অ্যালার্ট ও রিফুয়েলিং ইনভয়েস ট্র্যাকিং
            </p>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800 px-3.5 py-1.5 rounded-2xl text-right font-mono">
          <span className="text-[10px] text-slate-400 block font-bold">সেন্সর স্ট্যাটাস:</span>
          <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>ONLINE (RS-485 Probe)</span>
          </span>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-slate-400 font-bold block">বর্তমান ফুয়েল লেভেল</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-amber-300">{currentLiters} L</span>
            <span className="text-xs font-mono font-bold text-emerald-400">({currentLevelPercent}%)</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-slate-400 font-bold block">আজকের গড় মাইলেজ</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-cyan-300">১২.৪</span>
            <span className="text-xs font-mono text-slate-400">কিমি/লিটার</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-rose-500/40 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-rose-400 font-bold block">🚨 ফুয়েল ড্রেন / চুরি অ্যালার্ট</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-rose-300">{scopedDrainAlerts.length} টি</span>
            <span className="text-[10px] font-mono text-rose-400">সতর্কতা</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/40 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-emerald-400 font-bold block">মোট রিফুয়েলিং খরচ</span>
          <div className="flex items-baseline space-x-2 mt-1">
            <span className="text-2xl font-black text-emerald-300">৳ ১১,০৫০</span>
            <span className="text-[10px] font-mono text-slate-400">৮৫ লিটার</span>
          </div>
        </div>
      </div>

      {/* Live 24-Hour Fuel Level Graph Simulation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs sm:text-sm font-extrabold text-white">
              লাইভ ফুয়েল কার্ভ ও ড্রেন গ্রাফ ({activeDevice?.name || 'নির্বাচিত গাড়ি'})
            </h4>
          </div>
          <span className="text-[10px] font-mono text-slate-400">গত ২৪ ঘন্টার টেলিমেটিক্স</span>
        </div>

        {/* Visual Bar Graph */}
        <div className="grid grid-cols-7 gap-2 pt-3 h-40 items-end">
          {hourlyCurve.map((h, i) => (
            <div key={i} className="flex flex-col items-center h-full justify-end group">
              <span className="text-[9.5px] font-mono text-amber-300 font-bold mb-1 opacity-80 group-hover:opacity-100">
                {h.level}L
              </span>
              <div 
                className={`w-full rounded-t-xl transition-all duration-500 relative ${
                  i === 1 
                    ? 'bg-gradient-to-t from-rose-600 to-rose-400 shadow-lg shadow-rose-600/40' 
                    : i === 3 
                    ? 'bg-gradient-to-t from-emerald-600 to-teal-400 shadow-lg shadow-emerald-600/40'
                    : 'bg-gradient-to-t from-amber-600 to-yellow-400'
                }`}
                style={{ height: `${(h.level / 100) * 100}%` }}
              >
                {i === 1 && (
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] bg-rose-950 text-rose-300 border border-rose-500 px-1 rounded font-mono whitespace-nowrap">
                    -14.5L ড্রেন
                  </span>
                )}
              </div>
              <span className="text-[10px] font-mono text-slate-400 mt-2">{h.hour}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Drain Alerts & Refuel History Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Sudden Fuel Drop (Theft / Drain) Column */}
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                🚨 ফুয়েল চুরি ও অস্বাভাবিক ড্রেন সতর্কতা
              </h4>
            </div>
            <span className="text-[9.5px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full font-bold border border-rose-500/30">
              AI THEFT DETECTION
            </span>
          </div>

          <div className="space-y-2.5">
            {scopedDrainAlerts.map((alert) => (
              <div key={alert.id} className="bg-slate-950 p-3 rounded-2xl border border-rose-500/30 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black text-white block">{alert.vehiclePlate}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
                  </div>
                  <span className="text-xs font-mono font-black text-rose-400 bg-rose-950/80 px-2 py-1 rounded-xl border border-rose-700">
                    -{alert.dropLiters} Liters
                  </span>
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] text-slate-300">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="truncate">{alert.location}</span>
                </div>

                <div className="pt-1.5 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">
                    লেভেল ড্রপ: <strong className="text-slate-200">{alert.initialLiters}L</strong> ➔ <strong className="text-rose-400">{alert.currentLiters}L</strong>
                  </span>
                  <span className="font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded-full border border-rose-800">
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refueling Audit Logs Column */}
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <div className="flex items-center space-x-2">
              <Droplet className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                ⛽ রিফুয়েলিং ইনভয়েস ও ভেরিফিকেশন লগ
              </h4>
            </div>
            <span className="text-[9.5px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30">
              PUMP VERIFIED
            </span>
          </div>

          <div className="space-y-2.5">
            {scopedRefills.map((refill) => (
              <div key={refill.id} className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/30 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black text-white block">{refill.vehiclePlate}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{refill.time}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-black text-emerald-300 block">+{refill.addedLiters} Liters</span>
                    <span className="text-[10px] font-mono text-amber-300">৳ {refill.costBdt.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10.5px]">
                  <span className="text-slate-300 truncate">{refill.stationName}</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ভেরিফাইড</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
