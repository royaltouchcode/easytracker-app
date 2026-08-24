import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Clock, 
  ArrowLeft,
  CheckCheck,
  Power,
  Fan,
  MapPin,
  Navigation,
  Camera,
  AlertTriangle,
  Sparkles,
  Bot,
  Video,
  ExternalLink,
  ShieldAlert,
  Play,
  RotateCcw
} from 'lucide-react';
import { Alert3DIcon } from '../../utils/alert3dIcons';
import { resolveDeviceCapabilities } from '../../utils/deviceCapabilities';

export const AlertHistoryView: React.FC = () => {
  const { 
    alerts, 
    engineLogs,
    sensorLogs,
    selectedPosition, 
    markAlertsAsRead, 
    selectedDevice, 
    setActiveTab,
    triggerManualAlert,
    openGoogleMapsNavigation,
    language 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'all' | 'parking' | 'traffic' | 'engine' | 'sensors'>('all');
  const [selectedVideoModal, setSelectedVideoModal] = useState<{ title: string; location: string; speed: number; time: string } | null>(null);

  // Live timer tick for calculating real-time running duration of parking violations
  const [currentTime, setCurrentTime] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const capabilities = resolveDeviceCapabilities(selectedDevice, selectedPosition);

  // Strictly filter sensor logs according to vehicle hardware capabilities
  const filteredSensorLogs = sensorLogs.filter(log => {
    if (selectedDevice && log.deviceId !== selectedDevice.id && log.deviceName !== selectedDevice.name) {
      return false;
    }
    if (capabilities.isBike) {
      return log.sensorType === 'vibration';
    }
    if (log.sensorType === 'ac' && !capabilities.hasAc) return false;
    if (log.sensorType === 'door' && !capabilities.hasDoor) return false;
    if (log.sensorType === 'fuel' && !capabilities.hasFuel) return false;
    if (log.sensorType === 'fuel_lid' && !capabilities.hasFuelLid) return false;
    return true;
  });

  // Calculate dynamic parking duration text & threat level
  const formatParkingDuration = (startTimeMs: number) => {
    const elapsedSec = Math.max(0, Math.floor((currentTime - startTimeMs) / 1000));
    const mins = Math.floor(elapsedSec / 60);
    const secs = elapsedSec % 60;
    
    let riskLevel = 'low';
    let riskLabel = language === 'bn' ? '🟡 কম ঝুঁকি (সাময়িক থামা)' : '🟡 Low Risk (Short Stop)';
    let badgeClass = 'bg-amber-950/70 border-amber-500/40 text-amber-300';

    if (mins >= 15) {
      riskLevel = 'high';
      riskLabel = language === 'bn' ? '🔴 উচ্চ ঝুঁকি (রেকারিং ও ফাইন শঙ্কা!)' : '🔴 High Risk (Towing & Fine Threat)';
      badgeClass = 'bg-rose-950/80 border-rose-500/60 text-rose-300 animate-pulse';
    } else if (mins >= 5) {
      riskLevel = 'moderate';
      riskLabel = language === 'bn' ? '🟠 মাঝারি ঝুঁকি (ট্রাফিক পুলিশ জোন)' : '🟠 Moderate Risk (Police Spotting Zone)';
      badgeClass = 'bg-orange-950/70 border-orange-500/50 text-orange-300';
    }

    const durationText = language === 'bn'
      ? `${mins > 0 ? `${mins} মিনিট ` : ''}${secs} সেকেন্ড`
      : `${mins > 0 ? `${mins}m ` : ''}${secs}s`;

    return { durationText, riskLevel, riskLabel, badgeClass, elapsedMinutes: mins };
  };

  // Pre-seed or merge Parking Violation & Traffic Signal items if alerts list is standard
  const displayAlerts = alerts.length > 0 ? alerts : [
    {
      id: 991,
      deviceId: selectedDevice?.id || 1,
      type: 'parking_violation',
      serverTime: new Date(Date.now() - 1100000).toISOString(),
      attributes: {
        alarm: 'parking_violation',
        message: 'এআই অবৈধ পার্কিং সনাক্তকরণ: বিমানবন্দর ভিআইপি করিডোর ও ফ্লাইওভার সংযোগস্থলে গাড়ি পার্ক করা হয়েছে।',
        location: 'Airport VIP Road, Near Kuril Flyover, Dhaka',
        parkedStartTime: Date.now() - 1100000, // 18 mins ago
        speed: 0
      }
    },
    {
      id: 992,
      deviceId: selectedDevice?.id || 1,
      type: 'traffic_signal',
      serverTime: new Date(Date.now() - 3600000).toISOString(),
      attributes: {
        alarm: 'traffic_signal',
        message: '৩৬০° ক্যামেরা ও ADAS অ্যালার্ট: লাল বাতি সিগন্যাল অতিক্রম করা হয়েছে। ৫ সেকেন্ডের ভিডিও রেকর্ড সংরক্ষিত।',
        location: 'Bijoy Sarani Traffic Intersection, Dhaka',
        speed: 38,
        hasVideoEvidence: true
      }
    },
    {
      id: 993,
      deviceId: selectedDevice?.id || 1,
      type: 'overspeed',
      serverTime: new Date(Date.now() - 7200000).toISOString(),
      attributes: {
        alarm: 'overspeed',
        message: 'ওভার-স্পিড অতিক্রম: নির্ধারিত ৬০ কিমি/ঘণ্টা স্পিড লিমিট অতিক্রম করে ৭৪ কিমি/ঘণ্টা গতি রেকর্ড হয়েছে।',
        speed: 74,
        location: 'Mohakhali Flyover, Dhaka'
      }
    },
    {
      id: 994,
      deviceId: selectedDevice?.id || 1,
      type: 'geofenceEnter',
      serverTime: new Date(Date.now() - 10800000).toISOString(),
      attributes: {
        alarm: 'geofenceEnter',
        message: 'নিরাপদ জোনে প্রবেশ: Home Safe Zone (বাসা) এর সীমানার ভেতরে গাড়ি প্রবেশ করেছে।',
        location: 'Gulshan-2, Dhaka'
      }
    }
  ];

  // Filtering for sub-tabs
  const filteredAlerts = displayAlerts.filter(a => {
    const type = a.type?.toLowerCase() || '';
    const alarm = a.attributes?.alarm?.toLowerCase() || '';
    if (activeSubTab === 'parking') {
      return type.includes('parking') || alarm.includes('parking');
    }
    if (activeSubTab === 'traffic') {
      return type.includes('traffic') || alarm.includes('traffic') || type.includes('signal') || alarm.includes('signal');
    }
    return true;
  });

  const handleSimulateParkingAlert = () => {
    triggerManualAlert('parking_violation', 'এআই অবৈধ পার্কিং সনাক্তকরণ: বিমানবন্দর ভিআইপি করিডোর ও ফ্লাইওভার সংযোগস্থলে গাড়ি পার্ক করা হয়েছে।');
  };

  const handleSimulateTrafficAlert = () => {
    triggerManualAlert('traffic_signal', '৩৬০° ক্যামেরা ও ADAS অ্যালার্ট: লাল বাতি সিগন্যাল অতিক্রম করা হয়েছে। ভিডিও এভিডেন্স সংরক্ষিত।');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-3.5 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/95 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveTab('map')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
            title="Back to Map"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'হোম' : 'Home'}</span>
          </button>
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-slate-100">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'স্মার্ট এআই অ্যালার্ট ও নোটিফিকেশন' : 'Smart AI Alerts & Telematics Stream'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {selectedDevice ? `${selectedDevice.name} • 3D নোটিফিকেশন হাব` : 'সকল লাইভ সিকিউরিটি অ্যালার্ট'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={markAlertsAsRead}
            className="px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center space-x-1 transition active:scale-95 shadow-sm"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">{language === 'bn' ? 'পড়া হয়েছে' : 'Mark Read'}</span>
          </button>
        </div>
      </div>

      {/* Sub-Tabs Grid with 3D Category Badges */}
      <div className="flex flex-wrap gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl">
        {[
          { id: 'all', label: language === 'bn' ? '🔔 সকল অ্যালার্ট' : 'All Alerts', count: displayAlerts.length },
          { id: 'parking', label: language === 'bn' ? '🚫🅿️ নো-পার্কিং' : 'No-Parking', count: displayAlerts.filter(a => a.type?.includes('parking') || a.attributes?.alarm?.includes('parking')).length },
          { id: 'traffic', label: language === 'bn' ? '🚦 ট্রাফিক ADAS' : 'Traffic ADAS', count: displayAlerts.filter(a => a.type?.includes('traffic') || a.attributes?.alarm?.includes('traffic')).length },
          { id: 'engine', label: language === 'bn' ? '⚡ ইঞ্জিন লক/আনলক' : 'Engine Logs', count: engineLogs.length },
          { id: 'sensors', label: language === 'bn' ? '📡 সেন্সর লগ' : 'Sensors', count: filteredSensorLogs.length },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeSubTab === tab.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-800/80 border border-slate-700/70 text-slate-400 hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/60 font-mono">
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Test AI Simulation Trigger Bar */}
      <div className="p-2.5 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 rounded-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bot className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span className="text-[11px] font-bold text-indigo-200">
            {language === 'bn' ? 'এআই রিয়েল-টাইম ডিটেকশন টেস্ট:' : 'AI Real-Time Detection Test:'}
          </span>
        </div>
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleSimulateParkingAlert}
            className="px-2 py-1 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-300 text-[10.5px] font-bold transition active:scale-95 flex items-center space-x-1"
          >
            <span>🚫🅿️ নো-পার্কিং টেস্ট</span>
          </button>
          <button
            onClick={handleSimulateTrafficAlert}
            className="px-2 py-1 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-300 text-[10.5px] font-bold transition active:scale-95 flex items-center space-x-1"
          >
            <span>🚦 ট্রাফিক সিগন্যাল টেস্ট</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ALERTS & NOTIFICATIONS FEED (WITH 3D ICONS & DYNAMIC TIMERS)             */}
      {/* ========================================================================= */}
      {activeSubTab === 'all' || activeSubTab === 'parking' || activeSubTab === 'traffic' ? (
        <div className="space-y-3 flex-1">
          {filteredAlerts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-500 text-xs shadow-xl">
              <Bell className="w-10 h-10 mx-auto mb-2 text-slate-600" />
              <span>{language === 'bn' ? 'এই ক্যাটাগরিতে কোনো অ্যালার্ট নেই' : 'No alerts in this category'}</span>
            </div>
          ) : (
            filteredAlerts.map((item) => {
              const type = item.type || '';
              const alarm = item.attributes?.alarm || '';
              const isParking = type.includes('parking') || alarm.includes('parking');
              const isTraffic = type.includes('traffic') || alarm.includes('traffic') || type.includes('signal') || alarm.includes('signal');
              
              // Extract parked start time for duration tracking
              const parkedStartTime = item.attributes?.parkedStartTime || (isParking ? new Date(item.serverTime).getTime() : 0);
              const parkingInfo = isParking ? formatParkingDuration(parkedStartTime) : null;

              return (
                <div 
                  key={item.id} 
                  className={`bg-slate-900/95 border rounded-3xl p-3.5 shadow-xl transition hover:border-slate-700 flex flex-col space-y-2.5 ${
                    isParking ? 'border-rose-500/40 bg-gradient-to-br from-slate-900 via-rose-950/20 to-slate-900' :
                    isTraffic ? 'border-amber-500/40 bg-gradient-to-br from-slate-900 via-amber-950/20 to-slate-900' :
                    'border-slate-800'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* 3D Isometric Alert Icon */}
                    <div className="p-1.5 rounded-2xl bg-slate-950 border border-slate-800/90 shrink-0 shadow-md flex items-center justify-center">
                      <Alert3DIcon type={type} alarm={alarm} className="w-12 h-12" />
                    </div>

                    {/* Alert Details Header */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5 truncate">
                          <span>
                            {isParking ? (language === 'bn' ? '🚫🅿️ এআই অবৈধ পার্কিং সতর্কবার্তা' : '🚫🅿️ AI Parking Violation') :
                             isTraffic ? (language === 'bn' ? '🚦 ৩৬০° ক্যামেরা সিগন্যাল ভায়োলেশন' : '🚦 360° ADAS Signal Violation') :
                             alarm === 'overspeed' ? (language === 'bn' ? '⚡🚨 ওভার-স্পিড লিমিট লঙ্ঘন' : '⚡🚨 Over-Speed Alert') :
                             alarm === 'geofenceEnter' ? (language === 'bn' ? '🛡️📍 নিরাপদ জোনে প্রবেশ' : '🛡️📍 Safe Geofence Return') :
                             alarm === 'geofenceExit' ? (language === 'bn' ? '🚷⚡ জিওফেন্স সীমানা অতিক্রম' : '🚷⚡ Geofence Zone Breach') :
                             (alarm || type)}
                          </span>
                        </span>

                        <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono shrink-0 ml-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{new Date(item.serverTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      {/* Main Message Text */}
                      <p className="text-[11.5px] text-slate-300 mt-1 leading-snug font-medium">
                        {item.attributes?.message || `${item.type} alert triggered on device`}
                      </p>

                      {/* Precise Location & Speed Tag */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        {item.attributes?.location && (
                          <div className="flex items-center space-x-1 text-[10px] font-bold text-slate-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                            <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                            <span className="truncate max-w-[200px]">{item.attributes.location}</span>
                          </div>
                        )}
                        {item.attributes?.speed !== undefined && (
                          <div className="text-[10px] font-bold font-mono text-amber-300 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                            {item.attributes.speed} km/h
                          </div>
                        )}
                        <span className="text-[9.5px] text-slate-500 font-mono">
                          {new Date(item.serverTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ========================================================= */}
                  {/* SPECIALIZED NO-PARKING DETAILS CARD & ACTION RAIL         */}
                  {/* ========================================================= */}
                  {isParking && parkingInfo && (
                    <div className="mt-2 p-2.5 rounded-2xl bg-slate-950/90 border border-rose-500/30 space-y-2 text-xs">
                      <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                        <div>
                          <span className="text-slate-400 block text-[9.5px]">⏰ পার্কিং শুরুর সময়:</span>
                          <span className="font-bold text-slate-200 font-mono">
                            {new Date(parkedStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[9.5px]">⏱️ চলমান পার্কিং ডিউরেশন:</span>
                          <span className="font-extrabold text-amber-400 font-mono">
                            {parkingInfo.durationText}
                          </span>
                        </div>
                      </div>

                      {/* Threat Badge */}
                      <div className={`p-1.5 rounded-xl border flex items-center justify-between text-[10px] font-bold ${parkingInfo.badgeClass}`}>
                        <span>{parkingInfo.riskLabel}</span>
                        <Bot className="w-3.5 h-3.5" />
                      </div>

                      {/* Smart Quick Action Buttons */}
                      <div className="grid grid-cols-3 gap-1.5 pt-0.5">
                        <button
                          onClick={() => {
                            const q = encodeURIComponent(`Parking near ${item.attributes?.location || 'Dhaka'}`);
                            window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                          }}
                          className="py-1.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center space-x-1 shadow-sm transition active:scale-95"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>সেফ পার্কিং</span>
                        </button>

                        <button
                          onClick={openGoogleMapsNavigation}
                          className="py-1.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-bold text-[10px] flex items-center justify-center space-x-1 transition active:scale-95"
                        >
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>গাড়িতে যান</span>
                        </button>

                        <button
                          onClick={() => setActiveTab('surveillance')}
                          className="py-1.5 px-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/40 text-purple-300 font-bold text-[10px] flex items-center justify-center space-x-1 transition active:scale-95"
                        >
                          <Camera className="w-3 h-3" />
                          <span>ক্যামেরা</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ========================================================= */}
                  {/* SPECIALIZED TRAFFIC SIGNAL VIDEO PROOF RAIL               */}
                  {/* ========================================================= */}
                  {isTraffic && (
                    <div className="mt-2 p-2.5 rounded-2xl bg-slate-950/90 border border-amber-500/30 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] font-bold text-amber-300 block">
                          🎥 ৫ সেকেন্ড ADAS ভিডিও এভিডেন্স সংরক্ষিত
                        </span>
                        <span className="text-[9px] text-slate-400">
                          Red Light Cross Speed: {item.attributes?.speed || 38} km/h
                        </span>
                      </div>

                      <button
                        onClick={() => setSelectedVideoModal({
                          title: 'বিজয় সরণি ট্রাফিক সিগন্যাল লঙ্ঘন ভিডিও ক্লিপ',
                          location: item.attributes?.location || 'Bijoy Sarani Traffic Intersection',
                          speed: item.attributes?.speed || 38,
                          time: new Date(item.serverTime).toLocaleTimeString()
                        })}
                        className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[10.5px] flex items-center space-x-1 shadow-md transition active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>ভিডিও দেখুন</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      ) : activeSubTab === 'engine' ? (
        /* Engine Log Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex-1 space-y-2.5">
          {engineLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Power className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>{language === 'bn' ? 'কোনো ইঞ্জিন লক বা চালুর হিস্ট্রি নেই' : 'No engine action logs recorded'}</span>
            </div>
          ) : (
            engineLogs.map((log) => (
              <div key={log.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-start space-x-3">
                <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  <Alert3DIcon type={log.action === 'cut' ? 'ignition_off' : 'ignition_on'} className="w-10 h-10" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className={`font-bold text-xs ${
                      log.action === 'cut' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>
                      {log.action === 'cut' 
                        ? (language === 'bn' ? 'ইঞ্জিন লক (অফ) কমান্ড' : 'Engine Lock Executed') 
                        : (language === 'bn' ? 'ইঞ্জিন আনলক (চালু) কমান্ড' : 'Engine Resume Executed')}
                    </span>
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                    {log.deviceName} • {language === 'bn' ? `স্ট্যাটাস: ${log.status}` : `Status: ${log.status}`}
                  </p>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-mono">
                    {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Sensor Logs Tab */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex-1 space-y-2.5">
          {filteredSensorLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Fan className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>{language === 'bn' ? 'এই ডিভাইসের জন্য কোনো সেন্সর ইভেন্ট নেই' : 'No sensor logs for this vehicle profile'}</span>
            </div>
          ) : (
            filteredSensorLogs.map((log) => (
              <div key={log.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-start space-x-3">
                <div className="p-1 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  <Alert3DIcon type={log.sensorType} alarm={log.sensorType} className="w-10 h-10" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-100">
                      {log.title}
                    </span>
                    <div className="flex items-center space-x-1 text-[10px] text-slate-400 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <p className="text-[11px] text-cyan-300 mt-0.5 font-semibold">
                    {log.status} {log.value !== undefined ? `(${log.value})` : ''}
                  </p>
                  <div className="text-[9.5px] text-slate-400 mt-1 font-mono">
                    {log.deviceName} • {new Date(log.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎥 ADAS TRAFFIC SIGNAL VIDEO MODAL PREVIEW                                */}
      {/* ========================================================================= */}
      {selectedVideoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs text-amber-300 flex items-center space-x-1.5">
                <Video className="w-4 h-4 text-amber-400" />
                <span>{selectedVideoModal.title}</span>
              </span>
              <button onClick={() => setSelectedVideoModal(null)} className="text-slate-400 hover:text-white">
                ✕
              </button>
            </div>

            {/* Simulated 360 Camera ADAS Video Player Frame */}
            <div className="relative w-full h-48 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
              {/* Traffic light overlay HUD */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-rose-600/80 text-white font-mono font-bold text-[9.5px] flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                <span>RED LIGHT JUMP DETECTED</span>
              </div>
              <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-black/80 text-amber-300 font-mono text-[9px]">
                Speed: {selectedVideoModal.speed} km/h • {selectedVideoModal.time}
              </div>

              {/* Traffic camera icon simulation */}
              <Alert3DIcon type="traffic_signal" className="w-16 h-16 animate-pulse" />
              <span className="text-[11px] text-slate-300 font-bold mt-2">৩৬০° ফ্রন্ট এআই ক্যামেরা লাইভ রিপ্লে</span>
              <span className="text-[9px] text-slate-500">{selectedVideoModal.location}</span>
            </div>

            <button
              onClick={() => setSelectedVideoModal(null)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-white font-bold text-xs transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
