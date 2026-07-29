import { X, Package, Hash, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import type { InventoryItem } from "../../../api/pharmacyService";

interface ViewInventoryModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export default function ViewInventoryModal({ item, onClose }: ViewInventoryModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Inventory Details</h2>
            <p className="text-sm text-slate-500">View medication stock information</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Package size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{item.medicineName}</h3>
              <p className="text-sm text-slate-500 font-mono flex items-center gap-1 mt-1">
                <Hash size={14} />
                CIEL: {item.cielConceptId || "N/A"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Stock</p>
              <p className="text-2xl font-bold text-slate-800">{item.totalStock}</p>
            </div>
            <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Reorder Level</p>
              <p className="text-2xl font-bold text-slate-800">{item.reorderLevel}</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
              <span className="text-sm font-medium text-slate-600">Status</span>
              {item.isLowStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 border border-red-200">
                  <AlertTriangle size={14} /> Low Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200">
                  <CheckCircle2 size={14} /> Healthy
                </span>
              )}
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-white border border-slate-100 shadow-sm">
              <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" /> Nearest Expiry
              </span>
              <span className="text-sm font-medium text-slate-800">
                {item.nearestExpiryDate ? new Date(item.nearestExpiryDate).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="border-t p-4 flex justify-end bg-slate-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-200 px-5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
