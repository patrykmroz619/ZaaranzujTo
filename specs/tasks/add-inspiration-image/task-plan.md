# Task Plan: Option to add an image with inspiration

## Task Summary

Add an inspiration/reference image upload field to the visualisation creation form, giving the AI style context without requiring it to replicate layout or furniture placement. At the same time, rename the existing `referencePhotos` field to make explicit that those images are furniture/elements the AI must physically include in the output.

## Definition of Done

- The visualisation creation form has a new optional single-file upload for an inspiration image, distinct from the furniture photos field.
- The furniture photos field is renamed across the stack (contract, API, frontend) to reflect its "must-include elements" role.
- The backend passes the inspiration image to the AI with a prompt instruction to follow style and design only — not layout or furniture placement.
- The furniture elements continue to be described to the AI as items to physically include.
- Both fields work end-to-end: upload, storage in R2, asset IDs recorded in MongoDB, and correct AI prompt context.

## Planning Notes

- `referencePhotos` is the current name for furniture/elements photos. It appears in: `packages/contracts/src/projects/visualizations.contract.ts`, `visualizations.controller.ts` (`FileFieldsInterceptor`), `create-iteration.service.ts`, `iteration-assets.service.ts`, and `apps/platform-web/src/modules/projects/api/visualizations.api.ts` + `WorkspaceCreateForm`.
- The `FurniturePhotosField` component name already reflects intent — the rename is mainly at the API contract/FormData field name level (and any labels in the UI).
- Inspiration image is a single file (like `inputPhoto`), not multi-upload. Storage key pattern follows existing convention: `{userId}/iterations/{uuid}/inspiration-photo`.
- The AI generation prompt in `create-iteration.service.ts` (or `AiGenerationService`) must distinguish between the two reference types with clear instructions.
- Chosen rename for `referencePhotos`: `furniturePhotos` (consistent with existing `FurniturePhotosField` component name).

## Subtasks

### 1. `rename-and-add-backend` — done (work-item: `rename-and-add-backend`)

Add `inspirationPhoto` as a new optional single-file field. No renames — `referencePhotos` stays as-is everywhere. Update `visualizations.controller.ts` (`FileFieldsInterceptor` to include the new field), `iteration-assets.service.ts` (storage key for the new asset), and the AI generation prompt in `create-iteration.service.ts` so the model treats the inspiration image as style/design context only — not furniture placement.

### 2. `rename-and-add-frontend` — implemented (work-item: `rename-and-add-frontend`)

Rename the `referencePhotos` FormData field to `furniturePhotos` in `visualizations.api.ts` and update any related labels in `WorkspaceCreateForm`. Add a new `InspirationPhotoField` component (single-file, same constraints as `PhotoUpload`) under `apps/platform-web/src/modules/workspace/components/`. Wire the new field into `WorkspaceCreateForm` and `VisualizationCreateView` — append `inspirationPhoto` to the FormData sent to the API.
