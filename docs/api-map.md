# Backend API Map — School Box Portal

> Source: `school-box-portal-backend/src/**/*.controller.ts`
> Global prefix: `/api`
> Auth: `x-session-id` header (session token)
> Response format: `{ success: true, data: ... }` or `{ success: true, data: [...], meta: { page, limit, total } }`

---

## Auth (`/api/auth`)

| Method | Endpoint | Auth | Roles | Description |
|--------|----------|------|-------|--------|
| POST | `/auth/login` | Public | — | Login with email + password |
| POST | `/auth/otp/request` | Public | — | Send OTP via email |
| POST | `/auth/otp/verify` | Public | — | Verify OTP → returns session |
| POST | `/auth/logout` | Session | All | Invalidate session |
| GET | `/auth/me` | Session | All | Get current user profile |
| POST | `/auth/password-change-request` | Session | All | Send OTP for password change |
| PUT | `/auth/password-change` | Session | All | Change password using OTP |

**Login flows:**
- Admin/Teacher: `POST /auth/login` (email + password)
- Student/Protector: `POST /auth/otp/request` → `POST /auth/otp/verify` (passwordless)

---

## Users (`/api/users`) — Admin only

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| GET | `/users` | ADMIN | User list (paginated, filterable) |
| POST | `/users` | ADMIN | Create new user |
| GET | `/users/:id` | ADMIN | User details |
| PATCH | `/users/:id` | ADMIN | Update user |
| PATCH | `/users/:id/deactivate` | ADMIN | Deactivate user |
| PATCH | `/users/:id/activate` | ADMIN | Reactivate user |
| POST | `/users/:id/regenerate-password` | ADMIN | Reset password |
| DELETE | `/users/:id` | ADMIN | Soft delete user |

---

## Schools (`/api/schools`) — Admin only

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| GET | `/schools` | ADMIN | School list |
| POST | `/schools` | ADMIN | Create school |
| GET | `/schools/:id` | ADMIN | School details |
| PUT | `/schools/:id` | ADMIN | Update school |
| DELETE | `/schools/:id` | ADMIN | Delete school |

---

## Classes (`/api/schools/:schoolId/classes`, `/api/classes`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| POST | `/schools/:schoolId/classes` | ADMIN | Create class |
| GET | `/schools/:schoolId/classes` | ADMIN, TEACHER | Class list (Teachers only see their own classes) |
| GET | `/classes/:id` | ADMIN, TEACHER | Class details |
| PUT | `/classes/:id` | ADMIN | Update class |
| DELETE | `/classes/:id` | ADMIN | Delete class |
| POST | `/classes/:id/teachers` | ADMIN | Assign teacher to class |
| DELETE | `/classes/:id/teachers/:userId` | ADMIN | Remove teacher from class |
| POST | `/classes/:id/promote` | ADMIN | Bulk class promotion |

---

## Students (`/api/students`, `/api/classes/:classId/students`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| POST | `/students` | ADMIN, TEACHER | Create student |
| GET | `/classes/:classId/students` | ADMIN, TEACHER | Student list in class (paginated) |
| GET | `/students/:id` | All (role-filtered) | Student details |
| PUT | `/students/:id` | ADMIN, TEACHER | Update student |
| DELETE | `/students/:id` | ADMIN | Soft delete |
| POST | `/students/:id/transfer` | ADMIN | Transfer class |
| POST | `/students/sync-folders` | ADMIN | Sync Box folders |

**Query params for GET `/classes/:classId/students`:**
- `page` (default: 1)
- `limit` (default: 20)
- `search` (search by name)
- `isActive` (true/false)

---

## Protectors (`/api/protectors`, `/api/students/:id/protectors`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| POST | `/protectors` | ADMIN, TEACHER | Create protector (with assignments) |
| GET | `/protectors/my-students` | PROTECTOR | Get list of own children |
| POST | `/students/:id/protectors` | ADMIN, TEACHER | Assign protector to student |
| DELETE | `/students/:id/protectors/:protectorId` | ADMIN, TEACHER | Remove protector |
| GET | `/students/:id/protectors` | ADMIN, TEACHER | Protector list of a student |

