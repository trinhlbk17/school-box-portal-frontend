import { apiClient } from "@/shared/lib/apiClient";
import type { ApiResponse } from "@/shared/types/api.types";
import type { LoginInput, LoginResponse, User } from "@/features/auth/types/auth.types";

export const authApi = {
  /**
   * Authenticates a user with email and password.
   * Returns the user object and a session token.
   */
  login: (input: Omit<LoginInput, "rememberMe">) =>
    apiClient
      .post<ApiResponse<LoginResponse>>("/auth/login", input)
      .then((r) => r.data.data),

  /**
   * Invalidates the current session on the backend.
   */
  logout: () =>
    apiClient.post<ApiResponse<null>>("/auth/logout").then((r) => r.data),

  /**
   * Returns the currently authenticated user's profile.
   * Used to validate session on app startup.
   */
  getMe: () =>
    apiClient.get<ApiResponse<User>>("/auth/me").then((r) => r.data.data),
};
