import axios from 'axios';
import { getToken } from '../utils/token';

const API_URL = 'https://hospital-management-system-production-ba1e.up.railway.app/api/ipd';

const getAuthHeaders = () => {
  const token = getToken();
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const getWards = async () => {
  const response = await axios.get(`${API_URL}/wards`, getAuthHeaders());
  return response.data;
};

export const getBeds = async () => {
  const response = await axios.get(`${API_URL}/beds`, getAuthHeaders());
  return response.data;
};

export const getBedsByWard = async (wardId: number) => {
  const response = await axios.get(`${API_URL}/wards/${wardId}/beds`, getAuthHeaders());
  return response.data;
};

export const requestAdmission = async (data: { patientId: number; admittingDoctorId: number; admissionDiagnosis: string }) => {
  const response = await axios.post(`${API_URL}/admissions`, data, getAuthHeaders());
  return response.data;
};

export const assignBed = async (admissionId: number, bedId: number) => {
  const response = await axios.put(`${API_URL}/admissions/${admissionId}/assign-bed`, { bedId }, getAuthHeaders());
  return response.data;
};

export const cancelAdmission = async (admissionId: number) => {
  const response = await axios.put(`${API_URL}/admissions/${admissionId}/cancel`, {}, getAuthHeaders());
  return response.data;
};

export const dischargePatient = async (admissionId: number, dischargeSummary: string) => {
  const response = await axios.put(`${API_URL}/admissions/${admissionId}/discharge`, { dischargeSummary }, getAuthHeaders());
  return response.data;
};

export const getAdmissionsByStatus = async (status?: string) => {
  const response = await axios.get(`${API_URL}/admissions${status ? `?status=${status}` : ''}`, getAuthHeaders());
  return response.data;
};

export const getPendingAdmissions = async () => {
  const response = await axios.get(`${API_URL}/admissions/pending`, getAuthHeaders());
  return response.data;
};

export const getDoctorAdmissions = async () => {
  const response = await axios.get(`${API_URL}/admissions/doctor`, getAuthHeaders());
  return response.data;
};

export const getAdmissionsByPatient = async (patientId: number | string) => {
  const response = await axios.get(`${API_URL}/admissions/patient/${patientId}`, getAuthHeaders());
  return response.data;
};

export const addDailyRound = async (admissionId: number, clinicalNotes: string) => {
  const response = await axios.post(`${API_URL}/admissions/${admissionId}/rounds`, { clinicalNotes }, getAuthHeaders());
  return response.data;
};

export const getDailyRounds = async (admissionId: number) => {
  const response = await axios.get(`${API_URL}/admissions/${admissionId}/rounds`, getAuthHeaders());
  return response.data;
};

export const addNursingChart = async (admissionId: number, data: any) => {
  const response = await axios.post(`${API_URL}/admissions/${admissionId}/charts`, data, getAuthHeaders());
  return response.data;
};

export const getNursingCharts = async (admissionId: number) => {
  const response = await axios.get(`${API_URL}/admissions/${admissionId}/charts`, getAuthHeaders());
  return response.data;
};
