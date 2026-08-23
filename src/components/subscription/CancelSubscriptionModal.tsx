import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  AlertTriangle, 
  ShieldCheck, 
  Calendar, 
  CheckCircle2, 
  MessageSquare,
  HelpCircle,
  Clock
} from 'lucide-react';
import { getSubscriptionConfig } from '../../config/subscriptionPlans';
import { APP_CONFIG } from '../../config/appConfig';

interface CancelSubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { user, selectedDevice, language } = useApp();
  const config = getSubscriptionConfig();

  const [selectedReason, setSelectedReason] = useState<string>(config.cancelReasonsBn[0]);
  const [otherReasonText, setOtherReasonText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirmCancellation = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const finalReason = selectedReason.includes('অন্যান্য') ? otherReasonText : selectedReason;

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmed(true);

      // Save cancelled status in localStorage
      if (selectedDevice) {
        localStorage.setItem(`gps_subscription_cancelled_${selectedDevice.id}`, 'true');
        localStorage.setItem(`gps_subscription_cancel_reason_${selectedDevice.id}`, finalReason);
      }

      // Dispatch real cancellation telemetry notification for Admin
      try {
        const existingAlerts = JSON.parse(localStorage.getItem('gps_admin_notifications') || '[]');
        existingAlerts.unshift({
          id: 'cancel-' + Date.now(),
          type: 'subscription_cancelled',
          userEmail: user?.email,
          deviceName: selectedDevice?.name,
          reason: finalReason,
          expiryDate: '2026-12-31',
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('gps_admin_notifications', JSON.stringify(existingAlerts));
      } catch (e) {}

      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shadow-md">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100">
                {language === 'bn' ? 'সাবস্ক্রিপশন বাতিলকরণ' : 'Cancel Subscription'}
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
          {confirmed ? (
            <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
              <div className="font-bold text-sm">
                {language === 'bn' ? 'সাবস্ক্রিপশন বাতিলের অনুরোধ গৃহীত হয়েছে' : 'Cancellation Request Processed'}
              </div>
              <p className="text-xs text-slate-300">
                {language === 'bn' 
                  ? 'আপনার বর্তমান মেয়াদের শেষ দিন (৩১ ডিসেম্বর ২০২৬) পর্যন্ত ট্র্যাকিং সুবিধা চালু থাকবে।' 
                  : 'Your tracking access remains active until the end of your current cycle (31 Dec 2026).'}
              </p>
            </div>
          ) : (
            <form onSubmit={handleConfirmCancellation} className="space-y-3.5">
              {/* Retention Notice Box */}
              <div className="p-3.5 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-start space-x-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-blue-200 block">
                    {language === 'bn' ? 'আপনার বর্তমান মেয়াদ অক্ষুণ্ণ থাকবে:' : 'Active Until Expiry:'}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {language === 'bn' 
                      ? 'এখন বাতিল করলেও ৩১ ডিসেম্বর ২০২৬ পর্যন্ত আপনার লাইভ ট্র্যাকিং বন্ধ হবে না। মেয়াদ শেষ হওয়ার পর সার্ভিস নিষ্ক্রিয় হবে।'
                      : 'Cancelling now will not stop your tracking until 31 Dec 2026.'}
                  </span>
                </div>
              </div>

              {/* Reason Selector */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 block">
                  {language === 'bn' ? 'সাবস্ক্রিপশন বাতিলের প্রধান কারণটি নির্বাচন করুন:' : 'Select Cancellation Reason:'}
                </label>

                <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                  {config.cancelReasonsBn.map((reason) => {
                    const isSelected = selectedReason === reason;
                    return (
                      <label
                        key={reason}
                        onClick={() => setSelectedReason(reason)}
                        className={`w-full flex items-center space-x-2.5 p-2.5 rounded-2xl border text-xs cursor-pointer transition ${
                          isSelected
                            ? 'bg-rose-500/15 border-rose-500/60 text-rose-200 font-semibold'
                            : 'bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name="cancel_reason"
                          checked={isSelected}
                          onChange={() => setSelectedReason(reason)}
                          className="text-rose-500 focus:ring-0"
                        />
                        <span>{reason}</span>
                      </label>
                    );
                  })}
                </div>

                {selectedReason.includes('অন্যান্য') && (
                  <div className="pt-1">
                    <textarea
                      rows={2}
                      required
                      value={otherReasonText}
                      onChange={(e) => setOtherReasonText(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-2.5 text-white text-xs focus:border-rose-500 focus:outline-none"
                      placeholder="আপনার কারণ বিস্তারিত লিখুন..."
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-rose-600/30 transition active:scale-95 disabled:opacity-50"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>
                    {isSubmitting 
                      ? 'বাতিলকরণ সম্পন্ন হচ্ছে...' 
                      : (language === 'bn' ? 'হ্যাঁ, সাবস্ক্রিপশন বাতিল করুন' : 'Confirm Cancellation')}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  {language === 'bn' ? 'না, আগের মতো চালু রাখুন' : 'Keep Subscription Active'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
