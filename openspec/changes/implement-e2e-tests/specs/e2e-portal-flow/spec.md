## ADDED Requirements

### Requirement: Portal Viewer Flow
The E2E suite SHALL verify that a Protector or Student can login, view their assigned students (for Protector), navigate to a student's albums, preview images, and download them.

#### Scenario: Protector views albums
- **WHEN** a Protector logs in
- **THEN** they are redirected to `/portal` and see their assigned students
- **WHEN** they click on a student and navigate to the Albums tab
- **THEN** they see published albums
- **WHEN** they open an album and view an image in the lightbox
- **THEN** they can see the watermark banner and trigger a download
