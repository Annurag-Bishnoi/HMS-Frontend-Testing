import api from "./axios";

export const getLabStats = async (): Promise<any> => {
  const res = await api.get("/lab/stats");
  return res.data;
};

export const getAllLabTests = async (): Promise<any[]> => {
  const res = await api.get("/lab/tests");
  return Array.isArray(res.data) ? res.data : [];
};

export const getPendingLabTests = async (): Promise<any[]> => {
  const res = await api.get("/lab/tests/pending");
  return Array.isArray(res.data) ? res.data : [];
};

export const getLabTestsByStatus = async (status: string): Promise<any[]> => {
  const res = await api.get(`/lab/tests/status/${status}`);
  return Array.isArray(res.data) ? res.data : [];
};

export const getLabTestsByPatient = async (patientId: string): Promise<any[]> => {
  const res = await api.get(`/lab/tests/patient/${patientId}`);
  return Array.isArray(res.data) ? res.data : [];
};

export const startLabTest = async (testId: number): Promise<any> => {
  const res = await api.put(`/lab/tests/${testId}/start`);
  return res.data;
};

export const submitLabResult = async (testId: number, resultValue: string, remarks?: string, file?: File): Promise<any> => {
  const formData = new FormData();
  formData.append('resultValue', resultValue);
  if (remarks) formData.append('remarks', remarks);
  if (file) formData.append('file', file);
  
  const res = await api.post(`/lab/tests/${testId}/result`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const cancelLabTest = async (testId: number): Promise<any> => {
  const res = await api.put(`/lab/tests/${testId}/cancel`);
  return res.data;
};

export const markLabPaymentPaid = async (testId: number): Promise<any> => {
  const res = await api.put(`/lab/tests/${testId}/pay`);
  return res.data;
};

export const markSampleCollected = async (testId: number): Promise<any> => {
  const res = await api.put(`/lab/tests/${testId}/sample-collected`);
  return res.data;
};
