import React, { useState } from 'react';
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
  Sliders,
  AlertTriangle,
  Lock,
  Radio,
  Copy,
  Check,
  Building2,
  Search,
  Zap,
  DollarSign,
  Package,
  FileText,
  FileSpreadsheet,
  Trash2,
  Globe,
  BellRing
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaasRole } from '../../types/traccar';

export interface DetailedUserPermissions {
  // 1. Device & Command Control
  canCutEngine: boolean;
  canTriggerAlarm: boolean;
  canConfigDevice: boolean;
  
  // 2. Financial & Ledger Audit
  canViewRevenue: boolean;
  canManageDealerQuota: boolean;
  canApproveSales: boolean;
  
  // 3. Warranty & Hardware Logistics
  canManageWarranty: boolean;
  canManageInventory: boolean;
  canApproveRMA: boolean;
  
  // 4. Support & Rescue Ops
  canDispatchTech: boolean;
  canViewSmsGateway: boolean;
  canAuditRescueClaims: boolean;
  
  // 5. Data Privacy & Compliance
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
  primaryRole: SaasRole;
  approvedRoles: SaasRole[];
  customRoleTitle?: string;
  shopName?: string;
  shopAddress?: string;
  geoLat?: number;
  geoLng?: number;
  googleMapsUrl?: string;
  locationVerified?: boolean;
  locationVerifiedAt?: string;
  permissions: DetailedUserPermissions;
  lastLogin: string;
  createdAt: string;
}

export interface CustomRoleDefinition {
  id: string;
  titleBn: string;
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
    primaryRole: 'super_admin',
    approvedRoles: ['super_admin', 'sales', 'technician', 'support', 'rescue', 'customer'],
    customRoleTitle: '👑 মাস্টার চিফ এক্সিকিউটিভ',
    permissions: {
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
    name: 'কামরুল হাসান (Kamrul Hasan)',
    phone: '01712-334455',
    email: 'kamrul.sales@easytracker.com',
    department: 'Sales & Operations',
    status: 'active',
    primaryRole: 'sales',
    approvedRoles: ['sales', 'customer'],
    customRoleTitle: '🏢 রিজিওনাল অপারেশনস ও ডিলার অ্যাডমিন',
    permissions: {
      canCutEngine: false,
      canTriggerAlarm: false,
      canConfigDevice: false,
      canViewRevenue: true,
      canManageDealerQuota: true,
      canApproveSales: true,
      canManageWarranty: false,
      canManageInventory: true,
      canApproveRMA: false,
      canDispatchTech: false,
      canViewSmsGateway: false,
      canAuditRescueClaims: false,
      canExportData: true,
      canAccessGovTech: false,
      canPurgeDemo: false
    },
    lastLogin: 'আজ দুপুর ২:১৫',
    createdAt: '15 Jan 2026'
  },
  {
    id: 'USR-104',
    name: 'সাদিয়া আফরোজ (Sadia Afroz)',
    phone: '01799-887766',
    email: 'sadia.support@easytracker.com',
    department: 'Customer Care & Helpdesk',
    status: 'active',
    primaryRole: 'support',
    approvedRoles: ['support', 'rescue', 'customer'],
    customRoleTitle: '🎧 কাস্টমার সাপোর্ট অফিসার',
    permissions: {
      canCutEngine: false,
      canTriggerAlarm: true,
      canConfigDevice: false,
      canViewRevenue: false,
      canManageDealerQuota: false,
      canApproveSales: false,
      canManageWarranty: true,
      canManageInventory: false,
      canApproveRMA: true,
      canDispatchTech: true,
      canViewSmsGateway: true,
      canAuditRescueClaims: true,
      canExportData: true,
      canAccessGovTech: false,
      canPurgeDemo: false
    },
    lastLogin: 'আজ দুপুর ১২:০০',
    createdAt: '01 Feb 2026'
  },
  {
    id: 'USR-103',
    name: 'আব্দুল করিম (Abdul Karim)',
    phone: '01711-223344',
    email: 'karim.tech@easytracker.com',
    department: 'Field Installation & Wiring',
    status: 'active',
    primaryRole: 'technician',
    approvedRoles: ['technician', 'sales', 'customer'],
    customRoleTitle: '🔧 সিনিয়র ফিল্ড টেকনিশিয়ান',
    permissions: {
      canCutEngine: true,
      canTriggerAlarm: true,
      canConfigDevice: true,
      canViewRevenue: false,
      canManageDealerQuota: false,
      canApproveSales: false,
      canManageWarranty: true,
      canManageInventory: false,
      canApproveRMA: true,
      canDispatchTech: false,
      canViewSmsGateway: false,
      canAuditRescueClaims: false,
      canExportData: false,
      canAccessGovTech: false,
      canPurgeDemo: false
    },
    lastLogin: 'আজ সকাল ১০:৪৫',
    createdAt: '20 Jan 2026'
  }
];

