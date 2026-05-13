## Context

Phase 10 requires setting up Playwright for end-to-end testing of the School Box Portal frontend. The application uses a complex, role-based session authentication system with distinct portals (`/admin` and `/portal`). Critical flows span multiple components, including file uploads (images) and data fetching via TanStack Query. 

## Goals / Non-Goals

**Goals:**
- Initialize and configure Playwright in the project.
- Implement reusable Page Object Models (POM) or utilities for role-based authentication in tests.
- Provide a robust mocking strategy (or rely on MSW if configured for Playwright) for backend requests.
- Deliver three fully automated E2E test scripts covering the Admin flow, Album flow, and Portal flow as specified in Task 10.8-10.10.

**Non-Goals:**
- Setting up full CI/CD execution of these tests (currently focus is on local infrastructure).
- Adding E2E coverage for edge cases; we are focusing strictly on the Critical User Journeys (CUJs).
- Extensive performance testing via Playwright.

## Decisions

- **Framework**: Playwright. Rationale: It has excellent cross-browser support, an easy-to-use API, and built-in tracing/debugging which is essential for our complex flows.
- **Authentication**: We will create custom test fixtures or setup scripts to log in as specific roles (`ADMIN`, `TEACHER`, `STUDENT`, `PROTECTOR`) and save their authentication state (`x-session-id` cookies) to avoid logging in via the UI on every test.
- **API Mocking**: We will use Playwright's `page.route()` to intercept and mock backend API calls during the E2E tests, simulating both successful and error responses without relying on a live backend server.
- **Test Organization**: Tests will be placed in an `e2e/` directory at the root level to separate them from the unit/integration tests located in `src/test/`.

## Risks / Trade-offs

- **Risk: Flaky Tests due to Timing Issues** 
  - *Mitigation*: We will use Playwright's auto-waiting features and explicit locator assertions (e.g. `expect(locator).toBeVisible()`) rather than arbitrary `setTimeout`.
- **Risk: Maintenance Overhead** 
  - *Mitigation*: Implementation will utilize Page Object Models (POMs) or specialized fixtures for repeated steps (like login or navigation) so UI changes only require updates in one place.
