import { VehicleType } from '../types/traccar';
import { VEHICLE_CATALOG } from './vehicleCatalogDatabase';

export interface VehicleMaintenanceSpec {
  modelName: string;
  category: VehicleType;
  engineOilGrade: string; // e.g. "20W-50 DTS-i", "10W-40 4T", "5W-30 Synthetic"
  engineOilCapacityMl: number; // e.g. 1150, 1000, 3500
  oilChangeIntervalKm: number; // e.g. 2500, 5000
  generalServiceIntervalKm: number; // e.g. 3000, 10000
  chainLubingIntervalKm?: number; // e.g. 500
  tirePressureFrontPsi: number; // e.g. 21, 28, 32
  tirePressureRearPsi: number; // e.g. 28, 33, 36
  fuelTankCapacityLiters: number; // e.g. 13, 50
  maintenanceTipsBn: string;
}

// Built-in Popular Bangladesh Fleet & Vehicle Specs (Instant 0-Latency Free Database)
export const BUILTIN_SPECS: Record<string, VehicleMaintenanceSpec> = {
  'bajaj_avenger': {
    modelName: 'Bajaj Avenger 160 Street',
    category: 'motorcycle',
    engineOilGrade: '20W-50 DTS-i 4T',
    engineOilCapacityMl: 1150,
    oilChangeIntervalKm: 2500,
    generalServiceIntervalKm: 4000,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 21,
    tirePressureRearPsi: 28,
    fuelTankCapacityLiters: 13,
    maintenanceTipsBn: 'বাজাজ অ্যাভেঞ্জার ১৬০ এর জন্য অফিসিয়াল ২০W-৫০ DTS-i মবিল ব্যবহার করুন (ক্যাপাসিটি ১,১৫০ মিলি)। টায়ার প্রেশার সামনে ২১ PSI ও পেছনে ২৮ PSI বজায় রাখুন।'
  },
  'bajaj_pulsar': {
    modelName: 'Bajaj Pulsar 150 / N160',
    category: 'motorcycle',
    engineOilGrade: '20W-50 (DTS-i Genuine Oil)',
    engineOilCapacityMl: 1150,
    oilChangeIntervalKm: 2500,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 600,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 29,
    fuelTankCapacityLiters: 15,
    maintenanceTipsBn: 'বাজাজ ডিটিএস-আই ২০W-৫০ ইঞ্জিন অয়েল ব্যবহার করুন। ৩,০০০ কিমিতে স্পার্ক প্লাগ ও এয়ার ফিল্টার চেক করুন।'
  },
  'yamaha_r15': {
    modelName: 'Yamaha YZF-R15 V4 / V3',
    category: 'motorcycle',
    engineOilGrade: '10W-40 Yamalube Full Syn',
    engineOilCapacityMl: 1050,
    oilChangeIntervalKm: 2500,
    generalServiceIntervalKm: 3500,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 29,
    tirePressureRearPsi: 33,
    fuelTankCapacityLiters: 11,
    maintenanceTipsBn: 'উচ্চ আরপিএম লিকুইড কুল্ড ইঞ্জিনের জন্য ১০W-৪০ ফুল সিন্থেটিক মবিল ব্যবহার করুন।'
  },
  'yamaha_fzs': {
    modelName: 'Yamaha FZ-S / FZ-X (150cc)',
    category: 'motorcycle',
    engineOilGrade: '10W-40 (JASO MA2 Semi-Synthetic)',
    engineOilCapacityMl: 1000,
    oilChangeIntervalKm: 2200,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 28,
    tirePressureRearPsi: 33,
    fuelTankCapacityLiters: 13,
    maintenanceTipsBn: 'প্রতি ৫০০ কিমি পর পর ও-রিং চেইনে লুব্রিকেন্ট স্প্রে করুন এবং ২,২০০ কিমিতে ১০W-৪০ মবিল পরিবর্তন করুন।'
  },
  'suzuki_gixxer': {
    modelName: 'Suzuki Gixxer / SF 155',
    category: 'motorcycle',
    engineOilGrade: '10W-40 (Ecstar 4T)',
    engineOilCapacityMl: 1000,
    oilChangeIntervalKm: 2500,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 29,
    tirePressureRearPsi: 33,
    fuelTankCapacityLiters: 12,
    maintenanceTipsBn: 'মবিল পরিবর্তনের সময় ওয়েল ফিল্টারটি অবশ্যই পরিবর্তন করুন (ক্যাপাসিটি ১,০০০ মিলি)।'
  },
  'tvs_apache': {
    modelName: 'TVS Apache RTR 160 4V / 2V',
    category: 'motorcycle',
    engineOilGrade: '10W-30 Tru4 Synthetic / 20W-50',
    engineOilCapacityMl: 1000,
    oilChangeIntervalKm: 2500,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 28,
    tirePressureRearPsi: 32,
    fuelTankCapacityLiters: 12,
    maintenanceTipsBn: '৪-ভালভ রেস টিউন ইঞ্জিনে ১০W-৩০ সিন্থেটিক বা ২০W-৫০ গ্রেড প্রযোজ্য।'
  },
  'honda_shine': {
    modelName: 'Honda CB Shine / X-Blade',
    category: 'motorcycle',
    engineOilGrade: '10W-30 (Honda 4T Ultra)',
    engineOilCapacityMl: 1000,
    oilChangeIntervalKm: 2000,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 29,
    fuelTankCapacityLiters: 11,
    maintenanceTipsBn: 'হোন্ডা ১০W-৩০ প্রিমিয়াম ইঞ্জিন অয়েল ব্যবহার করুন ও ২০০০ কিমিতে পরিবর্তন করুন।'
  },
  'toyota_axio': {
    modelName: 'Toyota Corolla / Axio / Premio',
    category: 'car',
    engineOilGrade: '5W-30 / 0W-20 Full Synthetic',
    engineOilCapacityMl: 3700,
    oilChangeIntervalKm: 5000,
    generalServiceIntervalKm: 10000,
    tirePressureFrontPsi: 32,
    tirePressureRearPsi: 32,
    fuelTankCapacityLiters: 50,
    maintenanceTipsBn: 'প্রতি ৫,০০০ কিমিতে ৫W-৩০ সিন্থেটিক ইঞ্জিন অয়েল ও অয়েল ফিল্টার পরিবর্তন করুন।'
  },
  'bajaj_cng': {
    modelName: 'Bajaj RE 4S CNG Auto',
    category: 'cng',
    engineOilGrade: '20W-50 (4T CNG Dedicated)',
    engineOilCapacityMl: 1250,
    oilChangeIntervalKm: 2500,
    generalServiceIntervalKm: 3500,
    tirePressureFrontPsi: 30,
    tirePressureRearPsi: 34,
    fuelTankCapacityLiters: 8,
    maintenanceTipsBn: 'প্রতি ২,৫০০ কিমি পর পর ২০W-৫০ সিএনজি গ্রেড অয়েল পরিবর্তন করুন।'
  },
  'tata_pickup': {
    modelName: 'Tata Ace EX2 / 207 DI',
    category: 'pickup',
    engineOilGrade: '15W-40 CI-4 Diesel',
    engineOilCapacityMl: 3500,
    oilChangeIntervalKm: 5000,
    generalServiceIntervalKm: 8000,
    tirePressureFrontPsi: 35,
    tirePressureRearPsi: 45,
    fuelTankCapacityLiters: 30,
    maintenanceTipsBn: 'প্রতি ৫,০০০ কিমিতে ১৫W-৪০ ডিজেল ইঞ্জিন অয়েল ও ফুয়েল ফিল্টার পরিবর্তন করুন।'
  },
  'hiace_ambulance': {
    modelName: 'Toyota HiAce Ambulance High-Roof',
    category: 'ambulance',
    engineOilGrade: '15W-40 / 5W-30 Turbo Diesel',
    engineOilCapacityMl: 5800,
    oilChangeIntervalKm: 5000,
    generalServiceIntervalKm: 8000,
    tirePressureFrontPsi: 38,
    tirePressureRearPsi: 48,
    fuelTankCapacityLiters: 70,
    maintenanceTipsBn: 'ইমার্জেন্সি রেডি রাখতে প্রতি ৫,০০০ কিমিতে টার্বো ডিজেল ইঞ্জিন অয়েল চেক করুন।'
  }
};

