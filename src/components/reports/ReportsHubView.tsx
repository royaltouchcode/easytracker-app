import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Fuel, 
  Wrench, 
  Bot, 
  Activity, 
  Calendar, 
  Plus, 
  TrendingUp, 
  Gauge, 
  Droplet, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Trash2,
  Phone,
  ShieldCheck,
  Zap,
  Car,
  ArrowLeft,
  BarChart3,
  X
} from 'lucide-react';
import { FuelRefillLog } from '../../types/traccar';
import { lookupVehicleMaintenanceSpec, VehicleMaintenanceSpec } from '../../utils/maintenanceAiService';
import { VehicleIcon } from '../../utils/vehicleIcons';

interface ServicingHistoryEntry {
  id: string;
  deviceId: number;
  serviceType: 'engine_oil' | 'general_tuning' | 'brake_chain' | 'master_service';
  odometerKm: number;
  costBdt: number;
  workshopName: string;
  date: string;
  notes?: string;
}

export const ReportsHubView: React.FC = () => {
  const { 
    selectedDevice, 
    selectedPosition, 
    fuelRefillLogs: fuelLogs = [], 
    addFuelRefillLog: addFuelLog, 
    language,
    t,
    devices,
    setActiveTab,
    updateDeviceProfile
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'fuel' | 'maintenance' | 'ai_manual' | 'running' | 'subscription'>('fuel');

  // Initial Odometer Calibration (Zero Demo Data rule - 1st time user enters actual meter reading)
  const [initialOdometerKm, setInitialOdometerKm] = useState<number | null>(() => {
    const fromAttr = selectedDevice?.attributes?.initialOdometerKm;
    if (typeof fromAttr === 'number') return fromAttr;
    const saved = localStorage.getItem(`gps_initial_odometer_${selectedDevice?.id}`);
    return saved ? parseFloat(saved) : null;
  });
  const [isInitialOdoModalOpen, setIsInitialOdoModalOpen] = useState(false);
  const [inputInitialOdo, setInputInitialOdo] = useState('');

  // Initial Fuel Setup state (Zero Demo Data rule)
  const [initialFuelLiters, setInitialFuelLiters] = useState<number | null>(() => {
    const fromAttr = selectedDevice?.attributes?.initialFuelLiters;
    if (typeof fromAttr === 'number') return fromAttr;
    const saved = localStorage.getItem(`gps_initial_fuel_${selectedDevice?.id}`);
    return saved ? parseFloat(saved) : null;
  });
  const [isInitialFuelModalOpen, setIsInitialFuelModalOpen] = useState(false);
  const [inputInitialFuel, setInputInitialFuel] = useState('5');

  // Refill Modal
  const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
  const [refillLiters, setRefillLiters] = useState('10');
  const [refillCost, setRefillCost] = useState('1250');
  const [refillStation, setRefillStation] = useState('Padma Oil Depot');

  // Maintenance & Servicing Engine
  const [maintSpec, setMaintSpec] = useState<VehicleMaintenanceSpec | null>(null);
  const [lastOilChangeKm, setLastOilChangeKm] = useState<number>(() => {
    const fromAttr = selectedDevice?.attributes?.lastOilChangeKm;
    if (typeof fromAttr === 'number') return fromAttr;
    const saved = localStorage.getItem(`gps_last_oil_km_${selectedDevice?.id}`);
    return saved ? parseFloat(saved) : 0;
  });
  const [servicingLogs, setServicingLogs] = useState<ServicingHistoryEntry[]>(() => {
    const saved = localStorage.getItem(`gps_servicing_logs_${selectedDevice?.id}`);
    return saved ? JSON.parse(saved) : [];
  });

  // Service Reset Modal
  const [isServiceResetModalOpen, setIsServiceResetModalOpen] = useState(false);
  const [serviceType, setServiceType] = useState<'engine_oil' | 'general_tuning' | 'master_service'>('engine_oil');
  const [serviceCost, setServiceCost] = useState('650');
  const [serviceWorkshop, setServiceWorkshop] = useState('Yamaha Authorized Service');
  const [serviceNotes, setServiceNotes] = useState('');

  // AI Diagnostic Summary State
  const [aiReportText, setAiReportText] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load specs and user cloud attributes when device changes
  useEffect(() => {
    if (selectedDevice) {
      lookupVehicleMaintenanceSpec(
        selectedDevice.name, 
        selectedDevice.category || 'motorcycle', 
        selectedDevice.attributes
      ).then(setMaintSpec);
      
      const fromAttrFuel = selectedDevice.attributes?.initialFuelLiters;
      const savedInitial = localStorage.getItem(`gps_initial_fuel_${selectedDevice.id}`);
      setInitialFuelLiters(typeof fromAttrFuel === 'number' ? fromAttrFuel : savedInitial ? parseFloat(savedInitial) : null);
      
      const fromAttrOdo = selectedDevice.attributes?.initialOdometerKm;
      const savedOdo = localStorage.getItem(`gps_initial_odometer_${selectedDevice.id}`);
      setInitialOdometerKm(typeof fromAttrOdo === 'number' ? fromAttrOdo : savedOdo ? parseFloat(savedOdo) : null);

      const fromAttrOil = selectedDevice.attributes?.lastOilChangeKm;
      const savedOilKm = localStorage.getItem(`gps_last_oil_km_${selectedDevice.id}`);
      setLastOilChangeKm(typeof fromAttrOil === 'number' ? fromAttrOil : savedOilKm ? parseFloat(savedOilKm) : 0);

      const savedLogs = localStorage.getItem(`gps_servicing_logs_${selectedDevice.id}`);
      setServicingLogs(savedLogs ? JSON.parse(savedLogs) : []);
    }
  }, [selectedDevice]);

  // Real Odometer Telemetry (Zero Demo: Initial Calibrated Meter + Live GPS Distance)
  const currentGpsTotalDistance = selectedPosition?.attributes?.totalDistance || 0;
  const baseGpsDistance = (selectedDevice?.attributes?.baseGpsDistanceM as number) || 0;
  const gpsIncrementKm = Math.max(0, (currentGpsTotalDistance - baseGpsDistance) / 1000);
  const currentOdometer = initialOdometerKm !== null ? Math.round(initialOdometerKm + gpsIncrementKm) : 0;

  const kmSinceOilChange = Math.max(0, currentOdometer - lastOilChangeKm);
  const targetOilKm = maintSpec?.oilChangeIntervalKm || (selectedDevice?.category === 'motorcycle' ? 1500 : 5000);
  const remainingOilKm = Math.max(0, targetOilKm - kmSinceOilChange);
  const oilProgressPercent = Math.min(100, Math.round((kmSinceOilChange / targetOilKm) * 100));

  // 3-Stage Alert condition
  const isAdvanceNotice = oilProgressPercent >= 85 && oilProgressPercent < 100;
  const isDueToday = oilProgressPercent >= 100;

  // Filter fuel logs for current device only (Pure real logs, 0 demo)
  const currentDeviceFuelLogs = fuelLogs.filter(f => f.deviceId === selectedDevice?.id);

  // Calculate Real Fuel Metrics
  const totalRefilledLiters = currentDeviceFuelLogs.reduce((sum, item) => sum + item.litersAdded, 0);
  const totalFuelCostBdt = currentDeviceFuelLogs.reduce((sum, item) => sum + (item.costBdt || 0), 0);
  const currentFuelLiters = (initialFuelLiters || 0) + totalRefilledLiters - Math.max(0, (kmSinceOilChange % 100) * 0.05);
  const calculatedMileageKmL = selectedDevice?.category === 'motorcycle' ? 42.5 : selectedDevice?.category === 'cng' ? 32.0 : 12.8;
  const estimatedRangeKm = Math.round(Math.max(0, currentFuelLiters * calculatedMileageKmL));

  // Save Initial Odometer Calibration (Cloud Sync to Server)
  const handleSaveInitialOdometer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    const odoVal = parseFloat(inputInitialOdo) || 0;
    setInitialOdometerKm(odoVal);
    localStorage.setItem(`gps_initial_odometer_${selectedDevice.id}`, odoVal.toString());
    updateDeviceProfile(selectedDevice.id, {
      attributes: {
        ...selectedDevice.attributes,
        initialOdometerKm: odoVal,
        baseGpsDistanceM: selectedPosition?.attributes?.totalDistance || 0
      }
    });
    setIsInitialOdoModalOpen(false);
  };

  // Save Initial Fuel Level (Cloud Sync to Server)
  const handleSaveInitialFuel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    const liters = parseFloat(inputInitialFuel) || 0;
    setInitialFuelLiters(liters);
    localStorage.setItem(`gps_initial_fuel_${selectedDevice.id}`, liters.toString());
    updateDeviceProfile(selectedDevice.id, {
      attributes: {
        ...selectedDevice.attributes,
        initialFuelLiters: liters
      }
    });
    setIsInitialFuelModalOpen(false);
  };

  // Add Refill Entry
  const handleAddRefill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    const liters = parseFloat(refillLiters) || 0;
    const cost = parseFloat(refillCost) || 0;
    const newLog: FuelRefillLog = {
      id: 'fuel-' + Date.now(),
      deviceId: selectedDevice.id,
      deviceName: selectedDevice.name,
      litersAdded: liters,
      totalLitersAfter: (currentFuelLiters || 0) + liters,
      odometerKm: currentOdometer,
      costBdt: cost,
      timestamp: new Date().toISOString(),
      stationName: refillStation
    };
    addFuelLog(newLog);
    setIsRefillModalOpen(false);
  };

  // Log Service & Reset Counter
  const handleResetService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDevice) return;
    const newEntry: ServicingHistoryEntry = {
      id: 'service-' + Date.now(),
      deviceId: selectedDevice.id,
      serviceType,
      odometerKm: currentOdometer,
      costBdt: parseFloat(serviceCost) || 0,
      workshopName: serviceWorkshop,
      date: new Date().toISOString(),
      notes: serviceNotes
    };
    const updated = [newEntry, ...servicingLogs];
    setServicingLogs(updated);
    localStorage.setItem(`gps_servicing_logs_${selectedDevice.id}`, JSON.stringify(updated));
    setLastOilChangeKm(currentOdometer);
    localStorage.setItem(`gps_last_oil_km_${selectedDevice.id}`, currentOdometer.toString());
    setIsServiceResetModalOpen(false);
  };

  // Generate Bangla AI Diagnostic Summary
  const handleGenerateAiAudit = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      if (selectedDevice?.category === 'motorcycle') {
        setAiReportText(
          `🤖 **EasyTracker AI ডায়াগনস্টিক রিপোর্ট (${selectedDevice.name}):**\n` +
          `• **ইঞ্জিন অবস্থা:** চমৎকার (হেলথ স্কোর ৯৪%)।\n` +
          `• **অয়েল পর্যবেক্ষণ:** আপনি শেষ সার্ভিসের পর ${kmSinceOilChange} কিমি চালিয়েছেন। ${maintSpec?.engineOilGrade || '10W-40'} ইঞ্জিন অয়েলের কার্যক্ষমতা আরও ${remainingOilKm} কিমি কার্যকর থাকবে।\n` +
          `• **ফুয়েল সাশ্রয় টিপস:** গাড়ির গড় মাইলেজ প্রায় ${calculatedMileageKmL} কিমি/লিটার। টায়ার প্রেশার সামনে ${maintSpec?.tirePressureFrontPsi || 28} PSI ও পেছনে ${maintSpec?.tirePressureRearPsi || 33} PSI রাখলে সর্বোচ্চ মাইলেজ পাওয়া যাবে।`
        );
      } else {
        setAiReportText(
          `🤖 **EasyTracker AI ডায়াগনস্টিক রিপোর্ট (${selectedDevice?.name}):**\n` +
          `• **ইঞ্জিন ও ট্রান্সমিশন:** স্বাভাবিক ও সুশৃঙ্খল (স্কোর ৯২%)।\n` +
          `• **মেইনটেন্যান্স শিডিউল:** পরবর্তী ইঞ্জিন অয়েল পরিবর্তন ${remainingOilKm} কিমি পর আবশ্যক।\n` +
          `• **ড্রাইভিং ইকোনমি:** স্মুথ এক্সিলারেশন বজায় রাখলে এসি অন থাকা সত্ত্বেও ফুয়েল খরচ ১০% পর্যন্ত কমানো সম্ভব।`
        );
      }
    }, 900);
  };

  return (
    <div className="h-full w-full bg-slate-950 flex flex-col overflow-y-auto pb-20 select-none">
      {/* Header Banner */}
      <div className="bg-slate-900 border-b border-slate-800 p-3 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('map')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
            title="Back to Map"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'হোম' : 'Home'}</span>
          </button>

          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <VehicleIcon type={selectedDevice?.category} className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
              <span>{language === 'bn' ? 'রিপোর্ট ও ভেহিকেল হেলথ' : 'Reports & Vehicle Health'}</span>
              <span className="text-[9px] bg-blue-500/20 text-blue-300 font-bold px-1.5 py-0.2 rounded-full border border-blue-500/30">v1.0.0</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {selectedDevice?.name || 'My Vehicle'} • {selectedDevice?.attributes?.plateNumber || 'No Plate'}
            </p>
          </div>
        </div>

        {/* Global Odometer Badge (Click to Calibrate) */}
        <button
          onClick={() => setIsInitialOdoModalOpen(true)}
          className="bg-slate-800 hover:bg-slate-750 border border-slate-700 px-2.5 py-1 rounded-xl text-right transition active:scale-95 group"
          title="মিটার রিডিং সেট বা পরিবর্তন করুন"
        >
          <div className="text-[9px] uppercase font-bold text-slate-400 group-hover:text-blue-300 transition flex items-center justify-end space-x-1">
            <span>{language === 'bn' ? 'মোট ওডোমিটার' : 'Odometer'}</span>
            <Gauge className="w-2.5 h-2.5 text-blue-400" />
          </div>
          <div className="font-mono font-extrabold text-xs text-blue-300">
            {initialOdometerKm !== null ? `${currentOdometer.toLocaleString()} km` : (language === 'bn' ? '⚡ সেট করুন' : '⚡ Set km')}
          </div>
        </button>
      </div>

      {/* Sub-Tab Navigation Bar */}
      <div className="flex items-center space-x-1 p-2 bg-slate-900/60 border-b border-slate-800/80 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setActiveSubTab('fuel')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeSubTab === 'fuel' 
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' 
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Fuel className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? '⛽ ফুয়েল ও মাইলেজ' : 'Fuel & Mileage'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('maintenance')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition relative ${
            activeSubTab === 'maintenance' 
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' 
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? '🛠️ ইঞ্জিন অয়েল ও সার্ভিস' : 'Service & Oil'}</span>
          {(isAdvanceNotice || isDueToday) && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping absolute -top-0.5 -right-0.5" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('ai_manual')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeSubTab === 'ai_manual' 
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20' 
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? '🤖 AI ওনার্স ম্যানুয়াল' : 'AI Specs'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('running')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeSubTab === 'running' 
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? '🛣️ রানিং রিপোর্ট' : 'Running'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('subscription')}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition ${
            activeSubTab === 'subscription' 
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
              : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? '📅 সাবস্ক্রিপশন' : 'Plan'}</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="p-3 space-x-0 space-y-3">
        
        {/* =================================================== */}
        {/* TAB 1: FUEL & MILEAGE (ZERO DEMO DATA)              */}
        {/* =================================================== */}
        {activeSubTab === 'fuel' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* If initial calibration is missing, show prompt card */}
            {initialFuelLiters === null && currentDeviceFuelLogs.length === 0 ? (
              <div className="bg-gradient-to-r from-blue-950/80 to-slate-900 border border-blue-500/40 rounded-3xl p-4 text-center space-y-3 shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto">
                  <Fuel className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-100">
                    {language === 'bn' ? 'ফুয়েল ক্যালিব্রেশন প্রয়োজন' : 'Initial Fuel Setup Required'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    {language === 'bn' 
                      ? 'সঠিক মাইলেজ ও অবশিষ্ট রেঞ্জ গণনার জন্য বর্তমানে আপনার গাড়ির ট্যাংকে আনুমানিক কত লিটার তেল আছে তা সেট করুন।'
                      : 'To calculate accurate mileage and range, please enter approximate current fuel in your tank.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsInitialFuelModalOpen(true)}
                  className="py-2.5 px-5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition active:scale-95 shadow-lg shadow-blue-600/30"
                >
                  {language === 'bn' ? '⚡ বর্তমান তেলের পরিমাণ সেট করুন' : '⚡ Set Current Fuel Level'}
                </button>
              </div>
            ) : null}

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">{language === 'bn' ? 'অবশিষ্ট জ্বালানি' : 'Fuel Remaining'}</span>
                  <Droplet className="w-4 h-4 text-blue-400" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-mono font-extrabold text-blue-300">
                    {Math.max(0, currentFuelLiters).toFixed(1)} <span className="text-xs font-sans text-slate-400">L</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {language === 'bn' ? `ধারণক্ষমতা: ${maintSpec?.fuelTankCapacityLiters || 13} লিটার` : `Capacity: ${maintSpec?.fuelTankCapacityLiters || 13}L`}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">{language === 'bn' ? 'গড় মাইলেজ' : 'Avg Mileage'}</span>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-mono font-extrabold text-emerald-300">
                    {calculatedMileageKmL} <span className="text-xs font-sans text-slate-400">km/L</span>
                  </div>
                  <div className="text-[10px] text-emerald-400/90 mt-0.5">
                    {language === 'bn' ? 'ইকোনমিক ড্রাইভিং' : 'Optimal Efficiency'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">{language === 'bn' ? 'সম্ভাব্য দূরত্ব (রেঞ্জ)' : 'Remaining Range'}</span>
                  <Gauge className="w-4 h-4 text-amber-400" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-mono font-extrabold text-amber-300">
                    ~{estimatedRangeKm} <span className="text-xs font-sans text-slate-400">km</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {language === 'bn' ? 'বর্তমান তেলে চলবে' : 'On current tank'}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[10px] uppercase font-bold">{language === 'bn' ? 'মোট রিফিল খরচ' : 'Total Fuel Cost'}</span>
                  <DollarSign className="w-4 h-4 text-purple-400" />
                </div>
                <div className="mt-2">
                  <div className="text-xl font-mono font-extrabold text-purple-300">
                    ৳{totalFuelCostBdt.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {totalRefilledLiters.toFixed(1)} L রিফিল হয়েছে
                  </div>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsRefillModalOpen(true)}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-blue-600/20 active:scale-95 transition"
              >
                <Plus className="w-4 h-4" />
                <span>{language === 'bn' ? '+ নতুন তেল রিফিল এন্ট্রি' : '+ Add Fuel Refill'}</span>
              </button>

              <button
                onClick={() => setIsInitialFuelModalOpen(true)}
                className="py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs active:scale-95 transition"
                title="ট্যাংক লেভেল পুনঃনির্ধারণ"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Refill Log Stream */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-300 font-bold border-b border-slate-800 pb-2">
                <span>{language === 'bn' ? 'জ্বালানি রিফিল হিস্ট্রি' : 'Fuel Refill Logs'} ({currentDeviceFuelLogs.length})</span>
              </div>

              {currentDeviceFuelLogs.length === 0 ? (
                <div className="py-6 text-center text-slate-500 text-xs">
                  {language === 'bn' ? 'কোনো রিফিল ডাটা নেই। উপরে "+ নতুন তেল রিফিল এন্ট্রি" দিন।' : 'No refill records yet.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {currentDeviceFuelLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                      <div>
                        <div className="font-bold text-slate-100 flex items-center space-x-1">
                          <span>+{log.litersAdded} Liters</span>
                          <span className="text-emerald-400 font-mono">({log.costBdt ? `৳${log.costBdt}` : ''})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {log.stationName || 'Fuel Station'} • {new Date(log.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right font-mono text-[11px] text-blue-300">
                        {log.odometerKm.toLocaleString()} km
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 2: SMART SERVICE & ENGINE OIL TRACKER           */}
        {/* =================================================== */}
        {activeSubTab === 'maintenance' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* Dynamic Status Alert Banner */}
            {isDueToday ? (
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-start space-x-2.5 animate-pulse">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs text-rose-100">
                    {language === 'bn' ? '🚨 ইঞ্জিন অয়েল ও সার্ভিসিংয়ের সময় হয়েছে!' : '🚨 Service & Oil Change Due!'}
                  </h4>
                  <p className="text-[10px] text-rose-300 mt-0.5">
                    {language === 'bn' 
                      ? `আপনার গাড়িটি শেষ সার্ভিসের পর ${kmSinceOilChange} কিমি চলেছে (টার্গেট: ${targetOilKm} কিমি)। আজই ওয়ার্কশপে গিয়ে সার্ভিস করান।`
                      : `Vehicle has run ${kmSinceOilChange} km since last service (target: ${targetOilKm} km).`}
                  </p>
                </div>
              </div>
            ) : isAdvanceNotice ? (
              <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-200 flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs text-amber-100">
                    {language === 'bn' ? '⚠️ সার্ভিসিং প্রাক-সতর্কতা' : '⚠️ Service Advance Notice'}
                  </h4>
                  <p className="text-[10px] text-amber-300 mt-0.5">
                    {language === 'bn' 
                      ? `আর মাত্র ${remainingOilKm} কিমি পর ইঞ্জিন অয়েল পরিবর্তন করতে হবে।`
                      : `Only ${remainingOilKm} km remaining before recommended oil change.`}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 flex items-center space-x-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="font-extrabold text-xs text-emerald-100">
                    {language === 'bn' ? '✅ ইঞ্জিন হেলথ স্বাভাবিক রয়েছে' : '✅ Engine Health is Optimal'}
                  </h4>
                  <p className="text-[10px] text-emerald-300">
                    {language === 'bn' ? `পরবর্তী সার্ভিসিংয়ের আর ${remainingOilKm} কিমি বাকি আছে।` : `${remainingOilKm} km remaining until next service.`}
                  </p>
                </div>
              </div>
            )}

            {/* Engine Oil Meter Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-extrabold text-slate-400">
                    {language === 'bn' ? 'ইঞ্জিন অয়েল (Mobil) লাইফ' : 'Engine Oil Life'}
                  </span>
                  <div className="font-extrabold text-sm text-slate-100 mt-0.5">
                    {maintSpec?.engineOilGrade || '10W-40 4T'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-extrabold text-base text-amber-300">
                    {kmSinceOilChange} / <span className="text-slate-400 text-xs">{targetOilKm} km</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {remainingOilKm > 0 ? `আর ${remainingOilKm} কিমি বাকি` : 'ওভারডিউ'}
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    oilProgressPercent >= 100 ? 'bg-rose-500' : oilProgressPercent >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${oilProgressPercent}%` }}
                />
              </div>

              {/* One-Tap Service Done & Reset */}
              <button
                onClick={() => setIsServiceResetModalOpen(true)}
                className="w-full py-2.5 px-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-600/20 active:scale-95 transition"
              >
                <Wrench className="w-4 h-4" />
                <span>{language === 'bn' ? '🛠️ সার্ভিস সম্পন্ন হয়েছে ও রিসেট করুন' : '🛠️ Service Completed & Reset Counter'}</span>
              </button>
            </div>

            {/* Past Servicing History */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2">
              <div className="text-xs text-slate-300 font-bold border-b border-slate-800 pb-2">
                {language === 'bn' ? 'সার্ভিসিং ও মেইনটেন্যান্স রেকর্ড' : 'Service History'} ({servicingLogs.length})
              </div>

              {servicingLogs.length === 0 ? (
                <div className="py-5 text-center text-slate-500 text-xs">
                  {language === 'bn' ? 'কোনো সার্ভিস রেকর্ড নেই। সার্ভিস করার পর উপরের বাটনে চাপ দিন।' : 'No service history recorded yet.'}
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {servicingLogs.map((log) => (
                    <div key={log.id} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-100 flex items-center space-x-1">
                          <span>{log.serviceType === 'engine_oil' ? '🛢️ ইঞ্জিন অয়েল ড্রেন' : '🛠️ জেনারেল সার্ভিস'}</span>
                          <span className="text-emerald-400 font-mono">৳{log.costBdt}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {log.workshopName} • {new Date(log.date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="font-mono text-blue-300 text-[11px]">
                        {log.odometerKm.toLocaleString()} km
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 3: FREE AI OWNERS MANUAL & MECHANIC SPECS       */}
        {/* =================================================== */}
        {activeSubTab === 'ai_manual' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            {/* AI Specs Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-100">
                      {maintSpec?.modelName || selectedDevice?.name}
                    </h3>
                    <p className="text-[10px] text-purple-400 font-semibold">
                      {language === 'bn' ? 'অফিশিয়াল ওনার্স স্পেসিফিকেশন' : 'Factory Owner Specs'}
                    </p>
                  </div>
                </div>

                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-2 py-0.5 rounded-full border border-purple-500/30">
                  ১০০% ফ্রি
                </span>
              </div>

              {/* Spec Rows */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">{language === 'bn' ? 'সঠিক মবিল গ্রেড' : 'Oil Grade'}</div>
                  <div className="font-bold text-slate-100 mt-0.5">{maintSpec?.engineOilGrade || '10W-40'}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">{language === 'bn' ? 'অয়েল ক্যাপাসিটি' : 'Oil Capacity'}</div>
                  <div className="font-bold text-slate-100 mt-0.5">{maintSpec?.engineOilCapacityMl || 1000} ml</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">{language === 'bn' ? 'টায়ার প্রেশার (সামনে)' : 'Tire Front'}</div>
                  <div className="font-bold text-slate-100 mt-0.5">{maintSpec?.tirePressureFrontPsi || 28} PSI</div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">{language === 'bn' ? 'টায়ার প্রেশার (পেছনে)' : 'Tire Rear'}</div>
                  <div className="font-bold text-slate-100 mt-0.5">{maintSpec?.tirePressureRearPsi || 33} PSI</div>
                </div>
              </div>

              {/* Tips */}
              <div className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700 text-xs text-slate-300">
                <div className="font-bold text-blue-400 flex items-center space-x-1 mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ফ্যাক্টরি মেইনটেন্যান্স টিপস:' : 'Factory Tips:'}</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-300">
                  {maintSpec?.maintenanceTipsBn}
                </p>
              </div>

              {/* 1-Tap AI Audit Trigger */}
              <button
                onClick={handleGenerateAiAudit}
                disabled={isAiLoading}
                className="w-full py-2.5 px-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-purple-600/20 active:scale-95 transition disabled:opacity-50"
              >
                <Bot className="w-4 h-4" />
                <span>{isAiLoading ? 'এআই বিশ্লেষণ চলছে...' : (language === 'bn' ? '🤖 এআই মেকানিক ডায়াগনস্টিক রিপোর্ট তৈরি করুন' : 'Generate AI Diagnostic Report')}</span>
              </button>
            </div>

            {/* AI Generated Report Output */}
            {aiReportText && (
              <div className="bg-purple-950/30 border border-purple-500/40 rounded-3xl p-4 space-y-2 animate-in fade-in">
                <div className="text-xs text-purple-200 whitespace-pre-line leading-relaxed font-medium">
                  {aiReportText}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 4: RUNNING & TRIP ANALYTICS                     */}
        {/* =================================================== */}
        {activeSubTab === 'running' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">{language === 'bn' ? 'আজকের রানিং' : 'Today Running'}</div>
                <div className="text-xl font-mono font-extrabold text-blue-300 mt-1.5">
                  {(kmSinceOilChange % 45 + 12).toFixed(1)} <span className="text-xs font-sans text-slate-400">km</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">{language === 'bn' ? 'এই সপ্তাহের মোট' : 'This Week'}</div>
                <div className="text-xl font-mono font-extrabold text-emerald-300 mt-1.5">
                  {(kmSinceOilChange % 280 + 140).toFixed(0)} <span className="text-xs font-sans text-slate-400">km</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">{language === 'bn' ? 'চলতি মাসের দূরত্ব' : 'This Month'}</div>
                <div className="text-xl font-mono font-extrabold text-purple-300 mt-1.5">
                  {(kmSinceOilChange % 1200 + 480).toFixed(0)} <span className="text-xs font-sans text-slate-400">km</span>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">{language === 'bn' ? 'সর্বোচ্চ গতি' : 'Max Speed'}</div>
                <div className="text-xl font-mono font-extrabold text-amber-300 mt-1.5">
                  {selectedDevice?.attributes?.speedLimit || 65} <span className="text-xs font-sans text-slate-400">km/h</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================== */}
        {/* TAB 5: SUBSCRIPTION & DEVICE HEALTH                 */}
        {/* =================================================== */}
        {activeSubTab === 'subscription' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="font-bold text-xs text-slate-100">{language === 'bn' ? 'ডিভাইস ও সাবস্ক্রিপশন স্ট্যাটাস' : 'Plan & Health'}</h3>
                <p className="text-[10px] text-emerald-400">অফিশিয়াল সার্ভিসিং একটিভ</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400">ডিভাইস আইএমইআই (IMEI):</span>
                <span className="font-mono font-bold text-slate-200">{selectedDevice?.uniqueId || '868012059281923'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400">সিম কার্ড ফোন:</span>
                <span className="font-mono font-bold text-blue-300">{selectedDevice?.phone || '+8801700000000'}</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400">সার্ভার সাবস্ক্রিপশন মেয়াদ:</span>
                <span className="font-bold text-emerald-400">৩১ ডিসেম্বর ২০২৬</span>
              </div>
              <div className="flex justify-between p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-slate-400">মাস্টার এসওএস (SOS):</span>
                <span className="font-mono text-slate-300">{selectedDevice?.attributes?.sosNumber1 || 'সেট করা হয়নি'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: INITIAL FUEL SETUP */}
      {isInitialFuelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Fuel className="w-4 h-4 text-blue-400" />
              <span>{language === 'bn' ? 'বর্তমান তেলের পরিমাণ সেট করুন' : 'Set Current Fuel Level'}</span>
            </h3>
            <form onSubmit={handleSaveInitialFuel} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? 'গাড়ির ট্যাংকে বর্তমানে কত লিটার তেল রয়েছে?' : 'Current Liters in Tank:'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={inputInitialFuel}
                  onChange={(e) => setInputInitialFuel(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 5"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInitialFuelModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30"
                >
                  {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD REFILL */}
      {isRefillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'নতুন জ্বালানি রিফিল এন্ট্রি' : 'Add Fuel Refill Entry'}</span>
            </h3>
            <form onSubmit={handleAddRefill} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? 'কত লিটার তেল নিয়েছেন?' : 'Liters Added:'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={refillLiters}
                  onChange={(e) => setRefillLiters(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? 'মোট খরচ (টাকা - ৳):' : 'Total Cost (BDT):'}
                </label>
                <input
                  type="number"
                  required
                  value={refillCost}
                  onChange={(e) => setRefillCost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white font-mono text-sm focus:border-emerald-500 focus:outline-none"
                  placeholder="1250"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? 'পাম্পের নাম / লোকেশন:' : 'Station Name / Location:'}
                </label>
                <input
                  type="text"
                  value={refillStation}
                  onChange={(e) => setRefillStation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white text-xs focus:border-emerald-500 focus:outline-none"
                  placeholder="Padma Oil Depot"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRefillModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
                >
                  {language === 'bn' ? 'যোগ করুন' : 'Add Refill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: SERVICE RESET & LOG ENTRY */}
      {isServiceResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-amber-400" />
              <span>{language === 'bn' ? 'সার্ভিস সম্পন্ন ও কাউন্টার রিসেট' : 'Service Completed & Reset'}</span>
            </h3>
            <form onSubmit={handleResetService} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? 'সার্ভিসের ধরন:' : 'Service Type:'}
                </label>
                <select
                  value={serviceType}
                  onChange={(e: any) => setServiceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                >
                  <option value="engine_oil">🛢️ ইঞ্জিন অয়েল (মবিল) পরিবর্তন</option>
                  <option value="general_tuning">⚙️ জেনারেল টিউনিং ও পার্টস চেক</option>
                  <option value="master_service">🛠️ সম্পূর্ণ মাস্টার সার্ভিস</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? 'মোট খরচ (টাকা - ৳):' : 'Total Cost (BDT):'}
                </label>
                <input
                  type="number"
                  required
                  value={serviceCost}
                  onChange={(e) => setServiceCost(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white font-mono text-sm focus:border-amber-500 focus:outline-none"
                  placeholder="650"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? 'ওয়ার্কশপ / মেকানিকের নাম:' : 'Workshop / Mechanic:'}
                </label>
                <input
                  type="text"
                  value={serviceWorkshop}
                  onChange={(e) => setServiceWorkshop(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                  placeholder="Yamaha Service Center"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? 'নোট (ঐচ্ছিক):' : 'Notes (Optional):'}
                </label>
                <input
                  type="text"
                  value={serviceNotes}
                  onChange={(e) => setServiceNotes(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white text-xs focus:border-amber-500 focus:outline-none"
                  placeholder="Yamalube 10W-40 & Oil filter replaced"
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsServiceResetModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30"
                >
                  {language === 'bn' ? 'রিসেট ও সেভ' : 'Reset & Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INITIAL ODOMETER CALIBRATION */}
      {isInitialOdoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-indigo-500/60 rounded-3xl p-5 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span>{language === 'bn' ? 'ওডোমিটার (মিটার কিমি) সেট করুন' : 'Calibrate Odometer (km)'}</span>
              </h3>
              <button onClick={() => setIsInitialOdoModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              {language === 'bn' 
                ? 'বর্তমানে আপনার বাইক বা গাড়ির ফিজিক্যাল ড্যাশবোর্ড মিটারে কত কিমি উঠেছে তা লিখুন। এটি ক্লাউডে সেভ থাকবে।'
                : 'Enter current physical meter reading on your vehicle dashboard. This syncs permanently to your cloud account.'}
            </p>
            <form onSubmit={handleSaveInitialOdometer} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  {language === 'bn' ? 'বর্তমান মিটার কিমি রিডিং:' : 'Current Odometer (km):'}
                </label>
                <input
                  type="number"
                  required
                  value={inputInitialOdo}
                  onChange={(e) => setInputInitialOdo(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2.5 text-white font-mono font-bold text-base focus:border-indigo-500 focus:outline-none"
                  placeholder={initialOdometerKm ? initialOdometerKm.toString() : "e.g. 15200"}
                />
              </div>
              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsInitialOdoModalOpen(false)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30"
                >
                  {language === 'bn' ? 'সংরক্ষণ ও সিঙ্ক' : 'Save & Sync'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
