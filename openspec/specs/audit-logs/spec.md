## ADDED Requirements

### Requirement: Admin can view paginated audit logs
The system SHALL display a paginated table of audit logs with columns: Timestamp, User, Action Type (badge), Target, and Details. The system SHALL support pagination with configurable page size.

#### Scenario: Default audit log load
- **WHEN** admin navigates to `/admin/audit`
- **THEN** the system SHALL display audit logs sorted by newest first, paginated at 10 per page

---

### Requirement: Admin can filter audit logs by type
The system SHALL provide a dropdown filter for log type with options: LOGIN, FILE_VIEW, FILE_UPLOAD, FILE_DOWNLOAD, ALBUM_DOWNLOAD, CLASS_TRANSFER, CLASS_PROMOTION, and "All" (no filter).

#### Scenario: Filter by log type
- **WHEN** admin selects "FILE_DOWNLOAD" from the log type filter
- **THEN** the system SHALL show only logs with logType FILE_DOWNLOAD

---

### Requirement: Admin can filter audit logs by user
The system SHALL provide a text input to filter logs by user ID.

#### Scenario: Filter by user
- **WHEN** admin enters a user ID in the user filter input
- **THEN** the system SHALL show only logs for that specific user

---

### Requirement: Admin can filter audit logs by date range
The system SHALL provide "From" and "To" date inputs to filter logs within a date range.

#### Scenario: Filter by date range
- **WHEN** admin selects a from date of 2026-01-01 and a to date of 2026-01-31
- **THEN** the system SHALL show only logs within that date range

#### Scenario: Filter with only from date
- **WHEN** admin selects only a from date
- **THEN** the system SHALL show all logs from that date onwards

---

### Requirement: Admin can view album download logs
The system SHALL provide a hook for fetching album-specific download logs via `GET /audit/download-logs/album/:albumId`, to be used in the AlbumDetailPage.

#### Scenario: View album download logs
- **WHEN** the AlbumDetailPage renders the download logs section
- **THEN** the system SHALL fetch and display download logs for that specific album, paginated
