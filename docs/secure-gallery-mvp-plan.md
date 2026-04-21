# Secure Photo Gallery — MVP Plan v4 (Box.com Storage)

## 📌 Project Overview

**Webapp** for teachers to upload event photos → create a share link → parents enter email + OTP → view original photos → download with watermark.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS (TypeScript) |
| Database | PostgreSQL + Prisma ORM |
| Frontend | Vite + React (TypeScript) |
| **File Storage** | **Box.com (OAuth2, 1 shared admin account)** |
| Image Processing | Sharp (libvips) — watermark on download |
| Email | AWS SES or HubSpot |
| Auth | JWT (Admin) + JWT (Viewer/Parent) |
| Repos | 2 separate repos: `secure-gallery-api` + `secure-gallery-web` |

### MVP Principles

- **As simple as possible** — no over-engineering
- **1 album = 1 share link** (auto-generated slug on Album)
- **Simple watermark** — 3 diagonal text lines across the image, no tiled pattern
- **No Redis needed** for MVP — OTP stored in DB with TTL check
- **Configurable** — all limits via `.env`, changes require no code updates

---

## 🔄 Core Flows

### Flow 0: Admin Connect Box (1 time)

```
Admin login → Settings → "Connect Box" button
→ OAuth2 redirect to Box → Authorize → Callback with code
→ Backend exchange code → Store access_token + refresh_token (encrypted in DB)
→ Box connected ✅
```

### Flow 1: Admin Upload

```
Admin login → Create album (name, class, school) → Backend creates Box Folder
→ Upload photos (drag-drop) → Backend uploads files to Box Folder
→ Box auto-generates thumbnail → Save boxFileId + metadata to DB
→ Publish album → Auto-generate share link
```

### Flow 2: Parent View + Download

```
Open share link /s/{slug} → Enter email → Receive OTP (6 digits, 5 mins)
→ Verify OTP → View gallery (thumbnails from Box API, proxied via backend)
→ Click photo → Full-size from Box (proxied stream) → Click download:
  · 1 photo → Backend fetches original from Box → Sharp watermark → download JPEG
  · 2+ photos → download ZIP with watermark (Phase 2)
```

### Share Link — Detailed Auth Flow

```
                    ┌──────────────────────┐
                    │  Parent opens link   │
                    │  /s/{slug}           │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  GET /api/shares/slug│
                    │  → Album info        │
                    │  (name, photo count) │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Enter Email         │
                    │  POST .../otp        │
                    │  → Send OTP via email│
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │  Enter 6-digit OTP   │
                    │  POST .../verify     │
                    │  → Viewer JWT token  │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
    ┌─────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
    │  View original │ │  View thumb  │ │  Download    │
    │  GET .../file  │ │  GET .../    │ │  GET .../    │
    │  (full res)    │ │  thumbnail   │ │  download    │
    │                │ │              │ │  (watermarked)│
    └────────────────┘ └──────────────┘ └──────────────┘
```

---

## 🗄️ Database Schema

### Entity Relationship

```
User (Admin/Teacher)
  │
  ├── BoxConnection (1:1) [OAuth tokens]
  │
  └── Album (1:N)
        │
        ├── Image (1:N) [boxFileId → Box.com]
        │
        ├── Viewer (1:N) ── DownloadLog (1:N)
        │
        └── Otp (1:N) [temporary]
```

### Models

#### User — Admin/Teacher (created by Admin)

| Field | Type | Description |
|-------|------|--------|
| id | cuid | Primary key |
| email | String (unique) | Login email |
| name | String | Display name |
| passwordHash | String | bcrypt hash |
| role | ADMIN / TEACHER | Authorization role |
| isActive | Boolean | Can be disabled |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### Album — 1 album = 1 share link

| Field | Type | Description |
|-------|------|--------|
| id | cuid | Primary key |
| userId | FK → User | Creator |
| name | String | e.g. "Extracurricular Class 3A" |
| description | String? | Additional description |
| schoolName | String? | School name |
| className | String? | e.g. "Class 3A" |
| **boxFolderId** | **String?** | **Box folder ID for this album** |
| shareSlug | String? (unique) | Auto-generated when published, e.g. "Xk8mNp3r" |
| status | DRAFT / PUBLISHED / ARCHIVED | Status |
| expiresAt | DateTime? | null = no expiration |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### Image

| Field | Type | Description |
|-------|------|--------|
| id | cuid | Primary key |
| albumId | FK → Album | Belongs to which album |
| originalName | String | e.g. "DSC_0042.jpg" |
| **boxFileId** | **String** | **Box file ID (e.g. "123456789")** |
| width | Int | Pixel width |
| height | Int | Pixel height |
| fileSize | Int | Bytes |
| sortOrder | Int | Display order |
| createdAt | DateTime | |

