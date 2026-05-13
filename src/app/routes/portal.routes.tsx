/* eslint-disable react-refresh/only-export-components */
import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { PortalGuard } from "@/app/guards/PortalGuard";
import { PortalLayout } from "@/app/layouts/PortalLayout";

const PortalHomePage = lazy(() => import("@/app/pages/portal/PortalHomePage").then(m => ({ default: m.PortalHomePage })));
const MyStudentsPage = lazy(() => import("@/features/portal/pages/MyStudentsPage").then(m => ({ default: m.MyStudentsPage })));
const StudentViewPage = lazy(() => import("@/features/portal/pages/StudentViewPage").then(m => ({ default: m.StudentViewPage })));
const AlbumViewPage = lazy(() => import("@/features/portal/pages/AlbumViewPage").then(m => ({ default: m.AlbumViewPage })));
const MyProfilePage = lazy(() => import("@/features/portal/pages/MyProfilePage").then(m => ({ default: m.MyProfilePage })));
const ChangePasswordPage = lazy(() => import("@/features/portal/pages/ChangePasswordPage").then(m => ({ default: m.ChangePasswordPage })));

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
                  <MyStudentsPage />
                </Suspense>
              ),
            },
            {
              path: "/portal/students/:studentId",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <StudentViewPage />
                </Suspense>
              ),
            },
            {
              path: "/portal/albums/:albumId",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <AlbumViewPage />
                </Suspense>
              ),
            },
            {
              path: "/portal/profile",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <MyProfilePage />
                </Suspense>
              ),
            },
            {
              path: "/portal/change-password",
              element: (
                <Suspense fallback={<PageLoader />}>
                  <ChangePasswordPage />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ],
};
