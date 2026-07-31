import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStaffUser } from "../../../api/adminService";
import { parseBackendError } from "../../../utils/errorHandler";

const genUsername = (name: string) => {
  return `lab${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
};

const genPassword = (username: string) => {
  return `Lab@${username.replace('lab', '')}`;
};

export default function AddLabStaff() {
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState<{ username?: string; password?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [staff, setStaff] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    submit: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ 
      ...prev, 
      [name]: name === "phone" ? value.replace(/\D/g, "") : value 
    }));
    setErrors((prev) => ({ ...prev, [name]: "", submit: "" }));
  };

  const validate = () => {
    const newErrors = { fullName: "", email: "", phone: "", submit: "" };
    let valid = true;

    if (!staff.fullName.trim()) { newErrors.fullName = "Required"; valid = false; }
    if (staff.phone && staff.phone.length !== 10) { newErrors.phone = "Must be 10 digits"; valid = false; }
    if (staff.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(staff.email)) { newErrors.email = "Invalid email"; valid = false; }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const generatedUsername = genUsername(staff.fullName);
      const generatedPassword = genPassword(generatedUsername);
      
      await createStaffUser({
        fullName: staff.fullName,
        email: staff.email || undefined,
        phone: staff.phone || undefined,
        username: generatedUsername,
        password: generatedPassword,
        roleCode: "LABORATORY"
      });

      setSuccessData({
        username: generatedUsername,
        password: generatedPassword
      });
    } catch (err: any) {
      setErrors({ ...errors, submit: parseBackendError(err, "Failed to create staff.") });
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-6 animate-fade-in">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm text-center border border-slate-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-800">Registration Complete</h2>
          <p className="mb-8 text-slate-500">
            The laboratory technician has been successfully registered. Please provide them with their portal login credentials below.
          </p>

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
            onClick={() => navigate("/admin/laboratory")}
            className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 animate-fade-in max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/admin/laboratory")}
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to Laboratory Staff
      </button>

      <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Add Laboratory Technician</h2>

        {errors.submit && (
          <div className="mb-6 p-4 text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full"><span className="w-2 h-2 rounded-full bg-red-600 block"></span></div>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Full Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="fullName"
              value={staff.fullName}
              onChange={handleChange}
              className={`w-full rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-slate-300'} p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
              placeholder="Enter full name"
            />
            {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email Address <span className="text-red-500">*</span></label>
              <input
                type="email"
                name="email"
                value={staff.email}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-slate-300'} p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={staff.phone}
                onChange={handleChange}
                className={`w-full rounded-lg border ${errors.phone ? 'border-red-500' : 'border-slate-300'} p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                placeholder="Enter 10-digit phone number"
              />
              {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t mt-8">
            <button
              type="button"
              onClick={() => navigate("/admin/laboratory")}
              className="rounded-lg border px-6 py-2.5 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !staff.fullName}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Registering..." : "Register Laboratory Technician"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
