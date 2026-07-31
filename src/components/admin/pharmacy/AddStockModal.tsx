import React, { useState, useMemo } from "react";
import { X, Package } from "lucide-react";
import { pharmacyService } from "../../../api/pharmacyService";
import type { StockAdditionRequest, MedicalConcept } from "../../../api/pharmacyService";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  preselectedMedicine?: { cielConceptId: string; medicineName: string } | null;
}

const AddStockModal: React.FC<AddStockModalProps> = ({ isOpen, onClose, onSuccess, preselectedMedicine }) => {
  const [formData, setFormData] = useState<StockAdditionRequest>({
    cielConceptId: "",
    batchNumber: "",
    quantity: 0,
    expiryDate: "",
    supplierName: "",
    unitPrice: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Approved Inventory State & CIEL search
  const [approvedMedications, setApprovedMedications] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<MedicalConcept[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      fetchApproved();
      if (preselectedMedicine) {
        setFormData({
          cielConceptId: preselectedMedicine.cielConceptId,
          batchNumber: "",
          quantity: 0,
          expiryDate: "",
          supplierName: "",
          unitPrice: 0,
        });
        setSearchQuery(preselectedMedicine.medicineName);
      } else {
        setFormData({
          cielConceptId: "",
          batchNumber: "",
          quantity: 0,
          expiryDate: "",
          supplierName: "",
          unitPrice: 0,
        });
        setSearchQuery("");
      }
    }
  }, [isOpen, preselectedMedicine]);

  const fetchApproved = async () => {
    try {
      const data = await pharmacyService.getAllInventory();
      setApprovedMedications(data || []);
    } catch (err) {
      console.error("Failed to load approved meds:", err);
    }
  };

  // Debounce search CIEL medications
  React.useEffect(() => {
    if (formData.cielConceptId) {
      setSearchResults([]);
      return;
    }

    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await pharmacyService.searchMedications(searchQuery);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, preselectedMedicine]);

  const handleSelectMedicine = (concept: MedicalConcept) => {
    setFormData({ 
      cielConceptId: concept.cielId,
      batchNumber: "",
      quantity: 0,
      expiryDate: "",
      supplierName: "",
      unitPrice: 0
    });
    setSearchQuery(concept.conceptName);
    setSearchResults([]);
    setShowDropdown(false);
  };

  const matchedLocal = useMemo(() => {
    return approvedMedications.find(m => m.cielConceptId === formData.cielConceptId);
  }, [approvedMedications, formData.cielConceptId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await pharmacyService.addStock(formData);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-semibold text-slate-800">Add New Stock Batch</h2>
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

          <form id="add-stock-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <label className="block text-sm font-medium text-slate-700 mb-1">Search Medicine (CIEL)</label>
              <input
                type="text"
                disabled={!!preselectedMedicine}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all disabled:bg-slate-100 disabled:text-slate-500"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  // If they clear the input, also clear the selected ID
                  if (e.target.value === "") {
                    setFormData({ ...formData, cielConceptId: "" });
                  }
                }}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                placeholder="Type medicine name to search CIEL..."
              />
              {isSearching && (
                <div className="absolute right-3 top-[34px]">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
                </div>
              )}
              {searchQuery.length >= 2 && showDropdown && searchResults.length > 0 && !formData.cielConceptId && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((result) => {
                    const matchedLocal = approvedMedications.find(m => m.cielConceptId === result.cielId);
                    return (
                      <div
                        key={result.id}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectMedicine(result);
                        }}
                        className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-medium text-slate-800">{result.conceptName}</div>
                          <div className="text-xs text-slate-500">CIEL ID: {result.cielId}</div>
                        </div>
                        {matchedLocal ? (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                            Approved ({matchedLocal.totalStock} units)
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                            New Drug
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* Professional CIEL Code Linking Display */}
              {formData.cielConceptId && (
                <div className="mt-3 flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-emerald-800">
                    <span className="font-semibold">Linked CIEL Code:</span>
                    <code className="bg-white px-2 py-0.5 rounded text-emerald-600 font-mono border border-emerald-200">
                      {formData.cielConceptId}
                    </code>
                  </div>
                </div>
              )}

              {/* Keep a hidden required input for form validation */}
              <input
                type="text"
                required
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                value={formData.cielConceptId}
                onChange={() => {}}
                tabIndex={-1}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Batch Number</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.batchNumber}
                  onChange={(e) => setFormData({ ...formData, batchNumber: e.target.value })}
                  placeholder="Enter manual batch no."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.quantity || ""}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price (₹)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  value={formData.unitPrice || ""}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Supplier Name</label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                value={formData.supplierName}
                onChange={(e) => setFormData({ ...formData, supplierName: e.target.value })}
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
            form="add-stock-form"
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? "Adding..." : "Add Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStockModal;
