# Tech Stack — School Box Portal Frontend

> Decision date: 2026-04-21
> Applies to: `box-portal-frontend`

---

## Core Stack

| Layer | Technology | Version | Reason for selection |
|-------|-----------|---------|------------|
| Build | Vite | Latest | Fast, good HMR, community standard |
| Framework | React | 18+ | Follows REACT_CODING_STANDARDS.md |
| Language | TypeScript | 5.x | `strict: true`, no `any` |
| Routing | React Router | v7 | Mature, sufficient for project size |
| UI Components | shadcn/ui | Latest | Code-gen, own code, uses Radix primitives |
| Styling | Tailwind CSS | v4 | CSS-first config, `@theme` directive |
| Data Fetching | TanStack Query | v5 | Server state, caching, auto-refetch |
| HTTP Client | Axios | Latest | Interceptors for `x-session-id` |
| Client State | Zustand | Latest | Auth session, UI globals |
| Forms | React Hook Form | Latest | Performance, uncontrolled inputs |
| Validation | Zod | Latest | Schema-first, infer TS types |
| Utilities | clsx + tailwind-merge | Latest | `cn()` helper pattern |
| Variants | class-variance-authority (cva) | Latest | Variant-based component styling |

## Testing

| Layer | Technology |
|-------|-----------|
| Unit / Component | Vitest + React Testing Library |
| E2E | Playwright |
| Mock API | MSW (Mock Service Worker) |

## Authentication Strategy

Backend uses a custom header `x-session-id` (not a Bearer token).

**Token storage logic:**
- Login response returns `{ sessionToken, user, keepMeLogin }`
- If `keepMeLogin = true` → save to `localStorage`
- If `keepMeLogin = false` → save to `sessionStorage`
- Axios interceptor reads token from storage and attaches it to the `x-session-id` header
- On HTTP 401 receipt → clear storage, redirect to `/login`

**Zustand Auth Store:**
```
AuthStore {
  user: User | null
  sessionToken: string | null
  setSession(token, user, keepMeLogin): void
  logout(): void
  isAuthenticated: boolean (derived)
  isAdmin: boolean (derived)
  isTeacher: boolean (derived)
  isStudent: boolean (derived)
  isProtector: boolean (derived)
}
```

## Project Structure

Follows the feature-based structure from REACT_CODING_STANDARDS.md:

```
src/
├── app/                          # App shell, routing, providers
│   ├── routes/
│   │   ├── admin.routes.tsx      # Admin/Teacher portal routes
│   │   ├── portal.routes.tsx     # Student/Protector portal routes
│   │   └── auth.routes.tsx       # Login, OTP routes
│   ├── layouts/
│   │   ├── AdminLayout.tsx       # Sidebar + header for Admin/Teacher
│   │   └── PortalLayout.tsx      # Simple layout for Student/Protector
│   ├── guards/
│   │   ├── AuthGuard.tsx         # Redirect to /login if not authenticated
│   │   ├── AdminGuard.tsx        # Only ADMIN + TEACHER
│   │   └── PortalGuard.tsx       # Only STUDENT + PROTECTOR
│   ├── providers.tsx
│   └── App.tsx
│
├── features/
│   ├── auth/
│   │   ├── api/                  # authApi.ts
│   │   ├── components/           # LoginForm, OtpForm
│   │   ├── hooks/                # useLogin, useOtpVerify, useLogout
│   │   ├── schemas/              # loginSchema, otpSchema (Zod)
│   │   ├── stores/               # useAuthStore (Zustand)
│   │   └── index.ts
│   │
│   ├── school/
│   │   ├── api/                  # schoolApi.ts
│   │   ├── components/           # SchoolList, SchoolForm, SchoolCard
│   │   ├── hooks/                # useSchools, useSchool, useCreateSchool
│   │   ├── types/                # school.types.ts
│   │   └── index.ts
│   │
│   ├── class/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── student/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── protector/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── album/
│   │   ├── api/
│   │   ├── components/           # AlbumList, AlbumDetail, ImageGrid, ImageUploader
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── box/
│   │   ├── api/                  # boxApi.ts (status, auth-url, disconnect)
│   │   ├── components/           # BoxConnectionStatus, BoxFolderBrowser
│   │   ├── hooks/
│   │   └── index.ts
│   │
│   ├── user/
│   │   ├── api/
│   │   ├── components/           # UserList, UserForm
│   │   ├── hooks/
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── audit/
│       ├── api/
│       ├── components/           # AuditLogTable
│       ├── hooks/
│       └── index.ts
│
├── shared/
│   ├── components/               # Button, Card, Badge, DataTable, Modal, etc. (shadcn/ui)
│   ├── hooks/                    # useDebounce, usePagination
│   ├── lib/                      # apiClient.ts, cn.ts, formatDate.ts
│   ├── types/                    # api.types.ts (ApiResponse<T>, PaginatedResponse<T>)
│   └── constants/                # routes.ts, roles.ts
│
└── test/
    ├── factories/
    ├── handlers/                 # MSW handlers
    └── setup.ts
```

## API Client Configuration

```typescript
// shared/lib/apiClient.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // e.g. "http://localhost:3000/api"
  timeout: 15_000,
});

// Request: attach x-session-id
apiClient.interceptors.request.use((config) => {
  const token = getSessionToken(); // from localStorage or sessionStorage
  if (token) {
    config.headers["x-session-id"] = token;
  }
  return config;
});

// Response: handle 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(normalizeApiError(error));
  },
);
```

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=School Box Portal
```

## Coding Standards

Strict adherence to `REACT_CODING_STANDARDS.md`:
- No inline comments
- Feature-based structure
- TanStack Query for server state (never useState + useEffect)
- Zustand only for client-global state
- React Hook Form + Zod for all forms
- Early returns & guard clauses
- Error Boundaries per feature
- Lazy-load routes
