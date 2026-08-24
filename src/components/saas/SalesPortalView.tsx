import React, { useState, useRef } from 'react';
import { 
  Briefcase, 
  ArrowLeft, 
  UserPlus, 
  CheckCircle2, 
  DollarSign, 
  Search, 
  Clock, 
  ShieldCheck, 
  Plus, 
  Phone, 
  Tag, 
  Layers, 
  Scan, 
  Camera, 
  X, 
  ChevronRight, 
  Sparkles, 
  Info,
  Car,
  Bike,
  Truck
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { VehicleType } from '../../types/traccar';

// Popular Vehicle Catalogs for Bangladesh Market
const VEHICLE_CATALOG: Record<string, {
  brands: {
    brand: string;
    models: {
      name: string;
      versions: string[];
    }[];
  }[];
}> = {
  motorcycle: {
    brands: [
      {
        brand: 'Bajaj',
        models: [
          { name: 'Avenger 160', versions: ['160 Street ABS', '220 Cruise'] },
          { name: 'Pulsar 150', versions: ['Single Disc', 'Twin Disc ABS', 'Neon Edition'] },
          { name: 'Pulsar NS160', versions: ['Dual Channel ABS Fi', 'Single Disc Carb'] },
          { name: 'Discover 125', versions: ['Disc CBS', 'Drum Edition'] },
          { name: 'Platina 110', versions: ['H-Gear Disc', '100 ES Comfortec'] }
        ]
      },
      {
        brand: 'Yamaha',
        models: [
          { name: 'FZ-S Fi', versions: ['V3 Deluxe Bluetooth', 'V4 Fi Hybrid', 'V2 FI DD'] },
          { name: 'R15', versions: ['V4 Racing Blue ABS', 'V3 Dual ABS', 'R15M Edition'] },
          { name: 'MT-15', versions: ['V2 Dual Channel ABS', 'V1 Matte Black'] },
          { name: 'Ray ZR', versions: ['125 Fi Hybrid Scooter', 'Street Rally'] }
        ]
      },
      {
        brand: 'Honda',
        models: [
          { name: 'CB Shine', versions: ['125 SP Disc', 'Drum Edition'] },
          { name: 'XBlade 160', versions: ['Single Disc', 'Dual Disc ABS'] },
          { name: 'Hornet', versions: ['2.0 Dual Disc', '160R CBS'] },
          { name: 'CBR 150R', versions: ['MotoGP Edition ABS', 'Tricolor ABS'] }
        ]
      },
      {
        brand: 'Suzuki',
        models: [
          { name: 'Gixxer 155', versions: ['Carb Dual Disc', 'Fi ABS Single Disc'] },
          { name: 'Gixxer SF 155', versions: ['Fi ABS Special Edition', 'MotoGP Blue'] },
          { name: 'GSX-R 150', versions: ['Keyless Fi ABS', 'BOSCH Dual ABS'] },
          { name: 'Access 125', versions: ['Bluetooth Special Edition', 'Drum Alloy'] }
        ]
      },
      {
        brand: 'TVS',
        models: [
          { name: 'Apache RTR 160 4V', versions: ['SmartXonnect Dual Disc', 'Single Disc ABS', 'Special Edition'] },
          { name: 'Apache RTR 160 2V', versions: ['Single Disc', 'Race Edition 2V'] },
          { name: 'Metro Plus', versions: ['110 Drum', '110 Disc CBS'] }
        ]
      }
    ]
  },
  car: {
    brands: [
      {
        brand: 'Toyota',
        models: [
          { name: 'Corolla Axio', versions: ['1.5 G-Grade', 'Hybrid X', 'WXB Aerotourer'] },
          { name: 'Premio', versions: ['F-Grade Package', 'FL Package 1.5'] },
          { name: 'Allion', versions: ['A15 G-Plus', 'A18 Edition'] },
          { name: 'Corolla Fielder', versions: ['Hybrid G-WXB', 'X-Grade'] },
          { name: 'Aqua', versions: ['S-Package Hybrid', 'G-Grade'] },
          { name: 'Noah', versions: ['Si WXB', 'X-Package 8 Seater'] }
        ]
      },
      {
        brand: 'Honda',
        models: [
          { name: 'Vezel', versions: ['RS Hybrid Sensing', 'Z-Grade Luxury'] },
          { name: 'Grace', versions: ['EX Hybrid Dual Clutch', 'DX Sedan'] },
          { name: 'Civic', versions: ['1.5 VTEC Turbo', 'EX Sedan'] }
        ]
      },
      {
        brand: 'Nissan',
        models: [
          { name: 'X-Trail', versions: ['Hybrid 4WD Sensing', '20X Package'] },
          { name: 'Bluebird Sylphy', versions: ['1.5 Classic', '2.0 G'] }
        ]
      }
    ]
  },
  cng: {
    brands: [
      {
        brand: 'Bajaj',
        models: [
          { name: 'RE 4S CNG Auto', versions: ['4-Stroke Digital Meter', 'Commercial 200cc'] },
          { name: 'Maxima Z', versions: ['CNG Passenger Van', 'Cargo Hauler'] }
        ]
      },
      {
        brand: 'Piaggio',
        models: [
          { name: 'Ape City', versions: ['CNG Passenger', 'Ape Xtra Dlx'] }
        ]
      }
    ]
  },
  truck: {
    brands: [
      {
        brand: 'Tata',
        models: [
          { name: '1615 Ex', versions: ['Turbo Heavy Hauler', 'Chassis Cowl'] },
          { name: 'LPT 407', versions: ['Ex Pickup Truck', 'Semi High Deck'] },
          { name: 'Ace Mega (দিওয়ালা)', versions: ['1 Ton Mini Hauler', 'Ace Gold'] }
        ]
      },
      {
        brand: 'Mahindra',
        models: [
          { name: 'Bolero Maxi Truck', versions: ['Plus Power Steering', 'City Pickup'] },
          { name: 'Maxximo HD', versions: ['8 Wheeler Cargo', 'Mini Van'] }
        ]
      }
    ]
  }
};

const POPULAR_TRACKERS = [
  { model: 'Concox GT06N', protocol: 'gt06', port: '5023', type: '2G/3G ACC Wire + Relay' },
  { model: 'SinoTrack ST-901', protocol: 'sinotrack', port: '5013', type: 'Waterproof Built-in Battery' },
  { model: 'Jimi IoT VL02 (4G)', protocol: 'jimi', port: '5023', type: '4G LTE Ultra Fast' },
  { model: 'Teltonika FMB920', protocol: 'teltonika', port: '5027', type: 'European Quality Precision' },
  { model: 'Coban TK303', protocol: 'coban', port: '5001', type: 'Standard GPS/GSM' }
];

export interface SalesLeadEntry {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  plate: string;
  category: VehicleType;
  brand: string;
  model: string;
  version: string;
  trackerModel: string;
  imei: string;
  sim: string;
  plan: string;
  commission: number;
  date: string;
  status: 'pending_admin_approval' | 'approved_pushed' | 'rejected';
}

export const SalesPortalView: React.FC = () => {
  const { language, setActiveTab, setCurrentRole, user } = useApp();

  const isSuperAdmin = user?.administrator || user?.role === 'super_admin';
  const hasMultipleRoles = isSuperAdmin || (user?.approvedRoles && user.approvedRoles.length > 1);

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [plateNumber, setPlateNumber] = useState('');
  
  // Cascading Vehicle State
  const [vehicleCategory, setVehicleCategory] = useState<VehicleType>('motorcycle');
  const [selectedBrand, setSelectedBrand] = useState('Bajaj');
  const [selectedModel, setSelectedModel] = useState('Avenger 160');
  const [selectedVersion, setSelectedVersion] = useState('160 Street ABS');
  const [isCustomVehicle, setIsCustomVehicle] = useState(false);
  const [customVehicleName, setCustomVehicleName] = useState('');

  // Tracker & SIM State
  const [trackerModel, setTrackerModel] = useState('Concox GT06N');
  const [imeiInput, setImeiInput] = useState('');
  const [simNumberInput, setSimNumberInput] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('স্ট্যান্ডার্ড প্ল্যান (৳৪৫০/মাস)');

  // Barcode Scanner Modal State
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Leads Queue State
  const [leads, setLeads] = useState<SalesLeadEntry[]>(() => {
    const saved = localStorage.getItem('gps_sales_leads_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { 
        id: 'LEAD-901', 
        customer: 'Mohammad Azhar', 
        phone: '01700-000000', 
        vehicle: 'Bajaj Avenger 160 (160 Street ABS)', 
        plate: 'DHAKA METRO-LA 11-2233', 
        category: 'motorcycle', 
        brand: 'Bajaj',
        model: 'Avenger 160',
        version: '160 Street ABS',
        trackerModel: 'Concox GT06N',
        imei: '864720058291034', 
        sim: '01700000000',
        plan: 'স্ট্যান্ডার্ড প্ল্যান (৳৪৫০/মাস)', 
        commission: 500, 
        date: '24 Aug 2026', 
        status: 'approved_pushed' 
      }
    ];
  });

  // Current category brands
  const currentCategoryData = VEHICLE_CATALOG[vehicleCategory] || VEHICLE_CATALOG.motorcycle;
  const currentBrandData = currentCategoryData.brands.find(b => b.brand === selectedBrand) || currentCategoryData.brands[0];
  const currentModelData = currentBrandData?.models.find(m => m.name === selectedModel) || currentBrandData?.models[0];

  const handleCategoryChange = (cat: VehicleType) => {
    setVehicleCategory(cat);
    const catData = VEHICLE_CATALOG[cat];
    if (catData && catData.brands.length > 0) {
      setIsCustomVehicle(false);
      setSelectedBrand(catData.brands[0].brand);
      setSelectedModel(catData.brands[0].models[0].name);
      setSelectedVersion(catData.brands[0].models[0].versions[0] || 'Standard');
    } else {
      setIsCustomVehicle(true);
    }
  };

  const handleBrandChange = (brand: string) => {
    setSelectedBrand(brand);
    const bData = currentCategoryData.brands.find(b => b.brand === brand);
    if (bData && bData.models.length > 0) {
      setSelectedModel(bData.models[0].name);
      setSelectedVersion(bData.models[0].versions[0] || 'Standard');
    }
  };

  const handleModelChange = (modelName: string) => {
    setSelectedModel(modelName);
    const mData = currentBrandData?.models.find(m => m.name === modelName);
    if (mData && mData.versions.length > 0) {
      setSelectedVersion(mData.versions[0]);
    }
  };

  // Simulated Camera Barcode Scanner
  const handleOpenScanner = () => {
    setIsScannerOpen(true);
    setIsScanningActive(true);
  };

  const handleSimulateScan = (scannedImei: string) => {
    setImeiInput(scannedImei);
    setIsScanningActive(false);
    setIsScannerOpen(false);
  };

  // Form Submit Handler
  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !imeiInput) {
      alert('অনুগ্রহ করে কাস্টমারের নাম, ফোন ও ডিভাইসের IMEI পূরণ করুন!');
      return;
    }

    const fullVehicleName = isCustomVehicle 
      ? (customVehicleName || 'Custom Vehicle') 
      : `${selectedBrand} ${selectedModel} (${selectedVersion})`;

    const newLead: SalesLeadEntry = {
      id: `LEAD-${Date.now().toString().slice(-4)}`,
      customer: customerName.trim(),
      phone: customerPhone.trim(),
      vehicle: fullVehicleName,
      plate: plateNumber.trim() || 'রেজিস্ট্রেশন প্রক্রিয়াধীন',
      category: vehicleCategory,
      brand: isCustomVehicle ? 'Custom' : selectedBrand,
      model: isCustomVehicle ? customVehicleName : selectedModel,
      version: isCustomVehicle ? 'Custom' : selectedVersion,
      trackerModel: trackerModel,
      imei: imeiInput.trim(),
      sim: simNumberInput.trim() || 'N/A',
      plan: subscriptionPlan,
      commission: 500,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      status: 'pending_admin_approval'
    };

    const updated = [newLead, ...leads];
    setLeads(updated);
    localStorage.setItem('gps_sales_leads_queue', JSON.stringify(updated));

    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
      setCustomerName('');
      setCustomerPhone('');
      setPlateNumber('');
      setImeiInput('');
      setSimNumberInput('');
    }, 2500);
  };

  const totalEarnedCommission = leads
    .filter(l => l.status === 'approved_pushed')
    .reduce((sum, l) => sum + l.commission, 0);

  const pendingApprovalCount = leads.filter(l => l.status === 'pending_admin_approval').length;

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2.5">
          {hasMultipleRoles && (
            <button
              onClick={() => {
                setCurrentRole('customer');
                setActiveTab('map');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
            </button>
          )}
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-emerald-300">
              <Briefcase className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'সেলস পোর্টাল ও কাস্টমার অনবোর্ডিং' : 'Sales & Onboarding Hub'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'ক্যাসকেডিং গাড়ি মডেল ও বারকোড দিয়ে দ্রুত এন্ট্রি' : 'Fast onboarding with barcode scan & model selector'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-400 block">অনুমোদিত মোট কমিশন</span>
          <span className="text-xs font-mono font-black text-emerald-400">৳{totalEarnedCommission.toLocaleString()}</span>
          {pendingApprovalCount > 0 && (
            <span className="text-[8.5px] text-amber-400 block font-bold">পেন্ডিং: {pendingApprovalCount} টি</span>
          )}
        </div>
      </div>

      {/* Main Onboarding Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-1.5">
            <UserPlus className="w-4 h-4 text-emerald-400" />
            <span>নতুন কাস্টমার ও ট্র্যাকার অনবোর্ডিং ফর্ম</span>
          </span>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-800">
            কমিশন: ৳৫০০/গাড়ি
          </span>
        </div>

        <form onSubmit={handleLeadSubmit} className="space-y-3 text-xs">
          {/* Step 1: Customer Contacts */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কাস্টমারের পুরো নাম *</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="যেমন: তানভীর আহমেদ"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[10.5px] font-bold text-slate-300 block mb-1">কাস্টমারের মোবাইল নম্বর *</label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Step 2: Cascading Vehicle Selector */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
              <Car className="w-3.5 h-3.5 text-blue-400" />
              <span>গাড়ির ধরন, ব্র্যান্ড, মডেল ও ভার্সন নির্বাচন</span>
            </span>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'motorcycle', label: '🏍️ বাইক', icon: Bike },
                { id: 'car', label: '🚗 কার / সিডান', icon: Car },
                { id: 'cng', label: '🛺 সিএনজি', icon: Car },
                { id: 'truck', label: '🚚 ট্রাক / পিকআপ', icon: Truck }
              ].map(cat => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id as VehicleType)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition ${
                    vehicleCategory === cat.id 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Cascading Dropdowns */}
            {!isCustomVehicle ? (
              <div className="grid grid-cols-3 gap-2 pt-1">
                {/* Brand */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">ব্র্যান্ড / প্রস্তুতকারক:</label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => handleBrandChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none cursor-pointer"
                  >
                    {currentCategoryData.brands.map(b => (
                      <option key={b.brand} value={b.brand}>{b.brand}</option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">মডেল:</label>
                  <select
                    value={selectedModel}
                    onChange={(e) => handleModelChange(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none cursor-pointer"
                  >
                    {currentBrandData?.models.map(m => (
                      <option key={m.name} value={m.name}>{m.name}</option>
                    ))}
                  </select>
                </div>

                {/* Version / Trim */}
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">এডিশন / ভার্সন:</label>
                  <select
                    value={selectedVersion}
                    onChange={(e) => setSelectedVersion(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none cursor-pointer"
                  >
                    {currentModelData?.versions.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="pt-1">
                <label className="text-[10px] font-bold text-slate-400 block mb-1">কাস্টম গাড়ির পুরো নাম ও মডেল লিখুন:</label>
                <input
                  type="text"
                  value={customVehicleName}
                  onChange={(e) => setCustomVehicleName(e.target.value)}
                  placeholder="যেমন: Mahindra XUV700 AX7 Luxury"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-medium focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setIsCustomVehicle(!isCustomVehicle)}
                className="text-[10px] text-blue-400 hover:underline font-semibold"
              >
                {isCustomVehicle ? '➔ তালিকাভুক্ত ড্রপডাউন থেকে নির্বাচন করুন' : '➕ তালিকায় নেই? কাস্টম নাম লিখুন (Others)'}
              </button>

              <div className="w-1/2">
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  placeholder="নাম্বার প্লেট (যেমন: ঢাকা মেট্রো-ল ১১-২২৩৩)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] text-white font-medium focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Tracker Device & Camera Barcode Scanner */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 flex items-center space-x-1">
                <Tag className="w-3.5 h-3.5 text-emerald-400" />
                <span>ট্র্যাকার ডিভাইস মডেল ও ১৫-ডিজিট IMEI</span>
              </span>

              {/* Live Camera Barcode Scanner Trigger Button */}
              <button
                type="button"
                onClick={handleOpenScanner}
                className="px-2.5 py-1 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-bold text-[10px] flex items-center space-x-1 shadow-sm transition active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                <span>📷 বারকোড স্ক্যানার</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">ট্র্যাকার ডিভাইস মডেল:</label>
                <select
                  value={trackerModel}
                  onChange={(e) => setTrackerModel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none cursor-pointer"
                >
                  {POPULAR_TRACKERS.map(t => (
                    <option key={t.model} value={t.model}>{t.model} ({t.type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">১৫-ডিজিট ডিভাইস IMEI *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={imeiInput}
                    onChange={(e) => setImeiInput(e.target.value)}
                    placeholder="86472005829XXXX"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-2.5 pr-8 py-1.5 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                  <Scan className="w-4 h-4 absolute right-2.5 top-2 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">ট্র্যাকারের ভেতরে থাকা সিম নম্বর:</label>
                <input
                  type="tel"
                  value={simNumberInput}
                  onChange={(e) => setSimNumberInput(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono font-medium focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">সাবস্ক্রিপশন প্ল্যান:</label>
                <select
                  value={subscriptionPlan}
                  onChange={(e) => setSubscriptionPlan(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-white font-bold focus:outline-none cursor-pointer"
                >
                  <option value="বেসিক প্ল্যান (৳৩০০/মাস)">বেসিক প্ল্যান (৳৩০০/মাস)</option>
                  <option value="স্ট্যান্ডার্ড প্ল্যান (৳৪৫০/মাস)">স্ট্যান্ডার্ড প্ল্যান (৳৪৫০/মাস)</option>
                  <option value="এন্টারপ্রাইজ ফ্লীট (৳৭৫০/মাস)">এন্টারপ্রাইজ ফ্লীট (৳৭৫০/মাস)</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-xl shadow-emerald-600/40 flex items-center justify-center space-x-2 transition active:scale-95 border border-emerald-400"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{submittedSuccess ? 'অনবোর্ডিং সফল! অ্যাডমিন অনুমোদনের অপেক্ষায়...' : 'অনবোর্ডিং সাবমিট করুন (অ্যাডমিন অনুমোদনের কিউতে যাবে)'}</span>
          </button>
        </form>
      </div>

      {/* Sales Leads Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          আমার সাবমিটকৃত কাস্টমার তালিকা ({leads.length})
        </span>

        <div className="space-y-2">
          {leads.map((lead) => (
            <div key={lead.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs hover:border-slate-700 transition">
              <div>
                <div className="font-extrabold text-slate-100 flex items-center space-x-2">
                  <span>{lead.customer}</span>
                  <span className="text-slate-400 font-mono text-[10px]">({lead.phone})</span>
                </div>
                <div className="text-[10.5px] text-slate-300 mt-0.5 font-medium">
                  {lead.vehicle} • প্লেট: {lead.plate}
                </div>
                <div className="text-[9.5px] text-slate-400 font-mono mt-0.5">
                  IMEI: {lead.imei} • {lead.plan}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                  lead.status === 'approved_pushed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                  lead.status === 'pending_admin_approval' ? 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse' :
                  'bg-rose-950 text-rose-300 border-rose-700'
                }`}>
                  {lead.status === 'approved_pushed' ? '🟢 সার্ভারে লাইভ (৳৫০০)' :
                   lead.status === 'pending_admin_approval' ? '🟡 পেন্ডিং অ্যাডমিন অনুমোদন' :
                   '🔴 বাতিলকৃত'}
                </span>
                <div className="text-[9px] text-slate-500 mt-1">{lead.date}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 📷 CAMERA BARCODE / QR CODE SCANNER MODAL                                  */}
      {/* ========================================================================= */}
      {isScannerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>📷 জিপিএস ট্র্যাকার IMEI বারকোড স্ক্যানার</span>
              </span>
              <button onClick={() => setIsScannerOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Viewfinder Reticle */}
            <div className="relative w-full h-48 bg-slate-950 rounded-2xl border-2 border-dashed border-emerald-500/60 flex flex-col items-center justify-center overflow-hidden">
              {/* Laser Scan Line Animation */}
              <div className="absolute w-full h-0.5 bg-rose-500 shadow-lg shadow-rose-500/80 animate-bounce top-1/2"></div>
              
              <Scan className="w-12 h-12 text-emerald-400/40 animate-pulse" />
              <span className="text-[11px] text-slate-300 font-bold mt-2">বক্সের বারকোড ক্যামেরার সামনে রাখুন</span>
              <span className="text-[9px] text-slate-500">Auto-Detecting 15-Digit IMEI</span>
            </div>

            {/* Quick One-Tap IMEI Simulation Buttons for Test */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold block">বা দ্রুত টেস্ট করার জন্য নিচের IMEI স্ক্যান করুন:</span>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleSimulateScan('864720058291034')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10.5px] font-mono text-emerald-300 text-left font-bold"
                >
                  864720058291034 (Avenger)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('864720058291035')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10.5px] font-mono text-blue-300 text-left font-bold"
                >
                  864720058291035 (Axio)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('864720058291036')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10.5px] font-mono text-amber-300 text-left font-bold"
                >
                  864720058291036 (Tata Truck)
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateScan('864720058291037')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-[10.5px] font-mono text-purple-300 text-left font-bold"
                >
                  864720058291037 (CNG Auto)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
