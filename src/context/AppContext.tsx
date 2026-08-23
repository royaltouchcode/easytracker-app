import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Device, 
  Position, 
  EventLog, 
  CommandHistory, 
  Geofence, 
  MediaEvidence, 
  ServerConfig, 
  UserSession, 
  MapLayerType, 
  VehicleType, 
  EngineLog, 
  SensorLog,
  FuelRefillLog,
  AlertFeedbackMode
} from '../types/traccar';
import { traccarApi } from '../services/traccarApi';
import { traccarSocket } from '../services/traccarSocket';
import { audioAlertService } from '../services/audioAlertService';

export type TabType = 'map' | 'reports' | 'playback' | 'commands' | 'surveillance' | 'geofence' | 'alerts' | 'settings';
export type Language = 'en' | 'bn';

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, language: Language = 'bn'): { km: number; formatted: string; isNearby: boolean } {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  
  if (d < 0.03) {
    return { 
      km: d, 
      formatted: language === 'bn' ? '০ মি (বাইকের কাছেই আছেন)' : '0 m (At vehicle)', 
      isNearby: true 
    };
  }
  if (d < 1) {
    const meters = Math.round(d * 1000);
    return { 
      km: d, 
      formatted: language === 'bn' ? `${meters} মিটার` : `${meters} m`, 
      isNearby: false 
    };
  }
  return { 
    km: d, 
    formatted: language === 'bn' ? `${d.toFixed(2)} কিমি` : `${d.toFixed(2)} km`, 
    isNearby: false 
  };
}

