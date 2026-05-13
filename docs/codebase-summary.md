# Codebase Summary

Quick reference for repository structure, file organization, and key components.

## Repository Layout

```
school-box-portal-frontend/
├── src/
│   ├── app/                    # App shell, routing, layouts
│   ├── features/               # 10 domain modules (auth, album, school, etc.)
│   ├── shared/                 # Cross-cutting components, hooks, utilities
│   └── test/                   # Testing setup, factories, MSW handlers
├── public/                     # Static assets
├── .env.example                # Template for .env
├── vite.config.ts              # Vite build config
├── tsconfig.json               # TypeScript strict mode
├── tailwind.config.ts          # @theme tokens from DESIGN_SYSTEM.md
├── vitest.config.ts            # Unit test setup
├── eslint.config.js            # Linting rules
├── AGENTS.md                   # AI agent rules & domain rules (CRITICAL)
├── REACT_CODING_STANDARDS.md   # Full coding standards
├── DESIGN_SYSTEM.md            # Design tokens, colors, typography
├── README.md                   # Project overview & quick start
└── docs/                       # Documentation
    ├── project-overview-pdr.md # Requirements & business rules
    ├── codebase-summary.md     # This file
    ├── code-standards.md       # Quick reference for coding style
    ├── system-architecture.md  # Layer diagram, data flow
    ├── project-roadmap.md      # Phase status & progress
    ├── deployment-guide.md     # Build, env, hosting
    ├── design-guidelines.md    # Design reference
    ├── tech-stack.md           # Technology choices & versions
    ├── api-map.md              # All backend endpoints
    ├── auth-flow.md            # Login, guards, redirects
    ├── progress-tracking.md    # Granular task checklist
    ├── secure-gallery-mvp-plan.md # Full MVP plan
    ├── ux-admin-portal.md      # Admin flow diagrams
    └── ux-user-portal.md       # Student/Protector flows
```

**~176 .ts/.tsx files** organized by feature module.

## src/ Directory Structure

### src/app/ — App Shell
Routing, layout, guards, and providers.

```
src/app/
├── App.tsx                     # Root route composition + providers
├── providers.tsx               # QueryClientProvider, BrowserRouter
├── routes/
│   ├── admin.routes.tsx        # /admin routes (lazy-loaded)
│   ├── portal.routes.tsx       # /portal routes (lazy-loaded)
│   └── auth.routes.tsx         # /login route
├── guards/
│   ├── AuthGuard.tsx           # Logged-in check
│   ├── AdminGuard.tsx          # ADMIN + TEACHER only
│   └── PortalGuard.tsx         # STUDENT + PROTECTOR only
├── layouts/
│   ├── AdminLayout.tsx         # Sidebar + top bar for /admin
│   ├── PortalLayout.tsx        # Top bar + bottom nav for /portal
│   └── components/
│       ├── AdminHeader.tsx     # Top bar (logo, profile dropdown)
│       ├── Sidebar.tsx         # Navigation menu (role-aware)
│       ├── PortalTopBar.tsx    # Simple header for portal
│       └── PortalBottomNav.tsx # Mobile navigation
└── pages/
    ├── admin/
    │   ├── AdminDashboardPage.tsx   # Stats & recent activity
    │   └── MyClassesPage.tsx         # Teacher's classes
    ├── portal/
    │   ├── PortalHomePage.tsx       # Role-based redirect
    │   └── PortalStudentsPage.tsx   # Portal index
    ├── NotFoundPage.tsx        # 404
    └── ServerErrorPage.tsx     # 500
```

### src/features/ — Domain Modules (10 domains)

Each domain owns its API, types, hooks, and components. Cross-feature data flows through props or shared hooks only.

**Domains:**

