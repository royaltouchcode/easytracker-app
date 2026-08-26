import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Edit3, 
  Plus, 
  Save, 
  Crown, 
  Briefcase, 
  Wrench, 
  Headphones, 
  Flame, 
  Smartphone,
  X,
  CheckCircle2,
  Sparkles,
  Bot,
  Eye,
  Search,
  Building2,
  Server,
  Users,
  Receipt
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaasRole, TenantTier } from '../../types/traccar';

export interface DetailedUserPermissions {
  // 1. Server Cluster & Ingestion (SaaS & Partner Level)
  canManageServerSync: boolean;
  canManageM2M: boolean;
  
  // 2. Fleet & Mobility Operations (Fleet Level)
  canManageTripDispatch: boolean;
  canManageCounterTickets: boolean;
  canManageFuelAudit: boolean;
  canManageDriverLicenses: boolean;
  
  // 3. Device & Command Control
  canCutEngine: boolean;
  canTriggerAlarm: boolean;
  canConfigDevice: boolean;
  
  // 4. Financial & Ledger Audit
  canViewRevenue: boolean;
  canManageDealerQuota: boolean;
  canApproveSales: boolean;
  
  // 5. Warranty & Hardware Logistics
  canManageWarranty: boolean;
  canManageInventory: boolean;
  canApproveRMA: boolean;
  
  // 6. Support & Rescue Ops
  canDispatchTech: boolean;
  canViewSmsGateway: boolean;
  canAuditRescueClaims: boolean;
  
  // 7. Data Privacy & Compliance
  canExportData: boolean;
  canAccessGovTech: boolean;
  canPurgeDemo: boolean;
}

export interface EnterpriseUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  department: string;
  status: 'active' | 'suspended';
  tenantTier: TenantTier;
  primaryRole: SaasRole;
  approvedRoles: SaasRole[];
  customRoleTitle?: string;
  partnerBrandName?: string;
  fleetCompanyName?: string;
  counterStationName?: string;
  assignedServerNodeId?: string;
  permissions: DetailedUserPermissions;
  lastLogin: string;
  createdAt: string;
}

export interface CustomRoleDefinition {
  id: string;
  titleBn: string;
  tenantTier: TenantTier;
  baseRole: SaasRole;
  descriptionBn: string;
  accessibleSections: string[];
  permissions: DetailedUserPermissions;
  aiSecurityAuditBn: string;
  createdAt: string;
}

const DEFAULT_USERS: EnterpriseUser[] = [
  {
    id: 'USR-101',
    name: 'সুপার অ্যাডমিন (Super Admin)',
    phone: '01700-000001',
    email: 'admin@easytracker.com',
    department: 'Executive Infrastructure',
    status: 'active',
    tenantTier: 'saas_core',
    primaryRole: 'super_admin',
    approvedRoles: ['super_admin', 'sales', 'technician', 'support', 'rescue', 'customer'],
    customRoleTitle: '👑 মাস্টার চিফ এক্সিকিউটিভ (Root Admin)',
    assignedServerNodeId: 'srv-primary',
    permissions: {
      canManageServerSync: true,
      canManageM2M: true,
      canManageTripDispatch: true,
      canManageCounterTickets: true,
      canManageFuelAudit: true,
      canManageDriverLicenses: true,
      canCutEngine: true,
      canTriggerAlarm: true,
      canConfigDevice: true,
      canViewRevenue: true,
      canManageDealerQuota: true,
      canApproveSales: true,
      canManageWarranty: true,
      canManageInventory: true,
      canApproveRMA: true,
      canDispatchTech: true,
      canViewSmsGateway: true,
      canAuditRescueClaims: true,
      canExportData: true,
      canAccessGovTech: true,
      canPurgeDemo: true
    },
    lastLogin: 'এখন সক্রিয় (Active Now)',
    createdAt: '01 Jan 2026'
  },
  {
    id: 'USR-102',
    name: 'তানভীর আহমেদ (Tanveer Ahmed)',
    phone: '01712-334455',
    email: 'tanveer.ops@easytracker.com',
    department: 'SaaS Central Operations',
    status: 'active',
    tenantTier: 'saas_core',
    primaryRole: 'operations_manager',
    approvedRoles: ['operations_manager', 'sales', 'support'],
    customRoleTitle: '🏢 সেন্ট্রাল SaaS অপারেশনস হেড',
    assignedServerNodeId: 'srv-primary',
    permissions: {
      canManageServerSync: true,
      canManageM2M: true,
      canManageTripDispatch: false,
      canManageCounterTickets: false,
      canManageFuelAudit: true,
      canManageDriverLicenses: true,
      canCutEngine: false,
      canTriggerAlarm: true,
      canConfigDevice: true,
      canViewRevenue: true,
      canManageDealerQuota: true,
      canApproveSales: true,
      canManageWarranty: true,
      canManageInventory: true,
      canApproveRMA: true,
      canDispatchTech: true,
      canViewSmsGateway: true,
      canAuditRescueClaims: true,
      canExportData: true,
      canAccessGovTech: false,
      canPurgeDemo: false
    },
    lastLogin: 'আজ দুপুর ২:১৫',
    createdAt: '15 Jan 2026'
  },
  {
    id: 'USR-301',
    name: 'হাজী মোঃ ইউনুস আলী (Hanif MD)',
    phone: '01711-998877',
    email: 'md@hanifparibahan.com',
    department: 'Hanif Executive Board',
    status: 'active',
    tenantTier: 'fleet_company',
    primaryRole: 'fleet_owner',
    approvedRoles: ['fleet_owner', 'fleet_manager'],
    customRoleTitle: '🚌 ব্যবস্থাপনা পরিচালক (হানিফ এন্টারপ্রাইজ)',
    fleetCompanyName: 'হানিফ এন্টারপ্রাইজ বাস ফ্লিট',
    assignedServerNodeId: 'srv-primary',
    permissions: {
      canManageServerSync: false,
      canManageM2M: false,
      canManageTripDispatch: true,
      canManageCounterTickets: true,
      canManageFuelAudit: true,
      canManageDriverLicenses: true,
      canCutEngine: true,
      canTriggerAlarm: true,
      canConfigDevice: false,
      canViewRevenue: true,
      canManageDealerQuota: false,
      canApproveSales: false,
      canManageWarranty: true,
      canManageInventory: false,
      canApproveRMA: false,
      canDispatchTech: false,
      canViewSmsGateway: true,
      canAuditRescueClaims: false,
      canExportData: true,
      canAccessGovTech: true,
      canPurgeDemo: false
    },
    lastLogin: 'আজ দুপুর ১২:১০',
    createdAt: '05 Feb 2026'
  }
];

