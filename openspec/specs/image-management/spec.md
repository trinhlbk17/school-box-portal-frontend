## ADDED Requirements

### Requirement: Image thumbnail grid
The system SHALL display album images as a thumbnail grid on the AlbumDetailPage. Thumbnails SHALL be loaded via authenticated API calls using Blob URLs.

#### Scenario: Display image grid
- **WHEN** user views the AlbumDetailPage
- **THEN** images display in a responsive grid (4 columns desktop, 2 columns mobile)
- **THEN** each cell shows a thumbnail loaded via `GET /album-images/:id/thumbnail`
- **THEN** a loading skeleton appears while each thumbnail loads

#### Scenario: Multi-select images
- **WHEN** user clicks the checkbox on image thumbnails (or uses shift-click for range select)
- **THEN** selected images are visually highlighted
- **THEN** a bulk action bar appears with "Delete Selected" option (admin only, DRAFT only)

#### Scenario: Click image for preview
- **WHEN** user clicks an image thumbnail (not the checkbox)
- **THEN** the lightbox opens showing the full-size preview

### Requirement: Image deletion
The system SHALL allow admins to delete individual images from DRAFT albums.

#### Scenario: Delete single image
- **WHEN** admin clicks delete on an image in a DRAFT album
- **THEN** a confirmation dialog appears
- **THEN** on confirm, `DELETE /album-images/:id` is called
- **THEN** the image is removed from the grid and a success toast appears

#### Scenario: Bulk delete images
- **WHEN** admin selects multiple images and clicks "Delete Selected"
- **THEN** a confirmation dialog shows the count of images to delete
- **THEN** on confirm, `DELETE /album-images/:id` is called for each selected image
- **THEN** the grid updates after all deletions complete

### Requirement: Authenticated image loading
The system SHALL load all image binaries (thumbnails, previews, downloads) through authenticated API calls since the backend uses `x-session-id` header authentication.

#### Scenario: Load image with auth
- **WHEN** an image component needs to display a thumbnail or preview
- **THEN** the `useImageUrl` hook fetches the binary via `apiClient` with `responseType: 'blob'`
- **THEN** a Blob URL is created via `URL.createObjectURL()`
- **THEN** the Blob URL is used as the `<img src>`
- **THEN** the Blob URL is revoked when the component unmounts

### Requirement: Image download
The system SHALL support downloading individual images and full album ZIP downloads.

#### Scenario: Download individual image
- **WHEN** user clicks download on a single image (album must be PUBLISHED)
- **THEN** `GET /album-images/:id/download` is called with `responseType: 'blob'`
- **THEN** the browser triggers a file download

#### Scenario: Download album as ZIP
- **WHEN** user clicks "Download All" on a PUBLISHED album
- **THEN** `POST /albums/:id/download-zip` is called with `responseType: 'blob'`
- **THEN** the browser triggers a ZIP file download
