import React, { useState } from 'react';
import { 
  Receipt, 
  X, 
  Wrench, 
  Package, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  Banknote, 
  MapPin, 
  Smartphone, 
  ChevronRight, 
  Sparkles, 
  AlertCircle,
  FileText,
  Send,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RateCardService, SparePartItem, PaidJobCard, SelectedServiceItem, SelectedSparePartItem } from '../../types/traccar';

interface PaidServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_CENTERS = [
  'গুলশান সার্ভিস সেন্টার (রোড ১১, গুলশান-২, ঢাকা)',
  'মিরপুর সার্ভিস সেন্টার (মিরপুর ১০ গোলচত্বর, ঢাকা)',
  'উত্তরা সার্ভিস সেন্টার (সেক্টর ৭, ঢাকা)',
  'মতিঝিল সার্ভিস সেন্টার (সি/এ, ঢাকা)',
  'চট্টগ্রাম সার্ভিস সেন্টার (আগ্রাবাদ সি/এ, চট্টগ্রাম)',
  '🏠 অন-সাইট হোম সার্ভিস (আমার ঠিকানায় টেকনিশিয়ান ভিজিট)'
];

export const PaidServiceBookingModal: React.FC<PaidServiceBookingModalProps> = ({ isOpen, onClose }) => {
  const {
    user,
    devices,
    selectedDevice,
    rateCardServices,
    sparePartsCatalog,
    paidJobCards,
    platformCommissionPercent,
    createPaidJobCard,
    confirmJobCardByCustomer,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rate_card' | 'create_job' | 'my_jobs'>('rate_card');

  // Form State
  const [selectedDeviceId, setSelectedDeviceId] = useState<number>(selectedDevice?.id || (devices[0]?.id || 1));
  const [serviceCenterName, setServiceCenterName] = useState(SERVICE_CENTERS[0]);
  const [selectedServices, setSelectedServices] = useState<SelectedServiceItem[]>([
    { serviceId: rateCardServices[0]?.id || 'srv_reinstall', nameBn: rateCardServices[0]?.nameBn || 'ডিভাইস স্থানান্তর ও রি-ইনস্টলেশন', price: rateCardServices[0]?.basePrice || 350 }
  ]);
  const [selectedParts, setSelectedParts] = useState<SelectedSparePartItem[]>([]);
  const [customerName, setCustomerName] = useState(user?.name || 'Customer');
  const [customerPhone, setCustomerPhone] = useState(
    selectedDevice?.attributes?.driverPhone || selectedDevice?.phone || '01700-000000'
  );
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdJobCard, setCreatedJobCard] = useState<PaidJobCard | null>(null);

  if (!isOpen) return null;

  const currentVehicle = devices.find(d => d.id === selectedDeviceId) || selectedDevice || devices[0];

  // Calculate estimated total
  const estimatedTotal = selectedServices.reduce((sum, s) => sum + s.price, 0) +
                         selectedParts.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);

  // Toggle service selection
  const handleToggleService = (srv: RateCardService) => {
    if (selectedServices.some(s => s.serviceId === srv.id)) {
      setSelectedServices(prev => prev.filter(s => s.serviceId !== srv.id));
    } else {
      setSelectedServices(prev => [...prev, { serviceId: srv.id, nameBn: srv.nameBn, price: srv.basePrice }]);
    }
  };

  // Toggle part selection
  const handleTogglePart = (part: SparePartItem) => {
    if (selectedParts.some(p => p.partId === part.id)) {
      setSelectedParts(prev => prev.filter(p => p.partId !== part.id));
    } else {
      setSelectedParts(prev => [...prev, { partId: part.id, nameBn: part.nameBn, unitPrice: part.unitPrice, quantity: 1 }]);
    }
  };

  const handleCreateJobCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedServices.length === 0 && selectedParts.length === 0) {
      alert('দয়া করে অন্তত একটি সার্ভিস বা পার্টস সিলেক্ট করুন');
      return;
    }

    setIsSubmitting(true);
    try {
      const card = await createPaidJobCard({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        vehicleName: currentVehicle ? currentVehicle.name : 'My Vehicle',
        plateNumber: currentVehicle?.attributes?.plateNumber,
        deviceId: selectedDeviceId,
        serviceCenterName,
        selectedServices,
        selectedSpareParts: selectedParts,
        platformCommissionPercent,
        paymentMethod: 'unpaid',
        customerNote: customerNote.trim()
      });

      setCreatedJobCard(card);
      setIsSubmitting(false);
      setActiveTab('my_jobs');
    } catch (err) {
      alert('জব-কার্ড তৈরি করতে সমস্যা হয়েছে');
      setIsSubmitting(false);
    }
  };

  const myJobCards = paidJobCards;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-md">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>পেইড সার্ভিস ও রেট-কার্ড হাব</span>
                <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.2 rounded-full border border-amber-500/30">
                  স্বচ্ছ বিলিং
                </span>
              </h3>
              <p className="text-[10.5px] text-slate-400">
                ওয়ারেন্টি-বহির্ভূত মেইনটেন্যান্স রেট, জব-কার্ড ও ১-ট্যাপ বিল কনফার্মেশন
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
        <div className="flex border-b border-slate-800 p-2 bg-slate-950/60 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('rate_card')}
            className={`flex-1 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center space-x-1 transition ${
              activeTab === 'rate_card'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>রেট-কার্ড প্রাইসিং</span>
          </button>

          <button
            onClick={() => setActiveTab('create_job')}
            className={`flex-1 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center space-x-1 transition ${
              activeTab === 'create_job'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>জব-কার্ড বুকিং</span>
          </button>

          <button
            onClick={() => setActiveTab('my_jobs')}
            className={`flex-1 py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center space-x-1 transition ${
              activeTab === 'my_jobs'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>আমার জব ({myJobCards.length})</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3.5">
          
          {/* ========================================================================= */}
          {/* TAB 1: TRANSPARENT RATE CARD & PARTS PRICING                              */}
          {/* ========================================================================= */}
          {activeTab === 'rate_card' && (
            <div className="space-y-3 text-xs">
              <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl p-2.5 text-[11px] text-amber-200 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <b>কোম্পানি নির্ধারিত ফিক্সড রেট:</b> সার্ভিস সেন্টারে কোনো অতিরিক্ত চার্জ নেওয়া যাবে না। প্রতি কাজের জন্য ৩০ দিনের ডিজিটাল গ্যারান্টি দেওয়া হয়।
                </span>
              </div>

              {/* Labor & Services Rate Card */}
              <div className="space-y-1.5">
                <h4 className="font-extrabold text-xs text-slate-200 flex items-center space-x-1.5">
                  <Wrench className="w-3.5 h-3.5 text-amber-400" />
                  <span>সার্ভিসিং ও ইনস্টলেশন রেট-কার্ড:</span>
                </h4>

                <div className="space-y-1.5">
                  {rateCardServices.map(s => (
                    <div key={s.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-100 block text-[11.5px]">{s.nameBn}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">🛡️ {s.warrantyDays > 0 ? `${s.warrantyDays} দিন সার্ভিস গ্যারান্টি` : 'অন-সাইট ফি'}</span>
                      </div>
                      <span className="font-mono font-black text-amber-400 text-xs bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        ৳ {s.basePrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Spare Parts Catalog */}
              <div className="space-y-1.5 pt-2">
                <h4 className="font-extrabold text-xs text-slate-200 flex items-center space-x-1.5">
                  <Package className="w-3.5 h-3.5 text-cyan-400" />
                  <span>স্পেয়ার পার্টস ও হার্ডওয়্যার মূল্য তালিকা:</span>
                </h4>

                <div className="space-y-1.5">
                  {sparePartsCatalog.map(p => (
                    <div key={p.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-slate-100 block text-[11.5px]">{p.nameBn}</span>
                        <span className="text-[10px] text-cyan-400 font-mono">SKU: {p.partCode} • 🛡️ {p.warrantyDays} দিন পার্টস ওয়ারেন্টি</span>
                      </div>
                      <span className="font-mono font-black text-cyan-400 text-xs bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                        ৳ {p.unitPrice}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('create_job')}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-600/30 transition active:scale-95 mt-2"
              >
                <FileText className="w-4 h-4" />
                <span>সার্ভিস সেন্টারের জন্য জব-কার্ড তৈরি করুন</span>
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: CREATE JOB-CARD FORM                                               */}
          {/* ========================================================================= */}
          {activeTab === 'create_job' && (
            <form onSubmit={handleCreateJobCard} className="space-y-3 text-xs">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">যানবাহন নির্বাচন *</label>
                <select
                  value={selectedDeviceId}
                  onChange={(e) => setSelectedDeviceId(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-bold focus:border-amber-500 focus:outline-none"
                >
                  {devices.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.attributes?.plateNumber || 'No Plate'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">সার্ভিস পয়েন্ট লোকেশন *</label>
                <select
                  value={serviceCenterName}
                  onChange={(e) => setServiceCenterName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-emerald-300 font-bold focus:border-amber-500 focus:outline-none text-[11px]"
                >
                  {SERVICE_CENTERS.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Service Selection Checkboxes */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  প্রয়োজনীয় সার্ভিস নির্বাচন করুন (একাধিক সিলেক্ট করতে পারেন):
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {rateCardServices.map(srv => {
                    const isSelected = selectedServices.some(s => s.serviceId === srv.id);
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        onClick={() => handleToggleService(srv)}
                        className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition ${
                          isSelected ? 'bg-amber-950/80 border-amber-500 text-amber-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-[11px] truncate">{srv.nameBn}</span>
                        <span className="font-mono text-xs font-black shrink-0 ml-2">৳{srv.basePrice}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spare Parts Selection Checkboxes */}
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  কোনো স্পেয়ার পার্টস প্রয়োজন হলে সিলেক্ট করুন (ঐচ্ছিক):
                </label>
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {sparePartsCatalog.map(part => {
                    const isSelected = selectedParts.some(p => p.partId === part.id);
                    return (
                      <button
                        key={part.id}
                        type="button"
                        onClick={() => handleTogglePart(part)}
                        className={`w-full p-2 rounded-xl border text-left flex items-center justify-between transition ${
                          isSelected ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 font-bold' : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="text-[11px] truncate">{part.nameBn}</span>
                        <span className="font-mono text-xs font-black shrink-0 ml-2">৳{part.unitPrice}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estimated Total Bar */}
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex justify-between items-center">
                <span className="text-slate-400 font-bold text-[11px]">আনুমানিক মোট বিল:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">৳ {estimatedTotal}</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-lg shadow-amber-600/30 transition active:scale-95 disabled:opacity-50"
              >
                <FileText className="w-4 h-4" />
                <span>{isSubmitting ? 'তৈরি হচ্ছে...' : 'ডিজিটাল জব-কার্ড তৈরি করুন'}</span>
              </button>
            </form>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MY JOB CARDS & 1-TAP CONFIRMATION                                  */}
          {/* ========================================================================= */}
          {activeTab === 'my_jobs' && (
            <div className="space-y-3 text-xs">
              {myJobCards.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-950 rounded-2xl border border-slate-800">
                  এখনো কোনো পেইড জব-কার্ড খোলা হয়নি।
                </div>
              ) : (
                myJobCards.map(jc => {
                  const isBillSent = jc.jobStatus === 'bill_sent';
                  const isCompleted = jc.jobStatus === 'completed';

                  return (
                    <div key={jc.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-black text-amber-400 bg-amber-950 px-2 py-0.5 rounded text-[10.5px] border border-amber-800">
                            {jc.id}
                          </span>
                          <span className="font-extrabold text-slate-200">{jc.vehicleName}</span>
                        </div>

                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                          isCompleted 
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                            : isBillSent
                              ? 'bg-amber-950 text-amber-300 border-amber-700 animate-pulse'
                              : 'bg-blue-950 text-blue-300 border-blue-700'
                        }`}>
                          {isCompleted ? '✅ সার্ভিস সম্পন্ন' : isBillSent ? '⚡ বিল কনফার্ম করুন' : '🔧 সার্ভিস চলছে'}
                        </span>
                      </div>

                      {/* Itemized Services */}
                      <div className="bg-slate-900/80 p-2 rounded-xl space-y-1 text-[11px]">
                        {jc.selectedServices.map((s, i) => (
                          <div key={i} className="flex justify-between text-slate-300">
                            <span>{s.nameBn}</span>
                            <span className="font-mono font-bold text-amber-400">৳{s.price}</span>
                          </div>
                        ))}
                        {jc.selectedSpareParts.map((p, i) => (
                          <div key={i} className="flex justify-between text-slate-300">
                            <span>{p.nameBn} (x{p.quantity})</span>
                            <span className="font-mono font-bold text-cyan-400">৳{p.unitPrice * p.quantity}</span>
                          </div>
                        ))}
                        <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-slate-100">
                          <span>মোট বিল:</span>
                          <span className="font-mono font-black text-emerald-400">৳ {jc.totalAmount}</span>
                        </div>
                      </div>

                      {/* 1-TAP CONFIRMATION BANNER (If Bill Sent by Technician) */}
                      {isBillSent && (
                        <div className="bg-gradient-to-br from-emerald-950/90 to-slate-900 border border-emerald-500/50 p-3 rounded-2xl space-y-2">
                          <div className="flex items-center space-x-1.5 text-emerald-300 font-bold text-[11px]">
                            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>টেকনিশিয়ান কাজ শেষ করেছেন! বিল যাচাই করুন ও পেমেন্ট সিলেক্ট করুন:</span>
                          </div>

                          {/* Cashless Special Incentive Banner */}
                          <div className="p-2 bg-pink-950/50 border border-pink-500/40 rounded-xl text-[10.5px] text-pink-200 flex items-center justify-between">
                            <span className="flex items-center space-x-1 font-bold">
                              <span>🎁 bKash / বাংলা কিউআর অফার:</span>
                            </span>
                            <span className="font-bold text-emerald-300 font-mono">
                              ৳৫০ ছাড় + ১৫ দিন বাড়তি গ্যারান্টি
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2 pt-1">
                            <button
                              onClick={() => confirmJobCardByCustomer(jc.id, 'cash_at_center')}
                              className="py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-[10.5px] flex flex-col items-center justify-center space-y-0.5 transition active:scale-95"
                            >
                              <div className="flex items-center space-x-1">
                                <Banknote className="w-3.5 h-3.5 text-amber-400" />
                                <span>ক্যাশ পেমেন্ট</span>
                              </div>
                              <span className="font-mono text-[10px] text-slate-400">৳ {jc.totalAmount} (রেগুলার)</span>
                            </button>

                            <button
                              onClick={() => confirmJobCardByCustomer(jc.id, 'online_bkash')}
                              className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-extrabold text-[10.5px] flex flex-col items-center justify-center space-y-0.5 shadow-md shadow-pink-600/30 transition active:scale-95 border border-pink-400"
                            >
                              <div className="flex items-center space-x-1">
                                <CreditCard className="w-3.5 h-3.5" />
                                <span>বিকাশ / বাংলা QR</span>
                              </div>
                              <span className="font-mono text-[10px] text-pink-100 font-black">
                                ৳ {Math.max(50, jc.totalAmount - 50)} (৳৫০ ছাড়)
                              </span>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* 30-DAY WARRANTY CERTIFICATE (If Completed) */}
                      {isCompleted && (
                        <div className="p-2 bg-emerald-950/60 border border-emerald-700/60 rounded-xl text-[10.5px] text-emerald-300 flex items-center justify-between">
                          <span className="flex items-center space-x-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>৩০ দিনের ডিজিটাল সার্ভিস গ্যারান্টি সক্রিয়</span>
                          </span>
                          <span className="font-mono font-bold text-amber-300">মেয়াদ: {jc.warrantyExpiryDate}</span>
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
