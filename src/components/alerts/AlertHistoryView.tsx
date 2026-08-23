import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  Key, 
  Scissors, 
  Activity, 
  Gauge, 
  AlertTriangle, 
  Clock, 
  ArrowLeft,
  CheckCheck,
  Power,
  ShieldCheck,
  Fan,
  DoorClosed,
  Fuel,
  Lock,
  Radio
} from 'lucide-react';
import { resolveDeviceCapabilities } from '../../utils/deviceCapabilities';
import { FuelMileageAnalyticsView } from '../analytics/FuelMileageAnalyticsView';

export const AlertHistoryView: React.FC = () => {
  const { 
    alerts, 
    engineLogs,
    sensorLogs,
    selectedPosition,
    markAlertsAsRead, 
    selectedDevice, 
    setActiveTab,
    language 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'alerts' | 'engine' | 'sensors' | 'fuel'>('alerts');

  const capabilities = resolveDeviceCapabilities(selectedDevice, selectedPosition);

  // Strictly filter sensor logs according to vehicle hardware capabilities
  const filteredSensorLogs = sensorLogs.filter(log => {
    if (selectedDevice && log.deviceId !== selectedDevice.id && log.deviceName !== selectedDevice.name) {
      return false;
    }
    if (capabilities.isBike) {
      // Bikes only have vibration/tamper/motion/battery sensors (No AC, No Door, No Heavy Tank Lid)
      return log.sensorType === 'vibration';
    }
    if (log.sensorType === 'ac' && !capabilities.hasAc) return false;
    if (log.sensorType === 'door' && !capabilities.hasDoor) return false;
    if (log.sensorType === 'fuel' && !capabilities.hasFuel) return false;
    if (log.sensorType === 'fuel_lid' && !capabilities.hasFuelLid) return false;
    return true;
  });

  const getAlertIcon = (type: string, alarm?: string) => {
    if (alarm === 'powerCut' || alarm === 'powerRestored') {
      return <Scissors className="w-4 h-4 text-rose-400" />;
    }
    if (alarm === 'sos') {
      return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    }
    if (alarm === 'vibration' || alarm === 'movement') {
      return <Activity className="w-4 h-4 text-amber-400" />;
    }
    if (alarm === 'overspeed') {
      return <Gauge className="w-4 h-4 text-rose-400" />;
    }
    if (type.includes('ignition') || type === 'engine') {
      return <Key className="w-4 h-4 text-emerald-400" />;
    }
    return <Bell className="w-4 h-4 text-blue-400" />;
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-3 pb-24 select-none">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setActiveTab('map')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
            title="Back to Map"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'পেছনে' : 'Back'}</span>
          </button>
          <div>
            <h2 className="text-sm font-bold">
              {language === 'bn' ? 'অ্যালার্ট ও অ্যাক্টিভিটি হিস্ট্রি' : 'Alerts & Activity History'}
            </h2>
            <p className="text-[10px] text-slate-400">
              {selectedDevice?.name || 'My Vehicle'} • {capabilities.isBike ? 'Bike Mode' : 'Vehicle Mode'}
            </p>
          </div>
        </div>

        {activeSubTab === 'alerts' && (
          <button
            onClick={markAlertsAsRead}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-[11px] font-semibold border border-slate-700 transition flex items-center space-x-1"
          >
            <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'bn' ? 'পড়া হয়েছে' : 'Read All'}</span>
          </button>
        )}
      </div>

      {/* Sub Tabs Selector (4 Sub-Tabs) */}
      <div className="grid grid-cols-4 gap-1 bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition ${
            activeSubTab === 'alerts' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="truncate">{language === 'bn' ? 'নোটিফিকেশন' : 'Alerts'} ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('engine')}
          className={`py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition ${
            activeSubTab === 'engine' 
              ? 'bg-rose-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span className="truncate">{language === 'bn' ? 'ইঞ্জিন লগ' : 'Engine'} ({engineLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sensors')}
          className={`py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition ${
            activeSubTab === 'sensors' 
              ? 'bg-cyan-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fan className="w-3.5 h-3.5" />
          <span className="truncate">{language === 'bn' ? 'সেন্সর' : 'Sensors'} ({filteredSensorLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('fuel')}
          className={`py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition ${
            activeSubTab === 'fuel' 
              ? 'bg-amber-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fuel className="w-3.5 h-3.5" />
          <span className="truncate">{language === 'bn' ? 'ফুয়েল/মাইলেজ' : 'Fuel/Eco'}</span>
        </button>
      </div>

      {/* Content Area */}
      {activeSubTab === 'alerts' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex-1">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>{language === 'bn' ? 'কোনো নতুন নোটিফিকেশন নেই' : 'No new notifications'}</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {alerts.map((item) => (
                <div key={item.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 shrink-0 mt-0.5">
                    {getAlertIcon(item.type, item.attributes?.alarm)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-100 capitalize">
                        {item.attributes?.alarm || item.type}
                      </span>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.serverTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {item.attributes?.message || 'Device status update recorded.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeSubTab === 'engine' ? (
        /* Engine Lock / Unlock Audit Logs */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              {language === 'bn' ? 'ইঞ্জিন ইমোবিলাইজার অডিট ট্রেইল' : 'Engine Immobilizer Audit Log'}
            </span>
            <span className="text-[10px] text-slate-400">
              {language === 'bn' ? 'সময় ও গতি সহ সংরক্ষিত' : 'Recorded with Time & Speed'}
            </span>
          </div>

          {engineLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Power className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>{language === 'bn' ? 'কোনো ইঞ্জিন কমান্ডের রেকর্ড নেই' : 'No engine control events recorded'}</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {engineLogs.map((log) => {
                const isCut = log.action === 'cut';
                const dateObj = new Date(log.timestamp);
                return (
                  <div key={log.id} className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 flex items-start space-x-3 shadow-md">
                    <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${
                      isCut 
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' 
                        : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    }`}>
                      <Power className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className={`font-extrabold text-xs ${isCut ? 'text-rose-300' : 'text-emerald-300'}`}>
                          {isCut 
                            ? (language === 'bn' ? '🚨 ইঞ্জিন লক (জ্বালানি সংযোগ বিচ্ছিন্ন)' : '🚨 Engine Cut (Immobilized)') 
                            : (language === 'bn' ? '⚡ ইঞ্জিন আনলক (জ্বালানি সংযোগ সচল)' : '⚡ Engine Restore (Power Active)')}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-emerald-400">
                          {language === 'bn' ? 'কার্যকর' : 'Executed'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                        <div className="flex items-center space-x-1 font-mono text-slate-300">
                          <Clock className="w-3 h-3 text-blue-400" />
                          <span>{dateObj.toLocaleDateString([], { day: '2-digit', month: 'short' })} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <span className="text-slate-400 font-mono">
                          {language === 'bn' ? `গতি: ${log.speed} km/h` : `Speed: ${log.speed} km/h`}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeSubTab === 'sensors' ? (
        /* Dynamic Sensor Event Logs (Filtered strictly by vehicle capabilities) */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              {language === 'bn' ? 'সেন্সর টেলিমেট্রিক্স ইভেন্ট লগ' : 'Sensor Telematics Event Log'}
            </span>
            <span className="text-[10px] text-slate-400">
              {capabilities.isBike 
                ? (language === 'bn' ? 'বাইক ভাইব্রেশন ও সিকিউরিটি অডিট' : 'Bike Security Audit') 
                : (language === 'bn' ? 'AC, ডোর ও ফুয়েল অডিট' : 'AC, Door & Fuel Audit')}
            </span>
          </div>

          {filteredSensorLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <ShieldCheck className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>
                {capabilities.isBike 
                  ? (language === 'bn' ? 'কোনো অস্বাভাবিক ঝাঁকুনি বা ভাইব্রেশন নেই (বাইক নিরাপদ)' : 'No vibration tamper alarms recorded (Vehicle Safe)')
                  : (language === 'bn' ? 'কোনো সেন্সর ইভেন্ট রেকর্ড নেই' : 'No sensor events recorded')}
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredSensorLogs.map((log) => {
                const dateObj = new Date(log.timestamp);
                return (
                  <div key={log.id} className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 flex items-start space-x-3 shadow-md">
                    <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
                      {log.sensorType === 'ac' ? (
                        <Fan className="w-4 h-4" />
                      ) : log.sensorType === 'door' ? (
                        <DoorClosed className="w-4 h-4 text-rose-400" />
                      ) : log.sensorType === 'fuel' ? (
                        <Fuel className="w-4 h-4 text-amber-400" />
                      ) : (
                        <Radio className="w-4 h-4 text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-xs text-slate-100">
                          {log.title}
                        </span>
                        <span className="text-[9px] font-mono text-cyan-300 bg-slate-900 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                          {log.value || log.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                        <div className="flex items-center space-x-1 font-mono text-slate-300">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{dateObj.toLocaleDateString([], { day: '2-digit', month: 'short' })} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">
                          {log.deviceName}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Fuel Economy, Mileage & Refill Intelligence Tab */
        <FuelMileageAnalyticsView />
      )}
    </div>
  );
};
