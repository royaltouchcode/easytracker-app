import React, { useState } from 'react';
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
  Menu,
  ChevronRight,
  Shield,
  Wrench,
  BookOpen,
  CreditCard,
  Building2,
  UserCheck,
  Car,
  Cpu,
  RotateCcw,
  PhoneCall,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';
import { SalesLeadEntry } from './SalesPortalView';
import { VehicleCatalogManager } from './VehicleCatalogManager';
import { WarrantyAdminManager } from './WarrantyAdminManager';
import { PartnerOnboardingManager } from './PartnerOnboardingManager';
import { UserAccessManager } from './UserAccessManager';
import { ServiceRateCardManager } from './ServiceRateCardManager';
import { SellerQuotaAndLedgerManager } from './SellerQuotaAndLedgerManager';
import { EnterpriseInventoryManager } from './EnterpriseInventoryManager';
import { RescueTeamManager } from './RescueTeamManager';
import { SmsGatewayManager } from './SmsGatewayManager';
import { TelecomM2MConnector } from './TelecomM2MConnector';
import { GovTechPoliceGateway } from './GovTechPoliceGateway';

type AdminSectionType = 
  | 'overview'
  | 'server_sync'
  | 'govtech_api'
  | 'operator_m2m'
  | 'rescue_hub'
  | 'sms_gateway'
  | 'device_inventory'
  | 'sim_inventory'
  | 'sales_log'
  | 'returns_rma'
  | 'sales_queue'
  | 'dealer_quotas'
  | 'rate_cards'
  | 'vehicle_catalog'
  | 'warranty_admin'
  | 'b2b_partners'
  | 'user_rbac'
  | 'system_tools';

