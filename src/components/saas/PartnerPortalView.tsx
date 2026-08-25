import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Layers, 
  CreditCard, 
  Users, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowUpRight, 
  TrendingUp, 
  Cpu, 
  ExternalLink, 
  Smartphone, 
  RefreshCw, 
  Download, 
  ChevronRight, 
  Award,
  Zap,
  DollarSign,
  Briefcase,
  QrCode,
  Share2,
  Lock,
  Compass
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Device, PartnerApplication } from '../../types/traccar';

export const PartnerPortalView: React.FC = () => {
  const { 
    user, 
    devices, 
    positions, 
    approvedPartners, 
    language, 
    setActiveTab, 
    setCurrentRole, 
    setSelectedDeviceId 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'inventory' | 'finance' | 'staff' | 'profile'>('inventory');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expiring'>('all');
  const [isSlotRequestModalOpen, setIsSlotRequestModalOpen] = useState(false);
  const [slotRequestAmount, setSlotRequestAmount] = useState(25);
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  const [newDeviceImei, setNewDeviceImei] = useState('');
  const [newDevicePlate, setNewDevicePlate] = useState('');
  const [newDeviceCustomerPhone, setNewDeviceCustomerPhone] = useState('');
  const [newDeviceModel, setNewDeviceModel] = useState('Honda CB Shine 125');

  // Match current logged in partner profile
  const partnerProfile: PartnerApplication | undefined = useMemo(() => {
    return approvedPartners.find(p => 
      p.partnerId === user?.partnerId || 
      p.assignedUsername?.toLowerCase() === user?.email?.toLowerCase() ||
      p.phone === user?.email
    ) || {
      id: 'partner_default',
      partnerId: user?.partnerId || 'PRT-8801',
      applicantName: user?.name || 'Authorized Franchise Partner',
      brandName: user?.partnerBrandName || 'EasyTracker Authorized Partner Hub',
      phone: '01711-223344',
      email: user?.email || 'partner@easysoftsolution.net',
      shopName: 'উত্তরা বাইক গ্যাজেট ও জিপিএস সার্ভিসিং হাব',
      shopAddress: 'হাউজ ১২, রোড ৫, সেক্টর ৪, উত্তরা, ঢাকা',
      geoLat: 23.8683,
      geoLng: 90.3995,
      googleMapsUrl: 'https://maps.google.com/?q=23.8683,90.3995',
      district: 'ঢাকা',
      thana: 'উত্তরা',
      serviceTier: user?.serviceTier || 'all_inclusive',
      status: 'approved',
      assignedUsername: 'partner',
      desiredRoles: ['partner', 'sales', 'technician', 'customer'],
      createdAt: new Date().toISOString()
    };
  }, [approvedPartners, user]);

  // Tenant Isolated Device Fleet
  const partnerDevices = useMemo(() => {
    return devices.filter(d => 
      !user?.partnerId || 
      (d.attributes as any)?.partnerId === user?.partnerId ||
      (d.attributes as any)?.partner_id === user?.partnerId ||
      d.id <= 5
    );
  }, [devices, user]);

  // Partner Slot Allocations (4096 virtual slots)
  const totalAllocatedSlots = 50;
  const usedSlots = partnerDevices.length;
  const availableSlots = Math.max(0, totalAllocatedSlots - usedSlots);

  // Financials
  const floatingDue = 1450.00;
  const maxFloatingLimit = 10000.00;
  const dueDaysRemaining = 22;
  const monthlyCommission = 8400.00;

  // Filtered devices
  const filteredDevices = useMemo(() => {
    return partnerDevices.filter(d => {
      const matchesSearch = 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.uniqueId.includes(searchTerm) ||
        (d.attributes?.plateNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (d.phone || '').includes(searchTerm);
      
      const status = d.status || 'online';
      if (filterStatus === 'active') return matchesSearch && status === 'online';
      if (filterStatus === 'expiring') return matchesSearch && d.disabled;
      return matchesSearch;
    });
  }, [partnerDevices, searchTerm, filterStatus]);

  // Deterministic 4096 Virtual Slot Calculator
  const getVirtualSlot = (imei: string) => {
    let hash = 0;
    for (let i = 0; i < imei.length; i++) {
      hash = ((hash << 5) - hash) + imei.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash) % 4096;
  };

  return (
    <div className="space-y-4 pb-20 max-w-7xl mx-auto animate-in fade-in duration-200">
      
      {/* ========================================================================= */}
      {/* 1. BUSINESS PARTNER HEADER & BRAND BADGE                                   */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 sm:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start sm:items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {partnerProfile.brandName || partnerProfile.applicantName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {partnerProfile.serviceTier === 'all_inclusive' ? '🌟 All-Inclusive Franchise Hub' : '🏢 Dealer Network'}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                  ID: {partnerProfile.partnerId}
                </span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1 flex-wrap gap-y-1">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{partnerProfile.shopName || partnerProfile.shopAddress || 'ঢাকা'}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Phone className="w-3.5 h-3.5 text-blue-400" />
                  <span>{partnerProfile.phone}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action Hub & Role Shortcuts */}
          <div className="flex items-center space-x-2 flex-wrap gap-y-2">
            {partnerProfile.googleMapsUrl && (
              <a
                href={partnerProfile.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-700 active:scale-95 shadow-md"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === 'bn' ? 'গুগল ম্যাপে শপ' : 'Shop on Map'}</span>
              </a>
            )}

            <button
              onClick={() => {
                setCurrentRole('sales');
                setActiveTab('saas_sales');
              }}
              className="px-3 py-2 rounded-xl bg-blue-600/90 hover:bg-blue-600 text-white text-xs font-bold transition flex items-center space-x-1.5 active:scale-95 shadow-md shadow-blue-600/20"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সেলস প্যানেল' : 'Sales View'}</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('technician');
                setActiveTab('saas_technician');
              }}
              className="px-3 py-2 rounded-xl bg-amber-600/90 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center space-x-1.5 active:scale-95 shadow-md shadow-amber-600/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'টেকনিশিয়ান হাব' : 'Tech View'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. KPI SUMMARY METRIC CARDS                                               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* 1. 4096 Slot Quota */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">
              {language === 'bn' ? 'বরাদ্দকৃত স্লট' : 'Allocated Slots'}
            </span>
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-mono font-black text-indigo-400">{usedSlots}</span>
              <span className="text-xs font-bold text-slate-400">/ {totalAllocatedSlots} স্লট</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 to-blue-500 h-1.5 rounded-full"
                style={{ width: `${(usedSlots / totalAllocatedSlots) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1.5">
              <span>ব্যবহার: {((usedSlots / totalAllocatedSlots) * 100).toFixed(0)}%</span>
              <span className="text-emerald-400">খালি: {availableSlots} টি</span>
            </div>
          </div>
        </div>

        {/* 2. Active Customer Fleet */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">
              {language === 'bn' ? 'অ্যাক্টিভ কাস্টমার ফ্লিট' : 'Customer Fleet'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-black text-emerald-400">
              {partnerDevices.length} <span className="text-xs font-sans text-slate-400">টি গাড়ি</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              {language === 'bn' ? '২৪/৭ লাইভ কানেক্টেড টেলিম্যাট্রিক্স' : '24/7 Live Stream Connected'}
            </p>
          </div>
        </div>

        {/* 3. Floating Balance Due */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">
              {language === 'bn' ? 'ফ্লোটিং বকেয়া' : 'Floating Balance'}
            </span>
            <div className="p-2 rounded-xl bg-rose-600/20 text-rose-400">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-black text-rose-400">
              ৳ {floatingDue.toLocaleString()}
            </div>
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-1">
              <span>লিমিট: ৳{maxFloatingLimit.toLocaleString()}</span>
              <span className="text-amber-400">বাকি: {dueDaysRemaining} দিন</span>
            </div>
          </div>
        </div>

        {/* 4. Monthly Commission */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[11px] uppercase font-black text-slate-400 tracking-wider">
              {language === 'bn' ? 'মাসিক কমিশন ও আয়' : 'Monthly Earnings'}
            </span>
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-mono font-black text-blue-400">
              ৳ {monthlyCommission.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-400 font-bold mt-1">
              +১৫.২% গত মাসের চেয়ে বৃদ্ধি
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE SUB-TABS NAVIGATION                                        */}
      {/* ========================================================================= */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'inventory', labelBn: '📦 স্লট ও ডিভাইস ইনভেন্টরি', labelEn: 'Device Inventory', icon: Layers },
          { id: 'finance', labelBn: '💳 ফ্লোটিং লেজার ও বিলিং', labelEn: 'Finance & Ledger', icon: CreditCard },
          { id: 'staff', labelBn: '👥 স্টাফ ও টেকনিশিয়ান টিম', labelEn: 'Staff & Team', icon: Users },
          { id: 'profile', labelBn: '🎨 শপ ও ব্র্যান্ড প্রোফাইল', labelEn: 'Shop Profile', icon: Building2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-2xl font-bold text-xs transition active:scale-95 whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{language === 'bn' ? tab.labelBn : tab.labelEn}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: 4096 SLOT & DEVICE INVENTORY                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'inventory' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          
          {/* Action Bar with Search & Request Slots */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-3xl shadow-md">
            <div className="flex items-center space-x-2 flex-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={language === 'bn' ? 'IMEI, গাড়ির নম্বর বা ফোন দিয়ে খুঁজুন...' : 'Search by IMEI, Plate or Phone...'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                {(['all', 'active', 'expiring'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold transition ${
                      filterStatus === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {s === 'all' ? 'সকল' : s === 'active' ? 'অ্যাক্টিভ' : 'স্থগিত'}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsSlotRequestModalOpen(true)}
                className="px-3.5 py-2 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs transition active:scale-95 border border-indigo-500/30 flex items-center space-x-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'স্লট ক্রয়ের রিকোয়েস্ট' : 'Request Slots'}</span>
              </button>

              <button
                onClick={() => setIsAddDeviceModalOpen(true)}
                className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition active:scale-95 shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? 'নতুন ডিভাইস অনবোর্ডিং' : 'Add Device'}</span>
              </button>
            </div>
          </div>

          {/* Devices & Slots Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">ডিভাইস / গাড়ি</th>
                    <th className="p-3.5">IMEI ও সিম নম্বর</th>
                    <th className="p-3.5">৪,০৯৬ ভার্চুয়াল স্লট ID</th>
                    <th className="p-3.5">ইনজেশন সেল</th>
                    <th className="p-3.5">কাস্টমার ফোন</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">একশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredDevices.map((dev, idx) => {
                    const pos = positions[dev.id];
                    const vSlot = getVirtualSlot(dev.uniqueId || `86472005829103${idx}`);
                    return (
                      <tr key={dev.id} className="hover:bg-slate-800/40 transition">
                        <td className="p-3.5 font-bold text-white flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <div>
                            <div>{dev.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {dev.attributes?.plateNumber || 'DM HA 12-3456'}
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-mono text-slate-300">
                          <div>{dev.uniqueId}</div>
                          <div className="text-[10px] text-slate-400">{dev.phone || '+8801711223344'}</div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10.5px] font-mono font-black bg-indigo-950 text-indigo-300 border border-indigo-800">
                            Slot #{vSlot}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="text-[10.5px] font-mono font-bold text-cyan-300">
                            TRACKING_CELL_001
                          </span>
                        </td>
                        <td className="p-3.5 font-mono text-slate-300">
                          {dev.attributes?.driverPhone || '01711-223344'}
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Active Online
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              setSelectedDeviceId(dev.id);
                              setActiveTab('map');
                            }}
                            className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition inline-flex items-center space-x-1"
                          >
                            <span>ম্যাপে দেখুন</span>
                            <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: FINANCIAL LEDGER & SETTLEMENT                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'finance' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Floating Credit Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">ফ্লোটিং ক্রেডিট ব্যালেন্স</span>
                  <h3 className="text-xl font-black text-rose-400 mt-0.5">৳ {floatingDue.toLocaleString()} বকেয়া</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {dueDaysRemaining} দিন সময় বাকি
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>ব্যবহৃত ফ্লোটিং লিমিট</span>
                  <span className="font-bold text-slate-200">৳{floatingDue} / ৳{maxFloatingLimit}</span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div 
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-2 rounded-full"
                    style={{ width: `${(floatingDue / maxFloatingLimit) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-slate-200">বকেয়া পরিশোধের উপায় (bKash / Nagad / Bank):</div>
                <div className="text-slate-400">bKash Merchant: <span className="font-mono text-white">01700-000000</span> (Counter 1)</div>
                <div className="text-slate-400">ব্যাংক: City Bank A/C: <span className="font-mono text-white">1102233445501</span></div>
              </div>
            </div>

            {/* Commission Earnings Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">মাসিক মোট কমিশন</span>
                  <h3 className="text-xl font-black text-emerald-400 mt-0.5">৳ {monthlyCommission.toLocaleString()}</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  অটো-সেটেলমেন্ট সচল
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">প্রতি ডিভাইস অ্যাক্টিভেশন কমিশন:</span>
                  <span className="font-bold text-white">৳ ৫০০</span>
                </div>
                <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">মাসিক সাবস্ক্রিপশন রেভিনিউ শেয়ার:</span>
                  <span className="font-bold text-white">২০% (প্রতি গাড়িতে ৳৬০/মাস)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: STAFF & FIELD TECHNICIAN TEAM                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'staff' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>আপনার ফ্র্যাঞ্চাইজির সেলস ও টেকনিশিয়ান টিম</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'আব্দুল করিম', role: 'Chief Field Technician', phone: '01711-223344', activeJobs: 3, zone: 'উত্তরা জোন' },
                { name: 'রাকিবুল হাসান', role: 'Sales Executive', phone: '01722-334455', activeJobs: 8, zone: 'শোরুম সেলস' },
                { name: 'তানভীর আহমেদ', role: 'Installation Expert', phone: '01733-445566', activeJobs: 1, zone: 'বারিধারা / কুড়িল' }
              ].map((member, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white text-xs">{member.name}</div>
                    <div className="text-[10px] text-indigo-400 font-bold">{member.role}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{member.phone} • {member.zone}</div>
                  </div>
                  <span className="px-2 py-1 rounded-xl text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                    {member.activeJobs} কাজ চলমান
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SHOP & BRAND PROFILE                                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>ফ্র্যাঞ্চাইজি শপ ও গুগল ম্যাপস প্রোফাইল</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">দোকানের নাম / শপ নেম:</span>
                  <span className="font-bold text-white text-sm">{partnerProfile.shopName || partnerProfile.brandName}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">দোকানের পূর্ণাঙ্গ ঠিকানা:</span>
                  <span className="font-bold text-white">{partnerProfile.shopAddress || 'ঢাকা'}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">গুগল ম্যাপস কোঅর্ডিনেট:</span>
                  <span className="font-mono text-cyan-300 font-bold">{partnerProfile.geoLat || 23.8683}, {partnerProfile.geoLng || 90.3995}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">কাস্টমার অনবোর্ডিং হেল্পলাইন:</span>
                  <span className="font-mono text-emerald-400 font-bold">{partnerProfile.phone}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: REQUEST MORE SLOTS                                                 */}
      {/* ========================================================================= */}
      {isSlotRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>নতুন স্লট ক্রয়ের রিকোয়েস্ট পাঠান</span>
            </h3>
            <p className="text-xs text-slate-400">
              আপনার ফ্র্যাঞ্চাইজির জন্য অতিরিক্ত ডিভাইস স্লট অনুমোদন করতে পরিমাণ সিলেক্ট করুন:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[25, 50, 100].map(amt => (
                <button
                  key={amt}
                  onClick={() => setSlotRequestAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold transition border ${
                    slotRequestAmount === amt 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30' 
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  +{amt} স্লট
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setIsSlotRequestModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700 transition"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  alert(`ধন্যবাদ! আপনার +${slotRequestAmount} স্লটের আবেদনটি সফলভাবে কেন্দ্রীয় এডমিনের কাছে পাঠানো হয়েছে।`);
                  setIsSlotRequestModalOpen(false);
                }}
                className="flex-1 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
              >
                আবেদন জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
