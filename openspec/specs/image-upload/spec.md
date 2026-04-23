## ADDED Requirements

### Requirement: Drag-and-drop image upload
The system SHALL provide a drag-and-drop upload zone for adding images to DRAFT albums. The upload zone SHALL accept multiple image files (up to 20 per batch).

#### Scenario: Upload via drag and drop
- **WHEN** user drags image files onto the upload zone in a DRAFT album
- **THEN** the drop zone highlights with a visual indicator
- **THEN** on drop, `POST /albums/:id/images` is called with multipart form data
- **THEN** an overall progress indicator displays during upload
- **THEN** on success, the image grid refreshes and a success toast shows the count of uploaded images

#### Scenario: Upload via file picker
- **WHEN** user clicks the upload zone or "Upload Images" button
- **THEN** a native file picker opens (filtered to image types)
- **THEN** the same upload flow proceeds as drag-and-drop

#### Scenario: Upload validation
- **WHEN** user attempts to upload more than 20 files in a single batch
- **THEN** an error toast appears: "Maximum 20 images per upload"
- **THEN** the upload is not initiated

#### Scenario: Upload to non-DRAFT album
- **WHEN** the album status is PUBLISHED or ARCHIVED
- **THEN** the upload zone is hidden
- **THEN** the "Upload Images" button is disabled with a tooltip explaining upload is only available for draft albums

### Requirement: Upload progress and error handling
The system SHALL show upload progress and handle upload failures gracefully.

#### Scenario: Upload progress
- **WHEN** an upload is in progress
- **THEN** a progress bar displays showing overall upload progress percentage
- **THEN** the upload zone and upload button are disabled to prevent concurrent uploads

#### Scenario: Upload failure
- **WHEN** an upload request fails (network error, server error, timeout)
- **THEN** an error toast appears with the error message
- **THEN** the upload zone returns to its idle state for retry

#### Scenario: Upload timeout
- **WHEN** an upload takes longer than 120 seconds
- **THEN** the request times out and an error toast appears
- **THEN** the user can retry the upload
