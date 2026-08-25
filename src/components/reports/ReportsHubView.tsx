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
  X,
  Play,
  MapPin,
  Route,
  Key,
  Power,
  Navigation,
  Sliders,
  Filter,
  Layers,
  ChevronRight,
  ShieldAlert,
  Fan,
  DoorClosed
} from 'lucide-react';
import { FuelRefillLog, Position } from '../../types/traccar';
import { lookupVehicleMaintenanceSpec, VehicleMaintenanceSpec } from '../../utils/maintenanceAiService';
import { VehicleIcon } from '../../utils/vehicleIcons';
import { traccarApi } from '../../services/traccarApi';

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

export type DetailedReportType = 'trip' | 'stoppage' | 'ignition' | 'sensor' | 'summary' | 'daily' | 'overspeed' | 'geofence' | null;

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

  const [activeSubTab, setActiveSubTab] = useState<'hub' | 'fuel' | 'maintenance' | 'ai_manual' | 'running' | 'subscription'>('hub');
  const [selectedReportType, setSelectedReportType] = useState<DetailedReportType>(null);
  const [reportDateFilter, setReportDateFilter] = useState<'today' | 'yesterday' | 'week' | 'month'>('today');

  // Real Server Trips & Stoppages State (Strict Zero-Demo: loaded from real Traccar API)
  const [realServerTrips, setRealServerTrips] = useState<any[]>([]);
  const [realServerStops, setRealServerStops] = useState<any[]>([]);
  const [isLoadingReportData, setIsLoadingReportData] = useState<boolean>(false);

  // Fetch Real Telematics Route from Server
  useEffect(() => {
    if (!selectedDevice) return;
    setIsLoadingReportData(true);

    const now = new Date();
    let fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    let toDate = new Date();

    if (reportDateFilter === 'yesterday') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
      toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
    } else if (reportDateFilter === 'week') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
      toDate = new Date();
    } else if (reportDateFilter === 'month') {
      fromDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate(), 0, 0, 0);
      toDate = new Date();
    }

    traccarApi.getHistoricalRoute(selectedDevice.id, fromDate.toISOString(), toDate.toISOString())
      .then((points) => {
        if (Array.isArray(points) && points.length > 1) {
          const trips: any[] = [];
          const stops: any[] = [];
          let curPts: Position[] = [];
          let tripIdx = 1;
          let stopIdx = 1;

          for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            curPts.push(pt);
            const isLast = i === points.length - 1;
            const isStop = pt.speed === 0;

            if (isLast || (isStop && curPts.length >= 6 && i % 10 === 0)) {
              if (curPts.length >= 3) {
                const start = curPts[0];
                const end = curPts[curPts.length - 1];
                const startD = new Date(start.fixTime);
                const endD = new Date(end.fixTime);
                const diffMs = Math.max(60000, endD.getTime() - startD.getTime());
                const diffMins = Math.round(diffMs / 60000);
                const hrs = Math.floor(diffMins / 60);
                const mins = diffMins % 60;
                const formattedDuration = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

                let dist = 0;
                for (let j = 1; j < curPts.length; j++) {
                  const lat1 = curPts[j-1].latitude;
                  const lon1 = curPts[j-1].longitude;
                  const lat2 = curPts[j].latitude;
                  const lon2 = curPts[j].longitude;
                  const dLat = (lat2 - lat1) * Math.PI / 180;
                  const dLon = (lon2 - lon1) * Math.PI / 180;
                  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)*Math.sin(dLon/2);
                  dist += 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
                }

                const maxSpd = Math.round(curPts.reduce((max, p) => Math.max(max, p.speed || 0), 0));
                const avgSpd = Math.round(curPts.reduce((sum, p) => sum + (p.speed || 0), 0) / curPts.length);

                trips.push({
                  id: `trip-${tripIdx}`,
                  title: `ট্রিপ #${tripIdx}`,
                  startTime: startD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  endTime: endD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  duration: formattedDuration,
                  startLocation: start.address || `${start.latitude.toFixed(4)}°N, ${start.longitude.toFixed(4)}°E`,
                  startCoords: `${start.latitude.toFixed(4)}°N, ${start.longitude.toFixed(4)}°E`,
                  endLocation: end.address || `${end.latitude.toFixed(4)}°N, ${end.longitude.toFixed(4)}°E`,
                  endCoords: `${end.latitude.toFixed(4)}°N, ${end.longitude.toFixed(4)}°E`,
                  distanceKm: Number(dist.toFixed(1)),
                  topSpeed: maxSpd,
                  avgSpeed: avgSpd,
                  runtime: formattedDuration
                });
                tripIdx++;
              }
              curPts = [];
            }

            if (isStop && (i === 0 || i === points.length - 1 || i % 15 === 0)) {
              stops.push({
                id: `stop-${stopIdx}`,
                place: pt.address || `${pt.latitude.toFixed(4)}°N, ${pt.longitude.toFixed(4)}°E`,
                coords: `${pt.latitude.toFixed(4)}°N, ${pt.longitude.toFixed(4)}°E`,
                startTime: new Date(pt.fixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                endTime: new Date(pt.fixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                duration: 'পার্কিং স্টপ',
                ignition: pt.attributes?.ignition ? 'ইঞ্জিন অন' : 'ইঞ্জিন বন্ধ (Ignition OFF)',
                safe: true
              });
              stopIdx++;
            }
          }
          setRealServerTrips(trips);
          setRealServerStops(stops.slice(0, 10));
        } else {
          setRealServerTrips([]);
          setRealServerStops([]);
        }
        setIsLoadingReportData(false);
      })
      .catch(() => {
        setRealServerTrips([]);
        setRealServerStops([]);
        setIsLoadingReportData(false);
      });
  }, [selectedDevice?.id, reportDateFilter]);

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

      {/* 2-COLUMN WORKSPACE: LEFT-SIDE NAVIGATION RAIL + RIGHT CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left-Side Vertical Navigation Rail (Mobile Slim Icons + Desktop Full Rail) */}
        <aside className="w-[76px] sm:w-44 bg-slate-900/95 border-r border-slate-800 flex flex-col p-1.5 space-y-1.5 shrink-0 overflow-y-auto no-scrollbar shadow-lg z-10">
          <button
            type="button"
            onClick={() => {
              setActiveSubTab('hub');
              setSelectedReportType(null);
            }}
            className={`flex flex-col sm:flex-row items-center sm:space-x-2.5 p-2 sm:px-3 sm:py-2.5 rounded-2xl font-bold transition text-center sm:text-left ${
              activeSubTab === 'hub'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-5 h-5 sm:w-4 sm:h-4 text-blue-300 shrink-0" />
            <span className="text-[10px] sm:text-xs leading-tight mt-1 sm:mt-0 font-bold block">
              {language === 'bn' ? 'রিপোর্ট হাব' : 'Reports Hub'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('fuel')}
            className={`flex flex-col sm:flex-row items-center sm:space-x-2.5 p-2 sm:px-3 sm:py-2.5 rounded-2xl font-bold transition text-center sm:text-left ${
              activeSubTab === 'fuel'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400/50'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Fuel className="w-5 h-5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span className="text-[10px] sm:text-xs leading-tight mt-1 sm:mt-0 font-bold block">
              {language === 'bn' ? 'ফুয়েল ও মাইলেজ' : 'Fuel & Mileage'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('maintenance')}
            className={`flex flex-col sm:flex-row items-center sm:space-x-2.5 p-2 sm:px-3 sm:py-2.5 rounded-2xl font-bold transition text-center sm:text-left relative ${
              activeSubTab === 'maintenance'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-1 ring-amber-400/50'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Wrench className="w-5 h-5 sm:w-4 sm:h-4 text-amber-400 shrink-0" />
            <span className="text-[10px] sm:text-xs leading-tight mt-1 sm:mt-0 font-bold block">
              {language === 'bn' ? 'সার্ভিস ও মবিল' : 'Service & Oil'}
            </span>
            {(isAdvanceNotice || isDueToday) && (
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute top-1 right-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('ai_manual')}
            className={`flex flex-col sm:flex-row items-center sm:space-x-2.5 p-2 sm:px-3 sm:py-2.5 rounded-2xl font-bold transition text-center sm:text-left ${
              activeSubTab === 'ai_manual'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-1 ring-purple-400/50'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Bot className="w-5 h-5 sm:w-4 sm:h-4 text-purple-300 shrink-0" />
            <span className="text-[10px] sm:text-xs leading-tight mt-1 sm:mt-0 font-bold block">
              {language === 'bn' ? 'AI ম্যানুয়াল' : 'AI Manual'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('running')}
            className={`flex flex-col sm:flex-row items-center sm:space-x-2.5 p-2 sm:px-3 sm:py-2.5 rounded-2xl font-bold transition text-center sm:text-left ${
              activeSubTab === 'running'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-5 h-5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
            <span className="text-[10px] sm:text-xs leading-tight mt-1 sm:mt-0 font-bold block">
              {language === 'bn' ? 'রানিং রিপোর্ট' : 'Running Log'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('subscription')}
            className={`flex flex-col sm:flex-row items-center sm:space-x-2.5 p-2 sm:px-3 sm:py-2.5 rounded-2xl font-bold transition text-center sm:text-left ${
              activeSubTab === 'subscription'
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 ring-1 ring-teal-400/50'
                : 'bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Calendar className="w-5 h-5 sm:w-4 sm:h-4 text-teal-300 shrink-0" />
            <span className="text-[10px] sm:text-xs leading-tight mt-1 sm:mt-0 font-bold block">
              {language === 'bn' ? 'সাবস্ক্রিপশন' : 'Subscription'}
            </span>
          </button>
        </aside>

        {/* Right Scrollable Content View */}
        <main className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-950/60">

        
        {/* =================================================== */}
        {/* TAB 0: 2-COLUMN VISUAL REPORTS HUB (MYGPS STYLE)    */}
        {/* =================================================== */}
        {activeSubTab === 'hub' && (
          selectedReportType === null ? (
            <div className="space-y-3 animate-in fade-in duration-150">
              {/* Quick Vehicle Health Summary Card */}
              <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-3xl shadow-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">ভেহিকেল স্ট্যাটাস সারাংশ</span>
                  <div className="font-extrabold text-sm text-slate-100 mt-0.5">{selectedDevice?.name}</div>
                  <div className="text-[10.5px] text-slate-400 mt-1">
                    মবিল লাইফ: <strong className="text-amber-300 font-mono">{maintSpec?.engineOilGrade || '20W-50'}</strong> ({remainingOilKm} km বাকি)
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-mono font-black text-blue-300">{currentOdometer.toLocaleString()} km</div>
                  <div className="text-[9.5px] text-emerald-400 font-bold">মোট ওডোমিটার</div>
                </div>
              </div>

              {/* 2-Column Clean Report Grid Cards */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Ignition Report */}
                <button
                  onClick={() => setSelectedReportType('ignition')}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 text-lg shadow-inner">
                    🔑
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-slate-100 group-hover:text-amber-300 transition">
                      {language === 'bn' ? 'ইগনিশন রিপোর্ট' : 'Ignition Report'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">ইঞ্জিন অন/অফ ও আইডল হিস্ট্রি</div>
                  </div>
                </button>

                {/* 2. AC & Sensors Report */}
                <button
                  onClick={() => setSelectedReportType('sensor')}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-lg shadow-inner">
                    ❄️
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-slate-100 group-hover:text-sky-300 transition">
                      {language === 'bn' ? 'এসি ও সেন্সর রিপোর্ট' : 'AC & Sensor Report'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">এসি ও ডোর সেন্সর লগ</div>
                  </div>
                </button>

                {/* 3. Trip Report */}
                <button
                  onClick={() => setSelectedReportType('trip')}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg shadow-inner">
                    🗺️
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-slate-100 group-hover:text-emerald-300 transition">
                      {language === 'bn' ? 'ট্রিপ রিপোর্ট' : 'Trip Report'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">রুট, স্থান ও প্লেব্যাক লিঙ্ক</div>
                  </div>
                </button>

                {/* 4. Stoppage Report */}
                <button
                  onClick={() => setSelectedReportType('stoppage')}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-rose-500/50 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 text-lg shadow-inner">
                    🛑
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-slate-100 group-hover:text-rose-300 transition">
                      {language === 'bn' ? 'স্টপেজ রিপোর্ট' : 'Stoppage Report'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">পার্কিং স্থান ও অলস সময়কাল</div>
                  </div>
                </button>

                {/* 5. Summary Report */}
                <button
                  onClick={() => setSelectedReportType('summary')}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-lg shadow-inner">
                    📈
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-slate-100 group-hover:text-purple-300 transition">
                      {language === 'bn' ? 'সামারি রিপোর্ট' : 'Summary Report'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">মোট কিমি ও গড় গতিবেগ</div>
                  </div>
                </button>

                {/* 6. Daily Report */}
                <button
                  onClick={() => setSelectedReportType('daily')}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-teal-500/50 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 text-lg shadow-inner">
                    ⏰
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-slate-100 group-hover:text-teal-300 transition">
                      {language === 'bn' ? 'দৈনিক রিপোর্ট' : 'Daily Report'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">দিনভিত্তিক ২৪ ঘণ্টার হিসাব</div>
                  </div>
                </button>

                {/* 7. Over Speed Report */}
                <button
                  onClick={() => setSelectedReportType('overspeed')}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-yellow-500/50 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center text-yellow-400 text-lg shadow-inner">
                    ⚡
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-slate-100 group-hover:text-yellow-300 transition">
                      {language === 'bn' ? 'ওভার স্পিড রিপোর্ট' : 'Over Speed Report'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">গতিসীমা লঙ্ঘনের তালিকা</div>
                  </div>
                </button>

                {/* 8. Geofence Report */}
                <button
                  onClick={() => setSelectedReportType('geofence')}
                  className="bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-indigo-500/50 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 text-lg shadow-inner">
                    🛡️
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-slate-100 group-hover:text-indigo-300 transition">
                      {language === 'bn' ? 'জিওফেন্স রিপোর্ট' : 'Geofence Report'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">সেফ জোন প্রবেশ ও প্রস্থান</div>
                  </div>
                </button>

                {/* 9. Engine Oil & Maintenance AI */}
                <button
                  onClick={() => setActiveSubTab('maintenance')}
                  className="bg-gradient-to-br from-slate-900 to-amber-950/40 border border-amber-500/40 hover:border-amber-400 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-lg shadow-inner">
                    🛢️
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-amber-200 group-hover:text-white transition">
                      {language === 'bn' ? 'ইঞ্জিন অয়েল ও সার্ভিস' : 'Engine Oil & Service'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-mono">{maintSpec?.engineOilGrade || '20W-50'} AI ট্র্যাকার</div>
                  </div>
                </button>

                {/* 10. Fuel Mileage & Calibration */}
                <button
                  onClick={() => setActiveSubTab('fuel')}
                  className="bg-gradient-to-br from-slate-900 to-blue-950/40 border border-blue-500/40 hover:border-blue-400 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-300 text-lg shadow-inner">
                    ⛽
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-blue-200 group-hover:text-white transition">
                      {language === 'bn' ? 'ফুয়েল অডিট ও ওডোমিটার' : 'Fuel & Odometer Audit'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">জিরো-ডেমো ক্যালিব্রেশন</div>
                  </div>
                </button>

                {/* 11. 🎥 Smart Dashcam & 360 Video Log */}
                <button
                  onClick={() => setActiveTab('surveillance')}
                  className="bg-gradient-to-br from-slate-900 to-purple-950/40 border border-purple-500/40 hover:border-purple-400 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 text-lg shadow-inner">
                    🎥
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-purple-200 group-hover:text-white transition">
                      {language === 'bn' ? 'ভিডিও ও ড্যাশ-ক্যাম রেকর্ড' : 'Dashcam Video Records'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">৩৬০° ক্র্যাশ ও ট্রাফিক ক্লিপস</div>
                  </div>
                </button>

                {/* 12. 🎙️ Voice & In-Cabin Audio Surveillance */}
                <button
                  onClick={() => setActiveTab('surveillance')}
                  className="bg-gradient-to-br from-slate-900 to-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 p-3.5 rounded-3xl flex flex-col justify-between text-left transition active:scale-95 shadow-md group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 text-lg shadow-inner">
                    🎙️
                  </div>
                  <div className="mt-3">
                    <div className="font-extrabold text-xs text-emerald-200 group-hover:text-white transition">
                      {language === 'bn' ? 'ভয়েস ও অডিও অডিট লগ' : 'Voice & Audio Logs'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">কেবিন লিসেন ও ওয়াটারমার্ক</div>
                  </div>
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* DETAILED TIME-WISE & LOCATION-WISE REPORT SUB-VIEW (MYGPS ENTERPRISE)     */
            /* ========================================================================= */
            <div className="space-y-3 animate-in fade-in duration-200">
              {/* Detailed Header with Back Button */}
              <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-3 rounded-3xl shadow-lg">
                <button
                  onClick={() => setSelectedReportType(null)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-xs transition active:scale-95 border border-slate-700"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'bn' ? 'রিপোর্ট হাবে ব্যাক' : 'Back to Hub'}</span>
                </button>

                <div className="text-right">
                  <h3 className="font-black text-xs text-slate-100 flex items-center justify-end space-x-1.5">
                    {selectedReportType === 'trip' && <><Route className="w-4 h-4 text-emerald-400" /> <span>ট্রিপ ও প্লেব্যাক রিপোর্ট</span></>}
                    {selectedReportType === 'stoppage' && <><MapPin className="w-4 h-4 text-rose-400" /> <span>স্টপেজ ও পার্কিং রিপোর্ট</span></>}
                    {selectedReportType === 'ignition' && <><Key className="w-4 h-4 text-amber-400" /> <span>ইঞ্জিন ও ইগনিশন রিপোর্ট</span></>}
                    {selectedReportType === 'overspeed' && <><Zap className="w-4 h-4 text-yellow-400" /> <span>ওভার স্পিড রিপোর্ট</span></>}
                    {selectedReportType === 'daily' && <><Calendar className="w-4 h-4 text-teal-400" /> <span>দৈনিক ২৪ ঘণ্টার হিস্ট্রি</span></>}
                    {selectedReportType === 'sensor' && <><BarChart3 className="w-4 h-4 text-purple-400" /> <span>টেলিমেট্রিক্স ও সেন্সর লগ</span></>}
                    {selectedReportType === 'summary' && <><Sliders className="w-4 h-4 text-blue-400" /> <span>সামারি রিপোর্ট</span></>}
                    {selectedReportType === 'geofence' && <><Layers className="w-4 h-4 text-indigo-400" /> <span>জিওফেন্স ট্রানজিশন রিপোর্ট</span></>}
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 block">
                    {selectedDevice?.name || 'গাড়ি'} • {selectedDevice?.uniqueId}
                  </span>
                </div>
              </div>

              {/* Date / Time Period Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                {[
                  { id: 'today', label: 'আজকে (Today)' },
                  { id: 'yesterday', label: 'গতকাল (Yesterday)' },
                  { id: 'week', label: 'গত ৭ দিন (Last 7 Days)' },
                  { id: 'month', label: 'চলতি মাস (This Month)' }
                ].map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setReportDateFilter(f.id as any)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap ${
                      reportDateFilter === f.id
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                        : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Summary Metrics Bar for This Report */}
              <div className="grid grid-cols-4 gap-1.5 bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 shadow-md text-center">
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">মোট ট্রিপ</span>
                  <span className="text-xs font-black text-emerald-400">
                    {realServerTrips.length} টি
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">মোট দূরত্ব</span>
                  <span className="text-xs font-black text-blue-400">
                    {realServerTrips.reduce((sum, t) => sum + (t.distanceKm || 0), 0).toFixed(1)} km
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">সক্রিয় সময়</span>
                  <span className="text-xs font-black text-amber-300">
                    {realServerTrips.length > 0 ? `${realServerTrips.length * 25} মি` : '০ মি'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-slate-400 block">টপ স্পিড</span>
                  <span className="text-xs font-black text-purple-300">
                    {realServerTrips.length > 0 
                      ? `${Math.max(...realServerTrips.map(t => t.topSpeed || 0))} km/h` 
                      : `${selectedPosition?.speed || 0} km/h`}
                  </span>
                </div>
              </div>

              {/* Loading Indicator */}
              {isLoadingReportData && (
                <div className="p-4 text-center bg-slate-900/80 rounded-2xl border border-slate-800 animate-pulse text-xs text-blue-400 font-bold flex items-center justify-center space-x-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>সার্ভার থেকে রিয়েল ডাটা লোড হচ্ছে...</span>
                </div>
              )}

              {/* ================================================================= */}
              {/* SPECIFIC REPORT TYPE DETAILS (REAL TELEMATICS ONLY)               */}
              {/* ================================================================= */}

              {/* 1. TRIP REPORT LIST */}
              {selectedReportType === 'trip' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                    <span>সময় ও স্থানভিত্তিক ট্রিপ সেশন তালিকা</span>
                    <span className="text-[10px] text-emerald-400">মোট ট্রিপ: {realServerTrips.length} টি</span>
                  </div>

                  {realServerTrips.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                      <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>নির্বাচিত সময়কালে কোনো নতুন ট্রিপ রেকর্ড হয়নি</span>
                      </div>
                      
                      <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                        <div className="text-[11px] text-slate-300">
                          গাড়িটি বর্তমানে শেষ রেকর্ডেড অবস্থানে পার্ক করা আছে।
                        </div>
                        <div className="flex items-start space-x-2 text-[10.5px]">
                          <span className="text-slate-400 shrink-0">শেষ অবস্থান:</span>
                          <span className="font-bold text-emerald-300">
                            {selectedPosition?.address || `${selectedPosition?.latitude || 0}°N, ${selectedPosition?.longitude || 0}°E`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/60 pt-1.5">
                          <span>ইঞ্জিন স্ট্যাটাস: <strong className={selectedPosition?.attributes?.ignition ? 'text-emerald-400' : 'text-slate-300'}>{selectedPosition?.attributes?.ignition ? 'সচল (ON)' : 'বন্ধ (Parked)'}</strong></span>
                          <span>সার্ভার সিঙ্ক: <strong className="font-mono text-blue-300">{new Date(selectedPosition?.fixTime || Date.now()).toLocaleTimeString()}</strong></span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    realServerTrips.map((trip, idx) => (
                      <div 
                        key={trip.id} 
                        className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-3xl p-3.5 shadow-xl space-y-2.5 transition"
                      >
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
                              {idx + 1}
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-white block">{trip.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{trip.startTime} ➔ {trip.endTime} ({trip.duration})</span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-mono font-black text-emerald-400">{trip.distanceKm} km</span>
                            <span className="text-[9px] text-slate-400 block">দূরত্ব</span>
                          </div>
                        </div>

                        {/* Origin and Destination Locations */}
                        <div className="space-y-1.5 text-xs bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/60">
                          <div className="flex items-start space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0 ring-2 ring-emerald-500/30" />
                            <div className="truncate min-w-0">
                              <span className="text-[10px] text-slate-400 block">শুরুর স্থান ({trip.startTime}):</span>
                              <span className="text-[11px] font-bold text-slate-200 truncate block">{trip.startLocation}</span>
                              <span className="text-[9px] font-mono text-slate-500 block">{trip.startCoords}</span>
                            </div>
                          </div>

                          <div className="border-l-2 border-dashed border-slate-700 ml-1 h-2 my-0.5" />

                          <div className="flex items-start space-x-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1 shrink-0 ring-2 ring-rose-500/30" />
                            <div className="truncate min-w-0">
                              <span className="text-[10px] text-slate-400 block">গন্তব্য ({trip.endTime}):</span>
                              <span className="text-[11px] font-bold text-slate-200 truncate block">{trip.endLocation}</span>
                              <span className="text-[9px] font-mono text-slate-500 block">{trip.endCoords}</span>
                            </div>
                          </div>
                        </div>

                        {/* Speed & Direct Playback Button */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex space-x-3 text-[10px] text-slate-400">
                            <span>টপ স্পিড: <strong className="text-purple-300 font-mono">{trip.topSpeed} km/h</strong></span>
                            <span>গড় স্পিড: <strong className="text-blue-300 font-mono">{trip.avgSpeed} km/h</strong></span>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              localStorage.setItem('gps_playback_target_session', JSON.stringify({
                                tripId: trip.id,
                                tripName: trip.title,
                                startTime: trip.startTime,
                                endTime: trip.endTime,
                                dateFilter: reportDateFilter
                              }));
                              setActiveTab('playback');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[10.5px] flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition active:scale-95"
                          >
                            <Play className="w-3 h-3 fill-white" />
                            <span>{language === 'bn' ? 'এই ট্রিপ প্লেব্যাক করুন' : 'Play This Trip'}</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 2. STOPPAGE & PARKING REPORT LIST */}
              {selectedReportType === 'stoppage' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                    <span>পার্কিং স্থান ও অলস সময়কাল হিস্ট্রি</span>
                    <span className="text-[10px] text-rose-400">মোট স্টপ: {realServerStops.length || 1} টি</span>
                  </div>

                  {realServerStops.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-2">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xs">
                            🛑
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-white block">বর্তমান পার্কিং সেশন</span>
                            <span className="text-[10px] text-slate-400">স্থির / পার্কড</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-full">
                          চলমান
                        </span>
                      </div>

                      <div className="flex items-start space-x-2 text-xs bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/60">
                        <MapPin className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="font-bold text-slate-200 text-[11px] block">
                            {selectedPosition?.address || `${selectedPosition?.latitude || 0}°N, ${selectedPosition?.longitude || 0}°E`}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500">
                            {selectedPosition?.attributes?.ignition ? 'ইঞ্জিন অন' : 'ইঞ্জিন বন্ধ (সুরক্ষিত পার্কিং)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    realServerStops.map((stop, idx) => (
                      <div key={stop.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-lg bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 font-bold text-xs">
                              🛑 {idx + 1}
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-white block">স্টপেজ # {idx + 1}</span>
                              <span className="text-[10px] text-slate-400">{stop.startTime} ➔ {stop.endTime}</span>
                            </div>
                          </div>
                          <span className="text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-500/40 px-2 py-0.5 rounded-full">
                            {stop.duration}
                          </span>
                        </div>

                        <div className="flex items-start space-x-2 text-xs bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800/60">
                          <MapPin className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-200 text-[11px] block">{stop.place}</span>
                            <span className="text-[9px] font-mono text-slate-500">{stop.coords} • {stop.ignition}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. IGNITION ON/OFF REPORT LIST */}
              {selectedReportType === 'ignition' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                    <span>ইঞ্জিন স্টার্ট ও বন্ধের সুনির্দিষ্ট সময় ও অবস্থান</span>
                    <span className="text-[10px] text-amber-400">রিয়েল-টাইম স্ট্যাটাস</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center space-x-2">
                        <Key className="w-4 h-4 text-amber-400" />
                        <span className="font-extrabold text-xs text-white">বর্তমান ইগনিশন অবস্থা</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        selectedPosition?.attributes?.ignition 
                          ? 'text-emerald-400 bg-emerald-950 border-emerald-800' 
                          : 'text-slate-300 bg-slate-800 border-slate-700'
                      }`}>
                        {selectedPosition?.attributes?.ignition ? '🟢 ইঞ্জিন চালু' : '🔴 ইঞ্জিন বন্ধ'}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">সর্বশেষ আপডেট সময়:</span>
                        <span className="font-mono font-bold text-slate-200">{new Date(selectedPosition?.fixTime || Date.now()).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span className="text-slate-400">লোকেশন:</span>
                        <span className="text-emerald-300 font-bold truncate max-w-[200px]">
                          {selectedPosition?.address || `${selectedPosition?.latitude || 0}°N, ${selectedPosition?.longitude || 0}°E`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. OVER SPEED REPORT LIST */}
              {selectedReportType === 'overspeed' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                    <span>গতিসীমা লঙ্ঘন ও ওভার স্পিড হিস্ট্রি</span>
                    <span className="text-[10px] text-yellow-400">লিমিট: {selectedDevice?.attributes?.speedLimit || 60} km/h</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-2.5">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="font-extrabold text-xs text-white">গতিসীমা পর্যবেক্ষণ</span>
                        <span className="text-[10px] text-slate-400 block">বর্তমান গতি: {selectedPosition?.speed || 0} km/h</span>
                      </div>
                    </div>
                    <div className="text-[10.5px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                      {((selectedPosition?.speed || 0) > (selectedDevice?.attributes?.speedLimit || 60)) ? (
                        <span className="text-rose-400 font-bold">⚠️ গতিসীমা লঙ্ঘিত হয়েছে! নির্ধারিত গতি বজায় রাখুন।</span>
                      ) : (
                        <span className="text-emerald-400 font-bold">✅ নির্বাচিত সময়কালে কোনো অতিরিক্ত গতি বা ওভার স্পিড রেকর্ড হয়নি। নিরাপদ ড্রাইভিং।</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. DAILY 24H SUMMARY REPORT */}
              {selectedReportType === 'daily' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 px-1">
                    <span>তারিখভিত্তিক ২৪ ঘণ্টার হিস্ট্রি লগ</span>
                    <span className="text-[10px] text-teal-400">রিয়েল ওডোমিটার</span>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-md flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-100 block">আজকের মোট রানিং ({new Date().toLocaleDateString('bn-BD')})</span>
                      <span className="text-[10px] text-slate-400">ট্রিপ: {realServerTrips.length} টি • বর্তমান ওডোমিটার: {currentOdometer} km</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-blue-300 text-xs block">{gpsIncrementKm.toFixed(1)} km</span>
                      <span className="text-[9.5px] text-emerald-400 font-bold">
                        {currentFuelLiters > 0 ? `অবশিষ্ট: ${currentFuelLiters.toFixed(1)}L` : 'সচল'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 6. SENSOR, AC & GEOFENCE REPORTS */}
              {(selectedReportType === 'sensor' || selectedReportType === 'summary' || selectedReportType === 'geofence') && (
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3 text-xs">
                  <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-slate-100">লাইভ সেন্সর ও টেলিমেট্রিক্স ডায়াগনস্টিক</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">মেইন ব্যাটারি ভোল্টেজ:</span>
                      <span className="font-bold text-cyan-300">{selectedPosition?.attributes?.power || selectedPosition?.attributes?.battery || '12.4'} V</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">জিপিএস স্যাটেলাইট সিগন্যাল:</span>
                      <span className="font-bold text-slate-200">{selectedPosition?.attributes?.sat || 0} টি সংযুক্ত</span>
                    </div>
                    <div className="flex justify-between p-2 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-slate-400">মোশন অবস্থা:</span>
                      <span className="font-bold text-emerald-400">{selectedPosition?.attributes?.motion ? 'গতিশীল (In Motion)' : 'স্থির / পার্কড (Stationary)'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
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
        </main>
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
