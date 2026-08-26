import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  Briefcase, 
  Wrench, 
  Headphones, 
  Flame, 
  Smartphone,
  Crown,
  CheckCircle2,
  Sparkles,
  Lock,
  Bot,
  Plus,
  ArrowRight,
  Layers,
  Building2
} from 'lucide-react';
import { SaasRole } from '../../types/traccar';
import { useApp } from '../../context/AppContext';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface CustomRoleItem {
  id: string;
  titleBn: string;
  baseRole: SaasRole;
  descriptionBn: string;
  accessibleSections: string[];
  aiSecurityAuditBn?: string;
}

const ALL_PRESET_ROLES: { 
  id: SaasRole; 
  titleBn: string; 
  titleEn: string; 
  descBn: string; 
  descEn: string; 
  icon: any; 
  color: string; 
  bg: string; 
  border: string; 
  targetTab: any;
}[] = [
  {
    id: 'customer',
    titleBn: 'কাস্টমার ভিউ (Customer Telematics)',
    titleEn: 'Customer Telematics View',
    descBn: 'লাইভ ম্যাপ, ইঞ্জিন লক/আনলক, ৪-KPI উইজেট, ফুয়েল অডিট ও ওডোমিটার।',
    descEn: 'Live map, remote engine lock/unlock, 4-KPI widgets, fuel audit & odometer.',
    icon: Smartphone,
    color: 'text-blue-400',
    bg: 'bg-blue-600/20',
    border: 'border-blue-500/40',
    targetTab: 'map'
  },
  {
    id: 'partner',
    titleBn: 'বিজনেস পার্টনার পোর্টাল (Partner Franchise Hub)',
    titleEn: 'Business Partner Franchise Hub',
    descBn: '৪,০৯৬ স্লট কোটা, ফ্লোটিং ব্যালেন্স লেজার, স্টাফ ম্যানেজমেন্ট ও শপ প্রোফাইল।',
    descEn: '4096 Slot quotas, floating ledger, staff management & shop profile.',
    icon: ShieldCheck,
    color: 'text-teal-400',
    bg: 'bg-teal-600/20',
    border: 'border-teal-500/40',
    targetTab: 'saas_partner'
  },
  {
    id: 'super_admin',
    titleBn: 'সুপার অ্যাডমিন ড্যাশবোর্ড (Super Admin SaaS)',
    titleEn: 'Super Admin Control Center',
    descBn: 'সাবস্ক্রিপশন প্ল্যান, রেভিনিউ, সেলস অনুমোদন ও ১-ক্লিকে ডেমো ডাটা ক্লিন।',
    descEn: 'Subscription plans, MRR revenue, sales push approvals & demo purge.',
    icon: Crown,
    color: 'text-amber-400',
    bg: 'bg-amber-600/20',
    border: 'border-amber-500/40',
    targetTab: 'saas_admin'
  },
  {
    id: 'operations_manager',
    titleBn: 'SaaS অপারেশনস ম্যানেজার (Central ERP)',
    titleEn: 'SaaS Operations Manager',
    descBn: 'ট্র্যাকার ও সিম ইনভেন্টরি ERP, টেকনিশিয়ান শিডিউলিং ও ডিলার কোটা অনুমোদন।',
    descEn: 'Central hardware & SIM inventory ERP, tech scheduling & dealer quota.',
    icon: Building2,
    color: 'text-cyan-400',
    bg: 'bg-cyan-600/20',
    border: 'border-cyan-500/40',
    targetTab: 'saas_sales'
  },
  {
    id: 'sales',
    titleBn: 'সেলস টিম পোর্টাল (Sales & Onboarding)',
    titleEn: 'Sales & Onboarding Portal',
    descBn: 'নতুন কাস্টমার অনবোর্ডিং, ক্যাসকেডিং ভেহিকেল ও বারকোড দিয়ে IMEI এন্ট্রি।',
    descEn: 'New customer onboarding, cascading vehicle selector & barcode scanner.',
    icon: Briefcase,
    color: 'text-emerald-400',
    bg: 'bg-emerald-600/20',
    border: 'border-emerald-500/40',
    targetTab: 'saas_sales'
  },
  {
    id: 'technician',
    titleBn: 'ইনস্টলেশন ও সার্ভিসিং টেকনিশিয়ান (Technician Hub)',
    titleEn: 'Field Installation & Servicing',
    descBn: 'জব চলাকালীন ওয়্যারিং টেস্ট (12V, ACC, রিলে কাটঅফ) ও অটো-লকডাউন।',
    descEn: 'Time-bounded wiring diagnostics (Power, ACC, Relay) & auto-lockdown.',
    icon: Wrench,
    color: 'text-purple-400',
    bg: 'bg-purple-600/20',
    border: 'border-purple-500/40',
    targetTab: 'saas_technician'
  },
  {
    id: 'support_lead',
    titleBn: 'সাপোর্ট লিড ও সুপারভাইজার (Support Lead)',
    titleEn: 'Customer Support Lead',
    descBn: 'জুনিয়র সাপোর্ট অফিসারদের অডিট, জটিল ডিসপিউট হ্যান্ডলিং ও রেসকিউ টিম ক্লেইম।',
    descEn: 'Helpdesk supervision, escalation handling & emergency claims verification.',
    icon: ShieldCheck,
    color: 'text-indigo-400',
    bg: 'bg-indigo-600/20',
    border: 'border-indigo-500/40',
    targetTab: 'saas_support'
  },
  {
    id: 'support',
    titleBn: 'কাস্টমার সাপোর্ট ও হেল্পডেস্ক (Customer Care)',
    titleEn: 'Helpdesk & Customer Care',
    descBn: 'সাপোর্ট টিকিট সমাধান, রিফান্ড ম্যানেজমেন্ট ও টেকনিশিয়ান সার্ভিস ডিসপ্যাচ।',
    descEn: 'Support ticket resolution, refund desk & field tech dispatch.',
    icon: Headphones,
    color: 'text-sky-400',
    bg: 'bg-sky-600/20',
    border: 'border-sky-500/40',
    targetTab: 'saas_support'
  },
  {
    id: 'rescue',
    titleBn: 'রেসকিউ টিম ইমার্জেন্সি এসওএস (Rescue SOS Force)',
    titleEn: 'Emergency Rescue SOS Force',
    descBn: 'ডিস্ট্রেস রাডার ম্যাপ, রিয়েল-টাইম ইন্টারসেপ্ট রুট ও রিমোট ইঞ্জিন কাটঅফ।',
    descEn: 'Distress radar map, live rapid intercept routing & remote engine cutoff auth.',
    icon: Flame,
    color: 'text-rose-400',
    bg: 'bg-rose-600/20',
    border: 'border-rose-500/40',
    targetTab: 'saas_rescue'
  }
];

