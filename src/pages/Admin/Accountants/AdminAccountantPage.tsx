import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, Power } from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import { getAllUsers, updateUserStatus } from "../../../api/adminService";
import { tableHeadClass, tableHeadActionsClass, tableRowClass, tableCellClass } from "../../../components/common/DataTable";
import { TableEmptyRow } from "../../../components/common/DataTable";
import TableStatusBadge from "../../../components/common/TableStatusBadge";
import { TableCustomActionButton, TableActionCell, TableViewButton, TableEditButton } from "../../../components/common/TableActions";
import AccountantDetailsModal from "../../../components/admin/accountants/AccountantDetailsModal";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function AdminAccountantPage() {
  const [Accountants, setAccountants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const all = await getAllUsers();
      const staff = all.filter((u: any) =>
        u.roleCode === 'BILLING' || u.role === 'BILLING' ||
        (u.roles || []).some((r: any) => r === 'BILLING' || r?.roleCode === 'BILLING')
      );
      setAccountants(staff);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (staff: any) => {
    setActionLoading(staff.userId);
    try {
      await updateUserStatus(staff.userId, !staff.active);
      setAccountants(prev => prev.map(s => s.userId === staff.userId ? { ...s, active: !staff.active } : s));
    } catch (err) {
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStaff = Accountants.filter(staff =>
    staff.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    staff.username?.toLowerCase().includes(search.toLowerCase())
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const currentStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Manage Accountants</h1>
          <p className="text-slate-500 mt-1">View and manage all front-desk reception staff.</p>
        </div>
        <button 
          onClick={() => navigate('/admin/Accountants/add')}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 transition shadow-sm"
        >
          <UserPlus size={20} /> Add Accountant
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            />
          </div>
          <div className="text-sm text-slate-500 font-medium">
            Total: {filteredStaff.length}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className={tableHeadClass}>ID</th>
                <th className={tableHeadClass}>Name</th>
                <th className={tableHeadClass}>Username</th>
                <th className={tableHeadClass}>Email</th>
                <th className={tableHeadClass}>Phone</th>
                <th className={tableHeadClass}>Status</th>
                <th className={tableHeadActionsClass}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-500">Loading...</td>
                </tr>
              ) : filteredStaff.length === 0 ? (
                <TableEmptyRow colSpan={7} message="No Accountants found." />
              ) : (
                currentStaff.map((staff) => (
                  <tr key={staff.userId} className={tableRowClass}>
                    <td className={`${tableCellClass} font-semibold`}>{staff.userId}</td>
                    <td className={tableCellClass}>{staff.fullName}</td>
                    <td className={tableCellClass}>@{staff.username}</td>
                    <td className={tableCellClass}>{staff.email || "—"}</td>
                    <td className={tableCellClass}>{staff.phone || staff.mobileNumber || "—"}</td>
                    <td className={tableCellClass}>
                      <div className="flex flex-col items-start gap-1">
                        <TableStatusBadge
                          status={staff.active ? "Active" : "Inactive"}
                          variant={staff.active ? "green" : "red"}
                        />
                      </div>
                    </td>
                    <TableActionCell>
                      <TableViewButton onClick={() => setSelectedStaff(staff)} title="View Details" />
                      <TableEditButton onClick={() => navigate(`/admin/Accountants/edit/${staff.userId}`)} title="Edit Details" />
                      <TableCustomActionButton
                        onClick={() => handleToggleStatus(staff)}
                        disabled={actionLoading === staff.userId}
                        title={staff.active ? "Deactivate" : "Activate"}
                        // @ts-ignore
                        icon={Power}
                        variant={staff.active ? "slate" : "emerald"}
                      />
                    </TableActionCell>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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

      {selectedStaff && (
        <AccountantDetailsModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
