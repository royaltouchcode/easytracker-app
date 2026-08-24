import React, { useState } from 'react';
import { 
  X, 
  Car, 
  CheckCircle2, 
  Sparkles, 
  Wrench, 
  Fuel, 
  Gauge, 
  Edit3, 
  Sliders, 
  Save, 
  Bot,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  FileText,
  HelpCircle
} from 'lucide-react';
import { VehicleType } from '../../types/traccar';
import { 
  VEHICLE_CATALOG, 
  VehicleCatalogItem, 
  getCatalogByCategory,
  getManufacturersByCategory, 
  getModelsByManufacturer,
  generateAiVehicleSpec,
  generateAiVehicleManual,
  saveCustomVehicleSpec,
  AiVehicleManual
} from '../../utils/vehicleCatalogDatabase';
import { VehicleIcon } from '../../utils/vehicleIcons';

interface VehicleSpecSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: VehicleType;
  initialSpec?: any;
  onSaveSpec: (spec: any) => void;
  language?: 'en' | 'bn';
}

export const VehicleSpecSelectorModal: React.FC<VehicleSpecSelectorModalProps> = ({
  isOpen,
  onClose,
  initialCategory = 'motorcycle',
  initialSpec,
  onSaveSpec,
  language = 'bn'
}) => {
  const [selectedCategory, setSelectedCategory] = useState<VehicleType>(initialCategory);
  const [selectedManufacturer, setSelectedManufacturer] = useState<string>(() => {
    return initialSpec?.manufacturer || 'Bajaj';
  });
  const [selectedModelId, setSelectedModelId] = useState<string>(() => {
    return initialSpec?.catalogId || 'bajaj_avenger_160';
  });

  // Manual Override / Custom Mode
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [customBrand, setCustomBrand] = useState(initialSpec?.manufacturer || '');
  const [customModel, setCustomModel] = useState(initialSpec?.modelName || '');
  const [customOilGrade, setCustomOilGrade] = useState(initialSpec?.engineOilGrade || '20W-50 DTS-i 4T');
  const [customOilCapacity, setCustomOilCapacity] = useState(initialSpec?.engineOilCapacityLiters?.toString() || '1.15');
  const [customServiceInterval, setCustomServiceInterval] = useState(initialSpec?.oilChangeIntervalKm?.toString() || '2500');
  const [customTankCapacity, setCustomTankCapacity] = useState(initialSpec?.fuelTankCapacityLiters?.toString() || '13');
  const [customTireFront, setCustomTireFront] = useState(initialSpec?.tirePressureFrontPsi?.toString() || '21');
  const [customTireRear, setCustomTireRear] = useState(initialSpec?.tirePressureRearPsi?.toString() || '28');

  // AI Manual View Modal State
  const [showManualModal, setShowManualModal] = useState(false);
  const [aiNotice, setAiNotice] = useState('');

  const handleAiInfer = () => {
    if (!customBrand && !customModel) {
      setAiNotice('⚠️ অনুগ্রহ করে ম্যানুফ্যাকচারার ও মডেলের নাম লিখুন (যেমন: Yamaha FZ-X বা Toyota Harrier)');
      return;
    }

    const aiSpec = generateAiVehicleSpec(customBrand || 'Vehicle', customModel || 'Standard', selectedCategory);
    setCustomOilGrade(aiSpec.engineOilGrade);
    setCustomOilCapacity(aiSpec.engineOilCapacityLiters.toString());
    setCustomServiceInterval(aiSpec.oilChangeIntervalKm.toString());
    setCustomTankCapacity(aiSpec.fuelTankCapacityLiters.toString());
    setCustomTireFront(aiSpec.tirePressureFrontPsi.toString());
    setCustomTireRear(aiSpec.tirePressureRearPsi.toString());
    
    // Save to persistent database
    saveCustomVehicleSpec(aiSpec);

    setAiNotice(`✨ AI সফলভাবে ${aiSpec.manufacturer} ${aiSpec.model}-এর ইঞ্জিন স্পেসিফিকেশন জেনারেট করেছে!`);
    setTimeout(() => setAiNotice(''), 4000);
  };

  if (!isOpen) return null;

  const manufacturers = getManufacturersByCategory(selectedCategory);
  const models = getModelsByManufacturer(selectedCategory, selectedManufacturer);
  const activeCatalogItem = VEHICLE_CATALOG.find(m => m.id === selectedModelId) || models[0];

  const handleSelectCatalogItem = (item: VehicleCatalogItem) => {
    setSelectedModelId(item.id);
    setIsCustomMode(false);
    setCustomBrand(item.manufacturer);
    setCustomModel(item.model);
    setCustomOilGrade(item.engineOilGrade);
    setCustomOilCapacity(item.engineOilCapacityLiters.toString());
    setCustomServiceInterval(item.oilChangeIntervalKm.toString());
    setCustomTankCapacity(item.fuelTankCapacityLiters.toString());
    setCustomTireFront(item.tirePressureFrontPsi.toString());
    setCustomTireRear(item.tirePressureRearPsi.toString());
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSpec = {
      catalogId: isCustomMode ? 'custom' : activeCatalogItem?.id || 'custom',
      category: selectedCategory,
      manufacturer: isCustomMode ? customBrand : activeCatalogItem?.manufacturer || customBrand,
      modelName: isCustomMode ? customModel : activeCatalogItem?.model || customModel,
      engineOilGrade: isCustomMode ? customOilGrade : activeCatalogItem?.engineOilGrade || customOilGrade,
      engineOilCapacityLiters: parseFloat(isCustomMode ? customOilCapacity : activeCatalogItem?.engineOilCapacityLiters.toString() || '1.15'),
      oilChangeIntervalKm: parseInt(isCustomMode ? customServiceInterval : activeCatalogItem?.oilChangeIntervalKm.toString() || '2500', 10),
      fuelTankCapacityLiters: parseFloat(isCustomMode ? customTankCapacity : activeCatalogItem?.fuelTankCapacityLiters.toString() || '13'),
      tirePressureFrontPsi: parseInt(isCustomMode ? customTireFront : activeCatalogItem?.tirePressureFrontPsi.toString() || '21', 10),
      tirePressureRearPsi: parseInt(isCustomMode ? customTireRear : activeCatalogItem?.tirePressureRearPsi.toString() || '28', 10)
    };

    onSaveSpec(finalSpec);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 animate-in fade-in duration-150 select-none overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/90 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0 bg-slate-850">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-1.5">
                <span>{language === 'bn' ? 'ভেহিকেল AI ও ওনার্স স্পেক্স সিলেক্টর' : 'Vehicle AI & Specs Selector'}</span>
                <span className="text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1.5 py-0.2 rounded-full border border-purple-500/30">Auto OEM</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {language === 'bn' ? 'মডেল সিলেক্ট করলেই আসল মবিল গ্রেড ও স্পেক্স লোড হবে' : 'Select OEM model for 100% genuine factory specs'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-4 space-y-3.5 overflow-y-auto flex-1 text-xs">
          
          {/* Step 1: Vehicle Category Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1.5">
              {language === 'bn' ? '১. যানবাহনের ধরণ (Category):' : '1. Vehicle Type:'}
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['motorcycle', 'scooter', 'car', 'cng', 'pickup', 'ambulance', 'truck', 'bus'] as VehicleType[]).map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    const newMfrs = getManufacturersByCategory(cat);
                    if (newMfrs.length > 0) {
                      setSelectedManufacturer(newMfrs[0]);
                      const newModels = getModelsByManufacturer(cat, newMfrs[0]);
                      if (newModels.length > 0) handleSelectCatalogItem(newModels[0]);
                    }
                  }}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center space-y-1 transition active:scale-95 ${
                    selectedCategory === cat
                      ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                      : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <VehicleIcon type={cat} className="w-4 h-4" />
                  <span className="text-[9.5px] font-bold capitalize truncate max-w-full">
                    {cat === 'motorcycle' ? 'বাইক' : cat === 'scooter' ? 'স্কুটি' : cat === 'car' ? 'কার' : cat === 'cng' ? 'সিএনজি' : cat === 'pickup' ? 'পিকআপ' : cat === 'ambulance' ? 'অ্যাম্বুলেন্স' : cat === 'truck' ? 'ট্রাক' : 'বাস'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggle: Catalog vs Manual Input */}
          <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-800/80 border border-slate-700">
            <span className="text-[11px] font-bold text-slate-300">
              {isCustomMode 
                ? (language === 'bn' ? '✏️ ম্যানুয়াল / কাস্টম ইনপুট মোড' : '✏️ Manual Custom Input Mode') 
                : (language === 'bn' ? '🤖 অটো AI ক্যাটালগ সিলেকশন' : '🤖 Auto AI Catalog Selection')}
            </span>
            <button
              type="button"
              onClick={() => setIsCustomMode(!isCustomMode)}
              className="px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-[10.5px] transition active:scale-95"
            >
              {isCustomMode ? (language === 'bn' ? 'ক্যাটালগে ফিরে যান' : 'Use Catalog') : (language === 'bn' ? 'লিস্টে নেই? ম্যানুয়াল লিখুন' : 'Not in list? Manual')}
            </button>
          </div>

          {!isCustomMode ? (
            /* Catalog Dropdowns */
            <div className="space-y-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              {/* Manufacturer / Brand */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? '২. ম্যানুফ্যাকচারার / ব্র্যান্ড:' : '2. Manufacturer / Brand:'}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {manufacturers.map((mfr) => (
                    <button
                      type="button"
                      key={mfr}
                      onClick={() => {
                        setSelectedManufacturer(mfr);
                        const newModels = getModelsByManufacturer(selectedCategory, mfr);
                        if (newModels.length > 0) handleSelectCatalogItem(newModels[0]);
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition active:scale-95 ${
                        selectedManufacturer === mfr
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700'
                      }`}
                    >
                      {mfr}
                    </button>
                  ))}
                </div>
              </div>

              {/* Models List */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  {language === 'bn' ? '৩. মডেল ও ইঞ্জিন ভার্সন সিলেক্ট করুন:' : '3. Select Vehicle Model & CC:'}
                </label>
                <div className="space-y-1.5 max-h-44 overflow-y-auto">
                  {models.map((mod) => (
                    <button
                      type="button"
                      key={mod.id}
                      onClick={() => handleSelectCatalogItem(mod)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                        selectedModelId === mod.id
                          ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="font-extrabold text-xs text-slate-100 flex items-center space-x-1.5">
                          <span>{mod.model}</span>
                          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/40">
                            {mod.versionCc}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          মবিল: <strong className="text-amber-300">{mod.engineOilGrade}</strong> ({mod.engineOilCapacityLiters}L) • ট্যাংক: {mod.fuelTankCapacityLiters}L
                        </div>
                      </div>
                      {selectedModelId === mod.id && (
                        <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Manual Custom Input Form */
            <div className="space-y-2.5 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              {/* AI Auto-Infer Trigger */}
              <div className="flex items-center justify-between bg-purple-950/40 border border-purple-500/40 p-2 rounded-xl">
                <div className="flex items-center space-x-1.5 text-purple-300 text-[10.5px] font-bold">
                  <Bot className="w-3.5 h-3.5 text-purple-400" />
                  <span>যেকোনো মডেল লিখে AI দিয়ে স্পেক্স অটো-ফিল:</span>
                </div>
                <button
                  type="button"
                  onClick={handleAiInfer}
                  className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-[10.5px] shadow flex items-center space-x-1 transition active:scale-95"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>🧠 AI অটো-ফিল</span>
                </button>
              </div>

              {aiNotice && (
                <div className="p-2 rounded-xl bg-purple-900/40 border border-purple-500/50 text-purple-200 text-[10.5px] font-bold animate-in fade-in">
                  {aiNotice}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">ব্র্যান্ড / কোম্পানি:</label>
                  <input
                    type="text"
                    required
                    value={customBrand}
                    onChange={(e) => setCustomBrand(e.target.value)}
                    placeholder="e.g. Bajaj / Yamaha / Keeway"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">মডেল নাম:</label>
                  <input
                    type="text"
                    required
                    value={customModel}
                    onChange={(e) => setCustomModel(e.target.value)}
                    placeholder="e.g. FZ-X / Harrier / KPR 165"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:border-purple-500 focus:outline-none font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">মবিল গ্রেড (Oil Grade):</label>
                  <input
                    type="text"
                    required
                    value={customOilGrade}
                    onChange={(e) => setCustomOilGrade(e.target.value)}
                    placeholder="e.g. 20W-50 / 10W-40"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-mono font-bold focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">মবিল ক্যাপাসিটি (L):</label>
                  <input
                    type="number"
                    step="0.05"
                    required
                    value={customOilCapacity}
                    onChange={(e) => setCustomOilCapacity(e.target.value)}
                    placeholder="1.15"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">সার্ভিস কিমি:</label>
                  <input
                    type="number"
                    value={customServiceInterval}
                    onChange={(e) => setCustomServiceInterval(e.target.value)}
                    placeholder="2500"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">ফুয়েল ট্যাংক (L):</label>
                  <input
                    type="number"
                    value={customTankCapacity}
                    onChange={(e) => setCustomTankCapacity(e.target.value)}
                    placeholder="13"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white font-mono focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-0.5">টায়ার PSI (F/R):</label>
                  <div className="flex space-x-1">
                    <input
                      type="number"
                      value={customTireFront}
                      onChange={(e) => setCustomTireFront(e.target.value)}
                      placeholder="21"
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-1.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none"
                    />
                    <input
                      type="number"
                      value={customTireRear}
                      onChange={(e) => setCustomTireRear(e.target.value)}
                      placeholder="28"
                      className="w-1/2 bg-slate-900 border border-slate-700 rounded-xl px-1.5 py-1.5 text-xs text-white font-mono text-center focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Active Spec Live Summary Card */}
          <div className="p-3 bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>{language === 'bn' ? 'অফিসিয়াল ফ্যাক্টরি স্পেসিফিকেশন:' : 'Selected Factory Specs:'}</span>
              </span>
              <span className="font-mono text-[11px] text-emerald-400 font-bold">
                {isCustomMode ? customBrand + ' ' + customModel : activeCatalogItem?.manufacturer + ' ' + activeCatalogItem?.model}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1 border-t border-purple-500/20">
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <div className="text-[9.5px] text-slate-400">ইঞ্জিন অয়েল</div>
                <div className="font-mono font-bold text-amber-300 text-[11px] mt-0.5">
                  {isCustomMode ? customOilGrade : activeCatalogItem?.engineOilGrade}
                </div>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <div className="text-[9.5px] text-slate-400">মবিল পরিমাণ</div>
                <div className="font-mono font-bold text-blue-300 text-[11px] mt-0.5">
                  {isCustomMode ? customOilCapacity : activeCatalogItem?.engineOilCapacityLiters} L
                </div>
              </div>

              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <div className="text-[9.5px] text-slate-400">সার্ভিস কিমি</div>
                <div className="font-mono font-bold text-purple-300 text-[11px] mt-0.5">
                  {isCustomMode ? customServiceInterval : activeCatalogItem?.oilChangeIntervalKm} km
                </div>
              </div>
            </div>
          </div>

          {/* 1-Tap AI User Manual Button */}
          <button
            type="button"
            onClick={() => setShowManualModal(true)}
            className="w-full py-2.5 rounded-2xl bg-indigo-950/70 hover:bg-indigo-900/80 border border-indigo-500/40 text-indigo-300 hover:text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 transition active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>📄 AI ওনার্স সার্ভিস ম্যানুয়াল ও মেইনটেন্যান্স গাইড দেখুন</span>
          </button>

          {/* Action Buttons */}
          <div className="flex space-x-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-2xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'bn' ? 'স্পেক্স কনফার্ম ও সেভ করুন' : 'Confirm & Save Specs'}</span>
            </button>
          </div>
        </form>

        {/* AI User Manual Modal Drawer */}
        {showManualModal && (() => {
          const currentSpec = {
            category: selectedCategory,
            manufacturer: isCustomMode ? customBrand : activeCatalogItem?.manufacturer || customBrand,
            modelName: isCustomMode ? customModel : activeCatalogItem?.model || customModel,
            engineOilGrade: isCustomMode ? customOilGrade : activeCatalogItem?.engineOilGrade || customOilGrade,
            engineOilCapacityLiters: parseFloat(isCustomMode ? customOilCapacity : activeCatalogItem?.engineOilCapacityLiters.toString() || '1.15'),
            oilChangeIntervalKm: parseInt(isCustomMode ? customServiceInterval : activeCatalogItem?.oilChangeIntervalKm.toString() || '2500', 10),
            fuelTankCapacityLiters: parseFloat(isCustomMode ? customTankCapacity : activeCatalogItem?.fuelTankCapacityLiters.toString() || '13'),
            tirePressureFrontPsi: parseInt(isCustomMode ? customTireFront : activeCatalogItem?.tirePressureFrontPsi.toString() || '21', 10),
            tirePressureRearPsi: parseInt(isCustomMode ? customTireRear : activeCatalogItem?.tirePressureRearPsi.toString() || '28', 10)
          };
          const manual = generateAiVehicleManual(currentSpec);

          return (
            <div className="absolute inset-0 z-50 bg-slate-950/95 backdrop-blur-xl p-4 flex flex-col animate-in fade-in zoom-in-95 duration-150 overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3 shrink-0">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-white">{manual.vehicleName} AI ওনার্স ম্যানুয়াল</h4>
                    <p className="text-[10px] text-slate-400 font-mono">{manual.engineSpec}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3.5 flex-1 text-xs text-slate-300">
                {/* Fact Sheet */}
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800 font-mono text-[11px]">
                  <div>🛢️ মবিল গ্রেড: <strong className="text-amber-300">{manual.recommendedOil}</strong></div>
                  <div>📏 ক্যাপাসিটি: <strong className="text-blue-300">{manual.oilCapacityLiters} L</strong></div>
                  <div>⏱️ সার্ভিসিং: <strong className="text-purple-300">প্রতি {manual.serviceIntervalKm} কি.মি.</strong></div>
                  <div>⛽ ফুয়েল ট্যাংক: <strong className="text-emerald-300">{manual.fuelTankLiters} L</strong></div>
                  <div>🛞 সামনের টায়ার: <strong className="text-cyan-300">{manual.tirePressureFront} PSI</strong></div>
                  <div>🛞 পেছনের টায়ার: <strong className="text-cyan-300">{manual.tirePressureRear} PSI</strong></div>
                </div>

                {/* Service Checklist */}
                <div>
                  <h5 className="font-extrabold text-white text-xs mb-2 flex items-center space-x-1.5">
                    <Wrench className="w-3.5 h-3.5 text-indigo-400" />
                    <span>নিয়মিত মেইনটেন্যান্স ও সার্ভিস শিডিউল:</span>
                  </h5>
                  <div className="space-y-2">
                    {manual.checklist.map((c, i) => (
                      <div key={i} className="p-2.5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-0.5">
                        <div className="flex items-center justify-between font-bold text-slate-200">
                          <span>{i + 1}. {c.title}</span>
                          <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.2 rounded border border-purple-800/40">{c.interval}</span>
                        </div>
                        <p className="text-[10.5px] text-slate-400">{c.descriptionBn}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Driving Tips */}
                <div className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl space-y-1.5">
                  <h5 className="font-extrabold text-emerald-300 text-xs">💡 মাইলেজ ও ইঞ্জিন লাইফ বাড়ানোর টিপস:</h5>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                    {manual.drivingTipsBn.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>

                {/* Emergency Tips */}
                <div className="p-3 bg-rose-950/20 border border-rose-500/30 rounded-2xl space-y-1.5">
                  <h5 className="font-extrabold text-rose-300 text-xs">🚨 জরুরি নিরাপত্তা ও এন্টি-থেফট গাইড:</h5>
                  <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                    {manual.emergencyGuideBn.map((tip, idx) => (
                      <li key={idx}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
                >
                  ম্যানুয়াল বন্ধ করুন
                </button>
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};
