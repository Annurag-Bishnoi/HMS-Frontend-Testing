import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Phone, Mail, CheckCircle } from "lucide-react";
import { createStaffUser } from "../../../api/adminService";
import { parseBackendError } from "../../../utils/errorHandler";

const genUsername = () => {
  return `acc${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
};

const genPassword = (username: string) => {
  return `Rec@${username.replace('rec', '')}`;
};

export default function AddAccountant() {
  const navigate = useNavigate();

  const [staff, setStaff] = useState({
    fullName: "",
    mobile: "",
    email: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    mobile: "",
    email: "",
    submit: "",
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{ username?: string; password?: string } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setStaff({
      ...staff,
      [name]: name === "mobile" ? value.replace(/\D/g, "") : value,
    });
    setErrors({ ...errors, [name]: "", submit: "" });
  };

  const validate = () => {
    const newErrors = { fullName: "", mobile: "", email: "", submit: "" };
    let valid = true;

    if (!staff.fullName.trim()) { newErrors.fullName = "Required"; valid = false; }
    if (staff.mobile && staff.mobile.length !== 10) { newErrors.mobile = "Must be 10 digits"; valid = false; }
    if (staff.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staff.email)) { newErrors.email = "Invalid email"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const generatedUsername = genUsername();
      const generatedPassword = genPassword(generatedUsername);

      const response = await createStaffUser({
        fullName: staff.fullName,
        username: generatedUsername,
        password: generatedPassword, 
        phone: staff.mobile,
        email: staff.email,
        roleCode: "BILLING"
      });
      
      if (response && response.temporaryPassword) {
        setSuccessData({
          username: response.username,
          password: response.temporaryPassword
        });
      } else {
        navigate("/admin/Accountants");
      }
    } catch (err: any) {
      setErrors({ ...errors, submit: parseBackendError(err, "Failed to create Accountant.") });
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
          <p className="mb-8 text-slate-500">Accountant registered successfully. Provide them with their credentials below.</p>
          
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
            onClick={() => navigate("/admin/Accountants")}
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Add Accountant</h1>
          <p className="text-slate-500 mt-1">Register front-desk staff</p>
        </div>
        <button
          onClick={() => navigate("/admin/Accountants")}
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
                <input name="fullName" value={staff.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Jane Doe" />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone size={16} className="text-slate-400" /></div>
                  <input type="tel" name="mobile" value={staff.mobile} onChange={handleChange} maxLength={10} className="w-full rounded-xl border border-slate-200 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="10-digit mobile" />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail size={16} className="text-slate-400" /></div>
                  <input type="email" name="email" value={staff.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 pl-10 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="Optional" />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => navigate("/admin/Accountants")} className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white shadow-md hover:bg-blue-700 disabled:opacity-50 transition">
              {loading ? "Registering..." : "Register Accountant"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
