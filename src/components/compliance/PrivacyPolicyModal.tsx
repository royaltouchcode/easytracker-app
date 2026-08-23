import React from 'react';
import { X, ShieldCheck, Lock, MapPin, Trash2, Mail, ExternalLink, Globe, Clock, KeyRound, Cloud } from 'lucide-react';
import { getAppConfig } from '../../config/appConfig';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'bn';
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, language = 'bn' }) => {
  if (!isOpen) return null;

  const appConfig = getAppConfig();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-100">
                {language === 'bn' ? 'প্রাইভেসী পলিসি ও ডাটা নীতিমালা' : 'Privacy Policy & Terms'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {appConfig.appDisplayName} v{appConfig.version} • {appConfig.publisher}
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

        {/* Policy Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed flex-1">
          {/* Section 1: Publisher Info */}
          <div className="p-3 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-1">
            <div className="font-bold text-slate-100 flex items-center justify-between">
              <span>{appConfig.appDisplayName} Platform</span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800/50">
                {appConfig.packageId}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Developed & Managed by <strong className="text-slate-200">{appConfig.publisher}</strong> ({appConfig.publisherDomain}).
            </p>
          </div>

          {/* Section 2: Location Data Policy */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-100 flex items-center space-x-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'bn' ? '১. লোকেশন ডাটা ও ব্যাকগ্রাউন্ড ট্র্যাকিং' : '1. Location Data Collection'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'bn'
                ? 'EasyTracker আপনার যানবাহন ট্র্যাক করা এবং দূরত্ব ও দিকনির্দেশনা প্রদর্শনের জন্য লাইভ জিপিএস লোকেশন ডেটা সংগ্রহ করে। এই ডেটা সম্পূর্ণ এনক্রিপ্টেড এবং কেবল মাত্র আপনার অনুমোদিত অ্যাকাউন্টের অধীনে সুরক্ষিত থাকে।'
                : 'EasyTracker collects GPS location data exclusively to provide real-time vehicle monitoring, geofence alerts, and turn-by-turn navigation distance calculation.'}
            </p>
          </div>

          {/* Section 3: Cloud Persistence & User Profile Backup */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-100 flex items-center space-x-1.5 text-xs">
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>{language === 'bn' ? '২. ক্লাউড ব্যাকআপ ও ডাটা পারসিস্টেন্স' : '2. Cloud Sync & Data Persistence'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'bn'
                ? 'আপনার গাড়ির ক্যালিব্রেটেড ওডোমিটার, ফুয়েল রিফিল লগ, ইঞ্জিন অয়েল মেইনটেন্যান্স ও সার্ভিসিং হিস্ট্রি ব্যবহারকারীর ক্লাউড অ্যাকাউন্টে এনক্রিপ্টেড অবস্থায় সংরক্ষিত থাকে। ফলে অ্যাপ আনইনস্টল করলেও পরবর্তীতে পুনরায় লগইন করলে সমস্ত ডাটা ফিরে পাওয়া যাবে।'
                : 'Calibrated odometer readings, fuel logs, and service history are synced to the secure cloud account. Reinstalling or switching devices restores all fleet data.'}
            </p>
          </div>

          {/* Section 4: 6-Month Inactive Subscription Auto-Purge Policy */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center space-x-1.5 text-xs">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? '৩. ৬ মাসের ইনঅ্যাক্টিভ অটো-পার্জ পলিসি' : '3. 6-Month Inactivity Data Purge'}</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {language === 'bn'
                ? 'যদি কোনো ব্যবহারকারী সাবস্ক্রিপশন বাতিল বা মেয়াদ শেষ হওয়ার পর টানা ৬ (ছয়) মাস নতুন করে রিনিউ না করেন, তবে গ্রাহকের গোপনীয়তা রক্ষা এবং অপ্রয়োজনীয় ডাটা ধারণ রোধে তার সমস্ত পুরনো রুট ও হিস্ট্রি সার্ভার থেকে স্বয়ংক্রিয়ভাবে স্থায়ীভাবে মুছে ফেলা (Auto-Purge) হবে।'
                : 'If an account remains unsubscribed and inactive for 6 consecutive months without renewal, all historical GPS traces and logs are automatically and permanently purged from server storage.'}
            </p>
          </div>

          {/* Section 5: Account Deletion (PIN Mandatory & 3-Day Grace Period) */}
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl space-y-1.5">
            <div className="font-bold text-rose-300 flex items-center space-x-1.5 text-xs">
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'bn' ? '৪. পিন ভেরিফিকেশন সহ ৩ দিনের ডাটা ডিলিটেশন' : '4. PIN-Secured 3-Day Data Deletion'}</span>
            </div>
            <p className="text-[11px] text-slate-300">
              {language === 'bn'
                ? 'ব্যবহারকারী যেকোনো সময় সেটিংস থেকে তার সম্পূর্ণ অ্যাকাউন্ট ও সমস্ত ট্র্যাকিং ডেটা মুছে ফেলার অনুরোধ করতে পারেন। অননুমোদিত ডিলিট রোধে ৪-ডিজিট মাস্টার সিকিউরিটি পিন দেওয়া বাধ্যতামূলক। কনফার্ম করার পর সর্বোচ্চ ৩ কার্যদিবসের (৭২ ঘণ্টা) মধ্যে সমস্ত ডেটা স্থায়ীভাবে মুছে ফেলা হবে।'
                : 'Users can request permanent deletion of their account and telemetry. Submitting a deletion request strictly requires 4-digit Master Security PIN verification. Data is permanently purged within 3 business days (72 hours).'}
            </p>
          </div>

          {/* Section 6: Contact & Support */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{appConfig.supportEmail}</span>
            </div>
            <a
              href={appConfig.website}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>{appConfig.publisherDomain}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition active:scale-95 shadow-lg shadow-blue-600/20"
          >
            {language === 'bn' ? 'আমি সমস্ত শর্ত পড়েছি ও সম্মতি দিচ্ছি' : 'I Accept the Privacy Policy'}
          </button>
        </div>
      </div>
    </div>
  );
};
