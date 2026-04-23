import axios from "axios";
import { env } from "@/shared/lib/env";
import { normalizeApiError } from "@/shared/lib/normalizeApiError";

export const apiClient = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
  },
});

/** Request interceptor — injects x-session-id from auth store. */
apiClient.interceptors.request.use((config) => {
  // Lazy import to avoid circular dependency
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { useAuthStore } = require("@/features/auth/stores/useAuthStore");
  const token: string | null = useAuthStore.getState().sessionToken;
  if (token) {
    config.headers["x-session-id"] = token;
  }
  return config;
});

/** Response interceptor — normalize errors, handle 401 auto-logout. */
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Lazy import to avoid circular dependency
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useAuthStore } = require("@/features/auth/stores/useAuthStore");
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(normalizeApiError(error));
  },
);
