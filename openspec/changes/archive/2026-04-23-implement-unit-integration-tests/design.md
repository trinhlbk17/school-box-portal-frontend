## Context

The School Box Portal Frontend has a fully operational testing infrastructure (Phase 10A complete):
- Vitest with jsdom environment, v8 coverage
- Testing Library + custom `render()` wrapper with MemoryRouter + QueryClient
- MSW server with 9 handler groups (auth, school, class, student, protector, album, user, box, audit)
- 7 test factories (user, school, class, student, album, albumImage, protector)
- Smoke tests verifying the infrastructure works

However, no actual feature tests exist. The codebase has ~170 completed tasks across 10 phases but zero test coverage on user-facing behavior.

A runtime bug exists: `AlbumListTab` and `AlbumDetailPage` call `state.isAdmin()` / `state.isTeacher()` on the Zustand auth store, but these methods are not defined.

## Goals / Non-Goals

**Goals:**
- Cover the 3 most critical test categories: auth flows, form validation, data display
- Provide a `renderWithAuth()` helper that seeds auth state for any future authenticated test
- Fix the `isAdmin()`/`isTeacher()` bug in `useAuthStore`
- Establish test patterns that can be replicated for remaining features

**Non-Goals:**
- E2E tests (Playwright) — covered by tasks 10.7–10.10
- Full coverage of every component — focus on high-value paths only
- Testing shared UI primitives (Button, Card, etc.) — shadcn/ui is already tested upstream

## Decisions

### 1. Test file placement: centralized under `src/test/<feature>/`

Tests go in `src/test/auth/`, `src/test/school/`, etc. — NOT co-located with source files.

**Rationale**: Matches existing structure (`src/test/factories/`, `src/test/handlers/`). Keeps feature source directories clean. Test utilities, factories, and handlers are all in one tree.

**Alternative considered**: Co-located `__tests__/` directories inside each feature. Rejected because the project already established the centralized pattern.

### 2. Auth state seeding via `renderWithAuth()` helper

A new `renderWithAuth(ui, { user, sessionToken })` function wraps the existing `render()` and pre-sets the Zustand store before rendering.

**Rationale**: Guards and authenticated components check `useAuthStore` state. Without seeding, every auth test would need to manually call `useAuthStore.setState()` — repetitive and error-prone.

### 3. MSW per-test overrides via `server.use()`

Tests that need non-default API responses (401 errors, empty arrays, 500s) use `server.use()` within individual tests rather than creating separate handler sets.

**Rationale**: MSW is designed for this pattern. `server.resetHandlers()` in `afterEach` (already configured in `setup.ts`) ensures clean state between tests.

### 4. Fix `isAdmin()`/`isTeacher()` in production store

Add derived methods to `useAuthStore` rather than mocking them in tests.

**Rationale**: Production code (`AlbumListTab`, `AlbumDetailPage`) already calls these methods. Mocking would hide a real bug. The fix is 4 lines of code and makes the store API more ergonomic.

## Risks / Trade-offs

- **[Risk] Tests couple to MSW handler response shapes** → Mitigation: Handlers use the same factories as tests, so changes propagate automatically.
- **[Risk] `renderWithAuth` may not cover all auth edge cases** → Mitigation: Individual tests can still use `useAuthStore.setState()` directly for unusual scenarios.
- **[Risk] Sheet/Dialog components may not render in jsdom** → Mitigation: Radix UI portals work in jsdom. If issues arise, use `baseElement` queries or mock the portal container.
