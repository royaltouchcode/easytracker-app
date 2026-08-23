import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Fuel, 
  Gauge, 
  TrendingUp, 
  Plus, 
  Calendar, 
  Trash2, 
  DollarSign, 
  Navigation, 
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  X
} from 'lucide-react';
import { resolveDeviceCapabilities } from '../../utils/deviceCapabilities';

export const FuelMileageAnalyticsView: React.FC = () => {
  const { 
    selectedDevice, 
    selectedPosition, 
    fuelRefillLogs, 
    addFuelRefillLog, 
    deleteFuelRefillLog,
    language 
  } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [litersAdded, setLitersAdded] = useState<string>('');
  const [costBdt, setCostBdt] = useState<string>('');
  const [odometerKm, setOdometerKm] = useState<string>('');
  const [stationName, setStationName] = useState<string>('');

  const capabilities = resolveDeviceCapabilities(selectedDevice, selectedPosition);

  // Filter refill logs for the current selected device
  const deviceRefills = selectedDevice 
    ? fuelRefillLogs.filter(r => r.deviceId === selectedDevice.id || r.deviceName === selectedDevice.name)
    : fuelRefillLogs;

  // Calculate live statistics
  const totalLitersRefilled = deviceRefills.reduce((acc, curr) => acc + curr.litersAdded, 0);
  const totalCostBdt = deviceRefills.reduce((acc, curr) => acc + (curr.costBdt || 0), 0);

  // Approximate mileage economy (Bike ~ 42-50 km/L, Car ~ 12-16 km/L, Heavy ~ 4-8 km/L)
  const defaultBaseMileage = capabilities.isBike ? 45.0 : (selectedDevice?.category === 'truck' ? 5.5 : 13.8);
  const currentFuelLiters = capabilities.fuelLiters || 14.5;
  const estimatedRemainingRangeKm = Math.round(currentFuelLiters * defaultBaseMileage);

  const handleSaveRefill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!litersAdded || !selectedDevice) return;

    const added = parseFloat(litersAdded) || 0;
    const cost = parseFloat(costBdt) || 0;
    const odo = parseFloat(odometerKm) || (selectedPosition?.attributes?.totalDistance ? Math.round(selectedPosition.attributes.totalDistance / 1000) : 1450);

    addFuelRefillLog({
      deviceId: selectedDevice.id,
      deviceName: selectedDevice.name,
      litersAdded: added,
      totalLitersAfter: currentFuelLiters + added,
      odometerKm: odo,
      costBdt: cost,
      stationName: stationName.trim() || (language === 'bn' ? 'ফুয়েল স্টেশন' : 'Fuel Station')
    });

    setIsAddModalOpen(false);
    setLitersAdded('');
    setCostBdt('');
    setOdometerKm('');
    setStationName('');
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-200">
      {/* Top Header Banner */}
      <div className="flex items-center justify-between bg-gradient-to-r from-amber-500/20 via-slate-900 to-slate-900 border border-amber-500/30 p-3 rounded-2xl">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <Fuel className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-100">
              {language === 'bn' ? 'জ্বালানি কনজাম্পশন ও মাইলেজ রিপোর্ট' : 'Fuel Economy & Mileage Intelligence'}
            </h3>
            <p className="text-[10px] text-slate-400">
              {selectedDevice?.name || 'My Vehicle'} • {capabilities.isBike ? 'Bike Mode' : 'Vehicle Mode'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-2.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1 shadow-md shadow-amber-600/30 active:scale-95 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{language === 'bn' ? 'রিফুয়েল এন্ট্রি' : 'Add Refill'}</span>
        </button>
      </div>

      {/* 4 Key Performance Indicator Metric Cards */}
      <div className="grid grid-cols-2 gap-2">
        {/* 1. Average Mileage */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
            <span>{language === 'bn' ? 'গড় মাইলেজ' : 'Avg Mileage'}</span>
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="my-1 flex items-baseline space-x-1">
            <span className="text-lg font-black text-emerald-400 font-mono">{defaultBaseMileage.toFixed(1)}</span>
            <span className="text-[10px] font-bold text-slate-300">km/L</span>
          </div>
          <span className="text-[9px] text-emerald-400/80 font-semibold">
            {language === 'bn' ? '✓ জ্বালানি দক্ষতা ভালো' : '✓ Good Fuel Efficiency'}
          </span>
        </div>

        {/* 2. Estimated Distance to Empty */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
            <span>{language === 'bn' ? 'অবশিষ্ট রেঞ্জ' : 'Remaining Range'}</span>
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="my-1 flex items-baseline space-x-1">
            <span className="text-lg font-black text-cyan-300 font-mono">~{estimatedRemainingRangeKm}</span>
            <span className="text-[10px] font-bold text-slate-300">km</span>
          </div>
          <span className="text-[9px] text-cyan-400/80 font-semibold">
            {language === 'bn' ? `বর্তমান তেল: ${currentFuelLiters} L` : `Current Fuel: ${currentFuelLiters} L`}
          </span>
        </div>

        {/* 3. Total Liters Refilled */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
            <span>{language === 'bn' ? 'মোট রিফিল' : 'Total Refilled'}</span>
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="my-1 flex items-baseline space-x-1">
            <span className="text-lg font-black text-amber-300 font-mono">{totalLitersRefilled.toFixed(1)}</span>
            <span className="text-[10px] font-bold text-slate-300">Liters</span>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold">
            {deviceRefills.length} {language === 'bn' ? 'বার রিফিল হয়েছে' : 'refill sessions'}
          </span>
        </div>

        {/* 4. Total Fuel Expense */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-[10px] font-bold">
            <span>{language === 'bn' ? 'মোট জ্বালানি খরচ' : 'Total Fuel Cost'}</span>
            <DollarSign className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="my-1 flex items-baseline space-x-1">
            <span className="text-lg font-black text-purple-300 font-mono">৳{totalCostBdt.toLocaleString()}</span>
          </div>
          <span className="text-[9px] text-slate-400 font-semibold">
            {language === 'bn' ? 'লগ অনুযায়ী মোট খরচ' : 'Recorded fuel expenses'}
          </span>
        </div>
      </div>

      {/* Refill History Audit Log Stream */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-slate-400 text-[11px] font-bold uppercase tracking-wider">
          <span>{language === 'bn' ? 'রিফিল হিস্ট্রি লগ' : 'Refill History Log'}</span>
          <span>{deviceRefills.length} {language === 'bn' ? 'টি রেকর্ড' : 'entries'}</span>
        </div>

        {deviceRefills.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            <Fuel className="w-8 h-8 mx-auto mb-2 text-slate-600" />
            <span>{language === 'bn' ? 'কোনো রিফিল এন্ট্রি রেকর্ড করা হয়নি' : 'No refill records yet'}</span>
          </div>
        ) : (
          <div className="space-y-2">
            {deviceRefills.map((refill) => {
              const dateObj = new Date(refill.timestamp);
              return (
                <div key={refill.id} className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-3 flex items-start space-x-3 shadow-md">
                  <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30 shrink-0 mt-0.5">
                    <Fuel className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-xs text-slate-100">
                        +{refill.litersAdded} L ({refill.stationName || 'Station'})
                      </span>
                      {refill.costBdt ? (
                        <span className="text-xs font-mono font-bold text-emerald-400">
                          ৳{refill.costBdt}
                        </span>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                      <div className="flex items-center space-x-1 font-mono text-slate-300">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span>{dateObj.toLocaleDateString([], { day: '2-digit', month: 'short' })} • {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] text-slate-400">
                          ওডো: {refill.odometerKm} km
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteFuelRefillLog(refill.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Refill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-4 space-y-3 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                  <Fuel className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-100">
                  {language === 'bn' ? 'নতুন ফুয়েল রিফিল যোগ করুন' : 'Add New Fuel Refill'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveRefill} className="space-y-3">
              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">
                  {language === 'bn' ? 'কত লিটার তেল ভরেছেন? (Liters)*' : 'Liters Added*'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={litersAdded}
                  onChange={(e) => setLitersAdded(e.target.value)}
                  placeholder="e.g. 10.5"
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 shadow-inner"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">
                    {language === 'bn' ? 'মোট খরচ (৳)' : 'Cost in BDT (৳)'}
                  </label>
                  <input
                    type="number"
                    value={costBdt}
                    onChange={(e) => setCostBdt(e.target.value)}
                    placeholder="e.g. 1350"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-300 font-bold block mb-1">
                    {language === 'bn' ? 'ওডোমিটার (কিমি)' : 'Odometer (km)'}
                  </label>
                  <input
                    type="number"
                    value={odometerKm}
                    onChange={(e) => setOdometerKm(e.target.value)}
                    placeholder="e.g. 1450"
                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500 shadow-inner"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 font-bold block mb-1">
                  {language === 'bn' ? 'পাম্প / স্টেশনের নাম' : 'Fuel Station Name'}
                </label>
                <input
                  type="text"
                  value={stationName}
                  onChange={(e) => setStationName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: মেঘনা পেট্রোলিয়াম' : 'e.g. Meghna Petrol Pump'}
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 shadow-inner"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold text-xs"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center justify-center space-x-1 shadow-md shadow-amber-600/30"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Refill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
