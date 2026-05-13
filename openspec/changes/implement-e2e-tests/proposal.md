## Why

We have successfully implemented unit and integration testing. To ensure full confidence in critical user journeys (CUJs) spanning multiple pages and roles, we need end-to-end (E2E) testing. Playwright provides a robust cross-browser E2E testing environment that matches real-world user interactions.

## What Changes

- Set up Playwright for the frontend project (Task 10.7).
- Implement E2E test suite for the Admin flow: Login → Dashboard → Create School → Create Class (Task 10.8).
- Implement E2E test suite for the Album flow: Login → Album → Upload → Preview → Download (Task 10.9).
- Implement E2E test suite for the User Portal flow: Protector Login → View Student → View Album (Task 10.10).

## Capabilities

### New Capabilities
- `e2e-admin-flow`: End-to-end testing specifications for administrative operations.
- `e2e-album-flow`: End-to-end testing specifications for the album lifecycle (uploading, previewing, downloading).
- `e2e-portal-flow`: End-to-end testing specifications for the student and protector portal journeys.

### Modified Capabilities

- 

## Impact

- **Affected code**: Introduces the `playwright` framework, test configurations (`playwright.config.ts`), and test files in `tests/` or `e2e/`.
- **System Impact**: Adds an E2E testing stage to our QA process, increasing confidence in critical flows without breaking existing code.
