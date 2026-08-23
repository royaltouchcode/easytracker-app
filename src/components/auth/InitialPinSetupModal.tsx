import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

interface InitialPinSetupModalProps {
  isOpen: boolean;
  onComplete: (pin: string) => void;
}

export const InitialPinSetupModal: React.FC<InitialPinSetupModalProps> = ({ isOpen, onComplete }) => {
  const { selectedDevice, updateDeviceProfile, language } = useApp();

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      setErrorMsg(language === 'bn' ? 'পিন অবশ্যই ৪ ডিজিটের সংখ্যা হতে হবে (যেমন: 1234)' : 'PIN must be exactly 4 digits');
      return;
    }

    if (pin !== confirmPin) {
      setErrorMsg(language === 'bn' ? 'উভয় পিন মিলছে না, পুনরায় যাচাই করুন' : 'PINs do not match');
      return;
    }

    if (selectedDevice) {
      updateDeviceProfile(selectedDevice.id, {
        attributes: {
          ...selectedDevice.attributes,
          commandPin: pin
        }
      });
    }

    localStorage.setItem('gps_pin_initialized', 'true');
    localStorage.setItem('gps_master_command_pin', pin);

    setSuccessMsg(language === 'bn' ? '✅ মাস্টার সিকিউরিটি পিন সফলভাবে সংরক্ষিত হয়েছে!' : '✅ Master Security PIN saved successfully!');

    setTimeout(() => {
      onComplete(pin);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header Icon & Title */}
        <div className="text-center space-y-1.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-base font-black text-slate-100">
            {language === 'bn' ? 'কমান্ড সিকিউরিটি পিন সেট করুন' : 'Setup Command Security PIN'}
          </h2>
          <p className="text-xs text-slate-400">
            {selectedDevice?.name || 'My Vehicle'} • {language === 'bn' ? 'প্রথমবার সেটআপ বাধ্যতামূলক' : 'Mandatory First-Time Setup'}
          </p>
        </div>

        {/* High-Priority Security Warning Box */}
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1">
          <div className="flex items-center space-x-1.5 text-amber-400 font-extrabold text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{language === 'bn' ? 'অত্যন্ত জরুরি নিরাপত্তা নোটিশ' : 'Critical Security Notice'}</span>
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            {language === 'bn'
              ? 'আপনার গাড়ির ইঞ্জিন লক/আনলক, মাস্টার SOS নম্বর পরিবর্তন ও ট্র্যাকার কমান্ড পাঠানোর জন্য এই ৪-ডিজিট পিনটি আজীবন প্রয়োজন হবে। অনুগ্রহ করে পিনটি মুখস্থ রাখুন অথবা কোনো গোপন ও নিরাপদ স্থানে লিখে সংরক্ষণ করুন।'
              : 'This 4-digit PIN is required for Engine Cut/Resume, SOS Phone Configuration, and Device Commands. Memorize or record it in a safe secret location.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* New 4-Digit PIN */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {language === 'bn' ? 'নতুন ৪-ডিজিট সিকিউরিটি পিন লিখুন' : 'Enter New 4-Digit PIN'}
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-amber-400" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-10 pr-10 py-3 text-center text-lg font-mono font-black text-amber-300 tracking-widest focus:outline-none focus:border-amber-500 shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm 4-Digit PIN */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              {language === 'bn' ? 'পিনটি পুনরায় নিশ্চিত করুন (Confirm PIN)' : 'Confirm 4-Digit PIN'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-emerald-400" />
              <input
                type={showPin ? 'text' : 'password'}
                maxLength={4}
                required
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-10 pr-3 py-3 text-center text-lg font-mono font-black text-emerald-300 tracking-widest focus:outline-none focus:border-emerald-500 shadow-inner"
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
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-xl shadow-amber-600/30 flex items-center justify-center space-x-2 transition active:scale-[0.98]"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'bn' ? 'পিন সংরক্ষণ ও অ্যাপে প্রবেশ করুন' : 'Save PIN & Enter App'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
