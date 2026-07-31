import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Pencil } from "lucide-react";
import { getPatientById } from "../../../api/patientService";
import type { Patient } from "../../../api/patientService";

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadPatient();
    }
  }, [id]);

  const loadPatient = async () => {
    try {
      setLoading(true);
      const data = await getPatientById(id!);
      setPatient(data);
      setError("");
    } catch (err: any) {
      setError("Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading patient details...</div>;
  }

  if (error || !patient) {
    return (
      <div className="p-10 text-center text-red-600">
        {error || "Patient not found."}
        <br />
        <button onClick={() => navigate("/admin/patients")} className="mt-4 text-blue-600 underline">
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patient Details</h1>
          <p className="text-slate-500">ID: {patient.registrationNo || patient.id}</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => navigate("/admin/patients")}
            className="flex items-center gap-2 rounded-xl border px-5 py-3 hover:bg-slate-100"
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <button
            onClick={() => navigate(`/admin/patients/edit/${patient.id}`)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Pencil size={18} />
            Edit
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">Personal Information</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <InfoCard label="Full Name" value={patient.name} />
          <InfoCard label="Age" value={patient.age} />
          <InfoCard label="Gender" value={patient.gender} />
          <InfoCard label="Mobile" value={patient.mobile} />
          <InfoCard label="Blood Group" value={patient.bloodGroup || "Unknown"} />
        </div>

        <h2 className="mt-10 mb-6 text-xl font-semibold text-slate-800">Hospital Information</h2>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
          <InfoCard label="Assigned Doctor" value={patient.doctor || "Unassigned"} />
          <InfoCard label="Department" value={patient.department || "N/A"} />
          <InfoCard label="Status" value={patient.status || "N/A"} />
        </div>
        
        <h2 className="mt-10 mb-6 text-xl font-semibold text-slate-800">Contact Details</h2>
        <div>
           <InfoCard label="Address" value={patient.address || "N/A"} />
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-800">{value}</p>
    </div>
  );
}
