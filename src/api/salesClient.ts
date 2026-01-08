import axios, { type AxiosInstance, type AxiosError } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

function createSalesApiClient(): AxiosInstance {
  const client = axios.create({
    baseURL: `${API_BASE_URL}/api/v1/sales`,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 30000,
  });

  // Request interceptor - add admin password (for now, until separate sales auth is implemented)
  client.interceptors.request.use((config) => {
    const password = "prometheus_admin_2024";
    config.params = {
      ...config.params,
      password: password,
    };
    return config;
  });

  // Response interceptor - handle errors
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  return client;
}

export const salesApi = createSalesApiClient();
