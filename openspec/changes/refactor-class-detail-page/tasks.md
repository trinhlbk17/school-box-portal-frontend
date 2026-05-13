## 1. Class Detail Page Layout Refactoring

- [ ] 1.1 Update `src/features/class/pages/ClassDetailPage.tsx` to use `useSearchParams` to read the `?tab=` parameter (defaulting to `detail`).
- [ ] 1.2 Replace the Radix UI `Tabs` component with a `flex` container. Create a left sidebar (`w-64`, `border-r`) with navigation links that update the query parameter.
- [ ] 1.3 Implement conditional rendering in the main content area for `detail`, `students`, and `albums` views.
- [ ] 1.4 Render `StudentListTab` and `AlbumListTab` when their respective tabs are active.

## 2. Consolidate Teachers & Class Info

- [ ] 2.1 In `ClassDetailPage.tsx` under the `detail` view, render the basic class metadata (Name, Grade, Year) and the Edit/Delete buttons.
- [ ] 2.2 Migrate the teacher listing UI from `TeacherListTab.tsx` directly into the `detail` view of `ClassDetailPage.tsx`.
- [ ] 2.3 Ensure "Assign Teacher" button is visible and triggers the `AssignTeacherDialog`.

## 3. Inline Teacher Creation Feature

- [ ] 3.1 Update `src/features/class/components/AssignTeacherDialog.tsx` to add a "Create New" flow (e.g. via Tabs or a toggle).
- [ ] 3.2 In the "Create New" flow, render a form with `name`, `email`, and `password` fields.
- [ ] 3.3 Implement the form submission to call `userApi.createUser` with the provided details and `role: ROLES.TEACHER`.
- [ ] 3.4 Invalidate the `userKeys.all` or `teachers` query so the new teacher is fetched, then switch back to the "Select Existing" tab or auto-assign the teacher.

## 4. Verification

- [ ] 4.1 Verify clicking sidebar links updates the URL and renders the correct components.
- [ ] 4.2 Verify class info, student lists, and album lists still function properly.
- [ ] 4.3 Verify an admin can assign existing teachers.
- [ ] 4.4 Verify an admin can create a new teacher inline, and that the new teacher appears in the list of available teachers.
