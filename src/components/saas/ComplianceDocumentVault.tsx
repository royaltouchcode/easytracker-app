import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ShieldCheck, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Download, 
  Upload, 
  ExternalLink, 
  Search, 
  Clock, 
  Eye, 
  X,
  FileCheck,
  Building2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export interface VehicleDocument {
  id: string;
  deviceId: number;
  vehiclePlate: string;
  docType: 'tax_token' | 'fitness_cert' | 'route_permit' | 'insurance' | 'driver_license';
  docNumber: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  fileUrl?: string;
  status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED';
  daysRemaining: number;
}

export const INITIAL_DOCUMENTS: VehicleDocument[] = [
  {
    id: 'doc_1',
    deviceId: 1,
    vehiclePlate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
    docType: 'fitness_cert',
    docNumber: 'BRTA-FIT-88912',
    issueDate: '2025-09-01',
    expiryDate: '2026-09-01',
    issuingAuthority: 'বিআরটিএ মিরপুর সার্কেল',
    status: 'EXPIRING_SOON',
    daysRemaining: 6
  },
  {
    id: 'doc_2',
    deviceId: 1,
    vehiclePlate: 'ঢাকা মেট্রো-গ ১২-৩৪৫৬',
    docType: 'tax_token',
    docNumber: 'TAX-TOK-99214',
    issueDate: '2025-10-15',
    expiryDate: '2026-10-15',
    issuingAuthority: 'বিআরটিএ ইকুরিয়া সার্কেল',
    status: 'VALID',
    daysRemaining: 50
  },
  {
    id: 'doc_3',
    deviceId: 2,
    vehiclePlate: 'ঢাকা মেট্রো-ল ৯৮-৭৬৫৪',
    docType: 'insurance',
    docNumber: 'INS-GRE-77123',
    issueDate: '2025-08-20',
    expiryDate: '2026-08-20',
    issuingAuthority: 'গ্রিন ডেল্টা ইন্স্যুরেন্স',
    status: 'EXPIRED',
    daysRemaining: -6
  },
  {
    id: 'doc_4',
    deviceId: 3,
    vehiclePlate: 'ঢাকা মেট্রো-ট ৫৫-৪৪৩২',
    docType: 'route_permit',
    docNumber: 'RTE-DHK-CTG-009',
    issueDate: '2025-12-01',
    expiryDate: '2026-12-01',
    issuingAuthority: 'রিজিওনাল ট্রান্সপোর্ট কমিটি (RTC)',
    status: 'VALID',
    daysRemaining: 97
  }
];

