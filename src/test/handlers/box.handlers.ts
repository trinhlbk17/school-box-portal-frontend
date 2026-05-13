import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

// boxApi expects { success: true, data: { ... } }
export const boxHandlers = [
  // GET /api/box/status
  http.get(apiUrl('/box/status'), () => {
    return HttpResponse.json({
      success: true,
      data: {
        isConnected: true,
        boxUserId: 'box-user-123',
        expiresAt: '2025-12-31T00:00:00.000Z',
      }
    });
  }),

  // GET /api/box/auth-url
  http.get(apiUrl('/box/auth-url'), () => {
    return HttpResponse.json({
      success: true,
      data: {
        authUrl: 'https://account.box.com/api/oauth2/authorize?client_id=test',
      }
    });
  }),

  // DELETE /api/box/disconnect
  http.delete(apiUrl('/box/disconnect'), () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // GET /api/box/folders/:folderId/items
  http.get(apiUrl('/box/folders/:folderId/items'), ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: {
        folderId: params.folderId as string,
        folderName: 'Test Folder',
        items: [
          { id: 'file-1', name: 'image1.jpg', type: 'file', extension: 'jpg', size: 102400 },
          { id: 'folder-1', name: 'Subfolder', type: 'folder' },
        ],
      }
    });
  }),
];
