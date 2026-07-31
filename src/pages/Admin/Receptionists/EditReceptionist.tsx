import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getUserById, updateUser } from "../../../api/adminService";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function EditReceptionist() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

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

  useEffect(() => {
    if (id) {
      fetchReceptionist(parseInt(id));
    }
  }, [id]);

  const fetchReceptionist = async (userId: number) => {
    try {
      setFetching(true);
      const data = await getUserById(userId);
      setStaff({
        fullName: data.fullName || "",
        mobile: data.mobileNumber || data.phone || "",
        email: data.email || "",
      });
    } catch (err) {
      showToast("Failed to load receptionist details", "error");
      navigate("/admin/receptionists");
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStaff({ ...staff, [e.target.name]: (e.target.name === 'mobile' || e.target.name === 'phone') ? e.target.value.replace(/\D/g, "") : e.target.value });
    setErrors({ ...errors, [e.target.name]: "", submit: "" });
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
    if (!validate() || !id) return;

    try {
      setLoading(true);
      await updateUser(parseInt(id), {
        fullName: staff.fullName,
        phone: staff.mobile,
        email: staff.email,
      });
      showToast("Receptionist updated successfully", "success");
      navigate("/admin/receptionists");
    } catch (err: any) {
      setErrors({ ...errors, submit: err.response?.data?.message || "Failed to update receptionist" });
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">
      <button onClick={() => navigate("/admin/receptionists")} className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
        <ArrowLeft size={16} /> Back to Receptionists
      </button>

      <div>
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Edit Receptionist</h1>
        <p className="text-slate-500 mt-1">Update details for this receptionist.</p>
      </div>

      {errors.submit && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
          {errors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <div className="space-y-6">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Personal Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input name="fullName" value={staff.fullName} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="e.g. Jane Doe" />
                {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
              </div>
            </div>
          </div>

          <div className="space-y-6 mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label>
                <input maxLength={10} type="tel" name="mobile" value={staff.mobile} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="10-digit number" />
                {errors.mobile && <p className="mt-1 text-xs text-red-500">{errors.mobile}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                <input type="email" name="email" value={staff.email} onChange={handleChange} className="w-full rounded-xl border border-slate-200 p-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" placeholder="jane@hospital.com" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end gap-3">
          <button type="button" onClick={() => navigate("/admin/receptionists")} className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold shadow-md hover:bg-blue-700 transition disabled:opacity-50">
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