const DEFAULT_CUSTOM_ROLES: CustomRoleItem[] = [
  {
    id: 'role_support_lead',
    titleBn: '🎧 কাস্টমার সাপোর্ট অফিসার (Customer Care Lead)',
    baseRole: 'support',
    descriptionBn: 'গ্রাহকদের সমস্যা সমাধান, লাইভ ট্র্যাকিং গাইডলাইন, এসএমএস লগ ও রেসকিউ টিম ক্লেইম হ্যান্ডেল করা।',
    accessibleSections: ['রেসকিউ টিম ও ক্লেইম', 'এসএমএস গেটওয়ে হাব', 'ওয়ারেন্টি ও আরএমএ', 'ইনস্টলেশন হিস্ট্রি'],
    aiSecurityAuditBn: '✅ AI অনুমোদিত: GovTech পুলিশ ডাটাবেজ ও টেলকো M2M গেটওয়ে অ্যাক্সেস সীমাবদ্ধ।'
  },
  {
    id: 'role_ops_manager',
    titleBn: '🏢 অপারেশনস ও ডিলার অ্যাডমিন (Operations Manager)',
    baseRole: 'sales',
    descriptionBn: 'নতুন ডিলার অনবোর্ডিং, ট্র্যাকার ও সিম ইনভেন্টরি ইস্যু, ডিলার পে-ওয়াল এবং B2B পার্টনারশিপ দেখাশোনা করা।',
    accessibleSections: ['সেলস অনবোর্ডিং কিউ', 'ট্র্যাকার ডিভাইস ERP', 'টেলিমেটিক্স সিম ERP', 'ডিলার পে-ওয়াল ও লেজার', 'B2B পার্টনার'],
    aiSecurityAuditBn: '✅ AI অনুমোদিত: অর্থনৈতিক লেজার অনুমোদিত হলেও কোর জিপিএস ক্লাস্টার লকড।'
  }
];

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentRole, setCurrentRole, language, setActiveTab, user } = useApp();

  const [customRoles, setCustomRoles] = useState<CustomRoleItem[]>(() => {
    const saved = localStorage.getItem('gps_custom_rbac_roles');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_CUSTOM_ROLES;
  });

  const [isAiCreateOpen, setIsAiCreateOpen] = useState(false);
  const [aiRolePrompt, setAiRolePrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generatedRole, setGeneratedRole] = useState<CustomRoleItem | null>(null);

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('gps_custom_rbac_roles');
      if (saved) {
        try { setCustomRoles(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSuperAdmin = user?.administrator || user?.role === 'super_admin' || currentRole === 'super_admin';
  const approvedRoles: SaasRole[] = user?.approvedRoles || (isSuperAdmin ? ['super_admin', 'sales', 'technician', 'support', 'rescue', 'customer', 'partner'] : [user?.role || 'customer']);

  const handleSelectRole = (roleItem: typeof ALL_PRESET_ROLES[0]) => {
    const isApproved = isSuperAdmin || approvedRoles.includes(roleItem.id);
    if (!isApproved) {
      alert(language === 'bn' ? '⚠️ আপনার অ্যাকাউন্টে এই রোলে অ্যাক্সেসের অনুমোদন নেই।' : 'Access restricted for this role.');
      return;
    }
    setCurrentRole(roleItem.id);
    setActiveTab(roleItem.targetTab);
    onClose();
  };

  const handleSelectCustomRole = (customRole: CustomRoleItem) => {
    const isApproved = isSuperAdmin || approvedRoles.includes(customRole.baseRole);
    if (!isApproved) {
      alert(language === 'bn' ? '⚠️ আপনার অ্যাকাউন্টে এই রোলে অ্যাক্সেসের অনুমোদন নেই।' : 'Access restricted for this custom role.');
      return;
    }
    
    const targetMap: Record<SaasRole, string> = {
      super_admin: 'saas_admin',
      operations_manager: 'saas_sales',
      support_lead: 'saas_support',
      sales: 'saas_sales',
      technician: 'saas_technician',
      support: 'saas_support',
      rescue: 'saas_rescue',
      customer: 'map',
      partner: 'saas_partner'
    };

    setCurrentRole(customRole.baseRole);
    setActiveTab(targetMap[customRole.baseRole] || 'map');
    onClose();
  };

  const handleGenerateAiRole = () => {
    if (!aiRolePrompt.trim()) return;
    setIsAiGenerating(true);

    setTimeout(() => {
      const q = aiRolePrompt.toLowerCase();
      let base: SaasRole = 'support';
      let sections: string[] = [];
      let audit = '✅ AI অডিট: সংবেদনশীল সার্ভার ও পুলিশ API সুরক্ষিত রাখা হয়েছে।';

      if (q.includes('support') || q.includes('care') || q.includes('help') || q.includes('কাস্টমার') || q.includes('সাপোর্ট')) {
        base = 'support';
        sections = ['রেসকিউ টিম ও ক্লেইম', 'এসএমএস গেটওয়ে হাব', 'ওয়ারেন্টি ও আরএমএ', 'ইনস্টলেশন হিস্ট্রি'];
        audit = '✅ AI অডিট: কাস্টমার সাপোর্ট রোলের জন্য GovTech ও M2M গেটওয়ে ব্লক করা হয়েছে।';
      } else if (q.includes('sales') || q.includes('dealer') || q.includes('অপারেশন') || q.includes('ম্যানেজার') || q.includes('সেলস')) {
        base = 'sales';
        sections = ['সেলস অনবোর্ডিং কিউ', 'ট্র্যাকার ডিভাইস ERP', 'টেলিমেটিক্স সিম ERP', 'ডিলার পে-ওয়াল', 'B2B পার্টনার'];
        audit = '✅ AI অডিট: সেলস ও ইনভেন্টরি রাইটস মঞ্জুর করা হয়েছে। ইঞ্জিন কাটঅফ ক্ষমতা সীমাবদ্ধ।';
      } else if (q.includes('tech') || q.includes('মেকানিক') || q.includes('ইনস্টল') || q.includes('টেকনিশিয়ান')) {
        base = 'technician';
        sections = ['সার্ভিস রেট ও পার্টস কার্ড', 'AI ভেহিকেল ক্যাটালগ', 'ওয়ারেন্টি ও আরএমএ'];
        audit = '✅ AI অডিট: টেকনিশিয়ানের জন্য ওয়ারেন্টি ও রিমোট টেস্ট কাটঅফ এনাবল করা হয়েছে।';
      } else if (q.includes('rescue') || q.includes('তারেক') || q.includes('জরুরি') || q.includes('রেসকিউ')) {
        base = 'rescue';
        sections = ['রেসকিউ টিম ও ক্ষতিপূরণ ক্লেইম', 'এসএমএস গেটওয়ে হাব'];
        audit = '🚨 AI অডিট: রেসকিউ রোলে হাই-প্রায়োরিটি ইমার্জেন্সি ইন্টারসেপ্ট পারমিশন দেওয়া হয়েছে।';
      } else {
        base = 'sales';
        sections = ['সেলস অনবোর্ডিং কিউ', 'ডিলার পে-ওয়াল'];
      }

      const generated: CustomRoleItem = {
        id: `role_${Date.now().toString().slice(-4)}`,
        titleBn: aiRolePrompt.trim(),
        baseRole: base,
        descriptionBn: `AI দ্বারা স্বয়ংক্রিয়ভাবে নির্ধারিত পারমিশন সেট (${aiRolePrompt.trim()})।`,
        accessibleSections: sections,
        aiSecurityAuditBn: audit
      };

      setGeneratedRole(generated);
      setIsAiGenerating(false);
    }, 700);
  };

  const handleSaveAndApplyCustomRole = () => {
    if (!generatedRole) return;
    const updated = [generatedRole, ...customRoles];
    setCustomRoles(updated);
    localStorage.setItem('gps_custom_rbac_roles', JSON.stringify(updated));
    setIsAiCreateOpen(false);
    setGeneratedRole(null);
    setAiRolePrompt('');
    handleSelectCustomRole(generatedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-sm text-slate-100">
                  {language === 'bn' ? 'SaaS অনুমোদিত পোর্টাল সুইচ' : 'Multi-Role Portal Switcher'}
                </h3>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded-full border border-amber-500/30">
                  RBAC
                </span>
                {isSuperAdmin && (
                  <span className="text-[8.5px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded-full border border-emerald-500/30">
                    👑 MASTER
                  </span>
                )}
              </div>
              <p className="text-[10.5px] text-slate-400 mt-0.5">
                {language === 'bn' ? 'অনুমোদিত দায়িত্বে প্রবেশ করুন অথবা নতুন AI রোল তৈরি করুন' : 'Switch between approved roles or create AI custom roles'}
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

        {/* Action Button: Create New AI Role */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2">
          <span className="text-[11px] text-slate-300 font-bold flex items-center space-x-1.5">
            <Bot className="w-4 h-4 text-purple-400" />
            <span>নতুন কোনো রোল বা পদবি যুক্ত করতে চান?</span>
          </span>
          <button
            type="button"
            onClick={() => setIsAiCreateOpen(!isAiCreateOpen)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-extrabold text-[11px] shadow-md shadow-purple-600/30 flex items-center space-x-1 transition active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ 🤖 নতুন AI রোল তৈরি</span>
          </button>
        </div>

        {/* Embedded AI Role Builder Form */}
        {isAiCreateOpen && (
          <div className="p-3.5 bg-slate-950 border-b border-purple-500/40 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-300 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>AI রোল ক্রিয়েশন ইঞ্জিন</span>
              </span>
              <button onClick={() => setIsAiCreateOpen(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex space-x-2 text-xs">
              <input
                type="text"
                value={aiRolePrompt}
                onChange={(e) => setAiRolePrompt(e.target.value)}
                placeholder="যেমন: কাস্টমার সাপোর্ট অফিসার / ডিলার ম্যানেজার"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-purple-500 focus:outline-none placeholder-slate-500"
              />
              <button
                type="button"
                onClick={handleGenerateAiRole}
                disabled={isAiGenerating || !aiRolePrompt.trim()}
                className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs disabled:opacity-50 flex items-center space-x-1 shrink-0"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isAiGenerating ? 'animate-spin' : ''}`} />
                <span>{isAiGenerating ? 'AI ভাবছে...' : 'AI সাজেস্ট'}</span>
              </button>
            </div>

            {generatedRole && (
              <div className="p-3 rounded-2xl bg-slate-900 border border-purple-500/50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white">{generatedRole.titleBn}</span>
                  <span className="text-[9px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/40">
                    বেস রোল: {generatedRole.baseRole}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {generatedRole.accessibleSections.map((sec, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-950 text-emerald-300 px-2 py-0.5 rounded border border-slate-800">
                      ✓ {sec}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-purple-200">{generatedRole.aiSecurityAuditBn}</p>
                <button
                  type="button"
                  onClick={handleSaveAndApplyCustomRole}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-md flex items-center justify-center space-x-1"
                >
                  <span>💾 সংরক্ষণ করুন ও এই রোলে প্রবেশ করুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Roles List */}
        <div className="p-3 space-y-3 overflow-y-auto flex-1">
          
          {/* SECTION: CUSTOM AI CREATED ROLES */}
          {customRoles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-[11px] font-black text-purple-300 px-1">
                <Bot className="w-3.5 h-3.5 text-purple-400" />
                <span>✨ কাস্টম ও AI তৈরি রোলসমূহ ({customRoles.length})</span>
              </div>

              {customRoles.map((cr) => {
                const isApproved = isSuperAdmin || approvedRoles.includes(cr.baseRole);
                const isCurrent = currentRole === cr.baseRole;

                return (
                  <button
                    key={cr.id}
                    onClick={() => handleSelectCustomRole(cr)}
                    disabled={!isApproved}
                    className={`w-full p-3 rounded-2xl border text-left flex items-start space-x-3 transition active:scale-[0.98] ${
                      !isApproved 
                        ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed' 
                        : isCurrent 
                          ? 'bg-purple-950/50 border-purple-500/60 shadow-lg ring-1 ring-purple-400/30' 
                          : 'bg-slate-800/80 border-purple-500/30 hover:border-purple-500/60 hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-0.5">
                      <Bot className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-purple-200">
                          {cr.titleBn}
                        </span>
                        <span className="text-[8.5px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                          AI CUSTOM
                        </span>
                      </div>
                      <p className="text-[10.5px] text-slate-400 mt-1 leading-snug">
                        {cr.descriptionBn}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {cr.accessibleSections.slice(0, 3).map((sec, idx) => (
                          <span key={idx} className="text-[8.5px] bg-slate-950 text-cyan-300 px-1.5 py-0.2 rounded border border-slate-800">
                            ✓ {sec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* SECTION: SYSTEM PRESET ROLES */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center space-x-1.5 text-[11px] font-black text-slate-400 px-1">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>🏛️ সিস্টেমের মূল পোর্টালসমূহ (System Portals)</span>
            </div>

            {ALL_PRESET_ROLES.map((r) => {
              const isCurrent = currentRole === r.id;
              const isApproved = isSuperAdmin || approvedRoles.includes(r.id);
              const Icon = r.icon;

              return (
                <button
                  key={r.id}
                  onClick={() => handleSelectRole(r)}
                  disabled={!isApproved}
                  className={`w-full p-3 rounded-2xl border text-left flex items-start space-x-3 transition active:scale-[0.98] ${
                    !isApproved 
                      ? 'opacity-40 bg-slate-950 border-slate-900 cursor-not-allowed' 
                      : isCurrent 
                        ? `${r.bg} ${r.border} shadow-lg ring-1 ring-white/20` 
                        : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl ${isApproved ? r.bg : 'bg-slate-900'} border ${isApproved ? r.border : 'border-slate-800'} flex items-center justify-center ${isApproved ? r.color : 'text-slate-600'} shrink-0 mt-0.5`}>
                    {isApproved ? <Icon className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5">
                        <span>{language === 'bn' ? r.titleBn : r.titleEn}</span>
                        {!isApproved && (
                          <span className="text-[8.5px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">লক</span>
                        )}
                      </span>
                      {isCurrent && (
                        <span className="flex items-center space-x-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'bn' ? 'সক্রিয়' : 'Active'}</span>
                        </span>
                      )}
                    </div>
                    <p className="text-[10.5px] text-slate-400 mt-1 leading-snug">
                      {language === 'bn' ? r.descBn : r.descEn}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10.5px] text-slate-400">
          {language === 'bn' 
            ? '💡 সুপার অ্যাডমিন যেকোনো কাস্টম ও সিস্টেম রোলে ক্লিক করে সরাসরি প্রবেশ করতে পারবেন।'
            : '💡 Unified Multi-Role RBAC empowers employees to fulfill multiple operational functions.'}
        </div>
      </div>
    </div>
  );
};
