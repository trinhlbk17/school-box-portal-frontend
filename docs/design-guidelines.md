# Design Guidelines

Reference for design tokens, component usage, and UX patterns. **Complete design system in `DESIGN_SYSTEM.md` (root).**

## Quick Links

- **Full design tokens** → `DESIGN_SYSTEM.md` (colors, typography, spacing, shadows, radius)
- **Color reference** → Brand palette, semantic colors, gradients
- **Component variants** → Button, Card, Badge, Input, Dialog styles
- **Accessibility** → WCAG 2.1 AA compliance, keyboard nav, screen readers

## Color Palette

### Brand Colors
```
Primary (Blue):    #3B82F6  (--color-primary-500)
  Darker:          #1E40AF  (--color-primary-900)
  Lighter:         #DBEAFE  (--color-primary-100)

Neutral (Gray):    #6B7280  (--color-neutral-500)
  Light:           #F3F4F6  (--color-neutral-100)
  Dark:            #1F2937  (--color-neutral-900)
```

### Semantic Colors
```
Success:           #10B981  (green, for confirmations)
Warning:           #F59E0B  (amber, for cautions)
Error:             #EF4444  (red, for errors)
Info:              #06B6D4  (cyan, for informational)
```

**Usage in Tailwind:**
```tsx
<button className="bg-primary-500 text-white">Primary</button>
<button className="bg-success-500">Success</button>
<span className="text-error-500">Error message</span>
```

## Typography

### Font
**Inter** (variable font, all weights 100–900)

Imported from Google Fonts in `src/app/App.tsx`:
```tsx
import "@fontsource-variable/geist";
```

### Sizes & Weights

| Use Case | Tailwind | Example |
|----------|----------|---------|
| **Page Title** | `text-3xl font-bold` | "School List" |
| **Section Head** | `text-2xl font-bold` | "Classes in Jefferson Elementary" |
| **Card Title** | `text-lg font-semibold` | Album name |
| **Label** | `text-sm font-medium` | Form field label |
| **Body** | `text-base font-normal` | Paragraph text |
| **Small** | `text-sm` | Helper text, timestamps |
| **Tiny** | `text-xs` | Metadata, badges |

### Line Height
- Body text: `leading-relaxed` (1.625)
- Headlines: `leading-tight` (1.25)

## Spacing

Consistent spacing using Tailwind scale:

| Space | Pixels | CSS Class |
|-------|--------|-----------|
| XS | 4px | `p-1`, `m-1` |
| S | 8px | `p-2`, `m-2` |
| M | 16px | `p-4`, `m-4` |
| L | 24px | `p-6`, `m-6` |
| XL | 32px | `p-8`, `m-8` |
| 2XL | 48px | `p-12`, `m-12` |

**Guidelines:**
- Page padding: 24px (p-6) on mobile, 32px (p-8) on desktop
- Section gaps: 16px (gap-4) or 24px (gap-6)
- Component inner padding: 12px–16px (p-3 to p-4)

## Components

### Button Variants

```tsx
// Primary (default action)
<Button>Save Album</Button>
// CSS: bg-primary-500 text-white

// Secondary (alternative action)
<Button variant="secondary">Cancel</Button>
// CSS: bg-neutral-200 text-neutral-900

// Danger (destructive action)
<Button variant="danger">Delete</Button>
// CSS: bg-error-500 text-white

// Ghost (minimal, text-only)
<Button variant="ghost">Learn More</Button>
// CSS: text-primary-600 hover:bg-primary-100

// Loading state
<Button disabled>
  <Spinner className="mr-2" />
  Uploading...
</Button>
```

All buttons use 44px minimum height (touch-friendly on mobile).

### Card
```tsx
<Card>
  <CardHeader>
    <h3>Album Title</h3>
  </CardHeader>
  <CardContent>
    Image grid or details
  </CardContent>
  <CardFooter>
    <Button>Edit</Button>
  </CardFooter>
</Card>
```

