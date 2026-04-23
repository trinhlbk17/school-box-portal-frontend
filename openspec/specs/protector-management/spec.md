# protector-management Specification

## Purpose
Defines the protector management feature for the Admin portal. Covers assigning, viewing, and removing protectors (parents/guardians) for students, accessed via the StudentDetailPage Protectors tab.

## Requirements

### Requirement: Protector type definitions
The system SHALL define TypeScript interfaces for `Protector`, `CreateProtectorInput`, and `AssignProtectorInput` matching the backend API.

#### Scenario: Protector interface
- **WHEN** the `Protector` type is used
- **THEN** it SHALL include `id`, `name`, `email`, `phone`, `relationship`, and the associated `user` object fields

#### Scenario: CreateProtectorInput
- **WHEN** creating a new protector
- **THEN** `name`, `email`, and `relationship` SHALL be required, `phone` SHALL be optional, and `studentIds` SHALL be an optional array for initial assignment

### Requirement: Protector API client
The system SHALL provide a `protectorApi` object with typed methods for protector operations.

#### Scenario: List protectors for a student
- **WHEN** `protectorApi.getProtectors(studentId)` is called
- **THEN** it SHALL call `GET /students/:id/protectors` and return a list of protectors

#### Scenario: Create protector
- **WHEN** `protectorApi.createProtector(data)` is called
- **THEN** it SHALL call `POST /protectors` with name, email, phone, relationship, and optional studentIds

#### Scenario: Assign protector to student
- **WHEN** `protectorApi.assignProtector(studentId, data)` is called
- **THEN** it SHALL call `POST /students/:id/protectors` with the protector assignment payload

#### Scenario: Remove protector from student
- **WHEN** `protectorApi.removeProtector(studentId, protectorId)` is called
- **THEN** it SHALL call `DELETE /students/:id/protectors/:protectorId`

### Requirement: Protector query hooks
The system SHALL provide TanStack Query hooks for protector data access.

#### Scenario: Query key factory
- **WHEN** protector hooks are used
- **THEN** `protectorKeys` SHALL provide `all`, `byStudent(studentId)` keys

#### Scenario: useProtectors hook
- **WHEN** `useProtectors(studentId)` is called
- **THEN** it SHALL return a query for the student's protectors with `enabled: !!studentId`

#### Scenario: Mutation hooks
- **WHEN** `useCreateProtector`, `useAssignProtector`, or `useRemoveProtector` mutations succeed
- **THEN** they SHALL invalidate `protectorKeys.all` and relevant student queries, show success toast

### Requirement: Protector list component
The system SHALL render a `ProtectorList` component inside the StudentDetailPage Protectors tab.

#### Scenario: Display protector cards
- **WHEN** the Protectors tab is active
- **THEN** the system SHALL display each protector with name, email, phone, and relationship badge

#### Scenario: Remove protector
- **WHEN** an admin clicks the Remove button on a protector and confirms
- **THEN** the system SHALL call `useRemoveProtector` and refresh the list

#### Scenario: Empty state
- **WHEN** no protectors are assigned to the student
- **THEN** the system SHALL display an EmptyState with an "Assign Protector" action

### Requirement: Assign protector dialog
The system SHALL provide an `AssignProtectorDialog` for assigning protectors to students.

#### Scenario: Create new protector mode
- **WHEN** the user clicks "Assign Protector" in the ProtectorList
- **THEN** the system SHALL show a form with name, email, phone, and relationship fields, and on submit create the protector and assign them to the student

#### Scenario: Dialog closes on success
- **WHEN** the protector is successfully created/assigned
- **THEN** the dialog SHALL close and the protector list SHALL refresh

### Requirement: Protector barrel exports
The system SHALL export all public types, hooks, and components from `protector/index.ts`.

#### Scenario: Feature isolation
- **WHEN** student feature imports protector components
- **THEN** it SHALL import only from `@/features/protector` barrel
