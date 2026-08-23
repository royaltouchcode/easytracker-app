import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  X, 
  MapPin, 
  Search, 
  Sliders, 
  Check, 
  Palette, 
  ShieldCheck,
  Compass,
  Navigation
} from 'lucide-react';
import { Geofence } from '../../types/traccar';

interface GeofenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (geofence: Omit<Geofence, 'id'>) => void;
  initialData?: Geofence | null;
  defaultCenter?: { lat: number; lng: number };
  language: 'en' | 'bn';
}

const PRESET_AREAS = [
  { name: 'Gulshan-2, Dhaka', lat: 23.7937, lon: 90.4066 },
  { name: 'Banani, Dhaka', lat: 23.7937, lon: 90.4034 },
  { name: 'Dhanmondi, Dhaka', lat: 23.7461, lon: 90.3742 },
  { name: 'Uttara (Sector 3), Dhaka', lat: 23.8759, lon: 90.3795 },
  { name: 'Hazrat Shahjalal Airport', lat: 23.8433, lon: 90.4029 },
  { name: 'Motijheel C/A, Dhaka', lat: 23.7330, lon: 90.4172 },
  { name: 'Agrabad C/A, Chattogram', lat: 22.3243, lon: 91.8142 },
  { name: 'Zindabazar, Sylhet', lat: 24.8949, lon: 91.8687 },
];

const GEOFENCE_COLORS = [
  '#3b82f6', // Blue
  '#10b981', // Green
  '#ef4444', // Red
  '#f59e0b', // Amber
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
];

