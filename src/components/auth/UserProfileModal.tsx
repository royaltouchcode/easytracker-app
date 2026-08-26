import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  X, 
  CreditCard, 
  Calendar, 
  ShieldCheck, 
  KeyRound, 
  LogOut, 
  Phone, 
  MessageSquare, 
  ExternalLink,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  RefreshCcw,
  FileText,
  Briefcase,
  Wrench,
  Headphones,
  Flame,
  Building2,
  MapPin,
  Smartphone,
  Check,
  ChevronRight,
  Receipt,
  Layers,
  Crown,
  DollarSign,
  TrendingUp,
  Plus,
  Gift,
  Copy,
  ShoppingBag,
  Bus,
  Users
} from 'lucide-react';
import { getAppConfig } from '../../config/appConfig';
import { RenewSubscriptionModal } from '../subscription/RenewSubscriptionModal';
import { CancelSubscriptionModal } from '../subscription/CancelSubscriptionModal';
import { ResetPinModal } from '../commands/ResetPinModal';
import { PrivacyPolicyModal } from '../compliance/PrivacyPolicyModal';
import { RefundPolicyModal } from '../compliance/RefundPolicyModal';
import { CustomerWarrantyModal } from '../warranty/CustomerWarrantyModal';
import { CustomerSupportModal } from '../support/CustomerSupportModal';
import { PaidServiceBookingModal } from '../support/PaidServiceBookingModal';
import { UniversalSaleModal } from '../saas/UniversalSaleModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    logout, 
    devices, 
    selectedDevice, 
    language, 
    currentRole, 
    approvedPartners,
    setActiveTab,
    setCurrentRole,
    getMyCommissionSummary
  } = useApp();

  const appConfig = getAppConfig();
  
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const [isPaidServiceOpen, setIsPaidServiceOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  const [isCancelled, setIsCancelled] = useState(() => {
    return localStorage.getItem(`gps_subscription_cancelled_${selectedDevice?.id}`) === 'true';
  });

  const commSummary = (typeof getMyCommissionSummary === 'function') 
    ? (getMyCommissionSummary() || { totalSold: 0, totalEarned: 0, pendingPayout: 0, paidOut: 0, myCommissions: [] })
    : { totalSold: 0, totalEarned: 0, pendingPayout: 0, paidOut: 0, myCommissions: [] };

  const partnerProfile = (approvedPartners || []).find(p => 
    (user?.partnerId && p.partnerId === user.partnerId) || 
    (user?.email && p.assignedUsername?.toLowerCase() === user.email.toLowerCase()) ||
    (user?.email && p.phone === user.email)
  );

  if (!isOpen) return null;

  // Role Metadata for Staff / Partner
  const getRoleHeaderInfo = () => {
    const isStaffUser = Boolean(
      user?.email?.includes('fleetstaff') || 
      user?.role === 'supervisor' || 
      user?.role === 'driver' || 
      (user as any)?.assigned ||
      /^[0-9\-\+]+@/.test(user?.email || '')
    );
    const isDriverStaff = isStaffUser && (user?.role === 'driver' || user?.name?.includes('কুদ্দুস') || (user as any)?.assigned?.includes('ঢাকা মেট্রো-ব'));

    if (isStaffUser) {
      return {
        titleBn: isDriverStaff ? 'ফ্লিট বাস চালক (Driver Sub-User)' : 'কাউন্টার লাইনম্যান / সুপারভাইজার (Staff Sub-User)',
        titleEn: isDriverStaff ? 'Fleet Driver Sub-User' : 'Counter Supervisor Sub-User',
        icon: isDriverStaff ? Bus : Users,
        color: isDriverStaff ? 'from-emerald-600 to-teal-700' : 'from-cyan-600 to-blue-700',
        badgeColor: isDriverStaff ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
      };
    }

    switch (currentRole) {
      case 'partner':
        return {
          titleBn: 'অথোরাইজড ফ্র্যাঞ্চাইজি পার্টনার',
          titleEn: 'Authorized Franchise Partner',
          icon: Building2,
          color: 'from-purple-600 to-indigo-600',
          badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40'
        };
      case 'sales':
        return {
          titleBn: 'সেলস ও অনবোর্ডিং এক্সিকিউটিভ',
          titleEn: 'Sales & Onboarding Executive',
          icon: Briefcase,
          color: 'from-blue-600 to-indigo-600',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        };
      case 'technician':
        return {
          titleBn: 'ফিল্ড ওয়্যারিং ও টেকনিক্যাল ইঞ্জিনিয়ার',
          titleEn: 'Field Wiring & Technical Engineer',
          icon: Wrench,
          color: 'from-amber-600 to-orange-600',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'support':
        return {
          titleBn: 'কাস্টমার কেয়ার ও হেল্পডেস্ক স্পেশালিস্ট',
          titleEn: 'Customer Care & Support Specialist',
          icon: Headphones,
          color: 'from-sky-600 to-blue-600',
          badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40'
        };
      case 'rescue':
        return {
          titleBn: 'ইমার্জেন্সি রেসকিউ ও রিকভারি অফিসার',
          titleEn: 'Emergency Rescue & Recovery Officer',
          icon: Flame,
          color: 'from-rose-600 to-red-600',
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40'
        };
      case 'super_admin':
        return {
          titleBn: 'সুপার অ্যাডমিনিস্ট্রেটর',
          titleEn: 'Super Administrator',
          icon: Crown,
          color: 'from-amber-500 to-yellow-600',
          badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      default:
        return {
          titleBn: 'রেজিস্টার্ড ভেহিকেল ওনার',
          titleEn: 'Registered Vehicle Owner',
          icon: User,
          color: 'from-blue-600 to-cyan-600',
          badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/40'
        };
    }
  };

  const roleInfo = getRoleHeaderInfo();
  const RoleIcon = roleInfo.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl w-full max-w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${roleInfo.color} flex items-center justify-center text-white shadow-lg shrink-0`}>
              <RoleIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>{user?.name || 'User Account'}</span>
              </h3>
              <p className="text-[10.5px] text-slate-400 font-mono">
                {user?.email || 'user@easytracker.com'}
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

        {/* Modal Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto">
          
          {/* Active Operating Role Badge */}
          <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center space-x-2">
              <RoleIcon className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200">
                {language === 'bn' ? roleInfo.titleBn : roleInfo.titleEn}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${roleInfo.badgeColor}`}>
              {currentRole}
            </span>
          </div>

          {/* ========================================================================= */}
          {/* 1. BUSINESS PARTNER PROFILE CARD                                          */}
          {/* ========================================================================= */}
          {currentRole === 'partner' && (
            <div className="bg-gradient-to-br from-purple-950/70 via-slate-900 to-slate-900 border border-purple-500/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-purple-300">
                  <Building2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'ফ্র্যাঞ্চাইজি বিজনেস প্রোফাইল' : 'Franchise Partner Profile'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold text-[9.5px]">
                  {partnerProfile?.serviceTier === 'all_inclusive' ? '🌟 All-Inclusive' : '🏢 Dealer Network'}
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">পার্টনার আইডি:</span>
                  <span className="font-mono font-bold text-white">{partnerProfile?.partnerId || user?.partnerId || 'PRT-8801'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">৪,০৯৬ স্লট কোটা:</span>
                  <span className="font-mono font-bold text-indigo-400">{partnerProfile?.maxSlotQuota || 50} টি স্লট</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ফ্লোটিং ক্রেডিট লিমিট:</span>
                  <span className="font-mono font-bold text-rose-400">৳ {(partnerProfile?.floatingCreditLimit || 10000).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">দোকানের অবস্থান:</span>
                  <span className="font-bold text-emerald-300 truncate max-w-[150px]">{partnerProfile?.shopName || partnerProfile?.district || 'উত্তরা, ঢাকা'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">লোকেশন স্ট্যাটাস:</span>
                  <span className="text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>ভেরিফাইড</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('saas_partner');
                }}
                className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-purple-600/30 transition active:scale-95"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>পার্টনার ড্যাশবোর্ডে প্রবেশ করুন</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. SALES EXECUTIVE PROFILE CARD                                           */}
          {/* ========================================================================= */}
          {currentRole === 'sales' && (
            <div className="bg-gradient-to-br from-blue-950/70 via-slate-900 to-slate-900 border border-blue-500/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-blue-300">
                  <Briefcase className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">সেলস অনবোর্ডিং প্রোফাইল</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 font-extrabold text-[9.5px]">
                  ফিল্ড সেলস
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">কর্মরত শাখা / শপ:</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{user?.shopName || 'উত্তরা ফ্র্যাঞ্চাইজি হাব'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">অ্যাক্টিভেশন কমিশন:</span>
                  <span className="font-mono font-bold text-emerald-400">৳ ৫০০ / ডিভাইস</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">অনবোর্ড পারমিশন:</span>
                  <span className="text-emerald-400 font-bold">সক্রিয় (IMEI + SIM)</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('saas_sales');
                }}
                className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30 transition active:scale-95"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>সেলস পোর্টাল ওপেন করুন</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 3. FIELD TECHNICIAN PROFILE CARD                                          */}
          {/* ========================================================================= */}
          {currentRole === 'technician' && (
            <div className="bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-amber-300">
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">টেকনিশিয়ান সার্ভিস হাব</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[9.5px]">
                  সার্টিফাইড ইঞ্জিনিয়ার
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">সার্ভিস পয়েন্ট:</span>
                  <span className="font-bold text-white truncate max-w-[150px]">{user?.shopName || 'উত্তরা ওয়্যারিং সেন্টার'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ওয়্যারিং টেস্ট টুলস:</span>
                  <span className="text-emerald-400 font-bold">12V • ACC • Relay • GPS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ওয়ারেন্টি RMA হ্যান্ডলিং:</span>
                  <span className="text-sky-300 font-bold">সক্রিয়</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('saas_technician');
                }}
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/30 transition active:scale-95"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>টেকনিশিয়ান ওয়ার্ক-অর্ডার হাবে যান</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 4. CUSTOMER SUPPORT PROFILE CARD                                          */}
          {/* ========================================================================= */}
          {currentRole === 'support' && (
            <div className="bg-gradient-to-br from-sky-950/70 via-slate-900 to-slate-900 border border-sky-500/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-sky-300">
                  <Headphones className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">সাপোর্ট ও টিকিট কেয়ার</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 font-extrabold text-[9.5px]">
                  ২৪/৭ হেল্পডেস্ক
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">টিকিট ম্যানেজমেন্ট:</span>
                  <span className="text-emerald-400 font-bold">সক্রিয় ও লাইভ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">টেকনিশিয়ান ডিসপ্যাচ:</span>
                  <span className="text-sky-300 font-bold">অনুমোদিত</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">গড় সমাধান হার:</span>
                  <span className="font-mono text-emerald-400 font-bold">৯৮.৫%</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('saas_support');
                }}
                className="w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-sky-600/30 transition active:scale-95"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>সাপোর্ট টিকিট ডেস্কে যান</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 5. RESCUE SOS FORCE PROFILE CARD                                          */}
          {/* ========================================================================= */}
          {currentRole === 'rescue' && (
            <div className="bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-900 border border-rose-500/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-rose-300">
                  <Flame className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">রেসকিউ ও রিকভারি কমান্ড</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-extrabold text-[9.5px]">
                  ইমার্জেন্সি ফোর্স
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ইমার্জেন্সি ইঞ্জিন কাটঅফ:</span>
                  <span className="text-rose-400 font-bold">অনুমোদিত (Security Safe)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ইন্টারসেপ্ট ম্যাপ ট্র্যাকিং:</span>
                  <span className="text-emerald-400 font-bold">লাইভ সিঙ্ক</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('saas_rescue');
                }}
                className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-rose-600/30 transition active:scale-95"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>রেসকিউ কমান্ড সেন্টারে যান</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 6. SUPER ADMIN PROFILE CARD                                               */}
          {/* ========================================================================= */}
          {currentRole === 'super_admin' && (
            <div className="bg-gradient-to-br from-amber-950/70 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-amber-300">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">সুপার অ্যাডমিন কন্ট্রোল</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[9.5px]">
                  Master Control
                </span>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">ক্লাস্টার সার্ভার সিঙ্ক:</span>
                  <span className="text-emerald-400 font-bold">সক্রিয়</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">অনুমোদিত ফ্র্যাঞ্চাইজি:</span>
                  <span className="font-mono font-bold text-purple-300">{approvedPartners.length} টি</span>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveTab('saas_admin');
                }}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/30 transition active:scale-95"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>মাস্টার অ্যাডমিন প্যানেলে যান</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* 7. CUSTOMER / VEHICLE OWNER SUBSCRIPTION & BILLING CARD (HIDDEN FOR STAFF) */}
          {/* ========================================================================= */}
          {!Boolean(user?.email?.includes('fleetstaff') || user?.role === 'supervisor' || user?.role === 'driver' || (user as any)?.assigned || /^[0-9\-\+]+@/.test(user?.email || '')) && currentRole === 'customer' && (
            <div className="bg-gradient-to-br from-indigo-950/70 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-indigo-300">
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'সাবস্ক্রিপশন প্যাকেজ ও ফি' : 'Subscription Plan & Fee'}
                  </span>
                </div>
                {isCancelled ? (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-[9px]">
                    {language === 'bn' ? 'বাতিলকৃত (মেয়াদ চলমান)' : 'Cancelled (Active till expiry)'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-[9.5px] flex items-center space-x-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{language === 'bn' ? 'সক্রিয় (Active)' : 'Active'}</span>
                  </span>
                )}
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{language === 'bn' ? 'প্যাকেজ নাম:' : 'Plan Name:'}</span>
                  <span className="font-bold text-slate-100">লাইভ জিপিএস প্রিমিয়াম</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{language === 'bn' ? 'সাবস্ক্রিপশন রেট:' : 'Plan Rate:'}</span>
                  <span className="font-bold font-mono text-emerald-400 text-sm">৳ ৩৫০ / মাস <span className="text-[10px] text-slate-400 font-sans">(বাৎসরিক ৳ ৩,৫০০)</span></span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{language === 'bn' ? 'মেয়াদ উত্তীর্ণের তারিখ:' : 'Expiry Date:'}</span>
                  <span className="font-bold text-amber-300 font-mono">৩১ ডিসেম্বর ২০২৬</span>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">{language === 'bn' ? 'সংযুক্ত যানবাহন:' : 'Linked Vehicles:'}</span>
                  <span className="font-bold text-blue-300 font-mono">{devices.length} টি</span>
                </div>
              </div>

              {/* Action Buttons: Renew & Cancel */}
              <div className="space-y-1.5 pt-1">
                <button
                  onClick={() => setIsRenewOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{isCancelled ? (language === 'bn' ? '🔄 পুনরায় সাবস্ক্রাইব করুন' : '🔄 Resubscribe Plan') : (language === 'bn' ? '💳 সাবস্ক্রিপশন রিনিউ করুন (Renew)' : '💳 Renew Subscription')}</span>
                </button>

                {!isCancelled && (
                  <button
                    onClick={() => setIsCancelOpen(true)}
                    className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-950/30 border border-slate-700 hover:border-rose-500/40 text-slate-400 hover:text-rose-300 font-bold text-[10.5px] flex items-center justify-center space-x-1.5 transition active:scale-95"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'সাবস্ক্রিপশন বাতিল করুন (Cancel)' : 'Cancel Subscription'}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Customer Warranty & RMA Claims Card (Only for Customer role) */}
          {currentRole === 'customer' && selectedDevice && (
            <div className="bg-slate-800/60 border border-emerald-500/40 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-emerald-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold">
                    {language === 'bn' ? 'ডিভাইস ওয়ারেন্টি ও ক্লেইম হাব' : 'Device Warranty & RMA'}
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700">
                  ১ বছর কাভারেজ
                </span>
              </div>

              <button
                onClick={() => setIsWarrantyOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'ওয়ারেন্টি স্ট্যাটাস ও ক্লেইম করুন' : 'View Warranty & Claim RMA'}</span>
              </button>
            </div>
          )}

          {/* Customer Support & Helpdesk Tickets Card (Only for Customer role) */}
          {currentRole === 'customer' && (
            <div className="bg-slate-800/60 border border-sky-500/40 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-sky-300">
                  <Headphones className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold">
                    {language === 'bn' ? 'কাস্টমার সাপোর্ট ও হেল্পডেস্ক হাব' : 'Customer Support & Helpdesk'}
                  </span>
                </div>
                <span className="text-[9.5px] font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded-full border border-sky-700">
                  ২৪/৭ সাপোর্ট
                </span>
              </div>

              <button
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full py-2 px-3 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/50 text-sky-300 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-sm"
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'সাপোর্ট টিকিট খুলুন বা স্ট্যাটাস দেখুন' : 'Open Ticket / View Status'}</span>
              </button>
            </div>
          )}

          {/* Customer Referral & Cashback Rewards Hub (Only for Customer role) */}
          {currentRole === 'customer' ? (
            <div className="bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/50 rounded-2xl p-3.5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-purple-300">
                  <Gift className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'রেফারেল ও ক্যাশব্যাক হাব' : 'Referral & Cashback Hub'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-extrabold text-[9.5px]">
                  🎁 ৳১০০ ক্যাশব্যাক
                </span>
              </div>

              {/* Referral Code & Copy Box */}
              <div className="bg-slate-950/90 border border-purple-500/40 rounded-xl p-2.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-semibold">আপনার ইউনিক রেফারেল কোড:</span>
                  <span className="text-xs font-mono font-black text-purple-300 tracking-wider">
                    {`EASY-${(selectedDevice?.id || 1).toString().padStart(4, '0')}`}
                  </span>
                </div>

                <div className="flex space-x-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const code = `EASY-${(selectedDevice?.id || 1).toString().padStart(4, '0')}`;
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(code);
                        alert(`✅ রেফারেল কোড "${code}" কপি হয়েছে!`);
                      }
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-600 text-white font-bold text-[10.5px] flex items-center justify-center space-x-1 transition active:scale-95 shadow-sm"
                  >
                    <Copy className="w-3 h-3" />
                    <span>কোড কপি</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const code = `EASY-${(selectedDevice?.id || 1).toString().padStart(4, '0')}`;
                      const base = appConfig.referralBaseUrl || appConfig.website || (typeof window !== 'undefined' ? window.location.origin : 'https://easytracker.net');
                      const link = `${base.replace(/\/$/, '')}/?ref=${code}`;
                      if (typeof navigator !== 'undefined' && navigator.clipboard) {
                        navigator.clipboard.writeText(link);
                        alert(`🔗 ডায়নামিক রেফারেল লিংক কপি হয়েছে:\n${link}`);
                      }
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-bold text-[10.5px] flex items-center justify-center space-x-1 transition active:scale-95 shadow-sm"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>লিংক কপি</span>
                  </button>
                </div>
              </div>

              {/* Live Referral Stats */}
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">মোট রেফারেল</span>
                  <span className="text-xs font-mono font-black text-white mt-0.5 block">৩ জন</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">অর্জিত ক্যাশব্যাক</span>
                  <span className="text-xs font-mono font-black text-emerald-400 mt-0.5 block">৳৩০০</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
                  <span className="text-[9px] text-slate-400 block">ফ্রি সাবস্ক্রিপশন</span>
                  <span className="text-xs font-mono font-black text-purple-400 mt-0.5 block">৩ মাস</span>
                </div>
              </div>

              {/* 1-Click WhatsApp & Facebook Share */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => {
                    const code = `EASY-${(selectedDevice?.id || 1).toString().padStart(4, '0')}`;
                    const base = appConfig.referralBaseUrl || appConfig.website || (typeof window !== 'undefined' ? window.location.origin : 'https://easytracker.net');
                    const link = `${base.replace(/\/$/, '')}/?ref=${code}`;
                    const msg = `*🚗 EasyTracker GPS Tracker Special Offer!*\n\nআমার ডায়নামিক রেফারেল লিংক ব্যবহার করে নতুন ট্র্যাকার বা সাবস্ক্রিপশন কিনলেই পাচ্ছেন ৳১০০ নগদ ছাড় ও ফ্রি ডোরস্টেপ ইনস্টলেশন!\n\nঅর্ডার করতে ভিজিট করুন: ${link}`;
                    const waUrl = `https://wa.me/?text=${encodeURIComponent(msg)}`;
                    if (typeof window !== 'undefined') window.open(waUrl, '_blank');
                  }}
                  className="py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-emerald-600/30 transition active:scale-95"
                >
                  <span>💬 হোয়াটসঅ্যাপ</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const code = `EASY-${(selectedDevice?.id || 1).toString().padStart(4, '0')}`;
                    const base = appConfig.referralBaseUrl || appConfig.website || (typeof window !== 'undefined' ? window.location.origin : 'https://easytracker.net');
                    const link = `${base.replace(/\/$/, '')}/?ref=${code}`;
                    const quote = `🚗 EasyTracker GPS Tracker Special Offer! আমার রেফারেল লিংক থেকে নতুন ট্র্যাকার বা সাবস্ক্রিপশন নিলেই পাচ্ছেন ৳১০০ নগদ ছাড়!`;
                    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(quote)}`;
                    if (typeof window !== 'undefined') window.open(fbUrl, '_blank');
                  }}
                  className="py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/30 transition active:scale-95"
                >
                  <span>🌐 ফেসবুক শেয়ার</span>
                </button>
              </div>

              {/* 3-Way Cashback Redemption Options */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 space-y-1.5">
                <div className="text-[10px] font-bold text-slate-300 flex items-center justify-between">
                  <span>💰 ক্যাশব্যাক রিডিম / ব্যবহারের উপায়:</span>
                  <span className="text-[9.5px] text-emerald-400 font-bold">ব্যালেন্স: ৳৩০০</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      alert('🔄 আপনার ৳৩০০ ক্যাশব্যাক পরবর্তী সাবস্ক্রিপশন রিনিউয়ালে সফলভাবে অ্যাডজাস্ট করা হয়েছে!');
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-emerald-500/50 text-left transition active:scale-95 space-y-0.5"
                  >
                    <div className="flex items-center space-x-1 text-emerald-400 text-[9.5px] font-extrabold">
                      <CreditCard className="w-2.5 h-2.5" />
                      <span>রিনিউয়াল</span>
                    </div>
                    <p className="text-[8px] text-slate-400 leading-tight">বিলে ছাড়</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      window.location.hash = '#store';
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-purple-500/50 text-left transition active:scale-95 space-y-0.5"
                  >
                    <div className="flex items-center space-x-1 text-purple-400 text-[9.5px] font-extrabold">
                      <ShoppingBag className="w-2.5 h-2.5" />
                      <span>নতুন ট্র্যাকার</span>
                    </div>
                    <p className="text-[8px] text-slate-400 leading-tight">স্টোরে ডিসকাউন্ট</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      alert('💸 বিকাশ/নগদে ৳৩০০ ক্যাশআউট রিকোয়েস্ট গ্রহণ করা হয়েছে! ২৪ ঘণ্টার মধ্যে আপনার নম্বরে পাঠানো হবে।');
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-amber-500/50 text-left transition active:scale-95 space-y-0.5"
                  >
                    <div className="flex items-center space-x-1 text-amber-400 text-[9.5px] font-extrabold">
                      <DollarSign className="w-2.5 h-2.5" />
                      <span>ক্যাশআউট</span>
                    </div>
                    <p className="text-[8px] text-slate-400 leading-tight">বিকাশ/নগদ</p>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Universal Sales & Staff Commission Wallet Card (For Sales / Staff Roles Only) */
            <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/70 border border-emerald-500/40 rounded-2xl p-3.5 shadow-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 text-emerald-300">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'মাই সেলস ও কমিশন ওয়ালেট' : 'My Sales & Commission Wallet'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-extrabold text-[9.5px]">
                  ৳ ৫০০ / ডিভাইস
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">মোট সেলকৃত ডিভাইস:</span>
                  <span className="text-sm font-mono font-black text-white">{commSummary.totalSold} টি</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">অর্জিত কমিশন ব্যালেন্স:</span>
                  <span className="text-sm font-mono font-black text-emerald-400">৳ {commSummary.totalEarned.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex space-x-2 pt-0.5">
                <button
                  onClick={() => setIsSaleModalOpen(true)}
                  className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md shadow-emerald-600/20 transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন ডিভাইস সেল করুন</span>
                </button>

                <button
                  onClick={() => {
                    alert(`💰 আপনার ৳${commSummary.pendingPayout} কমিশন উত্তোলনের রিকোয়েস্ট গ্রহণ করা হয়েছে। আগামী কর্মদিবসে বিকাশ/নগদে পাঠানো হবে।`);
                  }}
                  disabled={commSummary.pendingPayout <= 0}
                  className={`py-2 px-2.5 rounded-xl border text-[11px] font-bold transition flex items-center justify-center space-x-1 ${
                    commSummary.pendingPayout > 0 
                      ? 'bg-slate-800 hover:bg-slate-750 text-emerald-300 border-slate-700 active:scale-95' 
                      : 'bg-slate-900 text-slate-500 border-slate-800 cursor-not-allowed'
                  }`}
                >
                  <span>উইথড্র</span>
                </button>
              </div>
            </div>
          )}

          {/* Security Command PIN (Available for All Roles) */}
          <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-3 space-y-2">
            <div className="flex items-center space-x-1.5 text-slate-300">
              <KeyRound className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold">
                {language === 'bn' ? 'সিকিউরিটি কমান্ড পিন (Command PIN)' : 'Security Command PIN'}
              </span>
            </div>

            <button
              onClick={() => setIsResetPinOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-600 text-amber-300 font-bold text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'পিন পরিবর্তন বা রিসেট করুন' : 'Change or Reset PIN'}</span>
            </button>
          </div>

          {/* Direct Support Contacts & Logout */}
          <div className="space-y-1.5 pt-1">
            <a
              href={`tel:${appConfig.supportPhone}`}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center space-x-2 transition"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'bn' ? `সেন্ট্রাল হেল্পলাইন (${appConfig.supportPhone})` : `Central Support (${appConfig.supportPhone})`}</span>
            </a>

            <button
              onClick={() => {
                onClose();
                logout();
              }}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>{language === 'bn' ? 'লগআউট করুন (Logout)' : 'Logout'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Sub-Modals */}
      <RenewSubscriptionModal
        isOpen={isRenewOpen}
        onClose={() => setIsRenewOpen(false)}
        onSuccess={() => {
          setIsRenewOpen(false);
          setIsCancelled(false);
          if (selectedDevice) {
            localStorage.removeItem(`gps_subscription_cancelled_${selectedDevice.id}`);
          }
        }}
      />

      <CancelSubscriptionModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onSuccess={() => {
          setIsCancelOpen(false);
          setIsCancelled(true);
        }}
      />

      <ResetPinModal
        isOpen={isResetPinOpen}
        onClose={() => setIsResetPinOpen(false)}
        selectedDevice={selectedDevice || devices[0]}
        onSuccess={() => setIsResetPinOpen(false)}
      />

      <PrivacyPolicyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        language={language}
      />

      <RefundPolicyModal
        isOpen={isRefundOpen}
        onClose={() => setIsRefundOpen(false)}
        language={language}
      />

      <CustomerWarrantyModal
        isOpen={isWarrantyOpen}
        onClose={() => setIsWarrantyOpen(false)}
      />

      <CustomerSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      <PaidServiceBookingModal
        isOpen={isPaidServiceOpen}
        onClose={() => setIsPaidServiceOpen(false)}
      />

      <UniversalSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />
    </div>
  );
};
