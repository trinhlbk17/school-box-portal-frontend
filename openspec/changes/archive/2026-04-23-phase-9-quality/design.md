## Context

The frontend application works, but lacks the resilience, feedback, and optimization required for a production launch. The application has two distinct user segments: Admins/Teachers on desktops and Students/Protectors heavily relying on mobile devices. There are no global error boundaries, leading to white screens of death on component crashes. Loading states are inconsistent, and performance optimization (like bundle size and lazy loading) hasn't been rigorously audited.

## Goals / Non-Goals

**Goals:**
- Implement granular error boundaries using `react-error-boundary`.
- Provide global fallback UI for 404 and 500 errors.
- Ensure all list and detail views use skeleton loaders.
- Add mutation spinners to all interactive action buttons.
- Optimize the User Portal for mobile (e.g., card-based lists instead of data tables on small screens).
- Ensure WCAG accessibility compliance (labels, ARIA, focus traps, contrast).
- Run Lighthouse audits and optimize bundle size.

**Non-Goals:**
- Complete redesign of existing UI components.
- Backend performance optimizations.

## Decisions

- **Error Boundaries:** Use `react-error-boundary` instead of relying solely on React Router's `errorElement`. This allows for granular recovery (e.g., a single tab crashing without taking down the whole page layout). We will still implement global route-level `errorElement` as a fallback.
- **Loading States Strategy:** Implement a delay before showing skeletons for data fetching to prevent "Skeleton Flash" on fast networks.
- **Responsive Lists:** For components like `StudentList`, implement a CSS/Tailwind-based toggle or conditional rendering hook (`useMediaQuery`) to render a `DataTable` on `md` and above, and a stacked card list on `sm` screens.

## Risks / Trade-offs

- **Risk:** Implementing `react-error-boundary` across many features might lead to code duplication.
  - **Mitigation:** Create a reusable `FeatureErrorBoundary` wrapper component in `src/shared/components`.
- **Risk:** Responsive list implementation increases component complexity.
  - **Mitigation:** Abstract the rendering logic cleanly, keeping the underlying data model identical between table and card views.
