import React from 'react';
import { X, RefreshCcw, ShieldCheck, DollarSign, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { getSubscriptionConfig } from '../../config/subscriptionPlans';
import { getAppConfig } from '../../config/appConfig';

interface RefundPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'bn';
}

export const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({ 
  isOpen, 
  onClose, 
  language = 'bn' 
}) => {
  if (!isOpen) return null;

  const config = getSubscriptionConfig();
  const appConfig = getAppConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <RefreshCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                {language === 'bn' ? 'রিফান্ড ও মানি-ব্যাক পলিসি' : 'Refund & Cancellation Policy'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {APP_CONFIG.appDisplayName} • {APP_CONFIG.publisher}
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

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto text-xs text-slate-300 leading-relaxed">
          {/* Key Highlights */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? '৩ দিনের মানি-ব্যাক' : '3-Day Guarantee'}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {language === 'bn' ? 'ত্রুটিতে ১০০% পূর্ণাঙ্গ রিফান্ড' : '100% money-back on technical fault'}
              </p>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <div className="font-bold text-blue-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'মেয়াদকালীন সুরক্ষা' : 'Active Till Expiry'}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {language === 'bn' ? 'বাতিল করলেও শেষ দিন পর্যন্ত সেবা চালু' : 'Service active till last paid day'}
              </p>
            </div>
          </div>

          {/* Full Policy Text */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 whitespace-pre-line font-normal text-slate-300 text-[11.5px] leading-relaxed">
            {language === 'bn' ? config.refundPolicyBn : config.refundPolicyEn}
          </div>

          {/* Contact Helpline */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/80 border border-slate-700">
            <div className="text-[11px] text-slate-300">
              <span className="font-bold text-slate-100 block">{language === 'bn' ? 'রিফান্ড সহায়তা টিম:' : 'Refund Desk:'}</span>
              <span>{appConfig.refundPhone || appConfig.supportPhone}</span>
            </div>
            <a
              href={`tel:${appConfig.refundPhone || appConfig.supportPhone}`}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center space-x-1 transition active:scale-95 shadow-md shadow-blue-600/30"
            >
              <Phone className="w-3 h-3" />
              <span>{language === 'bn' ? 'কল করুন' : 'Call'}</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition active:scale-95 shadow-lg shadow-emerald-600/20"
          >
            {language === 'bn' ? 'আমি রিফান্ড শর্তাবলী পড়েছি ও বুঝেছি' : 'I Understand the Refund Policy'}
          </button>
        </div>
      </div>
    </div>
  );
};
