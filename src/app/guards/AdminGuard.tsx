import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { ADMIN_ROLES } from "@/shared/constants/roles";
import { ROUTES } from "@/shared/constants/routes";

/**
 * Restricts /admin/* routes to ADMIN and TEACHER roles.
 * Must be nested inside AuthGuard (user is guaranteed to be set).
 */
export function AdminGuard() {
  const { user } = useAuthStore();

  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return <Navigate to={ROUTES.PORTAL.ROOT} replace />;
  }

  return <Outlet />;
}
