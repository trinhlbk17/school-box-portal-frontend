# School Box Portal Frontend

A React 19 + TypeScript + Vite SPA for managing a school photo gallery. Teachers upload class event photos, students and parents view and download watermarked images from Box.com. Features role-based access (admin, teacher, student, protector), image management with watermarking, and audit logging.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Build** | Vite 8 |
| **Framework** | React 19 + TypeScript 6 |
| **Routing** | React Router v7 |
| **UI** | Tailwind CSS v4 + shadcn/ui |
| **Data Fetching** | TanStack Query v5 |
| **HTTP** | Axios (with `x-session-id` interceptor) |
| **State** | Zustand + React Hook Form + Zod |
| **Testing** | Vitest + React Testing Library + Playwright + MSW |

## Quick Start

### Prerequisites
- Node.js 18+
- `.env` file (copy from `.env.example`)

### Setup
```bash
npm install
cp .env.example .env
npm run dev
```

Backend must be running on `http://localhost:3000`. The dev server proxies `/api` requests to the backend.

### Available Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start Vite dev server (HMR enabled) |
| `npm run build` | Compile TypeScript + build production bundle |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Generate coverage report (v8) |

## Project Structure

```
src/
├── app/                        # App shell, routing, providers
│   ├── routes/                 # Route definitions (admin, portal, auth)
│   ├── layouts/                # Admin & Portal layouts
│   ├── guards/                 # Route protection (AuthGuard, AdminGuard, PortalGuard)
│   ├── pages/                  # Root pages (dashboard, 404, 500)
│   ├── providers.tsx           # Query + Router providers
│   └── App.tsx                 # Route composition
│
├── features/                   # Domain modules (one per feature)
│   ├── auth/                   # Login, session, Zustand store
│   ├── album/                  # Albums, images, uploads, downloads
│   ├── school/                 # Schools (admin only)
│   ├── class/                  # Classes, student/teacher assignment
│   ├── student/                # Students, profiles
│   ├── protector/              # Parents/guardians
│   ├── user/                   # User management (admin only)
│   ├── box/                    # Box.com integration settings
│   ├── audit/                  # Audit logs
│   └── portal/                 # User portal (student/protector views)
│
├── shared/                     # Cross-cutting concerns
│   ├── components/ui/          # shadcn/ui primitives
│   ├── components/             # Reusable app components (DataTable, ConfirmDialog, etc.)
│   ├── hooks/                  # Shared hooks (useDebounce, usePagination)
│   ├── lib/                    # Utilities (apiClient, env, errors)
│   ├── types/                  # Global types (ApiResponse, AppError)
│   └── constants/              # Routes, roles
│
└── test/                       # Testing utilities
    ├── setup.ts                # Vitest setup
    ├── handlers.ts             # MSW handlers
    └── factories.ts            # Test data factories

~176 .ts/.tsx files organized by domain.
```

See `./docs/system-architecture.md` for detailed architecture and `./docs/codebase-summary.md` for component inventory.

## Domain Rules (Critical)

These rules ensure correctness. Violating them breaks the app. **Read `AGENTS.md` for the complete list.**

1. **Session auth** — Use `x-session-id` header, NOT `Authorization: Bearer`
2. **Two portals** — Admin/Teacher use `/admin/*`, Student/Protector use `/portal/*`
3. **Role guards** — `AdminGuard` (ADMIN+TEACHER), `PortalGuard` (STUDENT+PROTECTOR)
4. **Login redirect** — ADMIN → `/admin`, TEACHER → `/admin/my-classes`, STUDENT/PROTECTOR → `/portal`
5. **Box.com only** — Frontend never uploads directly to Box; DB stores metadata only
6. **Watermark policy** — Server-side on download; never on preview; never on student docs
7. **Album visibility** — DRAFT (ADMIN & creator), PUBLISHED (all with access), ARCHIVED (visible, no download)
8. **Teacher scope** — Teachers only see their assigned classes
9. **Single-school MVP** — No multi-school switching in UI

## Documentation

- **`AGENTS.md`** — AI agent rules, domain rules, doc map (START HERE for coding rules)
- **`REACT_CODING_STANDARDS.md`** — Full coding standards (naming, error handling, state, testing)
- **`DESIGN_SYSTEM.md`** — Colors, typography, spacing, component variants
- **`docs/project-overview-pdr.md`** — Product requirements and business rules
- **`docs/codebase-summary.md`** — Repository structure and file inventory
- **`docs/code-standards.md`** — Quick reference for code style
- **`docs/system-architecture.md`** — Layer diagram, auth flow, data flow
- **`docs/project-roadmap.md`** — Phase status, milestones, progress (172/179 tasks complete)
- **`docs/deployment-guide.md`** — Build, env vars, hosting guidance
- **`docs/design-guidelines.md`** — Design token reference
- **`docs/tech-stack.md`** — Stack decisions and version rationale
- **`docs/api-map.md`** — All backend endpoints
- **`docs/auth-flow.md`** — Login flow, guard logic, redirects
- **`docs/secure-gallery-mvp-plan.md`** — Full MVP plan

## Status

Pre-production. **172 of 179 implementation tasks complete** (Phase 10 — E2E tests pending).

Phases 0–9: ✅ All features implemented
Phase 10: 🔧 Unit/integration tests done; E2E (Playwright) setup needed

See `docs/progress-tracking.md` for granular task list.

## Getting Help

1. **Code questions?** Check `REACT_CODING_STANDARDS.md` (naming, imports, patterns)
2. **Architecture questions?** Check `docs/system-architecture.md`
3. **API questions?** Check `docs/api-map.md`
4. **Auth questions?** Check `docs/auth-flow.md`
5. **Design questions?** Check `DESIGN_SYSTEM.md`

---

Built with ❤️ for School Box Portal MVP.
