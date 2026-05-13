## Why

The Admin Dashboard page (`/admin`) is currently a placeholder with no useful content. It's the landing page for both Admin and Teacher roles after login, and needs to display key metrics (school/class/student/album counts) and recent activity to provide at-a-glance operational awareness. This is Phase 7 in the project roadmap and unblocks the remaining portal phases.

## What Changes

- Replace the placeholder `AdminDashboardPage.tsx` with a full dashboard layout containing stat cards and recent activity feed
- Create a reusable `StatCard.tsx` component for displaying metric counts with icons and skeleton loading
- Create a `RecentActivity.tsx` component that renders recent audit log entries (Admin-only)
- Implement role-based rendering: Admin sees all stats + activity feed; Teacher sees only their class-scoped stats with no activity feed
- Stats will use placeholder/hardcoded counts initially — API wiring deferred to a follow-up when the backend provides a stats endpoint

## Capabilities

### New Capabilities
- `dashboard-stats`: Stat card grid displaying school, class, student, and album counts with role-aware visibility and skeleton loading states
- `dashboard-activity`: Recent activity feed sourced from audit logs, displaying user actions with type-based icons and relative timestamps (Admin-only)

### Modified Capabilities
_None — this change introduces new UI without modifying existing capabilities._

## Impact

- **Modified file**: `src/app/pages/admin/AdminDashboardPage.tsx` (rewrite from placeholder)
- **New files**: `StatCard.tsx` (shared component), `RecentActivity.tsx` (dashboard-specific)
- **Existing dependencies used**: `useAuditLogs` hook from `features/audit`, `useAuthStore` from `features/auth`, Lucide icons, shadcn `Card`/`Skeleton` components
- **No new npm dependencies required**
- **No API changes** — uses existing `GET /audit/logs` endpoint; stat counts are placeholder for now
