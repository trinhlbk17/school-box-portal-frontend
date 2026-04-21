# Progress Tracking — School Box Portal Frontend

> Last updated: 2026-04-21
> Track implementation progress. Each task is small enough for a single session.

---

## Legend

- `[ ]` — Not started
- `[/]` — In progress
- `[x]` — Completed
- `[!]` — Blocked (see notes)
- `[~]` — Skipped (deferred or hidden feature)

---

## Phase 0: Project Initialization

> Goal: Working Vite project with all dependencies, configs, and folder structure.

- [ ] **0.1** Init Vite + React + TypeScript project
- [ ] **0.2** Install core dependencies (React Router, TanStack Query, Zustand, Axios)
- [ ] **0.3** Install UI dependencies (Tailwind CSS v4, shadcn/ui, clsx, tailwind-merge, cva)
- [ ] **0.4** Install form dependencies (React Hook Form, Zod, @hookform/resolvers)
- [ ] **0.5** Install dev dependencies (Vitest, Testing Library, MSW, Playwright)
- [ ] **0.6** Configure `tsconfig.json` (strict mode, path aliases `@/`)
- [ ] **0.7** Configure Tailwind v4 with `@theme` tokens from DESIGN_SYSTEM.md
- [ ] **0.8** Import Inter font (Google Fonts)
- [ ] **0.9** Create `.env.example` + env validation with Zod (`src/shared/lib/env.ts`)
- [ ] **0.10** Create folder structure (`src/app/`, `src/features/`, `src/shared/`, `src/test/`)
- [ ] **0.11** Verify dev server runs (`npm run dev`)

**Deliverable:** Empty app renders in browser with correct font and colors.

---

## Phase 1: App Shell & Auth

> Goal: Login works. Route guards protect pages. Layouts render.

### 1A — Shared Foundation

- [ ] **1.1** Create `apiClient.ts` with Axios interceptors (`x-session-id`, 401 handling)
- [ ] **1.2** Create `cn.ts` utility (clsx + tailwind-merge)
- [ ] **1.3** Create shared types (`api.types.ts`: `ApiResponse<T>`, `PaginatedResponse<T>`, `AppError`)
- [ ] **1.4** Create `normalizeApiError.ts` utility
- [ ] **1.5** Create shared constants (`routes.ts`, `roles.ts`)

### 1B — Auth Feature

- [ ] **1.6** Create `auth/types/auth.types.ts` (User, LoginInput, LoginResponse)
- [ ] **1.7** Create `auth/stores/useAuthStore.ts` (Zustand — user, token, setSession, logout)
- [ ] **1.8** Create `auth/api/authApi.ts` (login, logout, getMe)
- [ ] **1.9** Create `auth/schemas/loginSchema.ts` (Zod validation)
- [ ] **1.10** Create `auth/hooks/useLogin.ts` (mutation hook)
- [ ] **1.11** Create `auth/hooks/useLogout.ts` (mutation hook)
- [ ] **1.12** Create `auth/hooks/useCurrentUser.ts` (query hook for /auth/me)
- [ ] **1.13** Create `auth/index.ts` barrel exports

### 1C — Route Guards

- [ ] **1.14** Create `AuthGuard.tsx` (check session, redirect to /login)
- [ ] **1.15** Create `AdminGuard.tsx` (ADMIN + TEACHER only)
- [ ] **1.16** Create `PortalGuard.tsx` (STUDENT + PROTECTOR only)

### 1D — Layouts

- [ ] **1.17** Create `AdminLayout.tsx` (sidebar + header + content area)
- [ ] **1.18** Create `PortalLayout.tsx` (top bar + content + bottom nav)
- [ ] **1.19** Create sidebar navigation component (role-aware menu items)
- [ ] **1.20** Create top bar / header component (logo, profile dropdown)

### 1E — Routing & Login Page

