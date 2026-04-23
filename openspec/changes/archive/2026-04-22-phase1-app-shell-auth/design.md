## Context

Phase 0 delivered a Vite + React + TypeScript scaffold with Tailwind v4 design tokens and all dependencies installed. The folder structure exists (`src/app/`, `src/features/auth/`, `src/shared/`) but contains no functional code — only empty directories and a placeholder App component.

The backend is a NestJS application with session-based auth (not JWT). It uses `x-session-id` header for authentication, returns responses wrapped in `{ success: true, data: ... }`, and has distinct role tiers: ADMIN, TEACHER, STUDENT, PROTECTOR.

Key constraints from existing documentation:
- `docs/auth-flow.md`: Defines login flow, session persistence, guard logic, route structure
- `docs/api-map.md`: All backend endpoints with roles and formats
- `REACT_CODING_STANDARDS.md`: Patterns for API layer, state management, hooks, components
- `AGENTS.md`: Domain rules (session auth, two portals, role-based guards)

## Goals / Non-Goals

**Goals:**
- Establish a working API client that handles session auth and error normalization
- Build a complete auth feature (login, logout, session validation) following the coding standards
- Protect all routes with role-based guards matching backend role tiers
- Create Admin and Portal layouts that serve as the visual shell for all future features
- Set up lazy-loaded routing with role-based redirect after login
- Deliver a login page that works end-to-end with the backend

**Non-Goals:**
- OTP login flow (deferred — backend sends emails, not needed for MVP)
- Password change feature (requires OTP email)
- Dark mode toggle (design tokens exist, but no toggle UI in Phase 1)
- Responsive mobile admin layout (Phase 9 polish)
- Any feature pages (schools, classes, albums — those are Phase 3+)

## Decisions

### D1: Session storage strategy — dual storage based on "Keep me logged in"

**Decision**: Use `localStorage` when user checks "Keep me logged in", otherwise `sessionStorage`. The auth store reads from both on startup.

**Alternatives considered**:
- Always localStorage: Simpler, but sessions persist indefinitely even when user wants temporary access
- Always sessionStorage: Safer, but no "remember me" capability
- HTTP-only cookies: Not available — backend uses header-based session tokens

**Rationale**: Matches the `docs/auth-flow.md` spec exactly. The Zustand store abstracts this — components never touch storage directly.

### D2: API client header — `x-session-id` (NOT Authorization Bearer)

**Decision**: Axios request interceptor reads session token from Zustand store and sets `x-session-id` header.

**Rationale**: Backend uses session-based auth, not JWT. This is a hard domain rule from `AGENTS.md`. The `REACT_CODING_STANDARDS.md` example shows `Authorization: Bearer` but that's a generic template — our backend explicitly requires `x-session-id`.

### D3: Error normalization — single `normalizeApiError` utility

**Decision**: All API errors pass through `normalizeApiError()` which produces a consistent `AppError` shape: `{ code, message, statusCode }`. The response interceptor calls this automatically.

**Rationale**: Backend uses `BusinessException` with `{ code, message, statusCode }` format. Normalizing once in the interceptor means every hook gets clean error objects.

### D4: Auth state — Zustand for session, TanStack Query for /auth/me

**Decision**: 
- `useAuthStore` (Zustand): Holds `user`, `sessionToken`, `rememberMe` flag, `setSession()`, `logout()`
- `useCurrentUser` (TanStack Query): Calls `GET /auth/me` to validate session on app startup
- Login mutation updates both store and query cache

**Alternatives considered**:
- All in Zustand: Would need manual refetching logic
- All in TanStack Query: Session token isn't server state — it's client auth state

**Rationale**: Follows the coding standards' state management table: global client state in Zustand, server state in TanStack Query.

### D5: Route guard pattern — wrapper components with Outlet

**Decision**: Three nested guards as React Router wrapper elements:
1. `AuthGuard`: Checks session token exists → calls /auth/me → redirects to /login if invalid
2. `AdminGuard`: Wraps admin routes → checks role is ADMIN or TEACHER → redirects to /portal otherwise
3. `PortalGuard`: Wraps portal routes → checks role is STUDENT or PROTECTOR → redirects to /admin otherwise

Guards render `<Outlet />` when access is granted. They show a loading spinner while validating.

**Rationale**: Clean separation of concerns. AuthGuard handles "is logged in?", role guards handle "has permission?". Uses standard React Router nested route patterns.

### D6: Layout architecture — sidebar-based Admin, top/bottom-bar Portal

**Decision**:
- `AdminLayout`: Left sidebar (256px, collapsible to 64px) + top header bar + main content area
- `PortalLayout`: Top navigation bar + main content area + bottom navigation (mobile-friendly)
- Both layouts use `<Outlet />` for content rendering

**Rationale**: Matches the UX flows in `docs/ux-admin-portal.md` and `docs/ux-user-portal.md`. Sidebar widths use existing CSS tokens (`--sidebar-width`, `--sidebar-width-collapsed`).

### D7: Route configuration — three route files, lazy-loaded

**Decision**:
- `auth.routes.tsx`: Public routes (`/login`)
- `admin.routes.tsx`: Protected admin routes (lazy-loaded page components)
- `portal.routes.tsx`: Protected portal routes (lazy-loaded page components)
- `App.tsx`: Composes all routes with providers

Pages are lazy-loaded via `React.lazy()` with `<Suspense>` fallback.

**Rationale**: Code-splitting by portal ensures users only download the code they need.

## Risks / Trade-offs

**[Risk] Backend not running during development** → Use `.env` with configurable API URL. Login will fail gracefully with error message. MSW mock server can be added in Phase 10 for testing.

**[Risk] Session token expires silently** → 401 interceptor clears auth store and redirects to login. Users see a clean redirect, not a broken page.

**[Risk] Race condition on app startup** → AuthGuard shows loading state while `/auth/me` is in-flight. No route renders until session is validated or rejected.

**[Trade-off] No refresh token** → Backend uses simple session tokens with no refresh mechanism. If session expires, user must re-login. Acceptable for MVP school portal use case.

**[Trade-off] Layouts are basic in Phase 1** → Sidebar and navigation will have placeholder menu items. Real menu items are populated as features are built in Phase 3+.
