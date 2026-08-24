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
  Sparkles
} from 'lucide-react';
import { SaasRole } from '../../types/traccar';
import { useApp } from '../../context/AppContext';

interface RoleSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoleSwitcherModal: React.FC<RoleSwitcherModalProps> = ({
  isOpen,
  onClose
}) => {
  const { currentRole, setCurrentRole, language, setActiveTab } = useApp();

  if (!isOpen) return null;

  const roles: { 
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
      id: 'super_admin',
      titleBn: 'সুপার অ্যাডমিন ড্যাশবোর্ড (Super Admin SaaS)',
      titleEn: 'Super Admin Control Center',
      descBn: 'সাবস্ক্রিপশন প্ল্যান, রেভিনিউ, ইউজার ডাটা ও ১-ক্লিকে ডেমো ডাটা ক্লিন।',
      descEn: 'Subscription plans, MRR revenue, tenant management & 1-click demo purge.',
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
      descBn: 'নতুন কাস্টমার অনবোর্ডিং, ট্র্যাকার IMEI ও সিম সেলস, কমিশন ট্র্যাকার।',
      descEn: 'New customer onboarding, tracker IMEI/SIM assignment, commission ledger.',
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
      descBn: 'জিপিএস ওয়্যারিং টেস্ট (Power, ACC, Relay Cutoff), স্যাটেলাইট চেকলিস্ট।',
      descEn: 'GPS wiring tester (Power, ACC, Relay cut), satellite fix checklist & tickets.',
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
      descBn: 'সাপোর্ট টিকিট সমাধান, রিফান্ড ম্যানেজমেন্ট, রিমোট টেলিম্যাটিক্স ডায়াগনস্টিক।',
      descEn: 'Support ticket resolution, refund desk, remote telematics health diagnostics.',
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

  const handleSelectRole = (roleItem: typeof roles[0]) => {
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
                <span>{language === 'bn' ? 'SaaS মাল্টি-রোল পোর্টাল সুইচ' : 'Multi-Role SaaS Switcher'}</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded-full border border-amber-500/30">Enterprise</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'যেকোনো অপারেশনাল টিমের ইন্টারফেসে তাৎক্ষণিক প্রবেশ করুন' : 'Instant access to specialized enterprise team portals'}
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
          {roles.map((r) => {
            const isCurrent = currentRole === r.id;
            const Icon = r.icon;
            return (
              <button
                key={r.id}
                onClick={() => handleSelectRole(r)}
                className={`w-full p-3 rounded-2xl border text-left flex items-start space-x-3 transition active:scale-[0.98] ${
                  isCurrent 
                    ? `${r.bg} ${r.border} shadow-lg ring-1 ring-white/20` 
                    : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl ${r.bg} border ${r.border} flex items-center justify-center ${r.color} shrink-0 mt-0.5`}>
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-100">
                      {language === 'bn' ? r.titleBn : r.titleEn}
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
            ? '💡 এই একই সিস্টেমে আপনার সমস্ত সেলস, টেকনিশিয়ান ও রেসকিউ টিম কাজ করতে পারবে।'
            : '💡 Unified Role-Based Access Control enables all internal teams to operate seamlessly.'}
        </div>
      </div>
    </div>
  );
};
