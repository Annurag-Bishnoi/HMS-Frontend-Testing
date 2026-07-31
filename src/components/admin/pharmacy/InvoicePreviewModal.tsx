import React, { useState, useEffect } from "react";
import { X, FileText, CheckCircle, Clock } from "lucide-react";
import { billingService } from "../../../api/billingService";
import type { Bill } from "../../../api/billingService";

interface InvoicePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: number;
}

export default function InvoicePreviewModal({ isOpen, onClose, patientId }: InvoicePreviewModalProps) {
  const [bill, setBill] = useState<Bill | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && patientId) {
      const fetchBill = async () => {
        try {
          setLoading(true);
          const bills = await billingService.getPatientBills(patientId);
          // Find the latest pharmacy bill
          const pharmacyBill = bills.find(b => b.department === "PHARMACY");
          setBill(pharmacyBill || null);
        } catch (err) {
          console.error("Failed to fetch bill", err);
        } finally {
          setLoading(false);
        }
      };
      fetchBill();
    }
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Pharmacy Invoice</h2>
              <p className="text-sm text-slate-500">Patient Billing Details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-slate-500 font-medium">Fetching invoice details...</p>
            </div>
          ) : !bill ? (
            <div className="text-center py-12 text-slate-500">
              <FileText size={48} className="mx-auto text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-700">No Invoice Found</h3>
              <p className="mt-1 text-sm">Could not find a pharmacy bill for this patient.</p>
            </div>
          ) : (
            <div className="space-y-6">
              
              {/* Status Banner */}
              <div className={`p-4 rounded-xl flex items-center gap-3 ${
                bill.status === 'PAID' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {bill.status === 'PAID' ? <CheckCircle size={20} /> : <Clock size={20} />}
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wider">Status: {bill.status}</h4>
                  {bill.status === 'PAID' && <p className="text-xs mt-0.5 opacity-90">Paid on {new Date(bill.paidAt!).toLocaleString()}</p>}
                </div>
              </div>

              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Patient Details</p>
                  <p className="font-semibold text-slate-800">{bill.patientName}</p>
                  <p className="text-sm text-slate-600">ID: #{bill.patientId}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-bold uppercase mb-1">Invoice Details</p>
                  <p className="font-semibold text-slate-800">INV-{String(bill.id).padStart(5, '0')}</p>
                  <p className="text-sm text-slate-600">{new Date(bill.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3 text-center">Qty</th>
                      <th className="px-4 py-3 text-right">Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bill.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-3 font-medium text-slate-800">{item.description}</td>
                        <td className="px-4 py-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="px-4 py-3 text-right text-slate-600">₹{Number(item.unitPrice || 0).toFixed(2)}</td>
                        <td className="px-4 py-3 text-right font-semibold text-slate-800">₹{Number(item.totalPrice || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="px-4 py-3 text-right font-bold text-slate-700">Subtotal:</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-800">₹{Number(bill.totalAmount || 0).toFixed(2)}</td>
                    </tr>
                    {bill.taxPercentage !== undefined && bill.taxPercentage > 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-medium text-slate-600">Tax ({bill.taxPercentage}%):</td>
                        <td className="px-4 py-2 text-right font-medium text-slate-600">+ ₹{((Number(bill.totalAmount || 0) * bill.taxPercentage) / 100).toFixed(2)}</td>
                      </tr>
                    )}
                    {bill.discountAmount !== undefined && bill.discountAmount > 0 && (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-right font-medium text-slate-600">Discount:</td>
                        <td className="px-4 py-2 text-right font-medium text-emerald-600">- ₹{Number(bill.discountAmount || 0).toFixed(2)}</td>
                      </tr>
                    )}
                    {bill.status === 'PAID' && (
                      <tr>
                        <td colSpan={3} className="px-4 py-4 text-right font-black text-slate-800 text-lg uppercase">Amount Paid:</td>
                        <td className="px-4 py-4 text-right font-black text-blue-600 text-lg">₹{Number(bill.patientPayableAmount || bill.totalAmount || 0).toFixed(2)}</td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
