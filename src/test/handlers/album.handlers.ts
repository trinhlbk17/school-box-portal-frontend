import { http, HttpResponse } from 'msw';
import { AlbumStatus } from '@/features/album/types/album.types';
import { createAlbum, createAlbumImage } from '../factories';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

// albumApi uses SingleResponse<T> wrapper — returns response.data.data
// So handlers return { success: true, data: ... }
// Except getAlbums which uses PaginatedResponse
export const albumHandlers = [
  // GET /api/classes/:classId/albums (paginated)
  http.get(apiUrl('/classes/:classId/albums'), ({ params }) => {
    const albums = [
      createAlbum({ classId: params.classId as string, status: AlbumStatus.PUBLISHED }),
      createAlbum({ classId: params.classId as string }),
    ];
    return HttpResponse.json({
      success: true,
      data: albums,
      meta: { page: 1, limit: 20, total: albums.length },
    });
  }),

  // GET /api/albums/:id
  http.get(apiUrl('/albums/:id'), ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: createAlbum({ id: params.id as string }),
    });
  }),

  // POST /api/albums
  http.post(apiUrl('/albums'), async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      { success: true, data: createAlbum({ name: body.name as string, classId: body.classId as string }) },
      { status: 201 },
    );
  }),

  // PUT /api/albums/:id
  http.put(apiUrl('/albums/:id'), async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({
      success: true,
      data: createAlbum({ id: params.id as string, ...body }),
    });
  }),

  // DELETE /api/albums/:id
  http.delete(apiUrl('/albums/:id'), () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // POST /api/albums/:id/publish
  http.post(apiUrl('/albums/:id/publish'), ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: createAlbum({ id: params.id as string, status: AlbumStatus.PUBLISHED }),
    });
  }),

  // POST /api/albums/:id/archive
  http.post(apiUrl('/albums/:id/archive'), ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: createAlbum({ id: params.id as string, status: AlbumStatus.ARCHIVED }),
    });
  }),

  // POST /api/albums/:id/download-zip
  http.post(apiUrl('/albums/:id/download-zip'), () => {
    return new HttpResponse(new Blob(['zip-content'], { type: 'application/zip' }), {
      headers: { 'Content-Type': 'application/zip' },
    });
  }),

  // GET /api/albums/:albumId/images (corrected path — no double /api/)
  http.get(apiUrl('/albums/:albumId/images'), ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: [
        createAlbumImage({ albumId: params.albumId as string }),
        createAlbumImage({ albumId: params.albumId as string }),
      ],
    });
  }),

  // POST /api/albums/:albumId/images (corrected path — no double /api/)
  http.post(apiUrl('/albums/:albumId/images'), ({ params }) => {
    return HttpResponse.json(
      {
        success: true,
        data: [createAlbumImage({ albumId: params.albumId as string })],
      },
      { status: 201 },
    );
  }),

  // DELETE /api/album-images/:id (corrected path — no double /api/)
  http.delete(apiUrl('/album-images/:id'), () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/album-images/:id/thumbnail (corrected path)
  http.get(apiUrl('/album-images/:id/thumbnail'), () => {
    return new HttpResponse(new Blob(['thumbnail-bytes'], { type: 'image/jpeg' }), {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  }),

  // GET /api/album-images/:id/preview (corrected path)
  http.get(apiUrl('/album-images/:id/preview'), () => {
    return new HttpResponse(new Blob(['preview-bytes'], { type: 'image/jpeg' }), {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  }),

  // GET /api/album-images/:id/download (corrected path)
  http.get(apiUrl('/album-images/:id/download'), () => {
    return new HttpResponse(new Blob(['download-bytes'], { type: 'image/jpeg' }), {
      headers: { 'Content-Type': 'image/jpeg' },
    });
  }),
];
