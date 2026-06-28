# Implementation Plan: Add inspiration photo — backend

**Scope:** work-item `rename-and-add-backend` covering subtask `rename-and-add-backend`
**Part of:** specs/tasks/add-inspiration-image/task-plan.md

## Goal

Add `inspirationPhoto` as a new optional single-file upload on the initial visualization creation endpoint. The file flows through validation, optimization, moderation, R2 storage, and the AI prompt — where it is described to the model as a style/mood reference only (no furniture placement copying). The field is exposed as `inspirationAsset` in the stored MongoDB document and the API response schema.

## Planning Notes

- `referencePhotos` FormData field name and all internal TS param names stay unchanged — the task plan originally called for a rename but the decision was reversed. Only additions.
- `inspirationPhoto` applies to `POST /projects/:projectId/visualizations` (initial iteration) only. The subsequent iteration endpoint (`POST /visualizations/:id/iterations`) is untouched.
- MongoDB field `referenceAssets` and the contract field `referenceAssets` stay as-is; new field is `inspirationAsset`.
- Storage key convention: `{userId}/iterations/{uuid}/inspiration-photo` (consistent with `input-photo`, `reference-photo-N`).
- The AI receives images in this order: inputPhoto → inspirationPhoto → furniturePhotos. The prompt JSON's `images` section must describe each position.

## Target Structure

- Modify: `packages/contracts/src/projects/visualizations.contract.ts` — add `inspirationAsset` to `iterationInputSchema`
- Modify: `apps/platform-api/src/modules/visualizations/schemas/visualization.schema.ts` — add `inspirationAsset` prop to `IterationInput` class
- Modify: `apps/platform-api/src/modules/visualizations/repositories/visualizations.repository.ts` — add `inspirationAsset` to `TAppendIterationForVisualizationForUserParams.generationInput`
- Modify: `apps/platform-api/src/modules/visualizations/iterations/services/internal/iteration.types.ts` — add `inspirationAssetId` to `TUploadedIterationAssetsBundle`
- Modify: `apps/platform-api/src/modules/visualizations/iterations/services/internal/iteration-files-validator.service.ts` — add `inspirationPhoto` validation
- Modify: `apps/platform-api/src/modules/visualizations/iterations/services/internal/iteration-assets.service.ts` — add `inspirationPhoto` upload, return `inspirationAssetId`
- Modify: `apps/platform-api/src/modules/visualizations/iterations/prompts/generate-vizualization-prompt.ts` — add `hasInspirationPhoto` param, image description, style-only constraint
- Modify: `apps/platform-api/src/modules/visualizations/iterations/services/create-iteration.service.ts` — add `inspirationPhoto` param; wire optimize → moderate → prompt → assets → DB
- Modify: `apps/platform-api/src/modules/visualizations/services/create-visualization.service.ts` — add `inspirationPhoto` param, pass through
- Modify: `apps/platform-api/src/modules/visualizations/visualizations.controller.ts` — add `inspirationPhoto` to `createVisualization` interceptor and extract/pass it
- Modify: `apps/platform-api/src/modules/visualizations/services/map-visualization-details.service.ts` — include `inspirationAsset` in mapped `generationInput`
- Modify: `apps/platform-api/src/modules/visualizations/iterations/services/list-visualization-iterations.service.ts` — include `inspirationAsset` in mapped `generationInput`

## Contracts

### `iterationInputSchema` (contract + response shape)

```ts
export const iterationInputSchema = z
  .object({
    mode: z.string(),
    prompt: z.string().nullable().optional(),
    inputAsset: objectIdSchema.nullable(),
    referenceAssets: z.array(objectIdSchema),
    inspirationAsset: objectIdSchema.nullable().optional(), // NEW
  })
  .strict();
```

### `TUploadedIterationAssetsBundle` (internal type)

```ts
export type TUploadedIterationAssetsBundle = {
  inputAssetId: string | null;
  referenceAssetIds: string[];
  inspirationAssetId: string | null; // NEW
  outputAssetId: string;
};
```

### `TCreateIterationParams` (internal service type)

