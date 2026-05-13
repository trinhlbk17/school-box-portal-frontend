## ADDED Requirements

### Requirement: Protector Student List Display
The system SHALL display a list of all students assigned to the logged-in Protector when they access the dashboard.

#### Scenario: Viewing assigned students
- **WHEN** a protector accesses `/portal/students`
- **THEN** they see a card list of their assigned children containing name, code, class, school, and relationship badge

#### Scenario: Selecting a student
- **WHEN** a protector clicks on a specific student card
- **THEN** they are navigated to the detailed student view at `/portal/students/:id`
