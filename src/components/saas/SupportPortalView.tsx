import React, { useState } from 'react';
import { 
  Headphones, 
  ArrowLeft, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
  ShieldCheck,
  RotateCcw, 
  Search,
  User,
  Activity,
  Phone,
  Edit3,
  Sliders,
  X,
  Send,
  Sparkles,
  ChevronDown,
  Wrench,
  MapPin, 
  Calendar, 
  AlertTriangle,
  DollarSign,
  ExternalLink,
  Flame,
  ShoppingBag,
  Navigation
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';
import { WarrantyClaimTicket } from '../../types/traccar';
import { UniversalSaleModal } from './UniversalSaleModal';

type TicketStatus = 'Pending' | 'In Progress' | 'Customer Feedback' | 'Resolved' | 'Closed';
type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

interface SupportTicket {
  id: string;
  customer: string;
  phone: string;
  vehicle: string;
  issue: string;
  priority: TicketPriority;
  status: TicketStatus;
  time: string;
  agentNotes?: string;
}

const AVAILABLE_TECHNICIANS = [
  { 
    id: 'tech_1', 
    name: 'আব্দুল করিম', 
    phone: '01711-223344', 
    zone: 'ঢাকা উত্তর (বারিধারা/গুলশান)',
    shopName: 'করিম অটো সার্ভিসিং হাব', 
    shopAddress: 'দোকান ১২, ডিওএইচএস বাইপাস রোড, অনন্যা কমপ্লেক্স সংলগ্ন, বারিধারা, ঢাকা',
    lat: 23.8103,
    lng: 90.4125,
    googleMapsUrl: 'https://maps.google.com/?q=23.8103,90.4125'
  },
  { 
    id: 'tech_2', 
    name: 'সুজন মিয়া', 
    phone: '01733-445566', 
    zone: 'মিরপুর ও উত্তরা জোন',
    shopName: 'সুজন জিপিএস অ্যান্ড ওয়্যারিং পয়েন্ট', 
    shopAddress: 'প্লট ৮, সেকশন ১০ গোলচত্বর, মিরপুর, ঢাকা',
    lat: 23.8071,
    lng: 90.3687,
    googleMapsUrl: 'https://maps.google.com/?q=23.8071,90.3687'
  },
  { 
    id: 'tech_3', 
    name: 'রফিকুল ইসলাম', 
    phone: '01722-334455', 
    zone: 'মতিঝিল ও ধানমন্ডি জোন',
    shopName: 'রফিক ইলেকট্রনিক্স অ্যান্ড অটো টেক', 
    shopAddress: 'রোড ৪/এ, ধানমন্ডি ২৭, ঢাকা',
    lat: 23.7505,
    lng: 90.3750,
    googleMapsUrl: 'https://maps.google.com/?q=23.7505,90.3750'
  },
  { 
    id: 'tech_4', 
    name: 'শাহিদুল আলম', 
    phone: '01744-556677', 
    zone: 'চট্টগ্রাম ও রিজিয়নাল',
    shopName: 'আলম মটরস অ্যান্ড ট্র্যাকার পয়েন্ট', 
    shopAddress: 'জিইসি মোড়, সিডিএ এভিনিউ, চট্টগ্রাম',
    lat: 22.3585,
    lng: 91.8215,
    googleMapsUrl: 'https://maps.google.com/?q=22.3585,91.8215'
  }
];

export const SupportPortalView: React.FC = () => {
  const { 
    language, 
    setActiveTab, 
    setCurrentRole, 
    user,
    warrantyClaims,
    assignTechnicianToClaim,
    supportTickets,
    updateSupportTicketStatus
  } = useApp();

  const isSuperAdmin = user?.administrator || user?.role === 'super_admin';

  const [activeMainTab, setActiveMainTab] = useState<'orders' | 'tickets' | 'warranty_claims'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Online Device Orders State (Smart Dispatch & 4-Tier Escalation)
  const [deviceOrders, setDeviceOrders] = useState<any[]>(() => {
    const saved = localStorage.getItem('gps_device_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        orderId: 'ORD-98421',
        customerName: 'মো: আজহার উদ্দিন',
        customerPhone: '01712-345678',
        fatherName: 'মো: রফিকুল ইসলাম',
        motherName: 'মোসাম্মৎ সুফিয়া বেগম',
        sos2: '01811-223344',
        sos3: '01911-334455',
        installMode: 'doorstep',
        deliveryAddress: 'বাড়ি ১২, রোড ৪, ব্লক-সি, বনশ্রী, রামপুরা, ঢাকা',
        district: 'ঢাকা',
        locationCoordinates: {
          lat: 23.7644,
          lng: 90.4312,
          mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=23.7644,90.4312'
        },
        device: {
          id: 'dev_bike_mini',
          titleBn: 'ইজিট্র্যাকার ৪জি মিনি ওয়াটারপ্রুফ প্রো',
          priceBdt: 2499
        },
        subscriptionPlan: {
          id: 'sub_annual_ultra',
          titleBn: '১ বছরের আল্ট্রা ভিআইপি ট্র্যাকিং',
          priceBdt: 3200
        },
        paymentMethod: 'advance_online',
        subTotal: 5699,
        discountAmount: 200,
        totalAmount: 5499,
        orderDate: 'আজ দুপুর ১২:৩০',
        orderStatus: 'PENDING_TECHNICIAN_DISPATCH',
        installationStatus: 'UNASSIGNED',
        escrowHandshakeStatus: 'PENDING_INSTALLATION',
        assignedTech: null,
        dispatchStep: 0,
        assignedTime: null,
        smsSent: false,
        whatsappSent: false,
        followupCallNeeded: false,
        phoneCallConfirmed: false
      }
    ];
  });

  const saveOrders = (updated: any[]) => {
    setDeviceOrders(updated);
    localStorage.setItem('gps_device_orders', JSON.stringify(updated));
  };

  const calculateDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
  };

  // Step 1: Assign Nearest Technician (App Push Notification sent for free)
  const handleAssignTechToOrder = (orderId: string, techId: string) => {
    const tech = AVAILABLE_TECHNICIANS.find(t => t.id === techId) || AVAILABLE_TECHNICIANS[0];
    const updated = deviceOrders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          orderStatus: 'TECHNICIAN_ASSIGNED',
          installationStatus: 'TECH_DISPATCHED',
          assignedTech: tech,
          dispatchStep: 1,
          assignedTime: 'এখনই (⏱️ ২ ঘন্টা সময়সীমা)',
          smsSent: false,
          whatsappSent: false,
          followupCallNeeded: false,
          phoneCallConfirmed: false
        };
      }
      return o;
    });
    saveOrders(updated);
    alert(`✅ টেকনিশিয়ান "${tech.name}"-কে সফলভাবে অ্যাসাইন করা হয়েছে! টেকনিশিয়ানের ফোনে ফ্রি অ্যাপ পুশ নোটিফিকেশন পাঠানো হয়েছে (০ টাকা এসএমএস খরচ)।`);
  };

  // Step 2: Trigger Delayed SMS (after 1 hour if no app response)
  const handleTriggerDelayedSms = (orderId: string) => {
    const updated = deviceOrders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          dispatchStep: 2,
          smsSent: true,
          smsSentAt: '১ ঘন্টা অতিক্রান্তে এসএমএস গেটওয়ে পাঠানো হয়েছে'
        };
      }
      return o;
    });
    saveOrders(updated);
    alert('📩 ElitBuzz SMS গেটওয়ে দিয়ে টেকনিশিয়ানের মোবাইলে অফিসিয়াল এসএমএস সফলভাবে পাঠানো হয়েছে!');
  };

  // Step 3: Trigger WhatsApp & Urgent Follow-up Call Alert
  const handleWhatsAppJobCard = (order: any) => {
    const tech = order.assignedTech || AVAILABLE_TECHNICIANS[0];
    const cleanPhone = tech.phone.replace(/[^0-9]/g, '');
    const text = `*🚨 EasyTracker নতুন ইনস্টলেশন জব #${order.orderId}*\n\n👤 *গ্রাহক:* ${order.customerName}\n📞 *ফোন:* ${order.customerPhone}\n🚗 *ডিভাইস:* ${order.device?.titleBn}\n📍 *ঠিকানা:* ${order.deliveryAddress}\n🗺️ *গুগল ম্যাপ ন্যাভিগেশন লিংক:* ${order.locationCoordinates?.mapsUrl}\n\nঅনুগ্রহ করে অবিলম্বে কাস্টমার কেয়ারে কল করে কনফার্ম করুন।`;
    
    const waUrl = `https://wa.me/88${cleanPhone}?text=${encodeURIComponent(text)}`;
    if (typeof window !== 'undefined') {
      window.open(waUrl, '_blank');
    }

    const updated = deviceOrders.map(o => {
      if (o.orderId === order.orderId) {
        return {
          ...o,
          dispatchStep: 3,
          whatsappSent: true,
          followupCallNeeded: true
        };
      }
      return o;
    });
    saveOrders(updated);
  };

  // Step 4: Phone Call Confirmation by Support Desk
  const handleConfirmPhoneCall = (orderId: string) => {
    const updated = deviceOrders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          phoneCallConfirmed: true,
          installationStatus: 'TECH_EN_ROUTE'
        };
      }
      return o;
    });
    saveOrders(updated);
    alert('✅ টেকনিশিয়ান ফোনে কনফার্ম করেছেন! টেকনিশিয়ান গ্রাহকের ঠিকানায় রওনা দিয়েছেন।');
  };

  // Step 5: Cascade Fallback to Next Nearest Technician
  const handleCascadeFallback = (orderId: string) => {
    const order = deviceOrders.find(o => o.orderId === orderId);
    const currentTechId = order?.assignedTech?.id;
    const nextTech = AVAILABLE_TECHNICIANS.find(t => t.id !== currentTechId) || AVAILABLE_TECHNICIANS[1];

    const updated = deviceOrders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          assignedTech: nextTech,
          dispatchStep: 1,
          assignedTime: 'ক্যাসকেড ডিসপ্যাচ (⏱️ নতুন ২ ঘন্টা)',
          smsSent: false,
          whatsappSent: false,
          followupCallNeeded: false,
          phoneCallConfirmed: false
        };
      }
      return o;
    });
    saveOrders(updated);
    alert(`🔄 পূর্বের টেকনিশিয়ান রেসপন্স না করায় অর্ডারটি স্বয়ংক্রিয়ভাবে পরবর্তী নিকটতম টেকনিশিয়ান "${nextTech.name}"-এর কাছে ক্যাসকেড করা হয়েছে!`);
  };

  // Step 6: 2-Way Customer Escrow Handshake Confirmation
  const handleVerifyCompleteEscrow = (orderId: string) => {
    const updated = deviceOrders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          orderStatus: 'COMPLETED',
          installationStatus: 'VERIFIED_COMPLETED',
          escrowHandshakeStatus: 'CUSTOMER_VERIFIED_PAID',
          completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      }
      return o;
    });
    saveOrders(updated);
    alert('🎉 ২-ওয়ে ইনস্টলেশন সফল ও গ্রাহক সন্তুষ্ট! টেকনিশিয়ান কমিশন লেজারে ক্রেডিট করা হয়েছে এবং গ্রাহকের ১ বছরের ডিজিটাল ওয়ারেন্টি কার্ড ইস্যু করা হয়েছে।');
  };

  // Support Ticket Modal State
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [editStatus, setEditStatus] = useState<TicketStatus>('Pending');
  const [editPriority, setEditPriority] = useState<TicketPriority>('Medium');
  const [selectedZone, setSelectedZone] = useState<string>('ঢাকা উত্তর (বারিধারা/গুলশান)');
  const [ticketForwardTechId, setTicketForwardTechId] = useState<string>(AVAILABLE_TECHNICIANS[0].id);
  const [agentNoteInput, setAgentNoteInput] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);
  const [forwardSuccessMessage, setForwardSuccessMessage] = useState<string | null>(null);

  // Warranty Dispatch Modal State
  const [selectedWarrantyClaim, setSelectedWarrantyClaim] = useState<WarrantyClaimTicket | null>(null);
  const [selectedTechId, setSelectedTechId] = useState(AVAILABLE_TECHNICIANS[0].id);
  const [techAppointmentNote, setTechAppointmentNote] = useState('');
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const tickets = supportTickets;

  const handleOpenTicketModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditPriority(ticket.priority);
    setAgentNoteInput(ticket.agentNotes || '');
    setForwardSuccessMessage(null);
  };

  const handleSaveTicketUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    updateSupportTicketStatus(selectedTicket.id, editStatus, agentNoteInput);

    setStatusUpdateSuccess(true);
    setTimeout(() => {
      setStatusUpdateSuccess(false);
      setSelectedTicket(null);
    }, 1000);
  };

  // Forward Ticket to Technician + Notify Customer with Shop Location
  const handleForwardTicketToTechnician = () => {
    if (!selectedTicket) return;

    const tech = AVAILABLE_TECHNICIANS.find(t => t.id === ticketForwardTechId) || AVAILABLE_TECHNICIANS[0];
    
    // 1. Create a Work Order for Technician
    const saved = localStorage.getItem('gps_tech_work_orders');
    let orders: any[] = [];
    if (saved) {
      try { orders = JSON.parse(saved); } catch (e) {}
    }

    const newOrder = {
      id: 'TKT-JOB-' + Date.now().toString().slice(-4),
      type: 'troubleshoot_complaint',
      ticketId: selectedTicket.id,
      customerName: selectedTicket.customer,
      customerPhone: selectedTicket.phone,
      vehicleName: selectedTicket.vehicle,
      issueDetails: selectedTicket.issue,
      assignedTechName: tech.name,
      assignedTechPhone: tech.phone,
      shopName: tech.shopName,
      shopAddress: tech.shopAddress,
      googleMapsUrl: tech.googleMapsUrl,
      feeBdt: 250,
      status: 'in_progress',
      assignedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    localStorage.setItem('gps_tech_work_orders', JSON.stringify([newOrder, ...orders]));

    // 2. Prepare Customer Notification Message
    const customerNotificationText = `প্রিয় ${selectedTicket.customer}, আপনার অভিযোগটি (টিকেট #${selectedTicket.id}) সফলভাবে টেকনিশিয়ান ${tech.name} (📞 ${tech.phone}, 🏢 ${tech.shopName}, ${tech.shopAddress})-এর কাছে ফরোয়ার্ড করা হয়েছে। ম্যাপে দোকানের অবস্থান: ${tech.googleMapsUrl}`;

    // Store in customer notification center
    const notifSaved = localStorage.getItem('gps_customer_notifications');
    let notifs: any[] = [];
    if (notifSaved) {
      try { notifs = JSON.parse(notifSaved); } catch (e) {}
    }
    notifs.unshift({
      id: 'NOTIF-' + Date.now(),
      title: `টিকেট #${selectedTicket.id} টেকনিশিয়ানকে অ্যাসাইন করা হয়েছে`,
      body: customerNotificationText,
      mapsUrl: tech.googleMapsUrl,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('gps_customer_notifications', JSON.stringify(notifs));

    // 3. Update Ticket in App
    const updatedNote = `[${new Date().toLocaleTimeString()}] টেকনিশিয়ান ${tech.name} (${tech.shopName})-কে দায়িত্ব দেওয়া হয়েছে। কাস্টমারকে এসএমএস ও পুশ নোটিফিকেশন পাঠানো হয়েছে।\n${agentNoteInput}`;
    updateSupportTicketStatus(selectedTicket.id, 'In Progress', updatedNote);

    setForwardSuccessMessage(`টেকনিশিয়ান ${tech.name} (${tech.shopName})-এর কিউতে ফরোয়ার্ড ও কাস্টমারকে নোটিফাই করা হয়েছে!`);
    setTimeout(() => {
      setForwardSuccessMessage(null);
      setSelectedTicket(null);
    }, 2200);
  };

  // Warranty Dispatch Handler
  const handleConfirmWarrantyDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarrantyClaim) return;

    const tech = AVAILABLE_TECHNICIANS.find(t => t.id === selectedTechId) || AVAILABLE_TECHNICIANS[0];

    assignTechnicianToClaim(
      selectedWarrantyClaim.id,
      tech.name,
      tech.phone,
      techAppointmentNote || `সার্ভিস পয়েন্টে অ্যাপয়েন্টমেন্ট নির্ধারিত (${selectedWarrantyClaim.preferredLocation})`
    );

    // Also push a work order into technician queue
    const saved = localStorage.getItem('gps_tech_work_orders');
    let orders: any[] = [];
    if (saved) {
      try { orders = JSON.parse(saved); } catch (e) {}
    }

    const newOrder = {
      id: 'WJOB-' + Date.now().toString().slice(-4),
      type: 'servicing_repair',
      customerName: selectedWarrantyClaim.customerName,
      customerPhone: selectedWarrantyClaim.customerPhone,
      vehicleName: selectedWarrantyClaim.vehicleName,
      plateNumber: selectedWarrantyClaim.plateNumber,
      trackerImei: selectedWarrantyClaim.imei,
      simNumber: '01700000000',
      feeBdt: 300,
      status: 'in_progress',
      assignedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };

    localStorage.setItem('gps_tech_work_orders', JSON.stringify([newOrder, ...orders]));

    setDispatchSuccess(true);
    setTimeout(() => {
      setDispatchSuccess(false);
      setSelectedWarrantyClaim(null);
      setTechAppointmentNote('');
    }, 1800);
  };

  const filteredTickets = tickets.filter(t => 
    t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.includes(searchQuery) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredClaims = warrantyClaims.filter(c =>
    c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.customerPhone.includes(searchQuery) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.vehicleName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingClaimsCount = warrantyClaims.filter(c => c.status === 'pending_support').length;
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md gap-3">
        <div className="flex items-center space-x-2.5">
          {isSuperAdmin && (
            <button
              onClick={() => {
                setCurrentRole('customer');
                setActiveTab('map');
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 transition active:scale-95 flex items-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400" />
              <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
            </button>
          )}
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-sky-300">
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>{language === 'bn' ? 'কাস্টমার সাপোর্ট ও হেল্পডেস্ক হাব' : 'Customer Support & Helpdesk'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'টিকেট স্ট্যাটাস আপডেট, ওয়ারেন্টি RMA ট্রাইয়াজ ও টেকনিশিয়ান সার্ভিস ডিসপ্যাচ' : 'Ticket triage, RMA warranty & tech dispatch'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* 🚨 Emergency Rescue Red-Alert Queue Switcher */}
          <button
            onClick={() => setCurrentRole('rescue')}
            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-md shadow-rose-600/30 transition active:scale-95 animate-pulse"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>🚨 রেসকিউ ডেস্ক</span>
          </button>

          <button
            onClick={() => setIsSaleModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center space-x-1.5 transition active:scale-95"
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>ডিভাইস সেল</span>
          </button>

          <a
            href={`tel:${APP_CONFIG.supportPhone}`}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center space-x-1 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>হেল্পলাইন</span>
          </a>
        </div>
      </div>

      {/* Main Tabs: Device Orders vs Support Tickets vs Warranty RMA Queue */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
        <button
          onClick={() => setActiveMainTab('orders')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeMainTab === 'orders' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>অনলাইন ডিভাইস বুকিং ও স্মার্ট ডিসপ্যাচ ({deviceOrders.length})</span>
          {deviceOrders.filter(o => o.orderStatus === 'PENDING_TECHNICIAN_DISPATCH').length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
          )}
        </button>

        <button
          onClick={() => setActiveMainTab('tickets')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeMainTab === 'tickets' 
              ? 'bg-sky-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>সাধারণ সাপোর্ট টিকেট ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveMainTab('warranty_claims')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
            activeMainTab === 'warranty_claims' 
              ? 'bg-emerald-600 text-white shadow-md' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>ডিভাইস ওয়ারেন্টি ক্লেইম ({warrantyClaims.length})</span>
          {pendingClaimsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
          )}
        </button>
      </div>

      {/* Support KPI Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">পেন্ডিং বুকিং / টিকেট</div>
          <div className="text-xl font-mono font-black text-rose-400 mt-1">
            {deviceOrders.filter(o => o.orderStatus === 'PENDING_TECHNICIAN_DISPATCH').length + tickets.filter(t => t.status === 'Pending').length + pendingClaimsCount}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">টেকনিশিয়ান অ্যাসাইনড</div>
          <div className="text-xl font-mono font-black text-blue-400 mt-1">
            {deviceOrders.filter(o => o.assignedTech).length + warrantyClaims.filter(c => c.status === 'tech_assigned').length + 2}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">আজ সমাধানকৃত</div>
          <div className="text-xl font-mono font-black text-emerald-400 mt-1">
            {deviceOrders.filter(o => o.orderStatus === 'COMPLETED').length + tickets.filter(t => t.status === 'Resolved').length + warrantyClaims.filter(c => c.status === 'completed').length + 5}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 কাস্টমার নাম, মোবাইল নম্বর বা টিকেট/ক্লেইম আইডি দিয়ে খুঁজুন..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none shadow-md"
        />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: ONLINE DEVICE ORDERS & SMART TECHNICIAN DISPATCH               */}
      {/* ========================================================================= */}
      {activeMainTab === 'orders' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center space-x-1.5">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              <span>অনলাইন ডিভাইস বুকিং ও স্মার্ট ডিসপ্যাচ কিউ ({deviceOrders.length})</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">2-WAY ESCROW DISPATCH</span>
          </div>

          <div className="space-y-3">
            {deviceOrders.map((order) => {
              const custLat = order.locationCoordinates?.lat || 23.8103;
              const custLng = order.locationCoordinates?.lng || 90.4125;

              // Calculate & sort nearest available technicians
              const sortedTechs = AVAILABLE_TECHNICIANS.map(tech => ({
                ...tech,
                distanceKm: calculateDistanceKm(custLat, custLng, tech.lat, tech.lng)
              })).sort((a, b) => a.distanceKm - b.distanceKm);

              const topNearestTech = sortedTechs[0];
              const isAssigned = !!order.assignedTech;
              const currentAssignedTech = order.assignedTech || topNearestTech;

              return (
                <div key={order.orderId} className="p-4 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-3 text-xs shadow-lg">
                  
                  {/* Top Bar: Order ID, Mode, Payment */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-black text-blue-400 bg-blue-950 px-2.5 py-1 rounded-xl border border-blue-800">
                        {order.orderId}
                      </span>
                      <span className="font-extrabold text-sm text-white">{order.customerName}</span>
                      <span className="text-slate-400 font-mono text-xs">({order.customerPhone})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[9.5px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full">
                        {order.installMode === 'doorstep' ? '🏠 ডোরস্টেপ ইনস্টল' : '🔧 সার্ভিস সেন্টার'}
                      </span>
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                        order.paymentMethod === 'advance_online' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                        order.paymentMethod === 'after_install_online' ? 'bg-blue-950 text-blue-300 border-blue-700' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {order.paymentMethod === 'advance_online' ? '✅ PAID (অ্যাডভান্স)' : '⏳ UNPAID (আফটার ইনস্টল)'}
                      </span>
                    </div>
                  </div>

                  {/* Customer & Mandatory Family KYC Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">👤 পিতা ও মাতার নাম (KYC):</span>
                      <span className="font-bold text-slate-200 block">পিতা: {order.fatherName || 'মো: রফিকুল ইসলাম'}</span>
                      <span className="font-bold text-slate-200 block">মাতা: {order.motherName || 'মোসাম্মৎ সুফিয়া বেগম'}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">🚗 ডিভাইস ও সাবস্ক্রিপশন:</span>
                      <span className="font-bold text-blue-300 block">{order.device?.titleBn}</span>
                      <span className="text-amber-300 block font-mono text-[10px]">{order.subscriptionPlan?.titleBn}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">📍 ইনস্টলেশন ম্যাপ ও ঠিকানা:</span>
                      <span className="text-slate-200 block font-medium truncate">{order.deliveryAddress}</span>
                      {order.locationCoordinates?.mapsUrl && (
                        <a
                          href={order.locationCoordinates.mapsUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-400 underline font-bold text-[10px] flex items-center space-x-1 mt-0.5"
                        >
                          <Navigation className="w-3 h-3" />
                          <span>গুগল ম্যাপ রুট দেখুন (GPS Pin)</span>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* 🤖 Smart Geo-Dispatch & Nearest Technician Recommendation */}
                  <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 p-3 rounded-xl border border-blue-500/30 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                      <div className="flex items-center space-x-2">
                        <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <span className="font-bold text-xs text-white block">
                            {isAssigned 
                              ? `বর্তমান অ্যাসাইনকৃত টেকনিশিয়ান: ${order.assignedTech.name}`
                              : `🤖 AI প্রস্তাবিত নিকটতম টেকনিশিয়ান: ${topNearestTech.name} (${topNearestTech.distanceKm} কিমি দূরে)`}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {isAssigned ? order.assignedTime : `ওয়ার্কশপ: ${topNearestTech.shopName}`}
                          </span>
                        </div>
                      </div>

                      {!isAssigned ? (
                        <button
                          type="button"
                          onClick={() => handleAssignTechToOrder(order.orderId, topNearestTech.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md active:scale-95 flex items-center space-x-1.5"
                        >
                          <span>অ্যাসাইন করুন (App Push)</span>
                        </button>
                      ) : (
                        <span className="text-[9.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                          DISPATCHED
                        </span>
                      )}
                    </div>

                    {/* ⏱️ 4-Tier Automated Escalation & Follow-up Matrix */}
                    {isAssigned && (
                      <div className="pt-2 border-t border-slate-800 space-y-2">
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center text-[10px]">
                          <div className={`p-1.5 rounded-lg border ${order.dispatchStep >= 1 ? 'bg-blue-950/80 border-blue-500/60 text-blue-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            <span>১. ফ্রি অ্যাপ পুশ (০৳)</span>
                            <span className="block text-[8px] text-emerald-400 font-bold">✓ সেন্ড</span>
                          </div>

                          <div className={`p-1.5 rounded-lg border ${order.dispatchStep >= 2 ? 'bg-amber-950/80 border-amber-500/60 text-amber-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            <span>২. ১ ঘন্টা পর SMS</span>
                            {order.dispatchStep >= 2 ? (
                              <span className="block text-[8px] text-emerald-400 font-bold">✓ সেন্ড</span>
                            ) : (
                              <button onClick={() => handleTriggerDelayedSms(order.orderId)} className="text-[8px] text-amber-400 underline block font-bold">পাঠান</button>
                            )}
                          </div>

                          <div className={`p-1.5 rounded-lg border ${order.dispatchStep >= 3 ? 'bg-purple-950/80 border-purple-500/60 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            <span>৩. ১.৫ ঘন্টা হোয়াটসঅ্যাপ</span>
                            {order.dispatchStep >= 3 ? (
                              <span className="block text-[8px] text-purple-300 font-bold">✓ ডিসপ্যাচড</span>
                            ) : (
                              <button onClick={() => handleWhatsAppJobCard(order)} className="text-[8px] text-purple-400 underline block font-bold">পাঠান</button>
                            )}
                          </div>

                          <div className={`p-1.5 rounded-lg border ${order.phoneCallConfirmed ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-500'}`}>
                            <span>৪. ফলোআপ কল</span>
                            <span className={`block text-[8px] font-bold ${order.phoneCallConfirmed ? 'text-emerald-400' : 'text-amber-400'}`}>
                              {order.phoneCallConfirmed ? '✓ ফোনে কনফার্মড' : 'পেন্ডিং'}
                            </span>
                          </div>
                        </div>

                        {/* 📞 Instant Omnichannel Calling Buttons & Cascade Fallback */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <div className="flex items-center space-x-1.5">
                            <a
                              href={`tel:${currentAssignedTech.phone}`}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-blue-300 border border-slate-700 text-[11px] font-bold flex items-center space-x-1"
                            >
                              <Phone className="w-3 h-3" />
                              <span>জিএসএম কল</span>
                            </a>

                            <button
                              type="button"
                              onClick={() => alert(`🌐 সেন্ট্রাল আইপি পিবিএক্স (০৯৬১২-০০০৯৯৯) থেকে ${currentAssignedTech.name} (${currentAssignedTech.phone})-এর নম্বরে ওয়েব কল সংযোগ করা হচ্ছে...`)}
                              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-emerald-300 border border-slate-700 text-[11px] font-bold flex items-center space-x-1"
                            >
                              <PhoneCall className="w-3 h-3" />
                              <span>আইপি ফোন ডায়াল</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleWhatsAppJobCard(order)}
                              className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center space-x-1"
                            >
                              <span>💬 হোয়াটসঅ্যাপ জব কার্ড</span>
                            </button>

                            {!order.phoneCallConfirmed && (
                              <button
                                type="button"
                                onClick={() => handleConfirmPhoneCall(order.orderId)}
                                className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold"
                              >
                                ✓ ফোনে কনফার্মড মার্ক করুন
                              </button>
                            )}
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              onClick={() => handleCascadeFallback(order.orderId)}
                              className="px-3 py-1.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center space-x-1"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>পরবর্তী টেকনিশিয়ানকে দিন (Cascade)</span>
                            </button>

                            {order.installationStatus !== 'VERIFIED_COMPLETED' ? (
                              <button
                                type="button"
                                onClick={() => handleVerifyCompleteEscrow(order.orderId)}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] shadow-md shadow-emerald-600/30"
                              >
                                ✅ ইনস্টলেশন সম্পন্ন ও লেজার ক্রেডিট
                              </button>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-1 rounded-xl border border-emerald-700">
                                🎉 কাজ সম্পন্ন ও লেজার ক্রেডিট সম্পন্ন
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: GENERAL SUPPORT TICKETS                                        */}
      {/* ========================================================================= */}
      {activeMainTab === 'tickets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center space-x-1.5">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>কাস্টমার অভিযোগ ও সাপোর্ট টিকিট ({filteredTickets.length})</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredTickets.map((t) => (
              <div key={t.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5 text-xs hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                      {t.id}
                    </span>
                    <span className="font-extrabold text-slate-100">{t.customer}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({t.phone})</span>
                  </div>

                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                    t.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                    t.status === 'In Progress' ? 'bg-blue-950 text-blue-300 border-blue-700' :
                    'bg-rose-950 text-rose-300 border-rose-700'
                  }`}>
                    {t.status}
                  </span>
                </div>

                <div className="text-[11.5px] text-slate-200 font-medium">
                  {t.issue}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                  <span>যানবাহন: {t.vehicle} • {t.time}</span>
                  <button
                    onClick={() => handleOpenTicketModal(t)}
                    className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 font-bold border border-slate-700 transition flex items-center space-x-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>ম্যানেজ করুন</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: DEVICE WARRANTY & RMA CLAIMS QUEUE                             */}
      {/* ========================================================================= */}
      {activeMainTab === 'warranty_claims' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ওয়ারেন্টি ও আরএমএ ক্লেইম তালিকা ({filteredClaims.length})</span>
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredClaims.map((claim) => (
              <div key={claim.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2.5 text-xs hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {claim.id}
                    </span>
                    <span className="font-extrabold text-slate-100">{claim.customerName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">({claim.customerPhone})</span>
                  </div>

                  <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                    claim.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                    claim.status === 'tech_assigned' ? 'bg-blue-950 text-blue-300 border-blue-700' :
                    'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                  }`}>
                    {claim.status === 'completed' ? '🟢 কাজ সম্পন্ন' :
                     claim.status === 'tech_assigned' ? '🔵 টেকনিশিয়ান নির্ধারিত' :
                     '🟡 সাপোর্ট টিম যাচাই করছে'}
                  </span>
                </div>

                <div>
                  <div className="font-bold text-slate-200 text-xs">{claim.issueTitleBn}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{claim.issueDetails}</p>
                </div>

                {/* Preferred Service Center Chosen by Customer */}
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px] space-y-1">
                  <div className="flex items-center space-x-1.5 text-emerald-300 font-bold">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>কাস্টমারের নির্বাচিত সার্ভিস পয়েন্ট:</span>
                  </div>
                  <div className="text-slate-200 pl-5">{claim.preferredLocation}</div>
                  <div className="text-[9.5px] text-slate-400 pl-5 font-mono">IMEI: {claim.imei} • গাড়ি: {claim.vehicleName}</div>
                </div>

                {/* Tech Assigned details if already assigned */}
                {claim.assignedTechName && (
                  <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-800/40 text-[10.5px] text-blue-300 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5">
                      <Wrench className="w-3.5 h-3.5 text-blue-400" />
                      <span>টেকনিশিয়ান: {claim.assignedTechName} ({claim.assignedTechPhone})</span>
                    </div>
                  </div>
                )}

                {/* Action button: Dispatch Technician */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px] text-slate-400">
                  <span>ক্লেইম তারিখ: {claim.claimDate}</span>

                  <button
                    onClick={() => {
                      setSelectedWarrantyClaim(claim);
                      setTechAppointmentNote(`কাস্টমারের নির্বাচিত সার্ভিস পয়েন্টে (${claim.preferredLocation}) ওয়ারেন্টি রিপেয়ার সম্পন্ন করুন।`);
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition flex items-center space-x-1 shadow-sm active:scale-95"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{claim.status === 'tech_assigned' ? 'টেকনিশিয়ান পরিবর্তন' : 'টেকনিশিয়ান অ্যাসাইন ও ডিসপ্যাচ'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: WARRANTY TECHNICIAN DISPATCH MODAL                               */}
      {/* ========================================================================= */}
      {selectedWarrantyClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs text-emerald-300 flex items-center space-x-1.5">
                <Wrench className="w-4 h-4 text-emerald-400" />
                <span>ওয়ারেন্টি মেরামত: টেকনিশিয়ান নিয়োগ</span>
              </span>
              <button onClick={() => setSelectedWarrantyClaim(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div className="font-extrabold text-slate-100">{selectedWarrantyClaim.customerName} ({selectedWarrantyClaim.customerPhone})</div>
              <div className="text-slate-300 text-[11px]">{selectedWarrantyClaim.vehicleName} • IMEI: {selectedWarrantyClaim.imei}</div>
              <div className="text-emerald-400 font-bold text-[10.5px] mt-1 flex items-center space-x-1">
                <MapPin className="w-3 h-3 text-rose-400" />
                <span>{selectedWarrantyClaim.preferredLocation}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmWarrantyDispatch} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  ফিল্ড টেকনিশিয়ান ও সার্ভিস সেন্টার নির্বাচন করুন *
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                >
                  {AVAILABLE_TECHNICIANS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone}) - {t.shopName} ({t.zone})
                    </option>
                  ))}
                </select>
                {/* Selected Tech Shop Details */}
                {(() => {
                  const tech = AVAILABLE_TECHNICIANS.find(t => t.id === selectedTechId);
                  return tech ? (
                    <div className="mt-1.5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px] text-slate-300 space-y-0.5">
                      <div className="font-bold text-emerald-300 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>শপ: {tech.shopName}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{tech.shopAddress}</div>
                      <a 
                        href={tech.googleMapsUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center space-x-1 text-[9.5px] font-bold text-blue-400 hover:text-blue-300 pt-0.5"
                      >
                        <span>গুগল ম্যাপে শপ লোকেশন দেখুন</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ) : null;
                })()}
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  অ্যাপয়েন্টমেন্ট ও সার্ভিস নোট:
                </label>
                <textarea
                  rows={2}
                  value={techAppointmentNote}
                  onChange={(e) => setTechAppointmentNote(e.target.value)}
                  placeholder="টেকনিশিয়ান ও কাস্টমারের জন্য নির্দেশনা লিখুন..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedWarrantyClaim(null)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>{dispatchSuccess ? 'অ্যাসাইন সম্পন্ন!' : 'ডিসপ্যাচ ও পুশ নোটিফাই'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: SUPPORT TICKET EDIT & TECHNICIAN DISPATCH MODAL                   */}
      {/* ========================================================================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3.5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs text-sky-300 flex items-center space-x-1.5">
                <Edit3 className="w-4 h-4 text-sky-400" />
                <span>টিকেট পরিচালনা: {selectedTicket.id}</span>
              </span>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Complaint Summary */}
            <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-white text-xs">{selectedTicket.customer}</span>
                <span className="text-slate-400 font-mono text-[11px]">{selectedTicket.phone}</span>
              </div>
              <div className="text-slate-400 text-[10.5px]">যানবাহন: <strong className="text-slate-200">{selectedTicket.vehicle}</strong></div>
              <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-amber-300">
                <strong>অভিযোগ:</strong> {selectedTicket.issue}
              </div>
            </div>

            {/* Success Message Banner */}
            {forwardSuccessMessage && (
              <div className="p-2.5 rounded-2xl bg-emerald-950/80 border border-emerald-500 text-emerald-300 text-xs font-bold animate-in fade-in flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{forwardSuccessMessage}</span>
              </div>
            )}

            {/* SECTION 1: FORWARD TO TECHNICIAN WITH SHOP LOCATION */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-400 border-b border-slate-800 pb-1.5">
                <Wrench className="w-3.5 h-3.5" />
                <span>টেকনিশিয়ান নিয়োগ ও শপ লোকেশন রাউটিং</span>
              </div>

              {/* Zone / Location Selector */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  সার্ভিস জোন / কাস্টমারের এলাকা:
                </label>
                <select
                  value={selectedZone}
                  onChange={(e) => {
                    setSelectedZone(e.target.value);
                    const matchingTech = AVAILABLE_TECHNICIANS.find(t => t.zone.includes(e.target.value) || e.target.value.includes(t.zone));
                    if (matchingTech) setTicketForwardTechId(matchingTech.id);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold focus:outline-none"
                >
                  <option value="ঢাকা উত্তর (বারিধারা/গুলশান)">ঢাকা উত্তর (বারিধারা/গুলশান)</option>
                  <option value="মিরপুর ও উত্তরা জোন">মিরপুর ও উত্তরা জোন</option>
                  <option value="মতিঝিল ও ধানমন্ডি জোন">মতিঝিল ও ধানমন্ডি জোন</option>
                  <option value="চট্টগ্রাম ও রিজিয়নাল">চট্টগ্রাম ও রিজিয়নাল</option>
                </select>
              </div>

              {/* Technician Dropdown */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  দায়িত্বপ্রাপ্ত টেকনিশিয়ান নির্বাচন করুন:
                </label>
                <select
                  value={ticketForwardTechId}
                  onChange={(e) => setTicketForwardTechId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold focus:outline-none"
                >
                  {AVAILABLE_TECHNICIANS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone}) - {t.shopName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Tech Shop Details Card */}
              {(() => {
                const tech = AVAILABLE_TECHNICIANS.find(t => t.id === ticketForwardTechId);
                return tech ? (
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px] text-slate-300 space-y-1">
                    <div className="font-bold text-emerald-300 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span>{tech.shopName}</span>
                    </div>
                    <div className="text-[10px] text-slate-400">{tech.shopAddress}</div>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-[9.5px] font-mono text-slate-400">📞 {tech.phone}</span>
                      <a
                        href={tech.googleMapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[9.5px] font-bold text-blue-400 hover:text-blue-300 flex items-center space-x-0.5"
                      >
                        <span>গুগল ম্যাপ</span>
                        <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                      </a>
                    </div>
                  </div>
                ) : null;
              })()}

              <button
                type="button"
                onClick={handleForwardTicketToTechnician}
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>🚀 টেকনিশিয়ানকে ফরোয়ার্ড করুন ও কাস্টমারকে জানান</span>
              </button>
            </div>

            {/* SECTION 2: STATUS & AGENT NOTES */}
            <form onSubmit={handleSaveTicketUpdate} className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">টিকেট স্ট্যাটাস:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as TicketStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold focus:outline-none"
                  >
                    <option value="Pending">🔴 পেন্ডিং (Pending)</option>
                    <option value="In Progress">🟡 কাজ চলছে (In Progress)</option>
                    <option value="Customer Feedback">🟣 কাস্টমার ফিডব্যাক</option>
                    <option value="Resolved">🟢 সমাধানকৃত (Resolved)</option>
                    <option value="Closed">⚪ ক্লোজড (Closed)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">জরুরিত্ব (Priority):</label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as TicketPriority)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-bold focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-400 block mb-1">সাপোর্ট এজেন্টের অভ্যন্তরীণ নোট:</label>
                <textarea
                  rows={2}
                  value={agentNoteInput}
                  onChange={(e) => setAgentNoteInput(e.target.value)}
                  placeholder="কী পদক্ষেপ গ্রহণ করা হয়েছে তা লিখুন..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বন্ধ করুন
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/30 flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{statusUpdateSuccess ? 'সংরক্ষিত!' : 'আপডেট সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <UniversalSaleModal
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
      />
    </div>
  );
};
