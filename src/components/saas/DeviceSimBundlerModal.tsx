import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Radio, 
  Mic, 
  Volume2, 
  ShieldCheck, 
  Building2, 
  Users, 
  Smartphone, 
  CheckCircle2, 
  Sparkles, 
  X, 
  Save, 
  Layers, 
  PhoneCall, 
  Eye, 
  EyeOff, 
  PackageCheck,
  Zap,
  Tag,
  Search,
  Check,
  Filter,
  Car,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeviceInventoryItem, SimInventoryItem, TenantTier, PartnerRegistrationEntry } from '../../types/traccar';

interface DeviceSimBundlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetTier?: TenantTier;
  initialCompanyName?: string;
  onSuccess?: () => void;
}

export type DeviceFeatureCategory = 'all' | 'voice_spy' | 'basic_relay' | 'dashcam_video' | 'heavy_fleet';
export type SimVoiceCategory = 'all' | 'voice_m2m' | 'data_only';

const DEFAULT_CORPORATE_FLEETS = [
  'হানিফ এন্টারপ্রাইজ বাস ফ্লিট',
  'সৌদিয়া পরিবহন (প্রাঃ) লিঃ',
  'সুন্দরবন কুরিয়ার সার্ভিস ও লজিস্টিকস',
  'মেঘনা গ্রুপ হেভি কার্গো অ্যান্ড ফ্রেইট',
  'শ্যামলী এন আর ট্রাভেলস বাস ফ্লিট',
  'এনা ট্রান্সপোর্ট প্রাইভেট লিমিটেড',
  'ইউএস-বাংলা এক্সপ্রেস কুরিয়ার ফ্লিট'
];

const DEFAULT_B2B_PARTNERS = [
  'ঢাকা সেন্ট্রাল ট্র্যাকিং হাব',
  'উত্তরা জিপিএস পয়েন্ট ও সল্যুশনস',
  'চট্টগ্রাম ভেহিকেল অটোমেশন হাব',
  'সিলেট ডিজিটাল ট্র্যাকিং নেটওয়ার্ক',
  'রাজশাহী টেলিম্যাটিক্স পাওয়ার হাব',
  'খুলনা মবিলিটি পার্টনার্স'
];

