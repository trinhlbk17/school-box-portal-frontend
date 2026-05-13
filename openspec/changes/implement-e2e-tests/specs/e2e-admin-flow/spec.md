## ADDED Requirements

### Requirement: Admin Dashboard Flow
The E2E suite SHALL verify that an Admin can login, view the dashboard, navigate to the School list, create a School, and then create a Class within that School.

#### Scenario: Admin creates school and class
- **WHEN** an Admin logs in and navigates to the School section
- **THEN** they can successfully fill out the create school form and it appears in the list
- **WHEN** they navigate to the school details and click "Add Class"
- **THEN** they can fill out the form and see the new class created
