# UX Flow — Admin/Teacher Portal

> For roles: ADMIN, TEACHER
> URL prefix: `/admin/*`

---

## Sidebar Navigation

### Admin views:
```
├── 📊 Dashboard
├── 🏫 Schools
├── 👥 Users
├── ⚙️ Box Settings
└── 📋 Audit Logs
```

### Teacher views:
```
├── 📊 Dashboard
├── 📚 My Classes
└── 🔑 Change Password
```

Teachers do not see: Schools, Users, Box Settings, Audit Logs.

---

## Route Map

| Route | Component | Roles | Description |
|-------|-----------|-------|--------|
| `/admin` | Dashboard | ALL | Stats overview |
| `/admin/schools` | SchoolList | ADMIN | School list |
| `/admin/schools/:id` | SchoolDetail | ADMIN | School details + class list |
| `/admin/classes/:id` | ClassDetail | ADMIN, TEACHER | Class details (tabs: Students, Albums, Teachers) |
| `/admin/classes/:id/students/:studentId` | StudentDetail | ADMIN, TEACHER | Student details + protectors |
| `/admin/classes/:id/albums/:albumId` | AlbumDetail | ADMIN, TEACHER | Album details + image management |
| `/admin/users` | UserList | ADMIN | User management |
| `/admin/users/:id` | UserDetail | ADMIN | User details |
| `/admin/settings/box` | BoxSettings | ADMIN | Box.com connection |
| `/admin/audit` | AuditLogs | ADMIN | View audit logs |
| `/admin/my-classes` | MyClasses | TEACHER | List of classes taught by the teacher |

---

## Screen Details

### 1. Dashboard (`/admin`)

**Stats cards (top row):**
- Total schools (Admin only)
- Total classes (Teacher: only their own classes)
- Total students
- Total albums

**Recent Activity (bottom section):**
- List of recent activities from audit logs
- Displays: user, action, target, time ago
- Admin: all activity
- Teacher: activity within their classes

**API calls:**
- Stats: Aggregate from list endpoints (or create a dedicated backend endpoint if needed)
- Activity: `GET /api/audit/logs?limit=10` (Admin only — Teacher can skip this part)

---

### 2. Schools List (`/admin/schools`) — Admin only

**Layout:** Table view with search + pagination

**Columns:** Name, Address, Phone, Classes Count, Created Date, Actions

**Actions:** 
- Create School (top-right button → modal or drawer)
- Edit (inline action)
- Delete (confirm dialog)

**Click row** → navigate to `/admin/schools/:id`

**API:** `GET /api/schools`, `POST /api/schools`, `PUT /api/schools/:id`, `DELETE /api/schools/:id`

---

### 3. School Detail (`/admin/schools/:id`) — Admin only

**Header:** School name, address, phone (inline editable or edit button)

**Content:** List of Classes belonging to this school

**Classes table columns:** Name, Grade, Academic Year, Students Count, Teachers, Actions

**Actions:**
- Create Class (button)
- Click row → navigate to `/admin/classes/:id`

**Breadcrumb:** Schools > [School Name]

**API:** `GET /api/schools/:id`, `GET /api/schools/:schoolId/classes`, `POST /api/schools/:schoolId/classes`

---

### 4. My Classes (`/admin/my-classes`) — Teacher only

**Layout:** Card grid (each card = 1 class)

**Card displays:** Class name, grade, school name, student count

**Click card** → navigate to `/admin/classes/:id`

**API:** `GET /api/schools/:schoolId/classes` (backend auto-filters by teacher)

> Note: Teachers need to know the schoolId. Can be retrieved from `GET /api/auth/me` 
> if backend returns school info, or list all schools then 
> fetch classes for each school. Need to check backend response format.

---

### 5. Class Detail (`/admin/classes/:id`)

**Header:** Class name, grade, academic year, school name

**Tab navigation:**
```
[Students] [Albums] [Teachers]
```

