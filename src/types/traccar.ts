export type VehicleType = 
  | 'car' 
  | 'motorcycle' 
  | 'scooter'
  | 'ambulance'
  | 'truck' 
  | 'bus' 
  | 'cng' 
  | 'pickup' 
  | 'microbus' 
  | 'bicycle' 
  | 'person' 
  | 'boat';

export interface EngineLog {
  id: string;
  deviceId: number;
  deviceName: string;
  action: 'cut' | 'resume';
  status: 'executed' | 'pending' | 'failed';
  timestamp: string;
  speed: number;
}

export type AlertFeedbackMode = 
  | 'sound_vibration' 
  | 'only_sound' 
  | 'only_vibration' 
  | 'sms_push' 
  | 'sms_sound_vibration' 
  | 'silent';

export interface FuelRefillLog {
  id: string;
  deviceId: number;
  deviceName: string;
  litersAdded: number;
  totalLitersAfter: number;
  odometerKm: number;
  costBdt?: number;
  timestamp: string;
  stationName?: string;
}

export interface SensorLog {
  id: string;
  deviceId: number;
  deviceName: string;
  sensorType: 'ac' | 'door' | 'fuel' | 'fuel_lid' | 'vibration';
  title: string;
  status: string;
  value?: string | number;
  timestamp: string;
}

export interface Device {
  id: number;
  name: string;
  uniqueId: string;
  status: 'online' | 'offline' | 'unknown';
  disabled: boolean;
  lastUpdate: string;
  positionId?: number;
  groupId?: number;
  phone?: string;
  model?: string;
  contact?: string;
  category?: VehicleType;
  attributes: {
    color?: string;
    plateNumber?: string;
    driverName?: string;
    driverPhone?: string;
    speedLimit?: number;
    sosNumber1?: string;
    sosNumber2?: string;
    cameraStreamUrlFront?: string;
    cameraStreamUrlCabin?: string;
    hasAcSensor?: boolean;
    hasDoorSensor?: boolean;
    hasFuelSensor?: boolean;
    fuelCapacityLiters?: number;
    hasFuelLidSensor?: boolean;
    [key: string]: any;
  };
}

export interface Position {
  id: number;
  deviceId: number;
  protocol: string;
  serverTime: string;
  deviceTime: string;
  fixTime: string;
  valid: boolean;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number; // in km/h
  course: number; // 0 - 360 degrees
  address?: string;
  accuracy?: number;
  attributes: {
    ignition?: boolean;
    batteryLevel?: number; // percentage (0-100)
    power?: number; // External main battery e.g. 12.8V
    battery?: number; // Internal battery voltage e.g. 3.9V
    sat?: number; // Satellite count
    distance?: number;
    totalDistance?: number;
    motion?: boolean;
    charge?: boolean;
    ac?: boolean; // Air conditioner ON/OFF
    door?: boolean; // Door Open/Close
    fuel?: number; // Current Fuel in Liters e.g. 42.5
    fuelLevel?: number; // Fuel percentage e.g. 85%
    fuelLid?: boolean; // Tank cap open/close
    vibration?: boolean; // Motorcycle vibration sensor
    tilt?: boolean; // Motorcycle tilt sensor
    isLastKnown?: boolean; // Preserved last valid location flag
    alarm?: 'sos' | 'vibration' | 'movement' | 'overspeed' | 'powerCut' | 'powerRestored' | 'tampering' | 'geofenceEnter' | 'geofenceExit' | 'lowBattery' | 'doorOpen' | 'fuelDrop' | 'fuelLidOpen' | 'acOn' | 'acOff' | string;
    status?: number;
    relay?: boolean;
    [key: string]: any;
  };
}

export interface EventLog {
  id: number;
  deviceId: number;
  type: string;
  serverTime: string;
  positionId?: number;
  geofenceId?: number;
  attributes: {
    alarm?: string;
    speed?: number;
    message?: string;
    [key: string]: any;
  };
}

export interface CommandPayload {
  id?: number;
  deviceId: number;
  type: string;
  description?: string;
  attributes: {
    data?: string;
    frequency?: number;
    radius?: number;
    message?: string;
    phone?: string;
    [key: string]: any;
  };
}

export interface CommandHistory {
  id: string;
  deviceId: number;
  deviceName: string;
  commandType: string;
  rawCommand: string;
  status: 'sending' | 'delivered' | 'failed' | 'acknowledged';
  timestamp: string;
  responseMessage?: string;
}

export interface Geofence {
  id: number;
  name: string;
  description?: string;
  area: string; // CIRCLE (lat lon, radius)
  latitude: number;
  longitude: number;
  radius: number; // in meters
  attributes: {
    color?: string;
    speedLimit?: number;
    alertOnEnter?: boolean;
    alertOnExit?: boolean;
    [key: string]: any;
  };
}

export interface MediaEvidence {
  id: string;
  deviceId: number;
  deviceName: string;
  type: 'photo' | 'video' | 'audio';
  url: string;
  thumbnailUrl?: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  speed: number;
  triggerEvent: string; // 'SOS Panic', 'Crash Alert', 'Wire Cut', 'Manual Live Snapshot'
  note?: string;
}

export interface ServerConfig {
  name: string;
  url: string; // e.g. https://demo3.traccar.org or custom Oracle IP
  port: string;
  isDemo: boolean;
}

export interface UserSession {
  id: number;
  name: string;
  email: string;
  readonly: boolean;
  administrator: boolean;
  serverUrl: string;
}

export type MapLayerType = 'carto_positron' | 'google_roadmap' | 'google_satellite' | 'google_hybrid' | 'google_terrain' | 'osm' | 'baidu_dark';

export type SaasRole = 'customer' | 'super_admin' | 'sales' | 'technician' | 'support' | 'rescue';

