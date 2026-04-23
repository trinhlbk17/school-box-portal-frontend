/* eslint-disable react-refresh/only-export-components */

import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { PortalGuard } from "@/app/guards/PortalGuard";
import { PortalLayout } from "@/app/layouts/PortalLayout";

const PortalHomePage = lazy(() => import("@/app/pages/portal/PortalHomePage").then(m => ({ default: m.PortalHomePage })));
const PortalStudentsPage = lazy(() => import("@/app/pages/portal/PortalStudentsPage").then(m => ({ default: m.PortalStudentsPage })));
const PortalProfilePage = lazy(() => import("@/app/pages/portal/PortalProfilePage").then(m => ({ default: m.PortalProfilePage })));

const PageLoader = () => (
  <div className="flex items-center justify-center h-48">
    <div className="h-6 w-6 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
  </div>
);

export const portalRoutes: RouteObject = {
  element: <AuthGuard />,
  children: [
    {
      element: <PortalGuard />,
      children: [
        {
          element: <PortalLayout />,
          children: [
            {
              path: "/portal",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <PortalHomePage />
                </Suspense>
              ),
            },
            {
              path: "/portal/students",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <PortalStudentsPage />
                </Suspense>
              ),
            },
            {
              path: "/portal/profile",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <PortalProfilePage />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ],
};
