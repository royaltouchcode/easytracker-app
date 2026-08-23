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
  Lock,
  Radio
} from 'lucide-react';
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
    language 
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'alerts' | 'engine' | 'sensors'>('alerts');

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
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
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
            <h2 className="text-sm font-bold flex items-center space-x-1.5">
              <span>{language === 'bn' ? 'সিকিউরিটি অ্যালার্ট ও নোটিফিকেশন' : 'Security Alerts & Notifications'}</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            </h2>
            <p className="text-[10px] text-slate-400">
              {selectedDevice ? selectedDevice.name : (language === 'bn' ? 'সকল নোটিফিকেশন হিস্ট্রি' : 'All Security Stream Logs')}
            </p>
          </div>
        </div>

        {alerts.length > 0 && (
          <button
            onClick={markAlertsAsRead}
            className="px-2.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 font-bold text-xs flex items-center space-x-1 transition active:scale-95 shadow-sm"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'পড়া হয়েছে' : 'Mark Read'}</span>
          </button>
        )}
      </div>

      {/* Sub-Tabs Grid */}
      <div className="grid grid-cols-3 gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
        <button
          onClick={() => setActiveSubTab('alerts')}
          className={`py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition ${
            activeSubTab === 'alerts' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span className="truncate">{language === 'bn' ? 'সিকিউরিটি' : 'Security'} ({alerts.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('engine')}
          className={`py-1.5 px-1 rounded-xl font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition ${
            activeSubTab === 'engine' 
              ? 'bg-emerald-600 text-white shadow-md' 
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
                        <span>{new Date(item.eventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5 leading-tight">
                      {item.attributes?.message || `${item.type} alert triggered`}
                    </p>
                    <div className="text-[9.5px] text-slate-400 mt-1 font-mono">
                      {new Date(item.eventTime).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeSubTab === 'engine' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex-1">
          {engineLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Power className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>{language === 'bn' ? 'কোনো ইঞ্জিন লক বা চালুর হিস্ট্রি নেই' : 'No engine action logs recorded'}</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {engineLogs.map((log) => (
                <div key={log.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-start space-x-3">
                  <div className={`p-2 rounded-xl border shrink-0 mt-0.5 ${
                    log.action === 'cut' 
                      ? 'bg-rose-500/20 border-rose-500/30 text-rose-400' 
                      : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                  }`}>
                    <Power className="w-4 h-4" />
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
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400">
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
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl flex-1">
          {filteredSensorLogs.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <Fan className="w-8 h-8 mx-auto mb-2 text-slate-600" />
              <span>
                {language === 'bn' 
                  ? 'এই ডিভাইসের জন্য কোনো সেন্সর ইভেন্ট নেই' 
                  : 'No sensor logs for this vehicle profile'}
              </span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredSensorLogs.map((log) => (
                <div key={log.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-start space-x-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 shrink-0 mt-0.5">
                    <Fan className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-slate-100">
                        {log.title}
                      </span>
                      <div className="flex items-center space-x-1 text-[10px] text-slate-400">
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
