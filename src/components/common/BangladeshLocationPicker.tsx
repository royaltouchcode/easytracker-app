import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  Building, 
  Compass, 
  Crosshair,
  LocateFixed
} from 'lucide-react';
import { 
  BANGLADESH_GEO_DATA, 
  BangladeshDistrict, 
  BangladeshUpazila, 
  BangladeshUnion 
} from '../../data/bangladeshGeoData';

export interface SelectedLocationData {
  district: string;
  districtBn: string;
  upazila: string;
  upazilaBn: string;
  union: string;
  unionBn: string;
  postCode?: string;
  shopName?: string;
  streetAddress: string;
  fullFormattedAddress: string;
  lat: number;
  lng: number;
  googleMapsUrl: string;
}

interface BangladeshLocationPickerProps {
  initialDistrict?: string;
  initialUpazila?: string;
  initialUnion?: string;
  initialStreet?: string;
  initialShopName?: string;
  initialLat?: number;
  initialLng?: number;
  isBusinessLocation?: boolean;
  onChange: (data: SelectedLocationData) => void;
  label?: string;
  required?: boolean;
}

export const BangladeshLocationPicker: React.FC<BangladeshLocationPickerProps> = ({
  initialDistrict,
  initialUpazila,
  initialUnion,
  initialStreet = '',
  initialShopName = '',
  initialLat,
  initialLng,
  isBusinessLocation = true,
  onChange,
  label = 'দোকান / আউটলেটের নেস্টেড লোকেশন ও গুগল ম্যাপ পিন',
  required = true
}) => {
  // 1. Select District
  const [selectedDistrict, setSelectedDistrict] = useState<BangladeshDistrict>(() => {
    if (initialDistrict) {
      const found = BANGLADESH_GEO_DATA.find(d => 
        d.id === initialDistrict.toLowerCase() || 
        d.nameBn.includes(initialDistrict) || 
        d.nameEn.toLowerCase() === initialDistrict.toLowerCase()
      );
      if (found) return found;
    }
    return BANGLADESH_GEO_DATA[0]; // Default Dhaka
  });

  // 2. Select Upazila / Thana
  const [selectedUpazila, setSelectedUpazila] = useState<BangladeshUpazila>(() => {
    if (initialUpazila && selectedDistrict) {
      const found = selectedDistrict.upazilas.find(u => 
        u.nameBn.includes(initialUpazila) || 
        u.nameEn.toLowerCase() === initialUpazila.toLowerCase()
      );
      if (found) return found;
    }
    return selectedDistrict?.upazilas[0] || BANGLADESH_GEO_DATA[0].upazilas[0];
  });

  // 3. Select Union / Area
  const [selectedUnion, setSelectedUnion] = useState<BangladeshUnion>(() => {
    if (initialUnion && selectedUpazila) {
      const found = selectedUpazila.unions.find(un => 
        un.nameBn.includes(initialUnion) || 
        un.nameEn.toLowerCase() === initialUnion.toLowerCase()
      );
      if (found) return found;
    }
    return selectedUpazila?.unions[0] || selectedDistrict?.upazilas[0]?.unions[0];
  });

  // 4. Street Address, Shop Name & Coords
  const [shopName, setShopName] = useState(initialShopName);
  const [streetAddress, setStreetAddress] = useState(initialStreet);
  const [currentLat, setCurrentLat] = useState<number>(initialLat || selectedUpazila?.lat || 23.8103);
  const [currentLng, setCurrentLng] = useState<number>(initialLng || selectedUpazila?.lng || 90.4125);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsCaptured, setGpsCaptured] = useState(false);

  // Notify parent on any change
  useEffect(() => {
    if (!selectedDistrict || !selectedUpazila) return;

    const unionName = selectedUnion ? selectedUnion.nameBn : '';
    const post = selectedUnion?.postCode ? `পোস্টকোড: ${selectedUnion.postCode}` : '';
    const shopPrefix = shopName.trim() ? `${shopName.trim()}, ` : '';
    const streetPart = streetAddress.trim() ? `${streetAddress.trim()}, ` : '';
    const fullFormatted = `${shopPrefix}${streetPart}${unionName ? `${unionName}, ` : ''}${selectedUpazila.nameBn}, ${selectedDistrict.nameBn}${post ? ` (${post})` : ''}`;
    const mapsUrl = `https://www.google.com/maps?q=${currentLat.toFixed(6)},${currentLng.toFixed(6)}`;

    onChange({
      district: selectedDistrict.nameEn,
      districtBn: selectedDistrict.nameBn,
      upazila: selectedUpazila.nameEn,
      upazilaBn: selectedUpazila.nameBn,
      union: selectedUnion?.nameEn || '',
      unionBn: unionName,
      postCode: selectedUnion?.postCode,
      shopName: shopName.trim(),
      streetAddress: streetAddress.trim(),
      fullFormattedAddress: fullFormatted,
      lat: currentLat,
      lng: currentLng,
      googleMapsUrl: mapsUrl
    });
  }, [selectedDistrict, selectedUpazila, selectedUnion, shopName, streetAddress, currentLat, currentLng]);

  // Handle District Change
  const handleDistrictChange = (distId: string) => {
    const dist = BANGLADESH_GEO_DATA.find(d => d.id === distId);
    if (dist) {
      setSelectedDistrict(dist);
      const firstUpazila = dist.upazilas[0];
      setSelectedUpazila(firstUpazila);
      setSelectedUnion(firstUpazila?.unions[0] || null);
      if (!gpsCaptured) {
        setCurrentLat(firstUpazila?.lat || dist.lat);
        setCurrentLng(firstUpazila?.lng || dist.lng);
      }
    }
  };

  // Handle Upazila Change
  const handleUpazilaChange = (upazilaNameEn: string) => {
    const upz = selectedDistrict.upazilas.find(u => u.nameEn === upazilaNameEn);
    if (upz) {
      setSelectedUpazila(upz);
      setSelectedUnion(upz.unions[0] || null);
      if (!gpsCaptured) {
        setCurrentLat(upz.lat);
        setCurrentLng(upz.lng);
      }
    }
  };

  // Handle Union Change
  const handleUnionChange = (unionNameEn: string) => {
    const un = selectedUpazila.unions.find(u => u.nameEn === unionNameEn);
    if (un) {
      setSelectedUnion(un);
    }
  };

  // Auto-Detect Accurate GPS from Mobile Phone at the Shop
  const handleAutoDetectGPS = () => {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      setIsDetectingGps(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = Number(pos.coords.latitude.toFixed(6));
          const lng = Number(pos.coords.longitude.toFixed(6));
          setCurrentLat(lat);
          setCurrentLng(lng);
          setIsDetectingGps(false);
          setGpsCaptured(true);
        },
        (err) => {
          setIsDetectingGps(false);
          alert('মোবাইলের জিপিএস লোকেশন পাওয়া যায়নি। অনুগ্রহ করে পারমিশন দিয়ে চেষ্টা করুন।');
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert('আপনার ডিভাইসে Geolocation ব্রাউজার সাপোর্ট নেই।');
    }
  };

  const googleMapsUrl = `https://www.google.com/maps?q=${currentLat.toFixed(6)},${currentLng.toFixed(6)}`;

  return (
    <div className="p-3.5 bg-slate-950/90 border border-slate-800 rounded-3xl space-y-3 select-none">
      {/* 🏢 CRITICAL PROMINENT WARNING BANNER (USER'S EXPLICIT RULE) */}
      {isBusinessLocation && (
        <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-xs space-y-1">
          <div className="flex items-center space-x-1.5 font-black text-amber-300">
            <Building className="w-4 h-4 text-amber-400 shrink-0" />
            <span>🏢 জরুরি নির্দেশনা (দোকান / বিজনেস লোকেশন):</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            দয়া করে আপনার <strong>ব্যক্তিগত বাসা/ঘরের অবস্থান নয়</strong>, বরং আপনার <strong>অফিস, দোকান বা সার্ভিস সেন্টারে অবস্থানকালীন সময়ে</strong> নিচের <strong>‘📍 শপে অবস্থানকালে বিজনেস GPS ক্যাপচার’</strong> বাটনে চাপুন। এতে গ্রাহক ও সাপোর্ট টিম সরাসরি আপনার প্রতিষ্ঠানে সেবা নিতে আসতে পারবে।
          </p>
        </div>
      )}

      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center space-x-1.5 text-blue-400">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span className="font-extrabold text-xs text-slate-200">{label}</span>
        </div>

        <button
          type="button"
          onClick={handleAutoDetectGPS}
          disabled={isDetectingGps}
          className="px-2.5 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/60 text-emerald-300 font-bold text-[11px] flex items-center space-x-1.5 transition active:scale-95 shadow-sm"
        >
          <Navigation className={`w-3.5 h-3.5 text-emerald-400 ${isDetectingGps ? 'animate-spin' : ''}`} />
          <span>{isDetectingGps ? 'GPS নেওয়া হচ্ছে...' : (gpsCaptured ? '✅ শপ GPS ক্যাপচার্ড' : '📍 শপে থাকাকালে GPS নিন')}</span>
        </button>
      </div>

      {/* Shop / Outlet Name */}
      <div>
        <label className="text-[10.5px] font-bold text-slate-300 block mb-1">
          দোকান / শপ / বিজনেস সেন্টারের নাম {required ? '*' : ''}
        </label>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="যেমন: ভাই ভাই অটো পার্টস অ্যান্ড সার্ভিসিং পয়েন্ট"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Level 1 & Level 2: District & Thana/Upazila */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-[10px] font-bold text-slate-400 block mb-1">
            ১. জেলা (District) {required ? '*' : ''}
          </label>
          <select
            value={selectedDistrict.id}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
          >
            {BANGLADESH_GEO_DATA.map((dist) => (
              <option key={dist.id} value={dist.id}>
                {dist.nameBn} ({dist.divisionBn} বিভাগ)
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-slate-400 block mb-1">
            ২. থানা / উপজেলা (Thana / Upazila) {required ? '*' : ''}
          </label>
          <select
            value={selectedUpazila?.nameEn || ''}
            onChange={(e) => handleUpazilaChange(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
          >
            {selectedDistrict.upazilas.map((u) => (
              <option key={u.nameEn} value={u.nameEn}>
                {u.nameBn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Level 3: Union / Area / Postcode */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 block mb-1">
          ৩. ইউনিয়ন / ওয়ার্ড / এলাকা (Union / Area)
        </label>
        <select
          value={selectedUnion?.nameEn || ''}
          onChange={(e) => handleUnionChange(e.target.value)}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 font-bold focus:border-blue-500 focus:outline-none"
        >
          {selectedUpazila.unions.map((un) => (
            <option key={un.nameEn} value={un.nameEn}>
              {un.nameBn} {un.postCode ? `• পোস্টকোড: ${un.postCode}` : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Level 4: Road / Holding / Detailed Address */}
      <div>
        <label className="text-[10px] font-bold text-slate-400 block mb-1">
          ৪. বিস্তারিত রোড / হোল্ডিং / ল্যান্ডমার্ক ঠিকানা {required ? '*' : ''}
        </label>
        <input
          type="text"
          value={streetAddress}
          onChange={(e) => setStreetAddress(e.target.value)}
          placeholder="যেমন: বাড়ি ১২, রোড ৪/এ, গোলচত্বরের পূর্ব পাশে"
          required={required}
          className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* GPS Coordinate & Google Maps Verification Badge */}
      <div className="p-2 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-[10.5px]">
        <div className="flex items-center space-x-1.5 text-slate-300">
          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span className="font-mono text-slate-200 font-bold">
            {currentLat.toFixed(4)}°N, {currentLng.toFixed(4)}°E
          </span>
          {gpsCaptured && (
            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-700">
              GPS Verified
            </span>
          )}
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-0.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 text-[10px] font-bold flex items-center space-x-1 transition"
        >
          <span>গুগল ম্যাপে দেখুন</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};
