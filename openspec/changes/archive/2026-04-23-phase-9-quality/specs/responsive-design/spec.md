## ADDED Requirements

### Requirement: Mobile-Optimized List Views
The system SHALL conditionally render list views as stacked cards on small screens (`sm` breakpoint) and as data tables on medium and larger screens (`md` breakpoint).

#### Scenario: Viewing Student List on Mobile
- **WHEN** a user views the student list on a device narrower than the `md` breakpoint
- **THEN** the data is presented as a list of `StudentCard` components.
