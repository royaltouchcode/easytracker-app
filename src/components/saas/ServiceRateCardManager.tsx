import React, { useState } from 'react';
import { 
  Wrench, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  X, 
  Percent, 
  DollarSign, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  Save, 
  Package, 
  Search, 
  Tag, 
  AlertTriangle,
  Receipt,
  Check,
  Smartphone,
  MapPin,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RateCardService, SparePartItem, PaidJobCard } from '../../types/traccar';

export const ServiceRateCardManager: React.FC = () => {
  const {
    rateCardServices,
    sparePartsCatalog,
    paidJobCards,
    platformCommissionPercent,
    setPlatformCommissionPercent,
    addRateCardService,
    updateRateCardService,
    deleteRateCardService,
    addSparePart,
    updateSparePart,
    deleteSparePart,
    completeJobCard,
    language
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'services' | 'parts' | 'job_cards'>('services');

  // Edit / Add Service Modal State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [serviceNameBn, setServiceNameBn] = useState('');
  const [serviceNameEn, setServiceNameEn] = useState('');
  const [serviceCategory, setServiceCategory] = useState<'labor' | 'repair' | 'diagnostic' | 'onsite'>('labor');
  const [serviceBasePrice, setServiceBasePrice] = useState<number>(300);
  const [serviceWarrantyDays, setServiceWarrantyDays] = useState<number>(30);
  const [serviceDescBn, setServiceDescBn] = useState('');

  // Edit / Add Spare Part Modal State
  const [isPartModalOpen, setIsPartModalOpen] = useState(false);
  const [editingPartId, setEditingPartId] = useState<string | null>(null);
  const [partNameBn, setPartNameBn] = useState('');
  const [partNameEn, setPartNameEn] = useState('');
  const [partCode, setPartCode] = useState('');
  const [partUnitPrice, setPartUnitPrice] = useState<number>(200);
  const [partWarrantyDays, setPartWarrantyDays] = useState<number>(90);
  const [partStockCount, setPartStockCount] = useState<number>(50);
  const [partDescBn, setPartDescBn] = useState('');

  // Commission Edit
  const [commissionInput, setCommissionInput] = useState<number>(platformCommissionPercent);
  const [commissionSaved, setCommissionSaved] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Save Commission Rate
  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    const val = Number(commissionInput);
    if (val >= 0 && val <= 100) {
      setPlatformCommissionPercent(val);
      localStorage.setItem('gps_platform_commission_percent', String(val));
      setCommissionSaved(true);
      setTimeout(() => setCommissionSaved(false), 2000);
    }
  };

  // Open Service Modal (Add or Edit)
  const handleOpenServiceModal = (srv?: RateCardService) => {
    if (srv) {
      setEditingServiceId(srv.id);
      setServiceNameBn(srv.nameBn);
      setServiceNameEn(srv.nameEn);
      setServiceCategory(srv.category);
      setServiceBasePrice(srv.basePrice);
      setServiceWarrantyDays(srv.warrantyDays);
      setServiceDescBn(srv.descriptionBn);
    } else {
      setEditingServiceId(null);
      setServiceNameBn('');
      setServiceNameEn('');
      setServiceCategory('labor');
      setServiceBasePrice(300);
      setServiceWarrantyDays(30);
      setServiceDescBn('');
    }
    setIsServiceModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceNameBn.trim()) return;

    if (editingServiceId) {
      updateRateCardService(editingServiceId, {
        nameBn: serviceNameBn.trim(),
        nameEn: serviceNameEn.trim() || serviceNameBn.trim(),
        category: serviceCategory,
        basePrice: Number(serviceBasePrice),
        warrantyDays: Number(serviceWarrantyDays),
        descriptionBn: serviceDescBn.trim()
      });
    } else {
      addRateCardService({
        nameBn: serviceNameBn.trim(),
        nameEn: serviceNameEn.trim() || serviceNameBn.trim(),
        category: serviceCategory,
        basePrice: Number(serviceBasePrice),
        warrantyDays: Number(serviceWarrantyDays),
        descriptionBn: serviceDescBn.trim(),
        isActive: true
      });
    }
    setIsServiceModalOpen(false);
  };

  // Open Part Modal (Add or Edit)
  const handleOpenPartModal = (part?: SparePartItem) => {
    if (part) {
      setEditingPartId(part.id);
      setPartNameBn(part.nameBn);
      setPartNameEn(part.nameEn);
      setPartCode(part.partCode);
      setPartUnitPrice(part.unitPrice);
      setPartWarrantyDays(part.warrantyDays);
      setPartStockCount(part.stockCount);
      setPartDescBn(part.descriptionBn);
    } else {
      setEditingPartId(null);
      setPartNameBn('');
      setPartNameEn('');
      setPartCode(`PART-${Math.floor(100 + Math.random() * 900)}`);
      setPartUnitPrice(200);
      setPartWarrantyDays(90);
      setPartStockCount(50);
      setPartDescBn('');
    }
    setIsPartModalOpen(true);
  };

  const handleSavePart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partNameBn.trim()) return;

    if (editingPartId) {
      updateSparePart(editingPartId, {
        nameBn: partNameBn.trim(),
        nameEn: partNameEn.trim() || partNameBn.trim(),
        partCode: partCode.trim(),
        unitPrice: Number(partUnitPrice),
        warrantyDays: Number(partWarrantyDays),
        stockCount: Number(partStockCount),
        descriptionBn: partDescBn.trim()
      });
    } else {
      addSparePart({
        nameBn: partNameBn.trim(),
        nameEn: partNameEn.trim() || partNameBn.trim(),
        partCode: partCode.trim(),
        unitPrice: Number(partUnitPrice),
        warrantyDays: Number(partWarrantyDays),
        stockCount: Number(partStockCount),
        descriptionBn: partDescBn.trim(),
        isActive: true
      });
    }
    setIsPartModalOpen(false);
  };

  // Financial Stats
  const completedJobs = paidJobCards.filter(jc => jc.jobStatus === 'completed');
  const totalBilled = completedJobs.reduce((sum, jc) => sum + jc.totalAmount, 0);
  const totalCommission = completedJobs.reduce((sum, jc) => sum + jc.platformCommissionAmount, 0);
  const totalTechPayout = completedJobs.reduce((sum, jc) => sum + jc.technicianPayoutAmount, 0);

  const filteredServices = rateCardServices.filter(s => 
    s.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.nameEn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredParts = sparePartsCatalog.filter(p => 
    p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.partCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJobCards = paidJobCards.filter(jc => 
    jc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jc.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    jc.customerPhone.includes(searchQuery)
  );

  return (
    <div className="space-y-4">
      
      {/* Header & Overview Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <span>সার্ভিস রেট-কার্ড ও স্পেয়ার পার্টস প্রাইসিং কন্ট্রোল হাব</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                  অ্যাডমিন রেট কন্ট্রোল
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                সার্ভিস সেন্টারে অতিরিক্ত চার্জ বন্ধে ফিক্সড রেট ও পার্টস মূল্য নির্ধারণ এবং প্ল্যাটফর্ম কমিশন নিয়ন্ত্রণ
              </p>
            </div>
          </div>

          {/* Platform Commission Config Form */}
          <form onSubmit={handleSaveCommission} className="flex items-center space-x-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
            <Percent className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-bold">কোম্পানি কমিশন:</span>
            <input
              type="number"
              min="0"
              max="100"
              value={commissionInput}
              onChange={(e) => setCommissionInput(Number(e.target.value))}
              className="w-14 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-emerald-400 font-mono font-black text-center focus:outline-none focus:border-emerald-500"
            />
            <span className="text-xs font-bold text-slate-400">%</span>
            <button
              type="submit"
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10.5px] font-extrabold transition shadow-sm"
            >
              {commissionSaved ? 'সংরক্ষিত!' : 'সেভ'}
            </button>
          </form>
        </div>

        {/* 4 Financial KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-slate-400 block">মোট পেইড সার্ভিস সম্পন্ন</span>
            <span className="text-base font-black font-mono text-cyan-400">{completedJobs.length} টি</span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-slate-400 block">মোট বিল আদায়</span>
            <span className="text-base font-black font-mono text-emerald-400">৳ {totalBilled}</span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-slate-400 block">কোম্পানির প্ল্যাটফর্ম আয়</span>
            <span className="text-base font-black font-mono text-amber-400">৳ {totalCommission}</span>
          </div>
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-2.5">
            <span className="text-[10px] font-bold text-slate-400 block">টেকনিশিয়ান মোট পে-আউট</span>
            <span className="text-base font-black font-mono text-indigo-400">৳ {totalTechPayout}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Navigation */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'services'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>সার্ভিস রেট-কার্ড ({rateCardServices.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('parts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'parts'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>স্পেয়ার পার্টস ক্যাটালগ ({sparePartsCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('job_cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'job_cards'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>পেইড জব-কার্ড লেজার ({paidJobCards.length})</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {activeSubTab === 'services' && (
            <button
              onClick={() => handleOpenServiceModal()}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold flex items-center space-x-1 transition shrink-0 shadow-md shadow-amber-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন সার্ভিস যোগ</span>
            </button>
          )}

          {activeSubTab === 'parts' && (
            <button
              onClick={() => handleOpenPartModal()}
              className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-extrabold flex items-center space-x-1 transition shrink-0 shadow-md shadow-cyan-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন স্পেয়ার পার্ট যোগ</span>
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: SERVICE RATE-CARD GRID                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'services' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredServices.map(srv => (
            <div 
              key={srv.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 space-y-2.5 transition shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                    srv.category === 'labor' 
                      ? 'bg-blue-950 text-blue-300 border-blue-800' 
                      : srv.category === 'repair'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : srv.category === 'onsite'
                          ? 'bg-purple-950 text-purple-300 border-purple-800'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                  }`}>
                    {srv.category === 'labor' ? 'ইনস্টলেশন ও লেবার' : srv.category === 'repair' ? 'রিপেয়ারিং' : srv.category === 'onsite' ? 'হোম সার্ভিস' : 'ডায়াগনস্টিক'}
                  </span>

                  <span className="font-mono font-black text-amber-400 text-sm bg-amber-950/80 px-2 py-0.5 rounded-lg border border-amber-800">
                    ৳ {srv.basePrice}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-slate-100 mt-2">
                  {srv.nameBn}
                </h4>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-2 mt-1">
                  {srv.descriptionBn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[10.5px] text-emerald-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{srv.warrantyDays > 0 ? `${srv.warrantyDays} দিন ফ্রি গ্যারান্টি` : 'গ্যারান্টি প্রযোজ্য নয়'}</span>
                </span>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenServiceModal(srv)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="এডিট করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি "${srv.nameBn}" মুছে ফেলতে চান?`)) {
                        deleteRateCardService(srv.id);
                      }
                    }}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SPARE PARTS CATALOG GRID                                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'parts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredParts.map(part => (
            <div 
              key={part.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 space-y-2.5 transition shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] font-black text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    {part.partCode}
                  </span>

                  <span className="font-mono font-black text-emerald-400 text-sm bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-800">
                    ৳ {part.unitPrice}
                  </span>
                </div>

                <h4 className="font-extrabold text-xs text-slate-100 mt-2">
                  {part.nameBn}
                </h4>
                <p className="text-[10px] text-slate-400 font-sans line-clamp-2 mt-1">
                  {part.descriptionBn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    স্টক: <b className="text-slate-200">{part.stockCount} টি</b>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-bold block">
                    🛡️ {part.warrantyDays} দিন পার্টস ওয়ারেন্টি
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleOpenPartModal(part)}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="এডিট করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`আপনি কি "${part.nameBn}" মুছে ফেলতে চান?`)) {
                        deleteSparePart(part.id);
                      }
                    }}
                    className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950 text-rose-400 transition"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PAID JOB-CARDS LEDGER                                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'job_cards' && (
        <div className="space-y-3">
          {filteredJobCards.map(jc => {
            const isCompleted = jc.jobStatus === 'completed';
            const isBillSent = jc.jobStatus === 'bill_sent';

            return (
              <div 
                key={jc.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 space-y-3 transition shadow-xl"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-black text-amber-400 bg-amber-950 px-2.5 py-0.5 rounded-lg border border-amber-800 text-xs">
                      {jc.id}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-100">
                        {jc.customerName} ({jc.customerPhone})
                      </h4>
                      <p className="text-[10.5px] text-slate-400 font-mono">
                        {jc.vehicleName} {jc.plateNumber ? `• ${jc.plateNumber}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isCompleted 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                        : isBillSent
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-blue-950 text-blue-300 border-blue-700'
                    }`}>
                      {isCompleted ? '✅ কাজ ও পেমেন্ট সম্পন্ন' : isBillSent ? '📲 বিল প্রেরিত (কনফার্মেশনের অপেক্ষায়)' : '🔧 সার্ভিস চলছে'}
                    </span>

                    <span className="font-mono font-black text-emerald-400 text-sm bg-slate-950 px-3 py-0.5 rounded-lg border border-slate-800">
                      মোট: ৳ {jc.totalAmount}
                    </span>
                  </div>
                </div>

                {/* Itemized Services & Parts List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">সার্ভিস ও লেবার:</span>
                    {jc.selectedServices.map((s, i) => (
                      <div key={i} className="flex justify-between text-[11px] text-slate-200">
                        <span className="truncate">{s.nameBn}</span>
                        <span className="font-mono font-bold text-amber-400">৳{s.price}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 block">ব্যবহৃত স্পেয়ার পার্টস:</span>
                    {jc.selectedSpareParts.length === 0 ? (
                      <span className="text-[10.5px] text-slate-500">কোনো পার্টস লাগেনি</span>
                    ) : (
                      jc.selectedSpareParts.map((p, i) => (
                        <div key={i} className="flex justify-between text-[11px] text-slate-200">
                          <span className="truncate">{p.nameBn} (x{p.quantity})</span>
                          <span className="font-mono font-bold text-cyan-400">৳{p.unitPrice * p.quantity}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400 gap-2">
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span>সার্ভিস পয়েন্ট: <b className="text-slate-200">{jc.serviceCenterName}</b></span>
                    <span>টেকনিশিয়ান: <b className="text-slate-200">{jc.technicianName || 'আব্দুল করিম'}</b></span>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] font-mono">
                    <span className="text-amber-400">কোম্পানি কমিশন ({jc.platformCommissionPercent}%): <b>৳{jc.platformCommissionAmount}</b></span>
                    <span className="text-indigo-300">টেক পে-আউট: <b>৳{jc.technicianPayoutAmount}</b></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SERVICE ADD/EDIT MODAL                                                    */}
      {/* ========================================================================= */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>{editingServiceId ? 'সার্ভিস রেট এডিট করুন' : 'নতুন সার্ভিস রেট যোগ করুন'}</span>
              </h3>
              <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">সার্ভিসের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ডিভাইস স্থানান্তর ও রি-ইনস্টলেশন"
                  value={serviceNameBn}
                  onChange={(e) => setServiceNameBn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ক্যাটাগরি *</label>
                  <select
                    value={serviceCategory}
                    onChange={(e: any) => setServiceCategory(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-100 font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="labor">ইনস্টলেশন ও লেবার</option>
                    <option value="repair">রিপেয়ারিং ও সার্কিট</option>
                    <option value="diagnostic">ডায়াগনস্টিক ও সিম</option>
                    <option value="onsite">হোম সার্ভিস ভিজিট</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ফিক্সড রেট (টাকায়) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={serviceBasePrice}
                    onChange={(e) => setServiceBasePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-amber-400 font-mono font-black focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ফ্রি সার্ভিস গ্যারান্টি (দিন)</label>
                <input
                  type="number"
                  min="0"
                  value={serviceWarrantyDays}
                  onChange={(e) => setServiceWarrantyDays(Number(e.target.value))}
                  placeholder="যেমন: ৩০ দিন"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">সার্ভিসের সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={serviceDescBn}
                  onChange={(e) => setServiceDescBn(e.target.value)}
                  placeholder="কাস্টমার ও টেকনিশিয়ানকে কী কী কাজের অন্তর্ভুক্ত তা জানান..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-600/30 transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SPARE PART ADD/EDIT MODAL                                                 */}
      {/* ========================================================================= */}
      {isPartModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <Package className="w-4 h-4 text-cyan-400" />
                <span>{editingPartId ? 'স্পেয়ার পার্ট এডিট করুন' : 'নতুন স্পেয়ার পার্ট যোগ করুন'}</span>
              </h3>
              <button onClick={() => setIsPartModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePart} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">পার্টসের নাম (বাংলায়) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: 12V 40A হেভি ডিউটি রিলে"
                  value={partNameBn}
                  onChange={(e) => setPartNameBn(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">পার্ট কোড / SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="RELAY-40A"
                    value={partCode}
                    onChange={(e) => setPartCode(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-cyan-300 font-mono font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">একক মূল্য (টাকায়) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={partUnitPrice}
                    onChange={(e) => setPartUnitPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-emerald-400 font-mono font-black focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">স্টক পরিমাণ (Qty)</label>
                  <input
                    type="number"
                    min="0"
                    value={partStockCount}
                    onChange={(e) => setPartStockCount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-slate-100 font-mono font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ওয়ারেন্টি কাভারেজ (দিন)</label>
                  <input
                    type="number"
                    min="0"
                    value={partWarrantyDays}
                    onChange={(e) => setPartWarrantyDays(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-cyan-400 font-mono font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">বিবরণ ও স্পেসিফিকেশন</label>
                <textarea
                  rows={2}
                  value={partDescBn}
                  onChange={(e) => setPartDescBn(e.target.value)}
                  placeholder="যেমন: ফায়ারপ্রুফ ওয়্যারিং হারনেস সহ..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-cyan-600/30 transition active:scale-95"
              >
                <Save className="w-4 h-4" />
                <span>সংরক্ষণ করুন</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
