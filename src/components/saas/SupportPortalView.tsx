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
  Phone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { APP_CONFIG } from '../../config/appConfig';

export const SupportPortalView: React.FC = () => {
  const { language, setActiveTab, setCurrentRole, devices } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [tickets, setTickets] = useState([
    { id: 'TKT-1082', customer: 'Rakib Hasan', phone: '01719-887766', vehicle: 'Bajaj Pulsar 150', issue: 'ইঞ্জিন কাটঅফ কমান্ড কাজ করছে না', priority: 'High', status: 'Pending', time: '10 min ago' },
    { id: 'TKT-1081', customer: 'Jahangir Alam', phone: '01822-112233', vehicle: 'Toyota Axio', issue: 'অ্যাপে লাইভ লোকেশন আপডেট হচ্ছে না', priority: 'Medium', status: 'In Progress', time: '25 min ago' },
    { id: 'TKT-1080', customer: 'Shahadat Hossain', phone: '01933-445566', vehicle: 'Tata 1615 Truck', issue: 'রিফান্ড আবেদন (ডিভাইস আনইনস্টল রিকোয়েস্ট)', priority: 'Urgent', status: 'Pending', time: '1 hour ago' }
  ]);

  const handleResolveTicket = (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));
  };

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
              {language === 'bn' ? 'টিকেট সমাধান, রিফান্ড ডেস্ক ও রিমোট ডায়াগনস্টিক' : 'Ticket resolution, refund desk & remote diagnostics'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <a
            href={`tel:${APP_CONFIG.supportPhone}`}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center space-x-1"
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
            {tickets.filter(t => t.status === 'In Progress').length}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl text-center">
          <div className="text-[10px] text-slate-400 font-bold">আজ সমাধানকৃত</div>
          <div className="text-xl font-mono font-black text-emerald-400 mt-1">
            {tickets.filter(t => t.status === 'Resolved').length + 8}
          </div>
        </div>
      </div>

      {/* Support Ticket Queue */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-300 flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4 text-sky-400" />
            <span>কাস্টমার সাপোর্ট ও অভিযোগ তালিকা ({tickets.length})</span>
          </span>
        </div>

        <div className="space-y-2.5">
          {tickets.map((t) => (
            <div key={t.id} className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[11px] font-bold text-sky-300 bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
                    {t.id}
                  </span>
                  <span className="font-extrabold text-slate-100">{t.customer}</span>
                  <span className="text-slate-400 font-mono text-[10px]">({t.phone})</span>
                </div>

                <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                  t.status === 'Resolved' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                  t.status === 'In Progress' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                  'bg-rose-950 text-rose-300 border-rose-700'
                }`}>
                  {t.status === 'Resolved' ? 'সমাধানকৃত' : t.status === 'In Progress' ? 'কাজ চলছে' : 'পেন্ডিং'}
                </span>
              </div>

              <p className="text-slate-300 text-xs">
                ⚠️ <strong className="text-slate-200">সমস্যা:</strong> {t.issue}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800/60 text-[10px] text-slate-400">
                <span>গাড়ি: <strong className="text-slate-300">{t.vehicle}</strong> • সময়: {t.time}</span>
                {t.status !== 'Resolved' && (
                  <button
                    onClick={() => handleResolveTicket(t.id)}
                    className="px-3 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-[10px] flex items-center space-x-1 transition active:scale-95 shadow-sm"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>সমাধান মার্ক করুন</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
