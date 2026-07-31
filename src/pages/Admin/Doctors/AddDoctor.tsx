import DoctorForm from "../../../components/admin/doctors/DoctorForm";
import type { Doctor } from "../../../types/doctor";
import { createDoctor } from "../../../api/doctorService";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { parseBackendError } from "../../../utils/errorHandler";

export default function AddDoctor() {
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState<{ username?: string; password?: string } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (doctor: Doctor) => {
    try {
      setError("");
      const response = await createDoctor(doctor);
      if (response && response.username) {
        setSuccessData({
          username: response.username,
          password: response.temporaryPassword
        });
      } else {
        navigate("/admin/doctors");
      }
    } catch (err: any) {
      setError(parseBackendError(err, "Failed to add doctor."));
    }
  };

  const goBack = () => navigate("/admin/doctors");

  if (successData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm text-center border border-slate-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-800">Registration Complete</h2>
          <p className="mb-8 text-slate-500">The doctor has been successfully registered. Please provide them with their portal login credentials below.</p>
          
          <div className="rounded-xl bg-slate-50 p-6 text-left border border-slate-200 mb-8">
            <div className="mb-4">
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Username</label>
              <p className="text-xl font-bold text-slate-800 font-mono mt-1">{successData.username}</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Temporary Password</label>
              <p className="text-xl font-bold text-slate-800 font-mono mt-1">{successData.password}</p>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/admin/doctors")}
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Doctors
      </button>

      <h1 className="text-3xl font-bold">Add Doctor</h1>

      {error && (
        <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
          <div className="bg-red-100 p-2 rounded-full"><span className="w-2 h-2 rounded-full bg-red-600 block"></span></div>
          {error}
        </div>
      )}

      <DoctorForm onSubmit={handleSubmit} />
    </div>
  );
}
