import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Bike, 
  Car, 
  Truck, 
  Bus, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  CreditCard, 
  DollarSign, 
  ArrowRight, 
  X, 
  Flame, 
  Gift, 
  User, 
  PhoneCall, 
  Clock, 
  Sliders,
  Radio,
  Lock,
  ChevronRight
} from 'lucide-react';
import { VehicleType } from '../../types/traccar';
import { VehicleIcon, getVehicleMarkerSvg } from '../../utils/vehicleIcons';

export interface DeviceCatalogItem {
  id: string;
  category: VehicleType;
  titleBn: string;
  titleEn: string;
  badgeBn: string;
  priceBdt: number;
  marketPriceBdt: number;
  descriptionBn: string;
  featuresBn: string[];
  recommendedForBn: string;
}

export const DEVICE_CATALOG: DeviceCatalogItem[] = [
  {
    id: 'dev_bike_mini',
    category: 'motorcycle',
    titleBn: 'ইজিট্র্যাকার ৪জি মিনি ওয়াটারপ্রুফ প্রো',
    titleEn: 'EasyTracker 4G Mini Waterproof Pro',
    badgeBn: 'বেস্ট সেলার (বাইক ও স্কুটার)',
    priceBdt: 2499,
    marketPriceBdt: 3500,
    descriptionBn: 'স্পোর্টস বাইক ও স্কুটারের জন্য বিশেষভাবে তৈরি। অত্যন্ত কম ব্যাটারি খরচ ও সম্পূর্ণ ওয়াটারপ্রুফ আইপি৬৭।',
    featuresBn: [
      '⚡ ১-ট্যাপ রিমোট ইঞ্জিন কাট-অফ রিলে',
      '🔋 আল্ট্রা-লো পাওয়ার ড্র (বাইকের ব্যাটারি ড্রেইন হবে না)',
      '🚨 ভাইব্রেশন ও অ্যান্টি-থেফট অ্যালার্ম',
      '📡 ৪জি সুপারফাস্ট জিপিএস ও লাইভ ট্র্যাকিং'
    ],
    recommendedForBn: 'সকল ব্র্যান্ডের মোটরসাইকেল, স্কুটি ও ই-বাইক'
  },
  {
    id: 'dev_car_fleet',
    category: 'car',
    titleBn: 'ইজিট্র্যাকার ৪জি কনসিল্ড স্মার্ট ফ্লিট',
    titleEn: 'EasyTracker 4G Concealed Smart Fleet',
    badgeBn: 'প্রিমিয়াম সিকিউরিটি (কার ও এসইউভি)',
    priceBdt: 3499,
    marketPriceBdt: 4800,
    descriptionBn: 'লুকানো ওয়্যারিং সিস্টেম ও এসি/ডোর সেন্সর ইন্টিগ্রেশন সুবিধা সহ প্রাইভেট কার ও এসইউভির জন্য সেরা ট্র্যাকার।',
    featuresBn: [
      '🛑 রিমোট ইঞ্জিন কাট ও অ্যান্টি-হাইজ্যাক মোড',
      '❄️ ডিজিটাল এসি অন/অফ ট্র্যাকিং',
      '🚪 ডোর ওপেন/ক্লোজ সেন্সর সাপোর্ট',
      '🛡️ ৩০ দিনের ট্রিপ ও রুট প্লেব্যাক হিস্ট্রি'
    ],
    recommendedForBn: 'প্রাইভেট কার, মাইক্রোবাস, এসইউভি ও রেন্ট-এ-কার'
  },
  {
    id: 'dev_cng_guard',
    category: 'cng',
    titleBn: 'ইজিট্র্যাকার ৩-হুইলার হেভি গার্ড',
    titleEn: 'EasyTracker 3-Wheeler Heavy Guard',
    badgeBn: 'টেকসই ও রুগ্ন (সিএনজি ও অটো)',
    priceBdt: 2799,
    marketPriceBdt: 3800,
    descriptionBn: 'ঢাকার রোদে-বৃষ্টিতে টেকসই মেটালিক বডি ও সহজ রিলে কন্ট্রোলযুক্ত বিশেষ ৩-হুইলার ট্র্যাকার।',
    featuresBn: [
      '🛑 রিমোট ইঞ্জিন লক ও দৈনিক ট্রিপ হিসাব',
      '🌧️ আইপি৬৭ সম্পূর্ণ ওয়াটারপ্রুফ ও ডাস্টপ্রুফ',
      '📊 দৈনিক মাইলেজ ও ভাড়া ক্যালকুলেটর',
      '🚨 ছিনতাই এলার্ট ও পুলিশ কানেক্টর'
    ],
    recommendedForBn: 'সিএনজি অটো-রিকশা, ইজি-বাইক ও লেগুনা'
  },
  {
    id: 'dev_truck_commercial',
    category: 'truck',
    titleBn: 'ইজিট্র্যাকার হেভি কমার্শিয়াল ৩৬০ ফ্লিট',
    titleEn: 'EasyTracker Heavy Commercial 360 Fleet',
    badgeBn: 'হেভি ডিউটি (ট্রাক, বাস ও কভার্ডভ্যান)',
    priceBdt: 5999,
    marketPriceBdt: 7500,
    descriptionBn: '৯-৯০ ভোল্ট পাওয়ার সহ্যক্ষমতা, ফুয়েল রড সেন্সর এবং ৩৬০° ক্যামেরা সংযোগ সহ হেভি কমার্শিয়াল ভেহিকেল ট্র্যাকার।',
    featuresBn: [
      '⛽ আল্ট্রাসনিক ফুয়েল সেন্সর রড কানেকশন',
      '🎥 ৩৬০° ক্যামেরা ও এডিএএস সিগন্যাল ইন্টিগ্রেশন',
      '⚡ ওভার-স্পিড ও হার্শ ব্রেকিং অডিট রিপোর্ট',
      '🏛️ বিআরটিএ ও বিটিআরসি অনুমোদিত টেলিমেটিক্স'
    ],
    recommendedForBn: 'ট্রাক, ট্রেইলার, প্রাইম মুভার, বাস ও কার্গো ফ্লিট'
  }
];