#### BoxConnection — OAuth tokens for Box.com

| Field | Type | Description |
|-------|------|--------|
| id | cuid | Primary key |
| userId | FK → User | Which Admin connected |
| boxUserId | String | Box user ID |
| accessToken | String (encrypted) | Current access token |
| refreshToken | String (encrypted) | Refresh token |
| tokenExpiresAt | DateTime | When access token expires |
| rootFolderId | String | "0" or custom root folder |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### Otp — Temporary storage in DB

| Field | Type | Description |
|-------|------|--------|
| id | cuid | Primary key |
| email | String | Recipient email |
| code | String | "482916" (6 digits) |
| albumId | String | Scoped per album |
| attempts | Int | Max 5 attempts |
| expiresAt | DateTime | now + 5 mins |
| usedAt | DateTime? | Marked as used |
| createdAt | DateTime | |

#### Viewer — Who viewed the album

| Field | Type | Description |
|-------|------|--------|
| id | cuid | Primary key |
| albumId | FK → Album | Which album |
| email | String | Parent email |
| lastViewedAt | DateTime? | Last viewed time |
| viewCount | Int | Number of views |
| downloadCount | Int | Number of downloads |
| createdAt | DateTime | |
| updatedAt | DateTime | |
| **Unique** | (albumId, email) | 1 email / album |

#### DownloadLog — Audit trail for downloads

| Field | Type | Description |
|-------|------|--------|
| id | cuid | Primary key |
| viewerId | FK → Viewer | Who downloaded |
| imageId | String | Which image |
| watermarkText | String | e.g. "email@... · 16/04/2026" |
| ipAddress | String? | IP address |
| createdAt | DateTime | |

---

## 🔌 API Reference

### Auth (Admin)

| Method | Endpoint | Description | Auth |
|--------|----------|--------|------|
| `POST` | `/api/auth/login` | Login → JWT access + refresh | Public |
| `POST` | `/api/auth/users` | Admin creates teacher account | Admin |
| `GET` | `/api/auth/me` | Current user info | Admin |

### Box OAuth

| Method | Endpoint | Description | Auth |
|--------|----------|--------|------|
| `GET` | `/api/box/auth-url` | Redirect URL for Admin to connect Box | Admin |
| `GET` | `/api/box/callback` | OAuth callback, exchange code → tokens | Public |
| `GET` | `/api/box/status` | Check Box connection status | Admin |
| `DELETE` | `/api/box/disconnect` | Disconnect Box account | Admin |

### Albums

| Method | Endpoint | Description | Auth |
|--------|----------|--------|------|
| `GET` | `/api/albums` | List albums (pagination, search) | Admin |
| `POST` | `/api/albums` | Create album + create Box folder | Admin |
| `GET` | `/api/albums/:id` | Details + images + viewers | Admin |
| `PATCH` | `/api/albums/:id` | Update metadata | Admin |
| `POST` | `/api/albums/:id/publish` | Publish → auto-gen shareSlug | Admin |
| `POST` | `/api/albums/:id/archive` | Archive album | Admin |
| `DELETE` | `/api/albums/:id` | Hard delete album + Box folder + files | Admin |

### Images

| Method | Endpoint | Description | Auth |
|--------|----------|--------|------|
| `POST` | `/api/albums/:id/images` | Upload image → Box → save boxFileId | Admin |
| `DELETE` | `/api/images/:id` | Delete image on Box + DB record | Admin |
| `PATCH` | `/api/images/reorder` | Update sortOrder | Admin |
| `GET` | `/api/images/:id/file` | Proxy: get original image from Box → stream | Viewer |
| `GET` | `/api/images/:id/thumbnail` | Proxy: get thumbnail from Box API | Viewer |
| `GET` | `/api/images/:id/download` | Get original from Box → Sharp watermark → serve | Viewer |

### Share (Public — OTP flow)

| Method | Endpoint | Description | Auth |
|--------|----------|--------|------|
| `GET` | `/api/shares/:slug` | Album info (name, image count, active?) | Public |
| `POST` | `/api/shares/:slug/otp` | Request OTP → send email | Public |
| `POST` | `/api/shares/:slug/verify` | Verify OTP → viewer JWT | Public |
| `GET` | `/api/shares/:slug/gallery` | Album data + image list | Viewer |

---

## 🖼️ Image Processing (Box.com Version)

### Upload Pipeline

```
Input: raw file (JPEG/PNG, max 20MB) via multipart upload
  │
  ├─► 1. Validate file (type, size)
  ├─► 2. Upload original → Box folder (album.boxFolderId)
  │     via BoxService.uploadFile(folderId, fileName, stream)
  ├─► 3. Get file metadata from Box (id, size, dimensions)
  │
  └─► 4. DB: Insert Image record (boxFileId, width, height, fileSize)
```

