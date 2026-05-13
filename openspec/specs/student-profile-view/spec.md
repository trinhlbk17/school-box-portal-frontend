## ADDED Requirements

### Requirement: Student Information Display
The system SHALL display read-only basic information about a student.

#### Scenario: Viewing student info
- **WHEN** a user navigates to `/portal/students/:id` and selects the Info tab
- **THEN** they see the student's code, full name, date of birth, class name, and school name in a read-only format

### Requirement: Student Published Albums Listing
The system SHALL display a list of class albums associated with the student, filtered strictly to those with a `PUBLISHED` status.

#### Scenario: Viewing published albums
- **WHEN** a user navigates to `/portal/students/:id` and selects the Albums tab
- **THEN** they see a grid of album cards filtered by `status=PUBLISHED`
