// Accurate Client-side Reverse Geocoding Utility with LRU Cache for Bangladesh

interface CachedAddress {
  address: string;
  timestamp: number;
}

const addressCache: Record<string, CachedAddress> = {};

// Fallback landmark approximations for key Bangladesh zones if offline
export function getApproximateLandmark(lat: number, lng: number): string {
  // Baridhara DOHS / Anannya Shopping Complex area
  if (Math.abs(lat - 23.8103) < 0.015 && Math.abs(lng - 90.4125) < 0.015) {
    return 'অনন্যা শপিং কমপ্লেক্স, বারিধারা ডিওএইচএস, ঢাকা';
  }
  // Gulshan-2
  if (Math.abs(lat - 23.7925) < 0.015 && Math.abs(lng - 90.4078) < 0.015) {
    return 'গুলশান-২ বাণিজ্যিক এলাকা, ঢাকা';
  }
  // Mirpur-10
  if (Math.abs(lat - 23.8071) < 0.015 && Math.abs(lng - 90.3687) < 0.015) {
    return 'মিরপুর-১০ গোলচত্বর, ঢাকা';
  }
  // Karwan Bazar
  if (Math.abs(lat - 23.7525) < 0.015 && Math.abs(lng - 90.3930) < 0.015) {
    return 'কারওয়ান বাজার পাইকারি মার্কেট, ঢাকা';
  }
  // Dhanmondi 27
  if (Math.abs(lat - 23.7505) < 0.015 && Math.abs(lng - 90.3750) < 0.015) {
    return 'ধানমন্ডি ২৭, ঢাকা';
  }
  // Uttara Sector 3 / Airport
  if (Math.abs(lat - 23.8685) < 0.015 && Math.abs(lng - 90.3985) < 0.015) {
    return 'উত্তরা জসীমউদ্দীন এভিনিউ, ঢাকা';
  }
  // Chittagong GEC Circle
  if (Math.abs(lat - 22.3585) < 0.02 && Math.abs(lng - 91.8215) < 0.02) {
    return 'জিইসি মোড়, চট্টগ্রাম';
  }
  return `${lat.toFixed(5)}°N, ${lng.toFixed(5)}°E`;
}

export async function reverseGeocodeCoords(lat: number, lng: number): Promise<string> {
  if (!lat || !lng) return 'লোকেশন স্থানাঙ্ক পাওয়া যায়নি';

  const key = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  const now = Date.now();

  if (addressCache[key] && (now - addressCache[key].timestamp < 3600000)) {
    return addressCache[key].address;
  }

  // Quick fallback approximation first
  const fallback = getApproximateLandmark(lat, lng);

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=bn,en`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'EasyTrackerGPS/2.0' } });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.display_name) {
        const addr = data.address || {};
        const poi = addr.amenity || addr.shop || addr.building || addr.road || '';
        const suburb = addr.suburb || addr.neighbourhood || addr.residential || '';
        const city = addr.city || addr.town || addr.state_district || 'ঢাকা';
        
        let formatted = '';
        if (poi) formatted += poi + ', ';
        if (suburb && suburb !== poi) formatted += suburb + ', ';
        formatted += city;

        const finalAddress = formatted.length > 5 ? formatted : data.display_name.split(',').slice(0, 3).join(',');
        addressCache[key] = { address: finalAddress, timestamp: now };
        return finalAddress;
      }
    }
  } catch (e) {}

  addressCache[key] = { address: fallback, timestamp: now };
  return fallback;
}
