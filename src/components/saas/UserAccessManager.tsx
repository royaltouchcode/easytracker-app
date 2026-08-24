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
  CheckCircle2
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

const DEFAULT_USERS: EnterpriseUser[] = [
  {
    id: 'USR-101',
    name: 'সুপার অ্যাডমিন (Super Admin)',
    phone: '01700-000001',
    email: 'admin@easytracker.com',
    department: 'Executive Management',
    status: 'active',
    primaryRole: 'super_admin',
    approvedRoles: ['super_admin', 'sales', 'technician', 'support', 'rescue', 'customer'],
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
    department: 'Sales & Dealer Relations',
    status: 'active',
    primaryRole: 'sales',
    approvedRoles: ['sales', 'customer'],
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
    id: 'USR-103',
    name: 'আব্দুল করিম (Abdul Karim)',
    phone: '01711-223344',
    email: 'karim.tech@easytracker.com',
    department: 'Field Installation & Wiring',
    status: 'active',
    primaryRole: 'technician',
    approvedRoles: ['technician', 'sales', 'customer'],
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
    id: 'USR-105',
    name: 'ক্যাপ্টেন তারেক (Tariq - SOS Team)',
    phone: '01911-998877',
    email: 'rescue.ops@easytracker.com',
    department: 'SOS Rapid Intercept Force',
    status: 'active',
    primaryRole: 'rescue',
    approvedRoles: ['rescue', 'customer'],
    permissions: {
      canCutEngine: true,
      canDispatchTech: true,
      canViewRevenue: false,
      canManageWarranty: false,
      canPurgeDemo: false,
      canExportData: true
    },
    lastLogin: '২৪ আগস্ট ২০২৬',
    createdAt: '10 Feb 2026'
  }
];

