import api from "./axios";

export interface InventoryItem {
  inventoryItemId: number;
  cielConceptId: string;
  medicineName: string;
  totalStock: number;
  reorderLevel: number;
  isLowStock: boolean;
  nearestExpiryDate: string | null;
  isActive?: boolean;
  active?: boolean;
}

export interface MedicalConcept {
  id: number;
  cielId: string;
  conceptName: string;
  conceptClass: string;
}

export interface StockAdditionRequest {
  cielConceptId: string;
  batchNumber: string;
  quantity: number;
  expiryDate: string;
  supplierName: string;
  unitPrice: number;
}

export interface StockAdjustmentRequest {
  medicineId: number;
  quantity: number;
  reason: string;
}

export interface Prescription {
  prescriptionId: number;
  patient: {
    patientId: number;
    name: string;
  };
  doctor: {
    doctorId: number;
    name: string;
  };
  diagnosis: string;
  notes: string;
  status: string;
  createdAt: string;
  medications: Medication[];
}

export interface Medication {
  medicationId: number;
  medicineName: string;
  medicationCode: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: string;
  instructions: string;
  unitPrice?: number;
  totalPrice?: number;
}

export interface DispenseItem {
  medicineId: string;
  quantity: number;
}

export interface DispenseRequest {
  prescriptionId: number;
  items: DispenseItem[];
}

export interface DispenseResponse {
  status: string;
  ledgerUpdated: boolean;
}

export const pharmacyService = {
  getAllInventory: async (): Promise<InventoryItem[]> => {
    const response = await api.get("/pharmacy/inventory");
    return response.data;
  },

  getAlerts: async (): Promise<InventoryItem[]> => {
    const response = await api.get("/pharmacy/inventory/alerts");
    return response.data;
  },

  updateInventoryItem: async (id: number, data: { medicineName?: string; reorderLevel?: number }): Promise<InventoryItem> => {
    const response = await api.put(`/pharmacy/inventory/${id}`, data);
    return response.data;
  },

  deleteInventoryItem: async (id: number) => {
    const response = await api.delete(`/pharmacy/inventory/${id}`);
    return response.data;
  },

  toggleInventoryStatus: async (id: number, active: boolean) => {
    const response = await api.put(`/pharmacy/inventory/${id}/status?active=${active}`);
    return response.data;
  },

  addStock: async (data: StockAdditionRequest): Promise<InventoryItem> => {
    const response = await api.post("/pharmacy/inventory/add-batch", data);
    return response.data;
  },

  adjustStock: async (data: StockAdjustmentRequest): Promise<InventoryItem> => {
    const response = await api.put("/pharmacy/inventory/adjust", data);
    return response.data;
  },

  getPendingPrescriptions: async (): Promise<Prescription[]> => {
    const response = await api.get("/pharmacy/prescriptions/pending");
    return response.data;
  },

  dispenseMedicine: async (data: DispenseRequest): Promise<DispenseResponse> => {
    const response = await api.post("/pharmacy/dispense", data);
    return response.data;
  },

  getDispensedPrescriptions: async (): Promise<Prescription[]> => {
    const response = await api.get("/pharmacy/prescriptions/dispensed");
    return response.data;
  },

  searchMedications: async (query: string): Promise<MedicalConcept[]> => {
    const response = await api.get(`/medications/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};
