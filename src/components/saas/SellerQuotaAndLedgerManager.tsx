import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Unlock, 
  Plus, 
  Edit3, 
  DollarSign, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  X, 
  Search, 
  Sparkles, 
  Gift, 
  QrCode, 
  Banknote, 
  CreditCard,
  Layers,
  Save,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SellerImeiQuota, TechnicianLedgerConfig } from '../../types/traccar';

export const SellerQuotaAndLedgerManager: React.FC = () => {
  const {
    sellerImeiQuotas,
    updateSellerQuota,
    allocateImeiToSeller,
    unlockImeiPaywall,
    technicianLedgers,
    updateTechnicianLimits,
    settleWeeklyTechPayout,
    digitalPaymentOffers,
    updatePaymentOffer,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<'imei_paywall' | 'tech_ledger' | 'payment_offers'>('imei_paywall');

  // Assign IMEI Modal State
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState(sellerImeiQuotas[0]?.partnerId || '');
  const [newImei, setNewImei] = useState('');
  const [newModel, setNewModel] = useState('EasyTracker 4G Pro Bike Relay');
  const [newCostBdt, setNewCostBdt] = useState(3000);

  // Edit Quota Modal State
  const [isQuotaModalOpen, setIsQuotaModalOpen] = useState(false);
  const [editingPartnerId, setEditingPartnerId] = useState('');
  const [editingQuotaValue, setEditingQuotaValue] = useState<number>(3);

  // Edit Tech Limit Modal State
  const [isTechLimitModalOpen, setIsTechLimitModalOpen] = useState(false);
  const [editingTechId, setEditingTechId] = useState('');
  const [editingMaxNegative, setEditingMaxNegative] = useState<number>(1500);
  const [editingMaxDays, setEditingMaxDays] = useState<number>(7);

  // Unlock IMEI Modal State
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false);
  const [unlockPartnerId, setUnlockPartnerId] = useState('');
  const [unlockImeiNum, setUnlockImeiNum] = useState('');
  const [customerNameInput, setCustomerNameInput] = useState('');
  const [customerPhoneInput, setCustomerPhoneInput] = useState('');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Handlers
  const handleAssignImei = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImei.trim() || !selectedPartnerId) return;
    allocateImeiToSeller(selectedPartnerId, newImei.trim(), newModel, Number(newCostBdt));
    setNewImei('');
    setIsAssignModalOpen(false);
  };

  const handleSaveQuota = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPartnerId && editingQuotaValue >= 1) {
      updateSellerQuota(editingPartnerId, Number(editingQuotaValue));
      setIsQuotaModalOpen(false);
    }
  };

  const handleSaveTechLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTechId) {
      updateTechnicianLimits(editingTechId, Number(editingMaxNegative), Number(editingMaxDays));
      setIsTechLimitModalOpen(false);
    }
  };

  const handleUnlockImeiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unlockImeiNum || !unlockPartnerId) return;
    unlockImeiPaywall(
      unlockPartnerId,
      unlockImeiNum,
      customerNameInput.trim() || 'Valued Customer',
      customerPhoneInput.trim() || '01700-000000'
    );
    setIsUnlockModalOpen(false);
    setCustomerNameInput('');
    setCustomerPhoneInput('');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4 select-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-md">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
              <span>IMEI পে-ওয়াল ও টেকনিশিয়ান ফ্লোটিং লেজার কন্ট্রোল</span>
              <span className="text-[10px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                জিরো-বকেয়া মডেল
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              ডিলার অনুযায়ী বাকিতে ডিভাইস কোটা (৩-৫টি) নিয়ন্ত্রণ ও টেকনিশিয়ানদের নেগেটিভ ব্যালেন্স লিমিট ম্যানেজমেন্ট
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('imei_paywall')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'imei_paywall'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>ডিলার IMEI কোটা ({sellerImeiQuotas.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tech_ledger')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'tech_ledger'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>টেকনিশিয়ান ফ্লোটিং লেজার ({technicianLedgers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('payment_offers')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'payment_offers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>ক্যাশলেস অফার সেটিংস</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SELLER IMEI PAYWALL & CONSIGNMENT QUOTA                            */}
      {/* ========================================================================= */}
      {activeTab === 'imei_paywall' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
            <div className="text-xs text-slate-300 font-bold flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              <span>ডিলারের দোকানে থাকা ডিভাইসসমূহ (পেমেন্ট না হওয়া পর্যন্ত সার্ভারে Dormant Locked):</span>
            </div>

            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-extrabold flex items-center space-x-1 transition shadow-md shadow-purple-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ডিলারকে নতুন IMEI অ্যাসাইন করুন</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {sellerImeiQuotas.map(seller => {
              const pendingLockedCount = seller.allocatedImeis.filter(d => d.status === 'dormant_locked' || d.status === 'pending_payment').length;
              const isLocked = pendingLockedCount >= seller.maxDueDeviceQuota;

              return (
                <div 
                  key={seller.partnerId}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-slate-100">{seller.sellerName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({seller.phone})</span>
                      </div>
                      <span className="text-[10.5px] text-purple-300 font-semibold block">{seller.shopName}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <button
                        onClick={() => {
                          setEditingPartnerId(seller.partnerId);
                          setEditingQuotaValue(seller.maxDueDeviceQuota);
                          setIsQuotaModalOpen(true);
                        }}
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10.5px] font-bold border border-slate-700 flex items-center space-x-1 transition"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>কোটা: <b>{seller.maxDueDeviceQuota} টি</b></span>
                      </button>
                    </div>
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">বাকিতে আন-অ্যাক্টিভেটেড স্টক:</span>
                      <span className={isLocked ? 'text-rose-400 font-black' : 'text-emerald-400 font-black'}>
                        {pendingLockedCount} / {seller.maxDueDeviceQuota} টি {isLocked ? '(কোটা পূর্ণ 🔒)' : '(অনুমোদিত)'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full transition-all duration-300 ${isLocked ? 'bg-rose-500' : 'bg-purple-500'}`}
                        style={{ width: `${Math.min(100, (pendingLockedCount / seller.maxDueDeviceQuota) * 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Allocated IMEI List */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      দোকানে থাকা ট্র্যাকার তালিকা ({seller.allocatedImeis.length}):
                    </span>

                    <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
                      {seller.allocatedImeis.map((item, idx) => {
                        const isUnlocked = item.status === 'unlocked_paid';
                        return (
                          <div 
                            key={idx}
                            className={`p-2 rounded-xl border flex items-center justify-between text-xs transition ${
                              isUnlocked 
                                ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-200' 
                                : 'bg-slate-900 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="font-mono font-bold text-[11px]">{item.imei}</span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  isUnlocked ? 'bg-emerald-900 text-emerald-300' : 'bg-purple-950 text-purple-300 border border-purple-800'
                                }`}>
                                  {isUnlocked ? 'লাইভ পেইড' : 'Dormant Locked'}
                                </span>
                              </div>
                              <span className="text-[9.5px] text-slate-400 block">{item.model}</span>
                            </div>

                            {!isUnlocked && (
                              <button
                                onClick={() => {
                                  setUnlockPartnerId(seller.partnerId);
                                  setUnlockImeiNum(item.imei);
                                  setIsUnlockModalOpen(true);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] shadow-sm flex items-center space-x-1 transition active:scale-95 shrink-0"
                              >
                                <Unlock className="w-3 h-3" />
                                <span>আনলক করুন</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: TECHNICIAN NEGATIVE FLOATING LEDGER & LIMITS                        */}
      {/* ========================================================================= */}
      {activeTab === 'tech_ledger' && (
        <div className="space-y-3">
          <div className="bg-indigo-950/40 border border-indigo-500/30 rounded-2xl p-3 text-xs text-indigo-200 flex items-start space-x-2">
            <DollarSign className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <b>নেগেটিভ ফ্লোটিং লেজার নীতি:</b> টেকনিশিয়ান কাস্টমার থেকে ক্যাশ নিলে ব্যালেন্স সাময়িক নেগেটিভ হতে পারবে (সর্বোচ্চ লিমিট পর্যন্ত)। নতুন ইনস্টলেশন বা প্রতি শুক্রবার সাপ্তাহিক বিকাশ সেটেলমেন্টে এটি স্বয়ংক্রিয়ভাবে অ্যাডজাস্ট হবে।
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {technicianLedgers.map(tech => {
              const isPositive = tech.currentFloatingBalance >= 0;
              const isOverLimit = tech.isAccountLocked;

              return (
                <div 
                  key={tech.techId}
                  className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 shadow-lg"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-100">{tech.techName}</h4>
                      <span className="text-[10px] text-slate-400 font-mono">{tech.techPhone} • {tech.area}</span>
                    </div>

                    <button
                      onClick={() => {
                        setEditingTechId(tech.techId);
                        setEditingMaxNegative(tech.maxNegativeLimitBdt);
                        setEditingMaxDays(tech.maxDueDaysLimit);
                        setIsTechLimitModalOpen(true);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-300 text-[10.5px] font-bold border border-slate-700 flex items-center space-x-1 transition"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>লিমিট: ৳{tech.maxNegativeLimitBdt}</span>
                    </button>
                  </div>

                  {/* Floating Balance KPI Banner */}
                  <div className={`p-3 rounded-xl border flex items-center justify-between ${
                    isPositive 
                      ? 'bg-emerald-950/40 border-emerald-800/60' 
                      : isOverLimit
                        ? 'bg-rose-950/60 border-rose-600/70'
                        : 'bg-amber-950/40 border-amber-800/60'
                  }`}>
                    <div>
                      <span className="text-[10.5px] text-slate-400 font-bold block">বর্তমান ফ্লোটিং ব্যালেন্স:</span>
                      <span className={`text-base font-mono font-black ${
                        isPositive ? 'text-emerald-400' : isOverLimit ? 'text-rose-400' : 'text-amber-400'
                      }`}>
                        {isPositive ? `+৳ ${tech.currentFloatingBalance}` : `-৳ ${Math.abs(tech.currentFloatingBalance)}`}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                        isPositive 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                          : isOverLimit
                            ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                            : 'bg-amber-950 text-amber-300 border-amber-700'
                      }`}>
                        {isPositive ? 'কোম্পানি পাওনাদার' : isOverLimit ? '⚠️ লিমিট অতিক্রম (লক)' : `বকেয়া (${tech.daysInNegative} দিন)`}
                      </span>

                      <button
                        onClick={() => {
                          if (confirm(`আপনি কি "${tech.techName}" এর চলতি ব্যালেন্স (৳${tech.currentFloatingBalance}) সাপ্তাহিক বিকাশ দিয়ে সেটেল করতে চান?`)) {
                            settleWeeklyTechPayout(tech.techId);
                          }
                        }}
                        className="mt-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-extrabold flex items-center space-x-1 shadow-sm transition"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>সাপ্তাহিক সেটেলমেন্ট</span>
                      </button>
                    </div>
                  </div>

                  {/* Transaction History */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      সাম্প্রতিক কাজের লেজার হিস্ট্রি:
                    </span>
                    <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                      {tech.transactions.slice(0, 5).map(tx => (
                        <div key={tx.id} className="p-1.5 bg-slate-900 rounded-lg text-[10.5px] flex items-center justify-between border border-slate-850">
                          <span className="truncate max-w-[200px] text-slate-300">{tx.titleBn}</span>
                          <span className={`font-mono font-bold shrink-0 ml-1 ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.amount >= 0 ? `+৳${tx.amount}` : `-৳${Math.abs(tx.amount)}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: DIGITAL CASHLESS PAYMENT OFFERS (BanglaQR / bKash / Nagad)          */}
      {/* ========================================================================= */}
      {activeTab === 'payment_offers' && (
        <div className="space-y-3 text-xs">
          <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-3 text-emerald-200 flex items-start space-x-2">
            <Gift className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <b>ক্যাশলেস পেমেন্ট ইনসেন্টিভ:</b> কাস্টমাররা যাতে মেকানিককে ক্যাশ না দিয়ে সরাসরি বিকাশ, নগদ বা বাংলা কিউআর (BanglaQR) দিয়ে পে করে, তার জন্য অফার ও বোনাস কনফিগারেশন।
            </span>
          </div>

          {digitalPaymentOffers.map(offer => (
            <div key={offer.id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span className="font-extrabold text-xs text-slate-100">{offer.titleBn}</span>
                </div>

                <span className="bg-emerald-950 text-emerald-300 font-mono font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-700">
                  {offer.badgeBn}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block">ইনস্ট্যান্ট ক্যাশলেস ছাড় (টাকায়):</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={offer.discountAmountBdt}
                      onChange={(e) => updatePaymentOffer(offer.id, { discountAmountBdt: Number(e.target.value) })}
                      className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-emerald-400 font-mono font-black text-xs focus:outline-none"
                    />
                    <span className="text-slate-400">টাকা ডিসকাউন্ট</span>
                  </div>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold block">অতিরিক্ত সার্ভিস গ্যারান্টি বোনাস (দিন):</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={offer.bonusWarrantyDays}
                      onChange={(e) => updatePaymentOffer(offer.id, { bonusWarrantyDays: Number(e.target.value) })}
                      className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-cyan-400 font-mono font-black text-xs focus:outline-none"
                    />
                    <span className="text-slate-400">দিন অতিরিক্ত কাভারেজ</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>সাপোর্টেড গেটওয়ে: <b>bKash, Nagad, BanglaQR, Credit/Debit Card</b></span>
                <span className="text-emerald-400 font-bold">● অ্যাপে লাইভ সক্রিয়</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ASSIGN NEW IMEI TO DEALER                                        */}
      {/* ========================================================================= */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-purple-400" />
                <span>ডিলারের দোকানে নতুন IMEI স্টক যুক্ত করুন</span>
              </h3>
              <button onClick={() => setIsAssignModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAssignImei} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ডিলার নির্বাচন করুন *</label>
                <select
                  value={selectedPartnerId}
                  onChange={(e) => setSelectedPartnerId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-purple-500 focus:outline-none"
                >
                  {sellerImeiQuotas.map(s => (
                    <option key={s.partnerId} value={s.partnerId}>
                      {s.sellerName} ({s.shopName || s.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">১৫-ডিজিট ট্র্যাকার IMEI *</label>
                <input
                  type="text"
                  required
                  maxLength={15}
                  value={newImei}
                  onChange={(e) => setNewImei(e.target.value)}
                  placeholder="864720058291099"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-purple-300 font-mono font-bold focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ডিভাইস মডেল</label>
                <select
                  value={newModel}
                  onChange={(e) => setNewModel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-purple-500 focus:outline-none"
                >
                  <option value="EasyTracker 4G Pro Bike Relay">EasyTracker 4G Pro Bike Relay</option>
                  <option value="EasyTracker GT06 Heavy Duty">EasyTracker GT06 Heavy Duty</option>
                  <option value="EasyTracker OBD-II Plug & Play">EasyTracker OBD-II Plug & Play</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/30 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>স্টকে অ্যাসাইন করুন (Dormant Locked)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT DEALER DUE QUOTA                                            */}
      {/* ========================================================================= */}
      {isQuotaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>ডিলার কনসাইনমেন্ট কোটা নির্ধারণ</span>
              </h3>
              <button onClick={() => setIsQuotaModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuota} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সর্বোচ্চ বাকিতে অনুমোদনযোগ্য ডিভাইস সংখ্যা (Quota) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="20"
                  value={editingQuotaValue}
                  onChange={(e) => setEditingQuotaValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-black text-center text-sm focus:border-amber-500 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  দোকানে এই সংখ্যার বেশি আন-অ্যাক্টিভেটেড ডিভাইস থাকলে নতুন স্টক নেওয়া বন্ধ থাকবে।
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-600/30 transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>কোটা সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT TECHNICIAN LIMITS                                           */}
      {/* ========================================================================= */}
      {isTechLimitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                <span>টেকনিশিয়ান নেগেটিভ ব্যালেন্স লিমিট</span>
              </h3>
              <button onClick={() => setIsTechLimitModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTechLimit} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সর্বোচ্চ নেগেটিভ ব্যালেন্স লিমিট (টাকায়) *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editingMaxNegative}
                  onChange={(e) => setEditingMaxNegative(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-mono font-black text-center text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সর্বোচ্চ বকেয়া ধরে রাখার দিন (Day Limit) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="30"
                  value={editingMaxDays}
                  onChange={(e) => setEditingMaxDays(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-black text-center text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-indigo-600/30 transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>লিমিট সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: 1-CLICK UNLOCK IMEI PAYWALL                                      */}
      {/* ========================================================================= */}
      {isUnlockModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <Unlock className="w-4 h-4 text-emerald-400" />
                <span>IMEI পে-ওয়াল আনলক ও অ্যাক্টিভেশন</span>
              </h3>
              <button onClick={() => setIsUnlockModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUnlockImeiSubmit} className="space-y-3 text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[11px] space-y-1">
                <span className="text-slate-400 block">আনলকযোগ্য IMEI:</span>
                <span className="font-mono font-black text-emerald-400 text-sm block">{unlockImeiNum}</span>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কাস্টমারের নাম *</label>
                <input
                  type="text"
                  required
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  placeholder="যেমন: তানভীর হোসাইন"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কাস্টমারের ফোন নম্বর *</label>
                <input
                  type="tel"
                  required
                  value={customerPhoneInput}
                  onChange={(e) => setCustomerPhoneInput(e.target.value)}
                  placeholder="01712-345678"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>পেমেন্ট নিশ্চিত ও ডিভাইস লাইভ আনলক</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
