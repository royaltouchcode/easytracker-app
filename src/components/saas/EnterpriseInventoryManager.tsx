import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Radio, 
  Search, 
  Plus, 
  QrCode, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Trash2, 
  Layers, 
  Car, 
  Phone, 
  Tag, 
  Copy, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  Sparkles,
  Download,
  Filter,
  X,
  ArrowUpRight,
  ClipboardList,
  User,
  Calendar,
  FileText,
  CheckSquare,
  Building2,
  Wrench,
  Truck,
  FileSpreadsheet,
  DollarSign,
  PackageOpen,
  Undo2,
  Package,
  Eye,
  Printer,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  DeviceInventoryItem, 
  SimInventoryItem, 
  DeviceInventoryStatus, 
  SimInventoryStatus, 
  SimType,
  ReturnLogEntry,
  ReturnChannel,
  ReturnCondition,
  ReturnResolution,
  ReturnOwnership,
  ReturnItemType
} from '../../types/traccar';
import { DeviceSimBundlerModal } from './DeviceSimBundlerModal';

interface EnterpriseInventoryManagerProps {
  partnerIdFilter?: string;
  isPartnerPortal?: boolean;
  standaloneMode?: 'devices' | 'sims' | 'sales_log' | 'returns_rma' | 'all';
}

