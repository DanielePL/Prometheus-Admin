import axios, { type AxiosInstance, type AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Influencer Manager token storage
const IM_TOKEN_KEY = "influencer_manager_token";
const IM_USER_KEY = "influencer_manager_user";

export interface InfluencerManagerUser {
  id: string;
  email: string;
  name: string;
  role: "influencer_manager";
}

export function getIMToken(): string | null {
  return localStorage.getItem(IM_TOKEN_KEY);
}

export function getIMUser(): InfluencerManagerUser | null {
  const data = localStorage.getItem(IM_USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setIMAuth(token: string, user: InfluencerManagerUser): void {
  localStorage.setItem(IM_TOKEN_KEY, token);
  localStorage.setItem(IM_USER_KEY, JSON.stringify(user));
}

export function clearIMAuth(): void {
  localStorage.removeItem(IM_TOKEN_KEY);
  localStorage.removeItem(IM_USER_KEY);
}

export function isIMAuthenticated(): boolean {
  return !!getIMToken() && !!getIMUser();
}

function createIMApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/influencer-manager`,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  // Request interceptor - add token
  client.interceptors.request.use((config) => {
    const token = getIMToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Response interceptor - handle auth errors
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        clearIMAuth();
        window.location.href = "/influencers/login";
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const influencerManagerApi = createIMApiClient();
export { API_BASE_URL };
