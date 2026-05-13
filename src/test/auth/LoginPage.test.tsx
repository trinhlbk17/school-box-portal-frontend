import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { render, userEvent } from '@/test/test-utils';
import { server } from '@/test/msw/server';
import { LoginPage } from '@/features/auth/components/LoginPage';
import { createAdmin, createTeacher } from '@/test/factories';

// Mock navigate so we can assert redirects without a real router setup
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => mockNavigate };
});

// const API_BASE = 'http://localhost:3000/api'; // Removed due to lint error

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('should_render_form_elements_when_page_loads', () => {
    render(<LoginPage />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should_show_validation_errors_when_submitting_empty_form', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  it('should_show_invalid_email_error_when_email_format_is_wrong', async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'not-an-email');
    await user.type(screen.getByLabelText(/^password$/i), 'pass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    expect(await screen.findByText(/invalid email address/i)).toBeInTheDocument();
  });

  it('should_show_loading_state_when_login_request_is_pending', async () => {
    // Delay the login response so we can capture the loading state
    server.use(
      http.post(/\/api\/auth\/login/, async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return HttpResponse.json({ success: true, data: { user: createAdmin(), sessionToken: 'tok' } });
      }),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    // Button should be disabled / show loading during request
    const btn = await screen.findByRole('button', { name: /signing in/i });
    expect(btn).toBeDisabled();
  });

  it('should_show_error_banner_when_login_api_returns_401', async () => {
    server.use(
      http.post(/\/api\/auth\/login/, () =>
        HttpResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 }),
      ),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'wrong@test.com');
    await user.type(screen.getByLabelText(/^password$/i), 'wrongpass');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  it('should_redirect_to_admin_dashboard_when_admin_logs_in', async () => {
    server.use(
      http.post(/\/api\/auth\/login/, () =>
        HttpResponse.json({
          success: true,
          data: { user: createAdmin(), sessionToken: 'tok' },
        }),
      ),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin', expect.anything());
    });
  });

  it('should_redirect_to_my_classes_when_teacher_logs_in', async () => {
    server.use(
      http.post(/\/api\/auth\/login/, () =>
        HttpResponse.json({
          success: true,
          data: { user: createTeacher(), sessionToken: 'tok' },
        }),
      ),
    );

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText(/email/i), 'teacher@test.com');
    await user.type(screen.getByLabelText(/^password$/i), 'password');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/admin/my-classes', expect.anything());
    });
  });
});
