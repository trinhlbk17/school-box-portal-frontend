## Why

The current UI for the "Add School" popup (`SchoolFormSheet.tsx`) has two main usability issues:
1. **Missing Spacing/Margins**: The input fields and labels lack proper vertical spacing between them, making the form look cluttered and difficult to read. The `space-y-2` Tailwind class isn't functioning effectively for the current form layout structure.
2. **Poor User Experience for Box Folder Selection**: The "Parent Box Folder ID" field currently requires the user to manually input the Box Folder ID. This is error-prone and not user-friendly. Users need an intuitive way to visually browse and select the Box Folder, similarly to how it works elsewhere in the application.

## What Changes

- Update the layout CSS of the `SchoolFormSheet` inputs and labels from `space-y-2` to `flex flex-col gap-2` (or `grid gap-2`) to ensure consistent margin rendering.
- Replace the `Parent Box Folder ID` manual text input with a `Button` that triggers a "Select Box Folder" popup.
- Integrate the existing `BoxFolderBrowser` component so the user can browse Box folders and select one directly.
- Display the selected folder name on the `Button` after a selection is made, and map the selected folder ID into the underlying `react-hook-form` state.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `school-management`: Enhanced the "Add School" UI to use visual Box Folder selection rather than raw ID input, and corrected layout styling.

## Impact

- `src/features/school/components/SchoolFormSheet.tsx`: Updated to import and use `BoxFolderBrowser`, added states for folder browser visibility and selected folder name, updated layout classes.
