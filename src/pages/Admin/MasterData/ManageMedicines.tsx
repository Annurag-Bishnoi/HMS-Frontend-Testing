import { useState, useEffect } from "react";
import { Search, Plus, Power, AlertCircle, Edit2, Database, Info, X, CheckCircle, Package, Eye } from "lucide-react";
import { searchCiel } from "../../../api/visitService";
import { pharmacyService } from "../../../api/pharmacyService";
import { tableHeadClass, tableRowClass, tableCellClass } from "../../../components/common/DataTable";
import { TableEmptyRow } from "../../../components/common/DataTable";
import Pagination from "../../../components/common/Pagination";
import TableStatusBadge from "../../../components/common/TableStatusBadge";
import { TableCustomActionButton } from "../../../components/common/TableActions";
import AddStockModal from "../../../components/admin/pharmacy/AddStockModal";
import ViewInventoryModal from "../../../components/admin/pharmacy/ViewInventoryModal";
import React, { useMemo } from "react";

export default function ManageMedicines() {
  const [search, setSearch] = useState("");
  const [medicines, setMedicines] = useState<any[]>([]);
  const [cielResults, setCielResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [actionLoading, setActionLoading] = useState<any>(null);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [viewingInventoryItem, setViewingInventoryItem] = useState<any | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [editingMedicine, setEditingMedicine] = useState<any | null>(null);
  const [reorderLevelInput, setReorderLevelInput] = useState<string>("");
  const [pendingApprovalMedicine, setPendingApprovalMedicine] = useState<any | null>(null);
  const [refillMedicine, setRefillMedicine] = useState<any | null>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), 4000);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await pharmacyService.getAllInventory();
      setMedicines(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch medicines", err);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query: string) => {
    if (!query) {
      setCielResults([]);
      setHasSearched(false);
      return;
    }
    if (query.length < 2) return;
    try {
      setLoading(true);
      setHasSearched(true);
      const data = await searchCiel(query, "medication");
      setCielResults(data || []);
    } catch (err) {
      console.error("Failed to fetch CIEL medicines:", err);
      setCielResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    if (!e.target.value) {
      setHasSearched(false);
      setCielResults([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch(search);
    }
  };

  const handleApproveMedicine = async (med: any) => {
    try {
      setActionLoading(med.cielConceptId);
      await pharmacyService.addStock({
        cielConceptId: med.cielConceptId,
        batchNumber: "INITIAL_APPROVAL",
        quantity: 0,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        supplierName: "System Approval",
        unitPrice: 0
      });
      const updatedInventory = await pharmacyService.getAllInventory();
      setMedicines(Array.isArray(updatedInventory) ? updatedInventory : []);
      showSuccess(`Successfully approved and added "${med.medicineName}" to directory!`);
    } catch (err) {
      console.error(err);
      showError("Failed to approve medicine");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (med: any) => {
    try {
      setActionLoading(med.inventoryItemId);
      await pharmacyService.toggleInventoryStatus(med.inventoryItemId, !med.active);
      setMedicines(prev => prev.map(m => m.inventoryItemId === med.inventoryItemId ? { ...m, active: !med.active } : m));
      showSuccess(`Successfully ${!med.active ? 'reactivated' : 'suspended'} "${med.medicineName}".`);
    } catch (err) {
      showError("Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditClick = (med: any) => {
    setEditingMedicine(med);
    setReorderLevelInput(med.reorderLevel?.toString() || "0");
  };

  const handleSaveReorderLevel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedicine) return;
    const parsedLevel = parseInt(reorderLevelInput);
    if (isNaN(parsedLevel) || parsedLevel < 0) {
      showError("Invalid reorder level number.");
      return;
    }

    try {
      setActionLoading(editingMedicine.inventoryItemId);
      await pharmacyService.updateInventoryItem(editingMedicine.inventoryItemId, {
        medicineName: editingMedicine.medicineName,
        reorderLevel: parsedLevel
      });
      setMedicines(prev => prev.map(m => m.inventoryItemId === editingMedicine.inventoryItemId ? { ...m, reorderLevel: parsedLevel } : m));
      showSuccess(`Updated reorder level to ${parsedLevel} for ${editingMedicine.medicineName}.`);
      setEditingMedicine(null);
    } catch (err) {
      showError("Failed to update reorder level");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefillClick = (med: any) => {
    setRefillMedicine({ cielConceptId: med.cielConceptId, medicineName: med.medicineName });
    setIsAddStockOpen(true);
  };

  const displayedMedicines = useMemo(() => {
    if (!hasSearched) {
      return medicines;
    }
    return cielResults.map(cielMed => {
      const matched = medicines.find(m => 
        m.cielConceptId === cielMed.cielId || 
        m.medicineName?.toLowerCase() === cielMed.conceptName?.toLowerCase()
      );
      if (matched) {
        return matched;
      }
      return {
        inventoryItemId: null,
        cielConceptId: cielMed.cielId,
        medicineName: cielMed.conceptName,
        totalStock: 0,
        reorderLevel: 0,
        active: false,
        isVirtual: true
      };
    });
  }, [medicines, cielResults, hasSearched]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(displayedMedicines.length / itemsPerPage);
  const currentMedicines = displayedMedicines.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, hasSearched]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Medicine Directory (CIEL)</h1>
          <p className="text-slate-500 mt-1">Master list of approved medications. Search the CIEL dictionary to approve new drugs.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddStockOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm shadow-emerald-200"
          >
            <Plus className="w-4 h-4" />
            Add Stock Batch
          </button>
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2">
            <Database size={16} /> CIEL Integration Active
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
        <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-amber-800">Pharmacy Integration Enabled</h4>
          <p className="text-sm text-amber-700 mt-1 leading-relaxed">
            This directory reflects the live, real-time inventory from the Central Pharmacy. As an administrator, you can configure system-wide reorder thresholds or suspend medications from being prescribed by doctors.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50">
          <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Search CIEL Dictionary</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search by medicine name (e.g. 'paracetamol', 'aspirin')... Press Enter to search"
                value={search}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-sm text-slate-700"
              />
            </div>
            <button 
              onClick={() => performSearch(search)}
              disabled={loading || search.length < 2}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>CIEL Code</th>
                <th className={tableHeadClass}>Medicine Name</th>
                <th className={tableHeadClass}>Current Stock</th>
                <th className={tableHeadClass}>Reorder Level</th>
                <th className={tableHeadClass}>Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                     <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-slate-500 font-medium">Loading live inventory...</p>
                      </div>
                  </td>
                </tr>
              ) : displayedMedicines.length === 0 ? (
                <TableEmptyRow colSpan={6} message="No medicines found in the system." />
              ) : currentMedicines.map((med) => (
                <tr key={med.inventoryItemId || med.cielConceptId} className={tableRowClass}>
                  <td className={`${tableCellClass} font-mono font-semibold`}>{med.cielConceptId}</td>
                  <td className={`${tableCellClass} font-bold text-slate-700`}>{med.medicineName}</td>
                  <td className={tableCellClass}>
                    <span className={`px-2 py-1 rounded-md font-bold text-sm ${med.totalStock <= med.reorderLevel ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                      {med.totalStock} units
                    </span>
                  </td>
                  <td className={tableCellClass}>{med.reorderLevel || '—'}</td>
                  <td className={tableCellClass}>
                    <TableStatusBadge
                      status={med.isVirtual ? "Not Approved" : (med.active !== false ? "Active" : "Inactive")}
                      variant={med.isVirtual ? "red" : (med.active !== false ? "green" : "red")}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {med.isVirtual ? (
                        <TableCustomActionButton 
                          onClick={() => setPendingApprovalMedicine(med)}
                          disabled={actionLoading === med.cielConceptId}
                          title="Approve & Initialize Drug"
                          icon={Plus}
                          variant="emerald"
                        />
                      ) : (
                        <>
                          <TableCustomActionButton 
                            onClick={() => setViewingInventoryItem(med)}
                            disabled={actionLoading === med.inventoryItemId}
                            title="View Batch Details"
                            icon={Eye}
                            variant="slate"
                          />
                          <TableCustomActionButton 
                            onClick={() => handleRefillClick(med)}
                            disabled={actionLoading === med.inventoryItemId}
                            title="Refill Stock Batch"
                            icon={Package}
                            variant="emerald"
                          />
                          <TableCustomActionButton 
                            onClick={() => handleEditClick(med)}
                            disabled={actionLoading === med.inventoryItemId}
                            title="Edit Reorder Level"
                            icon={Edit2}
                            variant="slate"
                          />
                          <TableCustomActionButton 
                            onClick={() => handleToggleStatus(med)}
                            disabled={actionLoading === med.inventoryItemId}
                            title={med.active !== false ? "Suspend Drug" : "Re-activate Drug"}
                            icon={Power}
                            variant={med.active !== false ? "slate" : "emerald"}
                          />
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
          onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        />
      )}

      <AddStockModal 
        isOpen={isAddStockOpen} 
        onClose={() => {
          setIsAddStockOpen(false);
          setRefillMedicine(null);
        }} 
        onSuccess={() => {
          fetchMedicines();
          showSuccess("Successfully added stock batch to inventory!");
        }} 
        preselectedMedicine={refillMedicine}
      />

      {/* Confirmation Modal for Master Approval */}
      {pendingApprovalMedicine && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Approve Medicine</h3>
                <p className="text-slate-500 text-xs mt-0.5">Add to Hospital Directory</p>
              </div>
            </div>
            
            <div className="p-6 text-slate-600 text-sm leading-relaxed">
              You are about to approve <strong>{pendingApprovalMedicine.medicineName}</strong> (CIEL: {pendingApprovalMedicine.cielConceptId}) for use across the hospital.
              <br /><br />
              Doctors will be able to prescribe this medication immediately, and pharmacists will be able to manage its inventory.
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingApprovalMedicine(null)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  handleApproveMedicine(pendingApprovalMedicine);
                  setPendingApprovalMedicine(null);
                }}
                className="px-4 py-2 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reorder Level Modal */}
      {editingMedicine && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <Edit2 className="text-blue-600" size={20} />
                Edit Reorder Threshold
              </h3>
              <button onClick={() => setEditingMedicine(null)} className="p-1 hover:bg-slate-200 rounded-full">
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSaveReorderLevel}>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Medication Name</p>
                  <p className="font-bold text-slate-800">{editingMedicine.medicineName}</p>
                  <p className="text-xs text-slate-500 mt-1">CIEL Code: {editingMedicine.cielConceptId}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Reorder Level Threshold (units)
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={reorderLevelInput}
                    onChange={(e) => setReorderLevelInput(e.target.value)}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition"
                    placeholder="Enter stock threshold for alerts..."
                  />
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    When the live pharmacy inventory stock dips below this number, the item is flagged as low-stock.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMedicine(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === editingMedicine.inventoryItemId}
                  className="px-4 py-2 text-sm font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Batches Details Modal */}
      {viewingInventoryItem && (
        <ViewInventoryModal 
          item={viewingInventoryItem} 
          onClose={() => setViewingInventoryItem(null)} 
        />
      )}

      {/* Floating Notifications */}
      {successMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-xl border border-emerald-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-rose-600 text-white px-6 py-4 rounded-2xl shadow-xl border border-rose-500 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="font-semibold text-sm">{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
