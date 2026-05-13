## ADDED Requirements

### Requirement: Sidebar Navigation Layout
The Class Detail page must use a left-sidebar layout for navigation between class sub-sections instead of horizontal tabs.

#### Scenario: Navigating to a sub-section
- **WHEN** the user clicks on "Students" in the left sidebar menu
- **THEN** the URL query parameter updates to `?tab=students`
- **AND** the main content area renders the Student datatable for the class

### Requirement: Default View
The default view when visiting the Class Detail page without a query parameter must be the Class Detail section.

#### Scenario: Opening class details
- **WHEN** the user navigates to `/admin/classes/:id`
- **THEN** the "Class Detail" menu item is highlighted
- **AND** the class information and assigned teachers are displayed in the main content area