export interface AccessoryItem {
  id: string;
  nameBn: string;
  priceBdt: number;
  icon: string;
  descBn: string;
}

export const ACCESSORIES_CATALOG: AccessoryItem[] = [
  { id: 'acc_relay', nameBn: 'রিমোট ইঞ্জিন কাট-অফ রিলে', priceBdt: 500, icon: '🛑', descBn: 'অ্যাপ থেকে রিমোটলি ইঞ্জিন লক করার হাই-গ্রেড রিলে' },
  { id: 'acc_ac', nameBn: 'ডিজিটাল এসি অন/অফ সেন্সর', priceBdt: 600, icon: '❄️', descBn: 'গাড়িতে এসি কখন চালু ছিল তার পুঙ্খানুপুঙ্খ রিপোর্ট' },
  { id: 'acc_door', nameBn: 'ম্যাগনেটিক ডোর সেন্সর', priceBdt: 400, icon: '🚪', descBn: 'দরজা খুললে তাৎক্ষণিক অ্যালার্ম নোটিফিকেশন' },
  { id: 'acc_fuel', nameBn: 'আল্ট্রাসনিক ফুয়েল সেন্সর রড', priceBdt: 4500, icon: '⛽', descBn: 'ডিজেল ও পেট্রোল চুরি ও রিয়েল-টাইম লিটার মনিটর' },
  { id: 'acc_sos', nameBn: 'হিডেন ফিজিক্যাল SOS প্যানিক বাটন', priceBdt: 300, icon: '🚨', descBn: 'বিপদের সময় চাপলে সেন্ট্রাল পুলিশ ও ৩টি নম্বরে লাইভ অ্যালার্ট' }
];

export interface TelcoSubscriptionPlan {
  id: string;
  titleBn: string;
  durationMonths: number;
  priceBdt: number;
  monthlyEquivalentBdt: number;
  savingsBn?: string;
  badgeBn?: string;
  featuresBn: string[];
}

