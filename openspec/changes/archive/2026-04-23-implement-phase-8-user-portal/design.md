## Context

The system currently has robust management features for Admin and Teacher roles. Phase 8 shifts focus to the end-users: Students and Protectors. These users require a streamlined, mobile-first experience to view student information and class albums, without the complexities of administrative controls. A key technical challenge is securely reusing existing complex components (like `ImageGrid` and `Lightbox` built in Phase 5) in a read-only capacity, while handling role-based routing directly from the `/portal` entry point.

## Goals / Non-Goals

**Goals:**
- Implement role-based redirection for `/portal` to guide Protectors and Students to their respective starting views.
- Create mobile-first, read-only views for Protector's assigned students (`MyStudentsPage`) and specific student profiles (`StudentViewPage`).
- Adapt existing image gallery components (`ImageGrid`, `Lightbox`) to support a strict read-only mode for the end-user portal.
- Ensure all download actions triggered in the portal use watermarked endpoints.

**Non-Goals:**
- Implementation of Box folder browsing (`StudentFoldersTab`) as the backend Box API is currently restricted to Admin roles.
- Implementation of the `ChangePasswordPage` feature, as it requires an email OTP flow that is currently out of scope.
- Admin or Teacher functionalities; these views are strictly isolated via `PortalGuard`.

## Decisions

**1. Role-Based Redirection in PortalHomePage**
Instead of a static landing page, `/portal` will act as a smart router. It will utilize the `useAuthStore` to inspect the current user's role. If `PROTECTOR`, it redirects to `/portal/students`. If `STUDENT`, it will redirect to their specific profile page (`/portal/students/:myStudentId`). 
*Rationale:* Provides a seamless, single-entry-point UX without requiring users to navigate menus immediately upon login.

**2. Refactoring Phase 5 Components for Read-Only Use**
We will extend `ImageGrid.tsx` and `Lightbox.tsx` with a `readonly?: boolean` property. When `readonly` is true:
- Checkboxes for multi-selection and bulk actions are hidden.
- The "Set as Cover" and "Delete" actions are removed from the UI.
- The `ImageUploader` dropzone is entirely hidden.
- A watermark warning banner is displayed within or above the Lightbox.
*Rationale:* Reusing these complex components ensures UI consistency and reduces code duplication. Adding a `readonly` flag is less intrusive than duplicating the components.

**3. API Hook Segregation**
New API hooks specifically for the portal views (e.g., `useMyStudents.ts` fetching from `/api/protectors/my-students`) will be placed within the `protector` feature folder to maintain domain-driven isolation, rather than mixing them into generic shared queries.
*Rationale:* Prevents the pollution of Admin-centric hooks and keeps data fetching logically grouped by domain capability.

## Risks / Trade-offs

- **Risk:** Obtaining the `studentProfileId` for the `STUDENT` redirection flow. The `User` object from `GET /auth/me` may not include a direct reference to their student ID, which is required to redirect them to `/portal/students/:id`.
  - **Mitigation:** We will need to verify the `GET /auth/me` payload. If missing, we may need to request a backend update to include `studentProfileId` in the `User` object, or fallback to routing students to a generic `/portal/my-albums` route if the backend cannot be modified.
- **Risk:** Hardcoded `api/api/` prefix in album image controllers (as noted in `api-map.md`).
  - **Mitigation:** Wrap URL construction for images in a utility function that normalizes the URL paths, preventing broken images if the backend environment changes or corrects this bug later.