**Styling:** White background, subtle shadow, rounded corners (8px).

### Badge
```tsx
// Status badges
<Badge variant="success">Published</Badge>
<Badge variant="warning">Draft</Badge>
<Badge variant="error">Archived</Badge>

// Info badge
<Badge variant="info">Teacher</Badge>
```

### Dialog / Modal
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent>
    <DialogHeader>
      <h2>Create Album</h2>
    </DialogHeader>
    <AlbumForm onSuccess={() => setIsOpen(false)} />
  </DialogContent>
</Dialog>
```

**Guidelines:**
- Use for create/edit forms, confirmations
- Max width: 500px on desktop
- Full width on mobile (with padding)
- Always include close button (X) or cancel button

### Input Fields
```tsx
<Input
  type="email"
  placeholder="user@school.com"
  className="w-full"
/>

<textarea
  placeholder="Album description"
  className="w-full p-3 border rounded"
/>
```

**Guidelines:**
- Always pair with `<label>`
- Minimum height: 40px (44px with padding)
- Border: 1px neutral-300
- Focus: outline-2 outline-primary-500

### DataTable
```tsx
<DataTable
  columns={[
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role" },
  ]}
  data={schools}
  onRowClick={(row) => navigate(`/admin/schools/${row.id}`)}
/>
```

**Features:**
- Sortable columns
- Pagination (10/25/50 rows per page)
- Search bar at top
- Row hover highlight

### Empty State
```tsx
<EmptyState
  icon={CloudIcon}
  title="No albums yet"
  description="Upload images to get started"
  action={<Button>Create Album</Button>}
/>
```

Use when list is empty, search has no results, or feature not available.

### Error Alert
```tsx
<ErrorAlert
  title="Failed to upload image"
  message="File size exceeds 100 MB. Try a smaller image."
/>
```

Use for API errors, validation failures, system errors.

### Page Header
```tsx
<PageHeader
  title="School List"
  description="Manage schools and classes"
  breadcrumb={[
    { label: "Dashboard", href: "/admin" },
    { label: "Schools" },
  ]}
  actions={[
    <Button key="create" onClick={() => setShowForm(true)}>
      Create School
    </Button>,
  ]}
/>
```

Use at top of every page for title, breadcrumb, action buttons.

## Responsive Breakpoints

Tailwind v4 breakpoints:

| Prefix | Min Width | Use Case |
|--------|-----------|----------|
| (none) | 0px | Mobile-first base |
| `sm:` | 640px | Small devices |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Desktops |
| `xl:` | 1280px | Large desktops |

**Guidelines:**
- Design mobile-first (start with base classes)
- Add tablet adjustments with `md:`
- Sidebar hides on mobile (`hidden md:block`)
- Grid columns: 1 column mobile, 2–3 on desktop

Example:
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Cards will stack on mobile, 2 cols on tablet, 3 on desktop */}
</div>
```

## Dark Mode (Future)

Dark mode support is **not currently enabled**, though `next-themes` is installed for future use.

To enable:
1. Import `<ThemeProvider>` in `src/app/providers.tsx`
2. Add `dark` strategy to `tailwind.config.ts`
3. Use `dark:` prefix for dark-mode overrides

## Accessibility Standards (Phase 9D Complete)

### Touch Targets
- All interactive elements ≥ 44px × 44px
- Minimum spacing between targets: 8px

### Keyboard Navigation
- All buttons/links tabbable with `Tab` key
- Modal dismiss with `Escape` key
- Form submit with `Enter` key
- Skip links for navigation

### Screen Readers
- Semantic HTML: `<button>`, `<a>`, `<input>` (not `<div onClick>`)
- Form labels: `<label htmlFor="id">` linked to input
- Images: `alt` text (or `aria-label` if decorative)
- Headings: Proper hierarchy (`h1` → `h2` → `h3`, no skipping)
- ARIA: `role`, `aria-label`, `aria-describedby` on custom components

