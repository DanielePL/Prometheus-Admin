import axios, { type AxiosInstance, type AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Influencer (personal portal) token storage
const INFLUENCER_TOKEN_KEY = "influencer_portal_token";
const INFLUENCER_DATA_KEY = "influencer_portal_data";

export interface InfluencerPortalUser {
  id: string;
  name: string;
  email: string;
  instagram_handle: string;
}

export function getInfluencerToken(): string | null {
  return localStorage.getItem(INFLUENCER_TOKEN_KEY);
}

export function getInfluencerData(): InfluencerPortalUser | null {
  const data = localStorage.getItem(INFLUENCER_DATA_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function setInfluencerAuth(token: string, influencer: InfluencerPortalUser): void {
  localStorage.setItem(INFLUENCER_TOKEN_KEY, token);
  localStorage.setItem(INFLUENCER_DATA_KEY, JSON.stringify(influencer));
}

export function clearInfluencerAuth(): void {
  localStorage.removeItem(INFLUENCER_TOKEN_KEY);
  localStorage.removeItem(INFLUENCER_DATA_KEY);
}

export function isInfluencerAuthenticated(): boolean {
  return !!getInfluencerToken() && !!getInfluencerData();
}

function createInfluencerApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/influencer-portal`,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  // Request interceptor - add token
  client.interceptors.request.use((config) => {
    const token = getInfluencerToken();
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
        clearInfluencerAuth();
        window.location.href = "/influencer/login";
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const influencerPortalApi = createInfluencerApiClient();
export { API_BASE_URL };
