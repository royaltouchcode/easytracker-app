import { VehicleType } from '../types/traccar';

export interface VehicleMaintenanceSpec {
  modelName: string;
  category: VehicleType;
  engineOilGrade: string; // e.g. "10W-40 4T", "5W-30 Synthetic"
  engineOilCapacityMl: number; // e.g. 1000, 3500
  oilChangeIntervalKm: number; // e.g. 1500, 5000
  generalServiceIntervalKm: number; // e.g. 3000, 10000
  chainLubingIntervalKm?: number; // e.g. 500
  tirePressureFrontPsi: number; // e.g. 25, 32
  tirePressureRearPsi: number; // e.g. 29, 36
  fuelTankCapacityLiters: number; // e.g. 12, 50
  maintenanceTipsBn: string;
}

// Built-in Popular Bangladesh Fleet & Vehicle Specs (Instant 0-Latency Free Database)
export const BUILTIN_SPECS: Record<string, VehicleMaintenanceSpec> = {
  'yamaha_fzs': {
    modelName: 'Yamaha FZ-S / FZ-X (150cc)',
    category: 'motorcycle',
    engineOilGrade: '10W-40 (JASO MA2 Semi-Synthetic)',
    engineOilCapacityMl: 1000,
    oilChangeIntervalKm: 1500,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 28,
    tirePressureRearPsi: 33,
    fuelTankCapacityLiters: 13,
    maintenanceTipsBn: 'প্রতি ৫০০ কিমি পর পর ও-রিং চেইনে লুব্রিকেন্ট স্প্রে করুন এবং ১,৫০০ কিমিতে ইয়ামালুব ১০W-৪০ মবিল পরিবর্তন করুন।'
  },
  'bajaj_pulsar': {
    modelName: 'Bajaj Pulsar 150 / N160',
    category: 'motorcycle',
    engineOilGrade: '20W-50 (DTS-i Genuine Oil)',
    engineOilCapacityMl: 1150,
    oilChangeIntervalKm: 1500,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 600,
    tirePressureFrontPsi: 28,
    tirePressureRearPsi: 32,
    fuelTankCapacityLiters: 15,
    maintenanceTipsBn: 'বাজাজ ডিটিএস-আই ২০W-৫০ ইঞ্জিন অয়েল ব্যবহার করুন। ৩,০০০ কিমিতে স্পার্ক প্লাগ ও এয়ার ফিল্টার চেক করুন।'
  },
  'suzuki_gixxer': {
    modelName: 'Suzuki Gixxer / SF 155',
    category: 'motorcycle',
    engineOilGrade: '10W-40 (Ecstar 4T)',
    engineOilCapacityMl: 850,
    oilChangeIntervalKm: 1500,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 29,
    tirePressureRearPsi: 33,
    fuelTankCapacityLiters: 12,
    maintenanceTipsBn: 'মবিল পরিবর্তনের সময় ওয়েল ফিল্টারটি অবশ্যই পরিবর্তন করুন (ক্যাপাসিটি ৮৫০ মিলি)।'
  },
  'tvs_apache': {
    modelName: 'TVS Apache RTR 160 4V / 2V',
    category: 'motorcycle',
    engineOilGrade: '10W-30 (TVS TRU4 Synthetic)',
    engineOilCapacityMl: 1000,
    oilChangeIntervalKm: 1500,
    generalServiceIntervalKm: 3000,
    chainLubingIntervalKm: 500,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 28,
    fuelTankCapacityLiters: 12,
    maintenanceTipsBn: 'উচ্চ আরপিএম ড্রাইভের কারণে প্রতি ১,৫০০ কিমিতে ১০W-৩০ ফুল সিন্থেটিক মবিল ও অয়েল ফিল্টার পরিবর্তন করুন।'
  },
  'honda_shine': {
    modelName: 'Honda CB Shine / SP 125',
    category: 'motorcycle',
    engineOilGrade: '10W-30 (Honda 4T Ultra)',
    engineOilCapacityMl: 900,
    oilChangeIntervalKm: 1800,
    generalServiceIntervalKm: 3500,
    chainLubingIntervalKm: 700,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 29,
    fuelTankCapacityLiters: 11,
    maintenanceTipsBn: 'হোন্ডার সাইলেন্ট স্টার্ট ইঞ্জিনের জন্য ১০W-৩০ গ্রেডের মবিল ব্যবহার করুন।'
  },
  'toyota_axio': {
    modelName: 'Toyota Corolla Axio / Fielder (1.5L)',
    category: 'car',
    engineOilGrade: '0W-20 / 5W-30 (Full Synthetic)',
    engineOilCapacityMl: 3700,
    oilChangeIntervalKm: 5000,
    generalServiceIntervalKm: 10000,
    tirePressureFrontPsi: 32,
    tirePressureRearPsi: 32,
    fuelTankCapacityLiters: 42,
    maintenanceTipsBn: 'প্রতি ৫,০০০ কিমিতে ইঞ্জিন অয়েল ও ফিল্টার এবং প্রতি ১০,০০০ কিমিতে এসি ফিল্টার ও ব্রেক প্যাড চেক করুন।'
  },
  'toyota_premio': {
    modelName: 'Toyota Premio / Allion (1.5L/1.8L)',
    category: 'car',
    engineOilGrade: '5W-30 (Toyota Genuine Synthetic)',
    engineOilCapacityMl: 4200,
    oilChangeIntervalKm: 5000,
    generalServiceIntervalKm: 10000,
    tirePressureFrontPsi: 33,
    tirePressureRearPsi: 33,
    fuelTankCapacityLiters: 60,
    maintenanceTipsBn: 'সিভিটি (CVT) ট্রান্সমিশন ফ্লুইড প্রতি ৩০,০০০ কিমিতে চেক করুন এবং ইঞ্জিন অয়েল ৫,০০০ কিমিতে পরিবর্তন করুন।'
  },
  'bajaj_cng': {
    modelName: 'Bajaj RE 4-Stroke CNG / Auto Rickshaw',
    category: 'cng',
    engineOilGrade: '20W-50 (CNG Special 4T)',
    engineOilCapacityMl: 1400,
    oilChangeIntervalKm: 1000,
    generalServiceIntervalKm: 2500,
    tirePressureFrontPsi: 26,
    tirePressureRearPsi: 34,
    fuelTankCapacityLiters: 35,
    maintenanceTipsBn: 'সিএনজি ইঞ্জিনের উচ্চ তাপমাত্রার কারণে প্রতি ১,০০০ কিমিতে ২০W-৫০ সিএনজি স্পেশাল মবিল ড্রেন করুন।'
  },
  'tata_pickup': {
    modelName: 'Tata Ace / Mega / EX Pickup',
    category: 'pickup',
    engineOilGrade: '15W-40 (Heavy Diesel Turbo)',
    engineOilCapacityMl: 4500,
    oilChangeIntervalKm: 4500,
    generalServiceIntervalKm: 8000,
    tirePressureFrontPsi: 45,
    tirePressureRearPsi: 55,
    fuelTankCapacityLiters: 38,
    maintenanceTipsBn: 'ভারী মালামাল পরিবহনের কারণে প্রতি ৪,৫০০ কিমিতে ডিজেল ইঞ্জিন অয়েল ও প্রতি ৮,০০০ কিমিতে কুল্যান্ট লেভেল চেক করুন।'
  },
  'heavy_truck': {
    modelName: 'Heavy Cargo Truck (6-10 Wheeler)',
    category: 'truck',
    engineOilGrade: '15W-40 (API CI-4 Heavy Duty)',
    engineOilCapacityMl: 14000,
    oilChangeIntervalKm: 10000,
    generalServiceIntervalKm: 15000,
    tirePressureFrontPsi: 110,
    tirePressureRearPsi: 115,
    fuelTankCapacityLiters: 200,
    maintenanceTipsBn: 'এয়ার ব্রেক ড্রায়ার ফিল্টার, ডিফারেনশিয়াল গিয়ার অয়েল এবং গ্রিজ পয়েন্ট প্রতি ১৫,০০০ কিমিতে সার্ভিস করান।'
  }
};