**Tab: Students**
- Table: Student Code, Name, DOB, Box Folder Status, Actions
- Search bar
- Filter: Active/Inactive
- Pagination
- Actions: Add Student, Edit, Delete (Admin), Transfer (Admin)
- Click row → `/admin/classes/:id/students/:studentId`

**Tab: Albums**
- Card grid: Album name, status badge (DRAFT/PUBLISHED/ARCHIVED), image count, created date
- Filter by status
- Actions: Create Album (Admin), Click card → `/admin/classes/:id/albums/:albumId`

**Tab: Teachers** (Admin only)
- List of assigned teachers
- Add/Remove teacher

**Breadcrumb:** 
- Admin: Schools > [School] > [Class]
- Teacher: My Classes > [Class]

**API:**
- `GET /api/classes/:id`
- `GET /api/classes/:classId/students`
- `GET /api/classes/:classId/albums`
- `POST /api/classes/:id/teachers`, `DELETE /api/classes/:id/teachers/:userId`

---

### 6. Student Detail (`/admin/classes/:id/students/:studentId`)

**Header:** Student name, code, class, DOB

**Sections:**

**Info card:** Basic info, Box folder sync status, folder links

**Protectors section:**
- Table: Protector name, email, relationship, actions
- Add protector button (search existing user or create new)
- Remove protector

**Transfer History:** (Admin only)
- Timeline: from class → to class, date, type

**Breadcrumb:** ... > [Class] > [Student Name]

**API:**
- `GET /api/students/:id`
- `GET /api/students/:id/protectors`
- `POST /api/students/:id/protectors`
- `DELETE /api/students/:id/protectors/:protectorId`

---

### 7. Album Detail (`/admin/classes/:id/albums/:albumId`)

**Header:** Album name, status badge, description, created by, date

**Action bar:**
- Publish (DRAFT → PUBLISHED) — Admin only
- Archive (PUBLISHED → ARCHIVED) — Admin only
- Edit details — Admin only
- Upload images — Admin + Teacher (only if DRAFT)
- Download ZIP

**Image grid:**
- Even grid (4 columns desktop, 2 mobile)
- Each cell: thumbnail, filename, size
- Click → lightbox preview
- Select multiple → bulk delete / bulk download ZIP
- Drag & drop upload zone (if DRAFT)

**Download logs section:** (Admin only)
- Table: User, images downloaded, date, IP

**Breadcrumb:** ... > [Class] > Albums > [Album Name]

**API:**
- `GET /api/albums/:id`
- `POST /api/albums/:id/images` (multipart upload)
- `DELETE /api/album-images/:id`
- `GET /api/album-images/:id/thumbnail`
- `GET /api/album-images/:id/preview`
- `POST /api/albums/:id/publish`
- `POST /api/albums/:id/archive`
- `GET /api/audit/download-logs/album/:albumId`

---

### 8. Users Management (`/admin/users`) — Admin only

**Layout:** Table with search + role filter + active filter

**Columns:** Name, Email, Role (badge), Status (active/inactive), Created Date, Actions

**Actions:**
- Create User (modal: name, email, role, auto-generated password)
- Edit User
- Deactivate/Activate toggle
- Regenerate Password
- Delete

**API:** Full CRUD via `/api/users`

---

### 9. Box Settings (`/admin/settings/box`) — Admin only

**Connected state:**
- Status badge: Connected ✅
- Box User ID
- Token expires at
- Disconnect button (confirm dialog)
- Folder browser (tree view browsing Box folders)

**Disconnected state:**
- Status badge: Not Connected ❌
- "Connect to Box" button → opens Box OAuth URL in new window
- Poll `/api/box/status` until connected

**API:** `GET /api/box/status`, `GET /api/box/auth-url`, `DELETE /api/box/disconnect`, `GET /api/box/folders/:folderId/items`

---

### 10. Audit Logs (`/admin/audit`) — Admin only

**Layout:** Table with filters

**Filters:** Log type, user, date range

**Columns:** Timestamp, User, Action Type, Target, IP, Details (expandable)

**API:** `GET /api/audit/logs`
