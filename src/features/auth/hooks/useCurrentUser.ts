import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";

/**
 * Query hook that fetches the current user from /auth/me.
 * Only runs when a session token exists in the store.
 * Used by AuthGuard to validate the session on app startup.
 */
export function useCurrentUser() {
  const { sessionToken, user, setSession, rememberMe } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const freshUser = await authApi.getMe();
      // Keep store in sync with fresh user data
      if (sessionToken) {
        setSession(freshUser, sessionToken, rememberMe);
      }
      return freshUser;
    },
    enabled: !!sessionToken,
    staleTime: 5 * 60 * 1000,
    retry: false,
    initialData: user ?? undefined,
  });
}
