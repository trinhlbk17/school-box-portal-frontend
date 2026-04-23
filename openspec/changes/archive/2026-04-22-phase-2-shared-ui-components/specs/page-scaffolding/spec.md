## ADDED Requirements

### Requirement: PageHeader displays page title and actions
The system SHALL provide a PageHeader component that displays a page title, optional description, optional breadcrumbs, and optional action buttons.

#### Scenario: PageHeader renders with title only
- **WHEN** `<PageHeader title="Schools" />` renders
- **THEN** it SHALL display "Schools" as an h1 heading with `text-neutral-800` and `font-bold`

#### Scenario: PageHeader renders with breadcrumbs
- **WHEN** PageHeader receives `breadcrumbs={[{ label: "Schools", href: "/admin/schools" }, { label: "Class 1A" }]}`
- **THEN** it SHALL display breadcrumb links separated by "/" with the last item non-clickable

#### Scenario: PageHeader renders with action buttons
- **WHEN** PageHeader receives `actions={<Button>Create School</Button>}`
- **THEN** the action buttons SHALL render right-aligned in the header row

### Requirement: EmptyState displays when no data is available
The system SHALL provide an EmptyState component with an icon, title, description, and optional action button.

#### Scenario: EmptyState renders with action
- **WHEN** `<EmptyState title="No schools" description="Create your first school" action={{ label: "Create School", onClick: fn }} />` renders
- **THEN** it SHALL display the title, description, and a clickable action button

#### Scenario: EmptyState renders without action
- **WHEN** EmptyState renders without an `action` prop
- **THEN** it SHALL display only the icon, title, and description with no button

### Requirement: ErrorAlert displays error messages
The system SHALL provide an ErrorAlert component that displays an error message with optional retry button.

#### Scenario: ErrorAlert renders with retry
- **WHEN** `<ErrorAlert message="Failed to load schools" onRetry={fn} />` renders
- **THEN** it SHALL display the error message on an `error-50` background with a "Retry" button

#### Scenario: ErrorAlert renders without retry
- **WHEN** ErrorAlert renders without `onRetry`
- **THEN** no retry button SHALL be displayed

### Requirement: ConfirmDialog asks for user confirmation
The system SHALL provide a ConfirmDialog component wrapping shadcn Dialog for confirm/cancel actions.

#### Scenario: ConfirmDialog renders in default variant
- **WHEN** `<ConfirmDialog isOpen={true} title="Confirm" onConfirm={fn} onClose={fn} />` renders
- **THEN** it SHALL display a dialog with a primary "Confirm" button and a secondary "Cancel" button

#### Scenario: ConfirmDialog renders in destructive variant
- **WHEN** ConfirmDialog renders with `variant="destructive"`
- **THEN** the confirm button SHALL use the destructive button variant (red styling)

#### Scenario: ConfirmDialog shows loading state
- **WHEN** ConfirmDialog renders with `isLoading={true}`
- **THEN** the confirm button SHALL be disabled and show a loading indicator
