## Why

Phase 0–2 established the app shell (auth, layouts, shared UI). The next milestone is enabling Admin users to manage the core domain entities — **Schools** and **Classes** — and Teachers to view their assigned classes. Without these, no downstream features (Students, Albums, Protectors) can be built.

## What Changes

- Admin can perform full CRUD on Schools (single-school MVP — backend enforces max 1 school)
- Admin can perform full CRUD on Classes within a School
- Admin can assign/remove Teachers to/from Classes (with homeroom designation)
- Teachers see a "My Classes" dashboard showing only their assigned classes
- `ClassDetailPage` renders role-aware tabs (Students, Albums, Teachers) — Students and Albums tabs will show placeholder content until Phase 4/5
- New shadcn/ui primitives installed: `sheet` (slide-out forms), `tabs` (class detail)
- Admin routes registered for `/admin/schools`, `/admin/schools/:id`, `/admin/classes/:id`

## Capabilities

### New Capabilities
- `school-management`: Admin CRUD for schools (list, detail, create, edit, delete) with single-school limit handling
- `class-management`: Admin CRUD for classes within a school (list, create, edit, delete), teacher assignment/removal, and teacher-scoped "My Classes" view

### Modified Capabilities
_(none — no existing specs to modify)_

## Impact

- **New files:** ~16 files across `src/features/school/` and `src/features/class/` (types, schemas, api, hooks, pages, components, barrel exports)
- **Modified files:** `admin.routes.tsx` (add new routes), placeholder pages replaced
- **APIs consumed:** `GET/POST/PUT/DELETE /schools`, `GET/POST/PUT/DELETE /classes`, `POST/DELETE /classes/:id/teachers`, `GET /users` (for teacher picker)
- **Dependencies:** shadcn `sheet` + `tabs` components (new installs)
- **No breaking changes** — all additions are net-new
