import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { render, userEvent } from '@/test/test-utils';
import { server } from '@/test/msw/server';
import { AlbumForm } from '@/features/album/components/AlbumForm';
import { createAlbum } from '@/test/factories';

const API_BASE = 'http://localhost:3000/api';
const CLASS_ID = 'class-album-001';

// Silence useToast in tests (it may not have a portal in jsdom)
vi.mock('@/shared/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

describe('AlbumForm', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    classId: CLASS_ID,
  };

  it('should_render_create_form_when_no_initial_data_provided', () => {
    render(<AlbumForm {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Create Album' })).toBeInTheDocument();
    expect(screen.getByLabelText(/album name/i)).toHaveValue('');
  });

  it('should_render_edit_form_with_prefilled_data_when_initial_data_provided', () => {
    const album = createAlbum({ name: 'Class Trip 2024', classId: CLASS_ID });
    render(<AlbumForm {...defaultProps} initialData={album} />);

    expect(screen.getByRole('heading', { name: 'Edit Album' })).toBeInTheDocument();
    expect(screen.getByLabelText(/album name/i)).toHaveValue('Class Trip 2024');
  });

  it('should_show_validation_error_when_name_is_empty', async () => {
    const user = userEvent.setup();
    render(<AlbumForm {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /create/i }));

    expect(await screen.findByText(/album name is required/i)).toBeInTheDocument();
  });

  it('should_call_create_mutation_when_submitting_new_album', async () => {
    let requestBody: Record<string, unknown> | null = null;
    server.use(
      http.post(`${API_BASE}/albums`, async ({ request }) => {
        requestBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json(
          { success: true, data: createAlbum({ name: requestBody.name as string, classId: CLASS_ID }) },
          { status: 201 },
        );
      }),
    );

    const user = userEvent.setup();
    render(<AlbumForm {...defaultProps} />);

    await user.type(screen.getByLabelText(/album name/i), 'Summer Camp Photos');
    await user.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(requestBody).toMatchObject({ name: 'Summer Camp Photos', classId: CLASS_ID });
    });
  });

  it('should_call_update_mutation_when_submitting_existing_album', async () => {
    const album = createAlbum({ id: 'album-edit-1', name: 'Old Album Name', classId: CLASS_ID });
    let requestBody: Record<string, unknown> | null = null;
    server.use(
      http.put(`${API_BASE}/albums/${album.id}`, async ({ request }) => {
        requestBody = await request.json() as Record<string, unknown>;
        return HttpResponse.json({ success: true, data: { ...album, name: requestBody.name } });
      }),
    );

    const user = userEvent.setup();
    render(<AlbumForm {...defaultProps} initialData={album} />);

    const nameInput = screen.getByLabelText(/album name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Album Name');
    await user.click(screen.getByRole('button', { name: /update|save/i }));

    await waitFor(() => {
      expect(requestBody).toMatchObject({ name: 'Updated Album Name' });
    });
  });
});
