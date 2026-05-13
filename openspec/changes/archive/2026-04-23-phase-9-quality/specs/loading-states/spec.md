## ADDED Requirements

### Requirement: Skeleton Loaders for Data
The system SHALL display skeleton loaders for lists and detail views while data is being fetched.

#### Scenario: Data fetching in progress
- **WHEN** a page or component is waiting for its primary data query to resolve
- **THEN** it displays a skeleton layout matching the expected content structure.

### Requirement: Mutation Loading Spinners
The system SHALL indicate loading state on action buttons when a mutation is in progress.

#### Scenario: User submits a form
- **WHEN** a user clicks submit on a form
- **THEN** the button is disabled and displays a loading spinner until the mutation completes.
