## 1. Setup & Dependencies

- [x] 1.1 Install `yet-another-react-lightbox` npm package

## 2. Foundation Layer (Types, API, Schemas)

- [x] 2.1 Create `album/types/album.types.ts` — Album, AlbumImage, AlbumStatus, CreateAlbumInput, UpdateAlbumInput, AlbumListParams interfaces
- [x] 2.2 Create `album/api/albumApi.ts` — Album CRUD, status transitions, image upload/delete/thumbnail/preview/download, ZIP download (with multipart + blob support)
- [x] 2.3 Create `album/schemas/albumSchema.ts` — Zod schemas for create/edit album form validation

## 3. Hooks Layer (TanStack Query)

- [x] 3.1 Create `album/hooks/useAlbums.ts` — useAlbums(classId), useAlbum(id) query hooks with query key factory
- [x] 3.2 Create `album/hooks/useAlbumMutations.ts` — useCreateAlbum, useUpdateAlbum, useDeleteAlbum mutation hooks
- [x] 3.3 Create `album/hooks/useAlbumActions.ts` — usePublishAlbum, useArchiveAlbum mutation hooks for status transitions
- [x] 3.4 Create `album/hooks/useImageMutations.ts` — useUploadImages (with progress + 120s timeout), useDeleteImage mutation hooks
- [x] 3.5 Create `album/hooks/useImageUrl.ts` — Custom hook: fetch blob via apiClient → createObjectURL → cleanup on unmount
- [x] 3.6 Create `album/hooks/useDownload.ts` — useDownloadImage, useDownloadAlbumZip hooks (blob download triggers)

## 4. Album List & Form Components

- [x] 4.1 Create `AlbumListTab.tsx` — Card grid showing albums in a class, with status badges, image count, status filter, "Create Album" button
- [x] 4.2 Create `AlbumForm.tsx` — Dialog form for create/edit album (name, description fields, Zod validation)

## 5. Album Detail Page

- [x] 5.1 Create `AlbumDetailPage.tsx` — Page shell with header (name, status badge, description), action bar with state-dependent buttons (Publish, Archive, Edit, Delete, Upload, Download ZIP), breadcrumbs
- [x] 5.2 Create `ImageGrid.tsx` — Responsive thumbnail grid (4-col desktop, 2-col mobile), multi-select with checkboxes, bulk action bar, skeleton loading via useImageUrl hook
- [x] 5.3 Create `ImageUploader.tsx` — Drag-and-drop zone with click-to-browse fallback, file type filter (images only), max 20 files validation, overall progress bar
- [x] 5.4 Create `Lightbox.tsx` — YARL wrapper component with custom render for authenticated Blob URL images, prev/next navigation, close on Escape

## 6. Integration & Wiring

- [x] 6.1 Update `ClassDetailPage.tsx` — Replace Albums tab placeholder with AlbumListTab component
- [x] 6.2 Update `admin.routes.tsx` — Add lazy-loaded route for AlbumDetailPage at `/admin/classes/:classId/albums/:albumId`
- [x] 6.3 Create `album/index.ts` — Barrel exports for all public types, hooks, and components

## 7. Verification

- [x] 7.1 TypeScript check — Run `npx tsc --noEmit` with zero errors
- [x] 7.2 Lint check — Run `npm run lint` with zero errors
- [x] 7.3 Manual test — Album CRUD flow: create album → upload images → preview in lightbox → publish → download ZIP → archive
