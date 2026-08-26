import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Bus, 
  Truck, 
  FileText, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Webhook, 
  ArrowLeft,
  UserCheck,
  Zap,
  Radio,
  Clock,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Navigation,
  Eye,
  Phone,
  Power,
  Upload,
  ShieldAlert,
  Volume2,
  Video,
  Send,
  MessageSquare,
  AlertTriangle,
  X,
  Check,
  KeyRound,
  LogOut,
  BarChart3,
  Plus,
  SlidersHorizontal,
  Camera,
  UserMinus,
  UserPlus,
  Fuel,
  DollarSign,
  Calendar,
  Route,
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransitCounterManager } from '../saas/TransitCounterManager';
import { ComplianceDocumentVault } from '../saas/ComplianceDocumentVault';
import { DriverPerformanceManager } from '../saas/DriverPerformanceManager';
import { VehicleIcon } from '../../utils/vehicleIcons';
import { Device, Position } from '../../types/traccar';

const DEMO_TRANSIT_FLEET: Device[] = [
  {
    id: 801,
    name: 'হানিফ এন্টারপ্রাইজ Hino 1J (ঢাকা মেট্রো-ব ১৪-৯৯০১)',
    uniqueId: '864720058291801',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'bus',
    phone: '+8801712334455',
    attributes: {
      color: '#0284c7',
      plateNumber: 'ঢাকা মেট্রো-ব ১৪-৯৯০১',
      driverName: 'মোঃ আব্দুল কুদ্দুস',
      driverPhone: '01712-334455',
      route: 'গাবতলী টার্মিনাল ➔ বগুড়া',
      locationName: 'ঢাকা-ময়মনসিংহ হাইওয়ে (ইন ট্রানজিট)',
      speedLimit: 80,
      initialOdometerKm: 142000,
      initialFuelLiters: 180
    }
  },
  {
    id: 802,
    name: 'শ্যামলী পরিবহন Scania (ঢাকা মেট্রো-ব ১৫-৪২৩১)',
    uniqueId: '864720058291802',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'bus',
    phone: '+8801799887766',
    attributes: {
      color: '#059669',
      plateNumber: 'ঢাকা মেট্রো-ব ১৫-৪২৩১',
      driverName: 'মোঃ রফিকুল ইসলাম',
      driverPhone: '01799-887766',
      route: 'সায়েদাবাদ ➔ চট্টগ্রাম জিইসি মোড়',
      locationName: 'ঢাকা-চট্টগ্রাম এক্সপ্রেসওয়ে (মেঘনা ব্রিজ)',
      speedLimit: 80,
      initialOdometerKm: 98000,
      initialFuelLiters: 220
    }
  },
  {
    id: 803,
    name: 'Tata 1615 Cargo Truck (ঢাকা মেট্রো-ট ২৭-৮৫৭৮)',
    uniqueId: '864720058291803',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'truck',
    phone: '+8801700112233',
    attributes: {
      color: '#d97706',
      plateNumber: 'ঢাকা মেট্রো-ট ২৭-৮৫৭৮',
      driverName: 'মোঃ ফারুক হোসেন',
      driverPhone: '01700-112233',
      route: 'তেজগাঁও সেন্ট্রাল ডিপো ➔ খুলনা ঘাট',
      locationName: 'পদ্মা সেতু এক্সপ্রেসওয়ে লিংক (রানিং)',
      speedLimit: 60,
      initialOdometerKm: 115000,
      initialFuelLiters: 140
    }
  },
  {
    id: 804,
    name: 'Mahindra Bolero Pickup (ঢাকা মেট্রো-ন ১২-৩৪৫৬)',
    uniqueId: '864720058291804',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'pickup',
    phone: '+8801733445566',
    attributes: {
      color: '#4f46e5',
      plateNumber: 'ঢাকা মেট্রো-ন ১২-৩৪৫৬',
      driverName: 'মোঃ কামাল হোসেন',
      driverPhone: '01733-445566',
      route: 'উত্তরা এক্সপ্রেস ➔ গাজীপুর চৌরাস্তা',
      locationName: 'বিমানবন্দর রোড (কাওলা মোড়)',
      speedLimit: 70,
      initialOdometerKm: 54000,
      initialFuelLiters: 45
    }
  },
  {
    id: 805,
    name: 'Toyota HiAce Ambulance (ঢাকা মেট্রো-ছ ১১-৯৮২০)',
    uniqueId: '864720058291805',
    status: 'online',
    disabled: false,
    lastUpdate: new Date().toISOString(),
    category: 'ambulance',
    phone: '+8801744556677',
    attributes: {
      color: '#ef4444',
      plateNumber: 'ঢাকা মেট্রো-ছ ১১-৯৮২০',
      driverName: 'মোঃ শহিদুল আলম',
      driverPhone: '01744-556677',
      route: 'ঢাকা মেডিকেল ➔ পিজি হাসপাতাল',
      locationName: 'শাহবাগ মোড় ইন্টারসেকশন',
      speedLimit: 90,
      initialOdometerKm: 62100,
      initialFuelLiters: 45
    }
  }
];

