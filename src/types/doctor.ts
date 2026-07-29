export interface Doctor {

  id: number;

  name: string;

  email: string;

  phone: string;

  department: string;

  specialization: string;

  qualifications: string;

  consultationFee: number;

  experience: number;

  status: "Available" | "On Leave";

}