import type { User } from "@/features/auth/types/auth.types";
import type { UserRole } from "@/shared/constants/roles";

/** Admin-enriched user with audit timestamps. */
export interface AdminUser extends User {
  createdAt: string;
  updatedAt: string;
}

/** Detailed user returned from GET /users/:id — includes role-specific metadata. */
export interface AdminUserDetail extends AdminUser {
  // Teacher
  classCount?: number;
  // Student
  studentCode?: string;
  className?: string;
  protectorCount?: number;
  // Protector
  assignedStudentCount?: number;
}

export interface CreateUserInput {
  email: string;
  name: string;
  role: UserRole;
  password: string; // MD5-hashed before sending
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
}

export interface RegeneratePasswordResponse {
  temporaryPassword: string;
}

export const USER_SORT_BY = {
  CREATED_AT: "createdAt",
  NAME: "name",
  EMAIL: "email",
} as const;

export type UserSortBy = (typeof USER_SORT_BY)[keyof typeof USER_SORT_BY];

export const USER_SORT_ORDER = {
  ASC: "asc",
  DESC: "desc",
} as const;

export type UserSortOrder =
  (typeof USER_SORT_ORDER)[keyof typeof USER_SORT_ORDER];

export interface UserQueryParams {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: UserSortBy;
  sortOrder?: UserSortOrder;
}