const INITIAL_CUSTOM_ROLES: CustomRoleDefinition[] = [
  {
    id: 'role_support_lead',
    titleBn: '🎧 কাস্টমার সাপোর্ট অফিসার',
    baseRole: 'support',
    descriptionBn: 'গ্রাহকদের সমস্যা সমাধান, লাইভ ট্র্যাকিং গাইডলাইন, এসএমএস লগ ও রেসকিউ টিম ক্লেইম হ্যান্ডেল করা।',
    accessibleSections: ['রেসকিউ টিম ও ক্লেইম', 'এসএমএস গেটওয়ে হাব', 'ওয়ারেন্টি ও আরএমএ', 'ইনস্টলেশন হিস্ট্রি'],
    permissions: {
      canCutEngine: false,
      canTriggerAlarm: true,
      canConfigDevice: false,
      canViewRevenue: false,
      canManageDealerQuota: false,
      canApproveSales: false,
      canManageWarranty: true,
      canManageInventory: false,
      canApproveRMA: true,
      canDispatchTech: true,
      canViewSmsGateway: true,
      canAuditRescueClaims: true,
      canExportData: true,
      canAccessGovTech: false,
      canPurgeDemo: false
    },
    aiSecurityAuditBn: '✅ নিরাপদ: GovTech পুলিশ ডাটাবেজ ও টেলকো M2M গেটওয়ে অ্যাক্সেস স্বয়ংক্রিয়ভাবে সীমাবদ্ধ রাখা হয়েছে।',
    createdAt: '2026-08-20'
  },
  {
    id: 'role_ops_manager',
    titleBn: '🏢 অপারেশনস ও ডিলার অ্যাডমিন',
    baseRole: 'sales',
    descriptionBn: 'নতুন ডিলার অনবোর্ডিং, ট্র্যাকার ও সিম ইনভেন্টরি ইস্যু, ডিলার পে-ওয়াল এবং B2B পার্টনারশিপ দেখাশোনা করা।',
    accessibleSections: ['সেলস অনবোর্ডিং কিউ', 'ট্র্যাকার ডিভাইস ERP', 'টেলিমেটিক্স সিম ERP', 'ডিলার পে-ওয়াল ও লেজার', 'B2B পার্টনার'],
    permissions: {
      canCutEngine: false,
      canTriggerAlarm: false,
      canConfigDevice: false,
      canViewRevenue: true,
      canManageDealerQuota: true,
      canApproveSales: true,
      canManageWarranty: false,
      canManageInventory: true,
      canApproveRMA: false,
      canDispatchTech: false,
      canViewSmsGateway: false,
      canAuditRescueClaims: false,
      canExportData: true,
      canAccessGovTech: false,
      canPurgeDemo: false
    },
    aiSecurityAuditBn: '✅ নিরাপদ: অর্থনৈতিক লেজার অনুমোদিত হলেও কোর জিপিএস ক্লাস্টার কনফিগারেশন লক করা রয়েছে।',
    createdAt: '2026-08-22'
  }
];

