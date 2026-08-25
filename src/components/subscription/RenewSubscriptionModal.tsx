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
  const { user, selectedDevice, language, approvedPartners, updatePartnerDetails } = useApp();
  const config = getSubscriptionConfig();

  // Check if device or user belongs to a Business Partner
  const partnerId = selectedDevice?.attributes?.partnerId || user?.partnerId;
  const affiliatedPartner = approvedPartners?.find(p => p.partnerId === partnerId || p.id === partnerId);
  
  const customMonthlyRate = affiliatedPartner?.customRetailMonthlyPrice || 350;
  const customYearlyRate = affiliatedPartner?.customRetailYearlyPrice || (customMonthlyRate * 10);

  const [planCategory, setPlanCategory] = useState<'all_inclusive' | 'server_only'>('all_inclusive');

  // Dynamic Plans based on Partner / EasyTracker Direct Custom Pricing
  const dynamicPlans: SubscriptionPlanTier[] = React.useMemo(() => {
    if (planCategory === 'server_only') {
      const srv1 = affiliatedPartner?.serverOnlyPricing?.month1 || 150;
      const srv3 = affiliatedPartner?.serverOnlyPricing?.month3 || 450;
      const srv6 = affiliatedPartner?.serverOnlyPricing?.month6 || 850;
      const srv12 = affiliatedPartner?.serverOnlyPricing?.month12 || 1500;

      return [
        {
          months: 1,
          name: '১ মাস অনলি সার্ভার প্ল্যান',
          priceBdt: srv1,
          originalPriceBdt: srv1,
          discountPercentage: 0,
          labelBn: '১ মাস (সার্ভার অনলি)',
          savingsTextBn: 'গ্রাহকের নিজস্ব সিম'
        },
        {
          months: 3,
          name: '৩ মাস অনলি সার্ভার প্যাক',
          priceBdt: srv3,
          originalPriceBdt: srv1 * 3,
          discountPercentage: Math.max(0, Math.round(((srv1 * 3 - srv3) / (srv1 * 3)) * 100)),
          labelBn: '৩ মাস (সার্ভার অনলি)',
          savingsTextBn: 'কোয়ার্টারলি সাশ্রয়ী'
        },
        {
          months: 6,
          name: '৬ মাস অনলি সার্ভার প্যাক',
          priceBdt: srv6,
          originalPriceBdt: srv1 * 6,
          discountPercentage: Math.max(0, Math.round(((srv1 * 6 - srv6) / (srv1 * 6)) * 100)),
          popular: true,
          labelBn: '৬ মাস (সার্ভার অনলি)',
          savingsTextBn: 'হাফ-ইয়ারলি সেভার'
        },
        {
          months: 12,
          name: '১২ মাস বাৎসরিক সার্ভার প্যাক',
          priceBdt: srv12,
          originalPriceBdt: srv1 * 12,
          discountPercentage: Math.max(0, Math.round(((srv1 * 12 - srv12) / (srv1 * 12)) * 100)),
          bestValue: true,
          labelBn: '১ বছর (সার্ভার অনলি)',
          savingsTextBn: 'সর্বাধিক সাশ্রয়ী ও বোনাস'
        }
      ];
    } else {
      const inc1 = affiliatedPartner?.allInclusivePricing?.month1 || customMonthlyRate || 350;
      const inc3 = affiliatedPartner?.allInclusivePricing?.month3 || 1000;
      const inc6 = affiliatedPartner?.allInclusivePricing?.month6 || 1900;
      const inc12 = affiliatedPartner?.allInclusivePricing?.month12 || customYearlyRate || 3500;

      return [
        {
          months: 1,
          name: '১ মাস অল-ইন-ওয়ান',
          priceBdt: inc1,
          originalPriceBdt: inc1,
          discountPercentage: 0,
          labelBn: '১ মাস (সিম + সার্ভার)',
          savingsTextBn: 'সিম ডেটাসহ পে-অ্যাজ-ইউ-গো'
        },
        {
          months: 3,
          name: '৩ মাস অল-ইন-ওয়ান',
          priceBdt: inc3,
          originalPriceBdt: inc1 * 3,
          discountPercentage: Math.max(0, Math.round(((inc1 * 3 - inc3) / (inc1 * 3)) * 100)),
          labelBn: '৩ মাস (সিম + সার্ভার)',
          savingsTextBn: '৫% সাশ্রয়ী'
        },
        {
          months: 6,
          name: '৬ মাস অল-ইন-ওয়ান',
          priceBdt: inc6,
          originalPriceBdt: inc1 * 6,
          discountPercentage: Math.max(0, Math.round(((inc1 * 6 - inc6) / (inc1 * 6)) * 100)),
          popular: true,
          labelBn: '৬ মাস (সিম + সার্ভার)',
          savingsTextBn: '১০% সাশ্রয়ী'
        },
        {
          months: 12,
          name: '১২ মাস অল-ইন-ওয়ান মেগা',
          priceBdt: inc12,
          originalPriceBdt: inc1 * 12,
          discountPercentage: Math.max(0, Math.round(((inc1 * 12 - inc12) / (inc1 * 12)) * 100)),
          bestValue: true,
          labelBn: '১ বছর (সিম + সার্ভার)',
          savingsTextBn: 'সর্বাধিক সাশ্রয়ী ও বোনাস'
        }
      ];
    }
  }, [planCategory, affiliatedPartner, customMonthlyRate, customYearlyRate]);
  
  const [selectedPlanMonths, setSelectedPlanMonths] = useState<number>(12); // Default to 12 months best value
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'card'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const currentPlan = dynamicPlans.find(p => p.months === selectedPlanMonths) || dynamicPlans[0];

  const handleProcessRenewal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMsg(language === 'bn' ? '🎉 সেন্ট্রাল গেটওয়েতে সাবস্ক্রিপশন সফলভাবে রিনিউ হয়েছে!' : '🎉 Subscription renewed successfully via Central Gateway!');
      
      // Central Auto-Settlement Split: EasyTracker Wholesale vs Partner Profit
      if (affiliatedPartner) {
        const wholesaleCostPerMonth = planCategory === 'all_inclusive' 
          ? (affiliatedPartner.wholesaleAllInclusiveMonthly || 100) 
          : (affiliatedPartner.wholesaleServerFeeMonthly || 50);

        const totalWholesaleFee = wholesaleCostPerMonth * currentPlan.months;
        const netPartnerProfit = Math.max(0, currentPlan.priceBdt - totalWholesaleFee);

        const currentAccumulated = affiliatedPartner.accumulatedPartnerProfitBdt || 0;
        const updatedProfit = currentAccumulated + netPartnerProfit;

        updatePartnerDetails(affiliatedPartner.partnerId || affiliatedPartner.id, {
          accumulatedPartnerProfitBdt: updatedProfit
        });
      }

      // Notify Admin telemetry stream
      try {
        const existingAlerts = JSON.parse(localStorage.getItem('gps_admin_notifications') || '[]');
        existingAlerts.unshift({
          id: 'renew-' + Date.now(),
          type: 'subscription_renewed',
          userEmail: user?.email,
          deviceName: selectedDevice?.name,
          partnerId: affiliatedPartner?.partnerId,
          packageType: planCategory,
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
              
              {/* Category Switcher Tabs: All-Inclusive vs Server-Only */}
              <div className="p-1 bg-slate-950 rounded-2xl border border-slate-800 flex">
                <button
                  type="button"
                  onClick={() => setPlanCategory('all_inclusive')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    planCategory === 'all_inclusive'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>📦 অল-ইন-ওয়ান (সিমসহ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPlanCategory('server_only')}
                  className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    planCategory === 'server_only'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-300" />
                  <span>🌐 অনলি সার্ভার (নিজের সিম)</span>
                </button>
              </div>

              {/* Plan Selection Cards Grid */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 block">
                  {language === 'bn' ? 'সাবস্ক্রিপশন মেয়াদ নির্বাচন করুন:' : 'Select Subscription Duration:'}
                </label>

                <div className="grid grid-cols-2 gap-2">
                  {dynamicPlans.map((plan) => {
                    const isSelected = selectedPlanMonths === plan.months;
                    return (
                      <div
                        key={plan.months}
                        onClick={() => setSelectedPlanMonths(plan.months)}
                        className={`p-3 rounded-2xl border cursor-pointer relative transition-all duration-150 active:scale-[0.98] flex flex-col justify-between ${
                          isSelected
                            ? planCategory === 'all_inclusive' 
                              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-500/10'
                              : 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-lg shadow-purple-500/10'
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
