## Context

The School Box Portal Frontend (React + Vite + TypeScript) has completed 9 phases of implementation with 166 tasks done. All test dependencies are installed (`vitest@4.1.5`, `@testing-library/react@16.3.2`, `msw@2.13.4`, `jsdom@29.0.2`) but no configuration, setup files, or test files exist. The `src/test/` directory has empty `factories/` and `handlers/` subdirectories.

The project has 10 feature domains (`auth`, `school`, `class`, `student`, `protector`, `album`, `user`, `box`, `audit`, `portal`) with a consistent architecture: `api/` → `hooks/` → `components/` per feature. The API client uses Axios with `baseURL: http://localhost:3000/api` and `x-session-id` header for auth.

## Goals / Non-Goals

**Goals:**
- Configure Vitest to run component and integration tests with jsdom
- Provide a custom render utility that wraps components with required providers (Router, QueryClient)
- Create typed factory functions for all domain entities to eliminate hardcoded test data
- Create MSW handlers for all ~35 API endpoints so integration tests can run without a backend
- Fix the `albumApi.ts` double `/api/` prefix bug discovered during backend investigation
- Establish coverage reporting with per-layer targets

**Non-Goals:**
- Writing actual test cases (Phase 10B)
- E2E test setup with Playwright (Phase 10C)
- Achieving any specific coverage number (this session is infrastructure only)
- Refactoring production code beyond the albumApi bug fix

## Decisions

### 1. Vitest globals mode
**Choice**: Enable `globals: true` in vitest config
**Rationale**: Avoids importing `describe`, `it`, `expect` in every test file. The coding standards show test examples without imports. A separate `tsconfig.test.json` provides type support.
**Alternative rejected**: Explicit imports — adds boilerplate to every test file with no benefit.

### 2. Custom render utility pattern
**Choice**: Create `src/test/test-utils.tsx` that re-exports `@testing-library/react` with a custom `render` wrapping `MemoryRouter` + `QueryClientProvider`.
**Rationale**: Every component test needs routing context and query client. A fresh `QueryClient` per test prevents cache leaks. This is the [official Testing Library recommendation](https://testing-library.com/docs/react-testing-library/setup/#custom-render).
**Alternative rejected**: Wrapping in each test — violates DRY, easy to forget providers.

### 3. MSW handler base URL strategy
**Choice**: Define `API_BASE = "http://localhost:3000/api"` and use `apiUrl(path)` helper in all handlers.
**Rationale**: Axios prepends `baseURL` to request paths, so MSW must match the full URL. A constant keeps it consistent and easy to change.

### 4. Factory ID generation
**Choice**: Use auto-incrementing counter per type (e.g., `user-1`, `school-2`) instead of UUIDs.
**Rationale**: Deterministic IDs make test assertions easier to write and debug. UUIDs would require capturing the generated ID.

### 5. albumApi.ts prefix fix
**Choice**: Remove `/api/` prefix from 5 image endpoint paths in `albumApi.ts`.
**Rationale**: Backend investigation confirmed the `AlbumImageController` uses `@Controller()` (no prefix) + global prefix `api`. Since `apiClient.baseURL` already includes `/api`, the frontend paths should not include it again. Current code produces double `/api/api/` URLs that would fail against the real backend.

### 6. MSW response shape per API module
**Choice**: Each handler returns the exact JSON the server would send, matching what each API module expects after Axios processing.
**Rationale**: API modules have inconsistent unwrapping patterns (`response.data` vs `response.data.data`). Handlers must match the server response, not the unwrapped return value. This was identified during codebase analysis.

## Risks / Trade-offs

- **`require()` in apiClient interceptors** → The interceptors use CommonJS `require()` for lazy auth store imports. Vitest's ESM environment may not support this. **Mitigation**: If it fails during smoke test, we'll vi.mock the apiClient module or refactor to dynamic import.
- **env.ts module-level validation** → The `env.ts` module validates `import.meta.env` at load time and throws if missing. **Mitigation**: Mock `import.meta.env` in setup.ts before any module loads.
- **Zustand store state leaking between tests** → Zustand stores persist state across test runs. **Mitigation**: Reset store state in `afterEach` or use `useAuthStore.setState()` in test setup.
