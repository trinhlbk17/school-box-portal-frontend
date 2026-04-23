## ADDED Requirements

### Requirement: Admin can view paginated user list
The system SHALL display a paginated table of users with columns: Name, Email, Role (badge), Status (active/inactive), Created Date, and Actions. The system SHALL support filtering by role (ADMIN, TEACHER, STUDENT, PROTECTOR), active status (true/false), and search (name or email). The system SHALL support sorting by `createdAt`, `name`, or `email` in ascending or descending order.

#### Scenario: Default user list load
- **WHEN** admin navigates to `/admin/users`
- **THEN** the system SHALL display users sorted by `createdAt` descending, paginated at 10 per page

#### Scenario: Filter by role
- **WHEN** admin selects "TEACHER" from the role filter dropdown
- **THEN** the system SHALL show only users with role TEACHER

#### Scenario: Filter by active status
- **WHEN** admin selects "Inactive" from the status filter
- **THEN** the system SHALL show only users where `isActive` is false

#### Scenario: Search users
- **WHEN** admin types "john" in the search input
- **THEN** the system SHALL filter users whose name or email contains "john" (case-insensitive) after a debounce delay

---

### Requirement: Admin can create a user with auto-generated or manual password
The system SHALL provide a user creation form with fields: email (required), name (required), role (required dropdown), and password mode (toggle between "Auto-generate" and "Manual input"). For auto-generate, the system SHALL create a random 12-character alphanumeric password. For manual input, the system SHALL show a password text field. The system SHALL MD5-hash the password before sending to the API.

#### Scenario: Create user with auto-generated password
- **WHEN** admin fills in email, name, role and selects "Auto-generate" password mode
- **AND** clicks "Create"
- **THEN** the system SHALL generate a random password, MD5-hash it, call `POST /users`, and display the plain-text password in a PasswordRevealDialog with copy-to-clipboard

#### Scenario: Create user with manual password
- **WHEN** admin fills in email, name, role, selects "Manual input", and types a password
- **AND** clicks "Create"
- **THEN** the system SHALL MD5-hash the typed password, call `POST /users`, and display the typed password in a PasswordRevealDialog

#### Scenario: Email already exists
- **WHEN** admin attempts to create a user with an existing email
- **THEN** the system SHALL display error "Email already exists"

---

### Requirement: Admin can edit a user
The system SHALL allow editing a user's name and email via a modal form. Role SHALL NOT be editable.

#### Scenario: Edit user name
- **WHEN** admin opens edit modal for a user and changes the name
- **AND** clicks "Save"
- **THEN** the system SHALL call `PATCH /users/:id` and refresh the user list

---

### Requirement: Admin can activate or deactivate a user
The system SHALL provide activate/deactivate toggle actions in the user list. Deactivation SHALL require a confirmation dialog. Admin SHALL NOT be able to deactivate their own account.

#### Scenario: Deactivate a user
- **WHEN** admin clicks "Deactivate" on an active user and confirms
- **THEN** the system SHALL call `PATCH /users/:id/deactivate` and update the user's status in the list

#### Scenario: Activate a user
- **WHEN** admin clicks "Activate" on an inactive user
- **THEN** the system SHALL call `PATCH /users/:id/activate` and update the user's status in the list

#### Scenario: Prevent self-deactivation
- **WHEN** admin attempts to deactivate their own account
- **THEN** the deactivate action SHALL be disabled or hidden for the current user's row

---

### Requirement: Admin can regenerate a user's password
The system SHALL provide a "Regenerate Password" action that generates a new temporary password server-side and displays it once.

#### Scenario: Regenerate password
- **WHEN** admin clicks "Regenerate Password" on a user and confirms
- **THEN** the system SHALL call `POST /users/:id/regenerate-password` and display the returned `temporaryPassword` in a PasswordRevealDialog with copy-to-clipboard

---

### Requirement: Admin can soft delete a user
The system SHALL provide a delete action with a confirmation dialog. Admin SHALL NOT be able to delete their own account.

#### Scenario: Delete a user
- **WHEN** admin clicks "Delete" on a user and confirms
- **THEN** the system SHALL call `DELETE /users/:id` and remove the user from the list

#### Scenario: Prevent self-deletion
- **WHEN** admin attempts to delete their own account
- **THEN** the delete action SHALL be disabled or hidden for the current user's row
