## 1. Prerequisites

- [x] 1.1 Install shadcn/ui `sheet` component (`npx shadcn@latest add sheet`)
- [x] 1.2 Install shadcn/ui `tabs` component (`npx shadcn@latest add tabs`)

## 2. School Feature — Types & API Layer

- [x] 2.1 Create `src/features/school/types/school.types.ts` with School, CreateSchoolInput, UpdateSchoolInput interfaces
- [x] 2.2 Create `src/features/school/schemas/schoolSchema.ts` with Zod validation (name required min 2, address/phone/parentBoxFolderId optional)
- [x] 2.3 Create `src/features/school/api/schoolApi.ts` with getSchools, getSchool, createSchool, updateSchool, deleteSchool functions
- [x] 2.4 Create `src/features/school/hooks/useSchools.ts` with query key factory and TanStack Query hooks (useSchools, useSchool, useCreateSchool, useUpdateSchool, useDeleteSchool)

## 3. School Feature — UI Components & Pages

- [x] 3.1 Create `src/features/school/components/SchoolFormSheet.tsx` — Sheet with react-hook-form + Zod for create/edit school
- [x] 3.2 Create `src/features/school/pages/SchoolListPage.tsx` — DataTable listing schools, "Add School" button with single-school limit handling
- [x] 3.3 Create `src/features/school/pages/SchoolDetailPage.tsx` — School info + class list + breadcrumbs + Edit/Delete actions
- [x] 3.4 Create `src/features/school/index.ts` barrel export

## 4. Class Feature — Types & API Layer

- [x] 4.1 Create `src/features/class/types/class.types.ts` with Class, ClassTeacher, CreateClassInput, UpdateClassInput, AssignTeacherInput interfaces
- [x] 4.2 Create `src/features/class/schemas/classSchema.ts` with Zod validation (name required, grade/academicYear optional)
- [x] 4.3 Create `src/features/class/api/classApi.ts` with getClassesBySchool, getClass, createClass, updateClass, deleteClass, assignTeacher, removeTeacher functions
- [x] 4.4 Create `src/features/class/hooks/useClasses.ts` with query key factory and TanStack Query hooks (useClassesBySchool, useClass, useCreateClass, useUpdateClass, useDeleteClass, useAssignTeacher, useRemoveTeacher)

## 5. Class Feature — UI Components

- [x] 5.1 Create `src/features/class/components/ClassFormSheet.tsx` — Sheet with react-hook-form + Zod for create/edit class
- [x] 5.2 Create `src/features/class/components/TeacherListTab.tsx` — Table showing classTeachers[] with Remove action (Admin only)
- [x] 5.3 Create `src/features/class/components/AssignTeacherDialog.tsx` — Dialog with searchable teacher list using GET /users?role=TEACHER
- [x] 5.4 Create minimal `src/features/class/hooks/useTeacherUsers.ts` — Hook to fetch available teachers for the picker dialog

## 6. Class Feature — Pages

- [x] 6.1 Create `src/features/class/pages/ClassDetailPage.tsx` — Role-aware tabs (Students, Albums, Teachers), header with Edit/Delete for Admin
- [x] 6.2 Create `src/features/class/pages/MyClassesPage.tsx` — Card grid of assigned classes for Teachers, fetches school first then classes
- [x] 6.3 Create `src/features/class/index.ts` barrel export

## 7. App Integration

- [x] 7.1 Update `src/app/routes/admin.routes.tsx` — Add lazy routes for SchoolListPage, SchoolDetailPage, ClassDetailPage, and update MyClassesPage import
- [x] 7.2 Verify Sidebar navigation links work correctly for both Admin and Teacher roles

## 8. Verification

- [x] 8.1 Run `npx tsc --noEmit` — zero type errors
- [x] 8.2 Run `npm run lint` — zero lint errors
- [ ] 8.3 Manual test: Admin school CRUD flow (create, view, edit, delete with limit handling)
- [ ] 8.4 Manual test: Admin class CRUD flow (create, view, edit, delete with hard-delete warning)
- [ ] 8.5 Manual test: Admin teacher assignment flow (assign, remove, homeroom)
- [ ] 8.6 Manual test: Teacher My Classes and ClassDetailPage (role-restricted UI)
