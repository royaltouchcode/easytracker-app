import React, { useState, useEffect } from 'react';
import { 
  User, 
  Award, 
  ShieldAlert, 
  Clock, 
  Plus, 
  Search, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Heart, 
  Calendar, 
  Flame, 
  X,
  Gauge,
  Sliders,
  Car
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  licenseNumber: string;
  licenseExpiry: string;
  bloodGroup: string;
  assignedDeviceId: number;
  assignedVehiclePlate: string;
  totalTrips: number;
  safetyScore: number; // 0-100
  overspeedEvents: number;
  harshBrakingEvents: number;
  dutyStatus: 'ON_DUTY' | 'RESTING' | 'OFF_DUTY';
  shiftStartTime: string;
  drivingHoursToday: number;
  avatarUrl?: string;
}

export const INITIAL_DRIVERS: DriverProfile[] = [
  {
    id: 'drv_1',
    name: 'মো: রফিকুল ইসলাম',
    phone: '01712-345678',
    licenseNumber: 'DL-DHK-2018-9901',
    licenseExpiry: '2027-11-20',
    bloodGroup: 'B+',
    assignedDeviceId: 1,
    assignedVehiclePlate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
    totalTrips: 184,
    safetyScore: 94,
    overspeedEvents: 2,
    harshBrakingEvents: 1,
    dutyStatus: 'ON_DUTY',
    shiftStartTime: 'সকাল ০৭:০০ AM',
    drivingHoursToday: 5.2
  },
  {
    id: 'drv_2',
    name: 'আব্দুল করিম হাওলাদার',
    phone: '01819-876543',
    licenseNumber: 'DL-CTG-2019-4412',
    licenseExpiry: '2026-12-15',
    bloodGroup: 'O+',
    assignedDeviceId: 2,
    assignedVehiclePlate: 'ঢাকা মেট্রো-ল ৯৮-৭৬৫৪',
    totalTrips: 142,
    safetyScore: 78,
    overspeedEvents: 8,
    harshBrakingEvents: 6,
    dutyStatus: 'ON_DUTY',
    shiftStartTime: 'সকাল ০৮:৩০ AM',
    drivingHoursToday: 4.8
  },
  {
    id: 'drv_3',
    name: 'জাহাঙ্গীর আলম',
    phone: '01911-223344',
    licenseNumber: 'DL-SYL-2021-3319',
    licenseExpiry: '2028-05-10',
    bloodGroup: 'A+',
    assignedDeviceId: 3,
    assignedVehiclePlate: 'ঢাকা মেট্রো-ট ৫৫-৪৪৩২',
    totalTrips: 98,
    safetyScore: 88,
    overspeedEvents: 3,
    harshBrakingEvents: 2,
    dutyStatus: 'RESTING',
    shiftStartTime: 'দুপুর ০২:০০ PM',
    drivingHoursToday: 2.1
  }
];

