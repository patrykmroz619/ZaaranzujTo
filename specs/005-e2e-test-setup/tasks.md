# Tasks: API Test Enablement Foundation

**Input**: Design documents from `/specs/005-e2e-test-setup/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/, quickstart.md

**Tests**: This feature explicitly requests e2e testing setup and unit-testing standards, so test-related tasks are included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create baseline structure and command surface for test enablement work.

- [ ] T001 Create e2e support folders in apps/platform-api/test/helpers, apps/platform-api/test/fixtures, and apps/platform-api/test/setup
- [ ] T002 Add centralized e2e test entry barrel in apps/platform-api/test/helpers/index.ts
- [ ] T003 [P] Add e2e environment template in apps/platform-api/test/.env.test.example
- [ ] T004 [P] Document local test prerequisites in apps/platform-api/test/README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish deterministic harness and shared contracts that all stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T005 Implement reusable Nest app bootstrap helper in apps/platform-api/test/setup/create-test-app.ts
- [ ] T006 [P] Implement shared test lifecycle hooks in apps/platform-api/test/setup/test-lifecycle.ts
- [ ] T007 [P] Implement scenario metadata contract types in apps/platform-api/test/helpers/scenario-metadata.ts
- [ ] T008 Implement auth request helper scaffold in apps/platform-api/test/helpers/auth-request.ts
- [ ] T009 [P] Implement deterministic fixture factory helpers in apps/platform-api/test/fixtures/factory.ts
- [ ] T010 Configure e2e Jest setup references in apps/platform-api/test/jest-e2e.json

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel.

---

## Phase 3: User Story 1 - Run E2E Tests Quickly (Priority: P1) 🎯 MVP

**Goal**: Developers can run a ready-to-use e2e baseline and add one new scenario without infrastructure work.

**Independent Test**: On a fresh checkout, run the documented e2e command and verify smoke scenarios pass with clear per-scenario output.

### Implementation for User Story 1

- [ ] T011 [US1] Replace legacy app e2e bootstrap with shared setup usage in apps/platform-api/test/app.e2e-spec.ts
- [ ] T012 [P] [US1] Add health smoke e2e scenario in apps/platform-api/test/health.e2e-spec.ts
- [ ] T013 [P] [US1] Add protected-route unauthorized scenario in apps/platform-api/test/profile-auth.e2e-spec.ts
- [ ] T014 [US1] Add scenario naming/tagging conventions to apps/platform-api/test/README.md
- [ ] T015 [US1] Add targeted run examples and profile commands to apps/platform-api/package.json
- [ ] T016 [US1] Align feature quickstart run instructions in specs/005-e2e-test-setup/quickstart.md

**Checkpoint**: User Story 1 is independently runnable and demonstrates baseline e2e value.

---

## Phase 4: User Story 2 - Reuse Test Utilities (Priority: P2)

**Goal**: Shared utilities are used across multiple scenarios to avoid duplicate setup logic.

**Independent Test**: Create two scenarios in different files that both consume shared bootstrap/auth/fixture helpers and pass in targeted runs.

### Implementation for User Story 2

- [ ] T017 [US2] Implement reusable cleanup helper in apps/platform-api/test/helpers/cleanup.ts
- [ ] T018 [P] [US2] Implement reusable request assertion helpers in apps/platform-api/test/helpers/assertions.ts
- [ ] T019 [P] [US2] Implement reusable seeded test-user fixture helper in apps/platform-api/test/fixtures/test-user.fixture.ts
- [ ] T020 [US2] Refactor health scenario to shared utility usage in apps/platform-api/test/health.e2e-spec.ts
- [ ] T021 [US2] Refactor profile auth scenario to shared utility usage in apps/platform-api/test/profile-auth.e2e-spec.ts
- [ ] T022 [US2] Add utility usage examples and failure-mode guidance in apps/platform-api/test/README.md

**Checkpoint**: User Story 2 utilities are proven by reuse across multiple scenarios.

---

## Phase 5: User Story 3 - Follow Unit Test Specification (Priority: P3)

**Goal**: Developers can follow one clear standard to write and review service-level unit tests.

**Independent Test**: A developer writes a new unit test using only the standard doc and passes review against explicit criteria.

### Implementation for User Story 3

- [ ] T023 [US3] Publish unit-test standard guide in apps/platform-api/test/UNIT_TESTING_STANDARD.md
- [ ] T024 [P] [US3] Add unit test checklist template in apps/platform-api/test/templates/unit-test-checklist.md
- [ ] T025 [P] [US3] Add unit test example skeleton in apps/platform-api/test/templates/service-unit.spec.ts.template
- [ ] T026 [US3] Add reviewer criteria section to specs/005-e2e-test-setup/contracts/unit-test-standard-contract.md
- [ ] T027 [US3] Link unit-test standard from apps/platform-api/README.md

**Checkpoint**: User Story 3 establishes an enforceable and reusable unit-test writing standard.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final consistency, stability, and onboarding polish across all stories.

- [ ] T028 [P] Add flaky-test triage and quarantine workflow in apps/platform-api/test/README.md
- [ ] T029 Validate quickstart end-to-end workflow and update commands in specs/005-e2e-test-setup/quickstart.md
- [ ] T030 [P] Add troubleshooting matrix for setup/auth/db failures in apps/platform-api/test/README.md
- [ ] T031 Run final formatting and lint alignment for touched test files in apps/platform-api/package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): No dependencies, starts immediately.
- Foundational (Phase 2): Depends on Phase 1 completion and blocks all user stories.
- User Stories (Phases 3-5): Depend on Phase 2 completion.
- Polish (Phase 6): Depends on completion of selected user stories.

### User Story Dependencies

- US1 (P1): Starts after Foundational phase, no dependency on US2 or US3.
- US2 (P2): Starts after Foundational phase; can build on US1 scenario files but remains independently testable.
- US3 (P3): Starts after Foundational phase; documentation-first and independent of US1/US2 execution.

### Dependency Graph (Story Completion Order)

- Foundational -> US1 -> US2 -> US3
- Foundational -> US3 (can proceed in parallel when staffed)

---

## Parallel Execution Opportunities

- Phase 1: T003 and T004 can run in parallel after T001.
- Phase 2: T006, T007, and T009 can run in parallel after T005 scaffolding exists.
- US1: T012 and T013 can run in parallel, then converge on T014-T016.
- US2: T018 and T019 can run in parallel, then converge on T020-T022.
- US3: T024 and T025 can run in parallel after T023.
- Polish: T028 and T030 can run in parallel.

## Parallel Example: User Story 1

```bash
# Parallelizable US1 tasks
T012 apps/platform-api/test/health.e2e-spec.ts
T013 apps/platform-api/test/profile-auth.e2e-spec.ts
```

## Parallel Example: User Story 2

```bash
# Parallelizable US2 utility tasks
T018 apps/platform-api/test/helpers/assertions.ts
T019 apps/platform-api/test/fixtures/test-user.fixture.ts
```

## Parallel Example: User Story 3

```bash
# Parallelizable US3 documentation templates
T024 apps/platform-api/test/templates/unit-test-checklist.md
T025 apps/platform-api/test/templates/service-unit.spec.ts.template
```

---

## Implementation Strategy

### MVP First (US1 only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 (US1).
3. Validate independent test for US1 via baseline run and one added scenario.
4. Demo and gather feedback before expanding utilities.

### Incremental Delivery

1. Foundation first (Phases 1-2).
2. Deliver US1 runnable baseline.
3. Deliver US2 utility reuse and refactor.
4. Deliver US3 unit-testing standards.
5. Finish with cross-cutting polish.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. After foundation:
   - Engineer A executes US1 scenarios.
   - Engineer B executes US2 shared utility work.
   - Engineer C executes US3 unit-standard documentation/templates.
3. Converge on Phase 6 polish and final quickstart validation.
