import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { User, Calendar, Clock, Stethoscope, FileText, Activity } from "lucide-react";
import { getAppointmentById } from "../../../api/appointmentService";
import type { Appointment } from "../../../types/appointment";

export default function AppointmentDetails() {
  const { id } = useParams();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAppointment() {
      try {
        const data = await getAppointmentById(id as string);
        setAppointment(data);
      } catch (err) {
        console.error("Failed to load appointment", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAppointment();
  }, [id]);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!appointment) return <div className="p-8 text-red-500">Appointment not found.</div>;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">
          Appointment Details
        </h1>
        <div className="flex gap-3">
          <Link
            to="/admin/appointments"
            className="rounded-xl bg-slate-200 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-300"
          >
            Back to List
          </Link>
          <Link
            to={`/admin/appointments/${appointment.id}/edit`}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white shadow-md transition hover:bg-blue-700"
          >
            Edit Appointment
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-slate-100">
        
        {/* Top Gradient Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 text-white flex justify-between items-center">
          <div>
            <p className="text-blue-100 font-medium tracking-wider uppercase text-sm">Token Number</p>
            <h2 className="text-3xl font-bold">{appointment.notes || "N/A"}</h2>
          </div>
          <div className="text-right">
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

        {/* Content */}
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
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}