import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { ROLE_REDIRECT } from "@/shared/constants/roles";
import type { LoginInput } from "@/features/auth/types/auth.types";
import type { AppError } from "@/shared/types/api.types";

/**
 * Mutation hook for login.
 * On success: stores session, populates auth store, redirects by role.
 */
export function useLogin() {
  const { setSession } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<
    Awaited<ReturnType<typeof authApi.login>>,
    AppError,
    LoginInput
  >({
    mutationFn: ({ email, password }) => authApi.login({ email, password }),
    onSuccess: (data, variables) => {
      setSession(data.user, data.sessionToken, variables.rememberMe);
      queryClient.setQueryData(["auth", "me"], data.user);
      navigate(ROLE_REDIRECT[data.user.role], { replace: true });
    },
  });
}
