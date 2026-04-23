# shared-hooks Specification

## Purpose
TBD - created by archiving change phase-2-shared-ui-components. Update Purpose after archive.
## Requirements
### Requirement: usePagination hook manages pagination via URL
The system SHALL provide a `usePagination` hook that reads and writes `page` and `pageSize` from URL search params so pagination state survives browser refresh.

#### Scenario: Hook returns current page from URL
- **WHEN** URL contains `?page=3&pageSize=20`
- **THEN** `usePagination()` SHALL return `{ page: 3, pageSize: 20 }`

#### Scenario: Hook defaults to page 1 with configurable page size
- **WHEN** URL has no pagination params and hook is called with `usePagination(15)`
- **THEN** it SHALL return `{ page: 1, pageSize: 15 }`

#### Scenario: setPage updates URL without full navigation
- **WHEN** `setPage(5)` is called
- **THEN** URL search params SHALL update to include `page=5` using `replace` mode (no history entry)

#### Scenario: Hook provides computed offset
- **WHEN** `page=3` and `pageSize=10`
- **THEN** `offset` SHALL equal `20` (for API skip parameter)

### Requirement: useDebounce hook delays value updates
The system SHALL provide a `useDebounce<T>` hook that returns a debounced version of the input value, updating only after the specified delay.

#### Scenario: Value updates after delay
- **WHEN** the input value changes and 300ms (default) elapses without further changes
- **THEN** the debounced value SHALL update to the latest input value

#### Scenario: Rapid changes only emit final value
- **WHEN** the input value changes 5 times within 300ms
- **THEN** the debounced value SHALL only update once with the final value

#### Scenario: Custom delay is respected
- **WHEN** `useDebounce(value, 500)` is used
- **THEN** the debounced value SHALL wait 500ms before updating

