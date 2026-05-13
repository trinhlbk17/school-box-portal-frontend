## 1. Playwright Setup

- [ ] 1.1 Install Playwright dependencies (`npm init playwright@latest` or manual installation of `@playwright/test` and browsers).
- [ ] 1.2 Configure `playwright.config.ts` (base URL, timeouts, projects/browsers, webServer setup if needed).
- [ ] 1.3 Add `e2e` scripts to `package.json` (`npm run test:e2e`).
- [ ] 1.4 Set up a basic authentication fixture or global setup script to bypass login UI for faster E2E tests.

## 2. Admin E2E Flow

- [ ] 2.1 Create `e2e/admin-flow.spec.ts`.
- [ ] 2.2 Implement test: Admin logs in, navigates to Schools, creates a new school, and verifies it appears.
- [ ] 2.3 Implement test: Admin clicks into the created school, adds a new class, and verifies it appears in the class list.

## 3. Album E2E Flow

- [ ] 3.1 Create `e2e/album-flow.spec.ts`.
- [ ] 3.2 Implement test: Admin logs in, navigates to a class, creates a new album (Draft).
- [ ] 3.3 Implement test: Admin uploads test images to the album and previews them.
- [ ] 3.4 Implement test: Admin publishes the album and verifies the 'Download All' button is visible and clickable.

## 4. User Portal E2E Flow

- [ ] 4.1 Create `e2e/portal-flow.spec.ts`.
- [ ] 4.2 Implement test: Protector logs in, redirects to `/portal`, and verifies their assigned students appear.
- [ ] 4.3 Implement test: Protector clicks on a student, navigates to the Albums tab, and sees published albums.
- [ ] 4.4 Implement test: Protector opens an album, previews an image, and verifies the watermark banner and download functionality.

## 5. Verification

- [ ] 5.1 Run all Playwright tests locally (`npx playwright test`) and ensure they pass.
- [ ] 5.2 Update `docs/progress-tracking.md` to mark tasks 10.7, 10.8, 10.9, and 10.10 as complete.
