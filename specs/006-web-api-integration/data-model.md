# Data Model: Web-API Integration

**Feature**: 006-web-api-integration
**Date**: 2026-03-29

This feature does not introduce new database entities. It connects the frontend to existing backend data models. This document maps the existing entities as consumed by the frontend.

## Entities (as consumed by frontend)

### ProjectObject

Source: `@repo/contracts` → `TProjectObject`

| Field | Type | Notes |
| --- | --- | --- |
| id | string (ObjectId) | Unique identifier |
| name | string (1-120 chars) | User-provided name, trimmed |
| visualizationsCount | integer (≥ 0) | Count of visualizations in project |
| createdAt | string (ISO 8601) | Creation timestamp |
| updatedAt | string (ISO 8601) | Last modification timestamp |

**Used in**: ProjectsView, ProjectCard, DashboardView (recent projects, stats)

---

### VisualizationSummary

Source: `@repo/contracts` → `TVisualizationSummary`

| Field | Type | Notes |
| --- | --- | --- |
| id | string (ObjectId) | Unique identifier |
| projectId | string (ObjectId) | Parent project reference |
| name | string (1-120 chars) | Room/space name |
| mode | "fromPhoto" \| "fromScratch" | Generation mode |
| iterationsCount | integer (≥ 0) | Total iterations |
| latestIteration | LatestIterationSummary \| null | Snapshot of latest iteration |
| createdAt | string (ISO 8601) | Creation timestamp |
| updatedAt | string (ISO 8601) | Last modification timestamp |

**LatestIterationSummary** (embedded):

| Field | Type | Notes |
| --- | --- | --- |
| id | string | Iteration identifier |
| iterationNo | integer (≥ 1) | Sequence number |
| imageAssetId | string | Asset ID for thumbnail (resolve via storage API) |
| createdAt | string (ISO 8601) | Generation timestamp |

**Used in**: ProjectDetailView, VisualizationCard

---

### VisualizationDetails

Source: `@repo/contracts` → `TVisualizationDetails`

| Field | Type | Notes |
| --- | --- | --- |
| id | string (ObjectId) | Unique identifier |
| projectId | string (ObjectId) | Parent project reference |
| name | string | Room/space name |
| mode | "fromPhoto" \| "fromScratch" | Generation mode |
| inputRoomPhotoAssetId | string \| null | Original photo asset (if fromPhoto mode) |
| iterations | IterationObject[] | All iterations |
| createdAt | string (ISO 8601) | Creation timestamp |
| updatedAt | string (ISO 8601) | Last modification timestamp |

**Used in**: WorkspaceView (when opening existing visualization)

---

### IterationObject

Source: `@repo/contracts` → `TIterationObject`

| Field | Type | Notes |
| --- | --- | --- |
| id | string | Iteration identifier |
| iterationNo | integer (≥ 1) | Sequence number |
| baseIterationId | string \| null | Parent iteration (null for first) |
| status | string | "succeeded" or "failed" |
| generationInput | IterationInput | Form parameters used |
| result | IterationResult | Generated output |
| createdAt | string (ISO 8601) | Generation timestamp |

**IterationInput** (embedded):

| Field | Type | Notes |
| --- | --- | --- |
| mode | string | Generation mode |
| stylePreset | string \| null | Selected style |
| colors | string[] | Selected color palette |
| roomType | string \| null | Selected room type |
| prompt | string \| null | User text prompt |
| referenceAssets | string[] | Asset IDs for furniture/element photos |

**IterationResult** (embedded):

| Field | Type | Notes |
| --- | --- | --- |
| imageAssetId | string | Asset ID for generated image (resolve via storage API) |

**Used in**: WorkspaceView (thumbnail strip, main image display)

---

### MeResponse (Profile)

Source: `@repo/contracts` → `TMeResponse`

| Field | Type | Notes |
| --- | --- | --- |
| user | UserObject | User identity data |
| creditBalance | integer (≥ 0) | Available credits |
| theme | "light" \| "dark" \| "system" | UI theme preference |

**Used in**: CreditBadge (header), DashboardView (credit stat), WorkspaceView (generation guard), SettingsView (theme)

---

### CreditPackage

Source: `@repo/contracts` → `TCreditPackage`

| Field | Type | Notes |
| --- | --- | --- |
| packageCode | string | Unique package identifier |
| name | string | Display name |
| credits | integer (≥ 1) | Credits in package |
| price | { amount: number, currency: string } | Price with currency (PLN) |
| isActive | boolean | Whether package is purchasable |

**Used in**: CreditsView, CreditPackageCard

---

### SignedUrlResponse

Source: `@repo/contracts` → `TSignedUrlResponse`

| Field | Type | Notes |
| --- | --- | --- |
| downloadUrl | string (URL) | Temporary signed URL for asset download |
| expiresAt | string (ISO 8601) | URL expiration timestamp |

**Used in**: Anywhere images need to be displayed (visualization thumbnails, iteration images, original photos)

## Relationships

```
User (Clerk)
  └── Profile (GET /me) → creditBalance, theme
  └── Project (CRUD via /projects)
       └── VisualizationSummary (list via /projects/{id}/visualizations)
            └── VisualizationDetails (get via /visualizations/{id})
                 └── Iteration (list via /visualizations/{id}/iterations)
                      └── FileAsset (resolve via /storage/assets/{id}/download-url)
```

## State Transitions

### Visualization Lifecycle (frontend perspective)

```
[New] → POST /projects/{id}/visualizations → [Created, 0 iterations]
      → POST /visualizations/{id}/iterations → [Loading...]
      → Success → [Has iteration(s), edit mode]
      → Failure → [Error message, retry available]
```

### Iteration Lifecycle

```
[Form submitted] → Request sent → [Loading state in right panel]
                 → Success → [New iteration displayed, previous in thumbnail strip]
                 → Failure → [Error toast, form re-enabled]
```

### Credit Lifecycle (frontend perspective)

```
[Balance ≥ 1] → Generate → [Balance decremented] → Profile refetch confirms
[Balance = 0] → Generate button disabled → "Buy credits" CTA shown
```
