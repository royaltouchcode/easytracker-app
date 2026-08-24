import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  X, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  Wrench, 
  AlertTriangle, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  Plus, 
  History, 
  Home, 
  Send,
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WarrantyClaimTicket } from '../../types/traccar';

interface CustomerWarrantyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BANGLADESH_SERVICE_POINTS = [
  { id: 'gulshan', name: 'গুলশান সার্ভিস সেন্টার (রোড ১১, গুলশান-২, ঢাকা)', address: 'প্লট ৪২, রোড ১১, গুলশান-২, ঢাকা', phone: '01700-112233' },
  { id: 'mirpur', name: 'মিরপুর ১০ কাস্টমার কেয়ার (মিরপুর ১০ গোলচত্বর, ঢাকা)', address: 'রোড ১, ব্লক সি, মিরপুর ১০, ঢাকা', phone: '01700-223344' },
  { id: 'uttara', name: 'উত্তরা টেকনিক্যাল হাব (সেক্টর ৭, উত্তরা, ঢাকা)', address: 'সেক্টর ৭, জসীমউদ্দীন এভিনিউ, উত্তরা, ঢাকা', phone: '01700-334455' },
  { id: 'motijheel', name: 'মতিঝিল কর্পোরেট কেয়ার (দিলকুশা, ঢাকা)', address: 'দিলকুশা বাণিজ্যিক এলাকা, মতিঝিল, ঢাকা', phone: '01700-445566' },
  { id: 'chittagong', name: 'চট্টগ্রাম জিইসি সার্ভিস হাব (জিইসি মোড়, চট্টগ্রাম)', address: 'জিইসি সার্কেল, সিডিএ এভিনিউ, চট্টগ্রাম', phone: '01700-556677' },
  { id: 'home_service', name: 'অন-সাইট হোম সার্ভিস (টেকনিশিয়ান আপনার ঠিকানায় যাবেন)', address: 'কাস্টমারের নিজস্ব পার্কিং / বাসভবন', phone: '01700-000000' }
];

