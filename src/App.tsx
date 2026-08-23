import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { LiveTrackingMap } from './components/map/LiveTrackingMap';
import { DeviceSlidingSheet } from './components/dashboard/DeviceSlidingSheet';
import { PlaybackView } from './components/playback/PlaybackView';
import { CommandCenterView } from './components/commands/CommandCenterView';
import { SurveillanceView } from './components/surveillance/SurveillanceView';
import { GeofenceView } from './components/geofence/GeofenceView';
import { AlertHistoryView } from './components/alerts/AlertHistoryView';
import { DeviceSettingsView } from './components/settings/DeviceSettingsView';
import { LoginScreen } from './components/auth/LoginScreen';
import { InitialPinSetupModal } from './components/auth/InitialPinSetupModal';

const MainAppContent: React.FC = () => {
  const { user, activeTab } = useApp();
  const [isInitialPinModalOpen, setIsInitialPinModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      const isPinInitialized = localStorage.getItem('gps_pin_initialized');
      if (!isPinInitialized) {
        setIsInitialPinModalOpen(true);
      }
    }
  }, [user]);

  // If user is not logged in, show ONLY the full-screen Login Gate (No fake/demo location map)
  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex flex-col h-[100dvh] w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Top Header */}
      <Header />

      {/* Main View Area */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {activeTab === 'map' && (
          <>
            <LiveTrackingMap />
            <DeviceSlidingSheet />
          </>
        )}
        {activeTab === 'playback' && <PlaybackView />}
        {activeTab === 'commands' && <CommandCenterView />}
        {activeTab === 'surveillance' && <SurveillanceView />}
        {activeTab === 'geofence' && <GeofenceView />}
        {activeTab === 'alerts' && <AlertHistoryView />}
        {activeTab === 'settings' && <DeviceSettingsView />}
      </main>

      {/* Mandatory First-Time PIN Setup Gate */}
      <InitialPinSetupModal
        isOpen={isInitialPinModalOpen}
        onComplete={(newPin) => {
          setIsInitialPinModalOpen(false);
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
