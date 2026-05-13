## ADDED Requirements

### Requirement: Inline Teacher Creation Form
The Assign Teacher flow must include an option to create a new teacher user without leaving the class context.

#### Scenario: Submitting the new teacher form
- **WHEN** the user opens the Assign Teacher dialog, switches to "Create New", fills out Name, Email, and Password, and submits
- **THEN** the system creates a new user with the role of `TEACHER`
- **AND** the teacher list is refreshed 
- **AND** the newly created teacher is available for assignment to the class
