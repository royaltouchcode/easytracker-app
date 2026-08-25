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
  Compass,
  Headphones,
  Home,
  Navigation,
  Check,
  Globe,
  Menu,
  X,
  Activity,
  FileSpreadsheet,
  Receipt,
  Tag,
  Boxes
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Device, PartnerRegistrationEntry, SaasRole } from '../../types/traccar';
import { EnterpriseInventoryManager } from './EnterpriseInventoryManager';

type PartnerSectionType = 
  | 'overview'
  | 'inventory'
  | 'inventory_erp'
  | 'pricing_plans'
  | 'finance'
  | 'staff'
  | 'profile';

export const PartnerPortalView: React.FC = () => {
  const { 
    user, 
    devices, 
    positions, 
    approvedPartners, 
    language, 
    setActiveTab, 
    setCurrentRole, 
    setSelectedDeviceId,
    verifyLocation,
    updatePartnerDetails
  } = useApp();

  // Active Navigation & Drawer State
  const [activeSection, setActiveSection] = useState<PartnerSectionType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expiring'>('all');
  
  // Location verification modals & states
  const [isGpsCapturing, setIsGpsCapturing] = useState(false);
  const [isManualMapModalOpen, setIsManualMapModalOpen] = useState(false);
  const [pastedMapInput, setPastedMapInput] = useState('');
  const [parsedCoords, setParsedCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  // Modals
  const [isSlotRequestModalOpen, setIsSlotRequestModalOpen] = useState(false);
  const [slotRequestAmount, setSlotRequestAmount] = useState(25);
  const [copiedLink, setCopiedLink] = useState(false);

  // Match current logged in partner profile
  const partnerProfile: PartnerRegistrationEntry = useMemo(() => {
    return approvedPartners.find(p => 
      p.partnerId === user?.partnerId || 
      p.assignedUsername?.toLowerCase() === user?.email?.toLowerCase() ||
      p.phone === user?.email
    ) || approvedPartners[0] || {
      id: 'PREG-8801',
      type: 'b2b_brand',
      partnerId: user?.partnerId || 'PRT-8801',
      applicantName: user?.name || 'Authorized Franchise Partner',
      brandName: user?.partnerBrandName || 'EasyTracker Authorized Partner Hub',
      phone: user?.email || '01711-223344',
      whatsapp: '01711-223344',
      email: user?.email || 'partner@easysoftsolution.net',
      shopName: user?.shopName || 'উত্তরা বাইক গ্যাজেট ও জিপিএস সার্ভিসিং হাব',
      fullAddress: user?.shopAddress || 'হাউজ ১২, রোড ৫, সেক্টর ৪, উত্তরা, ঢাকা',
      district: 'ঢাকা',
      thana: 'উত্তরা',
      geoLat: user?.geoLat || 23.8683,
      geoLng: user?.geoLng || 90.3995,
      googleMapsUrl: user?.googleMapsUrl || 'https://maps.google.com/?q=23.8683,90.3995',
      locationVerified: user?.locationVerified || false,
      serviceTier: user?.serviceTier || 'all_inclusive',
      status: 'approved',
      assignedUsername: 'partner',
      desiredRoles: ['partner', 'sales', 'technician', 'support', 'customer'],
      requestedServices: ['server_tracking', 'shared_technicians', 'shared_support'],
      submittedAt: '24 Aug 2026',
      maxSlotQuota: 50,
      floatingCreditLimit: 10000,
      wholesaleServerFeeMonthly: 50,
      customRetailMonthlyPrice: 350,
      customRetailYearlyPrice: 3500,
      accumulatedPartnerProfitBdt: 4500,
      settlementPayoutMethod: 'bkash',
      settlementPayoutNumber: '01711-223344'
    };
  }, [approvedPartners, user]);

  // Pricing and Auto-Settlement States
  const [pricingCategoryTab, setPricingCategoryTab] = useState<'all_inclusive' | 'server_only'>('all_inclusive');

  // All-Inclusive Rates (SIM + Data + Server)
  const [allInc1Mo, setAllInc1Mo] = useState<number>(partnerProfile.allInclusivePricing?.month1 || partnerProfile.customRetailMonthlyPrice || 350);
  const [allInc3Mo, setAllInc3Mo] = useState<number>(partnerProfile.allInclusivePricing?.month3 || 1000);
  const [allInc6Mo, setAllInc6Mo] = useState<number>(partnerProfile.allInclusivePricing?.month6 || 1900);
  const [allInc12Mo, setAllInc12Mo] = useState<number>(partnerProfile.allInclusivePricing?.month12 || partnerProfile.customRetailYearlyPrice || 3500);

  // Server-Only Rates (Own SIM / BYOS)
  const [srvOnly1Mo, setSrvOnly1Mo] = useState<number>(partnerProfile.serverOnlyPricing?.month1 || 150);
  const [srvOnly3Mo, setSrvOnly3Mo] = useState<number>(partnerProfile.serverOnlyPricing?.month3 || 450);
  const [srvOnly6Mo, setSrvOnly6Mo] = useState<number>(partnerProfile.serverOnlyPricing?.month6 || 850);
  const [srvOnly12Mo, setSrvOnly12Mo] = useState<number>(partnerProfile.serverOnlyPricing?.month12 || 1500);

  const [payoutMethodInput, setPayoutMethodInput] = useState<'bkash' | 'nagad' | 'bank'>(partnerProfile.settlementPayoutMethod || 'bkash');
  const [payoutNumberInput, setPayoutNumberInput] = useState<string>(partnerProfile.settlementPayoutNumber || partnerProfile.phone || '01711-556677');
  const [isPricingSaved, setIsPricingSaved] = useState(false);
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');

  const isLocationVerified = !!(user?.locationVerified || partnerProfile.locationVerified);

  // High-Accuracy On-Site GPS Location Capture
  const handleCaptureLiveGps = () => {
    if (!navigator.geolocation) {
      alert('আপনার ব্রাউজার বা ডিভাইসে জিপিএস লোকেশন সার্ভিস নেই। অনুগ্রহ করে গুগল ম্যাপস লিংক ব্যবহার করুন।');
      return;
    }

    setIsGpsCapturing(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));
        const mapUrl = `https://maps.google.com/?q=${lat},${lng}`;
        
        verifyLocation(
          partnerProfile.partnerId || user?.partnerId || user?.email || 'partner',
          lat,
          lng,
          partnerProfile.fullAddress,
          partnerProfile.shopName || partnerProfile.brandName,
          mapUrl
        );

        setIsGpsCapturing(false);
        alert(`✅ অভিনন্দন! আপনার দোকানের রিয়েল জিপিএস লোকেশন (${lat}, ${lng}) সফলভাবে ক্যাপচার ও ভেরিফাই হয়েছে!`);
      },
      (err) => {
        setIsGpsCapturing(false);
        console.warn('GPS Error:', err);
        alert('জিপিএস লোকেশন ক্যাপচার করতে সমস্যা হয়েছে। অনুগ্রহ করে মোবাইলের Location/GPS চালু করুন এবং পারমিশন দিন।');
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  // Parse Pasted Google Maps Link or Raw Coordinates
  const handleParseMapLink = (input: string) => {
    setPastedMapInput(input);
    const coordRegex = /(-?\d+\.\d+)[,\s]+(-?\d+\.\d+)/;
    const match = input.match(coordRegex);
    if (match) {
      setParsedCoords({ lat: parseFloat(match[1]), lng: parseFloat(match[2]) });
    } else {
      setParsedCoords(null);
    }
  };

  const handleSaveManualLocation = () => {
    if (!parsedCoords) {
      alert('অনুগ্রহ করে সঠিক গুগল ম্যাপস লিংক বা কোঅর্ডিনেট (যেমন: 23.8683, 90.3995) লিখুন!');
      return;
    }

    const mapUrl = `https://maps.google.com/?q=${parsedCoords.lat},${parsedCoords.lng}`;
    verifyLocation(
      partnerProfile.partnerId || user?.partnerId || user?.email || 'partner',
      parsedCoords.lat,
      parsedCoords.lng,
      partnerProfile.fullAddress,
      partnerProfile.shopName || partnerProfile.brandName,
      mapUrl
    );

    setIsManualMapModalOpen(false);
    alert(`✅ আপনার দোকানের গুগল ম্যাপস লোকেশন সফলভাবে ভেরিফাই ও সেভ হয়েছে!`);
  };

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
  const totalAllocatedSlots = partnerProfile.maxSlotQuota || 50;
  const usedSlots = partnerDevices.length;
  const availableSlots = Math.max(0, totalAllocatedSlots - usedSlots);

  // Financials
  const floatingDue = 1450.00;
  const maxFloatingLimit = partnerProfile.floatingCreditLimit || 10000.00;
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

  // Navigation Items
  const SIDEBAR_ITEMS: { id: PartnerSectionType; labelBn: string; labelEn: string; icon: any; badge?: string; badgeColor?: string }[] = [
    { id: 'overview', labelBn: 'ওভারভিউ ও মেট্রিক্স', labelEn: 'Overview & Metrics', icon: Building2 },
    { id: 'inventory', labelBn: 'স্লট ও কাস্টমার ভেহিক্যালস', labelEn: 'Device Inventory', icon: Layers, badge: `${usedSlots}/${totalAllocatedSlots}`, badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'inventory_erp', labelBn: 'হার্ডওয়্যার ও সিম ইনভেন্টরি', labelEn: 'Hardware & SIM ERP', icon: Cpu, badge: 'ERP', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
    { id: 'pricing_plans', labelBn: 'সাবস্ক্রিপশন প্যাকেজ ও প্রাইসিং', labelEn: 'Subscription Plans', icon: Tag, badge: 'Config', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'finance', labelBn: 'ফ্লোটিং লেজার ও পে-আউট', labelEn: 'Finance & Ledger', icon: CreditCard, badge: `৳${floatingDue}`, badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'staff', labelBn: 'স্টাফ ও টেকনিশিয়ান টিম', labelEn: 'Staff & Team', icon: Users, badge: '৩ জন', badgeColor: 'bg-purple-500/20 text-purple-300' },
    { id: 'profile', labelBn: 'শপ ও ব্র্যান্ড প্রোফাইল', labelEn: 'Shop Profile & QR', icon: QrCode, badge: isLocationVerified ? 'Verified' : 'Pending', badgeColor: isLocationVerified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300' },
  ];

  return (
    <div className="w-full h-full flex flex-row bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* Mobile Drawer Overlay Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-150"
        />
      )}

      {/* ========================================================================= */}
      {/* 1. LEFT SIDEBAR NAVIGATION (Exact Admin Layout with Slide-in Mobile Drawer)*/}
      {/* ========================================================================= */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-50 shrink-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-64 md:w-72'
        } ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 shadow-2xl z-50 w-72' : 'hidden md:flex'}`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-xs text-white truncate max-w-[150px]">
                  {partnerProfile.brandName || partnerProfile.applicantName}
                </h3>
                <span className="text-[9.5px] font-mono text-indigo-300">ID: {partnerProfile.partnerId}</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-1">
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition hidden md:block"
              title={isSidebarCollapsed ? 'মেনু বড় করুন' : 'মেনু সংকুচিত করুন'}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Menu Items */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isAct = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full p-2.5 rounded-2xl flex items-center transition active:scale-[0.98] ${
                  isAct 
                    ? 'bg-blue-600 text-white font-extrabold shadow-lg shadow-blue-600/30' 
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80 font-bold'
                } ${isSidebarCollapsed ? 'justify-center' : 'justify-between'}`}
                title={language === 'bn' ? item.labelBn : item.labelEn}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isAct ? 'text-white' : 'text-indigo-400'}`} />
                  {!isSidebarCollapsed && (
                    <span className="truncate text-xs">{language === 'bn' ? item.labelBn : item.labelEn}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge && (
                  <span className={`text-[9.5px] font-mono px-2 py-0.2 rounded-full font-bold shrink-0 ${
                    isAct ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Operational Portals Quick Switcher at Sidebar Bottom */}
        {!isSidebarCollapsed && (
          <div className="p-3 border-t border-slate-800 space-y-1 bg-slate-950/60">
            <div className="text-[9.5px] font-bold text-slate-500 uppercase px-2 mb-1">
              অপারেশনাল পোর্টাল সুইচার:
            </div>
            
            <button
              onClick={() => {
                setCurrentRole('sales');
                setActiveTab('saas_sales');
              }}
              className="w-full p-2 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white hover:bg-blue-600/20 flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                <span>💼 সেলস পোর্টাল</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={() => {
                setCurrentRole('technician');
                setActiveTab('saas_technician');
              }}
              className="w-full p-2 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white hover:bg-amber-600/20 flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>🔧 টেকনিশিয়ান হাব</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={() => {
                setCurrentRole('support');
                setActiveTab('saas_support');
              }}
              className="w-full p-2 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white hover:bg-sky-600/20 flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <Headphones className="w-3.5 h-3.5 text-sky-400" />
                <span>🎧 সাপোর্ট কেয়ার</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>

            <button
              onClick={() => {
                setCurrentRole('customer');
                setActiveTab('map');
              }}
              className="w-full p-2 rounded-xl text-left text-xs font-bold text-slate-300 hover:text-white hover:bg-emerald-600/20 flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-2">
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>🗺️ ফ্লিট লাইভ ম্যাপ</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-500" />
            </button>
          </div>
        )}
      </aside>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT AREA                                                      */}
      {/* ========================================================================= */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950">
        
        {/* Mobile Header Bar with Hamburger Button */}
        <div className="p-3 border-b border-slate-800 flex items-center justify-between md:hidden shrink-0 bg-slate-900">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold flex items-center space-x-2 border border-slate-700 active:scale-95 shadow-md"
          >
            <Menu className="w-4 h-4 text-indigo-400" />
            <span>পার্টনার মেনু</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-black text-white truncate max-w-[150px]">
              {partnerProfile.brandName || partnerProfile.applicantName}
            </span>
            <button
              onClick={() => {
                setCurrentRole('customer');
                setActiveTab('map');
              }}
              className="px-2.5 py-1 rounded-xl bg-blue-600 text-white font-bold text-[10.5px] shadow-sm"
            >
              ম্যাপ
            </button>
          </div>
        </div>

        {/* Scrollable Main Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-4 max-w-7xl w-full mx-auto">
          
          {/* Top Banner Card (Exact Admin Style) */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border border-indigo-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div className="flex items-start sm:items-center space-x-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/40 shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                      {partnerProfile.brandName || partnerProfile.applicantName}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[9.5px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {partnerProfile.serviceTier === 'all_inclusive' ? '🌟 All-Inclusive Franchise' : '🏢 Dealer Hub'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[9.5px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      ID: {partnerProfile.partnerId}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-0.5 flex-wrap gap-y-1">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{partnerProfile.shopName || partnerProfile.fullAddress || 'ঢাকা'}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Phone className="w-3.5 h-3.5 text-blue-400" />
                      <span>{partnerProfile.phone}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 shrink-0 flex-wrap">
                <button
                  onClick={() => {
                    setCurrentRole('sales');
                    setActiveTab('saas_sales');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/20 flex items-center space-x-1 transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন অনবোর্ডিং</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentRole('customer');
                    setActiveTab('map');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 flex items-center space-x-1 transition active:scale-95"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>ম্যাপে যান</span>
                </button>
              </div>
            </div>
          </div>

          {/* Mandatory Location Verification Alert Card (If pending) */}
          {!isLocationVerified && (
            <div className="bg-gradient-to-r from-amber-950/90 via-slate-900 to-rose-950/80 border border-amber-500/60 rounded-3xl p-4 shadow-xl space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start space-x-3">
                  <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-amber-300">
                      দোকানের রিয়েল গুগল ম্যাপ লোকেশন ভেরিফিকেশন প্রয়োজন!
                    </h3>
                    <p className="text-[11px] text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
                      কাস্টমার যেন সরাসরি আপনার দোকানে পৌঁছাতে পারে, তাই শপে দাঁড়িয়ে লাইভ জিপিএস ক্যাপচার করুন অথবা গুগল ম্যাপস লিংক প্রদান করুন।
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 pt-1 flex-wrap gap-y-2">
                <button
                  onClick={handleCaptureLiveGps}
                  disabled={isGpsCapturing}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition active:scale-95"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isGpsCapturing ? 'animate-spin' : ''}`} />
                  <span>{isGpsCapturing ? 'জিপিএস ক্যাপচার হচ্ছে...' : '📍 বর্তমান দোকানের রিয়েল জিপিএস ক্যাপচার'}</span>
                </button>

                <button
                  onClick={() => setIsManualMapModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs border border-slate-700 flex items-center space-x-1.5 transition active:scale-95"
                >
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>📋 গুগল ম্যাপস লিংক বা কোঅর্ডিনেট পেস্ট করুন</span>
                </button>
              </div>
            </div>
          )}

          {/* 4 Metric Bento Cards (Exact Admin Style) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. 4096 Slot Quota */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10.5px] uppercase font-black text-slate-400 tracking-wider">
                  বরাদ্দকৃত স্লট
                </span>
                <div className="p-1.5 rounded-xl bg-indigo-600/20 text-indigo-400">
                  <Layers className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline space-x-1.5">
                  <span className="text-2xl font-mono font-black text-indigo-400">{usedSlots}</span>
                  <span className="text-xs font-bold text-slate-400">/ {totalAllocatedSlots} স্লট</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-indigo-500 to-blue-500 h-1.5 rounded-full"
                    style={{ width: `${(usedSlots / totalAllocatedSlots) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-1">
                  <span>ব্যবহার: {((usedSlots / totalAllocatedSlots) * 100).toFixed(0)}%</span>
                  <span className="text-emerald-400">খালি: {availableSlots} টি</span>
                </div>
              </div>
            </div>

            {/* 2. Customer Fleet */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10.5px] uppercase font-black text-slate-400 tracking-wider">
                  সক্রিয় ট্র্যাকার
                </span>
                <div className="p-1.5 rounded-xl bg-emerald-600/20 text-emerald-400">
                  <Smartphone className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-mono font-black text-emerald-400">
                  {partnerDevices.length} <span className="text-xs font-sans text-slate-400">ডিভাইস</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-bold mt-1">
                  • ১০০% অনলাইন সার্ভার
                </p>
              </div>
            </div>

            {/* 3. Floating Balance Due */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-[10.5px] uppercase font-black text-slate-400 tracking-wider">
                  ফ্লোটিং বকেয়া
                </span>
                <div className="p-1.5 rounded-xl bg-rose-600/20 text-rose-400">
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
                <span className="text-[10.5px] uppercase font-black text-slate-400 tracking-wider">
                  মাসিক কমিশন (MRR)
                </span>
                <div className="p-1.5 rounded-xl bg-blue-600/20 text-blue-400">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-mono font-black text-blue-400">
                  ৳ {monthlyCommission.toLocaleString()} <span className="text-xs font-sans text-slate-400">/মাস</span>
                </div>
                <p className="text-[10px] text-emerald-400 font-bold mt-1">
                  পেমেন্ট গেটওয়ে: bKash, Nagad
                </p>
              </div>
            </div>
          </div>

          {/* =================================================================== */}
          {/* 3. ACTIVE SUBTAB CONTENT                                            */}
          {/* =================================================================== */}

          {/* =================================================================== */}
          {/* 3. ACTIVE SUBTAB CONTENT                                            */}
          {/* =================================================================== */}

          {/* 📊 TAB 1: BUSINESS OVERVIEW & PERFORMANCE METRICS */}
          {activeSection === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Fleet Status & Telematics Cluster Health Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">লাইভ অনলাইন ভেহিক্যাল</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-400 mt-2">
                    {partnerDevices.filter(d => !d.disabled).length} <span className="text-xs font-normal text-slate-400">টি</span>
                  </div>
                  <span className="text-[9.5px] text-emerald-300">১০০% সংযোগ সক্রিয়</span>
                </div>

                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">ফাঁকা স্লট কোটা</span>
                    <Layers className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-mono font-black text-indigo-300 mt-2">
                    {availableSlots} <span className="text-xs font-normal text-slate-400">/ {totalAllocatedSlots}</span>
                  </div>
                  <span className="text-[9.5px] text-indigo-300">নতুন গাড়ি যুক্ত করার জন্য রেডি</span>
                </div>

                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">টেলিমেটিক্স ক্লাস্টার</span>
                    <Cpu className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-sm font-mono font-black text-cyan-300 mt-2">
                    TRACKING_CELL_001
                  </div>
                  <span className="text-[9.5px] text-slate-400">ল্যাটেন্সি: ১২ms • আপটাইম: ৯৯.৯৮%</span>
                </div>

                <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col justify-between shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400">সেন্ট্রাল প্রফিট ফান্ড</span>
                    <DollarSign className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-xl font-mono font-black text-amber-300 mt-2">
                    ৳ {(partnerProfile.accumulatedPartnerProfitBdt || 4500).toLocaleString()}
                  </div>
                  <span className="text-[9.5px] text-amber-200">উইথড্র উপযোগী ব্যালেন্স</span>
                </div>
              </div>

              {/* Quick Action Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div 
                  onClick={() => {
                    setCurrentRole('sales');
                    setActiveTab('saas_sales');
                  }}
                  className="p-4 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 hover:border-indigo-500/60 cursor-pointer transition active:scale-[0.98] shadow-lg flex items-center space-x-3.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shrink-0">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">নতুন কাস্টমার অনবোর্ডিং</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">নতুন বাইক বা গাড়িতে ডিভাইস ইনস্টল ও বিক্রি করুন</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveSection('inventory_erp')}
                  className="p-4 rounded-3xl bg-gradient-to-br from-cyan-950/60 to-slate-900 border border-cyan-500/30 hover:border-cyan-500/60 cursor-pointer transition active:scale-[0.98] shadow-lg flex items-center space-x-3.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shrink-0">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">হার্ডওয়্যার ও সিম ERP</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">বারকোড স্ক্যানার, আইএমইআই ও সিম স্টক ম্যানেজমেন্ট</p>
                  </div>
                </div>

                <div 
                  onClick={() => setActiveSection('pricing_plans')}
                  className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/60 to-slate-900 border border-emerald-500/30 hover:border-emerald-500/60 cursor-pointer transition active:scale-[0.98] shadow-lg flex items-center space-x-3.5"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-white">সাবস্ক্রিপশন প্যাকেজ ও প্রাইসিং</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">১, ৩, ৬ ও ১২ মাসের নিজস্ব খুচরা রেট ও প্রফিট মার্জিন</p>
                  </div>
                </div>
              </div>

              {/* Recent Fleet Activities & Operational Stream */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <h3 className="font-extrabold text-xs text-white flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-indigo-400" />
                    <span>ফ্র্যাঞ্চাইজি সাম্প্রতিক অ্যাক্টিভিটি ও রিনিউয়াল স্ট্রিম</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">লাইভ নোটিফিকেশন ফিড</span>
                </div>

                <div className="divide-y divide-slate-800/60 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <span className="font-bold text-white">মোঃ রাশেদুল ইসলাম</span>
                        <span className="text-slate-400"> (Yamaha FZS V3) — ১ মাসের সাবস্ক্রিপশন সফলভাবে রিনিউ হয়েছে।</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">+ ৳ ২৫০ প্রফিট</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      <div>
                        <span className="font-bold text-white">নতুন ডিভাইস ইনওয়ার্ড</span>
                        <span className="text-slate-400"> — Concox GT06N (IMEI: 864720058291088) স্টকে অন্তর্ভুক্ত হয়েছে।</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">আজ ১০:৩০ AM</span>
                  </div>

                  <div className="py-2.5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      <div>
                        <span className="font-bold text-white">টেলিমেটিক্স সিম পেয়ারিং</span>
                        <span className="text-slate-400"> — Robi M2M (01811-223344) সফলভাবে ট্র্যাকারের সাথে লিঙ্ক হয়েছে।</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-300 font-mono font-bold">M2M ভেরিফাইড</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* 📱 TAB 2: SLOTS & CUSTOMER VEHICLE FLEET MANAGER */}
          {activeSection === 'inventory' && (
            <div className="space-y-3.5 animate-in fade-in duration-150">
              
              {/* Action & Filter Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 bg-slate-900 border border-slate-800 p-3 rounded-3xl shadow-md">
                <div className="flex items-center space-x-2 flex-1">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder={language === 'bn' ? 'IMEI, গাড়ির নম্বর বা ফোন দিয়ে খুঁজুন...' : 'Search by IMEI, Plate or Phone...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-2xl border border-slate-800">
                    {(['all', 'active', 'expiring'] as const).map(s => (
                      <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition ${
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
                    className="px-3 py-1.5 rounded-2xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold text-xs transition active:scale-95 border border-indigo-500/30 flex items-center space-x-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'স্লট বৃদ্ধির আবেদন' : 'Request Slots'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentRole('sales');
                      setActiveTab('saas_sales');
                    }}
                    className="px-3.5 py-1.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition active:scale-95 shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'নতুন অনবোর্ডিং' : 'New Onboarding'}</span>
                  </button>
                </div>
              </div>

              {/* Devices & 4096 Slots Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
                  <h3 className="font-extrabold text-xs text-white flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>সিস্টেমের লাইভ যানবাহন ও ৪,০৯৬ ভার্চুয়াল স্লট ট্র্যাকার তালিকা ({filteredDevices.length})</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">কোটা: {usedSlots}/{totalAllocatedSlots} স্লট</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/80 text-[10px] uppercase font-black tracking-wider text-slate-400 border-b border-slate-800">
                      <tr>
                        <th className="p-3">ডিভাইস / গাড়ি</th>
                        <th className="p-3">IMEI ও সিম</th>
                        <th className="p-3">৪,০৯৬ ভার্চুয়াল স্লট ID</th>
                        <th className="p-3">ইনজেশন সেল</th>
                        <th className="p-3">কাস্টমার ফোন</th>
                        <th className="p-3">স্ট্যাটাস</th>
                        <th className="p-3 text-right">একশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredDevices.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="p-6 text-center text-slate-500 text-xs">
                            🔍 কোনো সক্রিয় গাড়ি পাওয়া যায়নি। নতুন অনবোর্ডিং করুন।
                          </td>
                        </tr>
                      ) : (
                        filteredDevices.map((dev, idx) => {
                          const vSlot = getVirtualSlot(dev.uniqueId || `86472005829103${idx}`);
                          return (
                            <tr key={dev.id} className="hover:bg-slate-800/40 transition">
                              <td className="p-3 font-bold text-white flex items-center space-x-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                <div>
                                  <div>{dev.name}</div>
                                  <div className="text-[10px] text-slate-400 font-mono">
                                    {dev.attributes?.plateNumber || 'DM HA 12-3456'}
                                  </div>
                                </div>
                              </td>
                              <td className="p-3 font-mono text-slate-300">
                                <div>{dev.uniqueId}</div>
                                <div className="text-[10px] text-slate-400">{dev.phone || '+8801711223344'}</div>
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-black bg-indigo-950 text-indigo-300 border border-indigo-800">
                                  Slot #{vSlot}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className="text-[10px] font-mono font-bold text-cyan-300">
                                  TRACKING_CELL_001
                                </span>
                              </td>
                              <td className="p-3 font-mono text-slate-300">
                                {dev.attributes?.driverPhone || '01711-223344'}
                              </td>
                              <td className="p-3">
                                <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                  Active Online
                                </span>
                              </td>
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => {
                                    setSelectedDeviceId(dev.id);
                                    setActiveTab('map');
                                  }}
                                  className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10.5px] font-bold transition inline-flex items-center space-x-1"
                                >
                                  <span>ম্যাপ</span>
                                  <ArrowUpRight className="w-3 h-3 text-indigo-400" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* INVENTORY ERP TAB: HARDWARE & SIM ERP WITH BARCODE */}
          {activeSection === 'inventory_erp' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300 shadow-md">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        ফ্র্যাঞ্চাইজি হার্ডওয়্যার ও সিম ইনভেন্টরি ইআরপি (ERP)
                      </h3>
                      <p className="text-[10.5px] text-slate-400">
                        বারকোড স্ক্যানার, আইএমইআই (IMEI), ম্যানুফ্যাকচারার সিরিয়াল ও সিম লাইফসাইকেল অটোমেশন।
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-extrabold text-xs border border-cyan-500/40 shrink-0 self-start sm:self-auto">
                    ইআরপি মডিউল সক্রিয়
                  </span>
                </div>

                <EnterpriseInventoryManager 
                  partnerIdFilter={partnerProfile.partnerId || user?.partnerId} 
                  isPartnerPortal={true} 
                />
              </div>
            </div>
          )}

          {/* PRICING PLANS TAB: DEDICATED CUSTOM PRICING & AUTO-SETTLEMENT ENGINE */}
          {activeSection === 'pricing_plans' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-md">
                      <Tag className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        সাবস্ক্রিপশন প্যাকেজ রেট ও সেন্ট্রাল অটো-সেটেলমেন্ট কনফিগারেশন
                      </h3>
                      <p className="text-[10.5px] text-slate-400">
                        ১, ৩, ৬ ও ১২ মাসের অল-ইন-ওয়ান এবং অনলি-সার্ভার প্যাকেজ রেট সেট করুন। কাস্টমার পে করলে বাকি নিট লাভ সরাসরি আপনার ওয়ালেটে জমা হবে।
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/40 shrink-0 self-start sm:self-auto">
                    সেন্ট্রাল অটো-সেটেলমেন্ট সক্রিয়
                  </span>
                </div>

                {/* Category Switcher Tab */}
                <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
                  <button
                    onClick={() => setPricingCategoryTab('all_inclusive')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center space-x-2 ${
                      pricingCategoryTab === 'all_inclusive'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>📦 ক্যাটাগরি ১: অল-ইন-ওয়ান প্যাকেজ (সিম + ডেটা + লাইভ সার্ভার)</span>
                  </button>

                  <button
                    onClick={() => setPricingCategoryTab('server_only')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition flex items-center justify-center space-x-2 ${
                      pricingCategoryTab === 'server_only'
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-4 h-4" />
                    <span>🌐 ক্যাটাগরি ২: অনলি সার্ভার লাইসেন্স (কাস্টমার নিজের সিম ব্যবহার করবেন)</span>
                  </button>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  updatePartnerDetails(partnerProfile.partnerId || partnerProfile.id, {
                    allInclusivePricing: {
                      month1: allInc1Mo,
                      month3: allInc3Mo,
                      month6: allInc6Mo,
                      month12: allInc12Mo
                    },
                    serverOnlyPricing: {
                      month1: srvOnly1Mo,
                      month3: srvOnly3Mo,
                      month6: srvOnly6Mo,
                      month12: srvOnly12Mo
                    },
                    customRetailMonthlyPrice: allInc1Mo,
                    customRetailYearlyPrice: allInc12Mo,
                    settlementPayoutMethod: payoutMethodInput,
                    settlementPayoutNumber: payoutNumberInput
                  });
                  setIsPricingSaved(true);
                  setTimeout(() => setIsPricingSaved(false), 2500);
                }} className="space-y-4 text-xs">

                  {/* 1. All-Inclusive Tier Inputs */}
                  {pricingCategoryTab === 'all_inclusive' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          <strong>অল-ইন-ওয়ান প্যাকেজ:</strong> কোম্পানি বা পার্টনার সিম ও এম২এম ইন্টারনেট ডেটা সরবরাহ করে। EasyTracker পাইকারি ফি প্রতি মাসে <strong>৳ ১০০</strong> (সার্ভার ৳ ৫০ + সিম ডেটা ৳ ৫০)।
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-300 block">১ মাস ফি (৳) *</label>
                          <input
                            type="number"
                            min={150}
                            value={allInc1Mo}
                            onChange={(e) => setAllInc1Mo(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl p-2 font-mono font-bold text-white text-xs focus:border-indigo-500 focus:outline-none"
                          />
                          <span className="text-[9.5px] text-emerald-400 block font-bold">
                            আপনার লাভ: ৳ {Math.max(0, allInc1Mo - 100)} /মাস
                          </span>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-300 block">৩ মাস প্যাকেজ (৳) *</label>
                          <input
                            type="number"
                            min={400}
                            value={allInc3Mo}
                            onChange={(e) => setAllInc3Mo(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl p-2 font-mono font-bold text-white text-xs focus:border-indigo-500 focus:outline-none"
                          />
                          <span className="text-[9.5px] text-emerald-400 block font-bold">
                            আপনার লাভ: ৳ {Math.max(0, allInc3Mo - 300)}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-300 block">৬ মাস প্যাকেজ (৳) *</label>
                          <input
                            type="number"
                            min={800}
                            value={allInc6Mo}
                            onChange={(e) => setAllInc6Mo(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl p-2 font-mono font-bold text-white text-xs focus:border-indigo-500 focus:outline-none"
                          />
                          <span className="text-[9.5px] text-emerald-400 block font-bold">
                            আপনার লাভ: ৳ {Math.max(0, allInc6Mo - 600)}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-300 block">১২ মাস (১ বছর) মেগা (৳) *</label>
                          <input
                            type="number"
                            min={1500}
                            value={allInc12Mo}
                            onChange={(e) => setAllInc12Mo(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl p-2 font-mono font-bold text-white text-xs focus:border-indigo-500 focus:outline-none"
                          />
                          <span className="text-[9.5px] text-emerald-400 block font-bold">
                            আপনার লাভ: ৳ {Math.max(0, allInc12Mo - 1200)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. Server-Only (BYOS) Tier Inputs */}
                  {pricingCategoryTab === 'server_only' && (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div className="p-3 rounded-2xl bg-purple-950/40 border border-purple-500/30 text-[11px] text-purple-200 flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>
                          <strong>অনলি সার্ভার প্ল্যাটফর্ম প্যাক:</strong> গ্রাহক নিজের সিম কার্ড রিচার্জ ও ব্যবহার করেন। EasyTracker পাইকারি প্ল্যাটফর্ম ফি প্রতি মাসে মাত্র <strong>৳ ৫০</strong>।
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-300 block">১ মাস সার্ভার ফি (৳) *</label>
                          <input
                            type="number"
                            min={60}
                            value={srvOnly1Mo}
                            onChange={(e) => setSrvOnly1Mo(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl p-2 font-mono font-bold text-white text-xs focus:border-purple-500 focus:outline-none"
                          />
                          <span className="text-[9.5px] text-emerald-400 block font-bold">
                            আপনার লাভ: ৳ {Math.max(0, srvOnly1Mo - 50)} /মাস
                          </span>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-300 block">৩ মাস সার্ভার প্যাক (৳) *</label>
                          <input
                            type="number"
                            min={180}
                            value={srvOnly3Mo}
                            onChange={(e) => setSrvOnly3Mo(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl p-2 font-mono font-bold text-white text-xs focus:border-purple-500 focus:outline-none"
                          />
                          <span className="text-[9.5px] text-emerald-400 block font-bold">
                            আপনার লাভ: ৳ {Math.max(0, srvOnly3Mo - 150)}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-300 block">৬ মাস সার্ভার প্যাক (৳) *</label>
                          <input
                            type="number"
                            min={350}
                            value={srvOnly6Mo}
                            onChange={(e) => setSrvOnly6Mo(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl p-2 font-mono font-bold text-white text-xs focus:border-purple-500 focus:outline-none"
                          />
                          <span className="text-[9.5px] text-emerald-400 block font-bold">
                            আপনার লাভ: ৳ {Math.max(0, srvOnly6Mo - 300)}
                          </span>
                        </div>

                        <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl space-y-1.5">
                          <label className="text-[10.5px] font-bold text-slate-300 block">১২ মাস (১ বছর) সার্ভার (৳) *</label>
                          <input
                            type="number"
                            min={700}
                            value={srvOnly12Mo}
                            onChange={(e) => setSrvOnly12Mo(Number(e.target.value))}
                            className="w-full bg-slate-900 border border-slate-750 rounded-xl p-2 font-mono font-bold text-white text-xs focus:border-purple-500 focus:outline-none"
                          />
                          <span className="text-[9.5px] text-emerald-400 block font-bold">
                            আপনার লাভ: ৳ {Math.max(0, srvOnly12Mo - 600)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payout Channel Configuration */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 border-t border-slate-800">
                    <div>
                      <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                        উইথড্রয়াল পেমেন্ট মাধ্যম
                      </label>
                      <select
                        value={payoutMethodInput}
                        onChange={(e) => setPayoutMethodInput(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-white font-bold focus:outline-none"
                      >
                        <option value="bkash">বিকাশ মার্চেন্ট / পার্সোনাল (bKash)</option>
                        <option value="nagad">নগদ অ্যাকাউন্ট (Nagad)</option>
                        <option value="bank">ব্যাংক একাউন্ট ট্রান্সফার (Bank Transfer)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                        উইথড্রয়াল মোবাইল / ব্যাংক অ্যাকাউন্ট নম্বর *
                      </label>
                      <input
                        type="text"
                        required
                        value={payoutNumberInput}
                        onChange={(e) => setPayoutNumberInput(e.target.value)}
                        placeholder="যেমন: 01711-223344"
                        className="w-full bg-slate-950 border border-slate-750 rounded-xl p-2 text-xs text-white font-mono font-bold focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isPricingSaved ? '✅ প্যাকেজ রেট সংরক্ষিত হয়েছে!' : 'প্যাকেজ রেট কনফিগারেশন সেভ করুন'}</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Central Auto-Settlement Profit Wallet */}
              <div className="bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">সেন্ট্রাল অটো-সেটেলমেন্ট প্রফিট ফান্ড</span>
                    <h3 className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                      ৳ {(partnerProfile.accumulatedPartnerProfitBdt || 4500).toLocaleString()}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    উইথড্র উপযোগী ব্যালেন্স
                  </span>
                </div>

                <p className="text-[10.5px] text-slate-300">
                  কাস্টমাররা কেন্দ্রীয় গেটওয়েতে রিনিউ করলে আপনার নির্ধারিত রেটের নিট প্রফিট মার্জিন স্বয়ংক্রিয়ভাবে এখানে ক্রেডিট হয়।
                </p>

                {withdrawSuccessMsg && (
                  <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold animate-in zoom-in-95 duration-150">
                    {withdrawSuccessMsg}
                  </div>
                )}

                <button
                  onClick={() => {
                    const balance = partnerProfile.accumulatedPartnerProfitBdt || 4500;
                    if (balance <= 0) return;
                    updatePartnerDetails(partnerProfile.partnerId || partnerProfile.id, {
                      accumulatedPartnerProfitBdt: 0
                    });
                    setWithdrawSuccessMsg(`🎉 ৳${balance.toLocaleString()} সেন্ট্রাল প্রফিট ফান্ড সফলভাবে উত্তোলন হয়েছে! আপনার ${payoutMethodInput.toUpperCase()} (${payoutNumberInput})-এ ট্রান্সফার সম্পন্ন হচ্ছে।`);
                    setTimeout(() => setWithdrawSuccessMsg(''), 4000);
                  }}
                  disabled={(partnerProfile.accumulatedPartnerProfitBdt || 4500) <= 0}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30 transition active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{payoutMethodInput === 'bkash' ? 'বিকাশে ১-ট্যাপ উইথড্র করুন' : 'নগদ / ব্যাংকে উইথড্র করুন'}</span>
                </button>
              </div>
            </div>
          )}

          {/* FINANCE TAB: CLEAN FLOATING LEDGER & TRANSACTIONS */}
          {activeSection === 'finance' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Floating Credit Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">ফ্লোটিং ক্রেডিট ব্যালেন্স</span>
                      <h3 className="text-lg font-black text-rose-400 mt-0.5">৳ {floatingDue.toLocaleString()} বকেয়া</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {dueDaysRemaining} দিন বাকি
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

                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10.5px] font-black uppercase tracking-wider text-slate-400">মাসিক মোট কমিশন</span>
                      <h3 className="text-lg font-black text-emerald-400 mt-0.5">৳ {monthlyCommission.toLocaleString()}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10.5px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      অটো-সেটেলমেন্ট সচল
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">প্রতি ডিভাইস অ্যাক্টিভেশন কমিশন:</span>
                      <span className="font-bold text-white">৳ ৫০০</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">সার্ভার রিনিউয়াল প্রফিট মার্জিন:</span>
                      <span className="font-bold text-white">৳ ১০০ - ৳ ৩০০ /গাড়ি /মাস</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Live Customer In-App Renewal & Auto-Settlement Log Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white flex items-center space-x-2">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <span>রিসেন্ট সেন্ট্রাল অটো-সেটেলমেন্ট রিনিউয়াল লেজার</span>
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono">লাইভ ট্রানজ্যাকশন হিস্ট্রি</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold">
                        <th className="pb-2">গ্রাহক ও গাড়ি</th>
                        <th className="pb-2">প্যাকেজ</th>
                        <th className="pb-2">গ্রাহক পে করেছেন</th>
                        <th className="pb-2">সার্ভার ফি (EasyTracker)</th>
                        <th className="pb-2">আপনার প্রফিট</th>
                        <th className="pb-2">তারিখ ও স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {[
                        { customer: 'মোঃ রাশেদুল ইসলাম', vehicle: 'Yamaha FZS V3 (DHAKA METRO-LA 44-5566)', plan: '📦 অল-ইন-ওয়ান (১ মাস)', gross: 350, wholesale: 100, profit: 250, date: '24 Aug 2026' },
                        { customer: 'তানভীর আহমেদ', vehicle: 'Honda CB Shine (DHAKA METRO-HA 12-3456)', plan: '🌐 অনলি সার্ভার (১ মাস)', gross: 150, wholesale: 50, profit: 100, date: '23 Aug 2026' },
                        { customer: 'কাজী আরিফুল হক', vehicle: 'Toyota Corolla Cross (DHAKA GA 33-8899)', plan: '📦 অল-ইন-ওয়ান (১২ মাস)', gross: 3500, wholesale: 1200, profit: 2300, date: '20 Aug 2026' },
                        { customer: 'ফারহানা ইয়াসমিন', vehicle: 'Suzuki Gixxer SF (DHAKA LA 19-2021)', plan: '🌐 অনলি সার্ভার (৬ মাস)', gross: 850, wholesale: 300, profit: 550, date: '18 Aug 2026' }
                      ].map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-850/50 transition">
                          <td className="py-2.5">
                            <div className="font-bold text-white text-xs">{item.customer}</div>
                            <div className="text-[10px] text-slate-400 font-mono">{item.vehicle}</div>
                          </td>
                          <td className="py-2.5 font-bold text-indigo-300 text-[11px]">{item.plan}</td>
                          <td className="py-2.5 font-mono font-bold text-white">৳ {item.gross.toLocaleString()}</td>
                          <td className="py-2.5 font-mono font-bold text-rose-400">- ৳ {item.wholesale.toLocaleString()}</td>
                          <td className="py-2.5 font-mono font-black text-emerald-400">+ ৳ {item.profit.toLocaleString()}</td>
                          <td className="py-2.5">
                            <div className="text-[10px] text-slate-400">{item.date}</div>
                            <span className="inline-flex items-center space-x-1 text-[9px] font-bold text-emerald-300 bg-emerald-950 px-1.5 py-0.2 rounded-full border border-emerald-700">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              <span>অটো-ক্রেডিটেড</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* STAFF TAB */}
          {activeSection === 'staff' && (
            <div className="space-y-3 animate-in fade-in duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <h3 className="text-xs font-black text-white flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>আপনার ফ্র্যাঞ্চাইজির সেলস ও টেকনিশিয়ান টিম</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {[
                    { name: 'আব্দুল করিম', role: 'Chief Field Technician', phone: '01711-223344', activeJobs: 3, zone: 'উত্তরা জোন' },
                    { name: 'রাকিবুল হাসান', role: 'Sales Executive', phone: '01722-334455', activeJobs: 8, zone: 'শোরুম সেলস' },
                    { name: 'তানভীর আহমেদ', role: 'Installation Expert', phone: '01733-445566', activeJobs: 1, zone: 'বারিধারা / কুড়িল' }
                  ].map((member, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white text-xs">{member.name}</div>
                        <div className="text-[10px] text-indigo-400 font-bold">{member.role}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{member.phone} • {member.zone}</div>
                      </div>
                      <span className="px-2 py-1 rounded-xl text-[9.5px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                        {member.activeJobs} কাজ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PROFILE & QR TAB */}
          {activeSection === 'profile' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-white flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <span>ফ্র্যাঞ্চাইজি শপ ও গুগল ম্যাপস প্রোফাইল</span>
                  </h3>
                  {isLocationVerified ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>লোকেশন ভেরিফাইড</span>
                    </span>
                  ) : (
                    <button
                      onClick={handleCaptureLiveGps}
                      className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10.5px] transition flex items-center space-x-1"
                    >
                      <MapPin className="w-3 h-3" />
                      <span>এখনই ভেরিফাই করুন</span>
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="space-y-2">
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">দোকানের নাম / শপ নেম:</span>
                      <span className="font-bold text-white text-sm">{partnerProfile.shopName || partnerProfile.brandName}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-400 block">দোকানের পূর্ণাঙ্গ ঠিকানা:</span>
                      <span className="font-bold text-white">{partnerProfile.fullAddress || 'ঢাকা'}</span>
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

                {/* Shareable Customer Onboarding QR & Link */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs">আপনার ফ্র্যাঞ্চাইজি অনবোর্ডিং কিউআর কোড ও লিংক</div>
                      <div className="text-[10.5px] text-slate-400 mt-0.5">কাস্টমারকে কিউআর স্ক্যান বা লিংক দিয়ে সরাসরি আপনার দোকানে অ্যাসাইন করুন</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`https://easytracker.easysoftsolution.net/register?partnerId=${partnerProfile.partnerId}`);
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition flex items-center space-x-1.5 active:scale-95 shadow-md shadow-indigo-600/20"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'রেজিস্ট্রেশন লিংক কপি'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* MODAL: MANUAL GOOGLE MAPS LINK OR COORDINATE INPUT                        */}
      {/* ========================================================================= */}
      {isManualMapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>গুগল ম্যাপস লিংক বা কোঅর্ডিনেট পেস্ট করুন</span>
              </h3>
              <button onClick={() => setIsManualMapModalOpen(false)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              আপনার দোকানের এক্স্যাক্ট গুগল ম্যাপস শেয়ার লিংক অথবা ল্যাটিচিউড/লংগিচিউড লিখুন:
            </p>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                গুগল ম্যাপস URL বা ল্যাট, লং (যেমন: 23.8683, 90.3995)
              </label>
              <textarea
                rows={2}
                value={pastedMapInput}
                onChange={(e) => handleParseMapLink(e.target.value)}
                placeholder="যেমন: 23.8683, 90.3995 অথবা https://maps.google.com/?q=23.8683,90.3995"
                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-2.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>

            {parsedCoords && (
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 space-y-1">
                <div className="font-bold flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>সঠিক কোঅর্ডিনেট শনাক্ত হয়েছে:</span>
                </div>
                <div className="font-mono font-bold text-white">
                  Latitude: {parsedCoords.lat}, Longitude: {parsedCoords.lng}
                </div>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setIsManualMapModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-750 transition"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveManualLocation}
                disabled={!parsedCoords}
                className={`flex-1 py-2 rounded-xl font-bold text-xs transition shadow-lg ${
                  parsedCoords 
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                ভেরিফাই ও সেভ করুন
              </button>
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
