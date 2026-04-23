import { ROUTES } from "@/shared/constants/routes";

export const ROLES = {
  ADMIN: "ADMIN",
  TEACHER: "TEACHER",
  STUDENT: "STUDENT",
  PROTECTOR: "PROTECTOR",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

/** Roles that can access the Admin portal (/admin/*). */
export const ADMIN_ROLES: UserRole[] = [ROLES.ADMIN, ROLES.TEACHER];

/** Roles that can access the User portal (/portal/*). */
export const PORTAL_ROLES: UserRole[] = [ROLES.STUDENT, ROLES.PROTECTOR];

/** Default redirect path after login, by role. */
export const ROLE_REDIRECT: Record<UserRole, string> = {
  [ROLES.ADMIN]: ROUTES.ADMIN.ROOT,
  [ROLES.TEACHER]: ROUTES.ADMIN.MY_CLASSES,
  [ROLES.STUDENT]: ROUTES.PORTAL.ROOT,
  [ROLES.PROTECTOR]: ROUTES.PORTAL.ROOT,
};
