import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Trash2, 
  AlertTriangle, 
  KeyRound, 
  Clock, 
  ShieldAlert, 
  CheckCircle2,
  Lock
} from 'lucide-react';

interface DataDeletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'bn';
}

export const DataDeletionModal: React.FC<DataDeletionModalProps> = ({
  isOpen,
  onClose,
  language = 'bn'
}) => {
  const { user, selectedDevice, logout } = useApp();

  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmitDeletion = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Security PIN Verification Gate
    const savedMasterPin = localStorage.getItem('gps_master_command_pin') || selectedDevice?.attributes?.commandPin || '1234';
    if (pin.trim() !== savedMasterPin) {
      setErrorMessage(language === 'bn' ? '❌ ভুল সিকিউরিটি পিন! সঠিক ৪-ডিজিট পিন দিন।' : '❌ Invalid Security PIN! Enter correct 4-digit PIN.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Record deletion request in admin telemetry stream
      try {
        const existingAlerts = JSON.parse(localStorage.getItem('gps_admin_notifications') || '[]');
        existingAlerts.unshift({
          id: 'del-req-' + Date.now(),
          type: 'account_data_deletion_requested',
          userEmail: user?.email,
          targetDeletionDate: new Date(Date.now() + 86400000 * 3).toISOString(),
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('gps_admin_notifications', JSON.stringify(existingAlerts));
        localStorage.setItem('gps_account_deletion_pending', 'true');
      } catch (e) {}

      setTimeout(() => {
        onClose();
        logout();
      }, 3500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border-2 border-rose-500/60 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Strong Red Alert Header */}
        <div className="flex items-center justify-between p-4 border-b border-rose-500/30 shrink-0 bg-rose-950/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-300 shadow-md">
              <ShieldAlert className="w-6 h-6 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-black text-sm text-rose-200">
                {language === 'bn' ? '⚠️ ডাটা ও অ্যাকাউন্ট ডিলিটেশন সতর্কতা' : '⚠️ Permanent Account Deletion Warning'}
              </h3>
              <p className="text-[10px] text-rose-300/80 font-mono">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-rose-900/40 text-rose-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {isSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center space-y-2.5">
              <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400 animate-bounce" />
              <div className="font-extrabold text-sm text-emerald-300">
                {language === 'bn' ? 'ডিলিটেশনের অনুরোধ সফলভাবে গ্রহণ করা হয়েছে' : 'Deletion Request Successfully Received'}
              </div>
              <p className="text-[11px] text-slate-300">
                {language === 'bn'
                  ? 'আপনার অনুরোধ অনুসারে আগামী ৩ কার্যদিবসের (৭২ ঘণ্টা) মধ্যে আপনার অ্যাকাউন্ট ও সমস্ত জিপিএস হিস্টোরি ডেটা স্থায়ীভাবে সার্ভার থেকে মুছে ফেলা হবে। লগআউট হচ্ছে...'
                  : 'Your account and all historical tracking data will be permanently wiped from the server within 3 business days (72 hours). Logging out...'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitDeletion} className="space-y-3.5">
              {/* Critical Warning Box */}
              <div className="p-3 bg-rose-950/50 border border-rose-500/40 rounded-2xl space-y-1.5">
                <span className="font-bold text-rose-300 block text-xs">
                  {language === 'bn' ? 'অনুগ্রহ করে সতর্কতার সাথে পড়ুন:' : 'Please Read Carefully:'}
                </span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-rose-200/90">
                  <li>{language === 'bn' ? 'সকল লাইভ জিপিএস রুট, প্লেব্যাক ও ট্রাভেল হিস্ট্রি স্থায়ীভাবে মুছে যাবে।' : 'All live GPS routes and travel logs will be permanently erased.'}</li>
                  <li>{language === 'bn' ? 'ফুয়েল রিফিল ও ইঞ্জিন অয়েল সার্ভিসিং রেকর্ড নষ্ট হবে।' : 'Fuel refill logs and servicing records will be wiped.'}</li>
                  <li>{language === 'bn' ? 'কনফার্ম করার ৩ কার্যদিবসের মধ্যে সমস্ত ডেটা স্থায়ীভাবে ডিলিট হবে।' : 'Data will be permanently purged within 3 business days.'}</li>
                </ul>
              </div>

              {/* Mandatory Security Master PIN Input */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center space-x-1">
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'bn' ? 'মাস্টার সিকিউরিটি পিন দিন (বাধ্যতামূলক):' : 'Enter 4-Digit Master PIN (Mandatory):'}</span>
                  </span>
                </label>

                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••"
                    className="w-full bg-slate-950 border-2 border-slate-700 focus:border-rose-500 rounded-2xl pl-10 pr-4 py-2.5 text-center font-mono font-black text-base tracking-widest text-rose-400 focus:outline-none"
                  />
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 font-bold text-xs text-center animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || pin.length < 4}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/40 transition active:scale-95 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'যাচাই করা হচ্ছে...' 
                      : (language === 'bn' ? 'পিন যাচাই করে ৩ দিনের মধ্যে ডিলিট রিকোয়েস্ট পাঠান' : 'Submit 3-Day Deletion Request')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  {language === 'bn' ? 'বাতিল করুন (ফিরে যান)' : 'Cancel & Go Back'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
