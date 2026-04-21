# AI Agent Instructions

> This document provides instructions for AI coding assistants working in the **School Box Portal Frontend** project.

---

## Quick Reference & Essential Documentation

**Before generating ANY code or modifying architecture**, you MUST read the following documents if relevant to your task:

| Action / Domain               | Location                                                |
| ----------------------------- | ------------------------------------------------------- |
| **Coding standards (Critical)**| `REACT_CODING_STANDARDS.md` **(READ FIRST)**            |
| **Design system & styling**   | `DESIGN_SYSTEM.md` **(REQUIRED FOR UI)**                |
| **Tech stack & architecture** | `docs/tech-stack.md`                                    |
| **API map (all endpoints)**   | `docs/api-map.md`                                       |
| **Auth flow & guards**        | `docs/auth-flow.md`                                     |
| **Backend gaps & blockers**   | `docs/backend-gaps.md`                                  |
| **Admin portal UX flow**      | `docs/ux-admin-portal.md`                               |
| **User portal UX flow**       | `docs/ux-user-portal.md`                                |
| **MVP plan (full scope)**     | `docs/secure-gallery-mvp-plan.md`                       |

---

## Domain Rules (Must-Know)

These are critical business rules. Violating them will break the application.

1. **Session-based auth (NOT JWT)** — Backend uses `x-session-id`. Do NOT use `Authorization: Bearer`. See `docs/auth-flow.md`.
2. **Two portal experiences** — Admin/Teacher use `/admin/*` routes. Student/Protector use `/portal/*` routes. Never mix them.
3. **Role-based route guards** — `AdminGuard` (ADMIN+TEACHER), `PortalGuard` (STUDENT+PROTECTOR).
4. **Login redirect by role** — ADMIN → `/admin`, TEACHER → `/admin/my-classes`, STUDENT → `/portal`, PROTECTOR → `/portal`.
5. **Box.com is the file store** — Frontend never uploads directly to Box. DB stores only metadata + `boxFileId`/`boxFolderId`.
6. **Watermark** — Album images are watermarked server-side on download. Previews are NOT. Student docs are NEVER watermarked.
7. **Album visibility** — `DRAFT`: ADMIN & creator. `PUBLISHED`: all with class access. `ARCHIVED`: visible, no download.
8. **Teacher scope restriction** — Teachers only see classes they are assigned to.
9. **Single-school MVP** — No multi-school switching in the UI.

---

## AI Agent Behavioral Rules

> [!CAUTION]
> These rules govern **how** you operate. Violating them leads to duplicated components, broken integrations, and inconsistent architecture.

### Rule 1: Search Before You Create
**Before creating ANY new file**, search the codebase for existing implementations:
- UI primitives: `src/shared/components/`
- Domain components: `src/features/<domain>/components/`
- Hooks: `src/features/<domain>/hooks/` or `src/shared/hooks/`
- Utils: `src/shared/lib/`

### Rule 2: Modify, Don't Duplicate
- **Extend** existing components with new props/variants.
- **Compose** by wrapping existing components.
- If a component in `shared/` doesn't fit, create a domain-specific wrapper in `features/<domain>/components/` that composes it.

### Rule 3: One Feature = One Source of Truth
Each feature module owns its data.
- **api/**: The ONLY place calling `apiClient` for that domain.
- **hooks/**: The ONLY way components access server data (using TanStack Query).
- Cross-feature data sharing goes through **props** or **shared hooks**, never direct imports from another feature's internals.

### Rule 4: Update Barrel Exports
When adding a new component, hook, or type to a feature, update the feature's `index.ts`. Other features import **only** from the barrel.

### Rule 5: Consistent Query Key Strategy
Pattern: `[resource, ...identifiers, { filters }]` (e.g., `["albums", classId, { page }]`).

### Rule 6: Check Impact Before Modifying Shared Code
When modifying files in `src/shared/`:
1. Search for all imports of the file.
2. Verify changes don't break existing consumers.
3. Never change the signature of an existing shared utility without updating all callers.

### Rule 7: Commit-Ready Code Only
Every code change must be:
- **Type-safe** (`npx tsc --noEmit`)
- **Lint-clean** (`npm run lint`)
- **Self-contained** (no orphan files, missing imports)

*(For specific code format, structure, state management, and file naming rules, refer strictly to `REACT_CODING_STANDARDS.md` and `docs/tech-stack.md`.)*
