import React, { useState, useEffect } from "react";
import { Package, Plus, Settings2, AlertTriangle, CheckCircle, Search } from "lucide-react";
import { pharmacyService } from "../../../api/pharmacyService";
import type { InventoryItem } from "../../../api/pharmacyService";
import InventoryTable from "../../../components/admin/pharmacy/InventoryTable";
import EditInventoryModal from "../../../components/admin/pharmacy/EditInventoryModal";
import ViewInventoryModal from "../../../components/admin/pharmacy/ViewInventoryModal";
import AddStockModal from "../../../components/admin/pharmacy/AddStockModal";
import AdjustStockModal from "../../../components/admin/pharmacy/AdjustStockModal";

export default function PharmacyInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isAdjustStockOpen, setIsAdjustStockOpen] = useState(false);
  const [editingInventoryItem, setEditingInventoryItem] = useState<any | null>(null);
  const [viewingInventoryItem, setViewingInventoryItem] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await pharmacyService.getAllInventory();
      setInventory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteInventory = async (item: InventoryItem) => {
    if (item.totalStock > 0) {
      alert(`Professional Notice: You cannot delete ${item.medicineName} because it still has ${item.totalStock} units in stock.\n\nAdjust stock to 0 before removing to maintain accurate financial and audit logs.`);
      return;
    }
    if (!window.confirm(`Are you sure you want to completely remove ${item.medicineName}?`)) return;
    try {
      await pharmacyService.deleteInventoryItem(item.inventoryItemId);
      fetchData();
    } catch (err) {
      alert("Failed to delete inventory item. It may be linked to existing prescriptions.");
    }
  };

  const handleToggleInventoryStatus = async (item: InventoryItem) => {
    try {
      const currentActive = item.isActive ?? item.active ?? true;
      await pharmacyService.toggleInventoryStatus(item.inventoryItemId, !currentActive);
      fetchData();
    } catch (err) {
      alert("Failed to update inventory status.");
    }
  };

  return (
    <div className="space-y-6 p-6 min-h-screen bg-slate-50/50">
      {/* Header section */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="text-emerald-600" />
            Inventory Management
          </h1>
          <p className="text-slate-500 mt-1 text-sm">Monitor stock levels, add new batches, and adjust quantities.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdjustStockOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200 shadow-sm"
          >
            <Settings2 className="w-4 h-4" />
            Adjust Stock
          </button>
          <button
            onClick={() => setIsAddStockOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-all shadow-sm shadow-emerald-200"
          >
            <Plus className="w-4 h-4" />
            Add Batch
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <InventoryTable 
            inventory={inventory} 
            onView={setViewingInventoryItem}
            onEdit={setEditingInventoryItem}
            onDelete={handleDeleteInventory}
            onToggleStatus={handleToggleInventoryStatus}
          />
        )}
      </div>

      {/* Modals */}
      <AddStockModal 
        isOpen={isAddStockOpen} 
        onClose={() => setIsAddStockOpen(false)} 
        onSuccess={fetchData} 
      />
      <AdjustStockModal 
        isOpen={isAdjustStockOpen} 
        onClose={() => setIsAdjustStockOpen(false)} 
        onSuccess={fetchData} 
        inventory={inventory} 
      />
      {viewingInventoryItem && (
        <ViewInventoryModal
          item={viewingInventoryItem}
          onClose={() => setViewingInventoryItem(null)}
        />
      )}
      {editingInventoryItem && (
        <EditInventoryModal
          item={editingInventoryItem}
          onClose={() => setEditingInventoryItem(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
