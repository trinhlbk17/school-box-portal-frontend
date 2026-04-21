# Design System — School Box Portal

> Single source of truth for all visual styling decisions.
> AI agents **MUST** reference this file when generating any UI code.

---

## 1. Color Palette

### Brand Colors

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--color-primary-50` | `217 100% 97%` | `#EFF6FF` | Primary tinted backgrounds |
| `--color-primary-100` | `214 95% 93%` | `#DBEAFE` | Hover backgrounds |
| `--color-primary-200` | `213 97% 87%` | `#BFDBFE` | Light borders, rings |
| `--color-primary-300` | `212 96% 78%` | `#93C5FD` | Disabled primary |
| `--color-primary-400` | `213 94% 68%` | `#60A5FA` | Icons on light bg |
| `--color-primary-500` | `217 91% 60%` | `#3B82F6` | **Default primary** (buttons, links) |
| `--color-primary-600` | `221 83% 53%` | `#2563EB` | **Hover primary** |
| `--color-primary-700` | `224 76% 48%` | `#1D4ED8` | **Active/pressed** |
| `--color-primary-800` | `226 71% 40%` | `#1E40AF` | Dark accents |
| `--color-primary-900` | `224 64% 33%` | `#1E3A5F` | Sidebar background |
| `--color-primary-950` | `226 57% 21%` | `#172554` | Darkest text on primary |

### Neutral (Gray)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-neutral-50` | `#F9FAFB` | Page background |
| `--color-neutral-100` | `#F3F4F6` | Card background, stripes |
| `--color-neutral-200` | `#E5E7EB` | Borders, dividers |
| `--color-neutral-300` | `#D1D5DB` | Disabled borders |
| `--color-neutral-400` | `#9CA3AF` | Placeholder text |
| `--color-neutral-500` | `#6B7280` | Secondary text, icons |
| `--color-neutral-600` | `#4B5563` | Body text |
| `--color-neutral-700` | `#374151` | Strong text |
| `--color-neutral-800` | `#1F2937` | Headings |
| `--color-neutral-900` | `#111827` | Highest contrast text |
| `--color-neutral-950` | `#030712` | Near-black |

### Semantic Colors

| Category | Default (500) | Light bg (50) | Text (700) | Usage |
|----------|--------------|---------------|------------|-------|
| **Success** | `#16A34A` | `#F0FDF4` | `#15803D` | Saved, published, active |
| **Warning** | `#EAB308` | `#FEFCE8` | `#A16207` | Draft, pending, attention |
| **Error** | `#DC2626` | `#FEF2F2` | `#B91C1C` | Validation, delete, failed |
| **Info** | `#0EA5E9` | `#F0F9FF` | `#0369A1` | Tips, information banners |

