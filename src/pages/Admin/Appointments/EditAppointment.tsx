import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUser } from "../../../utils/token";
import AppointmentForm from "../../../components/admin/appointments/AppointmentForm";

import { getAppointmentById, rescheduleAppointment, updateAppointmentStatus } from "../../../api/appointmentService";
import { getPatients, type Patient } from "../../../api/patientService";
import { getDoctors } from "../../../api/doctorService";
import type { Doctor } from "../../../types/doctor";
import type { Appointment } from "../../../types/appointment";
import { showToast, showConfirm } from "../../../utils/ui-alerts";

export default function EditAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = getUser();
  const basePath = user?.role === "RECEPTIONIST" ? "/receptionist" : "/admin";
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [aData, pData, dData] = await Promise.all([
          getAppointmentById(id as string),
          getPatients(),
          getDoctors()
        ]);
        setAppointment(aData);
        setPatients(pData);
        setDoctors(dData);
      } catch (err) {
        console.error("Failed to load appointment data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSubmit = async (updatedData: Partial<Appointment>) => {
    try {
      // If the user changed the date/slot, we reschedule
      if (updatedData.appointmentDate !== appointment?.appointmentDate || updatedData.appointmentTime !== appointment?.appointmentTime) {
        await rescheduleAppointment(id as string, updatedData.appointmentDate as string, updatedData.appointmentTime as string);
      }

      // If the user changed the status, we update status
      if (updatedData.status !== appointment?.status) {
        await updateAppointmentStatus(id as string, updatedData.status as string);
      }

      navigate(`${basePath}/appointments`);
    } catch (err) {
      showToast("Failed to update appointment.", "error");
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!appointment) {
    return <div className="p-8 text-red-500">Appointment not found!</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Edit Appointment</h1>
        <Link
          to={`${basePath}/appointments`}
          className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-50 transition"
        >
          Back
        </Link>
      </div>

      <AppointmentForm 
        initialData={appointment}
        patients={patients} 
        doctors={doctors} 
        onSubmit={handleSubmit} 
      />
    </div>
  );
}
