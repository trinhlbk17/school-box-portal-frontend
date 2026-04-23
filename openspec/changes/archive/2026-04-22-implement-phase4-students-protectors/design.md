## Context

Phase 3 completed the School and Class feature modules. Both follow an established pattern:

```
features/<domain>/
├── types/<domain>.types.ts      — TypeScript interfaces
├── api/<domain>Api.ts           — Axios wrappers (apiClient)
├── hooks/use<Domain>s.ts        — TanStack Query hooks (query keys, queries, mutations)
├── schemas/<domain>Schema.ts    — Zod validation schemas
├── components/                  — Feature-specific UI components
├── pages/                       — Route-level page components
└── index.ts                     — Barrel exports
```

The `ClassDetailPage` currently renders three tabs: **Students** (EmptyState placeholder), **Albums** (placeholder), and **Teachers** (functional). Phase 4 replaces the Students placeholder with a real implementation and adds a new student detail page with protector management.

Backend APIs for students and protectors are fully implemented and available (verified in `docs/api-map.md`).

## Goals / Non-Goals

**Goals:**
- Implement complete student CRUD within the admin portal
- Implement protector creation and assignment to students
- Follow the exact same patterns established in Phase 3 (school/class modules)
- Replace the ClassDetailPage Students tab placeholder with real functionality
- Support paginated, searchable student lists
- Add student detail page with protector tab

**Non-Goals:**
- Portal views for students/protectors (Phase 8)
- Student folder browsing (blocked — Box API is admin-only)
- Batch student import/CSV upload
- Class promotion UI (API exists but UI deferred)
- Student profile photos/avatars

## Decisions

### 1. Student list as a tab component, not a separate page

**Decision:** `StudentListTab` renders inside `ClassDetailPage` tab, not as a standalone `/admin/students` list page.

**Rationale:** Students are always scoped to a class. The API is `GET /classes/:classId/students`. A standalone list page would need a class selector, adding unnecessary complexity. This matches how TeacherListTab already works.

**Alternative considered:** Standalone `/admin/students` page with class filter. Rejected — adds a page that duplicates in-tab functionality with no clear user benefit.

### 2. StudentDetailPage as a new standalone route

**Decision:** `/admin/students/:id` is a new top-level route, not a nested tab or modal.

**Rationale:** Student detail shows multiple sections (info, protectors, transfer history) that don't fit in a tab panel or modal. The `GET /students/:id` API is role-filtered and doesn't require classId.

### 3. Protector as a sub-feature of student, not standalone

**Decision:** Protector management lives inside `StudentDetailPage`. No standalone protector list page.

**Rationale:** Protectors are always accessed in context of a student. The APIs are `GET /students/:id/protectors`, `POST /students/:id/protectors`, `DELETE /students/:id/protectors/:protectorId`. The UX flow is: Class → Student → manage protectors.

### 4. Separate feature modules (student/ and protector/) despite tight coupling

**Decision:** Keep `student/` and `protector/` as separate feature folders with their own types, api, hooks.

**Rationale:** Follows the project's established feature-per-domain architecture. Even though protectors are accessed from StudentDetailPage, they have their own API endpoints, types, and data lifecycle. Cross-feature composition happens through props and imports from barrel files.

### 5. Pagination for student list, no pagination for protectors

**Decision:** Student list uses `usePagination` hook with server-side pagination. Protector list fetches all (a student typically has 1-4 protectors).

**Rationale:** Backend `GET /classes/:classId/students` supports `page`, `limit`, `search` params. Protector list per student is always small — no need for pagination overhead.

### 6. StudentForm uses Sheet (side panel), AssignProtectorDialog uses Dialog

**Decision:** Student create/edit uses `Sheet` component (consistent with SchoolFormSheet, ClassFormSheet). Protector assignment uses `Dialog` since it's a simpler action (search/select existing user or create new).

**Rationale:** Maintains consistency with existing form patterns. Sheets are for data-heavy forms, Dialogs for focused actions.

## Risks / Trade-offs

- **Student soft-delete** — Backend uses soft delete for students but hard delete for schools/classes. UI must handle `isActive` filtering and show appropriate indicators. → Show active/inactive badge, filter toggle.
- **Protector creation flow** — `POST /protectors` creates a protector user and optionally assigns them. The UI needs to handle both "assign existing protector" and "create new protector" flows. → `AssignProtectorDialog` with two modes: search existing or create new.
- **Transfer API** — `POST /students/:id/transfer` exists but transfer history display depends on backend response shape. → Implement transfer action, defer transfer history display if response doesn't include history data.
