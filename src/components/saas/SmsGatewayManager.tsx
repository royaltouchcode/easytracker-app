import React, { useState, useEffect } from 'react';
import { 
  Smartphone, 
  MessageSquare, 
  CheckCircle2, 
  Send, 
  ShieldCheck, 
  Sliders, 
  RefreshCw, 
  Lock, 
  Key, 
  Globe, 
  ToggleLeft, 
  ToggleRight, 
  AlertTriangle,
  History,
  Copy,
  DollarSign,
  Zap,
  Sparkles
} from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

export interface SmsProviderConfig {
  id: 'elitbuzz' | 'greenweb' | 'onnorokom' | 'ssl_wireless' | 'bulksmsbd' | 'custom_rest';
  name: string;
  website: string;
  apiUrl: string;
  apiKey: string;
  senderId: string;
  balanceBdt: number;
  ratePerSmsBdt: number;
  isMasking: boolean;
}

export interface SmsTemplate {
  id: string;
  titleBn: string;
  descriptionBn: string;
  templateText: string;
  variables: string[];
}

export const DEFAULT_SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: 'tpl_order_confirm',
    titleBn: '📦 গ্রাহক অর্ডার কনফার্মেশন',
    descriptionBn: 'নতুন ডিভাইস অর্ডার গৃহীত হলে গ্রাহককে পাঠানো হয়',
    templateText: 'ধন্যবাদ {customerName}, EasyTracker-এ আপনার অর্ডার #{orderId} সফলভাবে গৃহীত হয়েছে। মোট প্রাক্কলিত মূল্য: ৳{totalAmount}। হেল্পলাইন: ০৯৬১২-০০০৯৯৯',
    variables: ['{customerName}', '{orderId}', '{totalAmount}']
  },
  {
    id: 'tpl_tech_dispatch',
    titleBn: '🔧 টেকনিশিয়ান অ্যাসাইনমেন্ট নোটিফিকেশন',
    descriptionBn: 'গ্রাহককে টেকনিশিয়ানের তথ্য ও দূরত্ব জানাতে',
    templateText: 'আপনার অর্ডারে টেকনিশিয়ান {techName} (ফোন: {techPhone}, দূরত্ব: {distance} কিমি) অ্যাসাইন করা হয়েছে। তিনি শীঘ্রই আপনার ঠিকানায় পৌঁছাবেন।',
    variables: ['{techName}', '{techPhone}', '{distance}']
  },
  {
    id: 'tpl_tech_job_alert',
    titleBn: '🔔 টেকনিশিয়ান নতুন জব অ্যালার্ট',
    descriptionBn: 'টেকনিশিয়ানকে নতুন কাজের ম্যাপ ও গ্রাহকের তথ্য পাঠাতে',
    templateText: 'নতুন ইনস্টলেশন জব #{orderId}! গ্রাহক: {customerName}, ফোন: {customerPhone}, ঠিকানা: {deliveryAddress}। গুগল ম্যাপ লিংক: {mapsLink}। ২ ঘন্টার মধ্যে গ্রহণ করুন।',
    variables: ['{orderId}', '{customerName}', '{customerPhone}', '{deliveryAddress}', '{mapsLink}']
  },
  {
    id: 'tpl_rescue_alert',
    titleBn: '🚨 রেসকিউ ও ইঞ্জিন লক এলার্ট',
    descriptionBn: 'জরুরি রেসকিউতে ইঞ্জিন কাট হলে পরিবারের নম্বরে এসএমএস',
    templateText: 'জরুরি সতর্কতা! আপনার গাড়ি {vehiclePlate} রেসকিউ মোডে রিমোটলি ইঞ্জিন লক করা হয়েছে। ২৪/৭ হেল্পলাইন: ০৯৬১২-০০০৯৯৯',
    variables: ['{vehiclePlate}']
  },
  {
    id: 'tpl_promo_referral',
    titleBn: '🎁 প্রমোশনাল ও রেফারেল ক্যাম্পেইন',
    descriptionBn: 'মার্কেটিং ও বন্ধু রেফারেল ক্যাশব্যাক অফার পাঠাতে',
    templateText: 'ইজিট্র্যাকারে বন্ধুকে রেফার করলেই পাচ্ছেন ৳১০০ ক্যাশব্যাক ও ফ্রি সাবস্ক্রিপশন! আপনার রেফারেল কোড: {referralCode}। ভিজিট: easytracker.com.bd',
    variables: ['{referralCode}']
  }
];

