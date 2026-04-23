## MODIFIED Requirements

### Requirement: Students and Albums tabs show placeholder
The system SHALL render the `StudentListTab` component in the Students tab of ClassDetailPage, replacing the previous placeholder. The Albums tab SHALL continue to render a placeholder EmptyState until Phase 5.

#### Scenario: Students tab shows real student list
- **WHEN** user opens the Students tab in ClassDetailPage
- **THEN** system renders the `StudentListTab` component with `classId` prop, showing a searchable paginated student table

#### Scenario: Placeholder content in Albums tab
- **WHEN** user opens the Albums tab in ClassDetailPage
- **THEN** system displays EmptyState with message "Album management coming soon"
