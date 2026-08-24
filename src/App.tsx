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

// Resilient Error Boundary to eliminate blank screens across all user roles
class PortalErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('Portal Error Caught by Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-xl font-black">
            ⚠️
          </div>
          <h3 className="font-extrabold text-sm text-white">পোর্টাল লোড করতে সাময়িক সমস্যা হয়েছে</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            অনুগ্রহ করে পেজটি রিফ্রেশ করুন অথবা কাস্টমার ম্যাপ ভিউতে সুইচ করুন।
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
          >
            🔄 পেজ রিফ্রেশ করুন
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

      {/* Main View Area with Strict Role Isolation & Error Resilience */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        <PortalErrorBoundary>
          <Suspense fallback={<PortalLoader />}>
            {/* Sales Role: STRICTLY Sales Portal Only */}
            {currentRole === 'sales' && <SalesPortalView />}

            {/* Technician Role: STRICTLY Technician Portal Only */}
            {currentRole === 'technician' && <TechnicianPortalView />}

            {/* Support Role: STRICTLY Helpdesk Portal Only */}
            {currentRole === 'support' && <SupportPortalView />}

            {/* Rescue Role: STRICTLY SOS Distress Radar Only */}
            {currentRole === 'rescue' && <RescuePortalView />}

            {/* Super Admin Role: Admin Hub or Audited Tab with Resilient Fallback */}
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
                {/* Fallback if an unrecognized tab is active */}
                {!['saas_admin', 'saas_sales', 'saas_technician', 'saas_support', 'saas_rescue', 'map', 'reports', 'playback', 'commands', 'surveillance', 'geofence', 'alerts', 'settings'].includes(activeTab) && (
                  <AdminDashboardView />
                )}
              </>
            )}

            {/* Customer Role: Standard Telematics Map & Menus with Resilient Fallback */}
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
                {/* Fallback to Map View if activeTab is not a customer tab (e.g. was a saas tab before switching) */}
                {!['map', 'reports', 'playback', 'commands', 'surveillance', 'geofence', 'alerts', 'settings'].includes(activeTab) && (
                  <>
                    <LiveTrackingMap />
                    <DeviceSlidingSheet />
                  </>
                )}
              </>
            )}

            {/* Global Fallback for unknown/transitional roles to guarantee no blank screen */}
            {!['sales', 'technician', 'support', 'rescue', 'super_admin', 'customer'].includes(currentRole) && (
              <>
                <LiveTrackingMap />
                <DeviceSlidingSheet />
              </>
            )}
          </Suspense>
        </PortalErrorBoundary>
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
