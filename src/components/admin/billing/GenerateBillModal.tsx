import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { billingService } from '../../../api/billingService';
import { showToast, showConfirm } from "../../../utils/ui-alerts";

interface GenerateBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function GenerateBillModal({ isOpen, onClose, onSuccess }: GenerateBillModalProps) {
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [department, setDepartment] = useState('ADMIN');
  const [items, setItems] = useState([{ description: '', quantity: 1, unitPrice: 0 }]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleChangeItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value as never };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0 || !patientId || !patientName) {
      showToast("Please fill all required fields and add at least one item.", "error");
      return;
    }
    setLoading(true);
    try {
      await billingService.generateBill({
        patientId: Number(patientId),
        patientName,
        department,
        generatedBy: "Admin",
        items
      });
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Failed to generate bill.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
          <h2 className="text-xl font-bold text-slate-800">Generate Custom Bill</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          <form id="generate-bill-form" onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient ID</label>
                <input required type="number" value={patientId} onChange={e => setPatientId(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg" placeholder="e.g. 1" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Patient Name</label>
                <input required type="text" value={patientName} onChange={e => setPatientName(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg" placeholder="e.g. John Doe" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select value={department} onChange={e => setDepartment(e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg">
                <option value="ADMIN">Admin / General</option>
                <option value="CONSULTATION">Consultation</option>
                <option value="LABORATORY">Laboratory</option>
                <option value="PHARMACY">Pharmacy</option>
                <option value="IPD">IPD / Bed Charges</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-slate-800">Bill Items</h3>
                <button type="button" onClick={handleAddItem} className="text-sm flex items-center gap-1 text-blue-600 font-medium hover:bg-blue-50 px-2 py-1 rounded">
                  <Plus size={16} /> Add Item
                </button>
              </div>
              
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
                      <input required type="text" value={item.description} onChange={e => handleChangeItem(idx, 'description', e.target.value)} className="w-full p-2 border border-slate-200 rounded-lg" placeholder="Item Name" />
                    </div>
                    <div className="w-24">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Qty</label>
                      <input required type="number" min="1" value={item.quantity} onChange={e => handleChangeItem(idx, 'quantity', Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg" />
                    </div>
                    <div className="w-32">
                      <label className="block text-xs font-medium text-slate-500 mb-1">Unit Price (₹)</label>
                      <input required type="number" min="0" step="0.01" value={item.unitPrice} onChange={e => handleChangeItem(idx, 'unitPrice', Number(e.target.value))} className="w-full p-2 border border-slate-200 rounded-lg" />
                    </div>
                    <button type="button" onClick={() => handleRemoveItem(idx)} className="p-2.5 mb-[1px] bg-red-50 text-red-500 hover:bg-red-100 rounded-lg">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {items.length === 0 && <p className="text-sm text-slate-500 italic">No items added.</p>}
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
          <button type="button" onClick={onClose} className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
          <button type="submit" form="generate-bill-form" disabled={loading} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50">
            {loading ? "Generating..." : "Generate Bill"}
          </button>
        </div>
      </div>
    </div>
  );
}
