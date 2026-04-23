# shadcn-primitives Specification

## Purpose
TBD - created by archiving change phase-2-shared-ui-components. Update Purpose after archive.
## Requirements
### Requirement: Card component is available
The system SHALL provide a Card component with CardHeader, CardContent, and CardFooter subcomponents in `src/shared/components/ui/`.

#### Scenario: Card renders with design system styling
- **WHEN** a `<Card>` renders
- **THEN** it SHALL have white background, `neutral-200` border, `rounded-lg`, and `shadow-sm`

### Requirement: Input and Label components are available
The system SHALL provide Input and Label components for form fields in `src/shared/components/ui/`.

#### Scenario: Input renders with correct default styling
- **WHEN** an `<Input>` renders in default state
- **THEN** it SHALL have height `36px`, `neutral-300` border, `rounded-md`, and `14px` font

#### Scenario: Input shows focus ring
- **WHEN** an `<Input>` receives focus
- **THEN** it SHALL display a `primary-500` ring

### Requirement: Badge component with status variants
The system SHALL provide a Badge component with semantic status variants: `default`, `success`, `warning`, `error`, `info`, `secondary`, `outline`.

#### Scenario: Success badge renders correctly
- **WHEN** `<Badge variant="success">PUBLISHED</Badge>` renders
- **THEN** it SHALL have `success-50` background and `success-700` text color

#### Scenario: Warning badge renders correctly
- **WHEN** `<Badge variant="warning">DRAFT</Badge>` renders
- **THEN** it SHALL have `warning-50` background and `warning-700` text color

#### Scenario: Error badge renders correctly
- **WHEN** `<Badge variant="error">DEACTIVATED</Badge>` renders
- **THEN** it SHALL have `error-50` background and `error-700` text color

### Requirement: Dialog component is available
The system SHALL provide a Dialog component with DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, and DialogFooter subcomponents.

#### Scenario: Dialog renders as modal overlay
- **WHEN** a Dialog opens
- **THEN** it SHALL display a backdrop overlay and center the dialog content with `shadow-lg`

### Requirement: DropdownMenu component is available
The system SHALL provide a DropdownMenu component for action menus and profile dropdowns.

#### Scenario: DropdownMenu opens on trigger click
- **WHEN** user clicks a DropdownMenu trigger
- **THEN** a menu SHALL appear with correct positioning and `shadow-md`

### Requirement: Table primitives are available
The system SHALL provide Table, TableHeader, TableBody, TableRow, TableHead, and TableCell components for building data tables.

#### Scenario: Table renders with design system styling
- **WHEN** a Table renders with rows
- **THEN** header cells SHALL have `bg-neutral-50` and row borders SHALL use `neutral-100`

### Requirement: Skeleton component is available
The system SHALL provide a Skeleton component for loading placeholders with shimmer animation.

#### Scenario: Skeleton renders with animation
- **WHEN** a `<Skeleton>` renders
- **THEN** it SHALL display a shimmer animation effect

### Requirement: Toast notifications via Sonner
The system SHALL provide toast notifications using Sonner with a `<Toaster>` component in the provider tree.

#### Scenario: Success toast appears
- **WHEN** `toast.success("Item created")` is called
- **THEN** a success toast SHALL appear in the top-right corner

#### Scenario: Error toast appears
- **WHEN** `toast.error("Failed to save")` is called
- **THEN** an error toast SHALL appear in the top-right corner with error styling

