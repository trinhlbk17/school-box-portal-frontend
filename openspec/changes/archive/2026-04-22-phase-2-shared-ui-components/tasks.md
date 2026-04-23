## 1. CSS Variable Remapping

- [x] 1.1 Remap `:root` shadcn CSS variables to brand design tokens in `src/index.css`
- [x] 1.2 Remap sidebar CSS variables to dark sidebar design (`primary-900`)
- [x] 1.3 Remove `.dark` CSS block (no dark mode in MVP)
- [x] 1.4 Verify Button renders blue (not gray) in browser

## 2. shadcn Primitive Installs

- [x] 2.1 Add Card component (`npx shadcn@latest add card`)
- [x] 2.2 Add Input component (`npx shadcn@latest add input`)
- [x] 2.3 Add Label component (`npx shadcn@latest add label`)
- [x] 2.4 Add Dialog component (`npx shadcn@latest add dialog`)
- [x] 2.5 Add DropdownMenu component (`npx shadcn@latest add dropdown-menu`)
- [x] 2.6 Add Table component (`npx shadcn@latest add table`)
- [x] 2.7 Add Skeleton component (`npx shadcn@latest add skeleton`)

## 3. Badge with Status Variants

- [x] 3.1 Add Badge component (`npx shadcn@latest add badge`)
- [x] 3.2 Extend Badge with status variants (success, warning, error, info) using cva

## 4. Toast Setup

- [x] 4.1 Add Sonner toast component (`npx shadcn@latest add sonner`)
- [x] 4.2 Add `<Toaster />` to `src/app/providers.tsx` with `position="top-right"` and `richColors`

## 5. Shared Hooks

- [x] 5.1 Create `src/shared/hooks/useDebounce.ts`
- [x] 5.2 Create `src/shared/hooks/usePagination.ts` (reads/writes URL search params)

## 6. DataTable Component

- [x] 6.1 Define `ColumnDef<T>` type in `src/shared/types/dataTable.types.ts`
- [x] 6.2 Create `src/shared/components/DataTable.tsx` with column rendering and data rows
- [x] 6.3 Add search bar with debounced `onSearch` callback
- [x] 6.4 Add server-side pagination controls (prev, page numbers, next)
- [x] 6.5 Add column header sort indicators and `onSort` callback
- [x] 6.6 Add row checkbox selection with "select all" and `onRowSelect` callback
- [x] 6.7 Add loading skeleton rows when `isLoading=true`
- [x] 6.8 Add empty state fallback when data array is empty

## 7. Page Scaffolding Components

- [x] 7.1 Create `src/shared/components/PageHeader.tsx` (title, description, breadcrumbs, actions)
- [x] 7.2 Create `src/shared/components/EmptyState.tsx` (icon, title, description, optional action)
- [x] 7.3 Create `src/shared/components/ErrorAlert.tsx` (error message with optional retry)
- [x] 7.4 Create `src/shared/components/ConfirmDialog.tsx` (confirm/cancel modal, destructive variant)

## 8. Verification

- [x] 8.1 Run `npx tsc --noEmit` — zero type errors
- [x] 8.2 Run `npm run lint` — zero lint errors
- [x] 8.3 Run `npm run dev` — dev server starts, verify components render in browser
- [x] 8.4 Update `docs/progress-tracking.md` — mark Phase 2 tasks 2.1–2.17 as complete
