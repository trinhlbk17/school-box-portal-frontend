## Why

Phase 6 completes the remaining ADMIN-only features for the School Box Portal: User Management, Box.com Settings, and Audit Logs. These are the last admin tools before the Dashboard (Phase 7) and User Portal (Phase 8). Without these, admins cannot manage user accounts, connect to Box.com file storage, or view system activity logs.

## What Changes

- **User Management** (CRUD + lifecycle): Create/edit users, activate/deactivate accounts, regenerate passwords, soft delete. Includes role and status filtering, sorting, and a password reveal dialog with copy-to-clipboard.
- **Box Settings**: OAuth2 connection flow (redirect-based), connection status display, disconnect functionality, and a breadcrumb-based folder browser dialog for navigating Box.com files/folders and selecting `boxFolderId`/`boxFileId`.
- **Audit Logs**: Read-only paginated table with filters for log type, user, and date range. Also includes album download log hooks for use in AlbumDetailPage.
- **Routing**: Wire three new admin routes (`/admin/users`, `/admin/settings/box`, `/admin/audit`) into `admin.routes.tsx`.
- **Backend requirement**: Box OAuth callback should redirect to `/admin/settings/box?box_connected=true` instead of showing static HTML.

## Capabilities

### New Capabilities
- `user-management`: Admin CRUD for users with role/status filters, password generation (auto/manual + MD5 hash), activate/deactivate toggle, and password regeneration
- `box-settings`: Box.com OAuth2 connection via redirect, status polling, disconnect, and breadcrumb-based folder/file browser dialog with selection
- `audit-logs`: Paginated audit log viewer with logType/userId/date-range filters, plus album download log hooks

### Modified Capabilities
_(none — all new features, no existing spec changes)_

## Impact

- **New files**: ~25-30 files across `src/features/user/`, `src/features/box/`, `src/features/audit/`
- **Modified files**: `admin.routes.tsx` (add 3 routes), `api-map.md` (update query param documentation)
- **Shared components**: New `PasswordRevealDialog` in user feature (shared between create and regenerate flows)
- **Dependencies**: `md5` or `crypto-js` package for client-side MD5 hashing of passwords
- **Backend**: Box callback redirect URL change (provided separately to backend team)
- **Sidebar**: Already wired — Users, Box Settings, Audit Logs nav items exist with `adminOnly: true`
