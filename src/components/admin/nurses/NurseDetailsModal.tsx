import { X, User, Phone, Mail, Activity, Lock, Unlock, KeyRound } from "lucide-react";
import { useState } from "react";
import { lockUser, resetUserCredentials } from "../../../api/adminService";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

interface NurseDetailsModalProps {
  staff: any;
  onClose: () => void;
  onUpdate?: () => void;
}

export default function NurseDetailsModal({ staff, onClose, onUpdate }: NurseDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [newCredentials, setNewCredentials] = useState<{username?: string, password?: string} | null>(null);

  const handleLockToggle = async () => {
    if (!confirm(`Are you sure you want to ${staff.accountLocked ? 'unlock' : 'lock'} this account?`)) return;
    
    setLoading(true);
    try {
      await lockUser(staff.userId, !staff.accountLocked);
      onUpdate?.();
    } catch (err) {
      showToast("Failed to update account lock status.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetCredentials = async () => {
    if (!confirm("This will generate a new password for this nurse. Continue?")) return;
    
    setLoading(true);
    try {
      const res = await resetUserCredentials(staff.userId);
      if (res && res.temporaryPassword) {
        setNewCredentials({
          username: res.username,
          password: res.temporaryPassword
        });
      }
      onUpdate?.();
    } catch (err) {
      showToast("Failed to reset credentials.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 sm:p-8 flex items-start justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 text-white/10">
            <User size={120} />
          </div>
          <div className="relative z-10 flex gap-5 items-center">
            <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-3xl font-bold border border-white/30 shadow-inner">
              {staff.fullName?.charAt(0) || "N"}
            </div>
            <div className="text-white">
              <h2 className="text-2xl font-bold tracking-tight">{staff.fullName}</h2>
              <p className="text-blue-100 font-medium mt-1 text-sm flex items-center gap-2">
                @{staff.username} • Nurse
              </p>
              <div className="mt-2 flex gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${staff.active ? 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30' : 'bg-red-400/20 text-red-100 border border-red-400/30'}`}>
                  {staff.active ? 'Active' : 'Inactive'}
                </span>
                {staff.accountLocked && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide bg-amber-400/20 text-amber-100 border border-amber-400/30 flex items-center gap-1">
                    <Lock size={12} /> Locked
                  </span>
                )}
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="relative z-10 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          {newCredentials && (
            <div className="mb-8 p-6 bg-emerald-50 rounded-2xl border border-emerald-200">
              <h4 className="text-emerald-800 font-bold mb-2 flex items-center gap-2">
                <KeyRound size={18} /> New Credentials Generated
              </h4>
              <p className="text-sm text-emerald-600 mb-4">Please securely share these with the nurse. They will only be shown once.</p>
              <div className="bg-white p-4 rounded-xl border border-emerald-100 space-y-2 font-mono text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Username:</span>
                  <span className="font-bold text-slate-800">{newCredentials.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Password:</span>
                  <span className="font-bold text-slate-800">{newCredentials.password}</span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Contact Info</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-blue-600"><Phone size={16} /></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Phone Number</p>
                      <p className="font-medium text-slate-800">{staff.mobileNumber || staff.phone || "—"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-200 text-purple-600"><Mail size={16} /></div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Email Address</p>
                      <p className="font-medium text-slate-800 break-all">{staff.email || "—"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Actions Removed per request */}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-6 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold hover:bg-slate-50 transition shadow-sm"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