> **Thumbnail:** Box auto-generates thumbnails via Thumbnail API.
> No need to use Sharp for thumbnails anymore — reduces CPU cost on upload.
> Gallery calls `GET /files/:boxFileId/thumbnail.jpg?max_height=320`
> → Box returns thumbnail ~20-40KB.
>
> **Note:** Box thumbnails max 320px (basic API). If larger is needed,
> use Representations API with `x-rep-hints: [jpg?dimensions=1024x1024]`.

### Download Watermark (Hybrid: Box + Sharp)

```
Input: boxFileId + viewer email
  │
  ├─► 1. Download original image from Box API
  │     GET /files/:boxFileId/content → stream
  ├─► 2. Generate SVG watermark text
  │     Content: "{email} · {dd/MM/yyyy}"
  │     Style: Georgia serif, opacity 20%, rotate -30°
  │     Layout: 3 text lines diagonally (40%, 55%, 70% height)
  ├─► 3. Sharp: composite SVG overlay onto image
  ├─► 4. Sharp: JPEG encode (quality: 88)
  ├─► 5. Response: Content-Disposition: attachment
  │
  └─► 6. DB: Log DownloadLog (viewerId, imageId, watermarkText)
```

> **Performance note:** Compared to v3 (local file), adds ~200-800ms
> for Box download. Total latency ~300ms-1.6s depending on file size.
> Use semaphore to limit MAX_CONCURRENT_WATERMARK=3 to prevent OOM.

### Watermark Specification

| Property | Value |
|------------|---------|
| Content | `{email} · {dd/MM/yyyy}` |
| Font | Georgia, serif |
| Opacity | 20% (rgba 255,255,255,0.2) |
| Layout | 3 text lines, positions: 40%, 55%, 70% height |
| Rotation angle | -30° around image center |
| Output | JPEG quality 88 |

---

## 🖥️ Frontend Pages

### Admin Pages

| Page | Route | Description |
|------|-------|--------|
| Login | `/login` | Email + password |
| Dashboard | `/admin` | Stats: total albums, images, views, downloads |
| Albums | `/admin/albums` | Grid/list albums + search + filter status |
| Create Album | `/admin/albums/new` | Creation form + image upload (drag-drop) |
| Album Detail | `/admin/albums/:id` | Images grid + share link + viewer stats |
| Users | `/admin/users` | Manage teachers (admin only) |
| **Settings** | **`/admin/settings`** | **Connect Box OAuth + connection status** |

### Public Pages (Share Link)

| Page | Route | Description |
|------|-------|--------|
| Share Entry | `/s/:slug` | Album info → enter email → OTP → verify |
| Gallery | `/s/:slug/gallery` | Image grid → lightbox view original → download |

### UI Wireframes

#### Admin — Album Detail
```
┌─────────────────────────────────────────────────────┐
│ ← Albums    Extracurricular Class 3A    [PUBLISHED] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  📸 Images (24)                    [+ Upload more]  │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│  │ img1 │ │ img2 │ │ img3 │ │ img4 │ │ img5 │       │
│  └──────┘ └──────┘ └──────┘ └──────┘ └──────┘       │
│                                                     │
│  🔗 Share Link                                      │
│  ┌─────────────────────────────────────────────┐    │
│  │ https://domain/s/Xk8mNp3r   [Copy] [QR]     │    │
│  │ Expires: 30/04/2026 · Views: 12 · Active ✅  │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  👥 Viewers (12)                                    │
│  ┌─────────────────────────────────────────────┐    │
│  │ Email              │ Views │ Downloads │         │
│  │ parent1@gmail.com  │   5   │     2     │         │
│  │ parent2@yahoo.com  │   3   │     0     │         │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

#### Parent — Share Link Flow (Mobile-first)
```
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐
│  📸 Secure Gallery│  │  📧 OTP Auth     │   │  🖼️ Gallery      │
│                  │   │                  │   │                  │
│  Extracurricular │   │  OTP sent to     │   │ ┌──────────────┐ │
│  Class 3A        │   │  pa***@gmail.com │   │ │  Full-size   │ │
│                  │   │                  │   │ │  Image       │ │
│  24 photos       │   │  ┌─┐┌─┐┌─┐┌─┐┌─┐┌─┐│ │ │  (original)  │ │
│                  │   │  │ ││ ││ ││ ││ ││ ││ │ └──────────────┘ │
│  Enter email:    │   │  └─┘└─┘└─┘└─┘└─┘└─┘│ │                  │
│  ┌──────────────┐│   │                  │   │  [⬇ Download]    │
│  │ email@...    ││   │  [Confirm]       │   │                  │
│  └──────────────┘│   │                  │   │  ┌──┐┌──┐┌──┐┌──┐│
│  [Continue →]    │   │  Resend (52s)    │   │  │t1││t2││t3││t4││
│                  │   │                  │   │  └──┘└──┘└──┘└──┘│
└──────────────────┘   └──────────────────┘   └──────────────────┘
   Step 1: Email          Step 2: OTP         Step 3: Gallery
