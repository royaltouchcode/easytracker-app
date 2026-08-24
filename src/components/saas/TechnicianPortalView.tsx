import React, { useState } from 'react';
import { 
  Wrench, 
  ArrowLeft, 
  CheckCircle2, 
  Zap, 
  Key, 
  Satellite, 
  Signal, 
  Flame, 
  Activity, 
  AlertCircle, 
  RefreshCw,
  Play,
  RotateCcw,
  Check,
  Lock,
  Clock,
  ShieldCheck,
  DollarSign,
  Smartphone,
  Gauge,
  Sliders,
  Receipt,
  Send,
  Package,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SelectedServiceItem, SelectedSparePartItem } from '../../types/traccar';

export interface TechWorkOrder {
  id: string;
  type: 'new_installation' | 'servicing_repair';
  customerName: string;
  customerPhone: string;
  vehicleName: string;
  plateNumber: string;
  trackerImei: string;
  simNumber: string;
  feeBdt: number;
  status: 'in_progress' | 'completed_pending_approval' | 'approved_paid';
  assignedDate: string;
}

export const TechnicianPortalView: React.FC = () => {
  const { 
    language, 
    setActiveTab, 
    setCurrentRole, 
    selectedDevice, 
    user,
    warrantyClaims,
    completeWarrantyClaim,
    paidJobCards,
    sendJobCardBill,
    rateCardServices,
    sparePartsCatalog,
    technicianLedgers
  } = useApp();

  const [activeTabMode, setActiveTabMode] = useState<'install_diagnostic' | 'paid_job_cards' | 'floating_ledger'>('install_diagnostic');
  const [selectedJobCardId, setSelectedJobCardId] = useState<string>('');
  const [billSentSuccessId, setBillSentSuccessId] = useState<string | null>(null);

  const isSuperAdmin = user?.administrator || user?.role === 'super_admin';

  // Work Orders Queue state
  const [workOrders, setWorkOrders] = useState<TechWorkOrder[]>(() => {
    const saved = localStorage.getItem('gps_tech_work_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      {
        id: 'JOB-801',
        type: 'servicing_repair',
        customerName: 'Mohammad Azhar',
        customerPhone: '01700-000000',
        vehicleName: 'Bajaj Avenger 160 Street',
        plateNumber: 'DHAKA METRO-LA 11-2233',
        trackerImei: '864720058291034',
        simNumber: '01700000000',
        feeBdt: 300,
        status: 'in_progress',
        assignedDate: '24 Aug 2026'
      }
    ];
  });

  const [activeJobId, setActiveJobId] = useState<string>(() => {
    const active = workOrders.find(j => j.status === 'in_progress');
    return active ? active.id : '';
  });

  // Diagnostic Test States for Active Job
  const [powerVoltage, setPowerVoltage] = useState(12.8);
  const [isAccOn, setIsAccOn] = useState(true);
  const [relayCutStatus, setRelayCutStatus] = useState<'connected' | 'cut' | 'testing'>('connected');
  const [satCount, setSatCount] = useState(15);
  const [gsmSignal, setGsmSignal] = useState(28);

  // App & Device Settings by Technician
  const [inputInitialOdo, setInputInitialOdo] = useState('12450');
  const [inputSpeedLimit, setInputSpeedLimit] = useState('60');
  const [replacementImeiInput, setReplacementImeiInput] = useState('');
  const [techReportNotes, setTechReportNotes] = useState('');

  const [checklist, setChecklist] = useState({
    hiddenPlace: true,
    fuseInstalled: true,
    relayCutTested: true,
    gpsDirectSky: true,
    simApnVerified: true,
    customerAppVerified: true
  });

  const [completeSuccess, setCompleteSuccess] = useState(false);

  const activeJob = workOrders.find(j => j.id === activeJobId && j.status === 'in_progress');

  const handleCompleteJob = () => {
    if (!activeJob) return;

    const updated = workOrders.map(j => 
      j.id === activeJob.id ? { ...j, status: 'completed_pending_approval' as const } : j
    );
    setWorkOrders(updated);
    localStorage.setItem('gps_tech_work_orders', JSON.stringify(updated));

    // Bug Fix #2: Strict AND matching — must match IMEI + vehicle + status
    // Previously OR logic could accidentally complete another customer's claim
    const matchingClaim = warrantyClaims.find(c =>
      c.status === 'tech_assigned' &&
      c.imei === activeJob.trackerImei &&
      c.vehicleName === activeJob.vehicleName
    );
    if (matchingClaim) {
      completeWarrantyClaim(
        matchingClaim.id,
        replacementImeiInput.trim() || undefined,
        techReportNotes || 'ফিল্ড টেকনিশিয়ান কর্তৃক হার্ডওয়্যার ওয়্যারিং ও ডায়াগনস্টিক সফলভাবে সম্পন্ন হয়েছে।'
      );
    }

    setCompleteSuccess(true);
    setTimeout(() => {
      setCompleteSuccess(false);
      setActiveJobId('');
    }, 2000);
  };


  const earnedFees = workOrders
    .filter(j => j.status === 'approved_paid')
    .reduce((sum, j) => sum + j.feeBdt, 0);

  const pendingFees = workOrders
    .filter(j => j.status === 'completed_pending_approval')
    .reduce((sum, j) => sum + j.feeBdt, 0);

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
              <ArrowLeft className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold">{language === 'bn' ? 'কাস্টমার ভিউ' : 'Customer View'}</span>
            </button>
          )}
          <div>
            <h2 className="text-sm font-extrabold flex items-center space-x-1.5 text-purple-300">
              <Wrench className="w-4 h-4 text-purple-400" />
              <span>{language === 'bn' ? 'ফিল্ড টেকনিশিয়ান সার্ভিস ও ওয়্যারিং হাব' : 'Field Technician Hub'}</span>
            </h2>
            <p className="text-[10px] text-slate-400">
              {language === 'bn' ? 'জব চলাকালীন সাময়িক ওয়্যারিং টেস্ট ও অ্যাক্টিভেশন' : 'Time-bounded hardware testing & handover'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[9px] text-slate-400 block">অনুমোদিত সার্ভিস ফি</span>
          <span className="text-xs font-mono font-black text-purple-300">৳{earnedFees.toLocaleString()}</span>
          {pendingFees > 0 && (
            <span className="text-[8.5px] text-amber-400 block font-mono">পেন্ডিং: ৳{pendingFees}</span>
          )}
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 gap-1.5 shadow-md">
        <button
          onClick={() => setActiveTabMode('install_diagnostic')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition ${
            activeTabMode === 'install_diagnostic'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>হার্ডওয়্যার ইনস্টলেশন ও ডায়াগনস্টিক</span>
        </button>

        <button
          onClick={() => setActiveTabMode('paid_job_cards')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition ${
            activeTabMode === 'paid_job_cards'
              ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>পেইড জব-কার্ড ({paidJobCards.length})</span>
        </button>

        <button
          onClick={() => setActiveTabMode('floating_ledger')}
          className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center space-x-1.5 transition ${
            activeTabMode === 'floating_ledger'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>আমার ফ্লোটিং লেজার</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 🎫 PAID JOB-CARDS BILLING HUB                                             */}
      {/* ========================================================================= */}
      {activeTabMode === 'paid_job_cards' && (
        <div className="space-y-3">
          <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-amber-400" />
              <h3 className="font-extrabold text-xs text-amber-300">
                পেইড সার্ভিস জব-কার্ড বিলিং ও পার্টস সিলেকশন
              </h3>
            </div>
            <p className="text-[11px] text-slate-400">
              অ্যাডমিনের ফিক্সড রেট-কার্ড ও স্পেয়ার পার্টস সিলেক্ট করে কাস্টমারের অ্যাপে সরাসরি ডিজিটাল বিল পাঠান। কাস্টমার ১-ট্যাপে কনফার্ম করলে ৩০ দিনের ফ্রি গ্যারান্টি সক্রিয় হবে।
            </p>

            <div className="space-y-3 pt-2">
              {paidJobCards.map(jc => {
                const isCompleted = jc.jobStatus === 'completed';
                const isBillSent = jc.jobStatus === 'bill_sent';

                return (
                  <div key={jc.id} className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-black text-amber-400 bg-amber-950 px-2 py-0.5 rounded text-xs border border-amber-800">
                          {jc.id}
                        </span>
                        <div>
                          <span className="font-bold text-slate-100 text-xs block">{jc.customerName} ({jc.customerPhone})</span>
                          <span className="text-[10px] text-slate-400 font-mono">{jc.vehicleName} {jc.plateNumber ? `• ${jc.plateNumber}` : ''}</span>
                        </div>
                      </div>

                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                        isCompleted 
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                          : isBillSent
                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                            : 'bg-blue-950 text-blue-300 border-blue-700'
                      }`}>
                        {isCompleted ? '✅ পেমেন্ট সম্পন্ন' : isBillSent ? '📲 বিল প্রেরিত' : '🔧 সার্ভিস চলছে'}
                      </span>
                    </div>

                    {/* Breakdown of Current Bill */}
                    <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-300">
                        <span>সার্ভিস পয়েন্ট:</span>
                        <span className="text-amber-300">{jc.serviceCenterName}</span>
                      </div>
                      {jc.selectedServices.map((s, i) => (
                        <div key={i} className="flex justify-between text-[11px] text-slate-400">
                          <span>{s.nameBn}</span>
                          <span className="font-mono font-bold text-amber-400">৳{s.price}</span>
                        </div>
                      ))}
                      {jc.selectedSpareParts.map((p, i) => (
                        <div key={i} className="flex justify-between text-[11px] text-slate-400">
                          <span>{p.nameBn} (x{p.quantity})</span>
                          <span className="font-mono font-bold text-cyan-400">৳{p.unitPrice * p.quantity}</span>
                        </div>
                      ))}
                      <div className="pt-1 border-t border-slate-800 flex justify-between font-bold text-slate-100">
                        <span>মোট বিল:</span>
                        <span className="font-mono font-black text-emerald-400 text-sm">৳ {jc.totalAmount}</span>
                      </div>
                    </div>

                    {/* Action to Send / Re-send Bill */}
                    {!isCompleted && (
                      <button
                        onClick={() => {
                          sendJobCardBill(
                            jc.id, 
                            jc.selectedServices.length > 0 ? jc.selectedServices : [{ serviceId: 'srv_relay_fix', nameBn: 'ইঞ্জিন কাটঅফ রিলে ফিক্স', price: 200 }],
                            jc.selectedSpareParts.length > 0 ? jc.selectedSpareParts : [{ partId: 'part_relay_40a', nameBn: '12V 40A হেভি ডিউটি রিলে', unitPrice: 200, quantity: 1 }],
                            'সার্ভিসিং ও পার্টস ফিটিং সফলভাবে সম্পন্ন হয়েছে।'
                          );
                          setBillSentSuccessId(jc.id);
                          setTimeout(() => setBillSentSuccessId(null), 2500);
                        }}
                        className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-amber-600/30 transition active:scale-95"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{billSentSuccessId === jc.id ? '✅ কাস্টমারের অ্যাপে বিল পাঠানো হয়েছে!' : '📲 কাস্টমারের অ্যাপে ডিজিটাল বিল পাঠান (Send Bill)'}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 💳 MY FLOATING LEDGER VIEW (TECHNICIAN BALANCE & LIMITS)                   */}
      {/* ========================================================================= */}
      {activeTabMode === 'floating_ledger' && (
        <div className="space-y-3">
          {(() => {
            const myLedger = technicianLedgers[0];
            if (!myLedger) return null;
            const isPositive = myLedger.currentFloatingBalance >= 0;
            const isOverLimit = myLedger.isAccountLocked;

            return (
              <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/40 rounded-3xl p-4 shadow-xl space-y-3.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-indigo-400" />
                    <div>
                      <h3 className="font-extrabold text-xs text-indigo-300">
                        আমার রিয়েল-টাইম ফ্লোটিং লেজার ও পে-আউট হিস্ট্রি
                      </h3>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {myLedger.techName} ({myLedger.area})
                      </span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                    isPositive 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700' 
                      : isOverLimit
                        ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                        : 'bg-amber-950 text-amber-300 border-amber-700'
                  }`}>
                    {isPositive ? '● কোম্পানি পাওনাদার' : isOverLimit ? '⚠️ লিমিট অতিক্রম' : `● বকেয়া ক্যাশ (${myLedger.daysInNegative} দিন)`}
                  </span>
                </div>

                {/* Balance & Limit Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10.5px] text-slate-400 font-bold block">বর্তমান ফ্লোটিং ব্যালেন্স:</span>
                    <span className={`text-xl font-mono font-black ${
                      isPositive ? 'text-emerald-400' : isOverLimit ? 'text-rose-400' : 'text-amber-400'
                    }`}>
                      {isPositive ? `+৳ ${myLedger.currentFloatingBalance}` : `-৳ ${Math.abs(myLedger.currentFloatingBalance)}`}
                    </span>
                    <span className="text-[10px] text-slate-500 block">
                      {isPositive ? 'শুক্রবার আপনার বিকাশে পাঠানো হবে।' : 'পরবর্তী নতুন ইনস্টলেশনের আয়ের সাথে অ্যাডজাস্ট হবে।'}
                    </span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between text-[11px] font-bold">
                      <span className="text-slate-400">নেগেটিভ ক্যাশ লিমিট:</span>
                      <span className="font-mono text-indigo-300">
                        ৳{Math.abs(Math.min(0, myLedger.currentFloatingBalance))} / ৳{myLedger.maxNegativeLimitBdt}
                      </span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div 
                        className={`h-full transition-all duration-300 ${isOverLimit ? 'bg-rose-500' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, (Math.abs(Math.min(0, myLedger.currentFloatingBalance)) / myLedger.maxNegativeLimitBdt) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[9.5px] text-slate-400 block font-mono">
                      বকেয়া সময়সীমা: সর্বোচ্চ {myLedger.maxDueDaysLimit} দিন (প্রতি শুক্রবার সেটেলমেন্ট)
                    </span>
                  </div>
                </div>

                {/* Ledger Transactions */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10.5px] font-bold text-slate-300 uppercase tracking-wider block">
                    লেনদেন ও কমিশন ডিডাকশন বিবরণী:
                  </span>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {myLedger.transactions.map(tx => (
                      <div key={tx.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-200 block text-[11px]">{tx.titleBn}</span>
                          <span className="text-[9.5px] text-slate-500 font-mono">{tx.date} • {tx.id} {tx.customerName ? `(${tx.customerName})` : ''}</span>
                        </div>
                        <span className={`font-mono font-black text-xs shrink-0 ${tx.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {tx.amount >= 0 ? `+৳${tx.amount}` : `-৳${Math.abs(tx.amount)}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔒 SCENARIO 1: NO ACTIVE JOB OR JOB COMPLETED (ACCESS LOCKED)             */}
      {/* ========================================================================= */}
      {activeTabMode === 'install_diagnostic' && !activeJob && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 shadow-xl text-center space-y-3">
          <div className="w-14 h-14 rounded-3xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300 mx-auto shadow-inner">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100">
              {language === 'bn' ? 'বর্তমানে কোনো সক্রিয় ইনস্টলেশন বা সার্ভিসিং জব নেই' : 'No Active Job Assigned'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              {language === 'bn' 
                ? '🔒 কাস্টমার প্রাইভেসি সুরক্ষায় কাজ শেষ হওয়ার পর ডায়াগনস্টিক ও ট্র্যাকিং অ্যাক্সেস স্বয়ংক্রিয়ভাবে বন্ধ করা হয়েছে। কাস্টমার সাপোর্ট থেকে নতুন কাজ অ্যাসাইন করলে তা এখানে দৃশ্যমান হবে।'
                : 'Diagnostic access is revoked after job handover to protect customer privacy.'}
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔓 SCENARIO 2: ACTIVE JOB IN PROGRESS (DIAGNOSTICS & SETTINGS UNLOCKED)  */}
      {/* ========================================================================= */}
      {activeJob && (
        <div className="space-y-4 animate-in fade-in">
          {/* Active Job Target Banner */}
          <div className="bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border border-purple-500/60 rounded-3xl p-4 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                  {activeJob.id}
                </span>
                <span className="font-extrabold text-sm text-slate-100">{activeJob.vehicleName}</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800 font-bold animate-pulse">
                ● লাইভ ডায়াগনস্টিক আনলকড
              </span>
            </div>

            <div className="text-[11px] text-slate-300 grid grid-cols-2 gap-1 pt-1 border-t border-slate-800/80">
              <div>মালিক: <strong>{activeJob.customerName}</strong> ({activeJob.customerPhone})</div>
              <div>নাম্বার প্লেট: <strong>{activeJob.plateNumber}</strong></div>
              <div>IMEI: <strong className="font-mono text-purple-300">{activeJob.trackerImei}</strong></div>
              <div>সিম নম্বর: <strong className="font-mono text-slate-200">{activeJob.simNumber}</strong></div>
            </div>
          </div>

          {/* 1. Hardware Live Telemetry Diagnostic Test */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-300 flex items-center space-x-1.5">
              <Activity className="w-4 h-4 text-purple-400" />
              <span>১. হার্ডওয়্যার ওয়্যারিং ও সিগন্যাল লাইভ টেস্ট</span>
            </span>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {/* Main Power */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span>মেইন পাওয়ার (লাল তার)</span>
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="text-xl font-mono font-black text-amber-300 mt-2">{powerVoltage} V</div>
                <div className="text-[9.5px] text-emerald-400 mt-1 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>পাওয়ার ওকে</span>
                </div>
              </div>

              {/* ACC Ignition Wire */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span>ACC চাবি (কমলা তার)</span>
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="text-sm font-bold text-blue-300 mt-2">
                  {isAccOn ? 'ইগনিশন অন (ACC ON)' : 'ইগনিশন অফ (ACC OFF)'}
                </div>
                <button
                  onClick={() => setIsAccOn(!isAccOn)}
                  className="text-[9.5px] text-blue-400 hover:underline mt-1 text-left"
                >
                  চাবি ঘুরিয়ে টেস্ট ➔
                </button>
              </div>

              {/* Satellite Fix */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span>জিপিএস স্যাটেলাইট</span>
                  <Satellite className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-mono font-black text-emerald-300 mt-2">
                  {satCount} টি <span className="text-xs font-normal text-slate-400">3D Fix</span>
                </div>
                <div className="text-[9.5px] text-emerald-400 mt-1">HD একুরেসি: ৩ মিটার</div>
              </div>

              {/* GSM Signal */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
                  <span>সিম জিএসএম সিগন্যাল</span>
                  <Signal className="w-3.5 h-3.5 text-sky-400" />
                </div>
                <div className="text-xl font-mono font-black text-sky-300 mt-2">{gsmSignal} CSQ</div>
                <div className="text-[9.5px] text-sky-400 mt-1">4G / 2G নেটওয়ার্ক ওকে</div>
              </div>
            </div>
          </div>

          {/* 2. Relay Fuel Cutoff Test */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-300 flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-rose-400" />
                <span>২. রিলে ইঞ্জিন কাটঅফ ভেরিফিকেশন টেস্ট</span>
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                relayCutStatus === 'cut' ? 'bg-rose-950 text-rose-300 border-rose-600' : 'bg-emerald-950 text-emerald-300 border-emerald-600'
              }`}>
                {relayCutStatus === 'cut' ? 'কাটঅফ সক্রিয় (তেল বন্ধ)' : 'তেল সরবরাহ সচল'}
              </span>
            </div>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setRelayCutStatus('cut')}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition"
              >
                রিলে কাট টেস্ট (Cut Engine)
              </button>
              <button
                type="button"
                onClick={() => setRelayCutStatus('connected')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
              >
                রিলে রিস্টোর (Restore Oil)
              </button>
            </div>
          </div>

          {/* 3. Initial Odometer & Speed Limit Setup by Tech */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>৩. প্রাথমিক মিটার রিডিং ও স্পিড লিমিট ক্যালিব্রেশন</span>
            </span>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                <label className="text-[10px] font-bold text-slate-400 block mb-1">গাড়ির বর্তমান মিটার রিডিং (km):</label>
                <input
                  type="number"
                  value={inputInitialOdo}
                  onChange={(e) => setInputInitialOdo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold focus:outline-none"
                />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800">
                <label className="text-[10px] font-bold text-slate-400 block mb-1">ওভার স্পিড অ্যালার্ট লিমিট (km/h):</label>
                <input
                  type="number"
                  value={inputSpeedLimit}
                  onChange={(e) => setInputSpeedLimit(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white font-mono font-bold focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* 4. Complete Handover Checklist & Lock Button */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              ৪. কোয়ালিটি চেকলিস্ট ও কাজ সম্পন্ন কনফার্মেশন
            </span>

            <div className="space-y-2 text-xs">
              {Object.entries({
                hiddenPlace: 'ট্র্যাকারটি নিরাপদ ও ওয়াটারপ্রুফ স্থানে স্থাপন করা হয়েছে',
                fuseInstalled: 'মেইন পাওয়ার লাইনে সঠিক ফিউজ ইনস্টল করা হয়েছে',
                relayCutTested: 'রিলে কাটঅফ পরীক্ষা করে ইঞ্জিন বন্ধ নিশ্চিত করা হয়েছে',
                gpsDirectSky: 'জিপিএস এন্টেনা খোলা আকাশের দিকে নির্দেশ করা আছে',
                simApnVerified: 'সিমের APN ও সার্ভার পোর্ট কনফিগারেশন ভেরিফাইড',
                customerAppVerified: 'কাস্টমারের মোবাইলে অ্যাপ ইনস্টল করে লগইন বুঝিয়ে দেওয়া হয়েছে'
              }).map(([key, label]) => (
                <label key={key} className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(checklist as any)[key]}
                    onChange={(e) => setChecklist({ ...checklist, [key]: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
                  />
                  <span className="text-slate-300">{label}</span>
                </label>
              ))}
            </div>

            {/* Optional Hardware Replacement Box if Tracker was Swapped */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-purple-500/30 space-y-2">
              <span className="text-[10.5px] font-bold text-purple-300 block">
                🔄 হার্ডওয়্যার সোয়াপ / নতুন রিপ্লেসমেন্ট ট্র্যাকার IMEI (প্রযোজ্য হলে):
              </span>
              <input
                type="text"
                maxLength={15}
                value={replacementImeiInput}
                onChange={(e) => setReplacementImeiInput(e.target.value)}
                placeholder="নতুন ১৫-ডিজিট IMEI (যেমন: 864720058299999)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono font-bold focus:border-purple-500 focus:outline-none"
              />
              <textarea
                rows={2}
                value={techReportNotes}
                onChange={(e) => setTechReportNotes(e.target.value)}
                placeholder="সার্ভিস রিপোর্ট ও ডায়াগনস্টিক নোট..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleCompleteJob}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-xl shadow-purple-600/40 flex items-center justify-center space-x-2 transition active:scale-95 border border-purple-400"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{completeSuccess ? 'ইনস্টলেশন সফল! অ্যাক্সেস লক হচ্ছে...' : '✅ ইনস্টলেশন সম্পন্ন ও অ্যাক্সেস লক করুন (Complete Job)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Work Orders Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
          টেকনিশিয়ান জব ও সার্ভিস ফি হিস্ট্রি ({workOrders.length})
        </span>

        <div className="space-y-2">
          {workOrders.map((j) => (
            <div key={j.id} className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs">
              <div>
                <div className="font-extrabold text-slate-100 flex items-center space-x-2">
                  <span>{j.vehicleName}</span>
                  <span className="text-slate-400 font-mono text-[10px]">({j.customerName})</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  IMEI: {j.trackerImei} • প্লেট: {j.plateNumber}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                  j.status === 'approved_paid' ? 'bg-emerald-950 text-emerald-300 border-emerald-700' :
                  j.status === 'completed_pending_approval' ? 'bg-amber-950 text-amber-300 border-amber-700' :
                  'bg-purple-950 text-purple-300 border-purple-700 animate-pulse'
                }`}>
                  {j.status === 'approved_paid' ? '৳৩০০ পেইড' :
                   j.status === 'completed_pending_approval' ? 'পেন্ডিং ভেরিফিকেশন (৳৩০০)' :
                   'চলমান কাজ'}
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">{j.assignedDate}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
