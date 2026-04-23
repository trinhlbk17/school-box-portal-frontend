## Why

The Admin Portal has school, class, student, and protector management complete (Phases 0–4). The next critical feature is **album and image management** — the core value proposition of School Box Portal. Without albums, there is no photo gallery for parents/protectors to view or download. This is the highest-priority remaining feature.

## What Changes

- Add complete Album CRUD lifecycle (create, read, update, delete) with status state machine (DRAFT → PUBLISHED → ARCHIVED)
- Add multi-file image upload with drag-and-drop UX and progress indicators
- Add thumbnail image grid with multi-select capability for bulk operations
- Add full-size image preview via lightbox (using `yet-another-react-lightbox` library)
- Add album status transitions: Publish (DRAFT→PUBLISHED), Archive (PUBLISHED→ARCHIVED)
- Add image download support (individual + ZIP download)
- Wire `AlbumListTab` into ClassDetailPage (replacing "coming soon" placeholder)
- Add `AlbumDetailPage` as a new routed page at `/admin/classes/:classId/albums/:albumId`
- Implement authenticated image loading via Blob URLs (required because session auth uses `x-session-id` header, not cookies)

## Capabilities

### New Capabilities
- `album-management`: Album CRUD, status transitions (DRAFT/PUBLISHED/ARCHIVED), album listing within class context
- `image-management`: Multi-file upload (multipart, max 20), image grid with thumbnails, image deletion, authenticated binary image fetching via Blob URLs
- `lightbox-viewer`: Full-size image preview with navigation (prev/next), using `yet-another-react-lightbox` library
- `image-upload`: Drag-and-drop upload zone with progress feedback, batch upload handling, extended timeout configuration

### Modified Capabilities
_(none — no existing specs are being changed)_

## Impact

- **New dependency**: `yet-another-react-lightbox` (npm package for lightbox component)
- **Modified files**: `ClassDetailPage.tsx` (replace Albums placeholder with `AlbumListTab`), `admin.routes.tsx` (add AlbumDetail route), `routes.ts` (route already defined)
- **API integration**: 7 new backend endpoints consumed (Albums CRUD + Album Images upload/delete/thumbnail/preview/download)
- **apiClient consideration**: Image endpoints return binary data — upload needs `multipart/form-data` content type and extended timeout; image fetches need `responseType: 'blob'`
- **New feature module**: `src/features/album/` (types, api, hooks, schemas, components)
