# Tasks: Credits Balance and Reservation Core

**Input**: Design documents from `/specs/003-credits-reservation-core/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare module and contract scaffolding for WI-06 implementation.

- [x] T001 Create credits module folder structure in apps/platform-api/src/modules/credits/
- [x] T002 Create contract namespace folder in packages/contracts/src/credits/
- [x] T003 [P] Add credits feature barrel export in packages/contracts/src/index.ts
- [x] T004 [P] Add credits module registration in apps/platform-api/src/app.module.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build core persistence, configuration, and cross-module foundations required before user-story work.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Define credit account Mongoose schema in apps/platform-api/src/modules/credits/schemas/credit-account.schema.ts
- [x] T006 [P] Define credit ledger Mongoose schema in apps/platform-api/src/modules/credits/schemas/credit-ledger.schema.ts
- [x] T007 Implement credit accounts repository with atomic update methods in apps/platform-api/src/modules/credits/repositories/credit-accounts.repository.ts
- [x] T008 [P] Implement credit ledger append-only repository in apps/platform-api/src/modules/credits/repositories/credit-ledger.repository.ts
- [x] T009 Implement credit package config schema and loader in apps/platform-api/src/modules/credits/config/credit-packages.config.ts
- [x] T010 Implement credits domain error mapping in apps/platform-api/src/modules/credits/errors/credits.errors.ts
- [x] T011 Implement idempotency persistence abstraction for credit operations in apps/platform-api/src/modules/credits/repositories/credit-idempotency.repository.ts
- [x] T012 Wire repository and config providers in apps/platform-api/src/modules/credits/credits.module.ts

**Checkpoint**: Foundation ready; user story implementation can begin.

---

## Phase 3: User Story 1 - View Current Credit Balance (Priority: P1) 🎯 MVP

**Goal**: Authenticated user can retrieve balance summary, including zero-valued response when account does not exist.

**Independent Test**: Call `GET /credits/balance` with authenticated user having existing account and with new user lacking account; both return `200`, second returns zeros.

- [x] T013 [US1] Add balance request/response DTO schemas in apps/platform-api/src/modules/credits/credits.dto.ts
- [x] T014 [US1] Implement get balance service with virtual-zero fallback in apps/platform-api/src/modules/credits/services/get-balance.service.ts
- [x] T015 [US1] Implement credits balance controller endpoint in apps/platform-api/src/modules/credits/credits.controller.ts
- [x] T016 [P] [US1] Add contract mapping for balance response in apps/platform-api/src/modules/credits/mappers/credit-balance.mapper.ts
- [x] T017 [US1] Expose and export get balance service in apps/platform-api/src/modules/credits/credits.module.ts

**Checkpoint**: User Story 1 is independently functional and testable.

---

## Phase 4: User Story 2 - Browse Purchasable Credit Packages (Priority: P2)

**Goal**: Authenticated user can retrieve active package catalog from backend configuration.

**Independent Test**: Call `GET /credits/packages` with configured active/inactive packages and verify only active packages are returned.

- [x] T018 [US2] Add packages response DTO schema in apps/platform-api/src/modules/credits/credits.dto.ts
- [x] T019 [US2] Implement list active packages service in apps/platform-api/src/modules/credits/services/list-credit-packages.service.ts
- [x] T020 [US2] Implement credits packages controller endpoint in apps/platform-api/src/modules/credits/credits.controller.ts
- [x] T021 [P] [US2] Add package mapping and normalization utility in apps/platform-api/src/modules/credits/mappers/credit-package.mapper.ts
- [x] T022 [US2] Add startup validation for duplicate packageCode conflicts in apps/platform-api/src/modules/credits/config/credit-packages.config.ts

**Checkpoint**: User Stories 1 and 2 work independently.

---

## Phase 5: User Story 3 - Protect Credit Integrity During Generation (Priority: P3)

**Goal**: Credit reservation/consume/compensate services are deterministic, idempotent, and concurrency-safe for generation orchestration.

**Independent Test**: Execute reserve → consume and reserve → compensate flows with duplicate idempotency-key replays and conflicting replays; verify no duplicate side effects and stable balances.

- [x] T023 [US3] Add internal operation DTO schemas for reserve/consume/compensate in apps/platform-api/src/modules/credits/credits.dto.ts
- [x] T024 [US3] Implement reserve credit service with atomic account update and ledger write in apps/platform-api/src/modules/credits/services/reserve-credit.service.ts
- [x] T025 [US3] Implement consume credit service with idempotent terminal transition in apps/platform-api/src/modules/credits/services/consume-credit.service.ts
- [x] T026 [US3] Implement compensate credit service with idempotent terminal transition in apps/platform-api/src/modules/credits/services/compensate-credit.service.ts
- [x] T027 [US3] Implement shared reservation state transition guard in apps/platform-api/src/modules/credits/services/internal/reservation-transition.guard.ts
- [x] T028 [US3] Implement idempotency conflict detection and replay resolution in apps/platform-api/src/modules/credits/services/internal/credit-idempotency.service.ts
- [x] T029 [P] [US3] Add credits service exports for cross-module use in apps/platform-api/src/modules/credits/credits.module.ts
- [x] T030 [US3] Add operation-level structured logs for reserve/consume/compensate in apps/platform-api/src/modules/credits/services/internal/credits-operations.logger.ts

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, docs alignment, and readiness checks across all stories.

- [x] T031 [P] Sync finalized credits contracts to shared package in packages/contracts/src/credits/credits.contract.ts
- [x] T032 Update credits API behavior in docs/platform-api-rest-api-plan.md
- [x] T033 [P] Update WI-06 implementation notes in docs/platform-api-implementation-plan.md
- [x] T034 Run quickstart verification scenarios from specs/003-credits-reservation-core/quickstart.md and document outcomes in specs/003-credits-reservation-core/checklists/requirements.md
- [x] T035 Run lint/typecheck/build for platform-api and contracts using Bun scripts in apps/platform-api/package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies; start immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3 (US1)**: Depends on Phase 2.
- **Phase 4 (US2)**: Depends on Phase 2; can run in parallel with US1 after shared DTO/controller merge planning.
- **Phase 5 (US3)**: Depends on Phase 2 and US1 foundations (`get-balance`, account repository primitives).
- **Phase 6 (Polish)**: Depends on completion of desired user stories.

### User Story Dependencies

- **US1 (P1)**: No dependency on other user stories after foundational phase.
- **US2 (P2)**: No strict dependency on US1 business logic; only shared module files coordination.
- **US3 (P3)**: Depends on foundational persistence/idempotency and benefits from US1 balance primitives.

### Within Each User Story

- DTO/contracts before service logic.
- Service logic before controller wiring.
- Mapper/utilities can run in parallel when they touch separate files.
- Cross-module exports only after service behavior is stable.

### Parallel Opportunities

- Setup: T003, T004 parallel.
- Foundational: T006, T008 parallel after T005 starts; T009 and T010 parallel.
- US1: T016 parallel with T014.
- US2: T021 parallel with T019.
- US3: T029 parallel with T030 after core services are in place.
- Polish: T031 and T033 parallel.

---

## Parallel Example: User Story 1

```bash
Task: T014 Implement get balance service with virtual-zero fallback in apps/platform-api/src/modules/credits/services/get-balance.service.ts
Task: T016 Add contract mapping for balance response in apps/platform-api/src/modules/credits/mappers/credit-balance.mapper.ts
```

## Parallel Example: User Story 2

```bash
Task: T019 Implement list active packages service in apps/platform-api/src/modules/credits/services/list-credit-packages.service.ts
Task: T021 Add package mapping and normalization utility in apps/platform-api/src/modules/credits/mappers/credit-package.mapper.ts
```

## Parallel Example: User Story 3

```bash
Task: T029 Add credits service exports for cross-module use in apps/platform-api/src/modules/credits/credits.module.ts
Task: T030 Add operation-level structured logs for reserve/consume/compensate in apps/platform-api/src/modules/credits/services/internal/credits-operations.logger.ts
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate balance endpoint behavior including zero-account fallback.
4. Demo/deploy MVP read-balance slice.

### Incremental Delivery

1. Finish Setup + Foundational once.
2. Deliver US1 (balance), validate independently.
3. Deliver US2 (packages), validate independently.
4. Deliver US3 (reservation integrity), validate independently.
5. Run polish and documentation alignment.

### Parallel Team Strategy

1. Team collaborates on Setup + Foundational.
2. After foundational checkpoint:
   - Developer A: US1 balance read flow.
   - Developer B: US2 package catalog flow.
   - Developer C: US3 operation services.
3. Merge story slices after independent verification.

---

## Notes

- All tasks follow checklist format: `- [ ] T### [P?] [US?] Description with file path`.
- `[US#]` labels appear only in user-story phases.
- Tests were not added because the feature spec does not explicitly request TDD/test-task generation.
- Use Bun scripts for build/lint execution in this repository.
