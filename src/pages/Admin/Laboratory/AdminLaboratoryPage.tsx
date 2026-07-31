import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import LabHeader from "../../../components/admin/laboratory/LabHeader";
import LabStats from "../../../components/admin/laboratory/LabStats";
import LabToolbar from "../../../components/admin/laboratory/LabToolbar";
import LabTable from "../../../components/admin/laboratory/LabTable";
import LabTestsTable from "../../../components/admin/laboratory/LabTestsTable";
import Pagination from "../../../components/common/Pagination";
import LabStaffDetailsModal from "../../../components/admin/laboratory/LabStaffDetailsModal";
import { FlaskConical, Users } from "lucide-react";
import { getAllLabTests } from "../../../api/labService";

import { getAllUsers, updateUserStatus, lockUser, resetUserCredentials } from "../../../api/adminService";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function AdminLaboratoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"staff" | "tests">("staff");
  const [labStaff, setLabStaff] = useState<any[]>([]);
  const [labTests, setLabTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      if (activeTab === "staff") {
        const all = await getAllUsers();
        const staff = all.filter((u: any) =>
          u.roleCode === 'LABORATORY' || u.role === 'LABORATORY' ||
          (u.roles || []).some((r: any) => r === 'LABORATORY' || r?.roleCode === 'LABORATORY')
        );
        setLabStaff(staff);
      } else {
        const tests = await getAllLabTests();
        setLabTests(tests);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load laboratory data");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (staff: any) => {
    navigate(`/admin/laboratory/edit/${staff.userId}`);
  };

  const handleDelete = async (staff: any) => {
    if (!await showConfirm(`Are you sure you want to deactivate ${staff.fullName}?`)) return;
    try {
      setActionLoading(staff.userId);
      await updateUserStatus(staff.userId, false);
      fetchData();
    } catch (err) {
      showToast("Failed to deactivate staff", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (staff: any) => {
    setActionLoading(staff.userId);
    try {
      await updateUserStatus(staff.userId, !staff.active);
      setLabStaff((prev) =>
        prev.map((s) => (s.userId === staff.userId ? { ...s, active: !staff.active } : s))
      );
    } catch (err) {
      showToast("Failed to update status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleLock = async (staff: any) => {
    setActionLoading(staff.userId);
    try {
      await lockUser(staff.userId, !staff.accountLocked);
      setLabStaff((prev) =>
        prev.map((s) => (s.userId === staff.userId ? { ...s, accountLocked: !staff.accountLocked } : s))
      );
    } catch (err) {
      showToast("Failed to update lock status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetCredentials = async (staff: any) => {
    if (!await showConfirm(`Are you sure you want to reset credentials for ${staff.fullName}?`)) return;
    setActionLoading(staff.userId);
    try {
      const response = await resetUserCredentials(staff.userId);
      showToast(`Credentials reset successfully!\n\nUsername: ${response.username}\nNew Password: ${response.temporaryPassword}`, "success");
    } catch (err) {
      showToast("Failed to reset credentials", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStaff = labStaff.filter((staff) => {
    const matchesSearch =
      staff.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      staff.username?.toLowerCase().includes(search.toLowerCase()) ||
      staff.email?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "All" ||
      (status === "Active" && staff.active) ||
      (status === "Inactive" && !staff.active);

    return matchesSearch && matchesStatus;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const currentStaff = filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status]);

  if (loading) {
    return <div className="p-6">Loading laboratory staff...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in p-6 bg-slate-50/50 min-h-screen">
      <LabHeader onAddStaff={() => navigate("/admin/laboratory/add")} />

      <LabStats labStaff={labStaff} />

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-200/50 p-1 rounded-xl w-fit my-6">
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "staff"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <Users size={18} />
          Laboratory Staff
        </button>
        <button
          onClick={() => setActiveTab("tests")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === "tests"
              ? "bg-white text-indigo-700 shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
          }`}
        >
          <FlaskConical size={18} />
          Assigned Lab Tests
        </button>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === "staff" ? (
          <>
            <LabToolbar
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
            />
            <LabTable 
              labStaff={currentStaff} 
              onView={setSelectedStaff}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              onResetCredentials={handleResetCredentials}
              actionLoading={actionLoading}
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPrevious={() => setCurrentPage(p => Math.max(1, p - 1))}
                onNext={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              />
            )}
          </>
        ) : (
          <LabTestsTable labTests={labTests} />
        )}
      </div>

      {selectedStaff && (
        <LabStaffDetailsModal
          staff={selectedStaff}
          onClose={() => setSelectedStaff(null)}
          onUpdate={fetchData}
        />
      )}
    </div>
  );
}
