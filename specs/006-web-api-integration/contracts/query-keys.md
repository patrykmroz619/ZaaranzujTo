# Query Key Contract

**Feature**: 006-web-api-integration
**Date**: 2026-03-29

Defines the React Query cache key structure for all frontend data fetching. Keys follow a hierarchical pattern enabling targeted and cascading invalidation.

## Key Definitions

| Query Key | Endpoint | Stale Time | Notes |
| --- | --- | --- | --- |
| `["projects"]` | `GET /projects` | default | Project list with pagination |
| `["projects", projectId]` | `GET /projects/{projectId}` | default | Single project details |
| `["projects", projectId, "visualizations"]` | `GET /projects/{projectId}/visualizations` | default | Visualizations list for project |
| `["visualizations", visualizationId]` | `GET /visualizations/{visualizationId}` | default | Visualization details with iterations |
| `["visualizations", visualizationId, "iterations"]` | `GET /visualizations/{visualizationId}/iterations` | default | Paginated iterations list |
| `["credits", "packages"]` | `GET /credits/packages` | 5 minutes | Rarely changes; cache longer |
| `["credits", "balance"]` | `GET /credits/balance` | default | Detailed balance (reserved/available) |
| `["profile"]` | `GET /me` | default | Existing key — profile + creditBalance + theme |
| `["storage", "asset", assetId]` | `GET /storage/assets/{assetId}/download-url` | 50 minutes | Near URL TTL (1 hour); prevents expired URLs |

## Invalidation Rules

| Mutation | Keys to Invalidate | Reason |
| --- | --- | --- |
| Create project | `["projects"]` | New item in list |
| Update project | `["projects"]`, `["projects", projectId]` | Name change reflected in list + detail |
| Delete project | `["projects"]` | Item removed from list |
| Create visualization | `["projects", projectId, "visualizations"]`, `["projects", projectId]` | New item in list; project's visualizationsCount changes |
| Create iteration | `["visualizations", vizId]`, `["visualizations", vizId, "iterations"]`, `["profile"]` | New iteration; credit balance changes |

## Key Factory Pattern

All query keys should be generated via a factory object to ensure consistency:

```
queryKeys.projects.all          → ["projects"]
queryKeys.projects.detail(id)   → ["projects", id]
queryKeys.projects.visualizations(id) → ["projects", id, "visualizations"]
queryKeys.visualizations.detail(id)   → ["visualizations", id]
queryKeys.visualizations.iterations(id) → ["visualizations", id, "iterations"]
queryKeys.credits.packages      → ["credits", "packages"]
queryKeys.credits.balance       → ["credits", "balance"]
queryKeys.profile               → ["profile"]
queryKeys.storage.asset(id)     → ["storage", "asset", id]
```
