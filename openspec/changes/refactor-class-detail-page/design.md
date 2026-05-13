## Context

The `ClassDetailPage` currently utilizes a horizontal Radix UI `Tabs` component to switch between Students, Albums, and Teachers views. While functional, it does not align with standard administrative portal interfaces (like Zendesk) which typically use a left-sidebar layout for navigating sub-sections of a primary entity. Furthermore, the teacher assignment flow is currently restricted to selecting existing teachers; administrators must navigate away to a user management page to create a new teacher before assigning them.

## Goals / Non-Goals

**Goals:**
- Refactor the `ClassDetailPage` to use a left-sidebar navigation layout.
- Use query parameters (`?tab=...`) to track the active sidebar section to support deep-linking without changing the global `admin.routes.tsx` configuration.
- Consolidate the "Teachers" view directly into the "Class Detail" section.
- Enhance the `AssignTeacherDialog` to support inline creation of a new teacher user (with `role = TEACHER`).

**Non-Goals:**
- Do not convert the application routing to fully nested React Router sub-routes (`/admin/classes/:id/students`), to minimize risk to the existing routing setup, unless explicitly required. The query parameter approach achieves the same user experience.
- Do not change the internal implementations of the `StudentListTab` or `AlbumListTab` datatables, other than adjusting their container padding/margins to fit the new layout.

## Decisions

1. **Sidebar Layout Implementation**: 
   We will wrap the `ClassDetailPage` content in a flex container (`div className="flex flex-col md:flex-row gap-6"`). The left side will be a `w-64` navigation menu styling links to update the `?tab=` query parameter. The right side will render the content conditionally based on the active tab.
2. **Teacher Assignment Flow**: 
   The "Class Detail" tab will render the basic class info (Name, Grade, Year) at the top, and below it, the list of currently assigned teachers. 
   When clicking "Assign Teacher", the dialog will show two distinct actions or tabs: "Select Existing" and "Create New". "Create New" will render a simple form calling `userApi.createUser({ name, email, password, role: ROLES.TEACHER })`. After creation, it will invalidate the teacher list and optionally auto-select the newly created teacher for assignment.
3. **Data Refresh**:
   We will utilize existing `useQueryClient` invalidations (`queryClient.invalidateQueries({ queryKey: userKeys.all })` or similar) to ensure the dropdown/list of available teachers updates immediately after creation.

## Risks / Trade-offs

- **URL Structure**: Using query parameters (`?tab=students`) instead of true path segments is slightly less RESTful, but it prevents complex nested layout refactoring in the global routes file.
- **Teacher Creation Overhead**: Adding user creation logic to the class detail page increases the component's responsibility, but significantly improves administrative workflow efficiency.
