## Context

The Admin Dashboard currently serves as an empty placeholder page for users logging into the admin portal (`/admin`). Phase 7 requires adding statistics overviews and an activity feed. Because there is currently no dedicated `/dashboard/stats` backend endpoint, we've decided to defer the true data aggregation and API wiring to a later phase. Instead, we'll build the UI components and wire them with hardcoded/placeholder data, establishing the layout and component structure. The activity feed will rely on the existing `/audit/logs` API.

## Goals / Non-Goals

**Goals:**
- Replace the placeholder `AdminDashboardPage.tsx` with a proper layout containing a stat cards grid and a recent activity section.
- Create a reusable `StatCard` UI component with skeleton loading states.
- Create a `RecentActivity` feed component.
- Implement role-based display logic (Admin sees all stats and activity; Teacher sees class-scoped stats and no activity).
- Fetch data for the `RecentActivity` feed using the existing `useAuditLogs` hook.

**Non-Goals:**
- **No data aggregation for stats:** We will use hardcoded/placeholder zero values or "-" for stat counts, avoiding complex multi-query fan-outs for now.
- No quick action buttons.
- No teacher-facing activity feed.

## Decisions

**Decision 1: Deferring Stat Data Aggregation**
- *Rationale:* Fetching total students and albums currently requires paginating through every class, which is inefficient (N+1 queries). Instead of building a complex fan-out mechanism that will be thrown away once the backend implements a proper stats endpoint, we will display placeholder values.
- *Alternative Considered:* Multi-query fan-out. Rejected due to poor performance on accounts with many classes and high complexity for a temporary workaround.

**Decision 2: Simplified Feature Architecture**
- *Rationale:* Since the dashboard currently only consists of one page and two components (`StatCard`, `RecentActivity`), creating a full `src/features/dashboard/` module is over-engineering. We will co-locate `RecentActivity` with the `AdminDashboardPage` and place `StatCard` in `src/shared/components/`.
- *Alternative Considered:* Creating a dedicated feature module. Rejected to keep the architecture simple until the dashboard grows in complexity.

**Decision 3: Single Page Component with Conditional Rendering**
- *Rationale:* Admin and Teacher views share the same base grid and stat card components. Conditional rendering (`useAuthStore`) within `AdminDashboardPage` is sufficient to hide the "Schools" stat and "Recent Activity" feed for Teachers.
- *Alternative Considered:* Separate `AdminDashboard` and `TeacherDashboard` page components. Rejected because it would duplicate layout logic for minimal difference in content.

## Risks / Trade-offs

- **Risk:** Users might expect real data in the stat cards and report a bug when they see placeholders or zeros.
  - *Mitigation:* This is a known MVP constraint; the UI shell needs to be built first. We can add tooltip text such as "Stats coming soon" to clarify.
- **Risk:** Unintended access to the activity feed by Teachers.
  - *Mitigation:* Ensure strict conditional rendering based on `user.role === 'ADMIN'` when displaying the `RecentActivity` component.