Example:
```tsx
<label htmlFor="school-name">School Name *</label>
<Input
  id="school-name"
  type="text"
  required
  aria-describedby="school-help"
/>
<p id="school-help" className="text-sm text-neutral-600">
  Full legal name of the school
</p>
```

### Color Contrast
- Text: 4.5:1 contrast ratio (AAA standard)
- UI components: 3:1 contrast ratio minimum

**Check contrast:** Use browser DevTools or [WebAIM](https://webaim.org/resources/contrastchecker/)

## Icon Library

Using **Lucide React** (`lucide-react`).

```tsx
import {
  School,
  Users,
  Upload,
  Download,
  AlertCircle,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

// Usage
<Upload className="w-5 h-5 text-primary-500" />
```

**Icon sizes:**
- UI icons (buttons, nav): `w-4 h-4` or `w-5 h-5`
- Large display icons (empty state): `w-12 h-12` or `w-16 h-16`

## Loading States

### Spinner
```tsx
import { Loader2 } from "lucide-react";

<Loader2 className="w-4 h-4 animate-spin" />
```

### Skeleton
```tsx
<Skeleton className="h-12 w-full rounded" />
<Skeleton className="h-4 w-3/4 mt-4" />
```

Use for:
- Shimmer loading on list pages
- Placeholder while data loads
- Detail page loading state

### Button Loading
```tsx
<Button disabled={isLoading}>
  {isLoading && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
  {isLoading ? "Uploading..." : "Upload"}
</Button>
```

## Toast Notifications (Sonner)

```tsx
import { toast } from "sonner";

// Success
toast.success("Album created successfully");

// Error
toast.error("Failed to upload image", {
  description: "File size exceeds 100 MB",
});

// Info
toast.info("Changes saved");
```

Position: Bottom-right (configurable in providers).

## UX Patterns

### Form Submission
1. Show loading spinner during submission
2. Disable form inputs
3. Disable submit button
4. On success: show toast, close modal, refetch data
5. On error: show error message in alert or toast

### Deletion
Always confirm before deleting:
```tsx
<ConfirmDialog
  title="Delete Album"
  description="This action cannot be undone."
  onConfirm={() => deleteAlbum.mutate(id)}
>
  <Button variant="danger">Delete</Button>
</ConfirmDialog>
```

### Search & Filter
- Debounce input 300ms before API call
- Show "No results" state when search returns 0
- Clear button to reset search

### Pagination
- Show current page, total count
- Previous/Next buttons
- Jump-to-page input for large datasets

### Multi-step Forms
- Visible progress indicator (step 1/3)
- Back button to return to previous step
- Summary step before final submission

## Common Layouts

### Page with Sidebar (Admin)
```
┌──────────────────────────────────────┐
│ Header (logo, profile dropdown)      │
├─────────────┬──────────────────────┤
│ Sidebar     │ Content Area         │
│ (nav)       │ (PageHeader + body)  │
│             │                      │
└─────────────┴──────────────────────┘
```

Sidebar collapses on mobile.

### Page with Top Bar (Portal)
```
┌──────────────────────────────────────┐
│ Top Bar (logo, profile, menu)        │
├──────────────────────────────────────┤
│ Content Area (full width)            │
│                                      │
├──────────────────────────────────────┤
│ Bottom Nav (mobile only)             │
└──────────────────────────────────────┘
```

Bottom nav for mobile navigation.

## Styling Best Practices

1. **Use Tailwind classes** — Never inline `style=` props
2. **Use `cn()` helper** — Merge conditional classes:
   ```tsx
   className={cn("base-class", isActive && "active-class")}
   ```
3. **Extract complex styling** — Move to component (not inline JSX)
4. **Use design tokens** — Reference colors, spacing from Tailwind config
5. **Keep components small** — Max 200 lines for readability

---

**Source of truth:** `DESIGN_SYSTEM.md` (root)  
**Last updated:** 2026-05-11  
**Accessibility target:** WCAG 2.1 AA (Phase 9D complete)
