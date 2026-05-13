## ADDED Requirements

### Requirement: Vitest configuration
The project SHALL have a working Vitest configuration in `vite.config.ts` with jsdom environment, global test utilities, setup file reference, and coverage configuration.

#### Scenario: Vitest runs with npm script
- **WHEN** developer runs `npm test`
- **THEN** Vitest starts in watch mode with jsdom environment

#### Scenario: Single-run test execution
- **WHEN** developer runs `npm run test:run`
- **THEN** Vitest runs all `*.test.{ts,tsx}` files once and exits with appropriate code

#### Scenario: Coverage report generation
- **WHEN** developer runs `npm run test:coverage`
- **THEN** Vitest generates a coverage report for `src/` excluding config files, types, and barrel exports

### Requirement: Test setup file
The project SHALL have a setup file at `src/test/setup.ts` that configures the test environment before each test suite.

#### Scenario: DOM matchers available
- **WHEN** a test uses `expect(element).toBeInTheDocument()`
- **THEN** the matcher resolves correctly via `@testing-library/jest-dom`

#### Scenario: MSW server lifecycle
- **WHEN** tests run
- **THEN** the MSW server starts before all tests, resets handlers after each test, and closes after all tests

#### Scenario: Environment variables mocked
- **WHEN** any module imports `env.ts`
- **THEN** it receives valid test defaults for `VITE_API_BASE_URL` and `VITE_APP_NAME` without throwing

### Requirement: Custom render utility
The project SHALL have a `src/test/test-utils.tsx` that provides a `render` function wrapping components with required providers.

#### Scenario: Component renders with router context
- **WHEN** a component using `useNavigate` or `<Link>` is rendered via the custom `render`
- **THEN** it does not throw a router context error

#### Scenario: Component renders with query client
- **WHEN** a component using `useQuery` is rendered via the custom `render`
- **THEN** it receives a fresh `QueryClient` instance with no cached data

#### Scenario: Custom initial route
- **WHEN** `render` is called with `{ route: "/admin/schools/123" }`
- **THEN** the `MemoryRouter` initializes at that path

### Requirement: TypeScript test globals
The project SHALL have a `tsconfig.test.json` providing type support for Vitest globals (`describe`, `it`, `expect`, `vi`, `beforeEach`, `afterEach`).

#### Scenario: No TypeScript errors in test files
- **WHEN** developer writes a test using `describe`, `it`, `expect` without imports
- **THEN** TypeScript does not report unknown identifier errors
