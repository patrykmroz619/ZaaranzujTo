# Projects + Visualizations Alignment Review

Date: 2026-03-19
Scope: apps/platform-api modules `projects` and `visualizations`
Compared against:

- docs/platform-api-rest-api-plan.md
- docs/platform-api-implementation-plan.md
- docs/platform-api-modular-monolith-blueprint.md
- docs/mongodb-data-model-design.md

## Executive Summary

Current implementation provides strong baseline coverage for CRUD/read flows and ownership checks, but does not yet fully match target documentation in several high-impact areas.

Status update (2026-03-21):

- Finding #4 (modular monolith boundary violation in Visualizations module) has been resolved by replacing direct Project model access with a public Projects ownership validation service.

Highest-priority gaps:

1. Missing `POST /visualizations/{visualizationId}/iterations` endpoint.
2. `DELETE /projects/{projectId}` currently deletes only project metadata (no documented cascade behavior).

## Findings (Ordered by Severity)

### 1) Missing iteration creation write endpoint

Documentation expectation:

- `POST /visualizations/{visualizationId}/iterations` is required and is the only iteration write endpoint.

Observed in code:

- `visualizations.controller.ts` has:
  - `GET projects/:projectId/visualizations`
  - `POST projects/:projectId/visualizations`
  - `GET visualizations/:visualizationId`
  - `GET visualizations/:visualizationId/iterations`
- No `POST visualizations/:visualizationId/iterations` handler exists.

Impact:

- Core generation flow cannot be performed through documented API contract.

---

### 2) Project deletion behavior does not match REST semantics

Documentation expectation:

- Deleting project removes related visualizations, iterations, and files.
- `409 Conflict` possible if active generation blocks deletion.

Observed in code:

- `projects.repository.ts` uses `findOneAndDelete` on projects collection only.
- No orchestration to delete related visualization/asset data.
- No conflict handling for active generation.

Impact:

- Risk of orphaned visualizations/assets and contract mismatch for clients.

---

### 4) Modular monolith boundary violation in Visualizations module

Status: Resolved (2026-03-21)

Documentation expectation:

- Inter-module communication via public services.
- Repositories/schemas remain module-private.

Observed in code:

- Visualizations module now imports ProjectsModule and no longer registers Project schema/model.
- `validate-project-ownership.service.ts` delegates ownership validation to a public Projects service.

Impact:

- Coupling reduced; implementation now aligns with architectural boundary rules.

---

### 5) Visualizations data shape diverges from Mongo data model design

Documentation expectation:

- Iteration-related IDs shown as ObjectId-based references.
- Iteration result includes fields beyond `imageAssetId` (`model`, `provider`, `latencyMs`) in design.

Observed in code:

- `baseIterationId`, `referenceAssets`, `inputRoomPhotoAssetId`, and result IDs are stored as strings.
- Iteration result stores only `imageAssetId`.

Impact:

- Potential migration friction and missing generation telemetry fields described in design document.

Note:

- Some of these differences can be acceptable if intentionally simplified for current milestone, but they should be explicitly documented.

---

### 6) `visualizationsCount` strategy not implemented

Documentation expectation:

- Implementation plan calls for a consistent strategy to provide `visualizationsCount`.

Observed in code:

- Project mapper currently hardcodes `visualizationsCount: 0`.

Impact:

- Incorrect values returned for projects containing visualizations.

---

### 7) Planned visualizations generation scaffold not present

Documentation expectation:

- WI-05 references scaffold `visualizations/generation/services/`.

Observed in code:

- No files currently under `visualizations/generation/`.

Impact:

- Plan drift indicator (not a runtime defect by itself).

## What Matches Well

- Projects module exposes expected CRUD endpoints and pagination/sort support.
- Ownership isolation is consistently enforced (`userId`-scoped lookups).
- Visualizations metadata/read flows exist (`list`, `details`, `iterations list`).
- Embedded iterations pattern exists and aligns with high-level embedding decision.
- Contracts are used in Projects DTO/service validation and mapping.

## Recommended Next Steps

1. Implement `POST /visualizations/{visualizationId}/iterations` (WI-07 scope) with documented error mapping.
2. Decide and implement `visualizationsCount` strategy:
   - computed query-time, or
   - persisted counter updated transactionally.
3. Align delete flow with documented cascade behavior and conflict handling for active generation.
4. Either:
   - align visualization schema to Mongo design (ObjectId typing + richer result metadata), or
   - update docs to explicitly reflect current simplified schema.

## Suggested Documentation Updates

To prevent confusion while implementation is in progress, consider updating docs with an "Implementation Status" section:

- Mark endpoints/features already delivered vs planned.
- Mark temporary deviations (e.g., simplified iteration result shape).
- Clarify milestone boundaries for WI-05 vs WI-07 behaviors.