export const getDefaultSpecByCategory = (category: VehicleType): VehicleMaintenanceSpec => {
  switch (category) {
    case 'motorcycle':
      return {
        modelName: 'Standard Motorcycle (150cc)',
        category: 'motorcycle',
        engineOilGrade: '20W-50 / 10W-40 4T',
        engineOilCapacityMl: 1000,
        oilChangeIntervalKm: 2000,
        generalServiceIntervalKm: 3000,
        chainLubingIntervalKm: 500,
        tirePressureFrontPsi: 28,
        tirePressureRearPsi: 32,
        fuelTankCapacityLiters: 13,
        maintenanceTipsBn: 'প্রতি ৫০০ কিমি পর পর চেইনে লুব করুন এবং ২,০০০ কিমিতে ইঞ্জিন অয়েল ড্রেন করুন।'
      };
    case 'scooter':
      return {
        modelName: 'Standard Scooter / Scooty (110-125cc)',
        category: 'scooter',
        engineOilGrade: '10W-30 / 10W-40 (Scooter MB)',
        engineOilCapacityMl: 800,
        oilChangeIntervalKm: 2000,
        generalServiceIntervalKm: 3000,
        tirePressureFrontPsi: 24,
        tirePressureRearPsi: 29,
        fuelTankCapacityLiters: 6,
        maintenanceTipsBn: 'প্রতি ২,০০০ কিমিতে ইঞ্জিন অয়েল ও গিয়ার অয়েল পরিবর্তন করুন।'
      };
    case 'ambulance':
      return {
        modelName: 'Emergency Patient Ambulance',
        category: 'ambulance',
        engineOilGrade: '15W-40 / 5W-30 (Diesel Turbo)',
        engineOilCapacityMl: 5800,
        oilChangeIntervalKm: 5000,
        generalServiceIntervalKm: 8000,
        tirePressureFrontPsi: 38,
        tirePressureRearPsi: 48,
        fuelTankCapacityLiters: 70,
        maintenanceTipsBn: 'ইমার্জেন্সি ডিউটির জন্য প্রতি ৫,০০০ কিমি পর পর ইঞ্জিন অয়েল ও ব্রেক সার্ভিসিং করুন।'
      };
    case 'cng':
      return {
        modelName: 'CNG 3-Wheeler Auto Rickshaw',
        category: 'cng',
        engineOilGrade: '20W-50 (4T CNG Dedicated)',
        engineOilCapacityMl: 1250,
        oilChangeIntervalKm: 2500,
        generalServiceIntervalKm: 3500,
        tirePressureFrontPsi: 30,
        tirePressureRearPsi: 34,
        fuelTankCapacityLiters: 8,
        maintenanceTipsBn: 'প্রতি ২,৫০০ কিমি পর পর ২০W-৫০ সিএনজি ইঞ্জিন অয়েল পরিবর্তন করুন।'
      };
    case 'pickup':
      return {
        modelName: 'Pickup Van / Utility Vehicle',
        category: 'pickup',
        engineOilGrade: '15W-40 Diesel',
        engineOilCapacityMl: 4500,
        oilChangeIntervalKm: 5000,
        generalServiceIntervalKm: 8000,
        tirePressureFrontPsi: 35,
        tirePressureRearPsi: 45,
        fuelTankCapacityLiters: 45,
        maintenanceTipsBn: 'প্রতি ৫,০০০ কিমিতে ইঞ্জিন অয়েল ও ৮,০০০ কিমিতে সাসপেনশন চেক করুন।'
      };
    case 'truck':
      return {
        modelName: 'Commercial Heavy Cargo Truck',
        category: 'truck',
        engineOilGrade: '15W-40 Heavy Duty Diesel',
        engineOilCapacityMl: 14000,
        oilChangeIntervalKm: 10000,
        generalServiceIntervalKm: 15000,
        tirePressureFrontPsi: 105,
        tirePressureRearPsi: 115,
        fuelTankCapacityLiters: 200,
        maintenanceTipsBn: 'প্রতি ১০,০০০ কিমি পর পর ইঞ্জিন অয়েল এবং ১৫,০০০ কিমিতে মাস্টার ব্রেক সার্ভিসিং করান।'
      };
    case 'bus':
      return {
        modelName: 'Passenger Coach Bus',
        category: 'bus',
        engineOilGrade: '15W-40 Turbo Diesel',
        engineOilCapacityMl: 14000,
        oilChangeIntervalKm: 10000,
        generalServiceIntervalKm: 15000,
        tirePressureFrontPsi: 110,
        tirePressureRearPsi: 120,
        fuelTankCapacityLiters: 200,
        maintenanceTipsBn: 'প্রতি ১০,০০০ কিমিতে ইঞ্জিন অয়েল ও ফিল্টার এবং টায়ার রোটেশন সম্পন্ন করুন।'
      };
    case 'car':
    default:
      return {
        modelName: 'Sedan / Private Car',
        category: 'car',
        engineOilGrade: '5W-30 (Synthetic)',
        engineOilCapacityMl: 3700,
        oilChangeIntervalKm: 5000,
        generalServiceIntervalKm: 10000,
        tirePressureFrontPsi: 32,
        tirePressureRearPsi: 32,
        fuelTankCapacityLiters: 45,
        maintenanceTipsBn: 'প্রতি ৫,০০০ কিমিতে ইঞ্জিন অয়েল ও ১০,০০০ কিমিতে হুইল অ্যালাইনমেন্ট ও ব্রেক চেক করুন।'
      };
  }
};