export const DriverPerformanceManager: React.FC<{ isCustomerScoped?: boolean }> = ({ isCustomerScoped = false }) => {
  const { devices, currentRole } = useApp();

  const [drivers, setDrivers] = useState<DriverProfile[]>(() => {
    const saved = localStorage.getItem('gps_driver_roster_profiles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_DRIVERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLicense, setFormLicense] = useState('');
  const [formBlood, setFormBlood] = useState('B+');
  const [formVehiclePlate, setFormVehiclePlate] = useState('');

  // Scoping: in Customer role, only show drivers assigned to user's vehicles
  const scopedDrivers = drivers.filter(drv => {
    if (isCustomerScoped || currentRole === 'customer') {
      const userDeviceIds = devices.map(d => d.id);
      return userDeviceIds.includes(drv.assignedDeviceId);
    }
    return true;
  });

  const filteredDrivers = scopedDrivers.filter(drv => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        drv.name.toLowerCase().includes(q) ||
        drv.phone.includes(q) ||
        drv.assignedVehiclePlate.toLowerCase().includes(q) ||
        drv.licenseNumber.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveDriver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim() || !formLicense.trim()) return;

    const matchedDevice = devices.find(d => d.name === formVehiclePlate) || devices[0];

    const newDriver: DriverProfile = {
      id: `drv_${Date.now()}`,
      name: formName.trim(),
      phone: formPhone.trim(),
      licenseNumber: formLicense.trim(),
      licenseExpiry: '2028-12-31',
      bloodGroup: formBlood,
      assignedDeviceId: matchedDevice ? matchedDevice.id : 1,
      assignedVehiclePlate: formVehiclePlate || (matchedDevice ? matchedDevice.name : 'ঢাকা মেট্রো-গ ১২-৩৪৫৬'),
      totalTrips: 0,
      safetyScore: 95,
      overspeedEvents: 0,
      harshBrakingEvents: 0,
      dutyStatus: 'ON_DUTY',
      shiftStartTime: 'এখনই',
      drivingHoursToday: 0
    };

    const updated = [newDriver, ...drivers];
    setDrivers(updated);
    localStorage.setItem('gps_driver_roster_profiles', JSON.stringify(updated));
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/50 flex items-center justify-center shadow-lg shrink-0">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white">
                👨‍✈️ ড্রাইভার রোস্টার ও পারফরম্যান্স স্কোরকার্ড (Driver Safety Leaderboard)
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                ECO-SAFETY AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              ড্রাইভার প্রোফাইল, ডিউটি শিফট ট্র্যাকিং, ওভারস্পিড/হার্শ ব্রেক আচরণ এবং সেফটি র‍্যাংকিং
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormVehiclePlate(devices[0]?.name || 'ঢাকা মেট্রো-গ ১২-৩৪৫৬');
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center space-x-1.5 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন ড্রাইভার যুক্ত করুন</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-slate-400 font-bold block">মোট ড্রাইভার</span>
          <span className="text-lg font-black text-white">{scopedDrivers.length} জন</span>
        </div>
        <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-emerald-400 font-bold block">অন-ডিউটি একটিভ</span>
          <span className="text-lg font-black text-emerald-300">
            {scopedDrivers.filter(d => d.dutyStatus === 'ON_DUTY').length} জন
          </span>
        </div>
        <div className="bg-slate-900 border border-blue-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-blue-400 font-bold block">ফ্লিট গড় সেফটি স্কোর</span>
          <span className="text-lg font-black text-blue-300">
            {scopedDrivers.length > 0 ? (scopedDrivers.reduce((a, b) => a + b.safetyScore, 0) / scopedDrivers.length).toFixed(0) : 90} / 100
          </span>
        </div>
        <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-amber-400 font-bold block">আজকের মোট ড্রাইভিং আওয়ার্স</span>
          <span className="text-lg font-black text-amber-300">
            {scopedDrivers.reduce((a, b) => a + b.drivingHoursToday, 0).toFixed(1)} ঘণ্টা
          </span>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {filteredDrivers.map((driver) => {
          const scoreColor = 
            driver.safetyScore >= 90 ? 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40' :
            driver.safetyScore >= 75 ? 'text-amber-400 border-amber-500/50 bg-amber-950/40' :
            'text-rose-400 border-rose-500/50 bg-rose-950/40';

          return (
            <div key={driver.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3.5 flex flex-col justify-between">
              
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-blue-950 text-blue-300 border border-blue-800 flex items-center justify-center font-black text-sm">
                    {driver.name.slice(0, 2)}
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block">{driver.name}</span>
                    <span className="text-[10.5px] font-mono text-slate-400">{driver.phone}</span>
                  </div>
                </div>

                <div className={`px-2.5 py-1 rounded-xl border text-center font-mono ${scoreColor}`}>
                  <span className="text-[9px] block font-bold">সেফটি স্কোর</span>
                  <span className="text-sm font-black">{driver.safetyScore}</span>
                </div>
              </div>

              {/* Vehicle & Shift Details */}
              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">অ্যাসাইনড গাড়ি:</span>
                  <span className="font-bold text-white flex items-center space-x-1">
                    <Car className="w-3 h-3 text-cyan-400" />
                    <span>{driver.assignedVehiclePlate}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">ড্রাইভিং লাইসেন্স:</span>
                  <span className="font-mono text-indigo-300">{driver.licenseNumber}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">রক্তের গ্রুপ:</span>
                  <span className="font-bold text-rose-400 flex items-center space-x-1">
                    <Heart className="w-3 h-3 text-rose-400" />
                    <span>{driver.bloodGroup}</span>
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400">আজকের ডিউটি:</span>
                  <span className="font-mono text-amber-300">{driver.drivingHoursToday} ঘণ্টা ({driver.shiftStartTime} হতে)</span>
                </div>
              </div>

              {/* Violations Strip */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">ওভারস্পিড:</span>
                  <span className="text-amber-400 font-bold">{driver.overspeedEvents} বার</span>
                </div>
                <div className="bg-slate-950 p-2 rounded-xl border border-slate-800/80 flex items-center justify-between">
                  <span className="text-slate-400">তীব্র ব্রেক:</span>
                  <span className="text-rose-400 font-bold">{driver.harshBrakingEvents} বার</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Add Driver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-blue-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-blue-300 flex items-center space-x-2">
                <User className="w-4 h-4 text-blue-400" />
                <span>নতুন ড্রাইভার প্রোফাইল যুক্ত করুন</span>
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDriver} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ড্রাইভারের নাম *</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="যেমন: মো: আবুল কাশেম"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">রক্তের গ্রুপ</label>
                  <select
                    value={formBlood}
                    onChange={(e) => setFormBlood(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ড্রাইভিং লাইসেন্স নম্বর *</label>
                <input
                  type="text"
                  required
                  value={formLicense}
                  onChange={(e) => setFormLicense(e.target.value)}
                  placeholder="DL-DHK-XXXX-XXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">অ্যাসাইনড গাড়ি *</label>
                <select
                  value={formVehiclePlate}
                  onChange={(e) => setFormVehiclePlate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-blue-500 focus:outline-none"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-lg shadow-blue-600/30"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
