import type { Class, ClassTeacher } from '@/features/class/types/class.types';

let classCounter = 0;
let classTeacherCounter = 0;

export function createClass(overrides?: Partial<Class>): Class {
  const id = `class-${++classCounter}`;
  return {
    id,
    schoolId: 'school-1',
    name: `Class ${classCounter}A`,
    grade: `${classCounter}`,
    academicYear: '2024-2025',
    boxFolderId: null,
    deletedAt: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    classTeachers: [],
    ...overrides,
  };
}

export function createClassTeacher(overrides?: Partial<ClassTeacher>): ClassTeacher {
  const id = `class-teacher-${++classTeacherCounter}`;
  return {
    id,
    classId: 'class-1',
    userId: 'user-1',
    isHomeroom: false,
    deletedAt: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    user: {
      id: 'user-1',
      name: 'Test Teacher',
      email: 'teacher@test.com',
    },
    ...overrides,
  };
}
