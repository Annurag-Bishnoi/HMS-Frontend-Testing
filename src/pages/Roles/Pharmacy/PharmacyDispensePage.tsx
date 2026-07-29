import DataTable, { tableHeadClass, tableRowClass, tableCellClass } from '../../../components/common/DataTable';
import React, { useState, useEffect } from "react";
import { Pill, RefreshCw, CheckCircle, Clock, Activity } from "lucide-react";
import { pharmacyService } from "../../../api/pharmacyService";
import type { Prescription } from "../../../api/pharmacyService";
import PendingPrescriptionsTable from "../../../components/admin/pharmacy/PendingPrescriptionsTable";
import DispenseModal from "../../../components/admin/pharmacy/DispenseModal";

export default function PharmacyDispensePage() {
  const [pending, setPending] = useState<Prescription[]>([]);
  const [dispensed, setDispensed] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'dispensed'>('pending');
  const [isDispenseOpen, setIsDispenseOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [p, d] = await Promise.all([
        pharmacyService.getPendingPrescriptions(),
        pharmacyService.getDispensedPrescriptions(),
      ]);
      setPending(Array.isArray(p) ? p : []);
      setDispensed(Array.isArray(d) ? d : []);
    } catch (err) {
      console.error("Failed to fetch prescriptions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleDispenseClick = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDispenseOpen(true);
  };

  return (
    <div className="p-6 space-y-6 h-[calc(100vh-64px)] overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Pill className="text-indigo-600" /> Dispense Queue
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Review incoming prescriptions and fulfill medication orders.</p>
        </div>
        <button
          onClick={fetchData}
          className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors border border-slate-200"
          title="Refresh"
        >
          <RefreshCw size={18} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50"><Clock className="text-amber-600" size={22} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Pending Orders</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '…' : pending.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50"><CheckCircle className="text-emerald-600" size={22} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Dispensed Total</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '…' : dispensed.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'pending',   label: `Pending (${pending.length})`,   icon: Clock },
          { key: 'dispensed', label: `Dispensed (${dispensed.length})`, icon: CheckCircle },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              activeTab === t.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <t.icon size={15} /> {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Activity className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : activeTab === 'pending' ? (
        <PendingPrescriptionsTable
          prescriptions={pending}
          onDispense={handleDispenseClick}
        />
      ) : (
        /* Dispensed History Table */
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="text-emerald-500" size={18} /> Dispensing History
            </h3>
          </div>
          <div className="overflow-x-auto">
            {dispensed.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <CheckCircle size={44} className="mb-3 opacity-40" />
                <p className="font-medium">No dispensed orders yet.</p>
              </div>
            ) : (
              <DataTable>
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className={tableHeadClass}>Rx ID</th>
                    <th className={tableHeadClass}>Patient</th>
                    <th className={tableHeadClass}>Doctor</th>
                    <th className={tableHeadClass}>Medicines</th>
                    <th className={tableHeadClass}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dispensed.map(rx => (
                    <tr key={rx.prescriptionId} className="border-b hover:bg-slate-50 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-mono text-slate-600 font-bold">#{String(rx.prescriptionId).padStart(4, '0')}</td>
                      <td className="px-6 py-4 font-semibold text-slate-800">{rx.patient?.name || '—'}</td>
                      <td className="px-6 py-4 text-slate-600">Dr. {rx.doctor?.name || '—'}</td>
                      <td className="px-6 py-4 text-slate-600 text-xs">
                        {rx.medications?.length ? `${rx.medications.length} item${rx.medications.length > 1 ? 's' : ''}` : '—'}
                      </td>
                      <td className={tableCellClass}>
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                          <CheckCircle size={11} /> Dispensed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            )}
          </div>
        </div>
      )}

      {/* Dispense Modal */}
      <DispenseModal
        isOpen={isDispenseOpen}
        onClose={() => { setIsDispenseOpen(false); setSelectedPrescription(null); }}
        onSuccess={fetchData}
        prescription={selectedPrescription}
      />
    </div>
  );
}
