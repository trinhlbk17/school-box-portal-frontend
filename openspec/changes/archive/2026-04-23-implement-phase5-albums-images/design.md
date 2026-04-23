## Context

The School Box Portal frontend has Phases 0–4 complete: auth, layouts, schools, classes, students, and protectors. The `album` feature folder exists but is empty (scaffolded dirs, blank `index.ts`). The `ClassDetailPage` Albums tab shows a "coming soon" placeholder. The route constant `ROUTES.ADMIN.ALBUM_DETAIL(classId, albumId)` is already defined but not wired into `admin.routes.tsx`.

Backend API is ready:
- Album CRUD: `POST /albums`, `GET /classes/:classId/albums`, `GET /albums/:id`, `PUT /albums/:id`, `DELETE /albums/:id`
- Status transitions: `POST /albums/:id/publish`, `POST /albums/:id/archive`
- Image upload: `POST /albums/:id/images` (multipart, max 20 files)
- Image operations: `DELETE /album-images/:id`, `GET /album-images/:id/thumbnail`, `GET /album-images/:id/preview`, `GET /album-images/:id/download`
- ZIP download: `POST /albums/:id/download-zip`

The AlbumImage double-prefix bug (P0) is resolved. Teachers can now create albums (P1 resolved).

## Goals / Non-Goals

**Goals:**
- Complete album CRUD with full lifecycle (DRAFT → PUBLISHED → ARCHIVED)
- Multi-file image upload with drag-and-drop and progress feedback
- Thumbnail grid with multi-select for bulk operations
- Lightbox preview with prev/next navigation
- Authenticated binary image loading via Blob URLs
- Replace the ClassDetailPage Albums tab placeholder with real content

**Non-Goals:**
- Portal user views (Phase 8 — protector/student album viewing)
- Download audit logs display (Phase 6 — audit feature)
- Shared folder browsing (backend not ready)
- Image editing/cropping
- Album reordering or custom sorting

## Decisions

### 1. Authenticated Image Loading: Blob URLs via apiClient

**Decision**: Fetch image binaries through `apiClient` with `responseType: 'blob'`, then create object URLs via `URL.createObjectURL()`.

**Alternatives considered**:
- **Direct `<img src>` URLs**: Won't work because auth uses `x-session-id` header, not cookies. Browsers can't send custom headers on `<img>` requests.
- **Query param auth (`?sessionId=xxx`)**: Exposes session token in server logs, browser history, and referrer headers. Security risk.

**Implementation**: A `useImageUrl(imageId, type)` custom hook that:
1. Fetches blob via apiClient
2. Creates an object URL
3. Returns `{ url, isLoading, error }`
4. Revokes the object URL on unmount (memory cleanup)

### 2. Lightbox Library: yet-another-react-lightbox (YARL)

**Decision**: Use `yet-another-react-lightbox` for the fullscreen image viewer.

**Rationale**:
- Modern React-native architecture (not a wrapper around vanilla JS)
- Plugin-based: lightweight core, add zoom/thumbnails/captions as needed
- Built-in TypeScript support
- Actively maintained, high adoption
- Supports custom render for authenticated image sources (critical for our Blob URL approach)

### 3. Upload UX: Overall progress with extended timeout

**Decision**: Show a single overall progress bar during batch upload (not per-file). Extend timeout to 120s for the upload endpoint only.

**Rationale**:
- The backend accepts a single multipart request with up to 20 files — it's one HTTP request, not 20
- Per-file progress isn't meaningful for a single request
- Default 15s timeout is too short for large image batches

**Error handling**: If the upload request fails, show a toast with the error. The user can retry the entire batch.

### 4. Album State Machine: Show disabled actions with tooltips

**Decision**: Always render all action buttons (Publish, Archive, Upload, Download, Edit, Delete) but disable those not available in the current state, with a tooltip explaining why.

**Rationale**: Users understand the full album lifecycle without needing to discover hidden features. Reduces confusion about "where did the button go?"

### 5. Feature Module Structure: Follow existing patterns

**Decision**: Follow the exact same structure as `student/` and `class/` features:
```
src/features/album/
├── types/album.types.ts
├── api/albumApi.ts
├── hooks/useAlbums.ts      (all query + mutation hooks)
├── schemas/albumSchema.ts
├── components/
│   ├── AlbumListTab.tsx     (card grid in ClassDetail)
│   ├── AlbumForm.tsx        (create/edit dialog)
│   ├── AlbumDetailPage.tsx  (full page)
│   ├── ImageGrid.tsx        (thumbnail grid + multi-select)
│   ├── ImageUploader.tsx    (drag & drop zone)
│   └── Lightbox.tsx         (YARL wrapper)
└── index.ts
```

Note: `AlbumDetailPage.tsx` is placed in `components/` rather than `pages/` to follow the existing pattern where student and class features put pages directly in the feature folder or components folder. The routing lazy-import path will reference it accordingly.

### 6. Query Key Strategy

Following the established pattern: `[resource, ...identifiers, { filters }]`
```typescript
albumKeys = {
  all: ["albums"],
  lists: (classId: string) => ["albums", "list", classId],
  details: () => ["albums", "detail"],
  detail: (id: string) => ["albums", "detail", id],
  images: (albumId: string) => ["albums", albumId, "images"],
}
```

## Risks / Trade-offs

**[Risk] Blob URLs consume memory for large albums** → Mitigation: Revoke URLs on unmount via `useImageUrl` hook cleanup. Only load visible thumbnails (intersection observer / virtualization can be added later if needed).

**[Risk] 20-file upload may timeout on slow connections** → Mitigation: 120s timeout. Future improvement: chunked upload or per-file upload endpoint.

**[Risk] YARL library adds bundle size** → Mitigation: YARL core is ~15KB gzipped. Only import plugins we use (zoom, navigation). Lazy-load the lightbox component.

**[Trade-off] Blob URL approach means no browser image caching** → Accepted. The alternative (cookie-based auth or query param auth) has worse security implications. TanStack Query will cache the blob data in memory, providing application-level caching.
