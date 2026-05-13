## Context

The "Add School" UI form currently has an alignment/spacing issue where labels and inputs lack proper vertical spacing. Additionally, the Box Parent Folder ID field uses a basic text input, which provides poor user experience as it requires users to manually copy/paste an ID. The existing `BoxFolderBrowser` component is already implemented in the application and handles Box folder selection seamlessly.

## Goals / Non-Goals

**Goals:**
- Fix the CSS spacing in the `SchoolFormSheet` so labels and inputs are properly separated visually.
- Enhance the Parent Box Folder ID input to use the `BoxFolderBrowser` popup component.
- Display the selected folder name to the user.
- Ensure the selected folder ID correctly updates the form data for submission.

**Non-Goals:**
- We are not refactoring the `SchoolFormSheet` form state management (it continues to use `react-hook-form` and `zod`).
- We are not altering the overall Box integration flow or creating new endpoints.

## Decisions

- **Layout Fix**: Replace the `space-y-2` Tailwind utility on form control wrappers with `flex flex-col gap-2`. This ensures that regardless of inline/block display styles on `<Label>`, the margin between the label and input will be consistent.
- **Box Folder Selection**:
  - Replace the `<Input>` for the Box Folder with a `<Button>` that triggers state `isFolderBrowserOpen`.
  - Introduce local states `isFolderBrowserOpen` (boolean) and `selectedFolderName` (string).
  - Use `useFormContext` or the existing `setValue` from `useForm` to programmatically update the form's `parentBoxFolderId` when a selection is confirmed.
  - Pass `foldersOnly={true}` to `BoxFolderBrowser` to ensure only folders can be selected, as the school requires a Parent Folder.

## Risks / Trade-offs

- **Risk**: Since `selectedFolderName` is managed locally in state rather than in `react-hook-form`, if the form resets (e.g. when reopening for a new school), we must ensure `selectedFolderName` also resets to an empty string to avoid showing stale data.
- **Trade-off**: Managing `selectedFolderName` as local state introduces a slight drift from having all form state strictly in `react-hook-form`, but since we don't submit the name, only the ID, local state is sufficient and simple.
