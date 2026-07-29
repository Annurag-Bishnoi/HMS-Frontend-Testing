import api from "./axios";

export const searchCiel = async (q: string, type: 'diagnosis' | 'medication' | 'test') => {
  const response = await api.get(`/ciel/search?q=${encodeURIComponent(q)}&type=${type}`);
  return response.data;
};

export const startConsultation = async (appointmentId: string) => {
  const response = await api.post(`/visits/start`, { appointmentId: Number(appointmentId) });
  return response.data;
};

export const getVisitsByAppointmentId = async (appointmentId: string) => {
  const response = await api.get(`/visits/appointment/${appointmentId}`);
  return response.data;
};

export const getVisitsByPatientId = async (patientId: string) => {
  const response = await api.get(`/visits/patient/${patientId}`);
  return response.data;
};

export const getVisitsByDoctorId = async (doctorId: string) => {
  const response = await api.get(`/visits/doctor/${doctorId}`);
  return response.data;
};

export const completeEncounter = async (visitId: string, encounterData: any) => {
  const response = await api.put(`/visits/${visitId}/encounter`, encounterData);
  return response.data;
};

export const handoverToDoctor = async (appointmentId: string, vitals: any[]) => {
  const response = await api.post(`/visits/handover`, {
    appointmentId: Number(appointmentId),
    vitals
  });
  return response.data;
};

export const recordSimpleVitals = async (appointmentId: string, vitals: any) => {
  const response = await api.post(`/vitals?appointmentId=${appointmentId}`, vitals);
  return response.data;
};

export const orderLabTest = async (visitId: string, testData: { testCode: string; testName: string; notes?: string }) => {
  const response = await api.post(`/visits/${visitId}/lab-tests`, testData);
  return response.data;
};

export const pauseConsultation = async (visitId: string) => {
  const response = await api.put(`/visits/${visitId}/pause`);
  return response.data;
};


