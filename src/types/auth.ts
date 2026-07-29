export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  userId: number;
  username: string;
  fullName: string;
  role: string;
  token: string;
}