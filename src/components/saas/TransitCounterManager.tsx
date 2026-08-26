import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Bus, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Plus, 
  Search, 
  Calendar, 
  FileText, 
  UserCheck,
  X,
  Navigation,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface TransitCounter {
  id: string;
  nameBn: string;
  cityBn: string;
  supervisorName: string;
  supervisorPhone: string;
  latitude: number;
  longitude: number;
  radiusMeters: number;
  activeDeparturesToday: number;
}

export interface BusTripSchedule {
  id: string;
  coachNumber: string;
  vehiclePlate: string;
  routeTitleBn: string;
  originCounter: string;
  destinationCounter: string;
  scheduledDeparture: string;
  actualDeparture?: string;
  delayMinutes: number;
  supervisorGatepass: string;
  passengerCount: number;
  status: 'SCHEDULED' | 'BOARDING' | 'DEPARTED' | 'DELAYED';
}

export const INITIAL_COUNTERS: TransitCounter[] = [
  {
    id: 'cnt_1',
    nameBn: 'গাবতলী সেন্ট্রাল বাস টার্মিনাল কাউন্টার',
    cityBn: 'ঢাকা',
    supervisorName: 'মোঃ শফিকুল আলম',
    supervisorPhone: '01711-889900',
    latitude: 23.7788,
    longitude: 90.3444,
    radiusMeters: 150,
    activeDeparturesToday: 28
  },
  {
    id: 'cnt_2',
    nameBn: 'মহাখালী আন্তঃজেলা বাস টার্মিনাল',
    cityBn: 'ঢাকা',
    supervisorName: 'আব্দুর রাজ্জাক',
    supervisorPhone: '01822-771122',
    latitude: 23.7776,
    longitude: 90.4005,
    radiusMeters: 180,
    activeDeparturesToday: 34
  },
  {
    id: 'cnt_3',
    nameBn: 'সায়েদাবাদ বাস টার্মিনাল কাউন্টার',
    cityBn: 'ঢাকা',
    supervisorName: 'মো: জসীম উদ্দিন',
    supervisorPhone: '01933-445566',
    latitude: 23.7147,
    longitude: 90.4285,
    radiusMeters: 200,
    activeDeparturesToday: 42
  },
  {
    id: 'cnt_4',
    nameBn: 'দামপাড়া / জিইসি বাস কাউন্টার',
    cityBn: 'চট্টগ্রাম',
    supervisorName: 'কামাল হোসেন',
    supervisorPhone: '01611-998877',
    latitude: 22.3592,
    longitude: 91.8215,
    radiusMeters: 120,
    activeDeparturesToday: 26
  }
];

export const INITIAL_SCHEDULES: BusTripSchedule[] = [
  {
    id: 'trip_101',
    coachNumber: 'হানিফ স্পেশাল-৭৮',
    vehiclePlate: 'ঢাকা মেট্রো-ব ১৪-৯৯০১',
    routeTitleBn: 'ঢাকা (গাবতলী) ➔ রাজশাহী (রেলগেট)',
    originCounter: 'গাবতলী সেন্ট্রাল বাস টার্মিনাল কাউন্টার',
    destinationCounter: 'রাজশাহী শিরোইল টার্মিনাল',
    scheduledDeparture: '১১:৩০ AM',
    actualDeparture: '১১:৩৫ AM',
    delayMinutes: 5,
    supervisorGatepass: 'GP-DHK-9081',
    passengerCount: 38,
    status: 'DEPARTED'
  },
  {
    id: 'trip_102',
    coachNumber: 'গ্রিন লাইন ভলভো-০৯',
    vehiclePlate: 'ঢাকা মেট্রো-ব ১১-২২৩৩',
    routeTitleBn: 'ঢাকা (সায়েদাবাদ) ➔ চট্টগ্রাম (দামপাড়া)',
    originCounter: 'সায়েদাবাদ বাস টার্মিনাল কাউন্টার',
    destinationCounter: 'দামপাড়া / জিইসি বাস কাউন্টার',
    scheduledDeparture: '১২:১৫ PM',
    delayMinutes: 0,
    supervisorGatepass: 'GP-SYD-1102',
    passengerCount: 32,
    status: 'BOARDING'
  },
  {
    id: 'trip_103',
    coachNumber: 'এনা পরিবহন স্ক্যানিয়া',
    vehiclePlate: 'ঢাকা মেট্রো-ব ১৫-৪৪৩২',
    routeTitleBn: 'ঢাকা (মহাখালী) ➔ সিলেট (কদমতলী)',
    originCounter: 'মহাখালী আন্তঃজেলা বাস টার্মিনাল',
    destinationCounter: 'সিলেট কদমতলী বাস টার্মিনাল',
    scheduledDeparture: '১২:৪৫ PM',
    delayMinutes: 0,
    supervisorGatepass: 'GP-MHK-3319',
    passengerCount: 40,
    status: 'SCHEDULED'
  }
];

