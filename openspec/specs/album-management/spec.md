## ADDED Requirements

### Requirement: Album CRUD operations
The system SHALL provide full CRUD operations for albums within a class context. Albums SHALL be created with a name, optional description, and associated classId. Albums SHALL be listed as a card grid within the ClassDetailPage Albums tab.

#### Scenario: Create album
- **WHEN** admin clicks "Create Album" button on the ClassDetail Albums tab
- **THEN** a form dialog opens with fields: name (required), description (optional)
- **THEN** on submit, `POST /albums` is called with `{ name, description, classId }`
- **THEN** on success, the album list refreshes and a success toast appears

#### Scenario: List albums in class
- **WHEN** user navigates to ClassDetailPage and selects the Albums tab
- **THEN** `GET /classes/:classId/albums` is called
- **THEN** albums display as a card grid showing: name, status badge, image count, created date

#### Scenario: View album detail
- **WHEN** user clicks an album card in the Albums tab
- **THEN** navigation goes to `/admin/classes/:classId/albums/:albumId`
- **THEN** `GET /albums/:id` is called and the AlbumDetailPage renders

#### Scenario: Edit album
- **WHEN** admin clicks "Edit" on an album (DRAFT or PUBLISHED status)
- **THEN** a form dialog opens pre-filled with current name and description
- **THEN** on submit, `PUT /albums/:id` is called with updated fields

#### Scenario: Delete album
- **WHEN** admin clicks "Delete" on an album
- **THEN** a confirmation dialog appears with warning about permanent deletion
- **THEN** on confirm, `DELETE /albums/:id` is called
- **THEN** on success, user is redirected back to the class detail page

### Requirement: Album status transitions
The system SHALL support album status transitions following the state machine: DRAFT → PUBLISHED → ARCHIVED. Each transition SHALL require explicit user action with confirmation.

#### Scenario: Publish album
- **WHEN** admin clicks "Publish" on a DRAFT album
- **THEN** a confirmation dialog appears explaining that publishing makes the album visible to all class members
- **THEN** on confirm, `POST /albums/:id/publish` is called
- **THEN** the status badge updates to PUBLISHED and available actions change accordingly

#### Scenario: Archive album
- **WHEN** admin clicks "Archive" on a PUBLISHED album
- **THEN** a confirmation dialog appears explaining that archiving prevents downloads
- **THEN** on confirm, `POST /albums/:id/archive` is called
- **THEN** the status badge updates to ARCHIVED

#### Scenario: State-dependent action visibility
- **WHEN** an album is in DRAFT status
- **THEN** Upload, Edit, Delete, and Publish buttons are enabled; Archive and Download are disabled with tooltips
- **WHEN** an album is in PUBLISHED status
- **THEN** Edit, Archive, and Download are enabled; Upload, Delete, and Publish are disabled with tooltips
- **WHEN** an album is in ARCHIVED status
- **THEN** all mutation actions are disabled with tooltips; only viewing is possible

### Requirement: Album status filter
The system SHALL allow filtering albums by status in the AlbumListTab.

#### Scenario: Filter albums by status
- **WHEN** user selects a status filter (All, DRAFT, PUBLISHED, ARCHIVED)
- **THEN** only albums matching the selected status are displayed
