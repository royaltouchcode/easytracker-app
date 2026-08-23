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
  Check
} from 'lucide-react';
import { MediaEvidence } from '../../types/traccar';

export const SurveillanceView: React.FC = () => {
  const { 
    selectedDevice, 
    selectedPosition, 
    evidenceList, 
    addEvidence, 
    deleteEvidence, 
    language, 
    t 
  } = useApp();

  const [activeCam, setActiveCam] = useState<'front' | 'cabin'>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [isListeningAudio, setIsListeningAudio] = useState(false);
  const [snapshotTakenNotice, setSnapshotTakenNotice] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  const speedKmh = selectedPosition ? Math.round(selectedPosition.speed) : 0;
  const address = selectedPosition?.address || 'Gulshan-2, Dhaka';
  const plate = selectedDevice?.attributes?.plateNumber || 'DM-GA-11-2233';

  // Handle Live Snapshot Capture with GPS & Timestamp Watermark
  const handleTakeSnapshot = () => {
    // Generate watermarked canvas snapshot
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 450;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw background placeholder or video frame
    const gradient = ctx.createLinearGradient(0, 0, 800, 450);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(1, '#1e293b');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 450);

    // Draw simulated road / cabin view graphics
    ctx.fillStyle = activeCam === 'front' ? '#22c55e' : '#3b82f6';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText(activeCam === 'front' ? 'CAM 1: ROAD FORWARD VIEW' : 'CAM 2: DRIVER CABIN VIEW', 30, 50);

    // Draw Watermark Overlay at bottom
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 360, 800, 90);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 15px monospace';
    ctx.fillText(`VEHICLE: ${selectedDevice?.name || 'Car'} | PLATE: ${plate}`, 20, 385);
    ctx.fillText(`SPEED: ${speedKmh} km/h | GPS: 23.7937N, 90.4066E | ${address}`, 20, 410);
    ctx.fillText(`TIME: ${new Date().toLocaleString()} | POLICE & INSURANCE EVIDENCE`, 20, 435);

    const dataUrl = canvas.toDataURL('image/jpeg');

    addEvidence({
      deviceId: selectedDevice?.id || 101,
      deviceName: selectedDevice?.name || 'Car',
      type: 'photo',
      url: dataUrl,
      thumbnailUrl: dataUrl,
      latitude: selectedPosition?.latitude || 23.7937,
      longitude: selectedPosition?.longitude || 90.4066,
      speed: speedKmh,
      triggerEvent: `Manual Live Capture (${activeCam === 'front' ? 'Front Cam' : 'Cabin Cam'})`,
      note: 'Snapshot captured by user for evidence'
    });

    setSnapshotTakenNotice(true);
    setTimeout(() => setSnapshotTakenNotice(false), 2500);
  };

  // Download Evidence locally
  const handleDownloadEvidence = (item: MediaEvidence) => {
    const a = document.createElement('a');
    a.href = item.url;
    a.download = `Evidence_${item.deviceName.replace(/\s+/g, '_')}_${new Date(item.timestamp).toISOString().slice(0, 19)}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 overflow-y-auto p-4 space-y-4 pb-20 select-none">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center">
          <Video className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-bold">
            {language === 'bn' ? 'লাইভ ভিডিও ও ভয়েস মনিটরিং' : 'Live Video & Voice Surveillance'}
          </h2>
          <p className="text-xs text-slate-400">
            {selectedDevice?.name || 'Selected Vehicle'}
          </p>
        </div>
      </div>

      {/* 1. Live Dashcam Video Stream Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Video Player Header / Cam Toggle */}
        <div className="bg-slate-850 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-bold text-slate-200">
              {activeCam === 'front' ? 'Front Road Camera (CAM 1)' : 'Driver Cabin Camera (CAM 2)'}
            </span>
          </div>

          {/* Camera Switcher */}
          <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setActiveCam('front')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                activeCam === 'front' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Road Front
            </button>
            <button
              onClick={() => setActiveCam('cabin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                activeCam === 'cabin' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inside Cabin
            </button>
          </div>
        </div>

        {/* Video Viewport */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
          <img
            src={activeCam === 'front' 
              ? 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=1200&q=80' 
              : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80'}
            alt="Live Dashcam Stream"
            className="w-full h-full object-cover"
          />

          {/* Live Watermark Overlay on video */}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-mono text-white flex items-center space-x-2 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>LIVE 1080P HD | 25 FPS</span>
          </div>

          <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-md p-2 rounded-xl text-[10px] font-mono text-slate-200 border border-white/10 flex justify-between items-center">
            <div>
              <div className="font-bold text-white">{plate} | Speed: {speedKmh} km/h</div>
              <div className="text-slate-400 text-[9px] truncate max-w-[240px]">{address}</div>
            </div>
            <div className="text-right text-slate-300">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Surveillance Quick Action Bar */}
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
            <span>{isRecording ? 'Recording...' : (language === 'bn' ? 'ভিডিও রেকর্ড' : 'Record Clip')}</span>
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
            <span>{isListeningAudio ? 'Listening...' : (language === 'bn' ? 'ভয়েস শুনুন' : 'Listen Voice')}</span>
          </button>
        </div>
      </div>

      {snapshotTakenNotice && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 animate-in fade-in duration-200">
          <Check className="w-4 h-4 shrink-0" />
          <span>{language === 'bn' ? 'ছবিটি সফলভাবে এভিডেন্স লকারে সংরক্ষণ করা হয়েছে!' : 'Snapshot saved to Evidence Locker with GPS Watermark!'}</span>
        </div>
      )}

      {/* Voice Monitor Active Banner */}
      {isListeningAudio && (
        <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-4 shadow-xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-100">
                {language === 'bn' ? 'ভয়েস মনিটরিং সংযোগ সক্রিয়' : 'Live In-Cabin Audio Stream Active'}
              </div>
              <div className="text-[10px] text-slate-400">Silent microphone monitoring without ringing</div>
            </div>
          </div>
          <div className="flex space-x-1">
            <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" />
            <span className="w-1 h-6 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.1s]" />
            <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
          </div>
        </div>
      )}

      {/* 2. Evidence Locker & Media Gallery */}
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
                  title="Delete Evidence"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
