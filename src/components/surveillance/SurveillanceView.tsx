import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Video, 
  Mic, 
  Camera, 
  Download, 
  Trash2, 
  Radio, 
  RotateCw, 
  Volume2, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Calendar,
  AlertCircle,
  FileCheck2,
  Check,
  CheckCircle2,
  Sparkles,
  Sliders,
  AlertTriangle,
  Lock,
  Eye,
  Play,
  HardDrive,
  Cpu,
  Layers,
  PhoneCall,
  ArrowLeft,
  BarChart3
} from 'lucide-react';
import { MediaEvidence } from '../../types/traccar';
import { PinVerificationModal } from '../commands/PinVerificationModal';

export const SurveillanceView: React.FC = () => {
  const { 
    selectedDevice, 
    selectedPosition, 
    evidenceList, 
    addEvidence, 
    deleteEvidence, 
    language, 
    t,
    setActiveTab
  } = useApp();

  const [activeCam, setActiveCam] = useState<'front' | 'cabin' | 'rear' | '360'>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [isListeningAudio, setIsListeningAudio] = useState(false);
  const [snapshotTakenNotice, setSnapshotTakenNotice] = useState(false);
  const [isStorageModalOpen, setIsStorageModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [selectedBlackboxItem, setSelectedBlackboxItem] = useState<any | null>(null);

  // Storage Flexi-Plan Subscription State
  const [storageTier, setStorageTier] = useState<{ capMb: number; retentionDays: number; priceBdt: number }>({
    capMb: 200,
    retentionDays: 3,
    priceBdt: 0
  });

  const speedKmh = selectedPosition ? Math.round(selectedPosition.speed) : 0;
  const address = selectedPosition?.address || 'Gulshan-2, Dhaka';
  const plate = selectedDevice?.attributes?.plateNumber || 'DHAKA METRO-LA 28-9798';
  const imei = selectedDevice?.uniqueId || '354778343153865';

  // Calculate Used Storage
  const usedStorageMb = Math.min(186, Math.round(evidenceList.length * 18.5 + 42));
  const storagePercent = Math.min(100, Math.round((usedStorageMb / storageTier.capMb) * 100));

  // Accident Crash Blackbox Footage Mock/Real Data
  const [crashRecordings, setCrashRecordings] = useState([
    {
      id: 'crash-001',
      title: '🚨 তীব্র ক্র্যাশ ইমপ্যাক্ট (4.6G) - ৫ মিনিট অটো-লকড ফুটেজ',
      date: '18 Aug 2026, 04:32 PM',
      location: 'Airport Road, Kuril Flyover, Dhaka',
      impactG: '4.6 G',
      duration: '05:00 min',
      cameras: 'Dual (Front + Cabin)',
      status: 'LOCKED_LEGAL_EVIDENCE',
      sosAlertSent: true,
      fileSize: '48.2 MB'
    }
  ]);

  // Traffic Sign Violations AI Auto-Clips
  const [violationClips, setViolationClips] = useState([
    {
      id: 'viol-01',
      title: '🚦 ট্রাফিক রেড লাইট স্কিপ ভায়োলেশন (৮ সেকেন্ড ক্লিপ)',
      timestamp: 'Today, 11:24 AM',
      location: 'Mohakhali Intersection (23.7781°N, 90.3972°E)',
      speed: '44 km/h',
      sign: 'Red Traffic Signal Breached',
      duration: '00:08 min',
      size: '2.4 MB',
      isDeletedFile: false
    },
    {
      id: 'viol-02',
      title: '⚠️ রং লেন ও ওভারস্পিড সতর্কতা (৬ সেকেন্ড ক্লিপ)',
      timestamp: 'Yesterday, 06:15 PM',
      location: 'Bijoy Sarani, Dhaka (23.7658°N, 90.3884°E)',
      speed: '78 km/h',
      sign: 'Speed Limit 50 Exceeded',
      duration: '00:06 min',
      size: '1.9 MB',
      isDeletedFile: true // File deleted to save storage, metadata preserved!
    }
  ]);

  // Handle Live Snapshot Capture with GPS & Legal Watermark
  const handleTakeSnapshot = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background placeholder
    const gradient = ctx.createLinearGradient(0, 0, 1280, 720);
    gradient.addColorStop(0, '#020617');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1280, 720);

    // Draw camera header
    ctx.fillStyle = activeCam === 'front' ? '#22c55e' : activeCam === 'cabin' ? '#38bdf8' : activeCam === 'rear' ? '#f59e0b' : '#a855f7';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText(`CAM: ${activeCam.toUpperCase()} LIVE STREAM | EASYTRACKER HD`, 40, 60);

    // Draw Legal Digital Watermark Overlay at bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
    ctx.fillRect(0, 560, 1280, 160);

    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`VEHICLE: ${selectedDevice?.name || 'Vehicle'} | PLATE: ${plate} | IMEI: ${imei}`, 40, 600);
    ctx.fillText(`SPEED: ${speedKmh} km/h | GPS: ${selectedPosition?.latitude?.toFixed(5) || '23.79370'}N, ${selectedPosition?.longitude?.toFixed(5) || '90.40660'}E | ${address}`, 40, 640);
    ctx.fillText(`TIME: ${new Date().toLocaleString()} | DURATION: LIVE SNAP | LEGAL WATERMARK`, 40, 680);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);

    addEvidence({
      deviceId: selectedDevice?.id || 101,
      deviceName: selectedDevice?.name || 'Vehicle',
      type: 'photo',
      url: dataUrl,
      thumbnailUrl: dataUrl,
      latitude: selectedPosition?.latitude || 23.7937,
      longitude: selectedPosition?.longitude || 90.4066,
      speed: speedKmh,
      triggerEvent: `Manual Snapshot (${activeCam.toUpperCase()} Cam)`,
      note: `Legal Watermark Embedded | Plate: ${plate} | IMEI: ${imei}`
    });

    setSnapshotTakenNotice(true);
    setTimeout(() => setSnapshotTakenNotice(false), 2500);
  };

  // Download Evidence locally with Watermarked filename
  const handleDownloadEvidence = (item: MediaEvidence) => {
    const a = document.createElement('a');
    a.href = item.url;
    a.download = `EasyTracker_Evidence_${plate}_${new Date(item.timestamp).toISOString().slice(0, 19)}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUnlockBlackbox = (item: any) => {
    setSelectedBlackboxItem(item);
    setIsPinModalOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-24 select-none">
      
      {/* 🧭 Top Navigation & Return to Report Dashboard Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 p-2.5 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-2">
          {/* Back to Reports Hub Button */}
          <button
            onClick={() => setActiveTab('reports')}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center space-x-2 transition active:scale-95 shadow-md shadow-blue-600/30 ring-1 ring-blue-400/50"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
            <BarChart3 className="w-4 h-4 text-amber-300" />
            <span>{language === 'bn' ? 'রিপোর্ট ড্যাশবোর্ডে ফিরে যান' : 'Back to Reports Dashboard'}</span>
          </button>

          {/* Direct Live Map Shortcut */}
          <button
            onClick={() => setActiveTab('map')}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs flex items-center space-x-1.5 transition active:scale-95 border border-slate-700"
          >
            <span>🗺️ ম্যাপে যান</span>
          </button>
        </div>

        <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950 px-2.5 py-1 rounded-full border border-purple-800 hidden sm:inline-block">
          EasyTracker 360° ADAS Hub
        </span>
      </div>

      {/* Header with Storage Meter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-900/90 border border-slate-800 p-4 rounded-3xl shadow-xl gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center shadow-md">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold">
                {language === 'bn' ? 'স্মার্ট ড্যাশ-ক্যাম ও অডিও সার্ভেল্যান্স' : 'Smart Dashcam & Audio Surveillance'}
              </h2>
              <span className="text-[9.5px] font-mono text-purple-300 font-bold bg-purple-950 px-2 py-0.5 rounded-full border border-purple-800">
                360° AI ADAS
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {selectedDevice?.name} • {plate} • IMEI: {imei}
            </p>
          </div>
        </div>

        {/* Storage Cap Gauge & Flexi-Builder Button */}
        <div className="w-full sm:w-auto bg-slate-950 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between space-x-3 shrink-0">
          <div className="min-w-[140px]">
            <div className="flex items-center justify-between text-[10px] font-bold mb-1">
              <span className="text-slate-400 flex items-center space-x-1">
                <HardDrive className="w-3 h-3 text-purple-400" />
                <span>স্টোরেজ স্লট</span>
              </span>
              <span className={storagePercent > 80 ? 'text-rose-400' : 'text-purple-300'}>
                {usedStorageMb} MB / {storageTier.capMb} MB
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 rounded-full ${
                  storagePercent > 80 ? 'bg-rose-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                }`}
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <span className="text-[8.5px] text-slate-500 block mt-0.5 font-mono">
              {storageTier.retentionDays} দিন রোলিং ব্যাকআপ • MinIO S3
            </span>
          </div>

          <button
            onClick={() => setIsStorageModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-[10px] font-bold flex items-center space-x-1 transition active:scale-95 shrink-0"
          >
            <Sliders className="w-3 h-3" />
            <span>আপগ্রেড</span>
          </button>
        </div>
      </div>

      {/* 1. Multi-Camera 360° Viewport Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Video Viewport Header */}
        <div className="bg-slate-850 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wide font-mono">
              {activeCam === 'front' ? 'CAM 1: ROAD FORWARD 1080P' : activeCam === 'cabin' ? 'CAM 2: CABIN DRIVER VIEW' : activeCam === 'rear' ? 'CAM 3: REAR ROAD BACK' : 'CAM 4: 360° PANORAMA'}
            </span>
          </div>

          {/* Camera Selector Pills */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
            {[
              { id: 'front', label: 'সামনে' },
              { id: 'cabin', label: 'কেবিন' },
              { id: 'rear', label: 'পিছনে' },
              { id: '360', label: '৩৬০°' }
            ].map(cam => (
              <button
                key={cam.id}
                onClick={() => setActiveCam(cam.id as any)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  activeCam === cam.id 
                    ? 'bg-purple-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>

        {/* Video Viewport with Live Watermark */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src={activeCam === 'front' 
              ? 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80' 
              : activeCam === 'cabin'
              ? 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'
              : 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'}
            alt="Live Stream"
            className="w-full h-full object-cover"
          />

          {/* Live Watermark Overlay (Real-Time GPS + Plate + IMEI) */}
          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-mono text-white flex items-center space-x-2 border border-white/15 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE 1080P HD • 30 FPS • H.265</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md p-2.5 rounded-2xl text-[10px] font-mono text-slate-200 border border-white/15 flex justify-between items-center shadow-2xl">
            <div>
              <div className="font-bold text-white text-xs flex items-center space-x-2">
                <span>🚗 {plate}</span>
                <span className="text-slate-500">|</span>
                <span className="text-emerald-400">⚡ {speedKmh} km/h</span>
                <span className="text-slate-500">|</span>
                <span className="text-purple-300">📟 {imei}</span>
              </div>
              <div className="text-slate-300 text-[9.5px] truncate max-w-[340px] mt-0.5">
                📍 {selectedPosition?.latitude?.toFixed(5) || '23.79370'}°N, {selectedPosition?.longitude?.toFixed(5) || '90.40660'}°E • {address}
              </div>
            </div>
            <div className="text-right text-slate-300 shrink-0 font-bold text-[10px]">
              <div>{new Date().toLocaleTimeString()}</div>
              <span className="text-[8px] text-amber-400 font-bold bg-amber-950/80 px-1 rounded border border-amber-500/40">
                POLICE & BRTA WATERMARK
              </span>
            </div>
          </div>
        </div>

        {/* Surveillance Quick Actions Bar */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 grid grid-cols-3 gap-2">
          {/* Instant Photo Snapshot */}
          <button
            onClick={handleTakeSnapshot}
            className="py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 shadow-md shadow-blue-600/20"
          >
            <Camera className="w-4 h-4" />
            <span>{language === 'bn' ? 'স্ন্যাপশট তুলুন' : 'Take Snapshot'}</span>
          </button>

          {/* Record Video Clip */}
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 ${
              isRecording 
                ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/30' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{isRecording ? 'রেকর্ড হচ্ছে...' : (language === 'bn' ? 'ভিডিও ক্লিপ রেকর্ড' : 'Record Clip')}</span>
          </button>

          {/* Remote Voice Listen-in */}
          <button
            onClick={() => setIsListeningAudio(!isListeningAudio)}
            className={`py-2.5 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95 ${
              isListeningAudio 
                ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                : 'bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700'
            }`}
          >
            <Mic className="w-4 h-4" />
            <span>{isListeningAudio ? 'শুনছেন...' : (language === 'bn' ? 'ভয়েস শুনুন' : 'Listen Voice')}</span>
          </button>
        </div>
      </div>

      {snapshotTakenNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 shrink-0" />
          <span>{language === 'bn' ? 'ছবিটি সফলভাবে জিপিএস ও আইএমইআই ওয়াটারমার্ক সহ এভিডেন্স লকারে সংরক্ষণ করা হয়েছে!' : 'Snapshot saved with full Legal GPS Watermark!'}</span>
        </div>
      )}

      {/* 2. 🚨 Autonomous Crash & Accident Blackbox Security Vault */}
      <div className="bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900 border border-rose-500/50 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/40">
              <AlertTriangle className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-rose-300 block">
                {language === 'bn' ? '🚨 এক্সিডেন্ট ব্ল্যাকবক্স ভল্ট (Autonomous Crash Vault)' : 'Autonomous Crash Blackbox Vault'}
              </span>
              <p className="text-[10px] text-slate-400">
                দুর্ঘটনায় পড়া মাত্রই ৫ মিনিটের সকল ক্যামেরার ফুটেজ অটো-লক ও ৩টি SOS নম্বরে পাঠানো হয়
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-rose-300 bg-rose-950 px-2 py-0.5 rounded-full border border-rose-800">
            লকড এভিডেন্স
          </span>
        </div>

        <div className="space-y-2">
          {crashRecordings.map(crash => (
            <div key={crash.id} className="bg-slate-950 border border-rose-500/30 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white">{crash.title}</span>
                  <span className="text-[8.5px] font-bold bg-rose-600 text-white px-1.5 py-0.2 rounded font-mono">
                    {crash.impactG} IMPACT
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center space-x-3">
                  <span>🕒 {crash.date}</span>
                  <span>📍 {crash.location}</span>
                  <span>📁 {crash.fileSize}</span>
                </div>
                <div className="text-[9.5px] text-emerald-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SOS 1, SOS 2, SOS 3 নম্বরে রিয়েল-টাইম ক্র্যাশ অ্যালার্ট পাঠানো হয়েছে</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={() => handleUnlockBlackbox(crash)}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center space-x-1.5 transition active:scale-95 shadow-md shadow-rose-600/30"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>আইনি ফুটেজ আনলক</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. 🚦 Traffic Rule Violations AI Auto-Snippets */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              {language === 'bn' ? '🚦 ট্রাফিক সাইন ভায়োলেশন এআই অটো-ক্লিপস' : 'AI Traffic Sign Violation Clips'}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            ৫-১০ সেকেন্ডের অটো এভিডেন্স
          </span>
        </div>

        <div className="space-y-2">
          {violationClips.map(clip => (
            <div key={clip.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex items-center justify-between gap-2">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white truncate">{clip.title}</span>
                  {clip.isDeletedFile && (
                    <span className="text-[8px] font-bold bg-amber-950 text-amber-300 border border-amber-700 px-1 rounded shrink-0">
                      📄 অডিট হিস্ট্রি সংরক্ষিত (ফাইল মুছে দেওয়া হয়েছে)
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  {clip.timestamp} • {clip.location} • স্পিড: {clip.speed}
                </div>
              </div>

              {!clip.isDeletedFile ? (
                <button
                  onClick={() => alert(`ট্রাফিক ভায়োলেশন ক্লিপ (${clip.duration}) ওয়াটারমার্ক সহ ডাউনলোড হচ্ছে...`)}
                  className="px-2.5 py-1 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-[10px] font-bold flex items-center space-x-1 shrink-0"
                >
                  <Download className="w-3 h-3" />
                  <span>ভিডিও</span>
                </button>
              ) : (
                <span className="text-[10px] font-mono text-slate-500 shrink-0">স্টোরেজ খালি</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4. Evidence Locker & Media Gallery */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-blue-400" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {language === 'bn' ? 'আইনি ও পুলিশি এভিডেন্স লকার' : 'Legal & Police Evidence Locker'}
              </span>
              <p className="text-[10px] text-slate-400">Timestamped photos & clips with GPS watermark</p>
            </div>
          </div>
          <span className="text-xs font-bold bg-slate-800 px-2 py-1 rounded-xl text-slate-300">
            {evidenceList.length} Files
          </span>
        </div>

        {/* Gallery List */}
        <div className="space-y-3">
          {evidenceList.map((item) => (
            <div key={item.id} className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3 flex flex-col space-y-2">
              <div className="flex items-start space-x-3">
                <img
                  src={item.thumbnailUrl || item.url}
                  alt="Evidence Thumbnail"
                  className="w-20 h-16 rounded-xl object-cover border border-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-100 truncate">{item.triggerEvent}</div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1 mt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="text-[10px] text-blue-400 flex items-center space-x-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{item.latitude.toFixed(4)}N, {item.longitude.toFixed(4)}E ({item.speed} km/h)</span>
                  </div>
                </div>
              </div>

              {item.note && (
                <div className="text-[11px] text-slate-300 italic bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                  "{item.note}"
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  onClick={() => handleDownloadEvidence(item)}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1 transition active:scale-95 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ফোনে সেভ করুন' : 'Save to Gallery'}</span>
                </button>

                <button
                  onClick={() => deleteEvidence(item.id)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/30 text-slate-400 hover:text-rose-400 transition"
                  title="Delete Video (Preserves Permanent Event Metadata)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Flexi-Builder Subscription Modal */}
      {isStorageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="w-5 h-5 text-purple-400" />
                <h3 className="text-sm font-bold text-white">সার্ভেল্যান্স স্টোরেজ ও ব্যাকআপ বিল্ডার</h3>
              </div>
              <button onClick={() => setIsStorageModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <p className="text-xs text-slate-400">
              আপনার গাড়ির ড্যাশ-ক্যাম ও ভয়েস ফুটেজ কত দিন ক্লাউডে সেভ থাকবে এবং কত মেমোরি প্রয়োজন তা নির্বাচন করুন:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { capMb: 200, retentionDays: 3, priceBdt: 0, label: 'বেসিক (ফ্রি)', desc: '২০০ MB • ৩ দিন ব্যাকআপ' },
                { capMb: 500, retentionDays: 7, priceBdt: 50, label: 'সিলভার প্যাকেজ', desc: '৫০০ MB • ৭ দিন ব্যাকআপ' },
                { capMb: 1024, retentionDays: 15, priceBdt: 100, label: 'গোল্ড প্যাকেজ', desc: '১ GB • ১৫ দিন ব্যাকআপ' },
                { capMb: 5120, retentionDays: 30, priceBdt: 200, label: 'প্লাটিনাম ফ্লিট', desc: '৫ GB • ৩০ দিন ব্যাকআপ' },
              ].map((tier) => (
                <button
                  key={tier.capMb}
                  onClick={() => setStorageTier(tier)}
                  className={`p-3 rounded-2xl border text-left transition ${
                    storageTier.capMb === tier.capMb
                      ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-md ring-1 ring-purple-500'
                      : 'bg-slate-850 border-slate-750 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-xs">{tier.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{tier.desc}</div>
                  <div className="text-xs font-black text-emerald-400 mt-1 font-mono">
                    {tier.priceBdt === 0 ? 'ফ্রি' : `৳ ${tier.priceBdt}/মাস`}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setIsStorageModalOpen(false);
                alert(`স্টোরেজ সফলভাবে ${storageTier.capMb} MB তে আপগ্রেড করা হয়েছে!`);
              }}
              className="w-full py-2.5 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition"
            >
              প্যাকেজ নিশ্চিত করুন
            </button>
          </div>
        </div>
      )}

      {/* Master PIN Verification Modal for Blackbox Video Access */}
      <PinVerificationModal
        isOpen={isPinModalOpen}
        onClose={() => {
          setIsPinModalOpen(false);
          setSelectedBlackboxItem(null);
        }}
        onSuccess={() => {
          setIsPinModalOpen(false);
          alert(`মাস্টার পিন ভেরিফাইড! ${selectedBlackboxItem?.title} এর লিগ্যাল এভিডেন্স ওয়াটারমার্ক সহ ডাউনলোড হচ্ছে...`);
        }}
        title="আইনি ব্ল্যাকবক্স এক্সিডেন্ট ফুটেজ অ্যাক্সেস"
        description="পুলিশ ও লিগ্যাল সিকিউরিটির জন্য ক্র্যাশ ফুটেজ দেখতে ও ডাউনলোড করতে আপনার মাস্টার সিকিউরিটি পিন দিন।"
      />
    </div>
  );
};