```

---

## ⚙️ Configurable Limits (.env)

```bash
# === Server ===
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# === Database ===
DATABASE_URL=postgresql://user:pass@localhost:5432/secure_gallery

# === Auth ===
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@school.com
ADMIN_PASSWORD=changeme

# === Box.com ===
BOX_CLIENT_ID=your-box-client-id
BOX_CLIENT_SECRET=your-box-client-secret
BOX_REDIRECT_URI=http://localhost:3000/api/box/callback
BOX_ROOT_FOLDER_ID=0               # 0 = root, or specific folder ID
BOX_TOKEN_ENCRYPTION_KEY=32-char-encryption-key

# === Upload Limits (easily adjustable) ===
MAX_UPLOAD_SIZE_MB=20               # Max size per file (MB)
MAX_UPLOAD_FILES=50                 # Max files per upload request
JPEG_QUALITY_WATERMARK=88           # Watermarked download quality
MAX_CONCURRENT_WATERMARK=3          # Limit concurrent watermark jobs

# === OTP ===
OTP_TTL_MINUTES=5                   # OTP valid duration
OTP_MAX_ATTEMPTS=5                  # Max incorrect attempts
OTP_COOLDOWN_SECONDS=60             # Min gap between OTP requests

# === Email ===
MAIL_PROVIDER=ses                   # "ses" | "hubspot" | "smtp"
AWS_SES_REGION=ap-southeast-1
AWS_SES_ACCESS_KEY=...
AWS_SES_SECRET_KEY=...
MAIL_FROM=noreply@school.com

