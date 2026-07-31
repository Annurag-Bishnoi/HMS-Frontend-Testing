import React, { useState, useEffect } from 'react';
import { Search, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { billingService } from '../../api/billingService';
import type { Bill } from '../../api/billingService';
import InvoiceModal from '../../components/admin/billing/InvoiceModal';
import Pagination from '../../components/common/Pagination';
import DataTable, { tableHeadClass, tableRowClass, tableCellClass, TableEmptyRow } from '../../components/common/DataTable';

export default function InvoicesPage() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchBills = async () => {
    try {
      setLoading(true);
      const data = await billingService.getAllBills();
      // Sort by newest first
      data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setBills(data);
      setFilteredBills(data);
    } catch (err) {
      console.error("Failed to fetch bills", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  useEffect(() => {
    let result = bills;
    if (statusFilter !== 'ALL') {
      result = result.filter(b => b.status === statusFilter);
    }
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(b => 
        b.patientName.toLowerCase().includes(lower) || 
        b.id.toString().includes(lower) ||
        b.department.toLowerCase().includes(lower)
      );
    }
    setFilteredBills(result);
  }, [searchTerm, statusFilter, bills]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredBills.length / itemsPerPage);
  const currentBills = filteredBills.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const handleProcessPayment = async (billId: number, paymentDetails: any) => {
    setIsProcessing(true);
    try {
      const updatedBill = await billingService.processPayment(billId, { processedBy: "Accountant", ...paymentDetails });
      const newBills = bills.map(b => b.id === billId ? updatedBill : b);
      setBills(newBills);
      setSelectedBill(updatedBill);
    } catch (err) {
      console.error("Failed to process payment", err);
      alert("Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">All Invoices</h1>
          <p className="text-slate-500 mt-1">View and manage all patient invoices across departments.</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Patient Name, Invoice ID, or Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
        >
          <option value="ALL">All Status</option>
          <option value="PAID">Paid</option>
          <option value="UNPAID">Unpaid</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable>
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>Invoice ID</th>
                <th className={tableHeadClass}>Date</th>
                <th className={tableHeadClass}>Patient</th>
                <th className={tableHeadClass}>Department</th>
                <th className={tableHeadClass}>Status</th>
                <th className={`${tableHeadClass} text-right`}>Amount</th>
                <th className={`${tableHeadClass} text-center`}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-400">Loading invoices...</td></tr>
              ) : filteredBills.length === 0 ? (
                <TableEmptyRow colSpan={7} message="No invoices found." />
              ) : (
                currentBills.map(bill => (
                  <tr key={bill.id} className={tableRowClass}>
                    <td className={tableCellClass}>
                      <span className="font-semibold text-slate-800">#{bill.id.toString().padStart(6, '0')}</span>
                    </td>
                    <td className={tableCellClass}>
                      <span className="text-slate-600">{new Date(bill.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className={tableCellClass}>
                      <div className="font-medium text-slate-800">{bill.patientName}</div>
                      <div className="text-xs text-slate-500">PAT-{String(bill.patientId).padStart(4, '0')}</div>
                    </td>
                    <td className={tableCellClass}>
                      <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-xs">
                        {bill.department}
                      </span>
                    </td>
                    <td className={tableCellClass}>
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        bill.status === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                        bill.status === 'UNPAID' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {bill.status}
                      </span>
                    </td>
                    <td className={`${tableCellClass} text-right font-bold ${bill.status === 'PAID' ? 'text-emerald-600' : 'text-slate-800'}`}>
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
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
            onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          />
        )}
      </div>

      <InvoiceModal 
        isOpen={!!selectedBill} 
        onClose={() => {
          setSelectedBill(null);
          fetchBills(); // Refresh in case payment was made
        }} 
        bill={selectedBill}
        onProcessPayment={handleProcessPayment}
        isProcessing={isProcessing}
      />
    </div>
  );
}
