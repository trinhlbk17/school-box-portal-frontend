import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { Routes, Route } from 'react-router-dom';
import { renderWithAuth, render } from '@/test/test-utils';
import { server } from '@/test/msw/server';
import { useAuthStore } from '@/features/auth/stores/useAuthStore';
import { AuthGuard } from '@/app/guards/AuthGuard';
import { AdminGuard } from '@/app/guards/AdminGuard';
import { PortalGuard } from '@/app/guards/PortalGuard';
import { createAdmin, createStudentUser } from '@/test/factories';

const API_BASE = 'http://localhost:3000/api';

// ─── Helpers ───────────────────────────────────────────────────────────────────

/** Simple sentinel components to check which route rendered */
const AdminPage = () => <div>Admin Page</div>;
const PortalPage = () => <div>Portal Page</div>;
const LoginPage = () => <div>Login Page</div>;

describe('AuthGuard', () => {
  it('should_redirect_to_login_when_no_session_token', () => {
    // Ensure store is clean (no token)
    useAuthStore.setState({ user: null, sessionToken: null, rememberMe: false });

    renderWithAuth(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>,
      { route: '/admin' },
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
  });

  it('should_render_outlet_when_authenticated_and_auth_me_succeeds', async () => {
    const adminUser = createAdmin();
    server.use(
      http.get(`${API_BASE}/auth/me`, () =>
        HttpResponse.json({ success: true, data: adminUser }),
      ),
    );

    renderWithAuth(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>,
      { user: adminUser, route: '/admin' },
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });
  });

  it('should_redirect_to_login_when_auth_me_returns_401', async () => {
    server.use(
      http.get(`${API_BASE}/auth/me`, () =>
        HttpResponse.json({ success: false }, { status: 401 }),
      ),
    );

    // Set a token but no user, to force useCurrentUser to fetch /auth/me
    useAuthStore.setState({ user: null, sessionToken: 'invalid-token', rememberMe: false });

    // Has a token but server says it's invalid
    render(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
      </Routes>,
      { route: '/admin' },
    );

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
    });
  });
});

describe('AdminGuard', () => {
  it('should_redirect_student_to_portal_when_accessing_admin_route', async () => {
    const studentUser = createStudentUser();
    server.use(
      http.get(`${API_BASE}/auth/me`, () =>
        HttpResponse.json({ success: true, data: studentUser }),
      ),
    );

    renderWithAuth(
      <Routes>
        <Route path="/portal" element={<PortalPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
      </Routes>,
      { user: studentUser, route: '/admin' },
    );

    await waitFor(() => {
      expect(screen.getByText('Portal Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Admin Page')).not.toBeInTheDocument();
  });
});

describe('PortalGuard', () => {
  it('should_redirect_admin_to_admin_root_when_accessing_portal_route', async () => {
    const adminUser = createAdmin();
    server.use(
      http.get(`${API_BASE}/auth/me`, () =>
        HttpResponse.json({ success: true, data: adminUser }),
      ),
    );

    renderWithAuth(
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route element={<AuthGuard />}>
          <Route element={<PortalGuard />}>
            <Route path="/portal" element={<PortalPage />} />
          </Route>
        </Route>
      </Routes>,
      { user: adminUser, route: '/portal' },
    );

    await waitFor(() => {
      expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });
    expect(screen.queryByText('Portal Page')).not.toBeInTheDocument();
  });
});