// Lookup function: Checks custom user-configured spec, then catalog matching, then built-in specs, then category fallback
export async function lookupVehicleMaintenanceSpec(
  vehicleName: string, 
  category: VehicleType,
  customAttributes?: any
): Promise<VehicleMaintenanceSpec> {
  // 1. If user configured custom vehicle spec in Settings, use it directly!
  if (customAttributes?.vehicleSpec) {
    const spec = customAttributes.vehicleSpec;
    return {
      modelName: spec.modelName || vehicleName,
      category: category || spec.category || 'motorcycle',
      engineOilGrade: spec.engineOilGrade || '20W-50',
      engineOilCapacityMl: Math.round((spec.engineOilCapacityLiters || 1.15) * 1000),
      oilChangeIntervalKm: spec.oilChangeIntervalKm || 2500,
      generalServiceIntervalKm: spec.generalServiceIntervalKm || 4000,
      chainLubingIntervalKm: 500,
      tirePressureFrontPsi: spec.tirePressureFrontPsi || 25,
      tirePressureRearPsi: spec.tirePressureRearPsi || 29,
      fuelTankCapacityLiters: spec.fuelTankCapacityLiters || 13,
      maintenanceTipsBn: spec.maintenanceTipsBn || `অফিসিয়াল ${spec.engineOilGrade || '20W-50'} ইঞ্জিন অয়েল ব্যবহার করুন।`
    };
  }

  const cleanKey = (vehicleName || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // 2. Check catalog database for direct match
  const catalogMatch = VEHICLE_CATALOG.find(c => 
    cleanKey.includes(c.id.replace(/_/g, '')) || 
    (cleanKey.includes('avenger') && c.id.includes('avenger')) ||
    (cleanKey.includes('pulsar') && c.id.includes('pulsar_150')) ||
    (cleanKey.includes('r15') && c.id.includes('r15')) ||
    (cleanKey.includes('fzs') && c.id.includes('fzs')) ||
    (cleanKey.includes('gixxer') && c.id.includes('gixxer')) ||
    (cleanKey.includes('apache') && c.id.includes('apache')) ||
    (cleanKey.includes('shine') && c.id.includes('shine')) ||
    (cleanKey.includes('axio') && c.id.includes('axio'))
  );

  if (catalogMatch) {
    return {
      modelName: `${catalogMatch.manufacturer} ${catalogMatch.model}`,
      category: catalogMatch.category,
      engineOilGrade: catalogMatch.engineOilGrade,
      engineOilCapacityMl: Math.round(catalogMatch.engineOilCapacityLiters * 1000),
      oilChangeIntervalKm: catalogMatch.oilChangeIntervalKm,
      generalServiceIntervalKm: catalogMatch.oilChangeIntervalKm + 1500,
      chainLubingIntervalKm: 500,
      tirePressureFrontPsi: catalogMatch.tirePressureFrontPsi,
      tirePressureRearPsi: catalogMatch.tirePressureRearPsi,
      fuelTankCapacityLiters: catalogMatch.fuelTankCapacityLiters,
      maintenanceTipsBn: `${catalogMatch.manufacturer} ${catalogMatch.model} এর জন্য অফিসিয়াল ${catalogMatch.engineOilGrade} মবিল ব্যবহার করুন। টায়ার প্রেশার সামনে ${catalogMatch.tirePressureFrontPsi} PSI ও পেছনে ${catalogMatch.tirePressureRearPsi} PSI রাখুন।`
    };
  }

  // 3. Check popular built-in specs
  if (/avenger|160 street/i.test(vehicleName)) return BUILTIN_SPECS['bajaj_avenger'];
  if (/pulsar|n160|ns200/i.test(vehicleName)) return BUILTIN_SPECS['bajaj_pulsar'];
  if (/r15|v3|v4/i.test(vehicleName)) return BUILTIN_SPECS['yamaha_r15'];
  if (/fzs|fzx|yamaha/i.test(vehicleName)) return BUILTIN_SPECS['yamaha_fzs'];
  if (/gixxer|sf 155/i.test(vehicleName)) return BUILTIN_SPECS['suzuki_gixxer'];
  if (/apache|rtr/i.test(vehicleName)) return BUILTIN_SPECS['tvs_apache'];
  if (/shine|sp 125/i.test(vehicleName)) return BUILTIN_SPECS['honda_shine'];
  if (/axio|allion|premio|corolla/i.test(vehicleName)) return BUILTIN_SPECS['toyota_axio'];
  if (/cng|auto rickshaw/i.test(vehicleName)) return BUILTIN_SPECS['bajaj_cng'];
  if (/pickup|tata ace/i.test(vehicleName)) return BUILTIN_SPECS['tata_pickup'];
  if (/ambulance|patient/i.test(vehicleName)) return BUILTIN_SPECS['hiace_ambulance'];

  // 4. Default by category
  return getDefaultSpecByCategory(category);
}
