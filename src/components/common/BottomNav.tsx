import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { 
  Home,
  BarChart3, 
  History, 
  Zap, 
  Settings,
  Building2
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { user, activeTab, setActiveTab, language, t, selectedDevice, devices } = useApp();

  const isStaffUser = Boolean(
    user?.email?.includes('fleetstaff') || 
    user?.role === 'supervisor' || 
    user?.role === 'driver' || 
    (user as any)?.assigned ||
    /^[0-9\-\+]+@/.test(user?.email || '')
  );
  const isDriver = isStaffUser && (user?.role === 'driver' || user?.name?.includes('কুদ্দুস') || (user as any)?.assigned?.includes('ঢাকা মেট্রো-ব'));

  const category = (selectedDevice?.category || '').toLowerCase();
  const isCommercialFleet = category.includes('bus') || category.includes('truck') || category.includes('trailer') || category.includes('pickup') || (devices && devices.length > 1);

  // Dedicated Nav Items: Staff (Driver / Supervisor) only sees their 3 core screens
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = isStaffUser
    ? [
        { id: 'fleet_transit' as TabType, label: isDriver ? (language === 'bn' ? 'চালকের কেবিন' : 'Cabin') : (language === 'bn' ? 'টার্মিনাল পোর্টাল' : 'Terminal'), icon: <Building2 className="w-5 h-5 text-cyan-400" /> },
        { id: 'map', label: language === 'bn' ? 'লাইভ ম্যাপ' : 'Live Map', icon: <Home className="w-5 h-5" /> },
        { id: 'playback', label: language === 'bn' ? 'রুট প্লেব্যাক' : 'Playback', icon: <History className="w-5 h-5" /> }
      ]
    : [
        { id: 'map', label: language === 'bn' ? 'হোম ম্যাপ' : 'Home', icon: <Home className="w-5 h-5" /> },
        { id: 'reports', label: language === 'bn' ? 'রিপোর্ট' : 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
        { id: 'playback', label: t('playback'), icon: <History className="w-5 h-5" /> },
        ...(isCommercialFleet 
          ? [{ id: 'fleet_transit' as TabType, label: language === 'bn' ? 'ফ্লিট হাব' : 'Fleet Hub', icon: <Building2 className="w-5 h-5 text-cyan-400" /> }]
          : [{ id: 'commands' as TabType, label: t('commands'), icon: <Zap className="w-5 h-5" /> }]
        ),
        { id: 'settings', label: t('settings'), icon: <Settings className="w-5 h-5" /> },
      ];

  return (
    <nav className="bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800/90 px-1 py-1.5 flex items-center justify-around z-30 shrink-0 select-none">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-2xl relative transition-all duration-150 ${
              isActive 
                ? 'text-blue-400 bg-blue-600/15 font-bold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1.5 w-6 h-1 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
            )}

            <div className="relative">
              {item.icon}
            </div>
            <span className="text-[10.5px] mt-0.5 tracking-tight font-medium">
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