### Background Surfaces

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-page` | `neutral-50` | Main page background |
| `--bg-card` | `white` | Card, dialog, dropdown surfaces |
| `--bg-sidebar` | `primary-900` | Admin sidebar |
| `--bg-sidebar-hover` | `primary-800` | Sidebar nav item hover |
| `--bg-input` | `white` | Form inputs |
| `--bg-muted` | `neutral-100` | Muted sections, table stripes |

---

## 2. Typography

### Font Family

```css
@theme {
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
```

> **Import** Inter from Google Fonts: `https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap`

### Type Scale

| Name | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| `display` | `36px` / `2.25rem` | 700 (bold) | 1.2 | `-0.025em` | Hero sections only |
| `h1` | `30px` / `1.875rem` | 700 (bold) | 1.25 | `-0.025em` | Page titles |
| `h2` | `24px` / `1.5rem` | 600 (semibold) | 1.3 | `-0.02em` | Section headings |
| `h3` | `20px` / `1.25rem` | 600 (semibold) | 1.4 | `-0.01em` | Card titles |
| `h4` | `16px` / `1rem` | 600 (semibold) | 1.5 | `normal` | Subsection headings |
| `body` | `14px` / `0.875rem` | 400 (regular) | 1.5 | `normal` | Default body text |
| `body-sm` | `13px` / `0.8125rem` | 400 (regular) | 1.5 | `normal` | Secondary descriptions |
| `caption` | `12px` / `0.75rem` | 500 (medium) | 1.4 | `0.02em` | Labels, badges, metadata |
| `overline` | `11px` / `0.6875rem` | 600 (semibold) | 1.4 | `0.05em` | Uppercase labels |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--text-primary` | `neutral-900` | Headings, important text |
| `--text-body` | `neutral-600` | Default body text |
| `--text-secondary` | `neutral-500` | Helper text, timestamps |
| `--text-placeholder` | `neutral-400` | Input placeholders |
| `--text-disabled` | `neutral-300` | Disabled controls |
| `--text-inverse` | `white` | Text on dark backgrounds |
| `--text-link` | `primary-600` | Clickable links |
| `--text-link-hover` | `primary-700` | Link hover state |

---

## 3. Spacing Scale

Based on a **4px** base unit. Use Tailwind spacing classes exclusively.

| Token | Value | Tailwind | Common Usage |
|-------|-------|----------|-------------|
| `0` | `0px` | `p-0` | Reset |
| `0.5` | `2px` | `p-0.5` | Tight inline spacing |
| `1` | `4px` | `p-1` | Icon padding |
| `1.5` | `6px` | `p-1.5` | Badge padding |
| `2` | `8px` | `p-2` | Input padding (x), small gaps |
| `2.5` | `10px` | `p-2.5` | Button padding (y) |
| `3` | `12px` | `p-3` | Card inner padding (compact) |
| `4` | `16px` | `p-4` | **Standard card padding** |
| `5` | `20px` | `p-5` | Section padding |
| `6` | `24px` | `p-6` | **Large card padding**, page gutter |
| `8` | `32px` | `p-8` | Section gaps |
| `10` | `40px` | `p-10` | Page section spacing |
| `12` | `48px` | `p-12` | Large section gaps |
| `16` | `64px` | `p-16` | Page top/bottom padding |

### Standard Gaps

| Context | Gap | Tailwind |
|---------|-----|----------|
| Inline elements (icon + text) | `8px` | `gap-2` |
| Form fields (stacked) | `16px` | `gap-4` |
| Cards in a grid | `16-24px` | `gap-4` or `gap-6` |
| Page sections | `32-48px` | `gap-8` or `gap-12` |
| Sidebar nav items | `4px` | `gap-1` |

---

## 4. Border Radius

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--radius-sm` | `4px` | `rounded-sm` | Badges, small tags |
| `--radius-md` | `6px` | `rounded-md` | Buttons, inputs |
| `--radius-lg` | `8px` | `rounded-lg` | **Cards**, dropdowns |
| `--radius-xl` | `12px` | `rounded-xl` | Modals, large cards |
| `--radius-2xl` | `16px` | `rounded-2xl` | Image thumbnails |
| `--radius-full` | `9999px` | `rounded-full` | Avatars, pills |

---

## 5. Shadows

| Token | Value | Tailwind | Usage |
|-------|-------|----------|-------|
| `--shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | `shadow-xs` | Subtle lift |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | `shadow-sm` | Cards at rest |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | `shadow-md` | Cards on hover, dropdowns |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | `shadow-lg` | Modals, floating panels |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | `shadow-xl` | Dialogs |

---

## 6. Borders

| Context | Width | Color | Tailwind |
|---------|-------|-------|----------|
| Card | `1px` | `neutral-200` | `border border-neutral-200` |
| Input default | `1px` | `neutral-300` | `border border-neutral-300` |
| Input focus | `2px` | `primary-500` | `focus:ring-2 focus:ring-primary-500` |
| Input error | `1px` | `error-500` | `border-red-500` |
| Divider | `1px` | `neutral-200` | `border-t border-neutral-200` |
| Table row | `1px` | `neutral-100` | `border-b border-neutral-100` |

---

## 7. Breakpoints

| Name | Min Width | Tailwind | Target |
|------|-----------|----------|--------|
| `sm` | `640px` | `sm:` | Large phones (landscape) |
| `md` | `768px` | `md:` | Tablets |
| `lg` | `1024px` | `lg:` | Small laptops |
| `xl` | `1280px` | `xl:` | Desktops |
| `2xl` | `1536px` | `2xl:` | Large screens |

### Layout Rules

| Portal | Default | Sidebar | Content Area |
|--------|---------|---------|-------------|
| **Admin** | Sidebar visible `lg+`, collapsed `md`, hidden `<md` | `256px` expanded, `64px` collapsed | Fluid, `max-w-7xl` centered |
| **User** | Bottom nav always visible | N/A | Fluid, `max-w-lg` centered (mobile-first) |

---

## 8. Z-Index Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--z-base` | `0` | Default layer |
| `--z-dropdown` | `10` | Dropdowns, popovers |
| `--z-sticky` | `20` | Sticky headers, sidebar |
| `--z-overlay` | `30` | Backdrop overlays |
| `--z-modal` | `40` | Modals, dialogs |
| `--z-toast` | `50` | Toast notifications |
| `--z-tooltip` | `60` | Tooltips (topmost) |

---

## 9. Transitions & Animations

### Standard Transitions

| Property | Duration | Easing | Tailwind |
|----------|----------|--------|----------|
| Color, background | `150ms` | `ease-in-out` | `transition-colors duration-150` |
| Opacity | `150ms` | `ease-in-out` | `transition-opacity duration-150` |
| Transform (scale, translate) | `200ms` | `ease-out` | `transition-transform duration-200` |
| All properties | `200ms` | `ease-in-out` | `transition-all duration-200` |
| Sidebar expand/collapse | `300ms` | `ease-in-out` | `transition-all duration-300` |
| Page/modal enter | `200ms` | `ease-out` | — |
| Page/modal exit | `150ms` | `ease-in` | — |

### Hover Effects

```css
/* Standard card hover — lift + shadow */
.card-hover {
  @apply transition-all duration-200 hover:shadow-md hover:-translate-y-0.5;
}

/* Button hover — darken background */
.btn-hover {
  @apply transition-colors duration-150;
}

/* Row hover — background highlight */
.row-hover {
  @apply transition-colors duration-100 hover:bg-neutral-50;
}

/* Link hover — underline + color shift */
.link-hover {
  @apply transition-colors duration-150 hover:text-primary-700 hover:underline;
}
```

### Skeleton Loading

```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.skeleton {
  @apply bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200;
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}
```

---

## 10. Component Patterns

### Buttons

| Variant | Background | Text | Border | Hover |
|---------|-----------|------|--------|-------|
| **Primary** | `primary-500` | `white` | none | `primary-600` |
| **Secondary** | `white` | `neutral-700` | `neutral-300` | `neutral-50` bg |
| **Destructive** | `red-500` | `white` | none | `red-600` |
| **Ghost** | `transparent` | `neutral-600` | none | `neutral-100` bg |
| **Link** | `transparent` | `primary-600` | none | underline + `primary-700` |

| Size | Height | Padding (x) | Font | Radius |
|------|--------|-------------|------|--------|
| `sm` | `32px` | `12px` | `13px` / medium | `rounded-md` |
| `md` | `36px` | `16px` | `14px` / medium | `rounded-md` |
| `lg` | `40px` | `20px` | `14px` / medium | `rounded-md` |

### Input Fields

| State | Border | Ring | Background |
|-------|--------|------|-----------|
| Default | `neutral-300` | none | `white` |
| Hover | `neutral-400` | none | `white` |
| Focus | `primary-500` | `2px primary-500/20` | `white` |
| Error | `red-500` | `2px red-500/20` | `white` |
| Disabled | `neutral-200` | none | `neutral-50` |

Standard input: height `36px`, padding `8px 12px`, font `14px`, radius `rounded-md`.

### Cards

```
┌─────────────────────────────────────────┐
│  bg: white                              │
│  border: 1px neutral-200                │
│  radius: rounded-lg (8px)               │
│  shadow: shadow-sm                      │
│  padding: p-6 (24px)                    │
│  hover: shadow-md + translateY(-1px)    │
└─────────────────────────────────────────┘
```

### Badges / Status Pills

| Status | Background | Text | Example |
|--------|-----------|------|---------|
| Active / Published | `green-50` | `green-700` | `PUBLISHED` |
| Draft / Pending | `yellow-50` | `yellow-700` | `DRAFT` |
| Archived / Inactive | `neutral-100` | `neutral-600` | `ARCHIVED` |
| Error / Deleted | `red-50` | `red-700` | `DEACTIVATED` |
| Info | `blue-50` | `blue-700` | `PROCESSING` |

Style: `px-2.5 py-0.5`, font `12px medium`, radius `rounded-full`.

### Tables (DataTable)

| Element | Style |
|---------|-------|
| Header row | `bg-neutral-50`, `text-neutral-500`, `text-xs uppercase`, `font-semibold` |
| Body row | `border-b border-neutral-100`, `hover:bg-neutral-50` |
| Cell padding | `px-4 py-3` |
| Selected row | `bg-primary-50` |

### Sidebar (Admin Layout)

| Element | Style |
|---------|-------|
| Background | `primary-900` (#1E3A5F) |
| Nav item default | `text-primary-200`, `px-3 py-2`, `rounded-md` |
| Nav item hover | `bg-primary-800`, `text-white` |
| Nav item active | `bg-primary-700`, `text-white`, `font-medium` |
| Section label | `text-primary-400`, `text-xs uppercase`, `tracking-wider` |
| Width expanded | `256px` (`w-64`) |
| Width collapsed | `64px` (`w-16`) |

### Bottom Nav (User Portal)

| Element | Style |
|---------|-------|
| Background | `white`, `border-t border-neutral-200` |
| Height | `64px` |
| Icon default | `text-neutral-400`, `20px` |
| Icon active | `text-primary-500` |
| Label | `text-xs`, `mt-1` |
| Safe area | `pb-safe` (for notch devices) |

---

## 11. Tailwind v4 `@theme` Configuration

Place this in your main CSS file (e.g., `src/index.css`):

```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-primary-50: #EFF6FF;
  --color-primary-100: #DBEAFE;
  --color-primary-200: #BFDBFE;
  --color-primary-300: #93C5FD;
  --color-primary-400: #60A5FA;
  --color-primary-500: #3B82F6;
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-800: #1E40AF;
  --color-primary-900: #1E3A5F;
  --color-primary-950: #172554;

  /* Semantic */
  --color-success-50: #F0FDF4;
  --color-success-500: #16A34A;
  --color-success-700: #15803D;

  --color-warning-50: #FEFCE8;
  --color-warning-500: #EAB308;
  --color-warning-700: #A16207;

  --color-error-50: #FEF2F2;
  --color-error-500: #DC2626;
  --color-error-700: #B91C1C;

  --color-info-50: #F0F9FF;
  --color-info-500: #0EA5E9;
  --color-info-700: #0369A1;

  /* Typography */
  --font-sans: 'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Sidebar */
  --sidebar-width: 256px;
  --sidebar-width-collapsed: 64px;
  --bottom-nav-height: 64px;
}
```

---

## 12. Rules for AI Agents

> [!IMPORTANT]
> These rules are **mandatory**. Violating them produces inconsistent UI.

1. **Use design tokens only** — Never use raw hex colors (`#2e75b6`), arbitrary values (`text-[13px]`), or inline `style` attributes. Always use the tokens defined above via Tailwind classes.
2. **Font is Inter** — Never use default browser fonts. Ensure Inter is imported and applied via `--font-sans`.
3. **Spacing is 4px-based** — Only use Tailwind's built-in spacing scale (`gap-2`, `p-4`, `m-6`). No arbitrary spacing (`mt-[13px]`).
4. **Radius is `rounded-lg` for cards** — Cards, dialogs, and panels use `rounded-lg`. Buttons and inputs use `rounded-md`. Avatars and pills use `rounded-full`.
5. **Shadows are minimal** — Cards at rest use `shadow-sm`. Hover lifts to `shadow-md`. Modals use `shadow-lg`. No stronger shadows without justification.
6. **Transitions on all interactive elements** — Every button, link, and card must have `transition-colors duration-150` at minimum. Cards use `transition-all duration-200`.
7. **No magic colors in JSX** — All status badges, buttons, and semantic indicators must use the token system (`primary`, `success`, `warning`, `error`, `info`).
8. **Admin sidebar = dark (primary-900)** — Never use a light sidebar for the Admin portal.
9. **User portal = mobile-first** — All User portal components must be designed mobile-first with `max-w-lg` content centering.
10. **Body text is 14px / neutral-600** — This is the project default. Never use `text-black` for body text; use `text-neutral-600` or `text-neutral-700`.
11. **Use `cn()` for conditional classes** — Never concatenate class strings manually. Always use the `cn()` utility from `@/shared/lib/cn`.
12. **Use `cva` for variant components** — Buttons, badges, and any multi-variant component must use `class-variance-authority`.

---

## 13. Accessibility Colors

All color combinations must meet **WCAG 2.1 AA** contrast (4.5:1 for text, 3:1 for UI).

| Foreground | Background | Ratio | Pass |
|-----------|-----------|-------|------|
| `neutral-900` | `white` | 17.4:1 | ✅ AAA |
| `neutral-600` | `white` | 5.7:1 | ✅ AA |
| `neutral-500` | `white` | 4.6:1 | ✅ AA |
| `neutral-400` | `white` | 3.0:1 | ⚠️ UI only |
| `white` | `primary-500` | 4.5:1 | ✅ AA |
| `white` | `primary-900` | 11.0:1 | ✅ AAA |
| `success-700` | `success-50` | 5.8:1 | ✅ AA |
| `error-700` | `error-50` | 6.3:1 | ✅ AA |
| `warning-700` | `warning-50` | 5.1:1 | ✅ AA |

> **Rule:** Never use `neutral-400` for essential text — it is for placeholder and decorative text only.
