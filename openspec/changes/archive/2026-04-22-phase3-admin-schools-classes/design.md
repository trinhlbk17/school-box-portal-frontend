## Context

Phases 0–2 delivered the app shell: login, route guards, Admin/Portal layouts, sidebar navigation, and shared UI primitives (`DataTable`, `PageHeader`, `EmptyState`, `ErrorAlert`, `ConfirmDialog`, shadcn components). Feature folders `src/features/school/` and `src/features/class/` exist but are empty.

Backend APIs are verified from source code (2026-04-22):
- `SchoolController`: CRUD at `/schools`, ADMIN-only, max 1 school enforced
- `ClassController`: CRUD at `/schools/:schoolId/classes` and `/classes/:id`, teacher assignment at `/classes/:id/teachers`
- `GET /classes/:id` includes `classTeachers[]` — no separate endpoint needed

Sidebar already renders "Schools" (adminOnly) and "My Classes" links. Routes constants (`ROUTES.ADMIN.SCHOOLS`, etc.) are pre-defined.

## Goals / Non-Goals

**Goals:**
- Admin can CRUD Schools and Classes through polished, production-quality UI
- Admin can assign/remove Teachers to Classes with homeroom designation
- Teachers see only their assigned classes on a dedicated "My Classes" page
- `ClassDetailPage` renders role-aware tabs as the hub for all class-related data
- Student/Album tabs exist as placeholders, ready for Phase 4/5 to fill

**Non-Goals:**
- Student management (Phase 4)
- Album management (Phase 5)
- Batch class promotion UI (deferred — API exists but UX is complex)
- Multi-school support (backend enforces single-school MVP)
- Server-side pagination for schools/classes (APIs return all items — client-side is sufficient for MVP scale)

## Decisions

### D1: Sheet (slide-out panel) for forms vs. Dialog (center modal)
**Choice:** Sheet from the right edge.
**Rationale:** Admin forms have 3-4 fields. Sheet feels less intrusive than a center modal, maintains context of the page behind it, and scales better if fields are added later. Dialog is reserved for confirmations (`ConfirmDialog`).
**Alternative:** Center Dialog — rejected because it obscures the data table and feels cramped with form fields.

### D2: Local state for tab filters (not URL params)
**Choice:** `useState` for search/pagination within tabs.
**Rationale:** User confirmed they don't need filter persistence across tab switches or page refreshes. Local state is simpler and avoids URL clutter. Can be upgraded to URL params later if needed.
**Alternative:** URL search params (`?tab=students&q=John&page=2`) — rejected per user preference.

### D3: ClassDetailPage tab architecture
**Choice:** shadcn `<Tabs>` with role-based conditional rendering.
**Rationale:**
- Admin sees 3 tabs: Students, Albums, Teachers
- Teacher sees 2 tabs: Students, Albums (no Teachers tab, no Edit/Delete buttons)
- Each tab content is a separate component for code splitting
- Students/Albums tabs render `<EmptyState>` placeholders until Phase 4/5

### D4: Teacher picker for class assignment
**Choice:** Use `GET /users` filtered by role TEACHER in a Dialog with searchable list.
**Rationale:** User management module (Phase 6) isn't built yet, but the API endpoint exists. We create a minimal `useTeacherUsers()` hook that calls `GET /users?role=TEACHER` — this is scoped narrowly and won't conflict with Phase 6's full user management.

### D5: MyClassesPage data fetching strategy
**Choice:** Call `GET /schools` to get the single school, then `GET /schools/:schoolId/classes` (auto-filtered for teachers by backend).
**Rationale:** Single-school MVP means there's always exactly 1 school. The 2-step fetch is simple and avoids needing a dedicated teacher endpoint. Backend already filters classes by teacher assignment.

### D6: Query key factory pattern
**Choice:** Dedicated key factories per feature module.
```typescript
export const schoolKeys = {
  all: ['schools'] as const,
  lists: () => [...schoolKeys.all, 'list'] as const,
  details: () => [...schoolKeys.all, 'detail'] as const,
  detail: (id: string) => [...schoolKeys.details(), id] as const,
};
```
**Rationale:** Consistent with Rule 5 from AGENTS.md. Enables granular cache invalidation after mutations.

## Risks / Trade-offs

- **[Hard deletes]** Backend performs hard delete for Schools and Classes (no soft delete). → **Mitigation:** ConfirmDialog with strong warning text ("This action cannot be undone. All classes and data within this school will be permanently deleted.").
- **[Single school limit]** `POST /schools` throws `SCHOOL_LIMIT_REACHED` if 1 school exists. → **Mitigation:** Disable "Add School" button when a school already exists, show tooltip explaining the limit.
- **[Teacher picker without user management]** We fetch teachers via `GET /users` before Phase 6 builds the full user module. → **Mitigation:** Minimal isolated hook, no UI for user CRUD. Will be replaced by proper imports from `features/user/` in Phase 6.
- **[No pagination on school/class APIs]** Backend returns all items. → **Mitigation:** Acceptable for MVP (single school, ~50 classes max). DataTable handles client-side pagination.
