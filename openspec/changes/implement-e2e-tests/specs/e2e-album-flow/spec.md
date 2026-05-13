## ADDED Requirements

### Requirement: Album Upload Flow
The E2E suite SHALL verify that an Admin or Teacher can login, navigate to a class, create a draft album, upload images, preview them, publish the album, and then trigger a download of the ZIP.

#### Scenario: Admin lifecycle for album
- **WHEN** an Admin creates an album and uploads images
- **THEN** the images are rendered in the grid
- **WHEN** the Admin publishes the album
- **THEN** the status updates to PUBLISHED and the Download button becomes active
- **WHEN** the Admin clicks download
- **THEN** a ZIP file download is initiated
