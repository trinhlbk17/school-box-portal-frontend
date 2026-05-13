# dashboard-stats Specification

## Purpose
TBD - created by archiving change implement-phase-7-dashboard. Update Purpose after archive.
## Requirements
### Requirement: Dashboard Role-Based Display
The system SHALL display different dashboard components based on the logged-in user's role.

#### Scenario: Admin views dashboard
- **WHEN** a user with the ADMIN role accesses the dashboard
- **THEN** the system renders stat cards for Schools, Classes, Students, and Albums
- **AND** the system renders the Recent Activity feed

#### Scenario: Teacher views dashboard
- **WHEN** a user with the TEACHER role accesses the dashboard
- **THEN** the system renders stat cards for Classes, Students, and Albums
- **AND** the system hides the Schools stat card
- **AND** the system hides the Recent Activity feed

### Requirement: Stat Card UI
The system SHALL provide a reusable StatCard component to display metrics.

#### Scenario: Rendering a stat card
- **WHEN** a StatCard is provided with a label, count, and icon
- **THEN** it renders according to the design system with a shadow, rounded corners, an icon with an accent color background, and the count

#### Scenario: Loading state
- **WHEN** the dashboard data is being loaded
- **THEN** the StatCard renders a skeleton placeholder instead of the count

### Requirement: Placeholder Stats
The system SHALL display placeholder data for stats until API aggregation is implemented.

#### Scenario: Default stats display
- **WHEN** the dashboard is loaded
- **THEN** the system displays a placeholder value (e.g., "-") or hardcoded default for each stat counter