export const UserAccessManager: React.FC = () => {
  const { currentRole, setCurrentRole, setActiveTab } = useApp();

  const [users, setUsers] = useState<EnterpriseUser[]>(() => {
    const saved = localStorage.getItem('gps_enterprise_rbac_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_USERS;
  });

  const [customRoles, setCustomRoles] = useState<CustomRoleDefinition[]>(() => {
    const saved = localStorage.getItem('gps_custom_rbac_roles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_CUSTOM_ROLES;
  });

  const [activeTabSubView, setActiveTabSubView] = useState<'users' | 'fleet_rbac' | 'roles'>('fleet_rbac');
  const [selectedUser, setSelectedUser] = useState<EnterpriseUser | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isAiRoleModalOpen, setIsAiRoleModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fleet Company Manager Setup State
  const [fleetManagers, setFleetManagers] = useState<Array<{ id: string; name: string; phone: string; pin: string; company: string; base: string; status: 'active' | 'inactive' }>>(() => {
    const saved = localStorage.getItem('gps_fleet_company_managers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'mgr_hanif', name: 'মোঃ শামীম ওসমান', phone: '01710-001122', pin: '5501', company: 'হানিফ এন্টারপ্রাইজ', base: 'সেন্ট্রাল হেড অফিস • গাবতলী ঢাকা', status: 'active' },
      { id: 'mgr_shyamoli', name: 'মোঃ কামরুল হাসান', phone: '01799-887766', pin: '6620', company: 'শ্যামলী পরিবহন', base: 'আরামবাগ সেন্ট্রাল ডিপো', status: 'active' },
      { id: 'mgr_ena', name: 'আনিসুর রহমান', phone: '01733-445566', pin: '7731', company: 'এনা ট্রান্সপোর্ট', base: 'মহাখালী ইন্টারসিটি টার্মিনাল', status: 'active' }
    ];
  });

  const [newMgrName, setNewMgrName] = useState('');
  const [newMgrPhone, setNewMgrPhone] = useState('');
  const [newMgrPin, setNewMgrPin] = useState('5501');
  const [newMgrCompany, setNewMgrCompany] = useState('হানিফ এন্টারপ্রাইজ');
  const [newMgrBase, setNewMgrBase] = useState('সেন্ট্রাল হেড অফিস • ঢাকা');
  const [isNewMgrModalOpen, setIsNewMgrModalOpen] = useState(false);
  const [matrixSaveSuccess, setMatrixSaveSuccess] = useState(false);

  // 5-Tier Live Fleet Permission Matrix State
  const [fleetRolePermissions, setFleetRolePermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem('gps_fleet_role_matrix_perms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      owner: {
        liveTracking: true,
        engineCut: true,
        accidentVideo: true,
        gatepassApproval: true,
        passengerStepper: true,
        fleetSetup: true,
        driverRecruit: true,
        billingFinance: true,
        legalVault: true
      },
      manager: {
        liveTracking: true,
        engineCut: false,
        accidentVideo: false,
        gatepassApproval: true,
        passengerStepper: false,
        fleetSetup: true,
        driverRecruit: true,
        billingFinance: true,
        legalVault: true
      },
      counter_incharge: {
        liveTracking: true,
        engineCut: false,
        accidentVideo: true,
        gatepassApproval: true,
        passengerStepper: false,
        fleetSetup: false,
        driverRecruit: false,
        billingFinance: false,
        legalVault: false
      },
      vehicle_supervisor: {
        liveTracking: true,
        engineCut: false,
        accidentVideo: false,
        gatepassApproval: false,
        passengerStepper: true,
        fleetSetup: false,
        driverRecruit: false,
        billingFinance: false,
        legalVault: false
      },
      driver: {
        liveTracking: true,
        engineCut: false,
        accidentVideo: false,
        gatepassApproval: false,
        passengerStepper: false,
        fleetSetup: false,
        driverRecruit: false,
        billingFinance: false,
        legalVault: false
      }
    };
  });

  const handleToggleMatrixPerm = (roleKey: string, permKey: string) => {
    setFleetRolePermissions(prev => {
      const currentRolePerms = prev[roleKey] || {};
      const updated = {
        ...prev,
        [roleKey]: {
          ...currentRolePerms,
          [permKey]: !currentRolePerms[permKey]
        }
      };
      localStorage.setItem('gps_fleet_role_matrix_perms', JSON.stringify(updated));
      return updated;
    });
    setMatrixSaveSuccess(true);
    setTimeout(() => setMatrixSaveSuccess(false), 2000);
  };

  const handleSaveNewManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMgrName.trim() || !newMgrPhone.trim()) return;

    const newManager = {
      id: `mgr_${Date.now().toString().slice(-4)}`,
      name: newMgrName.trim(),
      phone: newMgrPhone.trim(),
      pin: newMgrPin.trim() || '5501',
      company: newMgrCompany.trim(),
      base: newMgrBase.trim(),
      status: 'active' as const
    };

    const updated = [newManager, ...fleetManagers];
    setFleetManagers(updated);
    localStorage.setItem('gps_fleet_company_managers', JSON.stringify(updated));
    setIsNewMgrModalOpen(false);
    setNewMgrName('');
    setNewMgrPhone('');
    alert(`✅ "${newManager.name}" কে "${newManager.company}" এর কোম্পানি ম্যানেজার হিসেবে সফলভাবে নিয়োগ দেওয়া হয়েছে!`);
  };

  // AI Role Builder State
  const [aiRolePrompt, setAiRolePrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generatedRole, setGeneratedRole] = useState<CustomRoleDefinition | null>(null);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDept, setNewUserDept] = useState('Customer Care');
  const [newUserRole, setNewUserRole] = useState<SaasRole>('support');
  const [newUserCustomTitle, setNewUserCustomTitle] = useState('');

  // Edit User Form State
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [editPrimaryRole, setEditPrimaryRole] = useState<SaasRole>('sales');
  const [editApprovedRoles, setEditApprovedRoles] = useState<SaasRole[]>([]);
  const [editPermissions, setEditPermissions] = useState<DetailedUserPermissions>({
    canCutEngine: false,
    canTriggerAlarm: false,
    canConfigDevice: false,
    canViewRevenue: false,
    canManageDealerQuota: false,
    canApproveSales: false,
    canManageWarranty: false,
    canManageInventory: false,
    canApproveRMA: false,
    canDispatchTech: false,
    canViewSmsGateway: false,
    canAuditRescueClaims: false,
    canExportData: true,
    canAccessGovTech: false,
    canPurgeDemo: false
  });

  const [activePermissionTab, setActivePermissionTab] = useState<'commands' | 'finance' | 'warranty' | 'support' | 'compliance'>('commands');
  const [aiAutoPresetMsg, setAiAutoPresetMsg] = useState<string | null>(null);

  const roleBadges: Record<SaasRole, { label: string; color: string; icon: any }> = {
    super_admin: { label: 'সুপার অ্যাডমিন', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Crown },
    sales: { label: 'সেলস / ডিলার', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', icon: Briefcase },
    technician: { label: 'টেকনিশিয়ান', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: Wrench },
    support: { label: 'কাস্টমার সাপোর্ট', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: Headphones },
    rescue: { label: 'রেসকিউ টিম', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', icon: Flame },
    customer: { label: 'ক্লায়েন্ট পোর্টাল', color: 'bg-slate-700 text-slate-300 border-slate-600', icon: Smartphone }
  };

  const handleOpenEditModal = (user: EnterpriseUser) => {
    setSelectedUser(user);
    setEditStatus(user.status);
    setEditPrimaryRole(user.primaryRole);
    setEditApprovedRoles([...user.approvedRoles]);
    setEditPermissions({
      canCutEngine: user.permissions?.canCutEngine || false,
      canTriggerAlarm: user.permissions?.canTriggerAlarm || false,
      canConfigDevice: user.permissions?.canConfigDevice || false,
      canViewRevenue: user.permissions?.canViewRevenue || false,
      canManageDealerQuota: user.permissions?.canManageDealerQuota || false,
      canApproveSales: user.permissions?.canApproveSales || false,
      canManageWarranty: user.permissions?.canManageWarranty || false,
      canManageInventory: user.permissions?.canManageInventory || false,
      canApproveRMA: user.permissions?.canApproveRMA || false,
      canDispatchTech: user.permissions?.canDispatchTech || false,
      canViewSmsGateway: user.permissions?.canViewSmsGateway || false,
      canAuditRescueClaims: user.permissions?.canAuditRescueClaims || false,
      canExportData: user.permissions?.canExportData ?? true,
      canAccessGovTech: user.permissions?.canAccessGovTech || false,
      canPurgeDemo: user.permissions?.canPurgeDemo || false
    });
    setAiAutoPresetMsg(null);
  };

  const handleToggleRole = (role: SaasRole) => {
    if (editApprovedRoles.includes(role)) {
      if (editApprovedRoles.length === 1) return;
      const updated = editApprovedRoles.filter(r => r !== role);
      setEditApprovedRoles(updated);
      if (editPrimaryRole === role) {
        setEditPrimaryRole(updated[0]);
      }
    } else {
      setEditApprovedRoles([...editApprovedRoles, role]);
    }
  };

  const handleTogglePermission = (key: keyof DetailedUserPermissions) => {
    setEditPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleAiAutoPreset = () => {
    if (!selectedUser) return;
    const role = editPrimaryRole;

    if (role === 'super_admin') {
      setEditPermissions({
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
      });
      setAiAutoPresetMsg('👑 সুপার অ্যাডমিনের জন্য ১৫টি পারমিশনের সবকটি এনাবল করা হলো।');
    } else if (role === 'sales') {
      setEditPermissions({
        canCutEngine: false,
        canTriggerAlarm: false,
        canConfigDevice: false,
        canViewRevenue: true,
        canManageDealerQuota: true,
        canApproveSales: true,
        canManageWarranty: false,
        canManageInventory: true,
        canApproveRMA: false,
        canDispatchTech: false,
        canViewSmsGateway: false,
        canAuditRescueClaims: false,
        canExportData: true,
        canAccessGovTech: false,
        canPurgeDemo: false
      });
      setAiAutoPresetMsg('🏢 সেলস ও ডিলার অপারেশনের জন্য পারমিশন কনফিগার করা হলো।');
    } else if (role === 'support') {
      setEditPermissions({
        canCutEngine: false,
        canTriggerAlarm: true,
        canConfigDevice: false,
        canViewRevenue: false,
        canManageDealerQuota: false,
        canApproveSales: false,
        canManageWarranty: true,
        canManageInventory: false,
        canApproveRMA: true,
        canDispatchTech: true,
        canViewSmsGateway: true,
        canAuditRescueClaims: true,
        canExportData: true,
        canAccessGovTech: false,
        canPurgeDemo: false
      });
      setAiAutoPresetMsg('🎧 কাস্টমার সাপোর্ট ও হেল্পডেস্কের জন্য নিরাপদ পারমিশন প্রি-সেট সম্পন্ন।');
    } else if (role === 'technician') {
      setEditPermissions({
        canCutEngine: true,
        canTriggerAlarm: true,
        canConfigDevice: true,
        canViewRevenue: false,
        canManageDealerQuota: false,
        canApproveSales: false,
        canManageWarranty: true,
        canManageInventory: false,
        canApproveRMA: true,
        canDispatchTech: false,
        canViewSmsGateway: false,
        canAuditRescueClaims: false,
        canExportData: false,
        canAccessGovTech: false,
        canPurgeDemo: false
      });
      setAiAutoPresetMsg('🔧 টেকনিশিয়ানের জন্য রিমোট কাটঅফ টেস্ট ও ওয়ারেন্টি আরএমএ এনাবল করা হলো।');
    } else if (role === 'rescue') {
      setEditPermissions({
        canCutEngine: true,
        canTriggerAlarm: true,
        canConfigDevice: false,
        canViewRevenue: false,
        canManageDealerQuota: false,
        canApproveSales: false,
        canManageWarranty: false,
        canManageInventory: false,
        canApproveRMA: false,
        canDispatchTech: true,
        canViewSmsGateway: true,
        canAuditRescueClaims: true,
        canExportData: true,
        canAccessGovTech: false,
        canPurgeDemo: false
      });
      setAiAutoPresetMsg('🚒 রেসকিউ টিমের জন্য ইমার্জেন্সি ইঞ্জিন কাটঅফ ও এসওএস অডিট এনাবল করা হলো।');
    }
  };

  const handleSaveUserPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updatedUsers = users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          status: editStatus,
          primaryRole: editPrimaryRole,
          approvedRoles: editApprovedRoles,
          permissions: editPermissions
        };
      }
      return u;
    });

    setUsers(updatedUsers);
    localStorage.setItem('gps_enterprise_rbac_users', JSON.stringify(updatedUsers));
    setSelectedUser(null);
  };

  // AI Role Permission Recommendation Engine
  const handleGenerateAiRole = () => {
    if (!aiRolePrompt.trim()) return;
    setIsAiGenerating(true);

    setTimeout(() => {
      const q = aiRolePrompt.toLowerCase();
      let base: SaasRole = 'support';
      let sections: string[] = [];
      let perms: DetailedUserPermissions = {
        canCutEngine: false,
        canTriggerAlarm: true,
        canConfigDevice: false,
        canViewRevenue: false,
        canManageDealerQuota: false,
        canApproveSales: false,
        canManageWarranty: true,
        canManageInventory: false,
        canApproveRMA: true,
        canDispatchTech: true,
        canViewSmsGateway: true,
        canAuditRescueClaims: true,
        canExportData: true,
        canAccessGovTech: false,
        canPurgeDemo: false
      };
      let audit = '✅ নিরাপদ: সংবেদনশীল সার্ভার ও পুলিশ API সুরক্ষিত রাখা হয়েছে।';

      if (q.includes('support') || q.includes('care') || q.includes('help') || q.includes('কাস্টমার') || q.includes('সাপোর্ট')) {
        base = 'support';
        sections = ['রেসকিউ টিম ও ক্লেইম', 'এসএমএস গেটওয়ে হাব', 'ওয়ারেন্টি ও আরএমএ', 'ইনস্টলেশন হিস্ট্রি'];
        perms.canDispatchTech = true;
        perms.canManageWarranty = true;
        audit = '✅ AI অডিট: কাস্টমার সাপোর্ট রোলের জন্য GovTech ও M2M গেটওয়ে ব্লক করা হয়েছে।';
      } else if (q.includes('sales') || q.includes('dealer') || q.includes('অপারেশন') || q.includes('ম্যানেজার') || q.includes('সেলস')) {
        base = 'sales';
        sections = ['সেলস অনবোর্ডিং কিউ', 'ট্র্যাকার ডিভাইস ERP', 'টেলিমেটিক্স সিম ERP', 'ডিলার পে-ওয়াল', 'B2B পার্টনার'];
        perms.canViewRevenue = true;
        perms.canManageDealerQuota = true;
        perms.canApproveSales = true;
        perms.canManageInventory = true;
        audit = '✅ AI অডিট: সেলস ও ইনভেন্টরি রাইটস মঞ্জুর করা হয়েছে। ইঞ্জিন কাটঅফ ক্ষমতা সীমাবদ্ধ।';
      } else if (q.includes('tech') || q.includes('মেকানিক') || q.includes('ইনস্টল') || q.includes('টেকনিশিয়ান')) {
        base = 'technician';
        sections = ['সার্ভিস রেট ও পার্টস কার্ড', 'AI ভেহিকেল ক্যাটালগ', 'ওয়ারেন্টি ও আরএমএ'];
        perms.canCutEngine = true;
        perms.canTriggerAlarm = true;
        perms.canConfigDevice = true;
        perms.canManageWarranty = true;
        perms.canApproveRMA = true;
        audit = '✅ AI অডিট: টেকনিশিয়ানের জন্য ওয়ারেন্টি ও রিমোট টেস্ট কাটঅফ এনাবল করা হয়েছে।';
      } else if (q.includes('rescue') || q.includes('তারেক') || q.includes('জরুরি') || q.includes('রেসকিউ')) {
        base = 'rescue';
        sections = ['রেসকিউ টিম ও ক্ষতিপূরণ ক্লেইম', 'এসএমএস গেটওয়ে হাব'];
        perms.canCutEngine = true;
        perms.canTriggerAlarm = true;
        perms.canDispatchTech = true;
        perms.canAuditRescueClaims = true;
        audit = '🚨 AI অডিট: রেসকিউ রোলে হাই-প্রায়োরিটি ইমার্জেন্সি ইন্টারসেপ্ট পারমিশন দেওয়া হয়েছে।';
      } else {
        base = 'sales';
        sections = ['সেলস অনবোর্ডিং কিউ', 'ডিলার পে-ওয়াল'];
      }

      const generated: CustomRoleDefinition = {
        id: `role_${Date.now().toString().slice(-4)}`,
        titleBn: aiRolePrompt.trim(),
        baseRole: base,
        descriptionBn: `AI স্বয়ংক্রিয়ভাবে নির্ধারিত পারমিশন সেট। (${aiRolePrompt.trim()})`,
        accessibleSections: sections,
        permissions: perms,
        aiSecurityAuditBn: audit,
        createdAt: new Date().toISOString().slice(0, 10)
      };

      setGeneratedRole(generated);
      setIsAiGenerating(false);
    }, 800);
  };

  const handleSaveCustomRole = () => {
    if (!generatedRole) return;
    const updated = [generatedRole, ...customRoles];
    setCustomRoles(updated);
    localStorage.setItem('gps_custom_rbac_roles', JSON.stringify(updated));
    setIsAiRoleModalOpen(false);
    setGeneratedRole(null);
    setAiRolePrompt('');
  };

  const handleSaveNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserPhone.trim()) return;

    const newUser: EnterpriseUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: newUserName.trim(),
      phone: newUserPhone.trim(),
      email: newUserEmail.trim() || `${newUserName.toLowerCase().replace(/\s+/g, '')}@easytracker.com`,
      department: newUserDept.trim(),
      status: 'active',
      primaryRole: newUserRole,
      approvedRoles: [newUserRole, 'customer'],
      customRoleTitle: newUserCustomTitle.trim() || undefined,
      permissions: {
        canCutEngine: newUserRole === 'technician' || newUserRole === 'rescue',
        canTriggerAlarm: true,
        canConfigDevice: newUserRole === 'technician',
        canViewRevenue: newUserRole === 'sales' || newUserRole === 'super_admin',
        canManageDealerQuota: newUserRole === 'sales',
        canApproveSales: newUserRole === 'sales',
        canManageWarranty: newUserRole === 'support' || newUserRole === 'technician',
        canManageInventory: newUserRole === 'sales',
        canApproveRMA: newUserRole === 'support' || newUserRole === 'technician',
        canDispatchTech: newUserRole === 'support' || newUserRole === 'rescue',
        canViewSmsGateway: newUserRole === 'support',
        canAuditRescueClaims: newUserRole === 'support' || newUserRole === 'rescue',
        canExportData: true,
        canAccessGovTech: false,
        canPurgeDemo: false
      },
      lastLogin: 'এখনই তৈরি',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updated = [newUser, ...users];
    setUsers(updated);
    localStorage.setItem('gps_enterprise_rbac_users', JSON.stringify(updated));
    setIsNewUserModalOpen(false);
    setNewUserName('');
    setNewUserPhone('');
    setNewUserEmail('');
  };

  const filteredUsers = users.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return u.name.toLowerCase().includes(q) || u.phone.includes(q) || u.department.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4 select-none">
      
      {/* Super Admin God-Mode Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center shadow-lg shrink-0">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h3 className="font-extrabold text-base text-white">
                  👑 স্টাফ রোল ডিস্ট্রিবিউশন ও গ্র্যানুলার পারমিশন হাব (Granular RBAC Matrix)
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  OMNI-ACCESS ACTIVE
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  15 GRANULAR CONTROLS
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                প্রতিটি রোলের ভেতরের কমান্ড, ফিন্যান্স, ওয়ারেন্টি, সাপোর্ট ও ডাটা সিকিউরিটি পারমিশন সূক্ষ্মভাবে নিয়ন্ত্রণ করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setIsAiRoleModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold text-xs shadow-lg shadow-purple-600/30 flex items-center space-x-1.5 transition active:scale-95 shrink-0"
            >
              <Bot className="w-4 h-4 text-purple-200" />
              <span>🤖 AI রোল ক্রিয়েটর</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewUserModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 flex items-center space-x-1.5 transition active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন স্টাফ ইউজার</span>
            </button>
          </div>
        </div>

        {/* 1-Click Super Admin Role Switcher Pills */}
        <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-bold text-[11px] flex items-center space-x-1">
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>সুপার অ্যাডমিন টেস্ট ভিউ:</span>
          </span>

          <button
            type="button"
            onClick={() => { setCurrentRole('support'); }}
            className="px-2.5 py-1 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-600/50 font-bold text-[11px] transition"
          >
            🎧 সাপোর্ট ভিউ
          </button>

          <button
            type="button"
            onClick={() => { setCurrentRole('sales'); }}
            className="px-2.5 py-1 rounded-xl bg-blue-950/60 hover:bg-blue-900/60 text-blue-300 border border-blue-600/50 font-bold text-[11px] transition"
          >
            🏢 অপারেশনস / সেলস ভিউ
          </button>

          <button
            type="button"
            onClick={() => { setCurrentRole('technician'); }}
            className="px-2.5 py-1 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-600/50 font-bold text-[11px] transition"
          >
            🔧 টেকনিশিয়ান ভিউ
          </button>

          <button
            type="button"
            onClick={() => { setCurrentRole('rescue'); }}
            className="px-2.5 py-1 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-600/50 font-bold text-[11px] transition"
          >
            🚒 রেসকিউ টিম ভিউ
          </button>

          <button
            type="button"
            onClick={() => { setCurrentRole('super_admin'); }}
            className="px-2.5 py-1 rounded-xl bg-amber-600 text-white font-extrabold text-[11px] shadow-md ml-auto"
          >
            👑 মাস্টার মোডে ফিরুন
          </button>
        </div>
      </div>

      {/* 3 Tabs: Fleet RBAC Matrix, Users List & AI Custom Roles */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex space-x-2 text-xs overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTabSubView('fleet_rbac')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 shrink-0 ${
              activeTabSubView === 'fleet_rbac' ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>🏢 ফ্লিট ও কোম্পানি ম্যানেজার RBAC ({fleetManagers.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSubView('users')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition shrink-0 ${
              activeTabSubView === 'users' ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            👥 কর্মকর্তা ও স্টাফ ইউজার ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSubView('roles')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 shrink-0 ${
              activeTabSubView === 'roles' ? 'bg-purple-600 text-white border-purple-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span>🤖 AI কাস্টম রোলস ({customRoles.length})</span>
          </button>
        </div>

        {activeTabSubView === 'users' && (
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="স্টাফ নাম বা ডিপার্টমেন্ট..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}
      </div>

      {/* 🏢 0. FLEET COMPANY MANAGERS & MASTER RBAC MATRIX VIEW */}
      {activeTabSubView === 'fleet_rbac' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Section 1: Company Operations Managers Provisioning Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">কোম্পানি অপারেশনস ম্যানেজার ডিরেক্টরি ও প্রভিশনিং</h3>
                  <p className="text-[10.5px] text-slate-400">সুপার অ্যাডমিন কর্তৃক বিভিন্ন পরিবহন কোম্পানির ম্যানেজার নিয়োগ ও দায়িত্ব বণ্টন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewMgrModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-600/30 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন কোম্পানি ম্যানেজার নিয়োগ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fleetManagers.map(mgr => (
                <div key={mgr.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-cyan-500/40 space-y-2.5 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/40">
                      🏢 {mgr.company}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs">{mgr.name}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{mgr.base}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">লগইন আইডি: <strong className="text-white">{mgr.phone}</strong></span>
                    <span className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">PIN: {mgr.pin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 5-Tier Granular RBAC Permissions Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">৫-স্তরের গ্র্যানুলার রোল পারমিশন ও এক্সেস কন্ট্রোল ম্যাট্রিক্স</h3>
                  <p className="text-[10.5px] text-slate-400">সুপার অ্যাডমিন সেন্ট্রাল থেকে যেকোনো রোলের ক্ষমতা তাৎক্ষণিক অন/অফ করতে পারবেন</p>
                </div>
              </div>
              {matrixSaveSuccess && (
                <span className="text-xs text-emerald-300 font-bold bg-emerald-950 border border-emerald-500/50 px-3 py-1 rounded-xl animate-in fade-in">
                  ✅ পারমিশন পরিবর্তন সফলভাবে সংরক্ষিত!
                </span>
              )}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold text-[11px]">
                    <th className="py-2.5 px-3 min-w-[220px]">সিস্টেম ফিচার ও অপারেশনাল ক্ষমতা</th>
                    <th className="py-2.5 px-2 text-center text-amber-300 min-w-[100px]">👑 ফ্লিট মালিক</th>
                    <th className="py-2.5 px-2 text-center text-indigo-300 min-w-[120px]">🏢 কোম্পানি ম্যানেজার</th>
                    <th className="py-2.5 px-2 text-center text-cyan-300 min-w-[120px]">🏢 কাউন্টার ইনচার্জ</th>
                    <th className="py-2.5 px-2 text-center text-amber-300 min-w-[120px]">🎫 বাস সুপারভাইজার</th>
                    <th className="py-2.5 px-2 text-center text-emerald-300 min-w-[100px]">👨‍✈️ বাস চালক</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { key: 'liveTracking', title: '🗺️ লাইভ জিপিএস ট্র্যাকিং ও গতি মনিটর', desc: 'ম্যাপে রিয়েল-টাইম গতি ও অবস্থান পর্যবেক্ষণ' },
                    { key: 'engineCut', title: '🚨 রিমোট ইঞ্জিন লক / ফুয়েল কাটঅফ', desc: 'জরুরি পরিস্থিতিতে গাড়ি অচল করার ক্ষমতা' },
                    { key: 'accidentVideo', title: '📹 ব্ল্যাকবক্স এক্সিডেন্ট ভিডিও ভিউয়ার', desc: 'দুর্ঘটনার সিসিটিভি ক্লিপ ও ক্যামেরা ফুটেজ' },
                    { key: 'gatepassApproval', title: '✅ ডিপার্চার গেটপাস অনুমোদন', desc: 'টার্মিনাল থেকে ট্রিপের গেটপাস ক্লিয়ার করা' },
                    { key: 'passengerStepper', title: '👥 অনবোর্ড যাত্রী কন্ট্রোল (+১ / -১)', desc: 'হাইওয়েতে বাসের ভেতরে যাত্রী উঠা-নামা হিসাব' },
                    { key: 'fleetSetup', title: '🚌 বাস ও রুট অ্যাসাইনমেন্ট সেটআপ', desc: 'নতুন বাস ও রুট কনফিগারেশন' },
                    { key: 'driverRecruit', title: '👨‍✈️ চালক নিয়োগ ও BRTA লাইসেন্স ভল্ট', desc: 'চালক তালিকা ও স্মার্ট লাইসেন্স ভেরিফিকেশন' },
                    { key: 'billingFinance', title: '💰 সাবস্ক্রিপশন, প্রফিট/লস ও বিলিং', desc: 'কোম্পানির সেন্ট্রাল ফিনান্সিয়াল অডিট' },
                    { key: 'legalVault', title: '📄 কমপ্লায়েন্স ও ট্যাক্স টোকেন ভল্ট', desc: 'আইনি মেয়াদ ও ২-টিয়ার নবায়ন এলার্ট' }
                  ].map(perm => (
                    <tr key={perm.key} className="hover:bg-slate-950/60 transition">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white block">{perm.title}</span>
                        <span className="text-[10px] text-slate-400 block">{perm.desc}</span>
                      </td>
                      {(['owner', 'manager', 'counter_incharge', 'vehicle_supervisor', 'driver'] as const).map(roleKey => {
                        const isChecked = Boolean(fleetRolePermissions[roleKey]?.[perm.key]);
                        return (
                          <td key={roleKey} className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleMatrixPerm(roleKey, perm.key)}
                              className={`w-6 h-6 rounded-lg border inline-flex items-center justify-center transition active:scale-90 ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm shadow-emerald-600/30'
                                  : 'bg-slate-950 border-slate-700 text-slate-600 hover:border-slate-500'
                              }`}
                              title={isChecked ? 'অনুমোদিত (Enabled)' : 'ব্লকড (Disabled)'}
                            >
                              {isChecked ? '✓' : '✕'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 1. USERS LIST VIEW */}
      {activeTabSubView === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredUsers.map((u) => {
            const badge = roleBadges[u.primaryRole];
            const BadgeIcon = badge.icon;

            return (
              <div key={u.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-black text-white">{u.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">({u.id})</span>
                      </div>
                      <span className="text-[11px] text-cyan-400 font-bold block mt-0.5">{u.customRoleTitle || u.department}</span>
                    </div>

                    <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${badge.color}`}>
                      <BadgeIcon className="w-3 h-3" />
                      <span>{badge.label}</span>
                    </span>
                  </div>

                  {/* Active Granular Permissions Chips */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {u.permissions?.canCutEngine && (
                      <span className="text-[9px] font-bold bg-rose-950/70 text-rose-300 px-1.5 py-0.5 rounded border border-rose-800/60">⚡ ইঞ্জিন কাটঅফ</span>
                    )}
                    {u.permissions?.canViewRevenue && (
                      <span className="text-[9px] font-bold bg-amber-950/70 text-amber-300 px-1.5 py-0.5 rounded border border-amber-800/60">💰 রেভিনিউ ভিউ</span>
                    )}
                    {u.permissions?.canManageDealerQuota && (
                      <span className="text-[9px] font-bold bg-blue-950/70 text-blue-300 px-1.5 py-0.5 rounded border border-blue-800/60">💳 ডিলার কোটা</span>
                    )}
                    {u.permissions?.canManageWarranty && (
                      <span className="text-[9px] font-bold bg-emerald-950/70 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/60">🛡️ ওয়ারেন্টি RMA</span>
                    )}
                    {u.permissions?.canDispatchTech && (
                      <span className="text-[9px] font-bold bg-purple-950/70 text-purple-300 px-1.5 py-0.5 rounded border border-purple-800/60">🔧 টেকনিশিয়ান ডিসপ্যাচ</span>
                    )}
                    {u.permissions?.canViewSmsGateway && (
                      <span className="text-[9px] font-bold bg-sky-950/70 text-sky-300 px-1.5 py-0.5 rounded border border-sky-800/60">📱 SMS গেটওয়ে</span>
                    )}
                    {u.permissions?.canAccessGovTech && (
                      <span className="text-[9px] font-bold bg-teal-950/70 text-teal-300 px-1.5 py-0.5 rounded border border-teal-800/60">🌐 GovTech পুলিশ</span>
                    )}
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 space-y-1.5 text-xs mt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10px]">মোবাইল:</span>
                      <span className="font-mono text-indigo-300">{u.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400 text-[10px]">ইমেইল:</span>
                      <span className="font-mono text-slate-300 text-[10px]">{u.email}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                      <span className="text-slate-400 text-[10px]">অনুমোদিত রোলসমূহ:</span>
                      <div className="flex flex-wrap gap-1">
                        {u.approvedRoles.map(r => (
                          <span key={r} className="text-[9px] font-mono bg-slate-900 text-slate-300 px-1.5 py-0.2 rounded border border-slate-800">
                            {r}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-[10.5px]">
                  <span className="text-slate-400 font-mono">{u.lastLogin}</span>
                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(u)}
                    className="px-3 py-1 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 font-bold flex items-center space-x-1 border border-indigo-500/40 transition"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>বিস্তারিত পারমিশন এডিট</span>
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
                    <option value="sales">🏢 সেলস ও অপারেশনস</option>
                    <option value="support">🎧 কাস্টমার সাপোর্ট</option>
                    <option value="technician">🔧 টেকনিশিয়ান</option>
                    <option value="rescue">🚒 রেসকিউ টিম</option>
                    <option value="super_admin">👑 সুপার অ্যাডমিন</option>
                  </select>
                </div>
              </div>

              {/* Multi-Role Authorizations */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1.5">
                  অনুমোদিত রোলসমূহ (Multi-Role Scope):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {(['sales', 'technician', 'support', 'rescue', 'customer', 'super_admin'] as SaasRole[]).map(role => {
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
                    <span>১৫টি গ্র্যানুলার পারমিশন কন্ট্রোল (Category Matrix)</span>
                  </span>
                </div>

                <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
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
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">বেস রোল</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="support">🎧 কাস্টমার সাপোর্ট</option>
                    <option value="sales">🏢 অপারেশনস ও ডিলার</option>
                    <option value="technician">🔧 টেকনিশিয়ান</option>
                    <option value="rescue">🚒 রেসকিউ টিম</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কাস্টম পদবি (Optional)</label>
                  <input
                    type="text"
                    value={newUserCustomTitle}
                    onChange={(e) => setNewUserCustomTitle(e.target.value)}
                    placeholder="যেমন: হেল্পডেস্ক লিড"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

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

      {/* MODAL: PROVISION NEW COMPANY OPERATIONS MANAGER */}
      {isNewMgrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-cyan-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-cyan-600/30 border border-cyan-500/50 flex items-center justify-center text-cyan-300">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">নতুন কোম্পানি ম্যানেজার নিয়োগ ও সেটআপ</h3>
                  <p className="text-[10px] text-slate-400">সুপার অ্যাডমিন কর্তৃক সেন্ট্রাল প্রভিশনিং</p>
                </div>
              </div>
              <button onClick={() => setIsNewMgrModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewManager} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ম্যানেজারের পুরো নাম *</label>
                <input
                  type="text"
                  required
                  value={newMgrName}
                  onChange={(e) => setNewMgrName(e.target.value)}
                  placeholder="যেমন: মোঃ শামীম ওসমান"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মোবাইল নম্বর (লগইন আইডি) *</label>
                  <input
                    type="text"
                    required
                    value={newMgrPhone}
                    onChange={(e) => setNewMgrPhone(e.target.value)}
                    placeholder="01710-001122"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">৪-ডিজিট সিকিউরিটি PIN *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newMgrPin}
                    onChange={(e) => setNewMgrPin(e.target.value)}
                    placeholder="5501"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-black focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">নির্ধারিত পরিবহন কোম্পানি *</label>
                <select
                  value={newMgrCompany}
                  onChange={(e) => setNewMgrCompany(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-bold focus:border-cyan-500 focus:outline-none"
                >
                  <option value="হানিফ এন্টারপ্রাইজ">🚌 হানিফ এন্টারপ্রাইজ</option>
                  <option value="শ্যামলী পরিবহন">🚌 শ্যামলী পরিবহন</option>
                  <option value="এনা ট্রান্সপোর্ট">🚌 এনা ট্রান্সপোর্ট</option>
                  <option value="গ্রিন লাইন পরিবহন">🚌 গ্রিন লাইন পরিবহন</option>
                  <option value="সৌদিয়া পরিবহন">🚌 সৌদিয়া পরিবহন</option>
                  <option value="ইউনিক সার্ভিস">🚌 ইউনিক সার্ভিস</option>
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">হেড অফিস / ডিপো লোকেশন</label>
                <input
                  type="text"
                  value={newMgrBase}
                  onChange={(e) => setNewMgrBase(e.target.value)}
                  placeholder="যেমন: সেন্ট্রাল হেড অফিস • গাবতলী ঢাকা"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewMgrModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-black text-xs shadow-lg shadow-cyan-600/30"
                >
                  ম্যানেজার অ্যাকাউন্ট তৈরি
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
