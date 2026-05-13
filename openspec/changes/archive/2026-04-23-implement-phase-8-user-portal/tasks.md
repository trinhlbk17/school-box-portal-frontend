## 1. Foundation & API Hooks

- [x] 1.1 Update `User` interface in `src/features/auth/types/auth.types.ts` to explicitly include `studentProfileId` if applicable for routing.
- [x] 1.2 Create `useMyStudents.ts` hook in `src/features/protector/hooks/` to fetch data from `GET /api/protectors/my-students`.

## 2. Component Adaptation (Read-Only Mode)

- [x] 2.1 Update `ImageGrid.tsx` to accept a `readonly?: boolean` prop. Hide selection checkboxes, the 'Set as Cover' action, the 'Delete' action, and the `ImageUploader` component when true.
- [x] 2.2 Update `Lightbox.tsx` to accept a `readonly?: boolean` prop. Hide the 'Delete' action and display a prominent watermark warning banner ("Downloaded images will contain a watermark").

## 3. Protector Views

- [x] 3.1 Create `StudentCard.tsx` component to display a student's basic info, class, school, and protector relationship badge.
- [x] 3.2 Create `MyStudentsPage.tsx` under `src/features/portal/pages/` to fetch and render the list of assigned students using `useMyStudents`.

## 4. Student Profile Views

- [x] 4.1 Create `StudentInfoTab.tsx` to display read-only student academic and demographic details.
- [x] 4.2 Create `StudentAlbumsTab.tsx` to fetch (`useAlbums` filtered by `status=PUBLISHED`) and display the class albums associated with the student.
- [x] 4.3 Create `StudentViewPage.tsx` to act as the container layout for the Info and Albums tabs for a specific student ID.

## 5. Portal Album Gallery

- [x] 5.1 Create `AlbumViewPage.tsx` under `src/features/portal/pages/` tailored for portal users.
- [x] 5.2 Integrate the read-only versions of `ImageGrid` and `Lightbox` into `AlbumViewPage.tsx`.
- [x] 5.3 Ensure the "Download All" button points to the `POST /api/albums/:id/download-zip` endpoint.

## 6. Routing Integration

- [x] 6.1 Create `PortalHomePage.tsx` to implement the role-based redirection logic (Protectors to `/portal/students`, Students to `/portal/students/:myStudentId`).
- [x] 6.2 Update `src/app/routes/portal.routes.tsx` to register `PortalHomePage`, `MyStudentsPage`, `StudentViewPage`, and `AlbumViewPage` with the appropriate path matching.
- [x] 6.3 Update `PortalLayout.tsx` (or top navigation component) to ensure breadcrumbs and navigation function correctly without a sidebar.
