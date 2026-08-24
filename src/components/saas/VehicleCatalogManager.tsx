import React, { useState } from 'react';
import {
  Plus,
  Sparkles,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Bot,
  Car,
  Bike,
  Truck,
  Save,
  RefreshCw,
  Tag
} from 'lucide-react';

// Persisted custom catalog entries
const STORAGE_KEY = 'gps_admin_vehicle_catalog_additions';

export interface CustomVehicleEntry {
  id: string;
  category: string;
  brand: string;
  model: string;
  versions: string[];
  addedBy: string;
  addedAt: string;
}

// AI Suggestion Bank for Bangladesh Market (pre-defined suggestions)
const AI_SUGGESTION_BANK: CustomVehicleEntry[] = [
  { id: 'ai-1', category: 'motorcycle', brand: 'Hero', model: 'Splendor Plus', versions: ['i3S Self Start', 'Kick Start', 'XTEC Edition'], addedBy: 'AI Suggest', addedAt: '' },
  { id: 'ai-2', category: 'motorcycle', brand: 'Lifan', model: 'KPS 150', versions: ['Sport Edition', 'Standard'], addedBy: 'AI Suggest', addedAt: '' },
  { id: 'ai-3', category: 'motorcycle', brand: 'Runner', model: 'Bolt 100R', versions: ['100cc Standard', '150cc ES'], addedBy: 'AI Suggest', addedAt: '' },
  { id: 'ai-4', category: 'motorcycle', brand: 'Znen', model: 'F8 150', versions: ['Sport 150cc', 'Classic Chrome'], addedBy: 'AI Suggest', addedAt: '' },
  { id: 'ai-5', category: 'car', brand: 'Suzuki', model: 'Alto', versions: ['VXL AGS Automatic', 'VXR 660cc', 'VX Manual'] }, 
  { id: 'ai-6', category: 'car', brand: 'Mitsubishi', model: 'Pajero Sport', versions: ['Exceed 4WD Diesel', 'GLS 4WD'], addedBy: 'AI Suggest', addedAt: '' },
  { id: 'ai-7', category: 'truck', brand: 'Isuzu', model: 'ELF NHR 55', versions: ['Single Cab Cargo', 'Wide Cab Flatbed'], addedBy: 'AI Suggest', addedAt: '' },
  { id: 'ai-8', category: 'ambulance', brand: 'Ford', model: 'Transit Ambulance', versions: ['ALS Type III High Roof', 'BLS Standard'], addedBy: 'AI Suggest', addedAt: '' },
  { id: 'ai-9', category: 'auto', brand: 'Atul', model: 'Elite Cargo', versions: ['CNG 3W Load Carrier', 'Electric Rickshaw'], addedBy: 'AI Suggest', addedAt: '' },
  { id: 'ai-10', category: 'motorcycle', brand: 'KTM', model: 'Duke 200', versions: ['ABS Standard', 'BS6 Black Edition'], addedBy: 'AI Suggest', addedAt: '' },
] as CustomVehicleEntry[];

const CATEGORY_CONFIG: Record<string, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  motorcycle: { label: 'মোটরসাইকেল', emoji: '🏍️', color: 'text-blue-300', bg: 'bg-blue-600/20', border: 'border-blue-500/40' },
  car: { label: 'কার / সিডান', emoji: '🚗', color: 'text-violet-300', bg: 'bg-violet-600/20', border: 'border-violet-500/40' },
  cng: { label: 'সিএনজি ৩চাকা', emoji: '🛺', color: 'text-emerald-300', bg: 'bg-emerald-600/20', border: 'border-emerald-500/40' },
  auto: { label: 'অটোরিকশা', emoji: '🛺', color: 'text-amber-300', bg: 'bg-amber-600/20', border: 'border-amber-500/40' },
  truck: { label: 'ট্রাক / পিকআপ', emoji: '🚚', color: 'text-orange-300', bg: 'bg-orange-600/20', border: 'border-orange-500/40' },
  ambulance: { label: 'অ্যাম্বুলেন্স', emoji: '🚑', color: 'text-rose-300', bg: 'bg-rose-600/20', border: 'border-rose-500/40' },
};