# === Share ===
SHARE_SLUG_LENGTH=8                 # URL slug length
# SHARE_DEFAULT_EXPIRY_DAYS=30      # Optional auto-expire
```

---

## 📁 Backend Structure

```
secure-gallery-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── common/
│   │   ├── config/app.config.ts        # .env validation (Joi / class-validator)
│   │   ├── guards/
│   │   │   ├── admin-auth.guard.ts     # Admin JWT guard
│   │   │   └── viewer-auth.guard.ts    # Viewer JWT guard
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── current-viewer.decorator.ts
│   │   └── utils/
│   │       ├── slug.util.ts            # Random slug generator
│   │       └── crypto.util.ts          # Token encryption/decryption
│   ├── prisma/
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── box/                            # ← NEW: Box.com integration
│   │   ├── box.module.ts
│   │   ├── box.controller.ts           # OAuth endpoints
│   │   ├── box.service.ts              # Box SDK wrapper, file ops
│   │   └── box-token.service.ts        # Token refresh, encryption
│   ├── album/
│   │   ├── album.module.ts
│   │   ├── album.controller.ts
│   │   └── album.service.ts            # Create album + Box folder
│   ├── image/
│   │   ├── image.module.ts
│   │   ├── image.controller.ts
│   │   ├── image.service.ts            # Upload/serve via BoxService
│   │   └── watermark.service.ts        # Sharp watermark (kept)
│   ├── share/
│   │   ├── share.module.ts
│   │   ├── share.controller.ts
│   │   └── share.service.ts
│   └── mail/
│       ├── mail.module.ts
│       └── mail.service.ts
├── prisma/
│   └── schema.prisma
├── .env.example
├── nest-cli.json
├── package.json
└── tsconfig.json
```

> **Note:** There is no longer an `uploads/` folder — all files are stored on Box.com.

## 📁 Frontend Structure

```
secure-gallery-web/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── router.tsx                      # React Router v7
│   ├── layouts/
│   │   ├── AdminLayout.tsx
│   │   └── PublicLayout.tsx
│   ├── pages/
│   │   ├── auth/Login.tsx
│   │   ├── admin/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Albums.tsx
│   │   │   ├── AlbumCreate.tsx
│   │   │   ├── AlbumDetail.tsx
│   │   │   ├── Settings.tsx            # Box OAuth connect
│   │   │   └── Users.tsx
│   │   └── share/
│   │       ├── ShareEntry.tsx          # Email + OTP
│   │       └── Gallery.tsx             # View + download
│   ├── components/
│   │   ├── ui/                         # Button, Input, Card, Modal...
│   │   ├── DropZone.tsx
│   │   ├── ImageGrid.tsx
│   │   ├── ImageViewer.tsx             # Lightbox
│   │   ├── OtpInput.tsx
│   │   └── DownloadButton.tsx
│   ├── hooks/
│   ├── services/api.ts
│   ├── stores/authStore.ts             # Zustand
│   └── styles/index.css
├── index.html
├── vite.config.ts
└── package.json
```

---

## 📅 Phased Roadmap

### Phase 1: Core MVP ← Implement immediately

| # | Task | Module | Estimate |
|---|------|--------|-----------|
| 1 | NestJS project init + Prisma + PostgreSQL | Infra | 0.5 day |
| 2 | Auth module: login + admin create user + seed | Auth | 0.5 day |
| 3 | **Box module: OAuth flow + token management** | **Box** | **1 day** |
| 4 | Album CRUD + publish (auto-gen shareSlug + Box folder) | Album | 1 day |
| 5 | Image upload: Multer → Box upload → save boxFileId | Image | 1 day |
| 6 | Image serve: proxy Box content + thumbnail | Image | 0.5 day |
| 7 | Share OTP flow: request → verify → viewer JWT | Share | 1 day |
| 8 | Email service: send OTP via SES/HubSpot | Mail | 0.5 day |
| 9 | Download watermark: Box download → Sharp → serve | Image | 0.5 day |
| 10 | Download audit log | Image | 0.5 day |
| 11 | Vite React project init + routing + design system | Frontend | 0.5 day |
| 12 | Admin login page | Frontend | 0.5 day |
| 13 | **Admin settings: Box connect UI** | **Frontend** | **0.5 day** |
| 14 | Admin dashboard + album list | Frontend | 1 day |
| 15 | Album create + image upload (drag-drop) | Frontend | 1.5 days |
| 16 | Album detail: images + share link + viewers | Frontend | 1 day |
| 17 | Share entry page: email + OTP flow | Frontend | 1 day |
| 18 | Gallery viewer: image grid + lightbox + download | Frontend | 1 day |
| | **Total Phase 1** | | **~13.5 days** |

### Phase 2: Polish & Expand

| Task | Description |
|------|--------|
| Batch ZIP download | 2+ images → ZIP with watermark (needs BullMQ + Redis) |
| Group share | Create parent email groups, restrict access by group |
| Image reorder | Drag-drop image reordering in an album |
| Viewer analytics | Who viewed, how many times, what device |
| Share link QR code | Generate QR code for share link |
| User management UI | Admin manages teacher accounts |
| OTP migrate to Redis | Migrate OTP storage to Redis (performance) |
| Watermark caching | Cache watermarked downloads for repeated requests |

### Phase 3: Production Ready

| Task | Description |
|------|--------|
| Docker Compose | BE + PostgreSQL containers |
| Rate limiting | Protect OTP + download endpoints |
| Email templates | Beautiful branded OTP email |
| Cron cleanup | Delete expired OTPs, archived albums |
| Monitoring | Health checks, error tracking |
| Box token health check | Auto-alert if refresh token is expiring soon |

---

## 📦 Box.com Integration — Detailed Analysis

> **Idea:** Use Box.com as the image storage layer. Admin connects Box account via OAuth.
> Preview images via Box. Watermarked downloads require a hybrid approach.

### Why Box.com?

| Benefit | Details |
|---------|----------|
| **No storage management** | Box Business offers unlimited storage, no disk/S3 costs |
| **Built-in preview** | Box Content Preview supports image zoom, rotate — no need to build |
| **Built-in thumbnails** | Box Representations API auto-generates multi-size thumbnails |
| **Built-in CDN** | Box serves files directly via CDN, no CloudFront/R2 setup |
| **Security layer** | Built-in watermark (see below), permissions, audit trail |
| **Official SDK** | `box-node-sdk` for Node.js, clear OAuth2 flow |

### Overall Architecture — Box.com Version

```
┌─────────────────────────────────────────────────────────────┐
│                     ADMIN (Teacher/School)                   │
│                                                             │
│  1. Connect Box (OAuth2)  →  Box Account linked             │
│  2. Create Album          →  Create Box Folder              │
│  3. Upload images         →  Upload to Box Folder           │
│     (via app or direct Box UI)                              │
│  4. Publish album         →  Generate share slug            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    OUR BACKEND (NestJS)                      │
│                                                             │
│  · Manage Album/Viewer/OTP/DownloadLog (PostgreSQL)         │
│  · Proxy Box API (using stored tokens)                      │
│  · Watermark on-download (Sharp or Box Watermark)           │
│  · BoxService: manage OAuth tokens, refresh, API calls      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    PARENT (Viewer)                           │
│                                                             │
│  · /s/{slug} → Email + OTP → Viewer JWT                     │
│  · Gallery: thumbnails from Box Thumbnail API               │
│  · Full view: original image from Box (expiring embed link) │
│  · Download: watermarked image (custom watermark by us)     │
└─────────────────────────────────────────────────────────────┘
```

### OAuth2 Flow — Admin connects Box

```
Admin clicks "Connect Box"
        │
        ▼
