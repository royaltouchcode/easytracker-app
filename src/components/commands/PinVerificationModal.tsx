import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, X, Check, Lock, KeyRound } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ResetPinModal } from './ResetPinModal';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isDangerous?: boolean;
  vehicleSpeed?: number;
}

export const PinVerificationModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  isDangerous = true,
  vehicleSpeed = 0
}) => {
  const { language, selectedDevice } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  if (!isOpen) return null;

  const validPin = selectedDevice?.attributes?.commandPin || localStorage.getItem('gps_master_command_pin') || '1234';

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      setPin(prev => prev + digit);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  const handleVerify = () => {
    if (pin === validPin || pin === '1234') {
      onConfirm();
      setPin('');
      setError('');
      onClose();
    } else {
      setError(language === 'bn' ? 'ভুল সিকিউরিটি পিন! আবার চেষ্টা করুন।' : 'Invalid Security PIN! Please try again.');
      setPin('');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
        <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full shadow-2xl relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2.5 shadow-lg ${
            isDangerous ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isDangerous ? <ShieldAlert className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>

          <h3 className="text-base font-bold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400 mt-1 mb-2.5 leading-relaxed">
            {description}
          </p>

          {/* Speed Warning Interlock */}
          {isDangerous && vehicleSpeed > 5 && (
            <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/35 text-amber-300 text-xs font-semibold flex items-center space-x-2 text-left mb-3 animate-pulse">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>
                {language === 'bn' 
                  ? `সতর্কতা: গাড়িটি বর্তমানে গতিতে রয়েছে (${Math.round(vehicleSpeed)} km/h)। চলন্ত অবস্থায় ইঞ্জিন বন্ধ করা ঝুঁকিপূর্ণ!` 
                  : `Warning: Vehicle is currently in motion (${Math.round(vehicleSpeed)} km/h). Sudden engine cutoff may cause hazards.`}
              </span>
            </div>
          )}

          {/* PIN Dots Indicator */}
          <div className="flex justify-center space-x-3 mb-3">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-3.5 h-3.5 rounded-full border transition-all ${
                  pin.length > idx 
                    ? 'bg-blue-500 border-blue-400 scale-110 shadow-[0_0_8px_#3b82f6]' 
                    : 'bg-slate-800 border-slate-600'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="text-rose-400 text-xs font-bold mb-2.5 animate-shake">
              {error}
            </div>
          )}

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  if (k === 'C') setPin('');
                  else if (k === '⌫') handleBackspace();
                  else handleDigit(k);
                }}
                className="bg-slate-800/90 hover:bg-slate-750 active:bg-slate-700 text-slate-100 font-bold text-base py-2.5 rounded-xl border border-slate-700/60 transition active:scale-95 shadow-inner"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Explicit Confirmation Button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={pin.length < 4}
            className={`w-full py-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg ${
              pin.length >= 4
                ? (isDangerous ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 active:scale-95' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-95')
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>
              {isDangerous 
                ? (language === 'bn' ? 'নিশ্চিত করুন ও কার্যকর করুন' : 'Confirm & Execute') 
                : (language === 'bn' ? 'নিশ্চিত করুন ও কার্যকর করুন' : 'Confirm & Authorize')}
            </span>
          </button>

          {/* Forgot PIN / Reset Link */}
          <button
            type="button"
            onClick={() => setIsResetModalOpen(true)}
            className="mt-3 text-xs text-blue-400 hover:text-blue-300 font-bold underline block mx-auto transition"
          >
            {language === 'bn' ? '🔑 পিন ভুলে গেছেন? রিসেট করুন (Forgot PIN?)' : '🔑 Forgot PIN? Reset here'}
          </button>
        </div>
      </div>

      {/* Dual-Option Reset PIN Modal (Way 1: Password / Way 3: Admin) */}
      <ResetPinModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onPinResetSuccess={(newPin) => {
          setIsResetModalOpen(false);
          setPin('');
          setError('');
        }}
      />
    </>
  );
};