export const GeofenceModal: React.FC<GeofenceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultCenter,
  language
}) => {
  const [name, setName] = useState(initialData?.name || 'Safe Zone');
  const [radius, setRadius] = useState(initialData?.radius || 350);
  const [color, setColor] = useState(initialData?.attributes?.color || '#3b82f6');
  const [alertOnEnter, setAlertOnEnter] = useState(initialData?.attributes?.alertOnEnter ?? true);
  const [alertOnExit, setAlertOnExit] = useState(initialData?.attributes?.alertOnExit ?? true);

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: initialData?.latitude || defaultCenter?.lat || 23.7937,
    lng: initialData?.longitude || defaultCenter?.lng || 90.4066
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const circleRef = useRef<L.Circle | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setRadius(initialData.radius);
      setColor(initialData.attributes?.color || '#3b82f6');
      setCenter({ lat: initialData.latitude, lng: initialData.longitude });
    } else if (defaultCenter) {
      setCenter(defaultCenter);
    }
  }, [initialData, defaultCenter]);

  // Initialize Map
  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: [center.lat, center.lng],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 21
    }).addTo(map);

    // Draggable Pin Icon
    const pinIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-full">
          <div class="w-9 h-9 rounded-2xl bg-indigo-600 border-2 border-white shadow-2xl flex items-center justify-center text-white cursor-grab active:cursor-grabbing">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
        </div>
      `,
      className: 'custom-drag-pin',
      iconSize: [36, 36],
      iconAnchor: [18, 36]
    });

    const marker = L.marker([center.lat, center.lng], {
      icon: pinIcon,
      draggable: true
    }).addTo(map);

    markerRef.current = marker;

    marker.on('dragend', (e) => {
      const latlng = (e.target as L.Marker).getLatLng();
      setCenter({ lat: latlng.lat, lng: latlng.lng });
    });

    // Tap/Click anywhere on map to move center
    map.on('click', (e) => {
      setCenter({ lat: e.latlng.lat, lng: e.latlng.lng });
      marker.setLatLng(e.latlng);
    });

    // Geofence Circle
    const circle = L.circle([center.lat, center.lng], {
      radius: radius,
      color: color,
      fillColor: color,
      fillOpacity: 0.25,
      weight: 2.5,
      dashArray: '6, 8'
    }).addTo(map);

    circleRef.current = circle;

    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isOpen]);

  // Update Circle & Marker when state changes
  useEffect(() => {
    if (circleRef.current) {
      circleRef.current.setLatLng([center.lat, center.lng]);
      circleRef.current.setRadius(radius);
      circleRef.current.setStyle({ color: color, fillColor: color });
    }
    if (markerRef.current) {
      markerRef.current.setLatLng([center.lat, center.lng]);
    }
  }, [center, radius, color]);

  // Search Area by Name (Nominatim API)
  const handleSearchArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=4&countrycodes=bd`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data);
      }
    } catch (err) {
      console.warn('Geocoding error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectLocation = (lat: number, lon: number, displayName?: string) => {
    setCenter({ lat, lng: lon });
    setSearchResults([]);
    setSearchQuery('');
    if (displayName) {
      setName(displayName.split(',')[0]);
    }
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([lat, lon], 16, { animate: true });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || 'Safe Zone',
      description: 'Geofence Safe Zone',
      area: `CIRCLE (${center.lat} ${center.lng}, ${radius})`,
      latitude: center.lat,
      longitude: center.lng,
      radius: radius,
      attributes: {
        color: color,
        alertOnEnter,
        alertOnExit,
        enabled: true
      }
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-sm text-slate-100">
              {initialData ? (language === 'bn' ? 'জিওফেন্স এডিট করুন' : 'Edit Geofence') : (language === 'bn' ? 'নতুন জিওফেন্স যোগ করুন' : 'Add New Safe Zone')}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Search Area */}
          <form onSubmit={handleSearchArea} className="relative">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'bn' ? 'এলাকার নাম লিখে খুঁজুন (যেমন: গুলশান, বনানী, মিরপুর...)' : 'Search area name (e.g. Gulshan, Banani)...'}
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl pl-9 pr-20 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition"
              >
                {isSearching ? '...' : (language === 'bn' ? 'সার্চ' : 'Search')}
              </button>
            </div>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="absolute top-12 left-0 right-0 z-30 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-1.5 space-y-1">
                {searchResults.map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectLocation(parseFloat(item.lat), parseFloat(item.lon), item.display_name)}
                    className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-800 text-slate-200 truncate flex items-center space-x-2"
                  >
                    <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">{item.display_name}</span>
                  </button>
                ))}
              </div>
            )}
          </form>

          {/* Quick Presets */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
            <span className="text-slate-500 font-semibold shrink-0">প্রিসেট:</span>
            {PRESET_AREAS.map((preset, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectLocation(preset.lat, preset.lon, preset.name)}
                className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-300 font-medium whitespace-nowrap shrink-0 active:scale-95 transition"
              >
                {preset.name.split(',')[0]}
              </button>
            ))}
          </div>

          {/* Interactive Map */}
          <div className="relative w-full h-52 rounded-2xl overflow-hidden border border-slate-700 shadow-inner">
            <div ref={mapContainerRef} className="w-full h-full" />
            <div className="absolute top-2 left-2 z-20 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-bold text-slate-200 border border-slate-700 shadow-md">
              {language === 'bn' ? '💡 পিনটি ড্র্যাগ করুন বা ম্যাপে ট্যাপ করুন' : '💡 Drag pin or tap anywhere on map'}
            </div>
          </div>

          {/* Form Controls */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1">
                {language === 'bn' ? 'সেফ জোনের নাম' : 'Safe Zone Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Home Safe Zone / Office Garage"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Radius Slider */}
            <div>
              <div className="flex justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-bold flex items-center space-x-1">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{language === 'bn' ? 'সীমানা পরিধি (ব্যাসার্ধ)' : 'Zone Radius'}</span>
                </span>
                <span className="font-extrabold text-indigo-400">{radius} মি ({radius >= 1000 ? `${(radius/1000).toFixed(1)} কিমি` : `${radius} মি`})</span>
              </div>
              <input
                type="range"
                min={100}
                max={4000}
                step={50}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Color Picker */}
            <div>
              <label className="text-xs text-slate-300 font-bold block mb-1.5">
                {language === 'bn' ? 'জোনের কালার' : 'Safe Zone Color'}
              </label>
              <div className="flex items-center space-x-2.5">
                {GEOFENCE_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-7 h-7 rounded-full border-2 transition active:scale-90 shadow-md ${
                      color === c ? 'border-white scale-110 shadow-[0_0_8px_#ffffff]' : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Alert Triggers */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <label className="flex items-center space-x-2 p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertOnEnter}
                  onChange={(e) => setAlertOnEnter(e.target.checked)}
                  className="rounded text-indigo-600 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-200 font-medium">
                  {language === 'bn' ? 'প্রবেশে অ্যালার্ট' : 'Alert on Enter'}
                </span>
              </label>

              <label className="flex items-center space-x-2 p-2.5 bg-slate-800/80 border border-slate-700/80 rounded-2xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertOnExit}
                  onChange={(e) => setAlertOnExit(e.target.checked)}
                  className="rounded text-indigo-600 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <span className="text-xs text-slate-200 font-medium">
                  {language === 'bn' ? 'প্রস্থানে অ্যালার্ট' : 'Alert on Exit'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs transition"
          >
            {language === 'bn' ? 'বাতিল' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-[0.98] shadow-lg shadow-indigo-600/30"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Safe Zone'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