- [ ] **1.21** Create `auth.routes.tsx` (login route)
- [ ] **1.22** Create `admin.routes.tsx` (all admin routes, lazy-loaded)
- [ ] **1.23** Create `portal.routes.tsx` (all portal routes, lazy-loaded)
- [ ] **1.24** Create `App.tsx` with route composition + providers
- [ ] **1.25** Create `providers.tsx` (QueryClientProvider, BrowserRouter)
- [ ] **1.26** Create `LoginPage.tsx` (form + validation + role-based redirect)
- [ ] **1.27** Test login flow end-to-end with backend

**Deliverable:** Login works, redirects by role, guards protect routes, layouts render.

---

## Phase 2: Shared UI Components

> Goal: Reusable shadcn/ui components configured with our design tokens.

- [ ] **2.1** Init shadcn/ui (`npx shadcn-ui@latest init`)
- [ ] **2.2** Add Button component (all variants from DESIGN_SYSTEM.md)
- [ ] **2.3** Add Card component (Card, CardHeader, CardContent, CardFooter)
- [ ] **2.4** Add Input + Label + FormField components
- [ ] **2.5** Add Badge component (status variants: success, warning, error, info)
- [ ] **2.6** Add Dialog / Modal component
- [ ] **2.7** Add DropdownMenu component
- [ ] **2.8** Add Table component (for DataTable base)
- [ ] **2.9** Add Skeleton component (loading states)
- [ ] **2.10** Add Toast / Sonner setup
- [ ] **2.11** Create `DataTable.tsx` wrapper (reusable table with pagination, search)
- [ ] **2.12** Create `EmptyState.tsx` component
- [ ] **2.13** Create `ErrorAlert.tsx` component
- [ ] **2.14** Create `PageHeader.tsx` component (title + breadcrumb + actions)
- [ ] **2.15** Create `ConfirmDialog.tsx` component (reusable confirm/cancel)
- [ ] **2.16** Create shared `usePagination.ts` hook
- [ ] **2.17** Create shared `useDebounce.ts` hook

**Deliverable:** All shared UI primitives ready. No feature-specific code yet.

---

## Phase 3: Admin Portal — Schools & Classes

> Goal: Admin can manage schools and classes.

### 3A — School Feature

- [ ] **3.1** Create `school/types/school.types.ts`
- [ ] **3.2** Create `school/api/schoolApi.ts`
- [ ] **3.3** Create `school/hooks/useSchools.ts` (list query)
- [ ] **3.4** Create `school/hooks/useSchool.ts` (detail query)
- [ ] **3.5** Create `school/hooks/useCreateSchool.ts` (mutation)
- [ ] **3.6** Create `school/hooks/useUpdateSchool.ts` (mutation)
- [ ] **3.7** Create `school/hooks/useDeleteSchool.ts` (mutation)
- [ ] **3.8** Create `school/schemas/schoolSchema.ts` (Zod)
- [ ] **3.9** Create `SchoolListPage.tsx` (table + search + pagination)
- [ ] **3.10** Create `SchoolForm.tsx` (create/edit modal)
- [ ] **3.11** Create `SchoolDetailPage.tsx` (school info + class list)
- [ ] **3.12** Create `school/index.ts` barrel
- [ ] **3.13** Test school CRUD end-to-end

### 3B — Class Feature

- [ ] **3.14** Create `class/types/class.types.ts`
- [ ] **3.15** Create `class/api/classApi.ts`
- [ ] **3.16** Create `class/hooks/useClasses.ts`, `useClass.ts`
- [ ] **3.17** Create `class/hooks/useCreateClass.ts`, `useUpdateClass.ts`, `useDeleteClass.ts`
- [ ] **3.18** Create `class/schemas/classSchema.ts`
- [ ] **3.19** Create `ClassDetailPage.tsx` (tabs: Students, Albums, Teachers)
- [ ] **3.20** Create `ClassForm.tsx` (create/edit modal)
- [ ] **3.21** Create `TeacherAssignment.tsx` (add/remove teacher)
- [ ] **3.22** Create `MyClassesPage.tsx` (card grid for teachers)
- [ ] **3.23** Create `class/index.ts` barrel
- [ ] **3.24** Test class management end-to-end

