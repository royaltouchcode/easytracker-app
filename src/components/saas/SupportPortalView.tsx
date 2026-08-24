import React, { useState } from 'react';
import { 
  Headphones, 
  ArrowLeft, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  ShieldAlert, 
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
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';

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

export const SupportPortalView: React.FC = () => {
  const { language, setActiveTab, setCurrentRole, devices } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [editStatus, setEditStatus] = useState<TicketStatus>('Pending');
  const [editPriority, setEditPriority] = useState<TicketPriority>('Medium');
  const [agentNoteInput, setAgentNoteInput] = useState('');
  const [statusUpdateSuccess, setStatusUpdateSuccess] = useState(false);

  const [tickets, setTickets] = useState<SupportTicket[]>([
    { 
      id: 'TKT-1082', 
      customer: 'Rakib Hasan', 
      phone: '01719-887766', 
      vehicle: 'Bajaj Pulsar 150', 
      issue: 'ইঞ্জিন কাটঅফ কমান্ড কাজ করছে না (রিলে তার চেক রিকোয়েস্ট)', 
      priority: 'High', 
      status: 'Pending', 
      time: '10 min ago',
      agentNotes: 'কাস্টমারের সাথে কথা বলা হয়েছে, টেকনিশিয়ান ভিজিট শিডিউল করা দরকার।'
    },
    { 
      id: 'TKT-1081', 
      customer: 'Jahangir Alam', 
      phone: '01822-112233', 
      vehicle: 'Toyota Axio', 
      issue: 'অ্যাপে লাইভ লোকেশন আপডেট হচ্ছে না (সিম ব্যালেন্স চেক)', 
      priority: 'Medium', 
      status: 'In Progress', 
      time: '25 min ago',
      agentNotes: 'সিমের ডাটা প্যাকেজ রিনিউ করা হয়েছে, সিগন্যাল মনিটরিং চলছে।'
    },
    { 
      id: 'TKT-1080', 
      customer: 'Shahadat Hossain', 
      phone: '01933-445566', 
      vehicle: 'Tata 1615 Truck', 
      issue: 'রিফান্ড আবেদন (ডিভাইস আনইনস্টল রিকোয়েস্ট)', 
      priority: 'Urgent', 
      status: 'Pending', 
      time: '1 hour ago',
      agentNotes: 'রিফান্ড পলিসি অনুযায়ী ৩ দিনের ভেরিফিকেশন চলছে।'
    }
  ]);

  const handleOpenTicketModal = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setEditStatus(ticket.status);
    setEditPriority(ticket.priority);
    setAgentNoteInput(ticket.agentNotes || '');
  };

  const handleSaveTicketUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;

    setTickets(prev => prev.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: editStatus,
          priority: editPriority,
          agentNotes: agentNoteInput
        };
      }
      return t;
    }));

    setStatusUpdateSuccess(true);
    setTimeout(() => {
      setStatusUpdateSuccess(false);
      setSelectedTicket(null);
    }, 1000);
  };

  const handleQuickStatusChange = (id: string, newStatus: TicketStatus) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const filteredTickets = tickets.filter(t => 
    t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.phone.includes(searchQuery) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.vehicle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-2xl shadow-md">
        <div className="flex items-center space-x-2.5">
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
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-sky-300">
              <Headphones className="w-4 h-4 text-sky-400" />
              <span>{language === 'bn' ? 'কাস্টমার সাপোর্ট ও হেল্পডেস্ক হাব' : 'Customer Support & Helpdesk'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'টিকেট স্ট্যাটাস আপডেট, রিফান্ড ম্যানেজমেন্ট ও নোটস' : 'Ticket status update, refund desk & agent notes'}
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

      {/* Support KPI Stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">পেন্ডিং টিকেট</div>
          <div className="text-xl font-mono font-black text-rose-400 mt-1">
            {tickets.filter(t => t.status === 'Pending').length}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">প্রসেসিং চলছে</div>
          <div className="text-xl font-mono font-black text-amber-400 mt-1">
            {tickets.filter(t => t.status === 'In Progress' || t.status === 'Customer Feedback').length}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">আজ সমাধানকৃত</div>
          <div className="text-xl font-mono font-black text-emerald-400 mt-1">
            {tickets.filter(t => t.status === 'Resolved' || t.status === 'Closed').length + 8}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="🔍 কাস্টমার নাম, মোবাইল নম্বর বা টিকেট আইডি দিয়ে খুঁজুন..."
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none shadow-md"
        />
      </div>

      {/* Support Ticket Queue */}
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
                  <span className="font-mono text-[11px] font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    {t.id}
                  </span>
                  <span className="font-extrabold text-slate-100">{t.customer}</span>
                  <span className="text-slate-400 font-mono text-[10.5px]">({t.phone})</span>
                </div>

                {/* Priority Tag */}
                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                  t.priority === 'Urgent' ? 'bg-rose-600 text-white' :
                  t.priority === 'High' ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40' :
                  'bg-slate-800 text-slate-400'
                }`}>
                  {t.priority}
                </span>
              </div>

              <p className="text-slate-300 text-xs">
                ⚠️ <strong className="text-slate-200">অভিযোগ:</strong> {t.issue}
              </p>

              {t.agentNotes && (
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-[10.5px] text-slate-400 flex items-center space-x-1.5">
                  <span className="text-sky-400 font-bold">নোট:</span>
                  <span>{t.agentNotes}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                <span>গাড়ি: <strong className="text-slate-300">{t.vehicle}</strong> • সময়: {t.time}</span>

                {/* Interactive Status Changer Dropdown */}
                <div className="flex items-center space-x-1.5">
                  <select
                    value={t.status}
                    onChange={(e) => handleQuickStatusChange(t.id, e.target.value as TicketStatus)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                      t.status === 'Resolved' || t.status === 'Closed' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                      t.status === 'In Progress' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                      t.status === 'Customer Feedback' ? 'bg-purple-950 text-purple-300 border-purple-700' :
                      'bg-rose-950 text-rose-300 border-rose-700'
                    }`}
                  >
                    <option value="Pending" className="bg-slate-900 text-rose-300">🔴 পেন্ডিং (Pending)</option>
                    <option value="In Progress" className="bg-slate-900 text-amber-300">🟡 কাজ চলছে (In Progress)</option>
                    <option value="Customer Feedback" className="bg-slate-900 text-purple-300">🟣 কাস্টমার ফিডব্যাক</option>
                    <option value="Resolved" className="bg-slate-900 text-emerald-300">🟢 সমাধানকৃত (Resolved)</option>
                    <option value="Closed" className="bg-slate-900 text-slate-400">⚪ বন্ধ (Closed)</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => handleOpenTicketModal(t)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                    title="নোট ও বিস্তারিত আপডেট"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ticket Details & Agent Notes Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                  {selectedTicket.id}
                </span>
                <span className="font-extrabold text-sm text-slate-100">টিকেট আপডেট ও ইন্টারনাল নোট</span>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTicketUpdate} className="p-4 space-y-3.5 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-400 block mb-1">কাস্টমার ও অভিযোগ:</label>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
                  <div className="font-bold text-slate-100">{selectedTicket.customer} ({selectedTicket.phone})</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{selectedTicket.issue}</div>
                </div>
              </div>

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
                <label className="text-[10.5px] font-bold text-slate-400 block mb-1">সাপোর্ট এজেন্টের ইন্টারনাল নোট:</label>
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