export const SmsGatewayManager: React.FC = () => {
  const [isSmsEnabled, setIsSmsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('gps_sms_module_enabled') !== 'false';
  });

  const [activeProvider, setActiveProvider] = useState<string>(() => {
    return localStorage.getItem('gps_sms_active_provider') || 'elitbuzz';
  });

  const [providers, setProviders] = useState<Record<string, SmsProviderConfig>>(() => {
    const saved = localStorage.getItem('gps_sms_providers_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      elitbuzz: {
        id: 'elitbuzz',
        name: 'ElitBuzz SMS (elitbuzz-bd.com)',
        website: 'https://elitbuzz-bd.com',
        apiUrl: 'https://msg.elitbuzz-bd.com/smsapi',
        apiKey: 'ELIT_DEMO_API_KEY_8829',
        senderId: 'EasyTracker',
        balanceBdt: 2450,
        ratePerSmsBdt: 0.35,
        isMasking: true
      },
      greenweb: {
        id: 'greenweb',
        name: 'Greenweb BD SMS (greenweb.com.bd)',
        website: 'https://greenweb.com.bd',
        apiUrl: 'https://api.greenweb.com.bd/api.php',
        apiKey: 'GREENWEB_TOKEN_9921',
        senderId: 'EasyTrackBD',
        balanceBdt: 1200,
        ratePerSmsBdt: 0.30,
        isMasking: true
      },
      onnorokom: {
        id: 'onnorokom',
        name: 'Onnorokom SMS (onnorokomsms.com)',
        website: 'https://onnorokomsms.com',
        apiUrl: 'https://api2.onnorokomsms.com/sendSms.asmx',
        apiKey: 'ONNO_SECRET_API_4411',
        senderId: 'EasyTracker',
        balanceBdt: 850,
        ratePerSmsBdt: 0.32,
        isMasking: false
      },
      ssl_wireless: {
        id: 'ssl_wireless',
        name: 'SSL Wireless / MiM SMS',
        website: 'https://sslwireless.com',
        apiUrl: 'https://smsplus.sslwireless.com/api/v3/send-sms',
        apiKey: 'SSL_MIM_KEY_3309',
        senderId: 'EasyTracker',
        balanceBdt: 5000,
        ratePerSmsBdt: 0.38,
        isMasking: true
      },
      bulksmsbd: {
        id: 'bulksmsbd',
        name: 'BulkSMSBD (bulksmsbd.com)',
        website: 'https://bulksmsbd.com',
        apiUrl: 'http://bulksmsbd.net/api/smsapi',
        apiKey: 'BULK_SMS_KEY_7712',
        senderId: 'EasyTracker',
        balanceBdt: 420,
        ratePerSmsBdt: 0.28,
        isMasking: false
      },
      custom_rest: {
        id: 'custom_rest',
        name: 'Custom REST SMS API / Webhook',
        website: 'https://your-custom-gateway.com',
        apiUrl: 'https://api.sms-gateway.com/v1/send',
        apiKey: 'CUSTOM_BEARER_TOKEN',
        senderId: 'EasyTracker',
        balanceBdt: 0,
        ratePerSmsBdt: 0.35,
        isMasking: false
      }
    };
  });

  const [templates, setTemplates] = useState<SmsTemplate[]>(() => {
    const saved = localStorage.getItem('gps_sms_templates');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_SMS_TEMPLATES;
  });

  // Test SMS State
  const [testPhone, setTestPhone] = useState('01711223344');
  const [testMessage, setTestMessage] = useState('EasyTracker টেস্ট এসএমএস গেটওয়ে সফলভাবে কাজ করছে!');
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testStatus, setTestStatus] = useState<string | null>(null);

  // SMS Dispatch Logs
  const [smsLogs, setSmsLogs] = useState<any[]>(() => {
    const saved = localStorage.getItem('gps_sms_dispatch_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'log_1', time: 'আজ ০৪:১৫ PM', recipient: '01711-223344', provider: 'ElitBuzz', type: 'Order Confirmation', text: 'ধন্যবাদ মো: আজহার উদ্দিন, আপনার অর্ডার #ORD-8821 গৃহীত হয়েছে।', status: 'DELIVERED', cost: '৳ ০.৩৫' },
      { id: 'log_2', time: 'গতকাল ১০:৩০ AM', recipient: '01822-334455', provider: 'Greenweb', type: 'Technician Dispatch', text: 'আপনার অর্ডারে টেকনিশিয়ান আব্দুল করিম অ্যাসাইন করা হয়েছে।', status: 'DELIVERED', cost: '৳ ০.৩০' },
      { id: 'log_3', time: '২৫ আগস্ট', recipient: '01933-445566', provider: 'ElitBuzz', type: 'Rescue Alert', text: 'জরুরি সতর্কতা! আপনার গাড়ি ঢাকা মেট্রো ল-১২-৩৪৫৬ ইঞ্জিন লক করা হয়েছে।', status: 'DELIVERED', cost: '৳ ০.৩৫' }
    ];
  });

  const handleToggleSmsModule = () => {
    const next = !isSmsEnabled;
    setIsSmsEnabled(next);
    localStorage.setItem('gps_sms_module_enabled', String(next));
  };

  const handleProviderChange = (providerId: string) => {
    setActiveProvider(providerId);
    localStorage.setItem('gps_sms_active_provider', providerId);
  };

  const handleUpdateProviderConfig = (providerId: string, field: keyof SmsProviderConfig, value: any) => {
    const updated = {
      ...providers,
      [providerId]: {
        ...providers[providerId],
        [field]: value
      }
    };
    setProviders(updated);
    localStorage.setItem('gps_sms_providers_config', JSON.stringify(updated));
  };

  const handleSendTestSms = () => {
    if (!testPhone.trim() || !testMessage.trim()) {
      alert('দয়া করে মোবাইল নম্বর ও মেসেজ লিখুন।');
      return;
    }
    setIsSendingTest(true);
    setTestStatus(null);

    setTimeout(() => {
      setIsSendingTest(false);
      setTestStatus(`✅ এসএমএস সফলভাবে পাঠানো হয়েছে (${providers[activeProvider].name})`);
      
      const newLog = {
        id: `log_${Date.now()}`,
        time: 'এখনই',
        recipient: testPhone,
        provider: providers[activeProvider].name.split(' ')[0],
        type: 'Test Diagnostic',
        text: testMessage,
        status: 'DELIVERED',
        cost: `৳ ${providers[activeProvider].ratePerSmsBdt.toFixed(2)}`
      };
      const updatedLogs = [newLog, ...smsLogs];
      setSmsLogs(updatedLogs);
      localStorage.setItem('gps_sms_dispatch_logs', JSON.stringify(updatedLogs));
    }, 1200);
  };

  const currentActive = providers[activeProvider] || providers.elitbuzz;

  return (
    <div className="space-y-4 select-none">
      
      {/* Top SMS Header & Master Switch */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/50 flex items-center justify-center shadow-lg shrink-0">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-extrabold text-base text-white">
                📱 এসএমএস গেটওয়ে ও ক্যাম্পেইন হাব (SMS Gateway Engine)
              </h3>
              <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                isSmsEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}>
                {isSmsEnabled ? 'SYSTEM ACTIVE' : 'SMS DISABLED'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              বাংলাদেশের শীর্ষ এসএমএস গেটওয়ে (ElitBuzz, Greenweb, SSL Wireless) দিয়ে স্বয়ংক্রিয় অর্ডার, সাপোর্ট ও রেসকিউ এসএমএস
            </p>
          </div>
        </div>

        {/* Master ON/OFF Toggle */}
        <button
          type="button"
          onClick={handleToggleSmsModule}
          className={`px-4 py-2.5 rounded-2xl border flex items-center space-x-2 transition active:scale-95 shadow-lg ${
            isSmsEnabled
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 ring-1 ring-emerald-500/40'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}
        >
          {isSmsEnabled ? <ToggleRight className="w-5 h-5 text-emerald-400" /> : <ToggleLeft className="w-5 h-5 text-slate-500" />}
          <span className="text-xs font-black">
            {isSmsEnabled ? 'এসএমএস মডিউল: চালু (ON)' : 'এসএমএস মডিউল: বন্ধ (OFF)'}
          </span>
        </button>
      </div>

      {/* Gateway Providers Selector Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center space-x-2">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>সক্রিয় এসএমএস প্রোভাইডার নির্বাচন করুন (Active Gateway Provider)</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">
            কারেন্ট ব্যালেন্স: ৳ {currentActive.balanceBdt.toLocaleString()}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {Object.values(providers).map((prov) => {
            const isSelected = activeProvider === prov.id;
            return (
              <button
                key={prov.id}
                type="button"
                onClick={() => handleProviderChange(prov.id)}
                className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 ${
                  isSelected
                    ? 'bg-blue-950/80 border-2 border-blue-400 shadow-md ring-1 ring-blue-500/40 text-white'
                    : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850 text-slate-400'
                }`}
              >
                <div>
                  <span className={`text-xs font-black block truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {prov.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate mt-0.5">
                    {prov.senderId}
                  </span>
                </div>
                <div className="mt-2 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[9px] font-mono">
                  <span className="text-emerald-400 font-bold">৳ {prov.ratePerSmsBdt}/sms</span>
                  {isSelected && <span className="text-blue-400 font-bold">✓ ACTIVE</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Provider API Configuration Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black uppercase text-slate-200">
              {currentActive.name} — API ও মাস্কিং কনফিগারেশন
            </span>
          </div>
          <a
            href={currentActive.website}
            target="_blank"
            rel="noreferrer"
            className="text-[10px] text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>প্রোভাইডার পোর্টাল</span>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-slate-300 block mb-1">API Key / Secret Token</label>
            <input
              type="text"
              value={currentActive.apiKey}
              onChange={(e) => handleUpdateProviderConfig(activeProvider, 'apiKey', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">Sender ID / Masking Name</label>
            <input
              type="text"
              value={currentActive.senderId}
              onChange={(e) => handleUpdateProviderConfig(activeProvider, 'senderId', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">API Endpoint URL</label>
            <input
              type="text"
              value={currentActive.apiUrl}
              onChange={(e) => handleUpdateProviderConfig(activeProvider, 'apiUrl', e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Templates Library */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-black uppercase text-slate-200 flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-emerald-400" />
            <span>ডায়নামিক এসএমএস টেমপ্লেট লাইব্রেরি ({templates.length}টি টেমপ্লেট)</span>
          </span>
          <span className="text-[10px] text-slate-400">অটোমেটিক ভেরিয়েবল সাপোর্ট</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {templates.map((tpl) => (
            <div key={tpl.id} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-white">{tpl.titleBn}</span>
                <span className="text-[9px] text-slate-500 font-mono">ID: {tpl.id}</span>
              </div>
              <p className="text-[10px] text-slate-400">{tpl.descriptionBn}</p>
              <textarea
                rows={3}
                value={tpl.templateText}
                onChange={(e) => {
                  const updated = templates.map(t => t.id === tpl.id ? { ...t, templateText: e.target.value } : t);
                  setTemplates(updated);
                  localStorage.setItem('gps_sms_templates', JSON.stringify(updated));
                }}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-slate-200 font-sans focus:outline-none focus:border-blue-500 resize-none"
              />
              <div className="flex flex-wrap gap-1 pt-1">
                {tpl.variables.map((v, i) => (
                  <span key={i} className="text-[8.5px] bg-blue-950 text-blue-300 border border-blue-800/80 px-1.5 py-0.2 rounded font-mono">
                    {v}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test SMS Dispatcher & Delivery Log */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Test SMS Form */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <span className="text-xs font-black uppercase text-slate-200 flex items-center space-x-2">
            <Send className="w-4 h-4 text-blue-400" />
            <span>টেস্ট এসএমএস সেন্ডার</span>
          </span>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">প্রাপকের মোবাইল নম্বর</label>
            <input
              type="tel"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] text-slate-300 block mb-1">টেস্ট মেসেজ</label>
            <textarea
              rows={2}
              value={testMessage}
              onChange={(e) => setTestMessage(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2 text-xs text-slate-100 focus:outline-none resize-none"
            />
          </div>

          {testStatus && (
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-[10.5px] text-emerald-300">
              {testStatus}
            </div>
          )}

          <button
            type="button"
            disabled={isSendingTest || !isSmsEnabled}
            onClick={handleSendTestSms}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center space-x-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSendingTest ? 'পাঠানো হচ্ছে...' : 'টেস্ট এসএমএস পাঠান'}</span>
          </button>
        </div>

        {/* Live Delivery History Logs */}
        <div className="sm:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-black uppercase text-slate-200 flex items-center space-x-2">
              <History className="w-4 h-4 text-emerald-400" />
              <span>সাম্প্রতিক এসএমএস ডেলিভারি লগ</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{smsLogs.length}টি রেকর্ড</span>
          </div>

          <div className="space-y-2 max-h-64 overflow-y-auto">
            {smsLogs.map((log) => (
              <div key={log.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-100">{log.recipient}</span>
                    <span className="text-[9px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">{log.type}</span>
                    <span className="text-[9px] text-slate-500">{log.time}</span>
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{log.text}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 block">
                    {log.status}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono mt-0.5 block">{log.cost}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
