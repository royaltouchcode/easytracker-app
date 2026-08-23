export interface SubscriptionPlanTier {
  months: number;
  labelBn: string;
  labelEn: string;
  priceBdt: number;
  originalPriceBdt: number;
  discountPercentage: number;
  popular?: boolean;
  bestValue?: boolean;
  savingsTextBn: string;
}

export interface SubscriptionConfig {
  plans: SubscriptionPlanTier[];
  cancelReasonsBn: string[];
  refundPolicyBn: string;
  refundPolicyEn: string;
}

export const DEFAULT_SUBSCRIPTION_CONFIG: SubscriptionConfig = {
  plans: [
    {
      months: 1,
      labelBn: '১ মাস (মাসিক প্ল্যান)',
      labelEn: '1 Month Standard',
      priceBdt: 350,
      originalPriceBdt: 350,
      discountPercentage: 0,
      savingsTextBn: 'স্ট্যান্ডার্ড রেগুলার রেট'
    },
    {
      months: 3,
      labelBn: '৩ মাস (কোয়ার্টারলি)',
      labelEn: '3 Months Saver',
      priceBdt: 990,
      originalPriceBdt: 1050,
      discountPercentage: 6,
      savingsTextBn: '৬০ টাকা সাশ্রয়'
    },
    {
      months: 6,
      labelBn: '৬ মাস (হাফ-ইয়ারলি)',
      labelEn: '6 Months Super Saver',
      priceBdt: 1850,
      originalPriceBdt: 2100,
      discountPercentage: 12,
      popular: true,
      savingsTextBn: '২৫০ টাকা সাশ্রয় (জনপ্রিয়)'
    },
    {
      months: 12,
      labelBn: '১২ মাস (বাৎসরিক মেগা সেভার)',
      labelEn: '12 Months Mega Value',
      priceBdt: 3500,
      originalPriceBdt: 4200,
      discountPercentage: 17,
      bestValue: true,
      savingsTextBn: '৭০০ টাকা সাশ্রয় (২ মাস ফ্রি)'
    }
  ],
  cancelReasonsBn: [
    'গাড়ি বা বাইক বিক্রি করে দিয়েছি',
    'সাময়িকভাবে গাড়ি গ্যারেজে রাখা হয়েছে / ব্যবহার বন্ধ',
    'অন্য কোম্পানির জিপিএস ট্র্যাকার ব্যবহার করছি',
    'মাসিক খরচ কমাতে চাই',
    'ইন্টারনেট বা নেটওয়ার্ক সিগন্যাল সমস্যা ছিল',
    'অন্যান্য (বিস্তারিত লিখুন)'
  ],
  refundPolicyBn: `EasyTracker রিফান্ড ও মানি-ব্যাক পলিসি:

১. সাবস্ক্রিপশন ফি রিফান্ড শর্তাবলী:
• সাবস্ক্রিপশন রিনিউ করার ৩ (তিন) দিনের মধ্যে কোনো কারিগরি ত্রুটি বা ট্র্যাকার অচল থাকলে ১০০% পূর্ণাঙ্গ রিফান্ড প্রদান করা হবে।
• ৩ দিন অতিক্রান্ত হওয়ার পর ব্যবহৃত দিনগুলো বাদে অবশিষ্ট মেয়াদের আনুপাতিক অর্থ রিফান্ড করা হবে (১০% প্রসেসিং ফি প্রযোজ্য হতে পারে)।

২. সাবস্ক্রিপশন বাতিলের নিয়ম:
• আপনি যেকোনো সময় সাবস্ক্রিপশন বাতিল করতে পারেন। বাতিল করলেও আপনার বর্তমান পরিশোধিত মেয়াদের শেষ দিন পর্যন্ত নিরবচ্ছিন্ন ট্র্যাকিং সেবা চালু থাকবে। মেয়াদ শেষ হওয়ার পর অটো-রিনিউ বন্ধ হবে।

৩. রিফান্ড পাওয়ার সময়সীমা:
• রিফান্ড রিকোয়েস্ট অনুমোদনের ৩-৫ কার্যদিবসের মধ্যে আপনার মূল পেমেন্ট মাধ্যমে (বিকাশ/নগদ/কার্ড) টাকা ফেরত দেওয়া হবে।

৪. সহায়তা ও ক্লেইম:
• রিফান্ডের জন্য সরাসরি হেল্পলাইনে ফোন করুন (+৮৮০১৭০০০০০০০০) অথবা হোয়াটসঅ্যাপে ট্রানজেকশন আইডি সহ মেসেজ দিন।`,

  refundPolicyEn: `EasyTracker Refund & Cancellation Policy:

1. Refund Eligibility:
• Full 100% refund is available within 3 days of subscription renewal in case of technical hardware incompatibility or server failure.
• After 3 days, pro-rata refund for remaining unused duration may be processed upon review.

2. Cancellation Policy:
• You can cancel anytime. Tracking services will remain active until the end of your current paid billing period.

3. Payout Timeline:
• Approved refunds are credited back to your original payment channel (bKash/Nagad/Cards) within 3-5 business days.

4. Support Hotline:
• Contact support at support@easysoftsolution.net or WhatsApp helpline.`
};

export function getSubscriptionConfig(): SubscriptionConfig {
  try {
    const saved = localStorage.getItem('gps_admin_subscription_config');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_SUBSCRIPTION_CONFIG;
}
