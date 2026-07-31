import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getUser } from "../../../utils/token";
import AppointmentForm from "../../../components/admin/appointments/AppointmentForm";
import { CheckCircle, Activity, ChevronRight } from "lucide-react";

import { createAppointment, markPaymentPaid, updateAppointmentStatus, getAppointmentById } from "../../../api/appointmentService";
import { getPatients, type Patient } from "../../../api/patientService";
import { getDoctors } from "../../../api/doctorService";
import type { Doctor } from "../../../types/doctor";
import type { Appointment } from "../../../types/appointment";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

type WorkflowStep = 'BOOKING' | 'PAYMENT' | 'DONE';

export default function AddAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientIdParam = searchParams.get("patientId");
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";

  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [pendingAppointment, setPendingAppointment] = useState<Partial<Appointment> | null>(null);

  // State Machine
  const [step, setStep] = useState<WorkflowStep>('BOOKING');
  const [successAppointment, setSuccessAppointment] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [doneMessage, setDoneMessage] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [pData, dData] = await Promise.all([getPatients(), getDoctors()]);
        setPatients(pData);
        setDoctors(dData.filter((d: Doctor) => d && d.status === "Active"));
      } catch (err) {
        console.error("Failed to load dependencies", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmitBooking = async (appointment: Partial<Appointment>) => {
    setPendingAppointment(appointment);
    setStep('PAYMENT');
  };

  const handleConfirmPayment = async () => {
    if (!pendingAppointment) return;
    setActionLoading(true);
    try {
      const created = await createAppointment(pendingAppointment);
      setSuccessAppointment(created);
      await markPaymentPaid(created.appointmentId || created.id);
      
      await updateAppointmentStatus(created.appointmentId || created.id, 'WAITING_FOR_VITALS');
      setDoneMessage("Appointment booked and payment received. Patient added to Nurse Queue.");
      setStep('DONE');
    } catch (err) {
      showToast("Failed to process payment & book appointment.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handlePayLater = () => {
    // If they cancel payment, we don't book the appointment at all.
    navigate(`${basePath}/dashboard`);
  };

  // Auto-redirect to dashboard when DONE
  useEffect(() => {
    if (step === 'DONE') {
      const timer = setTimeout(() => {
        navigate(`${basePath}/dashboard`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate, basePath]);

  if (loading) {
    return <div className="p-8">Loading dependencies...</div>;
  }

  // Find doctor details for fee display
  const selectedDoctor = pendingAppointment 
    ? doctors.find(d => String(d.id) === String(pendingAppointment.doctorId))
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Add Appointment</h1>
        <Link
          to={`${basePath}/appointments`}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          Back to List
        </Link>
      </div>

      {step === 'BOOKING' && (
        <AppointmentForm 
          initialData={patientIdParam ? { patientId: parseInt(patientIdParam) } as any : undefined}
          patients={patients} 
          doctors={doctors} 
          onSubmit={handleSubmitBooking} 
        />
      )}

      {step === 'PAYMENT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-slate-50 p-6 border-b border-slate-100 flex flex-col items-center">
              <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-slate-800 text-center">Appointment Booked!</h2>
              <p className="text-sm text-slate-500 mt-1 text-center">Consultation fee must be collected to proceed.</p>
            </div>
            
            <div className="p-6 bg-white space-y-4">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Doctor</p>
                  <p className="font-semibold text-slate-800">Dr. {selectedDoctor?.name || 'Assigned Doctor'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Consultation Fee</p>
                  <p className="text-xl font-bold text-emerald-600">₹{selectedDoctor?.consultationFee || 500}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button
                onClick={handlePayLater}
                className="w-1/3 rounded-xl bg-white border border-slate-200 py-3 font-semibold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPayment}
                disabled={actionLoading}
                className="w-2/3 rounded-xl bg-blue-600 py-3 font-bold text-white shadow-md hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Payment Received'} <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}



      {step === 'DONE' && (
        <div className="max-w-2xl mx-auto rounded-3xl bg-white p-12 text-center shadow-sm border border-slate-100 animate-in fade-in zoom-in-95 duration-500 mt-12">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 ring-8 ring-emerald-50/50">
            <CheckCircle size={48} />
          </div>
          <h2 className="mb-3 text-3xl font-bold text-slate-800">Workflow Complete</h2>
          <p className="mb-8 text-lg text-slate-500 max-w-md mx-auto">
            {doneMessage}
          </p>
          <div className="flex justify-center">
            <Activity className="animate-spin text-emerald-500" size={24} />
          </div>
        </div>
      )}

    </div>
  );
}
