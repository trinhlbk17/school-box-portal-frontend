import { Navigate, useRoutes } from "react-router-dom";
import { authRoutes } from "@/app/routes/auth.routes";
import { adminRoutes } from "@/app/routes/admin.routes";
import { portalRoutes } from "@/app/routes/portal.routes";
import { NotFoundPage } from "@/app/pages/NotFoundPage";
import { useAuthStore } from "@/features/auth";
import { ROLE_REDIRECT } from "@/shared/constants/roles";
import { ROUTES } from "@/shared/constants/routes";
import { ErrorBoundary } from "react-error-boundary";
import { ServerErrorPage } from "@/app/pages/ServerErrorPage";
function RootRedirect() {
  const { user, sessionToken } = useAuthStore();

  if (!sessionToken) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  if (user) {
    return <Navigate to={ROLE_REDIRECT[user.role]} replace />;
  }
  // Token exists but user not loaded yet — AuthGuard will handle
  return <Navigate to={ROUTES.ADMIN.ROOT} replace />;
}

export function App() {
  const element = useRoutes([
    { path: "/", element: <RootRedirect /> },
    authRoutes,
    adminRoutes,
    portalRoutes,
    { path: "*", element: <NotFoundPage /> },
  ]);

  return (
    <ErrorBoundary FallbackComponent={({ error }) => <ServerErrorPage error={error} />}>
      {element}
    </ErrorBoundary>
  );
}
