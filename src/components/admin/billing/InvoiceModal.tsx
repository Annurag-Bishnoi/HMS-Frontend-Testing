import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Printer, Download, Clock } from 'lucide-react';
import type { Bill } from '../../../api/billingService';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: Bill | null;
  onProcessPayment: (billId: number, paymentDetails: any) => void;
  isProcessing: boolean;
}

export default function InvoiceModal({ isOpen, onClose, bill, onProcessPayment, isProcessing }: InvoiceModalProps) {
  const [taxPct, setTaxPct] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [insurance, setInsurance] = useState<number>(0);

  useEffect(() => {
    if (bill && bill.status === 'PAID') {
      setTaxPct(bill.taxPercentage || 0);
      setDiscount(bill.discountAmount || 0);
      setInsurance(bill.insuranceCoverageAmount || 0);
    } else {
      setTaxPct(0);
      setDiscount(0);
      setInsurance(0);
    }
  }, [bill]);

  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 flex flex-col print:shadow-none print:m-0 print:max-w-none">
        
        {/* Header - Hidden on Print */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 rounded-t-2xl print:hidden">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            Invoice #{bill.id.toString().padStart(6, '0')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <Printer className="w-4 h-4" /> Print
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body - Printable Area */}
        <div className="p-8 print:p-0" id="invoice-printable-area">
          {/* Hospital Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-6">
            <div>
              <h1 className="text-2xl font-black text-indigo-700 tracking-tight">CARE<span className="text-slate-800">PLUS</span> Hospital</h1>
              <p className="text-sm text-slate-500 mt-1">123 Health Avenue, Medical District</p>
              <p className="text-sm text-slate-500">contact@careplus.com | +1 234 567 8900</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-light text-slate-300 uppercase tracking-widest mb-2">Invoice</h2>
              <p className="text-sm font-medium text-slate-800">No. #{bill.id.toString().padStart(6, '0')}</p>
              <p className="text-sm text-slate-500">Date: {new Date(bill.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 print:border-none print:p-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Bill To</p>
              <p className="font-bold text-slate-800 text-lg">{bill.patientName}</p>
              <p className="text-sm text-slate-500">Patient ID: #{bill.patientId}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-center print:border-none print:p-0">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Invoice Details</p>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500">Department:</span>
                <span className="font-medium text-slate-800">{bill.department}</span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500">Status:</span>
                <span className={`font-bold ${bill.status === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {bill.status}
                </span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <table className="min-w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr className="border-y border-slate-200">
                <th className="px-6 py-4 text-left font-semibold text-slate-700">Description</th>
                <th className="px-6 py-4 text-center font-semibold text-slate-700">Qty</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-700">Unit Price</th>
                <th className="px-6 py-4 text-right font-semibold text-slate-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bill.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 text-sm text-slate-800 font-medium">{item.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-center">{item.quantity}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 text-right">₹{item.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm text-slate-800 font-bold text-right">₹{item.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end border-t border-slate-200 pt-6">
            <div className="w-80 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium text-slate-800">₹{bill.totalAmount.toFixed(2)}</span>
              </div>
              
              {bill.status === 'UNPAID' ? (
                <>
                  <div className="flex justify-between text-sm items-center gap-2">
                    <span className="text-slate-500 whitespace-nowrap">Discount (₹)</span>
                    <input 
                      type="number" 
                      min="0"
                      value={discount} 
                      onChange={e => setDiscount(Number(e.target.value))}
                      className="w-24 text-right p-1 border rounded" 
                    />
                  </div>
                  <div className="flex justify-between text-sm items-center gap-2">
                    <span className="text-slate-500 whitespace-nowrap">Tax (%)</span>
                    <input 
                      type="number" 
                      min="0"
                      value={taxPct} 
                      onChange={e => setTaxPct(Number(e.target.value))}
                      className="w-24 text-right p-1 border rounded" 
                    />
                  </div>
                  <div className="flex justify-between text-sm items-center gap-2">
                    <span className="text-slate-500 whitespace-nowrap">Insurance Coverage (₹)</span>
                    <input 
                      type="number" 
                      min="0"
                      value={insurance} 
                      onChange={e => setInsurance(Number(e.target.value))}
                      className="w-24 text-right p-1 border rounded" 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Discount</span>
                    <span className="font-medium text-emerald-600">-₹{(bill.discountAmount || 0).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Tax ({(bill.taxPercentage || 0)}%)</span>
                    <span className="font-medium text-slate-800">
                      ₹{(((bill.totalAmount - (bill.discountAmount || 0)) * (bill.taxPercentage || 0)) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Insurance Coverage</span>
                    <span className="font-medium text-emerald-600">-₹{(bill.insuranceCoverageAmount || 0).toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-800 text-lg">Patient Payable</span>
                <span className="font-black text-indigo-600 text-xl">
                  ₹{bill.status === 'PAID' 
                      ? (bill.patientPayableAmount || 0).toFixed(2)
                      : Math.max(0, (bill.totalAmount - discount + Math.max(0, bill.totalAmount - discount) * (taxPct / 100)) - insurance).toFixed(2)
                  }
                </span>
              </div>
            </div>
          </div>
          
          {/* Print Footer */}
          <div className="mt-16 text-center text-xs text-slate-400 hidden print:block">
            <p>Thank you for choosing CarePlus Hospital.</p>
            <p>This is a computer generated invoice and does not require a physical signature.</p>
          </div>
        </div>

        {/* Footer Actions - Hidden on Print */}
        {bill.status === 'UNPAID' && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between items-center print:hidden">
            <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
              <Clock className="w-4 h-4" /> Payment Pending
            </div>
            <button
              onClick={() => onProcessPayment(bill.id, { taxPercentage: taxPct, discountAmount: discount, insuranceCoverageAmount: insurance })}
              disabled={isProcessing}
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isProcessing ? "Processing..." : (
                <>
                  <CheckCircle className="w-5 h-5" /> Mark as Paid
                </>
              )}
            </button>
          </div>
        )}
      </div>
      
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-printable-area, #invoice-printable-area * {
            visibility: visible;
          }
          #invoice-printable-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
