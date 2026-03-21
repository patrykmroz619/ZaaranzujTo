# Tasks: Iteration Generation Orchestration

**Input**: Design documents from `/specs/004-iteration-generation-orchestration/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/, quickstart.md

**Tests**: No explicit TDD or test-writing requirement was requested in the feature spec, so test tasks are omitted for this task list.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add dependencies and shared contracts needed by all stories.

- [x] T001 Add AI SDK dependencies (`ai`, `@openrouter/ai-sdk-provider`) to apps/platform-api/package.json
- [x] T002 Extend runtime configuration with OpenRouter variables in apps/platform-api/src/config/config.module.ts
- [x] T003 [P] Create shared iterations contract in packages/contracts/src/visualizations/iterations.contract.ts
- [x] T004 [P] Export visualizations contracts barrel in packages/contracts/src/visualizations/index.ts
- [x] T005 Export visualizations contracts from package root in packages/contracts/src/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build reusable AI module and orchestration infrastructure before story work.

**⚠️ CRITICAL**: No user story implementation should start before this phase is complete.

- [x] T006 Create AI module definition and exports in apps/platform-api/src/modules/ai/ai.module.ts
- [x] T007 [P] Implement OpenRouter-backed AI generation service in apps/platform-api/src/modules/ai/services/ai-generation.service.ts
- [x] T008 [P] Implement reusable prompt builder service in apps/platform-api/src/modules/ai/services/ai-prompt-builder.service.ts
- [x] T009 Register AI module in application module imports in apps/platform-api/src/app.module.ts
- [x] T010 Create iteration orchestration domain errors in apps/platform-api/src/modules/visualizations/errors/iteration-orchestration.errors.ts

**Checkpoint**: Foundation ready; user stories can now be implemented.

---

## Phase 3: User Story 1 - Generate a New Visualization Iteration (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated users to create a new iteration with uploaded images and receive a single generated result.

**Independent Test**: Submit a valid multipart iteration request for an owned visualization and verify one persisted new iteration with linked output asset.

- [x] T014 [US1] Extend iteration DTOs for create-iteration payload parsing in apps/platform-api/src/modules/visualizations/visualizations.dto.ts
- [x] T015 [US1] Add POST /visualizations/:visualizationId/iterations route in apps/platform-api/src/modules/visualizations/visualizations.controller.ts
- [x] T016 [P] [US1] Extend visualization iteration persistence fields in apps/platform-api/src/modules/visualizations/schemas/visualization.schema.ts
- [x] T017 [P] [US1] Add repository methods for sequence allocation and iteration append in apps/platform-api/src/modules/visualizations/repositories/visualizations.repository.ts
- [x] T018 [P] [US1] Add storage linkage helpers for iteration input/output assets in apps/platform-api/src/modules/storage/services/file-assets.service.ts
- [x] T019 [US1] Implement create iteration orchestration success flow in apps/platform-api/src/modules/visualizations/iterations/services/create-iteration.service.ts
- [x] T020 [US1] Integrate AI module generation and prompt builder in apps/platform-api/src/modules/visualizations/iterations/services/create-iteration.service.ts
- [x] T021 [US1] Register create iteration service provider in apps/platform-api/src/modules/visualizations/visualizations.module.ts
- [x] T022 [US1] Add create iteration response mapper aligned with contracts in apps/platform-api/src/modules/visualizations/iterations/mappers/create-iteration-response.mapper.ts

**Checkpoint**: User Story 1 should be independently functional as MVP.

---

## Phase 4: User Story 2 - Preserve Credit Fairness on Failure (Priority: P2)

**Goal**: Guarantee reserve/consume/compensate lifecycle so users are only charged for successful generation.

**Independent Test**: Force provider failure after reserve and verify compensation returns balance to pre-request state without duplicate side effects.

- [x] T023 [US2] Reserve credits before generation call in apps/platform-api/src/modules/visualizations/iterations/services/create-iteration.service.ts
- [x] T024 [US2] Consume credits only after successful iteration and output persistence in apps/platform-api/src/modules/visualizations/iterations/services/create-iteration.service.ts
- [x] T025 [US2] Compensate credits on generation or persistence failure paths in apps/platform-api/src/modules/visualizations/iterations/services/create-iteration.service.ts
- [x] T026 [US2] Map insufficient-credit and upstream failures to deterministic domain errors in apps/platform-api/src/modules/visualizations/errors/iteration-orchestration.errors.ts
- [x] T027 [US2] Persist failed iteration outcome and failure code assignment in apps/platform-api/src/modules/visualizations/repositories/visualizations.repository.ts

**Checkpoint**: User Story 2 should be independently verifiable on top of US1.

---

## Phase 5: User Story 3 - Ensure Reliable Ownership and Input Validation (Priority: P3)

**Goal**: Reject unauthorized or invalid iteration requests before side effects and enforce deterministic conflict handling.

**Independent Test**: Attempt unauthorized visualization access and invalid file uploads; verify deterministic error outcomes and no credit/storage side effects.

- [x] T028 [P] [US3] Reuse ownership validation for iteration writes in apps/platform-api/src/modules/visualizations/services/validate-visualization-ownership.service.ts
- [x] T029 [P] [US3] Add file policy validation (mime/size/count) for create iteration in apps/platform-api/src/modules/visualizations/visualizations.dto.ts
- [x] T030 [US3] Enforce validation and ownership checks before credit reservation in apps/platform-api/src/modules/visualizations/iterations/services/create-iteration.service.ts
- [x] T031 [US3] Enforce deterministic conflict handling for concurrent generation requests in apps/platform-api/src/modules/visualizations/iterations/services/create-iteration.service.ts
- [x] T032 [US3] Align 409/413/422 API error translation in apps/platform-api/src/modules/visualizations/visualizations.controller.ts

**Checkpoint**: All user stories are independently functional and validation-safe.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration polish and documentation updates across stories.

- [x] T033 [P] Document AI module architecture and env variables in apps/platform-api/README.md
- [x] T034 [P] Update backend implementation plan notes for WI-07 decisions in docs/platform-api-implementation-plan.md
- [x] T035 [P] Sync feature quickstart verification details in specs/004-iteration-generation-orchestration/quickstart.md
- [x] T036 Run lint/build validation commands for platform-api using scripts in apps/platform-api/package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user story phases.
- **Phase 3 (US1)**: Depends on Phase 2 completion.
- **Phase 4 (US2)**: Depends on Phase 3 core orchestration flow.
- **Phase 5 (US3)**: Depends on Phase 3 foundational infrastructure.
- **Phase 6 (Polish)**: Depends on completion of all desired user stories.

### User Story Dependencies

- **US1 (P1)**: First deliverable; no dependency on other user stories once foundational phase is complete.
- **US2 (P2)**: Depends on US1 create-iteration flow because it extends reserve/consume/compensate behavior.
- **US3 (P3)**: Depends on US1 route/service path and foundational validation building blocks.

### Dependency Graph

- Setup -> Foundational -> US1 -> US2
- Setup -> Foundational -> US1 -> US3
- US2 + US3 -> Polish

---

## Parallel Opportunities

- **Setup**: T003 and T004 can run in parallel after T001/T002 planning is clear.
- **Foundational**: T007 and T008 can run in parallel.
- **US1**: T016, T017, and T018 can run in parallel before final orchestration tasks.
- **US3**: T028 and T029 can run in parallel.
- **Polish**: T033, T034, and T035 can run in parallel.

### Parallel Example: User Story 1

- T016 in apps/platform-api/src/modules/visualizations/schemas/visualization.schema.ts
- T017 in apps/platform-api/src/modules/visualizations/repositories/visualizations.repository.ts
- T018 in apps/platform-api/src/modules/storage/services/file-assets.service.ts

### Parallel Example: User Story 3

- T028 in apps/platform-api/src/modules/visualizations/services/validate-visualization-ownership.service.ts
- T029 in apps/platform-api/src/modules/visualizations/visualizations.dto.ts

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate end-to-end creation flow from quickstart.
4. Demo/deploy MVP increment.

### Incremental Delivery

1. Deliver US1 (core generation orchestration).
2. Add US2 (credit fairness hardening).
3. Add US3 (ownership/validation hardening).
4. Finish with cross-cutting polish and docs.

### Parallel Team Strategy

1. Team A: AI module and provider setup (T006-T010).
2. Team B: Visualization persistence and storage linkage (T016-T019).
3. Team C: Validation and error hardening (T028-T032).
4. Merge through US1 -> US2/US3 checkpoints.

---

## Notes

- `[P]` tasks target separate files without unfinished dependencies.
- Story labels `[US1]`, `[US2]`, `[US3]` provide strict traceability to spec priorities.
- Keep repositories private to modules and expose only services across boundaries.
- Payments scope is intentionally excluded from this feature.
