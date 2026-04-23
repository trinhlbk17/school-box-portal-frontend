## 1. Shared Foundation

- [x] 1.1 Create `src/shared/types/api.types.ts` — `ApiResponse<T>`, `PaginatedResponse<T>`, `AppError` types
- [x] 1.2 Create `src/shared/lib/apiClient.ts` — Axios instance with `x-session-id` interceptor and 401 handling
- [x] 1.3 Create `src/shared/lib/normalizeApiError.ts` — converts any error to `AppError` shape
- [x] 1.4 Create `src/shared/constants/routes.ts` — all route path constants (`ROUTES.LOGIN`, `ROUTES.ADMIN.*`, `ROUTES.PORTAL.*`)
- [x] 1.5 Create `src/shared/constants/roles.ts` — role constants and role-to-redirect mapping

## 2. Auth Types & API

- [x] 2.1 Create `src/features/auth/types/auth.types.ts` — `User`, `LoginInput`, `LoginResponse` types
- [x] 2.2 Create `src/features/auth/api/authApi.ts` — `login()`, `logout()`, `getMe()` functions using apiClient
- [x] 2.3 Create `src/features/auth/schemas/loginSchema.ts` — Zod schema for login form validation

## 3. Auth State & Hooks

- [x] 3.1 Create `src/features/auth/stores/useAuthStore.ts` — Zustand store with user, sessionToken, rememberMe, setSession, logout
- [x] 3.2 Create `src/features/auth/hooks/useLogin.ts` — TanStack mutation hook calling authApi.login
- [x] 3.3 Create `src/features/auth/hooks/useLogout.ts` — TanStack mutation hook calling authApi.logout
- [x] 3.4 Create `src/features/auth/hooks/useCurrentUser.ts` — TanStack query hook calling authApi.getMe
- [x] 3.5 Update `src/features/auth/index.ts` — barrel exports for all auth types, hooks, stores, and schemas

## 4. Route Guards

- [x] 4.1 Create `src/app/guards/AuthGuard.tsx` — check session token, validate via /auth/me, redirect to /login if invalid
- [x] 4.2 Create `src/app/guards/AdminGuard.tsx` — allow ADMIN + TEACHER, redirect others to /portal
- [x] 4.3 Create `src/app/guards/PortalGuard.tsx` — allow STUDENT + PROTECTOR, redirect others to /admin

## 5. Layouts

- [x] 5.1 Create `src/app/layouts/AdminLayout.tsx` — sidebar + top header + `<Outlet />` content area
- [x] 5.2 Create `src/app/layouts/PortalLayout.tsx` — top bar + `<Outlet />` content + bottom navigation
- [x] 5.3 Create `src/app/layouts/components/Sidebar.tsx` — collapsible sidebar with role-aware menu items
- [x] 5.4 Create `src/app/layouts/components/AdminHeader.tsx` — app name/logo + profile dropdown with logout
- [x] 5.5 Create `src/app/layouts/components/PortalTopBar.tsx` — app name/logo + profile icon
- [x] 5.6 Create `src/app/layouts/components/PortalBottomNav.tsx` — bottom navigation with Home, My Students, Profile

## 6. Routing & Login Page

- [x] 6.1 Create `src/app/routes/auth.routes.tsx` — public login route
- [x] 6.2 Create `src/app/routes/admin.routes.tsx` — admin routes with lazy-loaded placeholder pages
- [x] 6.3 Create `src/app/routes/portal.routes.tsx` — portal routes with lazy-loaded placeholder pages
- [x] 6.4 Create `src/app/providers.tsx` — compose QueryClientProvider + BrowserRouter
- [x] 6.5 Replace `src/app/App.tsx` — route composition with providers, guards, and layouts
- [x] 6.6 Create `src/features/auth/components/LoginPage.tsx` — login form with RHF + Zod + role-based redirect
- [x] 6.7 Create `src/app/pages/NotFoundPage.tsx` — 404 fallback page
- [x] 6.8 Delete orphaned `src/App.tsx` and `src/App.css` (Vite boilerplate)

## 7. Verification

- [x] 7.1 Run `npx tsc --noEmit` — verify zero TypeScript errors
- [x] 7.2 Run `npm run lint` — verify zero lint errors
- [x] 7.3 Run `npm run dev` — verify app boots, shows login page
- [x] 7.4 Test login flow with backend — verify role-based redirect works (manual, requires backend up)
- [x] 7.5 Verify guard redirects — /admin and /portal both redirect to /login when unauthenticated
