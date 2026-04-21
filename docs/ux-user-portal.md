# UX Flow — User Portal (Student/Protector)

> For roles: STUDENT, PROTECTOR
> URL prefix: `/portal/*`
> Design: Mobile-first, no sidebar, top navigation

---

## Navigation (Top Bar)

```
[Logo/App Name]                    [Profile ▼]
                                     ├── My Profile
                                     ├── Change Password
                                     └── Logout
```

No sidebar. Simple navigation via breadcrumbs and back buttons.

---

## Route Map

| Route | Component | Roles | Description |
|-------|-----------|-------|--------|
| `/portal` | PortalHome | ALL | Landing — redirect based on role |
| `/portal/students` | MyStudents | PROTECTOR | List of children |
| `/portal/students/:id` | StudentView | ALL | View student information |
| `/portal/students/:id/albums` | StudentAlbums | ALL | Albums of the student's class |
| `/portal/students/:id/albums/:albumId` | AlbumView | ALL | View album + gallery |
| `/portal/students/:id/folders` | StudentFolders | ALL | Student's Box folders |
| `/portal/profile` | MyProfile | ALL | View/edit personal info |
| `/portal/change-password` | ChangePassword | ALL | Change password |

---

## Flow by Role

### Protector Flow
```
Login → /portal → redirect /portal/students (list of children)
                      │
                      ├── Select student → /portal/students/:id
                      │                       │
                      │                       ├── [Albums tab] → Album list → Album detail → Gallery
                      │                       ├── [Folders tab] → Box folder browser
                      │                       └── [Info tab] → Basic student info
                      │
                      └── Profile menu → My Profile / Change Password / Logout
```

### Student Flow
```
Login → /portal → redirect /portal/students/:myId (auto-select self)
                      │
                      ├── [Albums tab] → Album list → Album detail → Gallery
                      ├── [Folders tab] → Box folder browser
                      └── [Info tab] → Basic info (class, school)
                      
                      Profile menu → My Profile / Change Password / Logout
```

Students automatically skip the "select student" step since they only have 1 profile.

---

## Screen Details

### 1. Portal Home (`/portal`)

No dedicated UI — just redirect logic:
- PROTECTOR → `/portal/students`
- STUDENT → `/portal/students/:myStudentProfileId`

Get `studentProfileId` from `GET /api/auth/me` response.

---

### 2. My Students (`/portal/students`) — Protector only

**Layout:** Card list (mobile-friendly)

**Each card:**
- Avatar placeholder (initials)
- Student name
- Student code
- Class name + School name
- Relationship badge (Father/Mother/Guardian)

**Click card** → `/portal/students/:id`

**API:** `GET /api/protectors/my-students`

**Empty state:** "You have not been assigned as a protector for any student yet."

---

### 3. Student View (`/portal/students/:id`)

**Header:** Student name, code, class, school (basic info)

**Tab navigation:**
```
[📸 Albums] [📁 Folders] [ℹ️ Info]
```

**Tab: Albums**
- Card grid (2 columns mobile, 4 desktop) showing PUBLISHED albums only
- Each card: Album name, image count, date
- Filter by status (PUBLISHED only visible)
- Click → `/portal/students/:id/albums/:albumId`

**Tab: Folders**
- Browse student's Box folders (Subjects, Grades, Activities)
- File list with thumbnails
- Download button per file

**Tab: Info**
- Student code
- Full name
- Date of birth
- Class name
- School name
- (Read-only for both Student and Protector)

**API:**
- `GET /api/students/:id`
- `GET /api/classes/:classId/albums` (filtered by PUBLISHED)
- Box folder browsing: TBD (may need student-specific endpoint)

---

### 4. Album View (`/portal/students/:id/albums/:albumId`)

**Header:** Album name, description, class name, created date

**Image Gallery:**
- Even grid layout (2 columns mobile, 4 columns desktop)
- Each cell: thumbnail image
- Click thumbnail → Lightbox overlay

**Lightbox:**
- Full-size image preview (no watermark in preview)
- Navigation arrows (prev/next)
- Download button (triggers watermarked download)
- Close button
- Swipe gesture support (mobile)

**Bulk actions:**
- "Download All" button → POST download-zip (watermarked)
- Select multiple → Download selected as ZIP

**Watermark notice:**
- Small info banner: "Downloaded images will contain a watermark"

**API:**
- `GET /api/albums/:id` (includes images list)
- `GET /api/album-images/:id/thumbnail` (grid display)
- `GET /api/album-images/:id/preview` (lightbox)
- `GET /api/album-images/:id/download` (single watermarked download)
- `POST /api/albums/:id/download-zip` (bulk watermarked download)

---

### 5. Student Folders (`/portal/students/:id/folders`)

**Layout:** File browser

**Root shows 3 folders:**
```
📁 Subjects
📁 Grades  
📁 Activities
```

**Click folder** → shows contents from Box API

**File list:**
- Icon (folder/file type)
- Name
- Size
- Modified date
- Download button (for files)

**Navigation:** Breadcrumb within folder hierarchy

**API:**
- Student profile has `boxSubjectsFolderId`, `boxGradesFolderId`, `boxActivitiesFolderId`
- Browse via Box API endpoint (need to verify appropriate endpoint for non-admin roles)

> ⚠️ **Note:** Currently `GET /api/box/folders/:folderId/items` is for ADMIN only.
> Need to add a backend endpoint for Student/Protector to browse folders,
> or expand roles for the existing endpoint.

---

### 6. My Profile (`/portal/profile`)

**Display:**
- Name
- Email
- Role badge
- School + Class info (if Student)
- Assigned students list (if Protector)

**Actions:**
- Change Password link → `/portal/change-password`

**API:** `GET /api/auth/me`

---

### 7. Change Password (`/portal/change-password`)

**Form fields:**
- Current Password (if any — for password-based accounts)
- New Password
- Confirm New Password

**Flow:**
1. User enters new password
2. Call `POST /api/auth/password-change-request` (sends OTP)
3. **SKIP this step** (per requirement to avoid emails)
4. Call `PUT /api/auth/password-change` with OTP + new password

> ⚠️ **Note:** Backend requires OTP to change password, and OTP is sent via email.
> If avoiding email → backend needs to support changing password directly 
> (verify old password instead of OTP). Or temporarily hide this feature.

---

## Shared Folders

> Prisma schema has `SharedFolder` model with SCHOOL or CLASS scope.
> But no controller/endpoint for shared folders has been found yet.
> Need to check if the backend has an endpoint.

If available, display in Student View:
```
Expanded tab navigation:
[📸 Albums] [📁 My Folders] [📂 Shared] [ℹ️ Info]
```

**Shared tab:**
- List shared folders (school-level + class-level)
- Browse contents via Box API

---

## Design Principles

1. **Mobile-first**: Protectors primarily use phones
2. **Minimal navigation**: No sidebar, use breadcrumb + back button
3. **Focus on content**: Albums and images are the centerpiece
4. **Clear download UX**: Prominent watermark notice, clear download buttons
5. **Fast thumbnails**: Lazy load grid, skeleton loading states
6. **Touch-friendly**: Tap targets >= 44px, swipe gestures in lightbox