```ts
type TCreateIterationParams = {
  visualization: TVisualizationDocument;
  userId: Types.ObjectId;
  prompt: string;
  inputPhoto: TUploadedFile | undefined;
  inspirationPhoto: TUploadedFile | undefined; // NEW
  parentIterationId: string | undefined;
  referencePhotos: TUploadedFile[];
};
```

### `TCreateVisualizationParams` (internal service type)

```ts
type TCreateVisualizationParams = {
  clerkId: string;
  email: string;
  projectId: string;
  body: TCreateVisualizationRequest;
  inputPhoto: TUploadedFile | undefined;
  inspirationPhoto: TUploadedFile | undefined; // NEW
  referencePhotos: TUploadedFile[];
};
```

## Implementation Steps

### 1. Mongoose schema — `visualization.schema.ts`

Add `inspirationAsset` to the `IterationInput` embedded class:

```ts
@Prop({ required: false, default: null, type: String })
inspirationAsset: string | null;
```

No migration needed: MongoDB treats the missing field on old documents as `null` (Mongoose default).

### 2. Repository — `visualizations.repository.ts`

Add `inspirationAsset: string | null` to the `generationInput` shape inside `TAppendIterationForVisualizationForUserParams`. No change to the method body — the value flows through `generationInput` which is stored as-is.

### 3. Contract — `visualizations.contract.ts`

Add `inspirationAsset: objectIdSchema.nullable().optional()` to `iterationInputSchema`. The `.optional()` ensures old stored documents (without the field) still pass Zod validation if ever parsed on the frontend.

### 4. Internal types — `iteration.types.ts`

Add `inspirationAssetId: string | null` to `TUploadedIterationAssetsBundle`.

### 5. Files validator — `iteration-files-validator.service.ts`

Add `inspirationPhoto: TUploadedFile | undefined` to `TValidateFilesParams`. Validate it with the same `validateFile` helper when present:

```ts
if (inspirationPhoto) {
  this.validateFile({ file: inspirationPhoto });
}
```

### 6. Assets service — `iteration-assets.service.ts`

Add `inspirationPhoto: TUploadedFile | undefined` to `TUploadAssetsForIterationParams`. Upload it using the key `${userId}/iterations/${randomId}/inspiration-photo` and capture the resulting asset id. Return `inspirationAssetId: asset?._id.toString() ?? null` in the bundle.

### 7. Prompt builder — `generate-vizualization-prompt.ts`

Add `hasInspirationPhoto: boolean` to `TFirstIterationPromptParams` only (subsequent iterations do not receive an inspiration photo).

**Image section** — the `images` object is built sequentially by position. With the new field, the positions are:

| Position | Condition                                                        | Key                | Description               |
| -------- | ---------------------------------------------------------------- | ------------------ | ------------------------- |
| 1        | `hasInputPhoto`                                                  | `image_1`          | existing room description |
| 2        | `hasInputPhoto && hasInspirationPhoto`                           | `image_2`          | inspiration               |
| 1        | `!hasInputPhoto && hasInspirationPhoto`                          | `image_1`          | inspiration               |
| last     | `hasReferencePhotos && (hasInputPhoto \|\| hasInspirationPhoto)` | `remaining_images` | furniture                 |
| 1        | `!hasInputPhoto && !hasInspirationPhoto && hasReferencePhotos`   | `reference_images` | furniture                 |

Inspiration image description:

```
"Design inspiration. Follow its style, colour palette, materials, and mood — do not copy specific furniture pieces, their placement, or the room layout."
```

**Hard constraints** — when `hasInspirationPhoto`, add:

```
"Inspiration image is a style-only reference. Do not replicate its layout, furniture arrangement, or any specific objects — extract only aesthetic cues."
```

### 8. Create iteration service — `create-iteration.service.ts`

Add `inspirationPhoto: TUploadedFile | undefined` to `TCreateIterationParams`.

**Optimize:** mirror `optimizedInputPhoto` pattern:

```ts
const optimizedInspirationPhoto = inspirationPhoto
  ? await this.imageOptimizationService.optimize(inspirationPhoto, {
      maxDimensionPx: 1024,
      quality: 72,
    })
  : undefined;
```

