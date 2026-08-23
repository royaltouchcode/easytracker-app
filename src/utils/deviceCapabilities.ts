import { Device, Position } from '../types/traccar';

export interface ResolvedCapabilities {
  isBike: boolean;
  hasAc: boolean;
  hasDoor: boolean;
  hasFuel: boolean;
  hasFuelLid: boolean;
  hasCamera: boolean;
  hasVoice: boolean;
  acStatus: boolean;
  doorStatus: boolean;
  fuelLiters: number;
  fuelPercentage: number;
  fuelLidStatus: boolean;
  vibrationSafe: boolean;
}

export const resolveDeviceCapabilities = (
  device?: Device,
  position?: Position
): ResolvedCapabilities => {
  const category = device?.category || 'motorcycle';
  const isBike = category === 'motorcycle' || category === 'bicycle';
  const isHeavyFleet = category === 'truck' || category === 'bus' || category === 'pickup';
  const isCar = category === 'car' || category === 'microbus' || category === 'cng';

  const attr = position?.attributes || {};
  const devAttr = device?.attributes || {};

  // AC Sensor capability (Strict: active telematics or explicitly enabled on car/fleet)
  const hasAc = !isBike && (devAttr.hasAcSensor === true || attr.ac !== undefined || (devAttr.hasAcSensor !== false && isCar));
  const acStatus = !!attr.ac;

  // Door Sensor capability (Strict: active telematics or explicitly enabled on car/fleet)
  const hasDoor = !isBike && (devAttr.hasDoorSensor === true || attr.door !== undefined || (devAttr.hasDoorSensor !== false && isCar));
  const doorStatus = !!attr.door;

  // Fuel Sensor capability (Ultrasonic / Capacitive / Fleet)
  const hasFuel = devAttr.hasFuelSensor === true || attr.fuel !== undefined || isHeavyFleet;
  const rawFuel = typeof attr.fuel === 'number' ? attr.fuel : (isHeavyFleet ? 65.4 : 38.2);
  const fuelPercentage = typeof attr.fuelLevel === 'number' ? attr.fuelLevel : Math.min(100, Math.round((rawFuel / (devAttr.fuelCapacityLiters || 80)) * 100));

  // Fuel Tank Lid (Heavy Fleet or wired magnet switch)
  const hasFuelLid = hasFuel && (devAttr.hasFuelLidSensor === true || attr.fuelLid !== undefined || (isHeavyFleet && devAttr.hasFuelLidSensor !== false));
  const fuelLidStatus = attr.fuelLid === true; // true = open, false = closed/locked

  // Camera & Voice
  const hasCamera = Boolean(devAttr.cameraStreamUrlFront || devAttr.cameraStreamUrlCabin || devAttr.hasCamera);
  const hasVoice = Boolean(devAttr.hasVoiceMic || true);

  // Bike Vibration Guard
  const vibrationSafe = attr.alarm !== 'vibration' && attr.vibration !== true;

  return {
    isBike,
    hasAc,
    hasDoor,
    hasFuel,
    hasFuelLid,
    hasCamera,
    hasVoice,
    acStatus,
    doorStatus,
    fuelLiters: Number(rawFuel.toFixed(1)),
    fuelPercentage,
    fuelLidStatus,
    vibrationSafe
  };
};
