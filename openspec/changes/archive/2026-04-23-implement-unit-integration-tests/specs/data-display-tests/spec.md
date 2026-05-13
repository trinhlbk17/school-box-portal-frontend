## ADDED Requirements

### Requirement: SchoolListPage renders school data
The SchoolListPage SHALL display school records in a table when data is available.

#### Scenario: Schools loaded successfully
- **WHEN** the schools API returns a list of schools
- **THEN** the page SHALL display each school's name in the table

### Requirement: SchoolListPage shows empty state
The SchoolListPage SHALL display an empty state when no schools exist.

#### Scenario: No schools
- **WHEN** the schools API returns an empty array
- **THEN** the page SHALL display "No school yet" with a "Add School" action button

### Requirement: SchoolListPage shows error state
The SchoolListPage SHALL display an error message when the API request fails.

#### Scenario: API failure
- **WHEN** the schools API returns a 500 error
- **THEN** the page SHALL display an error alert with "Failed to load schools"

### Requirement: SchoolListPage shows loading state
The SchoolListPage SHALL display a loading indicator while data is being fetched.

#### Scenario: Data loading
- **WHEN** the schools API request is pending
- **THEN** the page SHALL display a loading skeleton in the data table

### Requirement: AlbumListTab renders album cards
The AlbumListTab SHALL display albums as cards in a grid layout.

#### Scenario: Albums loaded
- **WHEN** the albums API returns a list of albums
- **THEN** the component SHALL render a card for each album showing name, status badge, and image count

### Requirement: AlbumListTab shows empty state
The AlbumListTab SHALL display an empty state when no albums exist.

#### Scenario: No albums
- **WHEN** the albums API returns an empty array
- **THEN** the component SHALL display "No albums found"

### Requirement: AlbumListTab shows loading skeletons
The AlbumListTab SHALL display skeleton cards while loading.

#### Scenario: Loading
- **WHEN** the albums API request is pending
- **THEN** the component SHALL display skeleton placeholder cards

### Requirement: AlbumListTab shows create button for admins only
The "Create Album" button SHALL only be visible to admin users.

#### Scenario: Admin user
- **WHEN** the current user has ADMIN role
- **THEN** the "Create Album" button SHALL be visible

#### Scenario: Non-admin user
- **WHEN** the current user has TEACHER role without admin privileges
- **THEN** the "Create Album" button SHALL NOT be visible
