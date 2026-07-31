import React, { useState, useEffect } from "react";
import { X, Edit2 } from "lucide-react";
import { updateLabTest } from "../../../api/labService";

interface EditLabTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  test: any | null;
}

export default function EditLabTestModal({ isOpen, onClose, onSuccess, test }: EditLabTestModalProps) {
  const [unitPrice, setUnitPrice] = useState<number | "">("");
  const [active, setActive] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (test) {
      setUnitPrice(test.unitPrice);
      setActive(test.active);
    }
  }, [test]);

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
      await updateLabTest(test.id, {
        unitPrice: Number(unitPrice),
        active
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update lab test.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <Edit2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Edit Lab Test</h2>
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
            <h3 className="text-sm font-bold text-slate-700 mb-1">{test.testName}</h3>
            <p className="text-xs text-slate-500 font-mono">CIEL ID: {test.cielConceptId}</p>
          </div>

          <form id="edit-lab-form" onSubmit={handleSubmit} className="space-y-4">
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
              />
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
              <input
                type="checkbox"
                id="active-toggle"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="active-toggle" className="text-sm font-medium text-slate-700 cursor-pointer">
                Active in System
              </label>
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
            form="edit-lab-form"
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm shadow-blue-200 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