---

## Albums (`/api/albums`, `/api/classes/:classId/albums`)

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| POST | `/albums` | ADMIN | Create album |
| GET | `/classes/:classId/albums` | All (role-filtered) | Album list of a class |
| GET | `/albums/:id` | All (role-filtered) | Album details |
| PUT | `/albums/:id` | ADMIN | Update album |
| DELETE | `/albums/:id` | ADMIN | Soft delete |
| POST | `/albums/:id/publish` | ADMIN | DRAFT → PUBLISHED |
| POST | `/albums/:id/archive` | ADMIN | PUBLISHED → ARCHIVED |
| POST | `/albums/:id/download-zip` | All | Download watermarked ZIP |

**Album statuses:** `DRAFT` → `PUBLISHED` → `ARCHIVED`

---

## Album Images (`/api/albums/:id/images`, `/api/album-images`)

> ⚠️ **NOTE:** This controller has a hardcoded `api/` prefix in routes.
> If the global backend prefix is `/api`, the actual path will be `/api/api/...`
> **Needs to be verified with the backend before integration.**

| Method | Endpoint (as coded) | Roles | Description |
|--------|---------------------|-------|--------|
| POST | `api/albums/:id/images` | ADMIN, TEACHER | Upload images (max 20, multipart) |
| DELETE | `api/album-images/:id` | ADMIN | Delete image |
| GET | `api/album-images/:id/thumbnail` | All | Image thumbnail |
| GET | `api/album-images/:id/preview` | All (DRAFT restricted) | Full-size preview |
| GET | `api/album-images/:id/download` | All | Watermarked download |

**Visibility rules:**
- `DRAFT`: Only ADMIN and creator can see
- `PUBLISHED`: All roles with access to the class
- `ARCHIVED`: Visible but cannot be downloaded

---

## Box Integration (`/api/box`) — Admin only

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| GET | `/box/auth-url` | ADMIN | Get OAuth2 URL to connect Box |
| GET | `/box/callback` | Public | OAuth2 callback (redirect) |
| GET | `/box/status` | ADMIN | Box connection status |
| DELETE | `/box/disconnect` | ADMIN | Disconnect Box |
| GET | `/box/folders/:folderId/items` | ADMIN | Browse Box folder |

---

## Box Integration (`/api/box`) — Admin only

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| GET | `/box/status` | ADMIN | Check Box.com connection status |
| GET | `/box/auth-url` | ADMIN | Get OAuth authorization URL |
| DELETE | `/box/disconnect` | ADMIN | Disconnect Box integration |
| GET | `/box/folders/:folderId/items` | ADMIN | List items in a Box folder (optional `?itemType=folder|file`) |

**OAuth callback**: Backend redirects to `${FRONTEND_URL}/admin/settings/box?box_connected=true` after successful authorization.

---

## Audit (`/api/audit`) — Admin only

| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| GET | `/audit/logs` | ADMIN | Audit logs (paginated, filterable) |
| GET | `/audit/download-logs/album/:albumId` | ADMIN | Download logs for an album |

---

## Health

| Method | Endpoint | Auth | Description |
|--------|----------|------|--------|
| GET | `/health-check` | Public | System health status |

---

## Important Notes

1. **Response wrapper**: Every response is wrapped in `{ success: true, data: ... }`. Paginated responses include `meta` or spread directly `{ success, data, page, limit, total }`.

2. **Error format**: Backend uses `BusinessException` returning `{ code: "ERROR_CODE", message: "...", statusCode: 400 }`.

3. **Teacher scope**: Teachers can only access classes they are assigned to. Backend validates this via `ClassAccessService.validateTeacherAccess()`.

4. **Protector scope**: Protectors can only access classes their children belong to. Backend validates this via `ClassAccessService.validateProtectorAccess()`.
