# Backend Gaps & Issues — Needs Fixing Before Frontend Integration

> Discovered during frontend UX exploration (2026-04-21)

---

## 🔴 Critical: AlbumImageController Double Prefix Bug

**File:** `src/album/album-image.controller.ts`

**Problem:** Controller routes have a hardcoded `api/` prefix:
```typescript
@Post('api/albums/:id/images')     // line 44
@Delete('api/album-images/:id')    // line 119
@Get('api/album-images/:id/thumbnail')  // line 128
@Get('api/album-images/:id/preview')    // line 137
@Get('api/album-images/:id/download')   // line 147
```

But `main.ts` line 31 already sets `app.setGlobalPrefix('api')`.

**Result:** Actual routes will be `/api/api/albums/:id/images` — which is incorrect.

**Fix:** Remove `api/` prefix from decorator routes:
```typescript
@Post('albums/:id/images')
@Delete('album-images/:id')
@Get('album-images/:id/thumbnail')
@Get('album-images/:id/preview')
@Get('album-images/:id/download')
```

---

## 🟡 Missing: SharedFolder Controller

**Status:** Service exists (`shared-folder.service.ts`) but **no Controller**.

**Impact:** Frontend cannot call API to:
- List shared folders for school/class
- Browse contents of a shared folder
- Download files from a shared folder

**Needed endpoints:**
| Method | Endpoint | Roles | Description |
|--------|----------|-------|--------|
| GET | `/shared-folders?schoolId=X&classId=Y` | All | List shared folders |
| GET | `/shared-folders/:id/contents` | All (scope-filtered) | Browse folder contents |
| GET | `/shared-folders/:id/files/:fileId/download` | All | Download file |

**Temporary Workaround:** Hide the "Shared Folders" tab in the User Portal until the backend is implemented.

---

## 🟡 Missing: Student "Me" Endpoint

**Problem:** After Student login, we need to get `studentProfileId` to navigate.
Currently, we have to call `/auth/me` and hope the response contains `studentProfile.id`.

**Need to verify:** Does `GET /api/auth/me` return the `studentProfile` relation?

**If not**, a new endpoint is needed:
```
GET /api/students/me → returns StudentProfile of the current user
```

---

## 🟡 Missing: Dashboard Stats Endpoint

**Problem:** Dashboard needs aggregate stats (total schools, classes, students, albums).
Currently, we have to call multiple list endpoints and count them.

**Nice to have:**
```
GET /api/dashboard/stats → { schools: 5, classes: 20, students: 450, albums: 30 }
```

**Workaround:** Frontend aggregates manually from list endpoints (not ideal but acceptable).

---

## 🟡 Folder Browsing for Non-Admin Roles

**Problem:** `GET /api/box/folders/:folderId/items` is restricted to ADMIN only.
Students/Protectors need to browse Box folders (Subjects, Grades, Activities).

**Options:**
1. Expand roles for the existing endpoint (add STUDENT, PROTECTOR)
2. Create a new endpoint in StudentController: `GET /api/students/:id/folders/:type/contents`

**Option 2 is safer** because it validates access rights to the student profile before allowing browsing.

---

## 🟢 Info: Change Password Flow

**Current backend flow:**
1. `POST /api/auth/password-change-request` → sends OTP via email
2. `PUT /api/auth/password-change` → verifies OTP + changes password

**User requirement:** Avoid sending emails.

**Options:**
1. Backend adds an endpoint to change password using the old password (without OTP)
2. Temporarily hide the Change Password feature
3. Implement it but disable the send OTP button (Poor UX)

**Recommendation:** Temporarily hide Change Password in the frontend. Enable it when the backend is ready to send emails.

---

## Summary Priority

| Priority | Issue | Action |
|----------|-------|--------|
| 🔴 P0 | AlbumImage double prefix | Fix backend immediately |
| 🟡 P1 | SharedFolder controller | Backend implement later, FE hides tab |
| 🟡 P1 | Student /me endpoint | Verify /auth/me response format |
| 🟡 P2 | Dashboard stats | FE workaround acceptable |
| 🟡 P2 | Folder browsing roles | Backend implement later, FE hides tab |
| 🟢 P3 | Change Password | Temporarily hide feature |
