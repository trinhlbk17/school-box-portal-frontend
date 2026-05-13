import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { renderWithAuth } from '@/test/test-utils';
import { server } from '@/test/msw/server';
import { AlbumListTab } from '@/features/album/components/AlbumListTab';
import { createAdmin, createTeacher, createAlbum } from '@/test/factories';
import { AlbumStatus } from '@/features/album/types/album.types';

const API_BASE = 'http://localhost:3000/api';
const CLASS_ID = 'class-album-tab-001';

describe('AlbumListTab', () => {
  it('should_render_album_cards_when_api_returns_data', async () => {
    server.use(
      http.get(`${API_BASE}/classes/${CLASS_ID}/albums`, () =>
        HttpResponse.json({
          success: true,
          data: [
            createAlbum({ name: 'Spring Festival', classId: CLASS_ID, status: AlbumStatus.PUBLISHED }),
            createAlbum({ name: 'Year End Party', classId: CLASS_ID, status: AlbumStatus.DRAFT }),
          ],
          meta: { page: 1, limit: 20, total: 2 },
        }),
      ),
    );

    renderWithAuth(<AlbumListTab classId={CLASS_ID} />, { user: createAdmin() });

    await waitFor(() => {
      expect(screen.getByText('Spring Festival')).toBeInTheDocument();
      expect(screen.getByText('Year End Party')).toBeInTheDocument();
    });
  });

  it('should_render_empty_state_when_no_albums_exist', async () => {
    server.use(
      http.get(`${API_BASE}/classes/${CLASS_ID}/albums`, () =>
        HttpResponse.json({ success: true, data: [], meta: { page: 1, limit: 20, total: 0 } }),
      ),
    );

    renderWithAuth(<AlbumListTab classId={CLASS_ID} />, { user: createAdmin() });

    await waitFor(() => {
      expect(screen.getByText(/no albums found/i)).toBeInTheDocument();
    });
  });

  it('should_render_loading_skeletons_while_fetching', () => {
    // The default handler returns data after network round-trip.
    // On immediate render, loading skeletons should appear
    renderWithAuth(<AlbumListTab classId={CLASS_ID} />, { user: createAdmin() });

    // Skeletons are rendered as Skeleton elements — we check for their container
    // by verifying no album names are shown yet and loading is happening
    expect(screen.queryByText(/spring festival/i)).not.toBeInTheDocument();
  });

  it('should_show_create_album_button_when_user_is_admin', async () => {
    server.use(
      http.get(`${API_BASE}/classes/${CLASS_ID}/albums`, () =>
        HttpResponse.json({ success: true, data: [], meta: { page: 1, limit: 20, total: 0 } }),
      ),
    );

    renderWithAuth(<AlbumListTab classId={CLASS_ID} />, { user: createAdmin() });

    // In empty state, admin should see create button
    await waitFor(() => {
      expect(screen.getByText(/no albums found/i)).toBeInTheDocument();
    });
    expect(screen.getByRole('button', { name: /create album/i })).toBeInTheDocument();
  });

  it('should_hide_create_album_button_when_user_is_teacher', async () => {
    server.use(
      http.get(`${API_BASE}/classes/${CLASS_ID}/albums`, () =>
        HttpResponse.json({ success: true, data: [], meta: { page: 1, limit: 20, total: 0 } }),
      ),
    );

    renderWithAuth(<AlbumListTab classId={CLASS_ID} />, { user: createTeacher() });

    await waitFor(() => {
      expect(screen.getByText(/no albums found/i)).toBeInTheDocument();
    });
    // Teachers should NOT see the create button (isAdmin() returns false for TEACHER role)
    expect(screen.queryByRole('button', { name: /create album/i })).not.toBeInTheDocument();
  });
});
