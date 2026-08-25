import React, { useState, useEffect } from 'react';
import { 
  Flame, 
  MapPin, 
  Plus, 
  DollarSign, 
  Sliders, 
  CheckCircle2, 
  Users, 
  PhoneCall, 
  ShieldCheck, 
  Star, 
  Navigation, 
  Building2, 
  CreditCard, 
  FileText, 
  Truck, 
  Check,
  Search,
  Filter,
  X,
  Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface RescueSquad {
  id: string;
  name: string;
  leaderName: string;
  phone: string;
  alternatePhone: string;
  zone: string;
  tier: 'Tier-1 Metro' | 'Tier-2 Highway' | 'Tier-3 District';
  vehicleType: 'Bike Rapid Squad' | '4x4 Rescue Jeep' | 'Flatbed Tow Truck';
  policeLiaison: string;
  status: 'standby' | 'on_mission' | 'offline';
  totalMissions: number;
  successRecoveries: number;
  avgResponseMins: number;
  starRating: number;
}

export interface RescuePayoutRecord {
  id: string;
  missionId: string;
  squadId: string;
  squadName: string;
  vehiclePlate: string;
  modelType: 'Fixed' | 'Bounty' | 'Combined';
  basePayBdt: number;
  bountyPayBdt: number;
  totalBdt: number;
  status: 'paid' | 'pending';
  paidVia?: string;
  date: string;
}

export const RescueTeamManager: React.FC = () => {
  const { language } = useApp();

  const [activeTab, setActiveTab] = useState<'squads' | 'rates' | 'ledger'>('squads');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddSquadModalOpen, setIsAddSquadModalOpen] = useState(false);
  const [saveRatesSuccess, setSaveRatesSuccess] = useState(false);

  // Admin Configurable Rescue Rate Cards
  const [rescueRates, setRescueRates] = useState<{
    fixedBasePayBdt: number;
    bikeBountyBdt: number;
    carBountyBdt: number;
    heavyBountyBdt: number;
    annualFreeQuota: number;
    customerEmergencyFeeBdt: number;
  }>(() => {
    const saved = localStorage.getItem('gps_admin_rescue_rates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      fixedBasePayBdt: 500,
      bikeBountyBdt: 2000,
      carBountyBdt: 3500,
      heavyBountyBdt: 5000,
      annualFreeQuota: 2,
      customerEmergencyFeeBdt: 1500
    };
  });

  // Rescue Squads Fleet
  const [squads, setSquads] = useState<RescueSquad[]>(() => {
    const saved = localStorage.getItem('gps_rescue_squads');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'SQ-DHK-01',
        name: 'Dhaka North Rapid Bike Squad',
        leaderName: 'Sergeant (Retd.) Farhad Hossain',
        phone: '01819-112233',
        alternatePhone: '01712-334455',
        zone: 'Dhaka Metro North (Gulshan, Uttara, Kuril)',
        tier: 'Tier-1 Metro',
        vehicleType: 'Bike Rapid Squad',
        policeLiaison: 'Gulshan & Airport Thana',
        status: 'standby',
        totalMissions: 28,
        successRecoveries: 27,
        avgResponseMins: 11,
        starRating: 4.9
      },
      {
        id: 'SQ-EXP-02',
        name: 'Padma Bridge Expressway Intercept Team',
        leaderName: 'Inspector (Retd.) Asaduzzaman',
        phone: '01914-556677',
        alternatePhone: '01811-223344',
        zone: 'Padma Bridge & Dhaka-Mawa Expressway',
        tier: 'Tier-2 Highway',
        vehicleType: '4x4 Rescue Jeep',
        policeLiaison: 'Highway Police Mawa Outpost',
        status: 'on_mission',
        totalMissions: 19,
        successRecoveries: 18,
        avgResponseMins: 16,
        starRating: 4.8
      },
      {
        id: 'SQ-CTG-03',
        name: 'Chittagong Port & Highway Recovery Unit',
        leaderName: 'Kazi Manzurul Islam',
        phone: '01711-889900',
        alternatePhone: '01815-667788',
        zone: 'Chittagong Metro & Sitakunda Belt',
        tier: 'Tier-1 Metro',
        vehicleType: 'Flatbed Tow Truck',
        policeLiaison: 'Pahartali Police Station',
        status: 'standby',
        totalMissions: 14,
        successRecoveries: 13,
        avgResponseMins: 14,
        starRating: 4.7
      }
    ];
  });

  // Financial Payout Ledger
  const [payouts, setPayouts] = useState<RescuePayoutRecord[]>(() => {
    const saved = localStorage.getItem('gps_rescue_payouts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'PAY-8841',
        missionId: 'RESCUE-2026-0818',
        squadId: 'SQ-DHK-01',
        squadName: 'Dhaka North Rapid Bike Squad',
        vehiclePlate: 'DHAKA METRO-CHA 54-1122',
        modelType: 'Combined',
        basePayBdt: 500,
        bountyPayBdt: 3500,
        totalBdt: 4000,
        status: 'paid',
        paidVia: 'bKash Merchant (Txn: 9812AXX)',
        date: '18 Aug 2026'
      },
      {
        id: 'PAY-8842',
        missionId: 'RESCUE-2026-0824',
        squadId: 'SQ-EXP-02',
        squadName: 'Padma Bridge Expressway Intercept Team',
        vehiclePlate: 'DHAKA METRO-LA 28-9798',
        modelType: 'Combined',
        basePayBdt: 500,
        bountyPayBdt: 2000,
        totalBdt: 2500,
        status: 'pending',
        date: 'Today, 11:35 PM'
      }
    ];
  });

  // Form state for adding new squad
  const [newSquadName, setNewSquadName] = useState('');
  const [newLeaderName, setNewLeaderName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newZone, setNewZone] = useState('Dhaka Metro (Gulshan, Banani, Uttara)');
  const [newTier, setNewTier] = useState<'Tier-1 Metro' | 'Tier-2 Highway' | 'Tier-3 District'>('Tier-1 Metro');
  const [newVehicle, setNewVehicle] = useState<'Bike Rapid Squad' | '4x4 Rescue Jeep' | 'Flatbed Tow Truck'>('Bike Rapid Squad');
  const [newPoliceStation, setNewPoliceStation] = useState('Local Thana & Highway Police');

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gps_admin_rescue_rates', JSON.stringify(rescueRates));
    setSaveRatesSuccess(true);
    setTimeout(() => setSaveRatesSuccess(false), 2000);
  };

  const handleCreateSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim() || !newLeaderName.trim() || !newPhone.trim()) return;

    const newSq: RescueSquad = {
      id: `SQ-${Date.now().toString().slice(-4)}`,
      name: newSquadName,
      leaderName: newLeaderName,
      phone: newPhone,
      alternatePhone: '01700-000000',
      zone: newZone,
      tier: newTier,
      vehicleType: newVehicle,
      policeLiaison: newPoliceStation,
      status: 'standby',
      totalMissions: 0,
      successRecoveries: 0,
      avgResponseMins: 12,
      starRating: 5.0
    };

    const updated = [newSq, ...squads];
    setSquads(updated);
    localStorage.setItem('gps_rescue_squads', JSON.stringify(updated));
    setIsAddSquadModalOpen(false);
    setNewSquadName('');
    setNewLeaderName('');
    setNewPhone('');
  };

  const handleMarkPayoutPaid = (id: string) => {
    const updated = payouts.map(p => {
      if (p.id === id) {
        return { ...p, status: 'paid' as const, paidVia: 'bKash Merchant Instant Transfer' };
      }
      return p;
    });
    setPayouts(updated);
    localStorage.setItem('gps_rescue_payouts', JSON.stringify(updated));
  };

  const filteredSquads = squads.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.leaderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-4 select-none animate-in fade-in">
      
      {/* Top Header & Tab Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900 border border-slate-800 p-3.5 rounded-3xl shadow-xl gap-3">
        <div>
          <h3 className="text-sm md:text-base font-extrabold text-white flex items-center space-x-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <span>{language === 'bn' ? 'রেসকিউ টিম হাব ও অ্যাডমিন পেমেন্ট ইঞ্জিন' : 'Rescue Squads & Compensation Engine'}</span>
          </h3>
          <p className="text-[10.5px] text-slate-400">
            লোকেশন-ভিত্তিক রেসকিউ স্কোয়াড • ফিক্সড ও কমিশন রেট কার্ড • পে-আউট লেজার
          </p>
        </div>

        {/* Action Tabs */}
        <div className="flex items-center space-x-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('squads')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl transition ${
              activeTab === 'squads' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            🗺️ রেসকিউ টিম ({squads.length})
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl transition ${
              activeTab === 'rates' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            💰 রেট কনফিগ
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-xl transition ${
              activeTab === 'ledger' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            💳 পে-আউট লেজার
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SQUAD TEAM LIST & BUILDER                                          */}
      {/* ========================================================================= */}
      {activeTab === 'squads' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 এলাকা, জোন বা টিম লিডারের নাম দিয়ে খুঁজুন..."
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => setIsAddSquadModalOpen(true)}
              className="px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center space-x-1.5 transition active:scale-95 shadow-md shadow-rose-600/30 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন স্কোয়াড যুক্ত করুন</span>
            </button>
          </div>

          {/* Squad Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {filteredSquads.map((sq) => (
              <div key={sq.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-extrabold text-xs text-white">{sq.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {sq.id} • {sq.tier}</div>
                    </div>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      sq.status === 'standby' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      sq.status === 'on_mission' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {sq.status === 'standby' ? '🟢 প্রস্তুত' : sq.status === 'on_mission' ? '🔴 মিশনে নিয়োজিত' : '⚪ অফ-ডিউটি'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs space-y-1">
                    <div className="text-slate-300">
                      👤 লিডার: <strong className="text-white">{sq.leaderName}</strong>
                    </div>
                    <div className="text-slate-400 text-[11px]">
                      📍 এলাকা: <strong className="text-slate-200">{sq.zone}</strong>
                    </div>
                    <div className="text-slate-400 text-[10.5px]">
                      🚓 পুলিশ লিয়াজোঁ: <strong className="text-blue-300">{sq.policeLiaison}</strong>
                    </div>
                    <div className="text-slate-400 text-[10.5px]">
                      🏍️ যান: <strong className="text-purple-300">{sq.vehicleType}</strong>
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                    <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">মোট অভিযান</span>
                      <strong className="text-white font-mono text-xs">{sq.totalMissions}</strong>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">সফল উদ্ধার</span>
                      <strong className="text-emerald-400 font-mono text-xs">{sq.successRecoveries}</strong>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      <span className="text-slate-500 block">রেসপন্স টাইম</span>
                      <strong className="text-amber-400 font-mono text-xs">~{sq.avgResponseMins} মি.</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{sq.starRating}</span>
                  </div>

                  <a
                    href={`tel:${sq.phone}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs flex items-center space-x-1 transition active:scale-95 border border-slate-700"
                  >
                    <PhoneCall className="w-3 h-3 text-emerald-400" />
                    <span>{sq.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ADMIN RESCUE RATE CARD & COMPENSATION CONFIG                       */}
      {/* ========================================================================= */}
      {activeTab === 'rates' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 max-w-2xl mx-auto">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-white">অ্যাডমিন রেসকিউ ক্ষতিপূরণ ও ফি কনফিগ</h4>
                <p className="text-[10.5px] text-slate-400">টিম পে-আউট ও কাস্টমার রেসকিউ বিলিং নির্ধারণ করুন</p>
              </div>
            </div>

            {saveRatesSuccess && (
              <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1 animate-in fade-in">
                <Check className="w-4 h-4" />
                <span>সংরক্ষিত হয়েছে!</span>
              </span>
            )}
          </div>

          <form onSubmit={handleSaveRates} className="space-y-4 text-xs">
            {/* Section 1: Rescue Squad Compensation Model */}
            <div className="space-y-2">
              <span className="font-extrabold text-amber-300 block text-xs uppercase tracking-wide">
                ১. ফিল্ড রেসকিউ টিম পে-আউট স্ট্রাকচার (BDT)
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold">ফিক্সড ট্রাভেল বেস ফি (প্রতি কল)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-bold">৳</span>
                    <input
                      type="number"
                      value={rescueRates.fixedBasePayBdt}
                      onChange={(e) => setRescueRates({ ...rescueRates, fixedBasePayBdt: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-white font-mono font-bold"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500">টিম ফিল্ডে রওয়ানা হওয়া মাত্রই প্রযোজ্য</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold">মোটরবাইক সফল রিকভারি বাউন্টি</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-bold">৳</span>
                    <input
                      type="number"
                      value={rescueRates.bikeBountyBdt}
                      onChange={(e) => setRescueRates({ ...rescueRates, bikeBountyBdt: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-white font-mono font-bold"
                    />
                  </div>
                  <span className="text-[9px] text-emerald-400">বাইক অক্ষত উদ্ধারে বোনাস</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold">প্রাইভেট কার/মাইক্রোবাস বাউন্টি</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-bold">৳</span>
                    <input
                      type="number"
                      value={rescueRates.carBountyBdt}
                      onChange={(e) => setRescueRates({ ...rescueRates, carBountyBdt: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-white font-mono font-bold"
                    />
                  </div>
                  <span className="text-[9px] text-emerald-400">গাড়ি সফল উদ্ধারে বোনাস</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold">হেভি বাস/ট্রাক রিকভারি বাউন্টি</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-bold">৳</span>
                    <input
                      type="number"
                      value={rescueRates.heavyBountyBdt}
                      onChange={(e) => setRescueRates({ ...rescueRates, heavyBountyBdt: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-white font-mono font-bold"
                    />
                  </div>
                  <span className="text-[9px] text-emerald-400">হেভি ভেহিক্যাল রিকভারি বোনাস</span>
                </div>
              </div>
            </div>

            {/* Section 2: Customer Emergency Rescue Fee & Quota */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="font-extrabold text-blue-300 block text-xs uppercase tracking-wide">
                ২. গ্রাহক রেসকিউ কোটা ও ফি পলিসি
              </span>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold">বার্ষিক ফ্রি রেসকিউ কোটা (বছর/বার)</label>
                  <input
                    type="number"
                    value={rescueRates.annualFreeQuota}
                    onChange={(e) => setRescueRates({ ...rescueRates, annualFreeQuota: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono font-bold"
                  />
                  <span className="text-[9px] text-slate-500">সক্রিয় জিপিএস গ্রাহকের জন্য ফ্রি কোটা</span>
                </div>

                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold">অতিরিক্ত রেসকিউ ফি (অন-ডিমান্ড)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-slate-500 font-bold">৳</span>
                    <input
                      type="number"
                      value={rescueRates.customerEmergencyFeeBdt}
                      onChange={(e) => setRescueRates({ ...rescueRates, customerEmergencyFeeBdt: parseInt(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-7 pr-3 py-1.5 text-white font-mono font-bold"
                    />
                  </div>
                  <span className="text-[9px] text-slate-500">কোটা শেষ হওয়ার পর কাস্টমার চার্জ</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 transition active:scale-95"
            >
              রেসকিউ রেট ও পলিসি সংরক্ষণ করুন
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: FINANCIAL PAYOUT LEDGER                                            */}
      {/* ========================================================================= */}
      {activeTab === 'ledger' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                রেসকিউ টিম পে-আউট লেজার ও সেটেলমেন্ট
              </span>
            </div>
            <span className="text-xs font-bold text-slate-400 font-mono">
              মোট পে-আউট: ৳{payouts.reduce((sum, p) => sum + p.totalBdt, 0).toLocaleString()}
            </span>
          </div>

          <div className="space-y-2">
            {payouts.map((pay) => (
              <div key={pay.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-white">{pay.squadName}</span>
                    <span className="text-[9px] bg-slate-800 px-1.5 py-0.2 rounded font-mono text-slate-300">
                      মিশন: {pay.missionId} ({pay.vehiclePlate})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    তারিখ: {pay.date} • পে-আউট ব্রেকডাউন: ৳{pay.basePayBdt} (বেস) + ৳{pay.bountyPayBdt} (সাকসেস বোনাস)
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <div className="font-mono font-black text-sm text-emerald-400">৳{pay.totalBdt.toLocaleString()}</div>
                    <span className={`text-[9px] font-bold ${pay.status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {pay.status === 'paid' ? '✅ পরিশোধিত' : '⏳ পেমেন্ট পেন্ডিং'}
                    </span>
                  </div>

                  {pay.status === 'pending' && (
                    <button
                      onClick={() => handleMarkPayoutPaid(pay.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-95 shadow-md shadow-emerald-600/30"
                    >
                      বিকাশে পে করুন
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Squad Modal */}
      {isAddSquadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-rose-500" />
                <h4 className="text-sm font-extrabold text-white">নতুন রেসকিউ স্কোয়াড অনবোর্ডিং</h4>
              </div>
              <button onClick={() => setIsAddSquadModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateSquad} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] text-slate-400 block mb-1">স্কোয়াডের নাম</label>
                <input
                  type="text"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g. Uttara Rapid Bike Squad"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] text-slate-400 block mb-1">টিম লিডারের নাম</label>
                  <input
                    type="text"
                    value={newLeaderName}
                    onChange={(e) => setNewLeaderName(e.target.value)}
                    placeholder="Leader Name"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[10.5px] text-slate-400 block mb-1">মোবাইল নম্বর</label>
                  <input
                    type="text"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="01800-000000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] text-slate-400 block mb-1">কার্য এলাকা / হাইওয়ে করিডোর</label>
                <input
                  type="text"
                  value={newZone}
                  onChange={(e) => setNewZone(e.target.value)}
                  placeholder="e.g. Dhaka-Mawa Expressway"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] text-slate-400 block mb-1">জোন টিয়ার</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="Tier-1 Metro">Tier-1 Metro</option>
                    <option value="Tier-2 Highway">Tier-2 Highway</option>
                    <option value="Tier-3 District">Tier-3 District</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] text-slate-400 block mb-1">যানবাহন টাইপ</label>
                  <select
                    value={newVehicle}
                    onChange={(e) => setNewVehicle(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white"
                  >
                    <option value="Bike Rapid Squad">Bike Rapid Squad</option>
                    <option value="4x4 Rescue Jeep">4x4 Rescue Jeep</option>
                    <option value="Flatbed Tow Truck">Flatbed Tow Truck</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] text-slate-400 block mb-1">পুলিশ লিয়াজোঁ থানা</label>
                <input
                  type="text"
                  value={newPoliceStation}
                  onChange={(e) => setNewPoliceStation(e.target.value)}
                  placeholder="e.g. Gulshan Thana & Highway Patrol"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs transition active:scale-95"
              >
                স্কোয়াড অনবোর্ড করুন
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
