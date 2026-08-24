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
  FileText
} from 'lucide-react';
import { getAppConfig } from '../../config/appConfig';
import { RenewSubscriptionModal } from '../subscription/RenewSubscriptionModal';
import { CancelSubscriptionModal } from '../subscription/CancelSubscriptionModal';
import { ResetPinModal } from '../commands/ResetPinModal';
import { PrivacyPolicyModal } from '../compliance/PrivacyPolicyModal';
import { RefundPolicyModal } from '../compliance/RefundPolicyModal';
import { CustomerWarrantyModal } from '../warranty/CustomerWarrantyModal';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, logout, devices, selectedDevice, language } = useApp();
  const appConfig = getAppConfig();
  
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isResetPinOpen, setIsResetPinOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isRefundOpen, setIsRefundOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);

  const [isCancelled, setIsCancelled] = useState(() => {
    return localStorage.getItem(`gps_subscription_cancelled_${selectedDevice?.id}`) === 'true';
  });

  // Show subscription card ONLY if user also has 'customer' role in their approvedRoles
  // (i.e. they are also a tracked GPS customer themselves, not just a staff member)
  const isAdmin = user?.administrator || user?.role === 'super_admin';
  const isCustomerUser = isAdmin || (user?.approvedRoles?.includes('customer') ?? false);

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-sm w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shadow-md">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">
                {user?.name || 'User Account'}
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
          
          {/* Subscription & Billing Card — only for users who are also customers */}
          {isCustomerUser && (
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

          {/* Device Warranty & RMA Claims Card (For Tracked Vehicle Customers) */}
          {isCustomerUser && selectedDevice && (
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



          {/* Direct Support Contacts */}
          <div className="space-y-1.5 pt-1">
            <a
              href={`tel:${appConfig.supportPhone}`}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center space-x-2 transition"
            >
              <Phone className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'bn' ? `হেল্পলাইনে কল করুন (${appConfig.supportPhone})` : `Call Support (${appConfig.supportPhone})`}</span>
            </a>

            {/* Logout Button */}
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
    </div>
  );
};
