import React, { useState, useMemo } from 'react';
import { 
  Cpu, 
  Radio, 
  Search, 
  Plus, 
  QrCode, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Trash2, 
  Layers, 
  Car, 
  Phone, 
  Tag, 
  Copy, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  Sparkles,
  Download,
  Filter,
  X,
  ArrowUpRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { 
  DeviceInventoryItem, 
  SimInventoryItem, 
  DeviceInventoryStatus, 
  SimInventoryStatus, 
  SimType 
} from '../../types/traccar';

interface EnterpriseInventoryManagerProps {
  partnerIdFilter?: string;
  isPartnerPortal?: boolean;
}

export const EnterpriseInventoryManager: React.FC<EnterpriseInventoryManagerProps> = ({ 
  partnerIdFilter,
  isPartnerPortal = false
}) => {
  const {
    deviceInventory,
    simInventory,
    addDeviceToInventory,
    updateDeviceInventoryItem,
    deleteDeviceInventoryItem,
    unbindDeviceFromVehicle,
    addSimToInventory,
    updateSimInventoryItem,
    deleteSimInventoryItem,
    unbindSimFromDevice,
    bulkImportDevices,
    bulkImportSims,
    user
  } = useApp();

  // Active Sub-Tab
  const [activeTab, setActiveTab] = useState<'devices' | 'sims' | 'scrap'>('devices');

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Scanner Simulator Modal
  const [isScanning, setIsScanning] = useState(false);
  const [scannerMode, setScannerMode] = useState<'device' | 'sim'>('device');
  const [scannedCode, setScannedCode] = useState('');

  // Add Device Modal State
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [newDevice, setNewDevice] = useState<Omit<DeviceInventoryItem, 'id' | 'addedDate'>>({
    barcode: `BC-GT06-${Math.floor(1000 + Math.random() * 9000)}`,
    imei: `86472005${Math.floor(1000000 + Math.random() * 9000000)}`,
    serialNumber: `SN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    manufacturer: 'Concox / Jimi IoT',
    model: 'GT06N Smart Tracker',
    protocol: 'gt06',
    firmwareVersion: 'v2.4.2',
    purchasePriceBdt: 1650,
    batchLot: 'LOT-2026-AUG',
    status: 'in_stock',
    partnerId: user?.partnerId || 'PRT-8801',
    notes: 'অরিজিনাল ব্র্যান্ড নিউ ট্র্যাকার'
  });

  // Add SIM Modal State
  const [isAddSimOpen, setIsAddSimOpen] = useState(false);
  const [newSim, setNewSim] = useState<Omit<SimInventoryItem, 'id' | 'addedDate'>>({
    simBarcode: `898801${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
    msisdn: `01811-${Math.floor(100000 + Math.random() * 900000)}`,
    operator: 'robi',
    simType: 'm2m_general',
    puk1: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    puk2: `${Math.floor(10000000 + Math.random() * 90000000)}`,
    pin1: '1234',
    apn: 'm2m.robi.com.bd',
    status: 'in_stock_ready',
    partnerId: user?.partnerId || 'PRT-8801',
    notes: 'টেলিমেটিক্স আইওটি ডেটা সিম'
  });

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Devices with Multi-Search
  const filteredDevices = useMemo(() => {
    return deviceInventory.filter(d => {
      if (partnerIdFilter && d.partnerId && d.partnerId !== partnerIdFilter) return false;
      
      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || (
        d.imei.toLowerCase().includes(term) ||
        d.barcode.toLowerCase().includes(term) ||
        d.serialNumber.toLowerCase().includes(term) ||
        d.model.toLowerCase().includes(term) ||
        d.manufacturer.toLowerCase().includes(term) ||
        d.protocol.toLowerCase().includes(term) ||
        (d.assignedVehiclePlate || '').toLowerCase().includes(term) ||
        (d.assignedCustomerName || '').toLowerCase().includes(term) ||
        (d.pairedSimNumber || '').includes(term)
      );

      if (activeTab === 'scrap') {
        return matchesSearch && d.status === 'damaged_scrap';
      }

      if (statusFilter !== 'all') {
        return matchesSearch && d.status === statusFilter;
      }

      return matchesSearch && d.status !== 'damaged_scrap';
    });
  }, [deviceInventory, searchTerm, statusFilter, activeTab, partnerIdFilter]);

  // Filtered SIMs with Multi-Search
  const filteredSims = useMemo(() => {
    return simInventory.filter(s => {
      if (partnerIdFilter && s.partnerId && s.partnerId !== partnerIdFilter) return false;

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch = !term || (
        s.msisdn.toLowerCase().includes(term) ||
        s.simBarcode.toLowerCase().includes(term) ||
        s.operator.toLowerCase().includes(term) ||
        s.puk1.toLowerCase().includes(term) ||
        s.simType.toLowerCase().includes(term) ||
        (s.pairedImei || '').includes(term) ||
        (s.assignedVehiclePlate || '').toLowerCase().includes(term) ||
        (s.assignedCustomerName || '').toLowerCase().includes(term)
      );

      if (activeTab === 'scrap') {
        return matchesSearch && s.status === 'damaged_lost';
      }

      if (statusFilter !== 'all') {
        return matchesSearch && s.status === statusFilter;
      }

      if (operatorFilter !== 'all') {
        return matchesSearch && s.operator === operatorFilter;
      }

      return matchesSearch && s.status !== 'damaged_lost';
    });
  }, [simInventory, searchTerm, statusFilter, operatorFilter, activeTab, partnerIdFilter]);

  // Inventory Overview Metrics
  const metrics = useMemo(() => {
    const totalDevs = deviceInventory.length;
    const inStockDevs = deviceInventory.filter(d => d.status === 'in_stock').length;
    const activeDevs = deviceInventory.filter(d => d.status === 'sold_active').length;
    const reinstallDevs = deviceInventory.filter(d => d.status === 'returned_reinstall').length;
    const scrapDevs = deviceInventory.filter(d => d.status === 'damaged_scrap').length;

    const totalSims = simInventory.length;
    const readySims = simInventory.filter(s => s.status === 'in_stock_ready').length;
    const activeSims = simInventory.filter(s => s.status === 'paired_with_device' || s.status === 'active_live').length;
    const scrapSims = simInventory.filter(s => s.status === 'damaged_lost').length;

    return {
      totalDevs,
      inStockDevs,
      activeDevs,
      reinstallDevs,
      scrapDevs,
      totalSims,
      readySims,
      activeSims,
      scrapSims
    };
  }, [deviceInventory, simInventory]);

  // Quick Barcode Scan Handler
  const handleBarcodeScanned = (code: string) => {
    setSearchTerm(code);
    setIsScanning(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Metrics Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-950/70 to-slate-900 border border-indigo-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-indigo-300">স্টকে মজুদ ডিভাইস</span>
            <Cpu className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl font-black font-mono text-white mt-1">
            {metrics.inStockDevs} <span className="text-xs font-normal text-slate-400">টি</span>
          </div>
          <span className="text-[9.5px] text-indigo-200">বিক্রির জন্য প্রস্তুত</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-950/70 to-slate-900 border border-emerald-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-emerald-300">গাড়িতে রানিং ট্র্যাকার</span>
            <Car className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black font-mono text-emerald-400 mt-1">
            {metrics.activeDevs} <span className="text-xs font-normal text-slate-400">টি</span>
          </div>
          <span className="text-[9.5px] text-emerald-300">লাইভ ট্র্যাকিং সক্রিয়</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-cyan-950/70 to-slate-900 border border-cyan-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-cyan-300">রি-ইনস্টল স্টক</span>
            <RotateCcw className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black font-mono text-cyan-300 mt-1">
            {metrics.reinstallDevs} <span className="text-xs font-normal text-slate-400">টি</span>
          </div>
          <span className="text-[9.5px] text-cyan-200">আনবাইন্ড ও পুনর্ব্যবহারযোগ্য</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/70 to-slate-900 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase text-purple-300">টেলিমেটিক্স সিম স্টক</span>
            <Radio className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-black font-mono text-purple-300 mt-1">
            {metrics.readySims} <span className="text-xs font-normal text-slate-400">/ {metrics.totalSims} টি</span>
          </div>
          <span className="text-[9.5px] text-purple-200">M2M ও রেগুলার সিম</span>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher & Action Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex items-center space-x-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800/80 w-full sm:w-auto">
          <button
            onClick={() => { setActiveTab('devices'); setStatusFilter('all'); }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'devices' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>হার্ডওয়্যার ডিভাইস ({deviceInventory.filter(d => d.status !== 'damaged_scrap').length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('sims'); setStatusFilter('all'); }}
            className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'sims' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>টেলিমেটিক্স সিম ({simInventory.filter(s => s.status !== 'damaged_lost').length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('scrap'); setStatusFilter('all'); }}
            className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-black transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'scrap' 
                ? 'bg-rose-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ড্যামেজ ও অপচয় ({metrics.scrapDevs + metrics.scrapSims})</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              setScannerMode(activeTab === 'sims' ? 'sim' : 'device');
              setIsScanning(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center space-x-1.5 border border-slate-700"
          >
            <Scan className="w-3.5 h-3.5 text-indigo-400" />
            <span>বারকোড স্ক্যানার</span>
          </button>

          {activeTab === 'devices' && (
            <button
              onClick={() => setIsAddDeviceOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন ট্র্যাকার যোগ করুন</span>
            </button>
          )}

          {activeTab === 'sims' && (
            <button
              onClick={() => setIsAddSimOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md shadow-purple-600/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন সিম যোগ করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Universal Multi-Search & Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 space-y-2.5">
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="🔍 বারকোড, IMEI, সিম নম্বর, ICCID, সিরিয়াল S/N, PUK বা গাড়ির প্লেট দিয়ে খুঁজুন..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-8 text-xs text-white placeholder-slate-500 font-medium focus:border-indigo-500 focus:outline-none"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filters */}
          <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                statusFilter === 'all' ? 'bg-slate-700 text-white' : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              সকল
            </button>

            {activeTab === 'devices' && (
              <>
                <button
                  onClick={() => setStatusFilter('in_stock')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                    statusFilter === 'in_stock' ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  স্টকে মজুদ
                </button>
                <button
                  onClick={() => setStatusFilter('sold_active')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                    statusFilter === 'sold_active' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  সক্রিয় গাড়ি
                </button>
                <button
                  onClick={() => setStatusFilter('returned_reinstall')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                    statusFilter === 'returned_reinstall' ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  রি-ইনস্টল
                </button>
              </>
            )}

            {activeTab === 'sims' && (
              <>
                <button
                  onClick={() => setStatusFilter('in_stock_ready')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                    statusFilter === 'in_stock_ready' ? 'bg-purple-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  রেডি সিম
                </button>
                <button
                  onClick={() => setStatusFilter('paired_with_device')}
                  className={`px-2.5 py-1.5 rounded-lg font-bold shrink-0 transition ${
                    statusFilter === 'paired_with_device' ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-400'
                  }`}
                >
                  পেয়ার্ড সিম
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. CONTENT TABLE FOR DEVICES */}
      {activeTab === 'devices' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-indigo-400" />
              <span>হার্ডওয়্যার ডিভাইস ইনভেন্টরি তালিকা ({filteredDevices.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">বারকোড ও প্রোটোকল সিঙ্কড</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold bg-slate-950/60">
                  <th className="p-3">বারকোড ও আইএমইআই (IMEI)</th>
                  <th className="p-3">মডেল ও প্রোটোকল</th>
                  <th className="p-3">সিরিয়াল (S/N) ও ব্যাচ</th>
                  <th className="p-3">বর্তমান স্ট্যাটাস</th>
                  <th className="p-3">অ্যাসাইনড গাড়ি / পেয়ার্ড সিম</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredDevices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 text-xs">
                      🔍 কোনো ডিভাইস পাওয়া যায়নি। সার্চ টার্ম পরিবর্তন করুন অথবা নতুন ডিভাইস যোগ করুন।
                    </td>
                  </tr>
                ) : (
                  filteredDevices.map(dev => (
                    <tr key={dev.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <div className="font-mono font-bold text-white text-xs flex items-center space-x-1">
                            <span>{dev.imei}</span>
                            <button
                              onClick={() => handleCopy(dev.imei, dev.id)}
                              className="text-slate-500 hover:text-indigo-400 transition"
                              title="IMEI কপি করুন"
                            >
                              {copiedId === dev.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          Tag: <span className="text-indigo-300">{dev.barcode}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-200 text-xs">{dev.model}</div>
                        <div className="text-[10px] text-slate-400">
                          {dev.manufacturer} • <span className="font-mono text-cyan-300 font-bold">{dev.protocol}</span>
                        </div>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-slate-300">
                        <div>{dev.serialNumber}</div>
                        <div className="text-[9.5px] text-slate-500">{dev.batchLot || 'LOT-2026'}</div>
                      </td>

                      <td className="p-3">
                        {dev.status === 'in_stock' && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                            📦 স্টকে মজুদ
                          </span>
                        )}
                        {dev.status === 'sold_active' && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                            🚗 গাড়িতে সক্রিয়
                          </span>
                        )}
                        {dev.status === 'returned_reinstall' && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            🔄 রি-ইনস্টল স্টক
                          </span>
                        )}
                        {dev.status === 'damaged_scrap' && (
                          <span className="px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                            🗑️ ড্যামেজ / স্ক্র্যাপ
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        {dev.assignedVehiclePlate ? (
                          <div>
                            <div className="font-bold text-white text-xs">{dev.assignedVehiclePlate}</div>
                            <div className="text-[10px] text-slate-400">
                              {dev.assignedCustomerName} • <span className="font-mono text-emerald-400">{dev.pairedSimNumber}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-italic">অ্যাসাইন করা হয়নি</span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {dev.status === 'sold_active' && (
                            <button
                              onClick={() => unbindDeviceFromVehicle(dev.id)}
                              className="px-2 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-800 text-[10px] font-bold transition"
                              title="কাস্টমার আনসাবস্ক্রাইব করায় ডিভাইস আনবাইন্ড করে স্টকে ফেরত নিন"
                            >
                              আনবাইন্ড
                            </button>
                          )}
                          {dev.status !== 'damaged_scrap' && (
                            <button
                              onClick={() => updateDeviceInventoryItem(dev.id, { status: 'damaged_scrap', notes: 'ব্যবহার অনুপযোগী বা ড্যামেজ' })}
                              className="p-1 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                              title="স্ক্র্যাপ / ড্যামেজ হিসেবে মার্ক করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. CONTENT TABLE FOR SIM INVENTORY */}
      {activeTab === 'sims' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-black text-white flex items-center space-x-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>টেলিমেটিক্স সিম ইনভেন্টরি তালিকা ({filteredSims.length})</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">M2M ও সিকিউরিটি PUK লেজার</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-bold bg-slate-950/60">
                  <th className="p-3">মোবাইল নম্বর (MSISDN)</th>
                  <th className="p-3">অপারেটর ও ধরন</th>
                  <th className="p-3">সিমের চিপ নম্বর (ICCID)</th>
                  <th className="p-3">PUK ও APN কোড</th>
                  <th className="p-3">পেয়ার্ড ডিভাইস / গাড়ি</th>
                  <th className="p-3 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredSims.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500 text-xs">
                      🔍 কোনো সিম কার্ড পাওয়া যায়নি।
                    </td>
                  </tr>
                ) : (
                  filteredSims.map(sim => (
                    <tr key={sim.id} className="hover:bg-slate-850/50 transition">
                      <td className="p-3">
                        <div className="font-mono font-bold text-white text-xs flex items-center space-x-1">
                          <span>{sim.msisdn}</span>
                          <button
                            onClick={() => handleCopy(sim.msisdn, sim.id)}
                            className="text-slate-500 hover:text-purple-400 transition"
                            title="মোবাইল নম্বর কপি করুন"
                          >
                            {copiedId === sim.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                        <div className="text-[9.5px] text-slate-400 mt-0.5">
                          স্ট্যাটাস: <span className="text-purple-300 font-bold">{sim.status}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="font-bold text-slate-200 text-xs uppercase">{sim.operator}</div>
                        <div className="text-[10px] text-slate-400">
                          {sim.simType === 'm2m_general' && '🌐 M2M ডেটা-অনলি'}
                          {sim.simType === 'm2m_special_voice' && '🎙️ M2M ভয়েস ও কল'}
                          {sim.simType === 'consumer_regular' && '📱 সাধারণ সিম'}
                          {sim.simType === 'byos_customer_sim' && '👤 গ্রাহকের সিম (BYOS)'}
                        </div>
                      </td>

                      <td className="p-3 font-mono text-[11px] text-slate-300">
                        <div>{sim.simBarcode}</div>
                      </td>

                      <td className="p-3 font-mono text-[10.5px]">
                        <div className="text-amber-300">PUK: {sim.puk1}</div>
                        <div className="text-[9.5px] text-slate-400">APN: {sim.apn}</div>
                      </td>

                      <td className="p-3">
                        {sim.pairedImei ? (
                          <div>
                            <div className="font-mono text-emerald-400 text-xs font-bold">{sim.pairedImei}</div>
                            <div className="text-[10px] text-slate-400">{sim.assignedVehiclePlate || 'পেয়ার্ড'}</div>
                          </div>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                            স্টকে উন্মুক্ত
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          {sim.pairedImei && (
                            <button
                              onClick={() => unbindSimFromDevice(sim.id)}
                              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition"
                            >
                              আনপেয়ার
                            </button>
                          )}
                          {sim.status !== 'damaged_lost' && (
                            <button
                              onClick={() => updateSimInventoryItem(sim.id, { status: 'damaged_lost', notes: 'নষ্ট বা ক্ষতিগ্রস্ত' })}
                              className="p-1 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-400 border border-rose-800 transition"
                              title="নষ্ট হিসেবে মার্ক করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. CONTENT TABLE FOR SCRAP & WASTAGE */}
      {activeTab === 'scrap' && (
        <div className="bg-slate-900 border border-rose-900/40 rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-rose-400 flex items-center space-x-2">
              <Trash2 className="w-4 h-4" />
              <span>ড্যামেজ ও অপচয় লেজার (Damaged Trackers & Lost SIMs)</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">অডিট ও ডিসপোজাল হিস্ট্রি</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deviceInventory.filter(d => d.status === 'damaged_scrap').map(d => (
              <div key={d.id} className="p-3 rounded-2xl bg-slate-950 border border-rose-900/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">{d.model} ({d.imei})</div>
                  <div className="text-[10px] text-slate-400">{d.notes || 'ওয়াটার ড্যামেজ / শর্ট সার্কিট'}</div>
                </div>
                <button
                  onClick={() => updateDeviceInventoryItem(d.id, { status: 'returned_reinstall', notes: 'সার্ভিসিংয়ের পর ঠিক হয়েছে' })}
                  className="px-2 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold"
                >
                  সার্ভিসিং করে রিকভার
                </button>
              </div>
            ))}

            {simInventory.filter(s => s.status === 'damaged_lost').map(s => (
              <div key={s.id} className="p-3 rounded-2xl bg-slate-950 border border-rose-900/30 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-xs">SIM: {s.msisdn} ({s.operator})</div>
                  <div className="text-[10px] text-slate-400">{s.notes || 'সিম ক্ষতিগ্রস্ত'}</div>
                </div>
                <button
                  onClick={() => updateSimInventoryItem(s.id, { status: 'in_stock_ready', notes: 'রিপ্লেসড সিম রেডি' })}
                  className="px-2 py-1 rounded-lg bg-purple-950 text-purple-300 border border-purple-800 text-[10px] font-bold"
                >
                  নতুন সিমে রিপ্লেস
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: ADD DEVICE */}
      {isAddDeviceOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-indigo-400" />
                <span>নতুন হার্ডওয়্যার ডিভাইস ইনভেন্টরিতে ইনওয়ার্ড করুন</span>
              </h3>
              <button onClick={() => setIsAddDeviceOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addDeviceToInventory(newDevice);
              setIsAddDeviceOpen(false);
            }} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">IMEI নম্বর (১৫ ডিজিট) *</label>
                  <input
                    type="text"
                    required
                    value={newDevice.imei}
                    onChange={(e) => setNewDevice({ ...newDevice, imei: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">বারকোড / ট্যাগ আইডি *</label>
                  <input
                    type="text"
                    required
                    value={newDevice.barcode}
                    onChange={(e) => setNewDevice({ ...newDevice, barcode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">ম্যানুফ্যাকচারার ও মডেল *</label>
                  <input
                    type="text"
                    required
                    value={newDevice.model}
                    onChange={(e) => setNewDevice({ ...newDevice, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সার্ভার প্রোটোকল *</label>
                  <select
                    value={newDevice.protocol}
                    onChange={(e) => setNewDevice({ ...newDevice, protocol: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  >
                    <option value="gt06">gt06 (Concox / Micodus / Jimi)</option>
                    <option value="teltonika">teltonika (FMB920, FMC130)</option>
                    <option value="h02">h02 (Mini Hidden Relay)</option>
                    <option value="wialon">wialon (Standard IPS)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সিরিয়াল নম্বর (S/N)</label>
                  <input
                    type="text"
                    value={newDevice.serialNumber}
                    onChange={(e) => setNewDevice({ ...newDevice, serialNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">ক্রয়মূল্য (৳)</label>
                  <input
                    type="number"
                    value={newDevice.purchasePriceBdt}
                    onChange={(e) => setNewDevice({ ...newDevice, purchasePriceBdt: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddDeviceOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/30"
                >
                  ইনভেন্টরিতে সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SIM */}
      {isAddSimOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-lg shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>নতুন টেলিমেটিক্স সিম ইনভেন্টরিতে যুক্ত করুন</span>
              </h3>
              <button onClick={() => setIsAddSimOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              addSimToInventory(newSim);
              setIsAddSimOpen(false);
            }} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সিম মোবাইল নম্বর (MSISDN) *</label>
                  <input
                    type="text"
                    required
                    value={newSim.msisdn}
                    onChange={(e) => setNewSim({ ...newSim, msisdn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">অপারেটর *</label>
                  <select
                    value={newSim.operator}
                    onChange={(e) => setNewSim({ ...newSim, operator: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-bold text-white focus:outline-none uppercase"
                  >
                    <option value="robi">Robi Axiata</option>
                    <option value="grameenphone">Grameenphone</option>
                    <option value="banglalink">Banglalink</option>
                    <option value="teletalk">Teletalk</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সিম কার্ড চিপ নম্বর (ICCID) *</label>
                  <input
                    type="text"
                    required
                    value={newSim.simBarcode}
                    onChange={(e) => setNewSim({ ...newSim, simBarcode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono font-bold text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">সিম টাইপ *</label>
                  <select
                    value={newSim.simType}
                    onChange={(e) => setNewSim({ ...newSim, simType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white focus:outline-none"
                  >
                    <option value="m2m_general">M2M General (Data Only)</option>
                    <option value="m2m_special_voice">M2M Special (Voice & Calls)</option>
                    <option value="consumer_regular">Consumer Regular</option>
                    <option value="byos_customer_sim">BYOS (Customer's Own SIM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">PUK কোড *</label>
                  <input
                    type="text"
                    required
                    value={newSim.puk1}
                    onChange={(e) => setNewSim({ ...newSim, puk1: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-300 block mb-1">APN নেম</label>
                  <input
                    type="text"
                    value={newSim.apn}
                    onChange={(e) => setNewSim({ ...newSim, apn: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 font-mono text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddSimOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                >
                  সিম সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SCANNER SIMULATOR MODAL */}
      {isScanning && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 w-full max-w-sm shadow-2xl space-y-4 animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400 animate-pulse">
              <Scan className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-white">লাইভ বারকোড ও কিউআর স্ক্যানার</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ডিভাইস প্যাকেট বা সিমের পেছনের বারকোডের দিকে ক্যামেরা ধরুন অথবা কোড টাইপ করুন:
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                placeholder="যেমন: 354778343153865 বা 01811-223344"
                className="w-full bg-slate-950 border border-indigo-500/50 rounded-xl p-2.5 font-mono text-center text-xs text-white font-bold focus:outline-none"
              />

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleBarcodeScanned('354778343153865')}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-indigo-300 hover:border-indigo-500"
                >
                  ⚡ ডেমো IMEI স্ক্যান
                </button>
                <button
                  onClick={() => handleBarcodeScanned('01811-223344')}
                  className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-[10px] font-mono text-purple-300 hover:border-purple-500"
                >
                  ⚡ ডেমো SIM স্ক্যান
                </button>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setIsScanning(false)}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
