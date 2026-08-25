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
  Clock,
  Sliders,
  History,
  Send,
  Users,
  Gift,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RateCardService, SparePartItem, PaidJobCard } from '../../types/traccar';

export interface SparePartsLedgerTx {
  id: string;
  date: string;
  partId: string;
  partNameBn: string;
  type: 'stock_in' | 'issue_to_tech' | 'used_on_vehicle';
  quantity: number;
  unitPrice: number;
  recipientTech?: string;
  jobCardId?: string;
  performedBy: string;
  note?: string;
}

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

  const [activeSubTab, setActiveSubTab] = useState<'services' | 'parts' | 'parts_ledger' | 'job_cards' | 'fee_config'>('services');

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

  // Platform Commission & Fee Controls
  const [commissionInput, setCommissionInput] = useState<number>(platformCommissionPercent);
  const [referralBonus, setReferralBonus] = useState<number>(() => Number(localStorage.getItem('gps_referral_bonus_amount') || '200'));
  const [salesStaffCommission, setSalesStaffCommission] = useState<number>(() => Number(localStorage.getItem('gps_sales_staff_commission') || '500'));
  const [techInstallFee, setTechInstallFee] = useState<number>(() => Number(localStorage.getItem('gps_tech_install_fee') || '500'));
  const [dealerMarginPercent, setDealerMarginPercent] = useState<number>(() => Number(localStorage.getItem('gps_dealer_margin_percent') || '15'));
  const [cashlessDiscount, setCashlessDiscount] = useState<number>(() => Number(localStorage.getItem('gps_cashless_discount_amount') || '50'));
  const [feeSettingsSaved, setFeeSettingsSaved] = useState(false);

  // Spare Parts Issue & Ledger State
  const [partsLedgerLogs, setPartsLedgerLogs] = useState<SparePartsLedgerTx[]>(() => {
    const saved = localStorage.getItem('gps_spare_parts_ledger_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'STX-101',
        date: '25 Aug 2026, 11:30 AM',
        partId: 'part_relay_40a',
        partNameBn: '12V 40A হেভি ডিউটি রিলে',
        type: 'stock_in',
        quantity: 50,
        unitPrice: 200,
        performedBy: 'সেন্ট্রাল ওয়্যারহাউস অ্যাডমিন',
        note: 'নতুন OEM কনসাইনমেন্ট থেকে সেন্ট্রাল স্টকে ইনভেন্টরি যুক্ত'
      },
      {
        id: 'STX-102',
        date: '25 Aug 2026, 02:15 PM',
        partId: 'part_relay_40a',
        partNameBn: '12V 40A হেভি ডিউটি রিলে',
        type: 'issue_to_tech',
        quantity: 5,
        unitPrice: 200,
        recipientTech: 'আব্দুল করিম (গুলশান হাব)',
        performedBy: 'সুপার অ্যাডমিন',
        note: 'সার্ভিস ভ্যান টুলব্যাগে হ্যান্ডওভার প্রদান'
      },
      {
        id: 'STX-103',
        date: '25 Aug 2026, 04:45 PM',
        partId: 'part_relay_40a',
        partNameBn: '12V 40A হেভি ডিউটি রিলে',
        type: 'used_on_vehicle',
        quantity: 1,
        unitPrice: 200,
        jobCardId: 'JC-901',
        recipientTech: 'আব্দুল করিম',
        performedBy: 'পেইড জব-কার্ড অটো বিলিং',
        note: 'কাস্টমার Mohammad Azhar এর গাড়িতে ইনস্টলেশন'
      }
    ];
  });

  // Issue to Tech Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueTechName, setIssueTechName] = useState('আব্দুল করিম (গুলশান হাব)');
  const [issuePartId, setIssuePartId] = useState(sparePartsCatalog[0]?.id || '');
  const [issueQuantity, setIssueQuantity] = useState<number>(5);
  const [issueNote, setIssueNote] = useState('');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Save All Fee Settings
  const handleSaveAllFees = (e: React.FormEvent) => {
    e.preventDefault();
    setPlatformCommissionPercent(commissionInput);
    localStorage.setItem('gps_platform_commission_percent', String(commissionInput));
    localStorage.setItem('gps_referral_bonus_amount', String(referralBonus));
    localStorage.setItem('gps_sales_staff_commission', String(salesStaffCommission));
    localStorage.setItem('gps_tech_install_fee', String(techInstallFee));
    localStorage.setItem('gps_dealer_margin_percent', String(dealerMarginPercent));
    localStorage.setItem('gps_cashless_discount_amount', String(cashlessDiscount));
    setFeeSettingsSaved(true);
    setTimeout(() => setFeeSettingsSaved(false), 2500);
  };

  // Issue Parts to Technician Handler
  const handleIssuePartToTech = (e: React.FormEvent) => {
    e.preventDefault();
    const part = sparePartsCatalog.find(p => p.id === issuePartId);
    if (!part || issueQuantity <= 0) return;

    const newTx: SparePartsLedgerTx = {
      id: `STX-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      partId: part.id,
      partNameBn: part.nameBn,
      type: 'issue_to_tech',
      quantity: Number(issueQuantity),
      unitPrice: part.unitPrice,
      recipientTech: issueTechName,
      performedBy: 'সুপার অ্যাডমিন',
      note: issueNote.trim() || `ফিল্ড টেকনিশিয়ান ব্যাগে ${issueQuantity}টি পার্টস হস্তান্তর`
    };

    const updatedLogs = [newTx, ...partsLedgerLogs];
    setPartsLedgerLogs(updatedLogs);
    localStorage.setItem('gps_spare_parts_ledger_logs', JSON.stringify(updatedLogs));

    // Deduct from Central Warehouse Catalog count
    updateSparePart(part.id, {
      stockCount: Math.max(0, part.stockCount - Number(issueQuantity))
    });

    setIsIssueModalOpen(false);
    setIssueNote('');
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
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        <div className="flex flex-wrap bg-slate-900 p-1 rounded-2xl border border-slate-800 gap-1">
          <button
            onClick={() => setActiveSubTab('services')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'services'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>সার্ভিস রেট ({rateCardServices.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('parts')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'parts'
                ? 'bg-cyan-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>পার্টস ক্যাটালগ ({sparePartsCatalog.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('parts_ledger')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'parts_ledger'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>পার্টস স্টক ও ইস্যু লেজার ({partsLedgerLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('job_cards')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'job_cards'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            <span>পেইড জব-কার্ড ({paidJobCards.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('fee_config')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === 'fee_config'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>⚙️ ফি % ও কমিশন কন্ট্রোল</span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          {activeSubTab !== 'fee_config' && (
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="সার্চ করুন..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

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
              <span>নতুন পার্টস যোগ</span>
            </button>
          )}

          {activeSubTab === 'parts_ledger' && (
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center space-x-1 transition shrink-0 shadow-md shadow-blue-600/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>টেকনিশিয়ানকে পার্টস ইস্যু</span>
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
      {/* TAB 4: SPARE PARTS STOCK & ISSUE LEDGER                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'parts_ledger' && (
        <div className="space-y-4">
          {/* Inventory Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-slate-400">🏢 সেন্ট্রাল ওয়্যারহাউস মোট পার্টস</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-mono font-black text-cyan-400">
                  {sparePartsCatalog.reduce((sum, p) => sum + p.stockCount, 0)}
                </span>
                <span className="text-xs text-slate-400">টি আইটেম</span>
              </div>
              <span className="text-[10px] text-slate-400 block font-mono">
                মোট সেন্ট্রাল ভ্যালুয়েশন: ৳ {sparePartsCatalog.reduce((sum, p) => sum + (p.stockCount * p.unitPrice), 0).toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-slate-400">🔧 টেকনিশিয়ানদের ব্যাগে হ্যান্ডওভার স্টক</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-mono font-black text-amber-400">
                  {partsLedgerLogs.filter(l => l.type === 'issue_to_tech').reduce((sum, l) => sum + l.quantity, 0) -
                   partsLedgerLogs.filter(l => l.type === 'used_on_vehicle').reduce((sum, l) => sum + l.quantity, 0)}
                </span>
                <span className="text-xs text-slate-400">টি আইটেম</span>
              </div>
              <span className="text-[10px] text-amber-400/80 block">ফিল্ডে রানিং ভ্যান ও টেকনিশিয়ানদের জিম্মায়</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3.5 space-y-1">
              <span className="text-[11px] font-bold text-slate-400">🚗 সার্ভিসিংয়ে মোট পার্টস ব্যবহার</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-mono font-black text-emerald-400">
                  {partsLedgerLogs.filter(l => l.type === 'used_on_vehicle').reduce((sum, l) => sum + l.quantity, 0)}
                </span>
                <span className="text-xs text-slate-400">টি বিল্ড</span>
              </div>
              <span className="text-[10px] text-emerald-400/80 block">কাস্টমার জব কার্ডে সফলভাবে কনজ্যুমড</span>
            </div>
          </div>

          {/* Detailed Ledger Audit Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-blue-400" />
                <h4 className="font-extrabold text-xs text-slate-100">
                  স্পেয়ার পার্টস মুভমেন্ট ও হ্যান্ডওভার অডিট লগ (Stock Movement Ledger)
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">মোট {partsLedgerLogs.length} টি ট্রানজ্যাকশন</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              {partsLedgerLogs.map(log => {
                const isStockIn = log.type === 'stock_in';
                const isIssue = log.type === 'issue_to_tech';

                return (
                  <div key={log.id} className="p-3 hover:bg-slate-850/50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-start space-x-3">
                      <span className="font-mono text-[10px] font-black text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 shrink-0 mt-0.5">
                        {log.id}
                      </span>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-extrabold text-slate-100 text-xs">{log.partNameBn}</span>
                          <span className={`text-[9.5px] font-bold px-2 py-0.2 rounded-full border ${
                            isStockIn
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : isIssue
                                ? 'bg-amber-950 text-amber-300 border-amber-700'
                                : 'bg-purple-950 text-purple-300 border-purple-700'
                          }`}>
                            {isStockIn ? '📥 ওয়্যারহাউস স্টক ইন' : isIssue ? '📤 টেকনিশিয়ানকে হ্যান্ডওভার' : '🚗 গাড়িতে ফিটিং ও বিল'}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 mt-0.5">
                          {log.note} {log.recipientTech && <b className="text-amber-300">• প্রাপক: {log.recipientTech}</b>}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-4 pl-8 sm:pl-0">
                      <div className="text-right font-mono">
                        <span className={`text-xs font-black block ${isStockIn ? 'text-emerald-400' : isIssue ? 'text-amber-400' : 'text-purple-400'}`}>
                          {isStockIn ? `+${log.quantity}` : `-${log.quantity}`} টি
                        </span>
                        <span className="text-[9.5px] text-slate-500 block">৳ {log.unitPrice * log.quantity}</span>
                      </div>

                      <div className="text-right text-[10px] text-slate-400 shrink-0">
                        <span className="block text-slate-300">{log.performedBy}</span>
                        <span className="block font-mono text-[9px] text-slate-500">{log.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: COMMISSION & FEE % CONFIGURATION PANEL                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'fee_config' && (
        <div className="space-y-4">
          <form onSubmit={handleSaveAllFees} className="bg-slate-900 border border-purple-500/40 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-100">
                    সুপার অ্যাডমিন প্ল্যাটফর্ম ফি, কমিশন ও ইনসেন্টিভ কন্ট্রোল
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    এখানে নির্ধারিত হার অনুযায়ী গ্রাহক, সেলস স্টাফ, টেকনিশিয়ান ও পার্টনারদের কমিশন ও ক্যাশব্যাক স্বয়ংক্রিয়ভাবে হিসাব হবে।
                  </p>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-lg shadow-purple-600/30 transition active:scale-95 shrink-0"
              >
                <Save className="w-4 h-4" />
                <span>{feeSettingsSaved ? '✅ সকল রেট সফলভাবে সংরক্ষিত!' : 'সকল ফি ও কমিশন রেট সেভ করুন'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* 1. Platform Commission % */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Percent className="w-4 h-4 text-amber-400" />
                    <span>পেইড সার্ভিসে কোম্পানির প্ল্যাটফর্ম ফি (%)</span>
                  </label>
                  <span className="font-mono font-black text-amber-400 text-sm">{commissionInput}%</span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  টেকনিশিয়ানদের জব-কার্ডের মোট বিল থেকে কোম্পানি যে শতাংশ প্ল্যাটফর্ম চার্জ কাটবে।
                </p>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={commissionInput}
                  onChange={(e) => setCommissionInput(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* 2. Customer Referral Cashback Bonus */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Gift className="w-4 h-4 text-emerald-400" />
                    <span>কাস্টমার রেফারেল বোনাস (প্রতি সফল অর্ডারে)</span>
                  </label>
                  <span className="font-mono font-black text-emerald-400 text-sm">৳ {referralBonus}</span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  গ্রাহক অন্য কাউকে রেফার করলে তার ওয়ালেটে যে ক্যাশব্যাক বোনাস স্বয়ংক্রিয়ভাবে জমা হবে।
                </p>
                <input
                  type="number"
                  min="0"
                  value={referralBonus}
                  onChange={(e) => setReferralBonus(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* 3. Sales Staff Commission */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>সেলস ও কাস্টমার সাপোর্ট স্টাফ ডিভাইস সেল কমিশন</span>
                  </label>
                  <span className="font-mono font-black text-cyan-400 text-sm">৳ {salesStaffCommission}</span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  প্রতিটি ট্র্যাকার সরাসরি সেল করলে সেলস কর্মী বা সাপোর্টের অ্যাকাউন্টে নির্ধারিত ইনসেন্টিভ।
                </p>
                <input
                  type="number"
                  min="0"
                  value={salesStaffCommission}
                  onChange={(e) => setSalesStaffCommission(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-cyan-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              {/* 4. Technician New Installation Fee */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Wrench className="w-4 h-4 text-purple-400" />
                    <span>টেকনিশিয়ান নতুন ইনস্টলেশন ফিক্সড ফি</span>
                  </label>
                  <span className="font-mono font-black text-purple-400 text-sm">৳ {techInstallFee}</span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  মাঠে গিয়ে নতুন গ্রাহকের গাড়িতে সফলভাবে ট্র্যাকার ইনস্টলেশন ও হস্তান্তরের পর টেকনিশিয়ানের প্রাপ্য পারিশ্রমিক।
                </p>
                <input
                  type="number"
                  min="0"
                  value={techInstallFee}
                  onChange={(e) => setTechInstallFee(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-purple-400 font-mono font-bold focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* 5. B2B Dealer Margin Discount */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <DollarSign className="w-4 h-4 text-blue-400" />
                    <span>B2B ডিলার ও পার্টনার হোলসেল মার্জিন (%)</span>
                  </label>
                  <span className="font-mono font-black text-blue-400 text-sm">{dealerMarginPercent}%</span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  অনুমোদিত ডিলার বা শোরুম পার্টনারদের জন্য ডিভাইসের মূল্যের ওপর পাইকারি ছাড়।
                </p>
                <input
                  type="range"
                  min="5"
                  max="35"
                  value={dealerMarginPercent}
                  onChange={(e) => setDealerMarginPercent(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>

              {/* 6. Cashless Instant Discount */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center space-x-1.5">
                    <Smartphone className="w-4 h-4 text-pink-400" />
                    <span>অনলাইন বিকাশ / বাংলা QR ক্যাশলেস পে ছাড়</span>
                  </label>
                  <span className="font-mono font-black text-pink-400 text-sm">৳ {cashlessDiscount}</span>
                </div>
                <p className="text-[10.5px] text-slate-400">
                  ডিজিটাল পেমেন্ট উৎসাহিত করতে গ্রাহক যদি অনলাইনে বিকাশ/QR দিয়ে পে করে তবে বিল থেকে ছাড়।
                </p>
                <input
                  type="number"
                  min="0"
                  value={cashlessDiscount}
                  onChange={(e) => setCashlessDiscount(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-pink-400 font-mono font-bold focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ISSUE SPARE PARTS TO TECHNICIAN MODAL                                     */}
      {/* ========================================================================= */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-blue-500/50 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <Send className="w-4 h-4 text-blue-400" />
                <span>টেকনিশিয়ানকে সেন্ট্রাল পার্টস ইস্যু / হ্যান্ডওভার</span>
              </h3>
              <button onClick={() => setIsIssueModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleIssuePartToTech} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">প্রাপক টেকনিশিয়ান নির্বাচন করুন *</label>
                <select
                  value={issueTechName}
                  onChange={(e) => setIssueTechName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
                >
                  <option value="আব্দুল করিম (গুলশান হাব)">আব্দুল করিম (গুলশান সার্ভিস ভ্যান)</option>
                  <option value="সুজন মিয়া (মিরপুর হাব)">সুজন মিয়া (মিরপুর সার্ভিস হাব)</option>
                  <option value="তানভীর আহমেদ (উত্তরা হাব)">তানভীর আহমেদ (উত্তরা সার্ভিস হাব)</option>
                  <option value="বিল্লাল হোসেন (ধানমন্ডি হাব)">বিল্লাল হোসেন (ধানমন্ডি সার্ভিস পয়েন্ট)</option>
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">স্পেয়ার পার্টস নির্বাচন করুন *</label>
                <select
                  value={issuePartId}
                  onChange={(e) => setIssuePartId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
                >
                  {sparePartsCatalog.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.nameBn} ({p.partCode}) — সেন্ট্রাল স্টক: {p.stockCount} টি
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ইস্যুকৃত পরিমাণ (Quantity) *</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={issueQuantity}
                  onChange={(e) => setIssueQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-blue-400 font-mono font-black focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">নোট / হ্যান্ডওভার রেফারেন্স</label>
                <input
                  type="text"
                  placeholder="যেমন: সার্ভিস কিট ব্যাগে ৫টি রিলে ও ফিউজ হস্তান্তর"
                  value={issueNote}
                  onChange={(e) => setIssueNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/30 transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>হ্যান্ডওভার কনফার্ম ও লেজারে রেকর্ড করুন</span>
              </button>
            </form>
          </div>
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
