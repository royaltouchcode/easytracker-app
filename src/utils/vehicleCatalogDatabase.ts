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

// Helper to lookup catalog items by category
export const getCatalogByCategory = (category: VehicleType): VehicleCatalogItem[] => {
  return VEHICLE_CATALOG.filter(v => v.category === category);
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
  return VEHICLE_CATALOG.filter(v => v.category === category && v.manufacturer === manufacturer);
};