export const CustomerWarrantyModal: React.FC<CustomerWarrantyModalProps> = ({ isOpen, onClose }) => {
  const { 
    selectedDevice, 
    deviceWarranties, 
    warrantyClaims, 
    submitWarrantyClaim, 
    language,
    user 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'new_claim' | 'history'>('info');

  // Form State
  const [selectedIssue, setSelectedIssue] = useState<WarrantyClaimTicket['issueType']>('no_gps_signal');
  const [issueDetails, setIssueDetails] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(BANGLADESH_SERVICE_POINTS[0].name);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('');

  if (!isOpen || !selectedDevice) return null;

  const currentWarranty = deviceWarranties[selectedDevice.id] || {
    deviceId: selectedDevice.id,
    imei: selectedDevice.uniqueId || '864720058291034',
    policyType: 'replacement_1yr',
    policyTitleBn: '১ বছর আনলিমিটেড রিপ্লেসমেন্ট ওয়ারেন্টি',
    activationDate: '01 Jan 2026',
    durationMonths: 12,
    expiryDate: '31 Dec 2026',
    status: 'active',
    coveredTerms: [
      'জিপিএস ট্র্যাকার মাদারবোর্ড ত্রুটি',
      'ইন্টারনাল পাওয়ার আইসি বা রিবুট লুপ সমস্যা',
      'রিলে ও ইঞ্জিন কাটঅফ ওয়্যারিং ফল্ট',
      'ফ্রি হার্ডওয়্যার সোয়াপ ও অন-সাইট সাপোর্ট'
    ]
  };

  const deviceClaims = warrantyClaims.filter(c => c.deviceId === selectedDevice.id);

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDetails.trim()) {
      alert('অনুগ্রহ করে সমস্যার বিস্তারিত বিবরণ লিখুন!');
      return;
    }

    setIsSubmitting(true);

    const issueTitles: Record<string, string> = {
      no_gps_signal: 'স্যাটেলাইট সিগন্যাল বারবার ড্রপ ও অফলাইন সমস্যা',
      hardware_fault: 'হার্ডওয়্যার মাদারবোর্ড বা পাওয়ার অন হচ্ছে না',
      battery_drain: 'ব্যাটারি ড্রেন বা দ্রুত চার্জ শেষ হওয়া',
      relay_fault: 'রিলে ও ইঞ্জিন কাটঅফ ওয়্যারিং ফল্ট',
      water_damage: 'পানি ঢুকে ড্যামেজ বা শর্ট সার্কিট',
      other: 'অন্যান্য কারিগরি সমস্যা'
    };

    const targetPoint = BANGLADESH_SERVICE_POINTS.find(p => p.name === selectedLocation) || BANGLADESH_SERVICE_POINTS[0];

    try {
      await submitWarrantyClaim({
        deviceId: selectedDevice.id,
        vehicleName: selectedDevice.name,
        plateNumber: selectedDevice.attributes?.plateNumber || 'DHAKA METRO-LA 11-2233',
        imei: selectedDevice.uniqueId || '864720058291034',
        customerName: user?.name || selectedDevice.attributes?.driverName || 'Mohammad Azhar',
        customerPhone: user?.email || selectedDevice.attributes?.driverPhone || '01700-000000',
        issueType: selectedIssue,
        issueTitleBn: issueTitles[selectedIssue] || 'কারিগরি সমস্যা',
        issueDetails: issueDetails.trim(),
        preferredLocation: targetPoint.name,
        servicePointAddress: targetPoint.address
      });

      setSubmitSuccessMsg('ওয়ারেন্টি ক্লেইম সফলভাবে জমা হয়েছে! সাপোর্ট টিম দ্রুত টেকনিশিয়ান নির্ধারণ করবে।');
      setIssueDetails('');
      setTimeout(() => {
        setSubmitSuccessMsg('');
        setActiveTab('history');
      }, 2000);
    } catch (e) {
      alert('ক্লেইম সাবমিট করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>{language === 'bn' ? 'ডিভাইস ওয়ারেন্টি ও ক্লেইম হাব' : 'Device Warranty & RMA Desk'}</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  {currentWarranty.status === 'active' ? '🟢 সক্রিয়' : '🔴 মেয়াদোত্তীর্ণ'}
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {selectedDevice.name} • IMEI: {selectedDevice.uniqueId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 shrink-0">
          {[
            { id: 'info', label: '🛡️ ওয়ারেন্টি কার্ড' },
            { id: 'new_claim', label: '➕ ক্লেইম করুন' },
            { id: 'history', label: `📋 ক্লেইম ট্র্যাকিং (${deviceClaims.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-2.5 text-[11px] font-bold transition ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-emerald-300 border-b-2 border-emerald-500'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto flex-1">
          
          {/* ========================================================================= */}
          {/* TAB 1: WARRANTY POLICY CARD & COVERAGE                                    */}
          {/* ========================================================================= */}
          {activeTab === 'info' && (
            <div className="space-y-3">
              {/* 3D Holographic Card */}
              <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      অফিসিয়াল ম্যানুফ্যাকচারার ওয়ারেন্টি
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-100 mt-0.5">
                      {currentWarranty.policyTitleBn}
                    </h4>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-inner">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">অ্যাক্টিভেশন তারিখ:</span>
                    <span className="font-mono font-bold text-slate-200">{currentWarranty.activationDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">মেয়াদ উত্তীর্ণের তারিখ:</span>
                    <span className="font-mono font-bold text-amber-300">{currentWarranty.expiryDate}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 text-[11px]">কাভারেজ স্ট্যাটাস:</span>
                    <span className="font-bold text-emerald-400 flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>১০০% আনলিমিটেড পার্টস সোয়াপ</span>
                    </span>
                  </div>
                </div>

                {/* Covered Terms List */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10.5px] font-bold text-slate-300 block">ওয়ারেন্টির আওতায় যা যা অন্তর্ভুক্ত:</span>
                  <div className="space-y-1">
                    {currentWarranty.coveredTerms.map((term, i) => (
                      <div key={i} className="flex items-center space-x-2 text-[10.5px] text-slate-300 bg-slate-950/50 px-2.5 py-1 rounded-xl border border-slate-800/80">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('new_claim')}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition active:scale-95 border border-emerald-400"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন ওয়ারেন্টি ক্লেইম জমা দিন</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: SUBMIT NEW CLAIM FORM WITH LOCATION SELECTOR                       */}
          {/* ========================================================================= */}
          {activeTab === 'new_claim' && (
            <form onSubmit={handleSubmitClaim} className="space-y-3 text-xs">
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-2xl text-[11px] text-emerald-300 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  আপনার ডিভাইসে কোনো ত্রুটি থাকলে ক্লেইম সাবমিট করুন। সাপোর্ট টিম যাচাই করে আপনার সুবিধাজনক সার্ভিস পয়েন্টে টেকনিশিয়ান নিয়োগ করবে।
                </span>
              </div>

              {/* Issue Type Selector */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">সমস্যার ধরন নির্বাচন করুন *</label>
                <select
                  value={selectedIssue}
                  onChange={(e) => setSelectedIssue(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="no_gps_signal">🛰️ স্যাটেলাইট সিগন্যাল বারবার ড্রপ ও অফলাইন সমস্যা</option>
                  <option value="hardware_fault">⚡ হার্ডওয়্যার মাদারবোর্ড বা পাওয়ার অন হচ্ছে না</option>
                  <option value="battery_drain">🪫 ব্যাটারি ড্রেন বা দ্রুত চার্জ শেষ হওয়া</option>
                  <option value="relay_fault">🛑 রিলে ও ইঞ্জিন কাটঅফ ওয়্যারিং ফল্ট</option>
                  <option value="water_damage">💧 পানি ঢুকে ড্যামেজ বা শর্ট সার্কিট</option>
                  <option value="other">➕ অন্যান্য কারিগরি সমস্যা</option>
                </select>
              </div>

              {/* Service Point Location Selector (Crucial Requirement) */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  📍 আপনি কোথা থেকে সার্ভিস নিতে চান? (সার্ভিস লোকেশন নির্বাচন করুন) *
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  {BANGLADESH_SERVICE_POINTS.map(point => (
                    <option key={point.id} value={point.name}>
                      {point.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Detailed Problem Note */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">সমস্যার বিস্তারিত বিবরণ *</label>
                <textarea
                  required
                  rows={3}
                  value={issueDetails}
                  onChange={(e) => setIssueDetails(e.target.value)}
                  placeholder="যেমন: বাইকের ইগনিশন অন থাকলেও অ্যাপে অফলাইন দেখাচ্ছে, এবং লাল বাতি জ্বলছে না..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white font-medium focus:border-emerald-500 focus:outline-none text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition active:scale-95 border border-emerald-400 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'ক্লেইম পাঠানো হচ্ছে...' : submitSuccessMsg || 'ওয়ারেন্টি ক্লেইম সাবমিট করুন'}</span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: REAL-TIME CLAIMS TRACKING & APPOINTMENT STATUS                     */}
          {/* ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-2.5">
              {deviceClaims.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-40" />
                  <span>এই ডিভাইসের জন্য এখনও কোনো ওয়ারেন্টি ক্লেইম নেই।</span>
                </div>
              ) : (
                deviceClaims.map((claim) => (
                  <div key={claim.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2.5 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-800/40">
                        {claim.id}
                      </span>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                        claim.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                        claim.status === 'tech_assigned' ? 'bg-blue-950 text-blue-300 border-blue-700 animate-pulse' :
                        'bg-amber-950 text-amber-300 border-amber-700'
                      }`}>
                        {claim.status === 'completed' ? '🟢 কাজ সম্পন্ন' :
                         claim.status === 'tech_assigned' ? '🔵 টেকনিশিয়ান নির্ধারিত' :
                         '🟡 সাপোর্ট টিম যাচাই করছে'}
                      </span>
                    </div>

                    <div>
                      <h5 className="font-extrabold text-xs text-slate-100">{claim.issueTitleBn}</h5>
                      <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{claim.issueDetails}</p>
                    </div>

                    {/* Preferred Location Info */}
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px] space-y-1">
                      <div className="flex items-center space-x-1.5 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="font-bold">সার্ভিস পয়েন্ট:</span>
                        <span className="text-slate-200 truncate">{claim.preferredLocation}</span>
                      </div>

                      {/* Assigned Tech Info if any */}
                      {claim.assignedTechName && (
                        <div className="flex items-center space-x-1.5 text-blue-300 pt-0.5 border-t border-slate-800">
                          <Wrench className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          <span className="font-bold">নির্ধারিত টেকনিশিয়ান:</span>
                          <span>{claim.assignedTechName} ({claim.assignedTechPhone})</span>
                        </div>
                      )}

                      {claim.technicianNotes && (
                        <div className="text-[10px] text-slate-400 italic pt-0.5">
                          নোট: "{claim.technicianNotes}"
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono">
                      <span>ক্লেইম তারিখ: {claim.claimDate}</span>
                      {claim.completedDate && <span className="text-emerald-400">সম্পন্ন: {claim.completedDate}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
