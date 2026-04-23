export const ROUTES = {
  LOGIN: "/login",
  ADMIN: {
    ROOT: "/admin",
    SCHOOLS: "/admin/schools",
    SCHOOL_DETAIL: (id: string) => `/admin/schools/${id}`,
    CLASSES: "/admin/classes",
    CLASS_DETAIL: (id: string) => `/admin/classes/${id}`,
    STUDENTS: "/admin/students",
    STUDENT_DETAIL: (id: string) => `/admin/students/${id}`,
    /** @deprecated use STUDENT_DETAIL(id) — kept for reference */
    STUDENT_DETAIL_NESTED: (classId: string, studentId: string) =>
      `/admin/classes/${classId}/students/${studentId}`,
    ALBUM_DETAIL: (classId: string, albumId: string) =>
      `/admin/classes/${classId}/albums/${albumId}`,
    MY_CLASSES: "/admin/my-classes",
    USERS: "/admin/users",
    SETTINGS_BOX: "/admin/settings/box",
    AUDIT: "/admin/audit",
  },
  PORTAL: {
    ROOT: "/portal",
    STUDENTS: "/portal/students",
    STUDENT_VIEW: (id: string) => `/portal/students/${id}`,
    ALBUM_VIEW: (studentId: string, albumId: string) =>
      `/portal/students/${studentId}/albums/${albumId}`,
    PROFILE: "/portal/profile",
  },
} as const;
