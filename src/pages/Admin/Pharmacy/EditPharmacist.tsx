import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { getUserById, updateUser } from "../../../api/adminService";

export default function EditPharmacist() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [staff, setStaff] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: ""
  });

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const data = await getUserById(Number(id));
        setStaff({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          username: data.username || ""
        });
      } catch (err: any) {
        alert("Failed to fetch staff details");
        navigate("/admin/pharmacy");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchStaff();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staff.fullName) {
      alert("Name is required");
      return;
    }
    
    setSaving(true);
    try {
      await updateUser(Number(id), {
        fullName: staff.fullName,
        email: staff.email || undefined,
        phone: staff.phone || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      alert("Failed to update pharmacist: " + (err.response?.data?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => navigate("/admin/pharmacy");

  if (success) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-sm text-center border border-slate-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CheckCircle size={40} />
          </div>
          <h2 className="mb-2 text-3xl font-bold text-slate-800">Update Complete</h2>
          <p className="mb-8 text-slate-500">The pharmacist details have been successfully updated.</p>
          
          <button
            onClick={goBack}
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
        <h1 className="text-3xl font-bold">Edit Pharmacist</h1>
        <p className="text-slate-500 mt-1">Update details for {staff.username ? `@${staff.username}` : "staff"}</p>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username (Immutable)</label>
                <input
                  type="text"
                  disabled
                  value={staff.username}
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-500 cursor-not-allowed outline-none"
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
                disabled={saving}
                className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
