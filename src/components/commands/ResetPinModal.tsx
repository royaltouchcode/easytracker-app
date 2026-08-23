import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  KeyRound, 
  Lock, 
  ShieldCheck, 
  Headphones, 
  Phone, 
  Mail, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Copy,
  Check
} from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface ResetPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPinResetSuccess: (newPin: string) => void;
}

export const ResetPinModal: React.FC<ResetPinModalProps> = ({
  isOpen,
  onClose,
  onPinResetSuccess
}) => {
  const { user, selectedDevice, updateDeviceProfile, login, language } = useApp();

  const [activeTab, setActiveTab] = useState<'way1_password' | 'way3_admin'>('way1_password');

  // Way 1 State: Password verification & new PIN
  const [accountPassword, setAccountPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Way 3 State: Copied IMEI indicator
  const [copiedImei, setCopiedImei] = useState(false);

  if (!isOpen) return null;

  const handleCopyImei = () => {
    if (selectedDevice?.uniqueId) {
      navigator.clipboard.writeText(selectedDevice.uniqueId);
      setCopiedImei(true);
      setTimeout(() => setCopiedImei(false), 2000);
    }
  };

  const handleResetViaPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setLoading(false);
      setErrorMsg(language === 'bn' ? 'নতুন পিন অবশ্যই ৪ ডিজিটের সংখ্যা হতে হবে' : 'PIN must be exactly 4 digits');
      return;
    }

    if (newPin !== confirmPin) {
      setLoading(false);
      setErrorMsg(language === 'bn' ? 'নতুন পিন দু’টি মিলছে না' : 'New PINs do not match');
      return;
    }

    // Verify account password using login verification
    const userEmail = user?.email || 'demo@traccar.org';
    const verifyRes = await login(userEmail, accountPassword);

    setLoading(false);

    if (!verifyRes.success) {
      setErrorMsg(language === 'bn' ? 'অ্যাকাউন্টের পাসওয়ার্ড ভুল হয়েছে। সঠিক পাসওয়ার্ড দিন।' : 'Incorrect account password. Please enter correct password.');
      return;
    }

    // Password verified! Save new PIN
    if (selectedDevice) {
      updateDeviceProfile(selectedDevice.id, {
        attributes: {
          ...selectedDevice.attributes,
          commandPin: newPin
        }
      });
    }

    localStorage.setItem('gps_master_command_pin', newPin);
    setSuccessMsg(language === 'bn' ? '✅ নতুন পিন সফলভাবে সংরক্ষিত হয়েছে!' : '✅ New PIN saved successfully!');

    setTimeout(() => {
      onPinResetSuccess(newPin);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 select-none animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                {language === 'bn' ? 'সিকিউরিটি পিন রিসেট ও রিকভারি' : 'PIN Reset & Recovery'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {selectedDevice?.name || 'My Vehicle'}
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

        {/* 2-Way Tab Switcher */}
        <div className="flex space-x-1.5 bg-slate-800/80 p-1 rounded-2xl border border-slate-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('way1_password');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
              activeTab === 'way1_password'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'পাসওয়ার্ড দিয়ে রিসেট' : 'Via Password'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('way3_admin');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1 ${
              activeTab === 'way3_admin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'এডমিন সাপোর্ট সাহায্য' : 'Admin Support'}</span>
          </button>
        </div>

        {/* Tab 1 Content: Reset via Account Password */}
        {activeTab === 'way1_password' ? (
          <form onSubmit={handleResetViaPassword} className="space-y-3">
            <p className="text-[11px] text-slate-400 leading-tight">
              {language === 'bn'
                ? 'আপনার EasyTracker অ্যাকাউন্টের মূল পাসওয়ার্ড দিয়ে পরিচয় নিশ্চিত করুন এবং নতুন ৪-ডিজিট পিন সেট করুন।'
                : 'Verify your account login password to set a new 4-digit Master Security PIN.'}
            </p>

            {/* Account Password */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {language === 'bn' ? 'অ্যাকাউন্ট লগইন পাসওয়ার্ড' : 'Account Login Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-blue-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={accountPassword}
                  onChange={(e) => setAccountPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-9 pr-9 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New 4-Digit PIN */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {language === 'bn' ? 'নতুন ৪-ডিজিট পিন' : 'New 4-Digit PIN'}
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-2.5 text-amber-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={4}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-9 pr-9 py-2 text-center text-sm font-mono font-bold text-amber-300 tracking-widest focus:outline-none focus:border-amber-500 shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New 4-Digit PIN */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                {language === 'bn' ? 'নতুন পিনটি পুনরায় লিখুন' : 'Confirm New 4-Digit PIN'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-2.5 text-emerald-400" />
                <input
                  type={showPin ? 'text' : 'password'}
                  maxLength={4}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-9 pr-3 py-2 text-center text-sm font-mono font-bold text-emerald-300 tracking-widest focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold text-center">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? (language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...') : (language === 'bn' ? 'পাসওয়ার্ড যাচাই ও পিন পরিবর্তন' : 'Verify & Update PIN')}</span>
            </button>
          </form>
        ) : (
          /* Tab 2 Content: Admin & Customer Support Assisted Reset */
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400 leading-tight">
              {language === 'bn'
                ? 'যদি আপনি পাসওয়ার্ডও ভুলে যান, তবে গাড়ির মালিকানা ও IMEI নম্বর দিয়ে আমাদের এডমিন হেল্পলাইনে যোগাযোগ করে পিন রিসেট করে নিতে পারেন।'
                : 'If you forgot your password, contact our 24/7 admin support with your vehicle IMEI for identity verification.'}
            </p>

            {/* Vehicle & IMEI Verification Card */}
            <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{language === 'bn' ? 'যানবাহনের নাম' : 'Vehicle'}:</span>
                <span className="font-bold text-slate-100">{selectedDevice?.name}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">{language === 'bn' ? 'ট্র্যাকার IMEI / ID' : 'Tracker IMEI'}:</span>
                <div className="flex items-center space-x-1 font-mono font-bold text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
                  <span>{selectedDevice?.uniqueId}</span>
                  <button
                    type="button"
                    onClick={handleCopyImei}
                    className="p-1 hover:text-white text-slate-400 transition"
                    title="Copy IMEI"
                  >
                    {copiedImei ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Direct Contact Channels */}
            <div className="space-y-2 pt-1">
              <a
                href={`tel:${APP_CONFIG.supportPhone}`}
                className="w-full py-2.5 px-3 rounded-2xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-2 transition"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{language === 'bn' ? `সরাসরি ফোন কল (${APP_CONFIG.supportPhone})` : `Call Helpline (${APP_CONFIG.supportPhone})`}</span>
              </a>

              <a
                href={`https://wa.me/${APP_CONFIG.supportWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello EasyTracker Support, I need to reset Command PIN for Vehicle: ${selectedDevice?.name}, IMEI: ${selectedDevice?.uniqueId}`)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20 transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে এডমিন মেসেজ পাঠান' : 'Chat with Admin on WhatsApp'}</span>
              </a>

              <a
                href={`mailto:${APP_CONFIG.supportEmail}?subject=PIN Reset Request for ${selectedDevice?.uniqueId}&body=Vehicle Name: ${selectedDevice?.name}%0D%0AIMEI: ${selectedDevice?.uniqueId}%0D%0AAccount Email: ${user?.email}`}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center space-x-2 transition"
              >
                <Mail className="w-4 h-4 text-blue-400" />
                <span>{language === 'bn' ? 'সাপোর্ট ইমেইল পাঠান' : 'Send Support Email'}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
