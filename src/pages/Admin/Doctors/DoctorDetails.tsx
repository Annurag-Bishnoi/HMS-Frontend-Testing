import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getDoctorById } from "../../../api/doctorService";
import type { Doctor } from "../../../types/doctor";

export default function DoctorDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getDoctorById(id)
        .then(setDoctor)
        .catch(() => alert("Doctor not found"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const goBack = () => navigate("/admin/doctors");

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!doctor) return <p className="p-10 text-center">Doctor not found</p>;

  return (
    <div className="space-y-6">
      {/* ← Back button */}
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Doctors
      </button>

      <div className="rounded-xl bg-white p-6 shadow">
        <h1 className="mb-6 text-3xl font-bold">Doctor Details</h1>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold">Name</h3>
            <p>{doctor.name}</p>
          </div>
          <div>
            <h3 className="font-semibold">Email</h3>
            <p>{doctor.email}</p>
          </div>
          <div>
            <h3 className="font-semibold">Phone</h3>
            <p>{doctor.phone}</p>
          </div>
          <div>
            <h3 className="font-semibold">Department</h3>
            <p>{doctor.department}</p>
          </div>
          <div>
            <h3 className="font-semibold">Specialization</h3>
            <p>{doctor.specialization}</p>
          </div>
          <div>
            <h3 className="font-semibold">Experience</h3>
            <p>{doctor.experience} Years</p>
          </div>
          <div>
            <h3 className="font-semibold">Status</h3>
            <p>{doctor.status}</p>
          </div>
        </div>
      </div>
    </div>
  );
}