export interface TrackingServerNode {
  id: string;
  name: string;
  url: string;
  port: string;
  protocolPorts: string;
  authType: 'token' | 'credentials' | 'public_demo';
  apiToken?: string;
  username?: string;
  password?: string;
  partnerBrand?: string;
  status: 'online' | 'offline' | 'syncing';
  deviceCount: number;
  lastSync: string;
  isDefault?: boolean;
}

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
    setCurrentRole
  } = useApp();

  // Active Left Sidebar Section
  const [activeSection, setActiveSection] = useState<AdminSectionType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Multi-Server Cluster Management State
  const [trackingServers, setTrackingServers] = useState<TrackingServerNode[]>(() => {
    const saved = localStorage.getItem('gps_tracking_servers_cluster');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'srv-primary',
        name: 'Primary EasyTracker Traccar Cluster',
        url: serverConfig?.url || 'https://demo3.traccar.org',
        port: serverConfig?.port || '8082',
        protocolPorts: 'GT06 (5023), Teltonika (5027), Coban (5001)',
        authType: 'public_demo',
        partnerBrand: 'EasyTracker Global',
        status: 'online',
        deviceCount: devices.length,
        lastSync: 'আজ কিছুক্ষণ আগে',
        isDefault: true
      },
      {
        id: 'srv-walton',
        name: 'Walton Logistics & Fleet Node',
        url: 'http://103.114.102.45',
        port: '8082',
        protocolPorts: 'Teltonika (5027), GT06 (5023)',
        authType: 'token',
        apiToken: 'walton_fleet_master_key_2026',
        partnerBrand: 'Walton Hi-Tech B2B',
        status: 'online',
        deviceCount: 142,
        lastSync: 'আজ সকাল ১০:১৫',
        isDefault: false
      },
      {
        id: 'srv-courier',
        name: 'Pathao / RedX Courier Delivery Node',
        url: 'http://192.168.10.50',
        port: '8082',
        protocolPorts: 'GT06 (5023), Coban (5001)',
        authType: 'credentials',
        username: 'courier_admin',
        partnerBrand: 'Express Logistics Hub',
        status: 'online',
        deviceCount: 88,
        lastSync: 'গতকাল রাত ১১:৩০',
        isDefault: false
      }
    ];
  });

  const [isAddServerModalOpen, setIsAddServerModalOpen] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerBrand, setNewServerBrand] = useState('');
  const [newServerUrl, setNewServerUrl] = useState('');
  const [newServerPort, setNewServerPort] = useState('8082');
  const [newServerProtocols, setNewServerProtocols] = useState('GT06 (5023), Teltonika (5027)');
  const [newServerAuthType, setNewServerAuthType] = useState<'token' | 'credentials' | 'public_demo'>('token');
  const [newServerToken, setNewServerToken] = useState('');
  const [newServerUsername, setNewServerUsername] = useState('');
  const [newServerPassword, setNewServerPassword] = useState('');
  const [testPingStatus, setTestPingStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const [isSyncingAllServers, setIsSyncingAllServers] = useState(false);
  const [syncingServerId, setSyncingServerId] = useState<string | null>(null);

  const saveTrackingServers = (list: TrackingServerNode[]) => {
    setTrackingServers(list);
    localStorage.setItem('gps_tracking_servers_cluster', JSON.stringify(list));
  };

  const [rates, setRates] = useState<Record<number, number>>(() => ({
    1: 350,
    3: 990,
    6: 1850,
    12: 3500
  }));
  const [saveRateSuccess, setSaveRateSuccess] = useState(false);
  const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
  const [isDemoPurged, setIsDemoPurged] = useState(() => {
    return localStorage.getItem('gps_demo_purged') === 'true';
  });

  const purgeDemoFleetData = () => {
    setIsDemoPurged(true);
    localStorage.setItem('gps_demo_purged', 'true');
    triggerManualAlert('subscription_reminder', '🗑️ ডেমো ডাটা সফলভাবে মুছে ফেলা হয়েছে!');
  };

  const restoreDemoFleetData = () => {
    setIsDemoPurged(false);
    localStorage.removeItem('gps_demo_purged');
    triggerManualAlert('subscription_reminder', '🔄 ডেমো ডাটা সফলভাবে রিস্টোর হয়েছে!');
  };

  // Referral Base Domain state
  const [adminReferralUrl, setAdminReferralUrl] = useState<string>(() => {
    return APP_CONFIG.referralBaseUrl || APP_CONFIG.website || (typeof window !== 'undefined' ? window.location.origin : 'https://easysoftsolution.net');
  });

  const handleSaveReferralDomain = () => {
    if (!adminReferralUrl.trim()) return;
    try {
      const savedConfig = localStorage.getItem('gps_remote_app_config');
      const parsed = savedConfig ? JSON.parse(savedConfig) : {};
      parsed.referralBaseUrl = adminReferralUrl.trim();
      parsed.website = adminReferralUrl.trim();
      localStorage.setItem('gps_remote_app_config', JSON.stringify(parsed));
      alert(`✅ রেফারেল ও পাবলিক ডোমেন "${adminReferralUrl.trim()}" সফলভাবে সেভ হয়েছে!`);
    } catch (e) {
      alert('ডোমেন সেভ করতে সমস্যা হয়েছে।');
    }
  };

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

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkImeiText, setBulkImeiText] = useState('');
  const [bulkImportSuccess, setBulkImportSuccess] = useState(false);

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

  // Multi-Server Individual Sync
  const handleSyncIndividualServer = async (srv: TrackingServerNode) => {
    setSyncingServerId(srv.id);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const updated = trackingServers.map(s => s.id === srv.id ? { ...s, lastSync: `আজ ${nowFormatted}`, status: 'online' as const } : s);
      saveTrackingServers(updated);
      setSyncSuccessMessage(`✅ "${srv.name}" থেকে সফলভাবে ${srv.deviceCount} টি ডিভাইসের টেলিম্যাটিক্স ডাটা সিঙ্ক হয়েছে!`);
      setTimeout(() => setSyncSuccessMessage(''), 4000);
    } catch (e) {
      alert(`সার্ভার "${srv.name}" সিঙ্ক ব্যর্থ হয়েছে।`);
    } finally {
      setSyncingServerId(null);
    }
  };

  // Master Sync All Clusters
  const handleSyncAllClusters = async () => {
    setIsSyncingAllServers(true);
    try {
      await syncServerData();
      await new Promise(r => setTimeout(r, 1800));
      const nowFormatted = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const totalDevs = trackingServers.reduce((acc, s) => acc + s.deviceCount, 0);
      const updated = trackingServers.map(s => ({ ...s, lastSync: `আজ ${nowFormatted}`, status: 'online' as const }));
      saveTrackingServers(updated);
      setSyncSuccessMessage(`⚡ সকল (${trackingServers.length} টি) জিপিএস ট্র্যাকার সার্ভার থেকে মোট ${totalDevs} টি ডিভাইসের অবস্থান সেন্ট্রাল সিস্টেমে সিঙ্ক সম্পন্ন!`);
      setTimeout(() => setSyncSuccessMessage(''), 4500);
    } finally {
      setIsSyncingAllServers(false);
    }
  };

  // Test Ping Connection for New Server
  const handleTestPingConnection = () => {
    if (!newServerUrl) {
      alert('অনুগ্রহ করে সার্ভার URL বা IP এড্রেস লিখুন');
      return;
    }
    setTestPingStatus('testing');
    setTimeout(() => {
      setTestPingStatus('success');
      setTimeout(() => setTestPingStatus('idle'), 3500);
    }, 1500);
  };

  // Add New Server Node
  const handleAddServerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServerName || !newServerUrl) return;

    const newNode: TrackingServerNode = {
      id: 'srv-' + Date.now(),
      name: newServerName.trim(),
      partnerBrand: newServerBrand.trim() || 'Custom B2B Partner',
      url: newServerUrl.trim(),
      port: newServerPort.trim() || '8082',
      protocolPorts: newServerProtocols.trim() || 'GT06 (5023), Teltonika (5027)',
      authType: newServerAuthType,
      apiToken: newServerToken,
      username: newServerUsername,
      password: newServerPassword,
      status: 'online',
      deviceCount: 0,
      lastSync: 'এখনই যুক্ত হয়েছে',
      isDefault: false
    };

    const updated = [...trackingServers, newNode];
    saveTrackingServers(updated);

    // Reset Form
    setIsAddServerModalOpen(false);
    setNewServerName('');
    setNewServerBrand('');
    setNewServerUrl('');
    setNewServerPort('8082');
    setNewServerToken('');
    setNewServerUsername('');
    setNewServerPassword('');
    setTestPingStatus('idle');

    setSyncSuccessMessage(`✨ নতুন জিপিএস ট্র্যাকিং সার্ভার "${newNode.name}" সফলভাবে যুক্ত হয়েছে!`);
    setTimeout(() => setSyncSuccessMessage(''), 4000);
  };

  // Set Default Primary Server
  const handleSetDefaultServer = (id: string) => {
    const target = trackingServers.find(s => s.id === id);
    if (target) {
      setServerConfig({ url: target.url, port: target.port });
    }
    const updated = trackingServers.map(s => ({ ...s, isDefault: s.id === id }));
    saveTrackingServers(updated);
  };

  // Delete Server Node
  const handleDeleteServer = (id: string) => {
    if (confirm('আপনি কি এই সার্ভার নোডটি মুছে ফেলতে চান?')) {
      const updated = trackingServers.filter(s => s.id !== id);
      saveTrackingServers(updated);
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

  // Sidebar Menu Items Definition
  const SIDEBAR_ITEMS: { id: AdminSectionType; labelBn: string; labelEn: string; icon: any; badge?: string; badgeColor?: string }[] = [
    { id: 'overview', labelBn: 'ওভারভিউ ও মেট্রিক্স', labelEn: 'Overview & Metrics', icon: Crown },
    { id: 'server_sync', labelBn: 'GPS সার্ভার ও সিঙ্ক হাব', labelEn: 'GPS Server & Sync', icon: Server, badge: 'Live', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'govtech_api', labelBn: 'BRTA, BTRC ও পুলিশ 2-Way API', labelEn: 'GovTech & Police 2-Way APIs', icon: Globe, badge: 'GovTech', badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'operator_m2m', labelBn: 'টেলিকম M2M গেটওয়ে ও টেস্ট', labelEn: 'Telco M2M API & Ping', icon: Radio, badge: 'M2M IoT', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'rescue_hub', labelBn: 'রেসকিউ টিম ও ক্ষতিপূরণ রেট', labelEn: 'Rescue Squads & Rates', icon: Flame, badge: '24/7 Red', badgeColor: 'bg-rose-500/20 text-rose-300' },
    { id: 'sms_gateway', labelBn: 'এসএমএস গেটওয়ে হাব', labelEn: 'SMS Gateway Hub', icon: Smartphone, badge: 'BD SMS', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'device_inventory', labelBn: 'ট্র্যাকার ডিভাইস ERP', labelEn: 'Device Inventory', icon: Cpu, badge: 'Hardware', badgeColor: 'bg-cyan-500/20 text-cyan-300' },
    { id: 'sim_inventory', labelBn: 'টেলিমেটিক্স সিম ERP', labelEn: 'SIM Inventory', icon: Radio, badge: 'M2M SIM', badgeColor: 'bg-purple-500/20 text-purple-300' },
    { id: 'sales_log', labelBn: 'সেলস ও ইনস্টলেশন হিস্ট্রি', labelEn: 'Sales & Dispatch Log', icon: FileSpreadsheet, badge: 'BRTA', badgeColor: 'bg-emerald-500/20 text-emerald-300' },
    { id: 'returns_rma', labelBn: 'রিটার্ন ও আরএমএ কাস্টডি', labelEn: 'Returns & RMA', icon: RotateCcw, badge: 'Reverse', badgeColor: 'bg-amber-500/20 text-amber-300' },
    { id: 'sales_queue', labelBn: 'সেলস অনবোর্ডিং কিউ', labelEn: 'Sales Leads Queue', icon: Smartphone, badge: pendingLeads.length > 0 ? `${pendingLeads.length}` : undefined, badgeColor: 'bg-amber-500/30 text-amber-300' },
    { id: 'dealer_quotas', labelBn: 'ডিলার পে-ওয়াল ও লেজার', labelEn: 'Dealer Quota & Ledger', icon: Building2 },
    { id: 'rate_cards', labelBn: 'সার্ভিস রেট ও পার্টস কার্ড', labelEn: 'Rate Cards & Spares', icon: CreditCard },
    { id: 'vehicle_catalog', labelBn: 'AI ভেহিকেল ক্যাটালগ', labelEn: 'AI Vehicle Catalog', icon: Car, badge: 'AI', badgeColor: 'bg-purple-500/20 text-purple-300' },
    { id: 'warranty_admin', labelBn: 'ওয়ারেন্টি ও ক্লেইমস (RMA)', labelEn: 'Warranty & RMA', icon: ShieldCheck },
    { id: 'b2b_partners', labelBn: 'B2B পার্টনার ও ফ্র্যাঞ্চাইজি', labelEn: 'B2B Brand Partners', icon: Users },
    { id: 'user_rbac', labelBn: 'স্টাফ রোলস ও পারমিশন', labelEn: 'Staff Roles & RBAC', icon: UserCheck },
    { id: 'system_tools', labelBn: 'ডাটাবেস ও সিস্টেম টুলস', labelEn: 'Database & Tools', icon: Database }
  ];

  return (
    <div className="w-full h-full flex flex-row bg-slate-950 text-slate-100 overflow-hidden select-none">
      
      {/* ========================================================================= */}
      {/* 🧭 LEFT SIDEBAR NAVIGATION (Collapsible Left Slide Menu)                  */}
      {/* ========================================================================= */}
      <aside 
        className={`bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300 z-30 shrink-0 ${
          isSidebarCollapsed ? 'w-16' : 'w-64 md:w-72'
        } ${isMobileMenuOpen ? 'fixed inset-y-0 left-0 shadow-2xl z-50' : 'hidden md:flex'}`}
      >
        {/* Sidebar Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          {!isSidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-xs text-white truncate max-w-[150px]">SaaS অ্যাডমিন প্যানেল</h3>
                <span className="text-[9.5px] font-mono text-emerald-400">EasyTracker Core v2.0</span>
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
                  <Icon className={`w-4 h-4 shrink-0 ${isAct ? 'text-white' : 'text-slate-400'}`} />
                  {!isSidebarCollapsed && (
                    <span className="text-xs truncate">{language === 'bn' ? item.labelBn : item.labelEn}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge && (
                  <span className={`text-[9.5px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer (Customer View Switcher) */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('map');
            }}
            className={`w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95 ${
              isSidebarCollapsed ? 'px-0' : 'px-3'
            }`}
            title="লাইভ কাস্টমার ম্যাপে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400 shrink-0" />
            {!isSidebarCollapsed && <span>{language === 'bn' ? 'কাস্টমার ভিউতে যান' : 'Back to Map'}</span>}
          </button>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 🖥️ RIGHT MAIN CONTENT AREA                                                */}
      {/* ========================================================================= */}
      <main className="flex-1 h-full overflow-y-auto flex flex-col bg-slate-950 pb-20">
        
        {/* Mobile Header Bar with Hamburger */}
        <div className="md:hidden flex items-center justify-between p-3 bg-slate-900 border-b border-slate-800 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 flex items-center space-x-1.5 text-xs font-bold"
          >
            <Menu className="w-4 h-4 text-amber-400" />
            <span>অ্যাডমিন মেনু</span>
          </button>

          <span className="font-bold text-xs text-amber-300 flex items-center space-x-1">
            <Crown className="w-3.5 h-3.5" />
            <span>{SIDEBAR_ITEMS.find(i => i.id === activeSection)?.labelBn}</span>
          </span>

          <button
            onClick={() => {
              setCurrentRole('customer');
              setActiveTab('map');
            }}
            className="px-2.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            ম্যাপ
          </button>
        </div>

        {/* Content Container */}
        <div className="p-4 md:p-6 space-y-4 max-w-7xl w-full mx-auto">

          {/* Section Breadcrumb & Header Title */}
          <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3.5 rounded-3xl shadow-md">
            <div>
              <h2 className="text-sm md:text-base font-extrabold text-white flex items-center space-x-2">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? SIDEBAR_ITEMS.find(i => i.id === activeSection)?.labelBn : SIDEBAR_ITEMS.find(i => i.id === activeSection)?.labelEn}</span>
              </h2>
              <p className="text-[10.5px] text-slate-400">
                EasyTracker এন্টারপ্রাইজ SaaS ম্যানেজমেন্ট ও সেন্ট্রাল কন্ট্রোল প্যানেল
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center space-x-1 hover:bg-purple-600/50 transition active:scale-95 shadow-sm"
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

          {/* ========================================================================= */}
          {/* VIEW 1: OVERVIEW & PLATFORM METRICS                                       */}
          {/* ========================================================================= */}
          {activeSection === 'overview' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* KPI Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-col justify-between shadow-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                    <span>সক্রিয় ট্র্যাকার</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-mono font-black text-blue-300 mt-2">
                    {devices.length} <span className="text-xs text-slate-400 font-normal">ডিভাইস</span>
                  </div>
                  <div className="text-[9.5px] text-emerald-400 mt-1">● ১০০% অনলাইন সার্ভার</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-col justify-between shadow-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                    <span>পেন্ডিং অনবোর্ডিং</span>
                    <Smartphone className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-mono font-black text-amber-300 mt-2">
                    {pendingLeads.length} <span className="text-xs text-slate-400 font-normal">রিকোয়েস্ট</span>
                  </div>
                  <div className="text-[9.5px] text-amber-400 mt-1">অ্যাডমিন অ্যাপ্রুভাল আবশ্যক</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-col justify-between shadow-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                    <span>মাসিক রেভিনিউ (MRR)</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-300 mt-2">
                    ৳{(devices.length * 350).toLocaleString()} <span className="text-xs text-slate-400 font-normal">/মাস</span>
                  </div>
                  <div className="text-[9.5px] text-slate-400 mt-1">পেমেন্ট গেটওয়ে: bKash, Nagad</div>
                </div>

                <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl flex flex-col justify-between shadow-xl">
                  <div className="text-[10px] text-slate-400 font-bold uppercase flex items-center justify-between">
                    <span>হোস্টিং ও ক্লাউড</span>
                    <Globe className="w-4 h-4 text-sky-400" />
                  </div>
                  <div className="text-xs font-mono font-bold text-sky-300 mt-2 truncate">
                    {APP_CONFIG.publisherDomain}
                  </div>
                  <div className="text-[9.5px] text-emerald-400 mt-1">SSL সিকিউরড গেটওয়ে</div>
                </div>
              </div>

              {/* Dynamic Referral Link & Public Website Domain Settings */}
              <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/40 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        ডায়নামিক রেফারেল লিংক ও পাবলিক ল্যান্ডিং ডোমেন কনফিগারেশন
                      </h3>
                      <p className="text-[10px] text-slate-400">
                        কাস্টমাররা যখন হোয়াটসঅ্যাপ বা ফেসবুকে রেফারেল লিংক শেয়ার করবে, তখন কোন ডোমেন ব্যবহার হবে তা নির্ধারণ করুন
                      </p>
                    </div>
                  </div>
                  <span className="text-[9.5px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-700 font-bold">
                    DOMAIN ROUTING
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-slate-300 block mb-1 font-semibold">
                      রেফারেল টার্গেট ডোমেন / URL (Referral Base URL)
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="url"
                        value={adminReferralUrl}
                        onChange={(e) => setAdminReferralUrl(e.target.value)}
                        placeholder="e.g. https://easysoftsolution.net অথবা https://app.easysoftsolution.net"
                        className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                      />
                      <button
                        type="button"
                        onClick={handleSaveReferralDomain}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30 transition active:scale-95 shrink-0"
                      >
                        সেভ করুন
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
                    <span className="text-[10px] text-slate-400 block">স্যাম্পল লাইভ রেফারেল লিংক:</span>
                    <span className="text-xs font-mono font-bold text-emerald-400 truncate mt-1">
                      {`${(adminReferralUrl || 'https://easysoftsolution.net').replace(/\/$/, '')}/?ref=EASY-0001`}
                    </span>
                    <span className="text-[9px] text-slate-500 mt-1">অটোমেটিক ?ref= প্যারামিটার ইনজেকশন</span>
                  </div>
                </div>
              </div>

              {/* Live Fleet Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  {language === 'bn' ? 'সিস্টেমের লাইভ যানবাহন ও টেলিম্যাটিক্স ট্র্যাকার তালিকা' : 'Active Telematics Trackers Fleet'} ({devices.length})
                </span>

                <div className="space-y-2 max-h-80 overflow-y-auto">
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: MULTI-SERVER GPS CLUSTER & PARTNER SERVER INGESTION HUB          */}
          {/* ========================================================================= */}
          {activeSection === 'server_sync' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Header Action Banner */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-sm">
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white flex items-center space-x-1.5">
                        <span>Multi-Server GPS Cluster & Partner Ingestion Hub</span>
                        <span className="text-[9.5px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.2 rounded-full border border-blue-500/30">
                          {trackingServers.length} টি ক্লাস্টার নোড
                        </span>
                      </h3>
                      <p className="text-[10.5px] text-slate-400">
                        পার্টনারদের নিজস্ব Traccar জিপিএস সার্ভার যুক্ত করুন এবং সেন্ট্রাল ম্যাপে লাইভ ফ্লিট সিঙ্ক করুন
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setIsAddServerModalOpen(true)}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
                    >
                      <Plus className="w-4 h-4" />
                      <span>নতুন সার্ভার যুক্ত করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleSyncAllClusters}
                      disabled={isSyncingAllServers}
                      className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-4 h-4 ${isSyncingAllServers ? 'animate-spin text-amber-300' : ''}`} />
                      <span>{isSyncingAllServers ? 'সিঙ্ক হচ্ছে...' : '⚡ সিঙ্ক অল ক্লাস্টার্স'}</span>
                    </button>
                  </div>
                </div>

                {/* Aggregated Cluster KPI Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 pt-1 text-xs">
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">মোট কানেক্টেড সার্ভার:</span>
                    <strong className="text-blue-300 font-mono text-sm">{trackingServers.length} টি নোড</strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">মোট সিঙ্ককৃত যানবাহন:</span>
                    <strong className="text-emerald-300 font-mono text-sm">
                      {trackingServers.reduce((acc, s) => acc + s.deviceCount, 0)} টি লাইভ ডিভাইস
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">প্রাইমারি গেটওয়ে:</span>
                    <strong className="text-amber-300 font-mono text-xs truncate block">
                      {trackingServers.find(s => s.isDefault)?.name || 'Default Traccar'}
                    </strong>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">সর্বশেষ গ্লোবাল সিঙ্ক:</span>
                    <strong className="text-purple-300 font-mono text-xs truncate block">{lastSyncTime}</strong>
                  </div>
                </div>

                {syncSuccessMessage && (
                  <div className="p-3 bg-emerald-950 border border-emerald-500/60 rounded-2xl text-xs text-emerald-300 font-bold flex items-center space-x-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{syncSuccessMessage}</span>
                  </div>
                )}
              </div>

              {/* Connected Tracking Servers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {trackingServers.map((srv) => {
                  const isSyncingThis = syncingServerId === srv.id;
                  return (
                    <div 
                      key={srv.id} 
                      className={`bg-slate-900 border rounded-3xl p-4 flex flex-col justify-between space-y-3 shadow-xl relative transition ${
                        srv.isDefault ? 'border-blue-500/80 ring-1 ring-blue-500/30 shadow-blue-500/10' : 'border-slate-800'
                      }`}
                    >
                      {/* Top Server Header */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[9.5px] font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded-md border border-slate-700">
                            {srv.partnerBrand || 'B2B Partner'}
                          </span>
                          
                          <div className="flex items-center space-x-1.5">
                            {srv.isDefault && (
                              <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 rounded-full border border-blue-500/30">
                                ⭐ প্রাইমারি ক্লাস্টার
                              </span>
                            )}
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Online" />
                          </div>
                        </div>

                        <h4 className="font-extrabold text-sm text-white leading-tight">
                          {srv.name}
                        </h4>

                        {/* Connection Details */}
                        <div className="space-y-1.5 pt-1 font-mono text-[10.5px]">
                          <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                            <span className="text-slate-400 text-[10px]">হোস্ট / IP:</span>
                            <div className="flex items-center space-x-1">
                              <span className="text-blue-300 font-bold truncate max-w-[140px]">{srv.url}:{srv.port}</span>
                              <a href={srv.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white">
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                            <span className="text-slate-400 text-[10px]">প্রোটোকল পোর্ট:</span>
                            <span className="text-emerald-400 font-bold truncate max-w-[140px]">{srv.protocolPorts}</span>
                          </div>

                          <div className="flex items-center justify-between bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
                            <span className="text-slate-400 text-[10px]">সংযুক্ত ডিভাইস:</span>
                            <span className="text-purple-300 font-bold">{srv.deviceCount} টি ট্র্যাকার</span>
                          </div>

                          <div className="flex items-center justify-between text-[10.5px] text-slate-400 pt-0.5 px-1">
                            <span>সর্বশেষ সিঙ্ক:</span>
                            <span className="text-amber-300 font-bold font-mono">{srv.lastSync}</span>
                          </div>
                        </div>
                      </div>

                      {/* Server Node Actions */}
                      <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSyncIndividualServer(srv)}
                          disabled={isSyncingThis}
                          className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-[11px] flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30 transition active:scale-95 disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingThis ? 'animate-spin text-amber-300' : ''}`} />
                          <span>{isSyncingThis ? 'সিঙ্ক হচ্ছে..' : 'সিঙ্ক করুন'}</span>
                        </button>

                        {!srv.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultServer(srv.id)}
                            className="px-2.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-amber-300 border border-slate-700 text-[11px] font-bold transition active:scale-95"
                            title="প্রাইমারি হিসেবে সেট করুন"
                          >
                            ⭐
                          </button>
                        )}

                        {!srv.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleDeleteServer(srv.id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition"
                            title="সার্ভার নোড রিমুভ করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: GOVTECH & POLICE TWO-WAY REGULATORY GATEWAY (BRTA, BTRC, DMP, 999)   */}
          {/* ========================================================================= */}
          {/* ========================================================================= */}
          {/* VIEW: GOVTECH, BRTA, BTRC & 2-WAY POLICE HIGHWAY GATEWAY                  */}
          {/* ========================================================================= */}
          {activeSection === 'govtech_api' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <GovTechPoliceGateway />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: TELECOM M2M GATEWAY & CONNECTION TEST                               */}
          {/* ========================================================================= */}
          {activeSection === 'operator_m2m' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <TelecomM2MConnector />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: RESCUE FORCE & COMPENSATION RATE ENGINE                             */}
          {/* ========================================================================= */}
          {activeSection === 'rescue_hub' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <RescueTeamManager />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: SMS GATEWAY & BROADCAST MANAGER                                     */}
          {/* ========================================================================= */}
          {activeSection === 'sms_gateway' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <SmsGatewayManager />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: CENTRAL HARDWARE TRACKER DEVICE ERP                                  */}
          {/* ========================================================================= */}
          {activeSection === 'device_inventory' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-md">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        📦 সেন্ট্রাল ট্র্যাকার হার্ডওয়্যার ডিভাইস ইআরপি (ERP)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        সারাদেশের সকল ব্র্যান্ড পার্টনার ও ডিলারের ট্র্যাকার স্টক, IMEI ডাটাবেজ, বারকোড স্ক্যানার এবং ওয়্যারহাউজ ব্যালেন্স।
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-extrabold text-xs border border-indigo-500/40 shrink-0 self-start sm:self-auto">
                    সেন্ট্রাল হার্ডওয়্যার স্টক
                  </span>
                </div>

                <EnterpriseInventoryManager standaloneMode="devices" isPartnerPortal={false} />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: CENTRAL TELEMATICS SIM CARD INVENTORY ERP                           */}
          {/* ========================================================================= */}
          {activeSection === 'sim_inventory' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shadow-md">
                      <Radio className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        📶 সেন্ট্রাল টেলিমেটিক্স সিম কার্ড ইআরপি (M2M Telco ERP)
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        সারাদেশের টেলকো পার্টনার সিম (Robi/GP/BL/Teletalk), MSISDN, ICCID বারকোড, PUK ম্যানেজার ও এম২এম টেলিমেট্রি লাইফসাইকেল।
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-extrabold text-xs border border-purple-500/40 shrink-0 self-start sm:self-auto">
                    টেলকো সিম মাস্টার
                  </span>
                </div>

                <EnterpriseInventoryManager standaloneMode="sims" isPartnerPortal={false} />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: CENTRAL SALES & DISPATCH AUDIT LOG                                  */}
          {/* ========================================================================= */}
          {activeSection === 'sales_log' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300 shadow-md">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        📑 সেন্ট্রাল সেলস, ইনস্টলেশন ও বিআরটিএ (BRTA) কমপ্লায়েন্স লেজার
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        দেশব্যাপী সকল গাড়ি ও বাইকের লাইভ ট্র্যাকার পেয়ারিং অডিট এবং ডিজিটাল BRTA VTS সার্টিফিকেট জেনারেটর।
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-xs border border-emerald-500/40 shrink-0 self-start sm:self-auto">
                    সেন্ট্রাল অডিট লেজার
                  </span>
                </div>

                <EnterpriseInventoryManager standaloneMode="sales_log" isPartnerPortal={false} />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW: CENTRAL REVERSE LOGISTICS, RETURNS & RMA CUSTODY GATEWAY            */}
          {/* ========================================================================= */}
          {activeSection === 'returns_rma' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-300 shadow-md">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-white">
                        🔄 সেন্ট্রাল রিভার্স লজিস্টিক্স, রিটার্ন ও কাস্টডি অডিট লেজার
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        ৪-চ্যানেল রিসিভিং (টেকনিশিয়ান, সেন্ট্রাল অফিস, সাপোর্ট কিউসি ল্যাব ও পার্টনার শপ), ডিজিটাল গেট পাস এবং লেজার রিফান্ড।
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-extrabold text-xs border border-amber-500/40 shrink-0 self-start sm:self-auto">
                    ৪-চ্যানেল কাস্টডি ERP
                  </span>
                </div>

                <EnterpriseInventoryManager standaloneMode="returns_rma" isPartnerPortal={false} />
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: SALES ONBOARDING LEADS QUEUE                                      */}
          {/* ========================================================================= */}
          {activeSection === 'sales_queue' && (
            <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 shadow-xl space-y-4 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <div className="flex items-center space-x-2">
                  <Smartphone className="w-5 h-5 text-amber-400" />
                  <span className="text-sm font-extrabold uppercase tracking-wider text-amber-300">
                    সেলস টিম অনবোর্ডিং কিউ ও সার্ভার পুশ অনুমোদন ({pendingLeads.length} টি পেন্ডিং)
                  </span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  Security Gate
                </span>
              </div>

              <p className="text-xs text-slate-400">
                সেলস এজেন্টদের সাবমিট করা কাস্টমার ও ডিভাইস তথ্য নিচে প্রদর্শিত হচ্ছে। আপনি ভেরিফাই করে <strong>"Approve & Push to GPS Server"</strong> চাপলেই ডিভাইসটি সার্ভারে তৈরি হবে ও লাইভ ট্র্যাকিং শুরু হবে।
              </p>

              {pendingLeads.length === 0 ? (
                <div className="p-6 rounded-3xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400">
                  ✅ বর্তমানে কোনো পেন্ডিং সেলস অনবোর্ডিং রিকোয়েস্ট নেই। সমস্ত ডিভাইস সার্ভারে আপ-টু-ডেট আছে।
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingLeads.map((lead) => (
                    <div key={lead.id} className="p-4 bg-slate-950 border border-amber-500/30 rounded-2xl space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-extrabold text-slate-100 text-sm">{lead.customer}</span>
                          <span className="text-slate-400 font-mono text-xs ml-2">({lead.phone})</span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-600/40">
                          পেন্ডিং অনুমোদন
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                        <div>
                          <span className="text-slate-500 block text-[10px]">গাড়ির নাম ও প্লেট:</span>
                          <strong className="text-slate-200">{lead.vehicle}</strong> ({lead.plate})
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">ট্র্যাকার IMEI:</span>
                          <strong className="text-amber-300 font-mono">{lead.imei}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">সিম নম্বর:</span>
                          <strong className="text-slate-200 font-mono">{lead.sim}</strong>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px]">প্যাকেজ ও কমিশন:</span>
                          <strong className="text-emerald-400">{lead.plan} (৳{lead.commission})</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-end space-x-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleRejectLead(lead.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs border border-slate-700 transition"
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
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: DEALER QUOTAS & TECHNICIAN NEGATIVE LEDGERS                       */}
          {/* ========================================================================= */}
          {activeSection === 'dealer_quotas' && (
            <div className="animate-in fade-in duration-150">
              <SellerQuotaAndLedgerManager />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 5: SERVICE RATE CARDS & PRICING                                      */}
          {/* ========================================================================= */}
          {activeSection === 'rate_cards' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* Subscription Rates Configuration */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
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
                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <label className="text-[10.5px] text-slate-400 font-bold block mb-1">১ মাস সাবস্ক্রিপশন (৳):</label>
                      <input
                        type="number"
                        value={rates[1]}
                        onChange={(e) => handleUpdateRate(1, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <label className="text-[10.5px] text-slate-400 font-bold block mb-1">৩ মাস প্যাকেজ (৳):</label>
                      <input
                        type="number"
                        value={rates[3]}
                        onChange={(e) => handleUpdateRate(3, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <label className="text-[10.5px] text-slate-400 font-bold block mb-1">৬ মাস প্যাকেজ (৳):</label>
                      <input
                        type="number"
                        value={rates[6]}
                        onChange={(e) => handleUpdateRate(6, e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:outline-none"
                      />
                    </div>

                    <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                      <label className="text-[10.5px] text-slate-400 font-bold block mb-1">১২ মাস বাৎসরিক (৳):</label>
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

              {/* Service Rate Card Manager Component */}
              <ServiceRateCardManager />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 6: AI VEHICLE CATALOG MANAGER                                        */}
          {/* ========================================================================= */}
          {activeSection === 'vehicle_catalog' && (
            <div className="animate-in fade-in duration-150">
              <VehicleCatalogManager />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 7: WARRANTY & CLAIMS RMA MANAGER                                     */}
          {/* ========================================================================= */}
          {activeSection === 'warranty_admin' && (
            <div className="animate-in fade-in duration-150">
              <WarrantyAdminManager />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 8: B2B BRAND PARTNER ONBOARDING                                      */}
          {/* ========================================================================= */}
          {activeSection === 'b2b_partners' && (
            <div className="animate-in fade-in duration-150">
              <PartnerOnboardingManager />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 9: USER ACCESS & STAFF RBAC                                         */}
          {/* ========================================================================= */}
          {activeSection === 'user_rbac' && (
            <div className="animate-in fade-in duration-150">
              <UserAccessManager />
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 10: DATABASE & SYSTEM PURGE TOOLS                                    */}
          {/* ========================================================================= */}
          {activeSection === 'system_tools' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* 1-Click Demo Data Purge Card */}
              <div className="bg-gradient-to-r from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/40 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300">
                      <Trash2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm text-rose-200">
                        {language === 'bn' ? '১-ক্লিকে ডেমো ডাটা মুছুন (Go 100% Production Live)' : '1-Click Demo Fleet Purge'}
                      </h3>
                      <p className="text-[11px] text-slate-400">
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
                      className="px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 flex items-center space-x-1.5 transition active:scale-95"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>{language === 'bn' ? 'ডেমো ডাটা মুছুন' : 'Purge Demo Fleet'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={restoreDemoFleetData}
                      className="px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-600 text-slate-300 font-bold text-xs flex items-center space-x-1.5 transition active:scale-95"
                    >
                      <RefreshCw className="w-4 h-4 text-emerald-400" />
                      <span>{language === 'bn' ? 'ডেমো রিস্টোর' : 'Restore Demo'}</span>
                    </button>
                  )}
                </div>

                {showPurgeConfirm && (
                  <div className="p-3.5 bg-rose-950/90 border border-rose-500/60 rounded-2xl space-y-2 animate-in fade-in">
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
            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* BULK IMEI IMPORT MODAL                                                    */}
      {/* ========================================================================= */}
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

      {/* ========================================================================= */}
      {/* ➕ ADD NEW GPS TRACKING SERVER MODAL                                      */}
      {/* ========================================================================= */}
      {isAddServerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-lg w-full p-4 md:p-5 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">নতুন GPS ট্র্যাকিং সার্ভার নোড যুক্ত করুন</h3>
                  <p className="text-[10px] text-slate-400">B2B পার্টনার, ফ্র্যাঞ্চাইজি বা নিজস্ব ক্লাস্টার সার্ভার ইন্টিগ্রেশন</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddServerModalOpen(false)} 
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddServerSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                    সার্ভার ডাকনাম (Server Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newServerName}
                    onChange={(e) => setNewServerName(e.target.value)}
                    placeholder="e.g. Walton Logistics Hub 1"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                    পার্টনার ব্র্যান্ড / কোম্পানি নাম
                  </label>
                  <input
                    type="text"
                    value={newServerBrand}
                    onChange={(e) => setNewServerBrand(e.target.value)}
                    placeholder="e.g. Walton / Pathao / RedX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                    সার্ভার হোস্ট / IP এড্রেস *
                  </label>
                  <input
                    type="text"
                    required
                    value={newServerUrl}
                    onChange={(e) => setNewServerUrl(e.target.value)}
                    placeholder="http://103.114.102.45 বা https://gps.partner.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                    API পোর্ট *
                  </label>
                  <input
                    type="text"
                    required
                    value={newServerPort}
                    onChange={(e) => setNewServerPort(e.target.value)}
                    placeholder="8082"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  হার্ডওয়্যার প্রোটোকল পোর্টসমূহ
                </label>
                <input
                  type="text"
                  value={newServerProtocols}
                  onChange={(e) => setNewServerProtocols(e.target.value)}
                  placeholder="GT06 (5023), Teltonika (5027), Coban (5001)"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono text-[11px] focus:border-emerald-500 focus:outline-none"
                />
              </div>

              {/* Auth Mode Selection */}
              <div className="space-y-2">
                <label className="text-[10.5px] font-bold text-slate-300 block">
                  অথেনটিকেশন মেথড (API Authentication)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewServerAuthType('token')}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition ${
                      newServerAuthType === 'token' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    মাস্টার API টোকেন
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewServerAuthType('credentials')}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition ${
                      newServerAuthType === 'credentials' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    ইউজার ও পাসওয়ার্ড
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewServerAuthType('public_demo')}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition ${
                      newServerAuthType === 'public_demo' ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    পাবলিক ক্লাস্টার
                  </button>
                </div>

                {newServerAuthType === 'token' && (
                  <div>
                    <input
                      type="text"
                      value={newServerToken}
                      onChange={(e) => setNewServerToken(e.target.value)}
                      placeholder="Bearer API Token (e.g. secret_traccar_token_xyz)"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-[11px] focus:outline-none"
                    />
                  </div>
                )}

                {newServerAuthType === 'credentials' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={newServerUsername}
                      onChange={(e) => setNewServerUsername(e.target.value)}
                      placeholder="Admin Username"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-[11px] focus:outline-none"
                    />
                    <input
                      type="password"
                      value={newServerPassword}
                      onChange={(e) => setNewServerPassword(e.target.value)}
                      placeholder="Admin Password"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-[11px] focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Ping Connection Test Button */}
              <div className="pt-1 flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                <div className="text-[10.5px] text-slate-400">
                  {testPingStatus === 'idle' && '🔌 সার্ভার অনলাইন কিনা পরীক্ষা করুন'}
                  {testPingStatus === 'testing' && '⏳ সার্ভারে পিং সিগন্যাল পাঠানো হচ্ছে...'}
                  {testPingStatus === 'success' && <span className="text-emerald-400 font-bold">✅ কানেকশন টেস্ট সফল! সার্ভার অনলাইন (Latency: 24ms)</span>}
                  {testPingStatus === 'failed' && <span className="text-rose-400 font-bold">❌ সার্ভারে কানেক্ট করা যায়নি</span>}
                </div>

                <button
                  type="button"
                  onClick={handleTestPingConnection}
                  disabled={testPingStatus === 'testing'}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-[11px] flex items-center space-x-1 transition active:scale-95 shrink-0"
                >
                  <Activity className={`w-3.5 h-3.5 ${testPingStatus === 'testing' ? 'animate-spin text-amber-300' : 'text-blue-400'}`} />
                  <span>{testPingStatus === 'testing' ? 'টেস্ট হচ্ছে..' : 'টেস্ট পিং'}</span>
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddServerModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>সার্ভার নোড সেভ ও সিঙ্ক করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
