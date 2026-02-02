export type UserRole = "admin" | "sales" | "partner" | "influencer_manager" | "influencer";

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
  influencer_id?: string; // For influencer role - links to their influencer record
}

// Influencer Manager Auth
export interface InfluencerManagerLoginRequest {
  email: string;
  password: string;
}

export interface InfluencerManagerLoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "influencer_manager";
  };
}

// Influencer Personal Portal Auth
export interface InfluencerLoginRequest {
  email: string;
  code: string; // Unique access code for influencer
}

export interface InfluencerLoginResponse {
  success: boolean;
  token: string;
  influencer: {
    id: string;
    name: string;
    email: string;
    instagram_handle: string;
  };
}
