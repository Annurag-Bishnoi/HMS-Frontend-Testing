import { useState, useEffect } from "react";
import { Plus, Users, Stethoscope, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getUsersByRole, updateUserStatus, lockUser, resetUserCredentials } from "../../../api/adminService";
import { pharmacyService } from "../../../api/pharmacyService";
import PharmacistTable from "../../../components/admin/pharmacy/PharmacistTable";
import PendingPrescriptionsTable from "../../../components/admin/pharmacy/PendingPrescriptionsTable";
import PharmacistDetailsModal from "../../../components/admin/pharmacy/PharmacistDetailsModal";
import DispenseModal from "../../../components/admin/pharmacy/DispenseModal";
import Topbar from "../../../components/dashboard/Topbar";

export default function AdminPharmacyHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"staff" | "prescriptions">("staff");
  
  // Staff State
  const [pharmacists, setPharmacists] = useState<any[]>([]);
  const [searchStaff, setSearchStaff] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Prescription State
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [searchRx, setSearchRx] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [staffData, dispensedData] = await Promise.all([
        getUsersByRole("PHARMACIST"),
        pharmacyService.getDispensedPrescriptions().catch(() => [])
      ]);
      setPharmacists(staffData || []);
      setPrescriptions(dispensedData || []);
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
    if (!window.confirm(`Are you sure you want to reset credentials for ${staff.fullName || staff.name}?`)) return;
    setActionLoading(staff.id);
    try {
      const response = await resetUserCredentials(staff.id);
      alert(`Credentials reset successfully!\n\nUsername: ${response.username}\nNew Password: ${response.temporaryPassword}`);
    } catch (err) {
      alert("Failed to reset credentials");
    } finally {
      setActionLoading(null);
    }
  };

  const filteredStaff = pharmacists.filter(p => 
    p.name?.toLowerCase().includes(searchStaff.toLowerCase()) || 
    p.username?.toLowerCase().includes(searchStaff.toLowerCase())
  );

  const filteredRx = prescriptions.filter(p => {
    const pName = (p.patient?.name || p.patientName || "").toLowerCase();
    const dName = (p.doctor?.name || p.doctorName || "").toLowerCase();
    const search = searchRx.toLowerCase();
    return pName.includes(search) || dName.includes(search);
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <Topbar />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pharmacy Administration</h1>
          <p className="text-slate-500 mt-1">Manage pharmacist staff and oversee prescriptions.</p>
        </div>
        {activeTab === "staff" && (
          <button
            onClick={() => navigate("/admin/pharmacy/add")}
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            <Plus size={18} />
            Add Pharmacist
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-slate-200">
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors relative ${
            activeTab === "staff" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <Users size={18} />
          Pharmacist List
          {activeTab === "staff" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("prescriptions")}
          className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors relative ${
            activeTab === "prescriptions" ? "text-blue-600" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FileText size={18} />
          Prescriptions
          <span className="ml-1 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">{prescriptions.length}</span>
          {activeTab === "prescriptions" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : activeTab === "staff" ? (
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
            pharmacists={filteredStaff}
            onView={(s) => setSelectedStaff(s)}
            onEdit={(s) => navigate(`/admin/pharmacy/edit/${s.userId || s.id}`)}
            onDelete={handleToggleLock}
            onToggleStatus={handleToggleStatus}
            actionLoading={actionLoading}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by patient or doctor..."
              value={searchRx}
              onChange={(e) => setSearchRx(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {filteredRx.length === 0 ? (
            <div className="text-center py-12 text-slate-400 border border-slate-100 rounded-xl bg-slate-50/50">
              <Stethoscope size={40} className="mx-auto mb-3 text-slate-300" />
              <p className="font-medium text-slate-500">No prescriptions found.</p>
            </div>
          ) : (
            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <PendingPrescriptionsTable 
                prescriptions={filteredRx} 
                onDispense={(rx) => setSelectedPrescription(rx)} 
              />
            </div>
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

      {selectedPrescription && (
        <DispenseModal
          isOpen={!!selectedPrescription}
          prescription={selectedPrescription}
          onClose={() => setSelectedPrescription(null)}
          onSuccess={() => {}} // Read-only for admin
        />
      )}
    </div>
  );
}
