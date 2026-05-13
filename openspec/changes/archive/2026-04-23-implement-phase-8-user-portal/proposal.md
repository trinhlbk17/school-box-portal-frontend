## Why

This change implements Phase 8 of the School Box Portal Frontend, introducing the end-user portal specifically designed for Students and Protectors. Up to this point, development has focused on the Admin and Teacher experiences. This phase provides a simplified, mobile-first, and read-only environment where end-users can securely access student profiles, view published albums, and download watermarked images, completing the core functionality loop for the application.

## What Changes

- **Portal Routing Shell**: Implement `PortalHomePage.tsx` to handle role-based initial redirection (Protectors to student list, Students to their own profile).
- **Protector Views**: Add `MyStudentsPage.tsx` and `StudentCard.tsx` to display a list of children assigned to a logged-in protector using the `/api/protectors/my-students` endpoint.
- **Student Profile View**: Create `StudentViewPage.tsx` featuring tabbed navigation (Albums, Info) allowing read-only access to a student's basic details and published class albums.
- **Read-Only Album Gallery**: Implement `AlbumViewPage.tsx` for the portal, reusing and adapting Phase 5's `ImageGrid` and `Lightbox` components to enforce read-only constraints (hiding upload/delete actions).
- **Watermark & Downloads**: Integrate a watermark notice banner and wire up the "Download All" functionality to hit the watermarked ZIP download endpoint.
- **Deferred Functionality**: Specifically bypass and defer the implementation of Box folder browsing and direct password changes to align with MVP scope limitations.

## Capabilities

### New Capabilities

- `portal-routing`: Handles the specific `/portal` layout entry points and automatic role-based redirection for Students and Protectors.
- `protector-dashboard`: Allows protectors to retrieve and view a list of their assigned children.
- `student-profile-view`: Read-only display of a student's academic profile and associated class data.
- `portal-album-gallery`: Read-only image gallery viewing experience optimized for end-users, including watermarked download handling.

### Modified Capabilities

- None.

## Impact

- **UI Components**: Modifications to Phase 5 `ImageGrid` and `Lightbox` components will be required to introduce a `readonly` or portal-specific mode. This impacts shared components but will be done additively to avoid breaking Admin views.
- **Routing**: Activates and populates the `/portal/*` route space protected by `PortalGuard`.
- **Backend Coupling**: High dependency on `GET /auth/me` to determine user context, and read-heavy endpoints like `GET /protectors/my-students` and `GET /classes/:classId/albums`. Highlights a potential backend gap regarding how a Student user retrieves their own `studentProfileId` from the authentication payload.
