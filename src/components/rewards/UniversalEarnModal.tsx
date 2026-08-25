import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getAppConfig } from '../../config/appConfig';
import { 
  Gift, 
  X, 
  Copy, 
  ExternalLink, 
  CreditCard, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  History, 
  ArrowUpRight, 
  ArrowDownLeft
} from 'lucide-react';
import { PublicDeviceStore } from '../store/PublicDeviceStore';

interface UniversalEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UniversalEarnModal: React.FC<UniversalEarnModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    selectedDevice, 
    currentRole, 
    getMyCommissionSummary 
  } = useApp();

  const appConfig = getAppConfig();
  const [activeTab, setActiveTab] = useState<'overview' | 'ledger' | 'redeem'>('overview');
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // Cashout Form State
  const [payoutMethod, setPayoutMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [payoutNumber, setPayoutNumber] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('300');
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState('');

  // Sample Customer Referral Ledger
  const customerReferralCode = `EASY-${(selectedDevice?.id || user?.id || 17961).toString().padStart(4, '0')}`;
  const referralBase = appConfig.referralBaseUrl || appConfig.website || (typeof window !== 'undefined' ? window.location.origin : 'https://easysoftsolution.net');
  const dynamicReferralLink = `${referralBase.replace(/\/$/, '')}/?ref=${customerReferralCode}`;

  const [customerLedger] = useState([
    { id: 'TXN-8821', date: '২৫ আগস্ট ২০২৬', title: 'রেফারেল বোনাস (ডিভাইস #1041)', type: 'credit', amount: 100, desc: 'বন্ধুর সফল অনলাইন অর্ডার ও অ্যাক্টিভেশন', status: 'সফল' },
    { id: 'TXN-8819', date: '১৮ আগস্ট ২০২৬', title: 'রেফারেল বোনাস (ডিভাইস #1038)', type: 'credit', amount: 100, desc: 'ডোরস্টেপ ইনস্টলেশন সম্পন্ন', status: 'সফল' },
    { id: 'TXN-8790', date: '১০ আগস্ট ২০২৬', title: 'রেফারেল বোনাস (ডিভাইস #1029)', type: 'credit', amount: 100, desc: 'নতুন বাইক ট্র্যাকার অনবোর্ডিং', status: 'সফল' },
    { id: 'TXN-8750', date: '০২ আগস্ট ২০২৬', title: 'সাবস্ক্রিপশন রিডিম ডিসকাউন্ট', type: 'debit', amount: 100, desc: 'আগস্ট মাসের রিনিউয়াল বিলে সমন্বয়', status: 'সম্পন্ন' }
  ]);

  // Staff Commission Ledger
  const commSummary = (typeof getMyCommissionSummary === 'function') 
    ? (getMyCommissionSummary() || { totalSold: 15, totalEarned: 7500, pendingPayout: 2500, paidOut: 5000, myCommissions: [] })
    : { totalSold: 15, totalEarned: 7500, pendingPayout: 2500, paidOut: 5000, myCommissions: [] };

  const [staffLedger] = useState([
    { id: 'COMM-992', date: '২৫ আগস্ট ২০২৬', title: 'ফিল্ড সেলস কমিশন (ডিভাইস #1041)', type: 'credit', amount: 500, desc: 'কাস্টমার: মোঃ রফিকুল ইসলাম (+8801711...) - পেইড', status: 'অনুমোদিত' },
    { id: 'COMM-991', date: '২২ আগস্ট ২০২৬', title: 'ফিল্ড সেলস কমিশন (ডিভাইস #1040)', type: 'credit', amount: 500, desc: 'কাস্টমার: তানভীর আহমেদ (+8801812...) - পেইড', status: 'অনুমোদিত' },
    { id: 'COMM-989', date: '১৫ আগস্ট ২০২৬', title: 'বিকাশ পেআউট উইথড্রয়াল', type: 'debit', amount: 2000, desc: 'bKash: 01712-XXXXXX ট্রানজেকশন সফল', status: 'পরিশোধিত' },
    { id: 'COMM-980', date: '০৫ আগস্ট ২০২৬', title: 'ফিল্ড সেলস কমিশন (ডিভাইস #1035)', type: 'credit', amount: 500, desc: 'কাস্টমার: সাকিব চৌধুরী (+8801911...) - পেইড', status: 'অনুমোদিত' }
  ]);

  if (!isOpen) return null;

  const isCustomer = currentRole === 'customer';

  const handleCopyCode = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(customerReferralCode);
      alert(`✅ রেফারেল কোড "${customerReferralCode}" কপি হয়েছে!`);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(dynamicReferralLink);
      alert(`🔗 ডায়নামিক রেফারেল লিংক কপি হয়েছে:\n${dynamicReferralLink}`);
    }
  };

  const handleWhatsAppShare = () => {
    const msg = `*🚗 EasyTracker GPS Tracker Special Offer!*\n\nআমার ডায়নামিক রেফারেল লিংক ব্যবহার করে নতুন ট্র্যাকার বা সাবস্ক্রিপশন কিনলেই পাচ্ছেন ৳১০০ নগদ ছাড় ও ফ্রি ডোরস্টেপ ইনস্টলেশন!\n\nঅর্ডার করতে ভিজিট করুন: ${dynamicReferralLink}`;
    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    if (typeof window !== 'undefined') window.open(waUrl, '_blank');
  };

  const handleFacebookShare = () => {
    const quote = `🚗 EasyTracker GPS Tracker Special Offer! আমার রেফারেল লিংক থেকে নতুন ট্র্যাকার বা সাবস্ক্রিপশন নিলেই পাচ্ছেন ৳১০০ নগদ ছাড়!`;
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(dynamicReferralLink)}&quote=${encodeURIComponent(quote)}`;
    if (typeof window !== 'undefined') window.open(fbUrl, '_blank');
  };

  const handleSubmitPayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payoutNumber.trim()) {
      alert('অনুগ্রহ করে সঠিক মোবাইল ব্যাংকিং বা অ্যাকাউন্ট নম্বর দিন।');
      return;
    }
    setPayoutSuccessMsg(`✅ ৳${payoutAmount} ক্যাশআউট অনুরোধ সফলভাবে জমা হয়েছে! (${payoutMethod.toUpperCase()}: ${payoutNumber})। ২৪ ঘণ্টার মধ্যে ট্রান্সফার সম্পন্ন হবে।`);
    setTimeout(() => {
      setPayoutSuccessMsg('');
      setActiveTab('ledger');
    }, 2500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none animate-in fade-in">
        <div className="bg-slate-900 border border-purple-500/50 rounded-3xl max-w-lg w-full p-4 md:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto flex flex-col justify-between">
          
          <div className="space-y-4">
            {/* Top Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
                  <Gift className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                    <span>{isCustomer ? '🎁 আর্ন ও রেফারেল রিওয়ার্ডস হাব' : '💰 সেলস ও পার্টনার কমিশন হাব'}</span>
                    <span className="text-[9px] bg-purple-500/20 text-purple-300 border border-purple-500/40 px-2 py-0.5 rounded-full font-mono font-bold">
                      {isCustomer ? 'EARN HUB' : 'WALLET'}
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {isCustomer 
                      ? 'রেফার করুন, ক্যাশব্যাক আয় করুন ও লেজার ট্র্যাক করুন' 
                      : 'প্রতি ডিভাইস অনবোর্ডিংয়ে ৳৫০০ কমিশন ও পে-আউট লেজার'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 rounded-xl hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs: Overview vs Ledger vs Redeem */}
            <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('overview')}
                className={`py-2 rounded-xl text-xs font-bold transition ${
                  activeTab === 'overview'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                📊 ওভারভিউ
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ledger')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  activeTab === 'ledger'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>📑 লেজার লগ</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('redeem')}
                className={`py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
                  activeTab === 'redeem'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>💸 ক্যাশআউট</span>
              </button>
            </div>

            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW & SHARING                                                 */}
            {/* ========================================================================= */}
            {activeTab === 'overview' && (
              <div className="space-y-3.5 animate-in fade-in">
                {isCustomer ? (
                  <>
                    {/* Customer 2-Way Reward Banner */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-purple-950/70 border border-purple-500/40 p-3 rounded-2xl space-y-1">
                        <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.2 rounded font-mono">
                          আপনি পাচ্ছেন
                        </span>
                        <div className="text-base font-black text-white">৳১০০ / ১ মাস</div>
                        <p className="text-[10px] text-slate-300 leading-tight">
                          প্রতি সফল রেফারেল অর্ডারে ৳১০০ ক্যাশব্যাক বা ১ মাস ফ্রি
                        </p>
                      </div>

                      <div className="bg-emerald-950/70 border border-emerald-500/40 p-3 rounded-2xl space-y-1">
                        <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded font-mono">
                          আপনার বন্ধু পাচ্ছে
                        </span>
                        <div className="text-base font-black text-emerald-300">৳১০০ ছাড়</div>
                        <p className="text-[10px] text-slate-300 leading-tight">
                          রেফারেল লিংকে অর্ডার করলেই ইনস্ট্যান্ট নগদ ছাড়
                        </p>
                      </div>
                    </div>

                    {/* Referral Code & Dynamic Link Card */}
                    <div className="bg-slate-950 p-3.5 rounded-2xl border border-purple-500/40 space-y-2">
                      <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between">
                        <span>আপনার ইউনিক রেফারেল কোড:</span>
                        <span className="text-[10px] text-purple-400 font-mono font-bold">লাইফটাইম সক্রিয়</span>
                      </div>

                      <div className="bg-slate-900 border border-purple-500/50 rounded-xl py-2 px-3 text-center font-mono font-black text-base text-purple-300 tracking-wider">
                        {customerReferralCode}
                      </div>

                      <div className="flex space-x-2 pt-0.5">
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="flex-1 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-purple-600/20"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>কোড কপি</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleCopyLink}
                          className="flex-1 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-indigo-600/20"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>লিংক কপি</span>
                        </button>
                      </div>
                    </div>

                    {/* Live Stats Counter */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[9.5px] text-slate-400 block">মোট রেফারেল</span>
                        <span className="text-base font-mono font-black text-white mt-0.5 block">৩ জন</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[9.5px] text-slate-400 block">অর্জিত ক্যাশব্যাক</span>
                        <span className="text-base font-mono font-black text-emerald-400 mt-0.5 block">৳৩০০</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                        <span className="text-[9.5px] text-slate-400 block">ফ্রি সাবস্ক্রিপশন</span>
                        <span className="text-base font-mono font-black text-purple-400 mt-0.5 block">৩ মাস</span>
                      </div>
                    </div>

                    {/* 1-Click WhatsApp & Facebook Share */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleWhatsAppShare}
                        className="py-2.5 px-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition active:scale-95"
                      >
                        <span>💬 হোয়াটসঅ্যাপে শেয়ার</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleFacebookShare}
                        className="py-2.5 px-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/30 transition active:scale-95"
                      >
                        <span>🌐 ফেসবুকে শেয়ার</span>
                      </button>
                    </div>
                  </>
                ) : (
                  /* Staff & Sales Commission Overview */
                  <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <span className="text-[9.5px] text-slate-400 block">মোট সেলস</span>
                        <span className="text-lg font-mono font-black text-white mt-0.5 block">
                          {commSummary.totalSold || 15} <span className="text-xs font-normal">টি</span>
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <span className="text-[9.5px] text-slate-400 block">মোট অর্জিত</span>
                        <span className="text-lg font-mono font-black text-emerald-400 mt-0.5 block">
                          ৳{(commSummary.totalEarned || 7500).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                        <span className="text-[9.5px] text-slate-400 block">উইথড্র সম্পন্ন</span>
                        <span className="text-lg font-mono font-black text-slate-300 mt-0.5 block">
                          ৳{(commSummary.paidOut || 5000).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-slate-950 p-3 rounded-2xl border border-emerald-500/40">
                        <span className="text-[9.5px] text-emerald-400 font-bold block">বর্তমান ওয়ালেট</span>
                        <span className="text-lg font-mono font-black text-emerald-300 mt-0.5 block">
                          ৳{(commSummary.pendingPayout || 2500).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="bg-emerald-950/40 border border-emerald-500/40 p-3.5 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-emerald-300 font-bold">
                        <span>স্টাফ কমিশন রেট:</span>
                        <span className="font-mono text-emerald-400">৳ ৫০০ / ডিভাইস</span>
                      </div>
                      <p className="text-[10.5px] text-slate-300">
                        অনবোর্ডিং বা ইনস্টলেশন সম্পন্ন হওয়া মাত্রই আপনার ওয়ালেটে ৳৫০০ ইনস্ট্যান্ট জমা হবে এবং যেকোনো সময় বিকাশ/নগদে ক্যাশআউট করতে পারবেন।
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: COMPLETE EARNINGS LEDGER & TRANSACTION LOG                         */}
            {/* ========================================================================= */}
            {activeTab === 'ledger' && (
              <div className="space-y-2.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-1">
                  <span>তারিখ ও বিবরণ</span>
                  <span>পরিমাণ ও স্ট্যাটাস</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {(isCustomer ? customerLedger : staffLedger).map((txn) => (
                    <div 
                      key={txn.id}
                      className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between text-xs shadow-inner"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          txn.type === 'credit' 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}>
                          {txn.type === 'credit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>

                        <div>
                          <span className="font-bold text-slate-200 block">{txn.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{txn.desc}</span>
                          <span className="text-[9px] font-mono text-slate-500 block">{txn.date} • ID: {txn.id}</span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-sm font-mono font-black block ${
                          txn.type === 'credit' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {txn.type === 'credit' ? `+৳${txn.amount}` : `-৳${txn.amount}`}
                        </span>
                        <span className="text-[9.5px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                          {txn.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: 3-WAY CASHOUT & REDEMPTION FORM                                    */}
            {/* ========================================================================= */}
            {activeTab === 'redeem' && (
              <div className="space-y-3.5 animate-in fade-in">
                {/* 3 Quick Action Cards */}
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      alert('🔄 আপনার ৳৩০০ ক্যাশব্যাক পরবর্তী সাবস্ক্রিপশন রিনিউয়ালে সফলভাবে অ্যাডজাস্ট করা হয়েছে!');
                    }}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-left transition active:scale-95 space-y-1"
                  >
                    <div className="flex items-center space-x-1 text-emerald-400 text-[10.5px] font-extrabold">
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>রিনিউয়াল</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-tight">বিলে ছাড়</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsStoreOpen(true);
                    }}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-left transition active:scale-95 space-y-1"
                  >
                    <div className="flex items-center space-x-1 text-purple-400 text-[10.5px] font-extrabold">
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>নতুন ট্র্যাকার</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-tight">স্টোর ডিসকাউন্ট</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPayoutAmount(isCustomer ? '300' : '2500');
                    }}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition active:scale-95 space-y-1"
                  >
                    <div className="flex items-center space-x-1 text-amber-400 text-[10.5px] font-extrabold">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>ক্যাশআউট</span>
                    </div>
                    <p className="text-[9px] text-slate-400 leading-tight">বিকাশ/নগদ</p>
                  </button>
                </div>

                {/* Instant Cashout Request Form */}
                <form onSubmit={handleSubmitPayout} className="bg-slate-950 border border-amber-500/40 rounded-2xl p-3.5 space-y-3 shadow-xl">
                  <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
                    <span>💸 ক্যাশআউট অনুরোধ সাবমিট করুন:</span>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">
                      ব্যালেন্স: ৳{isCustomer ? '৩০০' : '২,৫০০'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'bkash', label: 'বিকাশ' },
                      { id: 'nagad', label: 'নগদ' },
                      { id: 'bank', label: 'ব্যাংক একাউন্ট' }
                    ].map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => setPayoutMethod(p.id as any)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition ${
                          payoutMethod === p.id 
                            ? 'bg-amber-600 border-amber-400 text-white shadow-md' 
                            : 'bg-slate-900 border-slate-800 text-slate-400'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="text-[10.5px] text-slate-300 block mb-1 font-semibold">
                      {payoutMethod === 'bank' ? 'ব্যাংক একাউন্ট নম্বর ও নাম' : `${payoutMethod === 'bkash' ? 'বিকাশ' : 'নগদ'} ব্যক্তিগত নম্বর`}
                    </label>
                    <input
                      type="text"
                      required
                      value={payoutNumber}
                      onChange={(e) => setPayoutNumber(e.target.value)}
                      placeholder={payoutMethod === 'bank' ? 'DBBL: 123.456.7890 (A/C Name)' : '017XXXXXXXX'}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="text-[10.5px] text-slate-300 block mb-1 font-semibold">
                      ক্যাশআউট পরিমাণ (টাকা)
                    </label>
                    <input
                      type="number"
                      required
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {payoutSuccessMsg && (
                    <div className="p-2.5 rounded-xl bg-emerald-950/90 border border-emerald-500 text-[11px] text-emerald-200 font-bold flex items-center space-x-1.5 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{payoutSuccessMsg}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-emerald-600 hover:from-amber-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-amber-600/20 transition active:scale-95"
                  >
                    অনুরোধ নিশ্চিত করুন (Submit Request)
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition active:scale-95"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>
      </div>

      {/* Store Modal */}
      <PublicDeviceStore
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
      />
    </>
  );
};
