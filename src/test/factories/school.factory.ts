import type { School } from '@/features/school/types/school.types';

let counter = 0;
const nextId = () => `school-${++counter}`;

export function createSchool(overrides?: Partial<School>): School {
  const id = nextId();
  return {
    id,
    name: `Test School ${counter}`,
    address: '123 Test Street',
    phone: '+1-555-0100',
    boxFolderId: null,
    deletedAt: null,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}
