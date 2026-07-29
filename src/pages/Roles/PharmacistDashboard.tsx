import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, Stethoscope, AlertTriangle, 
  Activity, Clock, FileText, CheckCircle
} from "lucide-react";
import { pharmacyService } from "../../api/pharmacyService";
import type { InventoryItem, Prescription } from "../../api/pharmacyService";
import { getUser } from "../../utils/token";
import DataTable, { tableHeadClass, tableRowClass, tableCellClass } from "../../components/common/DataTable";
import DispenseModal from "../../components/admin/pharmacy/DispenseModal";
import PendingPrescriptionsTable from "../../components/admin/pharmacy/PendingPrescriptionsTable";

export default function PharmacistDashboard() {
  const navigate = useNavigate();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const user = getUser();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const invData = await pharmacyService.getAllInventory();
      setInventory(Array.isArray(invData) ? invData : []);
      
      const pxData = await pharmacyService.getPendingPrescriptions();
      setPrescriptions(Array.isArray(pxData) ? pxData : []);
    } catch (err) {
      console.error("Failed to load pharmacy dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute stats
  const lowStockThreshold = 20; // Example threshold
  const lowStockItems = inventory.filter(item => item.totalStock <= lowStockThreshold && (item.isActive ?? item.active ?? true));
  const activeItems = inventory.filter(item => (item.isActive ?? item.active ?? true)).length;
  
  const pendingCount = prescriptions.length;

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
      {/* ── Professional Profile Banner ── */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
        
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
              Pharmacy Department
            </span>
            <span className="text-slate-400 text-sm font-medium">
              ID: {user?.id}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Hello, {user?.name || 'Pharmacist'}
          </h1>
          <p className="text-slate-500 font-medium mt-1">Ready to manage inventory and dispense medications.</p>
        </div>

        <div className="text-right z-10 hidden sm:block">
          <div className="text-2xl font-bold text-slate-700 font-mono tracking-tight">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
          <div className="text-sm font-semibold text-slate-500">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </div>

      {/* ── Statistics Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-semibold mb-1">Active Inventory</p>
            <h3 className="text-3xl font-bold text-slate-800">{loading ? '...' : activeItems}</h3>
          </div>
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl">
            <Package size={24} />
          </div>
        </div>
        
        {/* Stat 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-300 transition-colors" onClick={() => navigate('/pharmacy/inventory')}>
          <div>
            <p className="text-slate-500 text-sm font-semibold mb-1">Low Stock Alerts</p>
            <h3 className="text-3xl font-bold text-amber-600">{loading ? '...' : lowStockItems.length}</h3>
          </div>
          <div className="bg-amber-50 text-amber-600 p-3 rounded-xl">
            <AlertTriangle size={24} />
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-indigo-300 transition-colors" onClick={() => navigate('/pharmacy/dispense')}>
          <div>
            <p className="text-slate-500 text-sm font-semibold mb-1">Pending Orders</p>
            <h3 className="text-3xl font-bold text-indigo-600">{loading ? '...' : pendingCount}</h3>
          </div>
          <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl">
            <Stethoscope size={24} />
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-semibold mb-1">System Status</p>
            <h3 className="text-lg font-bold text-emerald-600 flex items-center gap-1 mt-1">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              Online
            </h3>
          </div>
          <div className="bg-slate-50 text-slate-400 p-3 rounded-xl">
            <Activity size={24} />
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Content ── */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* Pending Queue */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-5 py-4 flex justify-between items-center text-white">
            <h3 className="font-bold flex items-center gap-2">
              <Clock size={18} className="text-indigo-400" /> 
              Recent Prescriptions
            </h3>
            <button 
              onClick={() => navigate('/pharmacy/dispense')}
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition font-medium"
            >
              Dispense Queue
            </button>
          </div>
          
          <div className="p-0 flex-1 overflow-auto max-h-[400px]">
            {loading ? (
              <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400"></div></div>
            ) : pendingCount === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FileText size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-slate-500">No pending prescriptions.</p>
                <p className="text-sm">All orders have been fulfilled.</p>
              </div>
            ) : (
              <div className="border-t border-slate-100">
                <PendingPrescriptionsTable 
                  prescriptions={prescriptions} 
                  onDispense={(px) => setSelectedPrescription(px)} 
                />
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Dispense Modal */}
      <DispenseModal 
        isOpen={!!selectedPrescription}
        prescription={selectedPrescription} 
        onClose={() => setSelectedPrescription(null)} 
        onSuccess={() => {
          setSelectedPrescription(null);
          fetchData();
        }}
      />
    </div>
  );
}
