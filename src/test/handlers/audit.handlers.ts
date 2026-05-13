import { http, HttpResponse } from 'msw';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

// auditApi returns response.data directly (PaginatedResponse)
export const auditHandlers = [
  // GET /api/audit/logs
  http.get(apiUrl('/audit/logs'), () => {
    return HttpResponse.json({
      success: true,
      data: [
        {
          id: 'log-1',
          logType: 'LOGIN',
          userId: 'user-1',
          userName: 'Test Admin',
          userEmail: 'admin@test.com',
          target: undefined,
          details: undefined,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      meta: { page: 1, limit: 20, total: 1 },
    });
  }),

  // GET /api/audit/download-logs/album/:albumId
  http.get(apiUrl('/audit/download-logs/album/:albumId'), () => {
    return HttpResponse.json({
      success: true,
      data: [],
      meta: { page: 1, limit: 20, total: 0 },
    });
  }),
];
