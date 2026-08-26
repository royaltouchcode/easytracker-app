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
  Sparkles,
  Users,
  Edit3,
  Plus,
  X,
  Check,
  Megaphone,
  Radio,
  FileText
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
  isEnabled: boolean;
}

export const DEFAULT_SMS_TEMPLATES: SmsTemplate[] = [
  {
    id: 'tpl_order_confirm',
    titleBn: '📦 গ্রাহক অর্ডার কনফার্মেশন',
    descriptionBn: 'নতুন ডিভাইস অর্ডার গৃহীত হলে গ্রাহককে পাঠানো হয়',
    templateText: 'ধন্যবাদ {customerName}, EasyTracker-এ আপনার অর্ডার #{orderId} সফলভাবে গৃহীত হয়েছে। মোট প্রাক্কলিত মূল্য: ৳{totalAmount}। হেল্পলাইন: ০৯৬১২-০০০৯৯৯',
    variables: ['{customerName}', '{orderId}', '{totalAmount}'],
    isEnabled: true
  },
  {
    id: 'tpl_tech_dispatch',
    titleBn: '🔧 টেকনিশিয়ান অ্যাসাইনমেন্ট নোটিফিকেশন',
    descriptionBn: 'গ্রাহককে টেকনিশিয়ানের তথ্য ও দূরত্ব জানাতে',
    templateText: 'আপনার অর্ডারে টেকনিশিয়ান {techName} (ফোন: {techPhone}, দূরত্ব: {distance} কিমি) অ্যাসাইন করা হয়েছে। তিনি শীঘ্রই আপনার ঠিকানায় পৌঁছাবেন।',
    variables: ['{techName}', '{techPhone}', '{distance}'],
    isEnabled: true
  },
  {
    id: 'tpl_tech_job_alert',
    titleBn: '🔔 টেকনিশিয়ান নতুন জব অ্যালার্ট',
    descriptionBn: 'টেকনিশিয়ানকে নতুন কাজের ম্যাপ ও গ্রাহকের তথ্য পাঠাতে',
    templateText: 'নতুন ইনস্টলেশন জব #{orderId}! গ্রাহক: {customerName}, ফোন: {customerPhone}, ঠিকানা: {deliveryAddress}। গুগল ম্যাপ লিংক: {mapsLink}। ২ ঘন্টার মধ্যে গ্রহণ করুন।',
    variables: ['{orderId}', '{customerName}', '{customerPhone}', '{deliveryAddress}', '{mapsLink}'],
    isEnabled: true
  },
  {
    id: 'tpl_rescue_alert',
    titleBn: '🚨 রেসকিউ ও ইঞ্জিন লক এলার্ট',
    descriptionBn: 'জরুরি রেসকিউতে ইঞ্জিন কাট হলে পরিবারের নম্বরে এসএমএস',
    templateText: 'জরুরি সতর্কতা! আপনার গাড়ি {vehiclePlate} রেসকিউ মোডে রিমোটলি ইঞ্জিন লক করা হয়েছে। ২৪/৭ হেল্পলাইন: ০৯৬১২-০০০৯৯৯',
    variables: ['{vehiclePlate}'],
    isEnabled: true
  },
  {
    id: 'tpl_bill_due',
    titleBn: '💳 মান্থলি সাবস্ক্রিপশন ও বিল রিমাইন্ডার',
    descriptionBn: 'প্যাকেজের মেয়াদ শেষ হওয়ার ৩ দিন আগে স্বয়ংক্রিয় তাগিদ',
    templateText: 'প্রিয় {customerName}, আপনার গাড়ি {vehiclePlate}-এর ট্র্যাকিং মেয়াদ {expiryDate} তারিখে শেষ হবে। নির্বিঘ্ন সেবা পেতে বিকাশ/নগদে ৳{amount} রিনিউ করুন।',
    variables: ['{customerName}', '{vehiclePlate}', '{expiryDate}', '{amount}'],
    isEnabled: true
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
      try { 
        const parsed = JSON.parse(saved);
        return parsed.map((t: any) => ({ ...t, isEnabled: t.isEnabled ?? true }));
      } catch (e) {}
    }
    return DEFAULT_SMS_TEMPLATES;
  });

  // Template Editing & Creation Modal State
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [tempTitleBn, setTempTitleBn] = useState('');
  const [tempDescBn, setTempDescBn] = useState('');
  const [tempText, setTempText] = useState('');
  const [tempVariables, setTempVariables] = useState<string[]>([]);

  // Promotional Campaign Builder State
  const [targetAudienceType, setTargetAudienceType] = useState<'all_customers' | 'customer_type' | 'custom_numbers'>('all_customers');
  const [selectedCustomerCategory, setSelectedCustomerCategory] = useState<'all_bikes' | 'all_cars' | 'all_trucks' | 'all_dealers' | 'pending_leads'>('all_bikes');
  const [customNumbersInput, setCustomNumbersInput] = useState('');
  const [promoMessageText, setPromoMessageText] = useState('🔥 ইজিট্র্যাকারে বন্ধুকে রেফার করলেই পাচ্ছেন ৳১০০ ইনস্ট্যান্ট ক্যাশব্যাক ও ফ্রি সাবস্ক্রিপশন! আপনার রেফারেল কোড: EASY-8821। ভিজিট: https://easytracker.com.bd');
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastProgress, setBroadcastProgress] = useState(0);
  const [broadcastSuccessNotice, setBroadcastSuccessNotice] = useState<string | null>(null);

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

  // Toggle Individual Template ON / OFF
  const handleToggleTemplate = (templateId: string) => {
    const updated = templates.map(t => t.id === templateId ? { ...t, isEnabled: !t.isEnabled } : t);
    setTemplates(updated);
    localStorage.setItem('gps_sms_templates', JSON.stringify(updated));
  };

  // Open Template Modal for Add or Edit
  const handleOpenTemplateModal = (tpl?: SmsTemplate) => {
    if (tpl) {
      setEditingTemplateId(tpl.id);
      setTempTitleBn(tpl.titleBn);
      setTempDescBn(tpl.descriptionBn);
      setTempText(tpl.templateText);
      setTempVariables(tpl.variables);
    } else {
      setEditingTemplateId(null);
      setTempTitleBn('');
      setTempDescBn('');
      setTempText('');
      setTempVariables(['{customerName}', '{vehiclePlate}']);
    }
    setIsTemplateModalOpen(true);
  };

  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempTitleBn.trim() || !tempText.trim()) return;

    if (editingTemplateId) {
      const updated = templates.map(t => t.id === editingTemplateId ? {
        ...t,
        titleBn: tempTitleBn.trim(),
        descriptionBn: tempDescBn.trim(),
        templateText: tempText.trim(),
        variables: tempVariables
      } : t);
      setTemplates(updated);
      localStorage.setItem('gps_sms_templates', JSON.stringify(updated));
    } else {
      const newTpl: SmsTemplate = {
        id: `tpl_custom_${Date.now().toString().slice(-4)}`,
        titleBn: tempTitleBn.trim(),
        descriptionBn: tempDescBn.trim() || 'কাস্টম তৈরি সিস্টেম নোটিফিকেশন',
        templateText: tempText.trim(),
        variables: tempVariables,
        isEnabled: true
      };
      const updated = [...templates, newTpl];
      setTemplates(updated);
      localStorage.setItem('gps_sms_templates', JSON.stringify(updated));
    }
    setIsTemplateModalOpen(false);
  };

  // Calculate Audience Count for Promotional Broadcast
  const getAudienceCount = () => {
    if (targetAudienceType === 'all_customers') return 148;
    if (targetAudienceType === 'customer_type') {
      if (selectedCustomerCategory === 'all_bikes') return 84;
      if (selectedCustomerCategory === 'all_cars') return 42;
      if (selectedCustomerCategory === 'all_trucks') return 22;
      if (selectedCustomerCategory === 'all_dealers') return 15;
      return 35; // pending leads
    }
    // Custom numbers list count
    const nums = customNumbersInput.split(/[\n,]+/).map(n => n.trim()).filter(Boolean);
    return nums.length > 0 ? nums.length : 1;
  };

  const audienceCount = getAudienceCount();
  const currentActive = providers[activeProvider] || providers.elitbuzz;
  const estimatedCost = audienceCount * currentActive.ratePerSmsBdt;

  // Broadcast Promotional SMS
  const handleBroadcastCampaign = () => {
    if (!promoMessageText.trim()) {
      alert('দয়া করে প্রমোশনাল মেসেজ লিখুন।');
      return;
    }
    if (currentActive.balanceBdt < estimatedCost) {
      alert(`⚠️ অপর্যাপ্ত গেটওয়ে ব্যালেন্স! আনুমানিক খরচ ৳${estimatedCost.toFixed(2)} কিন্তু বর্তমান ব্যালেন্স ৳${currentActive.balanceBdt}।`);
      return;
    }

    setIsBroadcasting(true);
    setBroadcastProgress(15);
    setBroadcastSuccessNotice(null);

    const interval = setInterval(() => {
      setBroadcastProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 100;
        }
        return prev + 25;
      });
    }, 300);

    setTimeout(() => {
      setIsBroadcasting(false);
      clearInterval(interval);
      setBroadcastProgress(100);

      const targetLabel = targetAudienceType === 'all_customers' ? 'সকল নিবন্ধিত কাস্টমার' :
        targetAudienceType === 'customer_type' ? `গ্রাহক গ্রুপ (${selectedCustomerCategory})` : 'কাস্টম নম্বর তালিকা';

      setBroadcastSuccessNotice(`🎉 সফলভাবে ${audienceCount}টি নম্বরে প্রমোশনাল এসএমএস ব্রডকাস্ট সম্পন্ন হয়েছে! মোট খরচ: ৳${estimatedCost.toFixed(2)}`);

      // Deduct balance
      handleUpdateProviderConfig(activeProvider, 'balanceBdt', Math.max(0, currentActive.balanceBdt - estimatedCost));

      // Append Log
      const campaignLog = {
        id: `promo_${Date.now()}`,
        time: 'এখনই',
        recipient: `${audienceCount} Recipients (${targetLabel})`,
        provider: currentActive.name.split(' ')[0],
        type: 'Promo Campaign',
        text: promoMessageText.length > 50 ? promoMessageText.slice(0, 50) + '...' : promoMessageText,
        status: 'DELIVERED',
        cost: `৳ ${estimatedCost.toFixed(2)}`
      };
      const updatedLogs = [campaignLog, ...smsLogs];
      setSmsLogs(updatedLogs);
      localStorage.setItem('gps_sms_dispatch_logs', JSON.stringify(updatedLogs));
    }, 1800);
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

      {/* ========================================================================= */}
      {/* ⚙️ MODULE 1: DYNAMIC SYSTEM AUTO-TRIGGER TEMPLATES (INDIVIDUAL ON/OFF)     */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-extrabold text-white">
                স্বয়ংক্রিয় সিস্টেম এসএমএস ইভেন্ট ও টেমপ্লেট লাইব্রেরি ({templates.length}টি)
              </h4>
              <p className="text-[10.5px] text-slate-400">
                কোন কোন ইভেন্টে অটোমেটিক এসএমএস পাঠানো হবে তা ইন্ডিভিজুয়ালি চালু (ON) বা বন্ধ (OFF) করুন।
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleOpenTemplateModal()}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition active:scale-95 self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ নতুন সিস্টেম টেমপ্লেট</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {templates.map((tpl) => (
            <div 
              key={tpl.id} 
              className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                tpl.isEnabled 
                  ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
                  : 'bg-slate-950/50 border-slate-900 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${tpl.isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-xs font-black text-slate-100">{tpl.titleBn}</span>
                </div>

                {/* Individual ON / OFF Toggle Switch */}
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenTemplateModal(tpl)}
                    className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
                    title="টেমপ্লেট এডিট করুন"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleTemplate(tpl.id)}
                    className={`px-2.5 py-1 rounded-xl text-[10.5px] font-black border flex items-center space-x-1 transition active:scale-95 ${
                      tpl.isEnabled 
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                        : 'bg-slate-900 text-slate-500 border-slate-800'
                    }`}
                  >
                    <span>{tpl.isEnabled ? '🟢 ON' : '🔴 OFF'}</span>
                  </button>
                </div>
              </div>

              <p className="text-[10px] text-slate-400">{tpl.descriptionBn}</p>

              <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80 text-xs text-slate-200 font-sans">
                {tpl.templateText}
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex flex-wrap gap-1">
                  {tpl.variables.map((v, i) => (
                    <span key={i} className="text-[8.5px] bg-blue-950 text-blue-300 border border-blue-800/80 px-1.5 py-0.2 rounded font-mono">
                      {v}
                    </span>
                  ))}
                </div>
                <span className="text-[9px] text-slate-500 font-mono">ID: {tpl.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📢 MODULE 2: BULK PROMOTIONAL & MARKETING CAMPAIGN BUILDER HUB             */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/50 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-purple-500/20 pb-3 gap-2">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/30 text-purple-300 border border-purple-500/50 flex items-center justify-center shadow-lg">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm md:text-base font-extrabold text-white">
                  📢 ক্যাম্পেইন ও প্রমোশনাল এসএমএস ব্রডকাস্টার (Bulk Campaign Hub)
                </h4>
                <span className="text-[9.5px] bg-purple-500/30 text-purple-200 border border-purple-400 px-2 py-0.2 rounded-full font-mono font-black">
                  MARKETING BLAST
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                সকল নিবন্ধিত কাস্টমার, নির্দিষ্ট গ্রুপ বা কাস্টম নম্বরে অফার ও রেফারেল প্রমোশন পাঠান।
              </p>
            </div>
          </div>

          <div className="text-right font-mono self-start sm:self-auto">
            <span className="text-[10px] text-slate-400 block font-bold">টার্গেট অডিয়েন্স:</span>
            <span className="text-sm font-black text-purple-300">{audienceCount} জন প্রাপক</span>
          </div>
        </div>

        {/* 1. Target Audience Selection Radio Tabs */}
        <div className="space-y-2">
          <label className="text-[11px] font-black uppercase tracking-wider text-purple-300 block">
            ১. প্রাপক নির্বাচন করুন (Target Audience / Sent To) *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => setTargetAudienceType('all_customers')}
              className={`p-3 rounded-2xl border text-left space-y-1 transition active:scale-[0.98] ${
                targetAudienceType === 'all_customers'
                  ? 'bg-purple-950/80 border-purple-400 text-purple-100 ring-1 ring-purple-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                <Users className="w-4 h-4 text-purple-400" />
                <span>👥 সকল কাস্টমার (All Customers)</span>
              </div>
              <p className="text-[10px] text-slate-400">প্ল্যাটফর্মের সকল ১৪৮ জন রেজিস্টার্ড গ্রাহক</p>
            </button>

            <button
              type="button"
              onClick={() => setTargetAudienceType('customer_type')}
              className={`p-3 rounded-2xl border text-left space-y-1 transition active:scale-[0.98] ${
                targetAudienceType === 'customer_type'
                  ? 'bg-purple-950/80 border-purple-400 text-purple-100 ring-1 ring-purple-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>🎯 নির্দিষ্ট গ্রাহক গ্রুপ (Customer Type)</span>
              </div>
              <p className="text-[10px] text-slate-400">বাইকার্স, প্রাইভেট কার, ট্রাক বা ডিলার</p>
            </button>

            <button
              type="button"
              onClick={() => setTargetAudienceType('custom_numbers')}
              className={`p-3 rounded-2xl border text-left space-y-1 transition active:scale-[0.98] ${
                targetAudienceType === 'custom_numbers'
                  ? 'bg-purple-950/80 border-purple-400 text-purple-100 ring-1 ring-purple-400 shadow-md'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold">
                <FileText className="w-4 h-4 text-purple-400" />
                <span>📋 কাস্টম নম্বর তালিকা (Custom / CSV)</span>
              </div>
              <p className="text-[10px] text-slate-400">একাধিক মোবাইল নম্বর পেস্ট করুন</p>
            </button>
          </div>

          {/* Sub-Filters for Customer Type */}
          {targetAudienceType === 'customer_type' && (
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex flex-wrap gap-2 animate-in fade-in text-xs">
              <button
                type="button"
                onClick={() => setSelectedCustomerCategory('all_bikes')}
                className={`px-3 py-1.5 rounded-xl border font-bold ${
                  selectedCustomerCategory === 'all_bikes' ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                🏍️ বাইকার্স (৮৪ জন)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomerCategory('all_cars')}
                className={`px-3 py-1.5 rounded-xl border font-bold ${
                  selectedCustomerCategory === 'all_cars' ? 'bg-cyan-600 text-white border-cyan-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                🚗 প্রাইভেট কার ওনার (৪২ জন)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomerCategory('all_trucks')}
                className={`px-3 py-1.5 rounded-xl border font-bold ${
                  selectedCustomerCategory === 'all_trucks' ? 'bg-blue-600 text-white border-blue-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                🚚 হেভি ট্রাক ও ফ্লিট (২২ জন)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomerCategory('all_dealers')}
                className={`px-3 py-1.5 rounded-xl border font-bold ${
                  selectedCustomerCategory === 'all_dealers' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                🏢 ডিলার পার্টনার (১৫ জন)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCustomerCategory('pending_leads')}
                className={`px-3 py-1.5 rounded-xl border font-bold ${
                  selectedCustomerCategory === 'pending_leads' ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                ⏳ পেন্ডিং সেলস লিডস (৩৫ জন)
              </button>
            </div>
          )}

          {/* Textarea for Custom Numbers */}
          {targetAudienceType === 'custom_numbers' && (
            <div className="space-y-1 animate-in fade-in">
              <label className="text-[10.5px] text-slate-400 block">
                মোবাইল নম্বরসমূহ প্রতি লাইনে একটি করে অথবা কমা (,) দিয়ে পেস্ট করুন:
              </label>
              <textarea
                rows={3}
                value={customNumbersInput}
                onChange={(e) => setCustomNumbersInput(e.target.value)}
                placeholder="01711223344, 01822334455, 01933445566..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-2.5 text-xs text-purple-300 font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          )}
        </div>

        {/* 2. Message Composer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-black uppercase tracking-wider text-purple-300 block">
              ২. প্রমোশনাল মেসেজ ড্রাফট করুন (Campaign SMS Body) *
            </label>
            <div className="text-[10px] text-slate-400 font-mono">
              {promoMessageText.length} ক্যারেক্টার • {Math.ceil(promoMessageText.length / 70)}টি বাংলা এসএমএস পার্ট
            </div>
          </div>

          <textarea
            rows={3}
            value={promoMessageText}
            onChange={(e) => setPromoMessageText(e.target.value)}
            className="w-full bg-slate-950 border border-purple-500/40 rounded-2xl p-3 text-xs text-slate-100 font-sans focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 shadow-inner"
          />

          {/* Quick Variable Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-slate-400 font-bold">কুইক ট্যাগ:</span>
            <button
              type="button"
              onClick={() => setPromoMessageText(prev => prev + ' {customerName}')}
              className="text-[9.5px] bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-lg font-mono"
            >
              + {`{customerName}`}
            </button>
            <button
              type="button"
              onClick={() => setPromoMessageText(prev => prev + ' {referralCode}')}
              className="text-[9.5px] bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-lg font-mono"
            >
              + {`{referralCode}`}
            </button>
            <button
              type="button"
              onClick={() => setPromoMessageText(prev => prev + ' https://easytracker.com.bd')}
              className="text-[9.5px] bg-slate-900 hover:bg-slate-800 text-purple-300 border border-purple-800/80 px-2 py-0.5 rounded-lg font-mono"
            >
              + Web Link
            </button>
          </div>
        </div>

        {/* 3. Cost Estimator & 1-Click Broadcast Bar */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">মোট প্রাপক:</span>
              <span className="font-mono font-black text-white">{audienceCount} জন</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">প্রতি SMS রেট:</span>
              <span className="font-mono font-black text-emerald-400">৳ {currentActive.ratePerSmsBdt}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">মোট খরচ:</span>
              <span className="font-mono font-black text-amber-300">৳ {estimatedCost.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block font-bold">গেটওয়ে ব্যালেন্স:</span>
              <span className="font-mono font-black text-cyan-300">৳ {currentActive.balanceBdt}</span>
            </div>
          </div>

          <button
            type="button"
            disabled={isBroadcasting || !isSmsEnabled}
            onClick={handleBroadcastCampaign}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:bg-slate-800 text-white font-extrabold text-xs shadow-xl shadow-purple-600/30 flex items-center justify-center space-x-2 transition active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{isBroadcasting ? 'ব্রডকাস্ট হচ্ছে...' : '🚀 ক্যাম্পেইন ব্রডকাস্ট করুন'}</span>
          </button>
        </div>

        {/* Broadcast Progress Bar & Success Notice */}
        {isBroadcasting && (
          <div className="space-y-1 animate-in fade-in">
            <div className="flex justify-between text-[10px] text-purple-300 font-mono">
              <span>এসএমএস সার্ভারে ডিসপ্যাচ হচ্ছে...</span>
              <span>{broadcastProgress}%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-purple-500/40">
              <div 
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${broadcastProgress}%` }}
              />
            </div>
          </div>
        )}

        {broadcastSuccessNotice && (
          <div className="p-3 bg-emerald-950/90 border border-emerald-500/60 rounded-2xl text-xs font-bold text-emerald-200 flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{broadcastSuccessNotice}</span>
          </div>
        )}
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

      {/* ========================================================================= */}
      {/* ✏️ TEMPLATE EDIT / CREATE MODAL                                            */}
      {/* ========================================================================= */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="font-extrabold text-sm text-emerald-300 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>{editingTemplateId ? 'সিস্টেম টেমপ্লেট এডিট করুন' : 'নতুন সিস্টেম এসএমএস টেমপ্লেট তৈরি'}</span>
              </h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">টেমপ্লেট টাইটেল *</label>
                <input
                  type="text"
                  required
                  value={tempTitleBn}
                  onChange={(e) => setTempTitleBn(e.target.value)}
                  placeholder="যেমন: সার্ভিসিং বিল পেইড কনফার্মেশন"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">বিবরণ / কখন যাবে</label>
                <input
                  type="text"
                  value={tempDescBn}
                  onChange={(e) => setTempDescBn(e.target.value)}
                  placeholder="যেমন: টেকনিশিয়ান বিল পরিশোধ নিশ্চিত করলে গ্রাহককে এসএমএস"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-300 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">টেমপ্লেট বডি (মেসেজ টেক্সট) *</label>
                <textarea
                  rows={4}
                  required
                  value={tempText}
                  onChange={(e) => setTempText(e.target.value)}
                  placeholder="ধন্যবাদ {customerName}, আপনার বিল {amount} টাকা পরিশোধ হয়েছে..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-100 font-sans focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsTemplateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
