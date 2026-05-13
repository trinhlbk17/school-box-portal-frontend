import { http, HttpResponse } from 'msw';
import { createClass, createClassTeacher } from '../factories';

const API_BASE = 'http://localhost:3000/api';
const apiUrl = (path: string) => `${API_BASE}${path}`;

// classApi returns response.data directly (raw objects, not wrapped)
export const classHandlers = [
  // GET /api/schools/:schoolId/classes
  http.get(apiUrl('/schools/:schoolId/classes'), ({ params }) => {
    return HttpResponse.json([
      createClass({ schoolId: params.schoolId as string }),
      createClass({ schoolId: params.schoolId as string }),
    ]);
  }),

  // GET /api/classes/:id
  http.get(apiUrl('/classes/:id'), ({ params }) => {
    return HttpResponse.json(
      createClass({ id: params.id as string }),
    );
  }),

  // POST /api/schools/:schoolId/classes
  http.post(apiUrl('/schools/:schoolId/classes'), async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createClass({ schoolId: params.schoolId as string, name: body.name as string }),
      { status: 201 },
    );
  }),

  // PUT /api/classes/:id
  http.put(apiUrl('/classes/:id'), async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json(
      createClass({ id: params.id as string, ...body }),
    );
  }),

  // DELETE /api/classes/:id
  http.delete(apiUrl('/classes/:id'), () => {
    return new HttpResponse(null, { status: 204 });
  }),

  // POST /api/classes/:classId/teachers
  http.post(apiUrl('/classes/:classId/teachers'), async ({ params }) => {
    return HttpResponse.json(
      createClassTeacher({ classId: params.classId as string }),
      { status: 201 },
    );
  }),

  // DELETE /api/classes/:classId/teachers/:userId
  http.delete(apiUrl('/classes/:classId/teachers/:userId'), () => {
    return new HttpResponse(null, { status: 204 });
  }),
];
