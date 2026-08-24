import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Calendar, 
  MessageSquare, 
  Phone,
  DollarSign,
  Zap,
  ArrowRight
} from 'lucide-react';
import { getSubscriptionConfig, SubscriptionPlanTier } from '../../config/subscriptionPlans';
import { APP_CONFIG } from '../../config/appConfig';

interface RenewSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (plan: SubscriptionPlanTier) => void;
}

export const RenewSubscriptionModal: React.FC<RenewSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, selectedDevice, language } = useApp();
  const config = getSubscriptionConfig();
  
  const [selectedPlanMonths, setSelectedPlanMonths] = useState<number>(12); // Default to 12 months best value
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentPlan = config.plans.find(p => p.months === selectedPlanMonths) || config.plans[0];

  const handleProcessRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMsg(language === 'bn' ? '🎉 সাবস্ক্রিপশন সফলভাবে রিনিউ হয়েছে!' : '🎉 Subscription renewed successfully!');
      
      // Notify Admin telemetry stream
      try {
        const existingAlerts = JSON.parse(localStorage.getItem('gps_admin_notifications') || '[]');
        existingAlerts.unshift({
          id: 'renew-' + Date.now(),
          type: 'subscription_renewed',
          userEmail: user?.email,
          deviceName: selectedDevice?.name,
          months: currentPlan.months,
          amountBdt: currentPlan.priceBdt,
          trxId: trxId || 'Auto-Checkout',
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('gps_admin_notifications', JSON.stringify(existingAlerts));
      } catch (e) {}

      setTimeout(() => {
        onSuccess(currentPlan);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-md">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">
                {language === 'bn' ? 'সাবস্ক্রিপশন রিনিউ প্যাকেজ' : 'Renew Subscription Plan'}
              </h3>
              <p className="text-[10px] text-slate-400">
                {selectedDevice?.name || 'My Vehicle'} • {user?.email}
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

        {/* Body */}
        <div className="p-4 space-y-3.5 overflow-y-auto">
          {successMsg ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400 animate-bounce" />
              <div className="font-bold text-sm">{successMsg}</div>
            </div>
          ) : (
            <form onSubmit={handleProcessRenewal} className="space-y-3.5">
              {/* Plan Selection Cards Grid */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 block">
                  {language === 'bn' ? 'সাবস্ক্রিপশন মেয়াদ নির্বাচন করুন:' : 'Select Subscription Duration:'}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {config.plans.map((plan) => {
                    const isSelected = selectedPlanMonths === plan.months;
                    return (
                      <div
                        key={plan.months}
                        onClick={() => setSelectedPlanMonths(plan.months)}
                        className={`p-3 rounded-2xl border cursor-pointer relative transition-all duration-150 active:scale-[0.98] flex flex-col justify-between ${
                          isSelected
                            ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {plan.bestValue && (
                          <span className="absolute -top-2.5 right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-[8px] px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow">
                            মেগা সেভার
                          </span>
                        )}
                        {plan.popular && (
                          <span className="absolute -top-2.5 right-2 bg-blue-600 text-white font-black text-[8px] px-1.5 py-0.2 rounded-full uppercase tracking-wider shadow">
                            জনপ্রিয়
                          </span>
                        )}

                        <div>
                          <div className="font-extrabold text-xs text-slate-100">{plan.labelBn}</div>
                          <div className="font-mono font-black text-base text-emerald-400 mt-1">
                            ৳ {plan.priceBdt.toLocaleString()}
                          </div>
                          {plan.discountPercentage > 0 && (
                            <div className="text-[9.5px] text-slate-400 line-through">
                              ৳ {plan.originalPriceBdt.toLocaleString()}
                            </div>
                          )}
                        </div>

                        <div className="mt-2 text-[9.5px] font-semibold text-emerald-300/90 flex items-center space-x-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                          <span>{plan.savingsTextBn}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Special Cashless Offer Banner */}
              <div className="p-2.5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-pink-950/70 border border-emerald-500/40 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <span className="font-extrabold text-slate-100 text-[11px] block">
                      ⚡ অনলাইন / বাংলা কিউআর অফার সক্রিয়:
                    </span>
                    <span className="text-[10px] text-emerald-300">
                      ইনস্ট্যান্ট ডিজিটাল রিনিউয়াল ও ১৫ দিনের এক্সট্রা ভ্যালিডিটি
                    </span>
                  </div>
                </div>
                <span className="font-mono font-black text-amber-300 bg-amber-950 px-2 py-0.5 rounded-lg border border-amber-700 text-[10px]">
                  ৳৫০ অফার
                </span>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-1">
                <label className="text-[11px] font-bold text-slate-400 block">
                  {language === 'bn' ? 'পেমেন্ট মাধ্যম বেছে নিন:' : 'Payment Method:'}
                </label>

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition ${
                      paymentMethod === 'bkash' 
                        ? 'bg-pink-600/25 border-pink-500 text-pink-300 shadow-sm' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    বিকাশ
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition ${
                      paymentMethod === 'nagad' 
                        ? 'bg-orange-600/25 border-orange-500 text-orange-300 shadow-sm' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    নগদ
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition bg-slate-800 hover:bg-emerald-950/40 border-slate-700 hover:border-emerald-500 text-emerald-300`}
                  >
                    বাংলা QR
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2 px-1 rounded-xl border text-center font-bold text-[11px] transition ${
                      paymentMethod === 'card' 
                        ? 'bg-blue-600/25 border-blue-500 text-blue-300 shadow-sm' 
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    কার্ড/ব্যাংক
                  </button>
                </div>

                {/* TRX ID Input */}
                <div>
                  <input
                    type="text"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-3 py-2 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none mt-1"
                    placeholder="ট্রানজেকশন আইডি লিখুন (TrxID) / ঐচ্ছিক"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition active:scale-95 disabled:opacity-50"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>
                    {isProcessing 
                      ? 'রিনিউ প্রসেস হচ্ছে...' 
                      : (language === 'bn' ? `পরিশোধ করুন ৳ ${currentPlan.priceBdt.toLocaleString()} ও রিনিউ` : `Pay ৳ ${currentPlan.priceBdt} & Renew`)}
                  </span>
                </button>

                <a
                  href={`https://wa.me/${APP_CONFIG.supportWhatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello EasyTracker Billing, I want to renew subscription for Vehicle: ${selectedDevice?.name}, Account: ${user?.email}, Plan: ${currentPlan.labelBn} (৳${currentPlan.priceBdt})`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-1.5 transition"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'হোয়াটসঅ্যাপে সরাসরি পে ও কনফার্ম করুন' : 'Pay via WhatsApp Assist'}</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
