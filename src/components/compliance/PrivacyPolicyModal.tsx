import React from 'react';
import { X, ShieldCheck, Lock, MapPin, Trash2, Mail, ExternalLink, Globe } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'en' | 'bn';
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose, language }) => {
  if (!isOpen) return null;

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
                {language === 'bn' ? 'প্রাইভেসী পলিসি ও নিরাপত্তা শর্তাবলী' : 'Privacy Policy & Terms'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {APP_CONFIG.appDisplayName} v{APP_CONFIG.version} • {APP_CONFIG.publisher}
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
              <span>{APP_CONFIG.appDisplayName} Application</span>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-800/50">
                {APP_CONFIG.packageId}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Developed & Published by <strong className="text-slate-200">{APP_CONFIG.publisher}</strong> ({APP_CONFIG.publisherDomain}).
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
                ? 'EasyTracker আপনার যানবাহন ট্র্যাক করা এবং আপনার দূরত্ব ও দিকনির্দেশনা নির্ণয়ের জন্য লোকেশন ডেটা সংগ্রহ করে। এই ডেটা সম্পূর্ণ এনক্রিপ্টেড এবং কেবল মাত্র আপনার অনুমোদিত সার্ভারে সংরক্ষিত থাকে।'
                : 'EasyTracker collects GPS location data exclusively to provide real-time vehicle monitoring, geofence alerts, and turn-by-turn navigation distance calculation.'}
            </p>
          </div>

          {/* Section 3: Data Security */}
          <div className="space-y-1.5">
            <div className="font-bold text-slate-100 flex items-center space-x-1.5 text-xs">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'bn' ? '২. ডেটা নিরাপত্তা ও কমান্ড পিন' : '2. Data Security & Command Protection'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'bn'
                ? 'যেকোনো দূরবর্তী কমান্ড (ইঞ্জিন বন্ধ/চালু) প্রেরণের পূর্বে ৪-ডিজিট সিকিউরিটি পিন বাধ্যতামূলক। আপনার ডেটা কোনো তৃতীয় পক্ষের কাছে বিক্রি বা শেয়ার করা হয় না।'
                : 'All remote immobilizer commands require 4-digit security PIN verification. User credentials and fleet telemetry are never shared with third parties.'}
            </p>
          </div>

          {/* Section 4: Account Deletion (Apple/Google mandate) */}
          <div className="p-3 bg-rose-500/10 border border-rose-500/25 rounded-2xl space-y-1.5">
            <div className="font-bold text-rose-300 flex items-center space-x-1.5 text-xs">
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>{language === 'bn' ? '৩. অ্যাকাউন্ট ও ডেটা ডিলিট করার অধিকার' : '3. Account & Data Deletion Rights'}</span>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'bn'
                ? 'ব্যবহারকারী যেকোনো সময় তার অ্যাকাউন্ট ও ট্র্যাকিং হিস্টোরি স্থায়ীভাবে মুছে ফেলার অনুরোধ করতে পারেন।'
                : 'Users have full rights to request complete deletion of their account and position telemetry logs in compliance with Google Play and Apple App Store guidelines.'}
            </p>
          </div>

          {/* Section 5: Contact & Support */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{APP_CONFIG.supportEmail}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <a href={APP_CONFIG.website} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">
                {APP_CONFIG.publisherDomain}
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition active:scale-95 shadow-md shadow-blue-600/30"
          >
            {language === 'bn' ? 'বুঝেছি / সম্মতি প্রদান করছি' : 'I Understand & Accept'}
          </button>
        </div>
      </div>
    </div>
  );
};