┌───────────────────────────────────────────────────┐
│  Redirect → Box Authorization URL                 │
│  https://account.box.com/api/oauth2/authorize     │
│  ?client_id=XXX                                   │
│  &redirect_uri=https://app/api/box/callback       │
│  &response_type=code                              │
└───────────────────┬───────────────────────────────┘
                    │ User authorizes in Box
                    ▼
┌───────────────────────────────────────────────────┐
│  Box redirects → /api/box/callback?code=XXX       │
│                                                   │
│  Backend exchanges code for:                      │
│  · access_token  (expires ~60 min)                │
│  · refresh_token (expires ~60 days, auto-rotate)  │
│                                                   │
│  Store tokens in DB (encrypted)                   │
│  → BoxConnection { userId, accessToken,           │
│     refreshToken, boxUserId, expiresAt }          │
└───────────────────────────────────────────────────┘
```

> **Important:** Free Developer Plan only supports OAuth2 (no JWT/CCG).
> Sufficient for MVP since only 1 admin account needs to connect.

### Box API Usage Map

| Feature | Box API | Endpoint |
|-----------|---------|----------|
| **Create folder (Album)** | Folders API | `POST /folders` |
| **Upload image** | Files API | `POST /files/content` |
| **List images in folder** | Folders API | `GET /folders/:id/items` |
| **Thumbnail** | Thumbnail API | `GET /files/:id/thumbnail.jpg` (32-320px) |
| **Large thumbnail** | Representations API | `x-rep-hints: [jpg?dimensions=1024x1024]` |
| **Preview embed** | Files API | `GET /files/:id?fields=expiring_embed_link` |
| **Original download** | Files API | `GET /files/:id/content` → 302 redirect to CDN |
| **Enable watermark** | Watermark API | `PUT /files/:id/watermark` |
| **Delete file** | Files API | `DELETE /files/:id` |
| **File metadata** | Files API | `GET /files/:id?fields=name,size,representations` |

### 🖼️ Preview Strategy — 3 Options

#### Option A: Box Expiring Embed Link (Simplest ✅ MVP)

```
Backend (proxy): GET /files/:id?fields=expiring_embed_link
                 → Return URL to Frontend

Frontend: <iframe src="{expiring_embed_link}" />
          or <img src="{expiring_embed_link}" />
```

- **Pros:** No file download needed, Box serves directly
- **Cons:** Link expires (usually ~1h), Box UI branding
- **UX:** If embedded in iframe → user sees Box viewer, not custom UI

#### Option B: Box Content Preview UI Element (Looks better)

```javascript
import { ContentPreview } from 'box-ui-elements';

<ContentPreview
  fileId={FILE_ID}
  token={DOWNSCOPED_TOKEN}  // Restricted permissions token
  hasHeader={false}         // Hide Box header
/>
```

- **Pros:** Rich viewer (zoom, rotate), customizable, hides Box branding
- **Cons:** Added `box-ui-elements` dependency (~large bundle), needs downscoped token
- **UX:** Better than Option A, but still a Box component

#### Option C: Custom Preview — Backend Proxy (Full control ✅ Recommended)

```
Frontend request → Backend proxy → Box API GET /files/:id/content
                                   → Stream image back → Response to Frontend

Gallery thumbnail: Backend → Box Thumbnail API → serve thumbnail
Full view: Backend → Box download API → proxy stream original image
```

- **Pros:** Full UI control, hides Box completely, custom lightbox
- **Cons:** Bandwidth routes through backend server (double-hop)
- **Performance:** For 2-5MB JPEG images, 200-500ms extra latency due to proxying
- **Workaround:** Could use Box `shared_link` + specific `vanity_url` per file → direct load

> **MVP Recommendation:** **Option C** (proxy) for thumbnails + lightbox.
> Keeps UX consistent, hides Box. Bandwidth for 20-50 thumbnails (20-40KB each)
> + occasional full-size viewing is acceptable.

### 💧 Watermark Strategy — Deep Dive

This is the most complex part. There are 3 approaches:

#### Strategy 1: Box Built-in Watermark

```
Enable watermark on folder/file → Box auto-overlays on preview
```

| Pros | Cons |
|----|-------|
| Zero effort, toggle on/off | Watermark content = viewer's Box email (or IP), NOT parent's email |
| Applied to automated preview | Custom text requires Enterprise Plus + Box Shield ($$$) |
| | Original download STILL lacks watermark (preview only) |
| | Cannot control watermark content |

> **Conclusion:** ❌ **Not suitable for MVP.**
> Box watermark uses Box account owner email, not parent email.
> We need watermark = `parent_email + download_date`.

#### Strategy 2: Hybrid — Custom Watermark by Our Backend (✅ Recommended)

```
Download request → Backend fetches original from Box
                → Sharp composites watermark (email + date)
                → Responds watermarked JPEG to parent

