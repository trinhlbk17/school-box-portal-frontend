# school-management Specification

## Purpose
TBD - created by archiving change phase3-admin-schools-classes. Update Purpose after archive.
## Requirements
### Requirement: Admin can list all schools
The system SHALL display a paginated table of all schools when an Admin navigates to `/admin/schools`. The table SHALL show school name, address, phone, and action buttons.

#### Scenario: Admin views school list
- **WHEN** Admin navigates to `/admin/schools`
- **THEN** system displays a DataTable with all schools from `GET /schools`

#### Scenario: No schools exist
- **WHEN** Admin navigates to `/admin/schools` and no schools exist
- **THEN** system displays an EmptyState with a "Create School" call-to-action

### Requirement: Admin can create a school
The system SHALL allow Admin to create a new school via a slide-out Sheet form. The form SHALL validate that name is required (min 2 characters). Address, phone, and parentBoxFolderId are optional.

#### Scenario: Successful school creation
- **WHEN** Admin clicks "Add School" and fills in valid data and submits
- **THEN** system calls `POST /schools` and the new school appears in the list

#### Scenario: School limit reached
- **WHEN** a school already exists and Admin tries to create another
- **THEN** system displays an error toast with the message from `SCHOOL_LIMIT_REACHED`

### Requirement: Admin can edit a school
The system SHALL allow Admin to edit an existing school's name, address, and phone via a pre-filled Sheet form.

#### Scenario: Successful school edit
- **WHEN** Admin clicks "Edit" on a school, modifies the name, and submits
- **THEN** system calls `PUT /schools/:id` and the updated data is reflected

### Requirement: Admin can delete a school
The system SHALL allow Admin to delete a school after confirmation. The ConfirmDialog SHALL warn that this is a permanent hard delete.

#### Scenario: Successful school deletion
- **WHEN** Admin clicks "Delete" on a school and confirms in the ConfirmDialog
- **THEN** system calls `DELETE /schools/:id` and the school is removed from the list

#### Scenario: Admin cancels deletion
- **WHEN** Admin clicks "Delete" but dismisses the ConfirmDialog
- **THEN** no API call is made and the school remains

### Requirement: Admin can view school details
The system SHALL display a school detail page at `/admin/schools/:id` showing school info and a list of classes belonging to that school.

#### Scenario: Admin navigates to school detail
- **WHEN** Admin clicks on a school row in the list
- **THEN** system navigates to `/admin/schools/:id` and displays school info with a class list below

### Requirement: Teacher cannot access school pages
The system SHALL prevent Teachers from accessing `/admin/schools` routes. Teachers SHALL be redirected or shown a forbidden state.

#### Scenario: Teacher tries to access school list
- **WHEN** a Teacher navigates to `/admin/schools`
- **THEN** system redirects to `/admin/my-classes` or shows a forbidden error

