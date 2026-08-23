import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Lock, 
  Mail, 
  ShieldCheck, 
  X, 
  Eye, 
  EyeOff, 
  Server, 
  KeyRound, 
  CheckCircle2,
  HelpCircle,
  Headphones,
  FileText
} from 'lucide-react';
import { ServerConfig } from '../../types/traccar';
import { PrivacyPolicyModal } from '../compliance/PrivacyPolicyModal';

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

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    setIsLoginModalOpen, 
    serverConfig, 
    setServerConfig, 
    login, 
    user,
    logout,
    language 
  } = useApp();

  const [emailOrUser, setEmailOrUser] = useState(user?.email || 'demo@traccar.org');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [hasAgreedPrivacy, setHasAgreedPrivacy] = useState(true);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Hidden Admin Config State
  const [showAdminConfig, setShowAdminConfig] = useState(false);
  const [adminTapCount, setAdminTapCount] = useState(0);
  const [adminServerUrl, setAdminServerUrl] = useState(serverConfig.url);
  const [adminServerPort, setAdminServerPort] = useState(serverConfig.port);

  if (!isLoginModalOpen) return null;

  // Secret 5-tap on logo to reveal Admin Backend Server Config
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
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const res = await login(emailOrUser.trim(), password);
    setLoading(false);

    if (res.success) {
      setSuccessMessage(language === 'bn' ? 'সফলভাবে লগইন হয়েছে!' : 'Logged in successfully!');
      setTimeout(() => {
        setIsLoginModalOpen(false);
      }, 800);
    } else {
      setErrorMessage(res.message || (language === 'bn' ? 'ভুল ইউজার আইডি বা পাসওয়ার্ড' : 'Invalid User ID or Password'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative">
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* App Logo & Title (Tap 5 times for Admin Backend Server Config) */}
        <div className="text-center mb-6">
          <div 
            onClick={handleLogoTap}
            className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-500 mx-auto flex items-center justify-center text-white shadow-xl shadow-blue-600/30 mb-3 cursor-pointer active:scale-95 transition"
            title="TrackPro GPS"
          >
            <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>

          <h2 className="text-xl font-extrabold text-slate-100">
            {language === 'bn' ? 'লগইন করুন' : 'Sign In to Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'bn' ? 'আপনার জিপিএস ট্র্যাকার নিয়ন্ত্রণ করুন' : 'Track & control your vehicles in real-time'}
          </p>
        </div>

        {/* Normal End-User Login Form (No Technical Server/IP clutter) */}
        {!showAdminConfig ? (
          <form onSubmit={handleUserLogin} className="space-y-4">
            {/* User ID / Email Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {language === 'bn' ? 'ইউজার আইডি বা ইমেইল' : 'User ID / Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  value={emailOrUser}
                  onChange={(e) => setEmailOrUser(e.target.value)}
                  placeholder="e.g. user123 or user@gmail.com"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-3 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {language === 'bn' ? 'পাসওয়ার্ড' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-slate-800/90 border border-slate-700/80 rounded-2xl pl-10 pr-10 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 shadow-inner"
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

            {/* Remember Me & Help */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5"
                />
                <span>{language === 'bn' ? 'মনে রাখুন' : 'Remember Me'}</span>
              </label>

              <button
                type="button"
                onClick={() => alert(language === 'bn' ? 'পাসওয়ার্ড রিসেটের জন্য অনুগ্রহ করে আপনার সার্ভিস প্রোভাইডারের সাথে যোগাযোগ করুন।' : 'Please contact support for password assistance.')}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                {language === 'bn' ? 'সাহায্য প্রয়োজন?' : 'Help?'}
              </button>
            </div>

            {/* Mandatory Store-Compliant Privacy Policy Consent */}
            <div className="p-2.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
              <label className="flex items-start space-x-2 text-[11px] text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasAgreedPrivacy}
                  onChange={(e) => setHasAgreedPrivacy(e.target.checked)}
                  required
                  className="mt-0.5 rounded text-blue-600 bg-slate-800 border-slate-700 w-3.5 h-3.5 shrink-0"
                />
                <span className="leading-tight text-slate-300">
                  {language === 'bn' ? (
                    <>
                      আমি EasyTracker-এর{' '}
                      <button
                        type="button"
                        onClick={() => setIsPrivacyModalOpen(true)}
                        className="text-blue-400 hover:underline font-bold"
                      >
                        প্রাইভেসী পলিসি
                      </button>{' '}
                      এবং{' '}
                      <button
                        type="button"
                        onClick={() => setIsPrivacyModalOpen(true)}
                        className="text-blue-400 hover:underline font-bold"
                      >
                        ব্যবহারের শর্তাবলীর
                      </button>{' '}
                      সাথে একমত।
                    </>
                  ) : (
                    <>
                      I agree to EasyTracker's{' '}
                      <button
                        type="button"
                        onClick={() => setIsPrivacyModalOpen(true)}
                        className="text-blue-400 hover:underline font-bold"
                      >
                        Privacy Policy
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        onClick={() => setIsPrivacyModalOpen(true)}
                        className="text-blue-400 hover:underline font-bold"
                      >
                        Terms of Service
                      </button>
                      .
                    </>
                  )}
                </span>
              </label>
            </div>

            {errorMessage && (
              <div className="p-2.5 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold text-center animate-shake">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Login Submit Button */}
            <button
              type="submit"
              disabled={loading || !hasAgreedPrivacy}
              className={`w-full py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center justify-center space-x-2 transition active:scale-[0.98] ${
                hasAgreedPrivacy 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-600/30' 
                  : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? (language === 'bn' ? 'যাচাই করা হচ্ছে...' : 'Verifying...') : (language === 'bn' ? 'লগইন করুন' : 'Sign In')}</span>
            </button>
          </form>
        ) : (
          /* Hidden Admin Backend Server Config (Only for Admin) */
          <div className="space-y-3.5 animate-in fade-in duration-200 border-t border-slate-800 pt-3">
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
                className="text-[11px] text-slate-400 hover:text-white"
              >
                Back to Login
              </button>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 mb-1 block">Traccar Server URL / Oracle VPS IP</label>
              <input
                type="text"
                value={adminServerUrl}
                onChange={(e) => setAdminServerUrl(e.target.value)}
                placeholder="https://demo3.traccar.org or http://your-oracle-ip:8082"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {PRESET_SERVERS.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setAdminServerUrl(preset.url);
                    setAdminServerPort(preset.port);
                  }}
                  className={`p-2 rounded-xl text-left border text-[10px] ${
                    adminServerUrl === preset.url ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold' : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  <div>{preset.name}</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleSaveAdminConfig}
              className="w-full py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition active:scale-95"
            >
              Save Backend Server Setting
            </button>
          </div>
        )}
      </div>

      {/* Privacy Policy & Terms Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};
