import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, MapPin } from "lucide-react";
import { getPatientById, updatePatient } from "../../../api/patientService";
import { getUser } from "../../../utils/token";

export default function EditPatient() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    mobile: "",
    email: "",
    doctor: "",
    department: "",
    status: "Admitted",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      setPatient({
        name: data.name || "",
        age: String(data.age || ""),
        gender: data.gender || "Male",
        mobile: data.mobile || "",
        email: data.email || "",
        doctor: data.doctor || "",
        department: data.department || "",
        status: data.status || "Admitted",
        address: data.address || "",
      });
    } catch (err: any) {
      setError("Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setPatient({ ...patient, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSaving(true);
      setError("");
      await updatePatient(id, {
        name: patient.name,
        age: parseInt(patient.age),
        gender: patient.gender,
        mobile: patient.mobile,
        address: patient.address,
      });
      alert("Patient Updated Successfully!");
      navigate(`${basePath}/patients`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update patient.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-lg font-medium text-slate-500 animate-pulse">Loading patient data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Edit Patient</h1>
          <p className="text-slate-500 mt-1">Update patient information for ID: {id}</p>
        </div>
        <button
          onClick={() => navigate(`${basePath}/patients`)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full"><span className="w-2 h-2 rounded-full bg-red-600 block"></span></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <User size={20} className="text-blue-600" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input name="name" value={patient.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Age <span className="text-red-500">*</span></label>
                  <input type="number" name="age" value={patient.age} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Gender</label>
                  <select name="gender" value={patient.gender} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2 mb-4 pb-2 border-b border-slate-100">
              <Phone size={20} className="text-green-600" /> Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={16} className="text-slate-400" /></div>
                  <input type="tel" name="mobile" value={patient.mobile} onChange={handleChange} maxLength={10} className="w-full rounded-xl border border-slate-200 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                </div>
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Residential Address</label>
                <div className="relative">
                  <div className="absolute top-4 left-3 pointer-events-none"><MapPin size={16} className="text-slate-400" /></div>
                  <textarea rows={3} name="address" value={patient.address} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => navigate(`${basePath}/patients`)} className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition">
              {saving ? "Updating..." : "Update Patient"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}