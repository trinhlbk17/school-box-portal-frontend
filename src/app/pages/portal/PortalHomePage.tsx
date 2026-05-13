import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { ROLES } from "@/shared/constants/roles";

export function PortalHomePage() {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  if (user.role === ROLES.PROTECTOR) {
    return <Navigate to="/portal/students" replace />;
  }

  if (user.role === ROLES.STUDENT) {
    if (user.studentProfileId) {
      return <Navigate to={`/portal/students/${user.studentProfileId}`} replace />;
    }
    // Fallback if no profile ID (shouldn't happen for properly setup students)
    return (
      <div className="p-4 text-center text-muted-foreground">
        No student profile linked to your account.
      </div>
    );
  }

  // Fallback for other roles trying to access portal
  return <Navigate to="/" replace />;
}
