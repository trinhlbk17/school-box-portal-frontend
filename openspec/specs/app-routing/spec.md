## ADDED Requirements

### Requirement: Route configuration with three route files
The system SHALL organize routes into three separate files: auth routes (public), admin routes (protected), and portal routes (protected).

#### Scenario: Auth routes
- **WHEN** a user navigates to `/login`
- **THEN** the router SHALL render the LoginPage without requiring authentication

#### Scenario: Admin routes with lazy loading
- **WHEN** a user navigates to any `/admin/*` route
- **THEN** the router SHALL lazy-load the admin page components using `React.lazy()`

#### Scenario: Portal routes with lazy loading
- **WHEN** a user navigates to any `/portal/*` route
- **THEN** the router SHALL lazy-load the portal page components using `React.lazy()`

### Requirement: Root route redirect
The system SHALL redirect the root path to the appropriate portal based on user role.

#### Scenario: Authenticated user visits root
- **WHEN** an authenticated user visits `/`
- **THEN** the router SHALL redirect based on their role (ADMIN → `/admin`, TEACHER → `/admin/my-classes`, STUDENT/PROTECTOR → `/portal`)

#### Scenario: Unauthenticated user visits root
- **WHEN** an unauthenticated user visits `/`
- **THEN** the router SHALL redirect to `/login`

### Requirement: 404 fallback
The system SHALL display a not-found page for unmatched routes.

#### Scenario: Unknown route
- **WHEN** a user navigates to a route that doesn't match any defined path
- **THEN** the router SHALL display a 404 "Not Found" page

### Requirement: Providers wrapper
The system SHALL wrap the application with necessary providers.

#### Scenario: Provider composition
- **WHEN** the app renders
- **THEN** it SHALL be wrapped with `BrowserRouter` and `QueryClientProvider` in the correct order

### Requirement: Login page
The system SHALL provide a login page with email/password form.

#### Scenario: Login page rendering
- **WHEN** an unauthenticated user visits `/login`
- **THEN** the page SHALL display an email input, password input, "Keep me logged in" checkbox, and a submit button

#### Scenario: Successful login redirect
- **WHEN** the user submits valid credentials
- **THEN** the page SHALL redirect to the role-appropriate route after storing the session

#### Scenario: Login error display
- **WHEN** the login API returns an error
- **THEN** the page SHALL display the error message from the API response

#### Scenario: Already authenticated
- **WHEN** an already-authenticated user visits `/login`
- **THEN** the page SHALL redirect them to their role-appropriate route