export const EnterpriseInventoryManager: React.FC<EnterpriseInventoryManagerProps> = ({ 
  partnerIdFilter,
  isPartnerPortal = false,
  standaloneMode = 'all'
}) => {
  const {
    deviceInventory,
    simInventory,
    returnLogs,
    initiateReturnLog,
    updateReturnLog,
    resolveReturnLog,
    addDeviceToInventory,
    updateDeviceInventoryItem,
    deleteDeviceInventoryItem,
    unbindDeviceFromVehicle,
    addSimToInventory,
    updateSimInventoryItem,
    deleteSimInventoryItem,
    unbindSimFromDevice,
    user
  } = useApp();

  // Active Sub-Tabs: Devices, SIMs, Sales & Install Log, Returns/RMA, Scrap/Damaged
  const [activeTab, setActiveTab] = useState<'devices' | 'sims' | 'sales_log' | 'returns_rma' | 'scrap'>(
    standaloneMode && standaloneMode !== 'all' ? standaloneMode : 'devices'
  );

  // Sync activeTab when standaloneMode prop changes
  React.useEffect(() => {
    if (standaloneMode && standaloneMode !== 'all') {
      setActiveTab(standaloneMode);
    }
  }, [standaloneMode]);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Detail Modal
  const [selectedDeviceDetail, setSelectedDeviceDetail] = useState<DeviceInventoryItem | null>(null);
  const [selectedSimDetail, setSelectedSimDetail] = useState<SimInventoryItem | null>(null);
  const [selectedCertItem, setSelectedCertItem] = useState<{ device: DeviceInventoryItem; sim?: SimInventoryItem } | null>(null);
  const [isBundlerModalOpen, setIsBundlerModalOpen] = useState(false);

  // Scanner Simulator Modal
  const [isScanning, setIsScanning] = useState(false);
  const [scannerMode, setScannerMode] = useState<'device' | 'sim'>('device');
  const [scannedCode, setScannedCode] = useState('');

  // Add Device Modal State
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [newDevice, setNewDevice] = useState<Omit<DeviceInventoryItem, 'id' | 'addedDate'>>({
    barcode: `BC-GT06-${Math.floor(1000 + Math.random() * 9000)}`,
    imei: `86472005${Math.floor(1000000 + Math.random() * 9000000)}`,
    serialNumber: `SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    manufacturer: 'Concox / Jimi IoT',
    model: 'GT06N Smart Tracker',
    protocol: 'gt06',
    firmwareVersion: 'v2.4.2',
    purchasePriceBdt: 1650,
    batchLot: 'LOT-2026-AUG',
    status: 'in_stock',
    partnerId: partnerIdFilter || user?.partnerId || 'PRT-8801',
    notes: 'অরিজিনাল ব্র্যান্ড নিউ ট্র্যাকার'
  });

  // Add SIM Modal State
  const [isAddSimOpen, setIsAddSimOpen] = useState(false);
  const [newSim, setNewSim] = useState<Omit<SimInventoryItem, 'id' | 'addedDate'>>({
    simBarcode: `898801${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
    msisdn: `01811-${Math.floor(100000 + Math.random() * 900000)}`,
    operator: 'robi',
    simType: 'm2m_general',
    puk1: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    puk2: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    pin1: '1234',
    apn: 'm2m.robi.com.bd',
    status: 'in_stock_ready',
    partnerId: partnerIdFilter || user?.partnerId || 'PRT-8801',
    notes: 'টেলিমেটিক্স আইওটি ডেটা সিম'
  });

  // Return & RMA State
  const [isAddReturnOpen, setIsAddReturnOpen] = useState(false);
  const [selectedReturnSlip, setSelectedReturnSlip] = useState<ReturnLogEntry | null>(null);
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [selectedReturnToResolve, setSelectedReturnToResolve] = useState<ReturnLogEntry | null>(null);

  const [newReturn, setNewReturn] = useState<Omit<ReturnLogEntry, 'id' | 'challanNumber' | 'returnDate'>>({
    channel: 'technician',
    itemType: 'bundle',
    imei: '864720058291088',
    deviceModel: 'GT06N Smart Tracker',
    simMsisdn: '01811-223344',
    simIccid: '8988018001234567890',
    ownership: 'partner',
    partnerId: partnerIdFilter || user?.partnerId || 'PRT-8801',
    partnerName: 'ঢাকা সেন্ট্রাল ট্র্যাকিং হাব',
    technicianName: 'ইঞ্জিঃ মোঃ জাহিদুল ইসলাম',
    previousVehiclePlate: 'DHAKA METRO-HA 12-3456',
    previousCustomerName: 'কাস্টমার রিকভারি',
    previousCustomerPhone: '01711-223344',
    currentCustodian: 'Tech: জাহিদুল ইসলাম (Field Bag)',
    condition: 'working_good',
    qcNotes: 'আনবাইন্ড করা হয়েছে। টেস্ট ওকে।',
    resolution: 'restocked_reusable',
    refundAmountBdt: 0,
    financialStatus: 'none'
  });

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Robust Partner Scope Matcher
  const isBelongingToScope = (itemPartnerId?: string) => {
    if (!partnerIdFilter) return true; // Master Super Admin
    if (!itemPartnerId) return true;
    return (
      itemPartnerId === partnerIdFilter || 
      itemPartnerId === 'PRT-8801' || 
      itemPartnerId === 'partner_dmc' || 
      itemPartnerId === user?.partnerId
    );
  };

  // Filtered Devices with Multi-Search
  const filteredDevices = useMemo(() => {
    return deviceInventory.filter(d => {
      if (!isBelongingToScope(d.partnerId)) return false;
      
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || (
        d.imei.toLowerCase().includes(term) ||
        d.barcode.toLowerCase().includes(term) ||
        d.serialNumber.toLowerCase().includes(term) ||
        d.model.toLowerCase().includes(term) ||
        d.manufacturer.toLowerCase().includes(term) ||
        d.protocol.toLowerCase().includes(term) ||
        (d.assignedVehiclePlate || '').toLowerCase().includes(term) ||
        (d.assignedCustomerName || '').toLowerCase().includes(term) ||
        (d.pairedSimNumber || '').includes(term)
      );

      if (activeTab === 'scrap') {
        return matchesSearch && d.status === 'damaged_scrap';
      }

      if (statusFilter !== 'all') {
        return matchesSearch && d.status === statusFilter;
      }

      return matchesSearch && d.status !== 'damaged_scrap';
    });
  }, [deviceInventory, searchTerm, statusFilter, activeTab, partnerIdFilter]);

  // Filtered SIMs with Multi-Search
  const filteredSims = useMemo(() => {
    return simInventory.filter(s => {
      if (!isBelongingToScope(s.partnerId)) return false;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || (
        s.msisdn.toLowerCase().includes(term) ||
        s.simBarcode.toLowerCase().includes(term) ||
        s.operator.toLowerCase().includes(term) ||
        s.puk1.toLowerCase().includes(term) ||
        s.simType.toLowerCase().includes(term) ||
        (s.pairedImei || '').includes(term) ||
        (s.assignedVehiclePlate || '').toLowerCase().includes(term) ||
        (s.assignedCustomerName || '').toLowerCase().includes(term)
      );

      if (activeTab === 'scrap') {
        return matchesSearch && s.status === 'damaged_lost';
      }

      if (statusFilter !== 'all') {
        return matchesSearch && s.status === statusFilter;
      }

      if (operatorFilter !== 'all') {
        return matchesSearch && s.operator === operatorFilter;
      }

      return matchesSearch && s.status !== 'damaged_lost';
    });
  }, [simInventory, searchTerm, statusFilter, operatorFilter, activeTab, partnerIdFilter]);

  // Sales & Installation Dispatch List (Active Installations)
  const salesAndInstallRecords = useMemo(() => {
    return deviceInventory
      .filter(d => isBelongingToScope(d.partnerId) && (d.status === 'sold_active' || d.assignedVehiclePlate))
      .map(d => {
        const pairedSim = simInventory.find(s => s.pairedImei === d.imei || s.msisdn === d.pairedSimNumber);
        return {
          device: d,
          sim: pairedSim
        };
      });
  }, [deviceInventory, simInventory, partnerIdFilter]);

  // Filtered Reverse Logistics & Return Logs
  const filteredReturns = useMemo(() => {
    return returnLogs.filter(r => {
      if (!isBelongingToScope(r.partnerId)) return false;
      if (channelFilter !== 'all' && r.channel !== channelFilter) return false;
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchImei = r.imei?.toLowerCase().includes(query);
        const matchSim = r.simMsisdn?.toLowerCase().includes(query);
        const matchChallan = r.challanNumber.toLowerCase().includes(query);
        const matchPlate = r.previousVehiclePlate?.toLowerCase().includes(query);
        const matchCust = r.currentCustodian.toLowerCase().includes(query);
        if (!matchImei && !matchSim && !matchChallan && !matchPlate && !matchCust) return false;
      }
      return true;
    });
  }, [returnLogs, channelFilter, searchTerm, partnerIdFilter]);

  // Metrics (scoped to current partner/view)
  const metrics = useMemo(() => {
    const scopedDevs = deviceInventory.filter(d => isBelongingToScope(d.partnerId));
    const scopedSims = simInventory.filter(s => isBelongingToScope(s.partnerId));
    const scopedReturns = returnLogs.filter(r => isBelongingToScope(r.partnerId));

    const totalDevs = scopedDevs.length;
    const inStockDevs = scopedDevs.filter(d => d.status === 'in_stock').length;
    const activeDevs = scopedDevs.filter(d => d.status === 'sold_active').length;
    const reinstallDevs = scopedDevs.filter(d => d.status === 'returned_reinstall').length;
    const scrapDevs = scopedDevs.filter(d => d.status === 'damaged_scrap').length;

    const totalSims = scopedSims.length;
    const readySims = scopedSims.filter(s => s.status === 'in_stock_ready').length;
    const activeSims = scopedSims.filter(s => s.status === 'paired_with_device' || s.status === 'active_live').length;
    const scrapSims = scopedSims.filter(s => s.status === 'damaged_lost').length;

    const techReturns = scopedReturns.filter(r => r.channel === 'technician').length;
    const qcReturns = scopedReturns.filter(r => r.channel === 'support_qc').length;
    const shopReturns = scopedReturns.filter(r => r.channel === 'partner_shop').length;
    const centralReturns = scopedReturns.filter(r => r.channel === 'central_office').length;
    const totalRefundedBdt = scopedReturns.reduce((sum, r) => sum + (r.refundAmountBdt || 0), 0);

    return {
      totalDevs,
      inStockDevs,
      activeDevs,
      reinstallDevs,
      scrapDevs,
      totalSims,
      readySims,
      activeSims,
      scrapSims,
      totalSoldInstall: scopedDevs.filter(d => d.status === 'sold_active' || d.assignedVehiclePlate).length,
      techReturns,
      qcReturns,
      shopReturns,
      centralReturns,
      totalReturns: scopedReturns.length,
      totalRefundedBdt
    };
  }, [deviceInventory, simInventory, returnLogs, partnerIdFilter]);

  // Quick Barcode Scan Handler
  const handleBarcodeScanned = (code: string) => {
    setSearchTerm(code);
    setIsScanning(false);
  };

  return (
    <div className="space-y-4">

      {/* ⚡ 1-CLICK DEVICE + VOICE/DATA M2M SIM BUNDLER ACTION BANNER */}
      <div className="bg-gradient-to-r from-indigo-950 via-purple-950 to-slate-900 border border-indigo-500/50 p-4 rounded-3xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shrink-0">
            <Sparkles className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <span>SaaS সেন্ট্রাল ডিভাইস ও M2M সিম বান্ডলিং হাব</span>
              <span className="text-[9.5px] bg-purple-500/30 text-purple-200 font-bold px-2 py-0.5 rounded-full border border-purple-500/40">
                Voice & Data M2M
              </span>
            </h3>
            <p className="text-[11px] text-slate-300">
              আমাদের সেন্ট্রাল স্টক থেকে ট্র্যাকার ডিভাইস এবং ভয়েস/নন-ভয়েস M2M সিম ১-ক্লিকে পেয়ার করে B2B পার্টনার, কর্পোরেট ফ্লিট বা রিটেইল কাস্টমারে বরাদ্দ করুন
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsBundlerModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center space-x-2 transition active:scale-95 shrink-0"
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>⚡ ১-ক্লিক ডিভাইস ও M2M সিম বরাদ্দ</span>
        </button>
      </div>
      
      {/* ========================================================================= */}
      {/* 1. TARGETED INWARD SLOTS (SEPARATED FOR DEVICE / SIM / SALES)             */}
      {/* ========================================================================= */}
      {(standaloneMode === 'all' || standaloneMode === 'devices') && (
        <div className={standaloneMode === 'devices' ? 'w-full' : 'grid grid-cols-1 md:grid-cols-2 gap-3.5'}>
          {/* SLOT A: TRACKER DEVICE INWARD CARD */}
          <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 shadow-xl flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-md">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-indigo-300">হার্ডওয়্যার ট্র্যাকার হাব</span>
                  <h4 className="font-extrabold text-sm text-white">নতুন ট্র্যাকার ডিভাইস (Device) ইনওয়ার্ড</h4>
                  <p className="text-[10.5px] text-slate-400">IMEI, বারকোড ট্যাগ, প্রোটোকল ও ব্যাচ নম্বর দিয়ে স্টকে তুলুন</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                মজুদ: {metrics.inStockDevs} টি
              </span>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => setIsAddDeviceOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন ট্র্যাকার (Device) যোগ করুন</span>
              </button>

              <button
                onClick={() => {
                  setScannerMode('device');
                  setIsScanning(true);
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold text-xs border border-slate-700 flex items-center space-x-1 transition"
                title="ডিভাইস বারকোড স্ক্যান"
              >
                <Scan className="w-4 h-4" />
                <span>স্ক্যান</span>
              </button>
            </div>
          </div>

          {/* SLOT B in ALL mode */}
          {standaloneMode === 'all' && (
            <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-900 border border-purple-500/40 shadow-xl flex flex-col justify-between space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-md">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">টেলিমেটিক্স সিম স্লট</span>
                    <h4 className="font-extrabold text-sm text-white">নতুন সিম (SIM) ইনওয়ার্ড</h4>
                    <p className="text-[10.5px] text-slate-400">মোবাইল নম্বর, চিপ ICCID, PUK-1 ও M2M টাইপ দিয়ে এন্ট্রি করুন</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  মজুদ: {metrics.readySims} টি
                </span>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <button
                  onClick={() => setIsAddSimOpen(true)}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ নতুন টেলিমেটিক্স সিম (SIM) যোগ করুন</span>
                </button>

                <button
                  onClick={() => {
                    setScannerMode('sim');
                    setIsScanning(true);
                  }}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs border border-slate-700 flex items-center space-x-1 transition"
                  title="সিম বারকোড স্ক্যান"
                >
                  <Scan className="w-4 h-4" />
                  <span>স্ক্যান</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SLOT B ONLY: IN SIM STANDALONE MODE */}
      {standaloneMode === 'sims' && (
        <div className="w-full">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-900 border border-purple-500/40 shadow-xl flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-md">
                  <Radio className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-300">টেলিমেটিক্স সিম হাব</span>
                  <h4 className="font-extrabold text-sm text-white">নতুন সিম (SIM) ইনওয়ার্ড</h4>
                  <p className="text-[10.5px] text-slate-400">মোবাইল নম্বর, চিপ ICCID, PUK-1 ও M2M টাইপ দিয়ে এন্ট্রি করুন</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                মজুদ: {metrics.readySims} টি
              </span>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => setIsAddSimOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md shadow-purple-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন টেলিমেটিক্স সিম (SIM) যোগ করুন</span>
              </button>

              <button
                onClick={() => {
                  setScannerMode('sim');
                  setIsScanning(true);
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 font-bold text-xs border border-slate-700 flex items-center space-x-1 transition"
                title="সিম বারকোড স্ক্যান"
              >
                <Scan className="w-4 h-4" />
                <span>স্ক্যান</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SLOT C ONLY: IN RETURNS & RMA STANDALONE MODE */}
      {standaloneMode === 'returns_rma' && (
        <div className="w-full">
          <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-900 border border-amber-500/40 shadow-xl flex flex-col justify-between space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-md">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">রিভার্স লজিস্টিক্স ও কাস্টডি গেটওয়ে</span>
                  <h4 className="font-extrabold text-sm text-white">নতুন রিটার্ন ও কাস্টডি চালান এন্ট্রি</h4>
                  <p className="text-[10.5px] text-slate-400">টেকনিশিয়ান, সেন্ট্রাল অফিস, সাপোর্ট ল্যাব ও ফ্র্যাঞ্চাইজি শপের রিসিভিং ও কাস্টডি রেকর্ড</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                মোট রিটার্ন: {metrics.totalReturns} টি
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">👨‍🔧 ফিল্ড টেকনিশিয়ান</div>
                <div className="font-mono font-bold text-amber-300 text-sm">{metrics.techReturns} টি</div>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">🧪 সাপোর্ট / QC ল্যাব</div>
                <div className="font-mono font-bold text-rose-300 text-sm">{metrics.qcReturns} টি</div>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">🏪 পার্টনার শপ</div>
                <div className="font-mono font-bold text-emerald-300 text-sm">{metrics.shopReturns} টি</div>
              </div>
              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">🏢 সেন্ট্রাল অফিস</div>
                <div className="font-mono font-bold text-cyan-300 text-sm">{metrics.centralReturns} টি</div>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => setIsAddReturnOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন রিটার্ন এন্ট্রি ও কাস্টডি চালান</span>
              </button>

              <button
                onClick={() => {
                  setScannerMode('device');
                  setIsScanning(true);
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-slate-700 flex items-center space-x-1 transition"
                title="চালান / বারকোড স্ক্যান"
              >
                <Scan className="w-4 h-4" />
                <span>স্ক্যান</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SUMMARY METRICS BAR (SCOPED & ACCURATE)                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-indigo-300">স্টকে প্রস্তুত ট্র্যাকার</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">
            {metrics.inStockDevs} <span className="text-xs font-normal text-slate-400">/ {metrics.totalDevs} টি</span>
          </div>
          <span className="text-[9.5px] text-indigo-200">বিক্রি ও ইনস্টলেশনের জন্য রেডি</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-300">গাড়িতে ইনস্টল্ড ও লাইভ</span>
            <Car className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">
            {metrics.activeDevs} <span className="text-xs font-normal text-slate-400">টি</span>
          </div>
          <span className="text-[9.5px] text-emerald-300">লাইভ ট্র্যাকিং সক্রিয়</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/60 to-slate-900 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-purple-300">মজুদ টেলিমেটিক্স সিম</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black font-mono text-purple-300 mt-1">
            {metrics.readySims} <span className="text-xs font-normal text-slate-400">/ {metrics.totalSims} টি</span>
          </div>
          <span className="text-[9.5px] text-purple-200">M2M ও রেগুলার সিম রেডি</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-950/60 to-slate-900 border border-amber-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-amber-300">রিটার্ন ও কাস্টডি রেকর্ড</span>
            <RotateCcw className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black font-mono text-amber-300 mt-1">
            {metrics.totalReturns} <span className="text-xs font-normal text-slate-400">টি</span>
          </div>
          <span className="text-[9.5px] text-amber-200">৪ চ্যানেল রিভার্স ট্র্যাকিং</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. NAVIGATION TABS (ONLY IN 'ALL' MODE)                                    */}
      {/* ========================================================================= */}
      {standaloneMode === 'all' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => { setActiveTab('devices'); setStatusFilter('all'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center space-x-1.5 shrink-0 ${
                activeTab === 'devices' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>হার্ডওয়্যার ডিভাইস ({filteredDevices.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('sims'); setStatusFilter('all'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center space-x-1.5 shrink-0 ${
                activeTab === 'sims' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>টেলিমেটিক্স সিম ({filteredSims.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('sales_log'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center space-x-1.5 shrink-0 ${
                activeTab === 'sales_log' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5" />
              <span>📑 সেলস ও ইনস্টলেশন ({salesAndInstallRecords.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('returns_rma'); setChannelFilter('all'); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center space-x-1.5 shrink-0 ${
                activeTab === 'returns_rma' 
                  ? 'bg-amber-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>🔄 রিটার্ন ও RMA ({filteredReturns.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('scrap'); setStatusFilter('all'); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center space-x-1.5 shrink-0 ${
                activeTab === 'scrap' 
                  ? 'bg-rose-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>ড্যামেজ ({metrics.scrapDevs + metrics.scrapSims})</span>
            </button>
          </div>

          {/* Global Barcode Search Indicator */}
          <div className="text-[10px] text-slate-400 flex items-center space-x-1 self-end sm:self-center pr-2">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>রিয়েল-টাইম বারকোড ও IMEI সিঙ্ক সক্রিয়</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. UNIVERSAL MULTI-SEARCH & FILTER TOOLBAR                               */}
      {/* ========================================================================= */}
      {activeTab !== 'sales_log' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2.5">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 বারকোড, IMEI, সিম নম্বর, ICCID, সিরিয়াল S/N, PUK বা গাড়ির প্লেট দিয়ে সার্চ করুন..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder-slate-500 font-medium focus:border-indigo-500 focus:outline-none"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Status Filters */}
            <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                  statusFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                সকল
              </button>

              {activeTab === 'devices' && (
                <>
                  <button
                    onClick={() => setStatusFilter('in_stock')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                      statusFilter === 'in_stock' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    স্টকে মজুদ
                  </button>
                  <button
                    onClick={() => setStatusFilter('sold_active')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                      statusFilter === 'sold_active' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    সক্রিয় গাড়ি
                  </button>
                  <button
                    onClick={() => setStatusFilter('returned_reinstall')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                      statusFilter === 'returned_reinstall' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    রি-ইনস্টল
                  </button>
                </>
              )}

              {activeTab === 'sims' && (
                <>
                  <button
                    onClick={() => setStatusFilter('in_stock_ready')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                      statusFilter === 'in_stock_ready' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    রেডি সিম
                  </button>
                  <button
                    onClick={() => setStatusFilter('paired_with_device')}
                    className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                      statusFilter === 'paired_with_device' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
                    }`}
                  >
                    পেয়ার্ড সিম
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB 1: HARDWARE DEVICES INDIVIDUAL TABLE                                */}
      {/* ========================================================================= */}
      {activeTab === 'devices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>হার্ডওয়্যার ডিভাইস ইনভেন্টরি তালিকা ({filteredDevices.length} টি)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">প্রতিটি ডিভাইসের ইন্ডিভিজুয়াল রেকর্ড</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold bg-slate-950/60">
                  <th className="p-3">বারকোড ও আইএমইআই (IMEI)</th>
                  <th className="p-3">মডেল ও প্রোটোকল</th>
                  <th className="p-3">সিরিয়াল (S/N) ও ব্যাচ</th>
                  <th className="p-3">বর্তমান স্ট্যাটাস</th>
                  <th className="p-3">অ্যাসাইনড গাড়ি / পেয়ার্ড সিম</th>
                  <th className="p-3 text-right">ইন্ডিভিজুয়াল অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                      🔍 কোনো ডিভাইস পাওয়া যায়নি। উপরে "+ নতুন ট্র্যাকার (Device) যোগ করুন" বাটনে ক্লিক করে ইনওয়ার্ড করুন।
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map(dev => (
                    <tr key={dev.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className="font-mono font-bold text-white text-xs flex items-center space-x-1">
                            <span>{dev.imei}</span>
                            <button
                              onClick={() => handleCopy(dev.imei, dev.id)}
                              className="text-slate-500 hover:text-indigo-400 transition"
                              title="IMEI কপি করুন"
                            >
                              {copiedId === dev.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center space-x-1.5">
                          <Tag className="w-2.5 h-2.5 text-indigo-400" />
                          <span>ট্যাগ: <strong className="text-indigo-300">{dev.barcode}</strong></span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-200 text-xs">{dev.model}</div>
                        <div className="text-[10px] text-slate-400">
                          {dev.manufacturer} • প্রোটোকল: <span className="font-mono text-cyan-300 font-bold">{dev.protocol}</span>
                        </div>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-slate-300">
                        <div>{dev.serialNumber}</div>
                        <div className="text-[9.5px] text-slate-500">ক্রয়: ৳{dev.purchasePriceBdt?.toLocaleString()}</div>
                      </td>

                      <td className="p-3">
                        {dev.status === 'in_stock' && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            📦 স্টকে মজুদ
                          </span>
                        )}
                        {dev.status === 'sold_active' && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            🚗 গাড়িতে সক্রিয়
                          </span>
                        )}
                        {dev.status === 'returned_reinstall' && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            🔄 রি-ইনস্টল স্টক
                          </span>
                        )}
                        {dev.status === 'damaged_scrap' && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            🗑️ ড্যামেজ / স্ক্র্যাপ
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        {dev.assignedVehiclePlate ? (
                          <div>
                            <div className="font-bold text-white text-xs">{dev.assignedVehiclePlate}</div>
                            <div className="text-[10px] text-slate-400">
                              {dev.assignedCustomerName} • <span className="font-mono text-emerald-400">{dev.pairedSimNumber}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">স্টকে উন্মুক্ত</span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedDeviceDetail(dev)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition flex items-center space-x-1"
                            title="ইন্ডিভিজুয়াল বিস্তারিত দেখুন"
                          >
                            <Eye className="w-3 h-3 text-indigo-400" />
                            <span>বিস্তারিত</span>
                          </button>

                          {dev.status === 'sold_active' && (
                            <button
                              onClick={() => unbindDeviceFromVehicle(dev.id)}
                              className="px-2 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] font-bold transition"
                              title="কাস্টমার আনসাবস্ক্রাইব করায় ডিভাইস আনবাইন্ড করে স্টকে ফেরত নিন"
                            >
                              আনবাইন্ড
                            </button>
                          )}
                          {dev.status !== 'damaged_scrap' && (
                            <button
                              onClick={() => updateDeviceInventoryItem(dev.id, { status: 'damaged_scrap', notes: 'ব্যবহার অনুপযোগী বা ড্যামেজ' })}
                              className="p-1 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                              title="স্ক্র্যাপ / ড্যামেজ হিসেবে মার্ক করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB 2: TELEMATICS SIM INDIVIDUAL TABLE                                 */}
      {/* ========================================================================= */}
      {activeTab === 'sims' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>টেলিমেটিক্স সিম ইনভেন্টরি তালিকা ({filteredSims.length} টি)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">PUK ও চিপ ICCID লেজার</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold bg-slate-950/60">
                  <th className="p-3">মোবাইল নম্বর (MSISDN)</th>
                  <th className="p-3">অপারেটর ও ধরন</th>
                  <th className="p-3">সিমের চিপ নম্বর (ICCID)</th>
                  <th className="p-3">PUK ও APN কোড</th>
                  <th className="p-3">পেয়ার্ড ট্র্যাকার / গাড়ি</th>
                  <th className="p-3 text-right">ইন্ডিভিজুয়াল অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredSims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                      🔍 কোনো সিম কার্ড পাওয়া যায়নি। উপরে "+ নতুন টেলিমেটিক্স সিম (SIM) যোগ করুন" বাটনে ক্লিক করে ইনওয়ার্ড করুন।
                    </td>
                  </tr>
                ) : (
                  filteredSims.map(sim => (
                    <tr key={sim.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-3">
                        <div className="font-mono font-bold text-white text-xs flex items-center space-x-1">
                          <span>{sim.msisdn}</span>
                          <button
                            onClick={() => handleCopy(sim.msisdn, sim.id)}
                            className="text-slate-500 hover:text-purple-400 transition"
                            title="মোবাইল নম্বর কপি করুন"
                          >
                            {copiedId === sim.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-[9.5px] text-slate-400 mt-0.5">
                          স্ট্যাটাস: <span className="text-purple-300 font-bold">{sim.status}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-200 text-xs uppercase">{sim.operator}</div>
                        <div className="text-[10px] text-slate-400">
                          {sim.simType === 'm2m_general' && '🌐 M2M ডেটা-অনলি'}
                          {sim.simType === 'm2m_special_voice' && '🎙️ M2M ভয়েস ও কল'}
                          {sim.simType === 'consumer_regular' && '📱 সাধারণ সিম'}
                          {sim.simType === 'byos_customer_sim' && '👤 গ্রাহকের সিম (BYOS)'}
                        </div>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-slate-300">
                        <div>{sim.simBarcode}</div>
                      </td>

                      <td className="p-3 font-mono text-[10.5px]">
                        <div className="text-amber-300 font-bold">PUK: {sim.puk1}</div>
                        <div className="text-[9.5px] text-slate-400">APN: {sim.apn}</div>
                      </td>

                      <td className="p-3">
                        {sim.pairedImei ? (
                          <div>
                            <div className="font-mono text-emerald-400 text-xs font-bold">{sim.pairedImei}</div>
                            <div className="text-[10px] text-slate-400">{sim.assignedVehiclePlate || 'পেয়ার্ড সক্রিয়'}</div>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            স্টকে উন্মুক্ত
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedSimDetail(sim)}
                            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition flex items-center space-x-1"
                            title="সিম বিস্তারিত দেখুন"
                          >
                            <Eye className="w-3 h-3 text-purple-400" />
                            <span>বিস্তারিত</span>
                          </button>

                          {sim.pairedImei && (
                            <button
                              onClick={() => unbindSimFromDevice(sim.id)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition"
                            >
                              আনপেয়ার
                            </button>
                          )}
                          {sim.status !== 'damaged_lost' && (
                            <button
                              onClick={() => updateSimInventoryItem(sim.id, { status: 'damaged_lost', notes: 'নষ্ট বা ক্ষতিগ্রস্ত' })}
                              className="p-1 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                              title="নষ্ট হিসেবে মার্ক করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB 3: MASTER SALES & INSTALLATION DISPATCH AUDIT LOG                   */}
      {/* ========================================================================= */}
      {activeTab === 'sales_log' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-md">
                <ClipboardList className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  সেলস ও ইনস্টলেশন অডিট লেজার (Sales & Dispatch History)
                </h3>
                <p className="text-[10.5px] text-slate-400">
                  কোন ডিভাইস কোন সিমে পেয়ার হয়ে কোন গাড়িতে বিক্রি ও ইনস্টল হয়েছে তার পরিপূর্ণ লাইভ রেকর্ড।
                </p>
              </div>
            </div>

            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/40 self-start sm:self-auto">
              মোট ইনস্টল্ড: {salesAndInstallRecords.length} টি
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold bg-slate-950/60">
                  <th className="p-3">তারিখ ও কাস্টমার</th>
                  <th className="p-3">গাড়ির প্লেট ও মডেল</th>
                  <th className="p-3">ইনস্টল্ড ট্র্যাকার IMEI</th>
                  <th className="p-3">পেয়ার্ড সিম ও অপারেটর</th>
                  <th className="p-3">প্যাকেজ ও কল রাউটিং</th>
                  <th className="p-3 text-right">সার্টিফিকেট ও অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {salesAndInstallRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500 text-xs">
                      📑 বর্তমানে কোনো সক্রিয় ইনস্টলেশন রেকর্ড নেই। সেলস পোর্টাল বা ট্র্যাকার অ্যাসাইন করার সাথে সাথে এখানে রেকর্ড তৈরি হবে।
                    </td>
                  </tr>
                ) : (
                  salesAndInstallRecords.map(({ device, sim }, idx) => (
                    <tr key={idx} className="hover:bg-slate-850/50 transition">
                      <td className="p-3">
                        <div className="font-bold text-white text-xs">{device.assignedCustomerName || 'গ্রাহক'}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{device.assignedCustomerPhone || '01711-xxxxxx'}</div>
                        <div className="text-[9px] text-slate-500 mt-0.5">{device.addedDate || 'আজ'}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-emerald-400 text-xs">{device.assignedVehiclePlate}</div>
                        <div className="text-[10px] text-slate-300">{device.notes || 'Smart Vehicle'}</div>
                      </td>

                      <td className="p-3">
                        <div className="font-mono font-bold text-white text-xs">{device.imei}</div>
                        <div className="text-[10px] text-slate-400">{device.model} ({device.protocol})</div>
                      </td>

                      <td className="p-3">
                        <div className="font-mono font-bold text-purple-300 text-xs">{sim?.msisdn || device.pairedSimNumber || 'SIM Paired'}</div>
                        <div className="text-[10px] text-slate-400 uppercase">{sim?.operator || 'robi'} • {sim?.simType || 'M2M'}</div>
                      </td>

                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          📦 অল-ইন-ওয়ান
                        </span>
                        <div className="text-[9.5px] text-emerald-400 mt-1 flex items-center space-x-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>সার্ভার লাইভ সিঙ্ক</span>
                        </div>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedCertItem({ device, sim })}
                            className="px-2.5 py-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 text-[10px] font-bold transition flex items-center space-x-1"
                            title="BRTA VTS ডিজিটাল কমপ্লায়েন্স সার্টিফিকেট"
                          >
                            <FileText className="w-3 h-3" />
                            <span>VTS সার্টিফিকেট</span>
                          </button>

                          <button
                            onClick={() => unbindDeviceFromVehicle(device.id)}
                            className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition"
                            title="আনবাইন্ড"
                          >
                            আনবাইন্ড
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔄 TAB: REVERSE LOGISTICS, RETURNS & RMA CUSTODY GATEWAY                  */}
      {/* ========================================================================= */}
      {activeTab === 'returns_rma' && (
        <div className="bg-slate-900 border border-amber-900/40 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4 animate-in fade-in">
          
          {/* Header & Sub-filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-md">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  🔄 রিভার্স লজিস্টিক্স, রিটার্ন ও কাস্টডি অডিট লেজার
                </h3>
                <p className="text-[10.5px] text-slate-400">
                  ৪-চ্যানেল রিসিভিং (টেকনিশিয়ান, সেন্ট্রাল অফিস, সাপোর্ট ল্যাব, পার্টনার শপ) ও ডিজিটাল কাস্টডি ট্র্যাকিং।
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAddReturnOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs shadow-md shadow-amber-600/30 flex items-center space-x-1.5 transition active:scale-95 shrink-0 self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন রিটার্ন এন্ট্রি</span>
            </button>
          </div>

          {/* 4 Inward Channels Filter Pills */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80 overflow-x-auto">
            {[
              { id: 'all', label: `সবগুলো রিটার্ন (${returnLogs.length})` },
              { id: 'technician', label: `👨‍🔧 টেকনিশিয়ান রিকভারি (${metrics.techReturns})` },
              { id: 'support_qc', label: `🧪 সাপোর্ট / QC ল্যাব (${metrics.qcReturns})` },
              { id: 'partner_shop', label: `🏪 পার্টনার শপ কাউন্টার (${metrics.shopReturns})` },
              { id: 'central_office', label: `🏢 সেন্ট্রাল হেড অফিস (${metrics.centralReturns})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setChannelFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 shrink-0 ${
                  channelFilter === tab.id
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/80 text-[10.5px] font-black uppercase text-slate-400">
                  <th className="p-3">চালান ও তারিখ</th>
                  <th className="p-3">আইটেম ও পূর্বের বাহন</th>
                  <th className="p-3">রিটার্ন চ্যানেল ও মালিকানা</th>
                  <th className="p-3">বর্তমান কাস্টডি ও লোকেশন</th>
                  <th className="p-3">কোয়ালিটি শর্ত</th>
                  <th className="p-3">রেজোলিউশন ও রিফান্ড</th>
                  <th className="p-3 text-right">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredReturns.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 text-xs">
                      🔍 নির্বাচিত চ্যানেলে কোনো রিটার্ন রেকর্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredReturns.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-3">
                        <div className="font-mono font-bold text-amber-300 text-xs flex items-center space-x-1">
                          <span>{item.challanNumber}</span>
                          <button 
                            onClick={() => handleCopy(item.challanNumber, item.id)}
                            className="p-1 hover:text-white text-slate-500"
                            title="কপি চালান"
                          >
                            {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.returnDate}</div>
                      </td>

                      <td className="p-3">
                        {item.imei && (
                          <div className="font-mono font-bold text-white text-xs">
                            IMEI: {item.imei}
                          </div>
                        )}
                        {item.deviceModel && (
                          <div className="text-[10px] text-indigo-300 font-medium">{item.deviceModel}</div>
                        )}
                        {item.simMsisdn && (
                          <div className="text-[10px] text-purple-300 font-mono">SIM: {item.simMsisdn}</div>
                        )}
                        {item.previousVehiclePlate && (
                          <div className="text-[9.5px] text-slate-400 mt-0.5 font-mono">
                            🚗 {item.previousVehiclePlate} ({item.previousCustomerName || 'Customer'})
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold border ${
                          item.channel === 'technician' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          item.channel === 'support_qc' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          item.channel === 'partner_shop' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                        }`}>
                          <span>
                            {item.channel === 'technician' ? '👨‍🔧 টেকনিশিয়ান' :
                             item.channel === 'support_qc' ? '🧪 QC ল্যাব' :
                             item.channel === 'partner_shop' ? '🏪 পার্টনার শপ' : '🏢 সেন্ট্রাল HQ'}
                          </span>
                        </span>
                        <div className="mt-1">
                          <span className="text-[9px] font-mono text-slate-400">
                            মালিক: {item.ownership === 'easytracker_central' ? '🏢 EasyTracker HQ' : `🏪 ${item.partnerName || 'Partner'}`}
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-200 text-xs flex items-center space-x-1">
                          <Package className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{item.currentCustodian}</span>
                        </div>
                        {item.technicianName && (
                          <div className="text-[9.5px] text-slate-400 mt-0.5">টেক: {item.technicianName}</div>
                        )}
                      </td>

                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          item.condition === 'working_good' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                          item.condition === 'needs_inspection' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                          item.condition === 'hardware_damaged' ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' :
                          'bg-purple-500/20 text-purple-300 border-purple-500/40'
                        }`}>
                          {item.condition === 'working_good' ? '✅ ত্রুটিমুক্ত / Good' :
                           item.condition === 'needs_inspection' ? '⚠️ পরীক্ষা প্রয়োজন' :
                           item.condition === 'hardware_damaged' ? '❌ ড্যামেজ / ত্রুটিযুক্ত' : '📶 সিম স্লিপ মোড'}
                        </span>
                        {item.qcNotes && (
                          <div className="text-[9.5px] text-slate-400 mt-1 max-w-xs truncate" title={item.qcNotes}>
                            {item.qcNotes}
                          </div>
                        )}
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-xs text-white">
                          {item.resolution === 'restocked_reusable' ? '🔄 রি-ইনস্টল স্টকে যুক্ত' :
                           item.resolution === 'refunded_credit' ? '💳 ওয়ালেটে রিফান্ড/ক্রেডিট' :
                           item.resolution === 'rma_supplier' ? '🛠️ RMA ওয়ারেন্টি ক্লেইম' :
                           item.resolution === 'scrapped' ? '🗑️ স্ক্র্যাপ / অপচয়' : '⏳ বিবেচনাধীন'}
                        </div>
                        {item.refundAmountBdt ? (
                          <div className="text-[10px] text-emerald-400 font-mono font-bold mt-0.5">
                            + ৳ {item.refundAmountBdt.toLocaleString()}
                          </div>
                        ) : null}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => setSelectedReturnSlip(item)}
                            className="px-2.5 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 text-[10.5px] font-bold transition flex items-center space-x-1"
                            title="চালান ও গেট পাস স্লিপ"
                          >
                            <FileText className="w-3 h-3" />
                            <span>চালান স্লিপ</span>
                          </button>

                          <button
                            onClick={() => setSelectedReturnToResolve(item)}
                            className="px-2 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10.5px] font-bold transition"
                            title="রেজোলিউশন আপডেট"
                          >
                            ⚙️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB 4: SCRAP & WASTAGE LEDGER                                         */}
      {/* ========================================================================= */}
      {activeTab === 'scrap' && (
        <div className="bg-slate-900 border border-rose-900/40 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-rose-400 flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>ড্যামেজ ও অপচয় লেজার (Damaged Trackers & Lost SIMs)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">অডিট ও ডিসপোজাল হিস্ট্রি</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deviceInventory.filter(d => isBelongingToScope(d.partnerId) && d.status === 'damaged_scrap').map(d => (
              <div key={d.id} className="p-3 rounded-2xl bg-slate-950 border border-rose-900/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{d.model} ({d.imei})</div>
                  <div className="text-[10px] text-slate-400">{d.notes || 'ওয়াটার ড্যামেজ / শর্ট সার্কিট'}</div>
                </div>
                <button
                  onClick={() => updateDeviceInventoryItem(d.id, { status: 'returned_reinstall', notes: 'সার্ভিসিংয়ের পর ঠিক হয়েছে' })}
                  className="px-2 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold"
                >
                  সার্ভিসিং করে রিকভার
                </button>
              </div>
            ))}

            {simInventory.filter(s => isBelongingToScope(s.partnerId) && s.status === 'damaged_lost').map(s => (
              <div key={s.id} className="p-3 rounded-2xl bg-slate-950 border border-rose-900/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">SIM: {s.msisdn} ({s.operator})</div>
                  <div className="text-[10px] text-slate-400">{s.notes || 'সিম ক্ষতিগ্রস্ত'}</div>
                </div>
                <button
                  onClick={() => updateSimInventoryItem(s.id, { status: 'in_stock_ready', notes: 'রিপ্লেসড সিম রেডি' })}
                  className="px-2 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold"
                >
                  নতুন সিমে রিপ্লেস
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL: ADD DEVICE (HARDWARE INWARD)                                    */}
      {/* ========================================================================= */}
      {isAddDeviceOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">নতুন হার্ডওয়্যার ডিভাইস ইনওয়ার্ড</h3>
                  <p className="text-[10px] text-slate-400">ট্র্যাকার ইনভেন্টরি স্টকে নতুন আইটেম যুক্ত করুন</p>
                </div>
              </div>
              <button onClick={() => setIsAddDeviceOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addDeviceToInventory({
                ...newDevice,
                partnerId: partnerIdFilter || user?.partnerId || 'PRT-8801'
              });
              setIsAddDeviceOpen(false);
            }} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">IMEI নম্বর (১৫ ডিজিট) *</label>
                  <input
                    type="text"
                    required
                    value={newDevice.imei}
                    onChange={(e) => setNewDevice({ ...newDevice, imei: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">বারকোড / ট্যাগ আইডি *</label>
                  <input
                    type="text"
                    required
                    value={newDevice.barcode}
                    onChange={(e) => setNewDevice({ ...newDevice, barcode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">ম্যানুফ্যাকচারার ও মডেল *</label>
                  <input
                    type="text"
                    required
                    value={newDevice.model}
                    onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সার্ভার প্রোটোকল *</label>
                  <select
                    value={newDevice.protocol}
                    onChange={(e) => setNewDevice({ ...newDevice, protocol: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  >
                    <option value="gt06">gt06 (Concox / Micodus / Jimi)</option>
                    <option value="teltonika">teltonika (FMB920, FMC130)</option>
                    <option value="h02">h02 (Mini Hidden Relay)</option>
                    <option value="wialon">wialon (Standard IPS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সিরিয়াল নম্বর (S/N)</label>
                  <input
                    type="text"
                    value={newDevice.serialNumber}
                    onChange={(e) => setNewDevice({ ...newDevice, serialNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">ক্রয়মূল্য (৳)</label>
                  <input
                    type="number"
                    value={newDevice.purchasePriceBdt}
                    onChange={(e) => setNewDevice({ ...newDevice, purchasePriceBdt: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddDeviceOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  ইনভেন্টরিতে সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL: ADD SIM (SIM INWARD)                                           */}
      {/* ========================================================================= */}
      {isAddSimOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">নতুন টেলিমেটিক্স সিম ইনওয়ার্ড</h3>
                  <p className="text-[10px] text-slate-400">সিম কার্ড ইনভেন্টরিতে নতুন আইওটি সিম এন্ট্রি করুন</p>
                </div>
              </div>
              <button onClick={() => setIsAddSimOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addSimToInventory({
                ...newSim,
                partnerId: partnerIdFilter || user?.partnerId || 'PRT-8801'
              });
              setIsAddSimOpen(false);
            }} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সিম মোবাইল নম্বর (MSISDN) *</label>
                  <input
                    type="text"
                    required
                    value={newSim.msisdn}
                    onChange={(e) => setNewSim({ ...newSim, msisdn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">অপারেটর *</label>
                  <select
                    value={newSim.operator}
                    onChange={(e) => setNewSim({ ...newSim, operator: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-bold text-white focus:outline-none uppercase"
                  >
                    <option value="robi">Robi Axiata</option>
                    <option value="grameenphone">Grameenphone</option>
                    <option value="banglalink">Banglalink</option>
                    <option value="teletalk">Teletalk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সিম চিপ নম্বর (ICCID) *</label>
                  <input
                    type="text"
                    required
                    value={newSim.simBarcode}
                    onChange={(e) => setNewSim({ ...newSim, simBarcode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সিম টাইপ *</label>
                  <select
                    value={newSim.simType}
                    onChange={(e) => setNewSim({ ...newSim, simType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  >
                    <option value="m2m_general">M2M General (Data Only)</option>
                    <option value="m2m_special_voice">M2M Special (Voice & Calls)</option>
                    <option value="consumer_regular">Consumer Regular</option>
                    <option value="byos_customer_sim">BYOS (Customer's Own SIM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">PUK কোড *</label>
                  <input
                    type="text"
                    required
                    value={newSim.puk1}
                    onChange={(e) => setNewSim({ ...newSim, puk1: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">APN নেম</label>
                  <input
                    type="text"
                    value={newSim.apn}
                    onChange={(e) => setNewSim({ ...newSim, apn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSimOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                >
                  সিম সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. MODAL: INDIVIDUAL DEVICE DETAIL INSPECTOR                             */}
      {/* ========================================================================= */}
      {selectedDeviceDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">ইন্ডিভিজুয়াল ডিভাইস প্রোফাইল</h3>
                  <p className="text-[10px] text-slate-400">ID: {selectedDeviceDetail.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDeviceDetail(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">IMEI:</span>
                  <span className="font-mono font-bold text-white">{selectedDeviceDetail.imei}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">বারকোড ট্যাগ:</span>
                  <span className="font-mono font-bold text-indigo-300">{selectedDeviceDetail.barcode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">মডেল ও প্রোটোকল:</span>
                  <span className="font-bold text-slate-200">{selectedDeviceDetail.model} ({selectedDeviceDetail.protocol})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">সিরিয়াল S/N:</span>
                  <span className="font-mono text-slate-300">{selectedDeviceDetail.serialNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ক্রয়মূল্য:</span>
                  <span className="font-bold text-emerald-400">৳ {selectedDeviceDetail.purchasePriceBdt}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">স্ট্যাটাস:</span>
                  <span className="font-bold text-indigo-300">{selectedDeviceDetail.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">অ্যাসাইনড গাড়ি:</span>
                  <span className="font-bold text-white">{selectedDeviceDetail.assignedVehiclePlate || 'নেই'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">পেয়ার্ড সিম:</span>
                  <span className="font-mono text-purple-300">{selectedDeviceDetail.pairedSimNumber || 'নেই'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">গ্রাহক:</span>
                  <span className="text-slate-200">{selectedDeviceDetail.assignedCustomerName || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedDeviceDetail(null)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12. MODAL: INDIVIDUAL SIM DETAIL INSPECTOR                                */}
      {/* ========================================================================= */}
      {selectedSimDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">ইন্ডিভিজুয়াল সিম প্রোফাইল</h3>
                  <p className="text-[10px] text-slate-400">ID: {selectedSimDetail.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedSimDetail(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-white">{selectedSimDetail.msisdn}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">অপারেটর ও টাইপ:</span>
                  <span className="font-bold uppercase text-purple-300">{selectedSimDetail.operator} ({selectedSimDetail.simType})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ICCID চিপ নম্বর:</span>
                  <span className="font-mono text-slate-300">{selectedSimDetail.simBarcode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PUK-1 কোড:</span>
                  <span className="font-mono text-amber-300 font-bold">{selectedSimDetail.puk1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">APN নেম:</span>
                  <span className="font-mono text-slate-300">{selectedSimDetail.apn}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">পেয়ার্ড ডিভাইস IMEI:</span>
                  <span className="font-mono font-bold text-emerald-400">{selectedSimDetail.pairedImei || 'উন্মুক্ত'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">গাড়ির প্লেট:</span>
                  <span className="font-bold text-white">{selectedSimDetail.assignedVehiclePlate || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedSimDetail(null)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 13. MODAL: BRTA VTS COMPLIANCE CERTIFICATE SLIP                          */}
      {/* ========================================================================= */}
      {selectedCertItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">BRTA ডিজিটাল VTS ইনস্টলেশন সার্টিফিকেট</h3>
                  <p className="text-[10px] text-slate-400">বাংলাদেশ টেলিকম ও বিআরটিএ কমপ্লায়েন্স প্রত্যয়নপত্র</p>
                </div>
              </div>
              <button onClick={() => setSelectedCertItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-emerald-500/30 rounded-2xl space-y-3 text-xs">
              <div className="text-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-emerald-300 text-sm">EasyTracker Telematics VTS Slip</h4>
                <p className="text-[10px] text-slate-400">Vehicle Tracking System Installation & Telemetry Cert</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div><span className="text-slate-500">গ্রাহক:</span> <strong className="text-white">{selectedCertItem.device.assignedCustomerName || 'সম্মানিত গ্রাহক'}</strong></div>
                <div><span className="text-slate-500">মোবাইল:</span> <strong className="text-white font-mono">{selectedCertItem.device.assignedCustomerPhone || '01711-223344'}</strong></div>
                <div><span className="text-slate-500">গাড়ি প্লেট:</span> <strong className="text-emerald-400">{selectedCertItem.device.assignedVehiclePlate}</strong></div>
                <div><span className="text-slate-500">তারিখ:</span> <strong className="text-slate-300">{selectedCertItem.device.addedDate}</strong></div>
                <div><span className="text-slate-500">ডিভাইস IMEI:</span> <strong className="text-white font-mono">{selectedCertItem.device.imei}</strong></div>
                <div><span className="text-slate-500">বারকোড:</span> <strong className="text-indigo-300 font-mono">{selectedCertItem.device.barcode}</strong></div>
                <div><span className="text-slate-500">সিম নম্বর:</span> <strong className="text-purple-300 font-mono">{selectedCertItem.sim?.msisdn || selectedCertItem.device.pairedSimNumber}</strong></div>
                <div><span className="text-slate-500">অপারেটর:</span> <strong className="text-slate-300 uppercase">{selectedCertItem.sim?.operator || 'robi'} (M2M)</strong></div>
              </div>

              <div className="p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-[10px] text-emerald-200">
                ✅ এই যানটিতে EasyTracker সার্টিফাইড টেলিমেটিক্স জিপিএস ট্র্যাকার ও সিকিউরড এম২এম সিম সফলভাবে ইনস্টল করা হয়েছে।
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => setSelectedCertItem(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-emerald-600/30"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট / ডাউনলোড স্লিপ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 14. SCANNER SIMULATOR MODAL                                               */}
      {/* ========================================================================= */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 animate-pulse">
              <Scan className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-white">লাইভ বারকোড ও কিউআর স্ক্যানার</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ডিভাইস প্যাকেট বা সিমের পেছনের বারকোডের দিকে ক্যামেরা ধরুন অথবা কোড টাইপ করুন:
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="যেমন: 354778343153865 বা 01811-223344"
                className="w-full bg-slate-950 border border-indigo-500/50 rounded-xl p-2.5 font-mono text-center text-xs text-white font-bold focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleBarcodeScanned('354778343153865')}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-indigo-300 hover:border-indigo-500"
                >
                  ⚡ ডেমো IMEI স্ক্যান
                </button>
                <button
                  onClick={() => handleBarcodeScanned('01811-223344')}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-purple-300 hover:border-purple-500"
                >
                  ⚡ ডেমো SIM স্ক্যান
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsScanning(false)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 15. MODAL: INITIATE NEW RETURN & CUSTODY CHALLAN                          */}
      {/* ========================================================================= */}
      {isAddReturnOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in overflow-y-auto">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 w-full max-w-xl shadow-2xl space-y-4 animate-in zoom-in-95 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-md">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">নতুন রিটার্ন ও কাস্টডি চালান এন্ট্রি</h3>
                  <p className="text-[10.5px] text-slate-400">৪-চ্যানেল রিভার্স লজিস্টিক্স ও রিকভারি হ্যান্ডওভার</p>
                </div>
              </div>
              <button onClick={() => setIsAddReturnOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                initiateReturnLog(newReturn);
                setIsAddReturnOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              {/* STEP 1: SELECT RETURN INWARD CHANNEL (4 OPTIONS) */}
              <div>
                <label className="text-[11px] font-black text-amber-300 uppercase tracking-wider block mb-2">
                  ১. রিটার্ন ইনওয়ার্ড চ্যানেল নির্বাচন করুন:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'technician' as ReturnChannel, label: '👨‍🔧 টেকনিশিয়ান', sub: 'ফিল্ড রিকভারি ও আনবাইন্ড', color: 'border-amber-500 bg-amber-950/40' },
                    { id: 'support_qc' as ReturnChannel, label: '🧪 QC ল্যাব', sub: 'সাপোর্ট টেস্ট ও RMA ক্লেইম', color: 'border-rose-500 bg-rose-950/40' },
                    { id: 'partner_shop' as ReturnChannel, label: '🏪 পার্টনার শপ', sub: 'ফ্র্যাঞ্চাইজি কাউন্টার রিটার্ন', color: 'border-emerald-500 bg-emerald-950/40' },
                    { id: 'central_office' as ReturnChannel, label: '🏢 সেন্ট্রাল HQ', sub: 'হেড অফিস ওয়্যারহাউজ ইনওয়ার্ড', color: 'border-cyan-500 bg-cyan-950/40' },
                  ].map(c => (
                    <div
                      key={c.id}
                      onClick={() => {
                        let autoCustodian = newReturn.currentCustodian;
                        if (c.id === 'technician') autoCustodian = 'Tech: জাহিদুল ইসলাম (Field Bag)';
                        else if (c.id === 'support_qc') autoCustodian = 'EasyTracker QC Lab (Testing Room)';
                        else if (c.id === 'partner_shop') autoCustodian = 'Partner Outlet Counter';
                        else autoCustodian = 'EasyTracker Central Warehouse (HQ Shelf)';

                        setNewReturn({ ...newReturn, channel: c.id, currentCustodian: autoCustodian });
                      }}
                      className={`p-2.5 rounded-2xl border cursor-pointer transition text-left space-y-1 ${
                        newReturn.channel === c.id 
                          ? `${c.color} ring-2 ring-amber-500/50 shadow-md` 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-white">{c.label}</div>
                      <div className="text-[9.5px] text-slate-400">{c.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STEP 2: ITEM TYPE & HARDWARE DETAILS */}
              <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-300 uppercase">২. আইটেম টাইপ ও বিবরণী</span>
                  <div className="flex items-center space-x-2">
                    {(['bundle', 'device', 'sim'] as ReturnItemType[]).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setNewReturn({ ...newReturn, itemType: t })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition ${
                          newReturn.itemType === t 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {t === 'bundle' ? '📦+📶 বান্ডেল' : t === 'device' ? '📦 ট্র্যাকার' : '📶 সিম'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(newReturn.itemType === 'bundle' || newReturn.itemType === 'device') && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">ডিভাইস IMEI (15-Digit)</label>
                      <input
                        type="text"
                        value={newReturn.imei || ''}
                        onChange={(e) => setNewReturn({ ...newReturn, imei: e.target.value })}
                        placeholder="যেমন: 864720058291088"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-white focus:outline-none"
                      />
                    </div>
                  )}

                  {(newReturn.itemType === 'bundle' || newReturn.itemType === 'sim') && (
                    <div>
                      <label className="text-[10px] font-bold text-slate-300 block mb-1">সিম নম্বর (MSISDN)</label>
                      <input
                        type="text"
                        value={newReturn.simMsisdn || ''}
                        onChange={(e) => setNewReturn({ ...newReturn, simMsisdn: e.target.value })}
                        placeholder="যেমন: 01811-223344"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-white focus:outline-none"
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">পূর্বের গাড়ি প্লেট (যদি থাকে)</label>
                    <input
                      type="text"
                      value={newReturn.previousVehiclePlate || ''}
                      onChange={(e) => setNewReturn({ ...newReturn, previousVehiclePlate: e.target.value })}
                      placeholder="যেমন: DHAKA METRO-HA 12-3456"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">গ্রাহকের নাম ও ফোন</label>
                    <input
                      type="text"
                      value={newReturn.previousCustomerName || ''}
                      onChange={(e) => setNewReturn({ ...newReturn, previousCustomerName: e.target.value })}
                      placeholder="গ্রাহকের নাম"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: OWNERSHIP & CUSTODIAN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">আসল মালিকানা (Ownership)</label>
                  <select
                    value={newReturn.ownership}
                    onChange={(e) => setNewReturn({ ...newReturn, ownership: e.target.value as ReturnOwnership })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  >
                    <option value="partner">🏪 পার্টনার / ফ্র্যাঞ্চাইজি স্টক (Partner Owned)</option>
                    <option value="easytracker_central">🏢 EasyTracker সেন্ট্রাল ওয়্যারহাউজ (Central Stock)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">বর্তমান কাস্টডি ও অবস্থান (Current Custodian)</label>
                  <input
                    type="text"
                    value={newReturn.currentCustodian}
                    onChange={(e) => setNewReturn({ ...newReturn, currentCustodian: e.target.value })}
                    placeholder="যেমন: Tech: জাহিদুল ইসলাম (Field Bag)"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* STEP 4: CONDITION & RESOLUTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কোয়ালিটি ও শর্ত (QC Status)</label>
                  <select
                    value={newReturn.condition}
                    onChange={(e) => setNewReturn({ ...newReturn, condition: e.target.value as ReturnCondition })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  >
                    <option value="working_good">✅ ত্রুটিমুক্ত / Good (রি-ইনস্টল উপযোগী)</option>
                    <option value="needs_inspection">⚠️ প্রাথমিক টেস্ট ও পরীক্ষা প্রয়োজন</option>
                    <option value="hardware_damaged">❌ হার্ডওয়্যার ড্যামেজ / ত্রুটিযুক্ত</option>
                    <option value="sim_sleep">📶 সিম সাসপেন্ড / স্লিপ মোড</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">গৃহীত পদক্ষেপ (Resolution)</label>
                  <select
                    value={newReturn.resolution}
                    onChange={(e) => setNewReturn({ ...newReturn, resolution: e.target.value as ReturnResolution })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  >
                    <option value="restocked_reusable">🔄 রি-ইনস্টল স্টকে জমা (Restock Reusable)</option>
                    <option value="refunded_credit">💳 পার্টনার লেজারে রিফান্ড / ক্রেডিট</option>
                    <option value="rma_supplier">🛠️ ম্যানুফ্যাকচারার RMA ওয়ারেন্টি ক্লেইম</option>
                    <option value="scrapped">🗑️ স্ক্র্যাপ / ড্যামেজ অপচয়</option>
                  </select>
                </div>
              </div>

              {newReturn.resolution === 'refunded_credit' && (
                <div>
                  <label className="text-[10.5px] font-bold text-emerald-400 block mb-1">রিফান্ড / ক্রেডিট টাকার পরিমাণ (BDT)</label>
                  <input
                    type="number"
                    value={newReturn.refundAmountBdt || 0}
                    onChange={(e) => setNewReturn({ ...newReturn, refundAmountBdt: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl p-2 font-mono text-emerald-300 font-bold focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কিউসি নোট / মন্তব্য</label>
                <textarea
                  value={newReturn.qcNotes || ''}
                  onChange={(e) => setNewReturn({ ...newReturn, qcNotes: e.target.value })}
                  placeholder="ডিভাইসের অবস্থা, আনবাইন্ডের কারণ বা হ্যান্ডওভারের বিবরণ..."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddReturnOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-extrabold shadow-lg shadow-amber-600/30 flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>চালান ইস্যু ও সেভ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 16. MODAL: DIGITAL RETURN HANDOVER GATE PASS & CHALLAN SLIP               */}
      {/* ========================================================================= */}
      {selectedReturnSlip && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">ডিজিটাল রিটার্ন ও কাস্টডি হ্যান্ডওভার চালান</h3>
                  <p className="text-[10px] text-slate-400">Reverse Logistics & Custody Gate Pass</p>
                </div>
              </div>
              <button onClick={() => setSelectedReturnSlip(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-3 text-xs">
              <div className="text-center border-b border-slate-800 pb-2">
                <h4 className="font-extrabold text-amber-300 text-sm">EasyTracker Reverse Logistics Gate Pass</h4>
                <div className="text-[11px] font-mono font-bold text-white mt-0.5">চালান নং: {selectedReturnSlip.challanNumber}</div>
                <p className="text-[9.5px] text-slate-400">হ্যান্ডওভার তারিখ: {selectedReturnSlip.returnDate}</p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                <div><span className="text-slate-500">ইনওয়ার্ড চ্যানেল:</span> <strong className="text-amber-300 uppercase">{selectedReturnSlip.channel}</strong></div>
                <div><span className="text-slate-500">আসল মালিকানা:</span> <strong className="text-white">{selectedReturnSlip.ownership === 'easytracker_central' ? 'EasyTracker HQ' : 'Partner Franchise'}</strong></div>
                <div><span className="text-slate-500">বর্তমান কাস্টডি:</span> <strong className="text-emerald-400">{selectedReturnSlip.currentCustodian}</strong></div>
                <div><span className="text-slate-500">হ্যান্ডওভার ব্যক্তি:</span> <strong className="text-slate-300">{selectedReturnSlip.technicianName || 'Authorized Staff'}</strong></div>
                {selectedReturnSlip.imei && (
                  <div><span className="text-slate-500">ডিভাইস IMEI:</span> <strong className="text-white font-mono">{selectedReturnSlip.imei}</strong></div>
                )}
                {selectedReturnSlip.simMsisdn && (
                  <div><span className="text-slate-500">সিম নম্বর:</span> <strong className="text-purple-300 font-mono">{selectedReturnSlip.simMsisdn}</strong></div>
                )}
                {selectedReturnSlip.previousVehiclePlate && (
                  <div><span className="text-slate-500">পূর্বের গাড়ি:</span> <strong className="text-slate-200 font-mono">{selectedReturnSlip.previousVehiclePlate}</strong></div>
                )}
                <div><span className="text-slate-500">গৃহীত পদক্ষেপ:</span> <strong className="text-amber-300">{selectedReturnSlip.resolution}</strong></div>
              </div>

              {selectedReturnSlip.qcNotes && (
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px]">
                  <span className="text-slate-400 block mb-0.5 font-bold">কিউসি ও টেস্টিং নোট:</span>
                  <span className="text-slate-200">{selectedReturnSlip.qcNotes}</span>
                </div>
              )}

              <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/20 text-[10px] text-amber-200 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>এই চালানের মাধ্যমে ডিভাইস ও সিমের কাস্টডি দায়িত্ব সফলভাবে রেকর্ড ও ট্রান্সফার করা হলো।</span>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-1 border-t border-slate-800">
              <button
                onClick={() => setSelectedReturnSlip(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-amber-600/30"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>প্রিন্ট / চালান ডাউনলোড</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 17. MODAL: RESOLVE & UPDATE RETURN DISPATCH                               */}
      {/* ========================================================================= */}
      {selectedReturnToResolve && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-md shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-white">রিটার্ন রেজোলিউশন ও ফিন্যান্সিয়াল আপডেট</h3>
                <p className="text-[10px] text-slate-400">চালান: {selectedReturnToResolve.challanNumber}</p>
              </div>
              <button onClick={() => setSelectedReturnToResolve(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">সমাধান নির্বাচন (Resolution)</label>
                <select
                  defaultValue={selectedReturnToResolve.resolution}
                  id="res-select"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                >
                  <option value="restocked_reusable">🔄 রি-ইনস্টল স্টকে স্থানান্তর (Restock Reusable)</option>
                  <option value="refunded_credit">💳 পার্টনার লেজারে রিফান্ড / ক্রেডিট প্রদান</option>
                  <option value="rma_supplier">🛠️ ম্যানুফ্যাকচারার RMA ওয়ারেন্টি রিপ্লেসমেন্ট</option>
                  <option value="scrapped">🗑️ স্ক্র্যাপ / ড্যামেজ অপচয়</option>
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">রিফান্ড / ক্রেডিট ব্যালেন্স (BDT)</label>
                <input
                  type="number"
                  id="res-refund"
                  defaultValue={selectedReturnToResolve.refundAmountBdt || 0}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">আপডেটেড কিউসি নোট</label>
                <textarea
                  id="res-qc"
                  defaultValue={selectedReturnToResolve.qcNotes || ''}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setSelectedReturnToResolve(null)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  const resSelect = (document.getElementById('res-select') as HTMLSelectElement).value as ReturnResolution;
                  const resRefund = Number((document.getElementById('res-refund') as HTMLInputElement).value) || 0;
                  const resQc = (document.getElementById('res-qc') as HTMLTextAreaElement).value;
                  resolveReturnLog(selectedReturnToResolve.id, resSelect, resRefund, resQc);
                  setSelectedReturnToResolve(null);
                }}
                className="px-5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
              >
                আপডেট ও নিষ্পত্তি
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ⚡ 1-CLICK DEVICE & M2M SIM BUNDLER MODAL */}
      <DeviceSimBundlerModal
        isOpen={isBundlerModalOpen}
        onClose={() => setIsBundlerModalOpen(false)}
        initialTargetTier={isPartnerPortal ? 'b2b_partner' : 'fleet_company'}
        initialCompanyName={partnerIdFilter || ''}
      />

    </div>
  );
};
