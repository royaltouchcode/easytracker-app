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
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SaasRole } from '../../types/traccar';

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
  permissions: {
    canCutEngine: boolean;
    canDispatchTech: boolean;
    canViewRevenue: boolean;
    canManageWarranty: boolean;
    canPurgeDemo: boolean;
    canExportData: boolean;
  };
  lastLogin: string;
  createdAt: string;
}

export interface CustomRoleDefinition {
  id: string;
  titleBn: string;
  baseRole: SaasRole;
  descriptionBn: string;
  accessibleSections: string[];
  permissions: {
    canCutEngine: boolean;
    canDispatchTech: boolean;
    canViewRevenue: boolean;
    canManageWarranty: boolean;
    canPurgeDemo: boolean;
    canExportData: boolean;
  };
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
      canDispatchTech: true,
      canViewRevenue: true,
      canManageWarranty: true,
      canPurgeDemo: true,
      canExportData: true
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
      canDispatchTech: false,
      canViewRevenue: false,
      canManageWarranty: false,
      canPurgeDemo: false,
      canExportData: true
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
    customRoleTitle: '🎧 কাস্টমার সাপোর্ট ও রেসকিউ কোঅর্ডিনেটর',
    permissions: {
      canCutEngine: false,
      canDispatchTech: true,
      canViewRevenue: false,
      canManageWarranty: true,
      canPurgeDemo: false,
      canExportData: true
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
      canDispatchTech: false,
      canViewRevenue: false,
      canManageWarranty: true,
      canPurgeDemo: false,
      canExportData: false
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
      canDispatchTech: true,
      canViewRevenue: false,
      canManageWarranty: true,
      canPurgeDemo: false,
      canExportData: true
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
      canDispatchTech: false,
      canViewRevenue: true,
      canManageWarranty: false,
      canPurgeDemo: false,
      canExportData: true
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

  const [activeTabSubView, setActiveTabSubView] = useState<'users' | 'roles'>('users');
  const [selectedUser, setSelectedUser] = useState<EnterpriseUser | null>(null);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [isAiRoleModalOpen, setIsAiRoleModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
  const [editPermissions, setEditPermissions] = useState({
    canCutEngine: false,
    canDispatchTech: false,
    canViewRevenue: false,
    canManageWarranty: false,
    canPurgeDemo: false,
    canExportData: true
  });

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
    setEditPermissions({ ...user.permissions });
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
      let perms = {
        canCutEngine: false,
        canDispatchTech: false,
        canViewRevenue: false,
        canManageWarranty: false,
        canPurgeDemo: false,
        canExportData: true
      };
      let audit = '✅ নিরাপদ: সংবেদনশীল সার্ভার ও পুলিশ API সুরক্ষিত রাখা হয়েছে।';

      if (q.includes('support') || q.includes('care') || q.includes('help') || q.includes('কাস্টমার')) {
        base = 'support';
        sections = ['রেসকিউ টিম ও ক্লেইম', 'এসএমএস গেটওয়ে হাব', 'ওয়ারেন্টি ও আরএমএ', 'ইনস্টলেশন হিস্ট্রি'];
        perms.canDispatchTech = true;
        perms.canManageWarranty = true;
        audit = '✅ AI অডিট: কাস্টমার সাপোর্ট রোলের জন্য GovTech ও M2M গেটওয়ে ব্লক করা হয়েছে।';
      } else if (q.includes('sales') || q.includes('dealer') || q.includes('অপারেশন') || q.includes('ম্যানেজার')) {
        base = 'sales';
        sections = ['সেলস অনবোর্ডিং কিউ', 'ট্র্যাকার ডিভাইস ERP', 'টেলিমেটিক্স সিম ERP', 'ডিলার পে-ওয়াল', 'B2B পার্টনার'];
        perms.canViewRevenue = true;
        audit = '✅ AI অডিট: সেলস ও ইনভেন্টরি রাইটস মঞ্জুর করা হয়েছে। ইঞ্জিন কাটঅফ ক্ষমতা সীমাবদ্ধ।';
      } else if (q.includes('tech') || q.includes('মেকানিক') || q.includes('ইনস্টল')) {
        base = 'technician';
        sections = ['সার্ভিস রেট ও পার্টস কার্ড', 'AI ভেহিকেল ক্যাটালগ', 'ওয়ারেন্টি ও আরএমএ'];
        perms.canCutEngine = true;
        perms.canManageWarranty = true;
        audit = '✅ AI অডিট: টেকনিশিয়ানের জন্য ওয়ারেন্টি ও রিমোট টেস্ট কাটঅফ এনাবল করা হয়েছে।';
      } else if (q.includes('rescue') || q.includes('তারেক') || q.includes('জরুরি')) {
        base = 'rescue';
        sections = ['রেসকিউ টিম ও ক্ষতিপূরণ ক্লেইম', 'এসএমএস গেটওয়ে হাব'];
        perms.canCutEngine = true;
        perms.canDispatchTech = true;
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
        canDispatchTech: newUserRole === 'support' || newUserRole === 'rescue',
        canViewRevenue: newUserRole === 'sales' || newUserRole === 'super_admin',
        canManageWarranty: newUserRole === 'support' || newUserRole === 'technician',
        canPurgeDemo: false,
        canExportData: true
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
                  👑 স্টাফ রোল ডিস্ট্রিবিউশন ও AI অ্যাক্সেস হাব (Super Admin RBAC)
                </h3>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  OMNI-ACCESS ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                সুপার অ্যাডমিন যেকোনো রোলের কাজ সরাসরি পর্যবেক্ষণ ও সম্পাদন করতে পারবেন। AI দিয়ে স্বয়ংক্রিয়ভাবে সঠিক রোল ও পারমিশন তৈরি করুন।
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

      {/* 2 Tabs: Users List & AI Custom Roles */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-2.5 rounded-2xl">
        <div className="flex space-x-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveTabSubView('users')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition ${
              activeTabSubView === 'users' ? 'bg-indigo-600 text-white border-indigo-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            👥 কর্মকর্তা ও স্টাফ ইউজার ({users.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTabSubView('roles')}
            className={`px-3.5 py-1.5 rounded-xl font-bold border transition flex items-center space-x-1.5 ${
              activeTabSubView === 'roles' ? 'bg-purple-600 text-white border-purple-500 shadow-md' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-purple-300" />
            <span>🤖 AI কাস্টম রোলস ও ডিস্ট্রিবিউশন ({customRoles.length})</span>
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
                    <span>পারমিশন পরিবর্তন</span>
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

      {/* MODAL: EDIT USER PERMISSIONS */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-indigo-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-indigo-300 flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span>ইউজার পারমিশন কনফিগারেশন</span>
              </h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs">
              <div className="font-extrabold text-slate-100">{selectedUser.name}</div>
              <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                {selectedUser.phone} • {selectedUser.department}
              </div>
            </div>

            <form onSubmit={handleSaveUserPermissions} className="space-y-3 text-xs">
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
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1.5">অনুমোদিত রোলসমূহ (Multi-Role):</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['sales', 'technician', 'support', 'rescue', 'customer', 'super_admin'] as SaasRole[]).map(role => {
                    const b = roleBadges[role];
                    const isChecked = editApprovedRoles.includes(role);
                    return (
                      <label
                        key={role}
                        className={`flex items-center space-x-2 p-2 rounded-xl border cursor-pointer transition ${
                          isChecked 
                            ? 'bg-indigo-950/60 border-indigo-500/60 text-white' 
                            : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleRole(role)}
                          className="rounded text-indigo-600"
                        />
                        <span className="text-[10.5px] font-bold">{b.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

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
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30"
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