export const ComplianceDocumentVault: React.FC<{ isCustomerScoped?: boolean }> = ({ isCustomerScoped = false }) => {
  const { devices, selectedDevice, currentRole } = useApp();

  const [documents, setDocuments] = useState<VehicleDocument[]>(() => {
    const saved = localStorage.getItem('gps_vehicle_compliance_docs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_DOCUMENTS;
  });

  const [selectedFilter, setSelectedFilter] = useState<'all' | 'tax_token' | 'fitness_cert' | 'route_permit' | 'insurance'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // New Doc Form
  const [formVehiclePlate, setFormVehiclePlate] = useState('');
  const [formDocType, setFormDocType] = useState<'tax_token' | 'fitness_cert' | 'route_permit' | 'insurance'>('fitness_cert');
  const [formDocNumber, setFormDocNumber] = useState('');
  const [formExpiryDate, setFormExpiryDate] = useState('');
  const [formAuthority, setFormAuthority] = useState('বিআরটিএ মিরপুর সার্কেল');

  // Filter Documents by Scope
  // If Customer role or customer-scoped, strictly filter to user's devices
  const scopedDocuments = documents.filter((doc) => {
    if (isCustomerScoped || currentRole === 'customer') {
      const userDeviceIds = devices.map(d => d.id);
      return userDeviceIds.includes(doc.deviceId);
    }
    return true;
  });

  const filteredDocs = scopedDocuments.filter((doc) => {
    if (selectedFilter !== 'all' && doc.docType !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        doc.vehiclePlate.toLowerCase().includes(q) ||
        doc.docNumber.toLowerCase().includes(q) ||
        doc.issuingAuthority.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSaveDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formVehiclePlate.trim() || !formDocNumber.trim() || !formExpiryDate) return;

    const matchedDevice = devices.find(d => d.name === formVehiclePlate) || devices[0];
    const exp = new Date(formExpiryDate);
    const now = new Date();
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    const status: 'VALID' | 'EXPIRING_SOON' | 'EXPIRED' = 
      diffDays < 0 ? 'EXPIRED' : diffDays <= 30 ? 'EXPIRING_SOON' : 'VALID';

    const newDoc: VehicleDocument = {
      id: `doc_${Date.now()}`,
      deviceId: matchedDevice ? matchedDevice.id : 1,
      vehiclePlate: formVehiclePlate.trim(),
      docType: formDocType,
      docNumber: formDocNumber.trim(),
      issueDate: new Date().toISOString().slice(0, 10),
      expiryDate: formExpiryDate,
      issuingAuthority: formAuthority,
      status,
      daysRemaining: diffDays
    };

    const updated = [newDoc, ...documents];
    setDocuments(updated);
    localStorage.setItem('gps_vehicle_compliance_docs', JSON.stringify(updated));
    setIsUploadModalOpen(false);
  };

  const handleDeleteDoc = (id: string) => {
    if (confirm('আপনি কি নিশ্চিত যে এই ডকুমেন্ট রেকর্ডটি মুছে ফেলতে চান?')) {
      const updated = documents.filter(d => d.id !== id);
      setDocuments(updated);
      localStorage.setItem('gps_vehicle_compliance_docs', JSON.stringify(updated));
    }
  };

  // KPI Metrics
  const expiringCount = scopedDocuments.filter(d => d.status === 'EXPIRING_SOON').length;
  const expiredCount = scopedDocuments.filter(d => d.status === 'EXPIRED').length;
  const validCount = scopedDocuments.filter(d => d.status === 'VALID').length;

  return (
    <div className="space-y-4 select-none">
      
      {/* Top Banner with Owner Designation */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 text-emerald-400 border border-emerald-500/50 flex items-center justify-center shadow-lg shrink-0">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="font-extrabold text-base text-white">
                📅 বিআরটিএ লিগ্যাল কমপ্লায়েন্স ও ডকুমেন্টস ভল্ট
              </h3>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">
                👔 মালিকের ভল্ট (OWNER ONLY)
              </span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                🔔 অটো পুশ ও এসএমএস এলার্ট
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              গাড়ির ট্যাক্স টোকেন, ফিটনেস, রুট পারমিট ও ইন্স্যুরেন্সের মেয়াদ ট্র্যাকিং (ড্রাইভারের লাইসেন্স ড্রাইভার প্রোফাইলে সংরক্ষিত)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setFormVehiclePlate(devices[0]?.name || 'ঢাকা মেট্রো-গ ১২-৩৪৫৬');
            setIsUploadModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ নতুন ডকুমেন্ট যুক্ত করুন</span>
        </button>
      </div>

      {/* 2-Tier Alert Banners: Advance Warning vs High Risk Expired Fine Danger */}
      {expiredCount > 0 && (
        <div className="p-3.5 rounded-2xl bg-rose-500/20 border border-rose-500/50 text-rose-200 flex items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <span className="text-xs font-black text-white block">
                🚨 হাই রিস্ক ট্রাফিক মামলা ও ডাম্পিং এলার্ট! ({expiredCount} টি ডকুমেন্ট মেয়াদোত্তীর্ণ)
              </span>
              <span className="text-[11px] text-rose-300">
                গাড়ির প্রয়োজনীয় কাগজপত্রের মেয়াদ শেষ হয়েছে। এই অবস্থায় রাস্তায় গাড়ি বের করলে বিআরটিএ বা ট্রাফিক পুলিশ ভারী জরিমানা ও গাড়ি ডাম্পিং করতে পারে!
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-rose-600 text-white px-2.5 py-1 rounded-xl shrink-0">
            HIGH DANGER
          </span>
        </div>
      )}

      {expiringCount > 0 && (
        <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-200 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-xs font-bold text-amber-300 block">
                ⚠️ অ্যাডভান্স রিমাইন্ডার ({expiringCount} টি ডকুমেন্টের মেয়াদ ৩০ দিনের কম বাকি)
              </span>
              <span className="text-[11px] text-amber-200/80">
                দেরি ফি ও জরিমানা এড়াতে এখনই বিআরটিএ সার্কেল অফিস বা ইন্স্যুরেন্স কোম্পানিতে রিনিউ করার আবেদন করুন।
              </span>
            </div>
          </div>
          <span className="text-[9.5px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-lg shrink-0">
            SMS SENT TO OWNER
          </span>
        </div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-slate-400 font-bold block">মোট ডকুমেন্টস</span>
          <span className="text-lg font-black text-white">{scopedDocuments.length} টি</span>
        </div>
        <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-emerald-400 font-bold block">বৈধ (Valid)</span>
          <span className="text-lg font-black text-emerald-300">{validCount} টি</span>
        </div>
        <div className="bg-slate-900 border border-amber-500/40 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-amber-400 font-bold block">মেয়াদ শেষের পথে (&lt;30d)</span>
          <span className="text-lg font-black text-amber-300">{expiringCount} টি</span>
        </div>
        <div className="bg-slate-900 border border-rose-500/40 p-3.5 rounded-2xl">
          <span className="text-[10.5px] text-rose-400 font-bold block">মেয়াদোত্তীর্ণ (Expired)</span>
          <span className="text-lg font-black text-rose-300">{expiredCount} টি</span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto text-xs">
          <button
            type="button"
            onClick={() => setSelectedFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              selectedFilter === 'all' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            সকল ({scopedDocuments.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('fitness_cert')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              selectedFilter === 'fitness_cert' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🚗 ফিটনেস
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('tax_token')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              selectedFilter === 'tax_token' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            📑 ট্যাক্স টোকেন
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('route_permit')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              selectedFilter === 'route_permit' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🛣️ রুট পারমিট
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter('insurance')}
            className={`px-3 py-1.5 rounded-xl font-bold border transition ${
              selectedFilter === 'insurance' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            🛡️ ইন্স্যুরেন্স
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="গাড়ি নম্বর বা সার্টিফিকেট দিয়ে খুঁজুন..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {filteredDocs.map((doc) => {
          const typeLabel = 
            doc.docType === 'fitness_cert' ? '🚗 বিআরটিএ ফিটনেস সার্টিফিকেট' :
            doc.docType === 'tax_token' ? '📑 ট্যাক্স টোকেন সার্টিফিকেট' :
            doc.docType === 'route_permit' ? '🛣️ রিজিওনাল রুট পারমিট' : '🛡️ যানবাহন বীমা (Insurance)';

          const statusBadge = 
            doc.status === 'VALID' ? (
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                ✅ বৈধ ({doc.daysRemaining} দিন বাকি)
              </span>
            ) : doc.status === 'EXPIRING_SOON' ? (
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 animate-pulse">
                ⚠️ আর {doc.daysRemaining} দিন বাকি!
              </span>
            ) : (
              <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded-full border border-rose-500/40">
                🚨 মেয়াদোত্তীর্ণ ({Math.abs(doc.daysRemaining)} দিন পূর্বে শেষ)
              </span>
            );

          return (
            <div 
              key={doc.id}
              className={`p-4 rounded-3xl border transition-all space-y-3 ${
                doc.status === 'EXPIRED' 
                  ? 'bg-rose-950/20 border-rose-500/40' 
                  : doc.status === 'EXPIRING_SOON'
                  ? 'bg-amber-950/20 border-amber-500/40'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-black text-white block">{doc.vehiclePlate}</span>
                  <span className="text-[11px] text-slate-300 font-bold">{typeLabel}</span>
                </div>
                {statusBadge}
              </div>

              <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800/80 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">সার্টিফিকেট নং:</span>
                  <span className="font-mono font-bold text-indigo-300">{doc.docNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ইস্যুকারী কর্তৃপক্ষ:</span>
                  <span className="text-slate-200 truncate block">{doc.issuingAuthority}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">ইস্যুর তারিখ:</span>
                  <span className="font-mono text-slate-300">{doc.issueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold text-amber-300">মেয়াদ উত্তীর্ণের তারিখ:</span>
                  <span className="font-mono font-black text-amber-300">{doc.expiryDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <a
                  href="https://www.brta.gov.bd"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10.5px] text-emerald-400 hover:underline flex items-center space-x-1 font-bold"
                >
                  <span>বিআরটিএ সার্ভিস পোর্টাল</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  type="button"
                  onClick={() => handleDeleteDoc(doc.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 transition"
                  title="ডকুমেন্ট মুছুন"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload New Document Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-emerald-300 flex items-center space-x-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>নতুন বিআরটিএ ডকুমেন্ট এন্ট্রি</span>
              </h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoc} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">গাড়ি নির্বাচন / রেজিস্ট্রেশন প্লেট *</label>
                <select
                  value={formVehiclePlate}
                  onChange={(e) => setFormVehiclePlate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ডকুমেন্ট টাইপ *</label>
                <select
                  value={formDocType}
                  onChange={(e) => setFormDocType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="fitness_cert">🚗 বিআরটিএ ফিটনেস সার্টিফিকেট</option>
                  <option value="tax_token">📑 ট্যাক্স টোকেন</option>
                  <option value="route_permit">🛣️ রিজিওনাল রুট পারমিট</option>
                  <option value="insurance">🛡️ ভেহিকেল ইন্স্যুরেন্স</option>
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">সার্টিফিকেট / টোকেন নম্বর *</label>
                <input
                  type="text"
                  required
                  value={formDocNumber}
                  onChange={(e) => setFormDocNumber(e.target.value)}
                  placeholder="যেমন: BRTA-FIT-90812"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মেয়াদ উত্তীর্ণের তারিখ (Expiry Date) *</label>
                <input
                  type="date"
                  required
                  value={formExpiryDate}
                  onChange={(e) => setFormExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ইস্যুকারী সার্কেল / কর্তৃপক্ষ</label>
                <input
                  type="text"
                  value={formAuthority}
                  onChange={(e) => setFormAuthority(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-600/30"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
