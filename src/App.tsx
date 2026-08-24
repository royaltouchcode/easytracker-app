import React, { useState, useEffect, lazy, Suspense } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { LiveTrackingMap } from './components/map/LiveTrackingMap';
import { DeviceSlidingSheet } from './components/dashboard/DeviceSlidingSheet';
import { ReportsHubView } from './components/reports/ReportsHubView';
import { PlaybackView } from './components/playback/PlaybackView';
import { CommandCenterView } from './components/commands/CommandCenterView';
import { SurveillanceView } from './components/surveillance/SurveillanceView';
import { GeofenceView } from './components/geofence/GeofenceView';
import { AlertHistoryView } from './components/alerts/AlertHistoryView';
import { DeviceSettingsView } from './components/settings/DeviceSettingsView';
import { LoginScreen } from './components/auth/LoginScreen';
import { InitialPinSetupModal } from './components/auth/InitialPinSetupModal';

// BUG #5 FIX: SaaS Portals lazy-loaded for code splitting (reduces initial bundle by ~40%)
const AdminDashboardView = lazy(() => import('./components/saas/AdminDashboardView').then(m => ({ default: m.AdminDashboardView })));
const SalesPortalView = lazy(() => import('./components/saas/SalesPortalView').then(m => ({ default: m.SalesPortalView })));
const TechnicianPortalView = lazy(() => import('./components/saas/TechnicianPortalView').then(m => ({ default: m.TechnicianPortalView })));
const SupportPortalView = lazy(() => import('./components/saas/SupportPortalView').then(m => ({ default: m.SupportPortalView })));
const RescuePortalView = lazy(() => import('./components/saas/RescuePortalView').then(m => ({ default: m.RescuePortalView })));

// Minimal Suspense fallback spinner for SaaS portal lazy load
const PortalLoader = () => (
  <div className="flex-1 flex items-center justify-center bg-slate-950">
    <div className="flex flex-col items-center space-y-3">
      <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs text-slate-400 font-semibold">পোর্টাল লোড হচ্ছে...</span>
    </div>
  </div>
);

const MainAppContent: React.FC = () => {
  const { user, activeTab, currentRole } = useApp();
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
      {/* Top Header with Role-Tailored Controls */}
      <Header />

      {/* Main View Area with Strict Role Isolation */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <Suspense fallback={<PortalLoader />}>
          {/* Sales Role: STRICTLY Sales Portal Only */}
          {currentRole === 'sales' && <SalesPortalView />}

          {/* Technician Role: STRICTLY Technician Portal Only */}
          {currentRole === 'technician' && <TechnicianPortalView />}

          {/* Support Role: STRICTLY Helpdesk Portal Only */}
          {currentRole === 'support' && <SupportPortalView />}

          {/* Rescue Role: STRICTLY SOS Distress Radar Only */}
          {currentRole === 'rescue' && <RescuePortalView />}

          {/* Super Admin Role: Admin Hub or Audited Tab */}
          {currentRole === 'super_admin' && (
            <>
              {activeTab === 'saas_admin' && <AdminDashboardView />}
              {activeTab === 'saas_sales' && <SalesPortalView />}
              {activeTab === 'saas_technician' && <TechnicianPortalView />}
              {activeTab === 'saas_support' && <SupportPortalView />}
              {activeTab === 'saas_rescue' && <RescuePortalView />}
              {activeTab === 'map' && (
                <>
                  <LiveTrackingMap />
                  <DeviceSlidingSheet />
                </>
              )}
              {activeTab === 'reports' && <ReportsHubView />}
              {activeTab === 'playback' && <PlaybackView />}
              {activeTab === 'commands' && <CommandCenterView />}
              {activeTab === 'surveillance' && <SurveillanceView />}
              {activeTab === 'geofence' && <GeofenceView />}
              {activeTab === 'alerts' && <AlertHistoryView />}
              {activeTab === 'settings' && <DeviceSettingsView />}
            </>
          )}

          {/* Customer Role: Standard Telematics Map & Menus */}
          {currentRole === 'customer' && (
            <>
              {activeTab === 'map' && (
                <>
                  <LiveTrackingMap />
                  <DeviceSlidingSheet />
                </>
              )}
              {activeTab === 'reports' && <ReportsHubView />}
              {activeTab === 'playback' && <PlaybackView />}
              {activeTab === 'commands' && <CommandCenterView />}
              {activeTab === 'surveillance' && <SurveillanceView />}
              {activeTab === 'geofence' && <GeofenceView />}
              {activeTab === 'alerts' && <AlertHistoryView />}
              {activeTab === 'settings' && <DeviceSettingsView />}
            </>
          )}
        </Suspense>
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