export const VehicleCatalogManager: React.FC = () => {
  const [entries, setEntries] = useState<CustomVehicleEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    try { return saved ? JSON.parse(saved) : []; } catch { return []; }
  });

  const [formCategory, setFormCategory] = useState('motorcycle');
  const [formBrand, setFormBrand] = useState('');
  const [formModel, setFormModel] = useState('');
  const [formVersions, setFormVersions] = useState('');
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<CustomVehicleEntry[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai' | 'list'>('manual');

  const saveEntries = (next: CustomVehicleEntry[]) => {
    setEntries(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleManualAdd = () => {
    if (!formBrand.trim() || !formModel.trim()) return;
    const entry: CustomVehicleEntry = {
      id: 'custom-' + Date.now(),
      category: formCategory,
      brand: formBrand.trim(),
      model: formModel.trim(),
      versions: formVersions.split(',').map(v => v.trim()).filter(Boolean),
      addedBy: 'Admin',
      addedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    };
    const next = [entry, ...entries];
    saveEntries(next);
    setFormBrand('');
    setFormModel('');
    setFormVersions('');
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const handleAISuggest = () => {
    setIsLoadingAI(true);
    setTimeout(() => {
      // Filter out already-added AI suggestions
      const existingIds = new Set(entries.map(e => e.id));
      const fresh = AI_SUGGESTION_BANK
        .filter(s => !existingIds.has(s.id))
        .map(s => ({ ...s, addedAt: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) }));
      setAiSuggestions(fresh);
      setIsLoadingAI(false);
    }, 900);
  };

  const handleAddAISuggestion = (suggestion: CustomVehicleEntry) => {
    const next = [{ ...suggestion, addedBy: 'AI → Admin Approved' }, ...entries];
    saveEntries(next);
    setAiSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-violet-600/30 border border-violet-500/40 flex items-center justify-center">
            <Car className="w-4 h-4 text-violet-400" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs text-slate-100">ভেহিকেল ক্যাটালগ ম্যানেজার</h3>
            <p className="text-[9.5px] text-slate-400">নতুন ব্র্যান্ড, মডেল ও ভার্সন যোগ করুন · AI সাজেশন সাপোর্ট</p>
          </div>
        </div>
        <span className="text-[9.5px] font-bold text-violet-300 bg-violet-950/60 border border-violet-800/40 px-2 py-0.5 rounded-full">
          {entries.length} টি কাস্টম এন্ট্রি
        </span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        {[
          { id: 'manual', label: '✏️ ম্যানুয়াল যোগ করুন' },
          { id: 'ai', label: '🤖 AI সাজেশন' },
          { id: 'list', label: `📋 তালিকা (${entries.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-2 text-[10.5px] font-bold transition ${
              activeTab === tab.id
                ? 'bg-slate-800 text-slate-100 border-b-2 border-violet-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-3 space-y-3">
        {/* ===== MANUAL ADD TAB ===== */}
        {activeTab === 'manual' && (
          <div className="space-y-2.5">
            {/* Category Select */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">গাড়ির ধরন (ক্যাটাগরি):</label>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(CATEGORY_CONFIG).map(([id, cfg]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFormCategory(id)}
                    className={`px-2 py-1 rounded-xl text-[10.5px] font-bold transition ${
                      formCategory === id
                        ? `${cfg.bg} ${cfg.border} ${cfg.color} border`
                        : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    {cfg.emoji} {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">ব্র্যান্ড / প্রস্তুতকারক *</label>
                <input
                  type="text"
                  value={formBrand}
                  onChange={e => setFormBrand(e.target.value)}
                  placeholder="যেমন: Hero, Lifan, KTM"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-violet-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">মডেল নাম *</label>
                <input
                  type="text"
                  value={formModel}
                  onChange={e => setFormModel(e.target.value)}
                  placeholder="যেমন: Splendor Plus, Duke 200"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-400 block mb-1">
                ভার্সন / ভ্যারিয়েন্ট সমূহ <span className="text-slate-500 font-normal">(কমা দিয়ে আলাদা করুন)</span>
              </label>
              <input
                type="text"
                value={formVersions}
                onChange={e => setFormVersions(e.target.value)}
                placeholder="যেমন: Standard, ABS Edition, SE Black"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:border-violet-500 focus:outline-none"
              />
            </div>

            <button
              onClick={handleManualAdd}
              disabled={!formBrand.trim() || !formModel.trim()}
              className={`w-full py-2.5 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center space-x-2 transition active:scale-95 ${
                savedFeedback
                  ? 'bg-emerald-600 text-white border border-emerald-400'
                  : 'bg-violet-600 hover:bg-violet-500 text-white border border-violet-400 shadow-violet-600/40 disabled:opacity-40 disabled:cursor-not-allowed'
              }`}
            >
              {savedFeedback ? (
                <><CheckCircle2 className="w-4 h-4" /><span>সফলভাবে যোগ করা হয়েছে!</span></>
              ) : (
                <><Plus className="w-4 h-4" /><span>ক্যাটালগে যোগ করুন (সেলস ফর্মে দেখাবে)</span></>
              )}
            </button>
          </div>
        )}

        {/* ===== AI SUGGEST TAB ===== */}
        {activeTab === 'ai' && (
          <div className="space-y-2.5">
            <div className="p-3 bg-violet-950/40 border border-violet-800/40 rounded-2xl text-[10.5px] text-violet-300">
              🤖 <strong>AI সাজেশন:</strong> বাংলাদেশ মার্কেটের জনপ্রিয় কিন্তু এখনও তালিকাভুক্ত নয় এমন গাড়ি ও ব্র্যান্ড সুপারিশ করবে। অ্যাডমিন রিভিউ করে অনুমোদন করতে পারবেন।
            </div>

            <button
              onClick={handleAISuggest}
              disabled={isLoadingAI}
              className="w-full py-2.5 rounded-2xl bg-violet-600/30 border border-violet-500/50 hover:bg-violet-600/50 text-violet-300 font-bold text-xs flex items-center justify-center space-x-2 transition active:scale-95"
            >
              {isLoadingAI ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /><span>AI বিশ্লেষণ করছে...</span></>
              ) : (
                <><Bot className="w-4 h-4" /><span>🤖 AI সাজেশন লোড করুন</span></>
              )}
            </button>

            {aiSuggestions.length > 0 && (
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 block">{aiSuggestions.length} টি AI সুপারিশ প্রস্তুত:</span>
                {aiSuggestions.map(s => {
                  const cfg = CATEGORY_CONFIG[s.category] || CATEGORY_CONFIG.car;
                  return (
                    <div key={s.id} className={`p-2.5 rounded-xl border ${cfg.border} ${cfg.bg} flex items-center justify-between`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded-full bg-slate-800 ${cfg.color}`}>
                            {cfg.emoji} {cfg.label}
                          </span>
                          <span className="text-xs font-extrabold text-slate-100">{s.brand} {s.model}</span>
                        </div>
                        <p className="text-[9.5px] text-slate-400 mt-0.5 truncate">
                          ভার্সন: {s.versions.join(', ')}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddAISuggestion(s)}
                        className="ml-2 shrink-0 px-2 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold flex items-center space-x-1 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>অনুমোদন</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {!isLoadingAI && aiSuggestions.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-[10.5px]">
                <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
                উপরের বাটনে ক্লিক করুন AI সাজেশন দেখতে
              </div>
            )}
          </div>
        )}

        {/* ===== ENTRIES LIST TAB ===== */}
        {activeTab === 'list' && (
          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {entries.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-[10.5px]">
                <Tag className="w-8 h-8 mx-auto mb-2 opacity-30" />
                এখনও কোনো কাস্টম ভেহিকেল যোগ করা হয়নি
              </div>
            ) : (
              entries.map(entry => {
                const cfg = CATEGORY_CONFIG[entry.category] || CATEGORY_CONFIG.car;
                return (
                  <div key={entry.id} className="flex items-center justify-between p-2.5 bg-slate-950/80 border border-slate-800 rounded-2xl hover:border-slate-700 transition">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1.5">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${cfg.bg} ${cfg.border} border ${cfg.color}`}>
                          {cfg.emoji}
                        </span>
                        <span className="text-xs font-extrabold text-slate-100 truncate">{entry.brand} {entry.model}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-0.5 truncate">
                        {entry.versions.length > 0 ? entry.versions.join(' · ') : 'কোনো ভার্সন নেই'} · {entry.addedBy} · {entry.addedAt}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="ml-2 p-1.5 rounded-lg hover:bg-rose-900/40 text-slate-500 hover:text-rose-400 transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
