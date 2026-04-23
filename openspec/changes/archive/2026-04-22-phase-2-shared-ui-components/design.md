## Context

Phase 1 delivered a working app shell: login, route guards, admin/portal layouts, and routing. The codebase has:
- shadcn/ui initialized (`components.json` with `base-nova` style, aliases to `@/shared/components/ui`)
- One shadcn component installed (Button using `@base-ui/react`)
- Tailwind v4 with brand `@theme` tokens in `index.css`
- `cn.ts` and `cva` ready to use

**Problem**: shadcn's `:root` CSS variables use oklch grays (e.g., `--primary: oklch(0.205 0 0)` = near-black) while our design system uses blue (`#3B82F6`). Every shadcn component currently renders with wrong colors. This must be fixed before adding more components.

**Consumers**: Every Phase 3+ feature (Schools, Classes, Students, Albums, Users) depends on these shared components for tables, forms, modals, and status indicators.

## Goals / Non-Goals

**Goals:**
- Remap shadcn CSS variables to brand design tokens so all components render correctly
- Install all shadcn primitives needed for Phase 3-8 features
- Build a DataTable component with pagination, search, sorting, and row selection
- Build page scaffolding components (PageHeader, EmptyState, ErrorAlert, ConfirmDialog)
- Create shared hooks for pagination and debounce
- All components follow `DESIGN_SYSTEM.md` specifications exactly

**Non-Goals:**
- Dark mode (no `.dark` CSS block in MVP)
- Complex data grid features (column resizing, virtualization, inline editing)
- Feature-specific components (those belong in `src/features/<domain>/components/`)
- Additional npm dependencies (everything needed is already installed)
- `@tanstack/react-table` — we build a simpler custom DataTable to keep bundle small

## Decisions

### 1. CSS Variable Remapping Strategy

**Decision**: Remap shadcn's oklch `:root` variables to our hex brand colors directly.

**Rationale**: shadcn components reference `--primary`, `--destructive`, etc. rather than our `--color-primary-500` tokens. Instead of modifying every component to use our token names, we set the shadcn variables to our brand values. This means future `npx shadcn@latest add` commands produce correctly-themed components with zero manual adjustment.

**Alternatives considered**:
- *Override at component level* — More work per component, constantly fighting defaults
- *Keep both systems separate* — Creates visual inconsistency between shadcn and custom components

**Mapping**:

| shadcn var | Value | Source |
|---|---|---|
| `--primary` | `#3B82F6` | `primary-500` |
| `--primary-foreground` | `#FFFFFF` | white on blue |
| `--destructive` | `#DC2626` | `error-500` |
| `--destructive-foreground` | `#FFFFFF` | white on red |
| `--secondary` | `#F3F4F6` | `neutral-100` |
| `--secondary-foreground` | `#1F2937` | `neutral-800` |
| `--muted` | `#F3F4F6` | `neutral-100` |
| `--muted-foreground` | `#6B7280` | `neutral-500` |
| `--accent` | `#EFF6FF` | `primary-50` |
| `--accent-foreground` | `#1F2937` | `neutral-800` |
| `--background` | `#F9FAFB` | `neutral-50` |
| `--foreground` | `#111827` | `neutral-900` |
| `--card` | `#FFFFFF` | white |
| `--card-foreground` | `#111827` | `neutral-900` |
| `--popover` | `#FFFFFF` | white |
| `--popover-foreground` | `#111827` | `neutral-900` |
| `--border` | `#E5E7EB` | `neutral-200` |
| `--input` | `#D1D5DB` | `neutral-300` |
| `--ring` | `#3B82F6` | `primary-500` |

### 2. Custom DataTable vs @tanstack/react-table

**Decision**: Build a custom DataTable component without `@tanstack/react-table`.

**Rationale**: Our table requirements are straightforward — server-side pagination, search, sort, and row selection. The data manipulation (filtering, sorting, pagination) happens on the backend. The frontend table only needs to render data, trigger callbacks, and manage UI state (selected rows, sort indicators). `@tanstack/react-table` adds ~15KB for features we don't use (client-side filtering, grouping, column pinning, virtualization).

**Alternatives considered**:
- *@tanstack/react-table* — Powerful but heavyweight for server-driven tables, adds complexity for simple rendering

**Interface**: Generic `DataTable<T extends { id: string }>` accepting column definitions, data, and callback props for server-side operations.

### 3. Pagination via URL Search Params

**Decision**: `usePagination` hook reads/writes `page` and `pageSize` from URL search params.

**Rationale**: Pagination state in URL means:
- Page survives browser refresh
- Bookmarkable/shareable list views
- Browser back button works naturally
- Consistent with coding standards (URL as state for filters/pagination)

### 4. Badge Status Variants via cva

**Decision**: Extend shadcn Badge with custom status variants using `class-variance-authority`.

**Rationale**: The design system defines 5 status badge styles (success, warning, error, info, default). Using `cva` follows the existing Button pattern and coding standards requirement ("Use `cva` for variant components").

### 5. Component File Organization

**Decision**: shadcn primitives in `src/shared/components/ui/`, custom composites in `src/shared/components/`.

**Rationale**: Matches the existing `components.json` aliases and keeps a clear boundary between shadcn-managed and custom components.

## Risks / Trade-offs

**[Risk] CSS var remap breaks existing Button appearance** → Intentional. Button changes from dark-gray to brand-blue, which is the correct design. This is the desired outcome.

**[Risk] Custom DataTable may lack features needed later** → Mitigation: DataTable interface is generic and composable. If we need advanced features later, we can swap the internals to `@tanstack/react-table` without changing the consumer API.

**[Risk] shadcn updates may overwrite our CSS remapping** → Mitigation: Our `:root` overrides are in `index.css` below the `@theme inline` block. shadcn's `add` command only touches component files, not the CSS.

**[Trade-off] No dark mode** → Acceptable for MVP. The `.dark` block can be re-added later when dark mode is needed.
