import type { Protector } from '@/features/protector/types/protector.types';

let counter = 0;
const nextId = () => `protector-${++counter}`;

export function createProtector(overrides?: Partial<Protector>): Protector {
  const id = nextId();
  return {
    id,
    name: `Test Protector ${counter}`,
    email: `protector-${counter}@test.com`,
    phone: '+1-555-0200',
    relationship: 'PARENT',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    user: {
      id: `user-p${counter}`,
      name: `Test Protector ${counter}`,
      email: `protector-${counter}@test.com`,
    },
    ...overrides,
  };
}
