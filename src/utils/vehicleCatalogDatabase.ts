import { VehicleType } from '../types/traccar';

export interface VehicleCatalogItem {
  id: string;
  category: VehicleType;
  manufacturer: string;
  model: string;
  versionCc: string;
  engineOilGrade: string;
  engineOilCapacityLiters: number;
  oilChangeIntervalKm: number;
  fuelTankCapacityLiters: number;
  fuelType: 'petrol' | 'octane' | 'diesel' | 'cng' | 'electric';
  expectedMileageKmL: number;
  tirePressureFrontPsi: number;
  tirePressureRearPsi: number;
}

export const VEHICLE_CATALOG: VehicleCatalogItem[] = [
  // ==========================================
  // 🏍️ MOTORCYCLES (BIKES)
  // ==========================================
  {
    id: 'bajaj_avenger_160',
    category: 'motorcycle',
    manufacturer: 'Bajaj',
    model: 'Avenger 160 Street',
    versionCc: '160cc DTS-i',
    engineOilGrade: '20W-50 DTS-i 4T',
    engineOilCapacityLiters: 1.15,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 13.0,
    fuelType: 'octane',
    expectedMileageKmL: 42.0,
    tirePressureFrontPsi: 21,
    tirePressureRearPsi: 28
  },
  {
    id: 'bajaj_pulsar_150',
    category: 'motorcycle',
    manufacturer: 'Bajaj',
    model: 'Pulsar 150 (Twin Disc / Single)',
    versionCc: '150cc DTS-i',
    engineOilGrade: '20W-50 DTS-i 4T',
    engineOilCapacityLiters: 1.15,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 15.0,
    fuelType: 'octane',
    expectedMileageKmL: 45.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 29
  },
  {
    id: 'bajaj_pulsar_n160',
    category: 'motorcycle',
    manufacturer: 'Bajaj',
    model: 'Pulsar N160 Dual ABS',
    versionCc: '164.82cc Oil Cooled',
    engineOilGrade: '20W-50 Synthetic 4T',
    engineOilCapacityLiters: 1.20,
    oilChangeIntervalKm: 3000,
    fuelTankCapacityLiters: 14.0,
    fuelType: 'octane',
    expectedMileageKmL: 44.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 32
  },
  {
    id: 'bajaj_pulsar_ns200',
    category: 'motorcycle',
    manufacturer: 'Bajaj',
    model: 'Pulsar NS200 FI ABS',
    versionCc: '199.5cc Liquid Cooled',
    engineOilGrade: '20W-50 Full Synthetic',
    engineOilCapacityLiters: 1.25,
    oilChangeIntervalKm: 3000,
    fuelTankCapacityLiters: 12.0,
    fuelType: 'octane',
    expectedMileageKmL: 36.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 32
  },
  {
    id: 'bajaj_discover_125',
    category: 'motorcycle',
    manufacturer: 'Bajaj',
    model: 'Discover 125 (Disc/Drum)',
    versionCc: '124.5cc DTS-i',
    engineOilGrade: '20W-50 4T Mineral',
    engineOilCapacityLiters: 1.0,
    oilChangeIntervalKm: 2000,
    fuelTankCapacityLiters: 10.0,
    fuelType: 'octane',
    expectedMileageKmL: 55.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 28
  },
  {
    id: 'yamaha_r15_v4',
    category: 'motorcycle',
    manufacturer: 'Yamaha',
    model: 'YZF-R15 V4 / M',
    versionCc: '155cc VVA Liquid Cooled',
    engineOilGrade: '10W-40 Yamalube Full Syn',
    engineOilCapacityLiters: 1.05,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 11.0,
    fuelType: 'octane',
    expectedMileageKmL: 42.0,
    tirePressureFrontPsi: 29,
    tirePressureRearPsi: 33
  },
  {
    id: 'yamaha_fzs_v3',
    category: 'motorcycle',
    manufacturer: 'Yamaha',
    model: 'FZ-S FI V3 / V2',
    versionCc: '149cc BlueCore FI',
    engineOilGrade: '10W-40 Yamalube Semi-Syn',
    engineOilCapacityLiters: 1.0,
    oilChangeIntervalKm: 2200,
    fuelTankCapacityLiters: 13.0,
    fuelType: 'octane',
    expectedMileageKmL: 43.0,
    tirePressureFrontPsi: 28,
    tirePressureRearPsi: 33
  },
  {
    id: 'yamaha_mt15',
    category: 'motorcycle',
    manufacturer: 'Yamaha',
    model: 'MT-15 V2',
    versionCc: '155cc VVA',
    engineOilGrade: '10W-40 Full Synthetic',
    engineOilCapacityLiters: 1.05,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 10.0,
    fuelType: 'octane',
    expectedMileageKmL: 43.0,
    tirePressureFrontPsi: 29,
    tirePressureRearPsi: 33
  },
  {
    id: 'honda_cb_shine',
    category: 'motorcycle',
    manufacturer: 'Honda',
    model: 'CB Shine 125 SP',
    versionCc: '124.7cc eSP',
    engineOilGrade: '10W-30 Honda 4T',
    engineOilCapacityLiters: 0.9,
    oilChangeIntervalKm: 2000,
    fuelTankCapacityLiters: 10.5,
    fuelType: 'octane',
    expectedMileageKmL: 58.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 29
  },
  {
    id: 'honda_xblade_160',
    category: 'motorcycle',
    manufacturer: 'Honda',
    model: 'X-Blade 160 ABS',
    versionCc: '162.71cc HET',
    engineOilGrade: '10W-30 Honda 4T Pro',
    engineOilCapacityLiters: 1.0,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 12.0,
    fuelType: 'octane',
    expectedMileageKmL: 46.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 29
  },
  {
    id: 'suzuki_gixxer_155',
    category: 'motorcycle',
    manufacturer: 'Suzuki',
    model: 'Gixxer 155 / SF Fi ABS',
    versionCc: '155cc SEP',
    engineOilGrade: '10W-40 Ecstar Semi-Syn',
    engineOilCapacityLiters: 1.0,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 12.0,
    fuelType: 'octane',
    expectedMileageKmL: 42.0,
    tirePressureFrontPsi: 29,
    tirePressureRearPsi: 33
  },
  {
    id: 'tvs_apache_160_4v',
    category: 'motorcycle',
    manufacturer: 'TVS',
    model: 'Apache RTR 160 4V SmartXonnect',
    versionCc: '159.7cc Oil Cooled 4V',
    engineOilGrade: '10W-30 Tru4 Synthetic / 20W-50',
    engineOilCapacityLiters: 1.0,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 12.0,
    fuelType: 'octane',
    expectedMileageKmL: 40.0,
    tirePressureFrontPsi: 28,
    tirePressureRearPsi: 32
  },
  {
    id: 'hero_splendor_plus',
    category: 'motorcycle',
    manufacturer: 'Hero',
    model: 'Splendor Plus i3S',
    versionCc: '97.2cc APDV',
    engineOilGrade: '10W-30 4T Plus',
    engineOilCapacityLiters: 0.9,
    oilChangeIntervalKm: 2000,
    fuelTankCapacityLiters: 9.8,
    fuelType: 'octane',
    expectedMileageKmL: 62.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 29
  },
  {
    id: 'hero_hunk_150',
    category: 'motorcycle',
    manufacturer: 'Hero',
    model: 'Hunk 150 / 160R',
    versionCc: '149.2cc / 163cc',
    engineOilGrade: '10W-30 4T Synthetic',
    engineOilCapacityLiters: 1.0,
    oilChangeIntervalKm: 2200,
    fuelTankCapacityLiters: 12.4,
    fuelType: 'octane',
    expectedMileageKmL: 43.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 30
  },

  // ==========================================
  // 🛵 SCOOTERS (SCOOTY)
  // ==========================================
  {
    id: 'tvs_ntorq_125',
    category: 'scooter',
    manufacturer: 'TVS',
    model: 'Ntorq 125 Race Edition',
    versionCc: '124.8cc 3V CVTi',
    engineOilGrade: '10W-30 Tru4 Scooter',
    engineOilCapacityLiters: 0.8,
    oilChangeIntervalKm: 2000,
    fuelTankCapacityLiters: 5.8,
    fuelType: 'octane',
    expectedMileageKmL: 42.0,
    tirePressureFrontPsi: 24,
    tirePressureRearPsi: 28
  },
  {
    id: 'honda_dio_110',
    category: 'scooter',
    manufacturer: 'Honda',
    model: 'Dio 110 H-Smart',
    versionCc: '109.5cc eSP',
    engineOilGrade: '10W-30 Scooter MB',
    engineOilCapacityLiters: 0.75,
    oilChangeIntervalKm: 2000,
    fuelTankCapacityLiters: 5.3,
    fuelType: 'octane',
    expectedMileageKmL: 48.0,
    tirePressureFrontPsi: 22,
    tirePressureRearPsi: 29
  },
  {
    id: 'suzuki_burgman_125',
    category: 'scooter',
    manufacturer: 'Suzuki',
    model: 'Burgman Street 125',
    versionCc: '124cc SEP',
    engineOilGrade: '10W-40 Scooter MB',
    engineOilCapacityLiters: 0.8,
    oilChangeIntervalKm: 2200,
    fuelTankCapacityLiters: 5.5,
    fuelType: 'octane',
    expectedMileageKmL: 45.0,
    tirePressureFrontPsi: 22,
    tirePressureRearPsi: 29
  },

  // ==========================================
  // 🚗 PRIVATE CARS & SEDANS
  // ==========================================
  {
    id: 'toyota_axio_allion_premio',
    category: 'car',
    manufacturer: 'Toyota',
    model: 'Corolla / Axio / Allion / Premio',
    versionCc: '1500cc 1NZ-FE',
    engineOilGrade: '5W-30 / 0W-20 Full Synthetic',
    engineOilCapacityLiters: 3.7,
    oilChangeIntervalKm: 5000,
    fuelTankCapacityLiters: 50.0,
    fuelType: 'octane',
    expectedMileageKmL: 13.5,
    tirePressureFrontPsi: 32,
    tirePressureRearPsi: 32
  },
  {
    id: 'toyota_aqua_prius_hybrid',
    category: 'car',
    manufacturer: 'Toyota',
    model: 'Aqua / Prius Hybrid',
    versionCc: '1500cc Hybrid Synergy',
    engineOilGrade: '0W-16 / 0W-20 Hybrid Grade',
    engineOilCapacityLiters: 3.5,
    oilChangeIntervalKm: 5000,
    fuelTankCapacityLiters: 36.0,
    fuelType: 'octane',
    expectedMileageKmL: 21.5,
    tirePressureFrontPsi: 33,
    tirePressureRearPsi: 33
  },
  {
    id: 'honda_grace_hybrid',
    category: 'car',
    manufacturer: 'Honda',
    model: 'Grace Hybrid / Civic / City',
    versionCc: '1500cc i-DCD Hybrid',
    engineOilGrade: '0W-20 Ultra Green / 5W-30',
    engineOilCapacityLiters: 3.6,
    oilChangeIntervalKm: 5000,
    fuelTankCapacityLiters: 40.0,
    fuelType: 'octane',
    expectedMileageKmL: 18.0,
    tirePressureFrontPsi: 32,
    tirePressureRearPsi: 32
  },
  {
    id: 'nissan_sunny',
    category: 'car',
    manufacturer: 'Nissan',
    model: 'Sunny / Sylphy / X-Trail',
    versionCc: '1500cc HR15DE',
    engineOilGrade: '5W-30 Synthetic',
    engineOilCapacityLiters: 3.5,
    oilChangeIntervalKm: 5000,
    fuelTankCapacityLiters: 41.0,
    fuelType: 'octane',
    expectedMileageKmL: 13.0,
    tirePressureFrontPsi: 32,
    tirePressureRearPsi: 32
  },

  // ==========================================
  // 🛺 3-WHEELERS (CNG / AUTO)
  // ==========================================
  {
    id: 'bajaj_re_4s_cng',
    category: 'cng',
    manufacturer: 'Bajaj',
    model: 'RE 4S CNG Auto Rickshaw',
    versionCc: '198.88cc 4-Stroke Spark',
    engineOilGrade: '20W-50 CNG Dedicated Grade',
    engineOilCapacityLiters: 1.25,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 8.0,
    fuelType: 'cng',
    expectedMileageKmL: 32.0,
    tirePressureFrontPsi: 30,
    tirePressureRearPsi: 34
  },
  {
    id: 'tvs_king_cng',
    category: 'cng',
    manufacturer: 'TVS',
    model: 'TVS King Deluxe CNG',
    versionCc: '199.26cc 4-Stroke',
    engineOilGrade: '20W-50 4T CNG',
    engineOilCapacityLiters: 1.20,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 8.5,
    fuelType: 'cng',
    expectedMileageKmL: 30.0,
    tirePressureFrontPsi: 30,
    tirePressureRearPsi: 34
  },

  // ==========================================
  // 🛻 PICKUPS & VANS
  // ==========================================
  {
    id: 'tata_ace_ex2',
    category: 'pickup',
    manufacturer: 'Tata',
    model: 'Ace EX2 / Mega Pick-up',
    versionCc: '702cc / 800cc DICOR Diesel',
    engineOilGrade: '15W-40 CI-4 Diesel',
    engineOilCapacityLiters: 3.5,
    oilChangeIntervalKm: 5000,
    fuelTankCapacityLiters: 30.0,
    fuelType: 'diesel',
    expectedMileageKmL: 16.0,
    tirePressureFrontPsi: 35,
    tirePressureRearPsi: 45
  },
  {
    id: 'mahindra_bolero_maxi',
    category: 'pickup',
    manufacturer: 'Mahindra',
    model: 'Bolero Maxi Truck Plus',
    versionCc: '2523cc m2DiCR Turbo',
    engineOilGrade: '15W-40 Maximile Diesel',
    engineOilCapacityLiters: 5.5,
    oilChangeIntervalKm: 6000,
    fuelTankCapacityLiters: 45.0,
    fuelType: 'diesel',
    expectedMileageKmL: 13.5,
    tirePressureFrontPsi: 35,
    tirePressureRearPsi: 50
  },

  // ==========================================
  // 🚑 AMBULANCES
  // ==========================================
  {
    id: 'toyota_hiace_ambulance',
    category: 'ambulance',
    manufacturer: 'Toyota',
    model: 'HiAce High-Roof Patient Ambulance',
    versionCc: '3000cc 1KD-FTV D-4D Turbo',
    engineOilGrade: '15W-40 / 5W-30 Turbo Diesel',
    engineOilCapacityLiters: 5.8,
    oilChangeIntervalKm: 5000,
    fuelTankCapacityLiters: 70.0,
    fuelType: 'diesel',
    expectedMileageKmL: 9.5,
    tirePressureFrontPsi: 38,
    tirePressureRearPsi: 48
  },
  {
    id: 'hyundai_staria_ambulance',
    category: 'ambulance',
    manufacturer: 'Hyundai',
    model: 'Staria Emergency Life Support',
    versionCc: '2200cc CRDi VGT',
    engineOilGrade: '5W-30 ACEA C3 Synthetic',
    engineOilCapacityLiters: 6.2,
    oilChangeIntervalKm: 6000,
    fuelTankCapacityLiters: 75.0,
    fuelType: 'diesel',
    expectedMileageKmL: 11.0,
    tirePressureFrontPsi: 38,
    tirePressureRearPsi: 44
  },

  // ==========================================
  // 🚚 HEAVY TRUCKS & COMMERCIALS
  // ==========================================
  {
    id: 'tata_1615_truck',
    category: 'truck',
    manufacturer: 'Tata',
    model: '1615 / 1613 Heavy Cargo Truck',
    versionCc: '5883cc Cummins 6BT5.9',
    engineOilGrade: '15W-40 Heavy Duty CI-4/CH-4',
    engineOilCapacityLiters: 14.0,
    oilChangeIntervalKm: 10000,
    fuelTankCapacityLiters: 250.0,
    fuelType: 'diesel',
    expectedMileageKmL: 4.2,
    tirePressureFrontPsi: 110,
    tirePressureRearPsi: 115
  },
  {
    id: 'ashok_leyland_ecomet',
    category: 'truck',
    manufacturer: 'Ashok Leyland',
    model: 'Ecomet / 1616 Heavy Truck',
    versionCc: '3839cc / 5660cc H-Series',
    engineOilGrade: '15W-40 Gulf Superfleet',
    engineOilCapacityLiters: 13.5,
    oilChangeIntervalKm: 10000,
    fuelTankCapacityLiters: 200.0,
    fuelType: 'diesel',
    expectedMileageKmL: 4.8,
    tirePressureFrontPsi: 105,
    tirePressureRearPsi: 110
  },

  // ==========================================
  // 🚌 PASSENGER BUSES
  // ==========================================
  {
    id: 'hino_1j_bus',
    category: 'bus',
    manufacturer: 'Hino',
    model: 'AK1J / RM2 Passenger Coach',
    versionCc: '7684cc J08C-F 6-Cylinder',
    engineOilGrade: '15W-40 Hino Genuine Turbo',
    engineOilCapacityLiters: 12.5,
    oilChangeIntervalKm: 10000,
    fuelTankCapacityLiters: 200.0,
    fuelType: 'diesel',
    expectedMileageKmL: 4.5,
    tirePressureFrontPsi: 105,
    tirePressureRearPsi: 110
  }
];

