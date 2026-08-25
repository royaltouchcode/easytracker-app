import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Smartphone, 
  User, 
  Phone, 
  Car, 
  Layers, 
  DollarSign, 
  CheckCircle2, 
  QrCode, 
  Briefcase, 
  Wrench, 
  Headphones, 
  Flame, 
  Building2, 
  ShieldCheck, 
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaasRole, VehicleType } from '../../types/traccar';

interface UniversalSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const UniversalSaleModal: React.FC<UniversalSaleModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user, currentRole, registerUniversalSale, language } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [vehicleType, setVehicleType] = useState<VehicleType>('motorcycle');
  const [vehicleName, setVehicleName] = useState('Yamaha FZS V3');
  const [plateNumber, setPlateNumber] = useState('');
  const [imei, setImei] = useState('');
  const [simNumber, setSimNumber] = useState('');
  const [packagePlan, setPackagePlan] = useState('লাইভ জিপিএস প্রিমিয়াম (৳ ৩৫০/মাস)');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [earnedCommission, setEarnedCommission] = useState(500);

  if (!isOpen) return null;

  const handleGenerateRandomImei = () => {
    const randomImei = '864720' + Math.floor(100000000 + Math.random() * 900000000);
    setImei(randomImei);
  };

  const handleSubmitSale = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !plateNumber.trim() || !imei.trim()) {
      alert('অনুগ্রহ করে কাস্টমার নাম, মোবাইল, গাড়ির নম্বর ও IMEI পূরণ করুন!');
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUniversalSale({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        vehicleName: vehicleName.trim(),
        plateNumber: plateNumber.trim().toUpperCase(),
        imei: imei.trim(),
        simNumber: simNumber.trim() || customerPhone.trim(),
        commissionBdt: 500,
        packagePlan
      });

      setEarnedCommission(500);
      setIsSuccess(true);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      alert('ডিভাইস সেল অনবোর্ডিং করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleCommissionBanner = () => {
    switch (currentRole) {
      case 'technician':
        return {
          icon: Wrench,
          title: '🔧 ফিল্ড টেকনিশিয়ান হিসেবে ডিভাইস অনবোর্ড করছেন',
          color: 'from-amber-600/30 to-orange-600/20 border-amber-500/50 text-amber-300',
          desc: 'অন-দ্য-স্পট গ্রাহকের গাড়ি ওয়্যারিং করে ডিভাইস রেজিস্টার করুন এবং ৳ ৫০০ ইনস্ট্যান্ট কমিশন পান।'
        };
      case 'support':
        return {
          icon: Headphones,
          title: '🎧 কাস্টমার সাপোর্ট হিসেবে ডিভাইস অনবোর্ড করছেন',
          color: 'from-sky-600/30 to-blue-600/20 border-sky-500/50 text-sky-300',
          desc: 'ইনকামিং কল বা অভিযোগের সময় নতুন ডিভাইসের লিড তৈরি করে ৳ ৫০০ কমিশন অর্জন করুন।'
        };
      case 'rescue':
        return {
          icon: Flame,
          title: '🚨 রেসকিউ টিম হিসেবে ডিভাইস অনবোর্ড করছেন',
          color: 'from-rose-600/30 to-red-600/20 border-rose-500/50 text-rose-300',
          desc: 'ফিল্ড অপারেশন চলাকালীন নতুন গ্রাহককে ট্র্যাকার সরবরাহ করে ৳ ৫০০ কমিশন পান।'
        };
      case 'customer':
        return {
          icon: User,
          title: '👥 ফ্রেন্ডস অ্যান্ড ফ্যামিলি রেফার ও অনবোর্ডিং',
          color: 'from-emerald-600/30 to-teal-600/20 border-emerald-500/50 text-emerald-300',
          desc: 'বন্ধুর গাড়িতে ট্র্যাকার ইনস্টল করিয়ে ৳ ৫০০ ক্যাশ কমিশন বা ফ্রি সাবস্ক্রিপশন অর্জন করুন।'
        };
      case 'partner':
        return {
          icon: Building2,
          title: '🏢 ফ্র্যাঞ্চাইজি শপ থেকে সরাসরি অনবোর্ডিং',
          color: 'from-purple-600/30 to-indigo-600/20 border-purple-500/50 text-purple-300',
          desc: 'আপনার ৪,০৯৬ স্লট কোটা থেকে গ্রাহকের অ্যাকাউন্টে নতুন ট্র্যাকার যুক্ত করুন।'
        };
      default:
        return {
          icon: Briefcase,
          title: '💼 অফিশিয়াল সেলস অনবোর্ডিং ও কমিশন ক্রেডিট',
          color: 'from-blue-600/30 to-indigo-600/20 border-blue-500/50 text-blue-300',
          desc: 'নতুন কাস্টমার অনবোর্ড করে অ্যাকাউন্টে ৳ ৫০০ সেলস কমিশন যোগ করুন।'
        };
    }
  };

  const banner = getRoleCommissionBanner();
  const BannerIcon = banner.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">
                {language === 'bn' ? 'নতুন ডিভাইস সেল ও অনবোর্ডিং' : 'Sell & Onboard Tracker'}
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                কমিশন রেট: ৳ ৫০০ / ডিভাইস
              </span>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Celebration Screen */}
        {isSuccess ? (
          <div className="py-6 text-center space-y-4 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-600/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-black text-white">
                🎉 অভিনন্দন! সেলস অনবোর্ডিং সফল!
              </h4>
              <p className="text-xs text-slate-300">
                গাড়ি: <b className="text-white">{vehicleName} ({plateNumber})</b>
              </p>
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-xs font-bold text-emerald-300 inline-block mt-2">
                💰 আপনার কমিশন ওয়ালেটে <span className="font-black text-white text-sm">৳ {earnedCommission}</span> ক্রেডিট যোগ হয়েছে!
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setCustomerName('');
                  setCustomerPhone('');
                  setPlateNumber('');
                  setImei('');
                  setSimNumber('');
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs transition"
              >
                আরেকটি সেল করুন
              </button>
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition"
              >
                সম্পন্ন
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmitSale} className="space-y-3.5 text-xs">
            
            {/* Role Incentive Banner */}
            <div className={`p-3 rounded-2xl bg-gradient-to-r border ${banner.color} space-y-1`}>
              <div className="flex items-center space-x-1.5 font-extrabold text-xs">
                <BannerIcon className="w-4 h-4 shrink-0" />
                <span>{banner.title}</span>
              </div>
              <p className="text-[10.5px] text-slate-300 opacity-90 leading-relaxed">
                {banner.desc}
              </p>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  কাস্টমারের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="যেমন: মোঃ সাকিব আহমেদ"
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-white font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  গাড়ির মডেল ও নাম *
                </label>
                <input
                  type="text"
                  required
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  placeholder="Yamaha FZ-S / Toyota Corolla"
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-white font-bold focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  গাড়ির নাম্বার প্লেট *
                </label>
                <input
                  type="text"
                  required
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="DHAKA METRO-LA 11-2233"
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-white font-mono font-bold uppercase focus:outline-none"
                />
              </div>
            </div>

            {/* Hardware IMEI & SIM */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[10.5px] font-bold text-slate-300 block">
                  জিপিএস ট্র্যাকার IMEI নম্বর (১৫ ডিজিট) *
                </label>
                <button
                  type="button"
                  onClick={handleGenerateRandomImei}
                  className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold"
                >
                  ⚡ ডেমো IMEI দিন
                </button>
              </div>
              <input
                type="text"
                required
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="864720058291034"
                className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-emerald-300 font-mono font-bold focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  ট্র্যাকারের সিম নম্বর
                </label>
                <input
                  type="tel"
                  value={simNumber}
                  onChange={(e) => setSimNumber(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-white font-mono focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  প্যাকেজ প্ল্যান
                </label>
                <select
                  value={packagePlan}
                  onChange={(e) => setPackagePlan(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-white font-bold focus:outline-none"
                >
                  <option value="লাইভ জিপিএস প্রিমিয়াম (৳ ৩৫০/মাস)">লাইভ প্রিমিয়াম (৳৩৫০/মাস)</option>
                  <option value="বাৎসরিক আনলিমিটেড (৳ ৩,৫০০/বছর)">বাৎসরিক আনলিমিটেড (৳৩,৫০০)</option>
                  <option value="ফ্লিট কর্পোরেট প্যাক (৳ ৩০০/মাস)">ফ্লিট প্যাক (৳৩০০/মাস)</option>
                </select>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>গ্রাহক থেকে ডিভাইস মূল্য:</span>
                <span className="font-bold text-white">৳ ৩,৫০০ (অনস্টল ফি সহ)</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800/80 pt-1">
                <span>আপনার তাৎক্ষণিক কমিশন:</span>
                <span className="text-sm font-mono font-black">৳ ৫০০</span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-2 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-emerald-200" />
                <span>{isSubmitting ? 'প্রসেসিং...' : 'ডিভাইস সেল ও অনবোর্ড করুন'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
