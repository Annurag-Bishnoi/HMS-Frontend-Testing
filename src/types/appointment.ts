export interface Appointment {
  id: string;

  patientId: string;
  patientName: string;

  doctorId: string;
  doctorName: string;

  department: string;

  appointmentDate: string;
  appointmentTime: string;

  consultationType: "OPD" | "Follow-up" | "Emergency";

  reasonForVisit?: string;

  consultationFee?: number;

  paymentStatus?: string;

  status: string;

  notes?: string;
  
  tokenNumber?: string;
}