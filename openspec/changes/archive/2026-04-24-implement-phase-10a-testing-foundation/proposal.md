## Why

Phase 10 (Testing) is the final phase of the School Box Portal Frontend. Phases 0–9 are complete with 166/179 tasks done, but the project has zero test coverage — no test files, no test configuration, and no mock infrastructure. The test dependencies (Vitest, Testing Library, MSW) are installed but unconfigured. Without testing, we have no confidence in correctness for critical flows like authentication, role-based access, and data management.

This first session (10A) builds the foundation that all subsequent tests depend on: configuration, factories, and API mocking.

## What Changes

- Configure Vitest with jsdom environment, global test utilities, coverage reporting, and npm scripts
- Create a custom render utility wrapping components with MemoryRouter + QueryClientProvider
- Create test data factories for all 7 domain types (User, School, Class, Student, Album, AlbumImage, Protector)
- Create MSW handlers for ~35 API endpoints across 9 feature domains
- **BREAKING** Fix `albumApi.ts` — remove erroneous `/api/` prefix from image endpoints that causes double `/api/api/` URLs (confirmed by backend investigation: controller uses `@Controller()` with no prefix, global prefix is `api`)

## Capabilities

### New Capabilities
- `test-infrastructure`: Vitest configuration, setup file, MSW server, custom render utility, npm scripts, and tsconfig for test globals
- `test-factories`: Factory functions for all domain types using the overrides pattern (`createUser(overrides?)` etc.)
- `msw-handlers`: Mock Service Worker handlers for all API endpoints with correct response shapes per API module

### Modified Capabilities
_None — no existing spec-level requirements are changing._

## Impact

- **Config files**: `vite.config.ts`, `package.json`, `tsconfig.json` — modified to add test support
- **New files**: ~20 new files in `src/test/` (factories, handlers, setup, utilities)
- **Bug fix**: `src/features/album/api/albumApi.ts` — 5 endpoint paths corrected (removes `/api/` prefix from image endpoints)
- **Dependencies**: No new dependencies needed — all already installed
