import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DoctorHeader from "../../../components/admin/doctors/DoctorHeader";
import DoctorStats from "../../../components/admin/doctors/DoctorStats";
import DoctorToolbar from "../../../components/admin/doctors/DoctorToolbar";
import DoctorTable from "../../../components/admin/doctors/DoctorTable";
import DoctorDetailsModal from "../../../components/admin/doctors/DoctorDetailsModal";

import { getDoctors, deleteDoctor } from "../../../api/doctorService";
import type { Doctor } from "../../../types/doctor";

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

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await deleteDoctor(id.toString());
        await fetchDoctors();
      } catch (err: any) {
        alert("Failed to delete");
      }
    }
  };

  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      const matchesSearch = doctor.name.toLowerCase().includes(search.toLowerCase());
      const matchesDept = department === "All" || doctor.department === department;
      const matchesStatus = status === "All" || doctor.status === status;
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [doctors, search, department, status]);

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
        doctors={filteredDoctors}
        onView={(doc) => {
          setSelectedDoctor(doc);
          setIsModalOpen(true);
        }}
        onEdit={(doc) => navigate(`/admin/doctors/${doc.id}/edit`)}
        onDelete={(doc) => handleDelete(doc.id)}
      />

      <DoctorDetailsModal 
        doctor={selectedDoctor} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}