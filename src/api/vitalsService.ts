import api from "./axios";

export interface SimpleVitalsRequest {
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  notes?: string;
}

export interface SimpleVitalsResponse {
  id: number;
  appointmentId: number;
  visitId: number;
  temperature?: number;
  bloodPressure?: string;
  heartRate?: number;
  spo2?: number;
  weight?: number;
  height?: number;
  notes?: string;
  recordedAt: string;
}

export const recordSimpleVitals = async (appointmentId: string | number, data: SimpleVitalsRequest): Promise<SimpleVitalsResponse> => {
  const response = await api.post<SimpleVitalsResponse>(`/vitals?appointmentId=${appointmentId}`, data);
  return response.data;
};

export const getVitalsByAppointment = async (appointmentId: string | number): Promise<SimpleVitalsResponse[]> => {
  const response = await api.get<SimpleVitalsResponse[]>(`/vitals/appointment/${appointmentId}`);
  return response.data;
};
