## 1. Student Foundation (types, api, hooks, schema)

- [x] 1.1 Create `student/types/student.types.ts` — `Student`, `CreateStudentInput`, `UpdateStudentInput`, `TransferStudentInput` interfaces
- [x] 1.2 Create `student/api/studentApi.ts` — `getStudents`, `getStudent`, `createStudent`, `updateStudent`, `deleteStudent`, `transferStudent`
- [x] 1.3 Create `student/hooks/useStudents.ts` — `studentKeys` factory, `useStudents(classId, params)`, `useStudent(id)`, `useCreateStudent`, `useUpdateStudent`, `useDeleteStudent`, `useTransferStudent`
- [x] 1.4 Create `student/schemas/studentSchema.ts` — Zod schema for student form validation

## 2. Student UI Components

- [x] 2.1 Create `student/components/StudentListTab.tsx` — Table with search, pagination, add button, row click navigation; receives `classId` prop
- [x] 2.2 Create `student/components/StudentFormSheet.tsx` — Sheet form for create/edit student (name, dateOfBirth, gender fields)
- [x] 2.3 Create `student/pages/StudentDetailPage.tsx` — Page at `/admin/students/:id` with info display, edit/delete actions, tabs (Info, Protectors)

## 3. Student Integration

- [x] 3.1 Update `ClassDetailPage.tsx` — Replace Students tab EmptyState with `StudentListTab` component
- [x] 3.2 Update `admin.routes.tsx` — Add lazy route `/admin/students/:id` → `StudentDetailPage`
- [x] 3.3 Create `student/index.ts` — Barrel exports for all types, hooks, components, pages

## 4. Protector Foundation (types, api, hooks)

- [x] 4.1 Create `protector/types/protector.types.ts` — `Protector`, `CreateProtectorInput`, `AssignProtectorInput` interfaces
- [x] 4.2 Create `protector/api/protectorApi.ts` — `getProtectors`, `createProtector`, `assignProtector`, `removeProtector`
- [x] 4.3 Create `protector/hooks/useProtectors.ts` — `protectorKeys` factory, `useProtectors(studentId)`, `useCreateProtector`, `useAssignProtector`, `useRemoveProtector`

## 5. Protector UI Components

- [x] 5.1 Create `protector/components/ProtectorList.tsx` — Card list of assigned protectors with remove action and empty state
- [x] 5.2 Create `protector/components/AssignProtectorDialog.tsx` — Dialog with "Create New Protector" form (name, email, phone, relationship)
- [x] 5.3 Create `protector/index.ts` — Barrel exports for all types, hooks, components

## 6. Verification

- [x] 6.1 Verify TypeScript compiles with no errors (`npx tsc --noEmit`)
- [x] 6.2 Verify lint passes (`npm run lint`)
- [ ] 6.3 Test student CRUD end-to-end via browser (create, list, edit, delete in ClassDetail)
- [ ] 6.4 Test protector assignment end-to-end via browser (assign, view, remove in StudentDetail)
- [x] 6.5 Update `docs/progress-tracking.md` — Mark Phase 3 summary as completed, mark Phase 4 tasks as completed
