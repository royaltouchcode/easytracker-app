import React from 'react';
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
  Lock
} from 'lucide-react';
import { SaasRole } from '../../types/traccar';
import { useApp } from '../../context/AppContext';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_ROLES: { 
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
    color: 'text-indigo-400',
    bg: 'bg-indigo-600/20',
    border: 'border-indigo-500/40',
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

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentRole, setCurrentRole, language, setActiveTab, user } = useApp();

  if (!isOpen) return null;

  const isSuperAdmin = user?.administrator || user?.role === 'super_admin';
  const approvedRoles: SaasRole[] = user?.approvedRoles || (isSuperAdmin ? ['super_admin', 'sales', 'technician', 'support', 'rescue', 'customer'] : [user?.role || 'customer']);

  const handleSelectRole = (roleItem: typeof ALL_ROLES[0]) => {
    const isApproved = isSuperAdmin || approvedRoles.includes(roleItem.id);
    if (!isApproved) {
      alert(language === 'bn' ? '⚠️ আপনার অ্যাকাউন্টে এই রোলে অ্যাক্সেসের অনুমোদন নেই।' : 'Access restricted for this role.');
      return;
    }
    setCurrentRole(roleItem.id);
    setActiveTab(roleItem.targetTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>{language === 'bn' ? 'SaaS অনুমোদিত পোর্টাল সুইচ' : 'Multi-Role Portal Switcher'}</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded-full border border-amber-500/30">RBAC</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'আপনার অ্যাকাউন্টে অনুমোদিত দায়িত্বসমূহে প্রবেশ করুন' : 'Switch between your approved enterprise roles'}
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

        {/* Roles List */}
        <div className="p-3 space-y-2 overflow-y-auto flex-1">
          {ALL_ROLES.map((r) => {
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

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 text-center text-[10.5px] text-slate-400">
          {language === 'bn' 
            ? '💡 একজন ইউজার একাধিক রোলে (যেমন: সেলস + টেকনিশিয়ান) কাজ করার অনুমোদন পেতে পারেন।'
            : '💡 Unified Multi-Role RBAC empowers employees to fulfill multiple operational functions.'}
        </div>
      </div>
    </div>
  );
};
