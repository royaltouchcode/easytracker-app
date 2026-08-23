import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  MapPin, 
  Search, 
  Check, 
  Layers, 
  Sliders, 
  LocateFixed, 
  Building2, 
  Navigation,
  X
} from 'lucide-react';
import { Geofence } from '../../types/traccar';

// Popular Area Presets for quick selection
const POPULAR_AREAS = [
  { name: 'Gulshan-2 Circle', lat: 23.7937, lon: 90.4066, city: 'Dhaka' },
  { name: 'Banani 11', lat: 23.7925, lon: 90.4005, city: 'Dhaka' },
  { name: 'Dhanmondi 27 / Lake', lat: 23.7542, lon: 90.3753, city: 'Dhaka' },
  { name: 'Hazrat Shahjalal Airport', lat: 23.8433, lon: 90.3978, city: 'Dhaka' },
  { name: 'Uttara Sector 7', lat: 23.8679, lon: 90.3972, city: 'Dhaka' },
  { name: 'Motijheel Commercial Area', lat: 23.7330, lon: 90.4172, city: 'Dhaka' },
  { name: 'Mirpur 10 Circle', lat: 23.8069, lon: 90.3687, city: 'Dhaka' },
  { name: 'GEC Circle, Chattogram', lat: 22.3587, lon: 91.8215, city: 'Chattogram' },
  { name: 'Zindabazar, Sylhet', lat: 24.8949, lon: 91.8687, city: 'Sylhet' },
];

