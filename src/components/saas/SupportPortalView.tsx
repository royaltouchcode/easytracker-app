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
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';
import { WarrantyClaimTicket } from '../../types/traccar';

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
  { id: 'tech_1', name: 'আব্দুল করিম', phone: '01711-223344', area: 'ঢাকা সেন্ট্রাল ও গুলশান জোন' },
  { id: 'tech_2', name: 'সুজন মিয়া', phone: '01733-445566', area: 'মিরপুর ও উত্তরা জোন' },
  { id: 'tech_3', name: 'রফিকুল ইসলাম', phone: '01722-334455', area: 'মতিঝিল ও পুরান ঢাকা' },
  { id: 'tech_4', name: 'শাহিদুল আলম', phone: '01744-556677', area: 'চট্টগ্রাম ও রিজিয়নাল' }
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

  const [activeMainTab, setActiveMainTab] = useState<'tickets' | 'warranty_claims'>('tickets');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Support Ticket Modal State
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [editStatus, setEditStatus] = useState<TicketStatus>('Pending');
  const [editPriority, setEditPriority] = useState<TicketPriority>('Medium');
  const [agentNoteInput, setAgentNoteInput] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

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

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
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

        <div className="flex items-center space-x-2">
          <a
            href={`tel:${APP_CONFIG.supportPhone}`}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center space-x-1 shadow-sm"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>হেল্পলাইন</span>
          </a>
        </div>
      </div>

      {/* Main Tabs: Support Tickets vs Warranty RMA Queue */}
      <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl">
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
          <span>ডিভাইস ওয়ারেন্টি ক্লেইম কিউ ({warrantyClaims.length})</span>
          {pendingClaimsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-1" />
          )}
        </button>
      </div>

      {/* Support KPI Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">পেন্ডিং ক্লেইম / টিকেট</div>
          <div className="text-xl font-mono font-black text-rose-400 mt-1">
            {tickets.filter(t => t.status === 'Pending').length + pendingClaimsCount}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">টেকনিশিয়ান অ্যাসাইনড</div>
          <div className="text-xl font-mono font-black text-blue-400 mt-1">
            {warrantyClaims.filter(c => c.status === 'tech_assigned').length + 2}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">আজ সমাধানকৃত</div>
          <div className="text-xl font-mono font-black text-emerald-400 mt-1">
            {tickets.filter(t => t.status === 'Resolved').length + warrantyClaims.filter(c => c.status === 'completed').length + 5}
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
      {/* SECTION 1: GENERAL SUPPORT TICKETS                                        */}
      {/* ========================================================================= */}
      {activeMainTab === 'tickets' ? (
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
      ) : (
        /* ========================================================================= */
        /* SECTION 2: DEVICE WARRANTY & RMA CLAIMS QUEUE                             */
        /* ========================================================================= */
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
                  ফিল্ড টেকনিশিয়ান নির্বাচন করুন *
                </label>
                <select
                  value={selectedTechId}
                  onChange={(e) => setSelectedTechId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-emerald-500 focus:outline-none"
                >
                  {AVAILABLE_TECHNICIANS.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.phone}) - {t.area}
                    </option>
                  ))}
                </select>
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
      {/* MODAL 2: SUPPORT TICKET EDIT MODAL                                        */}
      {/* ========================================================================= */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-sm w-full p-4 shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-extrabold text-xs text-sky-300 flex items-center space-x-1.5">
                <Edit3 className="w-4 h-4 text-sky-400" />
                <span>টিকেট পরিচালনা: {selectedTicket.id}</span>
              </span>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTicketUpdate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">টিকেট স্ট্যাটাস:</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as TicketStatus)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white font-bold focus:outline-none"
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
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-white font-bold focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-400 block mb-1">সাপোর্ট এজেন্টের নোট:</label>
                <textarea
                  rows={3}
                  value={agentNoteInput}
                  onChange={(e) => setAgentNoteInput(e.target.value)}
                  placeholder="কী পদক্ষেপ গ্রহণ করা হয়েছে তা লিখুন..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{statusUpdateSuccess ? 'সংরক্ষিত হয়েছে!' : 'আপডেট সেভ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
