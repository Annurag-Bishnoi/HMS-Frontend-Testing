import api from "./axios";
import type { Appointment } from "../types/appointment";

const mapAppointmentItem = (item: any): Appointment => ({
    id: String(item.appointmentId),
    patientId: String(item.patientId),
    patientName: item.patientName,
    doctorId: String(item.doctorId),
    doctorName: item.doctorName,
    department: item.department || "General",
    appointmentDate: Array.isArray(item.appointmentDate) ? item.appointmentDate.map((n: number) => String(n).padStart(2, '0')).join('-') : item.appointmentDate,
    appointmentTime: Array.isArray(item.appointmentTime) ? item.appointmentTime.map((n: number) => String(n).padStart(2, '0')).join(':') : item.appointmentTime,
    consultationType: item.consultationType || "OPD",
    reasonForVisit: item.reasonForVisit,
    consultationFee: item.consultationFee,
    paymentStatus: item.paymentStatus,
    status: item.status,
    notes: item.notes,
    tokenNumber: item.tokenNumber,
});

export const getAppointments = async (): Promise<Appointment[]> => {
  const response = await api.get("/appointments/get");
  const data = response.data || [];
  
  return data.map(mapAppointmentItem);
};

export const getDoctorAppointments = async (doctorId: string, today: boolean = false): Promise<Appointment[]> => {
  const response = await api.get(`/appointments/doctor/${doctorId}?today=${today}`);
  const data = response.data || [];
  return data.map(mapAppointmentItem);
};

export const getDoctorQueue = async (doctorId: string): Promise<Appointment[]> => {
  const response = await api.get(`/appointments/doctor/${doctorId}/queue`);
  const data = response.data || [];
  return data.map(mapAppointmentItem);
};

export const getAppointmentById = async (id: string): Promise<Appointment> => {
  const response = await api.get(`/appointments/${id}`);
  return mapAppointmentItem(response.data);
};

export const createAppointment = async (appointment: Partial<Appointment>): Promise<Appointment> => {
  const payload = {
    patientId: Number(appointment.patientId),
    doctorId: Number(appointment.doctorId),
    appointmentDate: appointment.appointmentDate,
    appointmentTime: appointment.appointmentTime,
    consultationType: appointment.consultationType,
    reasonForVisit: appointment.reasonForVisit,
    notes: appointment.notes,
  };
  const response = await api.post("/appointments/register", payload);
  const item = response.data;
  
  return {
    id: String(item.appointmentId),
    patientId: String(item.patientId),
    patientName: "",
    doctorId: String(item.doctorId),
    doctorName: "",
    department: "",
    appointmentDate: appointment.appointmentDate!,
    appointmentTime: appointment.appointmentTime!,
    consultationType: appointment.consultationType || "OPD",
    reasonForVisit: appointment.reasonForVisit,
    notes: appointment.notes,
    status: item.status,
    tokenNumber: item.tokenNumber,
  };
};

export const updateAppointmentStatus = async (id: string, status: string): Promise<void> => {
  await api.put(`/appointments/${id}/status`, { status });
};

export const cancelAppointment = async (id: string): Promise<void> => {
  await api.put(`/appointments/${id}/cancel`);
};

export const markPaymentPaid = async (id: string): Promise<void> => {
  await api.put(`/appointments/${id}/pay`);
};

export const rescheduleAppointment = async (id: string, appointmentDate: string, appointmentTime: string): Promise<void> => {
  const payload = {
    appointmentDate,
    appointmentTime,
  };
  await api.put(`/appointments/${id}/reschedule`, payload);
};
