## ADDED Requirements

### Requirement: Login page renders form correctly
The LoginPage SHALL render email input, password input, remember-me checkbox, and submit button.

#### Scenario: Form elements present on load
- **WHEN** the LoginPage component renders
- **THEN** it SHALL display labeled inputs for email and password, a "Keep me logged in" checkbox, and a "Sign in" submit button

### Requirement: Login form validates input
The LoginPage SHALL show inline validation errors when form is submitted with invalid data.

#### Scenario: Empty form submission
- **WHEN** user submits the login form with empty fields
- **THEN** the system SHALL display "Email is required" and "Password is required" error messages

#### Scenario: Invalid email format
- **WHEN** user enters an invalid email and submits
- **THEN** the system SHALL display "Invalid email address" error message

### Requirement: Login form shows loading state during submission
The LoginPage SHALL indicate to the user that a login request is in progress.

#### Scenario: Submitting credentials
- **WHEN** a login request is pending
- **THEN** the submit button SHALL be disabled and display "Signing in…"

### Requirement: Login form displays API errors
The LoginPage SHALL display server-side errors in an alert banner.

#### Scenario: Invalid credentials
- **WHEN** the login API returns a 401 error
- **THEN** an error banner with `role="alert"` SHALL be visible with the error message

### Requirement: Successful login redirects by role
The system SHALL redirect users to role-appropriate pages after successful login.

#### Scenario: Admin login redirect
- **WHEN** an ADMIN user logs in successfully
- **THEN** the system SHALL navigate to `/admin`

#### Scenario: Teacher login redirect
- **WHEN** a TEACHER user logs in successfully
- **THEN** the system SHALL navigate to `/admin/my-classes`

### Requirement: Logout clears session
The useLogout hook SHALL clear auth state and redirect to login, even if the API call fails.

#### Scenario: Successful logout
- **WHEN** logout is invoked and the API succeeds
- **THEN** the auth store SHALL be cleared and the user SHALL be navigated to `/login`

#### Scenario: Logout with API failure
- **WHEN** logout is invoked and the API returns an error
- **THEN** the auth store SHALL still be cleared and the user SHALL still be navigated to `/login`

### Requirement: AuthGuard protects routes
AuthGuard SHALL redirect unauthenticated users to the login page and allow authenticated users through.

#### Scenario: No session token
- **WHEN** no session token exists in the auth store
- **THEN** the guard SHALL redirect to `/login`

#### Scenario: Valid session
- **WHEN** a session token exists and `/auth/me` returns a valid user
- **THEN** the guard SHALL render the child outlet

#### Scenario: Invalid session
- **WHEN** a session token exists but `/auth/me` returns an error
- **THEN** the guard SHALL redirect to `/login`

### Requirement: AdminGuard restricts by role
AdminGuard SHALL only allow ADMIN and TEACHER roles to access admin routes.

#### Scenario: Student accessing admin route
- **WHEN** a STUDENT user attempts to access an admin route
- **THEN** the guard SHALL redirect to `/portal`

### Requirement: PortalGuard restricts by role
PortalGuard SHALL only allow STUDENT and PROTECTOR roles to access portal routes.

#### Scenario: Admin accessing portal route
- **WHEN** an ADMIN user attempts to access a portal route
- **THEN** the guard SHALL redirect to `/admin`
