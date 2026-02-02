// =============================================================================
// LaunchPad - Auth Types
// =============================================================================

// User roles for backward compatibility with creator portal
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

// Creator Portal Auth (kept for backward compatibility)
export interface CreatorLoginRequest {
  email: string;
  code: string; // Unique access code for creator
}

export interface CreatorLoginResponse {
  success: boolean;
  token: string;
  creator: {
    id: string;
    name: string;
    email: string;
    instagram_handle: string;
  };
}
