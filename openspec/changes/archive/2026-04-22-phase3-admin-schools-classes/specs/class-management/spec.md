## ADDED Requirements

### Requirement: Admin can view class list within a school
The system SHALL display a list of classes for a school on the SchoolDetailPage. Each class row SHALL show name, grade, academic year, and action buttons.

#### Scenario: Admin views classes in a school
- **WHEN** Admin is on SchoolDetailPage for a school
- **THEN** system calls `GET /schools/:schoolId/classes` and displays classes in a table

#### Scenario: No classes exist in the school
- **WHEN** Admin views a school with no classes
- **THEN** system displays an EmptyState with "Create Class" call-to-action

### Requirement: Admin can create a class
The system SHALL allow Admin to create a new class via a slide-out Sheet form. The form SHALL require a class name and optionally accept grade and academic year.

#### Scenario: Successful class creation
- **WHEN** Admin clicks "Add Class" on SchoolDetailPage, fills valid data, and submits
- **THEN** system calls `POST /schools/:schoolId/classes` and the class appears in the list

### Requirement: Admin can edit a class
The system SHALL allow Admin to edit an existing class's name, grade, and academic year.

#### Scenario: Successful class edit
- **WHEN** Admin clicks "Edit" on a class, modifies the name, and submits
- **THEN** system calls `PUT /classes/:id` and the updated data is reflected

### Requirement: Admin can delete a class
The system SHALL allow Admin to delete a class after confirmation with a strong warning about hard deletion.

#### Scenario: Successful class deletion
- **WHEN** Admin clicks "Delete" on a class and confirms in the ConfirmDialog
- **THEN** system calls `DELETE /classes/:id` and the class is removed

### Requirement: ClassDetailPage renders role-aware tabs
The system SHALL render a tabbed interface on `/admin/classes/:id`. Admin SHALL see tabs for Students, Albums, and Teachers. Teacher SHALL see only Students and Albums tabs.

#### Scenario: Admin views class detail
- **WHEN** Admin navigates to `/admin/classes/:id`
- **THEN** system displays 3 tabs: Students, Albums, Teachers

#### Scenario: Teacher views class detail
- **WHEN** Teacher navigates to `/admin/classes/:id` for an assigned class
- **THEN** system displays 2 tabs: Students, Albums (no Teachers tab, no Edit/Delete buttons)

#### Scenario: Teacher accesses unassigned class
- **WHEN** Teacher navigates to `/admin/classes/:id` for a class they are NOT assigned to
- **THEN** backend returns 403 and system displays an ErrorAlert

### Requirement: Admin can assign a teacher to a class
The system SHALL allow Admin to assign a teacher to a class via a dialog with a searchable teacher list. The dialog SHALL support setting a homeroom designation.

#### Scenario: Successful teacher assignment
- **WHEN** Admin clicks "Add Teacher" in the Teachers tab, selects a teacher, and confirms
- **THEN** system calls `POST /classes/:id/teachers` and the teacher appears in the list

#### Scenario: Teacher already assigned
- **WHEN** Admin tries to assign a teacher who is already assigned
- **THEN** system displays error from `TEACHER_ALREADY_ASSIGNED`

#### Scenario: Homeroom conflict
- **WHEN** Admin assigns a teacher as homeroom but one already exists
- **THEN** system displays error from `HOMEROOM_TEACHER_EXISTS`

### Requirement: Admin can remove a teacher from a class
The system SHALL allow Admin to remove a teacher from a class after confirmation.

#### Scenario: Successful teacher removal
- **WHEN** Admin clicks "Remove" on a teacher row and confirms
- **THEN** system calls `DELETE /classes/:id/teachers/:userId` and the teacher is removed

### Requirement: Teacher sees My Classes dashboard
The system SHALL display a card grid of assigned classes when a Teacher navigates to `/admin/my-classes`. Each card SHALL show class name, grade, and academic year. Clicking a card navigates to the class detail.

#### Scenario: Teacher views My Classes
- **WHEN** Teacher navigates to `/admin/my-classes`
- **THEN** system fetches the single school via `GET /schools`, then calls `GET /schools/:schoolId/classes` (auto-filtered by backend), and displays assigned classes as cards

#### Scenario: Teacher has no assigned classes
- **WHEN** Teacher navigates to `/admin/my-classes` with no class assignments
- **THEN** system displays an EmptyState with message "No classes assigned"

### Requirement: Students and Albums tabs show placeholder
The system SHALL render a placeholder EmptyState in the Students and Albums tabs until Phase 4 and Phase 5 are implemented.

#### Scenario: Placeholder content in Students tab
- **WHEN** user opens the Students tab in ClassDetailPage
- **THEN** system displays EmptyState with message "Student management coming soon"

#### Scenario: Placeholder content in Albums tab
- **WHEN** user opens the Albums tab in ClassDetailPage
- **THEN** system displays EmptyState with message "Album management coming soon"
