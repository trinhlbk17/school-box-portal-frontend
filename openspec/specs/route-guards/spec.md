## ADDED Requirements

### Requirement: AuthGuard protects authenticated routes
The system SHALL prevent unauthenticated users from accessing any route other than `/login`.

#### Scenario: No session token
- **WHEN** a user visits any protected route without a session token in storage
- **THEN** the guard SHALL redirect to `/login`

#### Scenario: Session token exists but invalid
- **WHEN** a user has a session token but `/auth/me` returns 401
- **THEN** the guard SHALL clear the token and redirect to `/login`

#### Scenario: Valid session
- **WHEN** a user has a valid session (confirmed by `/auth/me`)
- **THEN** the guard SHALL render the child routes via `<Outlet />`

#### Scenario: Loading state during validation
- **WHEN** the session is being validated (API call in-flight)
- **THEN** the guard SHALL display a loading indicator (not a blank screen)

### Requirement: AdminGuard restricts admin routes
The system SHALL restrict `/admin/*` routes to ADMIN and TEACHER roles only.

#### Scenario: ADMIN user accesses admin route
- **WHEN** a user with role ADMIN navigates to an `/admin/*` route
- **THEN** the guard SHALL allow access and render child routes

#### Scenario: TEACHER user accesses admin route
- **WHEN** a user with role TEACHER navigates to an `/admin/*` route
- **THEN** the guard SHALL allow access and render child routes

#### Scenario: STUDENT user accesses admin route
- **WHEN** a user with role STUDENT navigates to an `/admin/*` route
- **THEN** the guard SHALL redirect to `/portal`

#### Scenario: PROTECTOR user accesses admin route
- **WHEN** a user with role PROTECTOR navigates to an `/admin/*` route
- **THEN** the guard SHALL redirect to `/portal`

### Requirement: PortalGuard restricts portal routes
The system SHALL restrict `/portal/*` routes to STUDENT and PROTECTOR roles only.

#### Scenario: STUDENT user accesses portal route
- **WHEN** a user with role STUDENT navigates to a `/portal/*` route
- **THEN** the guard SHALL allow access and render child routes

#### Scenario: PROTECTOR user accesses portal route
- **WHEN** a user with role PROTECTOR navigates to a `/portal/*` route
- **THEN** the guard SHALL allow access and render child routes

#### Scenario: ADMIN user accesses portal route
- **WHEN** a user with role ADMIN navigates to a `/portal/*` route
- **THEN** the guard SHALL redirect to `/admin`

#### Scenario: TEACHER user accesses portal route
- **WHEN** a user with role TEACHER navigates to a `/portal/*` route
- **THEN** the guard SHALL redirect to `/admin`
