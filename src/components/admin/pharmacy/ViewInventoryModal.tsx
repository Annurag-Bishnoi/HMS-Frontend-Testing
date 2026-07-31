import React, { useState, useEffect } from "react";
import { X, Package, Hash, AlertTriangle, CheckCircle2, Calendar, ClipboardList } from "lucide-react";
import { pharmacyService } from "../../../api/pharmacyService";
import type { InventoryItem } from "../../../api/pharmacyService";

interface ViewInventoryModalProps {
  item: InventoryItem;
  onClose: () => void;
}

export default function ViewInventoryModal({ item, onClose }: ViewInventoryModalProps) {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    pharmacyService.getBatches(item.inventoryItemId)
      .then(data => setBatches(data || []))
      .catch(err => console.error("Failed to load batches:", err))
      .finally(() => setLoading(false));
  }, [item.inventoryItemId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl flex flex-col">
        <div className="flex items-center justify-between border-b px-6 py-4 bg-slate-50 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Inventory Details</h2>
            <p className="text-sm text-slate-500">View medication stock and batch breakdown</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 animate-pulse">
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

          {/* Active Batches breakdown */}
          <div className="pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ClipboardList className="text-slate-400" size={16} /> Active Stock Batches
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs max-h-40 overflow-y-auto shadow-inner bg-slate-50/20">
              {loading ? (
                <div className="py-8 text-center text-slate-400 font-medium">Loading batch history...</div>
              ) : batches.length === 0 ? (
                <div className="py-8 text-center text-slate-400 font-medium">No stock batches registered.</div>
              ) : (
                <table className="min-w-full divide-y divide-slate-150">
                  <thead className="bg-slate-100 text-slate-500 font-bold uppercase tracking-wider text-[9px] sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5 text-left">Batch No.</th>
                      <th className="px-4 py-2.5 text-left">Supplier</th>
                      <th className="px-4 py-2.5 text-right">Quantity</th>
                      <th className="px-4 py-2.5 text-right">Unit Price</th>
                      <th className="px-4 py-2.5 text-center">Expiry</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {batches.map((batch) => (
                      <tr key={batch.batchId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-2 font-mono font-bold text-slate-600">{batch.batchNumber}</td>
                        <td className="px-4 py-2 text-left text-slate-500 font-medium truncate max-w-[120px]" title={batch.supplierName}>
                          {batch.supplierName || "—"}
                        </td>
                        <td className="px-4 py-2 text-right font-bold text-slate-800">{batch.quantity} units</td>
                        <td className="px-4 py-2 text-right text-slate-600 font-semibold">₹{parseFloat(batch.unitPrice).toFixed(2)}</td>
                        <td className="px-4 py-2 text-center text-slate-600 font-medium">
                          {batch.expiryDate ? new Date(batch.expiryDate).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
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
