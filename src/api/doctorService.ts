import api from "./axios";
import type { Doctor } from "../types/doctor";

export const getDoctors = async (): Promise<Doctor[]> => {
  const response = await api.get("/doctors");
  const data = response.data.content || response.data || [];
  return data.map((d: any) => ({
    id: d.doctorId,
    name: d.fullName,
    email: d.email,
    phone: d.phone,
    department: d.department,
    specialization: d.specialization || d.department || "General",
    qualifications: d.qualifications || "",
    consultationFee: d.consultationFee || 0,
    experience: d.experience || 0,
    status: d.active ? "Active" : "Inactive"
  }));
};

export const getDoctorById = async (id: string): Promise<Doctor> => {
  const response = await api.get(`/doctors/${id}`);
  const d = response.data;
  return {
    id: d.doctorId,
    name: d.fullName,
    email: d.email,
    phone: d.phone,
    department: d.department,
    specialization: d.specialization || d.department || "General",
    qualifications: d.qualifications || "",
    consultationFee: d.consultationFee || 0,
    experience: d.experience || 0,
    status: d.active ? "Active" : "Inactive"
  };
};

export const getDoctorByUserId = async (userId: string): Promise<Doctor> => {
  const response = await api.get(`/doctors/user/${userId}`);
  const d = response.data;
  return {
    id: d.doctorId,
    name: d.fullName,
    email: d.email,
    phone: d.phone,
    department: d.department,
    specialization: d.specialization || d.department || "General",
    qualifications: d.qualifications || "",
    consultationFee: d.consultationFee || 0,
    experience: d.experience || 0,
    status: d.active ? "Active" : "Inactive"
  };
};

export const createDoctor = async (doctor: Partial<Doctor>): Promise<any> => {
  const payload = {
    fullName: doctor.name,
    department: doctor.department,
    phone: doctor.phone,
    email: doctor.email,
    experience: doctor.experience || 0,
    qualifications: doctor.qualifications,
    specialization: doctor.specialization,
    consultationFee: doctor.consultationFee,
  };
  const response = await api.post("/doctors/register", payload);
  return response.data;
};

export const updateDoctor = async (id: string, doctor: Partial<Doctor>): Promise<Doctor> => {
  const payload = {
    fullName: doctor.name,
    department: doctor.department,
    phone: doctor.phone,
    email: doctor.email,
    experience: doctor.experience || 0,
    qualifications: doctor.qualifications,
    specialization: doctor.specialization,
    consultationFee: doctor.consultationFee
  };
  const response = await api.put(`/doctors/${id}`, payload);
  
  if (doctor.status) {
    await api.patch(`/doctors/${id}/status`, { active: doctor.status === "Active" });
  }

  return response.data;
};

export const updateDoctorStatus = async (id: string, status: string): Promise<void> => {
  await api.patch(`/doctors/${id}/status`, { active: status === "Active" });
};

export const deleteDoctor = async (id: string): Promise<void> => {
  await api.patch(`/doctors/${id}/status`, { active: false });
};

export const resetDoctorCredentials = async (id: string): Promise<any> => {
  const response = await api.post(`/doctors/${id}/reset-credentials`);
  return response.data;
};