export const TELCO_SUBSCRIPTION_PLANS: TelcoSubscriptionPlan[] = [
  {
    id: 'sub_monthly',
    titleBn: 'স্ট্যান্ডার্ড মাসিক প্ল্যান',
    durationMonths: 1,
    priceBdt: 350,
    monthlyEquivalentBdt: 350,
    featuresBn: ['২৪/৭ লাইভ জিপিএস ট্র্যাকিং', '১০ সেকেন্ড রিয়েল-টাইম রিফ্রেশ', 'টেলকো রোমিং ডেটা সিম অন্তর্ভুক্ত']
  },
  {
    id: 'sub_half_yearly',
    titleBn: '৬ মাসের সেভার প্যাক',
    durationMonths: 6,
    priceBdt: 1800,
    monthlyEquivalentBdt: 300,
    savingsBn: '৳ ৩০০ সাশ্রয়',
    badgeBn: 'পপুলার চয়েস',
    featuresBn: ['৬ মাস অবিচ্ছিন্ন লাইভ ট্র্যাকিং', 'প্রতি মাসে ৳৫০ সাশ্রয়', 'ফ্রি এসএমএস ও পুশ অ্যালার্ট']
  },
  {
    id: 'sub_annual_ultra',
    titleBn: '১ বছরের আল্ট্রা ভিআইপি প্যাক',
    durationMonths: 12,
    priceBdt: 3200,
    monthlyEquivalentBdt: 266,
    savingsBn: '২ মাস সম্পূর্ণ ফ্রি (৳ ১,০০০ সাশ্রয়)',
    badgeBn: 'বেস্ট ভ্যালু প্যাক',
    featuresBn: ['২ মাস সম্পূর্ণ ফ্রি সার্ভিস', '১ বছর আনলিমিটেড রিপ্লেসমেন্ট ওয়ারেন্টি', '২৪/৭ ডেডিকেটেড রেড-লাইন রেসকিউ টিম সাপোর্ট']
  }
];

export interface PublicDeviceStoreProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (order: any) => void;
}