export const GeofenceView: React.FC = () => {
  const { 
    geofences, 
    addGeofence, 
    deleteGeofence, 
    selectedPosition, 
    language, 
    setActiveTab 
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const centerMarkerRef = useRef<L.Marker | null>(null);
  const liveCircleRef = useRef<L.Circle | null>(null);
  const existingCirclesRef = useRef<L.Circle[]>([]);

  const [isCreating, setIsCreating] = useState(true);
  const [zoneName, setZoneName] = useState('');
  const [description, setDescription] = useState('');
  const [radius, setRadius] = useState(350);
  const [centerLat, setCenterLat] = useState(selectedPosition?.latitude || 23.7937);
  const [centerLon, setCenterLon] = useState(selectedPosition?.longitude || 90.4066);
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [alertOnEnter, setAlertOnEnter] = useState(true);
  const [alertOnExit, setAlertOnExit] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lon: number }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [saveMessage, setSaveMessage] = useState(false);

  // Init Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [centerLat, centerLon],
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20
    }).addTo(map);

    mapRef.current = map;

    // Handle map click to reposition Geofence Center Pin
    map.on('click', (e: L.LeafletMouseEvent) => {
      setCenterLat(e.latlng.lat);
      setCenterLon(e.latlng.lng);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Live Geofence Circle & Pin Marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Update or create Center Pin
    const pinHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-white font-bold animate-bounce">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        </div>
      </div>
    `;

    const pinIcon = L.divIcon({
      html: pinHtml,
      className: 'geofence-pin',
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });

    if (centerMarkerRef.current) {
      centerMarkerRef.current.setLatLng([centerLat, centerLon]);
    } else {
      const marker = L.marker([centerLat, centerLon], { icon: pinIcon, draggable: true }).addTo(map);
      marker.on('dragend', (e) => {
        const pos = e.target.getLatLng();
        setCenterLat(pos.lat);
        setCenterLon(pos.lng);
      });
      centerMarkerRef.current = marker;
    }

    // Update or create Live Interactive Circle
    if (liveCircleRef.current) {
      liveCircleRef.current.setLatLng([centerLat, centerLon]);
      liveCircleRef.current.setRadius(radius);
      liveCircleRef.current.setStyle({ color: selectedColor, fillColor: selectedColor });
    } else {
      const circle = L.circle([centerLat, centerLon], {
        radius,
        color: selectedColor,
        fillColor: selectedColor,
        fillOpacity: 0.2,
        weight: 3,
        dashArray: '6, 8'
      }).addTo(map);
      liveCircleRef.current = circle;
    }
  }, [centerLat, centerLon, radius, selectedColor]);

  // Render Existing Saved Geofences
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    existingCirclesRef.current.forEach(c => map.removeLayer(c));
    existingCirclesRef.current = [];

    geofences.forEach(geo => {
      const circle = L.circle([geo.latitude, geo.longitude], {
        radius: geo.radius,
        color: geo.attributes?.color || '#10b981',
        fillColor: geo.attributes?.color || '#10b981',
        fillOpacity: 0.12,
        weight: 2
      }).addTo(map);

      circle.bindTooltip(`<b>${geo.name}</b><br>Radius: ${geo.radius}m`);
      existingCirclesRef.current.push(circle);
    });
  }, [geofences]);

  // Search Area by Name (Nominatim OSM Geocoding)
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery.trim())}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        const results = data.map((item: any) => ({
          name: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }));
        setSearchResults(results);
      }
    } catch (err) {
      console.warn('Geocoding search failed:', err);
    }
    setIsSearching(false);
  };

  const handleSelectArea = (lat: number, lon: number, name: string) => {
    setCenterLat(lat);
    setCenterLon(lon);
    if (!zoneName) {
      setZoneName(name.split(',')[0]);
    }
    setSearchResults([]);
    setShowPresets(false);

    if (mapRef.current) {
      mapRef.current.flyTo([lat, lon], 16, { animate: true, duration: 1 });
    }
  };

  const handleSaveGeofence = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = zoneName.trim() || `Safe Zone #${geofences.length + 1}`;

    addGeofence({
      name: finalName,
      description: description.trim() || 'Custom safe zone boundary',
      area: `CIRCLE (${centerLat} ${centerLon}, ${radius})`,
      latitude: centerLat,
      longitude: centerLon,
      radius,
      attributes: {
        color: selectedColor,
        alertOnEnter,
        alertOnExit
      }
    });

    setZoneName('');
    setDescription('');
    setSaveMessage(true);
    setTimeout(() => setSaveMessage(false), 2500);
  };

  const handleFlyToGeofence = (geo: Geofence) => {
    setCenterLat(geo.latitude);
    setCenterLon(geo.longitude);
    setRadius(geo.radius);
    if (mapRef.current) {
      mapRef.current.flyTo([geo.latitude, geo.longitude], 16, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Floating Search & Area Selector Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          {/* Search Form */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'এলাকার নাম লিখে খুঁজুন (যেমন: গুলশান, বনানী, এয়ারপোর্ট)' : 'Search area name (e.g. Gulshan, Airport, Dhanmondi)'}
              className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/90 rounded-2xl pl-9 pr-8 py-2.5 text-xs text-slate-100 placeholder-slate-400 shadow-2xl focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Quick Presets Drawer Toggle */}
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="px-3 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/90 text-blue-400 text-xs font-bold flex items-center space-x-1 backdrop-blur-xl shadow-xl hover:bg-slate-800 transition active:scale-95 shrink-0"
          >
            <Building2 className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'bn' ? 'প্রসিদ্ধ এলাকা' : 'Presets'}</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div className="bg-slate-900/95 border border-slate-700 rounded-2xl shadow-2xl p-2 max-h-56 overflow-y-auto space-y-1 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="text-[10px] uppercase font-bold text-slate-400 px-2 py-0.5">
              {language === 'bn' ? 'অনুসন্ধানের ফলাফল (ক্লিক করে জোন সেট করুন)' : 'Search Results (Click to Set Zone)'}
            </div>
            {searchResults.map((res, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectArea(res.lat, res.lon, res.name)}
                className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-800 flex items-start space-x-2 text-slate-200 transition"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span className="truncate">{res.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Popular Presets Dropdown */}
        {showPresets && (
          <div className="bg-slate-900/95 border border-slate-700 rounded-3xl p-3 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="text-xs font-bold text-slate-200 mb-2 flex items-center justify-between">
              <span>{language === 'bn' ? 'জনপ্রিয় এলাকা নির্বাচন করুন' : 'Select Popular Area'}</span>
              <span className="text-[10px] text-blue-400">Bangladesh Cities</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto">
              {POPULAR_AREAS.map((area, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectArea(area.lat, area.lon, area.name)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-blue-600/30 hover:border-blue-500 border border-slate-700/60 text-left transition text-xs font-semibold text-slate-200 truncate"
                >
                  <div className="truncate text-blue-300">{area.name}</div>
                  <div className="text-[10px] text-slate-400">{area.city}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Map Viewport */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Instruction Tag */}
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-semibold text-slate-200 border border-slate-700 shadow-xl flex items-center space-x-1.5 pointer-events-none">
          <MapPin className="w-3.5 h-3.5 text-rose-400" />
          <span>{language === 'bn' ? 'ম্যাপে যেকোনো স্থানে ট্যাপ করে বা পিন ড্র্যাগ করে সীমানা সেট করুন' : 'Tap on map or drag pin to set Geofence'}</span>
        </div>
      </div>

      {saveMessage && (
        <div className="absolute bottom-64 left-4 right-4 z-40 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center space-x-2 animate-in fade-in">
          <Check className="w-4 h-4" />
          <span>{language === 'bn' ? 'জিওফেন্সটি সফলভাবে সংরক্ষিত হয়েছে!' : 'Geofence Zone saved successfully!'}</span>
        </div>
      )}

      {/* Bottom Sheet - Interactive Geofence Editor */}
      <div className="bg-slate-900/95 backdrop-blur-2xl border-t border-slate-800 px-4 py-3 z-30 shrink-0 max-h-[310px] overflow-y-auto">
        <form onSubmit={handleSaveGeofence} className="space-y-2.5">
          {/* Zone Name & Radius Slider */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                {language === 'bn' ? 'জোনের নাম' : 'Zone Name'}
              </label>
              <input
                type="text"
                value={zoneName}
                onChange={(e) => setZoneName(e.target.value)}
                placeholder="e.g. Home Garage, Office"
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-semibold mb-1">
                <span className="text-slate-400">{language === 'bn' ? 'ব্যাসার্ধ' : 'Radius'}</span>
                <span className="font-bold text-blue-400">{radius} Meters</span>
              </div>
              <input
                type="range"
                min={100}
                max={4000}
                step={50}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500 mt-2"
              />
            </div>
          </div>

          {/* Color & Alert Toggles Row */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1.5">
              {['#3b82f6', '#10b981', '#ef4444', '#eab308', '#a855f7'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`w-5 h-5 rounded-full transition ${selectedColor === c ? 'scale-125 border-2 border-white' : 'opacity-70'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <div className="flex items-center space-x-3 text-[11px] text-slate-300">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertOnEnter}
                  onChange={(e) => setAlertOnEnter(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Enter</span>
              </label>

              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={alertOnExit}
                  onChange={(e) => setAlertOnExit(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span>Exit</span>
              </label>
            </div>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition active:scale-95 flex items-center space-x-1"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'জোন সেভ করুন' : 'Save Zone'}</span>
            </button>
          </div>

          {/* Existing Geofences List */}
          {geofences.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
                {language === 'bn' ? 'সংরক্ষিত সীমানা সমূহ' : 'Saved Geofences'} ({geofences.length})
              </div>
              <div className="flex space-x-2 overflow-x-auto pb-1">
                {geofences.map((geo) => (
                  <div
                    key={geo.id}
                    className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5 shrink-0 text-xs"
                  >
                    <div 
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: geo.attributes?.color || '#3b82f6' }}
                    />
                    <button
                      type="button"
                      onClick={() => handleFlyToGeofence(geo)}
                      className="font-bold text-slate-200 hover:text-blue-400 truncate max-w-[120px]"
                    >
                      {geo.name}
                    </button>
                    <span className="text-[10px] text-slate-400">({geo.radius}m)</span>
                    <button
                      type="button"
                      onClick={() => deleteGeofence(geo.id)}
                      className="text-slate-400 hover:text-rose-400 ml-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
