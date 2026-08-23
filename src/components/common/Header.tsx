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
  Home
} from 'lucide-react';
import { VehicleIcon } from '../../utils/vehicleIcons';
import { UserProfileModal } from '../auth/UserProfileModal';

export const Header: React.FC = () => {
  const { 
    user, 
    devices, 
    selectedDeviceId, 
    setSelectedDeviceId, 
    selectedDevice, 
    selectedPosition, 
    unreadAlertCount, 
    activeTab,
    setActiveTab, 
    language, 
    setLanguage, 
    audioAlertsEnabled,
    setAudioAlertsEnabled
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const speedKmh = selectedPosition ? Math.round(selectedPosition.speed || 0) : 0;
  const isMoving = speedKmh > 3;

  return (
    <>
      <header className="bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 px-2 py-1 flex items-center justify-between z-30 shrink-0 select-none">
        {/* Left: Vehicle Selector */}
        <div className="flex items-center space-x-1.5 relative min-w-0">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-1.5 bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 rounded-xl px-1.5 py-1 transition active:scale-95 shadow-sm text-left max-w-[130px] xs:max-w-[160px]"
          >
            <div 
              className="w-6 h-6 rounded-lg flex items-center justify-center text-white font-bold shadow-inner shrink-0"
              style={{ backgroundColor: selectedDevice?.attributes?.color || '#3b82f6' }}
            >
              <VehicleIcon type={selectedDevice?.category} className="w-3.5 h-3.5" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center space-x-1 min-w-0">
                <span className="font-extrabold text-[11.5px] text-slate-100 truncate leading-none">
                  {selectedDevice?.name || 'My Vehicle'}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </div>
              <div className="flex items-center space-x-1 text-[9px] leading-none mt-0.5">
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
                {language === 'bn' ? 'আপনার যানবাহন সমূহ' : 'Fleet Vehicles'} ({devices.length})
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1 mt-1">
                {devices.map((device) => {
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
                          style={{ backgroundColor: device.attributes?.color || '#3b82f6' }}
                        >
                          <VehicleIcon type={device.category} className="w-3.5 h-3.5" />
                        </div>
                        <div className="truncate text-xs font-medium">
                          <div className="truncate">{device.name}</div>
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

        {/* Right Header Controls */}
        <div className="flex items-center space-x-1 shrink-0">
          {/* Instant Home Return Button if in other menus */}
          {activeTab !== 'map' && (
            <button
              onClick={() => setActiveTab('map')}
              className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition active:scale-95 flex items-center space-x-1 shadow-md shadow-blue-600/30 animate-in fade-in"
              title="হোম ম্যাপে ফিরে যান"
            >
              <Home className="w-3 h-3" />
              <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            </button>
          )}

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
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="px-1.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[10.5px] font-bold text-slate-200 hover:bg-slate-700 transition flex items-center space-x-0.5"
          >
            <Globe className="w-3 h-3 text-blue-400" />
            <span>{language === 'bn' ? 'EN' : 'বাং'}</span>
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

          {/* Settings Button */}
          <button
            onClick={() => setActiveTab('settings')}
            className="p-1.5 rounded-lg bg-indigo-600/25 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 transition active:scale-95 shadow-sm"
            title="সেটিংস ও কন্ট্রোল (Settings)"
          >
            <Settings className="w-3.5 h-3.5 text-indigo-300" />
          </button>

          {/* Dedicated User Profile & Subscription Button */}
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="p-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 transition active:scale-95 shadow-sm"
            title="ইউজার প্রোফাইল ও সাবস্ক্রিপশন"
          >
            <User className="w-3.5 h-3.5 text-blue-300" />
          </button>
        </div>
      </header>

      {/* User Profile & Subscription Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};
