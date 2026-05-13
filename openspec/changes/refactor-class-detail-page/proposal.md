## Why

The current `ClassDetailPage` uses standard horizontal tabs for navigating between Students, Albums, and Teachers. To improve the user experience and align with standard administrative interfaces (like Zendesk), we need a vertical left-sidebar navigation layout. Additionally, the flow for assigning a teacher currently only allows selecting from existing teachers; we need to streamline this by allowing admins to create a new teacher inline and automatically assign them the `TEACHER` role.

## What Changes

1. **Class Detail Page Layout**: Replace horizontal `Tabs` with a Zendesk-style layout featuring a left sidebar for navigation and a main content area.
2. **Left Menu Options**: "Class Detail", "Students", "Albums".
3. **Class Detail Content**:
   - Class information with Edit button.
   - Assigned teachers list (moved from a separate tab to the main Class Detail view).
   - "Assign Teacher" dialog updated to include an "Add new Teacher" form.
4. **Teacher Creation**: A simplified form (Name, Email, Password) that creates a user with the `TEACHER` role, then reloads the list so the new teacher can be assigned immediately.
5. **Students & Albums Content**: Unchanged functionally, but rendered in the main content area when their respective left-menu item is selected.

## Capabilities

### New Capabilities
- `class-detail-sidebar`: Left-sidebar layout navigation for class details.
- `inline-teacher-creation`: Ability to create new teachers directly from the class assignment dialog.

### Modified Capabilities
- `class-management`: Updated class detail page structure.

## Impact

- **Affected Code**: 
  - `src/features/class/pages/ClassDetailPage.tsx`
  - `src/features/class/components/AssignTeacherDialog.tsx`
  - New component: `src/features/class/components/AddTeacherForm.tsx` (or similar).
- **APIs**: Will utilize existing `userApi.createUser` endpoint for teacher creation.
- **Routing**: Will implement either URL query parameters (e.g., `?tab=students`) or nested routes in `admin.routes.tsx` to handle the sidebar navigation states.
