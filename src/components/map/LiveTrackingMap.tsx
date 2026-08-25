import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { 
  Layers, 
  TrafficCone, 
  LocateFixed, 
  Plus, 
  Minus, 
  Route,
  Crosshair,
  Shield,
  Sparkles,
  MapPin,
  Check,
  Navigation
} from 'lucide-react';
import { MapLayerType, VehicleType } from '../../types/traccar';
import { getVehicleMarkerSvg } from '../../utils/vehicleIcons';

const MAP_LAYERS: Record<MapLayerType, { name: string; url: string; subdomains?: string[]; maxZoom: number }> = {
  carto_positron: {
    name: 'EasyTracker Clean Streets (HD Vector)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20
  },
  google_hybrid: {
    name: 'Google HD Satellite (Sat + Roads)',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    maxZoom: 21
  },
  google_roadmap: {
    name: 'Google Standard Roads',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 21
  },
  baidu_dark: {
    name: 'Dark Night Theme / Cyberpunk',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20
  },
  osm: {
    name: 'OpenStreetMap (OSM)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  },
  google_satellite: {
    name: 'Google Pure Satellite',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    maxZoom: 21
  },
  google_terrain: {
    name: 'Google Topo Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    maxZoom: 20
  }
};

const TRAFFIC_LAYER_URL = 'https://mt1.google.com/vt/lyrs=h,traffic&x={x}&y={y}&z={z}';

export const LiveTrackingMap: React.FC = () => {
  const { 
    user,
    devices, 
    tenantDevices,
    selectedDeviceId, 
    setSelectedDeviceId,
    selectedPosition, 
    positions, 
    userLocation,
    requestUserLocation,
    mapLayer, 
    setMapLayer, 
    showTraffic, 
    setShowTraffic,
    showDistanceLine,
    showGeofenceOnMap,
    setShowGeofenceOnMap,
    geofences,
    language
  } = useApp();

  const displayDevices = user?.partnerId 
    ? (tenantDevices.length > 0 ? tenantDevices : devices) 
    : (user?.role === 'customer' ? devices.slice(0, 1) : devices);

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const trafficLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const distanceLineRef = useRef<L.Polyline | null>(null);
  const trailPolylineRef = useRef<L.Polyline | null>(null);
  const geofenceCirclesRef = useRef<L.Circle[]>([]);

  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);
  const [followVehicle, setFollowVehicle] = useState(true);
  const [showLiveTrail, setShowLiveTrail] = useState(true);
  const [trailCoordinates, setTrailCoordinates] = useState<[number, number][]>([]);

  // Initialize Map with Clean Vector Tiles
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = (selectedPosition?.latitude && selectedPosition.latitude !== 0) ? selectedPosition.latitude : 23.7937;
    const initialLon = (selectedPosition?.longitude && selectedPosition.longitude !== 0) ? selectedPosition.longitude : 90.4066;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    const layerConfig = MAP_LAYERS[mapLayer] || MAP_LAYERS.carto_positron;
    const tile = L.tileLayer(layerConfig.url, {
      maxZoom: layerConfig.maxZoom,
      subdomains: layerConfig.subdomains || ['a', 'b', 'c']
    }).addTo(map);
    tileLayerRef.current = tile;

    if (showTraffic) {
      trafficLayerRef.current = L.tileLayer(TRAFFIC_LAYER_URL, { maxZoom: 20 }).addTo(map);
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update base tile layer on layer change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const layerConfig = MAP_LAYERS[mapLayer] || MAP_LAYERS.carto_positron;
    tileLayerRef.current = L.tileLayer(layerConfig.url, {
      maxZoom: layerConfig.maxZoom,
      subdomains: layerConfig.subdomains || ['a', 'b', 'c']
    }).addTo(map);

    if (showTraffic && trafficLayerRef.current) {
      trafficLayerRef.current.bringToFront();
    }
  }, [mapLayer]);

  // Toggle Live Google Traffic Overlay
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (showTraffic) {
      if (!trafficLayerRef.current) {
        trafficLayerRef.current = L.tileLayer(TRAFFIC_LAYER_URL, { maxZoom: 20 }).addTo(map);
      }
    } else {
      if (trafficLayerRef.current) {
        map.removeLayer(trafficLayerRef.current);
        trafficLayerRef.current = null;
      }
    }
  }, [showTraffic]);

  // Update User Phone Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;

    const userHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full bg-blue-500/25 animate-ping absolute"></div>
        <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      html: userHtml,
      className: 'user-location-pin',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation.latitude, userLocation.longitude]);
    } else {
      const marker = L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon }).addTo(map);
      userMarkerRef.current = marker;
    }
  }, [userLocation]);

  // Draw Distance Line between User and Vehicle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (distanceLineRef.current) {
      map.removeLayer(distanceLineRef.current);
      distanceLineRef.current = null;
    }

    if (showDistanceLine && userLocation && selectedPosition) {
      const line = L.polyline(
        [
          [userLocation.latitude, userLocation.longitude],
          [selectedPosition.latitude, selectedPosition.longitude]
        ],
        {
          color: '#3b82f6',
          weight: 3,
          dashArray: '6, 10',
          opacity: 0.85
        }
      ).addTo(map);

      distanceLineRef.current = line;
    }
  }, [userLocation, selectedPosition, showDistanceLine]);

  // Draw Live Breadcrumb Trail for Moving Vehicle
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPosition) return;

    if (selectedPosition.latitude && selectedPosition.longitude) {
      setTrailCoordinates(prev => {
        const last = prev[prev.length - 1];
        if (!last || Math.abs(last[0] - selectedPosition.latitude) > 0.00005 || Math.abs(last[1] - selectedPosition.longitude) > 0.00005) {
          const next = [...prev, [selectedPosition.latitude, selectedPosition.longitude] as [number, number]];
          return next.slice(-40); // Keep last 40 points
        }
        return prev;
      });
    }
  }, [selectedPosition]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (trailPolylineRef.current) {
      map.removeLayer(trailPolylineRef.current);
      trailPolylineRef.current = null;
    }

    if (showLiveTrail && trailCoordinates.length > 1) {
      const trail = L.polyline(trailCoordinates, {
        color: '#06b6d4',
        weight: 4,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      trailPolylineRef.current = trail;
    }
  }, [trailCoordinates, showLiveTrail]);

  // Render Geofence Circles on Map
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    geofenceCirclesRef.current.forEach(c => map.removeLayer(c));
    geofenceCirclesRef.current = [];

    if (!showGeofenceOnMap) return;

    geofences.forEach(geo => {
      if ((geo.attributes as any)?.enabled === false) return;

      const circle = L.circle([geo.latitude, geo.longitude], {
        radius: geo.radius || 300,
        color: geo.attributes?.color || '#3b82f6',
        fillColor: geo.attributes?.color || '#3b82f6',
        fillOpacity: 0.15,
        weight: 2,
        dashArray: '6, 8'
      }).addTo(map);

      circle.bindTooltip(`🛡️ <b>${geo.name}</b>`, {
        permanent: false,
        direction: 'top'
      });

      geofenceCirclesRef.current.push(circle);
    });
  }, [geofences, showGeofenceOnMap]);

  // =========================================================================
  // 🏍️ ULTRA-MODERN 3D TOP-DOWN VEHICLE MARKER ENGINE (MyGPS / Xeekar Style)
  // =========================================================================
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Remove ghost markers that are not in displayDevices
    const activeIds = new Set(displayDevices.map(d => d.id));
    Object.keys(markersRef.current).forEach(idStr => {
      const devId = Number(idStr);
      if (!activeIds.has(devId)) {
        map.removeLayer(markersRef.current[devId]);
        delete markersRef.current[devId];
      }
    });

    // 2. Render / update markers for all active displayDevices
    displayDevices.forEach(dev => {
      const pos = positions[dev.id] || (dev.id === selectedDevice?.id ? selectedPosition : null);
      if (!pos || !pos.latitude || !pos.longitude || (pos.latitude === 0 && pos.longitude === 0)) return;

      const speed = Math.round(pos.speed || 0);
      const isMoving = speed > 3;
      const isIgnition = !!pos.attributes?.ignition;
      const isLastKnown = !!pos.attributes?.isLastKnown;
      const color = dev.attributes?.color || '#ef4444';
      const heading = pos.course || 0;

      const statusGlow = isMoving 
        ? 'rgba(16, 185, 129, 0.5)' 
        : isIgnition 
          ? 'rgba(245, 158, 11, 0.5)' 
          : 'rgba(239, 68, 68, 0.4)';

      const customHtml = `
        <div class="relative flex flex-col items-center justify-center pointer-events-none select-none" style="width: 140px; margin-left: -46px; margin-top: -36px;">
          <!-- 1. Sleek Floating Micro-Pill (Always Horizontal, Non-Rotated) -->
          <div class="mb-1.5 bg-slate-900/95 backdrop-blur-md text-white border border-slate-700 rounded-full px-2.5 py-0.5 shadow-2xl flex items-center space-x-1.5 whitespace-nowrap text-[9.5px] font-extrabold ring-1 ring-white/20">
            <span class="w-2 h-2 rounded-full ${isMoving ? 'bg-emerald-400 animate-ping' : isIgnition ? 'bg-amber-400' : 'bg-rose-400'}"></span>
            <span class="text-slate-100 max-w-[70px] truncate">${dev.name}</span>
            <span class="text-emerald-400 font-mono font-black">${isMoving ? `${speed} km/h` : isIgnition ? 'Idle' : '🅿️ Parked'}</span>
          </div>

          <!-- 2. Translucent Halo Radar Pulse & Rotatable 3D Vehicle -->
          <div class="relative w-14 h-14 flex items-center justify-center">
            <!-- Pulsing Radar Glow Disc -->
            <div class="absolute inset-0 rounded-full ${isMoving ? 'animate-ping' : ''}" style="background-color: ${statusGlow}; transform: scale(${isMoving ? '1.4' : '1.1'});"></div>

            <!-- Sleek Rotatable Vehicle Model with Forward Heading Arrow -->
            <div class="relative w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 drop-shadow-2xl" style="transform: rotate(${heading}deg);">
              <!-- Heading Pointer Indicator -->
              <div class="absolute -top-3 text-cyan-400 text-[12px] font-black drop-shadow-md">▲</div>
              ${getVehicleMarkerSvg(dev.category, color)}
            </div>
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'vehicle-div-icon',
        iconSize: [48, 48],
        iconAnchor: [24, 24]
      });

      if (markersRef.current[dev.id]) {
        const marker = markersRef.current[dev.id];
        marker.setLatLng([pos.latitude, pos.longitude]);
        marker.setIcon(icon);
        marker.setZIndexOffset(dev.id === selectedDevice?.id ? 1000 : 500);
      } else {
        const marker = L.marker([pos.latitude, pos.longitude], {
          icon,
          zIndexOffset: dev.id === selectedDevice?.id ? 1000 : 500
        }).addTo(map);

        marker.on('click', () => {
          setSelectedDeviceId(dev.id);
        });

        markersRef.current[dev.id] = marker;
      }
    });

    // 3. Keep camera centered on selected vehicle's actual location
    if (followVehicle && selectedPosition && selectedPosition.latitude && selectedPosition.longitude && selectedPosition.latitude !== 0) {
      map.setView([selectedPosition.latitude, selectedPosition.longitude], map.getZoom() < 15 ? 16 : map.getZoom(), {
        animate: true,
        duration: 0.5
      });
    }
  }, [displayDevices, positions, selectedDeviceId, followVehicle]);

  // Center on Vehicle GPS
  const handleCenterVehicle = () => {
    setFollowVehicle(true);
    if (selectedPosition && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedPosition.latitude, selectedPosition.longitude], 17, { animate: true });
    }
  };

  // Center on User Phone GPS
  const handleLocateMe = () => {
    requestUserLocation();
    setFollowVehicle(false);
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 17, { animate: true });
    } else if (selectedPosition && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedPosition.latitude, selectedPosition.longitude], 17, { animate: true });
    }
  };

  // Zoom In / Zoom Out
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden select-none">
      {/* Leaflet Map Root */}
      <div ref={mapContainerRef} className="w-full h-full bg-slate-950 z-0" />

      {/* ========================================================================= */}
      {/* 🎛️ RIGHT-SIDE FROSTED GLASS FLOATING ACTIONS RAIL (MyGPS Style)          */}
      {/* ========================================================================= */}
      <div className="absolute right-3 top-4 z-20 flex flex-col space-y-2">
        {/* Layer Switcher Button */}
        <button
          onClick={() => setIsLayerDrawerOpen(!isLayerDrawerOpen)}
          className="w-10 h-10 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 hover:border-blue-500/60 text-slate-200 hover:text-white flex items-center justify-center shadow-2xl transition active:scale-95 group"
          title="ম্যাপ লেয়ার ও স্যাটেলাইট ভিউ"
        >
          <Layers className="w-5 h-5 text-blue-400 group-hover:rotate-12 transition-transform" />
        </button>

        {/* Live Traffic Overlay Toggle */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`w-10 h-10 rounded-2xl backdrop-blur-md border flex items-center justify-center shadow-2xl transition active:scale-95 ${
            showTraffic 
              ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-amber-500/40' 
              : 'bg-slate-900/85 border-slate-700/80 text-amber-400 hover:text-amber-300'
          }`}
          title="লাইভ গুগল ট্রাফিক (Traffic Jam)"
        >
          <TrafficCone className="w-5 h-5" />
        </button>

        {/* Live Breadcrumb Trail Toggle */}
        <button
          onClick={() => setShowLiveTrail(!showLiveTrail)}
          className={`w-10 h-10 rounded-2xl backdrop-blur-md border flex items-center justify-center shadow-2xl transition active:scale-95 ${
            showLiveTrail 
              ? 'bg-cyan-600 border-cyan-400 text-white shadow-cyan-600/40' 
              : 'bg-slate-900/85 border-slate-700/80 text-cyan-400'
          }`}
          title="লাইভ রানিং ট্রেইল পাথ"
        >
          <Route className="w-5 h-5" />
        </button>

        {/* Safe Geofence Toggle */}
        <button
          onClick={() => setShowGeofenceOnMap(!showGeofenceOnMap)}
          className={`w-10 h-10 rounded-2xl backdrop-blur-md border flex items-center justify-center shadow-2xl transition active:scale-95 ${
            showGeofenceOnMap 
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-600/40' 
              : 'bg-slate-900/85 border-slate-700/80 text-indigo-400'
          }`}
          title="সেফ জোন জিওফেন্স প্রদর্শন"
        >
          <Shield className="w-5 h-5" />
        </button>

        {/* Direct Center on Vehicle GPS Button */}
        <button
          onClick={handleCenterVehicle}
          className={`w-10 h-10 rounded-2xl backdrop-blur-md border flex items-center justify-center shadow-2xl transition active:scale-95 ${
            followVehicle 
              ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/40' 
              : 'bg-slate-900/85 border-slate-700/80 text-emerald-400 hover:text-emerald-300'
          }`}
          title="গাড়ির আসল লোকেশনে সেন্টারিং"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* User Phone GPS Location Button */}
        <button
          onClick={handleLocateMe}
          className="w-10 h-10 rounded-2xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 hover:border-blue-500/60 text-slate-200 hover:text-white flex items-center justify-center shadow-2xl transition active:scale-95"
          title="আমার মোবাইলের লোকেশন"
        >
          <LocateFixed className="w-5 h-5 text-blue-400" />
        </button>

        {/* Smooth Zoom Controls */}
        <div className="flex flex-col bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="w-10 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95 border-b border-slate-800"
            title="Zoom In"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 transition active:scale-95"
            title="Zoom Out"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Selection Modal Drawer */}
      {isLayerDrawerOpen && (
        <div className="absolute top-16 right-16 z-30 w-64 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-3xl p-3.5 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <span className="text-xs font-extrabold text-slate-200 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'bn' ? 'ম্যাপ থিম ও লেয়ার' : 'Map Layers'}</span>
            </span>
            <button onClick={() => setIsLayerDrawerOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto">
            {Object.entries(MAP_LAYERS).map(([key, config]) => {
              const isSel = mapLayer === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setMapLayer(key as MapLayerType);
                    setIsLayerDrawerOpen(false);
                  }}
                  className={`w-full p-2 rounded-2xl text-left text-xs font-bold transition flex items-center justify-between ${
                    isSel 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' 
                      : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  <span className="truncate">{config.name}</span>
                  {isSel && <Check className="w-3.5 h-3.5 text-white shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
