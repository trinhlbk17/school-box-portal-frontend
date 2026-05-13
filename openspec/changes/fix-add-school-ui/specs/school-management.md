## CHANGED Requirements

### Requirement: School Parent Box Folder Selection
The application MUST allow users to select a Parent Box Folder visually rather than entering raw text IDs.

#### Scenario: User clicks to select Box Folder
- **WHEN** the user is creating a new school and clicks the "Select Box Folder" button
- **THEN** the application MUST open the `BoxFolderBrowser` component
- **AND** the browser MUST be restricted to folder selection only.

#### Scenario: User confirms Box Folder selection
- **WHEN** the user selects a Box Folder and confirms
- **THEN** the application MUST display the selected folder's name on the selection button
- **AND** the application MUST update the internal form state with the selected folder's ID.