export const UserAccessManager: React.FC = () => {
  const [selectedTierTab, setSelectedTierTab] = useState<'all' | TenantTier>('all');
  const [activeTabSubView, setActiveTabSubView] = useState<'users' | 'roles'>('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<EnterpriseUser[]>(() => {
    const saved = localStorage.getItem('gps_enterprise_rbac_users_v2');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });
  const [customRoles] = useState<CustomRoleDefinition[]>([
    {
      id: 'CROLE-101',
      titleBn: 'বাস কাউন্টার ম্যানেজার',
      tenantTier: 'fleet_company',
      baseRole: 'counter_manager',
      descriptionBn: 'টিকিট বুকিং ও ডিপার্চার গেটপাস অনুমোদন।',
      accessibleSections: ['বাস কাউন্টার', 'টিকেটিং'],
      permissions: {
        canManageServerSync: false, canManageM2M: false, canManageTripDispatch: false, canManageCounterTickets: true, canManageFuelAudit: false, canManageDriverLicenses: false,
        canCutEngine: false, canTriggerAlarm: false, canConfigDevice: false, canViewRevenue: false, canManageDealerQuota: false, canApproveSales: false,
        canManageWarranty: false, canManageInventory: false, canApproveRMA: false, canDispatchTech: false, canViewSmsGateway: false, canAuditRescueClaims: false,
        canExportData: false, canAccessGovTech: false, canPurgeDemo: false
      },
      aiSecurityAuditBn: '🛡️ নিরাপত্তা অডিট: টিকিট কাউন্টার পারমিশন সুরক্ষিত।',
      createdAt: '20 Aug 2026'
    }
  ]);

  const saveUsers = (list: EnterpriseUser[]) => {
    setUsers(list);
    localStorage.setItem('gps_enterprise_rbac_users_v2', JSON.stringify(list));
  };

  const [selectedUser, setSelectedUser] = useState<EnterpriseUser | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [editTier, setEditTier] = useState<TenantTier>('saas_core');
  const [editPrimaryRole, setEditPrimaryRole] = useState<SaasRole>('super_admin');
  const [editPermissions, setEditPermissions] = useState<DetailedUserPermissions>({
    canManageServerSync: false, canManageM2M: false, canManageTripDispatch: false, canManageCounterTickets: false, canManageFuelAudit: false, canManageDriverLicenses: false,
    canCutEngine: false, canTriggerAlarm: false, canConfigDevice: false, canViewRevenue: false, canManageDealerQuota: false, canApproveSales: false,
    canManageWarranty: false, canManageInventory: false, canApproveRMA: false, canDispatchTech: false, canViewSmsGateway: false, canAuditRescueClaims: false,
    canExportData: true, canAccessGovTech: false, canPurgeDemo: false
  });
  const [activePermissionTab, setActivePermissionTab] = useState<'server_m2m' | 'fleet_dispatch' | 'commands' | 'finance' | 'compliance'>('server_m2m');

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const matchesTier = selectedTierTab === 'all' || u.tenantTier === selectedTierTab;
      const matchesQuery = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery);
      return matchesTier && matchesQuery;
    });
  }, [users, selectedTierTab, searchQuery]);

  const roleBadges: Record<SaasRole, { label: string; color: string; icon: any }> = {
    super_admin: { label: '👑 সুপার অ্যাডমিন', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Crown },
    operations_manager: { label: '🏢 অপারেশনস', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', icon: Building2 },
    fleet_owner: { label: '🚌 ফ্লিট ওনার', color: 'bg-orange-500/20 text-orange-300 border-orange-500/40', icon: Building2 },
    support_lead: { label: '🎖️ সাপোর্ট লিড', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', icon: ShieldCheck },
    sales: { label: '💼 সেলস', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: Briefcase },
    technician: { label: '🔧 টেকনিশিয়ান', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: Wrench },
    support: { label: '🎧 সাপোর্ট', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: Headphones },
    rescue: { label: '🚨 রেসকিউ', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: Flame },
    partner: { label: '🤝 পার্টনার', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', icon: Users },
    partner_owner: { label: '💎 পার্টনার এমডি', color: 'bg-teal-500/20 text-teal-300 border-teal-500/40', icon: Crown },
    fleet_manager: { label: '📋 ফ্লিট ম্যানেজার', color: 'bg-sky-500/20 text-sky-300 border-sky-500/40', icon: Briefcase },
    counter_manager: { label: '🎫 কাউন্টার', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: Users },
    driver: { label: '👨‍✈️ ড্রাইভার', color: 'bg-slate-700 text-slate-300 border-slate-600', icon: Users },
    customer: { label: '👤 কাস্টমার', color: 'bg-slate-700 text-slate-300 border-slate-600', icon: Smartphone },
    viewer: { label: '👁️ ভিউয়ার', color: 'bg-slate-800 text-slate-400 border-slate-700', icon: Eye }
  };

  const handleTogglePermission = (key: keyof DetailedUserPermissions) => {
    setEditPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOpenEditModal = (u: EnterpriseUser) => {
    setSelectedUser(u);
    setEditStatus(u.status);
    setEditTier(u.tenantTier || 'saas_core');
    setEditPrimaryRole(u.primaryRole);
    setEditPermissions({
      canManageServerSync: u.permissions?.canManageServerSync || false,
      canManageM2M: u.permissions?.canManageM2M || false,
      canManageTripDispatch: u.permissions?.canManageTripDispatch || false,
      canManageCounterTickets: u.permissions?.canManageCounterTickets || false,
      canManageFuelAudit: u.permissions?.canManageFuelAudit || false,
      canManageDriverLicenses: u.permissions?.canManageDriverLicenses || false,
      canCutEngine: u.permissions?.canCutEngine || false,
      canTriggerAlarm: u.permissions?.canTriggerAlarm || false,
      canConfigDevice: u.permissions?.canConfigDevice || false,
      canViewRevenue: u.permissions?.canViewRevenue || false,
      canManageDealerQuota: u.permissions?.canManageDealerQuota || false,
      canApproveSales: u.permissions?.canApproveSales || false,
      canManageWarranty: u.permissions?.canManageWarranty || false,
      canManageInventory: u.permissions?.canManageInventory || false,
      canApproveRMA: u.permissions?.canApproveRMA || false,
      canDispatchTech: u.permissions?.canDispatchTech || false,
      canViewSmsGateway: u.permissions?.canViewSmsGateway || false,
      canAuditRescueClaims: u.permissions?.canAuditRescueClaims || false,
      canExportData: u.permissions?.canExportData ?? true,
      canAccessGovTech: u.permissions?.canAccessGovTech || false,
      canPurgeDemo: u.permissions?.canPurgeDemo || false
    });
  };

  const handleAiAutoPreset = () => {
    if (!selectedUser) return;
    const role = editPrimaryRole;

    if (role === 'super_admin') {
      setEditPermissions({
        canManageServerSync: true, canManageM2M: true, canManageTripDispatch: true, canManageCounterTickets: true, canManageFuelAudit: true, canManageDriverLicenses: true,
        canCutEngine: true, canTriggerAlarm: true, canConfigDevice: true, canViewRevenue: true, canManageDealerQuota: true, canApproveSales: true,
        canManageWarranty: true, canManageInventory: true, canApproveRMA: true, canDispatchTech: true, canViewSmsGateway: true, canAuditRescueClaims: true,
        canExportData: true, canAccessGovTech: true, canPurgeDemo: true
      });
    } else if (role === 'partner_owner' || role === 'partner') {
      setEditPermissions({
        canManageServerSync: true, canManageM2M: true, canManageTripDispatch: false, canManageCounterTickets: false, canManageFuelAudit: true, canManageDriverLicenses: false,
        canCutEngine: false, canTriggerAlarm: false, canConfigDevice: true, canViewRevenue: true, canManageDealerQuota: true, canApproveSales: true,
        canManageWarranty: true, canManageInventory: true, canApproveRMA: true, canDispatchTech: true, canViewSmsGateway: true, canAuditRescueClaims: false,
        canExportData: true, canAccessGovTech: false, canPurgeDemo: false
      });
    } else if (role === 'fleet_owner') {
      setEditPermissions({
        canManageServerSync: false, canManageM2M: false, canManageTripDispatch: true, canManageCounterTickets: true, canManageFuelAudit: true, canManageDriverLicenses: true,
        canCutEngine: true, canTriggerAlarm: true, canConfigDevice: false, canViewRevenue: true, canManageDealerQuota: false, canApproveSales: false,
        canManageWarranty: true, canManageInventory: false, canApproveRMA: false, canDispatchTech: false, canViewSmsGateway: true, canAuditRescueClaims: false,
        canExportData: true, canAccessGovTech: true, canPurgeDemo: false
      });
    } else if (role === 'fleet_manager') {
      setEditPermissions({
        canManageServerSync: false, canManageM2M: false, canManageTripDispatch: true, canManageCounterTickets: true, canManageFuelAudit: true, canManageDriverLicenses: true,
        canCutEngine: false, canTriggerAlarm: true, canConfigDevice: false, canViewRevenue: false, canManageDealerQuota: false, canApproveSales: false,
        canManageWarranty: false, canManageInventory: false, canApproveRMA: false, canDispatchTech: true, canViewSmsGateway: true, canAuditRescueClaims: false,
        canExportData: true, canAccessGovTech: false, canPurgeDemo: false
      });
    } else if (role === 'counter_manager') {
      setEditPermissions({
        canManageServerSync: false, canManageM2M: false, canManageTripDispatch: false, canManageCounterTickets: true, canManageFuelAudit: false, canManageDriverLicenses: false,
        canCutEngine: false, canTriggerAlarm: false, canConfigDevice: false, canViewRevenue: false, canManageDealerQuota: false, canApproveSales: false,
        canManageWarranty: false, canManageInventory: false, canApproveRMA: false, canDispatchTech: false, canViewSmsGateway: false, canAuditRescueClaims: false,
        canExportData: false, canAccessGovTech: false, canPurgeDemo: false
      });
    } else if (role === 'customer') {
      setEditPermissions({
        canManageServerSync: false, canManageM2M: false, canManageTripDispatch: false, canManageCounterTickets: false, canManageFuelAudit: false, canManageDriverLicenses: false,
        canCutEngine: true, canTriggerAlarm: true, canConfigDevice: false, canViewRevenue: false, canManageDealerQuota: false, canApproveSales: false,
        canManageWarranty: false, canManageInventory: false, canApproveRMA: false, canDispatchTech: false, canViewSmsGateway: false, canAuditRescueClaims: false,
        canExportData: true, canAccessGovTech: false, canPurgeDemo: false
      });
    }
  };

  const handleSaveUserPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    const updated = users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          status: editStatus,
          tenantTier: editTier,
          primaryRole: editPrimaryRole,
          permissions: editPermissions
        };
      }
      return u;
    });
    saveUsers(updated);
    setSelectedUser(null);
    alert('✅ পারমিশন সফলভাবে সেভ হয়েছে!');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">

      {/* 1. TOP 4-TIER SCOPED HEADER & STATS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <span>Multi-Tenant Enterprise RBAC & Role Manager</span>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  ৪-টিয়ার নিরাপত্তা
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                SaaS স্টাফ, B2B বিজনেস পার্টনার, ট্রান্সপোর্টেশন ফ্লিট কোম্পানি ও রিটেইল গ্রাহকদের স্কোপড পারমিশন কন্ট্রোল
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsNewUserModalOpen(true)}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ইউজার তৈরি করুন</span>
            </button>
          </div>
        </div>

        {/* 4-Tier Scoped Category Switcher Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-1 text-xs">
          {[
            { id: 'all' as const, labelBn: '🌐 সকল ইউজার', count: users.length, desc: 'সেন্ট্রাল ডাটাবেস' },
            { id: 'saas_core' as const, labelBn: '🏛️ SaaS কোর স্টাফ', count: users.filter(u => u.tenantTier === 'saas_core').length, desc: 'সুপার এডমিন, অপস ও সাপোর্ট' },
            { id: 'b2b_partner' as const, labelBn: '🤝 B2B বিজনেস পার্টনার্স', count: users.filter(u => u.tenantTier === 'b2b_partner').length, desc: 'রিসেলার ডিলার ও ফ্র্যাঞ্চাইজি' },
            { id: 'fleet_company' as const, labelBn: '🚌 ফ্লিট ও ট্রান্সপোর্টেশন', count: users.filter(u => u.tenantTier === 'fleet_company').length, desc: 'বাস, কার্গো ও কুরিয়ার কোম্পানি' },
            { id: 'retail_customer' as const, labelBn: '👤 রিটেইল গ্রাহক', count: users.filter(u => u.tenantTier === 'retail_customer').length, desc: 'ব্যক্তিগত গাড়ি/বাইক গ্রাহক' }
          ].map(tab => {
            const isAct = selectedTierTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTierTab(tab.id)}
                className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                  isAct 
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md ring-2 ring-indigo-500/30' 
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[11px] leading-tight truncate">{tab.labelBn}</span>
                  <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] font-black ${
                    isAct ? 'bg-white text-indigo-700' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.count}
                  </span>
                </div>
                <span className={`text-[9.5px] mt-1 truncate ${isAct ? 'text-indigo-100' : 'text-slate-500'}`}>
                  {tab.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SUB-VIEW TABS & SEARCH FILTER */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTabSubView('users')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition ${
              activeTabSubView === 'users' ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            👥 অ্যাক্টিভ ইউজার তালিকা ({filteredUsers.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTabSubView('roles')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
              activeTabSubView === 'roles' ? 'bg-purple-600 text-white border-purple-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span>🤖 AI কাস্টম রোল ডেফিনিশন ({customRoles.length})</span>
          </button>
        </div>

        {activeTabSubView === 'users' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="নাম, ফোন, কোম্পানি বা রোল দিয়ে ফিল্টার..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* 3. USER GRID VIEW (4-TIER SCOPED CARDS) */}
      {activeTabSubView === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredUsers.map((u) => {
            const badge = roleBadges[u.primaryRole] || roleBadges.support;
            const BadgeIcon = badge.icon || UserCheck;

            return (
              <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 flex flex-col justify-between hover:border-slate-700 transition">
                <div>
                  {/* Top Role & Tier Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-white">{u.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({u.id})</span>
                      </div>
                      
                      <span className="text-[11px] text-cyan-400 font-bold block mt-0.5">
                        {u.customRoleTitle || u.department}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${badge.color}`}>
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>

                      <span className="text-[8.5px] font-mono px-1.5 py-0.2 rounded bg-slate-950 text-slate-400 border border-slate-800">
                        {u.tenantTier === 'saas_core' ? '🏛️ SaaS Root' : u.tenantTier === 'b2b_partner' ? '🤝 B2B Partner' : u.tenantTier === 'fleet_company' ? '🚌 Fleet Enterprise' : '👤 Retail Client'}
                      </span>
                    </div>
                  </div>

                  {/* Scoped Entity Details (Company / Partner / Counter) */}
                  {(u.partnerBrandName || u.fleetCompanyName || u.counterStationName) && (
                    <div className="mt-2 p-2 rounded-xl bg-slate-950/90 border border-slate-800 text-[10.5px] space-y-0.5">
                      {u.partnerBrandName && (
                        <div className="text-teal-300 font-bold flex items-center space-x-1">
                          <span>🏢 পার্টনার ব্র্যান্ড:</span>
                          <span className="text-white">{u.partnerBrandName}</span>
                        </div>
                      )}
                      {u.fleetCompanyName && (
                        <div className="text-amber-300 font-bold flex items-center space-x-1">
                          <span>🚌 ফ্লিট কোম্পানি:</span>
                          <span className="text-white">{u.fleetCompanyName}</span>
                        </div>
                      )}
                      {u.counterStationName && (
                        <div className="text-emerald-300 font-bold flex items-center space-x-1">
                          <span>🎫 স্টেশন কাউন্টার:</span>
                          <span className="text-white">{u.counterStationName}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Active Granular Permissions Chips */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {u.permissions?.canManageServerSync && (
                      <span className="text-[9px] font-bold bg-blue-950/70 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/60">🌐 সার্ভার ক্লাস্টার</span>
                    )}
                    {u.permissions?.canManageM2M && (
                      <span className="text-[9px] font-bold bg-purple-950/70 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/60">📶 M2M টেলিকম</span>
                    )}
                    {u.permissions?.canManageTripDispatch && (
                      <span className="text-[9px] font-bold bg-sky-950/70 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800/60">📋 ট্রিপ ডিসপ্যাচ</span>
                    )}
                    {u.permissions?.canManageCounterTickets && (
                      <span className="text-[9px] font-bold bg-emerald-950/70 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/60">🎫 কাউন্টার টিকিট</span>
                    )}
                    {u.permissions?.canManageFuelAudit && (
                      <span className="text-[9px] font-bold bg-amber-950/70 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/60">⛽ ফুয়েল অডিট</span>
                    )}
                    {u.permissions?.canCutEngine && (
                      <span className="text-[9px] font-bold bg-rose-950/70 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/60">⚡ ইঞ্জিন কাটঅফ</span>
                    )}
                    {u.permissions?.canViewRevenue && (
                      <span className="text-[9px] font-bold bg-emerald-950/70 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/60">💰 রেভিনিউ লেজার</span>
                    )}
                  </div>

                  {/* Contact & Meta info */}
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-1 text-xs mt-2.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10px] font-sans">মোবাইল:</span>
                      <span className="text-indigo-300 font-bold">{u.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10px] font-sans">ইমেইল:</span>
                      <span className="text-slate-300 text-[10px] truncate max-w-[170px]">{u.email}</span>
                    </div>
                    {u.assignedServerNodeId && (
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400 font-sans">সার্ভার নোড:</span>
                        <span className="text-cyan-300 font-bold">{u.assignedServerNodeId}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-[10.5px]">
                  <span className="text-slate-400 font-mono">{u.lastLogin}</span>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(u)}
                    className="px-3 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white font-bold transition flex items-center space-x-1 border border-indigo-500/30"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>পারমিশন এডিট</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. AI CUSTOM ROLES VIEW */}
      {activeTabSubView === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {customRoles.map((role) => (
            <div key={role.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-black text-white block">{role.titleBn}</span>
                    <span className="text-[10px] text-purple-400 font-mono font-bold">বেস রোল: {role.baseRole.toUpperCase()}</span>
                  </div>
                  <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/40">
                    AI CONFIGURED
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2">{role.descriptionBn}</p>

                <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-2 text-xs mt-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">অ্যাক্সেসযোগ্য মেনু ও সেকশন:</span>
                    <div className="flex flex-wrap gap-1">
                      {role.accessibleSections.map((sec, idx) => (
                        <span key={idx} className="text-[9.5px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded-lg border border-slate-800 font-bold">
                          ✓ {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/30 text-[10px] text-purple-200">
                    {role.aiSecurityAuditBn}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[10.5px]">
                <span className="text-slate-400 font-mono">তৈরি: {role.createdAt}</span>
                <button
                  type="button"
                  onClick={() => {
                    setNewUserRole(role.baseRole);
                    setNewUserCustomTitle(role.titleBn);
                    setIsNewUserModalOpen(true);
                  }}
                  className="px-3 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center space-x-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>এই রোলে স্টাফ অ্যাসাইন করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: GRANULAR USER PERMISSION CONFIGURATION                             */}
      {/* ========================================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-indigo-500/60 rounded-3xl max-w-xl w-full p-4 sm:p-5 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-extrabold text-sm text-indigo-300">
                    ইউজার বিস্তারিত পারমিশন কনফিগারেশন
                  </h3>
                  <span className="text-[10px] text-slate-400">
                    Granular Access Control & Multi-Tier Permissions
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Banner with 1-Click AI Auto-Preset Button */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
              <div>
                <div className="font-extrabold text-slate-100 flex items-center space-x-1.5">
                  <span>{selectedUser.name}</span>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold">({selectedUser.customRoleTitle || selectedUser.department})</span>
                </div>
                <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                  {selectedUser.phone} • {selectedUser.email}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAiAutoPreset}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold text-[11px] shadow-md flex items-center space-x-1.5 transition active:scale-95 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>⚡ AI অটো-পারমিশন প্রি-সেট</span>
              </button>
            </div>

            {aiAutoPresetMsg && (
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-[11px] text-purple-200 font-bold flex items-center space-x-1.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{aiAutoPresetMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveUserPermissions} className="space-y-4 text-xs">
              
              {/* Account Status & Multi-Role Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">একাউন্ট স্ট্যাটাস:</label>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setEditStatus('active')}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition border flex items-center justify-center space-x-1 ${
                        editStatus === 'active'
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>সক্রিয় (Active)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditStatus('suspended')}
                      className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition border flex items-center justify-center space-x-1 ${
                        editStatus === 'suspended'
                          ? 'bg-rose-600 text-white border-rose-500 shadow-md'
                          : 'bg-slate-950 text-slate-400 border-slate-800'
                      }`}
                    >
                      <UserX className="w-3.5 h-3.5" />
                      <span>স্থগিত (Suspend)</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">প্রাইমারি পোর্টাল রোল:</label>
                  <select
                    value={editPrimaryRole}
                    onChange={(e) => setEditPrimaryRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="super_admin">👑 সুপার অ্যাডমিন (Master Admin)</option>
                    <option value="operations_manager">🏢 SaaS অপারেশনস ম্যানেজার</option>
                    <option value="support_lead">🎖️ সাপোর্ট লিড / হেল্পডেস্ক লিড</option>
                    <option value="sales">💼 সেলস ও ডিলার অ্যাডমিন</option>
                    <option value="technician">🔧 ফিল্ড টেকনিশিয়ান</option>
                    <option value="support">🎧 কাস্টমার সাপোর্ট</option>
                    <option value="partner">🤝 B2B ব্র্যান্ড পার্টনার</option>
                    <option value="rescue">🚒 ২৪/৭ রেসকিউ টিম</option>
                    <option value="customer">📱 কাস্টমার / ক্লায়েন্ট</option>
                  </select>
                </div>
              </div>

              {/* Multi-Role Authorizations */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1.5">
                  অনুমোদিত রোলসমূহ (Multi-Role Scope):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {(['super_admin', 'operations_manager', 'support_lead', 'sales', 'technician', 'support', 'partner', 'rescue', 'customer'] as SaasRole[]).map(role => {
                    const b = roleBadges[role];
                    const isChecked = editApprovedRoles.includes(role);
                    return (
                      <label
                        key={role}
                        className={`flex items-center space-x-1.5 p-1.5 rounded-xl border cursor-pointer transition text-center justify-center ${
                          isChecked 
                            ? 'bg-indigo-950/80 border-indigo-500/70 text-white font-bold' 
                            : 'bg-slate-950 border-slate-800 text-slate-500'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRole(role)}
                          className="rounded text-indigo-600 w-3 h-3"
                        />
                        <span className="text-[10px]">{b.label.split(' ')[0]}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* 5-Category Granular Permissions Tab Bar */}
              <div className="pt-2 border-t border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black text-slate-200 flex items-center space-x-1.5">
                    <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                    <span>২১টি গ্র্যানুলার পারমিশন কন্ট্রোল (Category Matrix)</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('server_m2m')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 ${
                      activePermissionTab === 'server_m2m' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Server className="w-3 h-3" />
                    <span>সার্ভার ও M2M</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('fleet_dispatch')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 ${
                      activePermissionTab === 'fleet_dispatch' ? 'bg-sky-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-3 h-3" />
                    <span>ফ্লিট ও টিকেটিং</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('commands')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 ${
                      activePermissionTab === 'commands' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Zap className="w-3 h-3" />
                    <span>কমান্ড ও ইঞ্জিন</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('finance')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 ${
                      activePermissionTab === 'finance' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <DollarSign className="w-3 h-3" />
                    <span>ফিন্যান্স ও লেজার</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('warranty')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 ${
                      activePermissionTab === 'warranty' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Package className="w-3 h-3" />
                    <span>ওয়ারেন্টি ও স্টক</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('support')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 ${
                      activePermissionTab === 'support' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Headphones className="w-3 h-3" />
                    <span>সাপোর্ট ও রেসকিউ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePermissionTab('compliance')}
                    className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center space-x-1 ${
                      activePermissionTab === 'compliance' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    <span>গভটেক ও ডাটা</span>
                  </button>
                </div>

                {/* 0. SERVER & M2M TAB */}
                {activePermissionTab === 'server_m2m' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in">
                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Server className="w-3.5 h-3.5 text-blue-400" />
                          <span>GPS সার্ভার নোড ও ক্লাস্টার সিঙ্ক (Server Cluster Sync)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          Traccar জিপিএস সার্ভার নোড কানেক্ট, ইনজেশন পোর্ট ও বাল্ক সিঙ্ক করার অনুমতি।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageServerSync}
                        onChange={() => handleTogglePermission('canManageServerSync')}
                        className="w-4 h-4 rounded text-blue-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Users className="w-3.5 h-3.5 text-purple-400" />
                          <span>টেলিকম M2M সিম ও APN গেটওয়ে (M2M IoT Gateway)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          GP/Robi/BL M2M সিম পুল, ব্যালেন্স চেক ও APN কনফিগারেশনের অনুমতি।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageM2M}
                        onChange={() => handleTogglePermission('canManageM2M')}
                        className="w-4 h-4 rounded text-purple-600 mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {/* 0.5. FLEET & DISPATCH TAB */}
                {activePermissionTab === 'fleet_dispatch' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in">
                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-sky-400" />
                          <span>ফ্লিট ট্রিপ ডিসপ্যাচ ও শিডিউলার (Trip Dispatching)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          বাস, কার্গো ও কুরিয়ার ট্রিপ শিডিউল, রুট অ্যাসাইন ও চালক নির্ধারণ করার ক্ষমতা।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageTripDispatch}
                        onChange={() => handleTogglePermission('canManageTripDispatch')}
                        className="w-4 h-4 rounded text-sky-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                          <span>বাস কাউন্টার টিকেটিং ও গেটপাস (Counter Ticketing)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          বাস কাউন্টার থেকে টিকিট বুকিং, সিট চার্ট ও ডিপার্চার গেটপাস ইস্যুর অনুমতি।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageCounterTickets}
                        onChange={() => handleTogglePermission('canManageCounterTickets')}
                        className="w-4 h-4 rounded text-emerald-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                          <span>ফুয়েল ও মাইলেজ অডিট লেজার (Fuel & Trip Ledger)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          ডিজেল রিফিল, টোল ও প্রতি ট্রিপের নিট লাভ/ক্ষতি হিসাব পর্যবেক্ষণ।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageFuelAudit}
                        onChange={() => handleTogglePermission('canManageFuelAudit')}
                        className="w-4 h-4 rounded text-amber-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                          <span>ড্রাইভার লাইসেন্স ও লিগ্যাল ভল্ট (Driver BRTA License Vault)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          চালক লাইসেন্স মেয়াদ ও যানবাহনের ফিটনেস সার্টিফিকেট ভেরিফিকেশন।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageDriverLicenses}
                        onChange={() => handleTogglePermission('canManageDriverLicenses')}
                        className="w-4 h-4 rounded text-teal-600 mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {/* 1. COMMANDS & ENGINE TAB */}
                {activePermissionTab === 'commands' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in">
                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Zap className="w-3.5 h-3.5 text-rose-400" />
                          <span>রিমোট ইঞ্জিন লক / কাটঅফ (Engine Cutoff Auth)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          লাইভ ম্যাপ বা ড্যাশবোর্ড থেকে গাড়ির তেল/বিদ্যুৎ সংযোগ রিমোটলি বন্ধ করার ক্ষমতা।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canCutEngine}
                        onChange={() => handleTogglePermission('canCutEngine')}
                        className="w-4 h-4 rounded text-rose-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <BellRing className="w-3.5 h-3.5 text-amber-400" />
                          <span>রিমোট সাইরেন ও হর্ন এলার্ম (Trigger Siren/Horn)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          জরুরি মুহূর্তে গাড়ির সাইরেন বাজানো ও লাইট ফ্ল্যাশ করানোর অনুমতি।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canTriggerAlarm}
                        onChange={() => handleTogglePermission('canTriggerAlarm')}
                        className="w-4 h-4 rounded text-amber-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                          <span>রিমোট ট্র্যাকার কনফিগারেশন চেঞ্জ (Device Parameter Config)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          আইপি, পোর্ট বা জিপিএস ট্র্যাকার সেন্সর প্যারামিটার রিমোটলি পরিবর্তন।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canConfigDevice}
                        onChange={() => handleTogglePermission('canConfigDevice')}
                        className="w-4 h-4 rounded text-cyan-600 mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {/* 2. FINANCE & DEALER TAB */}
                {activePermissionTab === 'finance' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in">
                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                          <span>কোম্পানির রেভিনিউ ও প্রফিট লেজার ভিউ (Revenue & Profit Ledger)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          সুপার অ্যাডমিন ড্যাশবোর্ডের মোট আয়, মাসিক সাবস্ক্রিপশন ফি ও আর্থিক রিপোর্ট দেখা।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canViewRevenue}
                        onChange={() => handleTogglePermission('canViewRevenue')}
                        className="w-4 h-4 rounded text-emerald-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Building2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>ডিলার স্লট কোটা ও পে-ওয়াল রিচার্জ (Dealer Quota & Paywall)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          পার্টনার ডিলারদের ফ্লোটিং ব্যালেন্স ও ডিভাইস স্লট কোটা বৃদ্ধি বা অনুমোদন করা।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageDealerQuota}
                        onChange={() => handleTogglePermission('canManageDealerQuota')}
                        className="w-4 h-4 rounded text-blue-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <FileText className="w-3.5 h-3.5 text-indigo-400" />
                          <span>সেলস অনবোর্ডিং কিউ এপ্রুভাল (Approve Sales Queue)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          সেলস টিমের পাঠানো নতুন কাস্টমার এন্ট্রি যাচাই করে সেন্ট্রাল সার্ভারে অ্যাক্টিভ করা।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canApproveSales}
                        onChange={() => handleTogglePermission('canApproveSales')}
                        className="w-4 h-4 rounded text-indigo-600 mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {/* 3. WARRANTY & INVENTORY TAB */}
                {activePermissionTab === 'warranty' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in">
                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>ওয়ারেন্টি ক্লেইম ভেরিফিকেশন (Warranty Claim Approval)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          গ্রাহকের ওয়ারেন্টি কার্ড চেক এবং ফ্রি সার্ভিসিং ক্লেইম অনুমোদন।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageWarranty}
                        onChange={() => handleTogglePermission('canManageWarranty')}
                        className="w-4 h-4 rounded text-emerald-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Package className="w-3.5 h-3.5 text-purple-400" />
                          <span>ট্র্যাকার ডিভাইস ও সিম স্টক বরাদ্দ (Hardware & SIM Inventory)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          গুদাম থেকে ডিলার বা টেকনিশিয়ানদের কাছে ডিভাইস ও M2M সিম হস্তান্তর করা।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canManageInventory}
                        onChange={() => handleTogglePermission('canManageInventory')}
                        className="w-4 h-4 rounded text-purple-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                          <span>রিটার্ন ও নষ্ট ট্র্যাকার RMA ছাড় (Approve Return RMA)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          নষ্ট ডিভাইসের রিপ্লেসমেন্ট ছাড় এবং রিভার্স লজিস্টিকস কাস্টডি এন্ট্রি।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canApproveRMA}
                        onChange={() => handleTogglePermission('canApproveRMA')}
                        className="w-4 h-4 rounded text-teal-600 mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {/* 4. SUPPORT & RESCUE TAB */}
                {activePermissionTab === 'support' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in">
                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Wrench className="w-3.5 h-3.5 text-sky-400" />
                          <span>ফিল্ড টেকনিশিয়ান সার্ভিস ডিসপ্যাচ (Dispatch Field Tech)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          কাস্টমারের ঠিকানায় টেকনিশিয়ান নিয়োগ ও ওয়্যারিং সার্ভিসের জব তৈরি।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canDispatchTech}
                        onChange={() => handleTogglePermission('canDispatchTech')}
                        className="w-4 h-4 rounded text-sky-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Smartphone className="w-3.5 h-3.5 text-indigo-400" />
                          <span>এসএমএস গেটওয়ে ও ওটিপি ফেইল্যুর লগ (SMS & OTP Gateway Logs)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          কাস্টমারের ফোনে এসএমএস অ্যালার্ট ও পাসওয়ার্ড ওটিপি হিস্ট্রি দেখা।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canViewSmsGateway}
                        onChange={() => handleTogglePermission('canViewSmsGateway')}
                        className="w-4 h-4 rounded text-indigo-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Flame className="w-3.5 h-3.5 text-rose-400" />
                          <span>রেসকিউ টিম এসওএস ও ক্ষতিপূরণ ক্লেইম অডিট (Audit Rescue Claims)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          চুরি হওয়া গাড়ি উদ্ধারের এসওএস ক্লেইম ও ৫০,০০০ টাকা ক্ষতিপূরণ ফাইল যাচাই।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canAuditRescueClaims}
                        onChange={() => handleTogglePermission('canAuditRescueClaims')}
                        className="w-4 h-4 rounded text-rose-600 mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                )}

                {/* 5. DATA PRIVACY & COMPLIANCE TAB */}
                {activePermissionTab === 'compliance' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2 animate-in fade-in">
                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                          <span>এক্সেল ও পিডিএফ ডাটা এক্সপোর্ট (Export Excel/PDF)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          গাড়ির ট্রিপ, মাইলেজ ও কাস্টমার তালিকা বাল্ক ডাউনলোড করা।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canExportData}
                        onChange={() => handleTogglePermission('canExportData')}
                        className="w-4 h-4 rounded text-emerald-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>GovTech বিটিআরসি ও পুলিশ 2-Way API (Access GovTech API)</span>
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          সরকারি বিটিআরসি অডিট রিপোর্ট ও পুলিশ সেন্ট্রাল কমান্ড ডাটাবেজ এক্সেস।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canAccessGovTech}
                        onChange={() => handleTogglePermission('canAccessGovTech')}
                        className="w-4 h-4 rounded text-cyan-600 mt-1 cursor-pointer"
                      />
                    </label>

                    <label className="flex items-start justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 cursor-pointer">
                      <div>
                        <span className="font-extrabold text-slate-200 block text-xs flex items-center space-x-1.5">
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                          <span>ডেমো ডাটা ক্লিন ও ডিভাইস ডিলিট (Purge & Delete Rights)</span>
                        </span>
                        <span className="text-[10px] text-rose-400 font-bold block mt-0.5">
                          ⚠️ উচ্চ ঝুঁকিপূর্ণ: টেস্ট ডাটা ও নিষ্ক্রিয় ট্র্যাকার পার্মানেন্ট ডিলিট করার অধিকার।
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={editPermissions.canPurgeDemo}
                        onChange={() => handleTogglePermission('canPurgeDemo')}
                        className="w-4 h-4 rounded text-rose-600 mt-1 cursor-pointer"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30 transition active:scale-95 flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>পারমিশন সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AI ROLE BUILDER */}
      {isAiRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-purple-500/60 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-purple-300 flex items-center space-x-2">
                <Bot className="w-4 h-4 text-purple-400" />
                <span>🤖 AI রোল ও পারমিশন সাজেশন ইঞ্জিন</span>
              </h3>
              <button onClick={() => setIsAiRoleModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  কাঙ্ক্ষিত পদের নাম লিখুন (Role Title / Job Prompt):
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={aiRolePrompt}
                    onChange={(e) => setAiRolePrompt(e.target.value)}
                    placeholder="যেমন: কাস্টমার সাপোর্ট অফিসার / ডিলার অপারেশনস ম্যানেজার"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateAiRole}
                    disabled={isAiGenerating || !aiRolePrompt.trim()}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs shadow-md transition disabled:opacity-50 flex items-center space-x-1"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                    <span>{isAiGenerating ? 'AI ভাবছে...' : 'AI সাজেস্ট'}</span>
                  </button>
                </div>
              </div>

              {generatedRole && (
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-purple-500/40 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white text-xs">{generatedRole.titleBn}</span>
                    <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40">
                      বেস রোল: {generatedRole.baseRole}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">🤖 AI প্রস্তাবিত মেনু অ্যাক্সেস:</span>
                    <div className="flex flex-wrap gap-1">
                      {generatedRole.accessibleSections.map((sec, idx) => (
                        <span key={idx} className="text-[9.5px] bg-slate-900 text-emerald-300 px-2 py-0.5 rounded border border-slate-800">
                          ✓ {sec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/30 text-[10.5px] text-purple-200">
                    {generatedRole.aiSecurityAuditBn}
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveCustomRole}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg shadow-purple-600/30 transition active:scale-95"
                  >
                    💾 এই AI রোল সংরক্ষণ করুন
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD NEW STAFF USER */}
      {isNewUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-emerald-300 flex items-center space-x-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>নতুন স্টাফ কর্মকর্তা যুক্ত করুন</span>
              </h3>
              <button onClick={() => setIsNewUserModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কর্মকর্তার নাম *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="যেমন: মোঃ শরিফুল ইসলাম"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="01711-XXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ডিপার্টমেন্ট</label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    placeholder="Customer Support"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">বেস রোল *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="support">🎧 কাস্টমার সাপোর্ট</option>
                    <option value="support_lead">🎖️ সাপোর্ট লিড / হেল্পডেস্ক লিড</option>
                    <option value="sales">💼 সেলস ও ডিলার অ্যাডমিন</option>
                    <option value="technician">🔧 ফিল্ড টেকনিশিয়ান</option>
                    <option value="operations_manager">🏢 SaaS অপারেশনস ম্যানেজার</option>
                    <option value="partner">🤝 B2B ব্র্যান্ড পার্টনার</option>
                    <option value="rescue">🚒 ২৪/৭ রেসকিউ টিম</option>
                    <option value="customer">📱 কাস্টমার / ক্লায়েন্ট</option>
                    <option value="super_admin">👑 সুপার অ্যাডমিন</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কাস্টম পদবি (Optional)</label>
                  <input
                    type="text"
                    value={newUserCustomTitle}
                    onChange={(e) => setNewUserCustomTitle(e.target.value)}
                    placeholder="যেমন: সিনিয়র সাপোর্ট স্পেশালিস্ট"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* 🤖 AI Role & Permissions Assistant Live Panel */}
              {(() => {
                const roleHelper: Record<SaasRole, { sections: string[]; audit: string; color: string }> = {
                  super_admin: {
                    sections: ['মাস্টার কন্ট্রোল প্যানেল', 'ফুল সিস্টেম কনফিগ', 'GovTech পুলিশ গেটওয়ে', 'টেলিকম ও ডিভাইস ERP', 'সার্ভিস ও বিলিং'],
                    audit: '👑 অমনি-পোটেন্ট: সম্পূর্ণ প্ল্যাটফর্ম, ডাটাবেস ও ফাইন্যান্সিয়াল অডিট এক্সেস এনাবল্ড।',
                    color: 'text-amber-300 border-amber-500/40 bg-amber-950/40'
                  },
                  operations_manager: {
                    sections: ['ডিভাইস ও সিম ERP', 'টেকনিশিয়ান শিডিউলিং', 'ডিলার কোটা অ্যাপ্রুভাল', 'বাল্ক ইনভেন্টরি', 'টেলিমেটিক্স গেটওয়ে'],
                    audit: '🏢 সেন্ট্রাল অপারেশনস: ট্র্যাকার স্টক ও ডিলার ম্যানেজমেন্ট এনাবল্ড। ডাটাবেস ডিরেক্ট কোর লকড।',
                    color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/40'
                  },
                  support_lead: {
                    sections: ['কাস্টমার হেল্পডেস্ক', 'এসএমএস গেটওয়ে লগ', 'টিকিট এসকেলেশন', 'ওয়ারেন্টি ও আরএমএ', 'রেসকিউ ক্লেইম ভেরিফিকেশন'],
                    audit: '🎖️ সুপারভাইজরি: হেল্পডেস্ক টিম অডিট ও জরুরি ক্লেইম ক্লিয়ারেন্স। ইঞ্জিন রিমোট কাটঅফ লকড।',
                    color: 'text-indigo-300 border-indigo-500/40 bg-indigo-950/40'
                  },
                  sales: {
                    sections: ['সেলস অনবোর্ডিং কিউ', 'ডিলার পে-ওয়াল ও লেজার', 'নতুন ক্লায়েন্ট একাউন্ট', 'ডিভাইস ইস্যু', 'রেভিনিউ রিপোর্ট'],
                    audit: '💼 বাণিজ্যিক: ক্লায়েন্ট অনবোর্ডিং ও লেজার অডিট। টেকনিক্যাল ইঞ্জিন কমান্ড ব্লকড।',
                    color: 'text-blue-300 border-blue-500/40 bg-blue-950/40'
                  },
                  technician: {
                    sections: ['সার্ভিস রেট ও পার্টস কার্ড', 'ওয়্যারিং পিনআউট', 'টেস্ট ইঞ্জিন কাটঅফ', 'সেন্সর ক্যালিব্রেশন', 'ওয়ারেন্টি আরএমএ'],
                    audit: '🔧 টেকনিক্যাল ফিল্ড: ইনস্টলেশন টেস্ট ও সেন্সর কনফিগারেশন। ফিনান্সিয়াল লেজার লকড।',
                    color: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/40'
                  },
                  support: {
                    sections: ['লাইভ কাস্টমার অ্যাসিস্ট্যান্স', 'এসএমএস গেটওয়ে', 'টিকিট ম্যানেজমেন্ট', 'ওয়ারেন্টি মেয়াদ চেক', 'রেসকিউ টিম ফলোআপ'],
                    audit: '🎧 হেল্পডেস্ক: কাস্টমার সাপোর্ট ও নোটিফিকেশন। সংবেদনশীল ইঞ্জিন লক ও গভটেক সীমাবদ্ধ।',
                    color: 'text-purple-300 border-purple-500/40 bg-purple-950/40'
                  },
                  partner: {
                    sections: ['কো-ব্র্যান্ডেড সাব-ডোমেন', 'ফ্র্যাঞ্চাইজি ক্লায়েন্ট অনবোর্ডিং', 'কমিশন লেজার', 'বাল্ক টেলিমেটিক্স API'],
                    audit: '🤝 পার্টনারশিপ: নিজস্ব ফ্র্যাঞ্চাইজির গাড়ি ও ক্লায়েন্ট ভিউ। অন্যান্য পার্টনার ডাটা আইসোলেটেড।',
                    color: 'text-teal-300 border-teal-500/40 bg-teal-950/40'
                  },
                  rescue: {
                    sections: ['ইমার্জেন্সি ইন্টারসেপ্ট', '২৪/৭ রেসকিউ মোড', 'পুলিশ কো-অর্ডিনেশন', '৫০,০০০৳ ক্লেইম অডিট', 'লাইভ সিকিউর'],
                    audit: '🚒 ইমার্জেন্সি: হাই-প্রায়োরিটি এসওএস ট্র্যাকিং ও ইমার্জেন্সি রিমোট ইঞ্জিন লক এনাবল্ড।',
                    color: 'text-rose-300 border-rose-500/40 bg-rose-950/40'
                  },
                  customer: {
                    sections: ['লাইভ ভেহিকেল ট্র্যাকিং', 'স্পিড ও ট্রিপ প্লেব্যাক', 'মাইলেজ ও ফুয়েল সামারি', 'ইঞ্জিন লক/আনলক', 'লাইভ ক্যামেরা'],
                    audit: '📱 এন্ড-ইউজার: শুধুমাত্র নিজের রেজিস্ট্রার্ড গাড়ির মনিটরিং ও কমান্ড কন্ট্রোল।',
                    color: 'text-slate-300 border-slate-700 bg-slate-950'
                  }
                };

                const helper = roleHelper[newUserRole] || roleHelper.support;

                return (
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5 text-purple-300 font-bold text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>🤖 AI রোল ও পারমিশন অ্যাসিস্ট্যান্ট</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                        AUTO-CONFIGURED
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block mb-1">অ্যাক্সেসযোগ্য SaaS সেকশন ও ক্ষমতা:</span>
                      <div className="flex flex-wrap gap-1">
                        {helper.sections.map((sec, idx) => (
                          <span key={idx} className="text-[9.5px] bg-slate-900 text-cyan-300 px-2 py-0.5 rounded-lg border border-slate-800 font-bold">
                            ✓ {sec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className={`p-2 rounded-xl border text-[10px] font-bold ${helper.color}`}>
                      {helper.audit}
                    </div>
                  </div>
                );
              })()}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewUserModalOpen(false)}
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
