import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DoctorHeader from "../../../components/admin/doctors/DoctorHeader";
import DoctorStats from "../../../components/admin/doctors/DoctorStats";
import Pagination from "../../../components/common/Pagination";
import DoctorToolbar from "../../../components/admin/doctors/DoctorToolbar";
import DoctorTable from "../../../components/admin/doctors/DoctorTable";
import DoctorDetailsModal from "../../../components/admin/doctors/DoctorDetailsModal";

import { getDoctors, updateDoctorStatus } from "../../../api/doctorService";
import type { Doctor } from "../../../types/doctor";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function DoctorList() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await getDoctors();
      setDoctors(data);
      setError("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (doctor: Doctor) => {
    try {
      const newStatus = doctor.status === "Active" ? "Inactive" : "Active";
      await updateDoctorStatus(doctor.id.toString(), newStatus);
      await fetchDoctors();
    } catch (err: any) {
      showToast("Failed to change status", "error");
    }
  };

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredDoctors = useMemo(() => {
    return (doctors || [])
      // Filter out dummy/unclean records (missing name or just "Unknown")
      .filter(doctor => doctor && doctor.name && doctor.name.trim() !== "" && doctor.name !== "Unknown")
      .filter(doctor => {
        const searchName = doctor.name || "";
        const matchesSearch = searchName.toLowerCase().includes(search.toLowerCase());
        
        const docDept = doctor.department || "General";
        const matchesDept = department === "All" || docDept === department;
        
        const docStatus = doctor.status || "Inactive";
        const matchesStatus = status === "All" || docStatus === status;
        
        return matchesSearch && matchesDept && matchesStatus;
      });
  }, [doctors, search, department, status]);

  // Pagination Logic
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);
  const currentDoctors = filteredDoctors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, department, status]);

  return (
    <div className="space-y-6">
      <DoctorHeader onAddDoctor={() => navigate("/admin/doctors/add")} />
      <DoctorStats doctors={doctors} />
      <DoctorToolbar
        search={search}
        setSearch={setSearch}
        department={department}
        setDepartment={setDepartment}
        status={status}
        setStatus={setStatus}
      />
      <DoctorTable
        doctors={currentDoctors}
        onView={(doc) => {
          setSelectedDoctor(doc);
          setIsModalOpen(true);
        }}
        onEdit={(doc) => navigate(`/admin/doctors/${doc.id}/edit`)}
        onToggleStatus={handleToggleStatus}
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

      <DoctorDetailsModal 
        doctor={selectedDoctor} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
