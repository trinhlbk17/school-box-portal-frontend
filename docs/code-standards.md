# Code Standards Quick Reference

Keep code clear, maintainable, and consistent. **For comprehensive standards, see `REACT_CODING_STANDARDS.md` (root).**

## File Naming

- **Components** → PascalCase: `AlbumForm.tsx`, `ImageGrid.tsx`
- **Hooks** → camelCase: `useAlbums.ts`, `useLogin.ts`
- **Utilities** → camelCase: `normalizeApiError.ts`, `cn.ts`
- **Types/Schemas** → snake_case file, PascalCase export: `album.types.ts` → `Album`, `AlbumStatus`
- **Barrel exports** → `index.ts` in each feature

## File Size

Keep individual files **under 200 lines** for optimal readability.

- Split large components into smaller focused ones
- Extract utility functions into separate modules
- Use composition over inheritance

## Naming Conventions

| Category | Pattern | Example |
|----------|---------|---------|
| Components | PascalCase | `AlbumForm`, `ImageUploader`, `ConfirmDialog` |
| Hooks | camelCase `use*` | `useAlbums`, `useLogin`, `usePagination` |
| Functions | camelCase | `normalizeApiError`, `cn`, `formatDate` |
| Constants | UPPER_SNAKE_CASE | `API_BASE_URL`, `DEFAULT_PAGE_SIZE` |
| Types | PascalCase | `Album`, `User`, `ApiResponse<T>` |
| Enums | PascalCase | `AlbumStatus`, `UserRole` |
| Interfaces | PascalCase, no `I` prefix | `AuthStore`, `ApiError` (not `IAuthStore`) |

## Code Style — Essential Rules

### 1. No Inline Comments
Code must explain itself. Use JSDoc only on exported utilities and complex hooks.

❌ **Bad:**
```ts
// format the amount
const formatted = new Intl.NumberFormat(...);
```

✅ **Good:**
```tsx
export function formatMoney(amount: string, currency: string): string {
  /**
   * Format monetary amount for display with currency symbol.
   * Handles zero, negative (overdraft), and precision by currency.
   */
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(parseFloat(amount));
}
```

### 2. Early Returns & Guard Clauses
Validate preconditions at the top; avoid nested ternaries.

❌ **Bad:**
```tsx
function AlbumForm({ album }: { album: Album | null }) {
  if (album) {
    if (album.status === "PUBLISHED") {
      return <PublishedBanner />;
    } else {
      return <EditForm album={album} />;
    }
  } else {
    return <EmptyState />;
  }
}
```

✅ **Good:**
```tsx
function AlbumForm({ album }: { album: Album | null }) {
  if (!album) return <EmptyState />;
  if (album.status === "PUBLISHED") return <PublishedBanner />;
  return <EditForm album={album} />;
}
```

### 3. No `any` Type
TypeScript strict mode enforces this. Infer types, use generics, or `unknown` with narrowing.

❌ **Bad:**
```ts
const data: any = response.data;
```

✅ **Good:**
```ts
const data: Album = response.data as Album; // or cast after validation
```

### 4. Error Handling
Always catch errors; provide user-friendly messages.

✅ **Good:**
```ts
try {
  await updateAlbum(id, payload);
  toast.success("Album updated");
} catch (error) {
  const message = normalizeApiError(error);
  toast.error(message);
}
```

### 5. TanStack Query for Server State
Never manage API data with useState. Use TanStack Query hooks.

❌ **Bad:**
```tsx
const [albums, setAlbums] = useState<Album[]>([]);
useEffect(() => {
  fetchAlbums().then(setAlbums).catch(console.error);
}, []);
```

✅ **Good:**
```tsx
const { data: albums, isLoading, error } = useAlbums(classId);
```

### 6. Zustand for Global Client State
Use for auth session, role checks, UI flags (dark mode, etc.).

✅ **Good:**
```tsx
// useAuthStore.ts
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  sessionToken: null,
  setSession: (token, user) => set({ sessionToken: token, user }),
  logout: () => set({ user: null, sessionToken: null }),
}));

// In component:
const { user, isAdmin } = useAuthStore();
```

### 7. React Hook Form + Zod for Forms
Always validate with Zod schemas before submission.

✅ **Good:**
```tsx
const form = useForm<LoginInput>({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: "", password: "", keepMeLogin: false },
});

const onSubmit = form.handleSubmit(async (data) => {
  try {
    await loginMutation.mutateAsync(data);
  } catch (error) {
    form.setError("root", { message: "Login failed" });
  }
});
```

