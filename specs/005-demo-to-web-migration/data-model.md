# Data Model: Demo to Platform Web Migration

**Feature**: 005-demo-to-web-migration
**Date**: 2026-03-21

> All entities are mock-only (TypeScript constants). No database persistence in this scope.

## Entities

### TProject

Represents a user's interior design project.

| Field              | Type   | Notes                              |
| ------------------ | ------ | ---------------------------------- |
| id                 | string | Unique identifier                  |
| name               | string | User-assigned project name         |
| createdAt          | string | ISO 8601 date                      |
| modifiedAt         | string | ISO 8601 date                      |
| visualizationCount | number | Count of visualizations in project |

### TVisualization

A single design output within a project.

| Field          | Type           | Notes                          |
| -------------- | -------------- | ------------------------------ |
| id             | string         | Unique identifier              |
| name           | string         | Visualization name             |
| iterationCount | number         | Number of iterations generated |
| latestDate     | string         | ISO 8601 date of last change   |
| thumbnailUrl   | string or null | Optional preview image URL     |

### TIteration

A single generation result within a visualization.

| Field      | Type    | Notes                                        |
| ---------- | ------- | -------------------------------------------- |
| id         | string  | Unique identifier                            |
| label      | string  | Display label (e.g., "Oryginał", "Edycja 1") |
| isOriginal | boolean | Whether this is the original upload          |

### TCreditPackage

A purchasable bundle of credits.

| Field     | Type    | Notes                           |
| --------- | ------- | ------------------------------- |
| id        | string  | Unique identifier               |
| name      | string  | Package name (e.g., "Starter")  |
| credits   | number  | Number of credits in package    |
| price     | number  | Price in PLN                    |
| isPopular | boolean | Whether to highlight as popular |

### TDashboardStats

Aggregated statistics for the dashboard.

| Field              | Type   | Notes                |
| ------------------ | ------ | -------------------- |
| projectCount       | number | Total projects       |
| visualizationCount | number | Total visualizations |
| creditBalance      | number | Remaining credits    |

### TRecentProject

A project card shown on the dashboard.

| Field     | Type           | Notes                  |
| --------- | -------------- | ---------------------- |
| id        | string         | Project identifier     |
| name      | string         | Project name           |
| date      | string         | ISO 8601 date          |
| thumbnail | string or null | Optional preview image |

## Relationships

```
TProject 1──* TVisualization
TVisualization 1──* TIteration
TDashboardStats ──> aggregation of TProject data
TRecentProject ──> subset view of TProject
```

## State Transitions

### Workspace Generation Flow

```
Idle → Form Filling → Validating → Generating (loading) → Result Displayed
                                                        → Error (insufficient credits)
```

### Project CRUD (Mock)

```
List → Create Dialog → Created (added to list)
List → Edit Name → Updated
List → Delete Dialog → Confirmed → Removed from list
```

## Mock Data Constants

All mock data will be defined as exported TypeScript constants in module `data/` files:

- `modules/projects/data/mock-projects.ts` — 3 projects, nested visualizations per project
- `modules/workspace/data/mock-workspace.ts` — Style options, palette options, room type options
- `modules/credits/data/mock-credits.ts` — 3 credit packages (Starter/Standard/Pro)
- `modules/dashboard/data/mock-dashboard.ts` — Stats object, recent projects array, last visualization
