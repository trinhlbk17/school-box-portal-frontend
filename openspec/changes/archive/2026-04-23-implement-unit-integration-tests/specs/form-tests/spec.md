## ADDED Requirements

### Requirement: StudentFormSheet renders create mode
The StudentFormSheet SHALL render an "Add Student" form when no student prop is provided.

#### Scenario: Create mode title and empty fields
- **WHEN** the sheet opens with no student prop
- **THEN** the title SHALL be "Add Student" and all fields SHALL be empty

### Requirement: StudentFormSheet renders edit mode
The StudentFormSheet SHALL pre-fill fields with existing student data when a student prop is provided.

#### Scenario: Edit mode title and pre-filled fields
- **WHEN** the sheet opens with a student prop
- **THEN** the title SHALL be "Edit Student" and the name field SHALL contain the student's name

### Requirement: StudentFormSheet validates required fields
The form SHALL display validation errors when required fields are missing.

#### Scenario: Empty name submission
- **WHEN** user submits the form with an empty name
- **THEN** the system SHALL display "Student name is required" error message

### Requirement: StudentFormSheet submits create mutation
The form SHALL call the create mutation with correct payload when submitting a new student.

#### Scenario: Successful create submission
- **WHEN** user fills in the name and submits in create mode
- **THEN** the create student mutation SHALL be called with the name and classId

### Requirement: StudentFormSheet submits update mutation
The form SHALL call the update mutation when submitting in edit mode.

#### Scenario: Successful edit submission
- **WHEN** user modifies the name and submits in edit mode
- **THEN** the update student mutation SHALL be called with the student id and updated data

### Requirement: AlbumForm renders create mode
The AlbumForm dialog SHALL render a "Create Album" form when no initialData is provided.

#### Scenario: Create mode title and empty fields
- **WHEN** the dialog opens with no initialData
- **THEN** the title SHALL be "Create Album" and name/description fields SHALL be empty

### Requirement: AlbumForm renders edit mode
The AlbumForm dialog SHALL pre-fill fields when initialData is provided.

#### Scenario: Edit mode with pre-filled data
- **WHEN** the dialog opens with an album as initialData
- **THEN** the title SHALL be "Edit Album" and the name field SHALL contain the album's name

### Requirement: AlbumForm validates required fields
The form SHALL enforce that album name is required.

#### Scenario: Empty name submission
- **WHEN** user submits the form with an empty album name
- **THEN** the system SHALL display "Album name is required" error message

### Requirement: AlbumForm submits create mutation
The form SHALL call the create mutation when submitting without initialData.

#### Scenario: Successful create submission
- **WHEN** user fills in the name and submits in create mode
- **THEN** the create album mutation SHALL be called with name, description, and classId

### Requirement: AlbumForm submits update mutation
The form SHALL call the update mutation when submitting with initialData.

#### Scenario: Successful edit submission
- **WHEN** user modifies the name and submits in edit mode
- **THEN** the update album mutation SHALL be called with the album id and updated data
