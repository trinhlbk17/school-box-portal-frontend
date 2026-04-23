import type { RouteObject } from "react-router-dom";
import { LoginPage } from "@/features/auth/components/LoginPage";

export const authRoutes: RouteObject = {
  path: "/login",
  element: <LoginPage />,
};
