# Deployment Guide

Build, configuration, and hosting instructions.

## Current Status

**Pre-production.** No production deployment configured yet. Local development and backend integration in progress (Phase 10).

## Local Development

### Prerequisites
- Node.js 18+
- Backend running on `http://localhost:3000`

### Setup
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start dev server
npm run dev
```

Dev server runs on `http://localhost:5173` with HMR enabled.

### Environment Variables

**`.env` (required for local dev):**

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=School Box Portal
```

Values are validated at build/runtime using Zod schema in `src/shared/lib/env.ts`.

### Available Dev Scripts

```bash
npm run dev          # Vite dev server with HMR
npm run build        # Production build (tsc + vite)
npm run lint         # ESLint check
npm run test         # Vitest watch mode
npm run test:run     # Run tests once
npm run test:coverage # Coverage report (v8)
npm run preview      # Preview production build locally
```

## Production Build

### Build Process
```bash
npm run build
```

Steps:
1. **Type check:** `tsc -b` (fails on TypeScript errors)
2. **Bundle:** `vite build` (minify, code-split, tree-shake)
3. **Output:** `dist/` directory

**Build time:** ~30–60 seconds  
**Output size:** ~200–300 KB (gzipped)

### Verify Build
```bash
npm run preview
# Preview production build locally at localhost:4173
```

## Hosting Options

This is a **static SPA** (Single Page Application). Works on any CDN or static host.

### Option 1: Vercel (Recommended for ease)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Vercel automatically:
- Detects Vite project
- Runs `npm run build`
- Uploads `dist/` as static files
- Configures SPA fallback (index.html)
- Provides preview URL

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Or connect GitHub repo for automatic deployments on push.

### Option 3: S3 + CloudFront
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://my-bucket/

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

**Important:** Configure CloudFront to redirect 404 to `index.html` (SPA fallback).

### Option 4: Self-hosted (Docker)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

**nginx.conf:**
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  
  location / {
    try_files $uri $uri/ /index.html;
  }
}
```

## SPA Routing Configuration

**Critical:** All static hosts must redirect 404s to `index.html` (so React Router can handle client-side routing).

### Vercel
Automatic (no config needed).

### Netlify
Create `netlify.toml`:
```toml
[[redirects]]
from = "/*"
to = "/index.html"
status = 200
```

### S3 + CloudFront
1. Enable **Static website hosting** in S3 (bucket properties)
2. Set **Index document** to `index.html`
3. Set **Error document** to `index.html`

Or use CloudFront **Origin Response** lambda to redirect 404 → index.html.

### nginx
```nginx
error_page 404 =200 /index.html;
```

## Backend Integration

### Dev
Backend runs on `localhost:3000`. Vite config proxies `/api`:

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
```

No explicit `VITE_API_BASE_URL` needed for dev (relative `/api` works).

### Production
Backend runs on production URL (e.g., `https://api.myschool.com`).

Set environment variable:
```bash
VITE_API_BASE_URL=https://api.myschool.com
```

Frontend axios client reads this and makes requests to `${VITE_API_BASE_URL}/auth/login`, etc.

**CORS:** Backend must allow requests from frontend domain.

## Environment-Specific Configuration

### Development
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=School Box Portal (Dev)
```

### Staging
```env
VITE_API_BASE_URL=https://api-staging.myschool.com
VITE_APP_NAME=School Box Portal (Staging)
```

### Production
```env
VITE_API_BASE_URL=https://api.myschool.com
VITE_APP_NAME=School Box Portal
```

**Note:** Build process embeds these values; rebuilding is required for env changes.

## GitHub Actions CI/CD (Example)

```yaml
# .github/workflows/deploy.yml
name: Build & Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci
      - run: npm run lint
      - run: npm run test:run
      - run: npm run build

      - uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

## Security Checklist

- [ ] HTTPS enforced (all connections TLS 1.2+)
- [ ] CORS configured (backend allows frontend domain only)
- [ ] CSP headers set (Content-Security-Policy)
- [ ] X-Frame-Options set to DENY (prevent clickjacking)
- [ ] X-Content-Type-Options set to nosniff
- [ ] Secure session token handling (httpOnly if possible at backend)
- [ ] No API keys / secrets in environment (only URLs)
- [ ] Backend validates all input (frontend validation is UX only)

## Performance Optimization

### Lighthouse Audit
```bash
# Local: Use Chrome DevTools > Lighthouse
# Or: npm i -g lighthouse && lighthouse https://yoursite.com
```

**Targets:**
- Performance: >90
- Accessibility: >90
- Best Practices: >90
- SEO: >90

### Build Analysis
```bash
npm i -g vite-plugin-visualizer
# Then import in vite.config.ts and run npm run build
# Opens `dist/stats.html` to see bundle composition
```

### Optimization Tips
- Lazy-load routes (already done)
- Lazy-load images (`loading="lazy"` on img)
- Minify CSS/JS (vite build does this)
- Compress assets (gzip via hosting provider)

## Monitoring & Logs

### Frontend Error Tracking (Optional)
Consider integrating Sentry:

```ts
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

### Backend Logs
Frontend sends all requests to backend; check backend logs for errors.

### User Session Logs
Audit log is built-in: `GET /audit-logs` endpoint. Admin can view all downloads, uploads, etc.

## Rollback & Hot Fix

### Rollback
```bash
# If deployment goes wrong, revert to previous version
vercel --prod  # Deploy from previous commit
# OR manually revert git commit and redeploy
```

### Hot Fix
1. Fix code in `main` branch
2. Commit: `git commit -m "fix: issue X"`
3. Push: `git push origin main`
4. CI/CD redeploys automatically

## Maintenance

### Dependency Updates
```bash
npm update          # Update minor/patch versions
npm outdated        # List outdated packages
npm audit fix       # Fix security vulnerabilities
```

### Test Before Updating
```bash
npm run test:run
npm run build
npm run preview
```

## Future Enhancements

- [ ] Staging environment setup
- [ ] Blue-green deployment strategy
- [ ] Automated E2E tests in CI
- [ ] Performance monitoring (Sentry, datadog, etc.)
- [ ] Analytics (Google Analytics, Mixpanel)
- [ ] PWA (Progressive Web App) features
- [ ] Multi-region CDN caching

## Support

**Backend integration:** See `docs/api-map.md` for all endpoints.  
**Auth flow:** See `docs/auth-flow.md` for session token handling.  
**Environment config:** See `src/shared/lib/env.ts` for validation schema.

---

**Status:** Pre-production (no live deployment yet)  
**Last updated:** 2026-05-11  
**Next step:** Setup staging environment when backend deployed
