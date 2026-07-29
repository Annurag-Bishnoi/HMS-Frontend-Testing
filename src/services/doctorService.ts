import axios from "axios";
import type { Doctor } from "../types/doctor";

const API_URL = "http://localhost:8080/api/doctors";

export const doctorService = {

  getAllDoctors: async () => {
    const response = await axios.get<Doctor[]>(API_URL);
    return response.data;
  },

  getDoctorById: async (id: number) => {
    const response = await axios.get<Doctor>(`${API_URL}/${id}`);
    return response.data;
  },

  addDoctor: async (doctor: Doctor) => {
    const response = await axios.post(API_URL, doctor);
    return response.data;
  },

  updateDoctor: async (doctor: Doctor) => {
    const response = await axios.put(
      `${API_URL}/${doctor.id}`,
      doctor
    );

    return response.data;
  },

  deleteDoctor: async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
  },

};