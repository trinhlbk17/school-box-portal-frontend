## ADDED Requirements

### Requirement: MSW server instance
The project SHALL have a `src/test/msw/server.ts` that creates an MSW `setupServer()` instance with all handlers pre-loaded.

#### Scenario: Server starts with all handlers
- **WHEN** the MSW server is imported and started
- **THEN** it intercepts HTTP requests matching all defined handler patterns

### Requirement: URL construction helper
All MSW handlers SHALL use a shared `apiUrl(path)` helper that prepends the test API base URL to construct full URLs for matching.

#### Scenario: Consistent URL matching
- **WHEN** a handler uses `apiUrl("/schools")`
- **THEN** it matches requests to `http://localhost:3000/api/schools`

### Requirement: Auth handlers
The project SHALL have MSW handlers for auth endpoints (`POST /auth/login`, `POST /auth/logout`, `GET /auth/me`).

#### Scenario: Login returns user and token
- **WHEN** `POST /auth/login` is intercepted
- **THEN** it returns `{ success: true, data: { user: ..., sessionToken: "test-session" } }`

#### Scenario: Get current user
- **WHEN** `GET /auth/me` is intercepted
- **THEN** it returns `{ success: true, data: { id, email, name, role } }`

### Requirement: School handlers
The project SHALL have MSW handlers for all 5 school CRUD endpoints.

#### Scenario: List schools
- **WHEN** `GET /schools` is intercepted
- **THEN** it returns an array of school objects

### Requirement: Class handlers
The project SHALL have MSW handlers for 7 class endpoints including teacher assignment.

#### Scenario: Get classes by school
- **WHEN** `GET /schools/:schoolId/classes` is intercepted
- **THEN** it returns an array of class objects

### Requirement: Student handlers
The project SHALL have MSW handlers for student CRUD endpoints.

#### Scenario: List students in class
- **WHEN** `GET /classes/:classId/students` is intercepted
- **THEN** it returns a paginated response with student data

### Requirement: Protector handlers
The project SHALL have MSW handlers for protector endpoints including `GET /protectors/my-students`.

#### Scenario: My students
- **WHEN** `GET /protectors/my-students` is intercepted
- **THEN** it returns an array of student objects for the protector

### Requirement: Album handlers
The project SHALL have MSW handlers for album CRUD, status transitions, and image management endpoints.

#### Scenario: Album with images
- **WHEN** `GET /albums/:id` is intercepted
- **THEN** it returns `{ success: true, data: { album object } }`

#### Scenario: Image endpoints use correct paths
- **WHEN** image endpoints are defined
- **THEN** they use `/albums/:id/images` and `/album-images/:id/*` (no double `/api/` prefix)

### Requirement: User management handlers
The project SHALL have MSW handlers for 8 user CRUD and status endpoints.

#### Scenario: List users with pagination
- **WHEN** `GET /users` is intercepted
- **THEN** it returns a paginated response with user data

### Requirement: Box integration handlers
The project SHALL have MSW handlers for 4 Box.com endpoints.

#### Scenario: Box status
- **WHEN** `GET /box/status` is intercepted
- **THEN** it returns a connection status object

### Requirement: Audit log handlers
The project SHALL have an MSW handler for `GET /audit/logs`.

#### Scenario: Audit logs
- **WHEN** `GET /audit/logs` is intercepted
- **THEN** it returns a paginated response with audit log entries

### Requirement: Handler barrel export
All handlers SHALL be combined and re-exported from `src/test/handlers/index.ts`.

#### Scenario: Single handlers array
- **WHEN** `handlers` is imported from `@/test/handlers`
- **THEN** it contains all handler definitions from all domains

### Requirement: Correct response shapes
Each handler SHALL return the response shape that matches what the corresponding API module expects after Axios processing.

#### Scenario: Wrapped response for authApi
- **WHEN** auth handlers return data
- **THEN** they use `{ success: true, data: ... }` format (because `authApi` unwraps `r.data.data`)

#### Scenario: Raw response for schoolApi
- **WHEN** school handlers return data
- **THEN** they return raw objects/arrays (because `schoolApi` returns `response.data` directly)

### Requirement: Album API prefix fix
The `albumApi.ts` SHALL be fixed to remove the erroneous `/api/` prefix from image endpoints.

#### Scenario: Correct image upload path
- **WHEN** `albumApi.uploadImages()` is called
- **THEN** the request URL is `{baseURL}/albums/:id/images` (not `{baseURL}/api/albums/:id/images`)

#### Scenario: Correct image operation paths
- **WHEN** `albumApi.deleteImage()`, `getThumbnail()`, `getPreview()`, or `downloadImage()` are called
- **THEN** request URLs use `/album-images/:id/*` (not `/api/album-images/:id/*`)
