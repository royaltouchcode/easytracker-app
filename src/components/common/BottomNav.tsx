import React from 'react';
import { useApp, TabType } from '../../context/AppContext';
import { 
  Home,
  BarChart3, 
  History, 
  Zap, 
  Settings 
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, language, t } = useApp();

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'map', label: language === 'bn' ? 'হোম ম্যাপ' : 'Home', icon: <Home className="w-5 h-5" /> },
    { id: 'reports', label: language === 'bn' ? 'রিপোর্ট ও হেলথ' : 'Reports', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'playback', label: t('playback'), icon: <History className="w-5 h-5" /> },
    { id: 'commands', label: t('commands'), icon: <Zap className="w-5 h-5" /> },
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
