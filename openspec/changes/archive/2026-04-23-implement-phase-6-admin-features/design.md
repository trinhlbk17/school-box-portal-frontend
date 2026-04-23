## Context

Phases 0–5 are complete. The codebase has an established pattern for feature modules: `types/` → `api/` → `hooks/` → `schemas/` → `components/` → barrel `index.ts`. The three Phase 6 feature folders (`user/`, `box/`, `audit/`) already exist with empty subdirectories. The sidebar navigation and route constants are already wired.

**Backend verified**: All endpoints, query DTOs, and response shapes confirmed from source code.

## Goals / Non-Goals

**Goals:**
- Implement User Management with full CRUD, lifecycle actions, and password handling
- Implement Box Settings with OAuth redirect flow and folder/file browser dialog
- Implement Audit Logs with paginated, filterable log viewer
- Follow established feature module patterns for consistency

**Non-Goals:**
- User detail page (not in Phase 6 tasks — may add in future)
- Box folder browser for non-admin roles (backend is ADMIN-only)
- Reusable filter toolbar component (filters are page-specific per decision)
- Change password for portal users (deferred — requires OTP email)

## Decisions

### D1: User type hierarchy — Extend `auth.User`

**Decision:** Create `AdminUser extends User` and `AdminUserDetail extends AdminUser`.

**Rationale:** The `auth.types.ts` `User` interface (`id, email, name, role, isActive`) is the session context shape. The admin user management needs `createdAt`/`updatedAt` for list display, and the detail view adds role-specific metadata (e.g., `classCount` for teachers). Extending avoids duplication while keeping clean dependency direction (user imports from auth, never vice versa).

**Alternatives considered:**
- Duplicate User type entirely in user feature → Violates DRY, divergence risk
- Add all fields to auth User → Bloats session context with unnecessary fields

### D2: Password generation — Dual mode with client-side MD5

**Decision:** The Create User form offers two modes via toggle: "Auto-generate" (random 12-char password) and "Manual input". Both display plain-text password, then MD5-hash before API call.

**Rationale:** Backend `CreateUserDto` expects a `password` field as MD5 hash. Auto-generate is faster for bulk creation; manual gives control for specific requirements.

**Implementation:**
- Use `crypto-js/md5` for MD5 hashing (lightweight, tree-shakeable)
- `PasswordRevealDialog` component shared between Create and Regenerate flows
- Includes copy-to-clipboard button using `navigator.clipboard.writeText()`

### D3: Box OAuth — Redirect flow (not popup)

**Decision:** Navigate the current page to Box OAuth URL. Backend callback redirects to `/admin/settings/box?box_connected=true`.

**Rationale:** Popup approach leaves the original page stale with cached data and unclear state. Redirect ensures a clean page load with fresh data on return.

**Flow:**
1. User clicks "Connect to Box"
2. `GET /box/auth-url` → get OAuth URL
3. `window.location.href = authUrl` (navigate away)
4. Box OAuth → callback → backend redirects to frontend URL
5. BoxSettingsPage mounts, detects `?box_connected=true` query param → shows success toast
6. `GET /box/status` → render connected state

**Backend requirement:** Callback should redirect to `{FRONTEND_URL}/admin/settings/box?box_connected=true`. Frontend URL provided to backend team.

### D4: Box folder browser — Breadcrumb navigation in dialog

**Decision:** Build a custom folder browser dialog with breadcrumb navigation (not tree view). No external library.

**Rationale:** The Box folder API returns a flat list of items per folder, which maps naturally to a "click to enter, breadcrumb to go back" UX. This is simpler than a tree view and requires no library. Each folder click fetches `/box/folders/:folderId/items`.

**State model:**
```
folderStack: Array<{ id: string; name: string }>
// e.g., [{ id: "0", name: "Root" }, { id: "123", name: "School Docs" }]
// Current folder = last item in stack
// Breadcrumb renders stack items as clickable links
// Click breadcrumb item → truncate stack to that index
```

**Selection:** Items have type (`file` | `folder`) + name + id. User clicks to select, dialog returns `{ boxFolderId, boxFileId, name, type }` via `onSelect` callback.

### D5: Audit log filters — Page-specific inline toolbar

**Decision:** Build filter controls inline on the AuditLogPage. Use `<select>` for logType, text input for userId, and `<input type="date">` for from/to range.

**Rationale:** Audit is the only page needing date range + enum filters. Building a reusable component for a single consumer adds unnecessary abstraction.

**LogType enum values:** `LOGIN`, `FILE_VIEW`, `FILE_UPLOAD`, `FILE_DOWNLOAD`, `ALBUM_DOWNLOAD`, `CLASS_TRANSFER`, `CLASS_PROMOTION`.

### D6: Execution order — Audit → Users → Box

**Decision:** Build in order of increasing complexity.

**Rationale:** Audit (read-only table) is simplest and creates hooks useful for Phase 7 Dashboard. Users follows established CRUD patterns with new twists (password, filters). Box has the most novel patterns (OAuth, folder browser).

## Risks / Trade-offs

- **MD5 on client side** — MD5 is not secure for password hashing, but this matches the backend's expected input format. The backend re-hashes with bcrypt+salt. → Acceptable; this is a transport encoding, not the final hash.
- **No user detail page** — Phase 6 tasks don't include `UserDetailPage`. The `findOne` endpoint returns rich data. → Can be added later; list page covers admin needs for now.
- **Box OAuth redirect leaves app** — User temporarily leaves the SPA. → Mitigated by backend callback redirect returning them to the correct page.
- **Folder browser pagination** — Box API returns all items in a folder (no pagination). Large folders could be slow. → Acceptable for MVP; most school folders have manageable sizes.
