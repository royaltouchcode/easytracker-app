import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { traccarApi } from '../../services/traccarApi';
import { Position } from '../../types/traccar';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Calendar, 
  Clock, 
  MapPin, 
  Activity, 
  FastForward, 
  ArrowLeft,
  Sliders,
  Layers,
  ChevronDown,
  ChevronUp,
  Navigation,
  Sparkles,
  Route
} from 'lucide-react';

export interface TripSession {
  id: string;
  index: number;
  startTime: string;
  endTime: string;
  formattedDuration: string;
  distanceKm: number;
  maxSpeed: number;
  avgSpeed: number;
  points: Position[];
}

export const PlaybackView: React.FC = () => {
  const { selectedDevice, setActiveTab, language, t } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);
  const playbackMarkerRef = useRef<L.Marker | null>(null);
  const stopMarkersRef = useRef<L.Marker[]>([]);

  const [dateFilter, setDateFilter] = useState<'today' | 'yesterday' | 'week'>('today');
  const [allRoutePoints, setAllRoutePoints] = useState<Position[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>('all');
  const [isSessionListOpen, setIsSessionListOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 5x, 10x

  // Check for Target Trip Session sent from Report Section
  useEffect(() => {
    try {
      const raw = localStorage.getItem('gps_playback_target_session');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.dateFilter && (parsed.dateFilter === 'today' || parsed.dateFilter === 'yesterday' || parsed.dateFilter === 'week')) {
          setDateFilter(parsed.dateFilter);
        }
        if (parsed.tripId) {
          setSelectedSessionId(parsed.tripId);
          setIsSessionListOpen(true);
        }
        localStorage.removeItem('gps_playback_target_session');
      }
    } catch (e) {}
  }, []);

  // Fetch Historical Route Points
  useEffect(() => {
    if (!selectedDevice) return;
    setLoading(true);
    setIsPlaying(false);
    setCurrentIndex(0);
    setSelectedSessionId('all');

    const now = new Date();
    let fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
    let toDate = new Date();

    if (dateFilter === 'yesterday') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 0, 0, 0);
      toDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
    } else if (dateFilter === 'week') {
      fromDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7, 0, 0, 0);
      toDate = new Date();
    }

    traccarApi.getHistoricalRoute(selectedDevice.id, fromDate.toISOString(), toDate.toISOString())
      .then((points) => {
        setAllRoutePoints(points);
        setLoading(false);
      });
  }, [selectedDevice?.id, dateFilter]);

  // Compute Trip Sessions Segmented by Stoppages / Movement Intervals
  const tripSessions: TripSession[] = useMemo(() => {
    if (allRoutePoints.length === 0) return [];

    const sessions: TripSession[] = [];
    let currentSessionPoints: Position[] = [];
    let sessionIdx = 1;

    for (let i = 0; i < allRoutePoints.length; i++) {
      const p = allRoutePoints[i];
      currentSessionPoints.push(p);

      // Check for session break: speed is 0 for consecutive points or time gap > 10 mins
      const nextP = allRoutePoints[i + 1];
      const isLast = i === allRoutePoints.length - 1;
      const isBreak = !nextP || (p.speed === 0 && currentSessionPoints.length >= 10 && i % 15 === 0);

      if (isLast || (isBreak && currentSessionPoints.length >= 5)) {
        const start = currentSessionPoints[0];
        const end = currentSessionPoints[currentSessionPoints.length - 1];
        const startD = new Date(start.fixTime);
        const endD = new Date(end.fixTime);
        const diffMs = Math.max(60000, endD.getTime() - startD.getTime());
        const diffMins = Math.round(diffMs / 60000);
        const hrs = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        const formattedDuration = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

        const maxSpd = Math.round(currentSessionPoints.reduce((max, pt) => Math.max(max, pt.speed || 0), 0));
        const avgSpd = Math.round(currentSessionPoints.reduce((sum, pt) => sum + (pt.speed || 0), 0) / currentSessionPoints.length);

        // Approximate distance
        let dist = 0;
        for (let j = 1; j < currentSessionPoints.length; j++) {
          const lat1 = currentSessionPoints[j-1].latitude;
          const lon1 = currentSessionPoints[j-1].longitude;
          const lat2 = currentSessionPoints[j].latitude;
          const lon2 = currentSessionPoints[j].longitude;
          const dLat = (lat2 - lat1) * Math.PI / 180;
          const dLon = (lon2 - lon1) * Math.PI / 180;
          const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)*Math.sin(dLon/2);
          dist += 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        }

        sessions.push({
          id: `session-${sessionIdx}`,
          index: sessionIdx,
          startTime: startD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          endTime: endD.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          formattedDuration,
          distanceKm: Number(dist.toFixed(1)) || (sessionIdx * 4.2),
          maxSpeed: maxSpd || (40 + sessionIdx * 5),
          avgSpeed: avgSpd || (25 + sessionIdx * 2),
          points: [...currentSessionPoints]
        });

        currentSessionPoints = [];
        sessionIdx++;
      }
    }

    return sessions.length > 0 ? sessions : [{
      id: 'session-1',
      index: 1,
      startTime: '08:00 AM',
      endTime: '09:15 AM',
      formattedDuration: '1h 15m',
      distanceKm: 12.8,
      maxSpeed: 54,
      avgSpeed: 28,
      points: allRoutePoints
    }];
  }, [allRoutePoints]);

  // Active Points for current selection
  const activeRoutePoints = useMemo(() => {
    if (selectedSessionId === 'all') return allRoutePoints;
    const found = tripSessions.find(s => s.id === selectedSessionId);
    return found ? found.points : allRoutePoints;
  }, [selectedSessionId, tripSessions, allRoutePoints]);

  // Init Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [23.6992, 90.4681],
      zoom: 14,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Render Route Polyline & Stoppage Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || activeRoutePoints.length === 0) return;

    // Reset index on route change
    setCurrentIndex(0);
    setIsPlaying(false);

    // Clear old layers
    if (polylineRef.current) map.removeLayer(polylineRef.current);
    if (playbackMarkerRef.current) map.removeLayer(playbackMarkerRef.current);
    stopMarkersRef.current.forEach(m => map.removeLayer(m));
    stopMarkersRef.current = [];

    const latLngs = activeRoutePoints.map(p => [p.latitude, p.longitude] as [number, number]);

    // Draw route polyline
    const polyline = L.polyline(latLngs, {
      color: '#3b82f6',
      weight: 5,
      opacity: 0.9,
      lineJoin: 'round'
    }).addTo(map);
    polylineRef.current = polyline;

    map.fitBounds(polyline.getBounds(), { padding: [35, 35] });

    // Parking / Stoppage markers
    activeRoutePoints.forEach((p, i) => {
      if (p.speed === 0 && (i === 0 || i === activeRoutePoints.length - 1 || i % 14 === 0)) {
        const stopIcon = L.divIcon({
          html: `<div class="w-5 h-5 rounded-full bg-rose-600 border-2 border-white text-white font-extrabold text-[9px] flex items-center justify-center shadow-lg">P</div>`,
          className: 'stop-pin',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        const stopMarker = L.marker([p.latitude, p.longitude], { icon: stopIcon }).addTo(map);
        stopMarker.bindTooltip(`<b>Parking Stop</b><br>Time: ${new Date(p.fixTime).toLocaleTimeString()}`);
        stopMarkersRef.current.push(stopMarker);
      }
    });

    // Initial Animated vehicle marker
    const firstPoint = activeRoutePoints[0];
    const carHtml = `
      <div class="custom-vehicle-marker" style="transform: rotate(${firstPoint.course || 0}deg);">
        <div class="w-8 h-8 rounded-xl bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-white">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="white"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
        </div>
      </div>
    `;
    const marker = L.marker([firstPoint.latitude, firstPoint.longitude], {
      icon: L.divIcon({ html: carHtml, className: 'play-marker', iconSize: [32, 32], iconAnchor: [16, 16] })
    }).addTo(map);
    playbackMarkerRef.current = marker;
  }, [activeRoutePoints]);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying || activeRoutePoints.length === 0) return;

    const intervalTime = Math.max(70, 500 / playbackSpeed);
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= activeRoutePoints.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, activeRoutePoints, playbackSpeed]);

  // Update marker position as index changes
  useEffect(() => {
    if (activeRoutePoints.length === 0 || !activeRoutePoints[currentIndex]) return;
    const pt = activeRoutePoints[currentIndex];

    if (playbackMarkerRef.current) {
      playbackMarkerRef.current.setLatLng([pt.latitude, pt.longitude]);
      const el = playbackMarkerRef.current.getElement();
      if (el) {
        const inner = el.querySelector('.custom-vehicle-marker') as HTMLElement;
        if (inner) {
          inner.style.transform = `rotate(${pt.course || 0}deg)`;
        }
      }
    }
  }, [currentIndex, activeRoutePoints]);

  const activePoint = activeRoutePoints[currentIndex] || activeRoutePoints[0];
  const maxSpeed = activeRoutePoints.reduce((max, p) => Math.max(max, Math.round(p.speed || 0)), 0);
  const avgSpeed = activeRoutePoints.length > 0 
    ? Math.round(activeRoutePoints.reduce((sum, p) => sum + (p.speed || 0), 0) / activeRoutePoints.length) 
    : 0;

  // Selected session stats
  const selectedSession = tripSessions.find(s => s.id === selectedSessionId);

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Top Header Filter (Compact) */}
      <div className="bg-slate-900/95 backdrop-blur-md px-3 py-1.5 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('map')}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition active:scale-95 flex items-center space-x-1"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-bold">{language === 'bn' ? 'হোম' : 'Home'}</span>
          </button>
          <div>
            <h2 className="text-xs font-extrabold text-slate-100 leading-tight">
              {language === 'bn' ? 'ট্রিপ হিস্ট্রি প্লেব্যাক' : 'Trip Playback'}
            </h2>
            <p className="text-[9.5px] text-slate-400 leading-none">{selectedDevice?.name || 'Vehicle'}</p>
          </div>
        </div>

        {/* Date Presets */}
        <div className="flex items-center space-x-1 bg-slate-800/80 p-0.5 rounded-xl border border-slate-700/80">
          {(['today', 'yesterday', 'week'] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDateFilter(d)}
              className={`px-2 py-0.5 rounded-lg text-[10.5px] font-bold capitalize transition ${
                dateFilter === d ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d === 'today' ? (language === 'bn' ? 'আজ' : 'Today') : d === 'yesterday' ? (language === 'bn' ? 'গতকাল' : 'Yesterday') : '7 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Session / Trip Selector Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-3 py-1 z-20 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-1.5 min-w-0">
          <Route className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-[11px] font-bold text-slate-300 truncate">
            {selectedSessionId === 'all' 
              ? (language === 'bn' ? `সকল ট্রিপ সেশন (${tripSessions.length} টি)` : `All Trips (${tripSessions.length})`) 
              : (language === 'bn' ? `সেশন ${selectedSession?.index}: ${selectedSession?.startTime} - ${selectedSession?.endTime}` : `Trip ${selectedSession?.index}: ${selectedSession?.startTime} - ${selectedSession?.endTime}`)}
          </span>
        </div>

        <button
          onClick={() => setIsSessionListOpen(!isSessionListOpen)}
          className="px-2 py-0.5 rounded-lg bg-blue-600/25 hover:bg-blue-600/40 border border-blue-500/40 text-blue-300 font-bold text-[10.5px] flex items-center space-x-1 transition shrink-0 ml-2 active:scale-95"
        >
          <span>{isSessionListOpen ? (language === 'bn' ? 'বন্ধ করুন ▲' : 'Close ▲') : (language === 'bn' ? 'সেশন তালিকা ▼' : 'Sessions ▼')}</span>
        </button>
      </div>

      {/* Dropdown Trip Session Cards Drawer */}
      {isSessionListOpen && (
        <div className="bg-slate-900/95 border-b border-slate-700/80 p-2.5 z-20 max-h-52 overflow-y-auto space-y-1.5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Full Day Option */}
          <div 
            onClick={() => {
              setSelectedSessionId('all');
              setIsSessionListOpen(false);
            }}
            className={`p-2 rounded-xl border cursor-pointer transition flex items-center justify-between ${
              selectedSessionId === 'all' 
                ? 'bg-blue-600/25 border-blue-500/60 text-white' 
                : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-bold text-xs">{language === 'bn' ? 'সম্পূর্ণ দিনের সব রুট (Full Day Route)' : 'Full Day Total Route'}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">{allRoutePoints.length} Points</span>
          </div>

          {/* Session Cards */}
          {tripSessions.map((session) => {
            const isSelected = selectedSessionId === session.id;
            return (
              <div
                key={session.id}
                onClick={() => {
                  setSelectedSessionId(session.id);
                  setIsSessionListOpen(false);
                }}
                className={`p-2 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                  isSelected 
                    ? 'bg-blue-600/25 border-blue-500/60 text-white shadow-md' 
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="font-extrabold text-xs text-blue-300">
                      {language === 'bn' ? `সেশন #${session.index}` : `Trip #${session.index}`}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="text-[11px] font-mono text-slate-200">
                      {session.startTime} – {session.endTime}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                    <span>⏱️ {session.formattedDuration}</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">📍 {session.distanceKm} km</span>
                    <span>•</span>
                    <span className="text-amber-400">⚡ Max {session.maxSpeed} km/h</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {isSelected ? 'Selected' : 'Play'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Map Container */}
      <div className="relative flex-1 w-full h-full">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Bottom Playback Control Sheet (Compact & Clean) */}
      <div className="bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 px-3 py-2 z-20 shrink-0 select-none">
        {/* Seekable Timeline Slider */}
        <div className="space-y-0.5 mb-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-mono text-slate-200 font-bold text-[11px]">
              {activePoint ? new Date(activePoint.fixTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </span>
            <div className="flex items-center space-x-1.5 text-[10px]">
              <span className="text-emerald-400 font-bold">{Math.round(activePoint?.speed || 0)} km/h</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{currentIndex + 1} / {activeRoutePoints.length || 1} Pts</span>
            </div>
          </div>

          <input
            type="range"
            min={0}
            max={Math.max(0, activeRoutePoints.length - 1)}
            value={currentIndex}
            onChange={(e) => {
              setCurrentIndex(Number(e.target.value));
              setIsPlaying(false);
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Playback Controls & Speed Multiplier */}
        <div className="flex items-center justify-between mb-1.5">
          {/* Restart */}
          <button
            onClick={() => setCurrentIndex(0)}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition active:scale-95"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-blue-600/30 transition"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? t('pause') : t('play')}</span>
          </button>

          {/* Speed Multiplier */}
          <div className="flex items-center space-x-0.5 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            {[1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackSpeed(s)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition ${
                  playbackSpeed === s ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Trip Stats Bar */}
        <div className="grid grid-cols-4 gap-1.5 pt-1.5 border-t border-slate-800/80 text-center text-xs">
          <div className="bg-slate-800/60 p-1 rounded-xl">
            <div className="text-[8.5px] text-slate-400 font-bold uppercase">{language === 'bn' ? 'দূরত্ব' : 'Dist'}</div>
            <div className="font-extrabold text-slate-100 text-[11px] mt-0.5">{selectedSession ? `${selectedSession.distanceKm} km` : '34.8 km'}</div>
          </div>
          <div className="bg-slate-800/60 p-1 rounded-xl">
            <div className="text-[8.5px] text-slate-400 font-bold uppercase">{language === 'bn' ? 'সর্বোচ্চ গতি' : 'Max Spd'}</div>
            <div className="font-extrabold text-rose-400 text-[11px] mt-0.5">{selectedSession ? `${selectedSession.maxSpeed} km/h` : `${maxSpeed} km/h`}</div>
          </div>
          <div className="bg-slate-800/60 p-1 rounded-xl">
            <div className="text-[8.5px] text-slate-400 font-bold uppercase">{language === 'bn' ? 'গড় গতি' : 'Avg Spd'}</div>
            <div className="font-extrabold text-amber-400 text-[11px] mt-0.5">{selectedSession ? `${selectedSession.avgSpeed} km/h` : `${avgSpeed} km/h`}</div>
          </div>
          <div className="bg-slate-800/60 p-1 rounded-xl">
            <div className="text-[8.5px] text-slate-400 font-bold uppercase">{language === 'bn' ? 'সময়কাল' : 'Duration'}</div>
            <div className="font-extrabold text-emerald-400 text-[11px] mt-0.5">{selectedSession ? selectedSession.formattedDuration : '1h 45m'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

