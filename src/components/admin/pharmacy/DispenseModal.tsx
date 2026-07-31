import React, { useState, useEffect } from "react";
import { X, CheckCircle, Pill } from "lucide-react";
import { pharmacyService } from "../../../api/pharmacyService";
import type { Prescription, DispenseRequest } from "../../../api/pharmacyService";

interface DispenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onReject?: (prescription: Prescription) => void;
  prescription: Prescription | null;
}

const DispenseModal: React.FC<DispenseModalProps> = ({ isOpen, onClose, onSuccess, onReject, prescription }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dispenseItems, setDispenseItems] = useState<{ id: string; qty: number; unitPrice: number }[]>([]);

  useEffect(() => {
    if (isOpen && prescription) {
      setDispenseItems(
        prescription.medications.map(m => ({
          id: m.medicationCode || '',
          qty: parseInt(m.quantity || "1"),
          unitPrice: m.unitPrice || (15.50 + (m.medicineName || '').length * 2)
        }))
      );
    }
  }, [isOpen, prescription]);

  const handleQtyChange = (id: string, val: string) => {
    const newQty = parseInt(val) || 0;
    setDispenseItems(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(0, newQty) } : item));
  };

  if (!isOpen || !prescription) return null;

  const handleDispense = async () => {
    setLoading(true);
    setError(null);
    try {
      const itemsToDispense = dispenseItems.filter(item => item.qty > 0).map(item => ({
        medicineId: item.id,
        quantity: item.qty
      }));

      if (itemsToDispense.length === 0) {
        throw new Error("You must dispense at least one item.");
      }

      const request: DispenseRequest = {
        prescriptionId: prescription.prescriptionId,
        items: itemsToDispense
      };

      await pharmacyService.dispenseMedicine(request);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to dispense medicines. Check stock availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Pill className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">
              {prescription.status === 'DISPENSED' ? 'Pharmacist Bill' : 'Dispense Prescription'} #PRE-{prescription.prescriptionId}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm border border-rose-100">
              {error}
            </div>
          )}

          <div className="mb-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Patient Details</p>
              <p className="text-sm font-medium text-slate-800">
                {prescription.patient?.name || `ID: ${prescription.patient?.patientId}`}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Doctor Details</p>
              <p className="text-sm font-medium text-slate-800">
                Dr. {prescription.doctor?.name || prescription.doctor?.doctorId}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Prescribed Medicines</h3>
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-slate-700">Medicine Name</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Dosage</th>
                    <th className="px-6 py-4 text-center font-semibold text-slate-700">Qty</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-700">Unit Price</th>
                    <th className="px-6 py-4 text-right font-semibold text-slate-700">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {prescription.medications.map((med, index) => {
                    const dispItem = dispenseItems.find(i => i.id === med.medicationCode);
                    const qty = dispItem ? dispItem.qty : parseInt(med.quantity || "1");
                    const unitPrice = med.unitPrice || 0; 
                    const total = qty * unitPrice;
                    const prescribedQty = parseInt(med.quantity || "1");
                    
                    return (
                      <tr key={index} className={qty === 0 ? "opacity-50" : ""}>
                        <td className="px-6 py-4 text-sm text-slate-800 font-medium">
                          {med.medicineName}
                          <div className="text-[10px] text-slate-500">ID: {med.medicationCode} • Prescribed: {prescribedQty}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 text-center">{med.dosage}</td>
                        <td className="px-6 py-4 text-sm text-center font-semibold">
                          {prescription.status === 'DISPENSED' ? (
                            <span className="text-slate-800">{qty}</span>
                          ) : (
                            <input 
                              type="number" 
                              min="0"
                              value={qty} 
                              onChange={(e) => handleQtyChange(med.medicationCode || '', e.target.value)}
                              className="w-16 px-2 py-1 text-center border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 text-right">₹{unitPrice.toFixed(2)}</td>
                        <td className="px-6 py-4 text-sm text-slate-800 text-right font-bold text-indigo-600">₹{total.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-indigo-900">Billing Integration (Pending)</p>
                <p className="text-xs text-indigo-700 mt-0.5">Upon dispensing, a pharmacy bill will be generated automatically and sent to the patient's account.</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-1">Estimated Total</p>
                <p className="text-2xl font-bold text-indigo-700">
                  ₹{dispenseItems.reduce((sum, item) => sum + (item.qty * item.unitPrice), 0).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 items-center">
          {prescription.status !== 'DISPENSED' && (
            <span className="text-xs text-slate-500 mr-auto flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              Stock will be deducted automatically
            </span>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {prescription.status === 'DISPENSED' ? 'Close' : 'Cancel'}
          </button>
          
          {prescription.status !== 'DISPENSED' && onReject && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onReject(prescription);
              }}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
            >
              Reject Prescription
            </button>
          )}

          {prescription.status !== 'DISPENSED' && (
            <button
              onClick={handleDispense}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? "Processing..." : (
                <>
                  <CheckCircle className="w-4 h-4" /> Confirm & Dispense
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DispenseModal;