export const PublicDeviceStore: React.FC<PublicDeviceStoreProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  const [selectedCategory, setSelectedCategory] = useState<VehicleType>('motorcycle');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('sub_annual_ultra');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['acc_relay']);
  
  // Customer & Mandatory Family KYC Inputs
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [sos2, setSos2] = useState('');
  const [sos3, setSos3] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [district, setDistrict] = useState('ঢাকা');
  const [referralCode, setReferralCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'advance_online' | 'after_install_online' | 'cash_on_install'>('advance_online');

  const [orderStep, setOrderStep] = useState<'browse' | 'checkout' | 'success'>('browse');
  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  // Selected Item Calculations
  const activeDevice = DEVICE_CATALOG.find(d => d.category === selectedCategory) || DEVICE_CATALOG[0];
  const activePlan = TELCO_SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || TELCO_SUBSCRIPTION_PLANS[2];
  
  const accessoriesTotal = selectedAccessories.reduce((sum, accId) => {
    const item = ACCESSORIES_CATALOG.find(a => a.id === accId);
    return sum + (item ? item.priceBdt : 0);
  }, 0);

  const subTotal = activeDevice.priceBdt + activePlan.priceBdt + accessoriesTotal;
  
  // Cashless Incentive Discount
  let discountAmount = 0;
  if (paymentMethod === 'advance_online') discountAmount = 200;
  else if (paymentMethod === 'after_install_online') discountAmount = 100;
  if (referralCode.trim().length >= 4) discountAmount += 100;

  const totalAmount = Math.max(0, subTotal - discountAmount);

  const toggleAccessory = (id: string) => {
    setSelectedAccessories(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !fatherName.trim() || !motherName.trim() || !deliveryAddress.trim()) {
      alert('দয়া করে আপনার নাম, মোবাইল নম্বর, পিতার নাম, মাতার নাম এবং ঠিকানা পূরণ করুন।');
      return;
    }

    setIsSubmitting(true);
    const newOrder = {
      orderId: `ORD-${Date.now().toString().slice(-5)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      sos2: sos2.trim(),
      sos3: sos3.trim(),
      deliveryAddress: deliveryAddress.trim(),
      district,
      referralCode: referralCode.trim(),
      device: activeDevice,
      subscriptionPlan: activePlan,
      accessories: selectedAccessories.map(id => ACCESSORIES_CATALOG.find(a => a.id === id)),
      paymentMethod,
      subTotal,
      discountAmount,
      totalAmount,
      orderDate: new Date().toISOString(),
      orderStatus: 'PENDING_TECHNICIAN_DISPATCH',
      installationStatus: 'UNASSIGNED',
      escrowHandshakeStatus: 'PENDING_INSTALLATION',
      assignedTech: null
    };

    // Save to persistent storage for Support / Admin / Technician Sync
    const existingOrders = JSON.parse(localStorage.getItem('gps_device_orders') || '[]');
    localStorage.setItem('gps_device_orders', JSON.stringify([newOrder, ...existingOrders]));

    setTimeout(() => {
      setIsSubmitting(false);
      setCreatedOrder(newOrder);
      setOrderStep('success');
      if (onOrderSuccess) onOrderSuccess(newOrder);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-4 animate-in fade-in select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 text-blue-400 border border-blue-500/50 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-white">
                  🛒 ডিভাইস স্টোর ও টেলকো সাবস্ক্রিপশন বুকিং
                </h3>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  DOORSTEP SETUP
                </span>
              </div>
              <p className="text-[10.5px] text-slate-400">
                লগইন ছাড়াই সহজে নিজের গাড়ির জন্য ডিভাইস অর্ডার করুন ও টেকনিশিয়ান ইনস্টলেশন নিন
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

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          
          {orderStep === 'browse' && (
            <div className="space-y-4">
              
              {/* Step 1: Vehicle Category Selector */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">১</span>
                    <span>আপনার গাড়ির ধরন নির্বাচন করুন (Select Vehicle Type)</span>
                  </span>
                  <span className="text-[10px] text-blue-400 font-mono">৪টি ক্যাটাগরি</span>
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {DEVICE_CATALOG.map((item) => {
                    const isSelected = selectedCategory === item.category;
                    return (
                      <button
                        key={item.category}
                        type="button"
                        onClick={() => setSelectedCategory(item.category)}
                        className={`p-3 rounded-2xl border text-left flex items-center space-x-3 transition active:scale-95 ${
                          isSelected
                            ? 'bg-blue-950/80 border-2 border-blue-400 shadow-lg shadow-blue-950/80 ring-1 ring-blue-500/40'
                            : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                        }`}
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center p-1 shrink-0 ${isSelected ? 'bg-slate-900 border border-blue-400/60' : 'bg-slate-900'}`}>
                          <div dangerouslySetInnerHTML={{ __html: getVehicleMarkerSvg(item.category, isSelected ? '#3b82f6' : '#94a3b8') }} className="w-full h-full" />
                        </div>
                        <div className="min-w-0">
                          <span className={`text-xs font-black block truncate ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                            {item.category === 'motorcycle' ? 'বাইক / স্কুটার' : item.category === 'car' ? 'প্রাইভেট কার / SUV' : item.category === 'cng' ? 'সিএনজি / অটো' : 'ট্রাক / বাস'}
                          </span>
                          <span className="text-[10.5px] font-mono font-bold text-emerald-400 block mt-0.5">
                            ৳ {item.priceBdt.toLocaleString()}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Device Showcase Card */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[9.5px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full uppercase">
                        {activeDevice.badgeBn}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">ID: {activeDevice.id}</span>
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-white mt-1">
                      {activeDevice.titleBn}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {activeDevice.descriptionBn}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0 bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 line-through block font-mono">
                      মার্কেট প্রাইস ৳ {activeDevice.marketPriceBdt.toLocaleString()}
                    </span>
                    <span className="text-lg sm:text-xl font-mono font-black text-emerald-400 block">
                      ৳ {activeDevice.priceBdt.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800">
                      ইনস্টলেশন সহ
                    </span>
                  </div>
                </div>

                {/* Device Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeDevice.featuresBn.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-xs text-slate-200 bg-slate-950/60 p-2 rounded-xl border border-slate-800/60">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Custom Accessories Picker */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">২</span>
                    <span>প্রয়োজনীয় এক্সেসরিজ নির্বাচন করুন (Optional Accessories)</span>
                  </span>
                  <span className="text-[10px] text-amber-400">কাস্টমাইজ করুন</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ACCESSORIES_CATALOG.map((acc) => {
                    const isChecked = selectedAccessories.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => toggleAccessory(acc.id)}
                        className={`p-3 rounded-2xl border text-left flex items-start space-x-3 transition active:scale-95 ${
                          isChecked
                            ? 'bg-blue-950/40 border-blue-500/70 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span className="text-xl p-1.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0">{acc.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-100">{acc.nameBn}</span>
                            <span className="font-mono font-bold text-xs text-emerald-400">+ ৳{acc.priceBdt}</span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{acc.descBn}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Telco-Style Subscription Model */}
              <div>
                <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center justify-between mb-2">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px]">৩</span>
                    <span>টেলকো সাবস্ক্রিপশন প্ল্যান বাছাই করুন (Subscription Model)</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">রোমিং সিম ডেটা সহ</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {TELCO_SUBSCRIPTION_PLANS.map((plan) => {
                    const isPlanSelected = selectedPlanId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3.5 rounded-3xl border text-left flex flex-col justify-between transition active:scale-95 relative overflow-hidden ${
                          isPlanSelected
                            ? 'bg-gradient-to-b from-blue-900/60 via-slate-900 to-slate-900 border-2 border-blue-400 shadow-xl ring-1 ring-blue-500/40'
                            : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                        }`}
                      >
                        {plan.badgeBn && (
                          <div className="absolute top-2 right-2">
                            <span className="text-[8.5px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono uppercase">
                              {plan.badgeBn}
                            </span>
                          </div>
                        )}

                        <div>
                          <span className={`text-xs font-black block ${isPlanSelected ? 'text-white' : 'text-slate-200'}`}>
                            {plan.titleBn}
                          </span>
                          <div className="flex items-baseline space-x-1 mt-1">
                            <span className="text-lg font-mono font-black text-emerald-400">৳ {plan.priceBdt}</span>
                            <span className="text-[10px] text-slate-400">/ {plan.durationMonths} মাস</span>
                          </div>
                          {plan.savingsBn && (
                            <span className="text-[9.5px] font-bold text-amber-300 block mt-0.5">
                              ✨ {plan.savingsBn}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1">
                          {plan.featuresBn.map((f, i) => (
                            <div key={i} className="text-[10px] text-slate-300 flex items-center space-x-1">
                              <Check className="w-3 h-3 text-blue-400 shrink-0" />
                              <span className="truncate">{f}</span>
                            </div>
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Summary & Proceed Button */}
              <div className="bg-slate-950 border border-blue-500/40 rounded-3xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
                <div>
                  <div className="text-xs text-slate-400">সর্বমোট প্রাক্কলিত মূল্য (Device + Plan + Setup):</div>
                  <div className="text-xl sm:text-2xl font-mono font-black text-emerald-400">
                    ৳ {subTotal.toLocaleString()}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setOrderStep('checkout')}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <span>ইনস্টলেশন তথ্য পূরণ ও অর্ডার করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Step 2: Checkout & Mandatory KYC Details Form */}
          {orderStep === 'checkout' && (
            <form onSubmit={handlePlaceOrder} className="space-y-4">
              
              {/* Back to Catalog */}
              <button
                type="button"
                onClick={() => setOrderStep('browse')}
                className="text-xs font-bold text-blue-400 hover:underline flex items-center space-x-1"
              >
                <span>⬅️ প্যাকেজ পরিবর্তনে ফিরে যান</span>
              </button>

              {/* Mandatory Family KYC Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                      গ্রাহক ও পারিবারিক পরিচিতি (Mandatory Family KYC)
                    </span>
                  </div>
                  <span className="text-[9px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">
                    SECURE KYC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-300 block mb-1">
                      আপনার পুরো নাম (Customer Full Name) *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="যেমন: মো: আজহার উদ্দিন"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">
                      মোবাইল নম্বর (Customer Phone) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+880 17XXXXXXXX"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Mandatory Father & Mother Name for Rescue Hotline & Police Verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-blue-500/30 space-y-1">
                    <label className="text-[11px] font-extrabold text-blue-300 flex items-center justify-between">
                      <span>👤 পিতার নাম (Father's Name) *</span>
                      <span className="text-[9px] text-amber-400 font-bold uppercase">বাধ্যতামূলক</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="পিতার পুরো নাম লিখুন"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-[9px] text-slate-400 block">রেসকিউ হটলাইন ও পুলিশ জিডি ভেরিফিকেশনে ব্যবহৃত হবে</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-blue-500/30 space-y-1">
                    <label className="text-[11px] font-extrabold text-blue-300 flex items-center justify-between">
                      <span>👤 মাতার নাম (Mother's Name) *</span>
                      <span className="text-[9px] text-amber-400 font-bold uppercase">বাধ্যতামূলক</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="মাতার পুরো নাম লিখুন"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-[9px] text-slate-400 block">জরুরি মালিকানা ও রেসকিউ বাইপাসে প্রয়োজনীয়</span>
                  </div>
                </div>

                {/* Optional Highlighted SOS Numbers Card */}
                <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-300 flex items-center space-x-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                      <span>🚨 জরুরি ক্র্যাশ এলার্ট ও ব্যাকআপ নম্বর (SOS ২ ও ৩ - ঐচ্ছিক কিন্তু গুরুত্বপূর্ণ)</span>
                    </span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
                      হাইলাইটেড
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="tel"
                      value={sos2}
                      onChange={(e) => setSos2(e.target.value)}
                      placeholder="SOS 2: +880 18XXXXXXXX (পিতা/মাতা/স্ত্রী)"
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-100 font-mono focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={sos3}
                      onChange={(e) => setSos3(e.target.value)}
                      placeholder="SOS 3: +880 19XXXXXXXX (ভাই/অভিভাবক)"
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-2 text-xs text-amber-100 font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address & Referral Code */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                    ইনস্টলেশন ঠিকানা ও রেফারেল (Doorstep Location)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-300 block mb-1">
                      ইনস্টলেশন ঠিকানা (বাসা/অফিস/গ্যারেজ ঠিকানা) *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="যেমন: বাড়ি ১২, রোড ৪, ব্লক-সি, বনশ্রী, রামপুরা, ঢাকা"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-slate-300 block mb-1">জেলা (District) *</label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                    >
                      <option value="ঢাকা">ঢাকা</option>
                      <option value="চট্টগ্রাম">চট্টগ্রাম</option>
                      <option value="সিলেট">সিলেট</option>
                      <option value="রাজশাহী">রাজশাহী</option>
                      <option value="খুলনা">খুলনা</option>
                      <option value="বরিশাল">বরিশাল</option>
                      <option value="রংপুর">রংপুর</option>
                      <option value="ময়মনসিংহ">ময়মনসিংহ</option>
                      <option value="গাজীপুর">গাজীপুর</option>
                      <option value="নারায়ণগঞ্জ">নারায়ণগঞ্জ</option>
                    </select>
                  </div>
                </div>

                {/* Referral Promo Code */}
                <div className="pt-1">
                  <label className="text-xs text-slate-400 block mb-1">রেফারেল কোড (Referral Code - যদি থাকে)</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                      placeholder="যেমন: FRIEND100"
                      className="w-full sm:w-64 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono uppercase focus:outline-none focus:border-emerald-400"
                    />
                    {referralCode.trim().length >= 4 && (
                      <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>৳ ১০০ ডিসকাউন্ট প্রযোজ্য!</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Payment Method Selection with Cashless Incentive */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                      পেমেন্ট পদ্ধতি বাছাই করুন (Payment Method)
                    </span>
                  </div>
                  <span className="text-[10px] text-amber-300 font-bold">ক্যাশলেস বোনাস অফার</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('advance_online')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 ${
                      paymentMethod === 'advance_online'
                        ? 'bg-emerald-950/60 border-2 border-emerald-400 shadow-lg ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-300">অ্যাডভান্স অনলাইন পে</span>
                        <span className="text-[9px] bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 px-1.5 py-0.2 rounded font-bold">
                          - ৳ ২০০ ছাড়
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 mt-1">বিকাশ / নগদ / কার্ড / বাংলা কিউআর</p>
                    </div>
                    <span className="text-[9.5px] font-bold text-amber-300 mt-2 block">🎁 + ১ মাস এক্সট্রা ফ্রি সার্ভিস!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('after_install_online')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 ${
                      paymentMethod === 'after_install_online'
                        ? 'bg-blue-950/60 border-2 border-blue-400 shadow-lg ring-1 ring-blue-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-300">ইনস্টলেশনের পর অনলাইন পে</span>
                        <span className="text-[9px] bg-blue-500/30 text-blue-200 border border-blue-500/50 px-1.5 py-0.2 rounded font-bold">
                          - ৳ ১০০ ছাড়
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-300 mt-1">টেকনিশিয়ান কাজ শেষ করলে কিউআর কোডে পে করবেন</p>
                    </div>
                    <span className="text-[9.5px] font-bold text-emerald-400 mt-2 block">✨ ক্যাশলেস সহজ ও নিরাপদ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_install')}
                    className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 ${
                      paymentMethod === 'cash_on_install'
                        ? 'bg-slate-800 border-2 border-slate-500 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-slate-200">ক্যাশ অন ইনস্টলেশন</span>
                      <p className="text-[10px] text-slate-400 mt-1">টেকনিশিয়ান কাজ শেষ করলে নগদ টাকায় পে করবেন</p>
                    </div>
                    <span className="text-[9.5px] font-mono text-slate-400 mt-2 block">নিয়মিত মূল্য</span>
                  </button>
                </div>
              </div>

              {/* Escrow Guarantee Notice */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-[11px] text-slate-300 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>২-ওয়ে ভেরিফাইড ইনস্টলেশন গ্যারান্টি:</strong> টেকনিশিয়ান এসে সফলভাবে ডিভাইস ইনস্টল করে আপনাকে টেস্ট করিয়ে দেওয়া পর্যন্ত আপনার বুকিং ও পেমেন্ট ১০০% সিকিউরড থাকবে। আপনি নিজে অ্যাপে কনফার্মেশন চাপলেই কেবল টেকনিশিয়ানের কাজ চূড়ান্ত সম্পন্ন হবে।
                </span>
              </div>

              {/* Final Total & Submit Button */}
              <div className="p-4 bg-slate-950 rounded-3xl border border-blue-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
                <div>
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <span>মূল মূল্য: ৳{subTotal.toLocaleString()}</span>
                    {discountAmount > 0 && <span className="text-emerald-400 font-bold">(-৳{discountAmount} ডিসকাউন্ট)</span>}
                  </div>
                  <div className="text-2xl font-mono font-black text-emerald-400">
                    পরিশোধযোগ্য: ৳ {totalAmount.toLocaleString()}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  {isSubmitting ? (
                    <span>অর্ডার প্রসেস হচ্ছে...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>অর্ডার প্লেস করুন (Confirm Order)</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

          {/* Step 3: Order Success & 2-Way Handshake Status */}
          {orderStep === 'success' && createdOrder && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full uppercase">
                  অর্ডার সফলভাবে গৃহীত হয়েছে
                </span>
                <h3 className="text-xl font-black text-white mt-2">
                  ধন্যবাদ, {createdOrder.customerName}!
                </h3>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  বুকিং রেফারেন্স নম্বর: <strong className="text-blue-400">{createdOrder.orderId}</strong>
                </p>
              </div>

              {/* Order Receipt Details */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs text-left space-y-2 max-w-lg mx-auto">
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">ডিভাইস ও প্যাকেজ:</span>
                  <span className="font-bold text-slate-100">{createdOrder.device.titleBn}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">সাবস্ক্রিপশন প্ল্যান:</span>
                  <span className="font-bold text-amber-300">{createdOrder.subscriptionPlan.titleBn}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">ইনস্টলেশন ঠিকানা:</span>
                  <span className="font-bold text-slate-200">{createdOrder.deliveryAddress}, {createdOrder.district}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-slate-400">পেমেন্ট মেথড:</span>
                  <span className="font-bold text-emerald-400">
                    {createdOrder.paymentMethod === 'advance_online' ? 'অ্যাডভান্স অনলাইন পে (ভেরিফাইড)' :
                     createdOrder.paymentMethod === 'after_install_online' ? 'ইনস্টলেশন শেষে অনলাইন পে' : 'ক্যাশ অন ইনস্টলেশন'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm">
                  <span className="font-bold text-slate-300">মোট পরিশোধযোগ্য:</span>
                  <span className="font-mono font-black text-emerald-400">৳ {createdOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Live Technician Dispatch Pipeline */}
              <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-4 max-w-lg mx-auto text-left space-y-2">
                <div className="text-xs font-bold text-blue-300 flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                  <span>পরবর্তী পদক্ষেপ (Next Steps):</span>
                </div>
                <ul className="text-[11px] text-slate-300 space-y-1.5">
                  <li>১. সাপোর্ট টিম থেকে আপনার ঠিকানায় নিকটস্থ ফিল্ড টেকনিশিয়ান অ্যাসাইন করা হবে।</li>
                  <li>২. টেকনিশিয়ান আপনার ঠিকানায় গিয়ে ডিভাইস ইনস্টলেশন ও ট্র্যাকার অ্যাক্টিভেশন সম্পন্ন করবে।</li>
                  <li>৩. আপনি অ্যাপে লাইভ গাড়ি দেখে <strong>"✅ ইনস্টলেশন সম্পন্ন ও সন্তুষ্ট"</strong> কনফার্ম করবেন।</li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
                >
                  ঠিক আছে, বন্ধ করুন
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
