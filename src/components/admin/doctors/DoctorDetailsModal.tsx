import { X, Phone, Mail, Building, Briefcase, FileBadge, IndianRupee, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import type { Doctor } from "../../../types/doctor";
import { useEffect, useState } from "react";
import { resetDoctorCredentials } from "../../../api/doctorService";
import { getUser } from "../../../utils/token";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

interface DoctorDetailsModalProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function DoctorDetailsModal({ doctor, isOpen, onClose }: DoctorDetailsModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [credentials, setCredentials] = useState<{username: string, password: string} | null>(null);

  const currentUser = getUser();
  const isAdmin = currentUser?.role === "ADMIN";

  useEffect(() => {
    if (isOpen && doctor) {
      setIsVisible(true);
      setCredentials(null);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, doctor]);

  const handleResetCredentials = async () => {
    if (!doctor?.id) return;
    
    if (await showConfirm(`Are you sure you want to reset credentials for ${doctor.name}?`)) {
      try {
        setIsResetting(true);
        const data = await resetDoctorCredentials(doctor.id.toString());
        setCredentials({
          username: data.username,
          password: data.temporaryPassword
        });
      } catch (err: any) {
        showToast("Failed to reset credentials: " + (err.response?.data?.message || err.message, "error"));
      } finally {
        setIsResetting(false);
      }
    }
  };

  if (!isOpen || !doctor) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div 
        className={`relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        } max-h-[90vh] flex flex-col`}
      >
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition hover:bg-white/30"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-md">
              {doctor.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{doctor.name}</h2>
              <p className="mt-1 text-blue-100 opacity-90">{doctor.specialization}</p>
              <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                doctor.status === 'Available' ? 'bg-emerald-400/20 text-emerald-100' : 'bg-rose-400/20 text-rose-100'
              }`}>
                {doctor.status}
              </span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            
            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Contact</h3>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-medium truncate">{doctor.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-medium truncate">{doctor.email || 'N/A'}</span>
              </div>
            </div>

            {/* Professional Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Professional</h3>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                  <Building size={16} />
                </div>
                <span className="text-sm font-medium truncate">{doctor.department}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Briefcase size={16} />
                </div>
                <span className="text-sm font-medium">{doctor.experience} Years Exp.</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Credentials & Billing</h3>
              <div className="flex items-start gap-3 text-slate-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <FileBadge size={16} />
                </div>
                <span className="text-sm font-medium mt-1 leading-snug">{doctor.qualifications || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <IndianRupee size={16} />
                </div>
                <span className="text-sm font-medium">₹{doctor.consultationFee || 0} / Consultation</span>
              </div>
            </div>

          </div>

          {/* Credentials Reset Area */}
          {isAdmin && (
            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <KeyRound size={20} className="text-blue-500" />
                  <h3 className="font-semibold">Doctor Login Access</h3>
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
                <div className="rounded-xl bg-blue-50 p-4 border border-blue-100 animate-fade-in">
                  <div className="flex items-center gap-2 text-blue-700 mb-3">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-semibold">Credentials Reset Successful</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-blue-100">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Username</span>
                      <span className="font-mono text-slate-800 font-bold">{credentials.username}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white px-3 py-2 rounded-lg border border-blue-100">
                      <span className="text-xs font-semibold text-slate-500 uppercase">Password</span>
                      <span className="font-mono text-slate-800 font-bold">{credentials.password}</span>
                    </div>
                  </div>
                  <p className="text-xs text-blue-600 mt-3 text-center">
                    Please provide these to the doctor.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="mt-8 flex justify-end shrink-0">
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
