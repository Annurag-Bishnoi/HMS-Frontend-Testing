import React, { useState } from "react";
import { X, Settings2 } from "lucide-react";
import { pharmacyService } from "../../../api/pharmacyService";
import type { StockAdjustmentRequest, InventoryItem } from "../../../api/pharmacyService";

interface AdjustStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  inventory: InventoryItem[];
}

const AdjustStockModal: React.FC<AdjustStockModalProps> = ({ isOpen, onClose, onSuccess, inventory }) => {
  const [formData, setFormData] = useState<StockAdjustmentRequest>({
    medicineId: 0,
    quantity: 0,
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await pharmacyService.adjustStock(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to adjust stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <Settings2 className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Adjust Stock</h2>
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

          <form id="adjust-stock-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Select Medicine</label>
              <select
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={formData.medicineId}
                onChange={(e) => setFormData({ ...formData, medicineId: parseInt(e.target.value) })}
              >
                <option value={0} disabled>Select a medicine</option>
                {inventory.map((item) => (
                  <option key={item.inventoryItemId} value={item.inventoryItemId}>
                    {item.medicineName} (Stock: {item.totalStock})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Adjustment Quantity</label>
              <input
                type="number"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={formData.quantity || ""}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                placeholder="Use negative for reduction (e.g., -5)"
              />
              <p className="mt-1 text-xs text-slate-500">Positive to add stock, negative to deduct stock.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Adjustment</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="e.g. Expired, Correction"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="adjust-stock-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? "Adjusting..." : "Confirm Adjustment"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdjustStockModal;
