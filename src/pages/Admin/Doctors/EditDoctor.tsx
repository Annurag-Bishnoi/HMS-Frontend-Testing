import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DoctorForm from "../../../components/admin/doctors/DoctorForm";
import { ArrowLeft } from "lucide-react";
import { getDoctorById, updateDoctor } from "../../../api/doctorService";
import type { Doctor } from "../../../types/doctor";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function EditDoctor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getDoctorById(id)
        .then(setDoctor)
        .catch(() => showToast("Doctor not found", "error"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async (updated: any) => {
    try {
      if (id) {
        await updateDoctor(id, updated);
        navigate("/admin/doctors");
      }
    } catch (err: any) {
      showToast("Failed to update: " + (err.response?.data?.message || err.message, "error"));
    }
  };

  if (loading) return <p className="p-10 text-center">Loading doctor data...</p>;
  if (!doctor) return <p className="p-10 text-center">Doctor not found</p>;

  const goBack = () => navigate("/admin/doctors");

  return (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Doctors
      </button>

      <h1 className="text-3xl font-bold">Edit Doctor</h1>

      {/* Correct prop name */}
      <DoctorForm initialData={doctor} onSubmit={handleSubmit} />
    </div>
  );
}
