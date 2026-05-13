import { http, HttpResponse } from 'msw';
import { createSchool } from '../factories';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

// schoolApi returns response.data directly (raw object/array, not wrapped)
export const schoolHandlers = [
  // GET /api/schools
  http.get(apiUrl('/schools'), () => {
    return HttpResponse.json([createSchool(), createSchool()]);
  }),

  // GET /api/schools/:id
  http.get(apiUrl('/schools/:id'), ({ params }) => {
    return HttpResponse.json(
      createSchool({ id: params.id as string }),
    );
  }),

  // POST /api/schools
  http.post(apiUrl('/schools'), async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createSchool({ name: body.name as string }),
      { status: 201 },
    );
  }),

  // PUT /api/schools/:id
  http.put(apiUrl('/schools/:id'), async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createSchool({ id: params.id as string, ...body }),
    );
  }),

  // DELETE /api/schools/:id
  http.delete(apiUrl('/schools/:id'), () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
