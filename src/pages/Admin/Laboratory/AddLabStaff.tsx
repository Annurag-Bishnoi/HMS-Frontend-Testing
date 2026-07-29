import { ArrowLeft, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStaffUser } from "../../../api/adminService";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStaff((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff.fullName.trim()) return;
    
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
      alert("Failed to create laboratory staff: " + (err.response?.data || err.message));
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

      <div className="rounded-2xl border bg-white p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Add Laboratory Technician</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
            <input
              type="text"
              name="fullName"
              required
              value={staff.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Enter full name"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={staff.email}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter email (optional)"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={staff.phone}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter phone number (optional)"
              />
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