**Deliverable:** Admin can CRUD schools + classes, teachers see their classes.

---

## Phase 4: Admin Portal — Students & Protectors

> Goal: Manage students and protector assignments.

### 4A — Student Feature

- [ ] **4.1** Create `student/types/student.types.ts`
- [ ] **4.2** Create `student/api/studentApi.ts`
- [ ] **4.3** Create `student/hooks/useStudents.ts`, `useStudent.ts`
- [ ] **4.4** Create `student/hooks/useCreateStudent.ts`, `useUpdateStudent.ts`
- [ ] **4.5** Create `student/schemas/studentSchema.ts`
- [ ] **4.6** Create `StudentListTab.tsx` (inside ClassDetail, table with search)
- [ ] **4.7** Create `StudentForm.tsx` (create/edit)
- [ ] **4.8** Create `StudentDetailPage.tsx` (info + protectors + transfer history)
- [ ] **4.9** Create `student/index.ts` barrel
- [ ] **4.10** Test student CRUD end-to-end

### 4B — Protector Feature

- [ ] **4.11** Create `protector/types/protector.types.ts`
- [ ] **4.12** Create `protector/api/protectorApi.ts`
- [ ] **4.13** Create `protector/hooks/useProtectors.ts`, `useAssignProtector.ts`, `useRemoveProtector.ts`
- [ ] **4.14** Create `ProtectorList.tsx` (inside StudentDetail)
- [ ] **4.15** Create `AssignProtectorDialog.tsx`
- [ ] **4.16** Create `protector/index.ts` barrel
- [ ] **4.17** Test protector assignment end-to-end

**Deliverable:** Full student + protector management in Admin portal.

---

## Phase 5: Admin Portal — Albums & Images

> Goal: Create albums, upload images, manage gallery.

- [ ] **5.1** Create `album/types/album.types.ts`
- [ ] **5.2** Create `album/api/albumApi.ts`
- [ ] **5.3** Create `album/hooks/useAlbums.ts`, `useAlbum.ts`
- [ ] **5.4** Create `album/hooks/useCreateAlbum.ts`, `useUpdateAlbum.ts`
- [ ] **5.5** Create `album/hooks/usePublishAlbum.ts`, `useArchiveAlbum.ts`
- [ ] **5.6** Create `album/hooks/useUploadImages.ts` (multipart mutation)
- [ ] **5.7** Create `album/hooks/useDeleteImage.ts`
- [ ] **5.8** Create `album/schemas/albumSchema.ts`
- [ ] **5.9** Create `AlbumListTab.tsx` (card grid inside ClassDetail)
- [ ] **5.10** Create `AlbumForm.tsx` (create/edit modal)
- [ ] **5.11** Create `AlbumDetailPage.tsx` (header + action bar + image grid)
- [ ] **5.12** Create `ImageGrid.tsx` (thumbnail grid, multi-select)
- [ ] **5.13** Create `ImageUploader.tsx` (drag & drop zone)
- [ ] **5.14** Create `Lightbox.tsx` (full-size preview, prev/next, download)
- [!] **5.15** Test image upload end-to-end — **BLOCKED by P0: AlbumImage double prefix bug**
- [ ] **5.16** Create `album/index.ts` barrel

**Deliverable:** Album lifecycle works (create → upload → publish → archive → download).

---

## Phase 6: Admin Portal — Users, Box, Audit

> Goal: Remaining admin-only features.

### 6A — User Management

