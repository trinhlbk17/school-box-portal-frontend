## 1. Audit Logs Feature (6C)

- [x] 1.1 Create `audit/types/audit.types.ts` — LogType enum, AuditLog interface, AuditQueryParams, AlbumDownloadLog interface
- [x] 1.2 Create `audit/api/auditApi.ts` — `getLogs(params)`, `getAlbumDownloadLogs(albumId, page, limit)`
- [x] 1.3 Create `audit/hooks/useAuditLogs.ts` — TanStack Query hook with filter params
- [x] 1.4 Create `audit/hooks/useAlbumDownloadLogs.ts` — TanStack Query hook for album-specific download logs
- [x] 1.5 Create `audit/components/AuditLogPage.tsx` — Table with inline filters (logType dropdown, userId input, date from/to, pagination)
- [x] 1.6 Update `audit/index.ts` barrel exports
- [x] 1.7 Add audit route to `admin.routes.tsx` (`/admin/audit` → AuditLogPage)

## 2. User Management Foundation (6A)

- [x] 2.1 Install `crypto-js` package for MD5 hashing
- [x] 2.2 Create `user/types/user.types.ts` — AdminUser extends auth User, AdminUserDetail, CreateUserInput, UpdateUserInput, UserQueryParams, UserSortBy/SortOrder enums
- [x] 2.3 Create `user/api/userApi.ts` — `getUsers`, `getUser`, `createUser`, `updateUser`, `deactivateUser`, `activateUser`, `regeneratePassword`, `deleteUser`
- [x] 2.4 Create `user/hooks/useUsers.ts` — TanStack Query hook with filter/sort/pagination params
- [x] 2.5 Create `user/hooks/useUserMutations.ts` — Mutation hooks for create, update, deactivate, activate, regeneratePassword, delete
- [x] 2.6 Create `user/schemas/userSchema.ts` — Zod schemas for create (email, name, role, password mode, password) and update (email, name)

## 3. User Management UI (6A)

- [x] 3.1 Create `user/components/PasswordRevealDialog.tsx` — Dialog showing password with copy-to-clipboard button, one-time view
- [x] 3.2 Create `user/components/UserForm.tsx` — Create/edit modal with dual password mode (auto-generate toggle + manual input), MD5 hash on submit
- [x] 3.3 Create `user/components/UserListPage.tsx` — DataTable with role filter dropdown, status filter dropdown, search input, sort controls, action buttons (edit, activate/deactivate, regenerate password, delete)
- [x] 3.4 Update `user/index.ts` barrel exports
- [x] 3.5 Add user route to `admin.routes.tsx` (`/admin/users` → UserListPage)

## 4. Box Settings Foundation (6B)

- [x] 4.1 Create `box/types/box.types.ts` — BoxStatus, BoxAuthUrl, BoxFolderItem, BoxFolderItemsResponse, BoxFolderBrowserResult, BoxFolderStackBrowserResult
- [x] 4.2 Create `box/api/boxApi.ts` — `getStatus`, `getAuthUrl`, `disconnect`, `getFolderItems(folderId, itemType?)`
- [x] 4.3 Create `box/hooks/useBoxStatus.ts` — TanStack Query hook with 30s staleTimection status
- [x] 4.4 Create `box/hooks/useBoxConnect.ts` — `useBoxConnect` (redirect-based) and `useBoxDisconnect` mutationdow.location.href
- [x] 4.5 Create `box/hooks/useBoxFolderItems.ts` — TanStack Query hook for folder browsingtents, takes folderId param

## 5. Box Settings UI (6B)

- [x] 5.1 Create `box/components/BoxFolderBrowser.tsx` — Dialog with breadcrumb nav, file type icons, folder-click to enter, item select callbackension), folder click to navigate, select button to pick file/folder, returns selected item via onSelect callback
- [x] 5.2 Create `box/components/BoxSettingsPage.tsx` — Connected/disconnected states, OAuth redirect flow, query param detection for success notificationnect buttons, browse files button opens BoxFolderBrowser, detects `?box_connected=true` query param for success toast
- [x] 5.3 Update `box/index.ts` barrel exports
- [x] 5.4 Add Box route to `admin.routes.tsx` (`/admin/settings/box` → BoxSettingsPage)

## 6. Final Verification

- [x] 6.1 Run `npx tsc --noEmit` — zero errors
- [x] 6.2 Run `npm run lint` — zero errors (pre-existing warnings OK)
- [x] 6.3 Update `docs/api-map.md` — add Box integration endpoints sectionr `/users` and `/audit/logs`
