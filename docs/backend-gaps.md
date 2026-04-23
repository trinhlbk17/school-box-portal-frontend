# Backend Gaps & Issues — Needs Fixing Before Frontend Integration

> Source: `school-box-portal-backend/src/**/*.controller.ts`
> Last verified: 2026-04-22 (from live source code)

---

## ✅ RESOLVED: AlbumImageController Double Prefix Bug

**Status:** Fixed.
`album-image.controller.ts` now uses `@Controller()` without prefix.
Routes `@Post('albums/:id/images')`, `@Delete('album-images/:id')`, etc. are correct.

---

## ✅ RESOLVED: Missing TEACHER permission for creating Albums

**Status:** Fixed.
`album.controller.ts` line 51: `@Roles(UserRole.ADMIN, UserRole.TEACHER)` — Teachers can now create albums.

---

## 🟡 P1: SharedFolder controller missing

**Problem:** `SharedFolder` model exists in Prisma schema but no REST controller exposes it.

**Impact:** Cannot build the "Shared Folders" tab for students in the portal.

**Fix:** Backend needs to implement `SharedFolderController` with list/create/delete endpoints.

**Frontend workaround:** Hide the Shared Folders tab entirely until backend is ready.

---

## 🟡 P1: Student `/me` endpoint — verify response format

**Problem:** Students and Protectors use OTP login and call `GET /auth/me`. Need to confirm the response includes `studentProfile` (with `classId`) for students.

**Impact:** Portal routing depends on knowing which class a student belongs to.

**Fix:** Verify `GET /auth/me` response shape includes nested profile data.

---

## 🟡 P2: Dashboard stats endpoint missing

**Problem:** No `GET /dashboard/stats` endpoint. Dashboard needs counts (total schools, classes, students, albums).

**Impact:** Dashboard page cannot show aggregate statistics.

**Frontend workaround:** Aggregate counts from individual list endpoints (`GET /schools`, etc.) or show "Coming soon" for stats.

---

## 🟡 P2: Folder browsing restricted to ADMIN

**Problem:** `GET /box/folders/:folderId/items` is ADMIN-only. Students/Protectors cannot browse their Box folders.

**Impact:** Student document folders tab in portal won't work for non-admin users.

**Frontend workaround:** Hide the student folders tab for portal users. Show only for Admin in admin portal.

---

## 🟢 P3: Change Password requires OTP email

**Problem:** Password change flow requires OTP email (`POST /auth/password-change-request` → `PUT /auth/password-change`). No direct password change using current password is available.

**Frontend workaround:** Temporarily hide Change Password in the portal. Enable when email sending is ready.

---

## 📝 API Behavior Notes (for Frontend reference)

| Endpoint | Note |
|----------|------|
| `POST /schools` | **Max 1 school** — Backend throws `SCHOOL_LIMIT_REACHED` if a school already exists |
| `GET /schools` | Returns all schools (no pagination) |
| `GET /schools/:schoolId/classes` | Returns all classes (no pagination). Teachers auto-filtered to assigned classes only |
| `GET /classes/:id` | Includes `classTeachers[]` in response (no separate endpoint needed) |
| `DELETE /classes/:id` | **Hard delete** — no soft delete, cascades should be verified |
| `DELETE /schools/:id` | **Hard delete** — no soft delete |
| `POST /classes/:id/promote` | Batch promote students to another class (Admin only) |

---

## Summary Priority

| Priority | Issue | Status |
|----------|-------|--------|
| ~~🔴 P0~~ | ~~AlbumImage double prefix~~ | ✅ Resolved |
| ~~🟡 P1~~ | ~~Teacher Album Creation~~ | ✅ Resolved |
| 🟡 P1 | SharedFolder controller | Backend: implement later, FE hides tab |
| 🟡 P1 | Student /me endpoint | Verify /auth/me response format |
| 🟡 P2 | Dashboard stats | FE workaround acceptable |
| 🟡 P2 | Folder browsing roles | Backend: implement later, FE hides tab |
| 🟢 P3 | Change Password | Temporarily hide feature |
