import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import type { Prescription } from "../../../api/pharmacyService";

interface RejectConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  prescription: Prescription | null;
}

export default function RejectConfirmationModal({ isOpen, onClose, onConfirm, prescription }: RejectConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !prescription) return null;

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Reject Prescription</h2>
              <p className="text-xs text-slate-500 font-mono">ID: #PRE-{prescription.prescriptionId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            You are about to permanently reject this prescription for <span className="font-bold text-slate-800">{prescription.patient?.name}</span>.
          </p>
          <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl">
            <p className="text-sm text-rose-700 font-medium">
              This action cannot be undone. The prescription will be removed from the pending queue and marked as discarded. Proceed only if the requested medications are completely unavailable or invalid.
            </p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Rejecting...
              </>
            ) : (
              "Yes, Reject Prescription"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
