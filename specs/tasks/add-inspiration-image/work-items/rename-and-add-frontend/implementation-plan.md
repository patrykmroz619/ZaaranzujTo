# Implementation Plan: Rename referencePhotos and add InspirationPhotoField

**Scope:** work-item `rename-and-add-frontend` covering subtask `rename-and-add-frontend`
**Part of:** specs/tasks/add-inspiration-image/task-plan.md

## Goal

Rename the `referencePhotos` FormData field to `furniturePhotos` across the frontend, and add a new optional `InspirationPhotoField` (single-file upload) that appears in the creation form before the furniture photos field. The new field appends `inspirationPhoto` to the FormData sent to the API.

## Planning Notes

- `InspirationPhotoField` is a standalone component that duplicates the `PhotoUpload` UI structure with inspiration-specific translation keys. `PhotoUpload` renders its own label internally, so making it reusable would require adding props beyond this task's scope — a standalone component is simpler and correct.
- `inspirationPhotoFile` is purely optional — it does not participate in the existing `roomPhotoFile || prompt` validation superRefine.
- Placement: inspiration photo field appears between the prompt textarea and the furniture photos field, grouping style-context inputs before elements-to-include inputs.
- Translation keys follow the `workspace.*` convention used by all workspace fields.

## Target Structure

- Modify: `apps/platform-web/src/modules/workspace/types/workspace.types.ts` — add `inspirationPhotoFile: z.instanceof(File).optional()` to `workspaceCreateSchema`
- Create: `apps/platform-web/src/modules/workspace/components/InspirationPhotoField/InspirationPhotoField.tsx` — single-file upload using inspiration-specific translation keys
- Create: `apps/platform-web/src/modules/workspace/components/InspirationPhotoField/index.ts` — barrel export
- Modify: `apps/platform-web/src/modules/workspace/components/WorkspaceCreateForm/WorkspaceCreateForm.tsx` — import `InspirationPhotoField`, add `inspirationPhotoFile` to defaultValues and watch, insert the field before `FurniturePhotosField`
- Modify: `apps/platform-web/src/views/visualization-create/VisualizationCreateView.tsx` — rename `referencePhotos` → `furniturePhotos`; append `inspirationPhoto` file to FormData
- Modify: `apps/platform-web/src/i18n/messages/pl.json` — add four `workspace.inspirationPhoto*` translation keys

## Contracts

### TWorkspaceCreateValues (workspace.types.ts)

New field added to `workspaceCreateSchema`:

```ts
inspirationPhotoFile: z.instanceof(File).optional(),
```

`TWorkspaceCreateValues` gains `inspirationPhotoFile?: File`.

### InspirationPhotoField props

```ts
type TInspirationPhotoFieldProps = {
  preview: string | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
};
```

### FormData fields (VisualizationCreateView)

- `referencePhotos` → renamed to `furniturePhotos` (multi-append, unchanged)
- New: `inspirationPhoto` — single file, appended only when `values.inspirationPhotoFile` is set

## Implementation Steps

1. **Add `inspirationPhotoFile` to `workspaceCreateSchema`** in `workspace.types.ts` (line 20, after `furniturePhotoFiles`):

   ```ts
   inspirationPhotoFile: z.instanceof(File).optional(),
   ```

   `TWorkspaceCreateValues` is inferred — no additional change needed.

2. **Add translation keys** to `pl.json` under the `workspace` object, after the existing `furniturePhoto*` keys:

   ```json
   "inspirationPhoto": "Zdjęcie inspiracji",
   "inspirationPhotoHint": "Przeciągnij zdjęcie lub kliknij, aby wybrać",
   "inspirationPhotoOptional": "Opcjonalnie — AI zaczerpnie z niego styl i klimat wnętrza.",
   "inspirationPhotoSizeHint": "Maks. 10 MB · JPG, PNG, WEBP"
   ```

3. **Create `InspirationPhotoField`** at `apps/platform-web/src/modules/workspace/components/InspirationPhotoField/InspirationPhotoField.tsx`. Copy the structure of `PhotoUpload` exactly — same accepted formats (`.jpg,.jpeg,.png,.webp,.avif,.heic`), same 10 MB limit, same drag-free label+input pattern — but use `workspace.inspirationPhoto*` translation keys and the `TInspirationPhotoFieldProps` signature from the Contracts section.

4. **Create the barrel** at `InspirationPhotoField/index.ts`:

   ```ts
   export { InspirationPhotoField } from "./InspirationPhotoField";
   ```

5. **Wire `InspirationPhotoField` into `WorkspaceCreateForm`**:
   - Import `InspirationPhotoField` alongside the existing `FurniturePhotosField` import.
   - Add `inspirationPhotoFile: undefined` to `defaultValues`.
   - Add `const inspirationPhotoFile = form.watch("inspirationPhotoFile");` and a `useMemo` + `useEffect` to manage the object URL preview (same pattern as `roomPhotoPreview` on lines 139–148).
   - Insert the field in JSX immediately before `<FurniturePhotosField …>`:
     ```tsx
     <InspirationPhotoField
       preview={inspirationPhotoPreview}
       onUpload={(file) =>
         form.setValue("inspirationPhotoFile", file, { shouldDirty: true, shouldValidate: true })
       }
       onRemove={() =>
         form.setValue("inspirationPhotoFile", undefined, {
           shouldDirty: true,
           shouldValidate: true,
         })
       }
     />
     ```

6. **Update `VisualizationCreateView`** (`onSubmit`, line 38):
   - Rename `referencePhotos` → `furniturePhotos`:
     ```ts
     values.furniturePhotoFiles.forEach((file) => formData.append("furniturePhotos", file));
     ```
   - Append inspiration photo after that line:
     ```ts
     if (values.inspirationPhotoFile)
       formData.append("inspirationPhoto", values.inspirationPhotoFile);
     ```

## Acceptance Criteria

- The form renders an inspiration photo field between the prompt textarea and the furniture photos field.
- Uploading and removing an inspiration photo works (preview shown, remove button clears it).
- On submit the FormData contains `furniturePhotos` (not `referencePhotos`) and, when provided, `inspirationPhoto`.
- When no inspiration photo is selected, `inspirationPhoto` is absent from the FormData entirely.
- TypeScript compilation passes with no errors on the new `inspirationPhotoFile` field.

## Verification

**Automated:**

```sh
bun run check-types
bun run lint
```

**Manual:**

- Open the visualization creation form; confirm the inspiration photo field appears between the prompt and furniture photos.
- Upload a photo to the inspiration field; confirm preview renders and the remove button works.
- Submit the form; in the Network tab confirm `furniturePhotos` is the field name (not `referencePhotos`) and `inspirationPhoto` is present when a file was selected.
- Submit without an inspiration photo; confirm `inspirationPhoto` key is absent from the request payload.
