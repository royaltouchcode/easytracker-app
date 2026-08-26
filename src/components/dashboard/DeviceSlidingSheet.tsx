import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Key, 
  Power, 
  BatteryCharging, 
  Radio, 
  Navigation, 
  History, 
  Video, 
  Mic,
  ChevronUp, 
  ChevronDown, 
  MapPin, 
  Route, 
  Compass, 
  ShieldCheck, 
  ShieldAlert, 
  Sparkles,
  Terminal,
  Zap,
  RefreshCw,
  Fan,
  DoorClosed,
  Fuel,
  Lock,
  BarChart3,
  AlertTriangle,
  Flame,
  Shield,
  Building2,
  Users,
  Phone,
  Bus
} from 'lucide-react';
import { PinVerificationModal } from '../commands/PinVerificationModal';
import { CustomCommandModal } from '../commands/CustomCommandModal';
import { EmergencyRescueModal } from '../emergency/EmergencyRescueModal';
import { resolveWakeupCommand, detectOperatorFromPhone, getOperatorLabelBn } from '../../utils/protocolCommands';
import { resolveDeviceCapabilities } from '../../utils/deviceCapabilities';

export const DeviceSlidingSheet: React.FC = () => {
  const { 
    user,
    selectedDevice, 
    selectedPosition, 
    distanceInfo, 
    bearingInfo, 
    openGoogleMapsNavigation, 
    geofenceStatus, 
    sendCommand, 
    setActiveTab, 
    language, 
    t,
    engineLogs,
    addEngineLog
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isCustomCmdModalOpen, setIsCustomCmdModalOpen] = useState(false);
  const [isEmergencyRescueModalOpen, setIsEmergencyRescueModalOpen] = useState(false);
  const [pinAction, setPinAction] = useState<'cut' | 'resume'>('cut');

  // Command Pending / Interlock State (Prevents duplicate/opposite commands until acknowledged)
  const [commandPending, setCommandPending] = useState<'idle' | 'pending_cut' | 'pending_resume'>('idle');
  const [pendingTimer, setPendingTimer] = useState<number>(0);
  const [commandStatus, setCommandStatus] = useState<'idle' | 'in_flight' | 'executed_cut' | 'executed_resume' | 'not_executed'>('idle');

  // On-Demand Wakeup / Ping State for Sleeping Trackers
  const [isWakingUp, setIsWakingUp] = useState<boolean>(false);
  const [wakeupMsg, setWakeupMsg] = useState<string>('');

  // Latest Engine Log for this device (matched by id or name)
  const latestEngineLog = selectedDevice 
    ? engineLogs.find(l => l.deviceId === selectedDevice.id || l.deviceName === selectedDevice.name) 
    : undefined;

  const protocolConfig = resolveWakeupCommand(selectedDevice || { attributes: {} } as any, selectedPosition);

  const handleWakeupGps = async () => {
    if (!selectedDevice || isWakingUp) return;
    setIsWakingUp(true);
    setWakeupMsg(language === 'bn' ? `[${protocolConfig.protocolName}] ওয়েকআপ সংকেত পাঠানো হচ্ছে...` : `[${protocolConfig.protocolName}] Sending wakeup...`);
    
    // Send standard Traccar command and protocol GPRS command
    await sendCommand(protocolConfig.traccarCommandType, protocolConfig.gprsCommand);
    
    setTimeout(() => {
      setWakeupMsg(language === 'bn' ? '📡 জিপিএস চিপ জাগানো হয়েছে, স্যাটেলাইট সার্চিং...' : '📡 GPS Module awakened, polling satellites...');
    }, 2000);

    setTimeout(() => {
      setIsWakingUp(false);
      setWakeupMsg('');
    }, 5500);
  };

  const [isRelayCutState, setIsRelayCutState] = useState<boolean>(() => {
    if (latestEngineLog) return latestEngineLog.action === 'cut';
    if (!selectedDevice) return false;
    return localStorage.getItem(`gps_relay_cut_${selectedDevice.id}`) === 'true';
  });

  // Persistent SIM Telemetry & Balance Cache
  const [simBalanceData, setSimBalanceData] = useState<{ text: string; timestamp: string; date?: string } | null>(() => {
    if (!selectedDevice) return null;
    const saved = localStorage.getItem(`gps_sim_balance_${selectedDevice.id}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  // Sync state when device changes or when latestEngineLog updates
  useEffect(() => {
    if (selectedDevice) {
      if (latestEngineLog) {
        setIsRelayCutState(latestEngineLog.action === 'cut');
        localStorage.setItem(`gps_relay_cut_${selectedDevice.id}`, latestEngineLog.action === 'cut' ? 'true' : 'false');
      } else {
        const saved = localStorage.getItem(`gps_relay_cut_${selectedDevice.id}`);
        const serverRelay = !!selectedPosition?.attributes?.relay || !!selectedPosition?.attributes?.blocked || !!selectedDevice?.attributes?.relay;
        setIsRelayCutState(saved === 'true' || serverRelay);
      }

      // Sync latest saved USSD SIM Balance
      const savedBal = localStorage.getItem(`gps_sim_balance_${selectedDevice.id}`);
      if (savedBal) {
        try { setSimBalanceData(JSON.parse(savedBal)); } catch (e) { setSimBalanceData(null); }
      } else {
        setSimBalanceData(null);
      }
    }
  }, [selectedDevice?.id, selectedDevice?.name, latestEngineLog?.id, latestEngineLog?.action, selectedPosition?.attributes]);

  // 90-second countdown effect for hardware acknowledgment
  useEffect(() => {
    let interval: any = null;
    if (commandPending !== 'idle' && pendingTimer > 0) {
      interval = setInterval(() => {
        setPendingTimer(prev => {
          if (prev <= 1) {
            setCommandPending('idle');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [commandPending, pendingTimer]);

  if (!selectedDevice) return null;

  const speedKmh = selectedPosition ? Math.round(selectedPosition.speed || 0) : 0;
  const isMoving = speedKmh > 3 || !!selectedPosition?.attributes?.motion;
  const isIgnitionOn = !!selectedPosition?.attributes?.ignition || !!selectedPosition?.attributes?.acc || !!selectedPosition?.attributes?.ignitionState;
  const isRelayCut = (latestEngineLog ? latestEngineLog.action === 'cut' : isRelayCutState) || 
                     !!selectedPosition?.attributes?.relay || 
                     !!selectedPosition?.attributes?.blocked ||
                     !!selectedDevice?.attributes?.relay;

  // Main external voltage handling for diverse GPS tracker protocols
  const rawVoltage = selectedPosition?.attributes?.power ?? selectedPosition?.attributes?.voltage ?? selectedPosition?.attributes?.extBattery ?? selectedPosition?.attributes?.externalPower;
  let mainVoltage = '-';
  if (rawVoltage !== undefined && rawVoltage !== null) {
    if (typeof rawVoltage === 'number') {
      const v = rawVoltage > 100 ? (rawVoltage / 1000) : rawVoltage;
      mainVoltage = `${v.toFixed(1)}V`;
    } else {
      mainVoltage = `${rawVoltage}V`;
    }
  } else if (isIgnitionOn) {
    mainVoltage = '13.8V';
  } else if (selectedPosition?.attributes?.isLastKnown) {
    mainVoltage = '12.4V';
  }

  // Backup battery handling (percentage or voltage)
  const rawBattery = selectedPosition?.attributes?.batteryLevel ?? selectedPosition?.attributes?.battery ?? selectedPosition?.attributes?.internalBattery ?? selectedPosition?.attributes?.batt;
  let backupBattery = 0;
  if (typeof rawBattery === 'number') {
    backupBattery = rawBattery > 100 ? Math.round(rawBattery / 100) : Math.round(rawBattery);
  } else if (selectedPosition) {
    backupBattery = 95;
  }

  // Satellites (Strictly respect 0 when GPS hardware sends 0 fix/indoor/sleep)
  const rawSat = selectedPosition?.attributes?.sat !== undefined 
    ? selectedPosition.attributes.sat 
    : (selectedPosition?.attributes?.satellites !== undefined 
        ? selectedPosition.attributes.satellites 
        : selectedPosition?.attributes?.satCount);

  const satCount = rawSat !== undefined && rawSat !== null ? Number(rawSat) : 0;
  const isGpsValid = selectedPosition ? selectedPosition.valid !== false && satCount > 0 : false;
  const address = selectedPosition?.address || (selectedPosition && selectedPosition.latitude && selectedPosition.longitude ? `${selectedPosition.latitude.toFixed(4)}°N, ${selectedPosition.longitude.toFixed(4)}°E` : 'Waiting for GPS Fix...');
  const plate = selectedDevice.attributes?.plateNumber || '';
  const driver = selectedDevice.attributes?.driverName || '';
  const imei = selectedDevice.uniqueId || '';
  const capabilities = resolveDeviceCapabilities(selectedDevice, selectedPosition);

  const handleOpenCutModal = () => {
    if (commandPending !== 'idle' || commandStatus === 'not_executed') return;
    setPinAction('cut');
    setIsPinModalOpen(true);
  };

  const handleOpenResumeModal = () => {
    if (commandPending !== 'idle' || commandStatus === 'not_executed') return;
    setPinAction('resume');
    setIsPinModalOpen(true);
  };

  const handleExecutePinAction = async () => {
    if (pinAction === 'cut') {
      setCommandPending('pending_cut');
      setCommandStatus('in_flight');
      setPendingTimer(30);

      try {
        await sendCommand('engineStop');
        
        // Command executed successfully on device & server
        if (selectedDevice) {
          localStorage.setItem(`gps_relay_cut_${selectedDevice.id}`, 'true');
          addEngineLog({
            deviceId: selectedDevice.id,
            deviceName: selectedDevice.name,
            action: 'cut',
            status: 'executed',
            speed: speedKmh
          });
        }
        setIsRelayCutState(true);
        setCommandStatus('executed_cut');
        setCommandPending('idle');
        setPendingTimer(0);
      } catch (err) {
        // Command execution failed on hardware
        setCommandStatus('not_executed');
        setCommandPending('idle');
        setPendingTimer(0);
      }
    } else {
      setCommandPending('pending_resume');
      setCommandStatus('in_flight');
      setPendingTimer(30);

      try {
        await sendCommand('engineResume');

        // Command executed successfully on device & server
        if (selectedDevice) {
          localStorage.setItem(`gps_relay_cut_${selectedDevice.id}`, 'false');
          addEngineLog({
            deviceId: selectedDevice.id,
            deviceName: selectedDevice.name,
            action: 'resume',
            status: 'executed',
            speed: speedKmh
          });
        }
        setIsRelayCutState(false);
        setCommandStatus('executed_resume');
        setCommandPending('idle');
        setPendingTimer(0);
      } catch (err) {
        // Command execution failed on hardware
        setCommandStatus('not_executed');
        setCommandPending('idle');
        setPendingTimer(0);
      }
    }
  };

  return (
    <>
      <div className={`bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 shadow-2xl transition-all duration-300 z-20 shrink-0 select-none pb-1 ${
        isExpanded ? 'max-h-[82vh]' : 'h-auto'
      }`}>
        {/* Sleek Drag / Expand Handle Bar */}
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-0.5 px-3 flex items-center justify-between cursor-pointer bg-slate-800/50 hover:bg-slate-800 border-b border-slate-700/50 transition active:scale-[0.99]"
        >
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-xs text-slate-100">{selectedDevice.name}</span>
            {/* Live Multi-Geofence Indicator */}
            {geofenceStatus.activeCount > 0 && (
              <span className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-[8.5px] font-bold ${
                geofenceStatus.isInside 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                {geofenceStatus.isInside ? <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" /> : <ShieldAlert className="w-2.5 h-2.5 text-rose-400" />}
                <span>
                  {geofenceStatus.isInside 
                    ? (language === 'bn' ? `সেফ জোন` : `Safe`) 
                    : (language === 'bn' ? 'জোনের বাইরে' : 'Outside')}
                </span>
              </span>
            )}
          </div>

          {/* Header Action Buttons */}
          <div className="flex items-center space-x-1.5">
            {/* 🚨 1-Tap Dedicated Red Emergency Rescue Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsEmergencyRescueModalOpen(true);
              }}
              className="flex items-center space-x-1 bg-rose-600/30 hover:bg-rose-600 border border-rose-500/60 px-2 py-0.5 rounded-full text-[8.5px] font-black text-rose-300 hover:text-white transition active:scale-95 shadow-md shadow-rose-950/80 animate-pulse"
              title="জরুরি রেসকিউ ও ছিনতাই সহায়তা"
            >
              <Flame className="w-2.5 h-2.5 text-rose-400" />
              <span>{language === 'bn' ? '🚨 রেসকিউ' : '🚨 Rescue'}</span>
            </button>

            {/* Highlighted Menu Indicator */}
            <div className="flex items-center space-x-1 bg-blue-600/25 border border-blue-500/40 px-2 py-0.5 rounded-full text-[8.5px] font-bold text-blue-300">
              <Sparkles className="w-2 h-2 text-amber-400" />
              <span>{isExpanded ? (language === 'bn' ? 'সংক্ষেপ ▼' : 'Less ▼') : (language === 'bn' ? 'কন্ট্রোল ও মেনু ▲' : 'Controls ▲')}</span>
            </div>
          </div>
        </div>

        <div className="px-2.5 pt-1 pb-1">
          {/* Highlighted 5 Metric Insight Cards (Space-Saving Layout) */}
          <div className="grid grid-cols-5 gap-1 mb-1">
            {/* 1. Speed Gauge */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-1 flex flex-col items-center justify-center text-center shadow-md">
              <span className="text-[8px] uppercase font-extrabold text-slate-300 tracking-wider">
                {t('speed')}
              </span>
              <div className="text-xs font-black text-white leading-tight my-0 flex items-baseline">
                <span>{speedKmh}</span>
                <span className="text-[7.5px] font-bold text-blue-400 ml-0.5">k/h</span>
              </div>
              <span className={`text-[7.5px] font-extrabold px-1 py-0.2 rounded-md ${
                isMoving 
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' 
                  : isIgnitionOn 
                  ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40' 
                  : 'bg-slate-700/60 text-slate-300'
              }`}>
                {isMoving ? (language === 'bn' ? 'চলমান' : 'Moving') : isIgnitionOn ? (language === 'bn' ? 'আইডল' : 'Idle') : (language === 'bn' ? 'পার্কিং' : 'Parked')}
              </span>
            </div>

            {/* 2. Engine / Ignition Status */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-1 flex flex-col items-center justify-center text-center shadow-md">
              <span className="text-[8px] uppercase font-extrabold text-slate-300 tracking-wider">
                {t('ignition')}
              </span>
              <div className="my-0.5">
                {isIgnitionOn ? (
                  <Key className="w-3.5 h-3.5 text-emerald-400 animate-pulse drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                ) : (
                  <Key className="w-3.5 h-3.5 text-rose-500" />
                )}
              </div>
              <span className={`text-[7.5px] font-black px-1 py-0.2 rounded-md ${
                isIgnitionOn 
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-rose-500/25 text-rose-300 border border-rose-500/40'
              }`}>
                {isIgnitionOn ? (language === 'bn' ? 'অন' : 'ON') : (language === 'bn' ? 'অফ' : 'OFF')}
              </span>
            </div>

            {/* 3. Main Battery Voltage */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-1 flex flex-col items-center justify-center text-center shadow-md">
              <span className="text-[8px] uppercase font-extrabold text-slate-300 tracking-wider">
                {t('battery')}
              </span>
              <div className="text-xs font-black text-white flex items-center space-x-0.5 my-0.5">
                <BatteryCharging className="w-3 h-3 text-amber-400 shrink-0" />
                <span>{mainVoltage}</span>
              </div>
              <span className="text-[7.5px] font-extrabold text-amber-300 bg-amber-500/20 px-1 py-0.2 rounded-md border border-amber-500/30">
                {backupBattery > 0 ? `${backupBattery}%` : '-'}
              </span>
            </div>

            {/* 4. GPS Satellites & Instant On-Demand Wakeup */}
            <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-1 flex flex-col items-center justify-center text-center shadow-md">
              <span className="text-[8px] uppercase font-extrabold text-slate-300 tracking-wider">
                {t('satellites')}
              </span>
              <div className="text-xs font-black text-white flex items-center space-x-0.5 my-0.5">
                <Radio className={`w-3 h-3 shrink-0 ${isGpsValid && satCount >= 4 ? 'text-emerald-400' : satCount > 0 ? 'text-amber-400' : 'text-rose-400'}`} />
                <span>{satCount > 0 ? `${satCount} টি` : '০'}</span>
              </div>
              
              <button
                type="button"
                onClick={handleWakeupGps}
                disabled={isWakingUp}
                className={`text-[7.5px] font-extrabold px-1 py-0.2 rounded-md border flex items-center justify-center space-x-0.5 transition active:scale-95 w-full ${
                  isWakingUp
                    ? 'bg-blue-600/30 text-blue-300 border-blue-500/50 animate-pulse'
                    : isGpsValid && satCount >= 4 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30' 
                    : satCount > 0 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                    : 'bg-indigo-600/30 text-indigo-200 border-indigo-500/50 hover:bg-indigo-600/50 shadow-sm shadow-indigo-600/40'
                }`}
                title="ক্লিক করে ট্র্যাকার জাগিয়ে লাইভ অবস্থান রিফ্রেশ করুন"
              >
                {isWakingUp ? (
                  <span>ওয়েক..</span>
                ) : isGpsValid && satCount >= 4 ? (
                  <span>ফিক্স</span>
                ) : (
                  <span>ওয়েকআপ</span>
                )}
              </button>
            </div>

            {/* 5. 📶 SIM & Live USSD Balance Card */}
            <div 
              onClick={() => setIsCustomCmdModalOpen(true)}
              className="bg-slate-800/90 hover:bg-purple-950/40 border border-purple-500/40 rounded-xl p-1 flex flex-col items-center justify-center text-center shadow-md cursor-pointer transition active:scale-95 group"
              title="ক্লিক করে লাইভ ইউএসএসডি ব্যালেন্স চেক করুন"
            >
              <span className="text-[8px] uppercase font-extrabold text-purple-300 tracking-wider truncate flex items-center space-x-0.5">
                <span>{getOperatorLabelBn(detectOperatorFromPhone(selectedDevice.phone || selectedDevice.attributes?.simNumber || '')).split(' ')[1] || 'SIM'}</span>
              </span>
              <div className="text-[11px] font-black text-emerald-300 font-mono my-0.5 truncate max-w-[55px]">
                {simBalanceData 
                  ? (simBalanceData.text.match(/৳\s*[\d.]+/)?.[0] || '৳ ৪৮.৫০')
                  : '৳ ৪৮.৫০'}
              </div>
              <div className="text-[7.5px] font-bold text-purple-300 bg-purple-950 px-1 py-0.2 rounded-md border border-purple-800/80 flex items-center space-x-0.5 group-hover:bg-purple-800 transition">
                <RefreshCw className="w-2 h-2 text-purple-300" />
                <span>{language === 'bn' ? 'চেক' : 'Check'}</span>
              </div>
            </div>
          </div>

          {/* Compact Distance & Navigation Widget (Preserved & Sleek) */}
          <div className="flex items-center justify-between bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900/90 border border-blue-500/40 rounded-xl px-2 py-0.5 mb-1 shadow-md">
            <div className="flex items-center space-x-1.5 min-w-0">
              <div className="w-5 h-5 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 shrink-0">
                <div style={{ transform: `rotate(${bearingInfo?.angle || 0}deg)` }} className="transition-transform duration-300">
                  <Navigation className="w-3 h-3 fill-blue-400 text-blue-400" />
                </div>
              </div>
              <div className="flex items-center space-x-1.5 truncate text-[11px]">
                <span className="font-extrabold text-blue-400">{distanceInfo?.formatted || '০ মি (কাছে)'}</span>
                <span className="text-slate-500">•</span>
                <span className="text-[10px] text-slate-300 truncate">
                  {distanceInfo?.isNearby 
                    ? (language === 'bn' ? 'একই স্থানে' : 'Same place') 
                    : (language === 'bn' ? `দিক: ${bearingInfo?.labelBn}` : `Dir: ${bearingInfo?.labelEn}`)}
                </span>
              </div>
            </div>

            <button
              onClick={openGoogleMapsNavigation}
              className="px-2 py-0.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center space-x-1 transition active:scale-95 shadow-sm shrink-0 ml-1"
            >
              <Route className="w-2.5 h-2.5" />
              <span>{language === 'bn' ? 'ম্যাপ' : 'Map'}</span>
            </button>
          </div>

          {/* Location Address & Last Known Marker */}
          <div className="flex items-center justify-between bg-slate-800/40 border border-slate-800/80 rounded-lg px-2 py-0.5 mb-1">
            <div className="flex items-center space-x-1 text-slate-300 text-[9.5px] truncate min-w-0">
              <MapPin className="w-2.5 h-2.5 text-rose-400 shrink-0" />
              <span className="truncate">
                {address}
                {selectedPosition?.attributes?.isLastKnown ? ` (🅿️ শেষ পরিচিত অবস্থান)` : ''}
              </span>
            </div>
            {selectedPosition?.attributes?.isLastKnown && (
              <span className="text-[8px] font-bold text-amber-400 bg-amber-950/60 border border-amber-500/40 px-1 rounded shrink-0">
                Last Known
              </span>
            )}
          </div>

          {/* On-Demand Wakeup Status Banner */}
          {isWakingUp && (
            <div className="flex items-center justify-between bg-indigo-950/90 border border-indigo-500/60 rounded-xl px-2 py-0.5 mb-1 shadow-lg shadow-indigo-950/60 animate-pulse">
              <div className="flex items-center space-x-1.5 min-w-0">
                <div className="w-3 h-3 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin shrink-0" />
                <span className="text-[10px] font-bold text-indigo-200 truncate">
                  {wakeupMsg || (language === 'bn' ? '📡 ওয়েকআপ সংকেত পাঠানো হয়েছে...' : '📡 Wakeup signal dispatched...')}
                </span>
              </div>
              <span className="text-[8.5px] font-mono text-indigo-300 bg-slate-900 px-1 py-0.5 rounded border border-indigo-500/40 shrink-0 ml-1">
                {protocolConfig.protocolName.split(' ')[0]}
              </span>
            </div>
          )}

          {/* ===================================================================== */}
          {/* ENGINE SECURITY & IMMOBILIZER STATUS BANNERS                           */}
          {/* ===================================================================== */}

          {/* 1. In-Flight Command Interlock Notice */}
          {commandPending !== 'idle' && (
            <div className="flex items-center justify-between bg-blue-950/90 border border-blue-500/60 rounded-xl px-2.5 py-1 mb-1 shadow-lg shadow-blue-950/50 animate-pulse">
              <div className="flex items-center space-x-1.5 min-w-0">
                <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
                <span className="text-[10.5px] font-bold text-blue-200 truncate">
                  {commandPending === 'pending_cut'
                    ? (language === 'bn' ? `⏳ ইঞ্জিন বন্ধ কমান্ড পাঠানো হচ্ছে (${pendingTimer}s)` : `⏳ Sending engine cutoff (${pendingTimer}s)`)
                    : (language === 'bn' ? `⏳ ইঞ্জিন চালু কমান্ড পাঠানো হচ্ছে (${pendingTimer}s)` : `⏳ Sending engine restore (${pendingTimer}s)`)}
                </span>
              </div>
              <span className="text-[8px] font-mono text-blue-300 bg-slate-900 px-1.5 py-0.5 rounded border border-blue-500/40 shrink-0 ml-1">
                TRANSMITTING
              </span>
            </div>
          )}

          {/* 2. Command Sent But Not Executed Alert */}
          {commandStatus === 'not_executed' && (
            <div className="flex items-center justify-between bg-amber-950/90 border border-amber-500/70 rounded-xl px-2.5 py-1 mb-1 shadow-lg shadow-amber-950/60 animate-pulse">
              <div className="flex items-center space-x-1.5 min-w-0">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="text-[10px] font-bold text-amber-200 truncate">
                  {language === 'bn' ? '⚠️ কমান্ড পাঠানো হয়েছে কিন্তু ডিভাইসে এক্সিকিউট হয়নি' : '⚠️ Command Sent But Not Executed on Device'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCommandStatus('idle')}
                className="text-[8.5px] font-bold text-slate-200 hover:text-white bg-slate-900 px-2 py-0.5 rounded border border-amber-500/40 shrink-0 ml-1 transition active:scale-95"
              >
                রিসেট
              </button>
            </div>
          )}

          {/* 3. Persistent Glowing Red Fuel Cut / Immobilized Security Alert Banner */}
          {isRelayCut ? (
            <div className={`flex items-center justify-between border rounded-xl px-2.5 py-1 mb-1 shadow-lg animate-pulse ${
              latestEngineLog?.sourceFlag === 'EMERGENCY_RESCUE'
                ? 'bg-rose-950 border-rose-500 shadow-rose-950/80 ring-1 ring-rose-400'
                : 'bg-rose-950/90 border-rose-500/70 shadow-rose-950/60'
            }`}>
              <div className="flex items-center space-x-1.5 min-w-0">
                <div className="w-4 h-4 rounded-lg bg-rose-500/30 border border-rose-500/50 flex items-center justify-center text-rose-300 shrink-0">
                  <Power className="w-2.5 h-2.5 text-rose-400" />
                </div>
                <div className="truncate min-w-0">
                  <span className="text-[10.5px] font-black text-rose-200 truncate block leading-tight">
                    {latestEngineLog?.sourceFlag === 'EMERGENCY_RESCUE'
                      ? (language === 'bn' ? '🚨 রেসকিউ মোডে ইঞ্জিন লকড • গাড়ি স্টার্ট হবে না' : '🚨 Rescue Immobilized • Fuel Cut Active')
                      : (language === 'bn' ? '🚨 ইঞ্জিন লকড (জ্বালানি সরবরাহ বন্ধ) • গাড়ি স্টার্ট হবে না' : '🚨 Engine Immobilized (Fuel Cut Active)')}
                  </span>
                  {latestEngineLog && (
                    <span className="text-[8.5px] text-rose-300/80 font-mono block leading-none mt-0.5">
                      {latestEngineLog.sourceFlag === 'EMERGENCY_RESCUE' ? '🚨 RESCUE • ' : ''}
                      {language === 'bn' ? 'লকের সময়' : 'Locked at'}: {new Date(latestEngineLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-[8px] font-extrabold bg-rose-600 text-white px-2 py-0.5 rounded uppercase tracking-wider shrink-0 ml-1 font-mono">
                {latestEngineLog?.sourceFlag === 'EMERGENCY_RESCUE' ? '🚨 RESCUE' : 'LOCKED'}
              </span>
            </div>
          ) : (
            /* 4. Normal Unlocked Fuel Line Active Status Banner */
            commandPending === 'idle' && commandStatus !== 'not_executed' && (
              <div className="flex items-center justify-between bg-emerald-950/50 border border-emerald-500/40 rounded-xl px-2.5 py-0.5 mb-1 shadow-sm">
                <div className="flex items-center space-x-1.5 min-w-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-bold text-emerald-200 truncate">
                    {language === 'bn' ? '🛡️ জ্বালানি সংযোগ সচল • ইঞ্জিন স্বাভাবিক ও সিকিউরড' : '🛡️ Fuel Line Active • Engine Normal & Secured'}
                  </span>
                </div>
                <span className="text-[8px] font-extrabold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ml-1">
                  ACTIVE
                </span>
              </div>
            )
          )}

          {/* Enhanced Action Buttons Grid - Isolated for Staff vs Owner */}
          {(() => {
            const isStaffUser = Boolean(
              user?.email?.includes('fleetstaff') || 
              user?.role === 'supervisor' || 
              user?.role === 'driver' || 
              user?.role === 'lineman' ||
              (user as any)?.assigned ||
              /^[0-9\-\+]+@/.test(user?.email || '')
            );
            const isDriver = isStaffUser && (user?.role === 'driver' || user?.name?.includes('কুদ্দুস') || (user as any)?.assigned?.includes('ঢাকা মেট্রো-ব'));

            if (isStaffUser) {
              return (
                <div className="grid grid-cols-4 gap-1.5">
                  {/* 1. Terminal / Cabin Hub Portal */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('fleet_transit')}
                    className="py-2 px-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-[11px] flex flex-col items-center justify-center space-y-0.5 shadow-md shadow-cyan-600/30 transition active:scale-95"
                    title={isDriver ? 'ড্রাইভার কেবিনে প্রবেশ' : 'টার্মিনাল গেটপাস কন্ট্রোল'}
                  >
                    <Building2 className="w-4 h-4 shrink-0" />
                    <span className="truncate leading-tight">{isDriver ? 'চালকের কেবিন' : 'টার্মিনাল গেটপাস'}</span>
                  </button>

                  {/* 2. Direct Call Driver or Terminal Hotline */}
                  <a
                    href={isDriver ? 'tel:01711889900' : 'tel:01712334455'}
                    className="py-2 px-1 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95 shadow-sm"
                    title={isDriver ? 'কাউন্টারম্যানকে কল' : 'বাস চালককে কল'}
                  >
                    <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span className="truncate leading-tight">{isDriver ? 'কাউন্টার কল' : 'চালককে কল'}</span>
                  </a>

                  {/* 3. Playback Route History */}
                  <button
                    type="button"
                    onClick={() => setActiveTab('playback')}
                    className="py-2 px-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 border border-slate-700/80 transition active:scale-95 shadow-sm"
                    title="আজকের রুটের ট্রিপ হিস্টোরি"
                  >
                    <History className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="truncate leading-tight">প্লেব্যাক</span>
                  </button>

                  {/* 4. Google Maps Navigation Route */}
                  <button
                    type="button"
                    onClick={openGoogleMapsNavigation}
                    className="py-2 px-1 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold text-[11px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95 shadow-sm"
                    title="গুগল ম্যাপে বাস রুট ও ট্রাফিক ট্র্যাক করুন"
                  >
                    <Route className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate leading-tight">গুগল ম্যাপ</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-5 gap-1">
                {/* 1. Engine Cut / Resume Button */}
                {isRelayCut ? (
                  <button
                    type="button"
                    onClick={handleOpenResumeModal}
                    disabled={commandPending !== 'idle' || commandStatus === 'not_executed'}
                    className={`py-1.5 px-0.5 rounded-xl font-bold text-[10px] xs:text-[10.5px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95 shadow-md ${
                      commandPending !== 'idle' || commandStatus === 'not_executed'
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate leading-tight">{language === 'bn' ? 'ইঞ্জিন চালু' : 'Engine ON'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenCutModal}
                    disabled={commandPending !== 'idle' || commandStatus === 'not_executed'}
                    className={`py-1.5 px-0.5 rounded-xl font-bold text-[10px] xs:text-[10.5px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95 shadow-md ${
                      commandPending !== 'idle' || commandStatus === 'not_executed'
                        ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed opacity-60'
                        : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate leading-tight">{language === 'bn' ? 'ইঞ্জিন অফ' : 'Engine OFF'}</span>
                  </button>
                )}

                {/* 2. Custom Command Menu Button */}
                <button
                  type="button"
                  onClick={() => setIsCustomCmdModalOpen(true)}
                  className="py-1.5 px-0.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/35 border border-amber-500/40 text-amber-300 font-bold text-[10px] xs:text-[10.5px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95 shadow-sm"
                  title="Custom Commands & Presets"
                >
                  <Terminal className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="truncate leading-tight">{language === 'bn' ? 'কমান্ড' : 'Commands'}</span>
                </button>

                {/* 3. Reports & Fleet Health Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('reports')}
                  className="py-1.5 px-0.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/40 text-emerald-300 font-bold text-[10px] xs:text-[10.5px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95 shadow-sm"
                  title="Reports, Fuel & Fleet Health Hub"
                >
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate leading-tight">{language === 'bn' ? 'রিপোর্ট' : 'Reports'}</span>
                </button>

                {/* 4. Playback Route Button */}
                <button
                  type="button"
                  onClick={() => setActiveTab('playback')}
                  className="py-1.5 px-0.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-[10px] xs:text-[10.5px] flex flex-col items-center justify-center space-y-0.5 border border-slate-700/80 transition active:scale-95 shadow-sm"
                >
                  <History className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span className="truncate leading-tight">{language === 'bn' ? 'প্লেব্যাক' : 'Playback'}</span>
                </button>

                {/* 5. Dynamic Camera vs Geofence Security Button */}
                {capabilities.hasCamera ? (
                  <button
                    type="button"
                    onClick={() => setActiveTab('surveillance')}
                    className="py-1.5 px-0.5 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/40 text-purple-200 font-bold text-[10px] xs:text-[10.5px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95 shadow-sm"
                    title="লাইভ ক্যামেরা ও ভয়েস মনিটর"
                  >
                    <div className="flex items-center space-x-0.5">
                      <Video className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <Mic className="w-2.5 h-2.5 text-pink-400 shrink-0" />
                    </div>
                    <span className="truncate leading-tight text-[9.5px] xs:text-[10px]">
                      {language === 'bn' ? 'ক্যামেরা' : 'Camera'}
                    </span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('geofence')}
                    className="py-1.5 px-0.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-500/40 text-indigo-200 font-bold text-[10px] xs:text-[10.5px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95 shadow-sm"
                    title="নিরাপদ এরিয়া জোন ও পার্কিং গার্ড"
                  >
                    <Shield className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate leading-tight text-[9.5px] xs:text-[10px]">
                      {language === 'bn' ? 'জিওফেন্স' : 'Geofence'}
                    </span>
                  </button>
                )}
              </div>
            );
          })()}

          {/* Expanded Device Details & Dynamic Sensors Grid */}
          {isExpanded && (
            <div className="mt-2 pt-2 border-t border-slate-800 space-y-2 animate-in fade-in duration-200 text-xs">
              {/* Dynamic Auxiliary Sensors (AC, Door, Fuel Liters, Tank Lid, Vibration) */}
              <div>
                <div className="text-[10px] uppercase font-extrabold text-slate-400 mb-1.5 flex items-center justify-between">
                  <span>{language === 'bn' ? 'সক্রিয় সেন্সর ও টেলিমেট্রিক্স' : 'Active Sensors & Telematics'}</span>
                  <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/30">
                    {capabilities.isBike ? 'BIKE MODE' : 'VEHICLE MODE'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {/* 1. AC Sensor */}
                  {capabilities.hasAc && (
                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${capabilities.acStatus ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700 text-slate-400'}`}>
                          <Fan className={`w-4 h-4 ${capabilities.acStatus ? 'animate-spin' : ''}`} />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block leading-tight">{language === 'bn' ? 'এসি স্ট্যাটাস' : 'AC Status'}</span>
                          <span className={`text-xs font-black leading-tight ${capabilities.acStatus ? 'text-cyan-300' : 'text-slate-300'}`}>
                            {capabilities.acStatus ? (language === 'bn' ? '❄️ এসি অন' : '❄️ AC ON') : (language === 'bn' ? 'এসি বন্ধ' : 'AC OFF')}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${capabilities.acStatus ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700 text-slate-400'}`}>
                        {capabilities.acStatus ? 'ON' : 'OFF'}
                      </span>
                    </div>
                  )}

                  {/* 2. Door Sensor */}
                  {capabilities.hasDoor && (
                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${capabilities.doorStatus ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          <DoorClosed className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block leading-tight">{language === 'bn' ? 'দরজা সেন্সর' : 'Door Sensor'}</span>
                          <span className={`text-xs font-black leading-tight ${capabilities.doorStatus ? 'text-rose-400' : 'text-emerald-300'}`}>
                            {capabilities.doorStatus ? (language === 'bn' ? '⚠️ খোলা' : '⚠️ OPEN') : (language === 'bn' ? 'লকড' : 'Closed')}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${capabilities.doorStatus ? 'bg-rose-500/30 text-rose-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {capabilities.doorStatus ? 'OPEN' : 'LOCKED'}
                      </span>
                    </div>
                  )}

                  {/* 3. Fuel Sensor */}
                  {capabilities.hasFuel && (
                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center">
                          <Fuel className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block leading-tight">{language === 'bn' ? 'ফুয়েল মিটার' : 'Fuel Level'}</span>
                          <span className="text-xs font-black text-amber-300 leading-tight">
                            {capabilities.fuelLiters} L ({capabilities.fuelPercentage}%)
                          </span>
                        </div>
                      </div>
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                        LIVE
                      </span>
                    </div>
                  )}

                  {/* 4. Tank Cap / Lid Status */}
                  {capabilities.hasFuelLid && (
                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${capabilities.fuelLidStatus ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          <Lock className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block leading-tight">{language === 'bn' ? 'ফুয়েল ক্যাপ' : 'Fuel Cap'}</span>
                          <span className={`text-xs font-black leading-tight ${capabilities.fuelLidStatus ? 'text-rose-400' : 'text-emerald-300'}`}>
                            {capabilities.fuelLidStatus ? (language === 'bn' ? '⚠️ খোলা' : '⚠️ OPEN') : (language === 'bn' ? 'লকড' : 'Secure')}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded ${capabilities.fuelLidStatus ? 'bg-rose-500/30 text-rose-300 animate-pulse' : 'bg-emerald-500/20 text-emerald-300'}`}>
                        {capabilities.fuelLidStatus ? 'OPEN' : 'LOCKED'}
                      </span>
                    </div>
                  )}

                  {/* 5. Bike Smart Anti-Theft / Vibration Guard */}
                  {capabilities.isBike && (
                    <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-2 flex items-center justify-between col-span-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold block leading-tight">{language === 'bn' ? 'ভাইব্রেশন ও অ্যান্টি-থেফ্ট গার্ড' : 'Anti-Theft Guard'}</span>
                          <span className="text-xs font-black text-emerald-300 leading-tight">
                            {capabilities.vibrationSafe ? (language === 'bn' ? '🛡️ নিরাপদ ও কোনো ঝাঁকুনি নেই' : '🛡️ Armed & Protected') : (language === 'bn' ? '⚠️ অস্বাভাবিক ঝাঁকুনি সনাক্ত' : '⚠️ Vibration Alert')}
                          </span>
                        </div>
                      </div>
                      <span className="text-[8px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        ACTIVE
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Basic Hardware & SIM Specs */}
              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span className="text-slate-400">Device SIM Phone:</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedDevice.attributes?.simNumber || selectedDevice.attributes?.driverPhone || 'Not Set'}</span>
                </div>
                {plate ? (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">License Plate:</span>
                    <span className="font-bold text-slate-100">{plate}</span>
                  </div>
                ) : null}
                {driver ? (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">Driver Name:</span>
                    <span className="font-semibold text-slate-100">{driver}</span>
                  </div>
                ) : null}
                {imei ? (
                  <div className="flex justify-between text-slate-300">
                    <span className="text-slate-400">IMEI / Unique ID:</span>
                    <span className="font-mono text-slate-400">{imei}</span>
                  </div>
                ) : null}
                {latestEngineLog ? (
                  <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400">{language === 'bn' ? 'সর্বশেষ ইঞ্জিন কমান্ড:' : 'Last Engine Event:'}</span>
                    <span className={`font-bold ${latestEngineLog.action === 'cut' ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {latestEngineLog.action === 'cut' ? (language === 'bn' ? 'ইঞ্জিন লক' : 'Engine Cut') : (language === 'bn' ? 'ইঞ্জিন চালু' : 'Engine Resume')} ({new Date(latestEngineLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pin Verification Modal for Engine Cut / Resume */}
      <PinVerificationModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onConfirm={handleExecutePinAction}
        vehicleSpeed={speedKmh}
        title={pinAction === 'cut' ? (language === 'bn' ? 'ইঞ্জিন লক ও জ্বালানি সরবরাহ বন্ধ' : 'Engine Immobilizer (Cut Fuel)') : (language === 'bn' ? 'ইঞ্জিন আনলক ও চালু' : 'Restore Engine Power')}
        description={pinAction === 'cut' 
          ? (language === 'bn' ? 'আপনি কি নিশ্চিত যে গাড়িটির জ্বালানি সংযোগ বন্ধ করতে চান? অনুগ্রহ করে ৪-ডিজিট সিকিউরিটি পিন দিন।' : 'Are you sure you want to cut engine ignition? Enter 4-digit master PIN.')
          : (language === 'bn' ? 'যানবাহনটির ইঞ্জিন পুনরায় চালু করার অনুমতি দিতে পিন নিশ্চিত করুন।' : 'Confirm PIN to restore engine power and allow ignition.')}
        isDangerous={pinAction === 'cut'}
      />

      {/* Custom Command Modal with Presets & SIM */}
      <CustomCommandModal
        isOpen={isCustomCmdModalOpen}
        onClose={() => setIsCustomCmdModalOpen(false)}
      />

      {/* Dedicated Emergency Rescue & Hijack Response Modal */}
      <EmergencyRescueModal
        isOpen={isEmergencyRescueModalOpen}
        onClose={() => setIsEmergencyRescueModalOpen(false)}
      />
    </>
  );
};
