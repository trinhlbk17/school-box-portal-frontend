## ADDED Requirements

### Requirement: Student type definitions
The system SHALL define TypeScript interfaces for `Student`, `CreateStudentInput`, `UpdateStudentInput`, and `TransferStudentInput` matching the backend API response and request shapes.

#### Scenario: Student interface includes all backend fields
- **WHEN** the `Student` type is used
- **THEN** it SHALL include `id`, `name`, `dateOfBirth`, `gender`, `classId`, `isActive`, `boxFolderId`, `deletedAt`, `createdAt`, `updatedAt`, and optional nested `class` object

#### Scenario: CreateStudentInput has required fields
- **WHEN** creating a student
- **THEN** `name` and `classId` SHALL be required, `dateOfBirth` and `gender` SHALL be optional

### Requirement: Student API client
The system SHALL provide a `studentApi` object with typed methods for all student CRUD operations, using `apiClient` from `@/shared/lib/apiClient`.

#### Scenario: List students in a class
- **WHEN** `studentApi.getStudents(classId, params)` is called
- **THEN** it SHALL call `GET /classes/:classId/students` with `page`, `limit`, `search`, and `isActive` query params and return a paginated response

#### Scenario: Get student by ID
- **WHEN** `studentApi.getStudent(id)` is called
- **THEN** it SHALL call `GET /students/:id` and return a `Student` object

#### Scenario: Create student
- **WHEN** `studentApi.createStudent(data)` is called
- **THEN** it SHALL call `POST /students` with the input payload

#### Scenario: Update student
- **WHEN** `studentApi.updateStudent(id, data)` is called
- **THEN** it SHALL call `PUT /students/:id` with the update payload

#### Scenario: Delete student
- **WHEN** `studentApi.deleteStudent(id)` is called
- **THEN** it SHALL call `DELETE /students/:id`

#### Scenario: Transfer student
- **WHEN** `studentApi.transferStudent(id, data)` is called
- **THEN** it SHALL call `POST /students/:id/transfer` with `{ targetClassId }`

### Requirement: Student query hooks
The system SHALL provide TanStack Query hooks following the established query key factory pattern.

#### Scenario: Query key factory
- **WHEN** student hooks are used
- **THEN** `studentKeys` SHALL provide `all`, `lists(classId)`, `details()`, `detail(id)` keys following the `[resource, ...identifiers, { filters }]` pattern

#### Scenario: useStudents hook
- **WHEN** `useStudents(classId, params)` is called
- **THEN** it SHALL return a paginated query using `studentKeys.lists(classId)` and `studentApi.getStudents`

#### Scenario: useStudent hook
- **WHEN** `useStudent(id)` is called
- **THEN** it SHALL return a query using `studentKeys.detail(id)` with `enabled: !!id`

#### Scenario: Mutation hooks invalidate correctly
- **WHEN** `useCreateStudent`, `useUpdateStudent`, or `useDeleteStudent` mutations succeed
- **THEN** they SHALL invalidate `studentKeys.all`, show a success toast, and surface error messages on failure

### Requirement: Student form validation schema
The system SHALL define a Zod schema for student form validation.

#### Scenario: Name is required
- **WHEN** the student form is submitted
- **THEN** `name` SHALL be required with minimum 1 character

#### Scenario: Optional fields validate correctly
- **WHEN** `dateOfBirth` or `gender` are provided
- **THEN** they SHALL pass Zod validation for date string and enum respectively

### Requirement: Student list tab
The system SHALL render a `StudentListTab` component inside the ClassDetailPage Students tab.

#### Scenario: Display student table
- **WHEN** the Students tab is active in ClassDetailPage
- **THEN** the system SHALL render a table with columns: Name, Gender, Date of Birth, Status (active/inactive badge), and Actions

#### Scenario: Search students
- **WHEN** the user types in the search input
- **THEN** the system SHALL debounce the input and filter students by name via the `search` query param

#### Scenario: Paginate results
- **WHEN** there are more students than the page limit
- **THEN** the system SHALL show pagination controls and fetch the appropriate page

#### Scenario: Add student button
- **WHEN** the user clicks "Add Student"
- **THEN** the system SHALL open the StudentForm sheet in create mode

#### Scenario: Empty state
- **WHEN** no students exist in the class
- **THEN** the system SHALL display an EmptyState with an "Add Student" action

### Requirement: Student form
The system SHALL provide a `StudentForm` component as a Sheet (side panel) for creating and editing students.

#### Scenario: Create mode
- **WHEN** StudentForm opens without a student prop
- **THEN** it SHALL display empty fields and submit via `useCreateStudent`

#### Scenario: Edit mode
- **WHEN** StudentForm opens with a student prop
- **THEN** it SHALL pre-fill fields and submit via `useUpdateStudent`

#### Scenario: Form closes on success
- **WHEN** the mutation succeeds
- **THEN** the form SHALL close and the student list SHALL refresh

### Requirement: Student detail page
The system SHALL provide a `StudentDetailPage` at route `/admin/students/:id`.

#### Scenario: Display student info
- **WHEN** navigating to `/admin/students/:id`
- **THEN** the system SHALL show the student's name, class, date of birth, gender, and active status

#### Scenario: Edit student from detail page
- **WHEN** the admin clicks the Edit button
- **THEN** the system SHALL open the StudentForm sheet in edit mode

#### Scenario: Delete student (admin only)
- **WHEN** an admin clicks the Delete button and confirms
- **THEN** the system SHALL call `useDeleteStudent` and navigate back to the class page

#### Scenario: Navigate to student from list
- **WHEN** the user clicks a student row in StudentListTab
- **THEN** the system SHALL navigate to `/admin/students/:id`

#### Scenario: Tabs display
- **WHEN** the student detail page loads
- **THEN** the system SHALL render tabs for Info, Protectors, and optionally Transfer History

### Requirement: Student barrel exports
The system SHALL export all public types, hooks, components, and pages from `student/index.ts`.

#### Scenario: Feature isolation
- **WHEN** another feature imports from student
- **THEN** it SHALL import only from `@/features/student` barrel, not internal paths
