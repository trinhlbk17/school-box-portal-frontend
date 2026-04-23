## Why

Phase 3 (Schools & Classes) is complete. The `ClassDetailPage` has a "Students" tab rendering an `EmptyState` placeholder, and there is no student or protector management UI. Teachers and admins need to manage student records within classes and assign protectors (parents/guardians) to students so the portal experience (Phase 8) can function. This is the next logical step in the build-out.

## What Changes

- **Student CRUD** — Full create/read/update/delete for student records scoped to classes
- **Student list inside ClassDetailPage** — Replace the "coming soon" placeholder in the Students tab with a searchable, paginated table
- **Student detail page** — New page showing student info, protector list, and transfer history
- **Student transfer** — Admin can transfer a student between classes
- **Protector management** — Create protectors and assign/remove them to/from students
- **Protector list inside StudentDetailPage** — Display assigned protectors with relationship info
- **New route** — `/admin/students/:id` for the student detail view
- **Barrel exports** — Wire up both feature modules with proper `index.ts`

## Capabilities

### New Capabilities
- `student-management`: CRUD operations, student list tab in ClassDetail, student detail page, student transfer, search & pagination
- `protector-management`: Create protector, assign/remove protector to student, protector list within StudentDetail, assign dialog

### Modified Capabilities
- `class-management`: ClassDetailPage Students tab switches from EmptyState to real StudentListTab component

## Impact

- **Routes**: Add `/admin/students/:id` to `admin.routes.tsx`
- **Features**: New `src/features/student/` and `src/features/protector/` modules (scaffold exists, content empty)
- **Existing pages**: `ClassDetailPage` Students tab content changes
- **Backend APIs used**: `POST /students`, `GET /classes/:classId/students`, `GET /students/:id`, `PUT /students/:id`, `DELETE /students/:id`, `POST /students/:id/transfer`, `POST /protectors`, `GET /students/:id/protectors`, `POST /students/:id/protectors`, `DELETE /students/:id/protectors/:protectorId`
- **No new dependencies** — all UI primitives (DataTable, Sheet, Dialog, Badge, etc.) already exist from Phase 2