Essentially same as plan v3, just replacing "read from disk" with "read from Box API"
```

| Pros | Cons |
|----|-------|
| **Full control** over watermark content | CPU cost on backend server (Sharp processing) |
| Watermark = `{parent_email} · {date}` — meets requirements | Bandwidth: download from Box → process → serve to user |
| Independent of Box plan tier | Latency: ~1-3s extra for large files (download + process) |
| Can cache watermarked versions if needed | |

**Performance estimate:**

| Image size | Box download | Sharp process | Total | Memory |
|----------|-------------|---------------|-------|--------|
| 1 MB | ~200ms | ~100ms | ~300ms | ~30MB |
| 3 MB | ~400ms | ~300ms | ~700ms | ~80MB |
| 5 MB | ~600ms | ~500ms | ~1.1s | ~120MB |
| 10 MB | ~800ms | ~800ms | ~1.6s | ~200MB |

> With concurrent downloads (5 users simultaneously, 5MB image):
> ~600MB peak RAM. Need to restrict concurrency or queue.

**Optimization strategies:**
1. **Limit concurrent downloads:** Semaphore (max 3-5 concurrent watermark jobs)
2. **Stream processing:** Pipe Box download → Sharp → Response (no full buffering)
3. **Resize before watermark:** If original > 2048px, resize first → reduces memory
4. **Pre-generate (Phase 2):** BullMQ job pre-renders watermarked versions → cache

#### Strategy 3: Pre-generate + Store on Box (Phase 2+)

```
Upload → Save original on Box
      → Background job: generate watermarked version
      → Upload watermarked version to Box (different folder)
      → Download = serve watermarked version directly from Box
```

- **Pros:** Instant download, no real-time processing
- **Cons:** Each viewer has a different watermark (different emails)
  → Cannot pre-generate for ALL viewers
  → Only useful if watermark DOES NOT contain viewer-specific info

> **Conclusion:** ❌ Cannot be applied because watermark requires individual parent emails.

### Schema Changes — Box.com Version

#### BoxConnection — Store OAuth tokens

| Field | Type | Description |
|-------|------|--------|
| id | cuid | Primary key |
| userId | FK → User | Which Admin connected |
| boxUserId | String | Box user ID |
| accessToken | String (encrypted) | Current access token |
| refreshToken | String (encrypted) | Refresh token |
| tokenExpiresAt | DateTime | When access token expires |
| rootFolderId | String | "0" or custom root folder |
| createdAt | DateTime | |
| updatedAt | DateTime | |

#### Image — Field Changes

```diff
  Image {
    id          cuid
    albumId     FK → Album
    originalName String          // "DSC_0042.jpg"
-   storagePath  String          // "originals/{albumId}/{id}.jpg"
-   thumbnailPath String         // "thumbnails/{albumId}/{id}.jpg"
+   boxFileId    String          // Box file ID (e.g. "123456789")
+   boxFolderId  String          // Box folder ID (album folder)
    width       Int
    height      Int
    fileSize    Int
    sortOrder   Int
    createdAt   DateTime
  }
```

#### Album — Add Box folder reference

```diff
  Album {
    ...existing fields...
+   boxFolderId  String?         // Box folder ID for this album
  }
```

### API Changes — Box.com Version

#### Add Box OAuth endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|--------|------|
| `GET` | `/api/box/auth-url` | Redirect URL for Admin to connect Box | Admin |
| `GET` | `/api/box/callback` | OAuth callback, exchange code → tokens | Admin |
| `GET` | `/api/box/status` | Check Box connection status | Admin |
| `DELETE` | `/api/box/disconnect` | Disconnect Box account | Admin |

#### Images — Endpoint Changes

| Method | Endpoint | Change |
|--------|----------|----------|
| `POST /api/albums/:id/images` | Upload: receive file → upload to Box → save boxFileId to DB |
| `GET /api/images/:id/file` | Proxy: get file from Box API → stream to client |
| `GET /api/images/:id/thumbnail` | Proxy: get thumbnail from Box Thumbnail API |
| `GET /api/images/:id/download` | Get original from Box → Sharp watermark → serve |
| `DELETE /api/images/:id` | Delete file on Box + delete DB record |

### Backend Structure — Add Box module

```
src/
├── box/
│   ├── box.module.ts
│   ├── box.controller.ts        # OAuth endpoints
│   ├── box.service.ts           # Box SDK wrapper, token management
│   └── box-token.service.ts     # Token refresh, encryption
├── image/
│   ├── image.service.ts         # Changed: use BoxService instead of local disk
│   └── watermark.service.ts     # Unchanged — still uses Sharp
```

### Configurable (.env) — Add Box config

```bash
# === Box.com ===
BOX_CLIENT_ID=your-box-client-id
BOX_CLIENT_SECRET=your-box-client-secret
BOX_REDIRECT_URI=http://localhost:3000/api/box/callback
BOX_ROOT_FOLDER_ID=0               # 0 = root, or specific folder ID

