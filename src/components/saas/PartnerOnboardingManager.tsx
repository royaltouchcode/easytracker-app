import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  CheckCircle2, 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Send, 
  ExternalLink, 
  ShieldCheck, 
  Sliders, 
  Search, 
  UserCheck, 
  Layers,
  ChevronRight,
  AlertTriangle,
  LocateFixed
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  PartnerRegistrationEntry, 
  PartnerServiceTier, 
  SaasRole 
} from '../../types/traccar';

export const PartnerOnboardingManager: React.FC = () => {
  const { 
    partnerRegistrations, 
    approvedPartners, 
    approvePartner, 
    rejectPartner, 
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  // Approval Modal State
  const [selectedPartner, setSelectedPartner] = useState<PartnerRegistrationEntry | null>(null);
  const [assignedUsername, setAssignedUsername] = useState('');
  const [approvedTier, setApprovedTier] = useState<PartnerServiceTier>('all_inclusive');
  const [approvedRoles, setApprovedRoles] = useState<SaasRole[]>(['sales', 'technician']);
  const [customServerUrl, setCustomServerUrl] = useState('');
  const [customServerPort, setCustomServerPort] = useState('8082');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenApproveModal = (partner: PartnerRegistrationEntry) => {
    setSelectedPartner(partner);
    const slug = (partner.brandName || partner.applicantName).toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
    setAssignedUsername(`partner/${slug}`);
    setApprovedTier(partner.serviceTier || 'all_inclusive');
    setApprovedRoles(partner.desiredRoles.length > 0 ? partner.desiredRoles : ['sales', 'technician']);
    setCustomServerUrl(partner.customServerUrl || '');
    setCustomServerPort(partner.customServerPort || '8082');
    setAdminNotes('সুপার অ্যাডমিন কর্তৃক নথি ও লোকেশন যাচাইপূর্বক অনুমোদিত।');
  };

  const handleConfirmApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPartner) return;

    approvePartner(
      selectedPartner.id,
      approvedTier,
      assignedUsername.trim(),
      approvedRoles,
      adminNotes,
      customServerUrl.trim() || undefined,
      customServerPort.trim() || undefined
    );

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedPartner(null);
    }, 1500);
  };

  const pendingList = partnerRegistrations.filter(p => p.status === 'pending_approval');
  const filteredPending = pendingList.filter(p =>
    p.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brandName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApproved = approvedPartners.filter(p =>
    p.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brandName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery) ||
    p.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5">
              <span>B2B পার্টনার ও ব্র্যান্ড অনবোর্ডিং হাব</span>
              {pendingList.length > 0 && (
                <span className="text-[9px] bg-rose-500 text-white font-mono px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {pendingList.length} পেন্ডিং
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400">
              থার্ড-পার্টি ব্র্যান্ড, ফ্র্যাঞ্চাইজি ও স্টাফ পার্টনার একাউন্ট অনুমোদন
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-bold text-purple-300 bg-purple-950 px-2.5 py-1 rounded-full border border-purple-700">
            অনুমোদিত পার্টনার: {approvedPartners.length} টি
          </span>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex bg-slate-950/80 border border-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'pending' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>পেন্ডিং আবেদনসমূহ ({pendingList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'approved' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>সক্রিয় পার্টনার ডিরেক্টরি ({approvedPartners.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 আবেদনকারীর নাম, ব্র্যান্ড, মোবাইল বা জেলা দিয়ে খুঁজুন..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
        />
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PENDING PARTNER APPLICATIONS                                       */}
      {/* ========================================================================= */}
      {activeTab === 'pending' ? (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredPending.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-40" />
              <span>কোনো নতুন পার্টনার আবেদন অপেক্ষমান নেই।</span>
            </div>
          ) : (
            filteredPending.map((p) => (
              <div 
                key={p.id} 
                className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2.5 text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-extrabold text-purple-400 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                      {p.id}
                    </span>
                    <span className="font-black text-slate-100 text-xs">
                      {p.brandName || p.applicantName}
                    </span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                      p.type === 'b2b_brand' 
                        ? 'bg-purple-950 text-purple-300 border-purple-700' 
                        : 'bg-blue-950 text-blue-300 border-blue-700'
                    }`}>
                      {p.type === 'b2b_brand' ? '🏢 B2B ব্র্যান্ড ওনার' : '💼 স্টাফ পার্টনার'}
                    </span>
                  </div>

                  <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-700 animate-pulse">
                    অপেক্ষমান
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">আবেদনকারী:</span>
                    <span className="font-bold text-slate-200">{p.applicantName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9.5px]">মোবাইল / হোয়াটসঅ্যাপ:</span>
                    <span className="font-mono font-bold text-emerald-400">{p.phone}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block text-[9.5px]">ঠিকানা ও জেলা:</span>
                    <span className="text-slate-300">{p.fullAddress} ({p.district})</span>
                  </div>
                </div>

                {/* Google Maps Location & Requested Services */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                  {p.googleMapsUrl && (
                    <a
                      href={p.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2 py-1 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-300 font-bold flex items-center space-x-1 hover:bg-emerald-900 transition"
                    >
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>গুগল ম্যাপে শপ লোকেশন দেখুন</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}

                  <span className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono">
                    সার্ভিস টিয়ার: <strong className="text-purple-300">{p.serviceTier}</strong>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                  <span>আবেদনের তারিখ: {p.submittedAt}</span>

                  <div className="flex space-x-1.5">
                    <button
                      onClick={() => rejectPartner(p.id, 'যোগ্যতার শর্ত পূরণ না হওয়ায় বাতিল')}
                      className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
                    >
                      বাতিল
                    </button>

                    <button
                      onClick={() => handleOpenApproveModal(p)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1 shadow-md shadow-emerald-600/30 active:scale-95"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>অনুমোদন ও অ্যাক্টিভেশন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* ========================================================================= */
        /* TAB 2: ACTIVE APPROVED PARTNERS DIRECTORY                                  */
        /* ========================================================================= */
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredApproved.map((p) => (
            <div 
              key={p.id} 
              className="p-3.5 bg-slate-950/90 border border-emerald-500/30 rounded-2xl space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-extrabold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    {p.partnerId || p.id}
                  </span>
                  <span className="font-extrabold text-slate-100 text-xs">
                    {p.brandName || p.applicantName}
                  </span>
                </div>

                <span className="text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-700">
                  🟢 সক্রিয় পার্টনার
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10.5px] text-slate-300 bg-slate-900/60 p-2 rounded-xl">
                <div>
                  <span className="text-slate-400 text-[9.5px]">লগইন ইউজারনেম:</span>
                  <span className="font-mono font-bold text-indigo-300 block">{p.assignedUsername || 'partner/user'}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9.5px]">সার্ভিস টিয়ার:</span>
                  <span className="font-bold text-emerald-400 block">{p.serviceTier}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9.5px]">কন্টাক্ট:</span>
                  <span className="font-mono text-slate-200 block">{p.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[9.5px]">লোকেশন:</span>
                  <span className="text-slate-200 truncate block">{p.district}</span>
                </div>
              </div>

              {p.customServerUrl && (
                <div className="p-2 bg-purple-950/40 border border-purple-800/60 rounded-xl text-[10px] text-purple-300 flex items-center justify-between">
                  <span>📡 কাস্টম GPS সার্ভার: <b className="font-mono text-purple-200">{p.customServerUrl}</b></span>
                  <span className="font-mono text-emerald-400 font-bold">পোর্ট: {p.customServerPort || '8082'}</span>
                </div>
              )}

              {p.googleMapsUrl && (
                <a
                  href={p.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>{p.fullAddress} (গুগল ম্যাপস)</span>
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* APPROVAL & ENTITLEMENT CONFIGURATION MODAL                                */}
      {/* ========================================================================= */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs text-emerald-300 flex items-center space-x-1.5">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>পার্টনার অনুমোদন ও সার্ভিস টিয়ার সেট</span>
              </span>
              <button onClick={() => setSelectedPartner(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div className="font-extrabold text-slate-100">
                {selectedPartner.brandName || selectedPartner.applicantName}
              </div>
              <div className="text-[10.5px] text-slate-400">
                আবেদনকারী: {selectedPartner.applicantName} • {selectedPartner.phone}
              </div>
              <div className="text-emerald-400 text-[10px] flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{selectedPartner.district}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmApproval} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  লগইন ইউজারনেম নির্ধারণ করুন *
                </label>
                <input
                  type="text"
                  required
                  value={assignedUsername}
                  onChange={(e) => setAssignedUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সার্ভিস ও ফিচার টিয়ার (Tenant Entitlement) *
                </label>
                <select
                  value={approvedTier}
                  onChange={(e) => setApprovedTier(e.target.value as PartnerServiceTier)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none cursor-pointer"
                >
                  <option value="all_inclusive">⚡ All-Inclusive (ট্র্যাকিং + ইঞ্জিন + সেন্সর + টেকনিশিয়ান + রেসকিউ)</option>
                  <option value="subscription_wise">💳 Modular (কাস্টমারের নিজস্ব প্যাকেজ অনুযায়ী)</option>
                  <option value="tracking_only">📍 Only Tracking (শুধু লাইভ ম্যাপ ও হিস্ট্রি)</option>
                </select>
              </div>

              {/* Bug Fix #5: Role multi-select — Super Admin can set exact approved roles */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1.5">
                  অনুমোদিত রোল সমূহ (নির্বাচন করুন) *
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['sales', 'technician', 'rescue', 'support', 'customer'] as SaasRole[]).map(role => {
                    const roleLabels: Record<string, string> = {
                      sales: '💼 সেলস এজেন্ট',
                      technician: '🔧 টেকনিশিয়ান',
                      rescue: '🚨 রেসকিউ টিম',
                      support: '🎧 সাপোর্ট',
                      customer: '👤 কাস্টমার'
                    };
                    const isChecked = approvedRoles.includes(role);
                    return (
                      <label
                        key={role}
                        className={`flex items-center space-x-1.5 px-2 py-1.5 rounded-xl border cursor-pointer transition text-[10.5px] ${
                          isChecked
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setApprovedRoles(prev =>
                              prev.includes(role)
                                ? prev.filter(r => r !== role)
                                : [...prev, role]
                            );
                          }}
                          className="w-3.5 h-3.5 text-emerald-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
                        />
                        <span className="font-bold">{roleLabels[role]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Custom B2B Traccar Server Endpoint (Optional for Bring-Your-Own-Server Logistics) */}
              <div className="bg-slate-950 p-2.5 rounded-xl border border-purple-500/30 space-y-2">
                <div className="flex items-center space-x-1.5 text-purple-300">
                  <LocateFixed className="w-3.5 h-3.5" />
                  <span className="font-bold text-[10.5px]">কাস্টম GPS ট্র্যাকিং সার্ভার এন্ডপয়েন্ট (ঐচ্ছিক):</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="https://gps.clientdomain.com (ডিফল্ট খালি)"
                      value={customServerUrl}
                      onChange={(e) => setCustomServerUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-purple-200 font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="পোর্ট: 8082"
                      value={customServerPort}
                      onChange={(e) => setCustomServerPort(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-purple-200 font-mono focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>
                <span className="text-[9.5px] text-slate-500 block">
                  ক্লায়েন্টের নিজস্ব Traccar সার্ভার থাকলে এখানে ইউআরএল বসিয়ে দিন।
                </span>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  অ্যাডমিন অ্যাপ্রুভাল নোট:
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSuccess ? 'অনুমোদন সম্পন্ন!' : 'অনুমোদন ও পার্টনার সক্রিয়'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
