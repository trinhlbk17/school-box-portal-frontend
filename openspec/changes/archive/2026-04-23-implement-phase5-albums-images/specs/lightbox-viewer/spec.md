## ADDED Requirements

### Requirement: Lightbox image preview
The system SHALL provide a fullscreen lightbox viewer for browsing album images at full resolution, using the `yet-another-react-lightbox` library.

#### Scenario: Open lightbox
- **WHEN** user clicks an image thumbnail in the ImageGrid
- **THEN** the lightbox opens showing the full-size preview via `GET /album-images/:id/preview`
- **THEN** the image loads with a loading indicator

#### Scenario: Navigate between images
- **WHEN** the lightbox is open
- **THEN** user can navigate to previous/next images using arrow buttons or keyboard arrows
- **THEN** the lightbox pre-fetches adjacent images for smooth navigation

#### Scenario: Close lightbox
- **WHEN** user presses Escape, clicks the close button, or clicks outside the image
- **THEN** the lightbox closes and returns to the image grid view

#### Scenario: Lightbox with authenticated images
- **WHEN** the lightbox renders an image
- **THEN** it uses the custom render function to load images via Blob URLs (authenticated fetch)
- **THEN** a loading spinner displays while the preview image loads