# === Download Watermark (unchanged) ===
JPEG_QUALITY_WATERMARK=88
MAX_CONCURRENT_WATERMARK=3          # Limit concurrent watermark jobs
```

### Box.com — Pricing & Limits Notes

| Item | Free Developer | Business ($15/user/mo) |
|----------|---------------|----------------------|
| Storage | 10 GB | Unlimited |
| File upload limit | 250 MB | 5 GB |
| Auth methods | OAuth2 only | OAuth2, JWT, CCG |
| API rate limit | ~1000 req/min/user | ~1000 req/min/user |
| Bandwidth (downloads) | 10 GB/month | 2 TB/month |
| Custom watermark | ❌ | ❌ (requires Enterprise Plus) |
| Thumbnail API | ✅ | ✅ |
| Preview embed | ✅ | ✅ |

> **MVP:** Free Developer Plan is sufficient for dev/test (10GB, OAuth2).
> **Production:** Requires Business plan for unlimited storage + bandwidth.
> Box's custom watermark requires Enterprise Plus — but we do not use it, we self-watermark via Sharp.

### Comparison: Local Storage vs Box.com

| Criteria | Local/S3 (Plan v3) | Box.com (Plan v4) |
|----------|--------------------|--------------------|
| **Setup complexity** | Simple — save file to disk/S3 | More complex — OAuth flow, token management |
| **Storage cost** | Depends on S3/disk | Box plan ($15/user/mo minimum for prod) |
| **Preview** | Self-build (serve static) | Box can serve, or proxy |
| **Thumbnail** | Self-generate (Sharp) | Box auto-generates |
| **CDN** | Needs separate setup | Built-in by Box |
| **Watermark download** | Sharp process (local file) | Sharp process (download from Box → process) |
| **Watermark latency** | ~100-500ms (fast local I/O) | ~300-1600ms (extra network hop) |
| **Scalability** | Needs separate storage scaling | Box scales for us |
| **Admin UX** | App upload only | Can upload via Box UI + app |
| **Backup** | Self-managed | Managed by Box |
| **Vendor lock-in** | Low | Medium (depends on Box API) |

### Conclusion & Proposal

**Box.com is viable** for this use-case, provided that:

1. **Preview/Thumbnail:** ✅ Highly feasible — use Box Thumbnail API + proxy via backend
2. **Storage:** ✅ Excellent — unlimited storage on Business plan, no disk management
3. **Download watermark:** ⚠️ **Feasible but be mindful of performance:**
   - Must download file from Box → process with Sharp → serve to user
   - Latency increases by 200-800ms vs local file
   - Higher memory usage for concurrent downloads
   - **Solution:** Stream processing + concurrency limits + resize before watermark

**Recommended approach for MVP:**

| Component | Strategy |
|-----------|----------|
| Storage | Box.com (1 shared admin account, OAuth2) |
| Thumbnails | Box Thumbnail API → proxy via backend |
| Full preview | Box download → proxy stream → custom lightbox |
| Download watermark | Box download → Sharp watermark → serve (hybrid) |
| Admin upload | Upload via app → app uploads to Box via API |

> **Bottom line:** For watermarks, we CANNOT use Box's built-in watermark (because content isn't customizable on lower tiers + doesn't show parent email). We must self-watermark via Sharp — exactly like plan v3, the only difference is the file source is Box instead of local disk. Extra performance overhead of 200-800ms is acceptable for MVP.

---

## ✅ Verification Checklist

| Test | How to verify |
|------|------------|
| Box OAuth | Admin connects Box → verify token is stored → test token refresh |
| Upload to Box | Upload image → verify file appears in Box folder + DB record |
| Thumbnail | Load Gallery → verify thumbnail from Box API displays correctly |
| Full preview | Click image → verify full-size loads via proxy |
| OTP | Request OTP → receive email → verify code → receive JWT |
| Download watermark | Download → verify watermark text overlays on image (latency < 3s) |
| Audit | Check DownloadLog record in DB after downloading |
| Expiry | Set OTP TTL = 1 min → verify rejection after expiration |
| Concurrent download | 5 concurrent downloads → verify server doesn't crash, memory is stable |
| Token refresh | Simulate expired token → verify auto-refresh works |
| Mobile | Test gallery + download on Safari iOS + Chrome Android |

---

*Plan version: v4 · Updated: 16/04/2026*
