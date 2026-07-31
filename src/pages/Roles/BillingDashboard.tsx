import React, { useState, useEffect } from 'react';
import { DollarSign, FileText, CheckCircle, Clock, AlertCircle, Receipt } from 'lucide-react';
import { billingService } from '../../api/billingService';
import type { Bill } from '../../api/billingService';
import InvoiceModal from '../../components/admin/billing/InvoiceModal';
import Pagination from '../../components/common/Pagination';
import DataTable, { tableHeadClass, tableRowClass, tableCellClass, TableEmptyRow } from '../../components/common/DataTable';

export default function BillingDashboard() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending');
  const [pendingPage, setPendingPage] = useState(1);
  const [completedPage, setCompletedPage] = useState(1);
  const itemsPerPage = 5;

  const fetchBills = async () => {
    try {
      const data = await billingService.getAllBills();
      setBills(data);
    } catch (err) {
      console.error("Failed to fetch bills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleProcessPayment = async (billId: number, paymentDetails: any) => {
    setIsProcessing(true);
    try {
      const updatedBill = await billingService.processPayment(billId, { processedBy: "Accountant", ...paymentDetails });
      setBills(bills.map(b => b.id === billId ? updatedBill : b));
      setSelectedBill(updatedBill);
    } catch (err) {
      console.error("Failed to process payment", err);
      alert("Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const pendingBills = bills.filter(b => b.status === 'UNPAID');
  const paidBills = bills.filter(b => b.status === 'PAID');
  
  const totalOutstanding = pendingBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalReceived = paidBills.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  const totalPendingPages = Math.ceil(pendingBills.length / itemsPerPage);
  const currentPendingBills = pendingBills.slice((pendingPage - 1) * itemsPerPage, pendingPage * itemsPerPage);

  const totalCompletedPages = Math.ceil(paidBills.length / itemsPerPage);
  const currentCompletedBills = paidBills.slice((completedPage - 1) * itemsPerPage, completedPage * itemsPerPage);

  useEffect(() => {
    setPendingPage(1);
    setCompletedPage(1);
  }, [bills]);

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-slate-50/50 min-h-screen">
      {/* Header Profile */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Accountant</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800">Billing Operations</h1>
          <p className="text-slate-500 mt-1">Manage hospital finances, clear pending invoices, and process patient payments.</p>
        </div>
        <div className="hidden md:flex gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 min-w-[140px]">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Today's Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">₹{totalReceived.toFixed(2)}</p>
          </div>
        </div>
      </div>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-blue-50 text-blue-600"><FileText size={24}/></div>
          <div><p className="text-sm text-slate-500 font-medium">Total Invoices</p><h3 className="text-2xl font-bold text-slate-800">{bills.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-amber-50 text-amber-600"><AlertCircle size={24}/></div>
          <div><p className="text-sm text-slate-500 font-medium">Pending Approvals</p><h3 className="text-2xl font-bold text-slate-800">{pendingBills.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-orange-50 text-orange-600"><Clock size={24}/></div>
          <div><p className="text-sm text-slate-500 font-medium">Total Outstanding</p><h3 className="text-2xl font-bold text-slate-800">₹{totalOutstanding.toFixed(2)}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-600"><CheckCircle size={24}/></div>
          <div><p className="text-sm text-slate-500 font-medium">Cleared Today</p><h3 className="text-2xl font-bold text-slate-800">{paidBills.length}</h3></div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex border-b border-slate-200 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 -mb-[1px] ${
              activeTab === 'pending'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            <Clock className="w-4 h-4" />
            Pending Invoices ({pendingBills.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm transition-all border-b-2 -mb-[1px] ${
              activeTab === 'completed'
                ? 'border-blue-600 text-blue-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
            }`}
          >
            <Receipt className="w-4 h-4" />
            Recent Transactions ({paidBills.length})
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'pending' ? (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <DataTable>
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className={tableHeadClass}>Invoice ID</th>
                      <th className={tableHeadClass}>Patient Details</th>
                      <th className={tableHeadClass}>Department</th>
                      <th className={`${tableHeadClass} text-right`}>Amount</th>
                      <th className={`${tableHeadClass} text-center`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={5} className="p-8 text-center text-slate-400">Loading bills...</td></tr>
                    ) : pendingBills.length === 0 ? (
                      <TableEmptyRow colSpan={5} message="All caught up! No pending invoices." />
                    ) : (
                      currentPendingBills.map(bill => (
                        <tr key={bill.id} className={tableRowClass}>
                          <td className={tableCellClass}>
                            <span className="font-semibold text-slate-800">#{bill.id.toString().padStart(6, '0')}</span>
                            <div className="text-xs text-slate-400 mt-1">{new Date(bill.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className={tableCellClass}>
                            <div className="font-semibold text-slate-800">{bill.patientName}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">PAT-{String(bill.patientId).padStart(4, '0')}</div>
                          </td>
                          <td className={tableCellClass}>
                            <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs">
                              {bill.department}
                            </span>
                          </td>
                          <td className={`${tableCellClass} text-right font-bold text-amber-600`}>
                            ₹{bill.totalAmount.toFixed(2)}
                          </td>
                          <td className={`${tableCellClass} text-center`}>
                            <button
                              onClick={() => setSelectedBill(bill)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex justify-center items-center"
                              title="Process Invoice"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </DataTable>
              </div>

              {totalPendingPages > 1 && (
                <Pagination
                  currentPage={pendingPage}
                  totalPages={totalPendingPages}
                  onPrevious={() => setPendingPage(p => Math.max(1, p - 1))}
                  onNext={() => setPendingPage(p => Math.min(totalPendingPages, p + 1))}
                />
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <DataTable>
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className={tableHeadClass}>Invoice ID</th>
                      <th className={tableHeadClass}>Patient Details</th>
                      <th className={tableHeadClass}>Department</th>
                      <th className={tableHeadClass}>Status</th>
                      <th className={`${tableHeadClass} text-right`}>Amount</th>
                      <th className={`${tableHeadClass} text-center`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={6} className="p-8 text-center text-slate-400">Loading transactions...</td></tr>
                    ) : paidBills.length === 0 ? (
                      <TableEmptyRow colSpan={6} message="No recent transactions today." />
                    ) : (
                      currentCompletedBills.map(bill => (
                        <tr key={bill.id} className={tableRowClass}>
                          <td className={tableCellClass}>
                            <span className="font-semibold text-slate-800">#{bill.id.toString().padStart(6, '0')}</span>
                            <div className="text-xs text-slate-400 mt-1">{new Date(bill.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className={tableCellClass}>
                            <div className="font-semibold text-slate-800">{bill.patientName}</div>
                            <div className="text-xs text-slate-500 font-medium mt-0.5">PAT-{String(bill.patientId).padStart(4, '0')}</div>
                          </td>
                          <td className={tableCellClass}>
                            <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs">
                              {bill.department}
                            </span>
                          </td>
                          <td className={tableCellClass}>
                            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 text-emerald-700">
                              PAID
                            </span>
                          </td>
                          <td className={`${tableCellClass} text-right font-bold text-emerald-600`}>
                            ₹{bill.totalAmount.toFixed(2)}
                          </td>
                          <td className={`${tableCellClass} text-center`}>
                            <button
                              onClick={() => setSelectedBill(bill)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors inline-flex justify-center items-center"
                              title="View Invoice"
                            >
                              <FileText className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </DataTable>
              </div>

              {totalCompletedPages > 1 && (
                <Pagination
                  currentPage={completedPage}
                  totalPages={totalCompletedPages}
                  onPrevious={() => setCompletedPage(p => Math.max(1, p - 1))}
                  onNext={() => setCompletedPage(p => Math.min(totalCompletedPages, p + 1))}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <InvoiceModal 
        isOpen={!!selectedBill} 
        onClose={() => setSelectedBill(null)} 
        bill={selectedBill}
        onProcessPayment={handleProcessPayment}
        isProcessing={isProcessing}
      />
    </div>
  );
}
