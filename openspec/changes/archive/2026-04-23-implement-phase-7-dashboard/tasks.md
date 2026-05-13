## 1. Foundation Components

- [x] 1.1 Create `src/shared/components/StatCard.tsx` implementing the design system (shadow, rounded corners, icon + accent color)
- [x] 1.2 Implement the skeleton loading state variant within `StatCard.tsx`

## 2. Admin Dashboard Layout

- [x] 2.1 Refactor `src/app/pages/admin/AdminDashboardPage.tsx` to include the dashboard grid layout
- [x] 2.2 Create `src/app/pages/admin/components/RecentActivity.tsx`
- [x] 2.3 Implement the `useAuditLogs` hook within `RecentActivity.tsx` to fetch the latest 10 logs

## 3. Role-Based Features

- [x] 3.1 Integrate `useAuthStore` into `AdminDashboardPage.tsx`
- [x] 3.2 Wire the stat cards in `AdminDashboardPage.tsx` using placeholder/hardcoded values (e.g., "-")
- [x] 3.3 Implement conditional rendering: hide Schools stat card and `RecentActivity` feed for TEACHER role
- [x] 3.4 Verify the Admin view displays all 4 stat cards and the activity feed
- [x] 3.5 Verify the Teacher view displays 3 stat cards and no activity feed
