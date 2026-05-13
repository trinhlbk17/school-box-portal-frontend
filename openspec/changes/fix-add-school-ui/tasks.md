## 1. UI CSS Refactoring

- [x] 1.1 In `SchoolFormSheet.tsx`, replace `<div className="space-y-2">` wrappers with `<div className="flex flex-col gap-2">` for all form fields to ensure consistent margin spacing.

## 2. Box Folder Selection Component Integration

- [x] 2.1 Import the `BoxFolderBrowser` component into `SchoolFormSheet.tsx`.
- [x] 2.2 Add local state `isFolderBrowserOpen` (boolean) and `selectedFolderName` (string).
- [x] 2.3 Extract the `setValue` method from `useForm` initialization.
- [x] 2.4 Replace the text `<Input>` for "Parent Box Folder ID" with a `<Button>` element.
- [x] 2.5 Configure the button to display `selectedFolderName` if present, otherwise "Select Box Folder", and to toggle `isFolderBrowserOpen` to true on click.
- [x] 2.6 Render the `<BoxFolderBrowser>` component passing `foldersOnly={true}`.
- [x] 2.7 Handle the `onSelect` callback from `BoxFolderBrowser` to update `selectedFolderName` and invoke `setValue('parentBoxFolderId', result.id)`.

## 3. Verification

- [x] 3.1 Verify that the CSS margins are correctly applied to the "Add School" and "Edit School" forms.
- [x] 3.2 Verify that clicking "Select Box Folder" opens the folder browser, restricts to folders only, and successfully updates the button text and internal form state upon selection.
