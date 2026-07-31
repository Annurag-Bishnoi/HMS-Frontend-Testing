import api from "./axios";

export interface BillItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Bill {
  id: number;
  patientId: number;
  patientName: string;
  department: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  paidAt: string | null;
  generatedBy: string;
  processedBy: string | null;
  items: BillItem[];
  taxPercentage?: number;
  discountAmount?: number;
  insuranceCoverageAmount?: number;
  patientPayableAmount?: number;
}

export interface PaymentRequest {
  processedBy: string;
  taxPercentage?: number;
  discountAmount?: number;
  insuranceCoverageAmount?: number;
}

export const billingService = {
  generateBill: async (request: any): Promise<Bill> => {
    const response = await api.post(`/billing/generate`, request);
    return response.data;
  },

  getAllBills: async (status?: string): Promise<Bill[]> => {
    const url = status ? `/billing/invoices?status=${status}` : `/billing/invoices`;
    const response = await api.get(url);
    return response.data;
  },

  processPayment: async (id: number, request: PaymentRequest): Promise<Bill> => {
    const response = await api.put(`/billing/${id}/pay`, request);
    return response.data;
  },

  getPatientBills: async (patientId: number): Promise<Bill[]> => {
    const response = await api.get(`/billing/patient/${patientId}`);
    return response.data;
  },
};
