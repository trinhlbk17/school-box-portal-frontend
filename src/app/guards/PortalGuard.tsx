import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth";
import { PORTAL_ROLES } from "@/shared/constants/roles";
import { ROUTES } from "@/shared/constants/routes";

/**
 * Restricts /portal/* routes to STUDENT and PROTECTOR roles.
 * Must be nested inside AuthGuard (user is guaranteed to be set).
 */
export function PortalGuard() {
  const { user } = useAuthStore();

  if (!user || !PORTAL_ROLES.includes(user.role)) {
    return <Navigate to={ROUTES.ADMIN.ROOT} replace />;
  }

  return <Outlet />;
}