export function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): { angle: number; labelBn: string; labelEn: string } {
  const y = Math.sin((lon2 - lon1) * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
  const x = Math.cos(lat1 * Math.PI / 180) * Math.sin(lat2 * Math.PI / 180) -
            Math.sin(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.cos((lon2 - lon1) * Math.PI / 180);
  let brng = Math.atan2(y, x) * 180 / Math.PI;
  brng = (brng + 360) % 360;

  const directions = [
    { labelBn: 'উত্তর (N ↑)', labelEn: 'North (N ↑)' },
    { labelBn: 'উত্তর-পূর্ব (NE ↗)', labelEn: 'North-East (NE ↗)' },
    { labelBn: 'পূর্ব (E →)', labelEn: 'East (E →)' },
    { labelBn: 'দক্ষিণ-পূর্ব (SE ↘)', labelEn: 'South-East (SE ↘)' },
    { labelBn: 'দক্ষিণ (S ↓)', labelEn: 'South (S ↓)' },
    { labelBn: 'দক্ষিণ-পশ্চিম (SW ↙)', labelEn: 'South-West (SW ↙)' },
    { labelBn: 'পশ্চিম (W ←)', labelEn: 'West (W ←)' },
    { labelBn: 'উত্তর-পশ্চিম (NW ↖)', labelEn: 'North-West (NW ↖)' }
  ];
  const index = Math.round(brng / 45) % 8;
  return { angle: Math.round(brng), labelBn: directions[index].labelBn, labelEn: directions[index].labelEn };
}

interface AppContextType {
  user: UserSession | null;
  serverConfig: ServerConfig;
  setServerConfig: (config: ServerConfig) => void;
  login: (emailOrUser: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;

  devices: Device[];
  selectedDeviceId: number;
  setSelectedDeviceId: (id: number) => void;
  selectedDevice: Device | undefined;
  positions: Record<number, Position>;
  selectedPosition: Position | undefined;
  updateDeviceProfile: (id: number, partial: Partial<Device>) => void;

  userLocation: UserLocation | null;
  requestUserLocation: () => void;
  distanceInfo: { km: number; formatted: string; isNearby: boolean };
  bearingInfo: { angle: number; labelBn: string; labelEn: string };
  openGoogleMapsNavigation: () => void;

  mapLayer: MapLayerType;
  setMapLayer: (layer: MapLayerType) => void;
  showTraffic: boolean;
  setShowTraffic: (show: boolean) => void;
  showDistanceLine: boolean;
  setShowDistanceLine: (show: boolean) => void;
  showGeofenceOnMap: boolean;
  setShowGeofenceOnMap: (show: boolean) => void;

  commandHistory: CommandHistory[];
  sendCommand: (type: string, rawCmd?: string, data?: any) => Promise<{ success: boolean; message?: string }>;

  geofences: Geofence[];
  addGeofence: (geo: Omit<Geofence, 'id'>) => void;
  updateGeofence: (id: number, geo: Partial<Geofence>) => void;
  deleteGeofence: (id: number) => void;
  toggleGeofence: (id: number) => void;
  geofenceStatus: { isInside: boolean; activeZoneNames: string[]; activeCount: number };

  evidenceList: MediaEvidence[];
  addEvidence: (evidence: Omit<MediaEvidence, 'id' | 'timestamp'>) => void;
  deleteEvidence: (id: string) => void;

  alerts: EventLog[];
  unreadAlertCount: number;
  markAlertsAsRead: () => void;
  triggerManualAlert: (alarmType: string, msg: string) => void;

  engineLogs: EngineLog[];
  addEngineLog: (log: Omit<EngineLog, 'id' | 'timestamp'>) => void;

  sensorLogs: SensorLog[];
  addSensorLog: (log: Omit<SensorLog, 'id' | 'timestamp'>) => void;

  fuelRefillLogs: FuelRefillLog[];
  addFuelRefillLog: (log: Omit<FuelRefillLog, 'id' | 'timestamp'>) => void;
  deleteFuelRefillLog: (id: string) => void;

  alertFeedbackMode: AlertFeedbackMode;
  setAlertFeedbackMode: (mode: AlertFeedbackMode) => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  audioAlertsEnabled: boolean;
  setAudioAlertsEnabled: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    app_title: 'EasyTracker',
    live_tracking: 'Live Map',
    playback: 'Playback',
    commands: 'Commands',
    surveillance: 'Cam & Voice',
    geofence: 'Geofence',
    alerts: 'Alerts',
    settings: 'Settings',
    speed: 'Speed',
    ignition: 'Ignition',
    engine_on: 'Engine ON',
    engine_off: 'Engine OFF',
    battery: 'Battery',
    satellites: 'Sats',
    gsm_signal: 'GSM',
    cut_engine: 'Cut Engine',
    resume_engine: 'Start Engine',
    distance_to_car: 'Distance to Vehicle',
    direction: 'Direction',
    navigate_to_car: 'Navigate in Maps',
    my_location: 'My Location',
  },
  bn: {
    app_title: 'ইজিট্র্যাকার',
    live_tracking: 'লাইভ ম্যাপ',
    playback: 'প্লেব্যাক',
    commands: 'কমান্ড',
    surveillance: 'ক্যাম ও ভয়েস',
    geofence: 'জিওফেন্স',
    alerts: 'অ্যালার্ট',
    settings: 'সেটিংস',
    speed: 'গতিবেগ',
    ignition: 'ইগনিশন',
    engine_on: 'ইঞ্জিন চালু',
    engine_off: 'ইঞ্জিন বন্ধ',
    battery: 'ব্যাটারি',
    satellites: 'স্যাটেলাইট',
    gsm_signal: 'জিএসএম',
    cut_engine: 'ইঞ্জিন লক (অফ)',
    resume_engine: 'ইঞ্জিন আনলক (অন)',
    distance_to_car: 'গাড়ির দূরত্ব',
    direction: 'দিকনির্দেশ',
    navigate_to_car: 'গুগল ম্যাপে ডিরেকশন',
    my_location: 'আমার অবস্থান',
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem('gps_user_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return null;
  });

  const [serverConfig, setServerConfig] = useState<ServerConfig>(() => {
    const saved = localStorage.getItem('gps_server_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Traccar Demo 3',
      url: 'https://demo3.traccar.org',
      port: '5023',
      isDemo: true
    };
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('map');
  
  const [devices, setDevices] = useState<Device[]>(() => {
    const savedCustom = localStorage.getItem('gps_saved_device_profile');
    if (savedCustom) {
      try { return [JSON.parse(savedCustom)]; } catch (e) {}
    }
    return [
      {
        id: 1,
        name: 'My Bike (আমার বাইক)',
        uniqueId: '',
        status: 'online',
        disabled: false,
        lastUpdate: new Date().toISOString(),
        category: 'motorcycle',
        attributes: {
          color: '#3b82f6',
          plateNumber: '',
          driverName: '',
          driverPhone: '',
          sos1: '',
          sos2: '',
          sos3: '',
          speedLimit: 60
        }
      }
    ];
  });

  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(devices[0]?.id || 1);
  const [positions, setPositions] = useState<Record<number, Position>>(() => {
    try {
      const stored = localStorage.getItem('gps_last_known_positions');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && Object.keys(parsed).length > 0) return parsed;
      }
    } catch (e) {}
    return {
      1: {
        id: 101,
        deviceId: 1,
        protocol: 'osmand',
        serverTime: new Date().toISOString(),
        deviceTime: new Date().toISOString(),
        fixTime: new Date().toISOString(),
        outdated: false,
        valid: true,
        latitude: 23.7937,
        longitude: 90.4066,
        altitude: 12,
        speed: 0,
        course: 45,
        address: 'Gulshan-2, Dhaka, Bangladesh',
        accuracy: 5,
        attributes: {
          ignition: true,
          motion: false,
          batteryLevel: 98,
          satellites: 14,
          power: 12.6,
          isLastKnown: true
        }
      }
    };
  });
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const [mapLayer, setMapLayer] = useState<MapLayerType>('google_hybrid');
  const [showTraffic, setShowTraffic] = useState(true);
  const [showDistanceLine, setShowDistanceLine] = useState(true);
  const [showGeofenceOnMap, setShowGeofenceOnMap] = useState(true);

  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);

  // Persistent Multiple Geofences (Default Home & Office Safe Zones)
  const [geofences, setGeofences] = useState<Geofence[]>(() => {
    const saved = localStorage.getItem('gps_saved_geofences');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 101,
        name: 'Home Safe Zone (বাসা)',
        description: 'Home Parking Boundary',
        area: 'CIRCLE (23.7937 90.4066, 350)',
        latitude: 23.7937,
        longitude: 90.4066,
        radius: 350,
        attributes: { color: '#3b82f6', alertOnEnter: true, alertOnExit: true, enabled: true }
      },
      {
        id: 102,
        name: 'Office Zone (অফিস)',
        description: 'Office Parking Perimeter',
        area: 'CIRCLE (23.7808 90.4152, 400)',
        latitude: 23.7808,
        longitude: 90.4152,
        radius: 400,
        attributes: { color: '#10b981', alertOnEnter: true, alertOnExit: true, enabled: true }
      }
    ];
  });

  const [evidenceList, setEvidenceList] = useState<MediaEvidence[]>([]);
  const [alerts, setAlerts] = useState<EventLog[]>([]);

  // Alert Feedback Mode (Sound + Vibration, Only Sound, Only Vibration, SMS, Full Alarm, Silent)
  const [alertFeedbackMode, setAlertFeedbackModeState] = useState<AlertFeedbackMode>(() => {
    const saved = localStorage.getItem('gps_alert_feedback_mode') as AlertFeedbackMode;
    return saved || 'sound_vibration';
  });

  const setAlertFeedbackMode = (mode: AlertFeedbackMode) => {
    setAlertFeedbackModeState(mode);
    localStorage.setItem('gps_alert_feedback_mode', mode);
  };

  const [language, setLanguage] = useState<Language>('bn');
  const [audioAlertsEnabled, setAudioAlertsEnabled] = useState(true);

  // Physical Device Feedback Engine (Audio + Web Vibration API)
  const triggerAlertFeedback = (alarmType: string, _msg?: string) => {
    if (alertFeedbackMode === 'silent') return;
    const shouldSound = alertFeedbackMode === 'only_sound' || alertFeedbackMode === 'sound_vibration' || alertFeedbackMode === 'sms_sound_vibration';
    const shouldVibrate = alertFeedbackMode === 'only_vibration' || alertFeedbackMode === 'sound_vibration' || alertFeedbackMode === 'sms_sound_vibration';

    if (shouldSound && audioAlertsEnabled) {
      audioAlertService.playAlert(alarmType as any);
    }
    if (shouldVibrate && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 150, 400]);
      } catch (e) {
        console.warn('Vibration API not supported on this platform:', e);
      }
    }
  };

  // Persistent Engine Event / Lock-Unlock Audit Logs
  const [engineLogs, setEngineLogs] = useState<EngineLog[]>(() => {
    const saved = localStorage.getItem('gps_engine_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'eng-1',
        deviceId: 1,
        deviceName: 'mdaaziz',
        action: 'cut',
        status: 'executed',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        speed: 0
      }
    ];
  });

  const addEngineLog = (log: Omit<EngineLog, 'id' | 'timestamp'>) => {
    const newLog: EngineLog = {
      ...log,
      id: 'eng-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setEngineLogs(prev => {
      const next = [newLog, ...prev];
      localStorage.setItem('gps_engine_logs', JSON.stringify(next));
      return next;
    });
    triggerAlertFeedback('ignition', 'Engine Event');
  };

  // Sensor Event Audit Logs (AC, Door, Fuel Drops, Tank Lid, Vibration)
  const [sensorLogs, setSensorLogs] = useState<SensorLog[]>(() => {
    const saved = localStorage.getItem('gps_sensor_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'sens-1',
        deviceId: 1,
        deviceName: 'mdaaziz',
        sensorType: 'vibration',
        title: 'ভাইব্রেশন সেন্সর সচল ও নিরাপদ',
        status: 'armed',
        value: 'Armed & Safe',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      }
    ];
  });

  const addSensorLog = (log: Omit<SensorLog, 'id' | 'timestamp'>) => {
    const newLog: SensorLog = {
      ...log,
      id: 'sens-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setSensorLogs(prev => {
      const next = [newLog, ...prev];
      localStorage.setItem('gps_sensor_logs', JSON.stringify(next));
      return next;
    });
    triggerAlertFeedback('vibration', 'Sensor Alert');
  };

  // Fuel Refill History Logs (Zero demo data rule - only real user entries)
  const [fuelRefillLogs, setFuelRefillLogs] = useState<FuelRefillLog[]>(() => {
    const saved = localStorage.getItem('gps_fuel_refill_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  const addFuelRefillLog = (log: Omit<FuelRefillLog, 'id' | 'timestamp'>) => {
    const newEntry: FuelRefillLog = {
      ...log,
      id: 'refill-' + Date.now(),
      timestamp: new Date().toISOString()
    };
    setFuelRefillLogs(prev => {
      const next = [newEntry, ...prev];
      localStorage.setItem('gps_fuel_refill_logs', JSON.stringify(next));
      return next;
    });
  };

  const deleteFuelRefillLog = (id: string) => {
    setFuelRefillLogs(prev => {
      const next = prev.filter(l => l.id !== id);
      localStorage.setItem('gps_fuel_refill_logs', JSON.stringify(next));
      return next;
    });
  };

  // Unified Unread Counter across Alerts, Engine Logs, and Sensor Events
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    const saved = localStorage.getItem('gps_last_read_alerts_ts');
    return saved ? Number(saved) : Date.now() - 86400000;
  });

  const unreadAlerts = alerts.filter(a => new Date(a.serverTime).getTime() > lastReadTimestamp).length;
  const unreadEngine = engineLogs.filter(e => new Date(e.timestamp).getTime() > lastReadTimestamp).length;
  const unreadSensors = sensorLogs.filter(s => new Date(s.timestamp).getTime() > lastReadTimestamp).length;
  const unreadAlertCount = unreadAlerts + unreadEngine + unreadSensors;

  const markAlertsAsRead = () => {
    const now = Date.now();
    setLastReadTimestamp(now);
    localStorage.setItem('gps_last_read_alerts_ts', String(now));
  };

  const requestUserLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        (err) => {
          console.warn('Phone GPS error:', err);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  };

  const syncServerData = async () => {
    try {
      const realDevices = await traccarApi.getDevices();
      if (realDevices && realDevices.length > 0) {
        const savedCustom = localStorage.getItem('gps_saved_device_profile');
        const customParsed = savedCustom ? JSON.parse(savedCustom) : null;

        const merged = realDevices.map(d => ({
          ...d,
          category: customParsed?.category || d.category || 'motorcycle',
          attributes: {
            ...d.attributes,
            ...(customParsed?.attributes || {})
          }
        }));

        setDevices(merged);
        setSelectedDeviceId(merged[0].id);

        const realPositions = await traccarApi.getPositions();
        if (realPositions && realPositions.length > 0) {
          setPositions(prev => mergePositionsSafely(realPositions, prev));

          // Update initial geofence center to real vehicle position
          setGeofences(prev => {
            if (prev.length > 0 && prev[0].id === 101 && prev[0].latitude === 23.7937) {
              const updated = prev.map((g, idx) => idx === 0 ? { ...g, latitude: realPositions[0].latitude, longitude: realPositions[0].longitude } : g);
              localStorage.setItem('gps_saved_geofences', JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      }
    } catch (e) {
      console.warn('Sync server data error:', e);
    }
  };

  // Helper to safely preserve Last Known Valid GPS Position when device wakes with 0 satellites
  const mergePositionsSafely = (
    incoming: Position[], 
    previous: Record<number, Position>
  ): Record<number, Position> => {
    let storedLastKnown: Record<number, Position> = {};
    try {
      const storedLastKnownRaw = localStorage.getItem('gps_last_known_positions');
      if (storedLastKnownRaw) storedLastKnown = JSON.parse(storedLastKnownRaw);
    } catch (e) {}

    const next = { ...previous };

    incoming.forEach(p => {
      const hasValidCoords = typeof p.latitude === 'number' && 
                             typeof p.longitude === 'number' && 
                             p.latitude !== 0 && 
                             p.longitude !== 0 &&
                             !isNaN(p.latitude) && 
                             !isNaN(p.longitude);

      if (hasValidCoords) {
        storedLastKnown[p.deviceId] = p;
        next[p.deviceId] = {
          ...p,
          attributes: {
            ...p.attributes,
            isLastKnown: false
          }
        };
      } else {
        const fallback = previous[p.deviceId] || storedLastKnown[p.deviceId];
        if (fallback && fallback.latitude && fallback.longitude && fallback.latitude !== 0) {
          next[p.deviceId] = {
            ...p,
            latitude: fallback.latitude,
            longitude: fallback.longitude,
            altitude: fallback.altitude || 0,
            course: fallback.course || 0,
            address: fallback.address || p.address,
            attributes: {
              ...p.attributes,
              isLastKnown: true
            }
          };
        } else {
          next[p.deviceId] = p;
        }
      }
    });

    try {
      localStorage.setItem('gps_last_known_positions', JSON.stringify(storedLastKnown));
    } catch (e) {}

    return next;
  };

  useEffect(() => {
    requestUserLocation();
    traccarApi.setServer(serverConfig.url, serverConfig.port);
    traccarSocket.connect(serverConfig.url);

    syncServerData();

    let watchId: number | null = null;
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setUserLocation({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            accuracy: pos.coords.accuracy
          });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 5000 }
      );
    }

    const interval = setInterval(() => {
      traccarApi.getPositions().then(realPositions => {
        if (realPositions && realPositions.length > 0) {
          setPositions(prev => mergePositionsSafely(realPositions, prev));
        }
      });
    }, 5000);

    const unsubscribe = traccarSocket.subscribe((data) => {
      if (data.positions && data.positions.length > 0) {
        setPositions((prev) => mergePositionsSafely(data.positions!, prev));
      }
      if (data.devices && data.devices.length > 0) {
        setDevices(data.devices);
      }
    });

    return () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      clearInterval(interval);
      unsubscribe();
      traccarSocket.disconnect();
    };
  }, [serverConfig]);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const selectedPosition = selectedDevice ? positions[selectedDevice.id] : Object.values(positions)[0];

  const effectiveUserLat = userLocation?.latitude || selectedPosition?.latitude;
  const effectiveUserLon = userLocation?.longitude || selectedPosition?.longitude;
  const effectiveVehLat = selectedPosition?.latitude;
  const effectiveVehLon = selectedPosition?.longitude;

  const distanceInfo = (effectiveUserLat && effectiveUserLon && effectiveVehLat && effectiveVehLon)
    ? calculateDistance(effectiveUserLat, effectiveUserLon, effectiveVehLat, effectiveVehLon, language)
    : { km: 0, formatted: language === 'bn' ? '০ মি (বাইকের কাছেই আছেন)' : '0 m (At vehicle)', isNearby: true };

  const bearingInfo = (effectiveUserLat && effectiveUserLon && effectiveVehLat && effectiveVehLon)
    ? calculateBearing(effectiveUserLat, effectiveUserLon, effectiveVehLat, effectiveVehLon)
    : { angle: 0, labelBn: 'উত্তর (N ↑)', labelEn: 'North (N ↑)' };

  // Calculate status for ALL active geofences
  const activeGeofences = geofences.filter(g => (g.attributes as any)?.enabled !== false);
  const insideZones: string[] = [];

  if (effectiveVehLat && effectiveVehLon) {
    activeGeofences.forEach(geo => {
      const dist = calculateDistance(geo.latitude, geo.longitude, effectiveVehLat, effectiveVehLon, language);
      if ((dist.km * 1000) <= geo.radius) {
        insideZones.push(geo.name);
      }
    });
  }

  const geofenceStatus = {
    isInside: insideZones.length > 0,
    activeZoneNames: insideZones,
    activeCount: activeGeofences.length
  };

  const openGoogleMapsNavigation = () => {
    if (!effectiveVehLat || !effectiveVehLon) return;
    let url = `https://www.google.com/maps/dir/?api=1&destination=${effectiveVehLat},${effectiveVehLon}`;
    if (userLocation) {
      url += `&origin=${userLocation.latitude},${userLocation.longitude}`;
    }
    window.open(url, '_blank');
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language]?.[key] || key;
  };

  const login = async (emailOrUser: string, pass: string) => {
    const res = await traccarApi.login(emailOrUser, pass);
    if (res.success && res.user) {
      setUser(res.user);
      localStorage.setItem('gps_user_session', JSON.stringify(res.user));
      await syncServerData();
    }
    return res;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gps_user_session');
    traccarApi.clearAuth();
  };

  const updateDeviceProfile = (id: number, partial: Partial<Device>) => {
    setDevices(prev => {
      const updated = prev.map(d => {
        if (d.id === id) {
          const newDev = {
            ...d,
            ...partial,
            attributes: {
              ...d.attributes,
              ...(partial.attributes || {})
            }
          };
          localStorage.setItem('gps_saved_device_profile', JSON.stringify(newDev));
          return newDev;
        }
        return d;
      });
      return updated;
    });
  };

  const sendCommand = async (type: string, rawCmd?: string, data?: any) => {
    if (!selectedDevice) return { success: false, message: 'No vehicle selected' };
    const cmdId = 'cmd-' + Date.now();
    setCommandHistory(prev => [
      { id: cmdId, deviceId: selectedDevice.id, deviceName: selectedDevice.name, commandType: type, rawCommand: rawCmd || type, status: 'sending', timestamp: new Date().toISOString() },
      ...prev
    ]);
    const res = await traccarApi.sendCommand({ deviceId: selectedDevice.id, type: type === 'custom' ? 'custom' : type, attributes: { data: rawCmd, ...data } });
    return res;
  };

  // Multiple Geofences CRUD
  const addGeofence = (geo: Omit<Geofence, 'id'>) => {
    const newGeo: Geofence = { ...geo, id: Date.now(), attributes: { ...geo.attributes, enabled: true } };
    setGeofences(prev => {
      const next = [...prev, newGeo];
      localStorage.setItem('gps_saved_geofences', JSON.stringify(next));
      return next;
    });
  };

  const updateGeofence = (id: number, partial: Partial<Geofence>) => {
    setGeofences(prev => {
      const next = prev.map(g => g.id === id ? { ...g, ...partial, attributes: { ...g.attributes, ...(partial.attributes || {}) } } : g);
      localStorage.setItem('gps_saved_geofences', JSON.stringify(next));
      return next;
    });
  };

  const toggleGeofence = (id: number) => {
    setGeofences(prev => {
      const next = prev.map(g => {
        if (g.id === id) {
          const isCurrentlyEnabled = (g.attributes as any)?.enabled !== false;
          return {
            ...g,
            attributes: {
              ...g.attributes,
              enabled: !isCurrentlyEnabled
            }
          };
        }
        return g;
      });
      localStorage.setItem('gps_saved_geofences', JSON.stringify(next));
      return next;
    });
  };

  const deleteGeofence = (id: number) => {
    setGeofences(prev => {
      const next = prev.filter(g => g.id !== id);
      localStorage.setItem('gps_saved_geofences', JSON.stringify(next));
      return next;
    });
  };

  const addEvidence = (evidence: Omit<MediaEvidence, 'id' | 'timestamp'>) => {
    setEvidenceList(prev => [{ ...evidence, id: 'ev-' + Date.now(), timestamp: new Date().toISOString() }, ...prev]);
  };

  const deleteEvidence = (id: string) => {
    setEvidenceList(prev => prev.filter(e => e.id !== id));
  };

  const triggerManualAlert = (alarmType: string, msg: string) => {
    if (!selectedDevice) return;
    setAlerts(prev => [{ id: Date.now(), deviceId: selectedDevice.id, type: 'alarm', serverTime: new Date().toISOString(), attributes: { alarm: alarmType, message: msg } }, ...prev]);
    triggerAlertFeedback(alarmType, msg);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        serverConfig,
        setServerConfig,
        login,
        logout,
        isLoginModalOpen,
        setIsLoginModalOpen,
        activeTab,
        setActiveTab,
        devices,
        selectedDeviceId,
        setSelectedDeviceId,
        selectedDevice,
        positions,
        selectedPosition,
        updateDeviceProfile,
        userLocation,
        requestUserLocation,
        distanceInfo,
        bearingInfo,
        openGoogleMapsNavigation,
        mapLayer,
        setMapLayer,
        showTraffic,
        setShowTraffic,
        showDistanceLine,
        setShowDistanceLine,
        showGeofenceOnMap,
        setShowGeofenceOnMap,
        commandHistory,
        sendCommand,
        geofences,
        addGeofence,
        updateGeofence,
        deleteGeofence,
        toggleGeofence,
        geofenceStatus,
        evidenceList,
        addEvidence,
        deleteEvidence,
        alerts,
        unreadAlertCount,
        markAlertsAsRead,
        triggerManualAlert,
        engineLogs,
        addEngineLog,
        sensorLogs,
        addSensorLog,
        fuelRefillLogs,
        addFuelRefillLog,
        deleteFuelRefillLog,
        alertFeedbackMode,
        setAlertFeedbackMode,
        language,
        setLanguage,
        t,
        audioAlertsEnabled,
        setAudioAlertsEnabled
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
