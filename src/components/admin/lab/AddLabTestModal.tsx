import React, { useState } from "react";
import { X, FlaskConical } from "lucide-react";
import { approveLabTest } from "../../../api/labService";

interface AddLabTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  test: { cielId: string; conceptName: string; conceptClass?: string } | null;
}

export default function AddLabTestModal({ isOpen, onClose, onSuccess, test }: AddLabTestModalProps) {
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !test) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (unitPrice === "" || unitPrice < 0) {
      setError("Please enter a valid price.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await approveLabTest({
        cielConceptId: test.cielId,
        testName: test.conceptName,
        conceptClass: test.conceptClass,
        unitPrice: Number(unitPrice),
        active: true
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to approve lab test. It might already exist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FlaskConical className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Approve Lab Test</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 text-rose-600 rounded-lg text-sm border border-rose-100">
              {error}
            </div>
          )}

          <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <h3 className="text-sm font-bold text-slate-700 mb-1">{test.conceptName}</h3>
            <p className="text-xs text-slate-500 font-mono">CIEL ID: {test.cielId}</p>
          </div>

          <form id="add-lab-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Base Billing Price (₹)</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="e.g. 500"
              />
              <p className="text-xs text-slate-500 mt-2">
                This price will be automatically applied when doctors order this test for a patient.
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-lab-form"
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Approving..." : "Approve & Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
