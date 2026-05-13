# System Architecture

High-level overview of application structure, data flow, and key decisions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│  BROWSER                                                         │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │ React 19 + TypeScript SPA (Vite)                            ││
│  │                                                              ││
│  │ ┌──────────────────┐  ┌──────────────────┐                 ││
│  │ │ Admin Portal     │  │ User Portal      │                 ││
│  │ │ /admin/*         │  │ /portal/*        │                 ││
│  │ │ (Admin, Teacher) │  │ (Student, Parent)│                 ││
│  │ └──────────────────┘  └──────────────────┘                 ││
│  │          │                     │                             ││
│  │          └─────────┬───────────┘                             ││
│  │                    │                                          ││
│  │         TanStack Query v5 (Server State)                      ││
│  │         Zustand (Auth Session)                               ││
│  │         React Hook Form + Zod (Forms)                        ││
│  │                    │                                          ││
│  │         ┌──────────▼──────────┐                             ││
│  │         │ Axios Client        │                             ││
│  │         │ + x-session-id      │                             ││
│  │         │ + 401 Handler       │                             ││
│  │         └──────────┬──────────┘                             ││
│  └──────────────────────────────────────────────────────────────┘
│                       │
│    Vite Dev Proxy    │    (Production CDN)
│    /api → :3000      │
│                       │
└───────────────────────┼───────────────────────────────────────────┘
                        │
            ┌───────────▼───────────┐
            │ REST Backend API      │
            │ (localhost:3000)      │
            │                       │
            │ POST /auth/login      │
            │ GET /auth/me          │
            │ GET /schools          │
            │ POST /albums          │
            │ POST /albums/:id/img  │
            │ GET /images/:id/url   │ ◄── Returns signed Box URL
            │ GET /images/:id/dl    │ ◄── Applies watermark
            │ GET /audit-logs       │
            │ ... (see docs/api-map)│
            └───────────┬───────────┘
                        │
            ┌───────────▼───────────┐
            │ Box.com API           │
            │                       │
            │ Store files           │
            │ Generate signed URLs  │
            │ (never called by FE)  │
            └───────────────────────┘
```

## Layer Architecture

### 1. UI Layer (React Components)
- **Pages** — Route endpoints (e.g., `AlbumDetailPage.tsx`)
- **Components** — Reusable UI (buttons, forms, cards, tables)
- **Layouts** — Admin and Portal wrappers (sidebar, header, nav)

Data enters via props or TanStack Query hooks.

### 2. Data Fetching Layer (TanStack Query v5)
Manages server state with automatic caching and refetching.

**Features:**
- Query deduplication (same key = same request)
- Automatic background refetch on window focus
- Stale-while-revalidate pattern
- Error boundaries for failed queries

**Query key strategy:**
```ts
["albums"]                               // all albums
["albums", classId]                      // albums in class
["albums", classId, { status: "DRAFT" }] // filtered albums
["images", albumId]                      // images in album
["audit-logs", { limit: 50, offset: 0 }] // paginated logs
```

### 3. Hooks Layer (Custom React Hooks)
Thin wrappers around TanStack Query. Each domain owns its hooks.

```ts
// src/features/album/hooks/useAlbums.ts
export function useAlbums(classId: string) {
  return useQuery({
    queryKey: ["albums", classId],
    queryFn: () => albumApi.list(classId),
  });
}

// src/features/album/hooks/useAlbumMutations.ts
export function useCreateAlbum() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input) => albumApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["albums"] }),
  });
}
```

Components call hooks; hooks call API layer.

### 4. API Layer (Axios Client)
Thin HTTP client. Each domain has one `*Api.ts` file that calls `apiClient`.

```ts
// src/features/album/api/albumApi.ts
export const albumApi = {
  list: (classId: string) => 
    apiClient.get(`/albums?classId=${classId}`),
  create: (input: CreateAlbumInput) => 
    apiClient.post("/albums", input),
  uploadImages: (albumId: string, files: File[]) => {
    const formData = new FormData();
    files.forEach(f => formData.append("files", f));
    return apiClient.post(`/albums/${albumId}/images`, formData);
  },
};
```

**apiClient interceptors:**
- Add `x-session-id` header (from storage)
- On 401 → clear storage, redirect to `/login`
- Normalize error responses

### 5. Storage & Session Layer (Zustand)
Manages auth state in memory + storage.

```ts
// src/shared/lib/apiClient.ts
const token = useAuthStore.getState().sessionToken;
if (token) {
  config.headers["x-session-id"] = token;
}

// src/features/auth/stores/useAuthStore.ts
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  sessionToken: null,
  setSession: (token, user, keepMeLogin) => {
    const storage = keepMeLogin ? localStorage : sessionStorage;
    storage.setItem("sessionToken", token);
    set({ user, sessionToken: token });
  },
  logout: () => {
    localStorage.removeItem("sessionToken");
    sessionStorage.removeItem("sessionToken");
    set({ user: null, sessionToken: null });
  },
}));
```

## Authentication & Authorization

### Login Flow

```
1. User enters email + password → LoginPage
2. Form submits to POST /auth/login
3. Backend returns { user, sessionToken }
4. Frontend:
   - Save sessionToken to storage (localStorage if "keep me logged in", else sessionStorage)
   - Save user to Zustand store
   - Redirect by role:
     - ADMIN → /admin
     - TEACHER → /admin/my-classes
     - STUDENT → /portal
     - PROTECTOR → /portal
```

### Route Guards

**AuthGuard** — Requires logged-in session
```ts
if (!sessionToken) redirect("/login");
```

**AdminGuard** — ADMIN or TEACHER only
```ts
if (![ADMIN, TEACHER].includes(user.role)) redirect("/portal");
```

**PortalGuard** — STUDENT or PROTECTOR only
```ts
if (![STUDENT, PROTECTOR].includes(user.role)) redirect("/admin");
```

See `docs/auth-flow.md` for detailed flow.

### Session Token Management

**Storage strategy:**
- If `keepMeLogin = true` → `localStorage` (persists across sessions)
- If `keepMeLogin = false` → `sessionStorage` (cleared on browser close)

**Axios interceptor:**
```ts
// src/shared/lib/apiClient.ts
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("sessionToken") || 
                sessionStorage.getItem("sessionToken");
  if (token) {
    config.headers["x-session-id"] = token;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
```

## Routing & Portal Split

### Admin Portal (`/admin/*`)
For ADMIN and TEACHER roles.

**Routes:**
- `/admin` → Dashboard (stats + recent activity)
- `/admin/schools` → School list + CRUD
- `/admin/schools/:id` → School detail + classes
- `/admin/classes/:id` → Class detail (students, albums, teachers)
- `/admin/students/:id` → Student detail (protectors)
- `/admin/albums/:id` → Album detail (images, upload, publish, archive)
- `/admin/users` → User management
- `/admin/box-settings` → Box.com connection
- `/admin/audit-logs` → Audit log viewer
- `/admin/my-classes` → Teacher's classes (teacher view only)

**Layout:** Sidebar (collapsible) + header (logo, profile dropdown)

### User Portal (`/portal/*`)
For STUDENT and PROTECTOR roles.

**Routes:**
- `/portal` → Home (redirect logic by role)
- `/portal/my-students` → Protector's student list
- `/portal/students/:id` → Student view (albums, info)
- `/portal/albums/:id` → Album view (gallery + download)
- `/portal/profile` → User profile + change password

**Layout:** Top bar + bottom nav (mobile-friendly)

**Two portals ensure:**
- Cleaner permissions (no logic to "hide admin-only buttons")
- Better UX for different user types
- Easier testing and maintenance

## Data Flow: Image Upload → Download

### Upload Flow (Teacher)
```
1. Teacher opens AlbumDetailPage
   → useAlbums queries GET /albums/:id
   
2. Uses ImageUploader to select files
   
3. Calls useImageMutations.uploadImages()
   → POST /albums/:id/images (multipart FormData)
   → Backend stores in Box, saves metadata in DB
   
4. TanStack Query auto-refetches images list
   
5. ImageGrid updates with new thumbnails
   → Each thumbnail has lazy-loaded img tag
```

### Download Flow (Parent)
```
1. Parent opens AlbumViewPage
   → useAlbums queries GET /albums/:id (PUBLISHED only)
   → ImageGrid shows thumbnails
   
2. Parent clicks image
   → Lightbox opens
   → Fetches GET /images/:id/url (returns signed Box URL)
   → Displays in lightbox (no watermark for preview)
   
3. Parent clicks "Download"
   → Calls GET /images/:id/download
   → Backend fetches from Box, applies watermark, streams back
   → Browser downloads watermarked image
   
4. Audit log entry created server-side
   → useAuditLogs component picks it up on next refetch
```

## File Storage & Watermarking

**Frontend responsibility:** Never talk to Box directly; always route through backend.

**Backend responsibility:**
- Store images in Box folders (organized by school/class)
- Generate signed Box URLs (short-lived, one-time use)
- Apply watermarks on download (server-side only)
- Never watermark: preview, student documents

**Why server-side watermarking?**
- Client-side watermarks are trivial to remove
- Ensures compliance with FERPA
- Audit trail: server logs every download with user + timestamp

See `docs/secure-gallery-mvp-plan.md` for watermarking strategy.

## State Management Patterns

### Server State (Data)
**Tool:** TanStack Query

When to use: Any data from backend (schools, classes, albums, users, logs)

```ts
const { data: albums, isLoading, error } = useAlbums(classId);
```

### Session State (Auth)
**Tool:** Zustand

When to use: Current user, session token, role checks

```ts
const { user, sessionToken, isAdmin } = useAuthStore();
```

### Form State
**Tool:** React Hook Form + Zod

When to use: Form inputs, validation errors

```ts
const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
});
```

### UI State (Local)
**Tool:** React useState

When to use: Modal open/close, sidebar collapsed, selected items

```ts
const [isOpen, setIsOpen] = useState(false);
const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
```

## Error Handling

### API Errors
```ts
try {
  await albumMutation.mutateAsync(data);
  toast.success("Album created!");
} catch (error) {
  const message = normalizeApiError(error);
  toast.error(message); // e.g., "Invalid album name"
}
```

### Form Errors
```ts
const form = useForm({...});
// Hook Form displays errors inline
<FormField
  control={form.control}
  name="title"
  render={({ field, fieldState }) => (
    <Input {...field} />
    {fieldState.error && <span>{fieldState.error.message}</span>}
  )}
/>
```

### Route/Component Errors
```tsx
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <AlbumDetailPage />
</ErrorBoundary>
```

If component throws, boundary catches + displays fallback UI.

### Global 401 Errors
Axios interceptor handles unauthorized:
```ts
// Response interceptor clears session + redirects to /login
if (error.response?.status === 401) {
  useAuthStore.getState().logout();
  window.location.href = "/login";
}
```

## Performance Optimizations

1. **Code splitting** — All routes lazy-loaded; reduces initial bundle
2. **Image thumbnails** — `loading="lazy"` on img tags; Intersection Observer optional
3. **Query caching** — TanStack Query caches results; avoids refetch on tab switch
4. **Memoization** — React.memo for expensive renders (DataTable, ImageGrid)
5. **Input debouncing** — Search inputs debounced 300ms before API call

## Build & Dev Environment

### Dev
```bash
npm run dev
# Vite dev server on localhost:5173
# Proxies /api → http://localhost:3000 (backend)
# HMR enabled for instant reload
```

### Build
```bash
npm run build
# Runs: tsc -b (type check) + vite build
# Outputs: dist/
# Ready for any static CDN (Vercel, Netlify, S3, etc.)
```

### Environment Config
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=School Box Portal
```

Validated in `src/shared/lib/env.ts` using Zod.

## Testing Architecture

### Unit/Component Tests (Vitest + RTL)
- Test individual hooks, components, utilities
- Mock external dependencies with MSW
- Use test factories for consistent data

### E2E Tests (Playwright)
- Test complete user journeys
- Setup in progress (Phase 10)
- Examples: Login → Dashboard → Create Album flow

### Mocking (MSW)
All API endpoints mocked in `src/test/handlers.ts`.

```ts
// Example handler
http.get("/api/albums", ({ request }) => {
  const classId = new URL(request.url).searchParams.get("classId");
  const albums = factory.createAlbum.buildList(3);
  return HttpResponse.json({ success: true, data: albums });
}),
```

---

For detailed API reference, see `docs/api-map.md`.
For auth details, see `docs/auth-flow.md`.
For component inventory, see `docs/codebase-summary.md`.

**Last updated:** 2026-05-11
