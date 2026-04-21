# Login & Auth Flow

> All roles use password login (current phase)
> OTP flow temporarily skipped (to avoid sending emails)

---

## Login Page (`/login`)

**URL:** `/login`

**Form fields:**
- Email (text input)
- Password (password input)  
- Keep me logged in (checkbox)

**Submit:** `POST /api/auth/login`
```json
{
  "email": "admin@school.com",
  "password": "secret123"
}
```

**Success response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "...",
      "name": "...",
      "role": "ADMIN"
    },
    "sessionToken": "clx..."
  }
}
```

**After login:**
1. Save `sessionToken` to storage (localStorage if keepMeLogin, else sessionStorage)
2. Save `user` to Zustand auth store
3. Redirect by role:
   - `ADMIN` → `/admin`
   - `TEACHER` → `/admin/my-classes`
   - `STUDENT` → `/portal`
   - `PROTECTOR` → `/portal`

**Error handling:**
- 400 Invalid credentials → display "Incorrect email or password"
- 400 Account inactive → display "Account has been deactivated"

---

## Auth Guard Logic

```
User visits any page
    │
    ├── Has session token in storage?
    │   ├── No → redirect to /login
    │   └── Yes → Call GET /api/auth/me
    │       ├── 200 OK → set user in store, continue
    │       └── 401 → clear token, redirect to /login
    │
    ├── Route is /admin/* ?
    │   ├── User role is ADMIN or TEACHER → allow
    │   └── Otherwise → redirect to /portal
    │
    └── Route is /portal/* ?
        ├── User role is STUDENT or PROTECTOR → allow
        └── Otherwise → redirect to /admin
```

---

## Session Persistence

**On app startup (App.tsx):**
1. Check localStorage/sessionStorage for `sessionToken`
2. If found → `GET /api/auth/me` to validate
3. If valid → populate auth store, render app
4. If invalid (401) → clear storage, show login

**On 401 response (Axios interceptor):**
1. Clear auth store
2. Clear storage
3. Redirect to `/login`

---

## Logout

**Action:** Click "Logout" in profile dropdown

**Flow:**
1. `POST /api/auth/logout` (header: x-session-id)
2. Clear auth store
3. Clear localStorage/sessionStorage
4. Redirect to `/login`

---

## Route Structure Summary

```
/login                    → LoginPage (public)

/admin                    → AdminGuard → AdminLayout
  /admin                  → Dashboard
  /admin/schools          → SchoolList (ADMIN only)
  /admin/schools/:id      → SchoolDetail (ADMIN only)
  /admin/classes/:id      → ClassDetail
  /admin/classes/:id/students/:sid → StudentDetail
  /admin/classes/:id/albums/:aid   → AlbumDetail
  /admin/my-classes       → MyClasses (TEACHER shortcut)
  /admin/users            → UserList (ADMIN only)
  /admin/settings/box     → BoxSettings (ADMIN only)
  /admin/audit            → AuditLogs (ADMIN only)

/portal                   → PortalGuard → PortalLayout
  /portal                 → PortalHome (redirect)
  /portal/students        → MyStudents (PROTECTOR)
  /portal/students/:id    → StudentView
  /portal/students/:id/albums/:aid → AlbumView
  /portal/profile         → MyProfile
```
