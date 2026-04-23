## Why

Phase 1 (Auth & Shell) is complete — login, guards, layouts, and routing all work. Phase 3 (Schools & Classes) requires reusable UI primitives: tables, forms, modals, badges, and page scaffolding. Without a shared component library, every feature team would create ad-hoc components, leading to visual inconsistency and duplicated code. Building the shared UI layer now establishes a single source of truth before feature development begins.

Additionally, the existing shadcn/ui CSS variables use default oklch grays that conflict with our brand design tokens (blue primary, semantic status colors). This must be resolved before any component renders correctly.

## What Changes

- **Remap shadcn CSS variables** to brand design tokens from `DESIGN_SYSTEM.md` (primary → blue, destructive → red, etc.)
- **Install shadcn primitives**: Card, Input, Label, Badge, Dialog, DropdownMenu, Table, Skeleton
- **Extend Badge** with semantic status variants (success, warning, error, info) using `cva`
- **Wire Sonner toast** into the provider tree for mutation feedback
- **Build DataTable** — generic, reusable table with server-side pagination, search, column sorting, and row selection
- **Build page scaffolding components**: PageHeader (title + breadcrumbs + actions), EmptyState, ErrorAlert, ConfirmDialog
- **Create shared hooks**: `usePagination` (URL-param-based), `useDebounce`

## Capabilities

### New Capabilities
- `design-token-bridge`: Remapping shadcn CSS variables to project brand tokens so all UI components inherit correct colors
- `shadcn-primitives`: Installing and configuring base UI primitives (Card, Input, Label, Badge, Dialog, DropdownMenu, Table, Skeleton, Toast)
- `data-table`: Generic reusable DataTable component with pagination, search, sorting, and row selection
- `page-scaffolding`: Shared layout components (PageHeader, EmptyState, ErrorAlert, ConfirmDialog)
- `shared-hooks`: Reusable hooks for pagination and debounce

### Modified Capabilities
_(none — no existing specs are affected)_

## Impact

- **`src/index.css`**: `:root` CSS variables change from oklch grays to brand hex colors. The existing Button component will visually change from dark-gray to blue.
- **`src/shared/components/ui/`**: 8+ new component files added via shadcn CLI
- **`src/shared/components/`**: 4 new custom composite components
- **`src/shared/hooks/`**: 2 new hook files
- **`src/app/providers.tsx`**: Sonner `<Toaster />` added to provider tree
- **Dependencies**: No new npm packages needed — `sonner`, `lucide-react`, `class-variance-authority` already in `package.json`
- **Breaking**: The Button component's default appearance changes from near-black to blue due to CSS var remap. This is intentional and aligns with the design system.
