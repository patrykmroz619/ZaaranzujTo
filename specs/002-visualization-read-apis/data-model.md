# Visualization Metadata and Read APIs Data Model

## Overview

This feature covers project-scoped visualization metadata creation and read flows without generation side effects. The model reuses existing project ownership and visualization aggregate patterns.

## Entities

### Project (existing)

| Field       | Type                         | Required | Notes                 |
| ----------- | ---------------------------- | -------- | --------------------- |
| `_id`       | ObjectId                     | Yes      | Primary identifier    |
| `userId`    | ObjectId or string reference | Yes      | Owner identity scope  |
| `name`      | string                       | Yes      | User-facing label     |
| `createdAt` | Date                         | Yes      | Creation timestamp    |
| `updatedAt` | Date                         | Yes      | Last update timestamp |

Validation rules:

- Access only within current authenticated user scope.
- Project must exist before creating/listing visualizations.

### Visualization

| Field             | Type                             | Required | Notes                                |
| ----------------- | -------------------------------- | -------- | ------------------------------------ |
| `_id`             | ObjectId                         | Yes      | Primary identifier                   |
| `userId`          | ObjectId or string reference     | Yes      | Owner identity for isolation         |
| `projectId`       | ObjectId                         | Yes      | Parent project                       |
| `name`            | string                           | Yes      | Room/space display name              |
| `mode`            | enum(`fromPhoto`, `fromScratch`) | Yes      | Creation mode metadata               |
| `iterations`      | Iteration[]                      | Yes      | Embedded history, initially empty    |
| `iterationsCount` | number                           | Yes      | Derived counter, initial `0`         |
| `latestIteration` | LatestIterationSnapshot or null  | Yes      | Null for newly created visualization |
| `createdAt`       | Date                             | Yes      | Creation timestamp                   |
| `updatedAt`       | Date                             | Yes      | Last update timestamp                |

Validation rules:

- Name length must satisfy contract bounds.
- Mode must be one of allowed values.
- Newly created records cannot include generated output or files in this WI.

State transitions:

- `CreatedMetadataOnly` -> `HasIterations` (outside this WI, when iteration write flow is implemented).

### Iteration (embedded, read-only in this WI)

| Field             | Type             | Required | Notes                                |
| ----------------- | ---------------- | -------- | ------------------------------------ |
| `_id`             | ObjectId         | Yes      | Iteration identifier                 |
| `iterationNo`     | number           | Yes      | Chronological order in visualization |
| `baseIterationId` | ObjectId or null | No       | Parent iteration relation            |
| `status`          | enum             | Yes      | Generation result state              |
| `generationInput` | object           | Yes      | Prompt and option metadata           |
| `result`          | object           | Yes      | Output asset references              |
| `createdAt`       | Date             | Yes      | Creation timestamp                   |

Validation rules:

- Returned chronologically for iteration history endpoint by default.
- Included in full details endpoint as current persisted history.

## Relationships

- One Project has many Visualizations.
- One Visualization embeds many Iterations.
- One User owns Projects and Visualizations.

## Indexing Notes

- Visualization listing: index on `(userId, projectId, updatedAt)`.
- Visualization direct read: index on `(userId, _id)`.

## Non-Goals in This Feature

- No generation orchestration.
- No credit reservation or mutation.
- No file upload handling.
