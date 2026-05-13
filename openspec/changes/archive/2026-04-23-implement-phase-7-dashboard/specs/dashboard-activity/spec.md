## ADDED Requirements

### Requirement: Recent Activity Feed
The system SHALL display a list of recent audit logs on the Admin dashboard.

#### Scenario: Displaying recent activity
- **WHEN** an Admin views the dashboard
- **THEN** the system fetches the latest 10 audit logs using the existing `useAuditLogs` hook
- **AND** renders them in a list format, showing the user name, action description based on `logType`, and relative timestamp

#### Scenario: Activity Log Types
- **WHEN** an audit log is rendered in the feed
- **THEN** the system displays a specific icon and color mapping based on the `logType` (e.g., green upload icon for FILE_UPLOAD, blue login icon for LOGIN)

#### Scenario: Loading State
- **WHEN** the audit logs are being fetched
- **THEN** the system displays a skeleton loading state for the activity feed list
