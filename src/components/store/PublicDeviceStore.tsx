import React, { useState, useEffect } from 'react';
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
  ArrowLeft,
  X, 
  Flame, 
  Gift, 
  User, 
  PhoneCall, 
  Clock, 
  Sliders,
  Radio,
  Lock,
  ChevronRight,
  ShieldAlert,
  Video,
  Navigation,
  Crosshair,
  Building2,
  Wrench,
  AlertTriangle,
  Info
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
  hasVideoCapability?: boolean;
}

export const ALL_VEHICLE_CATEGORIES: { type: VehicleType; labelBn: string; countText: string }[] = [
  { type: 'motorcycle', labelBn: 'বাইক (Motorcycle)', countText: '৩টি ডিভাইস' },
  { type: 'scooter', labelBn: 'স্কুটার (Scooty)', countText: '২টি ডিভাইস' },
  { type: 'car', labelBn: 'প্রাইভেট কার / SUV', countText: '৩টি ডিভাইস' },
  { type: 'ambulance', labelBn: 'অ্যাম্বুলেন্স (Emergency)', countText: '১টি ডিভাইস' },
  { type: 'cng', labelBn: 'সিএনজি (3-Wheeler)', countText: '২টি ডিভাইস' },
  { type: 'auto', labelBn: 'অটো রিকশা (Easy-Bike)', countText: '১টি ডিভাইস' },
  { type: 'pickup', labelBn: 'পিকআপ / ৪x৪', countText: '২টি ডিভাইস' },
  { type: 'truck', labelBn: 'ট্রাক / লরি', countText: '২টি ডিভাইস' },
  { type: 'bus', labelBn: 'বাস / কোচ', countText: '২টি ডিভাইস' },
  { type: 'bicycle', labelBn: 'বাইসাইকেল (Bicycle)', countText: '১টি ডিভাইস' }
];