export const DeviceSimBundlerModal: React.FC<DeviceSimBundlerModalProps> = ({
  isOpen,
  onClose,
  initialTargetTier = 'fleet_company',
  initialCompanyName = '',
  onSuccess
}) => {
  const { 
    deviceInventory, 
    simInventory, 
    approvedPartners,
    addDeviceToInventory, 
    addSimToInventory, 
    updateDeviceInventoryItem, 
    updateSimInventoryItem,
    triggerManualAlert
  } = useApp();

  // 1. Available Real Unassigned Stock
  const inStockDevices = useMemo(() => {
    return (deviceInventory || []).filter(d => 
      d.status === 'in_stock' || !d.pairedSimNumber || d.status === 'returned_reinstall'
    );
  }, [deviceInventory]);

  const inStockSims = useMemo(() => {
    return (simInventory || []).filter(s => 
      s.status === 'in_stock_ready' || !s.pairedImei
    );
  }, [simInventory]);

  // Dynamic B2B & Corporate Fleet list
  const b2bPartnerList = useMemo(() => {
    const list: string[] = [];
    if (approvedPartners && approvedPartners.length > 0) {
      approvedPartners.forEach((p: PartnerRegistrationEntry) => {
        const name = p.brandName || p.applicantName;
        if (name && !list.includes(name)) list.push(name);
      });
    }
    DEFAULT_B2B_PARTNERS.forEach(p => {
      if (!list.includes(p)) list.push(p);
    });
    return list;
  }, [approvedPartners]);

  const corporateFleetList = useMemo(() => {
    const list: string[] = [];
    try {
      const saved = localStorage.getItem('gps_corporate_fleet_companies');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((c: any) => {
            if (c.name && !list.includes(c.name)) list.push(c.name);
          });
        }
      }
    } catch (e) {}
    DEFAULT_CORPORATE_FLEETS.forEach(c => {
      if (!list.includes(c)) list.push(c);
    });
    return list;
  }, []);

  // Mode Selection: Stock Pick vs Manual Entry
  const [deviceMode, setDeviceMode] = useState<'stock' | 'manual'>('stock');
  const [deviceCategoryFilter, setDeviceCategoryFilter] = useState<DeviceFeatureCategory>('all');
  const [deviceSearchTerm, setDeviceSearchTerm] = useState('');

  const [simMode, setSimMode] = useState<'stock' | 'manual'>('stock');
  const [simCategoryFilter, setSimCategoryFilter] = useState<SimVoiceCategory>('all');
  const [simOperatorFilter, setSimOperatorFilter] = useState<'all' | 'robi' | 'grameenphone' | 'banglalink' | 'teletalk'>('all');
  const [simSearchTerm, setSimSearchTerm] = useState('');

  // Selected Stock Items
  const [selectedStockDeviceId, setSelectedStockDeviceId] = useState<string>(
    inStockDevices[0]?.id || ''
  );
  const [selectedStockSimId, setSelectedStockSimId] = useState<string>(
    inStockSims[0]?.id || ''
  );

  // Manual Device Inputs
  const [manualImei, setManualImei] = useState('864720058299001');
  const [manualModel, setManualModel] = useState('Micodus MV720G (Voice + Cutoff)');

  // Manual SIM Inputs
  const [manualSimMsisdn, setManualSimMsisdn] = useState('01811-998877');
  const [manualSimIccid, setManualSimIccid] = useState('89880172026889901');
  const [selectedOperator, setSelectedOperator] = useState<'grameenphone' | 'robi' | 'banglalink' | 'teletalk'>('robi');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // Tenant Target Allocation
  const [targetTier, setTargetTier] = useState<TenantTier>(initialTargetTier);
  const [targetEntityName, setTargetEntityName] = useState(
    initialCompanyName || (initialTargetTier === 'b2b_partner' ? b2bPartnerList[0] : corporateFleetList[0])
  );
  const [isCustomEntity, setIsCustomEntity] = useState(false);
  const [vehiclePlate, setVehiclePlate] = useState('DHAKA METRO-BA 15-2028');
  const [customerOrDriverName, setCustomerOrDriverName] = useState('মোঃ রফিকুল ইসলাম (ড্রাইভার)');
  const [customerOrDriverPhone, setCustomerOrDriverPhone] = useState('01811-334499');

  // Privacy Policy
  const [privacyPolicy, setPrivacyPolicy] = useState<'restricted_to_owner_only' | 'public_to_all'>(
    initialTargetTier === 'retail_customer' ? 'public_to_all' : 'restricted_to_owner_only'
  );

  // Helper: Detect if a device has voice support
  const isDeviceVoiceCapable = (modelName: string, notes?: string) => {
    const s = `${modelName} ${notes || ''}`.toLowerCase();
    return s.includes('voice') || s.includes('mv720g') || s.includes('gt06') || s.includes('tk303') || s.includes('mic') || s.includes('spy') || s.includes('audio');
  };

  // Filter Devices based on Category & Search
  const filteredStockDevices = useMemo(() => {
    return inStockDevices.filter(d => {
      // Category Filter
      if (deviceCategoryFilter === 'voice_spy' && !isDeviceVoiceCapable(d.model, d.notes)) return false;
      if (deviceCategoryFilter === 'basic_relay' && isDeviceVoiceCapable(d.model, d.notes)) return false;
      if (deviceCategoryFilter === 'dashcam_video' && !d.model.toLowerCase().includes('dashcam') && !d.model.toLowerCase().includes('jc400') && !d.model.toLowerCase().includes('cam')) return false;
      if (deviceCategoryFilter === 'heavy_fleet' && !d.model.toLowerCase().includes('fmc') && !d.model.toLowerCase().includes('canbus') && !d.model.toLowerCase().includes('heavy')) return false;

      // Search Term Filter
      if (deviceSearchTerm) {
        const query = deviceSearchTerm.toLowerCase();
        const matchImei = d.imei.toLowerCase().includes(query);
        const matchModel = d.model.toLowerCase().includes(query);
        const matchMfg = (d.manufacturer || '').toLowerCase().includes(query);
        const matchBarcode = (d.barcode || '').toLowerCase().includes(query);
        if (!matchImei && !matchModel && !matchMfg && !matchBarcode) return false;
      }
      return true;
    });
  }, [inStockDevices, deviceCategoryFilter, deviceSearchTerm]);

  // Filter SIMs based on Category, Operator & Search
  const filteredStockSims = useMemo(() => {
    return inStockSims.filter(s => {
      // Voice Category Filter
      if (simCategoryFilter === 'voice_m2m' && s.simType !== 'm2m_special_voice') return false;
      if (simCategoryFilter === 'data_only' && s.simType === 'm2m_special_voice') return false;

      // Operator Filter
      if (simOperatorFilter !== 'all' && s.operator !== simOperatorFilter) return false;

      // Search Term Filter
      if (simSearchTerm) {
        const query = simSearchTerm.toLowerCase();
        const matchMsisdn = s.msisdn.toLowerCase().includes(query);
        const matchBarcode = (s.simBarcode || '').toLowerCase().includes(query);
        const matchApn = (s.apn || '').toLowerCase().includes(query);
        if (!matchMsisdn && !matchBarcode && !matchApn) return false;
      }
      return true;
    });
  }, [inStockSims, simCategoryFilter, simOperatorFilter, simSearchTerm]);

  // Automatically update inputs when a stock device is selected
  const handleSelectStockDevice = (deviceId: string) => {
    setSelectedStockDeviceId(deviceId);
    const item = inStockDevices.find(d => d.id === deviceId);
    if (item) {
      setManualImei(item.imei);
      setManualModel(item.model);
      
      // Auto-suggest voice SIM if device has microphone
      if (isDeviceVoiceCapable(item.model, item.notes)) {
        setIsVoiceEnabled(true);
        setSimCategoryFilter('voice_m2m');
      } else {
        setIsVoiceEnabled(false);
        setSimCategoryFilter('data_only');
      }
    }
  };

  // Automatically update inputs when a stock SIM is selected
  const handleSelectStockSim = (simId: string) => {
    setSelectedStockSimId(simId);
    const item = inStockSims.find(s => s.id === simId);
    if (item) {
      setManualSimMsisdn(item.msisdn);
      setManualSimIccid(item.simBarcode || '');
      setSelectedOperator(item.operator as any);
      setIsVoiceEnabled(item.simType === 'm2m_special_voice');
    }
  };

  // Target Tier Change Handler (adjusts auto entity list and privacy defaults)
  const handleTargetTierChange = (newTier: TenantTier) => {
    setTargetTier(newTier);
    setIsCustomEntity(false);
    if (newTier === 'b2b_partner') {
      setTargetEntityName(b2bPartnerList[0] || 'ঢাকা সেন্ট্রাল ট্র্যাকিং হাব');
      setPrivacyPolicy('restricted_to_owner_only');
    } else if (newTier === 'fleet_company') {
      setTargetEntityName(corporateFleetList[0] || 'হানিফ এন্টারপ্রাইজ বাস ফ্লিট');
      setPrivacyPolicy('restricted_to_owner_only');
    } else {
      setTargetEntityName('রিটেইল ডিরেক্ট ক্লায়েন্ট');
      setPrivacyPolicy('public_to_all');
    }
  };

  if (!isOpen) return null;

  // Handle Form Submission
  const handlePairAndAssign = (e: React.FormEvent) => {
    e.preventDefault();

    const activeImei = deviceMode === 'stock' 
      ? (inStockDevices.find(d => d.id === selectedStockDeviceId)?.imei || manualImei.trim())
      : manualImei.trim();

    const activeMsisdn = simMode === 'stock'
      ? (inStockSims.find(s => s.id === selectedStockSimId)?.msisdn || manualSimMsisdn.trim())
      : manualSimMsisdn.trim();

    if (!activeImei || !activeMsisdn) {
      alert('অনুগ্রহ করে ডিভাইসের IMEI এবং M2M সিম নম্বর নিশ্চিত করুন!');
      return;
    }

    // 1. Create or Update Device
    const existingDevice = (deviceInventory || []).find(d => d.imei === activeImei);
    if (existingDevice) {
      updateDeviceInventoryItem(existingDevice.id, {
        pairedSimNumber: activeMsisdn,
        assignedVehiclePlate: vehiclePlate.trim(),
        assignedCustomerName: customerOrDriverName.trim(),
        assignedCustomerPhone: customerOrDriverPhone.trim(),
        status: targetTier === 'b2b_partner' ? 'assigned_to_partner' : 'sold_active',
        notes: `[SaaS Bundle] Model: ${manualModel} | Voice: ${isVoiceEnabled ? 'Yes' : 'No'} | Privacy: ${privacyPolicy} | Target: ${targetEntityName} (${targetTier})`
      });
    } else {
      addDeviceToInventory({
        barcode: `DEV-${Date.now().toString().slice(-6)}`,
        imei: activeImei,
        serialNumber: `SN-${activeImei.slice(-8)}`,
        manufacturer: manualModel.includes('Micodus') ? 'Micodus' : manualModel.includes('Sinotrack') ? 'Sinotrack' : 'Teltonika OEM',
        model: manualModel,
        protocol: manualModel.includes('Teltonika') ? 'teltonika' : 'gt06',
        purchasePriceBdt: 2400,
        pairedSimNumber: activeMsisdn,
        assignedVehiclePlate: vehiclePlate.trim(),
        assignedCustomerName: customerOrDriverName.trim(),
        assignedCustomerPhone: customerOrDriverPhone.trim(),
        status: targetTier === 'b2b_partner' ? 'assigned_to_partner' : 'sold_active',
        addedDate: new Date().toISOString().split('T')[0],
        notes: `[SaaS Bundle] Model: ${manualModel} | Voice: ${isVoiceEnabled ? 'Yes' : 'No'} | Privacy: ${privacyPolicy} | Target: ${targetEntityName} (${targetTier})`
      });
    }

    // 2. Create or Update SIM
    const existingSim = (simInventory || []).find(s => s.msisdn === activeMsisdn);
    if (existingSim) {
      updateSimInventoryItem(existingSim.id, {
        pairedImei: activeImei,
        assignedVehiclePlate: vehiclePlate.trim(),
        assignedCustomerName: customerOrDriverName.trim(),
        status: 'active_live',
        simType: isVoiceEnabled ? 'm2m_special_voice' : 'm2m_general',
        notes: `[Paired Bundle] Target: ${targetEntityName} (${targetTier}) | Privacy: ${privacyPolicy}`
      });
    } else {
      addSimToInventory({
        simBarcode: manualSimIccid.trim() || `898801${Date.now()}`,
        msisdn: activeMsisdn,
        operator: selectedOperator,
        simType: isVoiceEnabled ? 'm2m_special_voice' : 'm2m_general',
        puk1: '12345678',
        apn: selectedOperator === 'grameenphone' ? 'gpiot' : selectedOperator === 'robi' ? 'robiot' : 'blm2m',
        pairedImei: activeImei,
        assignedVehiclePlate: vehiclePlate.trim(),
        assignedCustomerName: customerOrDriverName.trim(),
        status: 'active_live',
        addedDate: new Date().toISOString().split('T')[0],
        notes: `[Paired Bundle] Target: ${targetEntityName} (${targetTier}) | Privacy: ${privacyPolicy}`
      });
    }

    triggerManualAlert(
      'subscription_reminder',
      `⚡ ১-ক্লিক সফল! ডিভাইস (IMEI: ${activeImei}) এবং M2M সিম (${activeMsisdn} - ${isVoiceEnabled ? 'Voice' : 'Non-Voice'}) সফলভাবে পেয়ার ও '${targetEntityName}' এর জন্য বরাদ্দ হয়েছে!`
    );

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in select-none">
      <div className="bg-slate-900 border border-indigo-500/60 rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-2xl space-y-4 max-h-[94vh] overflow-y-auto">
        
        {/* ========================================================================= */}
        {/* MODAL TOP BANNER                                                          */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-emerald-600 flex items-center justify-center text-white shadow-lg">
              <Zap className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center space-x-2">
                <span>১-ক্লিক ডিভাইস ও SaaS M2M সিম বান্ডলার</span>
                <span className="text-[10px] bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-2 py-0.5 rounded-full border border-purple-400/40">
                  Voice & Data M2M
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                ফিচার অনুযায়ী আন-অ্যাসাইনড ট্র্যাকার ও ভয়েস/নন-ভয়েস M2M সিম ১-ক্লিকে পেয়ার করে B2B পার্টনার ও কর্পোরেট ফ্লিটে বরাদ্দ করুন
              </p>
            </div>
          </div>

          <button 
            type="button"
            onClick={onClose} 
            className="text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePairAndAssign} className="space-y-4 text-xs">
          
          {/* ========================================================================= */}
          {/* STEP 1: SMART TRACKER DEVICE PICKER (FEATURE-BASED)                      */}
          {/* ========================================================================= */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <span className="font-extrabold text-indigo-300 flex items-center space-x-2 text-xs sm:text-sm">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>১. ট্র্যাকার হার্ডওয়্যার নির্বাচন (Device Feature & Smart Picker)</span>
              </span>

              {/* Device Mode Switcher */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => setDeviceMode('stock')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
                    deviceMode === 'stock'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>মজুদ স্টক থেকে ({inStockDevices.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDeviceMode('manual')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
                    deviceMode === 'manual'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>ম্যানুয়াল IMEI এন্ট্রি</span>
                </button>
              </div>
            </div>

            {deviceMode === 'stock' ? (
              <div className="space-y-2.5">
                {/* Feature Category Filter Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[10px]">
                  <span className="text-slate-400 font-bold shrink-0">ফিচার ফিল্টার:</span>
                  {[
                    { id: 'all' as const, label: `সকল ট্র্যাকার (${inStockDevices.length})` },
                    { id: 'voice_spy' as const, label: '🎙️ কেবিন অডিও / স্পাই ভয়েস' },
                    { id: 'basic_relay' as const, label: '⚡ ইঞ্জিন কাটঅফ / বেসিক' },
                    { id: 'dashcam_video' as const, label: '📹 ড্যাশ ক্যাম / ভিডিও' },
                    { id: 'heavy_fleet' as const, label: '🚛 হেভি ফ্লিট / CAN-Bus' }
                  ].map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setDeviceCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
                        deviceCategoryFilter === cat.id
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Device Selector Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">
                      আন-অ্যাসাইনড ট্র্যাকার ডিভাইস তালিকা *
                    </label>
                    <select
                      value={selectedStockDeviceId}
                      onChange={(e) => handleSelectStockDevice(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-indigo-500 focus:outline-none"
                    >
                      {filteredStockDevices.length === 0 ? (
                        <option value="">কোনো আন-অ্যাসাইনড ট্র্যাকার পাওয়া যায়নি</option>
                      ) : (
                        filteredStockDevices.map(d => {
                          const isVoice = isDeviceVoiceCapable(d.model, d.notes);
                          return (
                            <option key={d.id} value={d.id}>
                              {d.imei} — {d.model} {isVoice ? '🎙️ [Voice Enabled]' : '⚡ [Data Telemetry]'} | {d.manufacturer}
                            </option>
                          );
                        })
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">IMEI সার্চ / ফিল্টার</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={deviceSearchTerm}
                        onChange={(e) => setDeviceSearchTerm(e.target.value)}
                        placeholder="IMEI বা মডেল খুঁজুন..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-2.5 py-2 text-white text-[11px] focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Selected Device Spec Highlight */}
                {selectedStockDeviceId && (
                  <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                      <span className="text-indigo-200">
                        মডেল: <strong className="text-white">{manualModel}</strong> | IMEI: <strong className="text-amber-300 font-mono">{manualImei}</strong>
                      </span>
                    </div>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-emerald-950 border border-emerald-700 text-emerald-300">
                      ইন-স্টক রেডি
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Manual IMEI & Model Form */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">নতুন ডিভাইস IMEI নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={manualImei}
                    onChange={(e) => setManualImei(e.target.value)}
                    placeholder="15-digit IMEI (e.g. 864720058299001)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">ডিভাইস মডেল ও প্রোটোকল</label>
                  <select
                    value={manualModel}
                    onChange={(e) => {
                      setManualModel(e.target.value);
                      if (isDeviceVoiceCapable(e.target.value)) {
                        setIsVoiceEnabled(true);
                      }
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Micodus MV720G (Voice + Cutoff)">Micodus MV720G 🎙️ (Voice + Cutoff)</option>
                    <option value="Concox GT06N Multi-Functional">Concox GT06N 🎙️ (Cabin Mic + SOS)</option>
                    <option value="Coban TK-303G GPS Tracker">Coban TK-303G 🎙️ (Voice + Relay)</option>
                    <option value="Sinotrack ST-901 4G Pro">Sinotrack ST-901 ⚡ (Waterproof Relay)</option>
                    <option value="Teltonika FMB920 Heavy Fleet">Teltonika FMB920 ⚡ (CANbus Telematics)</option>
                    <option value="Jimi JC400 AI Dual Dashcam">Jimi JC400 📹 (Live Video + ADAS)</option>
                    <option value="Teltonika FMC130 Heavy Freight">Teltonika FMC130 🚛 (Fuel Sensor + BLE)</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* STEP 2: SMART M2M SIM PICKER (VOICE VS NON-VOICE CATEGORIES)              */}
          {/* ========================================================================= */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center space-x-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <span className="font-extrabold text-purple-300 text-xs sm:text-sm">
                  ২. সেন্ট্রাল SaaS M2M সিম নির্বাচন (Voice vs Non-Voice Smart SIMs)
                </span>
              </div>

              {/* SIM Mode Switcher */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-[10.5px]">
                <button
                  type="button"
                  onClick={() => setSimMode('stock')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
                    simMode === 'stock'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <PackageCheck className="w-3.5 h-3.5" />
                  <span>মজুদ সিম থেকে ({inStockSims.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSimMode('manual')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center space-x-1 ${
                    simMode === 'manual'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>ম্যানুয়াল সিম এন্ট্রি</span>
                </button>
              </div>
            </div>

            {/* Voice vs Non-Voice Mode Selector Alert */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
              <div className="flex items-center space-x-2">
                {isVoiceEnabled ? <Mic className="w-4 h-4 text-amber-400 shrink-0" /> : <Radio className="w-4 h-4 text-cyan-400 shrink-0" />}
                <span className="text-[11px] text-purple-200">
                  সিম কার্যক্ষমতা: <strong className="text-white">{isVoiceEnabled ? '🎙️ কেবিন অডিও ও ভয়েস কল সক্ষম (Voice M2M)' : '📶 পিওর ডাটা ও টেলিমেট্রি (Data Only M2M)'}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceEnabled(true);
                    setSimCategoryFilter('voice_m2m');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition flex items-center space-x-1 ${
                    isVoiceEnabled
                      ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Volume2 className="w-3 h-3 text-amber-300" />
                  <span>Voice M2M</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceEnabled(false);
                    setSimCategoryFilter('data_only');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition flex items-center space-x-1 ${
                    !isVoiceEnabled
                      ? 'bg-cyan-600 text-white shadow-sm ring-1 ring-cyan-400'
                      : 'bg-slate-900 text-slate-400 border border-slate-800'
                  }`}
                >
                  <Radio className="w-3 h-3" />
                  <span>Data Only</span>
                </button>
              </div>
            </div>

            {simMode === 'stock' ? (
              <div className="space-y-2.5">
                {/* Operator Filter Pills */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-[10px]">
                  <span className="text-slate-400 font-bold shrink-0">অপারেটর ফিল্টার:</span>
                  {[
                    { id: 'all' as const, label: `সকল অপারেটর (${inStockSims.length})` },
                    { id: 'robi' as const, label: '🔴 Robi Axiata IoT' },
                    { id: 'grameenphone' as const, label: '🟢 GP Jasper M2M' },
                    { id: 'banglalink' as const, label: '🟠 BL IoT' },
                    { id: 'teletalk' as const, label: '🔵 Teletalk M2M' }
                  ].map(op => (
                    <button
                      key={op.id}
                      type="button"
                      onClick={() => setSimOperatorFilter(op.id)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition shrink-0 ${
                        simOperatorFilter === op.id
                          ? 'bg-purple-600 text-white shadow-sm'
                          : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                      }`}
                    >
                      {op.label}
                    </button>
                  ))}
                </div>

                {/* SIM Dropdown Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">
                      আন-অ্যাসাইনড M2M সিম তালিকা *
                    </label>
                    <select
                      value={selectedStockSimId}
                      onChange={(e) => handleSelectStockSim(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-purple-500 focus:outline-none"
                    >
                      {filteredStockSims.length === 0 ? (
                        <option value="">কোনো আন-অ্যাসাইনড সিম পাওয়া যায়নি</option>
                      ) : (
                        filteredStockSims.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.msisdn} — {s.operator.toUpperCase()} {s.simType === 'm2m_special_voice' ? '🎙️ [Voice+Data]' : '📶 [Data Only]'} | ICCID: {s.simBarcode?.slice(-8) || 'N/A'}
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-slate-400 font-bold block mb-1">সিম নম্বর সার্চ</label>
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                      <input
                        type="text"
                        value={simSearchTerm}
                        onChange={(e) => setSimSearchTerm(e.target.value)}
                        placeholder="01811... বা ICCID..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-2.5 py-2 text-white text-[11px] focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Selected SIM Highlight */}
                {selectedStockSimId && (
                  <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between text-[11px]">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-purple-200">
                        সিম নম্বর: <strong className="text-emerald-300 font-mono">{manualSimMsisdn}</strong> | অপারেটর: <strong className="text-white uppercase">{selectedOperator}</strong> | ICCID: <strong className="text-slate-300 font-mono">{manualSimIccid}</strong>
                      </span>
                    </div>
                    <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-md bg-purple-900/60 border border-purple-700 text-purple-200">
                      M2M একটিভ
                    </span>
                  </div>
                )}
              </div>
            ) : (
              /* Manual SIM Form */
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">M2M সিম নম্বর (MSISDN) *</label>
                  <input
                    type="text"
                    required
                    value={manualSimMsisdn}
                    onChange={(e) => setManualSimMsisdn(e.target.value)}
                    placeholder="01811-XXXXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">টেলিকম অপারেটর</label>
                  <select
                    value={selectedOperator}
                    onChange={(e) => setSelectedOperator(e.target.value as any)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-purple-500 focus:outline-none"
                  >
                    <option value="robi">Robi Axiata IoT M2M</option>
                    <option value="grameenphone">Grameenphone Cisco Jasper</option>
                    <option value="banglalink">Banglalink BL M2M</option>
                    <option value="teletalk">Teletalk IoT Gateway</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-bold block mb-1">সিম ICCID বারকোড</label>
                  <input
                    type="text"
                    value={manualSimIccid}
                    onChange={(e) => setManualSimIccid(e.target.value)}
                    placeholder="89880172026889901"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ========================================================================= */}
          {/* STEP 3: INTERCONNECTED B2B & CORPORATE TARGET ALLOCATION                  */}
          {/* ========================================================================= */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/40 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="font-extrabold text-amber-300 text-xs sm:text-sm">
                  ৩. ওনারশিপ ও ক্লায়েন্ট বরাদ্দকরণ (Interconnected Target Allocation)
                </span>
              </div>

              {/* Tier Selection Pills */}
              <div className="flex space-x-1">
                {[
                  { id: 'b2b_partner' as const, label: '🤝 B2B পার্টনার' },
                  { id: 'fleet_company' as const, label: '🚌 কর্পোরেট ফ্লিট' },
                  { id: 'retail_customer' as const, label: '👤 রিটেইল ইউজার' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handleTargetTierChange(t.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10.5px] font-bold transition ${
                      targetTier === t.id 
                        ? 'bg-amber-600 text-white shadow-md ring-1 ring-amber-400' 
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[10px] text-slate-400 font-bold">
                    {targetTier === 'b2b_partner' ? 'B2B পার্টনার হাব নির্বাচন *' : targetTier === 'fleet_company' ? 'কর্পোরেট ফ্লিট কোম্পানি *' : 'গ্রাহক / কোম্পানির নাম *'}
                  </label>
                  {targetTier !== 'retail_customer' && (
                    <button
                      type="button"
                      onClick={() => setIsCustomEntity(!isCustomEntity)}
                      className="text-[9.5px] text-amber-400 hover:underline font-bold"
                    >
                      {isCustomEntity ? 'তালিকা থেকে পছন্দ করুন' : '+ নতুন নাম লিখুন'}
                    </button>
                  )}
                </div>

                {targetTier !== 'retail_customer' && !isCustomEntity ? (
                  <select
                    value={targetEntityName}
                    onChange={(e) => setTargetEntityName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-amber-500 focus:outline-none"
                  >
                    {(targetTier === 'b2b_partner' ? b2bPartnerList : corporateFleetList).map(name => (
                      <option key={name} value={name}>{name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={targetEntityName}
                    onChange={(e) => setTargetEntityName(e.target.value)}
                    placeholder={targetTier === 'b2b_partner' ? 'পার্টনার নাম...' : 'কোম্পানি নাম...'}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-amber-500 focus:outline-none"
                  />
                )}
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">গাড়ির রেজিস্ট্রেশন নম্বর (Plate) *</label>
                <input
                  type="text"
                  required
                  value={vehiclePlate}
                  onChange={(e) => setVehiclePlate(e.target.value)}
                  placeholder="যেমন: DHAKA METRO-BA 15-2028"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">চালক বা ব্যবহারের দায়িত্বে থাকা ব্যক্তি</label>
                <input
                  type="text"
                  value={customerOrDriverName}
                  onChange={(e) => setCustomerOrDriverName(e.target.value)}
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম (ড্রাইভার)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">চালকের মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={customerOrDriverPhone}
                  onChange={(e) => setCustomerOrDriverPhone(e.target.value)}
                  placeholder="01811-XXXXXX"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* STEP 4: STRICT PRIVACY & DATA VISIBILITY POLICY                          */}
          {/* ========================================================================= */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-sky-500/40 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sky-300 flex items-center space-x-2 text-xs sm:text-sm">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>৪. তথ্য দৃশ্যমানতা ও এন্টারপ্রাইজ প্রাইভেসি রুল (Data Privacy Policy)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <label 
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-start space-x-2.5 ${
                  privacyPolicy === 'restricted_to_owner_only'
                    ? 'bg-sky-950/60 border-sky-500 text-white font-bold ring-1 ring-sky-500/40 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="privacy_policy"
                  checked={privacyPolicy === 'restricted_to_owner_only'}
                  onChange={() => setPrivacyPolicy('restricted_to_owner_only')}
                  className="text-sky-600 mt-1"
                />
                <div>
                  <span className="text-[11px] block font-extrabold text-sky-200">
                    🔒 এন্টারপ্রাইজ ওনার রেস্ট্রিক্টেড (Recommended for Corporate)
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-normal leading-relaxed">
                    ড্রাইভার বা সাব-স্টাফের কাছ থেকে সিম নম্বর ও আইএমইআই সম্পূর্ণ লুকায়িত (Masked) থাকবে। শুধুমাত্র অনুমোদিত কোম্পানি ওনারই বিস্তারিত দেখতে ও স্পাই কল দিতে পারবে।
                  </span>
                </div>
              </label>

              <label 
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-start space-x-2.5 ${
                  privacyPolicy === 'public_to_all'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/40 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="privacy_policy"
                  checked={privacyPolicy === 'public_to_all'}
                  onChange={() => setPrivacyPolicy('public_to_all')}
                  className="text-emerald-600 mt-1"
                />
                <div>
                  <span className="text-[11px] block font-extrabold text-emerald-200">
                    🌐 সরাসরি ব্যবহারকারীর জন্য দৃশ্যমান (Retail Client)
                  </span>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-normal leading-relaxed">
                    রিটেইল গ্রাহক বা চালকের নিজস্ব অ্যাপে সিম নম্বর ও ভয়েস কল বাটন সরাসরি আনলক থাকবে।
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* MODAL ACTION BUTTONS                                                      */}
          {/* ========================================================================= */}
          <div className="flex items-center space-x-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-[2] py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center space-x-2"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>⚡ ১-ক্লিক পেয়ার, কনফিগার ও ওনার বরাদ্দ করুন</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
