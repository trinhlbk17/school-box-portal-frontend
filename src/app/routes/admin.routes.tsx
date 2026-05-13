/* eslint-disable react-refresh/only-export-components */

import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import { AuthGuard } from "@/app/guards/AuthGuard";
import { AdminGuard } from "@/app/guards/AdminGuard";
import { AdminLayout } from "@/app/layouts/AdminLayout";
import { FeatureErrorBoundary } from "@/shared/components/FeatureErrorBoundary";

const AdminDashboard = lazy(() =>
  import("@/app/pages/admin/AdminDashboardPage").then((m) => ({
    default: m.AdminDashboardPage,
  }))
);

// School feature pages
const SchoolListPage = lazy(() =>
  import("@/features/school/pages/SchoolListPage").then((m) => ({
    default: m.SchoolListPage,
  }))
);
const SchoolDetailPage = lazy(() =>
  import("@/features/school/pages/SchoolDetailPage").then((m) => ({
    default: m.SchoolDetailPage,
  }))
);

// Class feature pages
const ClassDetailPage = lazy(() =>
  import("@/features/class/pages/ClassDetailPage").then((m) => ({
    default: m.ClassDetailPage,
  }))
);
const MyClassesPage = lazy(() =>
  import("@/features/class/pages/MyClassesPage").then((m) => ({
    default: m.MyClassesPage,
  }))
);

// Student feature pages
const StudentDetailPage = lazy(() =>
  import("@/features/student/pages/StudentDetailPage").then((m) => ({
    default: m.StudentDetailPage,
  }))
);

// Album feature pages
const AlbumDetailPage = lazy(() =>
  import("@/features/album/pages/AlbumDetailPage").then((m) => ({
    default: m.AlbumDetailPage,
  }))
);

// Phase 6: Audit, User, Box pages
const AuditLogPage = lazy(() =>
  import("@/features/audit/components/AuditLogPage").then((m) => ({
    default: m.AuditLogPage,
  }))
);
const UserListPage = lazy(() =>
  import("@/features/user/components/UserListPage").then((m) => ({
    default: m.UserListPage,
  }))
);
const BoxSettingsPage = lazy(() =>
  import("@/features/box/components/BoxSettingsPage").then((m) => ({
    default: m.BoxSettingsPage,
  }))
);

const PageLoader = () => (
  <div className="flex items-center justify-center h-48">
    <div className="h-6 w-6 rounded-full border-2 border-primary-600 border-t-transparent animate-spin" />
  </div>
);

const wrap = (Page: React.ComponentType) => (
  <FeatureErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Page />
    </Suspense>
  </FeatureErrorBoundary>
);

export const adminRoutes: RouteObject = {
  element: <AuthGuard />,
  children: [
    {
      element: <AdminGuard />,
      children: [
        {
          element: <AdminLayout />,
          children: [
            // Dashboard
            { path: "/admin", element: wrap(AdminDashboard) },

            // Schools (Admin only — AdminGuard + role check in sidebar)
            { path: "/admin/schools", element: wrap(SchoolListPage) },
            { path: "/admin/schools/:id", element: wrap(SchoolDetailPage) },

            // Classes
            { path: "/admin/classes/:id", element: wrap(ClassDetailPage) },
            { path: "/admin/classes/:classId/albums/:albumId", element: wrap(AlbumDetailPage) },

            // My Classes (Teacher landing)
            { path: "/admin/my-classes", element: wrap(MyClassesPage) },

            // Students
            { path: "/admin/students/:id", element: wrap(StudentDetailPage) },

            // Phase 6: User Management, Box Settings, Audit Logs
            { path: "/admin/users", element: wrap(UserListPage) },
            { path: "/admin/settings/box", element: wrap(BoxSettingsPage) },
            { path: "/admin/audit", element: wrap(AuditLogPage) },
          ],
        },
      ],
    },
  ],
};
