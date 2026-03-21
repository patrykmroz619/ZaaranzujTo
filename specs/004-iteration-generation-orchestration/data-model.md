# Iteration Generation Orchestration Data Model

## Overview

This feature adds the iteration write workflow with upload inputs, AI generation output, and credit-safe orchestration. It extends existing visualization and storage records and introduces explicit operation tracking semantics.

## Entities

### Iteration Creation Command

| Field               | Type     | Required | Notes                                                       |
| ------------------- | -------- | -------- | ----------------------------------------------------------- |
| `commandId`         | string   | Yes      | Internal operation identifier for tracing                   |
| `userId`            | string   | Yes      | Authenticated owner                                         |
| `visualizationId`   | string   | Yes      | Target visualization                                        |
| `inputPhotoAssetId` | string   | Yes      | Required primary image asset                                |
| `referenceAssetIds` | string[] | No       | Optional support images                                     |
| `stylePreset`       | string   | No       | Optional generation style selector                          |
| `promptContext`     | object   | No       | Optional structured generation context                      |
| `status`            | enum     | Yes      | `received`, `processing`, `completed`, `failed` |
| `createdAt`         | Date     | Yes      | Creation timestamp                                          |
| `updatedAt`         | Date     | Yes      | Last transition timestamp                                   |

Validation rules:

- `referenceAssetIds` count must not exceed configured max.

### Visualization Iteration

| Field             | Type     | Required | Notes                                       |
| ----------------- | -------- | -------- | ------------------------------------------- |
| `iterationId`     | string   | Yes      | Unique iteration identifier                 |
| `visualizationId` | string   | Yes      | Parent visualization reference              |
| `userId`          | string   | Yes      | Owner for isolation checks                  |
| `sequenceNumber`  | number   | Yes      | Monotonic per visualization                 |
| `status`          | enum     | Yes      | `succeeded` or `failed`                     |
| `inputAssets`     | object[] | Yes      | Input asset references and roles            |
| `outputAssetId`   | string   | No       | Generated output asset reference on success |
| `failureCode`     | string   | No       | Deterministic failure category              |
| `createdAt`       | Date     | Yes      | Iteration timestamp                         |

Validation rules:

- Exactly one primary input asset is required.
- Output asset is required for `succeeded` status and forbidden for `failed` status.
- `sequenceNumber` must be unique per visualization.

### File Asset Linkage

| Field             | Type   | Required | Notes                                                  |
| ----------------- | ------ | -------- | ------------------------------------------------------ |
| `assetId`         | string | Yes      | Existing `file_assets` identifier                      |
| `userId`          | string | Yes      | Must match iteration owner                             |
| `assetRole`       | enum   | Yes      | `input-primary`, `input-reference`, `output-generated` |
| `visualizationId` | string | Yes      | Parent visualization                                   |
| `iterationId`     | string | No       | Set after iteration persistence                        |
| `mimeType`        | string | Yes      | Validated media type                                   |
| `sizeBytes`       | number | Yes      | Size boundary checks                                   |

Validation rules:

- Asset ownership must match requesting user.
- Unsupported MIME types and oversized assets are rejected before generation.

### Credit Operation Correlation

| Field            | Type   | Required | Notes                                       |
| ---------------- | ------ | -------- | ------------------------------------------- |
| `reservationId`  | string | Yes      | Credits module reservation handle           |
| `userId`         | string | Yes      | Owner                                       |
| `amount`         | number | Yes      | Reserved credits (MVP default: 1)           |
| `lifecycleState` | enum   | Yes      | `reserved`, `consumed`, `compensated`       |
| `source`         | object | Yes      | `module=visualizations`, entity identifiers |

Validation rules:

- Exactly one terminal state (`consumed` or `compensated`) per reservation.

### AI Generation Attempt

| Field           | Type   | Required | Notes                                  |
| --------------- | ------ | -------- | -------------------------------------- |
| `attemptId`     | string | Yes      | Internal generation attempt identifier |
| `commandId`     | string | Yes      | Link to creation command               |
| `provider`      | string | Yes      | `openrouter` for MVP                   |
| `model`         | string | Yes      | Selected model identifier              |
| `status`        | enum   | Yes      | `started`, `succeeded`, `failed`       |
| `errorCategory` | string | No       | Deterministic mapped provider error    |
| `createdAt`     | Date   | Yes      | Start timestamp                        |
| `completedAt`   | Date   | No       | End timestamp                          |

Validation rules:

- Failed attempts require `errorCategory`.
- Successful attempts require generated output payload reference.

## State Transitions

### Iteration Orchestration Lifecycle

1. Receive command and validate ownership + files.
2. Reserve credits.
3. Execute AI generation attempt.
4. Persist iteration and output asset metadata.
5. Consume credits on success.
6. Compensate credits on any failure after reservation.

### Terminal Outcome Rules

- Success: `iteration.status=succeeded`, output asset linked, credit state `consumed`.
- Failure: `iteration.status=failed` (or command-level failed outcome where applicable), credit state `compensated`.

## Relationships

- One visualization has many iterations.
- One iteration references one primary input asset and zero-many reference assets.
- One iteration may reference one generated output asset.
- One iteration command maps to one credit reservation lifecycle.
- One iteration command maps to one or more generation attempts, with at most one successful terminal attempt.

## Indexing Notes

- Iterations: unique `(visualizationId, sequenceNumber)`.
- Asset linkage query path: index `(visualizationId, iterationId, assetRole)`.

## Non-Goals in This Feature

- Payment flow integration.
- Async queue re-architecture for generation workers.
- Multi-provider routing logic beyond OpenRouter for MVP.
