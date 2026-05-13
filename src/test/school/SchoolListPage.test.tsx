import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { renderWithAuth } from '@/test/test-utils';
import { server } from '@/test/msw/server';
import { SchoolListPage } from '@/features/school/pages/SchoolListPage';
import { createAdmin, createSchool } from '@/test/factories';

const API_BASE = 'http://localhost:3000/api';
const adminUser = createAdmin();

describe('SchoolListPage', () => {
  it('should_render_school_names_when_api_returns_data', async () => {
    server.use(
      http.get(`${API_BASE}/schools`, () =>
        HttpResponse.json([
          createSchool({ name: 'Westfield Academy' }),
          createSchool({ name: 'Eastdale Primary' }),
        ]),
      ),
    );

    renderWithAuth(<SchoolListPage />, { user: adminUser });

    await waitFor(() => {
      expect(screen.getByText('Westfield Academy')).toBeInTheDocument();
      expect(screen.getByText('Eastdale Primary')).toBeInTheDocument();
    });
  });

  it('should_render_empty_state_when_no_schools_exist', async () => {
    server.use(
      http.get(`${API_BASE}/schools`, () => HttpResponse.json([])),
    );

    renderWithAuth(<SchoolListPage />, { user: adminUser });

    await waitFor(() => {
      expect(screen.getByText(/no school yet/i)).toBeInTheDocument();
    });
  });

  it('should_render_error_alert_when_api_returns_error', async () => {
    server.use(
      http.get(`${API_BASE}/schools`, () =>
        HttpResponse.json({ message: 'Server error' }, { status: 500 }),
      ),
    );

    renderWithAuth(<SchoolListPage />, { user: adminUser });

    await waitFor(() => {
      expect(screen.getByText(/failed to load schools/i)).toBeInTheDocument();
    });
  });

  it('should_render_add_school_button_in_page_header', async () => {
    server.use(
      http.get(`${API_BASE}/schools`, () => HttpResponse.json([])),
    );

    renderWithAuth(<SchoolListPage />, { user: adminUser });

    // Header should always show the Add School button
    expect(screen.getByRole('button', { name: /add school/i })).toBeInTheDocument();
  });
});
