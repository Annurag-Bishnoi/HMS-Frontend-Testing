import { useState, useEffect } from "react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { pharmacyService } from "../../../api/pharmacyService";
import type { InventoryItem } from "../../../api/pharmacyService";

interface EditInventoryModalProps {
  item: InventoryItem;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditInventoryModal({ item, onClose, onUpdate }: EditInventoryModalProps) {
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    medicineName: item.medicineName,
    reorderLevel: item.reorderLevel,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await pharmacyService.updateInventoryItem(item.inventoryItemId, {
        medicineName: formData.medicineName,
        reorderLevel: formData.reorderLevel,
      });
      setSuccess(true);
      setTimeout(() => {
        onUpdate();
        onClose();
      }, 1500);
    } catch (err: any) {
      alert("Failed to update inventory item: " + (err.response?.data?.message || err.message));
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">Edit Inventory Item</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center animate-fade-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle size={32} />
            </div>
            <h3 className="mb-2 text-xl font-bold text-slate-800">Item Updated!</h3>
            <p className="text-sm text-slate-500">The inventory item has been successfully updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CIEL Concept ID (Immutable)</label>
              <input
                type="text"
                disabled
                value={item.cielConceptId}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-500 cursor-not-allowed outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Medicine Name *</label>
              <input
                type="text"
                required
                value={formData.medicineName}
                onChange={(e) => setFormData({...formData, medicineName: e.target.value})}
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Medicine Name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reorder Level *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.reorderLevel}
                onChange={(e) => setFormData({...formData, reorderLevel: parseInt(e.target.value) || 0})}
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-3 border-t mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center px-5 py-2 min-w-[120px] rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
