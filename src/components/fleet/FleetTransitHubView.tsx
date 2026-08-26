import React, { useState } from 'react';
import { 
  Building2, 
  Bus, 
  Truck, 
  FileText, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Webhook, 
  ArrowLeft,
  UserCheck,
  Zap,
  Radio,
  Clock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransitCounterManager } from '../saas/TransitCounterManager';
import { ComplianceDocumentVault } from '../saas/ComplianceDocumentVault';
import { DriverPerformanceManager } from '../saas/DriverPerformanceManager';

export const FleetTransitHubView: React.FC = () => {
  const { selectedDevice, setActiveTab, language } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'transit_counters' | 'compliance_vault' | 'driver_performance'>('transit_counters');

  const category = (selectedDevice?.category || '').toLowerCase();
  const isTruckOrCargo = category.includes('truck') || category.includes('trailer') || category.includes('pickup') || category.includes('van');

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-5 space-y-4 select-none animate-in fade-in">
      
      {/* Top Banner with Navigation and Persona Badge */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setActiveTab('map')}
              className="p-2 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title="ম্যাপে ফিরে যান"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 flex items-center justify-center shadow-lg shrink-0">
              {isTruckOrCargo ? <Truck className="w-6 h-6" /> : <Building2 className="w-6 h-6" />}
            </div>

            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="font-black text-base text-white">
                  🏢 ফ্লিট ও ট্রান্সপোর্টেশন অ্যাডমিন হাব (Fleet Admin)
                </h2>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  ENTERPRISE FLEET
                </span>
                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  👔 OWNER ONLY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                কাউন্টার জিওফেন্স, ট্রিপ ডিসপ্যাচ, সুপারভাইজার সাব-লগইন আইডি, BRTA লিগ্যাল ভল্ট ও টিকেটিং API হাব
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-auto text-xs">
            <span className="text-[11px] text-slate-400 font-mono">গাড়ি:</span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-cyan-300 font-mono font-bold border border-slate-800">
              {selectedDevice?.name || 'ফ্লিট ভেহিকেল'} ({selectedDevice?.attributes?.plateNumber || 'ঢাকা মেট্রো'})
            </span>
          </div>
        </div>

        {/* 3 Main Fleet Sub-Modules */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubTab('transit_counters')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'transit_counters'
                ? 'bg-cyan-600 text-white border-cyan-500 shadow-lg shadow-cyan-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {isTruckOrCargo ? <Truck className="w-4 h-4 text-cyan-300" /> : <Bus className="w-4 h-4 text-cyan-300" />}
            <span>{isTruckOrCargo ? '📦 কার্গো ডিপো ও চালান হাব' : '🚌 বাস কাউন্টার ও টিকেটিং API'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('compliance_vault')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'compliance_vault'
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>📄 BRTA লিগ্যাল ভল্ট ও ২-টিয়ার এলার্ট</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('driver_performance')}
            className={`px-3.5 py-2 rounded-2xl font-black transition border flex items-center space-x-1.5 ${
              activeSubTab === 'driver_performance'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-300" />
            <span>👨‍✈️ ড্রাইভার লাইসেন্স ও পারফরম্যান্স</span>
          </button>
        </div>
      </div>

      {/* Module Content */}
      <div className="space-y-4">
        {activeSubTab === 'transit_counters' && <TransitCounterManager isCustomerScoped={true} />}
        {activeSubTab === 'compliance_vault' && <ComplianceDocumentVault isCustomerScoped={true} />}
        {activeSubTab === 'driver_performance' && <DriverPerformanceManager isCustomerScoped={true} />}
      </div>

    </div>
  );
};
