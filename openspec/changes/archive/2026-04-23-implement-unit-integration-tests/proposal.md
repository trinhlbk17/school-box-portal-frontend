## Why

Phase 10 testing infrastructure (Vitest, MSW, factories) is complete but no actual test cases exist yet. Tasks 10.4 (auth flow), 10.5 (critical forms), and 10.6 (data display components) remain unfinished. Without tests, there is no confidence in code correctness for the most critical user journeys: login, data entry, and data visualization.

Additionally, a runtime bug was discovered: `AlbumListTab` and `AlbumDetailPage` call `state.isAdmin()` / `state.isTeacher()` on the auth store, but these methods do not exist in `useAuthStore`. This must be fixed for both production correctness and testability.

## What Changes

- Add `renderWithAuth()` test utility that pre-seeds Zustand auth state for authenticated test scenarios
- Add `isAdmin()` and `isTeacher()` derived methods to `useAuthStore` (fixes existing runtime bug)
- Write unit/integration tests for auth flow: LoginPage, useLogout, AuthGuard, AdminGuard, PortalGuard
- Write unit/integration tests for critical forms: StudentFormSheet, AlbumForm
- Write unit/integration tests for data display: SchoolListPage, AlbumListTab

## Capabilities

### New Capabilities
- `auth-flow-tests`: Tests for login, logout, and route guard redirect behavior
- `form-tests`: Tests for student and album form validation, create/edit modes, and mutation calls
- `data-display-tests`: Tests for school list and album grid rendering, loading, empty, and error states

### Modified Capabilities
_(none — no spec-level behavior changes, only adding test coverage and fixing a bug)_

## Impact

- **Modified files**: `src/test/test-utils.tsx`, `src/features/auth/stores/useAuthStore.ts`
- **New files**: 7 test files under `src/test/auth/`, `src/test/student/`, `src/test/school/`, `src/test/album/`
- **Dependencies**: No new dependencies — uses existing Vitest, Testing Library, MSW, userEvent
- **Risk**: Low — test files only. The `useAuthStore` fix adds methods already called by production code.
