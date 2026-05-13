## ADDED Requirements

### Requirement: Role-based Portal Redirection
The system SHALL redirect users accessing the root `/portal` path based on their authenticated role.

#### Scenario: Protector accesses portal
- **WHEN** a user with the `PROTECTOR` role navigates to `/portal`
- **THEN** the system redirects them to `/portal/students`

#### Scenario: Student accesses portal
- **WHEN** a user with the `STUDENT` role navigates to `/portal`
- **THEN** the system redirects them to `/portal/students/:myStudentId` using their associated student profile ID