export const UserAccessManager: React.FC = () => {
  const { language } = useApp();

  const [users, setUsers] = useState<EnterpriseUser[]>(() => {
    const saved = localStorage.getItem('gps_enterprise_user_directory');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_USERS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<EnterpriseUser | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Modal State
  const [editApprovedRoles, setEditApprovedRoles] = useState<SaasRole[]>([]);
  const [editStatus, setEditStatus] = useState<'active' | 'suspended'>('active');
  const [editPermissions, setEditPermissions] = useState({
    canCutEngine: false,
    canDispatchTech: false,
    canViewRevenue: false,
    canManageWarranty: false,
    canPurgeDemo: false,
    canExportData: false
  });

  // Add User Modal State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newDept, setNewDept] = useState('Sales & Marketing');
  const [newRoles, setNewRoles] = useState<SaasRole[]>(['sales', 'customer']);

  const handleOpenEditModal = (user: EnterpriseUser) => {
    setSelectedUser(user);
    setEditApprovedRoles([...user.approvedRoles]);
    setEditStatus(user.status);
    setEditPermissions({ ...user.permissions });
  };

  const handleSaveUserPermissions = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    const updated = users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          status: editStatus,
          approvedRoles: editApprovedRoles.length > 0 ? editApprovedRoles : ['customer'],
          primaryRole: editApprovedRoles[0] || 'customer',
          permissions: editPermissions
        };
      }
      return u;
    });

    setUsers(updated);
    localStorage.setItem('gps_enterprise_user_directory', JSON.stringify(updated));

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setSelectedUser(null);
    }, 1200);
  };

  const handleToggleRole = (role: SaasRole) => {
    setEditApprovedRoles(prev => 
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleCreateNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) {
      alert('দয়া করে নাম ও মোবাইল নম্বর পূরণ করুন');
      return;
    }

    const newUser: EnterpriseUser = {
      id: 'USR-' + Math.floor(100 + Math.random() * 900),
      name: newName.trim(),
      phone: newPhone.trim(),
      email: newEmail.trim() || `${newPhone.trim()}@easytracker.com`,
      department: newDept,
      status: 'active',
      primaryRole: newRoles[0] || 'customer',
      approvedRoles: newRoles,
      permissions: {
        canCutEngine: newRoles.includes('rescue') || newRoles.includes('super_admin') || newRoles.includes('technician'),
        canDispatchTech: newRoles.includes('support') || newRoles.includes('super_admin'),
        canViewRevenue: newRoles.includes('super_admin'),
        canManageWarranty: newRoles.includes('support') || newRoles.includes('technician') || newRoles.includes('super_admin'),
        canPurgeDemo: newRoles.includes('super_admin'),
        canExportData: true
      },
      lastLogin: 'নতুন তৈরি (Just Created)',
      createdAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    };

    const updated = [...users, newUser];
    setUsers(updated);
    localStorage.setItem('gps_enterprise_user_directory', JSON.stringify(updated));

    setIsAddModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewEmail('');
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone.includes(searchQuery) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const roleBadges: Record<SaasRole, { labelBn: string; color: string; icon: any }> = {
    super_admin: { labelBn: '👑 সুপার অ্যাডমিন', color: 'bg-amber-950/80 text-amber-300 border-amber-700/60', icon: Crown },
    sales: { labelBn: '💼 সেলস', color: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60', icon: Briefcase },
    technician: { labelBn: '🔧 টেকনিশিয়ান', color: 'bg-purple-950/80 text-purple-300 border-purple-700/60', icon: Wrench },
    support: { labelBn: '🎧 সাপোর্ট', color: 'bg-sky-950/80 text-sky-300 border-sky-700/60', icon: Headphones },
    rescue: { labelBn: '🚨 রেসকিউ', color: 'bg-rose-950/80 text-rose-300 border-rose-700/60', icon: Flame },
    customer: { labelBn: '👤 কাস্টমার', color: 'bg-blue-950/80 text-blue-300 border-blue-700/60', icon: Smartphone }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-4 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5">
              <span>{language === 'bn' ? 'স্টাফ ও ইউজার রোল এক্সেস কন্ট্রোল (RBAC Permissions Hub)' : 'Staff & User RBAC Access Hub'}</span>
              <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.2 rounded-full border border-indigo-500/30">
                Super Admin
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'কোন ইউজার কোন কোন রোল ও ফিচারে এক্সেস পাবে তা অ্যাডমিন থেকে নিয়ন্ত্রণ করুন' : 'Grant or revoke roles & operational feature permissions per user'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 flex items-center space-x-1.5 transition active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'নতুন স্টাফ যোগ করুন' : 'Add Staff'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 নাম, মোবাইল, ইমেইল, ডিপার্টমেন্ট বা ইউজার আইডি দিয়ে খুঁজুন..."
          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      {/* Users Directory List */}
      <div className="space-y-2.5 max-h-96 overflow-y-auto">
        {filteredUsers.map((u) => {
          return (
            <div 
              key={u.id} 
              className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2 text-xs hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                    {u.id}
                  </span>
                  <span className="font-extrabold text-slate-100 text-xs">
                    {u.name}
                  </span>
                  <span className="text-[10px] text-slate-400">({u.department})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                    u.status === 'active' 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                      : 'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    {u.status === 'active' ? '🟢 সক্রিয় (Active)' : '🔴 স্থগিত (Suspended)'}
                  </span>

                  <button
                    onClick={() => handleOpenEditModal(u)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-indigo-300 border border-slate-700 transition"
                    title="রোল ও পারমিশন এডিট করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Contact Info & Last Login */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10.5px] text-slate-300 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-slate-500 block text-[9.5px]">মোবাইল নম্বর:</span>
                  <span className="font-mono font-bold text-emerald-400">{u.phone}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9.5px]">ইমেইল এড্রেস:</span>
                  <span className="text-slate-300 truncate block">{u.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9.5px]">সর্বশেষ লগইন:</span>
                  <span className="text-slate-400 block">{u.lastLogin}</span>
                </div>
              </div>

              {/* Granted Roles Matrix Badges */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="text-[9.5px] font-bold text-slate-400 mr-1">অনুমোদিত রোলসমূহ:</span>
                {u.approvedRoles.map(role => {
                  const b = roleBadges[role] || { labelBn: role, color: 'bg-slate-800 text-slate-300 border-slate-700' };
                  return (
                    <span 
                      key={role}
                      className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-lg border ${b.color}`}
                    >
                      {b.labelBn}
                    </span>
                  );
                })}
              </div>

              {/* Feature Access Tags */}
              <div className="flex flex-wrap items-center gap-1.5 text-[9px] text-slate-400">
                <span className="text-slate-500 font-semibold">ফিচার পারমিশন:</span>
                {u.permissions.canCutEngine && <span className="px-1.5 py-0.2 bg-rose-950/60 text-rose-300 rounded border border-rose-800/50">⚡ ইঞ্জিন কাটঅফ</span>}
                {u.permissions.canDispatchTech && <span className="px-1.5 py-0.2 bg-sky-950/60 text-sky-300 rounded border border-sky-800/50">🔧 টেকনিশিয়ান ডিসপ্যাচ</span>}
                {u.permissions.canManageWarranty && <span className="px-1.5 py-0.2 bg-emerald-950/60 text-emerald-300 rounded border border-emerald-800/50">🛡️ ওয়ারেন্টি RMA</span>}
                {u.permissions.canViewRevenue && <span className="px-1.5 py-0.2 bg-amber-950/60 text-amber-300 rounded border border-amber-800/50">💰 রেভিনিউ ভিউ</span>}
                {u.permissions.canExportData && <span className="px-1.5 py-0.2 bg-slate-900 text-slate-300 rounded border border-slate-800">📊 এক্সেল এক্সপোর্ট</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* EDIT USER ROLES & PERMISSIONS MODAL                                       */}
      {/* ========================================================================= */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-3xl max-w-md w-full p-4 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-400" />
                <span className="font-extrabold text-xs text-indigo-300">
                  ইউজার রোল ও এক্সেস পারমিশন কনফিগার
                </span>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs">
              <div className="font-extrabold text-slate-100">{selectedUser.name}</div>
              <div className="text-[10.5px] text-slate-400 font-mono mt-0.5">
                {selectedUser.phone} • {selectedUser.email}
              </div>
            </div>

            <form onSubmit={handleSaveUserPermissions} className="space-y-3.5 text-xs">
              {/* Account Status Switcher */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  একাউন্ট স্ট্যাটাস:
                </label>
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

              {/* Approved Roles Multi-Select Checkboxes */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1.5">
                  অনুমোদিত রোলসমূহ (Multi-Role Authorization) *
                </label>
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
                          className="w-3.5 h-3.5 text-indigo-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
                        />
                        <span className="font-extrabold text-[10.5px]">{b.labelBn}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Granular Permission Feature Toggles */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1.5">
                  বিশেষ ফিচার পারমিশন (Operational Permissions):
                </label>
                <div className="space-y-1.5 bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[10.5px] text-slate-300">⚡ দূর থেকে ইঞ্জিন কাটঅফ কমান্ড অথোরাইজেশন</span>
                    <input
                      type="checkbox"
                      checked={editPermissions.canCutEngine}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canCutEngine: e.target.checked })}
                      className="w-4 h-4 text-rose-600 rounded bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[10.5px] text-slate-300">🔧 টেকনিশিয়ান ওয়ার্ক অর্ডার ডিসপ্যাচ</span>
                    <input
                      type="checkbox"
                      checked={editPermissions.canDispatchTech}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canDispatchTech: e.target.checked })}
                      className="w-4 h-4 text-sky-600 rounded bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[10.5px] text-slate-300">🛡️ ওয়ারেন্টি পলিসি ও ক্লেইম অনুমোদন</span>
                    <input
                      type="checkbox"
                      checked={editPermissions.canManageWarranty}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canManageWarranty: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[10.5px] text-slate-300">💰 ফাইনান্সিয়াল রেভিনিউ ও বিলিং ভিউ</span>
                    <input
                      type="checkbox"
                      checked={editPermissions.canViewRevenue}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canViewRevenue: e.target.checked })}
                      className="w-4 h-4 text-amber-600 rounded bg-slate-900 border-slate-700"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-[10.5px] text-slate-300">📊 রিপোর্ট ও এক্সেল ডাটা এক্সপোর্ট</span>
                    <input
                      type="checkbox"
                      checked={editPermissions.canExportData}
                      onChange={(e) => setEditPermissions({ ...editPermissions, canExportData: e.target.checked })}
                      className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700"
                    />
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saveSuccess ? 'সংরক্ষণ সম্পন্ন!' : 'পারমিশন সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD NEW STAFF MODAL                                                       */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-indigo-500/50 rounded-3xl max-w-md w-full p-4 shadow-2xl space-y-3 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs text-indigo-300 flex items-center space-x-1.5">
                <Plus className="w-4 h-4 text-indigo-400" />
                <span>নতুন স্টাফ ও ইউজার যুক্ত করুন</span>
              </span>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewUser} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">স্টাফের পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="যেমন: তানভীর আহমেদ"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ডিপার্টমেন্ট</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="Sales & Marketing">সেলস ও মার্কেটিং</option>
                    <option value="Field Engineering">ফিল্ড টেকনিশিয়ান</option>
                    <option value="Customer Care">কাস্টমার কেয়ার</option>
                    <option value="Rescue Force">রেসকিউ টিম</option>
                    <option value="IT & Server Ops">আইটি ও সার্ভার</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ইমেইল এড্রেস (ঐচ্ছিক)</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="user@easytracker.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">প্রাথমিক রোল নির্ধারণ করুন *</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {(['sales', 'technician', 'support', 'rescue', 'customer'] as SaasRole[]).map(role => (
                    <label key={role} className="flex items-center space-x-1.5 p-2 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newRoles.includes(role)}
                        onChange={() => {
                          setNewRoles(prev => prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]);
                        }}
                        className="w-3.5 h-3.5 text-indigo-600 rounded bg-slate-900 border-slate-700"
                      />
                      <span className="font-bold text-[10.5px] text-slate-300">{roleBadges[role].labelBn}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>স্টাফ একাউন্ট তৈরি করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
