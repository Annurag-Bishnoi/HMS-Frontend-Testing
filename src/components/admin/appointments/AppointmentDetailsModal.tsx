import { X, User, Calendar, Clock, Stethoscope, Activity, FileText, IndianRupee, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import type { Appointment } from "../../../types/appointment";

interface Props {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AppointmentDetailsModal({ appointment, isOpen, onClose }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen && appointment) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

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
        className={`relative w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <p className="text-blue-100 font-medium tracking-wider uppercase text-sm mb-1">Token Number</p>
            <h2 className="text-3xl font-bold">{appointment.tokenNumber || "N/A"}</h2>
          </div>
          <div className="text-right flex flex-col items-end gap-3">
            <button
              onClick={onClose}
              className="rounded-full bg-white/20 p-2 transition hover:bg-white/30"
            >
              <X size={20} />
            </button>
            <span className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold backdrop-blur-md ${
              appointment.status === 'SCHEDULED' ? 'bg-amber-400/20 text-amber-100' :
              appointment.status === 'COMPLETED' ? 'bg-emerald-400/20 text-emerald-100' :
              appointment.status === 'READY_FOR_DOCTOR' ? 'bg-blue-400/20 text-blue-100' :
              'bg-rose-400/20 text-rose-100'
            }`}>
              {appointment.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Patient Information</p>
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{appointment.patientName}</p>
                  <p className="text-sm text-slate-500">ID: {appointment.patientId}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Doctor Information</p>
              <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Stethoscope size={24} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-lg">{appointment.doctorName}</p>
                  <p className="text-sm text-slate-500">{appointment.department}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Schedule</p>
              <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Date</p>
                    <p className="font-semibold text-slate-800">{appointment.appointmentDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Time Slot</p>
                    <p className="font-semibold text-slate-800">{appointment.appointmentTime}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Additional Info</p>
              <div className="rounded-2xl bg-slate-50 p-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Consultation Type</p>
                    <p className="font-semibold text-slate-800">{appointment.consultationType}</p>
                  </div>
                </div>

                {appointment.reasonForVisit && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Chief Complaint</p>
                      <p className="font-medium text-slate-700 text-sm">{appointment.reasonForVisit}</p>
                    </div>
                  </div>
                )}
                
                {appointment.notes && (
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-200 text-slate-600 shrink-0">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Internal Notes</p>
                      <p className="font-medium text-slate-700 text-sm">{appointment.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Billing Section */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Billing Information</p>
              <div className="rounded-2xl bg-slate-50 p-4 space-y-4 border border-slate-100">
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-600">
                    <IndianRupee size={18} className="text-emerald-500" />
                    <span className="font-medium text-sm">Consultation Fee</span>
                  </div>
                  <span className="font-bold text-slate-800">₹{appointment.consultationFee ?? 0}</span>
                </div>
                <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3 text-slate-600">
                    <CreditCard size={18} className="text-blue-500" />
                    <span className="font-medium text-sm">Payment Status</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    appointment.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' :
                    appointment.paymentStatus === 'WAIVED' ? 'bg-slate-100 text-slate-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {appointment.paymentStatus || 'PENDING'}
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
