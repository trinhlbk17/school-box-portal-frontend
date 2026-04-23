# data-table Specification

## Purpose
TBD - created by archiving change phase-2-shared-ui-components. Update Purpose after archive.
## Requirements
### Requirement: DataTable renders tabular data
The system SHALL provide a generic `DataTable<T extends { id: string }>` component that renders data in a table format using shadcn Table primitives.

#### Scenario: Table renders column headers and data rows
- **WHEN** DataTable receives `columns` and `data` props
- **THEN** it SHALL render a table header row with column names and one body row per data item

#### Scenario: Table renders empty state when no data
- **WHEN** DataTable receives an empty `data` array
- **THEN** it SHALL display an empty state message instead of an empty table

### Requirement: DataTable supports server-side pagination
The system SHALL display pagination controls (previous, page numbers, next) and call `onPageChange` when the user navigates pages. Pagination is server-driven — the component does NOT paginate data locally.

#### Scenario: Pagination controls render correctly
- **WHEN** DataTable receives `totalCount=50`, `page=1`, `pageSize=10`
- **THEN** it SHALL show "Page 1 of 5" with next button enabled and previous button disabled

#### Scenario: User navigates to next page
- **WHEN** user clicks the "Next" button
- **THEN** `onPageChange(2)` SHALL be called

#### Scenario: User navigates to specific page
- **WHEN** user clicks page number "3"
- **THEN** `onPageChange(3)` SHALL be called

### Requirement: DataTable supports search
The system SHALL display a search input above the table. When the user types, it SHALL call `onSearch` with the debounced query string (300ms delay).

#### Scenario: Search input triggers callback
- **WHEN** user types "john" in the search field and 300ms elapses
- **THEN** `onSearch("john")` SHALL be called

#### Scenario: Search placeholder is customizable
- **WHEN** DataTable receives `searchPlaceholder="Search students..."`
- **THEN** the search input SHALL display that placeholder text

### Requirement: DataTable supports column sorting
The system SHALL render sortable column headers with visual sort direction indicators. Clicking a sortable column SHALL call `onSort` with the column id and toggled direction.

#### Scenario: Sortable column shows sort indicator
- **WHEN** `sortBy="name"` and `sortDirection="asc"` are set
- **THEN** the "name" column header SHALL display an ascending sort indicator (▲)

#### Scenario: Clicking sortable column toggles direction
- **WHEN** user clicks a column header that is currently sorted ascending
- **THEN** `onSort(columnId, "desc")` SHALL be called

#### Scenario: Clicking unsorted column starts ascending
- **WHEN** user clicks a sortable column that is not currently sorted
- **THEN** `onSort(columnId, "asc")` SHALL be called

### Requirement: DataTable supports row selection
The system SHALL render a checkbox in each row and a "select all" checkbox in the header. When selection changes, it SHALL call `onRowSelect` with the array of selected row ids.

#### Scenario: User selects a single row
- **WHEN** user checks a row's checkbox
- **THEN** `onRowSelect` SHALL be called with that row's id in the array, and the row SHALL have `bg-primary-50` background

#### Scenario: User selects all rows
- **WHEN** user checks the "select all" header checkbox
- **THEN** `onRowSelect` SHALL be called with all visible row ids

#### Scenario: Row selection is optional
- **WHEN** DataTable does NOT receive an `onRowSelect` prop
- **THEN** no checkboxes SHALL be rendered

### Requirement: DataTable shows loading state
The system SHALL render skeleton rows when `isLoading=true`.

#### Scenario: Loading skeleton replaces data rows
- **WHEN** `isLoading` is `true`
- **THEN** the table body SHALL display skeleton placeholder rows instead of data

