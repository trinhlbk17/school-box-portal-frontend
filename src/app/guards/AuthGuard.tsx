import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { useCurrentUser } from "@/features/auth";
import { ROUTES } from "@/shared/constants/routes";

/**
 * Protects all routes requiring authentication.
 * 1. Checks for a session token in storage.
 * 2. Validates via GET /auth/me.
 * 3. Redirects to /login if invalid or missing.
 */
export function AuthGuard() {
  const { sessionToken, loadFromStorage } = useAuthStore();

  // On first render, attempt to restore token from storage
  const resolvedToken = sessionToken ?? loadFromStorage();

  const { data: user, isLoading, isError } = useCurrentUser();

  if (!resolvedToken) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
}