// Helper to lookup catalog items by category with custom models merged
export const getCatalogByCategory = (category: VehicleType): VehicleCatalogItem[] => {
  const customSpecs = getCustomVehicleSpecs();
  const all = [...VEHICLE_CATALOG, ...customSpecs];
  return all.filter(v => v.category === category);
};

// Helper to get custom user/admin saved vehicle models
export const getCustomVehicleSpecs = (): VehicleCatalogItem[] => {
  try {
    const raw = localStorage.getItem('gps_custom_vehicle_specs');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
};

// Save a new vehicle model (Added by Admin or User)
export const saveCustomVehicleSpec = (item: VehicleCatalogItem): void => {
  try {
    const existing = getCustomVehicleSpecs();
    const updated = [item, ...existing.filter(x => x.id !== item.id)];
    localStorage.setItem('gps_custom_vehicle_specs', JSON.stringify(updated));
  } catch (e) {}
};

// Helper to get all distinct manufacturers for a category
export const getManufacturersByCategory = (category: VehicleType): string[] => {
  const items = getCatalogByCategory(category);
  const set = new Set<string>();
  items.forEach(i => set.add(i.manufacturer));
  return Array.from(set);
};

// Helper to get models for a manufacturer and category
export const getModelsByManufacturer = (category: VehicleType, manufacturer: string): VehicleCatalogItem[] => {
  return getCatalogByCategory(category).filter(v => v.manufacturer.toLowerCase() === manufacturer.toLowerCase());
};

// =========================================================================
// 🧠 AI VEHICLE SPECIFICATION GENERATOR (Past, Present & Future Models)
// =========================================================================
export const generateAiVehicleSpec = (
  manufacturer: string,
  modelName: string,
  category: VehicleType = 'motorcycle'
): VehicleCatalogItem => {
  const brand = (manufacturer || 'Vehicle').trim();
  const model = (modelName || 'Standard').trim();
  const nameCombined = `${brand} ${model}`.toLowerCase();

  const id = `ai_${brand.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${model.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now().toString().slice(-4)}`;

  // 1. Motorcycle & Scooter AI Inference
  if (category === 'motorcycle' || category === 'scooter') {
    const isScooter = category === 'scooter' || nameCombined.includes('scoot') || nameCombined.includes('activa') || nameCombined.includes('access') || nameCombined.includes('vespa') || nameCombined.includes('dio') || nameCombined.includes('ntorq') || nameCombined.includes('fascino');
    const isHighCc = nameCombined.includes('250') || nameCombined.includes('300') || nameCombined.includes('350') || nameCombined.includes('400') || nameCombined.includes('500') || nameCombined.includes('650') || nameCombined.includes('duke') || nameCombined.includes('ninja') || nameCombined.includes('bullet') || nameCombined.includes('classic') || nameCombined.includes('hunter') || nameCombined.includes('interceptor');
    const isLiquidCooled = nameCombined.includes('r15') || nameCombined.includes('mt15') || nameCombined.includes('cbr') || nameCombined.includes('duke') || nameCombined.includes('rc200') || nameCombined.includes('ns200') || nameCombined.includes('gixxer sf 250');
    const isSynthetic = isHighCc || isLiquidCooled || nameCombined.includes('4v') || nameCombined.includes('fi') || nameCombined.includes('abs');

    return {
      id,
      category: isScooter ? 'scooter' : 'motorcycle',
      manufacturer: brand,
      model: model,
      versionCc: isHighCc ? '250cc-400cc DOHC/EFI' : isScooter ? '110cc-125cc CVT' : '150cc-165cc Single Cylinder',
      engineOilGrade: isScooter ? '10W-30 MB JASO Scooter' : isLiquidCooled ? '10W-40 JASO MA2 Full Synthetic' : isSynthetic ? '20W-50 Synthetic 4T' : '20W-50 4T Mineral',
      engineOilCapacityLiters: isHighCc ? 1.5 : isLiquidCooled ? 1.05 : isScooter ? 0.8 : 1.15,
      oilChangeIntervalKm: isLiquidCooled ? 3000 : isSynthetic ? 2500 : isScooter ? 2000 : 2000,
      fuelTankCapacityLiters: isScooter ? 5.5 : isHighCc ? 14.0 : 13.0,
      fuelType: 'octane',
      expectedMileageKmL: isScooter ? 45.0 : isHighCc ? 30.0 : 42.0,
      tirePressureFrontPsi: isScooter ? 22 : 25,
      tirePressureRearPsi: isScooter ? 29 : 29
    };
  }

  // 2. Private Cars, Sedan, SUV, Microbus
  if (category === 'car' || category === 'pickup') {
    const isDiesel = nameCombined.includes('diesel') || nameCombined.includes('d-4d') || nameCombined.includes('crdi') || nameCombined.includes('turbo') || nameCombined.includes('hilux') || nameCombined.includes('hiace') || nameCombined.includes('prado') || nameCombined.includes('fortuner');
    const isHybrid = nameCombined.includes('hybrid') || nameCombined.includes('aqua') || nameCombined.includes('prius') || nameCombined.includes('cross') || nameCombined.includes('vezel') || nameCombined.includes('ch-r') || nameCombined.includes('fit');
    const isSuv = nameCombined.includes('suv') || nameCombined.includes('harrier') || nameCombined.includes('prado') || nameCombined.includes('scorpio') || nameCombined.includes('xuv') || nameCombined.includes('creta') || nameCombined.includes('outlander');

    return {
      id,
      category: 'car',
      manufacturer: brand,
      model: model,
      versionCc: isHybrid ? '1.5L / 1.8L VVTi Hybrid Engine' : isDiesel ? '2.4L-2.8L Turbo Diesel Common Rail' : isSuv ? '2.0L-2.5L DOHC 16-Valve' : '1.5L 4-Cylinder DOHC VVTi',
      engineOilGrade: isHybrid ? '0W-20 / 0W-16 Ultra Synthetic' : isDiesel ? '15W-40 CI-4 Diesel Turbo' : '5W-30 Full Synthetic API SP',
      engineOilCapacityLiters: isDiesel ? 6.5 : isSuv ? 4.5 : isHybrid ? 3.7 : 3.7,
      oilChangeIntervalKm: isHybrid ? 6000 : isDiesel ? 5000 : 5000,
      fuelTankCapacityLiters: isDiesel ? 70.0 : isSuv ? 60.0 : isHybrid ? 40.0 : 50.0,
      fuelType: isDiesel ? 'diesel' : 'octane',
      expectedMileageKmL: isHybrid ? 22.0 : isDiesel ? 11.0 : isSuv ? 10.0 : 13.5,
      tirePressureFrontPsi: 32,
      tirePressureRearPsi: 32
    };
  }

  // 3. Commercial Trucks & Pickups
  if (category === 'truck') {
    return {
      id,
      category: 'truck',
      manufacturer: brand,
      model: model,
      versionCc: '3.8L-6.0L Turbocharged Diesel Engine',
      engineOilGrade: '15W-40 Heavy Duty CI-4 / CH-4',
      engineOilCapacityLiters: 14.0,
      oilChangeIntervalKm: 10000,
      fuelTankCapacityLiters: 200.0,
      fuelType: 'diesel',
      expectedMileageKmL: 4.5,
      tirePressureFrontPsi: 105,
      tirePressureRearPsi: 110
    };
  }

  // 4. Passenger Buses
  if (category === 'bus') {
    return {
      id,
      category: 'bus',
      manufacturer: brand,
      model: model,
      versionCc: '6.0L-7.8L 6-Cylinder Heavy Diesel Engine',
      engineOilGrade: '15W-40 Heavy Duty Turbo Diesel',
      engineOilCapacityLiters: 16.0,
      oilChangeIntervalKm: 10000,
      fuelTankCapacityLiters: 250.0,
      fuelType: 'diesel',
      expectedMileageKmL: 4.2,
      tirePressureFrontPsi: 110,
      tirePressureRearPsi: 115
    };
  }

  // 5. CNG / Auto Rickshaw
  if (category === 'cng' || category === 'auto') {
    return {
      id,
      category: 'cng',
      manufacturer: brand,
      model: model,
      versionCc: '198.8cc 4-Stroke CNG / LPG Engine',
      engineOilGrade: '20W-50 Dedicated CNG Gas Engine Oil',
      engineOilCapacityLiters: 1.25,
      oilChangeIntervalKm: 2500,
      fuelTankCapacityLiters: 8.0,
      fuelType: 'cng',
      expectedMileageKmL: 32.0,
      tirePressureFrontPsi: 28,
      tirePressureRearPsi: 34
    };
  }

  // 6. Default Fallback
  return {
    id,
    category,
    manufacturer: brand,
    model: model,
    versionCc: 'Standard OEM Engine',
    engineOilGrade: '10W-40 / 20W-50 Recommended',
    engineOilCapacityLiters: 1.2,
    oilChangeIntervalKm: 2500,
    fuelTankCapacityLiters: 15.0,
    fuelType: 'octane',
    expectedMileageKmL: 38.0,
    tirePressureFrontPsi: 25,
    tirePressureRearPsi: 29
  };
};

// =========================================================================
// 📄 AI USER MANUAL & MAINTENANCE GUIDE GENERATOR
// =========================================================================
export interface AiVehicleManual {
  vehicleName: string;
  category: string;
  manufacturer: string;
  model: string;
  engineSpec: string;
  recommendedOil: string;
  oilCapacityLiters: number;
  serviceIntervalKm: number;
  fuelTankLiters: number;
  tirePressureFront: number;
  tirePressureRear: number;
  checklist: { title: string; interval: string; descriptionBn: string }[];
  drivingTipsBn: string[];
  emergencyGuideBn: string[];
}

export const generateAiVehicleManual = (spec: any): AiVehicleManual => {
  const brand = spec?.manufacturer || 'Bajaj';
  const model = spec?.modelName || spec?.model || 'Avenger 160 Street';
  const cat = spec?.category || 'motorcycle';
  const oilGrade = spec?.engineOilGrade || '20W-50 DTS-i 4T';
  const oilCap = spec?.engineOilCapacityLiters || 1.15;
  const interval = spec?.oilChangeIntervalKm || 2500;
  const tank = spec?.fuelTankCapacityLiters || 13;
  const frontPsi = spec?.tirePressureFrontPsi || 21;
  const rearPsi = spec?.tirePressureRearPsi || 28;

  return {
    vehicleName: `${brand} ${model}`,
    category: cat,
    manufacturer: brand,
    model: model,
    engineSpec: spec?.versionCc || 'DTS-i / Fuel Injected 4-Stroke Engine',
    recommendedOil: oilGrade,
    oilCapacityLiters: oilCap,
    serviceIntervalKm: interval,
    fuelTankLiters: tank,
    tirePressureFront: frontPsi,
    tirePressureRear: rearPsi,
    checklist: [
      {
        title: 'ইঞ্জিন অয়েল ও ফিল্টার পরিবর্তন',
        interval: `প্রতি ${interval} কি.মি. পর পর`,
        descriptionBn: `প্রস্তাবিত গ্রেড ${oilGrade} ব্যবহার করুন। ড্রেন করে সঠিক মাপে ঠিক ${oilCap} লিটার ঢালুন। ওভারফিল বা কম অয়েল ইঞ্জিনের ক্ষতি করে।`
      },
      {
        title: 'টায়ার প্রেশার ও গ্রিপ চেক',
        interval: 'প্রতি ৭ দিন পর পর (ঠান্ডা অবস্থায়)',
        descriptionBn: `সামনের চাকায় ${frontPsi} PSI এবং পেছনের চাকায় ${rearPsi} PSI প্রেশার বজায় রাখুন। এতে মাইলেজ ও ব্যালেন্স সর্বোচ্চ থাকবে।`
      },
      {
        title: 'ড্রাইভ চেইন লুব্রিকেশন ও স্ল্যাক এডজাস্ট',
        interval: 'প্রতি ৫০০ - ৭০০ কি.মি.',
        descriptionBn: 'চেইন পরিষ্কার করে ডেডিকেটেড চেইন লুব স্প্রে করুন। চেইনের ২৫-৩০ মিমি ফ্রি প্লে থাকতে হবে।'
      },
      {
        title: 'স্পার্ক প্লাগ ও এয়ার ফিল্টার ক্লিনিং',
        interval: 'প্রতি ৫,০০০ কি.মি.',
        descriptionBn: 'এয়ার ফিল্টার ডাস্ট ব্লোয়ার দিয়ে পরিষ্কার করুন। প্লাগ গ্যাপ ০.৭ - ০.৮ মিমি রাখুন।'
      },
      {
        title: 'ব্রেক প্যাড ও ফ্লুইড ইনস্পেকশন',
        interval: 'প্রতি ৩,০০০ কি.মি.',
        descriptionBn: 'DOT4 ব্রেক ফ্লুইড লেভেল ও ডিস্ক প্যাডের পুরুত্ব ন্যূনতম ২ মিমি নিশ্চিত করুন।'
      }
    ],
    drivingTipsBn: [
      'সকালে ইঞ্জিন স্টার্ট দিয়ে ৩০-৪৫ সেকেন্ড আইডল রাখুন যাতে পুরো চেম্বারে ইঞ্জিন অয়েল সঞ্চালিত হতে পারে।',
      'ঘন ঘন হার্ড এক্সিলারেশন ও হার্ড ব্রেকিং এড়িয়ে চলুন, এতে ১০-১৫% জ্বালানি সাশ্রয় হবে।',
      `জ্বালানি ট্যাংক ধারণক্ষমতা ${tank} লিটার—ট্যাংক সম্পূর্ণ শুকিয়ে ফেলার আগেই রিফুয়েলিং করুন।`
    ],
    emergencyGuideBn: [
      'হঠাৎ ইঞ্জিন বন্ধ হয়ে গেলে: EasyTracker অ্যাপে গিয়ে ইঞ্জিন কাটঅফ স্ট্যাটাস (Relay Lock) ও মূল ব্যাটারি ভোল্টেজ চেক করুন।',
      'ব্যাটারি লো ভোল্টেজ অ্যালার্ট আসলে: ১২V-এর নিচে নামলে ব্যাটারি চার্জার বা ডায়নামো ওয়্যারিং টেস্ট করুন।',
      'বাইক চুরি বা ছিনতাই হলে: সাথে সাথে অ্যাপের ৩-ডট মেনু থেকে [ইঞ্জিন লক ও ফুয়েল কাট] চাপুন।'
    ]
  };
};