// Default generic presets by vehicle category
export const getDefaultSpecByCategory = (category: VehicleType): VehicleMaintenanceSpec => {
  switch (category) {
    case 'motorcycle':
      return {
        modelName: 'Standard Motorcycle / Bike',
        category: 'motorcycle',
        engineOilGrade: '10W-40 (4T Semi-Synthetic)',
        engineOilCapacityMl: 1000,
        oilChangeIntervalKm: 1500,
        generalServiceIntervalKm: 3000,
        chainLubingIntervalKm: 500,
        tirePressureFrontPsi: 28,
        tirePressureRearPsi: 32,
        fuelTankCapacityLiters: 13,
        maintenanceTipsBn: 'প্রতি ১,৫০০ কিমিতে ইঞ্জিন অয়েল ও ৩,০০০ কিমিতে সাধারণ সার্ভিসিং করান।'
      };
    case 'scooter':
      return {
        modelName: 'Scooter / Scooty',
        category: 'scooter',
        engineOilGrade: '10W-30 (Scooter Special 4T)',
        engineOilCapacityMl: 800,
        oilChangeIntervalKm: 1500,
        generalServiceIntervalKm: 3000,
        tirePressureFrontPsi: 22,
        tirePressureRearPsi: 29,
        fuelTankCapacityLiters: 6,
        maintenanceTipsBn: 'প্রতি ১,৫০০ কিমিতে স্কুটার স্পেশাল ইঞ্জিন অয়েল এবং ৩,০০০ কিমিতে সিভিতি (CVT) ড্রাইভ বেল্ট ও গিয়ার অয়েল চেক করুন।'
      };
    case 'ambulance':
      return {
        modelName: 'Emergency Life Support Ambulance',
        category: 'ambulance',
        engineOilGrade: '5W-30 / 15W-40 (Heavy Duty Synthetic)',
        engineOilCapacityMl: 5500,
        oilChangeIntervalKm: 4500,
        generalServiceIntervalKm: 8000,
        tirePressureFrontPsi: 45,
        tirePressureRearPsi: 50,
        fuelTankCapacityLiters: 65,
        maintenanceTipsBn: 'জরুরি রেসপন্স গাড়ির জন্য প্রতি ৪,৫০০ কিমিতে ইঞ্জিন অয়েল, প্রতি সপ্তাহে মেডিকেল ইনভার্টার ও সেকেন্ডারি ব্যাটারি এবং সাইরেন কানেকশন চেক করুন।'
      };
    case 'bicycle':
      return {
        modelName: 'Bicycle / Electric Bicycle',
        category: 'bicycle',
        engineOilGrade: 'Chain Dry Lube (Teflon)',
        engineOilCapacityMl: 0,
        oilChangeIntervalKm: 0,
        generalServiceIntervalKm: 800,
        chainLubingIntervalKm: 300,
        tirePressureFrontPsi: 35,
        tirePressureRearPsi: 40,
        fuelTankCapacityLiters: 0,
        maintenanceTipsBn: 'প্রতি ৩০০ কিমি পর পর চেইন ও গিয়ারে সাইকেল ড্রাই লুব দিন এবং ব্রেক প্যাড চেক করুন।'
      };
    case 'cng':
      return {
        modelName: 'CNG 3-Wheeler Auto Rickshaw',
        category: 'cng',
        engineOilGrade: '20W-50 (4T CNG)',
        engineOilCapacityMl: 1400,
        oilChangeIntervalKm: 1000,
        generalServiceIntervalKm: 2500,
        tirePressureFrontPsi: 26,
        tirePressureRearPsi: 34,
        fuelTankCapacityLiters: 35,
        maintenanceTipsBn: 'প্রতি ১,০০০ কিমি পর পর ইঞ্জিন অয়েল পরিবর্তন করুন ও ব্রেক লাইনার পরীক্ষা করুন।'
      };
    case 'pickup':
      return {
        modelName: 'Pickup Van / Utility Vehicle',
        category: 'pickup',
        engineOilGrade: '15W-40 / 5W-30',
        engineOilCapacityMl: 5000,
        oilChangeIntervalKm: 5000,
        generalServiceIntervalKm: 8000,
        tirePressureFrontPsi: 40,
        tirePressureRearPsi: 45,
        fuelTankCapacityLiters: 50,
        maintenanceTipsBn: 'প্রতি ৫,০০০ কিমিতে ইঞ্জিন অয়েল ও ৮,০০০ কিমিতে সাসপেনশন চেক করুন।'
      };
    case 'truck':
      return {
        modelName: 'Commercial Cargo Truck',
        category: 'truck',
        engineOilGrade: '15W-40 Heavy Duty Diesel',
        engineOilCapacityMl: 14000,
        oilChangeIntervalKm: 10000,
        generalServiceIntervalKm: 15000,
        tirePressureFrontPsi: 105,
        tirePressureRearPsi: 115,
        fuelTankCapacityLiters: 180,
        maintenanceTipsBn: 'প্রতি ১০,০০০ কিমি পর পর ইঞ্জিন অয়েল এবং ১৫,০০০ কিমিতে মাস্টার ব্রেক সার্ভিসিং করান।'
      };
    case 'bus':
      return {
        modelName: 'Passenger Coach Bus',
        category: 'bus',
        engineOilGrade: '15W-40 Turbo Diesel',
        engineOilCapacityMl: 16000,
        oilChangeIntervalKm: 10000,
        generalServiceIntervalKm: 15000,
        tirePressureFrontPsi: 110,
        tirePressureRearPsi: 120,
        fuelTankCapacityLiters: 220,
        maintenanceTipsBn: 'প্রতি ১০,০০০ কিমিতে ইঞ্জিন অয়েল ও ফিল্টার এবং টায়ার রোটেশন সম্পন্ন করুন।'
      };
    case 'car':
    default:
      return {
        modelName: 'Sedan / Private Car',
        category: 'car',
        engineOilGrade: '5W-30 (Synthetic)',
        engineOilCapacityMl: 4000,
        oilChangeIntervalKm: 5000,
        generalServiceIntervalKm: 10000,
        tirePressureFrontPsi: 32,
        tirePressureRearPsi: 32,
        fuelTankCapacityLiters: 45,
        maintenanceTipsBn: 'প্রতি ৫,০০০ কিমিতে ইঞ্জিন অয়েল ও ১০,০০০ কিমিতে হুইল অ্যালাইনমেন্ট ও ব্রেক চেক করুন।'
      };
  }
};

