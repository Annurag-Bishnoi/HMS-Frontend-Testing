import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { createStaffUser } from "../../../api/adminService";

const genUsername = () => {
  return `pharma${String(Math.floor(Math.random() * 1000000)).padStart(6, '0')}`;
};

const genPassword = (username: string) => {
  return `Pharma@${username.replace('pharma', '')}`;
};

export default function AddPharmacist() {
  const navigate = useNavigate();
  const [successData, setSuccessData] = useState<{ username?: string; password?: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const [staff, setStaff] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff.fullName) {
      alert("Name is required");
      return;
    }
    
    setLoading(true);
    try {
      const generatedUsername = genUsername();
      const generatedPassword = genPassword(generatedUsername);
      
      await createStaffUser({
        fullName: staff.fullName,
        email: staff.email || undefined,
        phone: staff.phone || undefined,
        username: generatedUsername,
        password: generatedPassword,
        roleCode: "PHARMACIST"
      });

      setSuccessData({
        username: generatedUsername,
        password: generatedPassword
      });
    } catch (err: any) {
      alert("Failed to create pharmacist: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => navigate("/admin/pharmacy");

  if (successData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm text-center border border-slate-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-800">Registration Complete</h2>
          <p className="mb-8 text-slate-500">The pharmacist has been successfully registered. Please provide them with their portal login credentials below.</p>
          
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
            onClick={() => navigate("/admin/pharmacy")}
            className="w-full rounded-xl bg-blue-600 py-4 font-bold text-white shadow-md hover:bg-blue-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6 animate-fade-in">
      <button
        onClick={goBack}
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={16} />
        Back to Pharmacy Dashboard
      </button>

      <div>
        <h1 className="text-3xl font-bold">Add Pharmacist</h1>
        <p className="text-slate-500 mt-1">Register a new pharmacist in the system</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={staff.fullName}
                onChange={(e) => setStaff({...staff, fullName: e.target.value})}
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={staff.email}
                onChange={(e) => setStaff({...staff, email: e.target.value})}
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="john@hospital.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={staff.phone}
                onChange={(e) => setStaff({...staff, phone: e.target.value})}
                className="w-full rounded-lg border border-slate-300 p-2.5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <button
              type="button"
              onClick={goBack}
              className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Pharmacist"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
