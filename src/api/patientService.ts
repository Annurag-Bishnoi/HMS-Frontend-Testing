import api from "./axios";

export interface Patient {
  id?: number;
  registrationNo?: string;
  name: string;
  age: number;
  gender: string;
  mobile: string;
  bloodGroup: string;
  address: string;
  department?: string;
  doctor?: string;
  status?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  active: boolean;
  insuranceProviderId?: number;
  insuranceProviderName?: string;
  policyNumber?: string;
  allergies?: { id: number; cielId: string; allergenName: string }[];
}

export interface InsuranceProvider {
  id: number;
  providerName: string;
  standardCoveragePercentage: number;
}

export const getPatients = async (): Promise<Patient[]> => {
  const response = await api.get("/patients");
  // Assuming our backend returns a paginated list inside 'content', or a direct array
  // We'll map backend fields to frontend fields as needed.
  const data = response.data.content || response.data || [];
  return data.map((p: any) => ({
    id: p.patientId,
    registrationNo: p.patientCode || p.registrationNo || `P-100${p.patientId}`,
    name: p.fullName || p.name,
    age: p.age || 25, // Mock age if dob isn't easily parsed here
    gender: p.gender,
    mobile: p.phone || p.mobile,
    bloodGroup: p.bloodGroup || "Unknown",
    address: p.address || "",
    department: "General", 
    doctor: "Not Assigned",
    status: p.active ? "Admitted" : "Discharged"
  }));
};

export const getPatientById = async (id: string): Promise<any> => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const getPatientByUserId = async (userId: string): Promise<any> => {
  const response = await api.get(`/patients/user/${userId}`);
  return response.data;
};

export const createPatient = async (patient: Partial<Patient>): Promise<any> => {
  // Map frontend payload back to backend expected fields
  const payload = {
    fullName: patient.name,
    phone: patient.mobile,
    gender: patient.gender?.toUpperCase() || "MALE",
    dateOfBirth: "1990-01-01", // Default since we don't have dob in form yet
    bloodGroup: patient.bloodGroup || "O+",
    address: patient.address || "",
    email: patient.email || (patient.name?.replace(/\s/g, '').toLowerCase() + "@hospital.local")
  };
  const response = await api.post("/patients/register", payload);
  // The backend register endpoint returns { message, patient, username, temporaryPassword }
  return response.data;
};

export const updatePatient = async (id: string, patient: Partial<Patient>): Promise<Patient> => {
  const payload = {
    fullName: patient.name,
    phone: patient.mobile,
    gender: patient.gender || "MALE",
    dateOfBirth: "1990-01-01",
    bloodGroup: patient.bloodGroup || "O+",
    address: patient.address || "",
    email: patient.name?.replace(/\s/g, '').toLowerCase() + "@hospital.local"
  };
  const response = await api.put(`/patients/${id}`, payload);
  return response.data;
};

export const deletePatient = async (id: string): Promise<void> => {
  // Soft delete by updating status to inactive
  await api.patch(`/patients/${id}/status`, { active: false });
};

export const resetPatientCredentials = async (id: string): Promise<any> => {
  const response = await api.post(`/patients/${id}/reset-credentials`);
  return response.data;
};

export const updatePatientStatus = async (
  patientId: string,
  active: boolean
): Promise<any> => {
  const response = await api.patch(`/patients/${patientId}/status`, { active });
  return response.data;
};

export const getInsuranceProviders = async (): Promise<InsuranceProvider[]> => {
  const response = await api.get(`/insurance-providers`);
  return response.data;
};

export const addAllergyToPatient = async (patientId: number, allergyName: string, severity: string, notes: string): Promise<Patient> => {
  const response = await api.post(`/patients/${patientId}/allergies`, { allergyName, severity, notes });
  return response.data;
};
