import { http, HttpResponse } from 'msw';
import { createAdmin } from '../factories';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

export const authHandlers = [
  // POST /api/auth/login
  http.post(apiUrl('/auth/login'), () => {
    const user = createAdmin({ id: 'test-user-id', email: 'admin@test.com', name: 'Test Admin' });
    return HttpResponse.json({
      success: true,
      data: {
        user,
        sessionToken: 'test-session-token',
      },
    });
  }),

  // POST /api/auth/logout
  http.post(apiUrl('/auth/logout'), () => {
    return HttpResponse.json({ success: true, data: null });
  }),

  // GET /api/auth/me
  http.get(apiUrl('/auth/me'), () => {
    const user = createAdmin({ id: 'test-user-id', email: 'admin@test.com', name: 'Test Admin' });
    return HttpResponse.json({ success: true, data: user });
  }),
];
