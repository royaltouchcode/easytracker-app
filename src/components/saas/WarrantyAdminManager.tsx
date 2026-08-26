import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Wrench, 
  Calendar, 
  Sparkles, 
  Save, 
  AlertTriangle,
  RotateCcw,
  Check,
  Tag,
  Search,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WarrantyPolicyType, WarrantyStatus } from '../../types/traccar';

const POLICY_OPTIONS: { id: WarrantyPolicyType; titleBn: string; months: number }[] = [
  { id: 'replacement_1yr', titleBn: '১ বছর আনলিমিটেড রিপ্লেসমেন্ট ওয়ারেন্টি', months: 12 },
  { id: 'service_2yr', titleBn: '২ বছর ফ্রি পার্টস ও সার্ভিসিং ওয়ারেন্টি', months: 24 },
  { id: 'extended_3yr', titleBn: '৩ বছর এক্সটেন্ডেড এন্টারপ্রাইজ ওয়ারেন্টি', months: 36 },
  { id: 'lifetime_service', titleBn: 'লাইফটাইম টেকনিক্যাল সাপোর্ট ও সার্ভিসিং', months: 60 }
];

export const WarrantyAdminManager: React.FC = () => {
  const { 
    devices, 
    deviceWarranties, 
    setDeviceWarranty, 
    warrantyClaims, 
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'devices' | 'claims'>('devices');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedDeviceId, setSavedDeviceId] = useState<number | null>(null);

  const handlePolicyChange = (deviceId: number, policyType: WarrantyPolicyType) => {
    const selectedPolicy = POLICY_OPTIONS.find(p => p.id === policyType) || POLICY_OPTIONS[0];
    
    // Calculate new expiry date based on policy duration
    const activation = new Date();
    const expiry = new Date(activation);
    expiry.setMonth(expiry.getMonth() + selectedPolicy.months);

    setDeviceWarranty(deviceId, {
      policyType,
      policyTitleBn: selectedPolicy.titleBn,
      durationMonths: selectedPolicy.months,
      activationDate: activation.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      expiryDate: expiry.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'active'
    });

    setSavedDeviceId(deviceId);
    setTimeout(() => setSavedDeviceId(null), 1800);
  };

  const handleStatusChange = (deviceId: number, status: WarrantyStatus) => {
    setDeviceWarranty(deviceId, { status });
    setSavedDeviceId(deviceId);
    setTimeout(() => setSavedDeviceId(null), 1800);
  };

  const filteredDevices = (devices || []).filter(d =>
    d?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d?.attributes?.plateNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d?.uniqueId || '').includes(searchQuery)
  );

  const totalActiveWarranties = Object.values(deviceWarranties || {}).filter(w => w?.status === 'active').length;
  const pendingClaimsCount = (warrantyClaims || []).filter(c => c?.status === 'pending_support' || c?.status === 'tech_assigned').length;
  const completedClaimsCount = (warrantyClaims || []).filter(c => c?.status === 'completed').length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-100">
              ডিভাইস ওয়ারেন্টি পলিসি ও আরএমএ কনফিগারেশন
            </h3>
            <p className="text-[10px] text-slate-400">
              সুপার অ্যাডমিন কর্তৃক ডিভাইস-ওয়াইজ ওয়ারেন্টি প্যাকেজ ও ক্লেইম অডিট
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-700">
            সক্রিয় ওয়ারেন্টি: {totalActiveWarranties} টি
          </span>
        </div>
      </div>

      {/* Sub-Tabs: Devices Config vs Claims Master Log */}
      <div className="flex bg-slate-950/80 border border-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('devices')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'devices' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ডিভাইস ওয়ারেন্টি প্যাকেজ সেটিংস ({devices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('claims')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'claims' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>আরএমএ ক্লেইম অডিট ও হিস্ট্রি ({warrantyClaims.length})</span>
          {pendingClaimsCount > 0 && (
            <span className="text-[9px] bg-rose-500 text-white font-mono px-1.5 py-0.2 rounded-full ml-1 font-bold">
              {pendingClaimsCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 গাড়ি নাম, প্লেট নম্বর বা IMEI দিয়ে খুঁজুন..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: DEVICE-WISE WARRANTY CONFIGURATION LIST                        */}
      {/* ========================================================================= */}
      {activeTab === 'devices' ? (
        <div className="space-y-2.5 max-h-96 overflow-y-auto">
          {filteredDevices.map((device) => {
            const warranty = deviceWarranties[device.id] || {
              deviceId: device.id,
              imei: device.uniqueId,
              policyType: 'replacement_1yr',
              policyTitleBn: '১ বছর আনলিমিটেড রিপ্লেসমেন্ট ওয়ারেন্টি',
              activationDate: '01 Jan 2026',
              durationMonths: 12,
              expiryDate: '31 Dec 2026',
              status: 'active',
              coveredTerms: ['মাদারবোর্ড ত্রুটি', 'পাওয়ার আইসি', 'ফ্রি সোয়াপ']
            };

            const isSaved = savedDeviceId === device.id;

            return (
              <div 
                key={device.id} 
                className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2.5 text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-100 flex items-center space-x-1.5">
                      <span>{device.name}</span>
                      <span className="text-slate-400 text-[10px] font-mono">({device.attributes?.plateNumber || 'No Plate'})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      IMEI: {device.uniqueId}
                    </div>
                  </div>

                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                    warranty.status === 'active' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                    warranty.status === 'expiring_soon' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                    'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    {warranty.status === 'active' ? '🟢 সক্রিয় ওয়ারেন্টি' : '🔴 মেয়াদোত্তীর্ণ'}
                  </span>
                </div>

                {/* Configuration Controls */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                  <div>
                    <label className="text-[9.5px] font-bold text-slate-400 block mb-1">
                      ওয়ারেন্টি পলিসি প্যাকেজ:
                    </label>
                    <select
                      value={warranty.policyType}
                      onChange={(e) => handlePolicyChange(device.id, e.target.value as WarrantyPolicyType)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-[11px] text-white font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      {POLICY_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>
                          {opt.titleBn}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[9.5px] font-bold text-slate-400 block mb-1">
                      ওয়ারেন্টি স্ট্যাটাস:
                    </label>
                    <select
                      value={warranty.status}
                      onChange={(e) => handleStatusChange(device.id, e.target.value as WarrantyStatus)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-[11px] text-white font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                    >
                      <option value="active">সক্রিয় (Active Coverage)</option>
                      <option value="expiring_soon">মেয়াদ শেষের পথে (Expiring Soon)</option>
                      <option value="expired">মেয়াদোত্তীর্ণ (Expired)</option>
                      <option value="void">বাতিলকৃত (Void)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1">
                  <span>অ্যাক্টিভেশন: <strong className="text-slate-300">{warranty.activationDate}</strong></span>
                  <span>মেয়াদ শেষ: <strong className="text-amber-300 font-mono">{warranty.expiryDate}</strong></span>
                  {isSaved && (
                    <span className="text-emerald-400 font-bold flex items-center space-x-1 animate-in fade-in">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সংরক্ষিত!</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ========================================================================= */
        /* SECTION 2: CLAIMS RMA MASTER AUDIT QUEUE                                 */
        /* ========================================================================= */
        <div className="space-y-2.5 max-h-96 overflow-y-auto">
          {warrantyClaims.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-40" />
              <span>কোনো ওয়ারেন্টি ক্লেইম জমা নেই।</span>
            </div>
          ) : (
            warrantyClaims.map((claim) => (
              <div 
                key={claim.id} 
                className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2.5 text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {claim.id}
                    </span>
                    <span className="font-extrabold text-slate-100">{claim.customerName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({claim.customerPhone})</span>
                  </div>

                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                    claim.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                    claim.status === 'tech_assigned' ? 'bg-blue-950 text-blue-300 border-blue-700' :
                    'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {claim.status === 'completed' ? '🟢 কাজ সম্পন্ন' :
                     claim.status === 'tech_assigned' ? '🔵 টেকনিশিয়ান নির্ধারিত' :
                     '🟡 পেন্ডিং সাপোর্ট'}
                  </span>
                </div>

                <div>
                  <h5 className="font-bold text-slate-200">{claim.issueTitleBn}</h5>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{claim.issueDetails}</p>
                </div>

                {/* Preferred Location Info */}
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px] space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-300 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>কাস্টমারের নির্বাচিত সার্ভিস পয়েন্ট:</span>
                    <span className="text-slate-200 font-normal">{claim.preferredLocation}</span>
                  </div>
                  {claim.assignedTechName && (
                    <div className="flex items-center space-x-1.5 text-blue-300">
                      <Wrench className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>অ্যাসাইনড টেকনিশিয়ান: {claim.assignedTechName} ({claim.assignedTechPhone})</span>
                    </div>
                  )}
                  {claim.replacementImei && (
                    <div className="text-[10px] text-purple-300 font-mono">
                      🔄 রিপ্লেসমেন্ট নতুন IMEI: {claim.replacementImei}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                  <span>ক্লেইম তারিখ: {claim.claimDate}</span>
                  {claim.completedDate && <span className="text-emerald-400 font-bold">সম্পন্ন: {claim.completedDate}</span>}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
