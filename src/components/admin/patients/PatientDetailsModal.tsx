import { X, User, Phone, MapPin, Activity, FileText, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { resetPatientCredentials } from "../../../api/patientService";
import type { Patient } from "../../../api/patientService";
import { getUser } from "../../../utils/token";

interface Props {
  patient: Patient | null;
  onClose: () => void;
}

export default function PatientDetailsModal({ patient, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [credentials, setCredentials] = useState<{username: string, password: string} | null>(null);

  const currentUser = getUser();
  const canResetCredentials = currentUser?.role === "ADMIN" || currentUser?.role === "RECEPTIONIST";

  useEffect(() => {
    if (patient) {
      setIsVisible(true);
      setCredentials(null); // Reset state when opening a new patient
    } else {
      setIsVisible(false);
    }
  }, [patient]);

  const handleResetCredentials = async () => {
    if (!patient?.id) return;
    
    if (window.confirm(`Are you sure you want to reset credentials for ${patient.name}?`)) {
      try {
        setIsResetting(true);
        const data = await resetPatientCredentials(patient.id.toString());
        setCredentials({
          username: data.username,
          password: data.temporaryPassword
        });
      } catch (err: any) {
        alert("Failed to reset credentials: " + (err.response?.data?.message || err.message));
      } finally {
        setIsResetting(false);
      }
    }
  };

  if (!patient) return null;

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
        className={`relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-2 transition hover:bg-white/30"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 text-3xl font-bold backdrop-blur-md">
              {patient.name.charAt(0)}
            </div>
            <div>
              <p className="text-emerald-100 font-medium tracking-wider uppercase text-xs mb-1">
                {patient.registrationNo || `P-100${patient.id}`}
              </p>
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-md ${
                patient.status === 'Admitted' ? 'bg-amber-400/20 text-amber-100' : 'bg-white/20 text-white'
              }`}>
                {patient.status || 'Active'}
              </span>
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
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <User size={16} />
                </div>
                <span className="text-sm font-medium">{patient.age} yrs • {patient.gender}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Phone size={16} />
                </div>
                <span className="text-sm font-medium">{patient.mobile}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-700">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                  <Activity size={16} />
                </div>
                <span className="text-sm font-medium">Blood Group: {patient.bloodGroup || 'N/A'}</span>
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Contact</h3>
              <div className="flex items-start gap-3 text-slate-700">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <MapPin size={16} />
                </div>
                <span className="text-sm font-medium mt-1 leading-relaxed">{patient.address || 'No Address Provided'}</span>
              </div>
            </div>

          </div>

          {/* Credentials Reset Area */}
          {canResetCredentials && (
            <div className="mt-8 rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <KeyRound size={20} className="text-amber-500" />
                  <h3 className="font-semibold">Patient Login Access</h3>
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
                    Please provide these to the patient.
                  </p>
                </div>
              )}
            </div>
          )}

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