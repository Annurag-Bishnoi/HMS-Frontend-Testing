import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, MapPin, CheckCircle } from "lucide-react";
import { createPatient } from "../../../api/patientService";
import { getUser } from "../../../utils/token";

export default function AddPatient() {
  const navigate = useNavigate();
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "Male",
    mobile: "",
    email: "",
    bloodGroup: "O+",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    age: "",
    mobile: "",
    email: "",
    address: "",
    submit: "",
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ patientId?: number; username?: string; password?: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPatient({
      ...patient,
      [name]: name === "mobile" || name === "emergencyContactPhone" ? value.replace(/\D/g, "") : value,
    });
    setErrors({ ...errors, [name]: "", submit: "" });
  };

  const validate = () => {
    const newErrors = { name: "", age: "", mobile: "", email: "", address: "", submit: "" };
    let valid = true;

    if (!patient.name.trim()) { newErrors.name = "Required"; valid = false; }
    if (!patient.age) { newErrors.age = "Required"; valid = false; }
    if (!patient.mobile || patient.mobile.length !== 10) { newErrors.mobile = "10 digits required"; valid = false; }
    if (patient.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patient.email)) { newErrors.email = "Invalid email"; valid = false; }
    if (!patient.address.trim()) { newErrors.address = "Required"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await createPatient({
        name: patient.name,
        age: parseInt(patient.age), 
        gender: patient.gender,
        mobile: patient.mobile,
        email: patient.email,
        address: patient.address,
        bloodGroup: patient.bloodGroup,
      });
      
      // Show credentials if returned
      if (response && response.username) {
        setSuccessData({
          patientId: response.patient?.patientId || response.patientId,
          username: response.username,
          password: response.temporaryPassword
        });
      } else {
        alert("Patient Added Successfully");
        navigate(`${basePath}/patients`);
      }
    } catch (err: any) {
      setErrors({ ...errors, submit: err.response?.data?.message || err.message || "Failed to create patient." });
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm text-center border border-slate-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-800">Registration Complete</h2>
          <p className="mb-8 text-slate-500">The patient has been successfully registered. Please provide them with their portal login credentials below.</p>
          
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
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate(`${basePath}/patients`)}
              className="w-1/2 rounded-xl bg-slate-100 py-4 font-bold text-slate-700 shadow-sm hover:bg-slate-200 transition"
            >
              Later
            </button>
            <button
              onClick={() => navigate(`${basePath}/appointments/add?patientId=${successData.patientId}`)}
              className="w-1/2 rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md hover:bg-blue-700 transition"
            >
              Book Appointment Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Add Patient</h1>
          <p className="text-slate-500 mt-1">Register a new patient into the system</p>
        </div>
        <button
          onClick={() => navigate(`${basePath}/patients`)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
        {errors.submit && (
          <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full"><span className="w-2 h-2 rounded-full bg-red-600 block"></span></div>
            {errors.submit}
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
                <input name="name" value={patient.name} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. John Doe" />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Age <span className="text-red-500">*</span></label>
                  <input type="number" name="age" value={patient.age} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Yrs" />
                  {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Blood Group</label>
                <select name="bloodGroup" value={patient.bloodGroup} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                  <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                  <option>AB+</option><option>AB-</option><option>O+</option><option>O-</option>
                </select>
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
                  <input type="tel" name="mobile" value={patient.mobile} onChange={handleChange} maxLength={10} className="w-full rounded-xl border border-slate-200 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="10-digit mobile" />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={16} className="text-slate-400" /></div>
                  <input type="email" name="email" value={patient.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Optional" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Residential Address <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute top-4 left-3 pointer-events-none"><MapPin size={16} className="text-slate-400" /></div>
                  <textarea rows={3} name="address" value={patient.address} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Full residential address" />
                </div>
                {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => navigate(`${basePath}/patients`)} className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? "Registering..." : "Register Patient"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}