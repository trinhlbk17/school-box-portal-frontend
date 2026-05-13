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
apiClient.interceptors.request.use(async (config) => {
  // Lazy import to avoid circular dependency
  const { useAuthStore } = await import("@/features/auth/stores/useAuthStore");
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
    // Do not trigger auto-logout if the 401 is from the login endpoint itself
    if (error.response?.status === 401 && !error.config?.url?.includes("/auth/login")) {
      // Lazy import to avoid circular dependency
      const { useAuthStore } = await import("@/features/auth/stores/useAuthStore");
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(normalizeApiError(error));
  },
);
