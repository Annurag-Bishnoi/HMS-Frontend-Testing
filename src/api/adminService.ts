import api from "./axios";

/* ── Roles ── */
export const getAllRoles = async (): Promise<any[]> => {
  const res = await api.get("/admin/roles");
  return Array.isArray(res.data) ? res.data : [];
};

/* ── Users ── */
export const getAllUsers = async (): Promise<any[]> => {
  const res = await api.get("/admin/users");
  return Array.isArray(res.data) ? res.data : [];
};

export const getUsersByRole = async (roleCode: string): Promise<any[]> => {
  const all = await getAllUsers();
  return all.filter((u: any) => u.roleCode === roleCode || u.role === roleCode);
};

export const getUserById = async (userId: number): Promise<any> => {
  const res = await api.get(`/admin/users/${userId}`);
  return res.data;
};

export const createStaffUser = async (payload: {
  fullName: string;
  username: string;
  password: string;
  email?: string;
  phone?: string;
  roleCode: string;
}): Promise<any> => {
  const res = await api.post("/admin/users", payload);
  return res.data;
};

export const updateUser = async (userId: number, payload: {
  fullName: string;
  email?: string;
  phone?: string;
}): Promise<any> => {
  const res = await api.put(`/admin/users/${userId}`, payload);
  return res.data;
};

export const updateUserStatus = async (userId: number, active: boolean): Promise<any> => {
  const res = await api.patch(`/admin/users/${userId}/status`, { active });
  return res.data;
};

export const lockUser = async (userId: number, locked: boolean): Promise<any> => {
  const res = await api.patch(`/admin/users/${userId}/lock`, { accountLocked: locked });
  return res.data;
};

export const resetUserPassword = async (userId: number, newPassword: string): Promise<any> => {
  const res = await api.patch(`/admin/users/${userId}/reset-password`, { newPassword });
  return res.data;
};

export const getAdminSummary = async (): Promise<any> => {
  const res = await api.get("/admin/dashboard/summary");
  return res.data;
};
