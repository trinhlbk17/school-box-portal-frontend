## ADDED Requirements

### Requirement: Login with email and password
The system SHALL allow users to log in via `POST /api/auth/login` with email and password.

#### Scenario: Successful login
- **WHEN** user submits valid email and password
- **THEN** the system SHALL store the session token, populate the auth store with user data, and redirect based on role

#### Scenario: Invalid credentials
- **WHEN** user submits incorrect email or password and backend returns 400
- **THEN** the system SHALL display "Incorrect email or password"

#### Scenario: Inactive account
- **WHEN** user submits credentials for a deactivated account
- **THEN** the system SHALL display "Account has been deactivated"

### Requirement: Login form validation
The login form SHALL validate inputs using Zod schema before submission.

#### Scenario: Empty email
- **WHEN** user submits with empty email field
- **THEN** the form SHALL display a validation error on the email field

#### Scenario: Invalid email format
- **WHEN** user submits with malformed email
- **THEN** the form SHALL display "Invalid email address"

#### Scenario: Empty password
- **WHEN** user submits with empty password field
- **THEN** the form SHALL display a validation error on the password field

### Requirement: Role-based redirect after login
The system SHALL redirect users to the correct portal after successful login.

#### Scenario: Admin login
- **WHEN** user logs in with role ADMIN
- **THEN** the system SHALL redirect to `/admin`

#### Scenario: Teacher login
- **WHEN** user logs in with role TEACHER
- **THEN** the system SHALL redirect to `/admin/my-classes`

#### Scenario: Student login
- **WHEN** user logs in with role STUDENT
- **THEN** the system SHALL redirect to `/portal`

#### Scenario: Protector login
- **WHEN** user logs in with role PROTECTOR
- **THEN** the system SHALL redirect to `/portal`

### Requirement: Session persistence
The system SHALL persist the session token based on the "Keep me logged in" preference.

#### Scenario: Keep me logged in checked
- **WHEN** user checks "Keep me logged in" and logs in
- **THEN** the session token SHALL be stored in `localStorage`

#### Scenario: Keep me logged in unchecked
- **WHEN** user does NOT check "Keep me logged in" and logs in
- **THEN** the session token SHALL be stored in `sessionStorage`

#### Scenario: App startup with existing token
- **WHEN** the app loads and a session token exists in storage
- **THEN** the system SHALL call `GET /api/auth/me` to validate the session

#### Scenario: Valid session on startup
- **WHEN** `/auth/me` returns 200 with user data
- **THEN** the auth store SHALL be populated with the user and the app SHALL render normally

#### Scenario: Invalid session on startup
- **WHEN** `/auth/me` returns 401
- **THEN** the system SHALL clear the token from storage and redirect to `/login`

### Requirement: Logout
The system SHALL allow users to log out and clear all session data.

#### Scenario: User clicks logout
- **WHEN** user triggers the logout action
- **THEN** the system SHALL call `POST /api/auth/logout`, clear the auth store, clear storage, invalidate all query cache, and redirect to `/login`

### Requirement: Auth store
The system SHALL maintain auth state in a Zustand store.

#### Scenario: Store initial state
- **WHEN** the app loads for the first time
- **THEN** the auth store SHALL have `user: null`, `sessionToken: null`

#### Scenario: After login
- **WHEN** login succeeds
- **THEN** the auth store SHALL contain the `user` object and `sessionToken`

#### Scenario: After logout
- **WHEN** logout completes
- **THEN** the auth store SHALL reset to `user: null`, `sessionToken: null`