export const DEVICE_CATALOG: DeviceCatalogItem[] = [
  // 🏍️ Bike Devices
  {
    id: 'dev_bike_mini',
    category: 'motorcycle',
    titleBn: 'ইজিট্র্যাকার ৪জি মিনি ওয়াটারপ্রুফ প্রো',
    titleEn: 'EasyTracker 4G Mini Waterproof Pro',
    badgeBn: 'বেস্ট সেলার (বাইক)',
    priceBdt: 2499,
    marketPriceBdt: 3500,
    descriptionBn: 'স্পোর্টস বাইকের জন্য কম ব্যাটারি খরচ ও সম্পূর্ণ ওয়াটারপ্রুফ আইপি৬৭।',
    featuresBn: [
      '⚡ ১-ট্যাপ রিমোট ইঞ্জিন কাট-অফ রিলে',
      '🔋 আল্ট্রা-লো ব্যাটারি ড্রেইন প্রোটেকশন',
      '🚨 ভাইব্রেশন ও অ্যান্টি-থেফট অ্যালার্ম',
      '📡 ৪জি সুপারফাস্ট জিপিএস ও লাইভ ট্র্যাকিং'
    ],
    recommendedForBn: 'সকল ব্র্যান্ডের মোটরসাইকেল'
  },
  {
    id: 'dev_bike_dualsim',
    category: 'motorcycle',
    titleBn: 'ইজিট্র্যাকার ৪জি ডুয়াল-সিম আল্ট্রা গার্ড',
    titleEn: 'EasyTracker 4G Dual-SIM Ultra Guard',
    badgeBn: 'হাই-সিকিউরিটি প্রো',
    priceBdt: 2999,
    marketPriceBdt: 4200,
    descriptionBn: 'গ্রাম ও পাহাড়ি অঞ্চলের জন্য রোমিং ডুয়াল-সিম ও বিল্ট-ইন লাউড সাইরেন।',
    featuresBn: [
      '📶 ডুয়াল-সিম অটো নেটওয়ার্ক ফেইলওভার',
      '📢 বিল্ট-ইন অ্যান্টি-থেফট সাইরেন এলার্ট',
      '🛑 রিমোট ইঞ্জিন কাট ও ইমোবিলাইজার',
      '🛡️ ৩ দিন ইন্টারনাল ব্যাটারি ব্যাকআপ'
    ],
    recommendedForBn: 'হাইওয়ে ও প্রিমিয়াম স্পোর্টস বাইক'
  },
  {
    id: 'dev_bike_obd',
    category: 'motorcycle',
    titleBn: 'ইজিট্র্যাকার স্মার্ট প্লাগ-অ্যান্ড-প্লে ওবিডি',
    titleEn: 'EasyTracker Smart Plug & Play OBD',
    badgeBn: 'নো-ওয়্যার কাট',
    priceBdt: 3299,
    marketPriceBdt: 4500,
    descriptionBn: 'বাইকের কোনো তার কাটা ছাড়াই সরাসরি সকেটে প্লাগ ইন ইনস্টলেশন।',
    featuresBn: [
      '🔌 ০% তার কাটার ঝুঁকি নেই (ওয়ারেন্টি নষ্ট হবে না)',
      '⚡ ১ সেকেন্ড ইনস্টলেশন',
      '📡 ৪জি লাইভ স্পিড ও ট্র্যাকিং',
      '🔋 বাইক ব্যাটারি ভোল্টেজ অডিট'
    ],
    recommendedForBn: 'নতুন শোরুমের বাইক ও স্কুটার'
  },

  // 🛵 Scooter Devices
  {
    id: 'dev_scoot_mini',
    category: 'scooter',
    titleBn: 'ইজিট্র্যাকার স্কুটার গার্ড ৪জি',
    titleEn: 'EasyTracker Scooter Guard 4G',
    badgeBn: 'স্কুটার স্পেশাল',
    priceBdt: 2499,
    marketPriceBdt: 3500,
    descriptionBn: 'লেডি স্কুটি ও গিয়ারলেস স্কুটারের ফ্রন্ট প্যানেলে লুকানোর উপযোগী।',
    featuresBn: ['⚡ রিমোট ইঞ্জিন কাট', '🌧️ আইপি৬৭ ওয়াটারপ্রুফ', '🚨 ট্যাম্পার এলার্ট', '📡 লাইভ ম্যাপ ট্র্যাকিং'],
    recommendedForBn: 'সুজুকি এক্সেস, হোন্ডা ডিও, ভেসপা'
  },
  {
    id: 'dev_scoot_smart',
    category: 'scooter',
    titleBn: 'ইজিট্র্যাকার স্মার্ট স্কুটি প্লাগ ৪জি',
    titleEn: 'EasyTracker Smart Scooty Plug 4G',
    badgeBn: 'প্লাগ অ্যান্ড প্লে',
    priceBdt: 3100,
    marketPriceBdt: 4200,
    descriptionBn: 'সহজ ইনস্টলেশন ও অটো-স্লিপ মোড সমৃদ্ধ স্কুটার ট্র্যাকার।',
    featuresBn: ['🔌 তার কাটা ছাড়াই ইনস্টলেশন', '🔋 অটো স্লিপ ব্যাটারি সেভার', '🛑 রিমোট লক', '🚨 ভাইব্রেশন এলার্ট'],
    recommendedForBn: 'সকল ব্র্যান্ডের স্কুটি'
  },

  // 🚗 Private Car Devices
  {
    id: 'dev_car_fleet',
    category: 'car',
    titleBn: 'ইজিট্র্যাকার ৪জি কনসিল্ড স্মার্ট ফ্লিট',
    titleEn: 'EasyTracker 4G Concealed Smart Fleet',
    badgeBn: 'প্রিমিয়াম সিকিউরিটি',
    priceBdt: 3499,
    marketPriceBdt: 4800,
    descriptionBn: 'লুকানো ওয়্যারিং, এসি সেন্সর ও ডোর সেন্সর কানেকশন সহ প্রাইভেট কারের জন্য সেরা ট্র্যাকার।',
    featuresBn: [
      '🛑 রিমোট ইঞ্জিন কাট ও অ্যান্টি-হাইজ্যাক মোড',
      '❄️ ডিজিটাল এসি অন/অফ ট্র্যাকিং',
      '🚪 ডোর ওপেন/ক্লোজ সেন্সর সাপোর্ট',
      '🛡️ ৩০ দিনের ট্রিপ ও রুট প্লেব্যাক'
    ],
    recommendedForBn: 'প্রাইভেট কার, সেডান ও এসইউভি'
  },
  {
    id: 'dev_car_dashcam',
    category: 'car',
    titleBn: 'ইজিট্র্যাকার ৪জি এআই ডুয়াল ড্যাশ-ক্যাম + লাইভ ভিডিও',
    titleEn: 'EasyTracker 4G AI Dual Dashcam + Live Cloud',
    badgeBn: 'ভিডিও ক্লাউড প্রো',
    priceBdt: 7500,
    marketPriceBdt: 10500,
    hasVideoCapability: true,
    descriptionBn: 'সামনে ও কেবিনের লাইভ ভিডিও স্ট্রিমিং, ২-ওয়ে ভয়েস টক ও ৪জি জিপিএস ট্র্যাকার এক ডিভাইসে।',
    featuresBn: [
      '🎥 সামনে ও কেবিনের ১০৮০পি এইচডি লাইভ ভিডিও',
      '☁️ ক্লাউড ভিডিও স্টোরেজ ও ক্র্যাশ ক্লিপ অটো সেভ',
      '🎙️ ২-ওয়ে অডিও লাইভ ইন্টারকম',
      '🛑 রিমোট ইঞ্জিন লক ও জিপিএস লাইভ ম্যাপ'
    ],
    recommendedForBn: 'প্রাইভেট কার, উবার, রেন্ট-এ-কার ও ফ্যামিলি কার'
  },
  {
    id: 'dev_car_obd',
    category: 'car',
    titleBn: 'ইজিট্র্যাকার ৪জি ওবিডি-২ ইঞ্জিন ডায়াগনস্টিক',
    titleEn: 'EasyTracker 4G OBD-II Engine Diagnostics',
    badgeBn: 'স্মার্ট কার কানেক্ট',
    priceBdt: 3999,
    marketPriceBdt: 5500,
    descriptionBn: 'গাড়ির ওবিডি পোর্টে লাগিয়ে ইঞ্জিন ফল্ট কোড ও ফুয়েল হিসাব দেখুন।',
    featuresBn: ['🔌 ০% তার কাটার ঝামেলা নেই', '🔧 ইঞ্জিন চেক লাইট ও ফল্ট কোড ডিটেকশন', '⛽ মাইলেজ ও ট্রিপ ক্যালকুলেটর', '📡 ৪জি রিয়েল-টাইম জিপিএস'],
    recommendedForBn: 'হাইব্রিড ও আধুনিক সেডান কার'
  },

  // 🚑 Ambulance
  {
    id: 'dev_amb_pro',
    category: 'ambulance',
    titleBn: 'ইজিট্র্যাকার ইমার্জেন্সি রেসপন্স ৪জি প্রো',
    titleEn: 'EasyTracker Emergency Response 4G Pro',
    badgeBn: 'জরুরি অ্যাম্বুলেন্স স্পেশাল',
    priceBdt: 4500,
    marketPriceBdt: 6000,
    descriptionBn: 'সাইরেন সেন্সিং, অক্সিজেন ও এসি মনিটরিং এবং হাসপাতাল লাইভ লিঙ্ক শেয়ারিং।',
    featuresBn: ['🚨 সাইরেন ও এসি ট্র্যাকিং', '🏥 হাসপাতাল ও পেশেন্ট লাইভ ট্র্যাকিং শেয়ার লিংক', '⚡ ৩ সেকেন্ড আল্ট্রা-ফাস্ট রিফ্রেশ', '🛑 রিমোট ইঞ্জিন কাট'],
    recommendedForBn: 'আইসিইউ ও সকল সরকারি/বেসরকারি অ্যাম্বুলেন্স'
  },

  // 🛺 CNG & Auto
  {
    id: 'dev_cng_guard',
    category: 'cng',
    titleBn: 'ইজিট্র্যাকার ৩-হুইলার হেভি গার্ড ৪জি',
    titleEn: 'EasyTracker 3-Wheeler Heavy Guard 4G',
    badgeBn: 'সিএনজি বেস্ট সেলার',
    priceBdt: 2799,
    marketPriceBdt: 3800,
    descriptionBn: 'ঢাকার রোদে-বৃষ্টিতে টেকসই মেটালিক বডি ও সহজ রিলে কন্ট্রোলযুক্ত বিশেষ ৩-হুইলার ট্র্যাকার।',
    featuresBn: ['🛑 রিমোট ইঞ্জিন লক ও দৈনিক ট্রিপ', '🌧️ আইপি৬৭ সম্পূর্ণ ওয়াটারপ্রুফ', '📊 দৈনিক মাইলেজ ও ভাড়া ক্যালকুলেটর', '🚨 ছিনতাই এলার্ট'],
    recommendedForBn: 'সিএনজি অটো-রিকশা ও লেগুনা'
  },
  {
    id: 'dev_auto_rick',
    category: 'auto',
    titleBn: 'ইজিট্র্যাকার ইজি-বাইক ৪জি প্রো',
    titleEn: 'EasyTracker Easy-Bike 4G Pro',
    badgeBn: 'ইজি-বাইক গার্ড',
    priceBdt: 2699,
    marketPriceBdt: 3600,
    descriptionBn: '৪৮-৭২ ভোল্ট ব্যাটারি সাপোর্ট সহ ইজিবাইক ট্র্যাকার।',
    featuresBn: ['⚡ ৪৮-৭২ ভোল্ট ডিরেক্ট পাওয়ার', '🛑 রিমোট ব্যাটারি লক', '📡 লাইভ ট্র্যাকিং', '🌧️ ওয়াটারপ্রুফ বডি'],
    recommendedForBn: 'ব্যাটারি চালিত অটোরিকশা ও ইজি-বাইক'
  },

  // 🚙 Pickup / SUV
  {
    id: 'dev_pickup_4x4',
    category: 'pickup',
    titleBn: 'ইজিট্র্যাকার ৪x৪ অফরোড ফ্লিট প্রো',
    titleEn: 'EasyTracker 4x4 Offroad Fleet Pro',
    badgeBn: 'হেভি ডিউটি ৪x৪',
    priceBdt: 3999,
    marketPriceBdt: 5500,
    descriptionBn: 'উচ্চ ভোল্টেজ ক্ষমতা ও রাগড মেটালিক বডি পিকআপ ট্র্যাকার।',
    featuresBn: ['🛑 রিমোট ইঞ্জিন কাট', '❄️ এসি সেন্সর', '🚪 ডোর সেন্সর', '🛡️ অফরোড ভাইব্রেশন ফিল্টার'],
    recommendedForBn: 'হাইলাক্স, ডি-ম্যাক্স ও সকল ৪x৪ পিকআপ'
  },

  // 🚛 Truck / Lorry
  {
    id: 'dev_truck_heavy',
    category: 'truck',
    titleBn: 'ইজিট্র্যাকার হেভি কমার্শিয়াল ৯-৯০ ভোল্ট + ফুয়েল রড সাপোর্ট',
    titleEn: 'EasyTracker Heavy Commercial 9-90V',
    badgeBn: 'হেভি ট্রাক ও ফুয়েল স্পেশাল',
    priceBdt: 5999,
    marketPriceBdt: 7500,
    descriptionBn: 'ডিজেল চুরি রোধে ফুয়েল রড কানেকশন ও ৯-৯০ ভোল্ট হেভি কমার্শিয়াল টেলিমেটিক্স।',
    featuresBn: [
      '⛽ আল্ট্রাসনিক ফুয়েল সেন্সর রড কানেকশন',
      '⚡ ৯-৯০ ভোল্ট পাওয়ার সহ্যক্ষমতা',
      '🚨 ওভার-স্পিড ও হার্শ ব্রেকিং অডিট রিপোর্ট',
      '🏛️ বিআরটিএ ও বিটিআরসি অনুমোদিত'
    ],
    recommendedForBn: 'ট্রাক, ট্রেইলার, প্রাইম মুভার ও কভার্ডভ্যান'
  },
  {
    id: 'dev_truck_mdvr360',
    category: 'truck',
    titleBn: 'ইজিট্র্যাকার ৪-চ্যানেল ৩৬০° এডিএএস ড্যাশ-ক্যাম এমডিভিআর',
    titleEn: 'EasyTracker 4-Channel 360 ADAS MDVR',
    badgeBn: 'আল্ট্রা ফ্ল্যাগশিপ ফ্লিট',
    priceBdt: 16500,
    marketPriceBdt: 22000,
    hasVideoCapability: true,
    descriptionBn: '৪টি ক্যামেরা দিয়ে চারপাশের লাইভ ভিডিও স্ট্রিমিং ও ড্রাইভার স্লিপ এলার্ট।',
    featuresBn: [
      '🎥 ৪টি ক্যামেরায় ৩৬০° লাইভ ভিডিও স্ট্রিমিং',
      '👁️ ড্রাইভার ড্রাউজিনেস (ঘুম) এআই এলার্ট',
      '⛽ লাইভ ফুয়েল ও জিপিএস স্পিড ডেটা',
      '☁️ ক্লাউড ভিডিও ব্যাকআপ ও এসএসডি সাপোর্ট'
    ],
    recommendedForBn: 'অয়েল ট্যাংকার, লং-রুট হেভি কার্গো ও লরি'
  },

  // 🚌 Bus / Coach
  {
    id: 'dev_bus_fleet',
    category: 'bus',
    titleBn: 'ইজিট্র্যাকার বাস টেলিমেটিক্স প্রো',
    titleEn: 'EasyTracker Bus Telematics Pro',
    badgeBn: 'প্যাসেঞ্জার কোচ স্পেশাল',
    priceBdt: 6999,
    marketPriceBdt: 8500,
    descriptionBn: 'যাত্রী সুরক্ষা, ওভার-স্পিড অ্যালার্ম ও লাইভ ট্র্যাকিং।',
    featuresBn: ['🛑 রিমোট ইঞ্জিন লক', '❄️ এসি অন/অফ ট্র্যাকিং', '⚡ ওভার-স্পিড অটো সাইরেন', '🏛️ বিআরটিএ কমপ্লায়েন্ট'],
    recommendedForBn: 'আন্তঃজেলা ও সিটি বাস'
  },

  // 🚲 Bicycle
  {
    id: 'dev_bike_stealth',
    category: 'bicycle',
    titleBn: 'ইজিট্র্যাকার সাইকেল স্টিলথ টেইল-লাইট জিপিএস',
    titleEn: 'EasyTracker Bicycle Stealth Taillight GPS',
    badgeBn: 'লুকানো সাইকেল ট্র্যাকার',
    priceBdt: 1999,
    marketPriceBdt: 2800,
    descriptionBn: 'সাইকেলের পেছনের লাল বাতির ভেতরে লুকানো রিচার্জেবল জিপিএস ট্র্যাকার।',
    featuresBn: ['💡 আসল ওয়ার্কিং টেইল-লাইট লুক', '🔋 ২৫ দিন রিচার্জেবল ব্যাটারি ব্যাকআপ', '🚨 মোশন ও মুভমেন্ট এলার্ট', '📡 লাইভ জিপিএস'],
    recommendedForBn: 'এমটিবি, রোড বাইক ও সাইকেল'
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
  type: 'tracking' | 'video' | 'myplanner';
  titleBn: string;
  durationMonths: number;
  priceBdt: number;
  monthlyEquivalentBdt: number;
  savingsBn?: string;
  badgeBn?: string;
  featuresBn: string[];
}

export const SUBSCRIPTION_PLANS: TelcoSubscriptionPlan[] = [
  // 📡 GPS Tracking Plans
  {
    id: 'sub_monthly',
    type: 'tracking',
    titleBn: 'স্ট্যান্ডার্ড মাসিক ট্র্যাকিং',
    durationMonths: 1,
    priceBdt: 350,
    monthlyEquivalentBdt: 350,
    featuresBn: ['২৪/৭ লাইভ জিপিএস ট্র্যাকিং', '১০ সেকেন্ড রিয়েল-টাইম রিফ্রেশ', 'টেলকো রোমিং ডেটা সিম অন্তর্ভুক্ত']
  },
  {
    id: 'sub_half_yearly',
    type: 'tracking',
    titleBn: '৬ মাসের সেভার ট্র্যাকিং',
    durationMonths: 6,
    priceBdt: 1800,
    monthlyEquivalentBdt: 300,
    savingsBn: '৳ ৩০০ সাশ্রয়',
    badgeBn: 'পপুলার চয়েস',
    featuresBn: ['৬ মাস অবিচ্ছিন্ন লাইভ ট্র্যাকিং', 'প্রতি মাসে ৳৫০ সাশ্রয়', 'ফ্রি এসএমএস ও পুশ অ্যালার্ট']
  },
  {
    id: 'sub_annual_ultra',
    type: 'tracking',
    titleBn: '১ বছরের আল্ট্রা ভিআইপি ট্র্যাকিং',
    durationMonths: 12,
    priceBdt: 3200,
    monthlyEquivalentBdt: 266,
    savingsBn: '২ মাস সম্পূর্ণ ফ্রি (৳ ১,০০০ সাশ্রয়)',
    badgeBn: 'বেস্ট ভ্যালু প্যাক',
    featuresBn: ['২ মাস সম্পূর্ণ ফ্রি সার্ভিস', '১ বছর রিপ্লেসমেন্ট ওয়ারেন্টি', '২৪/৭ রেড-লাইন রেসকিউ টিম সাপোর্ট']
  },

  // 🎥 Video Cloud Storage Plans
  {
    id: 'sub_video_7day',
    type: 'video',
    titleBn: '৭ দিনের ক্লাউড ভিডিও স্ট্রিমিং প্যাক',
    durationMonths: 1,
    priceBdt: 650,
    monthlyEquivalentBdt: 650,
    badgeBn: 'ভিডিও ড্যাশ-ক্যাম',
    featuresBn: ['৭ দিনের রোলিং ক্লাউড ভিডিও রেকর্ডিং', '২৪/৭ লাইভ রিমোট ভিডিও স্ট্রিমিং', 'অটো ক্র্যাশ ক্লিপ ক্লাউড ব্যাকআপ']
  },
  {
    id: 'sub_video_annual',
    type: 'video',
    titleBn: '১ বছরের ভিডিও ক্লাউড প্রো প্যাক',
    durationMonths: 12,
    priceBdt: 6500,
    monthlyEquivalentBdt: 541,
    savingsBn: '২ মাস ভিডিও স্টোরেজ ফ্রি',
    badgeBn: 'ভিআইপি ভিডিও সেভার',
    featuresBn: ['৩০ দিনের ক্লাউড ভিডিও স্টোরেজ', 'আনলিমিটেড লাইভ স্ট্রিমিং ও ২-ওয়ে টক', '১ বছর ওয়ারেন্টি ও হাই-স্পিড সিম']
  }
];

export const AUTHORIZED_WORKSHOPS = [
  { id: 'ws_dhk_1', name: 'ইজিট্র্যাকার সেন্ট্রাল টেক হাব (মতিঝিল, ঢাকা)', address: '৪২ দিলকুশা বাণিজ্যিক এলাকা, মতিঝিল, ঢাকা', phone: '01711-000111', lat: 23.7314, lng: 90.4184 },
  { id: 'ws_dhk_2', name: 'ইজিট্র্যাকার মিরপুর সার্ভিস সেন্টার', address: 'প্লট ৮, সেকশন ১০, মিরপুর, ঢাকা', phone: '01711-000222', lat: 23.8069, lng: 90.3687 },
  { id: 'ws_dhk_3', name: 'ইজিট্র্যাকার উত্তরা এক্সপ্রেস হাব', address: 'রোড ৭, সেক্টর ৪, উত্তরা, ঢাকা', phone: '01711-000333', lat: 23.8712, lng: 90.3986 },
  { id: 'ws_ctg_1', name: 'ইজিট্র্যাকার আগ্রাবাদ হাব (চট্টগ্রাম)', address: 'আগ্রাবাদ বাণিজ্যিক এলাকা, চট্টগ্রাম', phone: '01711-000444', lat: 22.3275, lng: 91.8123 }
];

export interface PublicDeviceStoreProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess?: (order: any) => void;
}

