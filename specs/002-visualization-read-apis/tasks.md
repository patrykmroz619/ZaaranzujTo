# Tasks: Visualization Metadata and Read APIs

**Input**: Design documents from `/specs/002-visualization-read-apis/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests were not explicitly requested in the feature specification, so no dedicated test-writing tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare module and contract scaffolding for WI-05 implementation.

- [x] T001 Create visualization module folder structure in apps/platform-api/src/modules/visualizations/
- [x] T002 [P] Create contract file for visualization APIs in packages/contracts/src/projects/visualizations.contract.ts
- [x] T003 [P] Export visualization contracts from packages/contracts/src/projects/index.ts
- [x] T004 Register visualization contracts export in packages/contracts/src/index.ts
- [x] T005 Add visualizations module registration in apps/platform-api/src/app.module.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement core persistence, DTO, and boundary infrastructure required by all user stories.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T006 Define visualization and embedded iteration schemas in apps/platform-api/src/modules/visualizations/schemas/visualization.schema.ts
- [x] T008 Implement visualization repository with user-scoped query helpers in apps/platform-api/src/modules/visualizations/repositories/visualizations.repository.ts
- [x] T010 Implement request/response DTO zod schemas in apps/platform-api/src/modules/visualizations/visualizations.dto.ts
- [x] T011 [P] Add visualization domain error constants/codes in apps/platform-api/src/modules/visualizations/visualizations.constants.ts
- [x] T012 Wire repositories and schema providers in apps/platform-api/src/modules/visualizations/visualizations.module.ts
- [x] T013 Add Mongo indexes for list/read paths in apps/platform-api/src/modules/visualizations/schemas/visualization.schema.ts

**Checkpoint**: Foundation ready; user-story endpoints can now be implemented independently.

---

## Phase 3: User Story 1 - Browse Visualizations in a Project (Priority: P1) 🎯 MVP

**Goal**: Return paginated visualization summaries for a user-owned project with strict ownership isolation.

**Independent Test**: Call GET /projects/{projectId}/visualizations for owned and non-owned projects and verify summary payload, pagination, and not-found isolation.

### Implementation for User Story 1

- [x] T014 [US1] Implement project ownership validation service in apps/platform-api/src/modules/visualizations/services/validate-project-ownership.service.ts
- [x] T015 [US1] Implement list-project-visualizations service in apps/platform-api/src/modules/visualizations/services/list-project-visualizations.service.ts
- [x] T016 [US1] Add GET /projects/:projectId/visualizations route in apps/platform-api/src/modules/visualizations/visualizations.controller.ts
- [x] T017 [US1] Implement summary mapping (latestIteration + iterationsCount) in apps/platform-api/src/modules/visualizations/services/map-visualization-summary.service.ts
- [x] T018 [US1] Add pagination/sort input validation for list endpoint in apps/platform-api/src/modules/visualizations/visualizations.dto.ts

**Checkpoint**: User Story 1 is independently functional and verifiable.

---

## Phase 4: User Story 2 - Create Visualization Metadata (Priority: P1)

**Goal**: Create visualization metadata under a project without generation, uploads, or credit side effects.

**Independent Test**: Call POST /projects/{projectId}/visualizations with valid/invalid payload; verify metadata-only creation semantics.

### Implementation for User Story 2

- [x] T019 [US2] Implement create-visualization service with metadata-only defaults in apps/platform-api/src/modules/visualizations/services/create-visualization.service.ts
- [x] T020 [US2] Keep create orchestration minimal for metadata-only MVP in apps/platform-api/src/modules/visualizations/services/create-visualization.service.ts
- [x] T021 [US2] Add POST /projects/:projectId/visualizations route in apps/platform-api/src/modules/visualizations/visualizations.controller.ts
- [x] T022 [US2] Enforce no-side-effects rule (no generation, no credits, no file writes) in apps/platform-api/src/modules/visualizations/services/create-visualization.service.ts
- [x] T023 [US2] Add response mapper for created visualization details in apps/platform-api/src/modules/visualizations/services/map-visualization-details.service.ts

**Checkpoint**: User Story 2 is independently functional and verifiable.

---

## Phase 5: User Story 3 - Open Visualization Details and Iteration History (Priority: P2)

**Goal**: Return full visualization details and paginated iteration history for owned visualizations.

**Independent Test**: Call GET /visualizations/{visualizationId} and GET /visualizations/{visualizationId}/iterations for owned/non-owned resources and validate payload ordering + pagination.

### Implementation for User Story 3

- [x] T024 [US3] Implement visualization ownership validation service in apps/platform-api/src/modules/visualizations/services/validate-visualization-ownership.service.ts
- [x] T025 [US3] Implement get-visualization-details service in apps/platform-api/src/modules/visualizations/services/get-visualization-details.service.ts
- [x] T026 [US3] Implement list-visualization-iterations service in apps/platform-api/src/modules/visualizations/iterations/services/list-visualization-iterations.service.ts
- [x] T027 [US3] Add GET /visualizations/:visualizationId route in apps/platform-api/src/modules/visualizations/visualizations.controller.ts
- [x] T028 [US3] Add GET /visualizations/:visualizationId/iterations route in apps/platform-api/src/modules/visualizations/visualizations.controller.ts
- [x] T029 [US3] Add iteration pagination/sort validation in apps/platform-api/src/modules/visualizations/visualizations.dto.ts

**Checkpoint**: User Story 3 is independently functional and verifiable.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, docs alignment, and readiness checks.

- [x] T030 [P] Align implemented API schemas with shared contracts in packages/contracts/src/projects/visualizations.contract.ts
- [x] T031 [P] Update API plan documentation for WI-05 endpoint details in docs/platform-api-rest-api-plan.md
- [x] T032 Update backend module boundary notes in docs/platform-api-modular-monolith-blueprint.md
- [ ] T033 Run quickstart endpoint verification steps from specs/002-visualization-read-apis/quickstart.md
- [x] T034 Run lint and build for platform-api via bun scripts in apps/platform-api/package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies, start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 2 completion.
- **Phase 5 (US3)**: Depends on Phase 2 completion.
- **Phase 6 (Polish)**: Depends on completion of the selected user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational; independent from US2 and US3.
- **US2 (P1)**: Starts after Foundational; independent from US1 and US3.
- **US3 (P2)**: Starts after Foundational; can be delivered independently but is highest value when US2 creation flow exists.

### Suggested Story Completion Order

1. US1 (MVP read list)
2. US2 (metadata creation)
3. US3 (details + history)

---

## Parallel Opportunities

- Phase 1: T002 and T003 can run in parallel once T001 starts.
- Phase 2: T011 can run in parallel after T006 baseline decisions are fixed.
- Story implementation: US1 (T014-T018), US2 (T019-T023), and US3 (T024-T029) can be staffed in parallel after Phase 2.
- Polish: T030 and T031 can run in parallel.

### Parallel Example: User Story 1

- Execute T014 and T017 in parallel (different service files).
- Execute T015 after T014, while T018 proceeds in parallel in DTO file.
- Complete T016 after service and DTO pieces are ready.

### Parallel Example: User Story 2

- Execute T019 and T023 in parallel (core create flow and mapper).
- Complete T021 after DTO validations are in place.

### Parallel Example: User Story 3

- Execute T024 and T029 in parallel (ownership service and DTO validation).
- Execute T025 and T026 in parallel after T024.
- Complete T027 and T028 when services are ready.

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate US1 independently via list endpoint behavior and ownership checks.
4. Demo/deploy MVP read capability.

### Incremental Delivery

1. Deliver US1 for project visualization browsing.
2. Deliver US2 to unlock metadata creation for new visualizations.
3. Deliver US3 to complete details/history retrieval behavior.
4. Finish polish and documentation alignment.

### Parallel Team Strategy

1. Team aligns on schema/repository contracts in Phase 2.
2. Developer A: US1, Developer B: US2, Developer C: US3.
3. Merge story slices independently and run Phase 6 hardening before release.
