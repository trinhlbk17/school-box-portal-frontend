// Setup file: runs before every test file
// 1. Extend expect with jest-dom DOM matchers
import '@testing-library/jest-dom/vitest';

// 2. Mock import.meta.env BEFORE any modules load
//    (prevents env.ts Zod validation from throwing)
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_BASE_URL: 'http://localhost:3000/api',
    VITE_APP_NAME: 'School Box Portal (Test)',
    MODE: 'test',
    DEV: false,
    PROD: false,
    SSR: false,
  },
  writable: true,
  configurable: true,
});

// 3. MSW server lifecycle
import { server } from './msw/server';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

afterEach(() => {
  server.resetHandlers();
  cleanup();

  // Reset Zustand auth store between tests
  // Uses setState directly to avoid triggering storage side-effects
  void import('@/features/auth/stores/useAuthStore').then(({ useAuthStore }) => {
    useAuthStore.setState({
      user: null,
      sessionToken: null,
      rememberMe: false,
    });
  });
  // Clear any leftover storage tokens
  localStorage.clear();
  sessionStorage.clear();
});

afterAll(() => server.close());
