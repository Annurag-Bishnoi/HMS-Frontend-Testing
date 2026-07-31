import { X, User, Phone, Mail, KeyRound, Loader2, CheckCircle2, ToggleLeft, ToggleRight } from "lucide-react";
import { useState } from "react";
import { resetUserPassword, updateUserStatus } from "../../../api/adminService";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

interface ReceptionistDetailsModalProps {
  staff: any;
  onClose: () => void;
  onUpdate?: () => void;
}

const genPassword = (username: string) => {
  return `Rec@${(username || '').replace('rec', '')}`;
};

export default function ReceptionistDetailsModal({ staff, onClose, onUpdate }: ReceptionistDetailsModalProps) {
  const [isResetting, setIsResetting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [credentials, setCredentials] = useState<{ username: string; password: string } | null>(null);

  const handleResetCredentials = async () => {
    setIsResetting(true);
    try {
      const newPass = genPassword(staff.username);
      await resetUserPassword(staff.userId, newPass);
      setCredentials({ username: staff.username, password: newPass });
    } catch (err) {
      showToast("Failed to reset credentials", "error");
    } finally {
      setIsResetting(false);
    }
  };

  const handleToggleStatus = async () => {
    setIsToggling(true);
    try {
      await updateUserStatus(staff.userId, !staff.active);
      if (onUpdate) onUpdate();
    } catch (err) {
      showToast("Failed to update status", "error");
    } finally {
      setIsToggling(false);
    }
  };

  if (!staff) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-8 text-white">
          <button onClick={onClose} className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition hover:bg-white/30">
            <X size={20} />
          </button>

          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-md">
              {staff.fullName ? staff.fullName.charAt(0) : '?'}
            </div>
            <div>
              <p className="text-blue-100 font-medium tracking-wider uppercase text-xs mb-1">
                ID: {staff.userId}
              </p>
              <h2 className="text-2xl font-bold">{staff.fullName || 'Unknown'}</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                  staff.active ? 'bg-white/20 text-white' : 'bg-red-400/20 text-red-100'
                }`}>
                  {staff.active ? 'Active' : 'Inactive'}
                </span>
                
                <button
                  onClick={handleToggleStatus}
                  disabled={isToggling}
                  className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1 text-xs font-semibold text-white hover:bg-white/20 transition backdrop-blur-md"
                >
                  {isToggling ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : staff.active ? (
                    <><ToggleRight size={14} /> Deactivate</>
                  ) : (
                    <><ToggleLeft size={14} /> Activate</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Personal Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Personal Details</h3>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium">{staff.username}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-medium">{staff.mobileNumber || staff.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-medium">{staff.email || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Credentials Reset Area */}
          <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <KeyRound size={20} className="text-amber-500" />
                <h3 className="font-semibold">Staff Login Access</h3>
              </div>
              {!credentials && (
                <button
                  onClick={handleResetCredentials}
                  disabled={isResetting}
                  className="rounded-lg bg-white border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 transition flex items-center gap-2"
                >
                  {isResetting ? (
                    <><Loader2 size={16} className="animate-spin text-slate-400" /> Resetting...</>
                  ) : (
                    "Reset Credentials"
                  )}
                </button>
              )}
            </div>
            
            {credentials && (
              <div className="rounded-xl bg-amber-50 p-4 border border-amber-100 animate-fade-in">
                <div className="flex items-center gap-2 text-amber-700 mb-3">
                  <CheckCircle2 size={18} />
                  <span className="text-sm font-semibold">Credentials Reset Successful</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-amber-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Username</span>
                    <span className="font-mono text-slate-800 font-bold">{credentials.username}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-amber-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase">Password</span>
                    <span className="font-mono text-slate-800 font-bold">{credentials.password}</span>
                  </div>
                </div>
                <p className="text-xs text-amber-600 mt-3 text-center">
                  Please provide these to the staff member.
                </p>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
