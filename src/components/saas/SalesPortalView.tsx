import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  ArrowLeft, 
  Plus, 
  UserCheck, 
  Smartphone, 
  CreditCard, 
  CheckCircle2, 
  TrendingUp, 
  DollarSign, 
  Award,
  Scan,
  ShieldCheck,
  Clock,
  Send
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleType } from '../../types/traccar';

export interface SalesLeadEntry {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  plate: string;
  category: VehicleType;
  imei: string;
  sim: string;
  plan: string;
  commission: number;
  date: string;
  status: 'pending_admin_approval' | 'approved_pushed' | 'rejected';
}

export const SalesPortalView: React.FC = () => {
  const { language, setActiveTab, setCurrentRole } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleName, setVehicleName] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  const [vehicleCategory, setVehicleCategory] = useState<VehicleType>('motorcycle');
  const [trackerImei, setTrackerImei] = useState('');
  const [simNumber, setSimNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('12_months');
  const [onboardSuccess, setOnboardSuccess] = useState(false);

  const [salesLeads, setSalesLeads] = useState<SalesLeadEntry[]>(() => {
    const saved = localStorage.getItem('gps_sales_leads_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'lead-1', customer: 'Tanvir Hossain', phone: '01712-345678', vehicle: 'Yamaha FZ-S V3', plate: 'DHAKA METRO-LA 22-3344', category: 'motorcycle', imei: '864720058291090', sim: '01711223344', plan: '1 Year', commission: 500, date: '24 Aug 2026', status: 'approved_pushed' },
      { id: 'lead-2', customer: 'Kazi Mahbub', phone: '01819-876543', vehicle: 'Toyota Axio', plate: 'DHAKA METRO-GA 33-4455', category: 'car', imei: '864720058291091', sim: '01811223344', plan: '6 Months', commission: 350, date: '24 Aug 2026', status: 'pending_admin_approval' },
      { id: 'lead-3', customer: 'Shohel Rana', phone: '01911-223344', vehicle: 'Bajaj Pulsar 150', plate: 'DHAKA METRO-HA 44-5566', category: 'motorcycle', imei: '864720058291092', sim: '01911223344', plan: '1 Year', commission: 500, date: '23 Aug 2026', status: 'approved_pushed' }
    ];
  });

  const handleOnboardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLead: SalesLeadEntry = {
      id: 'lead-' + Date.now(),
      customer: customerName,
      phone: customerPhone,
      vehicle: vehicleName,
      plate: plateNumber,
      category: vehicleCategory,
      imei: trackerImei,
      sim: simNumber,
      plan: selectedPlan === '12_months' ? '1 Year' : selectedPlan === '6_months' ? '6 Months' : '3 Months',
      commission: selectedPlan === '12_months' ? 500 : 350,
      date: new Date().toLocaleDateString('en-GB'),
      status: 'pending_admin_approval'
    };

    const updated = [newLead, ...salesLeads];
    setSalesLeads(updated);
    localStorage.setItem('gps_sales_leads_queue', JSON.stringify(updated));

    setOnboardSuccess(true);
    setTimeout(() => {
      setOnboardSuccess(false);
      setCustomerName('');
      setCustomerPhone('');
      setVehicleName('');
      setPlateNumber('');
      setTrackerImei('');
      setSimNumber('');
    }, 2500);
  };

  const totalCommission = salesLeads
    .filter(l => l.status === 'approved_pushed')
    .reduce((sum, l) => sum + l.commission, 0);

  const pendingCommission = salesLeads
    .filter(l => l.status === 'pending_admin_approval')
    .reduce((sum, l) => sum + l.commission, 0);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('map');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
          </button>
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-emerald-300">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'সেলস ও কাস্টমার অনবোর্ডিং পোর্টাল' : 'Sales & Onboarding Portal'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'নতুন ট্র্যাকার রিকোয়েস্ট তৈরি ➔ অ্যাডমিন ভেরিফিকেশন ও কমিশন' : 'Sales lead submission & admin approval workflow'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-400 block">অনুমোদিত কমিশন</span>
          <span className="text-xs font-mono font-black text-emerald-300">৳{totalCommission.toLocaleString()}</span>
          {pendingCommission > 0 && (
            <span className="text-[8.5px] text-amber-400 block font-mono">পেন্ডিং: ৳{pendingCommission.toLocaleString()}</span>
          )}
        </div>
      </div>

      {/* Target & Performance Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-4 shadow-xl space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">চলতি মাসের সেলস টার্গেট (আগস্ট ২০২৬)</span>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-300">{salesLeads.filter(l => l.status === 'approved_pushed').length} / ১৫ টি সম্পন্ন</span>
        </div>

        <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (salesLeads.filter(l => l.status === 'approved_pushed').length / 15) * 100)}%` }} 
          />
        </div>
      </div>

      {/* New Customer Onboarding Wizard (Submits to Admin Queue) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              {language === 'bn' ? '১. নতুন কাস্টমার অনবোর্ডিং ফর্ম (Submit for Approval)' : 'Onboard Customer'}
            </span>
          </div>
          {onboardSuccess && (
            <span className="text-[10px] text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/40 font-bold flex items-center space-x-1 animate-pulse">
              <Clock className="w-3.5 h-3.5" />
              <span>অ্যাডমিন অ্যাপ্রুভালের জন্য জমা হয়েছে!</span>
            </span>
          )}
        </div>

        <p className="text-[11px] text-slate-400">
          💡 <strong>নিরাপত্তা নীতি:</strong> সেলস থেকে সাবমিট করার পর রিকোয়েস্টটি সুপার অ্যাডমিনের প্যানেলে যাবে। অ্যাডমিন ভেরিফাই করে অ্যাপ্রুভ দিলেই ডিভাইসটি স্বয়ংক্রিয়ভাবে জিপিএস সার্ভারে লাইভ হবে।
        </p>

        <form onSubmit={handleOnboardSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10.5px] font-bold text-slate-400 block mb-1">কাস্টমারের পুরো নাম:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. মো: রফিকুল ইসলাম"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-400 block mb-1">কাস্টমার মোবাইল নম্বর (লগইন আইডি):</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10.5px] font-bold text-slate-400 block mb-1">গাড়ির নাম ও মডেল:</label>
              <input
                type="text"
                required
                value={vehicleName}
                onChange={(e) => setVehicleName(e.target.value)}
                placeholder="e.g. Bajaj Avenger 160"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-400 block mb-1">গাড়ির নাম্বার প্লেট:</label>
              <input
                type="text"
                required
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                placeholder="ঢাকা মেট্রো-ল ১১-২২৩৩"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-400 block mb-1">যানবাহনের ধরণ:</label>
              <select
                value={vehicleCategory}
                onChange={(e) => setVehicleCategory(e.target.value as VehicleType)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
              >
                <option value="motorcycle">মোটরসাইকেল (Bike)</option>
                <option value="scooter">স্কুটার (Scooty)</option>
                <option value="car">প্রাইভেট কার (Car)</option>
                <option value="cng">সিএনজি (CNG 3-Wheeler)</option>
                <option value="pickup">পিকআপ ভ্যান (Pickup)</option>
                <option value="truck">ভারী ট্রাক (Heavy Truck)</option>
                <option value="ambulance">অ্যাম্বুলেন্স (Ambulance)</option>
                <option value="bus">বাস (Bus)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            <div>
              <label className="text-[10.5px] font-bold text-slate-400 block mb-1">ট্র্যাকার ১৫-ডিজিট IMEI নম্বর:</label>
              <input
                type="text"
                required
                value={trackerImei}
                onChange={(e) => setTrackerImei(e.target.value)}
                placeholder="864720058291034"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-400 block mb-1">ডিভাইসে ইনস্টলকৃত সিম নম্বর:</label>
              <input
                type="tel"
                required
                value={simNumber}
                onChange={(e) => setSimNumber(e.target.value)}
                placeholder="018XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-400 block mb-1">সাবস্ক্রিপশন প্যাকেজ:</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold focus:outline-none"
              >
                <option value="12_months">১ বছর (১২ মাস) - ৳৩,৫০০ (কমিশন ৳৫০০)</option>
                <option value="6_months">৬ মাস - ৳১,৯৫০ (কমিশন ৳৩৫০)</option>
                <option value="3_months">৩ মাস - ৳১,০৫০ (কমিশন ৳২০০)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <Send className="w-4 h-4" />
            <span>{language === 'bn' ? 'অ্যাডমিন ভেরিফিকেশন ও অ্যাপ্রুভালের জন্য পাঠান' : 'Submit to Admin for Server Push'}</span>
          </button>
        </form>
      </div>

      {/* Agent Sales Log & Status Tracker */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          ২. সেলস হিস্ট্রি ও অ্যাডমিন অ্যাপ্রুভাল স্ট্যাটাস ({salesLeads.length})
        </span>

        <div className="space-y-2">
          {salesLeads.map((lead) => (
            <div key={lead.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <div className="font-extrabold text-slate-100 flex items-center space-x-2">
                  <span>{lead.customer}</span>
                  <span className="text-[9.5px] text-slate-400 font-mono">{lead.phone}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  গাড়ি: <strong className="text-slate-300">{lead.vehicle}</strong> • IMEI: {lead.imei} • প্যাকেজ: {lead.plan}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  lead.status === 'approved_pushed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                  lead.status === 'rejected' ? 'bg-rose-950 text-rose-300 border-rose-700' :
                  'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                }`}>
                  {lead.status === 'approved_pushed' ? '🟢 সার্ভারে লাইভ' :
                   lead.status === 'rejected' ? '🔴 বাতিলকৃত' :
                   '🟡 পেন্ডিং অ্যাপ্রুভাল'}
                </div>
                <div className="text-emerald-400 font-mono font-extrabold text-xs mt-1">+৳{lead.commission}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
