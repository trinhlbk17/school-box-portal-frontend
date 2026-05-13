import type { Student } from '@/features/student/types/student.types';

let counter = 0;
const nextId = () => `student-${++counter}`;

export function createStudent(overrides?: Partial<Student>): Student {
  const id = nextId();
  return {
    id,
    name: `Test Student ${counter}`,
    dateOfBirth: '2010-06-15',
    gender: 'MALE',
    classId: 'class-1',
    isActive: true,
    boxFolderId: null,
    deletedAt: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    class: {
      id: 'class-1',
      name: '1A',
      grade: '1',
      academicYear: '2024-2025',
    },
    ...overrides,
  };
}
