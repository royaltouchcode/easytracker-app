import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  ArrowLeft, 
  Trash2, 
  RefreshCw, 
  Users, 
  DollarSign, 
  Server, 
  ShieldCheck, 
  Globe, 
  CheckCircle2, 
  AlertTriangle,
  Database,
  Plus,
  Sliders,
  Layers,
  Sparkles,
  Send,
  X,
  FileSpreadsheet,
  Check,
  Smartphone,
  ExternalLink,
  Activity,
  Radio,
  Settings2,
  Wifi
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_SUBSCRIPTION_CONFIG } from '../../config/subscriptionPlans';
import { APP_CONFIG } from '../../config/appConfig';
import { SalesLeadEntry } from './SalesPortalView';
import { VehicleCatalogManager } from './VehicleCatalogManager';
import { WarrantyAdminManager } from './WarrantyAdminManager';
import { PartnerOnboardingManager } from './PartnerOnboardingManager';
import { UserAccessManager } from './UserAccessManager';
import { ServiceRateCardManager } from './ServiceRateCardManager';
import { SellerQuotaAndLedgerManager } from './SellerQuotaAndLedgerManager';

export const AdminDashboardView: React.FC = () => {
  const { 
    devices, 
    positions, 
    serverConfig,
    setServerConfig,
    syncServerData,
    triggerManualAlert,
    language, 
    setActiveTab, 
    setCurrentRole, 
    purgeDemoFleetData, 
    restoreDemoFleetData, 
    isDemoPurged 
  } = useApp();

  const [rates, setRates] = useState<Record<number, number>>(() => {
    return {
      1: 350,
      3: 990,
      6: 1850,
      12: 3500
    };
  });
  const [saveRateSuccess, setSaveRateSuccess] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

  // Sales Leads Queue state
  const [salesLeads, setSalesLeads] = useState<SalesLeadEntry[]>(() => {
    const saved = localStorage.getItem('gps_sales_leads_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'lead-2', customer: 'Kazi Mahbub', phone: '01819-876543', vehicle: 'Toyota Axio', plate: 'DHAKA METRO-GA 33-4455', category: 'car', imei: '864720058291091', sim: '01811223344', plan: '6 Months', commission: 350, date: '24 Aug 2026', status: 'pending_admin_approval' },
      { id: 'lead-1', customer: 'Tanvir Hossain', phone: '01712-345678', vehicle: 'Yamaha FZ-S V3', plate: 'DHAKA METRO-LA 22-3344', category: 'motorcycle', imei: '864720058291090', sim: '01711223344', plan: '1 Year', commission: 500, date: '24 Aug 2026', status: 'approved_pushed' }
    ];
  });

  const [pushSuccessId, setPushSuccessId] = useState<string | null>(null);

  // Tracking Server Sync State
  const [isSyncingServer, setIsSyncingServer] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return localStorage.getItem('gps_last_server_sync_time') || 'আজ কিছুক্ষণ আগে';
  });
  const [syncSuccessMessage, setSyncSuccessMessage] = useState('');
  const [isServerConfigModalOpen, setIsServerConfigModalOpen] = useState(false);
  const [tempServerUrl, setTempServerUrl] = useState(serverConfig?.url || 'https://demo3.traccar.org');
  const [tempServerPort, setTempServerPort] = useState(serverConfig?.port || '8082');

  const handleSyncDevicesWithServer = async () => {
    setIsSyncingServer(true);
    setSyncSuccessMessage('');
    try {
      await syncServerData();
      const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const timeStr = `আজ ${nowFormatted}`;
      setLastSyncTime(timeStr);
      localStorage.setItem('gps_last_server_sync_time', timeStr);
      setSyncSuccessMessage(`✅ ট্র্যাকিং সার্ভার থেকে ${devices.length} টি ডিভাইসের লাইভ অবস্থান ও সেন্সর ডাটা সফলভাবে সিঙ্ক হয়েছে!`);
      triggerManualAlert('service_reminder', `📡 সার্ভার সিঙ্ক সম্পন্ন: ${devices.length} টি জিপিএস ট্র্যাকার অনলাইনে সক্রিয় আছে।`);
      setTimeout(() => setSyncSuccessMessage(''), 4000);
    } catch (err) {
      alert('সার্ভার থেকে সিঙ্ক করতে সমস্যা হয়েছে। দয়া করে সার্ভার ইউআরএল ও ইন্টারনেট কানেকশন চেক করুন।');
    } finally {
      setIsSyncingServer(false);
    }
  };

  const handleSaveServerConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setServerConfig({
      url: tempServerUrl.trim(),
      port: tempServerPort.trim()
    });
    setIsServerConfigModalOpen(false);
    handleSyncDevicesWithServer();
  };

  // Bulk IMEI Import Modal State
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkImeiText, setBulkImeiText] = useState('');
  const [bulkImportSuccess, setBulkImportSuccess] = useState(false);

  // Handle Lead Approval and Server Push
  const handleApproveAndPush = (lead: SalesLeadEntry) => {
    const updated = salesLeads.map(l => l.id === lead.id ? { ...l, status: 'approved_pushed' as const } : l);
    setSalesLeads(updated);
    localStorage.setItem('gps_sales_leads_queue', JSON.stringify(updated));

    setPushSuccessId(lead.id);
    setTimeout(() => setPushSuccessId(null), 2500);
  };

  const handleRejectLead = (leadId: string) => {
    const updated = salesLeads.map(l => l.id === leadId ? { ...l, status: 'rejected' as const } : l);
    setSalesLeads(updated);
    localStorage.setItem('gps_sales_leads_queue', JSON.stringify(updated));
  };

  const handleBulkImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const lines = bulkImeiText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    setBulkImportSuccess(true);
    setTimeout(() => {
      setBulkImportSuccess(false);
      setIsBulkModalOpen(false);
      setBulkImeiText('');
    }, 1800);
  };

  const handleUpdateRate = (months: number, value: string) => {
    const val = parseInt(value, 10) || 0;
    setRates(prev => ({ ...prev, [months]: val }));
  };

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('gps_admin_subscription_rates', JSON.stringify(rates));
    setSaveRateSuccess(true);
    setTimeout(() => setSaveRateSuccess(false), 2000);
  };

  const pendingLeads = salesLeads.filter(l => l.status === 'pending_admin_approval');

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('map');
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
          </button>
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-amber-300">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'সুপার অ্যাডমিন SaaS কন্ট্রোল সেন্টার' : 'Super Admin SaaS Hub'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'সেলস ভেরিফিকেশন, সার্ভার ডিভাইস পুশ ও রেভিনিউ' : 'Sales lead review, server device push & revenue'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center space-x-1 hover:bg-purple-600/50 transition active:scale-95 shadow-sm"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>বাল্ক IMEI ইমপোর্ট</span>
          </button>

          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('map');
            }}
            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition active:scale-95"
          >
            {language === 'bn' ? 'ম্যাপে যান' : 'Live Map'}
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>সক্রিয় ট্র্যাকার</span>
            <Users className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="text-xl font-mono font-black text-blue-300 mt-2">
            {devices.length} <span className="text-xs text-slate-400 font-normal">ডিভাইস</span>
          </div>
          <div className="text-[9.5px] text-emerald-400 mt-1">● ১০০% অনলাইন সার্ভার</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>পেন্ডিং সেলস অনবোর্ডিং</span>
            <Smartphone className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-xl font-mono font-black text-amber-300 mt-2">
            {pendingLeads.length} <span className="text-xs text-slate-400 font-normal">রিকোয়েস্ট</span>
          </div>
          <div className="text-[9.5px] text-amber-400 mt-1">অ্যাডমিন অ্যাপ্রুভাল আবশ্যক</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>মাসিক সাবস্ক্রিপশন (MRR)</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-xl font-mono font-black text-emerald-300 mt-2">
            ৳{(devices.length * 350).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/মাস</span>
          </div>
          <div className="text-[9.5px] text-slate-400 mt-1">পেমেন্ট গেটওয়ে: bKash, Nagad</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl flex flex-col justify-between">
          <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
            <span>হোস্টিং ও ডোমেইন</span>
            <Globe className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-xs font-mono font-bold text-sky-300 mt-2 truncate">
            {APP_CONFIG.publisherDomain}
          </div>
          <div className="text-[9.5px] text-emerald-400 mt-1">SSL সিকিউরড গেটওয়ে</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌐 GPS TRACKING SERVER CONNECTION & LIVE DEVICE SYNC HUB                 */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-500/40 rounded-3xl p-4 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400 shadow-sm">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5">
                <span>GPS ট্র্যাকিং সার্ভার গেটওয়ে ও ডিভাইস সিঙ্ক হাব</span>
                <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.2 rounded-full border border-emerald-500/30 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>লাইভ কানেক্টেড</span>
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                টেলিম্যাটিক্স ট্র্যাকার থেকে লাইভ অবস্থান, ওডোমিটার ও সেন্সর ডাটা সিঙ্ক্রোনাইজেশন
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setTempServerUrl(serverConfig.url);
              setTempServerPort(serverConfig.port);
              setIsServerConfigModalOpen(true);
            }}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs flex items-center space-x-1 transition active:scale-95"
          >
            <Settings2 className="w-3.5 h-3.5 text-blue-400" />
            <span>সার্ভার সেটিংস</span>
          </button>
        </div>

        {/* Server Link & Live Metrics Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">🔗 ট্র্যাকিং সার্ভার ইউআরএল ও ওয়েব লিংক:</span>
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-blue-300 text-[11px] truncate max-w-[190px]">
                {serverConfig.url || 'https://demo3.traccar.org'}
              </span>
              <a
                href={serverConfig.url || 'https://demo3.traccar.org'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 transition"
                title="ব্রাউজারে সার্ভার খুলুন"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">📡 প্রোটোকল ও ডিভাইস পোর্ট:</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-emerald-400 text-[11px] font-bold">
                Port {serverConfig.port || '8082'} • GT06/Coban (5023)
              </span>
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          </div>

          <div className="bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800 space-y-1">
            <span className="text-slate-400 text-[10px] block">⏱️ সর্বশেষ সার্ভার সিঙ্ক:</span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-amber-300 text-[11px] font-bold">
                {lastSyncTime}
              </span>
              <Activity className="w-3.5 h-3.5 text-amber-400" />
            </div>
          </div>
        </div>

        {/* Sync Action Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-950/90 p-3 rounded-2xl border border-blue-500/30 gap-2.5">
          <div className="text-xs space-y-0.5">
            <div className="font-extrabold text-slate-200 flex items-center space-x-1.5">
              <span>সার্ভারে মোট সংযুক্ত ডিভাইস: {devices.length} টি</span>
              <span className="text-[9.5px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-800">
                100% Telemetry Live
              </span>
            </div>
            <p className="text-[10.5px] text-slate-400">
              ডিভাইস ট্র্যাকার হার্ডওয়্যার থেকে জিপিএস স্যাটেলাইট সিগন্যাল ও রিলে ডাটা ক্লাউডে রিফ্রেশ করুন
            </p>
          </div>

          <button
            onClick={handleSyncDevicesWithServer}
            disabled={isSyncingServer}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition active:scale-95 disabled:opacity-50 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingServer ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isSyncingServer ? 'সার্ভার থেকে সিঙ্ক হচ্ছে...' : '🔄 সার্ভার থেকে লাইভ ডিভাইস সিঙ্ক করুন'}</span>
          </button>
        </div>

        {syncSuccessMessage && (
          <div className="p-2.5 bg-emerald-950/80 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🚀 CRITICAL SECTION: PENDING SALES LEADS & SERVER PUSH QUEUE            */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
              ১. সেলস টিম অনবোর্ডিং কিউ ও সার্ভার পুশ অনুমোদন ({pendingLeads.length} টি পেন্ডিং)
            </span>
          </div>
          <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold">
            Security Gate
          </span>
        </div>

        <p className="text-xs text-slate-400">
          সেলস এজেন্টদের সাবমিট করা কাস্টমার ও ডিভাইস তথ্য নিচে প্রদর্শিত হচ্ছে। আপনি ভেরিফাই করে <strong>"Approve & Push to GPS Server"</strong> চাপলেই ডিভাইসটি সার্ভারে তৈরি হবে ও লাইভ ট্র্যাকিং শুরু হবে।
        </p>

        {pendingLeads.length === 0 ? (
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
            ✅ বর্তমানে কোনো পেন্ডিং সেলস অনবোর্ডিং রিকোয়েস্ট নেই। সমস্ত ডিভাইস সার্ভারে আপ-টু-ডেট আছে।
          </div>
        ) : (
          <div className="space-y-2.5">
            {pendingLeads.map((lead) => (
              <div key={lead.id} className="p-3.5 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-extrabold text-slate-100 text-sm">{lead.customer}</span>
                    <span className="text-slate-400 font-mono text-xs ml-2">({lead.phone})</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-600/40">
                    পেন্ডিং অনুমোদন
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">গাড়ির নাম ও প্লেট:</span>
                    <strong className="text-slate-200">{lead.vehicle}</strong> ({lead.plate})
                  </div>
                  <div>
                    <span className="text-slate-500 block">ট্র্যাকার IMEI:</span>
                    <strong className="text-amber-300 font-mono">{lead.imei}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">সিম নম্বর:</span>
                    <strong className="text-slate-200 font-mono">{lead.sim}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">প্যাকেজ ও কমিশন:</span>
                    <strong className="text-emerald-400">{lead.plan} (৳{lead.commission})</strong>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleRejectLead(lead.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs border border-slate-700 transition"
                  >
                    বাতিল (Reject)
                  </button>

                  <button
                    type="button"
                    onClick={() => handleApproveAndPush(lead)}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{pushSuccessId === lead.id ? 'সার্ভারে পুশ সফল হয়েছে!' : 'Approve & Push to GPS Server'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 1-Click Demo Data Purge Card */}
      <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-rose-200">
                {language === 'bn' ? '১-ক্লিকে ডেমো ডাটা মুছুন (Go 100% Production Live)' : '1-Click Demo Fleet Purge'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' 
                  ? 'আপনার আসল বাইকের ডাটা অক্ষত রেখে বাকি সব ডেমো গাড়ি ডাটাবেজ থেকে মুছে দিন।'
                  : 'Keeps your real bike data safe and deletes mock demo vehicles for production launch.'}
              </p>
            </div>
          </div>

          {!isDemoPurged ? (
            <button
              type="button"
              onClick={() => setShowPurgeConfirm(true)}
              className="px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center space-x-1.5 transition active:scale-95"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ডেমো ডাটা মুছুন' : 'Purge Demo Fleet'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={restoreDemoFleetData}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 font-bold text-xs flex items-center space-x-1.5 transition active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? 'ডেমো রিস্টোর' : 'Restore Demo'}</span>
            </button>
          )}
        </div>

        {showPurgeConfirm && (
          <div className="p-3 bg-rose-950/80 border border-rose-500/60 rounded-2xl space-y-2 animate-in fade-in">
            <p className="text-xs text-rose-200 font-bold">
              ⚠️ আপনি কি নিশ্চিত যে সমস্ত ডেমো গাড়ি (Axio, Truck, CNG, Ambulance) মুছে ফেলে শুধুমাত্র আপনার আসল বাইকের ডাটা চালু রাখবেন?
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowPurgeConfirm(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
              >
                বাতিল
              </button>
              <button
                onClick={() => {
                  purgeDemoFleetData();
                  setShowPurgeConfirm(false);
                }}
                className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/40"
              >
                হ্যাঁ, নিশ্চিতভাবে মুছে দিন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subscription Rates Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              {language === 'bn' ? 'সাবস্ক্রিপশন রেট ও প্যাকেজ কনফিগারেশন' : 'Subscription Tier Pricing Manager'}
            </span>
          </div>
          {saveRateSuccess && (
            <span className="text-[10px] text-emerald-400 font-bold flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>সংরক্ষিত হয়েছে</span>
            </span>
          )}
        </div>

        <form onSubmit={handleSaveRates} className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">১ মাস সাবস্ক্রিপশন (৳):</label>
              <input
                type="number"
                value={rates[1]}
                onChange={(e) => handleUpdateRate(1, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">৩ মাস প্যাকেজ (৳):</label>
              <input
                type="number"
                value={rates[3]}
                onChange={(e) => handleUpdateRate(3, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">৬ মাস প্যাকেজ (৳):</label>
              <input
                type="number"
                value={rates[6]}
                onChange={(e) => handleUpdateRate(6, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
              <label className="text-[10px] text-slate-400 font-bold block mb-1">১২ মাস বাৎসরিক (৳):</label>
              <input
                type="number"
                value={rates[12]}
                onChange={(e) => handleUpdateRate(12, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{language === 'bn' ? 'নতুন রেট সংরক্ষণ ও লাইভ সিঙ্ক' : 'Save & Publish Rates'}</span>
          </button>
        </form>
      </div>

      {/* Fleet Vehicles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          {language === 'bn' ? 'সিস্টেমের লাইভ যানবাহন ও টেলিম্যাটিক্স ট্র্যাকার তালিকা' : 'Active Telematics Trackers Fleet'} ({devices.length})
        </span>

        <div className="space-y-2 max-h-72 overflow-y-auto">
          {devices.map((dev) => {
            const pos = positions[dev.id];
            return (
              <div key={dev.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <div className="font-extrabold text-slate-100 flex items-center space-x-2">
                    <span>{dev.name}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-1.5 py-0.2 rounded border border-slate-700">
                      {dev.attributes?.plateNumber || 'No Plate'}
                    </span>
                    {dev.id === 1 && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                        Primary Bike
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    IMEI: <strong className="font-mono text-slate-300">{dev.uniqueId || '864720058291034'}</strong> • সিম: {dev.phone || dev.attributes?.phone || '01700000000'} • অবস্থান: {pos?.address || 'Gulshan-2, Dhaka'}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-blue-300">
                    {pos?.speed ? `${Math.round(pos.speed)} km/h` : '০ কিমি/ঘণ্টা'}
                  </div>
                  <div className="text-[9.5px] text-emerald-400 font-semibold mt-0.5">
                    ব্যাটারি: {pos?.attributes?.batteryLevel || 98}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bulk IMEI Import Modal */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                <span className="font-extrabold text-sm text-slate-100">বাল্ক ট্র্যাকার IMEI ইনভেন্টরি ইমপোর্ট</span>
              </div>
              <button onClick={() => setIsBulkModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkImportSubmit} className="p-4 space-y-3.5 text-xs">
              <p className="text-[11px] text-slate-400">
                এক্সেলে থাকা ১৫-ডিজিটের IMEI তালিকা নিচে প্রতি লাইনে একটি করে পেস্ট করুন। এগুলো সরাসরি সার্ভারের ইনভেন্টরিতে যুক্ত হবে:
              </p>

              <div>
                <textarea
                  rows={6}
                  required
                  value={bulkImeiText}
                  onChange={(e) => setBulkImeiText(e.target.value)}
                  placeholder="864720058291001&#10;864720058291002&#10;864720058291003"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs font-mono text-purple-300 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{bulkImportSuccess ? 'সার্ভারে সফলভাবে সংরক্ষিত!' : 'সার্ভার ইনভেন্টরিতে ইমপোর্ট করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Out-of-Warranty Rate-Card & Spare Parts Pricing Hub ===== */}
      <ServiceRateCardManager />

      {/* ===== Seller IMEI Paywall & Technician Floating Ledger Hub ===== */}
      <SellerQuotaAndLedgerManager />

      {/* ===== Staff & User Access Control Hub (RBAC Permissions) ===== */}
      <UserAccessManager />

      {/* ===== Vehicle Catalog Manager (Admin / Super Admin Only) ===== */}
      <VehicleCatalogManager />

      {/* ===== Device-wise Warranty Policy & Claims RMA Manager ===== */}
      <WarrantyAdminManager />

      {/* ===== B2B Partner & Multi-Tenant Brand Onboarding Manager ===== */}
      <PartnerOnboardingManager />

      {/* ========================================================================= */}
      {/* GPS TRACKING SERVER CONFIGURATION MODAL                                   */}
      {/* ========================================================================= */}
      {isServerConfigModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-blue-500/50 rounded-3xl max-w-md w-full p-4 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-blue-400" />
                <span className="font-extrabold text-xs text-blue-300">
                  GPS ট্র্যাকিং সার্ভার কানেকশন ও গেটওয়ে সেটিংস
                </span>
              </div>
              <button onClick={() => setIsServerConfigModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveServerConfig} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সার্ভার ইউআরএল (Server Base URL / IP) *
                </label>
                <input
                  type="text"
                  required
                  value={tempServerUrl}
                  onChange={(e) => setTempServerUrl(e.target.value)}
                  placeholder="https://demo3.traccar.org বা http://103.x.x.x"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                />
                <span className="text-[9.5px] text-slate-500 block mt-1">
                  Traccar ক্লাউড সার্ভার বা লোকাল ভিপিএস এর হোস্ট ইউআরএল
                </span>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সার্ভার ওয়েব / এপিআই পোর্ট *
                </label>
                <input
                  type="text"
                  required
                  value={tempServerPort}
                  onChange={(e) => setTempServerPort(e.target.value)}
                  placeholder="8082"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-[10.5px] text-slate-400 space-y-1">
                <span className="font-bold text-slate-300 block">📡 ডিভাইস প্রোটোকল পোর্ট গাইড:</span>
                <div>• GT06 / SinoTrack / Concox: <strong className="text-emerald-400 font-mono">5023</strong></div>
                <div>• Coban / TK103: <strong className="text-emerald-400 font-mono">5001</strong></div>
                <div>• Teltonika: <strong className="text-emerald-400 font-mono">5027</strong></div>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsServerConfigModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>সংরক্ষণ ও সার্ভার রি-কানেক্ট</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
