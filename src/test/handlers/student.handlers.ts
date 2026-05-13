import { http, HttpResponse } from 'msw';
import { createStudent } from '../factories';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

// studentApi returns response.data directly (PaginatedResponse or raw Student)
export const studentHandlers = [
  // GET /api/classes/:classId/students (paginated)
  http.get(apiUrl('/classes/:classId/students'), ({ params }) => {
    const students = [
      createStudent({ classId: params.classId as string }),
      createStudent({ classId: params.classId as string }),
    ];
    return HttpResponse.json({
      success: true,
      data: students,
      meta: { page: 1, limit: 20, total: students.length },
    });
  }),

  // GET /api/students/:id
  http.get(apiUrl('/students/:id'), ({ params }) => {
    return HttpResponse.json(
      createStudent({ id: params.id as string }),
    );
  }),

  // POST /api/students
  http.post(apiUrl('/students'), async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createStudent({ name: body.name as string, classId: body.classId as string }),
      { status: 201 },
    );
  }),

  // PUT /api/students/:id
  http.put(apiUrl('/students/:id'), async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createStudent({ id: params.id as string, ...body }),
    );
  }),

  // DELETE /api/students/:id
  http.delete(apiUrl('/students/:id'), () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // POST /api/students/:id/transfer
  http.post(apiUrl('/students/:id/transfer'), async ({ params }) => {
    return HttpResponse.json(
      createStudent({ id: params.id as string }),
    );
  }),
];