interface TransitCounterManagerProps {
  isCustomerScoped?: boolean;
}

export const TransitCounterManager: React.FC<TransitCounterManagerProps> = ({ isCustomerScoped = false }) => {
  const [counters, setCounters] = useState<TransitCounter[]>(() => {
    const saved = localStorage.getItem('gps_transit_counters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_COUNTERS;
  });

  const [schedules, setSchedules] = useState<BusTripSchedule[]>(() => {
    const saved = localStorage.getItem('gps_bus_trip_schedules');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_SCHEDULES;
  });

  const [activeTab, setActiveTab] = useState<'schedules' | 'counters'>('schedules');
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);

  // Form State
  const [formCoach, setFormCoach] = useState('');
  const [formPlate, setFormPlate] = useState('');
  const [formOrigin, setFormOrigin] = useState('গাবতলী সেন্ট্রাল বাস টার্মিনাল কাউন্টার');
  const [formDest, setFormDest] = useState('দামপাড়া / জিইসি বাস কাউন্টার');
  const [formTime, setFormTime] = useState('০১:৩০ PM');
  const [formPassCount, setFormPassCount] = useState(36);

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCoach.trim() || !formPlate.trim()) return;

    const newTrip: BusTripSchedule = {
      id: `trip_${Date.now().toString().slice(-4)}`,
      coachNumber: formCoach.trim(),
      vehiclePlate: formPlate.trim(),
      routeTitleBn: `${formOrigin.split(' ')[0]} ➔ ${formDest.split(' ')[0]}`,
      originCounter: formOrigin,
      destinationCounter: formDest,
      scheduledDeparture: formTime,
      delayMinutes: 0,
      supervisorGatepass: `GP-${Date.now().toString().slice(-4)}`,
      passengerCount: Number(formPassCount),
      status: 'SCHEDULED'
    };

    const updated = [newTrip, ...schedules];
    setSchedules(updated);
    localStorage.setItem('gps_bus_trip_schedules', JSON.stringify(updated));
    setIsAddScheduleModalOpen(false);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 text-cyan-400 border border-cyan-500/50 flex items-center justify-center shadow-lg shrink-0">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white">
                🏢 বাস ও ট্রান্সপোর্ট কাউন্টার এবং সুপারভাইজার হাব (Transit Hub)
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                DISPATCH ERP
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              বাস কাউন্টার জিওফেন্সিং, ডিপার্চার শিডিউল, ডিলে অ্যালার্ট ও সুপারভাইজার গেটপাস ম্যানেজমেন্ট
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddScheduleModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-1.5 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন বাস শিডিউল ট্রিপ</span>
        </button>
      </div>

      {/* 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-slate-400 font-bold block">মোট নিবন্ধিত কাউন্টার</span>
          <span className="text-lg font-black text-white">{counters.length} টি</span>
        </div>
        <div className="bg-slate-900 border border-cyan-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-cyan-400 font-bold block">আজকের মোট ট্রিপ</span>
          <span className="text-lg font-black text-cyan-300">১৩০ টি ডিপার্চার</span>
        </div>
        <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-emerald-400 font-bold block">যথাসময়ে ছাড়া বাস</span>
          <span className="text-lg font-black text-emerald-300">৯৬.৪% অন-টাইম</span>
        </div>
        <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-amber-400 font-bold block">বোর্ডিং চলছে</span>
          <span className="text-lg font-black text-amber-300">
            {schedules.filter(s => s.status === 'BOARDING').length} টি কোচ
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-2xl font-bold border transition ${
            activeTab === 'schedules' ? 'bg-cyan-600 text-white border-cyan-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          🚌 বাস ডিপার্চার শিডিউল ({schedules.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('counters')}
          className={`px-4 py-2 rounded-2xl font-bold border transition ${
            activeTab === 'counters' ? 'bg-cyan-600 text-white border-cyan-500 shadow-md' : 'bg-slate-900 text-slate-400 border-slate-800'
          }`}
        >
          🏢 কাউন্টার লোকেশন ও সুপারভাইজার ({counters.length})
        </button>
      </div>

      {/* Schedules Table */}
      {activeTab === 'schedules' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="space-y-2.5">
            {schedules.map((sch) => {
              const statusBadge = 
                sch.status === 'DEPARTED' ? 'bg-slate-800 text-slate-300 border-slate-700' :
                sch.status === 'BOARDING' ? 'bg-emerald-950 text-emerald-300 border-emerald-600 animate-pulse' :
                'bg-cyan-950 text-cyan-300 border-cyan-700';

              return (
                <div key={sch.id} className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-white">{sch.coachNumber}</span>
                        <span className="text-[10px] font-mono text-cyan-400">({sch.vehiclePlate})</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[11px] text-slate-300 font-bold mt-0.5">
                        <span>{sch.routeTitleBn}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full border ${statusBadge}`}>
                        {sch.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">কাউন্টার ডিপার্চার:</span>
                      <span className="font-mono font-black text-amber-300">{sch.scheduledDeparture}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">যাত্রী সংখ্যা:</span>
                      <span className="font-mono font-bold text-white">{sch.passengerCount} জন</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">গেটপাস টোকেন:</span>
                      <span className="font-mono text-indigo-300">{sch.supervisorGatepass}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">ডিলে স্ট্যাটাস:</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {sch.delayMinutes === 0 ? '০ মিনিট (অন-টাইম)' : `+${sch.delayMinutes} মিনিট`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Counters List */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {counters.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black text-white block">{c.nameBn}</span>
                  <span className="text-[10.5px] text-cyan-400 font-bold">{c.cityBn} বিভাগ</span>
                </div>
                <span className="text-[9.5px] font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/40">
                  {c.radiusMeters}m Geofence
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">সুপারভাইজার:</span>
                  <span className="font-bold text-slate-200">{c.supervisorName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">যোগাযোগ:</span>
                  <span className="font-mono text-indigo-300">{c.supervisorPhone}</span>
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400 flex items-center justify-between">
                <span>আজকের মোট ডিপার্চার: <strong className="text-cyan-300">{c.activeDeparturesToday} টি কোচ</strong></span>
                <span className="text-emerald-400 font-bold">● GEOFENCE ACTIVE</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Schedule Modal */}
      {isAddScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-cyan-300 flex items-center space-x-2">
                <Bus className="w-4 h-4 text-cyan-400" />
                <span>নতুন বাস ট্রিপ শিডিউল যুক্ত করুন</span>
              </h3>
              <button onClick={() => setIsAddScheduleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কোচ নম্বর / নাম *</label>
                <input
                  type="text"
                  required
                  value={formCoach}
                  onChange={(e) => setFormCoach(e.target.value)}
                  placeholder="যেমন: শ্যামলী এন আর ট্রাভেলস-০২"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">গাড়ির প্লেট নম্বর *</label>
                <input
                  type="text"
                  required
                  value={formPlate}
                  onChange={(e) => setFormPlate(e.target.value)}
                  placeholder="ঢাকা মেট্রো-ব ১১-XXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">অরিজিন কাউন্টার</label>
                  <select
                    value={formOrigin}
                    onChange={(e) => setFormOrigin(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {counters.map(c => (
                      <option key={c.id} value={c.nameBn}>{c.nameBn.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">গন্তব্য কাউন্টার</label>
                  <select
                    value={formDest}
                    onChange={(e) => setFormDest(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                  >
                    {counters.map(c => (
                      <option key={c.id} value={c.nameBn}>{c.nameBn.split(' ')[0]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ডিপার্চার সময়</label>
                  <input
                    type="text"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    placeholder="যেমন: ১২:৩০ PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মোট যাত্রী</label>
                  <input
                    type="number"
                    value={formPassCount}
                    onChange={(e) => setFormPassCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black text-xs shadow-lg shadow-cyan-600/30"
                >
                  শিডিউল সংরক্ষণ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
