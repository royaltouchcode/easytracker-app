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
  Shield
} from 'lucide-react';
import { MapLayerType, VehicleType } from '../../types/traccar';

const MAP_LAYERS: Record<MapLayerType, { name: string; url: string; subdomains?: string[]; maxZoom: number }> = {
  google_hybrid: {
    name: 'Google Hybrid (Sat + Roads)',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    maxZoom: 21
  },
  google_satellite: {
    name: 'Google Satellite',
    url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
    maxZoom: 21
  },
  google_roadmap: {
    name: 'Google Standard Roads',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    maxZoom: 21
  },
  google_terrain: {
    name: 'Google Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    maxZoom: 20
  },
  osm: {
    name: 'OpenStreetMap (OSM)',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    subdomains: ['a', 'b', 'c'],
    maxZoom: 19
  },
  baidu_dark: {
    name: 'Dark Night Theme / Baidu Style',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    subdomains: ['a', 'b', 'c', 'd'],
    maxZoom: 20
  }
};

const TRAFFIC_LAYER_URL = 'https://mt1.google.com/vt/lyrs=h,traffic&x={x}&y={y}&z={z}';

const getVehicleSvg = (type?: VehicleType, color: string = '#3b82f6') => {
  if (type === 'motorcycle' || type === 'bicycle') {
    return `<svg viewBox="0 0 24 24" width="24" height="24" fill="white"><path d="M5 20.5A3.5 3.5 0 0 1 1.5 17 3.5 3.5 0 0 1 5 13.5c1.61 0 2.97 1.1 3.37 2.58L11 15l2-5h-3V8h3.76l1.2-3H19v2h-2.76l-.8 2H18v2h-3.24l-1.6 4H15a3.5 3.5 0 0 1 3.5-3.5 3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5 3.5 3.5 0 0 1-3.37-2.58L12 17l-1.87 2.08A3.49 3.49 0 0 1 5 20.5M5 15.5a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0-1.5-1.5m13.5 0a1.5 1.5 0 0 0-1.5 1.5 1.5 1.5 0 0 0 1.5 1.5 1.5 1.5 0 0 0 1.5-1.5 1.5 1.5 0 0 0-1.5-1.5Z"/></svg>`;
  }
  if (type === 'truck') {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9 1.96 2.5H17V9.5h2.5zm-1 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>`;
  }
  if (type === 'bus') {
    return `<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24" width="22" height="22" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>`;
};

export const LiveTrackingMap: React.FC = () => {
  const { 
    devices, 
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

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const trafficLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<Record<number, L.Marker>>({});
  const userMarkerRef = useRef<L.Marker | null>(null);
  const distanceLineRef = useRef<L.Polyline | null>(null);
  const geofenceCirclesRef = useRef<L.Circle[]>([]);

  const [isLayerDrawerOpen, setIsLayerDrawerOpen] = useState(false);
  const [followVehicle, setFollowVehicle] = useState(true);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const initialLat = selectedPosition?.latitude || 23.7937;
    const initialLon = selectedPosition?.longitude || 90.4066;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLon],
      zoom: 16,
      zoomControl: false,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    const layerConfig = MAP_LAYERS[mapLayer];
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

    const layerConfig = MAP_LAYERS[mapLayer];
    tileLayerRef.current = L.tileLayer(layerConfig.url, {
      maxZoom: layerConfig.maxZoom,
      subdomains: layerConfig.subdomains || ['a', 'b', 'c']
    }).addTo(map);

    if (showTraffic && trafficLayerRef.current) {
      trafficLayerRef.current.bringToFront();
    }
  }, [mapLayer]);

  // Toggle Traffic Layer
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

  // Render User's Live Location Marker 🔵
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!userLocation) {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      return;
    }

    const userHtml = `
      <div class="relative flex items-center justify-center">
        <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-xl flex items-center justify-center text-white">
          <div class="w-2.5 h-2.5 rounded-full bg-white animate-ping"></div>
        </div>
        <div class="absolute -bottom-5 bg-slate-900/90 text-[9px] font-bold text-blue-300 px-1.5 py-0.5 rounded-md border border-slate-700 whitespace-nowrap shadow-md">
          ${language === 'bn' ? 'আমার অবস্থান' : 'My Location'}
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
  }, [userLocation, language]);

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

  // Render Geofence Circles Clearly on Map
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
        fillOpacity: 0.18,
        weight: 2.5,
        dashArray: '6, 8'
      }).addTo(map);

      circle.bindTooltip(`🛡️ <b>${geo.name}</b><br>ব্যাসার্ধ: ${geo.radius} মি`, {
        permanent: false,
        direction: 'top'
      });

      geofenceCirclesRef.current.push(circle);
    });
  }, [geofences, showGeofenceOnMap]);

  // Update vehicle markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    devices.forEach(dev => {
      const pos = positions[dev.id];
      if (!pos || !pos.latitude || !pos.longitude || (pos.latitude === 0 && pos.longitude === 0)) return;

      const speed = Math.round(pos.speed || 0);
      const isMoving = speed > 3;
      const isIgnition = !!pos.attributes?.ignition;
      const isLastKnown = !!pos.attributes?.isLastKnown;
      const color = dev.attributes?.color || '#3b82f6';
      const heading = pos.course || 0;

      const statusClass = isMoving 
        ? 'marker-pulse-moving border-emerald-400' 
        : isIgnition 
          ? 'marker-pulse-idle border-amber-400' 
          : isLastKnown
          ? 'border-indigo-400 shadow-indigo-500/50'
          : 'marker-pulse-stopped border-rose-500';

      const customHtml = `
        <div class="custom-vehicle-marker" style="transform: rotate(${heading}deg);">
          <div class="relative w-11 h-11 rounded-2xl flex items-center justify-center shadow-2xl border-2 ${statusClass}" style="background-color: ${color};">
            ${getVehicleSvg(dev.category, color)}
            <div class="absolute -top-2 w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[8px] border-b-white"></div>
            ${isLastKnown ? `<div class="absolute -bottom-2.5 bg-indigo-600 text-white font-extrabold text-[8px] px-1 py-0.2 rounded shadow">🅿️ পার্কিং</div>` : ''}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: customHtml,
        className: 'vehicle-div-icon',
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      if (markersRef.current[dev.id]) {
        const marker = markersRef.current[dev.id];
        marker.setLatLng([pos.latitude, pos.longitude]);
        marker.setIcon(icon);
      } else {
        const marker = L.marker([pos.latitude, pos.longitude], { icon: icon }).addTo(map);
        marker.on('click', () => {
          setSelectedDeviceId(dev.id);
        });
        markersRef.current[dev.id] = marker;
      }
    });

    if (followVehicle && selectedPosition) {
      map.panTo([selectedPosition.latitude, selectedPosition.longitude], {
        animate: true,
        duration: 0.8
      });
    }
  }, [devices, positions, selectedDeviceId, followVehicle]);

  // Pan to user's phone GPS location
  const handleLocateMe = () => {
    requestUserLocation();
    setFollowVehicle(false);
    if (userLocation && mapInstanceRef.current) {
      mapInstanceRef.current.setView([userLocation.latitude, userLocation.longitude], 17, { animate: true });
    } else if (selectedPosition && mapInstanceRef.current) {
      mapInstanceRef.current.setView([selectedPosition.latitude, selectedPosition.longitude], 17, { animate: true });
    }
  };

  // Fit Bounds to Show Both User and Vehicle
  const handleFitUserAndVehicle = () => {
    if (!mapInstanceRef.current || !selectedPosition) return;
    setFollowVehicle(false);

    if (userLocation) {
      const bounds = L.latLngBounds([
        [userLocation.latitude, userLocation.longitude],
        [selectedPosition.latitude, selectedPosition.longitude]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [80, 80], maxZoom: 17 });
    } else {
      mapInstanceRef.current.setView([selectedPosition.latitude, selectedPosition.longitude], 17);
    }
  };

  const handleCenterSelected = () => {
    if (selectedPosition && mapInstanceRef.current) {
      setFollowVehicle(true);
      mapInstanceRef.current.setView([selectedPosition.latitude, selectedPosition.longitude], 17, {
        animate: true
      });
    }
  };

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-slate-950">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Floating Map Controls (Right Side) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col space-y-2">
        {/* Layer Switcher */}
        <button
          onClick={() => setIsLayerDrawerOpen(!isLayerDrawerOpen)}
          className={`p-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition active:scale-95 ${
            isLayerDrawerOpen ? 'bg-blue-600 border-blue-400 text-white' : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800'
          }`}
          title="Map Style Layers"
        >
          <Layers className="w-5 h-5" />
        </button>

        {/* Locate Me (Phone GPS) */}
        <button
          onClick={handleLocateMe}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-blue-400 hover:text-white hover:bg-slate-800 shadow-xl backdrop-blur-md transition active:scale-95"
          title="আমার বর্তমান অবস্থান (My Phone Location)"
        >
          <Crosshair className="w-5 h-5" />
        </button>

        {/* Geofence Overlay Toggle */}
        <button
          onClick={() => setShowGeofenceOnMap(!showGeofenceOnMap)}
          className={`p-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition active:scale-95 ${
            showGeofenceOnMap ? 'bg-indigo-600 border-indigo-400 text-white shadow-indigo-600/30' : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="জিওফেন্স সেফ জোন প্রদর্শন (Toggle Geofence Safe Zone)"
        >
          <Shield className="w-5 h-5" />
        </button>

        {/* Fit Both User and Vehicle */}
        <button
          onClick={handleFitUserAndVehicle}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-emerald-400 hover:text-white hover:bg-slate-800 shadow-xl backdrop-blur-md transition active:scale-95"
          title="Fit both You & Vehicle on map"
        >
          <Route className="w-5 h-5" />
        </button>

        {/* Traffic Layer Toggle */}
        <button
          onClick={() => setShowTraffic(!showTraffic)}
          className={`p-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition active:scale-95 ${
            showTraffic ? 'bg-amber-500 border-amber-400 text-white' : 'bg-slate-900/90 border-slate-700/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
          title="Toggle Live Traffic"
        >
          <TrafficCone className="w-5 h-5" />
        </button>

        {/* Re-Center / Follow Vehicle */}
        <button
          onClick={handleCenterSelected}
          className={`p-2.5 rounded-2xl border shadow-xl backdrop-blur-md transition active:scale-95 ${
            followVehicle ? 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-600/30' : 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800'
          }`}
          title="Follow Vehicle"
        >
          <LocateFixed className="w-5 h-5" />
        </button>

        {/* Zoom Controls */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-xl backdrop-blur-md flex flex-col overflow-hidden">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2.5 text-slate-200 hover:bg-slate-800 active:bg-slate-700 transition"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-[1px] bg-slate-800" />
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2.5 text-slate-200 hover:bg-slate-800 active:bg-slate-700 transition"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Map Layer Picker Drawer */}
      {isLayerDrawerOpen && (
        <div className="absolute top-3 right-16 z-30 bg-slate-900/95 border border-slate-700/90 rounded-3xl p-3 shadow-2xl backdrop-blur-xl w-64 animate-in fade-in zoom-in-95 duration-150">
          <div className="text-xs font-bold text-slate-200 px-2 mb-2 flex items-center justify-between">
            <span>{language === 'bn' ? 'ম্যাপ ভিউ নির্বাচন' : 'Map View Layers'}</span>
            <span className="text-[10px] text-blue-400">Google / OSM</span>
          </div>
          <div className="space-y-1.5">
            {(Object.keys(MAP_LAYERS) as MapLayerType[]).map((key) => {
              const isSel = mapLayer === key;
              return (
                <button
                  key={key}
                  onClick={() => {
                    setMapLayer(key);
                    setIsLayerDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                    isSel ? 'bg-blue-600 text-white font-bold shadow-md' : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span>{MAP_LAYERS[key].name}</span>
                  {isSel && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