| Domain | Purpose | Key Files |
|--------|---------|-----------|
| **auth** | Login, session, user store | `authApi.ts`, `useAuthStore.ts`, `LoginPage.tsx`, `useLogin.ts` |
| **school** | Schools (admin only) | `schoolApi.ts`, `SchoolListPage.tsx`, `SchoolDetailPage.tsx`, `useSchools.ts` |
| **class** | Classes, teacher assignments | `classApi.ts`, `ClassDetailPage.tsx`, `useClasses.ts` |
| **student** | Students, profiles | `studentApi.ts`, `StudentDetailPage.tsx`, `useStudents.ts` |
| **protector** | Parents/guardians, assignments | `protectorApi.ts`, `AssignProtectorDialog.tsx`, `useProtectors.ts` |
| **album** | Albums, image uploads, downloads | `albumApi.ts`, `AlbumDetailPage.tsx`, `ImageUploader.tsx`, `Lightbox.tsx`, `useAlbums.ts` |
| **box** | Box.com integration | `boxApi.ts`, `BoxSettingsPage.tsx`, `BoxFolderBrowser.tsx` |
| **user** | User management (admin only) | `userApi.ts`, `UserListPage.tsx`, `useUsers.ts` |
| **audit** | Audit logs | `auditApi.ts`, `AuditLogPage.tsx`, `useAuditLogs.ts` |
| **portal** | Portal-specific views | `MyStudentsPage.tsx`, `StudentViewPage.tsx`, `MyProfilePage.tsx` |

**Feature module structure (typical):**
```
features/album/
├── api/
│   └── albumApi.ts             # axios calls
├── types/
│   └── album.types.ts          # Album, Image, AlbumStatus types
├── schemas/
│   └── albumSchema.ts          # Zod validation
├── hooks/
│   ├── useAlbums.ts            # List query
│   ├── useAlbumMutations.ts    # Create, update, publish, archive
│   ├── useImageMutations.ts    # Upload, delete images
│   ├── useDownload.ts          # Download images/ZIP
│   ├── useImageUrl.ts          # Get signed image URL
│   └── useAlbumActions.ts      # Derived logic
├── components/
│   ├── AlbumListTab.tsx        # Inside ClassDetail, card grid
│   ├── AlbumForm.tsx           # Create/edit modal
│   ├── ImageGrid.tsx           # Thumbnail grid, multi-select
│   ├── ImageUploader.tsx       # Drag & drop zone
│   └── Lightbox.tsx            # Full-size preview, prev/next
├── pages/
│   └── AlbumDetailPage.tsx     # Album view (admin/portal variants)
└── index.ts                    # Barrel: export types, hooks, components
```

### src/shared/ — Cross-Cutting Utilities

Reusable components, hooks, utilities.

```
src/shared/
├── components/
│   ├── ui/                     # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ... (20+ shadcn components)
│   ├── DataTable.tsx           # Reusable table + pagination
│   ├── EmptyState.tsx          # List empty state
│   ├── ErrorAlert.tsx          # Error message card
│   ├── ConfirmDialog.tsx       # Confirm/cancel modal
│   └── PageHeader.tsx          # Title + breadcrumb + actions
├── hooks/
│   ├── useDebounce.ts
│   └── usePagination.ts
├── lib/
│   ├── apiClient.ts            # Axios with x-session-id interceptor
│   ├── env.ts                  # .env validation (Zod)
│   ├── normalizeApiError.ts    # Error message extraction
│   └── cn.ts                   # clsx + tailwind-merge utility
├── types/
│   └── api.types.ts            # ApiResponse<T>, PaginatedResponse<T>, AppError
└── constants/
    ├── routes.ts               # Route paths
    └── roles.ts                # Role enums + helpers
```

### src/test/ — Testing Utilities

```
src/test/
├── setup.ts                    # Vitest + JSDOM config
├── handlers.ts                 # MSW (Mock Service Worker) handlers for all endpoints
└── factories.ts                # Test data factories (createUser, createSchool, etc.)
```

## Component Inventory

### Auth
- **LoginPage** — Email + password form, "keep me logged in" checkbox, role-based redirect

