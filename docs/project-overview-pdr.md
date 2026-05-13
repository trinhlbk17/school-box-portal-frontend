# Project Overview & Product Development Requirements

## Problem Statement

Schools need a secure, private photo gallery for class events. Teachers upload images from field trips, sports events, or classroom moments. Parents and students can view and download watermarked photos from a single portal without managing multiple file shares or cloud accounts. Box.com provides reliable file storage; the portal adds role-based access control, watermarking, and audit logging.

## Stakeholders

| Role | Responsibilities | Access |
|------|------------------|--------|
| **ADMIN** | Manage schools, classes, users, Box settings, audit logs | All data |
| **TEACHER** | Create/publish albums, upload images, manage students in assigned classes | Own classes only |
| **STUDENT** | View published albums from their classes, download images | Their classes only |
| **PROTECTOR** | View albums of assigned students, download images | Assigned students only |

## Key Business Rules (Domain Rules)

1. **Session-based auth (NOT JWT)** — Backend uses `x-session-id`. Do NOT use `Authorization: Bearer`. See `docs/auth-flow.md`.
2. **Two portal experiences** — Admin/Teacher use `/admin/*` routes. Student/Protector use `/portal/*` routes. Never mix them.
3. **Role-based route guards** — `AdminGuard` (ADMIN+TEACHER), `PortalGuard` (STUDENT+PROTECTOR).
4. **Login redirect by role** — ADMIN → `/admin`, TEACHER → `/admin/my-classes`, STUDENT → `/portal`, PROTECTOR → `/portal`.
5. **Box.com is the file store** — Frontend never uploads directly to Box. DB stores only metadata + `boxFileId`/`boxFolderId`.
6. **Watermark** — Album images are watermarked server-side on download. Previews are NOT. Student docs are NEVER watermarked.
7. **Album visibility** — `DRAFT`: ADMIN & creator. `PUBLISHED`: all with class access. `ARCHIVED`: visible, no download.
8. **Teacher scope restriction** — Teachers only see classes they are assigned to.
9. **Single-school MVP** — No multi-school switching in the UI.

## Goals

- Enable passwordless logins for students/parents (OTP via email) and password logins for staff
- Allow teachers to upload and manage class event photos in <5 minutes
- Enable parents to view, preview, and download all child event photos in one place
- Provide admins visibility into all user activity via audit logs
- Integrate seamlessly with Box.com for reliable, scalable file storage
- Ensure security: role-based access, watermarked downloads, no data leaks

## Non-Goals

- Multi-school support (defer to Phase 11)
- Real-time collaboration (e.g., shared editing)
- Social features (commenting, likes, sharing)
- Direct uploads to non-Box storage
- Mobile app (web-responsive design sufficient)

## Primary User Flows

### Flow 1: Teacher Uploads Album
1. Teacher logs in with email + password → `/admin/my-classes`
2. Selects a class → class detail page
3. Creates new album (title, description, class)
4. Uploads images (drag & drop or file picker)
5. Publishes album → visible to all students/protectors in that class
6. Teacher can later download a ZIP of all images

### Flow 2: Protector Views Student Photos
1. Parent logs in with OTP (email)
2. Sees list of assigned students
3. Selects student → student detail page with published albums
4. Opens album → gallery view with watermarked previews
5. Downloads watermarked image or ZIP → applied server-side

### Flow 3: Admin Manages System
1. Admin logs in with email + password → `/admin` (dashboard)
2. Can view/manage: schools, classes, users, students, protectors, Box settings, audit logs
3. Assigns teachers to classes
4. Deactivates users
5. Views audit trail of all image downloads + user actions

## Success Metrics

| Metric | Target | Rationale |
|--------|--------|-----------|
| **Login success rate** | >98% | Session auth must be reliable |
| **Image download latency** | <2s for preview, <5s for watermarked ZIP | UX expectation |
| **Uptime** | 99.5% | School events are time-sensitive |
| **Test coverage** | >70% on critical paths (auth, upload, download) | Confidence before handoff |
| **E2E tests** | 3+ user journeys automated | Regression prevention |

## Out of Scope

- OTP email sending (deferred to Phase 11, using password login now)
- Shared folders feature (backend not implemented)
- Multi-school tenant switching
- Advanced analytics (just audit logs)
- Video support (images only)

## Tech Stack Summary

See `docs/tech-stack.md` for version details and rationale.

- **Frontend:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4, shadcn/ui
- **State:** TanStack Query v5 (server), Zustand (auth), React Hook Form + Zod (forms)
- **API:** Axios with `x-session-id` interceptor
- **Testing:** Vitest + RTL + Playwright + MSW
- **Backend:** REST API on `localhost:3000` (dev), manages auth, storage, watermarking
- **File Storage:** Box.com (via backend)

## Personas & Jobs to Be Done

### Persona 1: Sarah (Teacher, 45, not tech-savvy)
- **Job:** Share class trip photos with 25 families in <5 minutes
- **Pain:** Email has 50MB limit; cloud apps are confusing
- **Solution:** Drag & drop upload, one-click publish, families get direct link

### Persona 2: James (Parent, 38, busy)
- **Job:** Check if his kid is in the class photos without missing an email attachment
- **Pain:** Forgot to ask for photos; can't find that one thing in email
- **Solution:** Always-available gallery, simple login, easy to find by student

### Persona 3: Maya (Admin, 28, organized)
- **Job:** Ensure compliance: no parent downloads non-watermarked images; audit trail for FERPA
- **Pain:** Teachers upload to wrong Box folder; no way to prove who downloaded what
- **Solution:** Enforce watermarking server-side; log every download with user + timestamp

## Acceptance Criteria

- [x] MVP scope: Single school, 4 roles, albums/images/watermark/audit
- [x] Auth: session token, role guards, login redirects
- [x] Teacher can upload images via drag & drop in <5 min
- [x] Parent can view + download watermarked images in 2 clicks
- [x] Admin can see user activity in audit log
- [x] All critical flows tested (unit + integration tests passing)
- [ ] E2E tests for 3 primary flows (in progress, Phase 10)

## Related Documents

- **Full MVP plan:** `docs/secure-gallery-mvp-plan.md`
- **Architecture:** `docs/system-architecture.md`
- **Progress tracking:** `docs/progress-tracking.md` (172/179 tasks done)
- **API reference:** `docs/api-map.md`
- **Implementation phases:** `docs/project-roadmap.md`

---

**Version:** 1.0  
**Last updated:** 2026-05-11  
**Status:** In production implementation (Phase 10 — testing)
