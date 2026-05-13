import { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import type { User } from '@/features/auth/types/auth.types';

// ─── Provider wrapper ─────────────────────────────────────────────────────────

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Initial route for MemoryRouter. Defaults to '/' */
  route?: string;
}

interface AuthRenderOptions extends CustomRenderOptions {
  /** Pre-seed auth store with this user. */
  user?: User;
  /** Pre-seed auth store with this session token. Defaults to 'test-session-token'. */
  sessionToken?: string;
}

/**
 * Creates a fresh QueryClient per test to prevent cache contamination.
 */
function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

/**
 * Custom render that wraps components with MemoryRouter + QueryClientProvider.
 * Use this in all component tests instead of RTL's render directly.
 *
 * @example
 * ```ts
 * import { render, screen } from '@/test/test-utils';
 * render(<MyComponent />, { route: '/admin/schools' });
 * expect(screen.getByText('Schools')).toBeInTheDocument();
 * ```
 */
function customRender(
  ui: ReactElement,
  { route = '/', ...renderOptions }: CustomRenderOptions = {},
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Renders a component with a pre-seeded authenticated auth store.
 * Useful for testing components that require a logged-in user without
 * going through the login flow.
 *
 * The auth store is seeded synchronously before render. The global
 * setup.ts already resets the store after each test, so no manual
 * cleanup is needed.
 *
 * @example
 * ```ts
 * import { renderWithAuth, screen } from '@/test/test-utils';
 * import { createAdmin } from '@/test/factories';
 *
 * const user = createAdmin();
 * renderWithAuth(<MyProtectedComponent />, { user });
 * ```
 */
function renderWithAuth(
  ui: ReactElement,
  { user, sessionToken = 'test-session-token', ...renderOptions }: AuthRenderOptions = {},
) {
  if (user) {
    useAuthStore.setState({
      user,
      sessionToken,
      rememberMe: false,
    });
  }
  return customRender(ui, renderOptions);
}

// Re-export everything from RTL so tests only need to import from here
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { customRender as render, renderWithAuth, userEvent };
