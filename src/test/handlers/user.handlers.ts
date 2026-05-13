import { http, HttpResponse } from 'msw';
import { createAdminUser } from '../factories';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

// userApi returns response.data directly (PaginatedResponse or raw AdminUser)
export const userHandlers = [
  // GET /api/users (paginated)
  http.get(apiUrl('/users'), () => {
    const users = [createAdminUser(), createAdminUser()];
    return HttpResponse.json({
      success: true,
      data: users,
      meta: { page: 1, limit: 20, total: users.length },
    });
  }),

  // GET /api/users/:id
  http.get(apiUrl('/users/:id'), ({ params }) => {
    return HttpResponse.json(
      createAdminUser({ id: params.id as string }),
    );
  }),

  // POST /api/users
  http.post(apiUrl('/users'), async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createAdminUser({ email: body.email as string, name: body.name as string }),
      { status: 201 },
    );
  }),

  // PATCH /api/users/:id
  http.patch(apiUrl('/users/:id'), async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createAdminUser({ id: params.id as string, ...body }),
    );
  }),

  // PATCH /api/users/:id/deactivate
  http.patch(apiUrl('/users/:id/deactivate'), ({ params }) => {
    return HttpResponse.json(
      createAdminUser({ id: params.id as string, isActive: false }),
    );
  }),

  // PATCH /api/users/:id/activate
  http.patch(apiUrl('/users/:id/activate'), ({ params }) => {
    return HttpResponse.json(
      createAdminUser({ id: params.id as string, isActive: true }),
    );
  }),

  // POST /api/users/:id/regenerate-password
  http.post(apiUrl('/users/:id/regenerate-password'), () => {
    return HttpResponse.json({ temporaryPassword: 'TempPass123!' });
  }),

  // DELETE /api/users/:id
  http.delete(apiUrl('/users/:id'), () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