- [ ] **6.1** Create `user/types/user.types.ts`
- [ ] **6.2** Create `user/api/userApi.ts`
- [ ] **6.3** Create `user/hooks/` (useUsers, useCreateUser, useUpdateUser, etc.)
- [ ] **6.4** Create `user/schemas/userSchema.ts`
- [ ] **6.5** Create `UserListPage.tsx` (table + role filter + status filter)
- [ ] **6.6** Create `UserForm.tsx` (create/edit modal)
- [ ] **6.7** Create `user/index.ts` barrel

### 6B — Box Settings

- [ ] **6.8** Create `box/api/boxApi.ts`
- [ ] **6.9** Create `box/hooks/useBoxStatus.ts`, `useBoxConnect.ts`, `useBoxDisconnect.ts`
- [ ] **6.10** Create `BoxSettingsPage.tsx` (connected/disconnected states)
- [ ] **6.11** Create `BoxFolderBrowser.tsx` (tree view)
- [ ] **6.12** Create `box/index.ts` barrel

### 6C — Audit Logs

- [ ] **6.13** Create `audit/api/auditApi.ts`
- [ ] **6.14** Create `audit/hooks/useAuditLogs.ts`
- [ ] **6.15** Create `AuditLogPage.tsx` (table with filters)
- [ ] **6.16** Create `audit/index.ts` barrel

**Deliverable:** All admin-only features complete.

---

## Phase 7: Admin Portal — Dashboard

> Goal: Stats overview + recent activity.

- [ ] **7.1** Create `DashboardPage.tsx` (stats cards + recent activity)
- [ ] **7.2** Create `StatCard.tsx` component (reusable stat display)
- [ ] **7.3** Create `RecentActivity.tsx` component
- [ ] **7.4** Aggregate stats from list endpoints (workaround for missing /dashboard/stats)
- [ ] **7.5** Test dashboard renders correctly for Admin vs Teacher

**Deliverable:** Dashboard shows key metrics and recent activity.

---

## Phase 8: User Portal — Protector & Student Views

> Goal: Protectors and Students can view albums and student info.

### 8A — Portal Shell

- [ ] **8.1** Create `PortalHomePage.tsx` (redirect logic by role)
- [ ] **8.2** Create bottom navigation component (if needed, or verify PortalLayout)

### 8B — Protector Views

- [ ] **8.3** Create `protector/hooks/useMyStudents.ts` (GET /protectors/my-students)
- [ ] **8.4** Create `MyStudentsPage.tsx` (card list of children)
- [ ] **8.5** Create `StudentCard.tsx` (avatar, name, class, relationship badge)

### 8C — Student Views

- [ ] **8.6** Create `StudentViewPage.tsx` (tabs: Albums, Folders, Info)
- [ ] **8.7** Create `StudentAlbumsTab.tsx` (PUBLISHED albums only, card grid)
- [ ] **8.8** Create `StudentInfoTab.tsx` (read-only student info)
- [~] **8.9** Create `StudentFoldersTab.tsx` — **DEFERRED: folder browsing is ADMIN-only**

### 8D — Album Viewing (Portal)

- [ ] **8.10** Create `AlbumViewPage.tsx` (gallery view for portal users)
- [ ] **8.11** Reuse `ImageGrid.tsx` from Phase 5 (or create portal-specific variant)
- [ ] **8.12** Reuse `Lightbox.tsx` from Phase 5
- [ ] **8.13** Add watermark notice banner
- [ ] **8.14** Add "Download All" button (ZIP download)

### 8E — Profile

- [ ] **8.15** Create `MyProfilePage.tsx` (display user info)
- [~] **8.16** Create `ChangePasswordPage.tsx` — **DEFERRED: requires OTP email**

**Deliverable:** Protectors/Students can view albums, download images, see student info.

---

## Phase 9: Polish & Quality

> Goal: Production-ready quality.

### 9A — Error Handling

- [ ] **9.1** Add `FeatureErrorBoundary` to every feature section
- [ ] **9.2** Create global 404 page
- [ ] **9.3** Create global error page (500 / unexpected)
- [ ] **9.4** Verify all API error states show user-friendly messages

