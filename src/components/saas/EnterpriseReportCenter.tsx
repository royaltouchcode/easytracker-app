import React, { useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Calendar, 
  MapPin, 
  Route, 
  Clock, 
  Fuel, 
  AlertTriangle, 
  CheckCircle2, 
  Filter, 
  Layers, 
  TrendingUp, 
  Sliders, 
  Share2, 
  FileSpreadsheet, 
  Gauge, 
  ShieldCheck, 
  Car,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface TripAuditRecord {
  id: string;
  deviceId: number;
  vehiclePlate: string;
  date: string;
  startTime: string;
  endTime: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationMins: number;
  idleMins: number;
  maxSpeedKmH: number;
  avgSpeedKmH: number;
  fuelBurntLiters: number;
  ecoScore: 'A+' | 'A' | 'B' | 'C' | 'D';
}

export interface ViolationAuditRecord {
  id: string;
  deviceId: number;
  vehiclePlate: string;
  time: string;
  type: 'OVERSPEED' | 'HARSH_BRAKE' | 'SHARP_TURN' | 'NIGHT_DRIVING';
  location: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  speedKmH?: number;
}

export const INITIAL_TRIPS: TripAuditRecord[] = [
  {
    id: 'tr_1',
    deviceId: 1,
    vehiclePlate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
    date: '২৬ আগস্ট ২০২৬',
    startTime: '০৮:১৫ AM',
    endTime: '১০:৪৫ AM',
    origin: 'উত্তরা সেক্টর-৪, ঢাকা',
    destination: 'মতিঝিল বাণিজ্যিক এলাকা, ঢাকা',
    distanceKm: 26.4,
    durationMins: 150,
    idleMins: 35,
    maxSpeedKmH: 68,
    avgSpeedKmH: 18.5,
    fuelBurntLiters: 2.2,
    ecoScore: 'A'
  },
  {
    id: 'tr_2',
    deviceId: 1,
    vehiclePlate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
    date: '২৫ আগস্ট ২০২৬',
    startTime: '০২:৩০ PM',
    endTime: '০৫:১৫ PM',
    origin: 'ধানমন্ডি ২৭, ঢাকা',
    destination: 'মিরপুর ডিওএইচএস, ঢাকা',
    distanceKm: 18.2,
    durationMins: 105,
    idleMins: 20,
    maxSpeedKmH: 62,
    avgSpeedKmH: 21.0,
    fuelBurntLiters: 1.5,
    ecoScore: 'A+'
  },
  {
    id: 'tr_3',
    deviceId: 2,
    vehiclePlate: 'ঢাকা মেট্রো-ল ৯৮-৭৬৫৪',
    date: '২৬ আগস্ট ২০২৬',
    startTime: '০৬:০০ AM',
    endTime: '০৩:৩০ PM',
    origin: 'সাভার হেমায়েতপুর',
    destination: 'চট্টগ্রাম ভাটিয়ারী ইয়ার্ড',
    distanceKm: 245.0,
    durationMins: 570,
    idleMins: 85,
    maxSpeedKmH: 88,
    avgSpeedKmH: 48.0,
    fuelBurntLiters: 28.5,
    ecoScore: 'B'
  }
];

export const INITIAL_VIOLATIONS: ViolationAuditRecord[] = [
  {
    id: 'vio_1',
    deviceId: 2,
    vehiclePlate: 'ঢাকা মেট্রো-ল ৯৮-৭৬৫৪',
    time: 'আজ সকাল ১০:২০ AM',
    type: 'OVERSPEED',
    location: 'ঢাকা-চট্টগ্রাম হাইওয়ে, কুমিল্লা বাইপাস',
    severity: 'WARNING',
    speedKmH: 88
  },
  {
    id: 'vio_2',
    deviceId: 1,
    vehiclePlate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
    time: 'আজ সকাল ০৯:১৫ AM',
    type: 'HARSH_BRAKE',
    location: 'কাকরাইল মোড় ট্রাফিক সিগন্যাল',
    severity: 'INFO'
  }
];

export const EnterpriseReportCenter: React.FC<{ isCustomerScoped?: boolean }> = ({ isCustomerScoped = false }) => {
  const { devices, selectedDevice, currentRole } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<'trips' | 'playback' | 'behavior' | 'alerts' | 'export'>('trips');
  const [dateRange, setDateRange] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');
  const [selectedVehicleId, setSelectedVehicleId] = useState<number>(() => devices[0]?.id || 1);

  // Playback Simulation State
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackProgress, setPlaybackProgress] = useState(35);

  // Scoped Trips & Violations
  const scopedTrips = INITIAL_TRIPS.filter(tr => {
    if (isCustomerScoped || currentRole === 'customer') {
      const userDeviceIds = devices.map(d => d.id);
      return userDeviceIds.includes(tr.deviceId);
    }
    return true;
  });

  const scopedViolations = INITIAL_VIOLATIONS.filter(v => {
    if (isCustomerScoped || currentRole === 'customer') {
      const userDeviceIds = devices.map(d => d.id);
      return userDeviceIds.includes(v.deviceId);
    }
    return true;
  });

  const totalDistance = scopedTrips.reduce((a, b) => a + b.distanceKm, 0);
  const totalFuel = scopedTrips.reduce((a, b) => a + b.fuelBurntLiters, 0);

  const handleExportReport = (format: 'PDF' | 'EXCEL' | 'CSV') => {
    alert(`📄 আপনার ${format} এন্টারপ্রাইজ রিপোর্ট সফলভাবে জেনারেট হচ্ছে! ডাউনলোড শুরু হবে।`);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 text-indigo-400 border border-indigo-500/50 flex items-center justify-center shadow-lg shrink-0">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white">
                📊 এন্টারপ্রাইজ ক্লাসিফায়েড ও অডিট রিপোর্টস হাব (Classified Analytics)
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                AUDIT ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ট্রিপ অডিট, মাল্টি-স্পিড রুট প্লেব্যাক, ড্রাইভিং আচরণ ও পিডিএফ/এক্সেল এক্সপোর্ট
            </p>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => handleExportReport('PDF')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/40 text-xs font-bold flex items-center space-x-1.5 transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF ডাউনলোড</span>
          </button>
          <button
            type="button"
            onClick={() => handleExportReport('EXCEL')}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5 transition active:scale-95"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-slate-400 font-bold block">মোট ট্রিপ সংখ্যা</span>
          <span className="text-lg font-black text-white">{scopedTrips.length} টি সম্পন্ন</span>
        </div>
        <div className="bg-slate-900 border border-indigo-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-indigo-400 font-bold block">মোট মাইলেজ ভ্রমণ</span>
          <span className="text-lg font-black text-indigo-300">{totalDistance.toFixed(1)} কিমি</span>
        </div>
        <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-amber-400 font-bold block">মোট ফুয়েল অপচয়/ব্যবহার</span>
          <span className="text-lg font-black text-amber-300">{totalFuel.toFixed(1)} লিটার</span>
        </div>
        <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-emerald-400 font-bold block">সার্বিক ইকো স্কোর</span>
          <span className="text-lg font-black text-emerald-300">A+ (৯৫%)</span>
        </div>
      </div>

      {/* Navigation Sub-Tabs & Date Filter */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto text-xs">
          <button
            type="button"
            onClick={() => setActiveReportTab('trips')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              activeReportTab === 'trips' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            📊 ট্রিপ ও মাইলেজ অডিট
          </button>
          <button
            type="button"
            onClick={() => setActiveReportTab('playback')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              activeReportTab === 'playback' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🗺️ মাল্টি-স্পিড রুট প্লেব্যাক
          </button>
          <button
            type="button"
            onClick={() => setActiveReportTab('behavior')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              activeReportTab === 'behavior' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🚦 ড্রাইভিং আচরণ ও ভায়োলেশন
          </button>
          <button
            type="button"
            onClick={() => setActiveReportTab('alerts')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              activeReportTab === 'alerts' ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🔔 অ্যালার্ট ম্যাট্রিক্স
          </button>
        </div>

        {/* Date Filter Tabs */}
        <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setDateRange('today')}
            className={`px-2.5 py-1 rounded-lg transition ${dateRange === 'today' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            আজ
          </button>
          <button
            type="button"
            onClick={() => setDateRange('yesterday')}
            className={`px-2.5 py-1 rounded-lg transition ${dateRange === 'yesterday' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            গতকাল
          </button>
          <button
            type="button"
            onClick={() => setDateRange('week')}
            className={`px-2.5 py-1 rounded-lg transition ${dateRange === 'week' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            ৭ দিন
          </button>
          <button
            type="button"
            onClick={() => setDateRange('month')}
            className={`px-2.5 py-1 rounded-lg transition ${dateRange === 'month' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
          >
            ৩০ দিন
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {activeReportTab === 'trips' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="space-y-3">
            {scopedTrips.map((tr) => (
              <div key={tr.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-2.5 gap-2">
                  <div>
                    <span className="text-xs font-black text-white">{tr.vehiclePlate}</span>
                    <span className="text-[10px] font-mono text-slate-400 block">{tr.date} • {tr.startTime} হতে {tr.endTime}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-black text-indigo-300 bg-indigo-950 px-2.5 py-1 rounded-xl border border-indigo-700">
                      {tr.distanceKm} KM
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                      ইকো: {tr.ecoScore}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>যাত্রা শুরু: <strong>{tr.origin}</strong></span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-300">
                    <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>গন্তব্য: <strong>{tr.destination}</strong></span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 text-[11px] font-mono">
                  <div>
                    <span className="text-[9.5px] text-slate-400 block">মোট রানিং সময়:</span>
                    <span className="text-white font-bold">{Math.floor(tr.durationMins / 60)}ঘ {tr.durationMins % 60}মি</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 block">আইডল পার্কিং:</span>
                    <span className="text-amber-400 font-bold">{tr.idleMins} মিনিট</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 block">সর্বোচ্চ গতি:</span>
                    <span className="text-cyan-400 font-bold">{tr.maxSpeedKmH} km/h</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] text-slate-400 block">ফুয়েল ব্যবহার:</span>
                    <span className="text-emerald-400 font-bold">{tr.fuelBurntLiters} Liters</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Multi-Speed Playback Simulator */}
      {activeReportTab === 'playback' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-white">
                🗺️ ইন্টারেক্টিভ লাইভ রুট প্লেব্যাক (০.৫x - ৮x স্পিড)
              </h4>
              <p className="text-[10.5px] text-slate-400">
                নির্দিষ্ট তারিখের গাড়ি চলাচলের পুরো রুট লাইভ স্পিড ও স্টপেজ সহ পুনরায় প্লেব্যাক করুন।
              </p>
            </div>
            <span className="text-[10px] font-mono text-cyan-300 font-bold">LIVE TELEMETRY</span>
          </div>

          {/* Interactive Player Controls */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setPlaybackProgress(0)}
                  className="w-10 h-10 rounded-2xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center transition active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Speed Multiplier */}
              <div className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono font-bold">
                {[0.5, 1, 2, 4, 8].map(spd => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2.5 py-1 rounded-lg transition ${playbackSpeed === spd ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Scrubber Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-slate-400">
                <span>০৮:১৫ AM (উত্তরা)</span>
                <span className="text-indigo-400 font-bold">চলমান গতি: ৪৬ km/h • ইঞ্জিন ON</span>
                <span>১০:৪৫ AM (মতিঝিল)</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={playbackProgress}
                onChange={(e) => setPlaybackProgress(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Driving Behavior Tab */}
      {activeReportTab === 'behavior' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <h4 className="text-xs sm:text-sm font-extrabold text-white border-b border-slate-800 pb-2">
            🚦 ড্রাইভিং আচরণ ও ভায়োলেশন লগ
          </h4>

          <div className="space-y-2.5">
            {scopedViolations.map((v) => (
              <div key={v.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{v.vehiclePlate}</span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      v.type === 'OVERSPEED' ? 'bg-rose-950 text-rose-300 border-rose-700' : 'bg-amber-950 text-amber-300 border-amber-700'
                    }`}>
                      {v.type} {v.speedKmH ? `(${v.speedKmH} km/h)` : ''}
                    </span>
                    <span className="text-[10px] text-slate-500">{v.time}</span>
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-0.5">লোকেশন: {v.location}</p>
                </div>

                <span className="text-[10px] font-bold text-emerald-400 bg-slate-900 px-2 py-1 rounded-xl border border-slate-800">
                  লগড
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts Matrix Tab */}
      {activeReportTab === 'alerts' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <h4 className="text-xs sm:text-sm font-extrabold text-white border-b border-slate-800 pb-2">
            🔔 ক্লাসিফায়েড অ্যালার্ট ম্যাট্রিক্স
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-2xl border border-rose-500/30 space-y-1.5">
              <span className="text-xs font-bold text-rose-400 block">🚨 ইমার্জেন্সি অ্যালার্ট</span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li>• SOS প্যানিক বাটন প্রেস</li>
                <li>• পুলিশ রিমোট ইঞ্জিন লক</li>
                <li>• আন-অথরাইজড টোয়িং অ্যালার্ট</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-amber-500/30 space-y-1.5">
              <span className="text-xs font-bold text-amber-400 block">⚠️ সেফটি অ্যালার্ট</span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li>• হাইওয়ে ওভারস্পিড ভায়োলেশন</li>
                <li>• জিওফেন্স এরিয়া প্রবেশ/ত্যাগ</li>
                <li>• একটানা ৫ ঘণ্টার বেশি ড্রাইভিং</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-3 rounded-2xl border border-blue-500/30 space-y-1.5">
              <span className="text-xs font-bold text-blue-400 block">⚙️ টেকনিক্যাল অ্যালার্ট</span>
              <ul className="text-[11px] text-slate-300 space-y-1">
                <li>• ডিভাইস ব্যাটারি লো (&lt;20%)</li>
                <li>• মেইন পাওয়ার কাটঅফ</li>
                <li>• জিপিএস অ্যান্টেনা ফল্ট</li>
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
