export type UserRole = "admin" | "sales" | "partner";

export interface LoginRequest {
  email: string;
  user_id: string;
}

export interface LoginResponse {
  success: boolean;
  session_token: string;
  email: string;
  role?: UserRole;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
}
