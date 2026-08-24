import React, { useState } from 'react';
import { 
  Headphones, 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Smartphone, 
  Phone, 
  FileText, 
  MessageSquare, 
  ChevronRight, 
  Sparkles,
  Zap,
  Radio,
  Power,
  Wrench,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket, TicketPriority } from '../../types/traccar';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_LOCATIONS = [
  'গুলশান সার্ভিস সেন্টার (রোড ১১, গুলশান-২, ঢাকা)',
  'মিরপুর সার্ভিস সেন্টার (মিরপুর ১০ গোলচত্বর, ঢাকা)',
  'উত্তরা সার্ভিস সেন্টার (সেক্টর ৭, ঢাকা)',
  'মতিঝিল সার্ভিস সেন্টার (বাণিজ্যিক এলাকা, ঢাকা)',
  'চট্টগ্রাম সার্ভিস সেন্টার (আগ্রাবাদ সি/এ, চট্টগ্রাম)',
  '🏠 অন-সাইট হোম সার্ভিস (আমার ঠিকানায় টেকনিশিয়ান পাঠান)'
];

const ISSUE_CATEGORIES = [
  { id: 'engine_cutoff', titleBn: '⚡ ইঞ্জিন কাটঅফ কমান্ড কাজ করছে না (রিলে ওয়্যারিং চেক)', priority: 'High' as TicketPriority },
  { id: 'location_update', titleBn: '📡 অ্যাপে লাইভ লোকেশন আপডেট হচ্ছে না / জিপিএস সিগন্যাল সমস্যা', priority: 'High' as TicketPriority },
  { id: 'offline_device', titleBn: '🔌 ট্র্যাকার বারবার অফলাইন হয়ে যাচ্ছে (পাওয়ার সাপ্লাই চেক)', priority: 'Medium' as TicketPriority },
  { id: 'sim_balance', titleBn: '📶 সিম ব্যালেন্স বা ডাটা প্যাকেজ সংক্রান্ত সমস্যা', priority: 'Medium' as TicketPriority },
  { id: 'other', titleBn: '❓ অন্যান্য সাধারণ অভিযোগ ও কারিগরি সহায়তা', priority: 'Low' as TicketPriority }
];

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    devices, 
    selectedDevice, 
    supportTickets, 
    submitSupportTicket, 
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  
  // Form State
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(selectedDevice?.id || (devices[0]?.id || 1));
  const [selectedCategory, setSelectedCategory] = useState(ISSUE_CATEGORIES[0]);
  const [preferredLocation, setPreferredLocation] = useState(SERVICE_LOCATIONS[0]);
  const [customerName, setCustomerName] = useState(user?.name || 'Customer');
  const [customerPhone, setCustomerPhone] = useState(
    selectedDevice?.attributes?.driverPhone || selectedDevice?.phone || '01700-000000'
  );
  const [issueDescription, setIssueDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [createdTicketId, setCreatedTicketId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentVehicle = devices.find(d => d.id === selectedDeviceId) || selectedDevice || devices[0];

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueDescription.trim()) {
      alert('দয়া করে সমস্যার বিস্তারিত বিবরণ লিখুন');
      return;
    }

    setIsSubmitting(true);
    try {
      const newTicket = await submitSupportTicket({
        customer: customerName.trim(),
        phone: customerPhone.trim(),
        vehicle: currentVehicle ? `${currentVehicle.name} (${currentVehicle.attributes?.plateNumber || 'No Plate'})` : 'My Vehicle',
        issue: `${selectedCategory.titleBn} — ${issueDescription.trim()}`,
        priority: selectedCategory.priority,
        preferredLocation,
        deviceId: selectedDeviceId,
        issueCategory: selectedCategory.id as any
      });

      setCreatedTicketId(newTicket.id);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsSubmitting(false);
        setIssueDescription('');
        setActiveTab('history');
      }, 1500);
    } catch (err) {
      alert('টিকিট সাবমিট করতে সমস্যা হয়েছে।');
      setIsSubmitting(false);
    }
  };

  const myTickets = supportTickets;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-600/30 border border-sky-500/40 flex items-center justify-center text-sky-400 shadow-md">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>{language === 'bn' ? 'কাস্টমার কেয়ার ও সাপোর্ট টিকিট' : 'Customer Care & Support'}</span>
                <span className="text-[9px] bg-sky-500/20 text-sky-300 font-bold px-2 py-0.2 rounded-full border border-sky-500/30">
                  ২৪/৭ হেল্পডেস্ক
                </span>
              </h3>
              <p className="text-[10.5px] text-slate-400">
                {language === 'bn' ? 'আপনার ডিভাইসের সমস্যা জানান ও লাইভ সমাধান ট্র্যাক করুন' : 'Submit complaints & track resolution'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 p-2 bg-slate-950/60 gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'create'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নতুন টিকিট সাবমিট' : 'Open Ticket'}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 rounded-xl font-extrabold text-xs flex items-center justify-center space-x-1.5 transition ${
              activeTab === 'history'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>
              {language === 'bn' ? `আমার টিকিটসমূহ (${myTickets.length})` : `My Tickets (${myTickets.length})`}
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-3.5">
          {activeTab === 'create' ? (
            /* CREATE SUPPORT TICKET FORM */
            <form onSubmit={handleTicketSubmit} className="space-y-3 text-xs">
              
              {/* Vehicle Selector */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  কোন গাড়িতে সমস্যা হচ্ছে? (Select Vehicle) *
                </label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-sky-500 focus:outline-none"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.attributes?.plateNumber || 'No Plate'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Issue Category */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সমস্যার ধরন নির্বাচন করুন (Issue Category) *
                </label>
                <div className="space-y-1.5">
                  {ISSUE_CATEGORIES.map(cat => {
                    const isSel = selectedCategory.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full p-2 rounded-xl border text-left transition flex items-center justify-between ${
                          isSel 
                            ? 'bg-sky-950/80 border-sky-500/80 text-sky-200 font-bold' 
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[11px] truncate">{cat.titleBn}</span>
                        {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Service Point & Location */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  পছন্দের সার্ভিস হাব বা অন-সাইট সাপোর্ট লোকেশন *
                </label>
                <select
                  value={preferredLocation}
                  onChange={(e) => setPreferredLocation(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold focus:border-sky-500 focus:outline-none text-[11px]"
                >
                  {SERVICE_LOCATIONS.map((loc, i) => (
                    <option key={i} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-slate-100 font-bold focus:border-sky-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] font-bold text-slate-400 block mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1.5 text-emerald-400 font-mono font-bold focus:border-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  সমস্যার বিস্তারিত বিবরণ ও নোটস লিখুন *
                </label>
                <textarea
                  rows={3}
                  required
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  placeholder="যেমন: বাইক স্টার্ট নেওয়ার পর অ্যাপে ইঞ্জিন অন দেখাচ্ছে না, বা রিলে কাজ করছে না..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-slate-200 text-xs focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs shadow-lg shadow-sky-600/30 flex items-center justify-center space-x-2 transition active:scale-95 disabled:opacity-50 mt-1"
              >
                <Send className="w-4 h-4" />
                <span>
                  {submitSuccess 
                    ? `✅ টিকিট গৃহীত হয়েছে (ID: ${createdTicketId})!` 
                    : isSubmitting 
                      ? 'সাবমিট হচ্ছে...' 
                      : 'কাস্টমার কেয়ারে টিকিট পাঠান'}
                </span>
              </button>
            </form>
          ) : (
            /* TICKET HISTORY & LIVE STATUS */
            <div className="space-y-2.5">
              {myTickets.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-950/60 rounded-2xl border border-slate-800">
                  এখনো কোনো সাপোর্ট টিকিট খোলা হয়নি।
                </div>
              ) : (
                myTickets.map(t => {
                  const isPending = t.status === 'Pending';
                  const isInProgress = t.status === 'In Progress';
                  const isResolved = t.status === 'Resolved' || t.status === 'Closed';

                  return (
                    <div 
                      key={t.id}
                      className="p-3 bg-slate-950/90 border border-slate-800 rounded-2xl space-y-2 text-xs hover:border-slate-700 transition"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1.5">
                          <span className="font-mono font-black text-sky-400 bg-sky-950 px-2 py-0.5 rounded border border-sky-800 text-[10px]">
                            {t.id}
                          </span>
                          <span className="font-extrabold text-slate-200">{t.vehicle}</span>
                        </div>

                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                          isPending 
                            ? 'bg-amber-950/80 text-amber-300 border-amber-700' 
                            : isInProgress 
                              ? 'bg-blue-950/80 text-blue-300 border-blue-700' 
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                        }`}>
                          {isPending ? '🟡 পর্যালোচনায় আছে' : isInProgress ? '🔵 সমাধান চলছে' : '🟢 সমাধানকৃত'}
                        </span>
                      </div>

                      <p className="text-[11.5px] text-slate-300 font-medium">
                        {t.issue}
                      </p>

                      <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{t.preferredLocation || 'সার্ভিস সেন্টার সাপোর্ট'}</span>
                      </div>

                      {t.agentNotes && (
                        <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 text-[10.5px] text-sky-300">
                          <span className="font-bold block text-slate-400 text-[9.5px]">👨‍🔧 সাপোর্ট টিম নোটস:</span>
                          {t.agentNotes}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
