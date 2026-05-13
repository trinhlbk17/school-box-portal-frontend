## 1. Vitest Configuration & Setup

- [x] 1.1 Add `test` block to `vite.config.ts` with jsdom environment, globals, setup file, includes, and coverage config
- [x] 1.2 Create `tsconfig.test.json` with Vitest type references and add it to root `tsconfig.json` references
- [x] 1.3 Add `test`, `test:run`, `test:coverage` scripts to `package.json`

## 2. Test Setup & Utilities

- [x] 2.1 Create `src/test/setup.ts` with jest-dom import, `import.meta.env` mock, MSW server lifecycle hooks, and Zustand store reset
- [x] 2.2 Create `src/test/msw/server.ts` with `setupServer()` instance importing all handlers
- [x] 2.3 Create `src/test/test-utils.tsx` with custom render (MemoryRouter + QueryClientProvider) and re-exports

## 3. Test Factories

- [x] 3.1 Create `src/test/factories/user.factory.ts` with `createUser`, `createAdminUser`, `createAdmin`, `createTeacher`, `createStudentUser`, `createProtectorUser`
- [x] 3.2 Create `src/test/factories/school.factory.ts` with `createSchool`
- [x] 3.3 Create `src/test/factories/class.factory.ts` with `createClass`, `createClassTeacher`
- [x] 3.4 Create `src/test/factories/student.factory.ts` with `createStudent`
- [x] 3.5 Create `src/test/factories/album.factory.ts` with `createAlbum`, `createAlbumImage`
- [x] 3.6 Create `src/test/factories/protector.factory.ts` with `createProtector`
- [x] 3.7 Create `src/test/factories/index.ts` barrel export

## 4. MSW Handlers

- [x] 4.1 Create `src/test/handlers/auth.handlers.ts` (3 endpoints: login, logout, me)
- [x] 4.2 Create `src/test/handlers/school.handlers.ts` (5 endpoints: CRUD)
- [x] 4.3 Create `src/test/handlers/class.handlers.ts` (7 endpoints: CRUD + teacher assignment)
- [x] 4.4 Create `src/test/handlers/student.handlers.ts` (5 endpoints: CRUD)
- [x] 4.5 Create `src/test/handlers/protector.handlers.ts` (4 endpoints: CRUD + my-students)
- [x] 4.6 Create `src/test/handlers/album.handlers.ts` (13 endpoints: CRUD + status + images)
- [x] 4.7 Create `src/test/handlers/user.handlers.ts` (8 endpoints: CRUD + status)
- [x] 4.8 Create `src/test/handlers/box.handlers.ts` (4 endpoints: status, auth-url, disconnect, folders)
- [x] 4.9 Create `src/test/handlers/audit.handlers.ts` (1 endpoint: logs)
- [x] 4.10 Create `src/test/handlers/index.ts` barrel export combining all handlers

## 5. Bug Fix

- [x] 5.1 Fix `src/features/album/api/albumApi.ts` — remove erroneous `/api/` prefix from 5 image endpoint paths

## 6. Verification

- [x] 6.1 Create `src/test/smoke.test.ts` to verify MSW, custom render, and factory setup
- [x] 6.2 Run `npm run test:run` — all smoke tests pass
- [x] 6.3 Run `npx tsc --noEmit` — no TypeScript errors
- [x] 6.4 Run `npm run lint` — no lint errors
