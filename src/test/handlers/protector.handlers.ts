import { http, HttpResponse } from 'msw';
import { createProtector, createStudent } from '../factories';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

// protectorApi returns response.data directly (raw arrays/objects)
export const protectorHandlers = [
  // GET /api/protectors/my-students
  http.get(apiUrl('/protectors/my-students'), () => {
    return HttpResponse.json([createStudent(), createStudent()]);
  }),

  // GET /api/students/:studentId/protectors
  http.get(apiUrl('/students/:studentId/protectors'), () => {
    return HttpResponse.json([createProtector(), createProtector()]);
  }),

  // POST /api/protectors (create standalone)
  http.post(apiUrl('/protectors'), async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createProtector({ name: body.name as string, email: body.email as string }),
      { status: 201 },
    );
  }),

  // POST /api/students/:studentId/protectors (assign)
  http.post(apiUrl('/students/:studentId/protectors'), async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createProtector({ name: body.name as string }),
      { status: 201 },
    );
  }),

  // DELETE /api/students/:studentId/protectors/:protectorId
  http.delete(apiUrl('/students/:studentId/protectors/:protectorId'), () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
