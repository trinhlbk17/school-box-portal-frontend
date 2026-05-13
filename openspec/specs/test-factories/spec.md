## ADDED Requirements

### Requirement: Factory overrides pattern
Each factory function SHALL accept an optional `Partial<T>` overrides parameter and return a complete, typed object with sensible defaults merged with any provided overrides.

#### Scenario: Default factory output
- **WHEN** `createUser()` is called with no arguments
- **THEN** it returns a valid `User` object with all required fields populated

#### Scenario: Override specific fields
- **WHEN** `createUser({ role: "TEACHER", name: "Jane" })` is called
- **THEN** it returns a `User` with `role: "TEACHER"`, `name: "Jane"`, and defaults for all other fields

### Requirement: User factory
The project SHALL have factory functions for `User` and `AdminUser` types, plus role-specific convenience functions.

#### Scenario: Role convenience functions
- **WHEN** `createAdmin()` is called
- **THEN** it returns a `User` with `role: "ADMIN"`

#### Scenario: All roles covered
- **WHEN** `createTeacher()`, `createStudentUser()`, `createProtectorUser()` are called
- **THEN** each returns a `User` with the corresponding role

### Requirement: School factory
The project SHALL have a `createSchool()` factory returning a valid `School` object.

#### Scenario: Default school
- **WHEN** `createSchool()` is called
- **THEN** it returns a `School` with `id`, `name`, `createdAt`, `updatedAt` populated

### Requirement: Class factory
The project SHALL have `createClass()` and `createClassTeacher()` factories.

#### Scenario: Class with teachers
- **WHEN** `createClass({ classTeachers: [createClassTeacher()] })` is called
- **THEN** it returns a `Class` with a populated `classTeachers` array

### Requirement: Student factory
The project SHALL have a `createStudent()` factory returning a valid `Student` object.

#### Scenario: Student with class reference
- **WHEN** `createStudent({ class: { id: "cls-1", name: "1A", grade: "1", academicYear: "2026" } })` is called
- **THEN** it returns a `Student` with the embedded class object

### Requirement: Album and image factories
The project SHALL have `createAlbum()` and `createAlbumImage()` factories.

#### Scenario: Album with status
- **WHEN** `createAlbum({ status: AlbumStatus.PUBLISHED })` is called
- **THEN** it returns an `Album` with `status: "PUBLISHED"`

#### Scenario: Album image
- **WHEN** `createAlbumImage({ albumId: "album-1" })` is called
- **THEN** it returns an `AlbumImage` linked to the specified album

### Requirement: Protector factory
The project SHALL have a `createProtector()` factory returning a valid `Protector` object.

#### Scenario: Protector with relationship
- **WHEN** `createProtector({ relationship: "GUARDIAN" })` is called
- **THEN** it returns a `Protector` with `relationship: "GUARDIAN"`

### Requirement: Deterministic IDs
All factories SHALL generate deterministic, auto-incrementing IDs (e.g., `user-1`, `school-2`) for easy assertion in tests.

#### Scenario: Sequential IDs
- **WHEN** `createUser()` is called twice
- **THEN** the first returns `id: "user-1"` and the second `id: "user-2"`

### Requirement: Barrel export
All factories SHALL be re-exported from `src/test/factories/index.ts`.

#### Scenario: Single import
- **WHEN** a test imports `{ createUser, createSchool } from "@/test/factories"`
- **THEN** both functions are available
