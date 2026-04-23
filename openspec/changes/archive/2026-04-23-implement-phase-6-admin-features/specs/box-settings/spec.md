## ADDED Requirements

### Requirement: Admin can view Box connection status
The system SHALL display the current Box.com connection status on the Box Settings page. When connected, the system SHALL show: status badge "Connected", Box User ID, and token expiry date. When disconnected, the system SHALL show: status badge "Not Connected" and a "Connect to Box" button.

#### Scenario: View connected status
- **WHEN** admin navigates to `/admin/settings/box` and Box is connected
- **THEN** the system SHALL display connected status with Box User ID and token expiry

#### Scenario: View disconnected status
- **WHEN** admin navigates to `/admin/settings/box` and Box is not connected
- **THEN** the system SHALL display disconnected status with a "Connect to Box" button

---

### Requirement: Admin can connect to Box via OAuth redirect
The system SHALL initiate the Box OAuth flow by redirecting the browser to the Box authorization URL. After successful authorization, the backend callback SHALL redirect back to `/admin/settings/box?box_connected=true`. The frontend SHALL detect this query param and show a success toast.

#### Scenario: Successful OAuth connection
- **WHEN** admin clicks "Connect to Box"
- **THEN** the system SHALL call `GET /box/auth-url`, redirect the browser to the returned URL
- **AND** after Box authorization, the backend SHALL redirect to `/admin/settings/box?box_connected=true`
- **AND** the system SHALL show a success toast and display connected status

---

### Requirement: Admin can disconnect from Box
The system SHALL provide a "Disconnect" button with a confirmation dialog when Box is connected.

#### Scenario: Disconnect from Box
- **WHEN** admin clicks "Disconnect" and confirms
- **THEN** the system SHALL call `DELETE /box/disconnect` and update the page to show disconnected status

---

### Requirement: Admin can browse Box folders and files
The system SHALL provide a dialog for browsing Box.com folders using breadcrumb navigation. Each folder click SHALL load its contents via `GET /box/folders/:folderId/items`. Items SHALL display an icon based on type (file/folder) and extension. The root folder SHALL use `folderId = "0"`.

#### Scenario: Open folder browser
- **WHEN** admin clicks "Browse Files" on the Box Settings page
- **THEN** the system SHALL open a dialog showing the root folder contents with a breadcrumb showing "Root"

#### Scenario: Navigate into a folder
- **WHEN** admin clicks on a folder item
- **THEN** the system SHALL load the folder's contents and add the folder to the breadcrumb trail

#### Scenario: Navigate back via breadcrumb
- **WHEN** admin clicks on a breadcrumb segment
- **THEN** the system SHALL navigate to that folder and truncate the breadcrumb to that level

---

### Requirement: Admin can select a file or folder from the browser
The system SHALL allow selecting a single file or folder. Upon selection, the dialog SHALL return the selected item's `boxFolderId` or `boxFileId`, name, and type to the parent component via an `onSelect` callback.

#### Scenario: Select a folder
- **WHEN** admin clicks the select button on a folder item
- **THEN** the dialog SHALL close and return `{ id, name, type: "folder" }`

#### Scenario: Select a file
- **WHEN** admin clicks the select button on a file item
- **THEN** the dialog SHALL close and return `{ id, name, type: "file" }`
