import axios, { type AxiosInstance, type AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Partner token storage
const PARTNER_TOKEN_KEY = "partner_token";
const PARTNER_ID_KEY = "partner_id";

export function getPartnerToken(): string | null {
  return localStorage.getItem(PARTNER_TOKEN_KEY);
}

export function getPartnerId(): string | null {
  return localStorage.getItem(PARTNER_ID_KEY);
}

export function setPartnerAuth(token: string, partnerId: string): void {
  localStorage.setItem(PARTNER_TOKEN_KEY, token);
  localStorage.setItem(PARTNER_ID_KEY, partnerId);
}

export function clearPartnerAuth(): void {
  localStorage.removeItem(PARTNER_TOKEN_KEY);
  localStorage.removeItem(PARTNER_ID_KEY);
}

export function isPartnerAuthenticated(): boolean {
  return !!getPartnerToken() && !!getPartnerId();
}

function createPartnerApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/partner`,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  // Request interceptor - add partner token
  client.interceptors.request.use((config) => {
    const token = getPartnerToken();
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
        clearPartnerAuth();
        window.location.href = "/partner/login";
      }
      return Promise.reject(error);
    }
  );

  return client;
}

export const partnerApi = createPartnerApiClient();
export { API_BASE_URL };