### 9B — Loading States

- [ ] **9.5** Add skeleton loaders for all list pages
- [ ] **9.6** Add skeleton loaders for detail pages
- [ ] **9.7** Add loading spinners for mutations (buttons)
- [ ] **9.8** Verify empty states display for all lists

### 9C — Responsive Design

- [ ] **9.9** Test Admin portal on tablet (md breakpoint)
- [ ] **9.10** Test Admin portal sidebar collapse behavior
- [ ] **9.11** Test User portal on mobile (sm breakpoint)
- [ ] **9.12** Verify touch targets ≥ 44px on mobile

### 9D — Accessibility

- [ ] **9.13** Verify all inputs have labels
- [ ] **9.14** Verify keyboard navigation works (tab, enter, escape)
- [ ] **9.15** Verify ARIA attributes on custom components
- [ ] **9.16** Test with screen reader (basic)

### 9E — Performance

- [ ] **9.17** Verify all routes are lazy-loaded
- [ ] **9.18** Verify image thumbnails lazy-load in grids
- [ ] **9.19** Run Lighthouse audit (target: 90+ all categories)
- [ ] **9.20** Check bundle size (no unnecessary large dependencies)

**Deliverable:** Production-ready, accessible, performant application.

---

## Phase 10: Testing

> Goal: Confidence in code correctness.

- [ ] **10.1** Setup Vitest + Testing Library + MSW
- [ ] **10.2** Create test factories (`createUser`, `createSchool`, `createAlbum`, etc.)
- [ ] **10.3** Create MSW handlers for all API endpoints
- [ ] **10.4** Write tests for auth flow (login, logout, guard redirects)
- [ ] **10.5** Write tests for critical forms (login, create student, create album)
- [ ] **10.6** Write tests for data display components (school list, album grid)
- [ ] **10.7** Setup Playwright for E2E
- [ ] **10.8** Write E2E: Login → Dashboard → Create School → Create Class flow
- [ ] **10.9** Write E2E: Login → Album → Upload → Preview → Download flow
- [ ] **10.10** Write E2E: Protector Login → View Student → View Album flow

**Deliverable:** Test coverage on critical user journeys.

---

## Blocked / Deferred Items

| ID | Item | Reason | Unblock Action |
|----|------|--------|---------------|
| 5.15 | Album image upload testing | AlbumImage controller double `/api/api/` prefix | Fix backend `album-image.controller.ts` |
| 8.9 | Student folder browsing | Box folder API is ADMIN-only | Backend: add student/protector endpoint |
| 8.16 | Change password | Requires OTP email | Backend: add direct password change endpoint |
| — | Shared Folders tab | No SharedFolder controller | Backend: implement SharedFolder controller |
| — | Dashboard stats endpoint | No `/dashboard/stats` API | Use workaround (aggregate from lists) |

---

## Progress Summary

| Phase | Tasks | Done | Blocked | Status |
|-------|-------|------|---------|--------|
| 0 — Init | 11 | 0 | 0 | Not started |
| 1 — Auth & Shell | 27 | 0 | 0 | Not started |
| 2 — Shared UI | 17 | 0 | 0 | Not started |
| 3 — Schools & Classes | 24 | 0 | 0 | Not started |
| 4 — Students & Protectors | 17 | 0 | 0 | Not started |
| 5 — Albums & Images | 16 | 0 | 1 | Not started |
| 6 — Users, Box, Audit | 16 | 0 | 0 | Not started |
| 7 — Dashboard | 5 | 0 | 0 | Not started |
| 8 — User Portal | 16 | 0 | 2 | Not started |
| 9 — Polish | 20 | 0 | 0 | Not started |
| 10 — Testing | 10 | 0 | 0 | Not started |
| **Total** | **179** | **0** | **3** | **Not started** |
