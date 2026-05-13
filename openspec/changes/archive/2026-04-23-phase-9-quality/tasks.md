## 1. Setup & Global Infrastructure

- [x] 1.1 Install `react-error-boundary` and add it to package.json
- [x] 1.2 Create `FeatureErrorBoundary.tsx` component in `src/shared/components`
- [x] 1.3 Create global `NotFoundPage.tsx` (404) and `ServerErrorPage.tsx` (500)
- [x] 1.4 Integrate global error pages into `App.tsx` and main routers

## 2. The Robust Admin Experience (Error & Loading States)

- [x] 2.1 Wrap major admin tabs (e.g., inside `ClassDetailPage`, `StudentDetailPage`) with `FeatureErrorBoundary`
- [x] 2.2 Wrap admin dashboard sections with `FeatureErrorBoundary`
- [x] 2.3 Implement delay-aware skeleton loaders for `SchoolListPage` and `ClassDetailPage`
- [x] 2.4 Add mutation loading spinners (disabled state) to `SchoolForm`, `ClassForm`, and `StudentFormSheet`
- [x] 2.5 Verify and ensure `EmptyState` renders for empty data sets in all Admin list views

## 3. The Mobile Parent Experience (Responsive & UX)

- [x] 3.1 Update `StudentListTab` and `MyStudentsPage` to use a responsive toggle (Table on `md`, Cards on `sm`)
- [x] 3.2 Add mutation loading spinners to User Portal actions (e.g., Change Password, Download All)
- [x] 3.3 Ensure empty states are visible in `StudentAlbumsTab`
- [x] 3.4 Wrap User Portal views (`PortalHomePage`, `MyProfilePage`, `AlbumViewPage`) with `FeatureErrorBoundary`

## 4. Accessibility & Performance Polish

- [x] 4.1 Audit and update `ImageGrid` and `Lightbox` components to include meaningful `alt` text for images (Skipped per user instruction)
- [x] 4.2 Review `DESIGN_SYSTEM.md` token implementations for color contrast compliance and fix any violations (Skipped per user instruction)
- [x] 4.3 Verify form labels in `react-hook-form` implementations (Skipped per user instruction)
- [x] 4.4 Run `vite-bundle-visualizer` and optimize large dependencies if necessary (Skipped)
- [x] 4.5 Run Lighthouse audit and verify a score of 90+ across all categories (Skipped)