// Auto Lookup function with local storage caching (100% Free, zero external dependency)
export async function lookupVehicleMaintenanceSpec(
  vehicleName: string, 
  category: VehicleType
): Promise<VehicleMaintenanceSpec> {
  const cleanKey = vehicleName.toLowerCase().replace(/[^a-z0-9]/g, '');
  const storageKey = `gps_maint_spec_${cleanKey}_${category}`;

  // 1. Check cached local storage first
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  // 2. Check built-in popular Bangladesh models
  for (const [key, spec] of Object.entries(BUILTIN_SPECS)) {
    if (cleanKey.includes(key) || key.includes(cleanKey) || /fzs|fzx|yamaha/i.test(vehicleName) && key === 'yamaha_fzs' || /pulsar|ns|n160/i.test(vehicleName) && key === 'bajaj_pulsar' || /gixxer|sf/i.test(vehicleName) && key === 'suzuki_gixxer' || /apache|rtr/i.test(vehicleName) && key === 'tvs_apache' || /shine|sp125|hornet/i.test(vehicleName) && key === 'honda_shine' || /axio|fielder/i.test(vehicleName) && key === 'toyota_axio' || /premio|allion/i.test(vehicleName) && key === 'toyota_premio' || /cng|auto|rickshaw/i.test(vehicleName) && key === 'bajaj_cng' || /pickup|tata/i.test(vehicleName) && key === 'tata_pickup' || /truck|lorry/i.test(vehicleName) && key === 'heavy_truck') {
      try {
        localStorage.setItem(storageKey, JSON.stringify(spec));
      } catch (e) {}
      return spec;
    }
  }

  // 3. Fallback to optimal category defaults
  const defaultSpec = getDefaultSpecByCategory(category);
  const matchedSpec = { ...defaultSpec, modelName: vehicleName || defaultSpec.modelName };
  try {
    localStorage.setItem(storageKey, JSON.stringify(matchedSpec));
  } catch (e) {}
  return matchedSpec;
}