### Admin Portal
- **AdminLayout** — Sidebar + header for admin/teacher views
- **AdminDashboardPage** — Stats cards (total schools, classes, users, etc.) + recent activity
- **SchoolListPage** — Table with search, pagination, create/edit/delete actions
- **SchoolDetailPage** — School info + associated classes
- **ClassDetailPage** — Tabs: Students, Albums, Teachers; add/remove members
- **StudentDetailPage** — Student info + assigned protectors tab
- **AlbumDetailPage** — Album header + action bar (publish, archive, delete) + image grid
- **UserListPage** — User management table with role + status filters
- **BoxSettingsPage** — Box connection status + folder browser
- **AuditLogPage** — Sortable, filterable audit log table

### Portal (Student/Protector Views)
- **PortalLayout** — Simple top bar + bottom nav (mobile-friendly)
- **PortalHomePage** — Role-based redirect logic
- **MyStudentsPage** — Protector's list of assigned students
- **StudentViewPage** — Tabs: Albums (PUBLISHED only), Student Info
- **AlbumViewPage** — Gallery view with watermark notice, download options
- **MyProfilePage** — User profile, change password link

### Shared Components
- **DataTable** — Generic table with pagination, search, sortable columns
- **ConfirmDialog** — Reusable confirm/cancel modal
- **EmptyState** — Message + icon for empty lists
- **ErrorAlert** — Error message display
- **PageHeader** — Title + breadcrumb + action buttons

## Key Hooks & APIs

| Hook | Purpose |
|------|---------|
| `useLogin()` | Mutation: POST /auth/login |
| `useCurrentUser()` | Query: GET /auth/me |
| `useLogout()` | Mutation: POST /auth/logout |
| `useSchools()` | Query: GET /schools (paginated) |
| `useClasses()` | Query: GET /schools/:id/classes |
| `useAlbums()` | Query: GET /albums by class |
| `useUploadImages()` | Mutation: POST /albums/:id/images (multipart) |
| `useDownloadImage()` | Mutation: GET /images/:id/download (returns signed URL) |
| `useAuditLogs()` | Query: GET /audit-logs (paginated, filterable) |
| `usePagination()` | Utility: manage page state |
| `useDebounce()` | Utility: debounce search input |

## Query Key Strategy

Pattern: `[resource, ...identifiers, { filters }]`

Examples:
- `["schools"]` — all schools
- `["classes", schoolId]` — classes in school
- `["albums", classId, { status: "PUBLISHED" }]` — published albums in class
- `["images", albumId]` — images in album
- `["audit-logs", { action: "DOWNLOAD", limit: 50 }]` — filtered audit logs

## Error Handling

- **API errors:** Normalized via `normalizeApiError()` → user-friendly toast message
- **Form errors:** Caught by React Hook Form + displayed inline
- **Route errors:** Caught by route-level `<FeatureErrorBoundary>` or global error page
- **401 Unauthorized:** Axios interceptor clears storage + redirects to `/login`

## State Management

- **Server state (data):** TanStack Query (cached, auto-refetch)
- **Auth session:** Zustand `useAuthStore` (user, token, role checks)
- **Form state:** React Hook Form (uncontrolled, performant)
- **UI globals:** Zustand for things like dark mode (if needed)

## Lazy Loading & Code Splitting

All routes in `admin.routes.tsx` and `portal.routes.tsx` are lazy-loaded:
```tsx
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
```

This reduces initial bundle size. Pages load on-demand.

## Environment Variables

Required in `.env`:

| Variable | Example | Purpose |
|----------|---------|---------|
| `VITE_API_BASE_URL` | `http://localhost:3000` | Backend URL |
| `VITE_APP_NAME` | `School Box Portal` | App title |

See `.env.example` for defaults. Validated in `src/shared/lib/env.ts` using Zod.

---

For detailed architecture, see `docs/system-architecture.md`.
For specific component code, use Grep to search by name.
For API details, see `docs/api-map.md`.