export const PublicDeviceStore: React.FC<PublicDeviceStoreProps> = ({ isOpen, onClose, onOrderSuccess }) => {
  // Step Wizard: 1 = Device, 2 = Accessories & Plans, 3 = Doorstep Location & KYC, 4 = Payment & Confirm, 5 = Success
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  const [selectedCategory, setSelectedCategory] = useState<VehicleType>('motorcycle');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('dev_bike_mini');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('sub_annual_ultra');
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(['acc_relay']);
  
  // Installation Delivery Mode: Doorstep vs Shop Pickup
  const [installMode, setInstallMode] = useState<'doorstep' | 'service_center'>('doorstep');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string>('ws_dhk_1');
  
  // GPS Location Pinning
  const [pinLat, setPinLat] = useState<number>(23.7104);
  const [pinLng, setPinLng] = useState<number>(90.4074);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [gpsDetectedText, setGpsDetectedText] = useState('ঢাকা, বাংলাদেশ (ডিফল্ট স্থানাঙ্ক)');

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
  const [inputReferralCode, setInputReferralCode] = useState('');
  const [referralSource, setReferralSource] = useState<'url' | 'manual' | 'error' | 'none'>('none');
  const [referralMessage, setReferralMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'advance_online' | 'after_install_online' | 'cash_on_install'>('advance_online');

  const [createdOrder, setCreatedOrder] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect ?ref= dynamic referral parameter from URL on load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlRef = new URLSearchParams(window.location.search).get('ref');
      if (urlRef && urlRef.trim()) {
        const cleanRef = urlRef.trim().toUpperCase();
        setReferralCode(cleanRef);
        setInputReferralCode(cleanRef);
        setReferralSource('url');
        setReferralMessage(`🔗 ডায়নামিক রেফারেল লিংক থেকে ৳১০০ নগদ ছাড় স্বয়ংক্রিয়ভাবে অ্যাক্টিভ হয়েছে! (কোড: ${cleanRef})`);
      }
    }
  }, []);

  const handleApplyManualReferral = (codeToApply: string) => {
    const clean = codeToApply.trim().toUpperCase();
    if (!clean) {
      setReferralMessage('');
      setReferralSource('none');
      setReferralCode('');
      return;
    }
    if (clean.length < 4) {
      setReferralMessage('❌ রেফারেল কোডটি কমপক্ষে ৪ অক্ষরের হতে হবে।');
      setReferralSource('error');
      setReferralCode('');
      return;
    }
    setReferralCode(clean);
    setReferralSource('manual');
    setReferralMessage(`🎉 রেফারেল কোড "${clean}" সফলভাবে অ্যাপ্লাই করা হয়েছে! আপনি পাচ্ছেন ৳১০০ ক্যাশব্যাক ছাড়।`);
  };

  // Auto select first device when category changes
  useEffect(() => {
    const matching = DEVICE_CATALOG.filter(d => d.category === selectedCategory);
    if (matching.length > 0) {
      setSelectedDeviceId(matching[0].id);
    }
  }, [selectedCategory]);

  if (!isOpen) return null;

  // Selected Item Calculations
  const compatibleDevices = DEVICE_CATALOG.filter(d => d.category === selectedCategory);
  const activeDevice = DEVICE_CATALOG.find(d => d.id === selectedDeviceId) || compatibleDevices[0] || DEVICE_CATALOG[0];
  const activePlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[2];
  const activeWorkshop = AUTHORIZED_WORKSHOPS.find(w => w.id === selectedWorkshopId) || AUTHORIZED_WORKSHOPS[0];

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

  const handleDetectGpsLocation = () => {
    setIsLocatingGps(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = parseFloat(pos.coords.latitude.toFixed(6));
          const lng = parseFloat(pos.coords.longitude.toFixed(6));
          setPinLat(lat);
          setPinLng(lng);
          setGpsDetectedText(`GPS স্থানাঙ্ক: ${lat}, ${lng} (সফলভাবে ক্যাপচার্ড)`);
          setIsLocatingGps(false);
        },
        (err) => {
          setIsLocatingGps(false);
          alert('GPS লোকেশন এক্সেস পাওয়া যায়নি। অনুগ্রহ করে ডিভাইসের লোকেশন পারমিশন দিন বা ঠিকানা লিখুন।');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setIsLocatingGps(false);
      alert('আপনার ডিভাইসে ব্রাউজার Geolocation সাপোর্ট করে না।');
    }
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !fatherName.trim() || !motherName.trim()) {
      alert('দয়া করে আপনার নাম, মোবাইল নম্বর, পিতার নাম এবং মাতার নাম পূরণ করুন।');
      return;
    }
    if (installMode === 'doorstep' && !deliveryAddress.trim()) {
      alert('দয়া করে ডোরস্টেপ ইনস্টলেশন ঠিকানা পূরণ করুন।');
      return;
    }
    setCurrentStep(4);
  };

  const handleConfirmOrder = () => {
    setIsSubmitting(true);
    const newOrder = {
      orderId: `ORD-${Date.now().toString().slice(-5)}`,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      sos2: sos2.trim(),
      sos3: sos3.trim(),
      installMode,
      deliveryAddress: installMode === 'doorstep' ? deliveryAddress.trim() : activeWorkshop.address,
      district: installMode === 'doorstep' ? district : 'ঢাকা',
      locationCoordinates: {
        lat: installMode === 'doorstep' ? pinLat : activeWorkshop.lat,
        lng: installMode === 'doorstep' ? pinLng : activeWorkshop.lng,
        mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${installMode === 'doorstep' ? pinLat : activeWorkshop.lat},${installMode === 'doorstep' ? pinLng : activeWorkshop.lng}`
      },
      workshop: installMode === 'service_center' ? activeWorkshop : null,
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
      setCurrentStep(5);
      if (onOrderSuccess) onOrderSuccess(newOrder);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4 animate-in fade-in select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Header & Close */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/50 flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-xs sm:text-sm text-white">
                  🛒 ডিভাইস স্টোর ও সাবস্ক্রিপশন বুকিং
                </h3>
                <span className="text-[8.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                  DOORSTEP SETUP
                </span>
              </div>
              <p className="text-[10px] text-slate-400">
                লগইন ছাড়াই সহজে নিজের গাড়ির জন্য ডিভাইস অর্ডার ও টেকনিশিয়ান ইনস্টলেশন নিন
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 🌟 4-Step Visual Progress Bar */}
        {currentStep !== 5 && (
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 shrink-0">
            <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-extrabold">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className={`py-1.5 px-1 rounded-xl transition flex items-center justify-center space-x-1 ${
                  currentStep === 1 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : currentStep > 1 ? 'bg-blue-950/60 text-blue-300' : 'text-slate-500 bg-slate-900/60'
                }`}
              >
                <span>১. গাড়ি ও মডেল</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className={`py-1.5 px-1 rounded-xl transition flex items-center justify-center space-x-1 ${
                  currentStep === 2 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : currentStep > 2 ? 'bg-blue-950/60 text-blue-300' : 'text-slate-500 bg-slate-900/60'
                }`}
              >
                <span>২. প্ল্যান ও এক্সেসরিজ</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className={`py-1.5 px-1 rounded-xl transition flex items-center justify-center space-x-1 ${
                  currentStep === 3 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : currentStep > 3 ? 'bg-blue-950/60 text-blue-300' : 'text-slate-500 bg-slate-900/60'
                }`}
              >
                <span>৩. ম্যাপ ও KYC</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (customerName && customerPhone && fatherName && motherName) {
                    setCurrentStep(4);
                  }
                }}
                className={`py-1.5 px-1 rounded-xl transition flex items-center justify-center space-x-1 ${
                  currentStep === 4 
                    ? 'bg-emerald-600 text-white shadow-md' 
                    : 'text-slate-500 bg-slate-900/60'
                }`}
              >
                <span>৪. পেমেন্ট ও কনফার্ম</span>
              </button>
            </div>
          </div>
        )}

        {/* Scrollable Wizard Body */}
        <div className="p-3.5 sm:p-4 overflow-y-auto space-y-3.5 flex-1">
          
          {/* ========================================================================= */}
          {/* STEP 1: 9 VEHICLE CATEGORIES & COMPATIBLE DEVICE MODELS                   */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <div className="space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-300">
                  ১.১ গাড়ির ধরন নির্বাচন করুন (৯টি ভেহিকেল ক্যাটাগরি):
                </span>
                <span className="text-[10px] text-blue-400 font-mono">DYNAMIC DB</span>
              </div>

              {/* 9 Vehicle Category Selector Horizontal Scroller */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {ALL_VEHICLE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.type;
                  return (
                    <button
                      key={cat.type}
                      type="button"
                      onClick={() => setSelectedCategory(cat.type)}
                      className={`p-2 rounded-2xl border text-center flex flex-col items-center justify-center transition active:scale-95 ${
                        isSelected
                          ? 'bg-blue-950/90 border-2 border-blue-400 shadow-md shadow-blue-950/80 ring-1 ring-blue-500/40 text-white'
                          : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850 text-slate-400'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center p-0.5 mb-1">
                        <div dangerouslySetInnerHTML={{ __html: getVehicleMarkerSvg(cat.type, isSelected ? '#3b82f6' : '#94a3b8') }} className="w-full h-full" />
                      </div>
                      <span className={`text-[10px] font-black truncate w-full ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {cat.labelBn.split(' ')[0]}
                      </span>
                      <span className="text-[8px] text-emerald-400 font-mono mt-0.5">
                        {cat.countText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Compatible Device Models for this Selected Vehicle */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-slate-300">
                    ১.২ এই গাড়ির সাথে সামঞ্জস্যপূর্ণ ডিভাইস মডেল বাছাই করুন:
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">{compatibleDevices.length}টি মডেল উপলব্ধ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {compatibleDevices.map((dev) => {
                    const isDeviceSelected = selectedDeviceId === dev.id;
                    return (
                      <button
                        key={dev.id}
                        type="button"
                        onClick={() => setSelectedDeviceId(dev.id)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 relative overflow-hidden ${
                          isDeviceSelected
                            ? 'bg-gradient-to-br from-blue-950 via-slate-900 to-slate-900 border-2 border-blue-400 shadow-lg ring-1 ring-blue-500/40'
                            : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-1 mb-1">
                            <span className="text-[8.5px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.5 rounded-full uppercase">
                              {dev.badgeBn}
                            </span>
                            {dev.hasVideoCapability && (
                              <span className="text-[8px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 px-1.5 py-0.5 rounded-full flex items-center space-x-0.5">
                                <Video className="w-2.5 h-2.5" />
                                <span>ভিডিও ড্যাশ-ক্যাম</span>
                              </span>
                            )}
                          </div>
                          <h4 className="text-xs sm:text-sm font-black text-white">
                            {dev.titleBn}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                            {dev.descriptionBn}
                          </p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between">
                          <div>
                            <span className="text-[9px] text-slate-400 line-through block font-mono">
                              মার্কেট ৳{dev.marketPriceBdt.toLocaleString()}
                            </span>
                            <span className="text-base font-mono font-black text-emerald-400">
                              ৳ {dev.priceBdt.toLocaleString()}
                            </span>
                          </div>
                          <span className={`text-[9.5px] font-bold px-2 py-1 rounded-xl border ${isDeviceSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                            {isDeviceSelected ? '✓ নির্বাচিত' : 'বাছাই করুন'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Device Feature Specs */}
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-extrabold text-blue-300 block">
                  ✨ {activeDevice.titleBn}-এর প্রধান সুবিধাসমূহ:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {activeDevice.featuresBn.map((feat, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-[10.5px] text-slate-300 bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Step Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-xl shadow-blue-600/30 flex items-center justify-center space-x-2 transition active:scale-95"
                >
                  <span>পরবর্তী: সাবস্ক্রিপশন ও এক্সেসরিজ নির্বাচন করুন</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: TELCO PLANS (TRACKING vs VIDEO) & ACCESSORIES                     */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in">
              
              {/* Subscription Plans Section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-slate-300">
                    ২.১ সাবস্ক্রিপশন প্ল্যান বাছাই করুন (Admin & MyPlanner Preset):
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold">রোমিং ডেটা সিম সহ</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {SUBSCRIPTION_PLANS.map((plan) => {
                    const isPlanSelected = selectedPlanId === plan.id;
                    return (
                      <button
                        key={plan.id}
                        type="button"
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 relative overflow-hidden ${
                          isPlanSelected
                            ? 'bg-gradient-to-b from-blue-900/60 via-slate-900 to-slate-900 border-2 border-blue-400 shadow-xl ring-1 ring-blue-500/40'
                            : 'bg-slate-950/70 border-slate-800 hover:bg-slate-900'
                        }`}
                      >
                        {/* Title & Badge Clean Alignment */}
                        <div className="flex items-start justify-between w-full mb-1">
                          <span className={`text-xs font-black block pr-2 leading-tight ${isPlanSelected ? 'text-white' : 'text-slate-200'}`}>
                            {plan.titleBn}
                          </span>
                          {plan.badgeBn && (
                            <span className="text-[8px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-1.5 py-0.5 rounded-full font-mono uppercase shrink-0">
                              {plan.badgeBn}
                            </span>
                          )}
                        </div>

                        <div>
                          <div className="flex items-baseline space-x-1 mt-0.5">
                            <span className="text-base sm:text-lg font-mono font-black text-emerald-400">৳ {plan.priceBdt}</span>
                            <span className="text-[10px] text-slate-400">/ {plan.durationMonths} মাস</span>
                          </div>
                          {plan.savingsBn && (
                            <span className="text-[9px] font-bold text-amber-300 block mt-0.5">
                              ✨ {plan.savingsBn}
                            </span>
                          )}
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                          {plan.featuresBn.map((f, i) => (
                            <div key={i} className="text-[9.5px] text-slate-300 flex items-center space-x-1">
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

              {/* Optional Accessories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black uppercase text-slate-300">
                    ২.২ প্রয়োজনীয় এক্সেসরিজ নির্বাচন করুন (ঐচ্ছিক):
                  </span>
                  <span className="text-[10px] text-amber-400">হার্ডওয়্যার কাস্টমাইজেশন</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ACCESSORIES_CATALOG.map((acc) => {
                    const isChecked = selectedAccessories.includes(acc.id);
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => toggleAccessory(acc.id)}
                        className={`p-2.5 rounded-2xl border text-left flex items-start space-x-2.5 transition active:scale-95 ${
                          isChecked
                            ? 'bg-blue-950/40 border-blue-500/70 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-900'
                        }`}
                      >
                        <span className="text-lg p-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0">{acc.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-xs text-slate-100">{acc.nameBn}</span>
                            <span className="font-mono font-bold text-xs text-emerald-400">+ ৳{acc.priceBdt}</span>
                          </div>
                          <p className="text-[9.5px] text-slate-400 mt-0.5 leading-tight">{acc.descBn}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1 transition active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-1.5 transition active:scale-95"
                >
                  <span>পরবর্তী: ম্যাপ লোকেশন ও KYC</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 3: DOORSTEP GPS PINNING vs SERVICE CENTER & MANDATORY KYC             */}
          {/* ========================================================================= */}
          {currentStep === 3 && (
            <form onSubmit={handleProceedToPayment} className="space-y-3.5 animate-in fade-in">
              
              {/* Installation Mode Selector */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-200 flex items-center space-x-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <span>ইনস্টলেশন পদ্ধতি নির্বাচন করুন (Installation Mode)</span>
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                    GEO DISPATCH
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInstallMode('doorstep')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition active:scale-95 ${
                      installMode === 'doorstep'
                        ? 'bg-blue-950/70 border-2 border-blue-400 text-white shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-lg p-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0">🏠</span>
                    <div>
                      <span className="text-xs font-black text-white block">আমার ঠিকানায় ডোরস্টেপ ইনস্টলেশন</span>
                      <span className="text-[9.5px] text-slate-400">টেকনিশিয়ান আপনার বাসা/অফিসে এসে ইনস্টল করবে</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setInstallMode('service_center')}
                    className={`p-3 rounded-2xl border text-left flex items-start space-x-2.5 transition active:scale-95 ${
                      installMode === 'service_center'
                        ? 'bg-blue-950/70 border-2 border-blue-400 text-white shadow-md'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300'
                    }`}
                  >
                    <span className="text-lg p-1 rounded-lg bg-slate-900 border border-slate-800 shrink-0">🔧</span>
                    <div>
                      <span className="text-xs font-black text-white block">সার্ভিস সেন্টারে গিয়ে ইনস্টলেশন</span>
                      <span className="text-[9.5px] text-slate-400">নিকটস্থ অথোরাইজড টেকনিশিয়ান ওয়ার্কশপে করাবেন</span>
                    </div>
                  </button>
                </div>

                {/* Option A: Doorstep GPS Location Pinning */}
                {installMode === 'doorstep' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-blue-500/30 space-y-2.5">
                    
                    {/* Important Location Advisory Alert */}
                    <div className="bg-gradient-to-r from-amber-950/60 to-slate-950 p-2.5 rounded-xl border border-amber-500/40 text-[10.5px] text-amber-200 flex items-start space-x-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>
                        <strong>⚠️ সঠিক লোকেশন সতর্কতা:</strong> অনুগ্রহ করে আপনি যেখান থেকে গাড়িতে ডিভাইস ইনস্টল করাতে চান (আপনার বাসা, অফিস বা গ্যারেজ), সেখানে অবস্থানকালে লোকেশন পিন নিশ্চিত করুন যাতে টেকনিশিয়ান গুগল ম্যাপ ট্র্যাকিং করে সরাসরি আপনার গাড়ির কাছে পৌঁছাতে পারে।
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-slate-200 block">
                          📍 গুগল ম্যাপ পিন স্থানাঙ্ক:
                        </span>
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Latitude: {pinLat}, Longitude: {pinLng}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleDetectGpsLocation}
                        disabled={isLocatingGps}
                        className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center space-x-1.5 shadow-md active:scale-95"
                      >
                        <Crosshair className={`w-3.5 h-3.5 ${isLocatingGps ? 'animate-spin' : ''}`} />
                        <span>{isLocatingGps ? 'GPS স্ক্যান হচ্ছে...' : 'আমার বর্তমান GPS লোকেশন নিন'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <div className="sm:col-span-2">
                        <label className="text-[11px] text-slate-300 block mb-1">
                          ইনস্টলেশন ঠিকানা (বাসা/অফিস/রোড নং) *
                        </label>
                        <input
                          type="text"
                          required
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="যেমন: বাড়ি ১২, রোড ৪, ব্লক-সি, বনশ্রী, রামপুরা, ঢাকা"
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-300 block mb-1">জেলা *</label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
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
                  </div>
                )}

                {/* Option B: Authorized Workshop Selector */}
                {installMode === 'service_center' && (
                  <div className="bg-slate-950 p-3 rounded-2xl border border-blue-500/30 space-y-2">
                    <label className="text-[11px] font-bold text-slate-200 block">
                      নিকটস্থ অথোরাইজড টেকনিশিয়ান সার্ভিস হাব নির্বাচন করুন:
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {AUTHORIZED_WORKSHOPS.map((ws) => {
                        const isSelected = selectedWorkshopId === ws.id;
                        return (
                          <button
                            key={ws.id}
                            type="button"
                            onClick={() => setSelectedWorkshopId(ws.id)}
                            className={`p-2.5 rounded-xl border text-left flex items-start justify-between transition ${
                              isSelected ? 'bg-blue-950/70 border-blue-400 text-white' : 'bg-slate-900/60 border-slate-800 text-slate-300'
                            }`}
                          >
                            <div>
                              <span className="text-xs font-bold text-slate-100 block">{ws.name}</span>
                              <span className="text-[10px] text-slate-400 block mt-0.5">{ws.address}</span>
                              <span className="text-[9.5px] text-emerald-400 font-mono">হেল্পলাইন: {ws.phone}</span>
                            </div>
                            <span className="text-[9px] bg-blue-600/30 text-blue-300 px-2 py-0.5 rounded font-mono">
                              ম্যাপে সংরক্ষিত
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Mandatory Family KYC Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-black uppercase text-slate-200">
                      গ্রাহক ও পারিবারিক পরিচিতি (Mandatory Family KYC)
                    </span>
                  </div>
                  <span className="text-[8.5px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-full font-bold">
                    RESCUE SECURED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
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
                    <label className="text-[11px] text-slate-300 block mb-1">
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

                {/* Mandatory Father & Mother Name for Rescue Verification */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 border-t border-slate-800">
                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-blue-500/30 space-y-1">
                    <label className="text-[11px] font-extrabold text-blue-300 flex items-center justify-between">
                      <span>👤 পিতার নাম (Father's Name) *</span>
                      <span className="text-[8.5px] text-amber-400 font-bold uppercase">বাধ্যতামূলক</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={fatherName}
                      onChange={(e) => setFatherName(e.target.value)}
                      placeholder="পিতার পুরো নাম লিখুন"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-[8.5px] text-slate-400 block">রেসকিউ হটলাইন ও পুলিশ জিডি ভেরিফিকেশনে ব্যবহৃত হবে</span>
                  </div>

                  <div className="bg-slate-950 p-2.5 rounded-2xl border border-blue-500/30 space-y-1">
                    <label className="text-[11px] font-extrabold text-blue-300 flex items-center justify-between">
                      <span>👤 মাতার নাম (Mother's Name) *</span>
                      <span className="text-[8.5px] text-amber-400 font-bold uppercase">বাধ্যতামূলক</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      placeholder="মাতার পুরো নাম লিখুন"
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-400"
                    />
                    <span className="text-[8.5px] text-slate-400 block">জরুরি মালিকানা ও রেসকিউ বাইপাসে প্রয়োজনীয়</span>
                  </div>
                </div>

                {/* Optional Highlighted SOS Numbers Card */}
                <div className="bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950 border border-amber-500/40 rounded-2xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-300 flex items-center space-x-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                      <span>🚨 জরুরি ক্র্যাশ এলার্ট ও ব্যাকআপ নম্বর (SOS ২ ও ৩ - ঐচ্ছিক)</span>
                    </span>
                    <span className="text-[8.5px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/40">
                      হাইলাইটেড
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="tel"
                      value={sos2}
                      onChange={(e) => setSos2(e.target.value)}
                      placeholder="SOS 2: +880 18XXXXXXXX (পিতা/মাতা/স্ত্রী)"
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-100 font-mono focus:outline-none"
                    />
                    <input
                      type="tel"
                      value={sos3}
                      onChange={(e) => setSos3(e.target.value)}
                      placeholder="SOS 3: +880 19XXXXXXXX (ভাই/অভিভাবক)"
                      className="w-full bg-slate-900 border border-amber-500/40 rounded-xl px-3 py-1.5 text-xs text-amber-100 font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1 transition active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-xs shadow-lg flex items-center space-x-1.5 transition active:scale-95"
                >
                  <span>পরবর্তী: পেমেন্ট ও কনফার্ম</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 4: PAYMENT SELECTION & ESCROW CONFIRMATION                           */}
          {/* ========================================================================= */}
          {currentStep === 4 && (
            <div className="space-y-3.5 animate-in fade-in">
              
              {/* Promo / Referral Code Box */}
              <div className="bg-slate-950 border border-purple-500/40 rounded-3xl p-3.5 space-y-2.5 shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-purple-300">
                    <Gift className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-black uppercase tracking-wider">
                      রেফারেল বা প্রমো কোড (Promo / Referral Code)
                    </span>
                  </div>
                  <span className="text-[9.5px] font-bold text-purple-300 bg-purple-950 px-2 py-0.5 rounded-full border border-purple-700 font-mono">
                    ৳১০০ ডিসকাউন্ট
                  </span>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputReferralCode}
                    onChange={(e) => setInputReferralCode(e.target.value.toUpperCase())}
                    placeholder="বন্ধুর রেফারেল কোড লিখুন (যেমন: EASY-0001)"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs font-mono font-bold text-purple-200 uppercase focus:outline-none focus:border-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyManualReferral(inputReferralCode)}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition active:scale-95 shadow-md shadow-purple-600/20 shrink-0"
                  >
                    অ্যাপ্লাই করুন
                  </button>
                </div>

                {/* Distinct Status Feedback: URL vs Manual vs Error */}
                {referralMessage && (
                  <div className={`p-2.5 rounded-xl border text-[11px] font-bold flex items-center space-x-2 animate-in fade-in ${
                    referralSource === 'url'
                      ? 'bg-blue-950/80 border-blue-500/60 text-blue-200'
                      : referralSource === 'manual'
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200'
                        : 'bg-rose-950/80 border-rose-500/60 text-rose-200'
                  }`}>
                    {referralSource === 'url' ? (
                      <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : referralSource === 'manual' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>{referralMessage}</span>
                  </div>
                )}
              </div>

              {/* Order Breakdown Card */}
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-3.5 space-y-2 text-xs">
                <div className="font-extrabold text-slate-200 border-b border-slate-800 pb-1.5 flex justify-between">
                  <span>অর্ডার সারাংশ (Order Summary)</span>
                  <span className="text-blue-400 font-mono">{activeDevice.titleBn}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>ডিভাইস মূল্য:</span>
                  <span className="font-mono text-slate-200">৳ {activeDevice.priceBdt.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>সাবস্ক্রিপশন ({activePlan.titleBn}):</span>
                  <span className="font-mono text-slate-200">৳ {activePlan.priceBdt.toLocaleString()}</span>
                </div>
                {accessoriesTotal > 0 && (
                  <div className="flex justify-between text-slate-400">
                    <span>এক্সেসরিজ ({selectedAccessories.length}টি):</span>
                    <span className="font-mono text-slate-200">৳ {accessoriesTotal.toLocaleString()}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800/80 pt-1">
                    <span>ক্যাশলেস / প্রোমো ডিসকাউন্ট:</span>
                    <span className="font-mono">- ৳ {discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-emerald-400 border-t border-slate-800 pt-1.5">
                  <span>পরিশোধযোগ্য মোট:</span>
                  <span className="font-mono text-base">৳ {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3.5 shadow-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase text-slate-200">
                    পেমেন্ট পদ্ধতি বাছাই করুন:
                  </span>
                  <span className="text-[9.5px] text-amber-300 font-bold">ক্যাশলেস বোনাস</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('advance_online')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 ${
                      paymentMethod === 'advance_online'
                        ? 'bg-emerald-950/60 border-2 border-emerald-400 shadow-md ring-1 ring-emerald-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-emerald-300">অ্যাডভান্স অনলাইন</span>
                        <span className="text-[8.5px] bg-emerald-500/30 text-emerald-200 border border-emerald-500/50 px-1 py-0.2 rounded font-bold">
                          -৳২০০ ছাড়
                        </span>
                      </div>
                      <p className="text-[9.5px] text-slate-300 mt-1">বিকাশ / নগদ / কার্ড / কিউআর</p>
                    </div>
                    <span className="text-[8.5px] font-bold text-amber-300 mt-1.5 block">🎁 +১ মাস ফ্রি!</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('after_install_online')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 ${
                      paymentMethod === 'after_install_online'
                        ? 'bg-blue-950/60 border-2 border-blue-400 shadow-md ring-1 ring-blue-500/40'
                        : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-blue-300">ইনস্টলেশন শেষে অনলাইন</span>
                        <span className="text-[8.5px] bg-blue-500/30 text-blue-200 border border-blue-500/50 px-1 py-0.2 rounded font-bold">
                          -৳১০০ ছাড়
                        </span>
                      </div>
                      <p className="text-[9.5px] text-slate-300 mt-1">টেকনিশিয়ান কাজ শেষ করলে কিউআর পে</p>
                    </div>
                    <span className="text-[8.5px] font-bold text-emerald-400 mt-1.5 block">✨ ক্যাশলেস সহজ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_install')}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition active:scale-95 ${
                      paymentMethod === 'cash_on_install'
                        ? 'bg-slate-800 border-2 border-slate-500 text-white'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-black text-slate-200">ক্যাশ অন ইনস্টলেশন</span>
                      <p className="text-[9.5px] text-slate-400 mt-1">টেকনিশিয়ানকে নগদ প্রদান</p>
                    </div>
                    <span className="text-[8.5px] font-mono text-slate-400 mt-1.5 block">নিয়মিত মূল্য</span>
                  </button>
                </div>
              </div>

              {/* Escrow Handshake Safety Guarantee */}
              <div className="p-3 rounded-2xl bg-slate-950 border border-emerald-500/30 text-[10.5px] text-slate-300 flex items-start space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>২-ওয়ে ভেরিফাইড ইনস্টলেশন গ্যারান্টি:</strong> টেকনিশিয়ান এসে ডিভাইস ইনস্টল ও টেস্ট করিয়ে দেওয়া পর্যন্ত আপনার পেমেন্ট ১০০% সিকিউরড থাকবে। আপনি নিজে অ্যাপে <strong>"✅ ইনস্টলেশন সম্পন্ন ও সন্তুষ্ট"</strong> কনফার্ম করার পরই কেবল টেকনিশিয়ানের লেজারে টাকা ট্রান্সফার হবে।
                </span>
              </div>

              {/* Navigation & Final Order Submit */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center space-x-1 transition active:scale-95"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>আগের ধাপ</span>
                </button>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmOrder}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 flex items-center space-x-2 transition active:scale-95"
                >
                  {isSubmitting ? (
                    <span>অর্ডার প্রক্রিয়াকরণ হচ্ছে...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>অর্ডার প্লেস করুন (৳ {totalAmount.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STEP 5: SUCCESS RECEIPT & 2-WAY HANDSHAKE PIPELINE                         */}
          {/* ========================================================================= */}
          {currentStep === 5 && createdOrder && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 text-center space-y-3.5 shadow-2xl animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-3xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-[9.5px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-0.5 rounded-full uppercase">
                  অর্ডার সফলভাবে গৃহীত হয়েছে
                </span>
                <h3 className="text-lg font-black text-white mt-1.5">
                  ধন্যবাদ, {createdOrder.customerName}!
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  বুকিং রেফারেন্স: <strong className="text-blue-400">{createdOrder.orderId}</strong>
                </p>
              </div>

              {/* Order Receipt Details */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-left space-y-1.5 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">ডিভাইস:</span>
                  <span className="font-bold text-slate-100">{createdOrder.device.titleBn}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">প্ল্যান:</span>
                  <span className="font-bold text-amber-300">{createdOrder.subscriptionPlan.titleBn}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">মোড ও ঠিকানা:</span>
                  <span className="font-bold text-slate-200 truncate max-w-[200px]">
                    {createdOrder.installMode === 'doorstep' ? `🏠 ডোরস্টেপ: ${createdOrder.deliveryAddress}` : `🔧 সার্ভিস হাব: ${createdOrder.deliveryAddress}`}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">গুগল ম্যাপ ন্যাভিগেশন:</span>
                  <a href={createdOrder.locationCoordinates.mapsUrl} target="_blank" rel="noreferrer" className="text-blue-400 underline font-mono text-[10px]">
                    📍 ম্যাপ রুট দেখুন
                  </a>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">পেমেন্ট:</span>
                  <span className="font-bold text-emerald-400">
                    {createdOrder.paymentMethod === 'advance_online' ? 'অ্যাডভান্স অনলাইন পে (ভেরিফাইড)' :
                     createdOrder.paymentMethod === 'after_install_online' ? 'ইনস্টলেশন শেষে অনলাইন পে' : 'ক্যাশ অন ইনস্টলেশন'}
                  </span>
                </div>
                <div className="flex justify-between pt-1 text-sm">
                  <span className="font-bold text-slate-300">মোট মূল্য:</span>
                  <span className="font-mono font-black text-emerald-400">৳ {createdOrder.totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Next Steps Notice */}
              <div className="bg-slate-950 border border-blue-500/30 rounded-2xl p-3 max-w-md mx-auto text-left space-y-1.5">
                <div className="text-[11px] font-bold text-blue-300 flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400 animate-spin" />
                  <span>স্মার্ট ডিসপ্যাচ ও পরবর্তী পদক্ষেপ:</span>
                </div>
                <ul className="text-[10px] text-slate-300 space-y-1">
                  <li>১. সাপোর্ট টিম থেকে আপনার ঠিকানায় নিকটতম টেকনিশিয়ান পাঠানো হবে।</li>
                  <li>২. টেকনিশিয়ানের কাছে গুগল ম্যাপ লিংক ও পুশ অ্যালার্ট পৌঁছে গেছে।</li>
                  <li>৩. টেকনিশিয়ান স্পটে এসে কাজ শেষ করলে আপনি সন্তুষ্ট হয়ে কনফার্ম করবেন।</li>
                </ul>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition active:scale-95"
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
