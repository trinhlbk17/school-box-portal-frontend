## 1. Foundation — Test utilities & bug fix

- [x] 1.1 Add `isAdmin()` and `isTeacher()` methods to `useAuthStore` (fixes runtime bug)
- [x] 1.2 Add `renderWithAuth()` helper to `src/test/test-utils.tsx`
- [x] 1.3 Add `school.handlers.ts` MSW handler for school endpoints

## 2. Auth Flow Tests (Task 10.4)

- [x] 2.1 Create `src/test/auth/LoginPage.test.tsx` — form rendering, validation, loading state, error banner, role-based redirect (7 tests)
- [x] 2.2 Create `src/test/auth/useLogout.test.tsx` — logout clears state and redirects, handles API failure (3 tests)
- [x] 2.3 Create `src/test/auth/Guards.test.tsx` — AuthGuard, AdminGuard, PortalGuard redirect logic (5 tests)

## 3. Critical Forms Tests (Task 10.5)

- [x] 3.1 Create `src/test/student/StudentFormSheet.test.tsx` — create/edit modes, validation, mutation calls (5 tests)
- [x] 3.2 Create `src/test/album/AlbumForm.test.tsx` — create/edit modes, validation, mutation calls (5 tests)

## 4. Data Display Tests (Task 10.6)

- [x] 4.1 Create `src/test/school/SchoolListPage.test.tsx` — render data, empty state, error state, loading (4 tests)
- [x] 4.2 Create `src/test/album/AlbumListTab.test.tsx` — render cards, empty state, loading, admin-only create button (5 tests)

## 5. Verification

- [x] 5.1 Run `npx vitest run --reporter=verbose` — all ~34 tests pass
- [x] 5.2 Run `npx tsc --noEmit` — zero type errors
- [x] 5.3 Run `npm run lint` — zero lint errors
- [x] 5.4 Update `docs/progress-tracking.md` — mark tasks 10.4, 10.5, 10.6 as complete
