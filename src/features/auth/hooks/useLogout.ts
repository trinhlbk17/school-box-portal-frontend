import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { ROUTES } from "@/shared/constants/routes";
import type { AppError } from "@/shared/types/api.types";

/**
 * Mutation hook for logout.
 * On success: clears auth store, clears query cache, redirects to /login.
 */
export function useLogout() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<unknown, AppError>({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: () => {
      // Even if the API fails, clear local state so the user can leave
      logout();
      queryClient.clear();
      navigate(ROUTES.LOGIN, { replace: true });
    },
  });
}
