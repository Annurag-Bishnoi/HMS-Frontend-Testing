import api from './axios';

export interface MedicationDto {
  medicationId?: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
  medicationCode?: string;
  quantity?: string;
}

export interface PrescriptionResponse {
  prescriptionId: number;
  appointmentId: number;
  patientId: number;
  doctorId: number;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  notes?: string;
  medications: MedicationDto[];
  createdAt: string;
  status?: string;
}

export const getPrescriptionsByDoctorId = async (doctorId: string): Promise<PrescriptionResponse[]> => {
  const response = await api.get(`/prescriptions/doctor/${doctorId}`);
  return Array.isArray(response.data) ? response.data : [];
};

export const getPrescriptionsByPatientId = async (patientId: string): Promise<PrescriptionResponse[]> => {
  const response = await api.get(`/prescriptions/patient/${patientId}`);
  return Array.isArray(response.data) ? response.data : [];
};

export const getPrescriptionByAppointmentId = async (appointmentId: string): Promise<PrescriptionResponse> => {
  const response = await api.get(`/prescriptions/appointment/${appointmentId}`);
  return response.data;
};

export const getPrescriptionById = async (id: string): Promise<PrescriptionResponse> => {
  const response = await api.get(`/prescriptions/${id}`);
  return response.data;
};
