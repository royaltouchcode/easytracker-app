import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Globe, 
  ChevronDown, 
  User, 
  CheckCircle2,
  Volume2,
  VolumeX,
  Settings,
  Crown,
  Briefcase,
  Wrench,
  Headphones,
  Flame,
  Sparkles,
  Home,
  ShieldCheck,
  Building2,
  Palette,
  Gift
} from 'lucide-react';
import { VehicleIcon } from '../../utils/vehicleIcons';
import { UserProfileModal } from '../auth/UserProfileModal';
import { RoleSwitcherModal } from '../saas/RoleSwitcherModal';
import { UniversalEarnModal } from '../rewards/UniversalEarnModal';
import { AppTheme } from '../../types/traccar';

export const Header: React.FC = () => {
  const { 
    user, 
    devices, 
    tenantDevices,
    selectedDeviceId, 
    setSelectedDeviceId, 
    selectedDevice, 
    selectedPosition, 
    unreadAlertCount, 
    activeTab, 
    setActiveTab, 
    currentRole,
    isRoleSwitcherOpen,
    setIsRoleSwitcherOpen,
    appTheme,
    setAppTheme,
    language, 
    setLanguage, 
    audioAlertsEnabled,
    setAudioAlertsEnabled
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isEarnModalOpen, setIsEarnModalOpen] = useState(false);

  const displayDevices = user?.partnerId ? (tenantDevices.length > 0 ? tenantDevices : devices) : devices;

  const speedKmh = selectedPosition ? Math.round(selectedPosition.speed || 0) : 0;
  const isMoving = speedKmh > 3;
  const isSuperAdmin = user?.administrator || user?.role === 'super_admin';
  const hasMultipleRoles = isSuperAdmin || (user?.approvedRoles && user.approvedRoles.length > 1);

  const category = (selectedDevice?.category || '').toLowerCase();
  const isCommercialFleet = category.includes('bus') || category.includes('truck') || category.includes('trailer') || category.includes('pickup') || (devices && devices.length > 1);

  return (
    <>
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-2.5 py-1.5 flex items-center justify-between z-30 shrink-0 select-none gap-2">
        {/* ========================================================================= */}
        {/* LEFT SECTION: ROLE-SPECIFIC BRANDING OR VEHICLE SELECTOR                 */}
        {/* ========================================================================= */}
        <div className="flex items-center space-x-1.5 min-w-0 flex-1">
          {/* If Customer: Show Vehicle Selector */}
          {currentRole === 'customer' && (
            <>
              {activeTab !== 'map' && (
                <button
                  onClick={() => setActiveTab('map')}
                  className="px-2 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md shadow-blue-600/30 flex items-center space-x-1 shrink-0 transition active:scale-95 animate-in fade-in"
                  title="হোম লাইভ ম্যাপে ফিরে যান"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span className="hidden xs:inline">{language === 'bn' ? 'হোম' : 'Home'}</span>
                </button>
              )}

              {/* Adaptive Fleet Hub Button for Commercial / Fleet Owners */}
              {isCommercialFleet && (
                <button
                  onClick={() => setActiveTab('fleet_transit')}
                  className={`px-2.5 py-1 rounded-xl font-bold text-xs transition border flex items-center space-x-1 shrink-0 ${
                    activeTab === 'fleet_transit'
                      ? 'bg-cyan-600 text-white border-cyan-500 shadow-md shadow-cyan-600/30'
                      : 'bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border-cyan-700/60'
                  }`}
                  title="ফ্লিট ও ট্রান্সপোর্টেশন অ্যাডমিন হাব (কাউন্টার, ড্রাইভার, BRTA)"
                >
                  <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">ফ্লিট হাব</span>
                </button>
              )}

              <div className="relative min-w-0 max-w-[145px] sm:max-w-[180px]">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700/90 rounded-xl px-2 py-1 transition active:scale-95 shadow-sm text-left w-full"
                >
                  <div 
                    className="w-5 h-5 rounded-lg flex items-center justify-center text-white font-bold shadow-inner shrink-0"
                    style={{ backgroundColor: selectedDevice?.attributes?.color || '#ef4444' }}
                  >
                    <VehicleIcon type={selectedDevice?.category} className="w-3 h-3" />
                  </div>

                  <div className="flex flex-col min-w-0 flex-1">
                    <div className="flex items-center justify-between min-w-0">
                      <span className="font-extrabold text-[10.5px] text-slate-100 truncate leading-none">
                        {selectedDevice?.name || 'My Vehicle'}
                      </span>
                      <ChevronDown className="w-3 h-3 text-slate-400 shrink-0 ml-0.5" />
                    </div>
                    <div className="flex items-center space-x-1 text-[8.5px] leading-none mt-0.5">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${isMoving ? 'bg-emerald-400 animate-pulse' : selectedPosition?.attributes?.ignition ? 'bg-amber-400' : 'bg-rose-400'}`} />
                      <span className="text-slate-300 font-semibold truncate">
                        {isMoving ? `${speedKmh} km/h` : selectedPosition?.attributes?.ignition ? 'Idle' : 'Parked'}
                      </span>
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute top-11 left-0 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 py-1">
                      {language === 'bn' ? 'আপনার যানবাহন সমূহ' : 'Fleet Vehicles'} ({displayDevices.length})
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-1 mt-1">
                      {displayDevices.map((device) => {
                        const isSel = device.id === selectedDeviceId;
                        return (
                          <button
                            key={device.id}
                            onClick={() => {
                              setSelectedDeviceId(device.id);
                              setIsDropdownOpen(false);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition ${
                              isSel ? 'bg-blue-600/20 border border-blue-500/40 text-blue-300' : 'hover:bg-slate-800 text-slate-200'
                            }`}
                          >
                            <div className="flex items-center space-x-2 truncate">
                              <div 
                                className="w-6 h-6 rounded-md flex items-center justify-center text-white shrink-0"
                                style={{ backgroundColor: device.attributes?.color || '#ef4444' }}
                              >
                                <VehicleIcon type={device.category} className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate text-xs font-medium">
                                <div className="truncate font-bold">{device.name}</div>
                                <div className="text-[10px] text-slate-400">{device.attributes?.plateNumber || 'No Plate'}</div>
                              </div>
                            </div>
                            {isSel && <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* If Business Partner: Show Franchise Brand Name & Partner Badge */}
          {currentRole === 'partner' && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 shadow-sm">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-100 block leading-tight truncate max-w-[140px]">
                  {user?.partnerBrandName || 'Franchise Partner'}
                </span>
                <span className="text-[9px] text-indigo-400 font-semibold leading-none">
                  পার্টনার হাব ও স্লট কোটা
                </span>
              </div>
            </div>
          )}

          {/* If Sales Agent / B2B Partner: Show Brand Logo & Branding */}
          {currentRole === 'sales' && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-sm">
                {user?.partnerBrandName ? <Building2 className="w-4 h-4 text-purple-400" /> : <Briefcase className="w-4 h-4" />}
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-100 block leading-tight truncate max-w-[140px]">
                  {user?.partnerBrandName || 'EasyTracker Sales'}
                </span>
                <span className="text-[9px] text-emerald-400 font-semibold leading-none">
                  {user?.serviceTier ? `টিয়ার: ${user.serviceTier}` : 'অনবোর্ডিং ও সেলস হাব'}
                </span>
              </div>
            </div>
          )}

          {/* If Technician: Show Tech Logo & Branding */}
          {currentRole === 'technician' && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-400 shadow-sm">
                <Wrench className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-100 block leading-tight">Field Technician</span>
                <span className="text-[9px] text-purple-400 font-semibold leading-none">হার্ডওয়্যার ও ওয়্যারিং হাব</span>
              </div>
            </div>
          )}

          {/* If Support: Show Support Logo */}
          {currentRole === 'support' && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-sky-600/30 border border-sky-500/50 flex items-center justify-center text-sky-400 shadow-sm">
                <Headphones className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-100 block leading-tight">Customer Care</span>
                <span className="text-[9px] text-sky-400 font-semibold leading-none">হেল্পডেস্ক ও টিকিট</span>
              </div>
            </div>
          )}

          {/* If Rescue: Show Rescue Logo */}
          {currentRole === 'rescue' && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-rose-600/30 border border-rose-500/50 flex items-center justify-center text-rose-400 shadow-sm">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-100 block leading-tight">Rescue SOS Force</span>
                <span className="text-[9px] text-rose-400 font-semibold leading-none">ইমার্জেন্সি রিকভারি</span>
              </div>
            </div>
          )}

          {/* If Super Admin: Show Admin Brand */}
          {currentRole === 'super_admin' && (
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-xl bg-amber-600/30 border border-amber-500/50 flex items-center justify-center text-amber-400 shadow-sm">
                <Crown className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-xs text-slate-100 block leading-tight">Super Admin SaaS</span>
                <span className="text-[9px] text-amber-400 font-semibold leading-none">মাস্টার কন্ট্রোল প্যানেল</span>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT SECTION: ROLE-TAILORED CONTROLS (NO EXPOSURE OF CUSTOMER SETTINGS) */}
        {/* ========================================================================= */}
        <div className="flex items-center space-x-1 shrink-0">
          {/* Role Badge (Clickable for Multi-Role Users & Super Admin) */}
          <button
            onClick={() => {
              if (hasMultipleRoles) {
                setIsRoleSwitcherOpen(true);
              }
            }}
            className={`px-2 py-1 rounded-xl border flex items-center space-x-1 font-bold text-[10px] sm:text-[11px] transition active:scale-95 shadow-sm ${
              hasMultipleRoles ? 'cursor-pointer hover:ring-1 hover:ring-white/30' : 'cursor-default'
            } ${
              currentRole === 'super_admin' ? 'bg-amber-600/30 border-amber-500/60 text-amber-300' :
              currentRole === 'sales' ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300' :
              currentRole === 'technician' ? 'bg-purple-600/30 border-purple-500/60 text-purple-300' :
              currentRole === 'support' ? 'bg-sky-600/30 border-sky-500/60 text-sky-300' :
              currentRole === 'rescue' ? 'bg-rose-600/30 border-rose-500/60 text-rose-300 animate-pulse' :
              'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
            }`}
            title={hasMultipleRoles ? 'আপনার অনুমোদিত পোর্টাল সুইচ করুন' : 'আপনার বর্তমান অ্যাক্টিভ রোল'}
          >
            {currentRole === 'super_admin' && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
            {currentRole === 'sales' && <Briefcase className="w-3 h-3 text-emerald-400 shrink-0" />}
            {currentRole === 'technician' && <Wrench className="w-3 h-3 text-purple-400 shrink-0" />}
            {currentRole === 'support' && <Headphones className="w-3 h-3 text-sky-400 shrink-0" />}
            {currentRole === 'rescue' && <Flame className="w-3 h-3 text-rose-400 shrink-0" />}
            {currentRole === 'customer' && <Sparkles className="w-3 h-3 text-blue-400 shrink-0" />}
            <span className="capitalize font-extrabold">
              {currentRole === 'super_admin' ? 'অ্যাডমিন' :
               currentRole === 'sales' ? 'সেলস' :
               currentRole === 'technician' ? 'টেক' :
               currentRole === 'support' ? 'সাপোর্ট' :
               currentRole === 'rescue' ? 'রেসকিউ' :
               'কাস্টমার'}
            </span>
          </button>

          {/* Customer-Only Controls (Audio Alert, Notification Bell, Settings Gear) */}
          {currentRole === 'customer' && (
            <>
              <button
                onClick={() => setAudioAlertsEnabled(!audioAlertsEnabled)}
                className={`p-1.5 rounded-lg border transition ${
                  audioAlertsEnabled 
                    ? 'bg-slate-800 border-slate-700 text-emerald-400' 
                    : 'bg-slate-800/50 border-slate-800 text-slate-500'
                }`}
                title="Toggle Sound Alerts"
              >
                {audioAlertsEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setActiveTab('alerts')}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 relative transition"
                title="Alerts & Notifications"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadAlertCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 text-white rounded-full text-[8.5px] font-extrabold flex items-center justify-center animate-bounce">
                    {unreadAlertCount}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-1.5 rounded-lg bg-indigo-600/25 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 transition active:scale-95 shadow-sm"
                title="সেটিংস ও কন্ট্রোল (Settings)"
              >
                <Settings className="w-3.5 h-3.5 text-indigo-300" />
              </button>
            </>
          )}

          {/* Modern Theme Switcher Button */}
          <button
            onClick={() => setIsThemeModalOpen(true)}
            className={`p-1.5 rounded-lg border transition active:scale-95 shadow-sm flex items-center space-x-1 text-[10px] font-bold ${
              appTheme === 'emerald_luxe' 
                ? 'bg-emerald-600/30 hover:bg-emerald-600/45 border-emerald-500/40 text-emerald-300' 
                : appTheme === 'royal_amethyst' 
                ? 'bg-purple-600/30 hover:bg-purple-600/45 border-purple-500/40 text-purple-300' 
                : 'bg-indigo-600/30 hover:bg-indigo-600/45 border-indigo-500/40 text-indigo-300'
            }`}
            title="থিম পরিবর্তন করুন (Color Themes)"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {appTheme === 'emerald_luxe' ? 'এমেরাল্ড' : appTheme === 'royal_amethyst' ? 'অমেথিস্ট' : 'মিডনাইট'}
            </span>
          </button>

          {/* Universal Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="px-1.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10px] font-bold text-slate-200 hover:bg-slate-700 transition flex items-center space-x-0.5"
          >
            <Globe className="w-3 h-3 text-blue-400" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Highlighted Universal Earn / Rewards Button */}
          <button
            onClick={() => setIsEarnModalOpen(true)}
            className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold text-[10.5px] flex items-center space-x-1 shadow-md shadow-purple-600/30 transition active:scale-95 border border-purple-400/50"
            title={currentRole === 'customer' ? 'বন্ধুকে রেফার করুন ও ক্যাশব্যাক পান (Earn Hub)' : 'আপনার সেলস ও কমিশন ওয়ালেট'}
          >
            <Gift className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="font-mono tracking-tight font-black">
              {currentRole === 'customer' ? '🎁 Earn' : '💰 আর্ন'}
            </span>
          </button>

          {/* Dedicated User Profile & Subscription / Logout Button */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 transition active:scale-95 shadow-sm"
            title="ইউজার প্রোফাইল ও অ্যাকাউন্ট"
          >
            <User className="w-3.5 h-3.5 text-blue-300" />
          </button>
        </div>
      </header>

      {/* Modern Theme Switcher Modal */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-md">
                  <Palette className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    {language === 'bn' ? '🎨 আধুনিক কালার থিম নির্বাচন করুন' : '🎨 Select Modern Color Theme'}
                  </h3>
                  <p className="text-[10.5px] text-slate-400">
                    {language === 'bn' ? 'আপনার পছন্দ অনুযায়ী ড্যাশবোর্ডের লুক ও কালার প্যালেট সেট করুন।' : 'Choose your preferred dashboard look & feel.'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  id: 'cyber_midnight' as AppTheme,
                  nameBn: '🌌 সাইবার মিডনাইট (Cyber Midnight)',
                  nameEn: 'Cyber Midnight',
                  descBn: 'ডার্ক স্পেস ব্ল্যাক, ইলেকট্রিক স্লেট ব্লু ও নিওন গ্লো (ডিফল্ট প্রফেশনাল)',
                  colors: ['#020617', '#1e293b', '#3b82f6', '#6366f1']
                },
                {
                  id: 'emerald_luxe' as AppTheme,
                  nameBn: '💎 এমেরাল্ড লাক্স (Emerald Luxe)',
                  nameEn: 'Emerald Luxe',
                  descBn: 'ডিপ ফরেস্ট এমারেল্ড, প্রিমিয়াম জেড গ্রিন ও গোল্ডেন এক্সেন্ট',
                  colors: ['#021a12', '#052e1f', '#10b981', '#f59e0b']
                },
                {
                  id: 'royal_amethyst' as AppTheme,
                  nameBn: '🔮 রয়্যাল অমেথিস্ট (Royal Amethyst)',
                  nameEn: 'Royal Amethyst',
                  descBn: 'কসমিক ডিপ নেবুলা ভায়োলেট, সাইবার পার্পল ও ফিউশিয়া গ্লো',
                  colors: ['#090514', '#130a2a', '#a855f7', '#06b6d4']
                }
              ].map((theme) => {
                const isSelected = appTheme === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => {
                      setAppTheme(theme.id);
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'bg-slate-800/90 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-extrabold text-xs text-white">
                          {language === 'bn' ? theme.nameBn : theme.nameEn}
                        </span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            সক্রিয়
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] text-slate-400 max-w-xs">{theme.descBn}</p>
                      
                      {/* Color Palette Preview Swatches */}
                      <div className="flex items-center space-x-1.5 pt-1">
                        {theme.colors.map((c, i) => (
                          <div 
                            key={i} 
                            className="w-4 h-4 rounded-full border border-white/20 shadow-inner" 
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pl-3">
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsThemeModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition active:scale-95"
              >
                {language === 'bn' ? 'সম্পন্ন (Apply & Close)' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile & Subscription Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      {/* Universal Earn & Referral / Commission Ledger Hub Modal */}
      <UniversalEarnModal
        isOpen={isEarnModalOpen}
        onClose={() => setIsEarnModalOpen(false)}
      />

      {/* SaaS Multi-Role Switcher Modal (Only Super Admin can switch) */}
      <RoleSwitcherModal
        isOpen={isRoleSwitcherOpen}
        onClose={() => setIsRoleSwitcherOpen(false)}
      />
    </>
  );
};
