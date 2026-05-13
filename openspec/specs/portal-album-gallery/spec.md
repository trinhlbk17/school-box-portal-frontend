## ADDED Requirements

### Requirement: Read-Only Gallery View
The system SHALL provide an image gallery for albums that does not expose any administrative actions (upload, delete, set cover).

#### Scenario: Viewing an album
- **WHEN** a portal user accesses `/portal/albums/:albumId`
- **THEN** they see a grid of images without selection checkboxes or upload dropzones

### Requirement: Lightbox Preview and Notice
The system SHALL allow users to preview images in full size via a lightbox, accompanied by a watermark warning notice.

#### Scenario: Opening the lightbox
- **WHEN** a user clicks on an image thumbnail in the portal gallery
- **THEN** a full-screen lightbox opens showing the preview image, and a banner states "Downloaded images will contain a watermark"

### Requirement: Watermarked Bulk Download
The system SHALL allow users to download all images in an album as a ZIP file, routing the request to the watermarked backend endpoint.

#### Scenario: Clicking Download All
- **WHEN** a user clicks the "Download All" button on the album view page
- **THEN** the system triggers a request to `POST /api/albums/:id/download-zip`
