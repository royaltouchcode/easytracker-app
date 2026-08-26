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
  ArrowRight,
  RotateCcw,
  Scan,
  QrCode,
  Camera,
  ShieldAlert
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

export interface TechReturnItem {
  id: string;
  date: string;
  techName: string;
  itemType: 'spare_part' | 'gps_device';
  itemName: string;
  itemCodeOrImei: string;
  quantity: number;
  unitPrice: number;
  reportedCondition: 'good_unused' | 'defective_damaged';
  reason: string;
  status: 'pending_admin_scan' | 'received_restocked' | 'received_scrapped';
  adminDecisionNote?: string;
  receivedAt?: string;
}

export interface WastageLossLog {
  id: string;
  date: string;
  itemName: string;
  itemCodeOrImei: string;
  quantity: number;
  unitLossPrice: number;
  totalLoss: number;
  surrenderedByTech: string;
  inspectedByAdmin: string;
  reason: string;
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

  // Returns from Technicians State
  const [techReturns, setTechReturns] = useState<TechReturnItem[]>(() => {
    const saved = localStorage.getItem('gps_tech_return_shipments');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'RET-881',
        date: '25 Aug 2026, 03:30 PM',
        techName: 'আব্দুল করিম (গুলশান হাব)',
        itemType: 'spare_part',
        itemName: '12V 40A হেভি ডিউটি রিলে',
        itemCodeOrImei: 'RELAY-40A',
        quantity: 1,
        unitPrice: 200,
        reportedCondition: 'good_unused',
        reason: 'অব্যবহৃত অতিরিক্ত পার্টস সেন্ট্রাল স্টকে ফেরত',
        status: 'pending_admin_scan'
      }
    ];
  });

  // Wastage & Scrap Loss Ledger State
  const [wastageLogs, setWastageLogs] = useState<WastageLossLog[]>(() => {
    const saved = localStorage.getItem('gps_wastage_loss_ledger_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'WST-201',
        date: '24 Aug 2026, 05:10 PM',
        itemName: 'হাই-গেইন সিরামিক GPS অ্যান্টেনা (ফাটা ক্যাবল)',
        itemCodeOrImei: 'ANT-GPS-01',
        quantity: 1,
        unitLossPrice: 250,
        totalLoss: 250,
        surrenderedByTech: 'আব্দুল করিম (গুলশান হাব)',
        inspectedByAdmin: 'সুপার অ্যাডমিন',
        reason: 'কাস্টমার গাড়ির শর্ট-সার্কিটে ওয়্যারিং ক্যাবল ভস্মীভূত (স্ক্র্যাপ রাইট-অফ)'
      }
    ];
  });

  // Barcode & QC Inspection Modal
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [selectedReturnToScan, setSelectedReturnToScan] = useState<TechReturnItem | null>(null);
  const [scannedBarcode, setScannedBarcode] = useState('');
  const [qcCondition, setQcCondition] = useState<'good_restock' | 'damaged_wastage'>('good_restock');
  const [adminInspectionNote, setAdminInspectionNote] = useState('');

  // Issue to Tech Modal State
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issueTechName, setIssueTechName] = useState('আব্দুল করিম (গুলশান হাব)');
  const [issuePartId, setIssuePartId] = useState(sparePartsCatalog[0]?.id || '');
  const [issueQuantity, setIssueQuantity] = useState<number>(5);
  const [issueNote, setIssueNote] = useState('');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [commissionSaved, setCommissionSaved] = useState(false);
  const [ledgerFilterMode, setLedgerFilterMode] = useState<'movement' | 'returns_qc' | 'wastage_scrap'>('movement');

  // Save Quick Top Commission
  const handleSaveCommission = (e: React.FormEvent) => {
    e.preventDefault();
    setPlatformCommissionPercent(commissionInput);
    localStorage.setItem('gps_platform_commission_percent', String(commissionInput));
    setCommissionSaved(true);
    setTimeout(() => setCommissionSaved(false), 2000);
  };

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

  // Process Barcode Scan & Return Receive Handler
  const handleProcessScanReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReturnToScan) return;

    const returnItem = selectedReturnToScan;
    const nowStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (qcCondition === 'good_restock') {
      // 1. If spare part, restock into active inventory
      const matchingPart = sparePartsCatalog.find(p => p.partCode === returnItem.itemCodeOrImei || p.nameBn.includes(returnItem.itemName));
      if (matchingPart) {
        updateSparePart(matchingPart.id, {
          stockCount: matchingPart.stockCount + Number(returnItem.quantity)
        });
      }

      // 2. Add credit log to parts ledger
      const newLedgerTx: SparePartsLedgerTx = {
        id: `STX-${Math.floor(100 + Math.random() * 900)}`,
        date: nowStr,
        partId: matchingPart?.id || 'restock_item',
        partNameBn: returnItem.itemName,
        type: 'stock_in',
        quantity: Number(returnItem.quantity),
        unitPrice: returnItem.unitPrice,
        performedBy: 'সুপার অ্যাডমিন (বারকোড স্ক্যান রিসিভ)',
        note: `টেকনিশিয়ান (${returnItem.techName}) রিটার্ন পার্সেল [${returnItem.id}] QC ভেরিফাইড ভালো কন্ডিশনে সেন্ট্রাল স্টকে রিস্টক`
      };
      const updatedLedger = [newLedgerTx, ...partsLedgerLogs];
      setPartsLedgerLogs(updatedLedger);
      localStorage.setItem('gps_spare_parts_ledger_logs', JSON.stringify(updatedLedger));

      // 3. Mark return status as received_restocked
      const updatedReturns = techReturns.map(r => r.id === returnItem.id ? {
        ...r,
        status: 'received_restocked' as const,
        receivedAt: nowStr,
        adminDecisionNote: adminInspectionNote || 'QC পাস: ভালো কন্ডিশন, সেন্ট্রাল স্টকে সফলভাবে যোগ করা হয়েছে।'
      } : r);
      setTechReturns(updatedReturns);
      localStorage.setItem('gps_tech_return_shipments', JSON.stringify(updatedReturns));

      alert(`✅ বারকোড [${scannedBarcode || returnItem.itemCodeOrImei}] স্ক্যান সফল!\nপার্টসটি ভালো কন্ডিশনে সেন্ট্রাল ইনভেন্টরিতে যুক্ত (+${returnItem.quantity}) হয়েছে এবং টেকনিশিয়ানের লেজার থেকে মাইনাস হয়েছে।`);
    } else {
      // Defective / Damaged Wastage:
      // Does NOT add to active inventory! Relieves technician and adds to Wastage Ledger!
      const newWastageLog: WastageLossLog = {
        id: `WST-${Math.floor(100 + Math.random() * 900)}`,
        date: nowStr,
        itemName: returnItem.itemName,
        itemCodeOrImei: returnItem.itemCodeOrImei,
        quantity: Number(returnItem.quantity),
        unitLossPrice: returnItem.unitPrice,
        totalLoss: Number(returnItem.quantity) * returnItem.unitPrice,
        surrenderedByTech: returnItem.techName,
        inspectedByAdmin: 'সুপার অ্যাডমিন',
        reason: adminInspectionNote || 'ত্রুটিপূর্ণ ও ড্যামেজ হওয়ার কারণে স্ক্র্যাপ ও ওয়েস্টেজ হিসেবে গৃহীত (ইনভেন্টরিতে যুক্ত হয়নি)'
      };
      const updatedWastage = [newWastageLog, ...wastageLogs];
      setWastageLogs(updatedWastage);
      localStorage.setItem('gps_wastage_loss_ledger_logs', JSON.stringify(updatedWastage));

      // Mark return status as received_scrapped
      const updatedReturns = techReturns.map(r => r.id === returnItem.id ? {
        ...r,
        status: 'received_scrapped' as const,
        receivedAt: nowStr,
        adminDecisionNote: adminInspectionNote || 'QC রিজেক্ট: ড্যামেজ/নষ্ট হওয়ার কারণে ওয়েস্টেজ লেজারে এন্ট্রি (টেকনিশিয়ান খালাস)।'
      } : r);
      setTechReturns(updatedReturns);
      localStorage.setItem('gps_tech_return_shipments', JSON.stringify(updatedReturns));

      alert(`🗑️ বারকোড [${scannedBarcode || returnItem.itemCodeOrImei}] স্ক্যান সফল!\nপার্টসটি নষ্ট হওয়ায় সেন্ট্রাল স্টকে যোগ না করে ওয়েস্টেজ ও লস লেজারে এন্ট্রি করা হয়েছে। টেকনিশিয়ানের দায়িত্ব থেকে অব্যাহতি দেওয়া হয়েছে।`);
    }

    setIsScanModalOpen(false);
    setSelectedReturnToScan(null);
    setScannedBarcode('');
    setAdminInspectionNote('');
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

      {/* ========================================================================= */}
      {/* 🧭 PREMIUM RESPONSIVE SUB-TAB NAVIGATION & CONTROLS                        */}
      {/* ========================================================================= */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-3 md:p-4 shadow-xl space-y-3">
        {/* Top: 5 Sub-Tabs Visual Responsive Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {/* Tab 1: Service Rates */}
          <button
            type="button"
            onClick={() => setActiveSubTab('services')}
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between active:scale-[0.98] ${
              activeSubTab === 'services'
                ? 'bg-gradient-to-br from-amber-600/30 to-amber-950/60 border-amber-500 shadow-lg shadow-amber-600/20 ring-1 ring-amber-500/50'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeSubTab === 'services' ? 'bg-amber-500 text-slate-950 shadow-md font-black' : 'bg-slate-800 text-amber-400'
              }`}>
                <Layers className="w-4 h-4" />
              </div>
              <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-full border ${
                activeSubTab === 'services' ? 'bg-amber-500/30 text-amber-200 border-amber-400' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                {rateCardServices.length}
              </span>
            </div>
            <div className="mt-2.5">
              <div className={`text-xs md:text-sm font-extrabold truncate ${activeSubTab === 'services' ? 'text-amber-300' : 'text-slate-200'}`}>
                সার্ভিস রেট ক্যাটালগ
              </div>
              <div className="text-[10px] text-slate-400 truncate">ফিক্সড লেবার ও ইনস্টলেশন ফি</div>
            </div>
          </button>

          {/* Tab 2: Spare Parts */}
          <button
            type="button"
            onClick={() => setActiveSubTab('parts')}
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between active:scale-[0.98] ${
              activeSubTab === 'parts'
                ? 'bg-gradient-to-br from-cyan-600/30 to-cyan-950/60 border-cyan-500 shadow-lg shadow-cyan-600/20 ring-1 ring-cyan-500/50'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeSubTab === 'parts' ? 'bg-cyan-500 text-slate-950 shadow-md font-black' : 'bg-slate-800 text-cyan-400'
              }`}>
                <Package className="w-4 h-4" />
              </div>
              <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-full border ${
                activeSubTab === 'parts' ? 'bg-cyan-500/30 text-cyan-200 border-cyan-400' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                {sparePartsCatalog.length}
              </span>
            </div>
            <div className="mt-2.5">
              <div className={`text-xs md:text-sm font-extrabold truncate ${activeSubTab === 'parts' ? 'text-cyan-300' : 'text-slate-200'}`}>
                স্পেয়ার পার্টস ক্যাটালগ
              </div>
              <div className="text-[10px] text-slate-400 truncate">রিলে, ফিউজ, অ্যান্টেনা ও ব্যাটারি</div>
            </div>
          </button>

          {/* Tab 3: Parts Ledger & Returns */}
          <button
            type="button"
            onClick={() => setActiveSubTab('parts_ledger')}
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between active:scale-[0.98] ${
              activeSubTab === 'parts_ledger'
                ? 'bg-gradient-to-br from-blue-600/30 to-blue-950/60 border-blue-500 shadow-lg shadow-blue-600/20 ring-1 ring-blue-500/50'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeSubTab === 'parts_ledger' ? 'bg-blue-500 text-slate-950 shadow-md font-black' : 'bg-slate-800 text-blue-400'
              }`}>
                <History className="w-4 h-4" />
              </div>
              <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-full border ${
                activeSubTab === 'parts_ledger' ? 'bg-blue-500/30 text-blue-200 border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                {partsLedgerLogs.length}
              </span>
            </div>
            <div className="mt-2.5">
              <div className={`text-xs md:text-sm font-extrabold truncate ${activeSubTab === 'parts_ledger' ? 'text-blue-300' : 'text-slate-200'}`}>
                পার্টস স্টক ও ইস্যু লেজার
              </div>
              <div className="text-[10px] text-slate-400 truncate">হ্যান্ডওভার, রিটার্ন QC ও ওয়েস্টেজ</div>
            </div>
          </button>

          {/* Tab 4: Paid Job Cards */}
          <button
            type="button"
            onClick={() => setActiveSubTab('job_cards')}
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between active:scale-[0.98] ${
              activeSubTab === 'job_cards'
                ? 'bg-gradient-to-br from-emerald-600/30 to-emerald-950/60 border-emerald-500 shadow-lg shadow-emerald-600/20 ring-1 ring-emerald-500/50'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeSubTab === 'job_cards' ? 'bg-emerald-500 text-slate-950 shadow-md font-black' : 'bg-slate-800 text-emerald-400'
              }`}>
                <Receipt className="w-4 h-4" />
              </div>
              <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-full border ${
                activeSubTab === 'job_cards' ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                {paidJobCards.length}
              </span>
            </div>
            <div className="mt-2.5">
              <div className={`text-xs md:text-sm font-extrabold truncate ${activeSubTab === 'job_cards' ? 'text-emerald-300' : 'text-slate-200'}`}>
                পেইড সার্ভিস জব-কার্ড
              </div>
              <div className="text-[10px] text-slate-400 truncate">কাস্টমার বিল, পে-আউট ও ওয়ারেন্টি</div>
            </div>
          </button>

          {/* Tab 5: Fee & Commission Settings */}
          <button
            type="button"
            onClick={() => setActiveSubTab('fee_config')}
            className={`col-span-2 sm:col-span-1 p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between active:scale-[0.98] ${
              activeSubTab === 'fee_config'
                ? 'bg-gradient-to-br from-purple-600/30 to-purple-950/60 border-purple-500 shadow-lg shadow-purple-600/20 ring-1 ring-purple-500/50'
                : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                activeSubTab === 'fee_config' ? 'bg-purple-500 text-slate-950 shadow-md font-black' : 'bg-slate-800 text-purple-400'
              }`}>
                <Sliders className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
                activeSubTab === 'fee_config' ? 'bg-purple-500/30 text-purple-200 border-purple-400' : 'bg-slate-900 text-slate-400 border-slate-700'
              }`}>
                % CONFIG
              </span>
            </div>
            <div className="mt-2.5">
              <div className={`text-xs md:text-sm font-extrabold truncate ${activeSubTab === 'fee_config' ? 'text-purple-300' : 'text-slate-200'}`}>
                ফি % ও কমিশন কন্ট্রোল
              </div>
              <div className="text-[10px] text-slate-400 truncate">প্ল্যাটফর্ম ফি, রেফারেল ও ইনসেন্টিভ</div>
            </div>
          </button>
        </div>

        {/* Bottom Bar: Search Bar & Primary Action CTA Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80">
          {activeSubTab !== 'fee_config' ? (
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={
                  activeSubTab === 'services' ? 'সার্ভিসের নাম বা কোড দিয়ে খুঁজুন...' :
                  activeSubTab === 'parts' ? 'পার্টসের নাম বা পার্টস কোড (e.g. RELAY-40A) দিয়ে খুঁজুন...' :
                  activeSubTab === 'parts_ledger' ? 'লেজার ট্রানজ্যাকশন বা টেকনিশিয়ানের নাম দিয়ে খুঁজুন...' :
                  'জব-কার্ড নম্বর বা কাস্টমার ফোন দিয়ে খুঁজুন...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition shadow-inner"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ) : (
            <div className="text-xs text-slate-400 flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>সুপার অ্যাডমিন প্ল্যাটফর্ম রেট ও কমিশন হার কনফিগারেশন</span>
            </div>
          )}

          {/* Action CTA Buttons */}
          <div className="flex items-center space-x-2 shrink-0">
            {activeSubTab === 'services' && (
              <button
                type="button"
                onClick={() => handleOpenServiceModal()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-amber-600/30 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন সার্ভিস রেট যোগ করুন</span>
              </button>
            )}

            {activeSubTab === 'parts' && (
              <button
                type="button"
                onClick={() => handleOpenPartModal()}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-cyan-600/30 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন স্পেয়ার পার্টস যোগ করুন</span>
              </button>
            )}

            {activeSubTab === 'parts_ledger' && (
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/30 transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>📤 টেকনিশিয়ানকে পার্টস হ্যান্ডওভার</span>
              </button>
            )}
          </div>
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
      {/* TAB 3: SPARE PARTS STOCK & ISSUE LEDGER                                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'parts_ledger' && (
        <div className="space-y-4">
          {/* 4 Financial & Inventory Overview KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
              <span className="text-[10.5px] font-bold text-slate-400 block">🏢 সেন্ট্রাল ওয়্যারহাউস মোট পার্টস</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg md:text-xl font-mono font-black text-cyan-400">
                  {sparePartsCatalog.reduce((sum, p) => sum + p.stockCount, 0)}
                </span>
                <span className="text-xs text-slate-400">টি আইটেম</span>
              </div>
              <span className="text-[9.5px] text-slate-500 block font-mono truncate">
                ভ্যালু: ৳{sparePartsCatalog.reduce((sum, p) => sum + (p.stockCount * p.unitPrice), 0).toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
              <span className="text-[10.5px] font-bold text-slate-400 block">🔧 টেকনিশিয়ানদের ব্যাগে হ্যান্ডওভার</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg md:text-xl font-mono font-black text-amber-400">
                  {partsLedgerLogs.filter(l => l.type === 'issue_to_tech').reduce((sum, l) => sum + l.quantity, 0) -
                   partsLedgerLogs.filter(l => l.type === 'used_on_vehicle').reduce((sum, l) => sum + l.quantity, 0)}
                </span>
                <span className="text-xs text-slate-400">টি আইটেম</span>
              </div>
              <span className="text-[9.5px] text-amber-400/80 block truncate">ফিল্ড ভ্যানে কার্যরত</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
              <span className="text-[10.5px] font-bold text-slate-400 block">📦 অপেক্ষমান রিটার্ন পার্সেল</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg md:text-xl font-mono font-black text-purple-300">
                  {techReturns.filter(r => r.status === 'pending_admin_scan').length}
                </span>
                <span className="text-xs text-slate-400">টি চালান</span>
              </div>
              <span className="text-[9.5px] text-purple-400/80 block truncate">QC স্ক্যান অপেক্ষমান</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-1">
              <span className="text-[10.5px] font-bold text-slate-400 block">🗑️ স্ক্র্যাপ ও ওয়েস্টেজ আর্থিক ক্ষতি</span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg md:text-xl font-mono font-black text-rose-400">
                  ৳{wastageLogs.reduce((sum, w) => sum + w.totalLoss, 0).toLocaleString()}
                </span>
              </div>
              <span className="text-[9.5px] text-rose-400/80 block truncate">ইনভেন্টরি লস রাইট-অফ</span>
            </div>
          </div>

          {/* Sub-Navigator Filter Pills for Parts Ledger */}
          <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 flex flex-wrap gap-1.5 shadow-md">
            <button
              type="button"
              onClick={() => setLedgerFilterMode('movement')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                ledgerFilterMode === 'movement'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>১. স্টক মুভমেন্ট ও ইস্যু অডিট ({partsLedgerLogs.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setLedgerFilterMode('returns_qc')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                ledgerFilterMode === 'returns_qc'
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Scan className="w-3.5 h-3.5" />
              <span>২. টেকনিশিয়ান রিটার্ন ও বারকোড QC ({techReturns.length})</span>
              {techReturns.filter(r => r.status === 'pending_admin_scan').length > 0 && (
                <span className="bg-amber-950 text-amber-300 text-[9px] px-1.5 py-0.2 rounded-full border border-amber-700 font-mono animate-pulse">
                  {techReturns.filter(r => r.status === 'pending_admin_scan').length} নতুন
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setLedgerFilterMode('wastage_scrap')}
              className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                ledgerFilterMode === 'wastage_scrap'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>৩. নষ্ট/ড্যামেজ ওয়েস্টেজ লেজার ({wastageLogs.length})</span>
            </button>
          </div>

          {/* VIEW 1: Stock Movement Ledger Audit Table */}
          {ledgerFilterMode === 'movement' && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in">
              <div className="p-3.5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <History className="w-4 h-4 text-blue-400" />
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-100">
                      স্পেয়ার পার্টস মুভমেন্ট ও হ্যান্ডওভার অডিট লগ (Stock Movement Ledger)
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      ওয়্যারহাউসে স্টক ইন, টেকনিশিয়ানদের ব্যাগে হস্তান্তর এবং কাস্টমারের গাড়িতে ব্যবহারের রিয়েল-টাইম অডিট ট্রেইল।
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition active:scale-95 self-start sm:self-auto"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>📤 টেকনিশিয়ানকে পার্টস হ্যান্ডওভার</span>
                </button>
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
          )}

          {/* VIEW 2: Incoming Returns & Barcode Scanner QC */}
          {ledgerFilterMode === 'returns_qc' && (
            <div className="bg-slate-900 border border-amber-500/50 rounded-2xl overflow-hidden shadow-xl space-y-3 p-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
                <div className="flex items-center space-x-2">
                  <Scan className="w-5 h-5 text-amber-400" />
                  <div>
                    <h4 className="font-extrabold text-xs text-amber-300">
                      ফিল্ড টেকনিশিয়ান রিটার্ন পার্সেল ও বারকোড QC স্ক্যানার (RMA Inward Hub)
                    </h4>
                    <p className="text-[10.5px] text-slate-400">
                      টেকনিশিয়ানদের ফেরত পাঠানো অব্যবহৃত বা ড্যামেজ পার্টস বারকোড স্ক্যান করে রিসিভ করুন।
                    </p>
                  </div>
                </div>

                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2.5 py-0.5 rounded-full font-bold self-start sm:self-auto font-mono">
                  {techReturns.filter(r => r.status === 'pending_admin_scan').length} টি পার্সেল অপেক্ষমান
                </span>
              </div>

              <div className="space-y-2">
                {techReturns.map(ret => {
                  const isPending = ret.status === 'pending_admin_scan';
                  const isRestocked = ret.status === 'received_restocked';

                  return (
                    <div key={ret.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10.5px] font-black text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                            {ret.id}
                          </span>
                          <span className="font-extrabold text-slate-100">{ret.itemName}</span>
                          <span className="text-slate-400 font-mono text-[11px]">(পরিমাণ: {ret.quantity} টি)</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            ret.reportedCondition === 'good_unused' ? 'text-emerald-300 bg-emerald-950 border border-emerald-800' : 'text-rose-300 bg-rose-950 border border-rose-800'
                          }`}>
                            {ret.reportedCondition === 'good_unused' ? 'টেক রিপোর্ট: ভালো' : 'টেক রিপোর্ট: নষ্ট/ড্যামেজ'}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-slate-400 mt-1 font-mono">
                          প্রেরক: <strong className="text-slate-200">{ret.techName}</strong> • কোড/IMEI: <strong className="text-cyan-300">{ret.itemCodeOrImei}</strong> • তারিখ: {ret.date}
                        </p>
                        {ret.adminDecisionNote && (
                          <p className="text-[10px] text-blue-300 mt-0.5">
                            QC নোট: {ret.adminDecisionNote} ({ret.receivedAt})
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 self-start sm:self-auto shrink-0">
                        {isPending ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedReturnToScan(ret);
                              setScannedBarcode(ret.itemCodeOrImei);
                              setQcCondition(ret.reportedCondition === 'good_unused' ? 'good_restock' : 'damaged_wastage');
                              setIsScanModalOpen(true);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 flex items-center space-x-1.5 transition active:scale-95 animate-pulse"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>📷 বারকোড স্ক্যান ও QC রিসিভ</span>
                          </button>
                        ) : (
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            isRestocked
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                              : 'bg-rose-950 text-rose-300 border-rose-700'
                          }`}>
                            {isRestocked ? '✅ সেন্ট্রাল স্টকে রিস্টক সম্পন্ন' : '🗑️ ওয়েস্টেজ লেজারে খালাসকৃত'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 3: Wastage & Scrap Loss Ledger */}
          {ledgerFilterMode === 'wastage_scrap' && (
            <div className="bg-slate-900 border border-rose-500/40 rounded-2xl overflow-hidden shadow-xl p-4 space-y-3 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-2.5 gap-2">
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="w-5 h-5 text-rose-400" />
                  <div>
                    <h4 className="font-extrabold text-xs text-rose-300">
                      নষ্ট ও ড্যামেজ ওয়েস্টেজ লেজার (Wastage & Scrap Write-Off Ledger)
                    </h4>
                    <p className="text-[10.5px] text-slate-400">
                      নষ্ট পার্টস ও ডিভাইস ইনভেন্টরিতে যোগ না করে আর্থিক ক্ষতির হিসাব রাখার অডিট ট্রেইল।
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-bold">মোট আর্থিক ওয়েস্টেজ লস:</span>
                  <span className="text-sm font-mono font-black text-rose-400">
                    ৳ {wastageLogs.reduce((sum, w) => sum + w.totalLoss, 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-sans">
                {wastageLogs.map(w => (
                  <div key={w.id} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-black text-rose-400 bg-rose-950 px-2 py-0.2 rounded border border-rose-800">
                          {w.id}
                        </span>
                        <span className="font-bold text-slate-200">{w.itemName}</span>
                        <span className="font-mono text-slate-400">({w.quantity} টি)</span>
                        <span className="font-mono text-rose-400 font-bold">-৳{w.totalLoss}</span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">
                        {w.reason} • সারেন্ডারকারী: <b className="text-slate-300">{w.surrenderedByTech}</b> • ইন্সপেক্টর: {w.inspectedByAdmin} ({w.date})
                      </p>
                    </div>

                    <span className="text-[9px] font-mono text-rose-300 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800 self-start sm:self-auto">
                      স্ক্র্যাপ রাইট-অফ (০ ইনভেন্টরি)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
      {/* 📷 BARCODE SCAN & RETURN QC MODAL                                         */}
      {/* ========================================================================= */}
      {isScanModalOpen && selectedReturnToScan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-amber-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <Scan className="w-5 h-5 text-amber-400" />
                <h3 className="font-extrabold text-xs text-amber-300">
                  বারকোড/IMEI স্ক্যান ও রিটার্ন কোয়ালিটি (QC) যাচাই
                </h3>
              </div>
              <button 
                onClick={() => {
                  setIsScanModalOpen(false);
                  setSelectedReturnToScan(null);
                }} 
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Item Details Banner */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-100">{selectedReturnToScan.itemName}</span>
                <span className="font-mono text-amber-400 font-black">{selectedReturnToScan.id}</span>
              </div>
              <div className="text-[10.5px] text-slate-400 grid grid-cols-2 gap-1 font-mono pt-1 border-t border-slate-800/80">
                <div>প্রেরক টেক: <b className="text-slate-200">{selectedReturnToScan.techName}</b></div>
                <div>পরিমাণ: <b className="text-cyan-300">{selectedReturnToScan.quantity} টি</b></div>
                <div>মূল্য: <b className="text-emerald-400">৳{selectedReturnToScan.unitPrice * selectedReturnToScan.quantity}</b></div>
                <div>তারিখ: <b className="text-slate-300">{selectedReturnToScan.date}</b></div>
              </div>
            </div>

            <form onSubmit={handleProcessScanReceive} className="space-y-3 text-xs">
              {/* Barcode Scanner Input with Beep Simulation */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1 flex items-center justify-between">
                  <span>বারকোড / সিরিয়াল / IMEI নম্বর স্ক্যান *</span>
                  <span className="text-[9.5px] text-emerald-400 font-mono">📷 স্ক্যানার রেডি</span>
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    required
                    value={scannedBarcode}
                    onChange={(e) => setScannedBarcode(e.target.value)}
                    placeholder="বারকোড স্ক্যান করুন..."
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono font-black focus:border-amber-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setScannedBarcode(selectedReturnToScan.itemCodeOrImei);
                      alert(`🔊 BEEP! বারকোড [${selectedReturnToScan.itemCodeOrImei}] স্ক্যান সম্পন্ন!`);
                    }}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-amber-300 font-bold text-xs rounded-xl border border-slate-700 flex items-center space-x-1"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>অটো স্ক্যান</span>
                  </button>
                </div>
              </div>

              {/* QC Verification Radio */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সুপার অ্যাডমিন QC ভেরিফিকেশন সিদ্ধান্ত *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setQcCondition('good_restock')}
                    className={`p-2.5 rounded-2xl border text-left space-y-1 transition ${
                      qcCondition === 'good_restock' 
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>✅ ভালো কন্ডিশন</span>
                    </div>
                    <p className="text-[9.5px] leading-tight">সেন্ট্রাল স্টকে যুক্ত হবে (+{selectedReturnToScan.quantity}) ও টেকনিশিয়ান লেজার থেকে মাইনাস হবে।</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setQcCondition('damaged_wastage')}
                    className={`p-2.5 rounded-2xl border text-left space-y-1 transition ${
                      qcCondition === 'damaged_wastage' 
                        ? 'bg-rose-950/80 border-rose-500 text-rose-200 ring-1 ring-rose-500' 
                        : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 font-bold text-xs">
                      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      <span>❌ নষ্ট / ড্যামেজ</span>
                    </div>
                    <p className="text-[9.5px] leading-tight">স্টকে যুক্ত হবে না। ওয়েস্টেজ লেজারে এন্ট্রি হবে ও টেকনিশিয়ান খালাস পাবে।</p>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ইন্সপেকশন নোট / অডিট মন্তব্য</label>
                <input
                  type="text"
                  placeholder="যেমন: ফিজিক্যাল চেকিং সম্পন্ন, স্টকে জমা / স্ক্র্যাপ সারেন্ডার"
                  value={adminInspectionNote}
                  onChange={(e) => setAdminInspectionNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-2.5 rounded-xl text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg transition active:scale-95 ${
                  qcCondition === 'good_restock' 
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 shadow-emerald-600/30'
                    : 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 shadow-rose-600/30'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>{qcCondition === 'good_restock' ? 'ভেরিফাই ও সেন্ট্রাল স্টকে জমা করুন' : 'ওয়েস্টেজ লেজারে খালাস নিশ্চিত করুন'}</span>
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
