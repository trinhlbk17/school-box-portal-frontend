## ADDED Requirements

### Requirement: Meaningful Image Alt Tags
The system SHALL ensure that all images in the `ImageGrid` and `Lightbox` components have descriptive `alt` text.

#### Scenario: Screen reader encounters an image
- **WHEN** a screen reader focuses on an album image
- **THEN** it reads a descriptive `alt` attribute instead of an empty string or filename.
