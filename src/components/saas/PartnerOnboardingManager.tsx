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
  LocateFixed,
  Plus,
  Edit3,
  Eye,
  CreditCard,
  Smartphone,
  Globe,
  Save,
  Check
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
    addDirectPartner,
    updatePartnerDetails,
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('approved');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Direct Add Partner Modal State
  const [isDirectAddModalOpen, setIsDirectAddModalOpen] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newOwnerName, setNewOwnerName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newWhatsapp, setNewWhatsapp] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDistrict, setNewDistrict] = useState('ঢাকা');
  const [newThana, setNewThana] = useState('উত্তরা');
  const [newAddress, setNewAddress] = useState('');
  const [newTier, setNewTier] = useState<PartnerServiceTier>('all_inclusive');
  const [newSlotQuota, setNewSlotQuota] = useState(50);
  const [newCreditLimit, setNewCreditLimit] = useState(10000);
  const [newRoles, setNewRoles] = useState<SaasRole[]>(['partner', 'sales', 'technician', 'support', 'customer']);
  const [newLocationMode, setNewLocationMode] = useState<'on_site' | 'manual'>('on_site');
  const [newLat, setNewLat] = useState('');
  const [newLng, setNewLng] = useState('');

  // 2. Partner Dossier / Full Details View Modal
  const [viewingPartner, setViewingPartner] = useState<PartnerRegistrationEntry | null>(null);
  const [editingQuota, setEditingQuota] = useState<number>(50);
  const [editingCreditLimit, setEditingCreditLimit] = useState<number>(10000);

  // 3. Approval Modal State for Pending Queue
  const [selectedPartner, setSelectedPartner] = useState<PartnerRegistrationEntry | null>(null);
  const [assignedUsername, setAssignedUsername] = useState('');
  const [approvedTier, setApprovedTier] = useState<PartnerServiceTier>('all_inclusive');
  const [approvedRoles, setApprovedRoles] = useState<SaasRole[]>(['partner', 'sales', 'technician', 'support', 'customer']);
  const [customServerUrl, setCustomServerUrl] = useState('');
  const [customServerPort, setCustomServerPort] = useState('8082');
  const [adminNotes, setAdminNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOpenApproveModal = (partner: PartnerRegistrationEntry) => {
    setSelectedPartner(partner);
    const slug = (partner.brandName || partner.applicantName).toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15);
    setAssignedUsername(`partner/${slug}`);
    setApprovedTier(partner.serviceTier || 'all_inclusive');
    setApprovedRoles(partner.desiredRoles.length > 0 ? partner.desiredRoles : ['partner', 'sales', 'technician', 'support', 'customer']);
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
    }, 1200);
  };

  const handleDirectAddPartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim() || !newOwnerName.trim() || !newPhone.trim()) {
      alert('অনুগ্রহ করে ব্র্যান্ড নাম, ওনার নাম ও ফোন নম্বর লিখুন!');
      return;
    }

    const lat = newLocationMode === 'manual' && newLat ? parseFloat(newLat) : undefined;
    const lng = newLocationMode === 'manual' && newLng ? parseFloat(newLng) : undefined;
    const mapUrl = lat && lng ? `https://maps.google.com/?q=${lat},${lng}` : undefined;

    await addDirectPartner({
      type: 'b2b_brand',
      applicantName: newOwnerName.trim(),
      brandName: newBrandName.trim(),
      businessCategory: 'জিপিএস ফ্র্যাঞ্চাইজি ও সার্ভিস হাব',
      phone: newPhone.trim(),
      whatsapp: newWhatsapp.trim() || newPhone.trim(),
      email: newEmail.trim() || `${newBrandName.toLowerCase().replace(/[^a-z0-9]/g, '')}@easysoftsolution.net`,
      district: newDistrict,
      thana: newThana,
      fullAddress: newAddress.trim() || `${newThana}, ${newDistrict}`,
      shopName: newBrandName.trim(),
      geoLat: lat,
      geoLng: lng,
      googleMapsUrl: mapUrl,
      locationVerified: !!(lat && lng),
      locationVerifiedAt: lat && lng ? new Date().toISOString() : undefined,
      locationVerifiedBy: lat && lng ? 'Super Admin Direct' : undefined,
      desiredRoles: newRoles,
      requestedServices: ['server_tracking', 'shared_technicians', 'shared_support'],
      serviceTier: newTier,
      maxSlotQuota: newSlotQuota,
      floatingCreditLimit: newCreditLimit,
      assignedUsername: `partner/${newBrandName.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 15)}`
    });

    setIsDirectAddModalOpen(false);
    // Reset form
    setNewBrandName('');
    setNewOwnerName('');
    setNewPhone('');
    setNewAddress('');
    alert('✅ নতুন ফ্র্যাঞ্চাইজি পার্টনার সফলভাবে যুক্ত ও অনুমোদিত হয়েছে!');
  };

  const handleSavePartnerEdits = () => {
    if (!viewingPartner) return;
    updatePartnerDetails(viewingPartner.id, {
      maxSlotQuota: editingQuota,
      floatingCreditLimit: editingCreditLimit
    });
    setViewingPartner(prev => prev ? {
      ...prev,
      maxSlotQuota: editingQuota,
      floatingCreditLimit: editingCreditLimit
    } : null);
    alert('✅ পার্টনার স্লট কোটা ও ক্রেডিট লিমিট আপডেট হয়েছে!');
  };

  const pendingList = (partnerRegistrations || []).filter(p => p.status === 'pending_approval');
  const filteredPending = pendingList.filter(p =>
    (p.applicantName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brandName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.phone || '').includes(searchQuery) ||
    (p.district || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredApproved = (approvedPartners || []).filter(p =>
    (p.applicantName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.brandName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.phone || '').includes(searchQuery) ||
    (p.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.partnerId || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4 select-none">
      
      {/* ========================================================================= */}
      {/* 1. TOP HEADER WITH DIRECT ADD PARTNER ACTION                                */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-2xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-slate-100 flex items-center space-x-2">
              <span>B2B পার্টনার ও ফ্র্যাঞ্চাইজি অনবোর্ডিং হাব</span>
              {pendingList.length > 0 && (
                <span className="text-[9px] bg-rose-500 text-white font-mono px-2 py-0.2 rounded-full font-bold animate-pulse">
                  {pendingList.length} পেন্ডিং
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400">
              থার্ড-পার্টি ব্র্যান্ড, ফ্র্যাঞ্চাইজি নেটওয়ার্ক ও ফিজিক্যাল শপ অনবোর্ডিং
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsDirectAddModalOpen(true)}
          className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? '➕ নতুন পার্টনার সরাসরি যুক্ত করুন' : 'Add Partner Directly'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2. SUB-TABS: APPROVED DIRECTORY VS PENDING QUEUE                          */}
      {/* ========================================================================= */}
      <div className="flex bg-slate-950/80 border border-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setActiveTab('approved')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'approved' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>সক্রিয় পার্টনার ডিরেক্টরি ({approvedPartners.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'pending' 
              ? 'bg-purple-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-300" />
          <span>পেন্ডিং আবেদনসমূহ ({pendingList.length})</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={language === 'bn' ? 'পার্টনার নাম, ব্র্যান্ড, আইডি, মোবাইল বা জেলা দিয়ে খুঁজুন...' : 'Search by partner name, ID, phone or district...'}
          className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
        />
        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
      </div>

      {/* ========================================================================= */}
      {/* 3. APPROVED PARTNER DIRECTORY VIEW                                        */}
      {/* ========================================================================= */}
      {activeTab === 'approved' && (
        <div className="space-y-3">
          {filteredApproved.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/60 rounded-3xl border border-slate-800">
              কোনো পার্টনার পাওয়া যায়নি।
            </div>
          ) : (
            filteredApproved.map((partner) => (
              <div 
                key={partner.id}
                className="bg-slate-950 border border-slate-800 hover:border-purple-500/40 rounded-3xl p-4 transition shadow-lg space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 font-mono font-bold">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap">
                        <span className="font-extrabold text-sm text-white">
                          {partner.brandName || partner.applicantName}
                        </span>
                        <span className="px-2 py-0.2 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-purple-300 border border-slate-700">
                          {partner.partnerId || 'PRT-8801'}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        স্বত্বাধিকারী: <b className="text-slate-200">{partner.applicantName}</b> • ইউজারনেম: <span className="font-mono text-purple-300">{partner.assignedUsername || 'partner'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {partner.locationVerified ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>লোকেশন ভেরিফাইড</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center space-x-1 animate-pulse">
                        <AlertTriangle className="w-3 h-3" />
                        <span>শপ জিপিএস বাকি</span>
                      </span>
                    )}

                    <button
                      onClick={() => {
                        setViewingPartner(partner);
                        setEditingQuota(partner.maxSlotQuota || 50);
                        setEditingCreditLimit(partner.floatingCreditLimit || 10000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-white font-bold text-xs border border-purple-500/40 transition active:scale-95 flex items-center space-x-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>বিস্তারিত ও কন্ট্রোল</span>
                    </button>
                  </div>
                </div>

                {/* Quick Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">মোবাইল নম্বর:</span>
                    <span className="font-mono font-bold text-white">{partner.phone}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">দোকানের অবস্থান:</span>
                    <span className="font-bold text-white truncate block">{partner.district || 'ঢাকা'}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">৪,০৯৬ স্লট কোটা:</span>
                    <span className="font-mono font-bold text-indigo-400">{partner.maxSlotQuota || 50} টি স্লট</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">ফ্লোটিং লিমিট:</span>
                    <span className="font-mono font-bold text-rose-400">৳ {(partner.floatingCreditLimit || 10000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. PENDING APPLICATIONS QUEUE VIEW                                        */}
      {/* ========================================================================= */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {filteredPending.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-950/60 rounded-3xl border border-slate-800">
              কোনো নতুন পেন্ডিং আবেদন নেই।
            </div>
          ) : (
            filteredPending.map((partner) => (
              <div 
                key={partner.id}
                className="bg-slate-950 border border-amber-500/30 rounded-3xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-sm text-white">
                      {partner.brandName || partner.applicantName}
                    </h4>
                    <p className="text-xs text-slate-400">
                      আবেদনকারী: {partner.applicantName} • ফোন: {partner.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenApproveModal(partner)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center space-x-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>অনুমোদন ও সেটআপ</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: DIRECT ADD PARTNER (SUPER ADMIN ACTION)                         */}
      {/* ========================================================================= */}
      {isDirectAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-purple-500/50 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-extrabold text-sm text-purple-300 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <span>নতুন ফ্র্যাঞ্চাইজি পার্টনার অনবোর্ড করুন</span>
              </span>
              <button onClick={() => setIsDirectAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDirectAddPartnerSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    দোকান / ব্র্যান্ডের নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    placeholder="যেমন: উত্তরা গ্যাজেট হাব"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    মালিক / স্বত্বাধিকারীর নাম *
                  </label>
                  <input
                    type="text"
                    required
                    value={newOwnerName}
                    onChange={(e) => setNewOwnerName(e.target.value)}
                    placeholder="যেমন: মোঃ মিজানুর রহমান"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    মোবাইল নম্বর (লগইন ফোন) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    হোয়াটসঅ্যাপ নম্বর
                  </label>
                  <input
                    type="tel"
                    value={newWhatsapp}
                    onChange={(e) => setNewWhatsapp(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">জেলা</label>
                  <input
                    type="text"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">থানা / এরিয়া</label>
                  <input
                    type="text"
                    value={newThana}
                    onChange={(e) => setNewThana(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">দোকানের পূর্ণাঙ্গ ঠিকানা</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  placeholder="হাউজ ১২, রোড ৫, সেক্টর ৪, উত্তরা, ঢাকা"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none"
                />
              </div>

              {/* Physical Shop Location Capture Mode */}
              <div className="p-3 bg-purple-950/30 border border-purple-800/60 rounded-2xl space-y-2">
                <label className="text-[11px] font-bold text-purple-200 block">
                  📍 শপ লোকেশন ভেরিফিকেশন মোড (Mandatory Physical Capture Gate):
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewLocationMode('on_site')}
                    className={`p-2 rounded-xl border text-left text-[10.5px] transition ${
                      newLocationMode === 'on_site'
                        ? 'bg-purple-600 text-white border-purple-500 font-bold shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div className="font-bold">১. দোকানে গিয়ে লাইভ ক্যাপচার</div>
                    <div className="text-[9.5px] opacity-80">পার্টনার শপে গিয়ে জিপিএস দিবে</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewLocationMode('manual')}
                    className={`p-2 rounded-xl border text-left text-[10.5px] transition ${
                      newLocationMode === 'manual'
                        ? 'bg-purple-600 text-white border-purple-500 font-bold shadow-md'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    <div className="font-bold">২. এখনই কোঅর্ডিনেট বসান</div>
                    <div className="text-[9.5px] opacity-80">ল্যাট, লং দিয়ে ভেরিফাই</div>
                  </button>
                </div>

                {newLocationMode === 'manual' && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Latitude (e.g. 23.8683)"
                      value={newLat}
                      onChange={(e) => setNewLat(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Longitude (e.g. 90.3995)"
                      value={newLng}
                      onChange={(e) => setNewLng(e.target.value)}
                      className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-white font-mono"
                    />
                  </div>
                )}
              </div>

              {/* Slot Quota & Credit Limits */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    প্রাথমিক ৪,০৯৬ স্লট কোটা
                  </label>
                  <input
                    type="number"
                    value={newSlotQuota}
                    onChange={(e) => setNewSlotQuota(parseInt(e.target.value) || 50)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    ফ্লোটিং ক্রেডিট লিমিট (টাকা)
                  </label>
                  <input
                    type="number"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(parseInt(e.target.value) || 10000)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsDirectAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-750 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition active:scale-95"
                >
                  অনবোর্ড ও সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: FULL PARTNER DOSSIER & EDIT CONTROLS                             */}
      {/* ========================================================================= */}
      {viewingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-purple-500/50 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="font-extrabold text-sm text-purple-300 flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-purple-400" />
                <span>পার্টনার পূর্ণাঙ্গ প্রোফাইল ও কন্ট্রোল</span>
              </span>
              <button onClick={() => setViewingPartner(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-white">{viewingPartner.brandName || viewingPartner.applicantName}</span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-800 text-purple-300">
                  {viewingPartner.partnerId}
                </span>
              </div>
              <div className="text-slate-400">মালিক: <b className="text-slate-200">{viewingPartner.applicantName}</b> • ফোন: {viewingPartner.phone}</div>
              <div className="text-slate-400">ঠিকানা: {viewingPartner.fullAddress || viewingPartner.district}</div>
            </div>

            {/* Location Verification Status */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-300">গুগল ম্যাপস লোকেশন ভেরিফিকেশন:</span>
                {viewingPartner.locationVerified ? (
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>ভেরিফাইড</span>
                  </span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>শপ জিপিএস বাকি</span>
                  </span>
                )}
              </div>
              {viewingPartner.geoLat && viewingPartner.geoLng && (
                <div className="font-mono text-cyan-300 text-[11px]">
                  কোঅর্ডিনেট: {viewingPartner.geoLat}, {viewingPartner.geoLng}
                </div>
              )}
            </div>

            {/* Slot & Floating Credit Editors */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-[10.5px] font-bold text-indigo-300 block">বরাদ্দকৃত স্লট কোটা:</label>
                <input
                  type="number"
                  value={editingQuota}
                  onChange={(e) => setEditingQuota(parseInt(e.target.value) || 50)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-xs text-white font-mono font-bold"
                />
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <label className="text-[10.5px] font-bold text-rose-300 block">ফ্লোটিং ক্রেডিট লিমিট (টাকা):</label>
                <input
                  type="number"
                  value={editingCreditLimit}
                  onChange={(e) => setEditingCreditLimit(parseInt(e.target.value) || 10000)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-1.5 text-xs text-white font-mono font-bold"
                />
              </div>
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                type="button"
                onClick={() => setViewingPartner(null)}
                className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
              <button
                type="button"
                onClick={handleSavePartnerEdits}
                className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. APPROVAL & ENTITLEMENT CONFIGURATION MODAL (FROM PENDING QUEUE)         */}
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
                  সার্ভিস ও ফিচার টিয়ার *
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
