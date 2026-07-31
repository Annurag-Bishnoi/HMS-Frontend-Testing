import { useState, useEffect } from "react";
import { Search, Plus, Users, FileText } from "lucide-react";
import Pagination from "../../../components/common/Pagination";
import { useNavigate } from "react-router-dom";
import { getUsersByRole, updateUserStatus, lockUser, resetUserCredentials } from "../../../api/adminService";
import { pharmacyService } from "../../../api/pharmacyService";
import PharmacistTable from "../../../components/admin/pharmacy/PharmacistTable";
import PendingPrescriptionsTable from "../../../components/admin/pharmacy/PendingPrescriptionsTable";
import PharmacistDetailsModal from "../../../components/admin/pharmacy/PharmacistDetailsModal";
import DispenseModal from "../../../components/admin/pharmacy/DispenseModal";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function AdminPharmacyHub() {
  const navigate = useNavigate();
  const [pharmacists, setPharmacists] = useState<any[]>([]);
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const staffData = await getUsersByRole("PHARMACIST");
      setPharmacists(staffData || []);
    } catch (err) {
      console.error("Failed to load pharmacy data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (staff: any) => {
    const id = staff.userId || staff.id;
    setActionLoading(id);
    try {
      await updateUserStatus(id, !staff.active);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleLock = async (staff: any) => {
    const id = staff.userId || staff.id;
    setActionLoading(id);
    try {
      await lockUser(id, !staff.accountLocked);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetCredentials = async (staff: any) => {
    if (!await showConfirm(`Are you sure you want to reset credentials for ${staff.fullName || staff.name}?`)) return;
    setActionLoading(staff.id);
    try {
      const response = await resetUserCredentials(staff.id);
      showToast(`Credentials reset successfully!\n\nUsername: ${response.username}\nNew Password: ${response.temporaryPassword}`, "success");
    } catch (err) {
      showToast("Failed to reset credentials", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStaff = pharmacists.filter(p => 
    p.name?.toLowerCase().includes(searchStaff.toLowerCase()) || 
    p.username?.toLowerCase().includes(searchStaff.toLowerCase())
  );

  const [currentStaffPage, setCurrentStaffPage] = useState(1);
  const itemsPerStaffPage = 5;
  const totalStaffPages = Math.ceil(filteredStaff.length / itemsPerStaffPage);
  const currentStaff = filteredStaff.slice((currentStaffPage - 1) * itemsPerStaffPage, currentStaffPage * itemsPerStaffPage);

  useEffect(() => {
    setCurrentStaffPage(1);
  }, [searchStaff]);

  return (
    <div className="space-y-6 animate-fade-in pb-12">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pharmacy Administration</h1>
          <p className="text-slate-500 mt-1">Manage pharmacist staff accounts and statuses.</p>
        </div>
        <button
          onClick={() => navigate("/admin/pharmacy/add")}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          <Plus size={18} />
          Add Pharmacist
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search pharmacists..."
              value={searchStaff}
              onChange={(e) => setSearchStaff(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <PharmacistTable 
            pharmacists={currentStaff}
            onView={(s) => setSelectedStaff(s)}
            onEdit={(s) => navigate(`/admin/pharmacy/edit/${s.userId || s.id}`)}
            onDelete={handleToggleLock}
            onToggleStatus={handleToggleStatus}
            actionLoading={actionLoading}
          />
          
          {/* Pagination Controls */}
          {totalStaffPages > 1 && (
            <Pagination
              currentPage={currentStaffPage}
              totalPages={totalStaffPages}
              onPrevious={() => setCurrentStaffPage(p => Math.max(1, p - 1))}
              onNext={() => setCurrentStaffPage(p => Math.min(totalStaffPages, p + 1))}
            />
          )}
        </div>
      )}

      {selectedStaff && (
        <PharmacistDetailsModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
