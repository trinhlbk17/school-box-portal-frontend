## Why

Phase 0 established the Vite + React + TypeScript foundation with folder structure and design tokens. However, the app currently renders a static placeholder — there is no authentication, no routing, no layouts, and no protected pages. Without these, no feature work (schools, classes, albums) can begin because every feature page requires a logged-in user, role-based access, and a navigation shell.

Phase 1 unblocks all subsequent development by building the minimum viable app shell: login, session management, route guards, and two distinct layouts (Admin and Portal).

## What Changes

- Create a centralized Axios API client with `x-session-id` header injection and 401 auto-logout
- Create shared TypeScript types for API responses (`ApiResponse<T>`, `PaginatedResponse<T>`, `AppError`)
- Create error normalization utility for consistent error handling across the app
- Create route/role constants used throughout routing and guards
- Implement full auth feature: types, API calls, Zustand store, Zod login schema, mutation/query hooks
- Implement three route guards: `AuthGuard` (session check), `AdminGuard` (ADMIN + TEACHER), `PortalGuard` (STUDENT + PROTECTOR)
- Create `AdminLayout` with collapsible sidebar and header
- Create `PortalLayout` with top bar and bottom navigation
- Create sidebar navigation component (role-aware menu items)
- Create top bar / header component (logo, profile dropdown)
- Set up route configuration with lazy-loaded admin and portal routes
- Create providers wrapper (QueryClientProvider, BrowserRouter)
- Build the Login page with form validation and role-based redirect
- Replace the current placeholder App.tsx with the real routing + provider setup
- Clean up orphaned `src/App.tsx` (Vite boilerplate)

## Capabilities

### New Capabilities
- `api-client`: Centralized Axios client with session auth interceptor, 401 handling, and shared types
- `auth-session`: Login/logout flow, session persistence (localStorage/sessionStorage), user state management via Zustand
- `route-guards`: Three-tier route protection (AuthGuard, AdminGuard, PortalGuard) with role-based redirect
- `app-layouts`: Admin sidebar layout and Portal top/bottom layout with responsive navigation
- `app-routing`: React Router configuration with lazy-loaded routes, role-based redirect on login

### Modified Capabilities
_None — this is greenfield work on an empty scaffold._

## Impact

- **Files created**: ~25 new files across `src/shared/`, `src/features/auth/`, `src/app/`
- **Files modified**: `src/app/App.tsx` (replaced), `src/main.tsx` (possibly), `src/App.tsx` (deleted)
- **Dependencies used**: axios, zustand, react-router-dom, @tanstack/react-query, react-hook-form, zod, @hookform/resolvers (all already installed)
- **Backend integration**: Requires running backend with `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` endpoints
- **No breaking changes**: This is the first real feature work on an empty scaffold