export const FleetTransitHubView: React.FC = () => {
  const { 
    user,
    logout,
    devices, 
    selectedDeviceId, 
    setSelectedDeviceId, 
    selectedDevice, 
    positions, 
    setActiveTab, 
    language,
    triggerManualAlert
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'live_radar' | 'trip_dispatch' | 'transit_counters' | 'company_rbac' | 'driver_performance' | 'fuel_billing' | 'compliance_vault'>('live_radar');
  const [vehicleSearch, setVehicleSearch] = useState('');
  const [fleetFilter, setFleetFilter] = useState<'ALL' | 'MOVING' | 'PARKED' | 'IDLE'>('ALL');

  // =========================================================================
  // 📋 AUTONEMO-STYLE TRIP PLANNING & DISPATCH STATE
  // =========================================================================
  const [tripsList, setTripsList] = useState<Array<{
    id: string;
    tripNo: string;
    busPlate: string;
    busModel: string;
    route: string;
    driverName: string;
    driverPhone: string;
    supervisorName: string;
    supervisorPhone: string;
    departureTime: string;
    etaTime: string;
    passengers: number;
    totalSeats: number;
    fuelLiters: number;
    farePerSeat: number;
    tollExpense: number;
    driverAllowance: number;
    status: 'IN_TRANSIT' | 'READY' | 'SCHEDULED' | 'DELAYED' | 'COMPLETED';
  }>>(() => {
    const saved = localStorage.getItem('gps_fleet_trips_list');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'trip_1',
        tripNo: 'TR-8810',
        busPlate: 'ঢাকা মেট্রো-ব ১৪-৯৯০১',
        busModel: 'হানিফ এন্টারপ্রাইজ Hino 1J',
        route: 'গাবতলী টার্মিনাল ➔ বগুড়া চারমাথা',
        driverName: 'মোঃ আব্দুল কুদ্দুস',
        driverPhone: '01712-334455',
        supervisorName: 'মোঃ শফিকুল আলম',
        supervisorPhone: '01711-889900',
        departureTime: '১০:৩০ AM',
        etaTime: '০৩:১৫ PM',
        passengers: 38,
        totalSeats: 40,
        fuelLiters: 65,
        farePerSeat: 650,
        tollExpense: 1450,
        driverAllowance: 1200,
        status: 'IN_TRANSIT'
      },
      {
        id: 'trip_2',
        tripNo: 'TR-8812',
        busPlate: 'ঢাকা মেট্রো-ব ১৫-৪২৩১',
        busModel: 'শ্যামলী পরিবহন Scania Multi-Axle',
        route: 'সায়েদাবাদ ➔ চট্টগ্রাম দামপাড়া',
        driverName: 'মোঃ রফিকুল ইসলাম',
        driverPhone: '01719-887766',
        supervisorName: 'মোঃ আনিসুর রহমান',
        supervisorPhone: '01719-332211',
        departureTime: '১১:০০ AM',
        etaTime: '০৫:৩০ PM',
        passengers: 40,
        totalSeats: 40,
        fuelLiters: 90,
        farePerSeat: 1200,
        tollExpense: 2200,
        driverAllowance: 1800,
        status: 'READY'
      },
      {
        id: 'trip_3',
        tripNo: 'TR-8815',
        busPlate: 'ঢাকা মেট্রো-ট ২৭-৮৫৭৮',
        busModel: 'Tata 1615 Cargo Truck',
        route: 'তেজগাঁও সেন্ট্রাল ডিপো ➔ খুলনা',
        driverName: 'মোঃ ফারুক হোসেন',
        driverPhone: '01715-443322',
        supervisorName: 'সেলফ ড্রাইভ',
        supervisorPhone: '01715-443322',
        departureTime: '০১:০০ PM',
        etaTime: '০৮:৪৫ PM',
        passengers: 2,
        totalSeats: 3,
        fuelLiters: 110,
        farePerSeat: 18500,
        tollExpense: 3100,
        driverAllowance: 2500,
        status: 'IN_TRANSIT'
      },
      {
        id: 'trip_4',
        tripNo: 'TR-8818',
        busPlate: 'ঢাকা মেট্রো-ব ১৬-৭৭৮৮',
        busModel: 'এনা ট্রান্সপোর্ট Hyundai Universe',
        route: 'মহাখালী ➔ ময়মনসিংহ বাইপাস',
        driverName: 'মোঃ জসিম উদ্দিন',
        driverPhone: '01711-223388',
        supervisorName: 'মোঃ মোকাররম হোসেন',
        supervisorPhone: '01811-445566',
        departureTime: '০৩:৩০ PM',
        etaTime: '০৬:১৫ PM',
        passengers: 0,
        totalSeats: 40,
        fuelLiters: 45,
        farePerSeat: 350,
        tollExpense: 650,
        driverAllowance: 900,
        status: 'SCHEDULED'
      }
    ];
  });

  const [isNewTripModalOpen, setIsNewTripModalOpen] = useState(false);
  const [newTripBusPlate, setNewTripBusPlate] = useState('ঢাকা মেট্রো-ব ১৪-৯৯০১');
  const [newTripRoute, setNewTripRoute] = useState('গাবতলী টার্মিনাল ➔ বগুড়া চারমাথা');
  const [newTripDriver, setNewTripDriver] = useState('মোঃ আব্দুল কুদ্দুস');
  const [newTripSupervisor, setNewTripSupervisor] = useState('মোঃ শফিকুল আলম');
  const [newTripDeparture, setNewTripDeparture] = useState('১২:৩০ PM');
  const [newTripFuel, setNewTripFuel] = useState('65');
  const [newTripFare, setNewTripFare] = useState('650');
  const [newTripToll, setNewTripToll] = useState('1450');
  const [newTripAllowance, setNewTripAllowance] = useState('1200');

  const handleSaveNewTrip = (e: React.FormEvent) => {
    e.preventDefault();
    const newTripItem = {
      id: `trip_${Date.now().toString().slice(-4)}`,
      tripNo: `TR-${Math.floor(1000 + Math.random() * 9000)}`,
      busPlate: newTripBusPlate,
      busModel: newTripBusPlate.includes('১৪-৯৯০১') ? 'হানিফ এন্টারপ্রাইজ Hino 1J' : newTripBusPlate.includes('১৫-৪২৩১') ? 'শ্যামলী পরিবহন Scania' : 'এনা এক্সপ্রেস Universe',
      route: newTripRoute,
      driverName: newTripDriver,
      driverPhone: '01712-334455',
      supervisorName: newTripSupervisor,
      supervisorPhone: '01711-889900',
      departureTime: newTripDeparture,
      etaTime: '০৬:৩০ PM',
      passengers: 0,
      totalSeats: 40,
      fuelLiters: parseFloat(newTripFuel) || 60,
      farePerSeat: parseFloat(newTripFare) || 650,
      tollExpense: parseFloat(newTripToll) || 1450,
      driverAllowance: parseFloat(newTripAllowance) || 1200,
      status: 'SCHEDULED' as const
    };

    const updated = [newTripItem, ...tripsList];
    setTripsList(updated);
    localStorage.setItem('gps_fleet_trips_list', JSON.stringify(updated));
    setIsNewTripModalOpen(false);
    alert(`✅ নতুন ট্রিপ #${newTripItem.tripNo} (${newTripItem.route}) সফলভাবে প্ল্যান ও শিডিউল করা হয়েছে!`);
  };

  const handleUpdateTripStatus = (tripId: string, newStatus: 'IN_TRANSIT' | 'READY' | 'SCHEDULED' | 'DELAYED' | 'COMPLETED') => {
    const updated = tripsList.map(t => t.id === tripId ? { ...t, status: newStatus } : t);
    setTripsList(updated);
    localStorage.setItem('gps_fleet_trips_list', JSON.stringify(updated));
  };

  // Fleet Company Manager Setup State for Fleet Owner
  const [fleetManagers, setFleetManagers] = useState<Array<{ id: string; name: string; phone: string; pin: string; company: string; base: string; status: 'active' | 'inactive' }>>(() => {
    const saved = localStorage.getItem('gps_fleet_company_managers');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'mgr_hanif', name: 'মোঃ শামীম ওসমান', phone: '01710-001122', pin: '5501', company: 'হানিফ এন্টারপ্রাইজ', base: 'সেন্ট্রাল হেড অফিস • গাবতলী ঢাকা', status: 'active' },
      { id: 'mgr_shyamoli', name: 'মোঃ কামরুল হাসান', phone: '01799-887766', pin: '6620', company: 'শ্যামলী পরিবহন', base: 'আরামবাগ সেন্ট্রাল ডিপো', status: 'active' },
      { id: 'mgr_ena', name: 'আনিসুর রহমান', phone: '01733-445566', pin: '7731', company: 'এনা ট্রান্সপোর্ট', base: 'মহাখালী ইন্টারসিটি টার্মিনাল', status: 'active' }
    ];
  });

  const [newMgrName, setNewMgrName] = useState('');
  const [newMgrPhone, setNewMgrPhone] = useState('');
  const [newMgrPin, setNewMgrPin] = useState('5501');
  const [newMgrCompany, setNewMgrCompany] = useState('হানিফ এন্টারপ্রাইজ');
  const [newMgrBase, setNewMgrBase] = useState('সেন্ট্রাল হেড অফিস • ঢাকা');
  const [isNewMgrModalOpen, setIsNewMgrModalOpen] = useState(false);
  const [matrixSaveSuccess, setMatrixSaveSuccess] = useState(false);

  // 5-Tier Live Fleet Permission Matrix State for Fleet Owner
  const [fleetRolePermissions, setFleetRolePermissions] = useState<Record<string, Record<string, boolean>>>(() => {
    const saved = localStorage.getItem('gps_fleet_role_matrix_perms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      owner: {
        liveTracking: true,
        engineCut: true,
        accidentVideo: true,
        gatepassApproval: true,
        passengerStepper: true,
        fleetSetup: true,
        driverRecruit: true,
        billingFinance: true,
        legalVault: true
      },
      manager: {
        liveTracking: true,
        engineCut: false,
        accidentVideo: false,
        gatepassApproval: true,
        passengerStepper: false,
        fleetSetup: true,
        driverRecruit: true,
        billingFinance: true,
        legalVault: true
      },
      counter_incharge: {
        liveTracking: true,
        engineCut: false,
        accidentVideo: true,
        gatepassApproval: true,
        passengerStepper: false,
        fleetSetup: false,
        driverRecruit: false,
        billingFinance: false,
        legalVault: false
      },
      vehicle_supervisor: {
        liveTracking: true,
        engineCut: false,
        accidentVideo: false,
        gatepassApproval: false,
        passengerStepper: true,
        fleetSetup: false,
        driverRecruit: false,
        billingFinance: false,
        legalVault: false
      },
      driver: {
        liveTracking: true,
        engineCut: false,
        accidentVideo: false,
        gatepassApproval: false,
        passengerStepper: false,
        fleetSetup: false,
        driverRecruit: false,
        billingFinance: false,
        legalVault: false
      }
    };
  });

  const handleToggleMatrixPerm = (roleKey: string, permKey: string) => {
    setFleetRolePermissions(prev => {
      const currentRolePerms = prev[roleKey] || {};
      const updated = {
        ...prev,
        [roleKey]: {
          ...currentRolePerms,
          [permKey]: !currentRolePerms[permKey]
        }
      };
      localStorage.setItem('gps_fleet_role_matrix_perms', JSON.stringify(updated));
      return updated;
    });
    setMatrixSaveSuccess(true);
    setTimeout(() => setMatrixSaveSuccess(false), 2000);
  };

  const handleSaveNewManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMgrName.trim() || !newMgrPhone.trim()) return;

    const newManager = {
      id: `mgr_${Date.now().toString().slice(-4)}`,
      name: newMgrName.trim(),
      phone: newMgrPhone.trim(),
      pin: newMgrPin.trim() || '5501',
      company: newMgrCompany.trim(),
      base: newMgrBase.trim(),
      status: 'active' as const
    };

    const updated = [newManager, ...fleetManagers];
    setFleetManagers(updated);
    localStorage.setItem('gps_fleet_company_managers', JSON.stringify(updated));
    setIsNewMgrModalOpen(false);
    setNewMgrName('');
    setNewMgrPhone('');
    alert(`✅ "${newManager.name}" কে "${newManager.company}" এর কোম্পানি ম্যানেজার হিসেবে সফলভাবে নিয়োগ দেওয়া হয়েছে!`);
  };

  const isStaffUser = Boolean(
    user?.email?.includes('fleetstaff') || 
    user?.role === 'manager' ||
    user?.role === 'counter_incharge' ||
    user?.role === 'vehicle_supervisor' ||
    user?.role === 'supervisor' || 
    user?.role === 'driver' || 
    user?.role === 'lineman' ||
    (user as any)?.assigned ||
    /^[0-9\-\+]+@/.test(user?.email || '')
  );
  const isManager = isStaffUser && (user?.role === 'manager' || user?.name?.includes('ম্যানেজার') || user?.name?.includes('ওসমান'));
  const isDriver = isStaffUser && !isManager && (user?.role === 'driver' || user?.name?.includes('কুদ্দুস') || (user as any)?.assigned?.includes('ঢাকা মেট্রো-ব'));
  const isVehicleSupervisor = isStaffUser && !isManager && !isDriver && (user?.role === 'vehicle_supervisor' || user?.name?.includes('সুপারভাইজার') || user?.name?.includes('শফিকুল'));
  const isCounterIncharge = isStaffUser && !isManager && !isDriver && !isVehicleSupervisor;
  
  const staffTerminalOrBus = (user as any)?.assigned || (
    isManager ? 'হানিফ এন্টারপ্রাইজ সেন্ট্রাল হেড অফিস' :
    isDriver ? 'হানিফ এন্টারপ্রাইজ Hino 1J (ঢাকা মেট্রো-ব ১৪-৯৯০১)' :
    isVehicleSupervisor ? 'হানিফ এন্টারপ্রাইজ Hino 1J (অনবোর্ড বাস)' :
    'জয়দেবপুর বাস টার্মিনাল'
  );

  // =========================================================================
  // 🏢 COMPANY OPERATIONS MANAGER SETUP HUB STATE
  // =========================================================================
  const [managerSetupTab, setManagerSetupTab] = useState<'buses' | 'drivers' | 'counters' | 'supervisors' | 'staff_pins'>('buses');
  const [managerBusesList, setManagerBusesList] = useState(() => {
    const saved = localStorage.getItem('gps_mgr_buses');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, plate: 'ঢাকা মেট্রো-ব ১৪-৯৯০১', model: 'হানিফ এন্টারপ্রাইজ Hino 1J', route: 'গাবতলী ➔ বগুড়া', seats: 40, driver: 'মোঃ আব্দুল কুদ্দুস', supervisor: 'মোঃ শফিকুল আলম', status: 'IN_TRANSIT' },
      { id: 2, plate: 'ঢাকা মেট্রো-ব ১৫-৪২৩১', model: 'শ্যামলী পরিবহন Scania Multi-Axle', route: 'সায়েদাবাদ ➔ চট্টগ্রাম', seats: 40, driver: 'মোঃ রফিকুল ইসলাম', supervisor: 'মোঃ আনিসুর রহমান', status: 'READY' },
      { id: 3, plate: 'ঢাকা মেট্রো-ট ২৭-৮৫৭৮', model: 'Tata 1615 Cargo Truck', route: 'তেজগাঁও ➔ খুলনা', seats: 3, driver: 'মোঃ ফারুক হোসেন', supervisor: 'সেলফ', status: 'IN_TRANSIT' },
      { id: 4, plate: 'ঢাকা মেট্রো-ন ১২-৩৪৫৬', model: 'Mahindra Bolero Pickup', route: 'উত্তরা ➔ গাজীপুর', seats: 3, driver: 'মোঃ কামাল হোসেন', supervisor: 'সেলফ', status: 'IDLE' },
    ];
  });

  const [managerStationsList, setManagerStationsList] = useState(() => {
    const saved = localStorage.getItem('gps_mgr_stations');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, name: 'জয়দেবপুর বাস টার্মিনাল', incharge: 'আব্দুর রাজ্জাক', phone: '01822-771122', pin: '4419', status: 'ACTIVE' },
      { id: 2, name: 'গাবতলী সেন্ট্রাল টার্মিনাল', incharge: 'মোঃ আশরাফুল আলম', phone: '01715-998877', pin: '3312', status: 'ACTIVE' },
      { id: 3, name: 'বগুড়া চারমাথা টার্মিনাল', incharge: 'মোঃ জহিরুল ইসলাম', phone: '01911-223344', pin: '7721', status: 'ACTIVE' },
    ];
  });

  const [managerSupervisorsList, setManagerSupervisorsList] = useState(() => {
    const saved = localStorage.getItem('gps_mgr_supervisors');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, name: 'মোঃ শফিকুল আলম', phone: '01711-889900', bus: 'ঢাকা মেট্রো-ব ১৪-৯৯০১ (হানিফ Hino 1J)', pin: '8821', status: 'ACTIVE' },
      { id: 2, name: 'মোঃ আনিসুর রহমান', phone: '01719-332211', bus: 'ঢাকা মেট্রো-ব ১৫-৪২৩১ (শ্যামলী Scania)', pin: '6610', status: 'ACTIVE' },
      { id: 3, name: 'মোঃ মোকাররম হোসেন', phone: '01811-445566', bus: 'ঢাকা মেট্রো-ব ১৬-৭৭৮৮ (গ্রীন লাইন Volvo)', pin: '2290', status: 'ACTIVE' },
    ];
  });

  // =========================================================================
  // 🧠 SMART FLEET & DRIVER INTELLIGENCE STATE
  // =========================================================================
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isCrashAlertModalOpen, setIsCrashAlertModalOpen] = useState(false);
  
  // Driver License State
  const [driverLicense, setDriverLicense] = useState({
    number: 'DL-DH-884920',
    expiryDate: '2027-11-15',
    category: 'Heavy Commercial Bus',
    authority: 'BRTA Mirpur-1, Dhaka',
    status: 'VALID' as 'VALID' | 'EXPIRING_SOON' | 'EXPIRED'
  });

  // Dynamic Available Driver & Bus Pool with LocalStorage Persistence
  const [assignedDriverName, setAssignedDriverName] = useState(() => {
    return localStorage.getItem('gps_transit_driver_name') || 'মোঃ আব্দুল কুদ্দুস';
  });
  const [assignedDriverPhone, setAssignedDriverPhone] = useState(() => {
    return localStorage.getItem('gps_transit_driver_phone') || '01712-334455';
  });
  const [assignedBusPlate, setAssignedBusPlate] = useState(() => {
    return localStorage.getItem('gps_transit_bus_plate') || 'ঢাকা মেট্রো-ব ১৪-৯৯০১';
  });

  // Available Drivers Pool (Idle / Ready drivers only)
  const AVAILABLE_DRIVERS_POOL = [
    { id: 1, name: 'মোঃ আব্দুল কুদ্দুস', phone: '01712-334455', license: 'DL-DH-884920', expiry: '২০২৭-১১-১৫', status: 'VALID' },
    { id: 2, name: 'মোঃ রফিকুল ইসলাম', phone: '01799-887766', license: 'DL-CTG-541290', expiry: '২০২৮-০৩-২০', status: 'VALID' },
    { id: 3, name: 'মোঃ ফারুক হোসেন', phone: '01700-112233', license: 'DL-KH-198421', expiry: '২০২৬-০৯-০৫', status: 'EXPIRING_SOON' },
    { id: 4, name: 'মোঃ কামাল হোসেন', phone: '01733-445566', license: 'DL-GA-332901', expiry: '২০২৫-১২-৩১', status: 'EXPIRED' }
  ];

  // 1-Tap Walkie-Talkie Dispatched Messages & Real-World Trip Counters with LocalStorage Persistence
  const [tripCounters, setTripCounters] = useState(() => {
    const saved = localStorage.getItem('gps_transit_trip_counters');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      checkpost: 0,
      fuelRefill: 0,
      heavyJam: 0,
      hotelBreak: 0,
      tollFerry: 0
    };
  });

  const [walkieMessages, setWalkieMessages] = useState<Array<{ id: number; sender: string; text: string; time: string; target: string; roleType?: 'driver' | 'supervisor' | 'lineman' | 'system' }>>(() => {
    const saved = localStorage.getItem('gps_transit_walkie_messages');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, sender: '🏢 গাবতলী কাউন্টার (ইনচার্জ)', text: 'যাত্রী বোর্ডিং সম্পূর্ণ • ছাড়ার প্রস্তুতি নিন', time: '১০:২৫ AM', target: 'বাস চালক', roleType: 'supervisor' },
      { id: 2, sender: '👨‍✈️ চালক (কুদ্দুস)', text: 'বাস রেডি • গেটপাস ক্লিয়ারেন্স দিন', time: '১০:২৮ AM', target: 'লাইনম্যান', roleType: 'driver' }
    ];
  });

  // Dynamic Onboard Passenger Management with LocalStorage Persistence
  const [onboardPassengerCount, setOnboardPassengerCount] = useState(() => {
    const saved = localStorage.getItem('gps_transit_passenger_count');
    return saved ? parseInt(saved, 10) : 38;
  });

  const [boardingLogs, setBoardingLogs] = useState<Array<{ id: number; location: string; count: number; delta: number; time: string }>>(() => {
    const saved = localStorage.getItem('gps_transit_boarding_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 1, location: 'গাবতলী সেন্ট্রাল টার্মিনাল (১ম বোর্ডিং)', count: 30, delta: 30, time: '১০:৩০ AM' },
      { id: 2, location: 'সাভার বাজার বাসস্ট্যান্ড (সাব-কাউন্টার)', count: 35, delta: 5, time: '১১:১৫ AM' },
      { id: 3, location: 'চন্দ্রা ত্রিমোড় (হাইওয়ে পিকআপ)', count: 38, delta: 3, time: '১১:৪৫ AM' }
    ];
  });
  const [isGatepassApprovalModalOpen, setIsGatepassApprovalModalOpen] = useState(false);
  const [gatepassBatchInput, setGatepassBatchInput] = useState(onboardPassengerCount);
  const [showBoardingLogs, setShowBoardingLogs] = useState(false);

  const [isDriverSosOpen, setIsDriverSosOpen] = useState(false);

  // Real-Time Cross-Tab Broadcast & Floating Push Notification State
  const [liveIncomingBanner, setLiveIncomingBanner] = useState<{ sender: string; text: string; time: string; roleType?: string } | null>(null);
  const [incomingEmergencyAlert, setIncomingEmergencyAlert] = useState<{ busPlate: string; driver: string; supervisor: string; location: string; speed: string; time: string; senderRole: string } | null>(null);

  // Web Audio Synthesizer for Radio Walkie-Talkie Chime and Emergency Sirens
  const playAudioChime = (type: 'walkie' | 'sos' | 'gatepass') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === 'sos') {
        // High-low pulsing emergency alarm siren
        [0, 0.2, 0.4, 0.6, 0.8, 1.0].forEach(time => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(time % 0.4 === 0 ? 1175 : 880, ctx.currentTime + time);
          gain.gain.setValueAtTime(0.25, ctx.currentTime + time);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + time);
          osc.stop(ctx.currentTime + time + 0.19);
        });
      } else if (type === 'walkie') {
        // 2-tone walkie talkie chirp
        [0, 0.09].forEach((time, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(idx === 0 ? 950 : 1350, ctx.currentTime + time);
          gain.gain.setValueAtTime(0.2, ctx.currentTime + time);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + time + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + time);
          osc.stop(ctx.currentTime + time + 0.09);
        });
      } else {
        // Gatepass approval 3-note harmonic chime
        [523, 659, 784].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
          gain.gain.setValueAtTime(0.18, ctx.currentTime + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.22);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.1);
          osc.stop(ctx.currentTime + idx * 0.1 + 0.23);
        });
      }
    } catch (e) {
      console.warn('Web Audio synthesis prevented:', e);
    }
  };

  // BroadcastChannel & Storage Event Real-Time Listener
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel('easytracker_fleet_realtime_channel');
      bc.onmessage = (event) => {
        const { type, payload } = event.data || {};
        if (type === 'WALKIE_MSG') {
          setWalkieMessages(prev => {
            if (prev.some(m => m.id === payload.id)) return prev;
            return [payload, ...prev].slice(0, 30);
          });
          setLiveIncomingBanner({ sender: payload.sender, text: payload.text, time: payload.time, roleType: payload.roleType });
          playAudioChime('walkie');
          setTimeout(() => setLiveIncomingBanner(null), 8000);
        } else if (type === 'EMERGENCY_SOS') {
          setIncomingEmergencyAlert(payload);
          setIsCrashAlertModalOpen(true);
          playAudioChime('sos');
          triggerManualAlert('sos', `🚨 জরুরি এক্সিডেন্ট এসওএস! বাস: ${payload.busPlate}, অবস্থান: ${payload.location}`);
        } else if (type === 'PASSENGER_UPDATE') {
          setOnboardPassengerCount(payload.count);
        } else if (type === 'GATEPASS_APPROVED') {
          setOnboardPassengerCount(payload.count);
          playAudioChime('gatepass');
          setLiveIncomingBanner({ sender: '🏢 কাউন্টার ইনচার্জ', text: `✅ গেটপাস অনুমোদিত! যাত্রী: ${payload.count} জন • ট্রিপ ছাড়ার ক্লিয়ারেন্স`, time: payload.time });
          setTimeout(() => setLiveIncomingBanner(null), 8000);
        } else if (type === 'DRIVER_ASSIGNED') {
          setAssignedDriverName(payload.driverName);
          setAssignedDriverPhone(payload.driverPhone);
        }
      };
    } catch (e) {}

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'gps_transit_walkie_messages' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWalkieMessages(parsed);
            const latest = parsed[0];
            setLiveIncomingBanner({ sender: latest.sender, text: latest.text, time: latest.time, roleType: latest.roleType });
            playAudioChime('walkie');
            setTimeout(() => setLiveIncomingBanner(null), 8000);
          }
        } catch (err) {}
      } else if (e.key === 'gps_transit_emergency_sos_broadcast' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed) {
            setIncomingEmergencyAlert(parsed);
            setIsCrashAlertModalOpen(true);
            playAudioChime('sos');
          }
        } catch (err) {}
      } else if (e.key === 'gps_transit_passenger_count' && e.newValue) {
        setOnboardPassengerCount(parseInt(e.newValue, 10) || 0);
      } else if (e.key === 'gps_transit_driver_name' && e.newValue) {
        setAssignedDriverName(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Periodic fallback polling to sync messages across tabs
    const syncInterval = setInterval(() => {
      try {
        const storedMsgs = localStorage.getItem('gps_transit_walkie_messages');
        if (storedMsgs) {
          const parsed = JSON.parse(storedMsgs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setWalkieMessages(parsed);
          }
        }
        const storedSos = localStorage.getItem('gps_transit_emergency_sos_broadcast');
        if (storedSos) {
          const parsed = JSON.parse(storedSos);
          if (parsed && Date.now() - parsed.timestamp < 12000 && !incomingEmergencyAlert) {
            setIncomingEmergencyAlert(parsed);
            setIsCrashAlertModalOpen(true);
            playAudioChime('sos');
          }
        }
        const pCount = localStorage.getItem('gps_transit_passenger_count');
        if (pCount) setOnboardPassengerCount(parseInt(pCount, 10));
      } catch (e) {}
    }, 1000);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(syncInterval);
    };
  }, []);

  // ADAS Cabin Alarm Simulation State
  const [cabinAlarm, setCabinAlarm] = useState<string | null>(null);

  const triggerCabinSignal = (type: 'RED_LIGHT' | 'OVERSPEED') => {
    if (type === 'RED_LIGHT') {
      setCabinAlarm('🚦 সতর্কবার্তা: লাল বাতি সিগন্যাল অতিক্রম করা হয়েছে! (Front AI Dashcam Logged)');
    } else {
      setCabinAlarm('⚡ সতর্কবার্তা: অতিরিক্ত গতি (৮০ কিমি/ঘণ্টা ছাড়িয়েছে)! গতি নিয়ন্ত্রণে আনুন।');
    }
    setTimeout(() => setCabinAlarm(null), 5000);
  };

  const sendWalkieMessage = (text: string, sender: string, target: string, roleType?: 'driver' | 'supervisor' | 'lineman' | 'system') => {
    const newMsg = {
      id: Date.now(),
      sender,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      target,
      roleType: roleType || (sender.includes('চালক') ? 'driver' : sender.includes('লাইনম্যান') ? 'lineman' : 'supervisor')
    };

    setWalkieMessages(prev => {
      const next = [newMsg, ...prev.filter(m => m.id !== newMsg.id)].slice(0, 30);
      try { localStorage.setItem('gps_transit_walkie_messages', JSON.stringify(next)); } catch (e) {}
      return next;
    });

    // Multi-tab real-time broadcast
    try {
      const bc = new BroadcastChannel('easytracker_fleet_realtime_channel');
      bc.postMessage({ type: 'WALKIE_MSG', payload: newMsg });
      bc.close();
    } catch (e) {}

    playAudioChime('walkie');
  };

  // 2-Way Instant Emergency SOS Dispatcher
  const triggerEmergencySos = (senderRole: 'supervisor' | 'driver') => {
    const sosData = {
      id: Date.now(),
      timestamp: Date.now(),
      busPlate: assignedBusPlate,
      driver: `${assignedDriverName} (${assignedDriverPhone})`,
      supervisor: 'মোঃ শফিকুল আলম (01711-889900)',
      location: 'ঢাকা-ময়মনসিংহ হাইওয়ে (টোল প্লাজা সংলগ্ন)',
      speed: '৬০ কিমি/ঘণ্টা',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderRole
    };

    try {
      localStorage.setItem('gps_transit_emergency_sos_broadcast', JSON.stringify(sosData));
      const bc = new BroadcastChannel('easytracker_fleet_realtime_channel');
      bc.postMessage({ type: 'EMERGENCY_SOS', payload: sosData });
      bc.close();
    } catch (e) {}

    sendWalkieMessage(
      `🚨 জরুরি এক্সিডেন্ট এসওএস! বাসের অবস্থান: ঢাকা-ময়মনসিংহ হাইওয়ে • অবিলম্বে রেসকিউ টিম পাঠান!`,
      senderRole === 'supervisor' ? '🎫 বাস সুপারভাইজার (শফিকুল)' : '👨‍✈️ বাস চালক (কুদ্দুস)',
      'কাউন্টার ইনচার্জ, ডিসপ্যাচার ও প্রধান কার্যালয়',
      'system'
    );

    triggerManualAlert(
      'sos',
      `🚨 জরুরি এসওএস সংকেত! বাস: ${assignedBusPlate}, অবস্থান: ঢাকা-ময়মনসিংহ হাইওয়ে। কাউন্টার ও রেসকিউ টিমকে সতর্ক করা হয়েছে!`
    );

    playAudioChime('sos');
    if (senderRole === 'driver') {
      setIsDriverSosOpen(true);
    } else {
      setIsCrashAlertModalOpen(true);
    }
  };

  // =========================================================================
  // 🛡️ DEDICATED CLEAN WORK PORTAL FOR STAFF SUB-USERS (LINEMAN & DRIVER)
  // =========================================================================
  if (isStaffUser) {
    return (
      <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-5 space-y-4 select-none animate-in fade-in">
        
        {/* 📢 Live Real-Time Floating Incoming Banner */}
        {liveIncomingBanner && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-cyan-950 via-indigo-950 to-slate-900 border-2 border-cyan-400 text-white shadow-2xl flex items-center justify-between animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 text-cyan-300 border border-cyan-400 flex items-center justify-center text-xl animate-pulse shrink-0 shadow-lg">
                📢
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-cyan-300 text-xs">{liveIncomingBanner.sender}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({liveIncomingBanner.time})</span>
                  <span className="text-[9px] bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 px-2 py-0.5 rounded-full font-bold">
                    রিয়েল-টাইম বার্তা
                  </span>
                </div>
                <p className="font-black text-sm text-white mt-0.5">{liveIncomingBanner.text}</p>
              </div>
            </div>
            <button 
              onClick={() => setLiveIncomingBanner(null)}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Cabin Alarm Banner (Live ADAS Signal) */}
        {cabinAlarm && (
          <div className="p-4 rounded-3xl bg-gradient-to-r from-rose-950 via-rose-900 to-rose-950 border-2 border-rose-500 text-white shadow-2xl flex items-center justify-between animate-bounce">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-6 h-6 text-yellow-300 animate-pulse shrink-0" />
              <span className="font-black text-sm">{cabinAlarm}</span>
            </div>
            <button 
              onClick={() => setCabinAlarm(null)}
              className="p-1 rounded-full bg-rose-800 text-white hover:bg-rose-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Top Banner with Staff Persona */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setActiveTab('map')}
                className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="ম্যাপে ফিরে যান"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-2xl shadow-lg shrink-0 ${
                isManager ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50' :
                isDriver ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50' :
                isVehicleSupervisor ? 'bg-amber-600/30 text-amber-300 border-amber-500/50' :
                'bg-cyan-600/30 text-cyan-300 border-cyan-500/50'
              }`}>
                {isManager ? '🏢' : isDriver ? '👨‍✈️' : isVehicleSupervisor ? '🎫' : '🏢'}
              </div>

              <div>
                <div className="flex items-center space-x-2 flex-wrap">
                  <h2 className="font-black text-base text-white">
                    {isManager ? '🏢 কোম্পানি অপারেশনস ও ফ্লিট সেটআপ কনসোল' :
                     isDriver ? '🚌 বাস চালক ডিজিটাল কেবিন ও ককপিট' :
                     isVehicleSupervisor ? '🎫 অনবোর্ড বাস সুপারভাইজার ও প্যাসেঞ্জার ট্রানজিট পোর্টাল' :
                     '🏢 কাউন্টার ইনচার্জ ও ডিপার্চার গেটপাস পোর্টাল'}
                  </h2>
                  <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    isManager ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40' :
                    isDriver ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                    isVehicleSupervisor ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                  }`}>
                    {isManager ? 'OPERATIONS MANAGER' : isDriver ? 'BUS DRIVER' : isVehicleSupervisor ? 'BUS SUPERVISOR' : 'COUNTER INCHARGE'}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    🟢 DUTY ACTIVE
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  স্বাগতম, <strong>{user?.name || 'স্টাফ মেম্বার'}</strong> • নির্ধারিত দায়িত্ব: <strong className="text-cyan-300">{staffTerminalOrBus}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-300 font-mono font-bold border border-emerald-500/40 flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>পিন ভেরিফাইড সাব-ইউজার</span>
              </span>
              <button
                type="button"
                onClick={() => logout()}
                className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40 flex items-center space-x-1.5 transition active:scale-95 shadow-sm"
                title="লগআউট করুন"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-400" />
                <span>লগআউট</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 🏢 1. COMPANY OPERATIONS MANAGER CONSOLE (SETUP & STAFF RBAC HUB)         */}
        {/* ========================================================================= */}
        {isManager ? (
          <div className="space-y-4 animate-in fade-in">
            {/* Top Metric Cards for Manager */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-900 border border-indigo-500/30 p-3.5 rounded-2xl">
                <span className="text-[10.5px] text-slate-400 block font-bold">🚌 মোট ফ্লিট বাস:</span>
                <span className="font-black text-white text-lg">{managerBusesList.length} টি বাস</span>
                <span className="text-[10px] text-emerald-400 block mt-0.5">২টি ট্রিপে • ২টি রেডি</span>
              </div>
              <div className="bg-slate-900 border border-emerald-500/30 p-3.5 rounded-2xl">
                <span className="text-[10.5px] text-slate-400 block font-bold">👨‍✈️ নিয়োজিত চালক:</span>
                <span className="font-black text-emerald-300 text-lg">{AVAILABLE_DRIVERS_POOL.length} জন</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">BRTA লাইসেন্স ভেরিফাইড</span>
              </div>
              <div className="bg-slate-900 border border-cyan-500/30 p-3.5 rounded-2xl">
                <span className="text-[10.5px] text-slate-400 block font-bold">🏢 টার্মিনাল স্টেশন:</span>
                <span className="font-black text-cyan-300 text-lg">{managerStationsList.length} টি কাউন্টার</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">গেটপাস অথরিটি সক্রিয়</span>
              </div>
              <div className="bg-slate-900 border border-amber-500/30 p-3.5 rounded-2xl">
                <span className="text-[10.5px] text-slate-400 block font-bold">🎫 বাস সুপারভাইজার:</span>
                <span className="font-black text-amber-300 text-lg">{managerSupervisorsList.length} জন</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">অনবোর্ড প্যাসেঞ্জার গাইড</span>
              </div>
            </div>

            {/* Manager Operations Sub-Navigation Tabs */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-black text-sm text-white">কোম্পানি সেটআপ ও রোল ম্যানেজমেন্ট হাব</h3>
                </div>

                <div className="flex items-center space-x-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('buses')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'buses' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🚌 বাস ও রুট
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('drivers')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'drivers' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    👨‍✈️ চালক ও লাইসেন্স
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('counters')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'counters' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🏢 কাউন্টার স্টেশন
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('supervisors')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'supervisors' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🎫 বাস সুপারভাইজার
                  </button>
                  <button
                    type="button"
                    onClick={() => setManagerSetupTab('staff_pins')}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                      managerSetupTab === 'staff_pins' ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    🔐 স্টাফ পিন ও অ্যাক্সেস
                  </button>
                </div>
              </div>

              {/* Tab 1: Buses & Routes */}
              {managerSetupTab === 'buses' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">কোম্পানির নিবন্ধিত ফ্লিট বাস ও নির্ধারিত রুটসমূহ:</span>
                    <button
                      type="button"
                      onClick={() => alert('🚌 নতুন বাস অ্যাড ফর্ম: নম্বর প্লেট, মডেল ও সিট ক্যাপাসিটি দিয়ে ফ্লিটে যুক্ত করুন।')}
                      className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition active:scale-95 flex items-center space-x-1"
                    >
                      <span>➕ নতুন বাস যুক্ত করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {managerBusesList.map(b => (
                      <div key={b.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">{b.model}</span>
                            <span className="font-mono text-cyan-400 font-bold text-xs">{b.plate}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              {b.seats} সিট ক্যাপাসিটি
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex items-center space-x-3 flex-wrap">
                            <span>🛣️ রুট: <strong className="text-slate-200">{b.route}</strong></span>
                            <span>👨‍✈️ চালক: <strong className="text-cyan-300">{b.driver}</strong></span>
                            <span>🎫 সুপারভাইজার: <strong className="text-amber-300">{b.supervisor}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => alert(`✏️ ${b.plate}-এর রুট বা ড্রাইভার এডিট কনসোল ওপেন হয়েছে।`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition"
                          >
                            ✏️ রুট/স্টাফ এডিট
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Drivers & BRTA Licenses */}
              {managerSetupTab === 'drivers' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">নিবন্ধিত ফ্লিট চালক ও BRTA স্মার্ট ড্রাইভিং লাইসেন্স ভল্ট:</span>
                    <button
                      type="button"
                      onClick={() => alert('👨‍✈️ নতুন চালক নিয়োগ ফর্ম: নাম, ফোন ও BRTA লাইসেন্স দিয়ে যুক্ত করুন।')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition active:scale-95 flex items-center space-x-1"
                    >
                      <span>➕ নতুন চালক যোগ করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {AVAILABLE_DRIVERS_POOL.map(d => (
                      <div key={d.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">{d.name}</span>
                            <span className="font-mono text-slate-400 text-xs">({d.phone})</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              d.status === 'VALID' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                              d.status === 'EXPIRING_SOON' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                              'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            }`}>
                              {d.status === 'VALID' ? '🟢 বৈধ' : d.status === 'EXPIRING_SOON' ? '🟡 দ্রুত নবায়ন দরকার' : '🔴 মেয়াদোত্তীর্ণ'}
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex items-center space-x-3 flex-wrap">
                            <span>BRTA লাইসেন্স: <strong className="text-cyan-300 font-mono">{d.license}</strong></span>
                            <span>মেয়াদ: <strong className="text-slate-200 font-mono">{d.expiry}</strong></span>
                            <span>শ্রেণি: <strong>Heavy Commercial Bus</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => {
                              setIsLicenseModalOpen(true);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition"
                          >
                            📷 লাইসেন্স আপডেট
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Counter Stations */}
              {managerSetupTab === 'counters' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">টার্মিনাল টিকিট স্টেশন ও কাউন্টার ইনচার্জ সেটআপ:</span>
                    <button
                      type="button"
                      onClick={() => alert('🏢 নতুন কাউন্টার স্টেশন অ্যাড ফর্ম: টার্মিনালের নাম, ইনচার্জ ও ফোন দিয়ে যুক্ত করুন।')}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-600/30 transition active:scale-95 flex items-center space-x-1"
                    >
                      <span>➕ নতুন কাউন্টার যুক্ত করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {managerStationsList.map(s => (
                      <div key={s.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">🏢 {s.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                              গেটপাস স্টেশন
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex items-center space-x-3 flex-wrap">
                            <span>কাউন্টার ইনচার্জ: <strong className="text-cyan-300">{s.incharge}</strong></span>
                            <span>ফোন: <strong className="text-slate-200 font-mono">{s.phone}</strong></span>
                            <span>লগইন পিন: <strong className="text-amber-300 font-mono">PIN: {s.pin}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => alert(`🔑 ${s.name}-এর ইনচার্জ (${s.incharge}) এর জন্য নতুন ৪-ডিজিট পিন রিসেট করা হয়েছে।`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition"
                          >
                            🔑 পিন রিসেট
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 4: Vehicle Supervisors */}
              {managerSetupTab === 'supervisors' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">বাসের ভেতরের সুপারভাইজার (কন্ডাক্টর/গাইড) ও গাড়ি পেয়ারিং:</span>
                    <button
                      type="button"
                      onClick={() => alert('🎫 নতুন বাস সুপারভাইজার নিয়োগ ও বাস পেয়ারিং ফর্ম।')}
                      className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md shadow-amber-600/30 transition active:scale-95 flex items-center space-x-1"
                    >
                      <span>➕ নতুন সুপারভাইজার যোগ করুন</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    {managerSupervisorsList.map(sup => (
                      <div key={sup.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-white text-sm">🎫 {sup.name}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              অনবোর্ড গাইড
                            </span>
                          </div>
                          <div className="text-slate-400 text-xs mt-1 flex items-center space-x-3 flex-wrap">
                            <span>নির্ধারিত বাস: <strong className="text-white">{sup.bus}</strong></span>
                            <span>ফোন: <strong className="text-slate-200 font-mono">{sup.phone}</strong></span>
                            <span>লগইন পিন: <strong className="text-amber-300 font-mono">PIN: {sup.pin}</strong></span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 self-end md:self-auto">
                          <button
                            type="button"
                            onClick={() => alert(`🔄 ${sup.name}-কে অন্য বাসে স্থানান্তর বা পিন পরিবর্তন অপশন।`)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 border border-slate-700 font-bold text-xs transition"
                          >
                            🔄 বাস পেয়ারিং পরিবর্তন
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 5: Staff PINs & RBAC Access Matrix */}
              {managerSetupTab === 'staff_pins' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">স্টাফ পিন কোড ও পারমিশন কন্ট্রোল ম্যাট্রিক্স (Role Security):</span>
                    <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                      SECURE PIN RBAC
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-300 border border-slate-800 rounded-2xl overflow-hidden">
                      <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-3">স্টাফ নাম</th>
                          <th className="p-3">রোল</th>
                          <th className="p-3">মোবাইল নম্বর</th>
                          <th className="p-3">৪-ডিজিট পিন</th>
                          <th className="p-3">নির্ধারিত দায়িত্ব</th>
                          <th className="p-3 text-right">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800 bg-slate-900/60">
                        <tr>
                          <td className="p-3 font-bold text-white">মোঃ শামীম ওসমান</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">কোম্পানি ম্যানেজার</span></td>
                          <td className="p-3 font-mono">01710-001122</td>
                          <td className="p-3 font-mono font-bold text-amber-300">5501</td>
                          <td className="p-3 text-slate-400">সেন্ট্রাল হেড অফিস</td>
                          <td className="p-3 text-right"><span className="text-emerald-400 font-bold">🟢 সক্রিয়</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">আব্দুর রাজ্জাক</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">কাউন্টার ইনচার্জ</span></td>
                          <td className="p-3 font-mono">01822-771122</td>
                          <td className="p-3 font-mono font-bold text-amber-300">4419</td>
                          <td className="p-3 text-slate-400">জয়দেবপুর বাস টার্মিনাল</td>
                          <td className="p-3 text-right"><span className="text-emerald-400 font-bold">🟢 সক্রিয়</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">মোঃ শফিকুল আলম</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">বাস সুপারভাইজার</span></td>
                          <td className="p-3 font-mono">01711-889900</td>
                          <td className="p-3 font-mono font-bold text-amber-300">8821</td>
                          <td className="p-3 text-slate-400">হানিফ Hino 1J (অনবোর্ড)</td>
                          <td className="p-3 text-right"><span className="text-emerald-400 font-bold">🟢 সক্রিয়</span></td>
                        </tr>
                        <tr>
                          <td className="p-3 font-bold text-white">মোঃ আব্দুল কুদ্দুস</td>
                          <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">বাস চালক</span></td>
                          <td className="p-3 font-mono">01712-334455</td>
                          <td className="p-3 font-mono font-bold text-amber-300">9081</td>
                          <td className="p-3 text-slate-400">ঢাকা মেট্রো-ব ১৪-৯৯০১</td>
                          <td className="p-3 text-right"><span className="text-emerald-400 font-bold">🟢 সক্রিয়</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Synchronized Message & Action Log Feed for Manager */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-indigo-400" />
                    <span>📢 ফ্লিটব্যাপী আন্তঃসংযুক্ত লাইভ মেসেজ ও অ্যাকশন হিস্টোরি ফিড:</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                    REAL-TIME FLEET SYNC
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto">
                  {walkieMessages.map(msg => (
                    <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-start space-x-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shrink-0 mt-0.5">
                          {msg.sender}
                        </span>
                        <span className="text-slate-200 text-xs">{msg.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isVehicleSupervisor ? (
          /* ========================================================================= */
          /* 🎫 2. ON-BOARD VEHICLE SUPERVISOR (CONDUCTOR / GUIDE) VIEW                */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-600/30 text-amber-300 border border-amber-500/40 flex items-center justify-center text-xl">
                    🎫
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">হানিফ এন্টারপ্রাইজ Hino 1J ({assignedBusPlate})</h3>
                    <span className="text-xs text-amber-300">বাসের ভেতরের সুপারভাইজার • টিকিট ও অনবোর্ড প্যাসেঞ্জার কন্ট্রোল</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs">
                    ✅ গেটপাস অনুমোদিত (কাউন্টার ক্লিয়ার)
                  </span>
                  <a
                    href="tel:01822771122"
                    className="py-1.5 px-3 rounded-xl bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center space-x-1 transition active:scale-95"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>কাউন্টার কল</span>
                  </a>
                </div>
              </div>

              {/* Big Touch Highway Passenger Stepper Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-slate-300 block">👥 অনবোর্ড যাত্রী সংখ্যা ও সিট স্ট্যাটাস:</span>
                    <span className="text-[11px] text-slate-400">হাইওয়েতে যাত্রী ওঠা বা নামার সাথে সাথে বোতামে চাপুন।</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowBoardingLogs(!showBoardingLogs)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                  >
                    {showBoardingLogs ? 'পিকআপ লগ লুকান' : '📋 বিস্তারিত বোর্ডিং হিস্টোরি'}
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800 gap-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-black text-emerald-300 font-mono">{onboardPassengerCount}</span>
                    <span className="text-xs text-slate-400">/ ৪০ মোট আসন ক্যাপাসিটি</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      {40 - onboardPassengerCount} আসন খালি
                    </span>
                  </div>

                  {/* Big Touch Stepper Buttons */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => updatePassengerOnboard(-1)}
                      disabled={onboardPassengerCount <= 0}
                      className="flex-1 sm:flex-none px-4 py-3 rounded-2xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/50 text-rose-300 font-black text-sm transition active:scale-90 disabled:opacity-30 flex items-center justify-center space-x-1 shadow-md"
                      title="যাত্রী নামল"
                    >
                      <UserMinus className="w-4 h-4" />
                      <span>➖ ১ জন নামল</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePassengerOnboard(1)}
                      disabled={onboardPassengerCount >= 40}
                      className="flex-1 sm:flex-none px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm transition active:scale-90 disabled:opacity-30 flex items-center justify-center space-x-1.5 shadow-lg shadow-emerald-600/30"
                      title="হাইওয়েতে নতুন যাত্রী উঠল"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>➕ ১ জন উঠল</span>
                    </button>
                  </div>
                </div>

                {/* Collapsible Boarding History Log */}
                {showBoardingLogs && (
                  <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs max-h-40 overflow-y-auto animate-in fade-in">
                    <span className="text-[10.5px] font-bold text-slate-400 block">রুট বোর্ডিং হিস্টোরি (GPS অটো-ট্যাগিং):</span>
                    {boardingLogs.map(log => (
                      <div key={log.id} className="flex justify-between items-center bg-slate-900 p-2 rounded-xl border border-slate-800">
                        <span className="text-slate-200">
                          {log.location} ({log.delta > 0 ? `+${log.delta}` : log.delta} জন)
                        </span>
                        <span className="font-mono text-emerald-400 text-[11px] font-bold">{log.time}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Highway Trip Occurrence Logging by Conductor / Supervisor */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300 block">⚡ হাইওয়ে ট্রিপ ঘটনা ও বিরতি লগ (১-ক্লিক অটো রিপোর্ট):</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => logTripEvent('CHECKPOST')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">👮</span>
                      <span>পুলিশ / বিআরটিএ চেকপোস্ট</span>
                    </div>
                    {tripCounters.checkpost > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-black">
                        #{tripCounters.checkpost}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('FUEL')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">⛽</span>
                      <span>ফুয়েল / সিএনজি রিফিল</span>
                    </div>
                    {tripCounters.fuelRefill > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-black">
                        #{tripCounters.fuelRefill}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('JAM')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🚦</span>
                      <span>তীব্র যানজট (১০+ মি বিলম্ব)</span>
                    </div>
                    {tripCounters.heavyJam > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-black">
                        #{tripCounters.heavyJam}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('BREAK')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🍱</span>
                      <span>হোটেল ও খাবার বিরতি</span>
                    </div>
                    {tripCounters.hotelBreak > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono text-[10px] font-black">
                        #{tripCounters.hotelBreak}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('TOLL')}
                    className="p-3 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-base">🌉</span>
                      <span>টোল প্লাজা / ফেরি পারাপার</span>
                    </div>
                    {tripCounters.tollFerry > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono text-[10px] font-black">
                        #{tripCounters.tollFerry}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => logTripEvent('ARRIVED')}
                    className="p-3 rounded-2xl bg-emerald-950/60 hover:bg-emerald-900 border border-emerald-500/50 text-xs font-black text-emerald-300 transition active:scale-95 text-left flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>✅ গন্তব্যে সফল আগমন</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* 🚨 Emergency SOS & Hotline Actions for Vehicle Supervisor */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => triggerEmergencySos('supervisor')}
                  className="py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>🚨 জরুরি হাইওয়ে এসওএস / এক্সিডেন্ট এলার্ট পাঠান</span>
                </button>
                <a
                  href="tel:01822771122"
                  className="py-3 px-3 rounded-2xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>📞 কাউন্টার ইনচার্জকে সরাসরি কল দিন</span>
                </a>
              </div>

              {/* Synchronized Message & Action Log Feed */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-amber-400" />
                    <span>📢 আন্তঃসংযুক্ত লাইভ মেসেজ ও অ্যাকশন হিস্টোরি ফিড:</span>
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
                    REAL-TIME SYNC ACTIVE
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto">
                  {walkieMessages.map(msg => (
                    <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                      <div className="flex items-start space-x-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 mt-0.5">
                          {msg.sender}
                        </span>
                        <span className="text-slate-200 text-xs">{msg.text}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{msg.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : isDriver ? (
          /* ========================================================================= */
          /* 👨‍✈️ 3. DRIVER DIGITAL CABIN & COCKPIT VIEW                                */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in">
            {/* 1. Live Trip Telematics & Cabin Status Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-xl">
                    🚌
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">হানিফ এন্টারপ্রাইজ Hino 1J</h3>
                    <span className="text-xs font-mono font-bold text-cyan-400">{assignedBusPlate}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-black text-xs">
                    ⚡ ৬০ কিমি/ঘণ্টা (চলমান)
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-[10.5px] flex items-center space-x-1">
                    <Video className="w-3 h-3 text-purple-400" />
                    <span>AI ADAS সচল</span>
                  </span>
                </div>
              </div>

              {/* Trip Live Telematics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10.5px] text-slate-400 block font-bold">🛣️ নির্ধারিত রুট:</span>
                  <span className="font-extrabold text-cyan-300 text-sm block mt-0.5">গাবতলী টার্মিনাল ➔ বগুড়া</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <span className="text-[10.5px] text-slate-400 block font-bold">📍 লাইভ অবস্থান:</span>
                  <span className="font-extrabold text-slate-100 text-xs block mt-0.5">ঢাকা-ময়মনসিংহ হাইওয়ে (টোল প্লাজা)</span>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <span className="text-[10.5px] text-slate-400 font-bold">👥 অনবোর্ড যাত্রী (সুপারভাইজার নিয়ন্ত্রিত):</span>
                  <span className="font-black text-emerald-300 text-base my-0.5">
                    {onboardPassengerCount} <span className="text-xs text-slate-400 font-normal">/ ৪০ জন</span>
                  </span>
                </div>
              </div>

              {/* ADAS Cabin Beep Alarms */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-300 flex items-center space-x-1.5">
                    <Volume2 className="w-4 h-4 text-purple-400 animate-pulse" />
                    <span>ফ্রন্ট AI ড্যাশ-ক্যাম ও কেবিন সংকেত (ADAS Live):</span>
                  </span>
                  <span className="text-[9.5px] text-slate-400 font-mono">Real-Time Audio-Visual</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => triggerCabinAlarm('🚦 লাল বাতি সিগন্যাল অমান্য সংকেত! গতি কমান ও সিগন্যালে থামুন।')}
                    className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/80 border border-rose-500/40 text-rose-300 font-bold text-left transition active:scale-95 flex items-center space-x-2"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>🚦 লাল বাতি সিগন্যাল বীপ টেস্ট</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerCabinAlarm('⚡ ওভার-স্পিড সতর্কতা! হাইওয়ে স্পিড লিমিট ৮০ কিমি/ঘণ্টা অতিক্রম করেছে।')}
                    className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-950/80 border border-amber-500/40 text-amber-300 font-bold text-left transition active:scale-95 flex items-center space-x-2"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>⚡ ওভার-স্পিড বীপ টেস্ট</span>
                  </button>
                </div>
              </div>

              {/* BRTA Smart Driving License Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white">BRTA স্মার্ট ড্রাইভিং লাইসেন্স:</span>
                    <span className="font-mono text-cyan-300 font-bold">{driverLicense.number}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[9.5px] border border-emerald-500/40">
                      🟢 বৈধ (মেয়াদ: {driverLicense.expiryDate})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLicenseModalOpen(true)}
                    className="px-3 py-1 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center space-x-1"
                  >
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>লাইসেন্স আপডেট</span>
                  </button>
                </div>
              </div>

              {/* Driver Emergency SOS & Call */}
              <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => triggerEmergencySos('driver')}
                  className="py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4 animate-bounce" />
                  <span>🚨 জরুরি এক্সিডেন্ট এসওএস পাঠান</span>
                </button>
                <a
                  href="tel:01711889900"
                  className="py-3 px-3 rounded-2xl bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>📞 বাস সুপারভাইজারকে কল দিন</span>
                </a>
              </div>

              {/* Synchronized Message & Action Log Feed */}
              <div className="space-y-1.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto">
                <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800/80">
                  <span className="text-[10.5px] uppercase font-extrabold text-slate-300 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>আন্তঃসংযুক্ত লাইভ মেসেজ ও অ্যাকশন ফিড:</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                    LIVE SYNC
                  </span>
                </div>
                {walkieMessages.map(msg => (
                  <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-start space-x-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0 mt-0.5">
                        {msg.sender}
                      </span>
                      <span className="text-slate-200 text-xs">{msg.text}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{msg.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* 🏢 4. COUNTER INCHARGE & DEPARTURE GATEPASS PORTAL                        */
          /* ========================================================================= */
          <div className="space-y-4 animate-in fade-in">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-xl">
                    🏢
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">{staffTerminalOrBus}</h3>
                    <span className="text-xs text-slate-400">টার্মিনাল টিকিট ইনচার্জ ও বাস ডিপার্চার গেটপাস কন্ট্রোল</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAssignModalOpen(true)}
                    className="py-1.5 px-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md shadow-cyan-600/30 transition active:scale-95"
                  >
                    <span>🔄 এভেইলেবল চালক ও গাড়ি অ্যাসাইন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCrashAlertModalOpen(true)}
                    className="py-1.5 px-3 rounded-xl bg-rose-950/70 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 font-bold text-xs flex items-center space-x-1 transition shadow-sm"
                    title="জরুরি দুর্ঘটনার ভিডিও অডিট"
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span>🚨 এক্সসিডেন্ট এলার্ট ভিউয়ার</span>
                  </button>
                </div>
              </div>

              {/* Assigned Departure Table */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-300 block">🚌 এই টার্মিনাল থেকে ছাড়ার অপেক্ষায় থাকা বাসসমূহ:</span>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2 flex-wrap">
                      <span className="font-black text-sm text-white">হানিফ এন্টারপ্রাইজ Hino 1J</span>
                      <span className="text-xs font-mono font-bold text-cyan-400">{assignedBusPlate}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">কাউন্টারে ইনসাইড</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">🟢 লাইসেন্স বৈধ</span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center space-x-3 flex-wrap">
                      <span>রুট: <strong>গাবতলী ➔ বগুড়া</strong></span>
                      <span>সময়: <strong>১০:৩০ AM</strong></span>
                      <span>নিয়োজিত চালক: <strong className="text-cyan-300">{assignedDriverName} ({assignedDriverPhone})</strong></span>
                      <span>সুপারভাইজার: <strong className="text-amber-300">মোঃ শফিকুল আলম (01711-889900)</strong></span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-black border border-emerald-500/40 text-[11px]">
                        👥 অনবোর্ড যাত্রী: {onboardPassengerCount} / ৪০ জন
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end md:self-auto">
                    <button
                      type="button"
                      onClick={() => setIsGatepassApprovalModalOpen(true)}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/30 transition active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>ডিপার্চার গেটপাস অনুমোদন ({onboardPassengerCount} যাত্রী)</span>
                    </button>
                    <a
                      href={`tel:${assignedDriverPhone}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 border border-slate-700 transition"
                      title="চালককে কল দিন"
                    >
                      <Phone className="w-4 h-4 text-cyan-400" />
                    </a>
                  </div>
                </div>
              </div>

              {/* 1-Tap Supervisor Walkie-Talkie Response */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <span className="text-xs font-bold text-slate-300 block">📢 চালকের সাথে কুইক ওয়ান-ট্যাপ যোগাযোগ:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => sendWalkieMessage('👥 আরও যাত্রী আসছে • অনুগ্রহ করে অল্প সময় অপেক্ষা করুন', isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)', 'বাস চালক', isLineman ? 'lineman' : 'supervisor')}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left"
                  >
                    <span>👥 আরও যাত্রী আসছে (অল্প অপেক্ষা করুন)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWalkieMessage('✅ ৩ নং প্ল্যাটফর্ম ক্লিয়ার • বাস ভেতরে নিয়ে আসুন', isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)', 'বাস চালক', isLineman ? 'lineman' : 'supervisor')}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left"
                  >
                    <span>✅ প্ল্যাটফর্ম খালি (বাস ভেতরে আনুন)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => sendWalkieMessage('🛑 ট্রিপ ছাড়ার সময় হয়েছে • ডিপার্চারের প্রস্তুতি নিন', isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)', 'বাস চালক ও লাইনম্যান', isLineman ? 'lineman' : 'supervisor')}
                    className="p-2.5 rounded-2xl bg-slate-950 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-xs font-bold text-slate-200 transition active:scale-95 text-left"
                  >
                    <span>🛑 ট্রিপ ছাড়ার ক্লিয়ারেন্স ও প্রস্তুতি</span>
                  </button>
                </div>
              </div>

              {/* Live Synchronized Message & Action Log Feed for Supervisor / Lineman */}
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Radio className="w-3.5 h-3.5 text-cyan-400" />
                    <span>📢 আন্তঃসংযুক্ত লাইভ মেসেজ ও অ্যাকশন হিস্টোরি ফিড:</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                    REAL-TIME SYNC ACTIVE
                  </span>
                </div>

                <div className="space-y-1.5 bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs max-h-48 overflow-y-auto">
                  {walkieMessages.length === 0 ? (
                    <div className="text-center text-slate-500 py-3 text-xs">কোনো সাম্প্রতিক অ্যাকশন লগ নেই</div>
                  ) : (
                    walkieMessages.map(msg => {
                      const isSenderDriver = msg.sender.includes('চালক') || msg.roleType === 'driver';
                      const isSenderLineman = msg.sender.includes('লাইনম্যান') || msg.roleType === 'lineman';

                      return (
                        <div key={msg.id} className="flex justify-between items-center bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 hover:border-slate-700 transition">
                          <div className="flex items-start space-x-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border shrink-0 mt-0.5 ${
                              isSenderDriver ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                              isSenderLineman ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                              'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                            }`}>
                              {msg.sender}
                            </span>
                            <span className="text-slate-200 text-xs">{msg.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0 ml-2">{msg.time}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📷 MODAL 1: SMART DRIVING LICENSE VAULT & UPLOAD                           */}
        {/* ========================================================================= */}
        {isLicenseModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  <h3 className="font-black text-sm text-white">স্মার্ট ড্রাইভিং লাইসেন্স আপলোড</h3>
                </div>
                <button onClick={() => setIsLicenseModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-400 block font-bold mb-1">ড্রাইভিং লাইসেন্স নম্বর:</label>
                  <input
                    type="text"
                    value={driverLicense.number}
                    onChange={(e) => setDriverLicense(prev => ({ ...prev, number: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-400 block font-bold mb-1">মেয়াদ উত্তীর্ণের তারিখ (Expiry Date):</label>
                  <input
                    type="date"
                    value={driverLicense.expiryDate}
                    onChange={(e) => setDriverLicense(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-slate-950 border border-dashed border-indigo-500/50 text-center space-y-2">
                  <Upload className="w-6 h-6 text-indigo-400 mx-auto" />
                  <span className="text-slate-300 font-bold block">লাইসেন্সের স্পষ্ট ছবি আপলোড করুন</span>
                  <span className="text-[10px] text-slate-500 block">JPG, PNG বা স্মার্ট কার্ড স্ক্যান কপি</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsLicenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="button"
                  onClick={() => {
                    alert('✅ ড্রাইভিং লাইসেন্স সফলভাবে সংরক্ষিত ও বিআরটিএ ডেটাবেজে ভেরিফাই হয়েছে!');
                    setIsLicenseModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-black text-xs shadow-lg shadow-indigo-600/30"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🔄 MODAL 2: DYNAMIC AVAILABLE DRIVER & BUS ASSIGNMENT                      */}
        {/* ========================================================================= */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 max-w-lg w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-black text-sm text-white">এভেইলেবল চালক ও গাড়ি নির্বাচন পুল</h3>
                </div>
                <button onClick={() => setIsAssignModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <p className="text-slate-300 text-[11px]">
                  ড্রপডাউনে শুধুমাত্র যারা <strong>ফ্রি/উপলব্ধ (Available)</strong> আছেন তাদের নাম শো করছে (রানিং ট্রিপে থাকা চালকরা বাদ)।
                </p>

                <div className="space-y-2">
                  <label className="text-slate-400 block font-bold">চালক নির্বাচন করুন:</label>
                  {AVAILABLE_DRIVERS_POOL.map(drv => {
                    const isSelected = drv.name === assignedDriverName;
                    const isExp = drv.status === 'EXPIRED';

                    return (
                      <div
                        key={drv.id}
                        onClick={() => {
                          if (isExp) {
                            alert('⚠️ এই চালকের লাইসেন্সের মেয়াদ শেষ! অন্য চালক নির্বাচন করুন।');
                            return;
                          }
                          setAssignedDriverName(drv.name);
                          setAssignedDriverPhone(drv.phone);
                          try {
                            localStorage.setItem('gps_transit_driver_name', drv.name);
                            localStorage.setItem('gps_transit_driver_phone', drv.phone);
                            const bc = new BroadcastChannel('easytracker_fleet_realtime_channel');
                            bc.postMessage({ type: 'DRIVER_ASSIGNED', payload: { driverName: drv.name, driverPhone: drv.phone } });
                            bc.close();
                          } catch (e) {}
                          sendWalkieMessage(
                            `🔄 চালক পরিবর্তন: নতুন চালক ${drv.name} (${drv.phone}) কে বাসে দায়িত্ব দেওয়া হয়েছে`,
                            isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)',
                            'ফ্লিট সিস্টেম ও চালক',
                            isLineman ? 'lineman' : 'supervisor'
                          );
                        }}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-cyan-950/70 border-cyan-500 text-white'
                            : isExp
                            ? 'bg-rose-950/20 border-rose-500/30 text-slate-400 opacity-60'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-200'
                        }`}
                      >
                        <div>
                          <strong className="block text-xs">{drv.name} ({drv.phone})</strong>
                          <span className="text-[10px] text-slate-400 font-mono">লাইসেন্স: {drv.license} • মেয়াদ: {drv.expiry}</span>
                        </div>
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                          drv.status === 'VALID' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        }`}>
                          {drv.status === 'VALID' ? '🟢 বৈধ' : '🔴 মেয়াদোত্তীর্ণ'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-black text-xs shadow-lg shadow-cyan-600/30"
                >
                  অ্যাসাইন কনফার্ম করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🚨 MODAL 3A: DRIVER EMERGENCY SOS & RESCUE CONSOLE (NO VIDEO TO DRIVER)     */}
        {/* ========================================================================= */}
        {isDriverSosOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                  <h3 className="font-black text-sm text-white">🚨 জরুরি এক্সিডেন্ট এসওএস ও রেসকিউ</h3>
                </div>
                <button onClick={() => setIsDriverSosOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/50 space-y-2">
                <span className="font-black text-xs text-rose-300 block flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <span>জরুরি সংকেত সফলভাবে পাঠানো হয়েছে!</span>
                </span>
                <p className="text-[11px] text-slate-300">
                  আপনার বাসের লাইভ জিপিএস লোকেশন (ঢাকা-ময়মনসিংহ হাইওয়ে) এবং দুর্ঘটনার জরুরি সংকেত <strong>গাবতলী কাউন্টার, বগুড়া কাউন্টার ও প্রধান কার্যালয়ে</strong> পৌঁছেছে।
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[10.5px] text-slate-400">
                🔒 <strong>আইনি ও ইন্স্যুরেন্স সুরক্ষা:</strong> ড্যাশ-ক্যাম ব্ল্যাকবক্সের ১০ সেকেন্ডের ইমপ্যাক্ট ভিডিও সেন্ট্রাল ক্লাউড সার্ভার ও মালিকের ভল্টে নিরাপদে সংরক্ষিত হয়েছে।
              </div>

              {/* Emergency Hotline Buttons */}
              <div className="space-y-2 pt-1">
                <a
                  href="tel:999"
                  className="w-full py-3 px-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>🚨 ৯৯৯ এম্বুলেন্স ও পুলিশ জরুরি সেবা</span>
                </a>
                <a
                  href="tel:01711889900"
                  className="w-full py-2.5 px-3 rounded-2xl bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>📞 কাউন্টার ইনচার্জ ও লাইনম্যান</span>
                </a>
                <a
                  href="tel:01700000000"
                  className="w-full py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <Phone className="w-4 h-4" />
                  <span>📞 প্রধান কার্যালয় / ফ্লিট ওনার হটলাইন</span>
                </a>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setIsDriverSosOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 🚨 MODAL 3B: OWNER & SUPERVISOR CRASH ALERT WITH WATERMARKED VIDEO         */}
        {/* ========================================================================= */}
        {isCrashAlertModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-rose-500 rounded-3xl p-5 max-w-xl w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-rose-400">
                  <AlertTriangle className="w-6 h-6 animate-bounce" />
                  <h3 className="font-black text-sm text-white">🚨 জরুরি এক্সিডেন্ট ব্ল্যাকবক্স এলার্ট (4.6G Impact)</h3>
                </div>
                <button onClick={() => setIsCrashAlertModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 3-Way Notification Targets */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-emerald-500/40">
                  <span className="text-[10px] text-emerald-400 font-bold block">১. আপ কাউন্টার (গাবতলী):</span>
                  <span className="font-black text-white text-[11px]">✅ এলার্ট ও ভিডিও প্রেরিত</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-cyan-500/40">
                  <span className="text-[10px] text-cyan-400 font-bold block">২. ডাউন কাউন্টার (বগুড়া):</span>
                  <span className="font-black text-white text-[11px]">✅ রেসকিউ টিম অ্যাক্টিভ</span>
                </div>
                <div className="p-2.5 rounded-2xl bg-slate-950 border border-purple-500/40">
                  <span className="text-[10px] text-purple-400 font-bold block">৩. ফ্লিট মালিক (Master):</span>
                  <span className="font-black text-white text-[11px]">✅ ক্লাউড এভিডেন্স সেভড</span>
                </div>
              </div>

              {/* Video Player Mock with Digital Watermark */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video border border-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
                
                {/* On-Screen Watermark */}
                <div className="absolute top-2.5 left-2.5 text-[9.5px] font-mono text-emerald-400 bg-black/70 px-2 py-1 rounded border border-emerald-500/30 space-y-0.5 z-10">
                  <div>BUS: {assignedBusPlate}</div>
                  <div>SPEED: 62 KM/H | GPS: 23.7806°N, 90.3501°E</div>
                  <div>IMPACT: 4.6G CRASH SENSOR</div>
                  <div>TIME: 2026-08-26 16:15:00 UTC+6</div>
                </div>

                <div className="text-center z-10 space-y-2">
                  <div className="w-12 h-12 rounded-full bg-rose-600/80 text-white flex items-center justify-center mx-auto shadow-lg shadow-rose-600/50">
                    <Video className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-slate-200 block">১০ সেকেন্ডের অটোমেটিক ব্ল্যাকবক্স ক্র্যাশ ক্লিপ</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCrashAlertModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>
                <a
                  href="tel:999"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-rose-600/30"
                >
                  <Phone className="w-4 h-4" />
                  <span>জরুরি পুলিশ / এম্বুলেন্স (৯৯৯)</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 📋 MODAL 5: SUPERVISOR 1-CLICK GATEPASS & PASSENGER BATCH APPROVAL         */}
        {/* ========================================================================= */}
        {isGatepassApprovalModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <h3 className="font-black text-sm text-white">ডিপার্চার গেটপাস ও যাত্রী অনুমোদন</h3>
                </div>
                <button onClick={() => setIsGatepassApprovalModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                  <div className="text-white font-bold">হানিফ এন্টারপ্রাইজ Hino 1J ({assignedBusPlate})</div>
                  <div className="text-slate-400 font-mono text-[11px]">রুট: গাবতলী ➔ বগুড়া | চালক: {assignedDriverName}</div>
                </div>

                <div>
                  <label className="text-slate-300 block font-bold mb-1.5">
                    ১ম বোর্ডিং মোট যাত্রী সংখ্যা (কাউন্টার টিকিট অনুযায়ী):
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={gatepassBatchInput}
                      onChange={(e) => setGatepassBatchInput(Number(e.target.value))}
                      className="w-24 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-black text-center text-lg"
                    />
                    <span className="text-slate-400 text-xs font-mono">/ ৪০ সিট ক্যাপাসিটি</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    *১ ক্লিকেই পুরো ব্যাচ সংখ্যা চালক ও মালিকের ড্যাশবোর্ডে সিঙ্ক হয়ে যাবে।
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGatepassApprovalModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const approvedCount = Math.max(0, Math.min(40, gatepassBatchInput));
                    setOnboardPassengerCount(approvedCount);
                    try { 
                      localStorage.setItem('gps_transit_passenger_count', String(approvedCount)); 
                      const bc = new BroadcastChannel('easytracker_fleet_realtime_channel');
                      bc.postMessage({ type: 'GATEPASS_APPROVED', payload: { count: approvedCount, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } });
                      bc.close();
                    } catch (e) {}
                    const newLog = {
                      id: Date.now(),
                      location: `${staffTerminalOrBus} (১ম বোর্ডিং গেটপাস)`,
                      count: approvedCount,
                      delta: approvedCount,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    const nextLogs = [newLog, ...boardingLogs];
                    setBoardingLogs(nextLogs);
                    try { localStorage.setItem('gps_transit_boarding_logs', JSON.stringify(nextLogs)); } catch (e) {}
                    sendWalkieMessage(
                      `✅ গেটপাস অনুমোদিত! মোট যাত্রী: ${approvedCount} জন • ট্রিপ ছাড়ার ক্লিয়ারেন্স দেওয়া হলো।`,
                      isLineman ? '👨‍💼 লাইনম্যান (শফিকুল)' : '🏢 কাউন্টার ইনচার্জ (রাজ্জাক)',
                      'বাস চালক ও ওনার',
                      isLineman ? 'lineman' : 'supervisor'
                    );
                    alert(`✅ গেটপাস অনুমোদিত! ${approvedCount} জন যাত্রী সহ বাসটি টার্মিনাল ছাড়ার ক্লিয়ারেন্স পেয়েছে।`);
                    setIsGatepassApprovalModalOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition active:scale-95"
                >
                  অনুমোদন ও গেটপাস ছাড়ুন
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  const category = (selectedDevice?.category || '').toLowerCase();
  const isTruckOrCargo = category.includes('truck') || category.includes('trailer') || category.includes('pickup') || category.includes('van');

  // Combined fleet list (real commercial vehicles or full demo transit fleet)
  const combinedList = devices.some(d => (d.category || '').includes('bus') || (d.category || '').includes('truck'))
    ? devices
    : [...DEMO_TRANSIT_FLEET, ...devices.filter(d => (d.category || '').includes('motorcycle') || (d.category || '').includes('bike'))];

  // Filter fleet vehicles
  const fleetVehicles = combinedList.filter(d => {
    if (!vehicleSearch.trim()) return true;
    const q = vehicleSearch.toLowerCase();
    return d.name.toLowerCase().includes(q) || (d.attributes?.plateNumber || '').toLowerCase().includes(q);
  });

  // Calculate fleet stats
  const totalFleet = combinedList.length;
  let movingCount = 3;
  let parkedCount = 1;
  let idleCount = 1;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-5 space-y-4 select-none animate-in fade-in">
      
      {/* ========================================================================= */}
      {/* 🌟 1. AUTONEMO-STYLE CLEAN TOP BANNER & 6-KPI METRICS STRIP               */}
      {/* ========================================================================= */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className="p-2 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition"
              title="ম্যাপে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-11 h-11 rounded-2xl bg-cyan-600/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center shadow-lg shrink-0">
              {isTruckOrCargo ? <Truck className="w-6 h-6" /> : <Bus className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="font-black text-base text-white">
                  🏢 ফ্লিট ও ট্রান্সপোর্টেশন এন্টারপ্রাইজ হাব (Fleet VMS)
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  AUTONEMO ENTERPRISE
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  👔 OWNER ONLY
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                রিয়েল-টাইম ট্রিপ প্ল্যানিং, লাইভ ট্র্যাকিং, ড্রাইভার অ্যাসাইনমেন্ট, ফুয়েল ও এক্সপেন্স কন্ট্রোল এবং কমপ্লায়েন্স
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto text-xs">
            <button
              type="button"
              onClick={() => setIsNewTripModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন ট্রিপ শিডিউল</span>
            </button>

            <button
              type="button"
              onClick={() => setIsNewMgrModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>+ ম্যানেজার নিয়োগ</span>
            </button>
          </div>
        </div>

        {/* Clean 6-KPI Tiles Strip (Autonemo Style) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10.5px] font-bold">
              <span>মোট ফ্লিট বাস</span>
              <Bus className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-black text-white font-mono">{totalFleet}</span>
              <span className="text-[10px] text-slate-400 ml-1">টি গাড়ি</span>
            </div>
            <span className="text-[9.5px] text-emerald-400 font-bold mt-0.5">● {movingCount} চলমান</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10.5px] font-bold">
              <span>অ্যাক্টিভ ট্রিপ</span>
              <Route className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-black text-emerald-300 font-mono">
                {tripsList.filter(t => t.status === 'IN_TRANSIT' || t.status === 'READY').length}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">টি ট্রিপ</span>
            </div>
            <span className="text-[9.5px] text-cyan-400 font-bold mt-0.5">
              {tripsList.filter(t => t.status === 'SCHEDULED').length} টি শিডিউলড
            </span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10.5px] font-bold">
              <span>অন-ডিউটি চালক</span>
              <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-black text-purple-300 font-mono">{AVAILABLE_DRIVERS_POOL.length}</span>
              <span className="text-[10px] text-slate-400 ml-1">জন</span>
            </div>
            <span className="text-[9.5px] text-purple-400 font-bold mt-0.5">BRTA স্মার্ট ভল্ট</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10.5px] font-bold">
              <span>ডিজেল ও ফুয়েল</span>
              <Fuel className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-black text-amber-300 font-mono">
                {tripsList.reduce((acc, t) => acc + t.fuelLiters, 0)}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">লিটার</span>
            </div>
            <span className="text-[9.5px] text-amber-400 font-bold mt-0.5">গড়: ৪.৫ কিমি/লি</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10.5px] font-bold">
              <span>টিকিট রেভিনিউ</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="mt-1">
              <span className="text-base font-black text-emerald-400 font-mono truncate">
                ৳{tripsList.reduce((acc, t) => acc + (t.passengers * t.farePerSeat), 0).toLocaleString()}
              </span>
            </div>
            <span className="text-[9.5px] text-emerald-300 font-bold mt-0.5">আজকের মোট বুকিং</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400 text-[10.5px] font-bold">
              <span>কাউন্টার স্টেশন</span>
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
            </div>
            <div className="mt-1">
              <span className="text-xl font-black text-sky-300 font-mono">{managerStationsList.length}</span>
              <span className="text-[10px] text-slate-400 ml-1">টি ডিপো</span>
            </div>
            <span className="text-[9.5px] text-sky-400 font-bold mt-0.5">গেটপাস সচল</span>
          </div>
        </div>

        {/* Clean Pill Sub-Navigation Bar */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('live_radar')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'live_radar'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>🗺️ ফ্লিট ট্র্যাকিং ও রাডার</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('trip_dispatch')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'trip_dispatch'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Route className="w-4 h-4" />
            <span>📋 ট্রিপ প্ল্যানিং ও লাইভ ডিসপ্যাচ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('company_rbac')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'company_rbac'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>🏢 কোম্পানি ম্যানেজার ও ৫-টিয়ার RBAC</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('driver_performance')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'driver_performance'
                ? 'bg-purple-600 text-white border-purple-500 shadow-lg shadow-purple-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>👨‍✈️ চালক নিয়োগ ও BRTA লাইসেন্স</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('transit_counters')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'transit_counters'
                ? 'bg-sky-600 text-white border-sky-500 shadow-lg shadow-sky-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Bus className="w-4 h-4" />
            <span>🚌 বাস কাউন্টার ও ডিপার্চার গেটপাস</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('fuel_billing')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'fuel_billing'
                ? 'bg-amber-600 text-white border-amber-500 shadow-lg shadow-amber-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Fuel className="w-4 h-4" />
            <span>⛽ ফুয়েল, খরচ ও বিলিং অডিট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('compliance_vault')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'compliance_vault'
                ? 'bg-teal-600 text-white border-teal-500 shadow-lg shadow-teal-600/30'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>📄 লিগ্যাল ভল্ট ও কমপ্লায়েন্স</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 bg-slate-950 hover:bg-slate-850 text-amber-300 border-amber-500/40 shadow-sm transition active:scale-95"
            title="ফ্লিট মাইলেজ, ফুয়েল ও ট্রিপ রিপোর্টস হাব"
          >
            <BarChart3 className="w-4 h-4 text-amber-400" />
            <span>📊 ফ্লিট রিপোর্ট হাব</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🌟 2. SUBTAB: 🗺️ LIVE FLEET RADAR & VEHICLE STATUS GRID                   */}
      {/* ========================================================================= */}
      {activeSubTab === 'live_radar' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3.5 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
                <h3 className="text-sm font-black text-white">
                  📍 লাইভ ফ্লিট রাডার ও প্রতিটি গাড়ির রিয়েল-টাইম অবস্থান
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                লাইভ গতি, ইঞ্জিন স্ট্যাটাস, কাউন্টার জিওফেন্স ইনসাইড এবং ড্রাইভার যোগাযোগ
              </p>
            </div>

            <div className="flex items-center space-x-2 flex-wrap text-xs">
              <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-1.5">
                <span className="text-slate-400">মোট গাড়ি:</span>
                <span className="font-mono font-black text-cyan-300">{totalFleet} টি</span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-emerald-950/50 border border-emerald-500/40 flex items-center space-x-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold">চলমান:</span>
                <span className="font-mono font-black">{movingCount}</span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-amber-950/50 border border-amber-500/40 flex items-center space-x-1.5 text-amber-300">
                <span className="font-bold">আইডল:</span>
                <span className="font-mono font-black">{idleCount}</span>
              </div>
              <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 flex items-center space-x-1.5 text-slate-400">
                <span className="font-bold">পার্কড:</span>
                <span className="font-mono font-black">{parkedCount}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {fleetVehicles.map((device) => {
              const pos = positions[device.id];
              const isBus = (device.category || '').toLowerCase().includes('bus');
              const isTruck = (device.category || '').toLowerCase().includes('truck');
              const isAmbulance = (device.category || '').toLowerCase().includes('ambulance');

              const speedKmh = pos?.speed !== undefined 
                ? Math.round(pos.speed) 
                : (device.id === 801 ? 62 : device.id === 802 ? 58 : device.id === 803 ? 46 : device.id === 805 ? 74 : (device.id === 991 ? 42 : 36));
              
              const isMoving = speedKmh > 3;
              const isIgnitionOn = pos?.attributes?.ignition !== undefined ? !!pos.attributes.ignition : true;
              const isSelected = device.id === selectedDeviceId;

              const terminalLocation = device.attributes?.locationName || (isBus 
                ? (isMoving ? '🛣️ ঢাকা-চট্টগ্রাম এক্সপ্রেসওয়ে (রানিং)' : '🏢 গাবতলী সেন্ট্রাল বাস টার্মিনাল (কাউন্টার ইনসাইড)')
                : (isTruck 
                  ? '📦 পদ্মা সেতু এক্সপ্রেসওয়ে লিংক (রানিং)' 
                  : isAmbulance 
                  ? '🚨 শাহবাগ মোড় ইন্টারসেকশন (ইমার্জেন্সি ট্রিপ)' 
                  : (isMoving ? '🛣️ ঢাকা-ময়মনসিংহ হাইওয়ে (ইন ট্রানজিট)' : '📦 তেজগাঁও সেন্ট্রাল কার্গো ডিপো')));

              return (
                <div 
                  key={device.id}
                  className={`bg-slate-950 rounded-2xl p-3.5 border transition space-y-2.5 flex flex-col justify-between ${
                    isSelected 
                      ? 'border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/40' 
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2 min-w-0">
                        <div 
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner"
                          style={{ backgroundColor: device.attributes?.color || '#0891b2' }}
                        >
                          <VehicleIcon type={device.category} className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-black text-white truncate block">
                            {device.name}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400 font-bold">
                            {device.attributes?.plateNumber || 'ঢাকা মেট্রো'}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[9.5px] font-mono font-bold px-2 py-0.5 rounded-full border shrink-0 flex items-center space-x-1 ${
                        isMoving 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                          : isIgnitionOn 
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isMoving ? 'bg-emerald-400 animate-pulse' : isIgnitionOn ? 'bg-amber-400' : 'bg-rose-400'}`} />
                        <span>{isMoving ? `${speedKmh} km/h` : isIgnitionOn ? 'আইডল' : 'পার্কড'}</span>
                      </span>
                    </div>

                    <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-xs mt-2.5">
                      <div className="flex items-start space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] font-bold text-slate-200 leading-snug">
                          {terminalLocation}
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t border-slate-800 text-[10px]">
                        <span className="text-slate-400">ইগনিশন স্ট্যাটাস:</span>
                        <span className={`font-mono font-bold ${isIgnitionOn ? 'text-emerald-400' : 'text-slate-400'}`}>
                          {isIgnitionOn ? '🟢 ইঞ্জিন চালু (ON)' : '🔴 ইঞ্জিন বন্ধ (OFF)'}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-slate-400">নিযুক্ত চালক:</span>
                        <span className="font-bold text-indigo-300">
                          {device.attributes?.driverName || 'মোঃ আব্দুল কুদ্দুস'} ({device.attributes?.driverPhone || '01712-334455'})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center space-x-1.5 border-t border-slate-800/80 text-[10.5px]">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDeviceId(device.id);
                        setActiveTab('map');
                      }}
                      className="flex-1 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 font-bold border border-cyan-500/40 transition active:scale-95 flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3 h-3 text-cyan-400" />
                      <span>ম্যাপে লাইভ দেখুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDeviceId(device.id);
                        setActiveTab('commands');
                      }}
                      className="py-1.5 px-2.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 font-bold border border-rose-500/40 transition active:scale-95 flex items-center space-x-1"
                      title="রিমোট ইঞ্জিন কাটঅফ ও কমান্ড"
                    >
                      <Zap className="w-3 h-3 text-rose-400" />
                      <span className="hidden sm:inline">কাটঅফ</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 3. SUBTAB: 📋 AUTONEMO-STYLE TRIP PLANNING & DISPATCH CONSOLE           */}
      {/* ========================================================================= */}
      {activeSubTab === 'trip_dispatch' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Route className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm font-black text-white">
                  📋 সেন্ট্রাল ট্রিপ প্ল্যানিং, বাস শিডিউলিং ও লাইভ ডিসপ্যাচ
                </h3>
                <p className="text-[11px] text-slate-400">
                  রুট প্ল্যান, চালক ও সুপারভাইজার অ্যাসাইনমেন্ট, যাত্রী ক্যাপাসিটি এবং ডিপার্চার মনিটরিং
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsNewTripModalOpen(true)}
              className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-lg shadow-emerald-600/30 transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ নতুন ট্রিপ শিডিউল করুন</span>
            </button>
          </div>

          {/* Trips Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold text-[11px]">
                  <th className="py-2.5 px-3 min-w-[110px]">ট্রিপ আইডি</th>
                  <th className="py-2.5 px-3 min-w-[200px]">বাস ও রুট</th>
                  <th className="py-2.5 px-3 min-w-[180px]">চালক ও সুপারভাইজার</th>
                  <th className="py-2.5 px-3 text-center min-w-[130px]">যাত্রী ক্যাপাসিটি</th>
                  <th className="py-2.5 px-3 min-w-[130px]">ছাড়ার সময় ও ETA</th>
                  <th className="py-2.5 px-3 text-center min-w-[120px]">স্ট্যাটাস</th>
                  <th className="py-2.5 px-3 text-right min-w-[140px]">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tripsList.map(trip => {
                  const isFull = trip.passengers >= trip.totalSeats;
                  return (
                    <tr key={trip.id} className="hover:bg-slate-950/60 transition">
                      <td className="py-3 px-3">
                        <span className="font-mono font-black text-cyan-300 text-xs">{trip.tripNo}</span>
                        <span className="text-[10px] text-slate-500 block">আজকের ট্রিপ</span>
                      </td>

                      <td className="py-3 px-3">
                        <span className="font-black text-white text-xs block">{trip.busModel}</span>
                        <span className="text-[10.5px] font-mono text-cyan-400">{trip.busPlate}</span>
                        <span className="text-[10px] text-amber-300 block font-bold mt-0.5">🛣️ {trip.route}</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-xs">
                          <span className="text-slate-200 font-bold block">👨‍✈️ {trip.driverName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{trip.driverPhone}</span>
                          <span className="text-[10px] text-indigo-300 block mt-0.5">🎫 {trip.supervisorName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <span className="font-mono font-black text-emerald-400 text-sm">
                          {trip.passengers}
                        </span>
                        <span className="text-slate-400 text-xs"> / {trip.totalSeats} সিট</span>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                          <div 
                            className={`h-full ${isFull ? 'bg-emerald-500' : 'bg-cyan-500'}`} 
                            style={{ width: `${Math.min(100, (trip.passengers / trip.totalSeats) * 100)}%` }} 
                          />
                        </div>
                      </td>

                      <td className="py-3 px-3 text-xs">
                        <span className="text-slate-200 font-bold block">ছাড়বে: <span className="text-cyan-300 font-mono">{trip.departureTime}</span></span>
                        <span className="text-[10px] text-slate-400 block font-mono">ETA: {trip.etaTime}</span>
                        <span className="text-[10px] text-amber-400 font-mono mt-0.5 block">⛽ {trip.fuelLiters} লি ডিজেল</span>
                      </td>

                      <td className="py-3 px-3 text-center">
                        <select
                          value={trip.status}
                          onChange={(e) => handleUpdateTripStatus(trip.id, e.target.value as any)}
                          className={`text-[10.5px] font-bold px-2 py-1 rounded-xl border font-mono focus:outline-none ${
                            trip.status === 'IN_TRANSIT' ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50' :
                            trip.status === 'READY' ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50' :
                            trip.status === 'SCHEDULED' ? 'bg-indigo-950 text-indigo-300 border-indigo-500/50' :
                            trip.status === 'DELAYED' ? 'bg-rose-950 text-rose-300 border-rose-500/50' :
                            'bg-slate-900 text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="IN_TRANSIT">⚡ ইন-ট্রানজিট</option>
                          <option value="READY">🟢 ডিপার্চার রেডি</option>
                          <option value="SCHEDULED">⏱️ শিডিউলড</option>
                          <option value="DELAYED">🛑 ডিলেড / জ্যাম</option>
                          <option value="COMPLETED">✅ সম্পন্ন</option>
                        </select>
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDeviceId(801);
                              setActiveTab('map');
                            }}
                            className="px-2.5 py-1 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 text-[10.5px] font-bold flex items-center space-x-1 transition"
                            title="লাইভ ম্যাপে ট্র্যাক করুন"
                          >
                            <Eye className="w-3 h-3" />
                            <span>ট্র্যাক</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 4. SUBTAB: ⛽ FUEL, EXPENSE & BILLING CONTROL AUDIT                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'fuel_billing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <Fuel className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-black text-white">
                  ⛽ ফুয়েল অর্থনীতি, ট্রিপ খরচ ও সেন্ট্রাল বিলিং অডিট
                </h3>
                <p className="text-[11px] text-slate-400">
                  প্রতি ট্রিপের ডিজেল ব্যয়, হাইওয়ে টোল, টিকিট কালেকশন ও নিট প্রফিট মার্জিন
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert('📄 আজকের সম্পূর্ণ ফুয়েল ও এক্সপেন্স লেজার রিপোর্ট ডাউনলোড প্রস্তুত করা হচ্ছে...')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1.5 transition"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>এক্সেল / PDF এক্সপোর্ট</span>
            </button>
          </div>

          {/* Financial Overview Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">মোট টিকিট বুকিং কালেকশন:</span>
              <span className="text-xl font-black text-emerald-400 font-mono mt-1 block">
                ৳{tripsList.reduce((acc, t) => acc + (t.passengers * t.farePerSeat), 0).toLocaleString()}
              </span>
              <span className="text-[9.5px] text-emerald-400">অনলাইন + কাউন্টার টিকিট</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">মোট ডিজেল জ্বালানি খরচ:</span>
              <span className="text-xl font-black text-amber-400 font-mono mt-1 block">
                ৳{(tripsList.reduce((acc, t) => acc + t.fuelLiters, 0) * 105).toLocaleString()}
              </span>
              <span className="text-[9.5px] text-amber-300">
                {tripsList.reduce((acc, t) => acc + t.fuelLiters, 0)} লিটার @ ৳১০৫/লিটার
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-slate-400 block text-[10.5px]">হাইওয়ে টোল ও ড্রাইভার ভাতা:</span>
              <span className="text-xl font-black text-indigo-300 font-mono mt-1 block">
                ৳{tripsList.reduce((acc, t) => acc + t.tollExpense + t.driverAllowance, 0).toLocaleString()}
              </span>
              <span className="text-[9.5px] text-slate-400">পদ্মা সেতু / বঙ্গবন্ধু সেতু টোল</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/20">
              <span className="text-emerald-300 block text-[10.5px] font-bold">নিট প্রফিট মার্জিন (আজকের):</span>
              <span className="text-xl font-black text-emerald-300 font-mono mt-1 block">
                ৳{(
                  tripsList.reduce((acc, t) => acc + (t.passengers * t.farePerSeat), 0) -
                  (tripsList.reduce((acc, t) => acc + t.fuelLiters, 0) * 105) -
                  tripsList.reduce((acc, t) => acc + t.tollExpense + t.driverAllowance, 0)
                ).toLocaleString()}
              </span>
              <span className="text-[9.5px] text-emerald-400 font-bold">● লাভজনক অপারেশন</span>
            </div>
          </div>

          {/* Trip-wise Breakdown Table */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold text-[11px]">
                  <th className="py-2.5 px-3">ট্রিপ ও বাস</th>
                  <th className="py-2.5 px-3">রুট</th>
                  <th className="py-2.5 px-3 text-right">টিকিট কালেকশন</th>
                  <th className="py-2.5 px-3 text-right">ডিজেল (L)</th>
                  <th className="py-2.5 px-3 text-right">টোল ও ভাতা</th>
                  <th className="py-2.5 px-3 text-right">নিট ব্যালেন্স</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tripsList.map(trip => {
                  const revenue = trip.passengers * trip.farePerSeat;
                  const fuelCost = trip.fuelLiters * 105;
                  const otherExpense = trip.tollExpense + trip.driverAllowance;
                  const netProfit = revenue - fuelCost - otherExpense;

                  return (
                    <tr key={trip.id} className="hover:bg-slate-950/60 transition">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white block">{trip.busPlate}</span>
                        <span className="text-[10px] font-mono text-cyan-400">{trip.tripNo}</span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">{trip.route}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-emerald-400">
                        ৳{revenue.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-amber-300">
                        {trip.fuelLiters} L (৳{fuelCost.toLocaleString()})
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-indigo-300">
                        ৳{otherExpense.toLocaleString()}
                      </td>
                      <td className={`py-2.5 px-3 text-right font-mono font-black ${netProfit >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                        ৳{netProfit.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 5. OTHER EXISTING ACTIVE SUBTABS (100% PRESERVED)                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'transit_counters' && <TransitCounterManager isCustomerScoped={true} />}

      {activeSubTab === 'company_rbac' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Section 1: Company Operations Managers Provisioning Directory */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">কোম্পানি অপারেশনস ম্যানেজার ডিরেক্টরি ও প্রভিশনিং</h3>
                  <p className="text-[10.5px] text-slate-400">ফ্লিট মালিক কর্তৃক নিজস্ব পরিবহন কোম্পানির ম্যানেজার নিয়োগ ও দায়িত্ব বণ্টন</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewMgrModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-indigo-600/30 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>+ নতুন কোম্পানি ম্যানেজার নিয়োগ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {fleetManagers.map(mgr => (
                <div key={mgr.id} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 hover:border-indigo-500/40 space-y-2.5 transition">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold text-[10px] border border-indigo-500/40">
                      🏢 {mgr.company}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      ACTIVE
                    </span>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs">{mgr.name}</h4>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{mgr.base}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">লগইন আইডি: <strong className="text-white">{mgr.phone}</strong></span>
                    <span className="text-amber-300 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-500/30">PIN: {mgr.pin}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: 5-Tier Granular RBAC Permissions Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-extrabold text-sm text-white">৫-স্তরের গ্র্যানুলার রোল পারমিশন ও এক্সেস কন্ট্রোল ম্যাট্রিক্স</h3>
                  <p className="text-[10.5px] text-slate-400">ফ্লিট মালিক সেন্ট্রাল থেকে যেকোনো রোলের ক্ষমতা তাৎক্ষণিক অন/অফ করতে পারবেন</p>
                </div>
              </div>
              {matrixSaveSuccess && (
                <span className="text-xs text-emerald-300 font-bold bg-emerald-950 border border-emerald-500/50 px-3 py-1 rounded-xl animate-in fade-in">
                  ✅ পারমিশন পরিবর্তন সফলভাবে সংরক্ষিত!
                </span>
              )}
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold text-[11px]">
                    <th className="py-2.5 px-3 min-w-[220px]">সিস্টেম ফিচার ও অপারেশনাল ক্ষমতা</th>
                    <th className="py-2.5 px-2 text-center text-amber-300 min-w-[100px]">👑 ফ্লিট মালিক</th>
                    <th className="py-2.5 px-2 text-center text-indigo-300 min-w-[120px]">🏢 কোম্পানি ম্যানেজার</th>
                    <th className="py-2.5 px-2 text-center text-cyan-300 min-w-[120px]">🏢 কাউন্টার ইনচার্জ</th>
                    <th className="py-2.5 px-2 text-center text-amber-300 min-w-[120px]">🎫 বাস সুপারভাইজার</th>
                    <th className="py-2.5 px-2 text-center text-emerald-300 min-w-[100px]">👨‍✈️ বাস চালক</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {[
                    { key: 'liveTracking', title: '🗺️ লাইভ জিপিএস ট্র্যাকিং ও গতি মনিটর', desc: 'ম্যাপে রিয়েল-টাইম গতি ও অবস্থান পর্যবেক্ষণ' },
                    { key: 'engineCut', title: '🚨 রিমোট ইঞ্জিন লক / ফুয়েল কাটঅফ', desc: 'জরুরি পরিস্থিতিতে গাড়ি অচল করার ক্ষমতা' },
                    { key: 'accidentVideo', title: '📹 ব্ল্যাকবক্স এক্সিডেন্ট ভিডিও ভিউয়ার', desc: 'দুর্ঘটনার সিসিটিভি ক্লিপ ও ক্যামেরা ফুটেজ' },
                    { key: 'gatepassApproval', title: '✅ ডিপার্চার গেটপাস অনুমোদন', desc: 'টার্মিনাল থেকে ট্রিপের গেটপাস ক্লিয়ার করা' },
                    { key: 'passengerStepper', title: '👥 অনবোর্ড যাত্রী কন্ট্রোল (+১ / -১)', desc: 'হাইওয়েতে বাসের ভেতরে যাত্রী উঠা-নামা হিসাব' },
                    { key: 'fleetSetup', title: '🚌 বাস ও রুট অ্যাসাইনমেন্ট সেটআপ', desc: 'নতুন বাস ও রুট কনফিগারেশন' },
                    { key: 'driverRecruit', title: '👨‍✈️ চালক নিয়োগ ও BRTA লাইসেন্স ভল্ট', desc: 'চালক তালিকা ও স্মার্ট লাইসেন্স ভেরিফিকেশন' },
                    { key: 'billingFinance', title: '💰 সাবস্ক্রিপশন, প্রফিট/লস ও বিলিং', desc: 'কোম্পানির সেন্ট্রাল ফিনান্সিয়াল অডিট' },
                    { key: 'legalVault', title: '📄 কমপ্লায়েন্স ও ট্যাক্স টোকেন ভল্ট', desc: 'আইনি মেয়াদ ও ২-টিয়ার নবায়ন এলার্ট' }
                  ].map(perm => (
                    <tr key={perm.key} className="hover:bg-slate-950/60 transition">
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-white block">{perm.title}</span>
                        <span className="text-[10px] text-slate-400 block">{perm.desc}</span>
                      </td>
                      {(['owner', 'manager', 'counter_incharge', 'vehicle_supervisor', 'driver'] as const).map(roleKey => {
                        const isChecked = Boolean(fleetRolePermissions[roleKey]?.[perm.key]);
                        return (
                          <td key={roleKey} className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleMatrixPerm(roleKey, perm.key)}
                              className={`w-6 h-6 rounded-lg border inline-flex items-center justify-center transition active:scale-90 ${
                                isChecked
                                  ? 'bg-emerald-600 border-emerald-400 text-white shadow-sm shadow-emerald-600/30'
                                  : 'bg-slate-950 border-slate-700 text-slate-600 hover:border-slate-500'
                              }`}
                              title={isChecked ? 'অনুমোদিত (Enabled)' : 'ব্লকড (Disabled)'}
                            >
                              {isChecked ? '✓' : '✕'}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'compliance_vault' && <ComplianceDocumentVault isCustomerScoped={true} />}
      {activeSubTab === 'driver_performance' && <DriverPerformanceManager isCustomerScoped={true} />}

      {/* ========================================================================= */}
      {/* 🌟 MODAL: CREATE & DISPATCH NEW TRIP                                      */}
      {/* ========================================================================= */}
      {isNewTripModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-emerald-500/60 rounded-3xl max-w-lg w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
                  <Route className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">নতুন ট্রিপ শিডিউল ও ডিসপ্যাচ প্ল্যান</h3>
                  <p className="text-[10px] text-slate-400">বাস, চালক, সুপারভাইজার ও রুট নির্ধারণ</p>
                </div>
              </div>
              <button onClick={() => setIsNewTripModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewTrip} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">বাস নির্বাচন করুন *</label>
                  <select
                    value={newTripBusPlate}
                    onChange={(e) => setNewTripBusPlate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="ঢাকা মেট্রো-ব ১৪-৯৯০১">ঢাকা মেট্রো-ব ১৪-৯৯০১ (হানিফ Hino 1J)</option>
                    <option value="ঢাকা মেট্রো-ব ১৫-৪২৩১">ঢাকা মেট্রো-ব ১৫-৪২৩১ (শ্যামলী Scania)</option>
                    <option value="ঢাকা মেট্রো-ব ১৬-৭৭৮৮">ঢাকা মেট্রো-ব ১৬-৭৭৮৮ (এনা Universe)</option>
                    <option value="ঢাকা মেট্রো-ট ২৭-৮৫৭৮">ঢাকা মেট্রো-ট ২৭-৮৫৭৮ (Tata 1615 Cargo)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">রুট নির্বাচন *</label>
                  <input
                    type="text"
                    required
                    value={newTripRoute}
                    onChange={(e) => setNewTripRoute(e.target.value)}
                    placeholder="যেমন: গাবতলী ➔ বগুড়া"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">নিয়োজিত চালক (Driver) *</label>
                  <select
                    value={newTripDriver}
                    onChange={(e) => setNewTripDriver(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="মোঃ আব্দুল কুদ্দুস">মোঃ আব্দুল কুদ্দুস (BRTA লাইসেন্স বৈধ)</option>
                    <option value="মোঃ রফিকুল ইসলাম">মোঃ রফিকুল ইসলাম (BRTA লাইসেন্স বৈধ)</option>
                    <option value="মোঃ ফারুক হোসেন">মোঃ ফারুক হোসেন (হেভি কার্গো লাইসেন্স)</option>
                    <option value="মোঃ জসিম উদ্দিন">মোঃ জসিম উদ্দিন (ইন্টারসিটি স্পেশাল)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">অনবোর্ড সুপারভাইজার *</label>
                  <input
                    type="text"
                    required
                    value={newTripSupervisor}
                    onChange={(e) => setNewTripSupervisor(e.target.value)}
                    placeholder="যেমন: মোঃ শফিকুল আলম"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ছাড়ার সময় *</label>
                  <input
                    type="text"
                    required
                    value={newTripDeparture}
                    onChange={(e) => setNewTripDeparture(e.target.value)}
                    placeholder="১২:৩০ PM"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-cyan-300 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">জ্বালানি বরাদ্দ (L)</label>
                  <input
                    type="number"
                    value={newTripFuel}
                    onChange={(e) => setNewTripFuel(e.target.value)}
                    placeholder="65"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">সিট ভাড়া (৳)</label>
                  <input
                    type="number"
                    value={newTripFare}
                    onChange={(e) => setNewTripFare(e.target.value)}
                    placeholder="650"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-400 font-mono font-bold focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">আনুমানিক টোল বাজেট (৳)</label>
                  <input
                    type="number"
                    value={newTripToll}
                    onChange={(e) => setNewTripToll(e.target.value)}
                    placeholder="1450"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">চালক ট্রিপ ভাতা (৳)</label>
                  <input
                    type="number"
                    value={newTripAllowance}
                    onChange={(e) => setNewTripAllowance(e.target.value)}
                    placeholder="1200"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewTripModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-black text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ট্রিপ শিডিউল সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🌟 MODAL: FLEET OWNER'S NEW COMPANY MANAGER PROVISION                     */}
      {/* ========================================================================= */}
      {isNewMgrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-indigo-500/60 rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">নতুন কোম্পানি ম্যানেজার নিয়োগ ও সেটআপ</h3>
                  <p className="text-[10px] text-slate-400">ফ্লিট মালিক কর্তৃক সেন্ট্রাল প্রভিশনিং</p>
                </div>
              </div>
              <button onClick={() => setIsNewMgrModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewManager} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">ম্যানেজারের পুরো নাম *</label>
                <input
                  type="text"
                  required
                  value={newMgrName}
                  onChange={(e) => setNewMgrName(e.target.value)}
                  placeholder="যেমন: মোঃ শামীম ওসমান"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">মোবাইল নম্বর (লগইন আইডি) *</label>
                  <input
                    type="text"
                    required
                    value={newMgrPhone}
                    onChange={(e) => setNewMgrPhone(e.target.value)}
                    placeholder="01710-001122"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-300 block mb-1">৪-ডিজিট সিকিউরিটি PIN *</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={newMgrPin}
                    onChange={(e) => setNewMgrPin(e.target.value)}
                    placeholder="5501"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-300 font-mono font-black focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">নির্ধারিত পরিবহন কোম্পানি *</label>
                <input
                  type="text"
                  value={newMgrCompany}
                  onChange={(e) => setNewMgrCompany(e.target.value)}
                  placeholder="হানিফ এন্টারপ্রাইজ"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-indigo-300 font-bold focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">হেড অফিস / ডিপো লোকেশন</label>
                <input
                  type="text"
                  value={newMgrBase}
                  onChange={(e) => setNewMgrBase(e.target.value)}
                  placeholder="যেমন: সেন্ট্রাল হেড অফিস • গাবতলী ঢাকা"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewMgrModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-lg shadow-indigo-600/30"
                >
                  ম্যানেজার অ্যাকাউন্ট তৈরি
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
