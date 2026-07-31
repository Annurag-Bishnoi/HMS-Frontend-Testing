import DataTable, { tableHeadClass, tableRowClass, tableCellClass } from '../../../components/common/DataTable';
import React, { useState, useEffect } from "react";
import { Pill, RefreshCw, CheckCircle, Clock, Activity, XCircle, FileText } from "lucide-react";
import { pharmacyService } from "../../../api/pharmacyService";
import type { Prescription } from "../../../api/pharmacyService";
import PendingPrescriptionsTable from "../../../components/admin/pharmacy/PendingPrescriptionsTable";
import DispenseModal from "../../../components/admin/pharmacy/DispenseModal";
import InvoicePreviewModal from "../../../components/admin/pharmacy/InvoicePreviewModal";
import RejectConfirmationModal from "../../../components/admin/pharmacy/RejectConfirmationModal";

export default function PharmacyDispensePage() {
  const [pending, setPending] = useState<Prescription[]>([]);
  const [dispensed, setDispensed] = useState<Prescription[]>([]);
  const [rejected, setRejected] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'pending' | 'dispensed' | 'rejected'>('pending');
  const [isDispenseOpen, setIsDispenseOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [prescriptionToReject, setPrescriptionToReject] = useState<Prescription | null>(null);
  const [invoicePatientId, setInvoicePatientId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const pendingData = await pharmacyService.getPendingPrescriptions().catch(() => []);
      const dispensedData = await pharmacyService.getDispensedPrescriptions().catch(() => []);
      const rejectedData = await pharmacyService.getRejectedPrescriptions().catch(() => []);
      
      setPending(Array.isArray(pendingData) ? pendingData : []);
      setDispensed(Array.isArray(dispensedData) ? dispensedData : []);
      setRejected(Array.isArray(rejectedData) ? rejectedData : []);
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

  const handleDiscardClick = (prescription: Prescription) => {
    setPrescriptionToReject(prescription);
  };

  const executeDiscard = async () => {
    if (!prescriptionToReject) return;
    try {
      setLoading(true);
      await pharmacyService.discardPrescription(prescriptionToReject.prescriptionId);
      fetchData();
    } catch (err) {
      alert("Failed to discard prescription");
      setLoading(false);
    }
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
      <div className="grid grid-cols-3 gap-4">
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
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-50"><XCircle className="text-rose-600" size={22} /></div>
          <div>
            <p className="text-xs text-slate-500 font-medium">Rejected Orders</p>
            <h3 className="text-2xl font-bold text-slate-800">{loading ? '…' : rejected.length}</h3>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'pending',   label: `Pending (${pending.length})`,   icon: Clock },
          { key: 'dispensed', label: `Dispensed (${dispensed.length})`, icon: CheckCircle },
          { key: 'rejected', label: `Rejected (${rejected.length})`, icon: XCircle },
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
          onDiscard={handleDiscardClick}
        />
      ) : activeTab === 'dispensed' ? (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <DataTable>
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>Prescription ID</th>
                <th className={tableHeadClass}>Patient</th>
                <th className={tableHeadClass}>Doctor</th>
                <th className={tableHeadClass}>Medicines</th>
                <th className={tableHeadClass}>Date Dispensed</th>
                <th className={tableHeadClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {dispensed.length === 0 ? (
                <TableEmptyRow colSpan={6} message="No dispensed prescriptions yet." />
              ) : (
                dispensed.map((rx) => (
                  <tr key={rx.prescriptionId} className={tableRowClass}>
                    <td className={`${tableCellClass} font-semibold`}>
                      #PRE-{rx.prescriptionId}
                    </td>
                    <td className={tableCellClass}>
                      {rx.patient?.name || `Patient #${rx.patient?.patientId}`}
                    </td>
                    <td className={tableCellClass}>
                      Dr. {rx.doctor?.name || rx.doctor?.doctorId}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs max-w-[200px] truncate" title={rx.medications?.map((m: any) => `${m.medicineName} (${m.quantity})`).join(', ')}>
                      {rx.medications?.length 
                        ? rx.medications.map((m: any) => `${m.medicineName} (${m.quantity})`).join(', ') 
                        : '—'}
                    </td>
                    <td className={tableCellClass}>
                      {new Date(rx.createdAt).toLocaleString()}
                    </td>
                    <td className={tableCellClass}>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                          <CheckCircle size={11} /> Dispensed
                        </span>
                        <button
                          onClick={() => setInvoicePatientId(rx.patient.patientId)}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full hover:bg-blue-100 transition"
                        >
                          <FileText size={12} /> View Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </DataTable>
        </div>
      ) : (
        /* Rejected History Table */
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <DataTable>
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>Prescription ID</th>
                <th className={tableHeadClass}>Patient</th>
                <th className={tableHeadClass}>Doctor</th>
                <th className={tableHeadClass}>Unavailable Medicines</th>
                <th className={tableHeadClass}>Date Created</th>
                <th className={tableHeadClass}>Status</th>
              </tr>
            </thead>
            <tbody>
              {rejected.length === 0 ? (
                <TableEmptyRow colSpan={6} message="No rejected prescriptions." />
              ) : (
                rejected.map((rx) => (
                  <tr key={rx.prescriptionId} className={tableRowClass}>
                    <td className={`${tableCellClass} font-semibold text-rose-600`}>
                      #PRE-{rx.prescriptionId}
                    </td>
                    <td className={tableCellClass}>
                      {rx.patient?.name || `Patient #${rx.patient?.patientId}`}
                    </td>
                    <td className={tableCellClass}>
                      Dr. {rx.doctor?.name || rx.doctor?.doctorId}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs max-w-[200px] truncate" title={rx.medications?.map((m: any) => `${m.medicineName} (${m.quantity})`).join(', ')}>
                      {rx.medications?.length 
                        ? rx.medications.map((m: any) => `${m.medicineName}`).join(', ') 
                        : '—'}
                    </td>
                    <td className={tableCellClass}>
                      {new Date(rx.createdAt).toLocaleString()}
                    </td>
                    <td className={tableCellClass}>
                      <span className="inline-flex items-center gap-1 text-xs font-bold bg-rose-50 text-rose-700 px-2.5 py-1 rounded-full border border-rose-200">
                        Rejected
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </DataTable>
        </div>
      )}

      {/* Dispense Modal */}
      <DispenseModal
        isOpen={isDispenseOpen}
        onClose={() => { setIsDispenseOpen(false); setSelectedPrescription(null); }}
        onSuccess={fetchData}
        onReject={handleDiscardClick}
        prescription={selectedPrescription}
      />

      {/* Invoice Modal */}
      <InvoicePreviewModal
        isOpen={invoicePatientId !== null}
        onClose={() => setInvoicePatientId(null)}
        patientId={invoicePatientId || 0}
      />

      {/* Reject Confirmation Modal */}
      <RejectConfirmationModal
        isOpen={prescriptionToReject !== null}
        onClose={() => setPrescriptionToReject(null)}
        onConfirm={executeDiscard}
        prescription={prescriptionToReject}
      />
    </div>
  );
}
