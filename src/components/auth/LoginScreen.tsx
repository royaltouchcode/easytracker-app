import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Server, 
  CheckCircle2, 
  Globe, 
  Radio, 
  ArrowRight, 
  Building2, 
  Briefcase, 
  ShoppingBag,
  KeyRound
} from 'lucide-react';
import { ServerConfig } from '../../types/traccar';

const PRESET_SERVERS: ServerConfig[] = [
  {
    name: 'Traccar Demo 3 (Default)',
    url: 'https://demo3.traccar.org',
    port: '5023',
    isDemo: true
  },
  {
    name: 'Oracle VPS Cloud (Self-Hosted)',
    url: 'http://129.154.220.10:8082',
    port: '5023',
    isDemo: false
  }
];

import { APP_CONFIG } from '../../config/appConfig';
import { PrivacyPolicyModal } from '../compliance/PrivacyPolicyModal';
import { RefundPolicyModal } from '../compliance/RefundPolicyModal';
import { PartnerRegistrationModal } from './PartnerRegistrationModal';
import { PublicDeviceStore } from '../store/PublicDeviceStore';

export const LoginScreen: React.FC = () => {
  const { 
    serverConfig, 
    setServerConfig, 
    login, 
    language, 
    setLanguage 
  } = useApp();

  const [loginMode, setLoginMode] = useState<'account' | 'staff'>('account');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isDeviceStoreOpen, setIsDeviceStoreOpen] = useState(false);
  const [policyAccepted, setPolicyAccepted] = useState(() => {
    return localStorage.getItem('gps_policy_accepted') === 'true';
  });

  // Hidden Admin Config State (Tap Logo 5 times)
  const [showAdminConfig, setShowAdminConfig] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [adminServerUrl, setAdminServerUrl] = useState(serverConfig.url);
  const [adminServerPort, setAdminServerPort] = useState(serverConfig.port);

  const handleLogoTap = () => {
    const nextCount = adminTapCount + 1;
    setAdminTapCount(nextCount);
    if (nextCount >= 5) {
      setShowAdminConfig(true);
      setAdminTapCount(0);
    }
  };

  const handleSaveAdminConfig = () => {
    const newCfg: ServerConfig = {
      name: adminServerUrl.includes('demo') ? 'Traccar Demo 3' : 'Oracle VPS Server',
      url: adminServerUrl.trim(),
      port: adminServerPort.trim(),
      isDemo: adminServerUrl.includes('demo')
    };
    setServerConfig(newCfg);
    localStorage.setItem('gps_server_config', JSON.stringify(newCfg));
    setShowAdminConfig(false);
  };

  const handleUserLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUser.trim() || !password.trim()) {
      setErrorMessage(language === 'bn' ? 'ইউজার আইডি ও পাসওয়ার্ড লিখুন' : 'Please enter User ID & Password');
      return;
    }

    if (!policyAccepted) {
      setErrorMessage(language === 'bn' ? 'লগইনের আগে প্রাইভেসী পলিসি পড়ে সম্মতি দেওয়া আবশ্যক' : 'Please read and accept Privacy & Refund Policy before login');
      setIsPrivacyModalOpen(true);
      return;
    }

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await login(emailOrUser.trim(), password);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(language === 'bn' ? 'সফলভাবে লগইন হয়েছে! লোড হচ্ছে...' : 'Login successful! Loading vehicles...');
    } else {
      setErrorMessage(res.message || (language === 'bn' ? 'ভুল ইউজার আইডি বা পাসওয়ার্ড' : 'Invalid credentials'));
    }
  };

  return (
    <div className="h-[100dvh] w-screen bg-slate-950 flex flex-col justify-between p-5 select-none overflow-y-auto">
      {/* Top Bar with Language Toggle */}
      <div className="flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-400">EasyTracker Gateway Online</span>
        </div>

        <button
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:bg-slate-800 transition flex items-center space-x-1.5"
        >
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-sm w-full mx-auto my-auto py-4">
        {/* App Logo */}
        <div className="text-center mb-6">
          <div 
            onClick={handleLogoTap}
            className="w-20 h-20 mx-auto mb-3 cursor-pointer active:scale-95 transition drop-shadow-2xl"
            title="Tap 5 times for Admin Server Settings"
          >
            <img src="/logo.svg" alt="EasyTracker Logo" className="w-full h-full object-contain" />
          </div>

          <h1 className="text-2xl font-black text-slate-100 tracking-tight">
            {APP_CONFIG.appDisplayName}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'bn' ? 'আপনার অ্যাকাউন্টে লগইন করুন' : 'Sign in to access your real-time tracker'}
          </p>
          <p className="text-[10px] font-medium text-blue-400">
            by {APP_CONFIG.publisher}
          </p>
        </div>

        {/* User Login Form */}
        {!showAdminConfig ? (
          <form onSubmit={handleUserLogin} className="space-y-4 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
            
            {/* Login Mode Switcher: Account vs Staff PIN */}
            <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
              <button
                type="button"
                onClick={() => {
                  setLoginMode('account');
                  setEmailOrUser('');
                  setPassword('');
                }}
                className={`flex-1 py-2 rounded-xl font-black transition flex items-center justify-center space-x-1.5 ${
                  loginMode === 'account'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'অ্যাকাউন্ট লগইন' : 'Account Login'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginMode('staff');
                  setEmailOrUser('01711-889900');
                  setPassword('8821');
                  setPolicyAccepted(true);
                  localStorage.setItem('gps_policy_accepted', 'true');
                }}
                className={`flex-1 py-2 rounded-xl font-black transition flex items-center justify-center space-x-1.5 ${
                  loginMode === 'staff'
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-cyan-300" />
                <span>{language === 'bn' ? '📱 স্টাফ ও পিন লগইন' : 'Staff PIN Login'}</span>
              </button>
            </div>

            {/* If Staff Mode: Staff Quick Demo Selection Chips */}
            {loginMode === 'staff' && (
              <div className="bg-slate-950 p-3 rounded-2xl border border-cyan-500/40 space-y-2 animate-in fade-in">
                <div className="text-[10.5px] font-extrabold text-cyan-300 flex items-center justify-between">
                  <span>⚡ রেডিমেড স্টাফ আইডি সিলেক্ট করুন:</span>
                  <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded border border-cyan-500/30">PIN PROTECTED</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEmailOrUser('01711-889900');
                      setPassword('8821');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
                      emailOrUser === '01711-889900' ? 'bg-cyan-950/80 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-xs">👨‍💼 মোঃ শফিকুল আলম (লাইনম্যান)</span>
                      <span className="text-[10px] text-slate-400">গাবতলী বাস টার্মিনাল • 01711-889900</span>
                    </div>
                    <span className="font-mono font-black text-amber-300 text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">PIN: 8821</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmailOrUser('01822-771122');
                      setPassword('4419');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
                      emailOrUser === '01822-771122' ? 'bg-cyan-950/80 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-xs">👨‍💼 আব্দুর রাজ্জাক (কাউন্টার ইনচার্জ)</span>
                      <span className="text-[10px] text-slate-400">জয়দেবপুর বাস টার্মিনাল • 01822-771122</span>
                    </div>
                    <span className="font-mono font-black text-amber-300 text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">PIN: 4419</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEmailOrUser('01712-334455');
                      setPassword('9081');
                    }}
                    className={`p-2 rounded-xl border text-left flex items-center justify-between transition ${
                      emailOrUser === '01712-334455' ? 'bg-cyan-950/80 border-cyan-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-xs">👨‍✈️ মোঃ আব্দুল কুদ্দুস (বাস চালক)</span>
                      <span className="text-[10px] text-slate-400">ঢাকা মেট্রো-ব ১৪-৯৯০১ • 01712-334455</span>
                    </div>
                    <span className="font-mono font-black text-amber-300 text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">PIN: 9081</span>
                  </button>
                </div>
              </div>
            )}

            {/* User ID / Mobile Phone */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {loginMode === 'staff' 
                  ? (language === 'bn' ? '📱 স্টাফ মোবাইল নম্বর' : 'Staff Mobile Number')
                  : (language === 'bn' ? 'ইউজার আইডি বা ইমেইল' : 'User ID / Email')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder={loginMode === 'staff' ? '01711-XXXXXX' : (language === 'bn' ? 'আপনার ইউজার আইডি বা ইমেইল' : 'Enter User ID or Email')}
                  required
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-3 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Password / 4-Digit PIN */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {loginMode === 'staff' 
                  ? (language === 'bn' ? '🔑 ৪-ডিজিটের গোপন পিন (PIN)' : '4-Digit Login PIN')
                  : (language === 'bn' ? 'পাসওয়ার্ড' : 'Password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={loginMode === 'staff' ? '৪-ডিজিট পিন (যেমন: 8821)' : '••••••••'}
                  required
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                />
                <span>{language === 'bn' ? 'লগইন মনে রাখুন' : 'Remember Me'}</span>
              </label>
            </div>

            {/* Mandatory Policy Acceptance */}
            <div className="pt-1">
              <label className="flex items-start space-x-2 text-[11px] text-slate-300 cursor-pointer bg-slate-800/60 p-2.5 rounded-2xl border border-slate-700/80 hover:border-slate-600 transition">
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={(e) => {
                    setPolicyAccepted(e.target.checked);
                    if (e.target.checked) localStorage.setItem('gps_policy_accepted', 'true');
                    else localStorage.removeItem('gps_policy_accepted');
                  }}
                  className="rounded text-blue-600 bg-slate-900 border-slate-700 w-4 h-4 mt-0.5 shrink-0"
                />
                <span className="leading-tight">
                  {language === 'bn' ? (
                    <>
                      আমি <button type="button" onClick={() => setIsPrivacyModalOpen(true)} className="text-blue-400 font-bold hover:underline">প্রাইভেসী পলিসি</button> ও <button type="button" onClick={() => setIsRefundModalOpen(true)} className="text-emerald-400 font-bold hover:underline">রিফান্ড শর্তাবলী</button> পড়েছি এবং সম্মতি দিচ্ছি।
                    </>
                  ) : (
                    <>
                      I agree to the <button type="button" onClick={() => setIsPrivacyModalOpen(true)} className="text-blue-400 font-bold hover:underline">Privacy Policy</button> & <button type="button" onClick={() => setIsRefundModalOpen(true)} className="text-emerald-400 font-bold hover:underline">Refund Policy</button>.
                    </>
                  )}
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold text-center animate-shake">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white font-bold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition mt-2"
            >
              {loading ? (
                <span>{language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...'}</span>
              ) : (
                <>
                  <span>{language === 'bn' ? 'লগইন করুন' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Role Quick-Fill Demo Chips */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5 text-center">
                {language === 'bn' ? '⚡ দ্রুত টেস্ট লগইন করুন:' : '⚡ Quick Test Logins:'}
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-bold">
                {[
                  { role: 'admin', label: '👑 Admin', u: 'admin', p: 'admin123' },
                  { role: 'ops', label: '🏢 Ops Admin', u: 'ops', p: 'ops123' },
                  { role: 'support', label: '🎧 Support', u: 'support', p: 'support123' },
                  { role: 'tech', label: '🔧 Tech Hub', u: 'tech', p: 'tech123' },
                  { role: 'rescue', label: '🚒 Rescue SOS', u: 'rescue', p: 'rescue123' },
                  { role: 'sales', label: '💼 Sales Lead', u: 'sales', p: 'sales123' },
                  { role: 'partner', label: '🤝 B2B Partner', u: 'partner', p: 'partner123' },
                  { role: 'fleet', label: '🚌 Fleet Transit', u: 'fleet', p: 'fleet123' },
                  { role: 'demo', label: '🛵 Bike Demo', u: 'demo', p: '123456' }
                ].map(r => (
                  <button
                    key={r.role}
                    type="button"
                    onClick={() => {
                      setEmailOrUser(r.u);
                      setPassword(r.p);
                      setPolicyAccepted(true);
                      localStorage.setItem('gps_policy_accepted', 'true');
                    }}
                    className="py-1.5 px-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700/60 hover:text-white transition active:scale-95 text-center truncate"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 🛒 Direct Guest Store & Telco Subscription Booking (No Login Required) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsDeviceStoreOpen(true)}
                className="w-full py-3 px-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 transition active:scale-95 shadow-xl shadow-emerald-600/30 ring-1 ring-emerald-400/50"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-100" />
                <span>
                  {language === 'bn' 
                    ? '🛒 নতুন ট্র্যাকার কিনুন ও প্যাকেজ দেখুন (লগইন ছাড়াই)' 
                    : '🛒 Buy Tracker & View Plans (No Login Required)'}
                </span>
              </button>
            </div>

            {/* B2B Partner / Staff Registration Entry Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsPartnerModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-700/80 hover:border-indigo-500/50 text-indigo-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95 shadow-md"
              >
                <Building2 className="w-4 h-4 text-indigo-400" />
                <span>
                  {language === 'bn' 
                    ? '💼 পার্টনার বা ব্র্যান্ড হিসেবে রেজিস্ট্রেশন করুন' 
                    : '💼 Register as Partner / Brand Owner'}
                </span>
              </button>
            </div>
          </form>
        ) : (
          /* Hidden Admin Server Config */
          <div className="space-y-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Admin Server Backend
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminConfig(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Back
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-1 block">Server URL / Oracle VPS IP</label>
              <input
                type="text"
                value={adminServerUrl}
                onChange={(e) => setAdminServerUrl(e.target.value)}
                placeholder="https://demo3.traccar.org"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 gap-2">
              {PRESET_SERVERS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAdminServerUrl(preset.url);
                    setAdminServerPort(preset.port);
                  }}
                  className={`p-2.5 rounded-xl text-left border text-xs ${
                    adminServerUrl === preset.url ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <div>{preset.name}</div>
                  <div className="text-[10px] text-slate-400">{preset.url}</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveAdminConfig}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition active:scale-95"
            >
              Save Backend Server
            </button>
          </div>
        )}
      </div>

      {/* Footer Legal Links */}
      <div className="text-center text-[11px] text-slate-400 z-10 shrink-0 space-y-1.5">
        <div className="flex items-center justify-center space-x-3 text-xs">
          <button
            type="button"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-blue-400 hover:underline font-semibold"
          >
            {language === 'bn' ? 'প্রাইভেসী পলিসি' : 'Privacy Policy'}
          </button>
          <span className="text-slate-600">•</span>
          <button
            type="button"
            onClick={() => setIsRefundModalOpen(true)}
            className="text-emerald-400 hover:underline font-semibold"
          >
            {language === 'bn' ? 'রিফান্ড পলিসি' : 'Refund Policy'}
          </button>
        </div>
        <div>
          {APP_CONFIG.appDisplayName} v{APP_CONFIG.version} &copy; 2026 {APP_CONFIG.publisher}
        </div>
      </div>

      {/* Legal Modals */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => {
          setIsPrivacyModalOpen(false);
          setPolicyAccepted(true);
          localStorage.setItem('gps_policy_accepted', 'true');
        }}
        language={language}
      />

      <RefundPolicyModal
        isOpen={isRefundModalOpen}
        onClose={() => {
          setIsRefundModalOpen(false);
          setPolicyAccepted(true);
          localStorage.setItem('gps_policy_accepted', 'true');
        }}
        language={language}
      />

      <PartnerRegistrationModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      {/* Guest Direct Device Store & Telco Subscription Booking Modal */}
      <PublicDeviceStore
        isOpen={isDeviceStoreOpen}
        onClose={() => setIsDeviceStoreOpen(false)}
      />
    </div>
  );
};