**Validate:** pass `inspirationPhoto` (pre-optimization) to `iterationFilesValidatorService.validateFiles`.

**Moderate:** include `optimizedInspirationPhoto` in `moderateIterationContent` — add it to the `referencePhotos` array passed to `buildModerationImages`, or add a dedicated param. The simplest approach: add `inspirationPhoto: TUploadedFile | undefined` to the private `moderateIterationContent` params and append it to the images array alongside `inputPhoto`.

**`allReferenceImages` ordering** (images array sent to AI in the order they are described by the prompt):

1. `optimizedInputPhoto` (if present)
2. `optimizedInspirationPhoto` (if present) — NEW
3. `previousOutputImage` (subsequent iterations only)
4. `optimizedReferencePhotos` (spread)

**Prompt builder call** — add `hasInspirationPhoto: !!optimizedInspirationPhoto` to `generateFirstIterationPrompt`.

**Assets service call** — add `inspirationPhoto: optimizedInspirationPhoto`.

**DB record** — add `inspirationAsset: registeredAssetsBundle.inspirationAssetId` inside `generationInput` passed to `appendIterationForVisualizationForUser`.

**Logger line** — add `hasInspirationPhoto=${!!inspirationPhoto}` to the existing start log.

### 9. Create visualization service — `create-visualization.service.ts`

Add `inspirationPhoto: TUploadedFile | undefined` to `TCreateVisualizationParams`. Pass it through to `createIterationService.createIteration`.

### 10. Controller — `visualizations.controller.ts`

In `createVisualization`, update `FileFieldsInterceptor` to include the new field:

```ts
FileFieldsInterceptor([
  { name: "inputPhoto", maxCount: 1 },
  { name: "referencePhotos", maxCount: 8 },
  { name: "inspirationPhoto", maxCount: 1 }, // NEW
]);
```

Update the `files` type annotation to add `inspirationPhoto?: TUploadedIterationFile[]`. Extract and pass:

```ts
inspirationPhoto: files.inspirationPhoto?.[0],
```

The `createIteration` endpoint (`POST /visualizations/:id/iterations`) is not touched.

### 11. Mapping services

In both `map-visualization-details.service.ts` (`mapIteration` helper) and `list-visualization-iterations.service.ts` (inline map), add `inspirationAsset` to the `generationInput` block:

```ts
generationInput: {
  mode: iteration.generationInput.mode,
  prompt: iteration.generationInput.prompt,
  inputAsset: iteration.generationInput.inputAsset,
  referenceAssets: iteration.generationInput.referenceAssets,
  inspirationAsset: iteration.generationInput.inspirationAsset ?? null,  // NEW
},
```

## Acceptance Criteria

- `POST /projects/:projectId/visualizations` accepts an optional `inspirationPhoto` file alongside existing fields; omitting it has no effect on existing behaviour.
- The uploaded inspiration image is stored in R2 under `{userId}/iterations/{uuid}/inspiration-photo`.
- The response's `iterations[0].generationInput.inspirationAsset` contains the asset id when an inspiration photo was provided, and is `null` otherwise.
- The AI generation prompt's `images` section describes the inspiration image as style-only and includes a hard constraint preventing furniture/layout copying from it.
- Existing documents without `inspirationAsset` continue to be served correctly (field reads as `null`).

## Verification

**Automated:**

```sh
bun run check-types   # from monorepo root
bun run lint          # from monorepo root
```

**Manual:**

1. POST `projects/:projectId/visualizations` with `inputPhoto`, `referencePhotos[]`, and `inspirationPhoto` — verify `inspirationAsset` is non-null in the response and the R2 key `{userId}/iterations/{uuid}/inspiration-photo` exists.
2. POST the same endpoint without `inspirationPhoto` — verify existing behaviour is unchanged and `inspirationAsset` is `null`.
3. GET `visualizations/:id` and `visualizations/:id/iterations` — verify `inspirationAsset` appears in `generationInput` for both endpoints.
