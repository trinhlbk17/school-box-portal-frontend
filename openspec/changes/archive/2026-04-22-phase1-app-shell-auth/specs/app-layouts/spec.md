## ADDED Requirements

### Requirement: Admin layout structure
The AdminLayout SHALL render a sidebar, top header, and main content area.

#### Scenario: Default layout rendering
- **WHEN** an admin/teacher user navigates to any `/admin/*` route
- **THEN** the layout SHALL display a left sidebar (256px), a top header bar, and a main content area rendering child routes via `<Outlet />`

#### Scenario: Sidebar collapse
- **WHEN** the user clicks the sidebar collapse toggle
- **THEN** the sidebar SHALL collapse to 64px width with icon-only navigation items

#### Scenario: Sidebar expand
- **WHEN** the user clicks the sidebar expand toggle from collapsed state
- **THEN** the sidebar SHALL expand to 256px width with full text navigation items

### Requirement: Admin sidebar navigation
The sidebar SHALL display role-aware menu items.

#### Scenario: ADMIN user sidebar items
- **WHEN** an ADMIN user views the sidebar
- **THEN** the sidebar SHALL display: Dashboard, Schools, Users, Box Settings, Audit Logs

#### Scenario: TEACHER user sidebar items
- **WHEN** a TEACHER user views the sidebar
- **THEN** the sidebar SHALL display: My Classes (and omit Schools, Users, Box Settings, Audit Logs)

#### Scenario: Active route highlight
- **WHEN** the current route matches a sidebar menu item
- **THEN** that menu item SHALL be visually highlighted as active

### Requirement: Admin top header
The admin header SHALL display branding and user actions.

#### Scenario: Header elements
- **WHEN** the header renders
- **THEN** it SHALL display the app name/logo and a profile dropdown with the current user's name

#### Scenario: Profile dropdown actions
- **WHEN** the user opens the profile dropdown
- **THEN** it SHALL display a "Logout" action

### Requirement: Portal layout structure
The PortalLayout SHALL render a top navigation bar, main content area, and optional bottom navigation.

#### Scenario: Default layout rendering
- **WHEN** a student/protector user navigates to any `/portal/*` route
- **THEN** the layout SHALL display a top navigation bar, main content area via `<Outlet />`, and a bottom navigation bar

#### Scenario: Bottom navigation items
- **WHEN** the portal layout renders
- **THEN** the bottom navigation SHALL display: Home, My Students (PROTECTOR only), Profile

### Requirement: Portal top bar
The portal top bar SHALL display branding and basic navigation.

#### Scenario: Top bar elements
- **WHEN** the portal top bar renders
- **THEN** it SHALL display the app name/logo and a profile icon/avatar