### 8. Lazy Load Routes
All page routes should be lazy-loaded to reduce initial bundle.

✅ **Good:**
```tsx
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));

export const adminRoutes = [
  {
    path: "/admin",
    element: <AdminDashboardPage />,
  },
];
```

### 9. Feature Module Isolation
Each domain owns its api/, types/, hooks/. Cross-feature data flows through props or shared hooks.

✅ **Good:**
```tsx
// src/features/album/index.ts
export { useAlbums, useAlbumMutations } from "./hooks";
export { Album, AlbumStatus } from "./types/album.types";

// In another feature:
import { useAlbums, Album } from "@/features/album";
```

❌ **Bad:**
```tsx
// Don't import internals:
import albumApi from "@/features/album/api/albumApi";
```

### 10. Error Boundaries per Feature
Wrap each feature's pages in `<FeatureErrorBoundary>` to contain errors.

✅ **Good:**
```tsx
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <AlbumDetailPage />
</ErrorBoundary>
```

## Styling

- **Tailwind CSS v4** with `@theme` tokens from `DESIGN_SYSTEM.md`
- Use `cn()` utility (clsx + tailwind-merge) to conditionally merge classes
- No inline `style=` props; use Tailwind classes

✅ **Good:**
```tsx
import { cn } from "@/shared/lib/cn";

export function Button({ variant = "primary", className, ...props }) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded font-medium",
        variant === "primary" && "bg-blue-500 text-white",
        variant === "secondary" && "bg-gray-200 text-gray-900",
        className,
      )}
      {...props}
    />
  );
}
```

## Behavioral Rules (from AGENTS.md)

1. **Search before creating** — Check `src/shared/` and `src/features/` for existing implementations
2. **Modify, don't duplicate** — Extend existing components with new props; compose instead of copy-paste
3. **One feature = one source of truth** — api/ is the only place calling apiClient for that domain
4. **Update barrel exports** — When adding files to a feature, export them from `index.ts`
5. **Query key pattern** — `[resource, ...ids, { filters }]` (e.g., `["albums", classId, { status: "PUBLISHED" }]`)
6. **Check impact before modifying shared code** — Search imports; verify no breaking changes

## Pre-Commit Checklist

Before committing code:

- [ ] `npx tsc --noEmit` — No TypeScript errors
- [ ] `npm run lint` — No ESLint warnings/errors
- [ ] `npm run test:run` — All tests pass (or no coverage regressions)
- [ ] No `console.log()` or `debugger;` left behind
- [ ] Imports are tree-shakeable (avoid `import *`)
- [ ] Component props are documented (JSDoc for complex components)
- [ ] Related barrel exports (`index.ts`) are updated

## TypeScript Strict Mode

Project uses `strict: true` in `tsconfig.json`.

- No implicit `any`
- All function parameters require types
- No null/undefined without explicit handling
- No unchecked index signatures

## Accessibility Expectations (Phase 9D complete)

- Touch targets ≥ 44px on mobile
- All inputs have labels (use `<label htmlFor="id">`)
- Keyboard navigation (tab, enter, escape)
- ARIA attributes on custom components (`role`, `aria-label`, `aria-describedby`)

## Performance

- **Code splitting:** Routes are lazy-loaded
- **Image thumbnails:** Lazy-load in grids (using `loading="lazy"` or Intersection Observer)
- **Queries:** Configured with appropriate staleTime and cacheTime
- **Memoization:** Use React.memo for expensive renders (selectively, not everywhere)

## Testing

- **Unit/Component tests:** Vitest + React Testing Library
- **E2E tests:** Playwright (setup in progress, Phase 10)
- **Mock API:** MSW handlers in `src/test/handlers.ts`
- **Test data:** Factories in `src/test/factories.ts`

Write tests for:
- Auth flow (login, logout, guards)
- Critical forms (login, create school, upload image)
- Data display (lists, detail pages)

Target: >70% coverage on critical paths.

## Domain Rules (Critical)

See `AGENTS.md` § Domain Rules for complete list. Key highlights:

1. Session auth uses `x-session-id` header
2. Admin/Teacher use `/admin/*`; Student/Protector use `/portal/*`
3. Teachers see only their assigned classes
4. Watermarks are server-side only (never on preview, never on student docs)

---

For detailed guidance, see:
- `REACT_CODING_STANDARDS.md` (full standards)
- `DESIGN_SYSTEM.md` (design tokens)
- `AGENTS.md` (domain rules, behavioral rules)
- `docs/system-architecture.md` (architecture)

**Last updated:** 2026-05-11  
**Status:** Phase 10 in progress
