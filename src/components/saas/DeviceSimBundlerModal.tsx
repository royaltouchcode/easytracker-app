import React, { useState } from 'react';
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
  Tag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DeviceInventoryItem, SimInventoryItem, TenantTier } from '../../types/traccar';

interface DeviceSimBundlerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTargetTier?: TenantTier;
  initialCompanyName?: string;
  onSuccess?: () => void;
}

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
    addDeviceToInventory, 
    addSimToInventory, 
    updateDeviceInventoryItem, 
    updateSimInventoryItem,
    triggerManualAlert
  } = useApp();

  // Filter unassigned devices or stock
  const inStockDevices = (deviceInventory || []).filter(d => 
    d.status === 'in_stock' || !d.pairedSimNumber
  );

  // Filter unassigned SIMs
  const inStockSims = (simInventory || []).filter(s => 
    s.status === 'in_stock_ready' || !s.pairedImei
  );

  // Form State
  const [selectedDeviceImei, setSelectedDeviceImei] = useState<string>(
    inStockDevices[0]?.imei || '864720058299001'
  );
  const [customDeviceModel, setCustomDeviceModel] = useState('Micodus MV720G (Voice+Relay)');
  
  // SIM Selection State
  const [simProvisionMode, setSimProvisionMode] = useState<'select_stock' | 'manual_m2m'>('manual_m2m');
  const [selectedSimMsisdn, setSelectedSimMsisdn] = useState<string>(
    inStockSims[0]?.msisdn || '01700-889901'
  );
  const [manualSimMsisdn, setManualSimMsisdn] = useState('01811-998877');
  const [manualSimIccid, setManualSimIccid] = useState('89880172026889901');
  const [selectedOperator, setSelectedOperator] = useState<'grameenphone' | 'robi' | 'banglalink' | 'teletalk'>('robi');
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);

  // Tenant Allocation Target
  const [targetTier, setTargetTier] = useState<TenantTier>(initialTargetTier);
  const [targetEntityName, setTargetEntityName] = useState(initialCompanyName || 'হানিফ এন্টারপ্রাইজ বাস ফ্লিট');
  const [vehiclePlate, setVehiclePlate] = useState('DHAKA METRO-BA 15-2028');
  const [customerOrDriverName, setCustomerOrDriverName] = useState('মোঃ রফিকুল ইসলাম (ড্রাইভার)');
  const [customerOrDriverPhone, setCustomerOrDriverPhone] = useState('01811-334499');

  // Privacy & Information Visibility Setting
  const [privacyPolicy, setPrivacyPolicy] = useState<'restricted_to_owner_only' | 'public_to_all'>(
    'restricted_to_owner_only'
  );

  // Subscription Plan
  const [selectedSubscriptionMonths, setSelectedSubscriptionMonths] = useState<number>(12);
  const [monthlyFeeTk, setMonthlyFeeTk] = useState<number>(350);

  if (!isOpen) return null;

  const handlePairAndAssign = (e: React.FormEvent) => {
    e.preventDefault();

    const activeMsisdn = simProvisionMode === 'select_stock' ? selectedSimMsisdn : manualSimMsisdn.trim();
    const activeImei = selectedDeviceImei.trim();

    if (!activeMsisdn || !activeImei) {
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
        notes: `[SaaS Bundle] Voice: ${isVoiceEnabled ? 'Yes' : 'No'} | Privacy: ${privacyPolicy} | Assigned to: ${targetEntityName}`
      });
    } else {
      addDeviceToInventory({
        barcode: `DEV-${Date.now().toString().slice(-6)}`,
        imei: activeImei,
        serialNumber: `SN-${activeImei.slice(-8)}`,
        manufacturer: 'Micodus / Teltonika OEM',
        model: customDeviceModel,
        protocol: 'GT06 / Teltonika',
        purchasePriceBdt: 2400,
        pairedSimNumber: activeMsisdn,
        assignedVehiclePlate: vehiclePlate.trim(),
        assignedCustomerName: customerOrDriverName.trim(),
        assignedCustomerPhone: customerOrDriverPhone.trim(),
        status: targetTier === 'b2b_partner' ? 'assigned_to_partner' : 'sold_active',
        addedDate: new Date().toISOString().split('T')[0],
        notes: `[SaaS Bundle] Voice: ${isVoiceEnabled ? 'Yes' : 'No'} | Privacy: ${privacyPolicy} | Assigned to: ${targetEntityName}`
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
      `⚡ সফল! ডিভাইস (IMEI: ${activeImei}) এবং M2M সিম (${activeMsisdn} - ${isVoiceEnabled ? 'Voice' : 'Non-Voice'}) সফলভাবে পেয়ার ও '${targetEntityName}' এর জন্য বরাদ্দ হয়েছে!`
    );

    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in select-none">
      <div className="bg-slate-900 border border-indigo-500/60 rounded-3xl max-w-2xl w-full p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <span>১-ক্লিক ডিভাইস ও SaaS M2M সিম বান্ডলার</span>
                <span className="text-[9.5px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.2 rounded-full border border-indigo-500/30">
                  Voice & Data M2M
                </span>
              </h3>
              <p className="text-[10.5px] text-slate-400">
                আমাদের নিজস্ব ট্র্যাকার এবং ভয়েস/নন-ভয়েস M2M সিম সহজে পেয়ার ও ক্লায়েন্টে বরাদ্দ করুন
              </p>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handlePairAndAssign} className="space-y-4 text-xs">
          
          {/* STEP 1: DEVICE SELECTION */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-indigo-300 flex items-center space-x-1.5 text-xs">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>১. ট্র্যাকার হার্ডওয়্যার নির্বাচন (GPS Tracker Device)</span>
              </span>
              <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/50 font-bold">
                স্টক রেডি
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">ডিভাইস IMEI নম্বর *</label>
                <input
                  type="text"
                  required
                  value={selectedDeviceImei}
                  onChange={(e) => setSelectedDeviceImei(e.target.value)}
                  placeholder="15-digit IMEI (e.g. 864720058299001)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">ডিভাইস মডেল ও প্রোটোকল</label>
                <select
                  value={customDeviceModel}
                  onChange={(e) => setCustomDeviceModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Micodus MV720G (Voice+Relay)">Micodus MV720G (Voice + Cutoff)</option>
                  <option value="Sinotrack ST-901 4G Pro">Sinotrack ST-901 4G Pro (Waterproof)</option>
                  <option value="Teltonika FMB920 Heavy Fleet">Teltonika FMB920 Heavy Fleet (CANbus)</option>
                  <option value="Coban TK-303G GPS Tracker">Coban TK-303G GPS Tracker</option>
                  <option value="Concox GT06N Multi-Functional">Concox GT06N Multi-Functional</option>
                </select>
              </div>
            </div>
          </div>

          {/* STEP 2: M2M SIM CONFIGURATION (VOICE VS NON-VOICE) */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-purple-300 flex items-center space-x-1.5 text-xs">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>২. SaaS M2M সিম প্রভিশনিং (Voice বনাম Non-Voice)</span>
              </span>
              
              {/* Voice Toggle Switch */}
              <div className="flex items-center space-x-1.5 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-700">
                <span className="text-[10px] text-slate-400 font-bold">সিম মোড:</span>
                <button
                  type="button"
                  onClick={() => setIsVoiceEnabled(!isVoiceEnabled)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition flex items-center space-x-1 ${
                    isVoiceEnabled
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isVoiceEnabled ? <Volume2 className="w-3 h-3 text-amber-300" /> : <Radio className="w-3 h-3" />}
                  <span>{isVoiceEnabled ? '🎙️ Voice + Data M2M' : '📶 Non-Voice (Data Only)'}</span>
                </button>
              </div>
            </div>

            {/* Voice Capability Highlight Alert */}
            <div className={`p-2.5 rounded-xl border text-[10.5px] leading-relaxed flex items-start space-x-2 ${
              isVoiceEnabled 
                ? 'bg-purple-950/40 border-purple-500/40 text-purple-200' 
                : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-200'
            }`}>
              {isVoiceEnabled ? (
                <>
                  <Mic className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">ভয়েস-সক্ষম M2M সিম (Voice Monitoring Enabled):</strong>
                    গাড়ির লাইভ জিপিএস লোকেশনের পাশাপাশি কেবিন স্পাই অডিও লিসেনিং, টু-ওয়ে কল ও চালকের সাথে সরাসরি ভয়েস ইন্টারকম সুবিধা চালু থাকবে।
                  </div>
                </>
              ) : (
                <>
                  <Radio className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-bold">নন-ভয়েস ডাটা-অনলি M2M সিম (Pure Telemetry Data):</strong>
                    শুধুমাত্র জিপিএস প্যাকেট, জিওফেন্স ও স্পিড টেলিমেট্রিক্স ডাটার জন্য ডেডিকেটেড কম খরচের সিম।
                  </div>
                </>
              )}
            </div>

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
          </div>

          {/* STEP 3: TARGET ALLOCATION & VEHICLE ASSIGNMENT */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-300 flex items-center space-x-1.5 text-xs">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span>৩. ওনারশিপ ও ক্লায়েন্ট বরাদ্দকরণ (Target Allocation)</span>
              </span>

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
                    onClick={() => setTargetTier(t.id)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition ${
                      targetTier === t.id 
                        ? 'bg-amber-600 text-white shadow-sm' 
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">কোম্পানি / পার্টনারের নাম *</label>
                <input
                  type="text"
                  required
                  value={targetEntityName}
                  onChange={(e) => setTargetEntityName(e.target.value)}
                  placeholder="যেমন: হানিফ এন্টারপ্রাইজ বাস ফ্লিট"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-bold block mb-1">গাড়ির রেজিস্ট্রেশন নম্বর *</label>
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
                <label className="text-[10px] text-slate-400 font-bold block mb-1">চালক বা ব্যবহারকারীর নাম</label>
                <input
                  type="text"
                  value={customerOrDriverName}
                  onChange={(e) => setCustomerOrDriverName(e.target.value)}
                  placeholder="যেমন: মোঃ রফিকুল ইসলাম"
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

          {/* STEP 4: STRICT PRIVACY & DATA VISIBILITY POLICY */}
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sky-300 flex items-center space-x-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>৪. তথ্য দৃশ্যমানতা ও এন্টারপ্রাইজ প্রাইভেসি রুল (Data Privacy Policy)</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label 
                className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start space-x-2 ${
                  privacyPolicy === 'restricted_to_owner_only'
                    ? 'bg-sky-950/60 border-sky-500 text-white font-bold ring-1 ring-sky-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="privacy_policy"
                  checked={privacyPolicy === 'restricted_to_owner_only'}
                  onChange={() => setPrivacyPolicy('restricted_to_owner_only')}
                  className="text-sky-600 mt-0.5"
                />
                <div>
                  <span className="text-[11px] block font-extrabold text-sky-200">
                    🔒 এন্টারপ্রাইজ ওনার রেস্ট্রিক্টেড (Recommended for Corporate)
                  </span>
                  <span className="text-[9.5px] text-slate-400 block mt-0.5 font-normal">
                    ড্রাইভার বা সাব-স্টাফের কাছ থেকে সিম নম্বর ও আইএমইআই সম্পূর্ণ লুকায়িত থাকবে। শুধুমাত্র অনুমোদিত কোম্পানি ওনারই বিস্তারিত দেখতে পাবে।
                  </span>
                </div>
              </label>

              <label 
                className={`p-2.5 rounded-xl border cursor-pointer transition flex items-start space-x-2 ${
                  privacyPolicy === 'public_to_all'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white font-bold ring-1 ring-emerald-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="privacy_policy"
                  checked={privacyPolicy === 'public_to_all'}
                  onChange={() => setPrivacyPolicy('public_to_all')}
                  className="text-emerald-600 mt-0.5"
                />
                <div>
                  <span className="text-[11px] block font-extrabold text-emerald-200">
                    🌐 সরাসরি ব্যবহারকারীর জন্য দৃশ্যমান (Retail Client)
                  </span>
                  <span className="text-[9.5px] text-slate-400 block mt-0.5 font-normal">
                    রিটেইল গ্রাহক বা চালকের নিজস্ব অ্যাপে সিম নম্বর ও ভয়েস কল বাটন সরাসরি আনলক থাকবে।
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              বাতিল
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center space-x-1.5"
            >
              <PackageCheck className="w-4 h-4" />
              <span>⚡ ১-ক্লিক পেয়ার ও ওনার বরাদ্দ করুন</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
