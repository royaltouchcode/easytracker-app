import React, { useState } from 'react';
import { 
  Building2, 
  Briefcase, 
  X, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Mail, 
  LocateFixed, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Info,
  Wrench,
  Headphones,
  LifeBuoy
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  PartnerRegistrationType, 
  PartnerServiceTier, 
  SaasRole 
} from '../../types/traccar';
import { BangladeshLocationPicker, SelectedLocationData } from '../common/BangladeshLocationPicker';

interface PartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BANGLADESH_DISTRICTS = [
  'ঢাকা (Dhaka)',
  'চট্টগ্রাম (Chattogram)',
  'সিলেট (Sylhet)',
  'রাজশাহী (Rajshahi)',
  'খুলনা (Khulna)',
  'বরিশাল (Barishal)',
  'রংপুর (Rangpur)',
  'ময়মনসিংহ (Mymensingh)',
  'কুমিল্লা (Cumilla)',
  'গাজীপুর (Gazipur)',
  'নারায়ণগঞ্জ (Narayanganj)',
  'বগুড়া (Bogura)',
  'কক্সবাজার (Cox\'s Bazar)'
];

export const PartnerRegistrationModal: React.FC<PartnerRegistrationModalProps> = ({ isOpen, onClose }) => {
  const { registerPartner, language } = useApp();

  const [regType, setRegType] = useState<PartnerRegistrationType>('staff_partner');

  // Common Form Fields
  const [applicantName, setApplicantName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [district, setDistrict] = useState(BANGLADESH_DISTRICTS[0]);
  const [fullAddress, setFullAddress] = useState('');

  // B2B Brand Specific Fields
  const [brandName, setBrandName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('জিপিএস ডিলার ও শপ');
  const [requestedServices, setRequestedServices] = useState<('server_tracking' | 'shared_technicians' | 'shared_rescue' | 'shared_support' | 'shared_sales')[]>([
    'server_tracking',
    'shared_technicians',
    'shared_support'
  ]);
  const [serviceTier, setServiceTier] = useState<PartnerServiceTier>('all_inclusive');

  // Staff Specific Role Combination
  const [staffRoleCombo, setStaffRoleCombo] = useState<string>('sales_tech');

  // Bug Fix #4: No default GPS coordinates — undefined until user explicitly captures location
  const [geoLat, setGeoLat] = useState<number | undefined>(undefined);
  const [geoLng, setGeoLng] = useState<number | undefined>(undefined);
  const [isFetchingGeo, setIsFetchingGeo] = useState(false);
  const [geoDetected, setGeoDetected] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleFetchCurrentLocation = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsFetchingGeo(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeoLat(Number(pos.coords.latitude.toFixed(6)));
          setGeoLng(Number(pos.coords.longitude.toFixed(6)));
          setIsFetchingGeo(false);
          setGeoDetected(true);
        },
        (err) => {
          console.warn('GPS fetch error:', err);
          setIsFetchingGeo(false);
          alert('জিপিএস লোকেশন পাওয়া যায়নি। ডিফল্ট কোঅর্ডিনেট রাখা হয়েছে।');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('আপনার ব্রাউজার বা ডিভাইসে জিপিএস লোকেশন সাপোর্ট নেই।');
    }
  };

  const handleToggleService = (srv: 'server_tracking' | 'shared_technicians' | 'shared_rescue' | 'shared_support' | 'shared_sales') => {
    setRequestedServices(prev => 
      prev.includes(srv) ? prev.filter(s => s !== srv) : [...prev, srv]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !phone.trim() || !whatsapp.trim() || !fullAddress.trim()) {
      alert('অনুগ্রহ করে সকল বাধ্যতামূলক ফিল্ড পূরণ করুন!');
      return;
    }

    if (regType === 'b2b_brand' && !brandName.trim()) {
      alert('অনুগ্রহ করে আপনার কোম্পানি / ব্র্যান্ডের নাম লিখুন!');
      return;
    }

    setIsSubmitting(true);

    let desiredRoles: SaasRole[] = ['sales'];
    if (regType === 'staff_partner') {
      if (staffRoleCombo === 'sales') desiredRoles = ['sales'];
      else if (staffRoleCombo === 'technician') desiredRoles = ['technician'];
      else if (staffRoleCombo === 'sales_tech') desiredRoles = ['sales', 'technician'];
      else if (staffRoleCombo === 'sales_tech_rescue') desiredRoles = ['sales', 'technician', 'rescue'];
      else if (staffRoleCombo === 'support') desiredRoles = ['support'];
    } else {
      desiredRoles = ['sales', 'technician'];
    }

    const googleMapsUrl = (geoLat && geoLng) ? `https://maps.google.com/?q=${geoLat},${geoLng}` : undefined;

    try {
      await registerPartner({
        type: regType,
        applicantName: applicantName.trim(),
        brandName: regType === 'b2b_brand' ? brandName.trim() : undefined,
        businessCategory: regType === 'b2b_brand' ? businessCategory : undefined,
        phone: phone.trim(),
        whatsapp: whatsapp.trim(),
        email: email.trim() || undefined,
        emergencyPhone: emergencyPhone.trim() || undefined,
        district,
        fullAddress: fullAddress.trim(),
        geoLat,
        geoLng,
        googleMapsUrl,
        desiredRoles,
        requestedServices: regType === 'b2b_brand' ? requestedServices : ['server_tracking'],
        serviceTier
      });

      setSuccessMsg('আপনার আবেদন সফলভাবে জমা হয়েছে! সুপার অ্যাডমিন ভেরিফাই করে আপনার একাউন্ট ও পার্টনার আইডি সক্রিয় করবে।');
      setTimeout(() => {
        resetForm();
        onClose();
      }, 2500);
    } catch (e) {
      alert('আবেদন সাবমিট করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Bug Fix #3: Reset form state so modal re-opens clean
  const resetForm = () => {
    setApplicantName('');
    setPhone('');
    setWhatsapp('');
    setEmail('');
    setEmergencyPhone('');
    setDistrict(BANGLADESH_DISTRICTS[0]);
    setFullAddress('');
    setBrandName('');
    setBusinessCategory('জিপিএস ডিলার ও শপ');
    setRequestedServices(['server_tracking', 'shared_technicians', 'shared_support']);
    setServiceTier('all_inclusive');
    setStaffRoleCombo('sales_tech');
    setGeoLat(undefined);
    setGeoLng(undefined);
    setGeoDetected(false);
    setSuccessMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>{language === 'bn' ? 'পার্টনার ও ব্র্যান্ড অনবোর্ডিং পোর্টাল' : 'Partner & Brand Onboarding'}</span>
                <span className="text-[9px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  B2B Ecosystem
                </span>
              </h3>
              <p className="text-[10px] text-slate-400">
                আমাদের জিপিএস সার্ভার, ফিল্ড টিম ও ডিস্ট্রিবিউশন নেটওয়ার্কে যুক্ত হোন
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

        {/* 2-in-1 Top Category Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/70 shrink-0 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => setRegType('staff_partner')}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              regType === 'staff_partner'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>১. ব্যক্তিগত স্টাফ / পার্টনার</span>
          </button>

          <button
            type="button"
            onClick={() => setRegType('b2b_brand')}
            className={`flex-1 py-2 rounded-2xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              regType === 'b2b_brand'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>২. ব্যবসায়ী / ব্র্যান্ড ওনার</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          
          {/* ========================================================================= */}
          {/* SECTION A: ROLE SELECTION (FOR STAFF PARTNER)                             */}
          {/* ========================================================================= */}
          {regType === 'staff_partner' ? (
            <div>
              <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                আপনি কী হিসেবে কাজ করতে চান? (রোল নির্বাচন করুন) *
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'sales_tech', label: '💼 + 🔧 সেলস + ফিল্ড টেকনিশিয়ান (সবচেয়ে জনপ্রিয়)', desc: 'ডিভাইস বিক্রি ও ইনস্টলেশন উভয়ের ইনকাম পাবেন' },
                  { id: 'sales_tech_rescue', label: '💼 + 🔧 + 🚨 সেলস + টেকনিশিয়ান + রেসকিউ টিম', desc: 'ফুল ফিল্ড অপারেশনাল এক্সেস ও হাই প্রায়োরিটি ট্র্যাকিং' },
                  { id: 'sales', label: '💼 শুধু সেলস এজেন্ট (Sales Agent Only)', desc: 'প্রতিটি ডিভাইসে লাইভ সেলস কমিশন পাবেন' },
                  { id: 'technician', label: '🔧 শুধু ফিল্ড টেকনিশিয়ান (Technician Only)', desc: 'ইনস্টলেশন ও ওয়্যারিং সার্ভিস ফি পাবেন' },
                  { id: 'support', label: '🎧 কাস্টমার কেয়ার ও সাপোর্ট (Customer Care)', desc: 'অভিযোগ ম্যানেজমেন্ট ও টেকনিশিয়ান ডিসপ্যাচ' },
                ].map(r => (
                  <label 
                    key={r.id}
                    className={`flex items-start space-x-2.5 p-2.5 rounded-2xl border cursor-pointer transition ${
                      staffRoleCombo === r.id 
                        ? 'bg-blue-950/60 border-blue-500/60 text-white shadow-sm' 
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="staff_role"
                      checked={staffRoleCombo === r.id}
                      onChange={() => setStaffRoleCombo(r.id)}
                      className="mt-0.5 text-blue-600 focus:ring-0"
                    />
                    <div>
                      <div className="font-extrabold text-xs text-slate-200">{r.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{r.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            /* ========================================================================= */
            /* SECTION B: B2B BRAND & COMPANY DETAILS                                    */
            /* ========================================================================= */
            <div className="space-y-3 p-3 bg-purple-950/30 border border-purple-800/40 rounded-2xl">
              <div>
                <label className="text-[10.5px] font-bold text-purple-200 block mb-1">
                  🏢 আপনার প্রতিষ্ঠান / ব্র্যান্ডের নাম *
                </label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="যেমন: Green Fleet GPS, Dhaka Motors Tracking"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-purple-200 block mb-1">
                  বিজনেসের ধরন / ক্যাটাগরি *
                </label>
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="জিপিএস ডিলার ও শপ">জিপিএস ডিলার ও রিটেইল শপ</option>
                  <option value="বাইক / কার শো-রুম">মোটরসাইকেল / কার শো-রুম</option>
                  <option value="ফ্লিট ও ট্রান্সপোর্ট কোম্পানি">ফ্লিট ও ট্রান্সপোর্ট এজেন্সি</option>
                  <option value="সিকিউরিটি ও সার্ভিলেন্স ফার্ম">সিকিউরিটি ও সার্ভিলেন্স ফার্ম</option>
                  <option value="অনলাইন ই-কমার্স রিসেলার">অনলাইন ই-কমার্স রিসেলার</option>
                </select>
              </div>

              {/* Shared Service Backbone Selection */}
              <div>
                <label className="text-[10.5px] font-bold text-purple-200 block mb-1.5">
                  আমাদের যেসব শেয়ার্ড সার্ভিস আপনি ব্যবহার করতে চান:
                </label>
                <div className="space-y-1.5">
                  {[
                    { id: 'server_tracking', label: '🌐 ক্লাউড জিপিএস ট্র্যাকিং সার্ভার ব্যাকএন্ড' },
                    { id: 'shared_technicians', label: '🔧 অন-ডিমান্ড ফিল্ড টেকনিশিয়ান নেটওয়ার্ক (ইনস্টলেশন)' },
                    { id: 'shared_rescue', label: '🚨 ২৪/৭ ইমার্জেন্সি এসওএস রেসকিউ টিম ব্যাকআপ' },
                    { id: 'shared_support', label: '🎧 সেন্ট্রালাইজড কাস্টমার কেয়ার ও হেল্পডেস্ক' },
                    { id: 'shared_sales', label: '💼 শেয়ার্ড সেলস ও ডিস্ট্রিবিউশন চ্যানেল' }
                  ].map(srv => (
                    <label key={srv.id} className="flex items-center space-x-2 p-1.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requestedServices.includes(srv.id as any)}
                        onChange={() => handleToggleService(srv.id as any)}
                        className="w-4 h-4 text-purple-600 rounded bg-slate-900 border-slate-700 focus:ring-0"
                      />
                      <span className="text-[11px] text-slate-300 font-medium">{srv.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Service Tier Matrix */}
              <div>
                <label className="text-[10.5px] font-bold text-purple-200 block mb-1">
                  সার্ভিস ও ফিচার লেভেল (Service Tier):
                </label>
                <select
                  value={serviceTier}
                  onChange={(e) => setServiceTier(e.target.value as PartnerServiceTier)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="all_inclusive">⚡ All-Inclusive (ট্র্যাকিং + ইঞ্জিন + সেন্সর + টেকনিশিয়ান + রেসকিউ)</option>
                  <option value="subscription_wise">💳 Modular (কাস্টমারের নিজস্ব সাবস্ক্রিপশন প্যাকেজ অনুযায়ী)</option>
                  <option value="tracking_only">📍 Only Tracking (শুধু লাইভ ম্যাপ ও হিস্ট্রি ট্র্যাকিং)</option>
                </select>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECTION C: MANDATORY CONTACT & APPLICANT INFO                             */}
          {/* ========================================================================= */}
          <div className="space-y-2.5">
            <div>
              <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                আবেদনকারী / স্বত্বাধিকারীর পূর্ণ নাম *
              </label>
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="যেমন: মোঃ তরিকুল ইসলাম"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  মোবাইল নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
                  হোয়াটসঅ্যাপ নম্বর *
                </label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>

          {/* ========================================================================= */}
          {/* SECTION D: BANGLADESH NESTED LOCATION & GOOGLE MAPS PIN                   */}
          {/* ========================================================================= */}
          <BangladeshLocationPicker
            label="দোকান / আউটলেটের নেস্টেড লোকেশন ও গুগল ম্যাপ পিন"
            initialStreet={fullAddress}
            onChange={(loc: SelectedLocationData) => {
              setDistrict(loc.districtBn);
              setFullAddress(loc.fullFormattedAddress);
              setGeoLat(loc.lat);
              setGeoLng(loc.lng);
              setGeoDetected(true);
            }}
          />

          {/* Optional Secondary Fields */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">ইমেইল এড্রেস (ঐচ্ছিক):</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@gmail.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">জরুরি মোবাইল (ঐচ্ছিক):</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                placeholder="018XXXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-2xl font-black text-xs shadow-xl flex items-center justify-center space-x-2 transition active:scale-95 border disabled:opacity-50 ${
              regType === 'b2b_brand'
                ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-purple-600/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white border-blue-400 shadow-blue-600/30'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'আবেদন পাঠানো হচ্ছে...' : successMsg || 'পার্টনার হিসেবে আবেদন জমা দিন'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
