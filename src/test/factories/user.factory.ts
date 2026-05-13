import type { User } from '@/features/auth/types/auth.types';
import type { AdminUser } from '@/features/user/types/user.types';
import { ROLES } from '@/shared/constants/roles';

let counter = 0;
const nextId = () => `user-${++counter}`;

export function createUser(overrides?: Partial<User>): User {
  return {
    id: nextId(),
    email: `user-${counter}@test.com`,
    name: `Test User ${counter}`,
    role: ROLES.ADMIN,
    isActive: true,
    studentProfileId: undefined,
    ...overrides,
  };
}

export function createAdminUser(overrides?: Partial<AdminUser>): AdminUser {
  return {
    ...createUser(),
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

/** Shorthand: creates a User with ADMIN role */
export const createAdmin = (overrides?: Partial<User>) =>
  createUser({ role: ROLES.ADMIN, ...overrides });

/** Shorthand: creates a User with TEACHER role */
export const createTeacher = (overrides?: Partial<User>) =>
  createUser({ role: ROLES.TEACHER, ...overrides });

/** Shorthand: creates a User with STUDENT role */
export const createStudentUser = (overrides?: Partial<User>) =>
  createUser({ role: ROLES.STUDENT, ...overrides });

/** Shorthand: creates a User with PROTECTOR role */
export const createProtectorUser = (overrides?: Partial<User>) =>
  createUser({ role: ROLES.PROTECTOR, ...overrides });
