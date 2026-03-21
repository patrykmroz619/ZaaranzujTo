# API Test Enablement Foundation Data Model

## Overview

This feature models test-design artifacts and execution entities needed to scale `platform-api` test authoring for both e2e and unit tests.

## Entities

### E2E Test Suite

| Field        | Type     | Required | Notes                                 |
| ------------ | -------- | -------- | ------------------------------------- |
| `suiteName`  | string   | Yes      | Human-readable suite identifier       |
| `scope`      | enum     | Yes      | `smoke`, `module`, `cross-module`     |
| `entryFiles` | string[] | Yes      | Scenario file paths included in suite |
| `runProfile` | enum     | Yes      | `full`, `targeted`                    |

Validation rules:

- `suiteName` must be unique within API test scope.
- `entryFiles` must reference existing scenario files.

### E2E Test Scenario

| Field             | Type     | Required | Notes                                           |
| ----------------- | -------- | -------- | ----------------------------------------------- |
| `scenarioId`      | string   | Yes      | Stable identifier for traceability              |
| `module`          | string   | Yes      | Owning API module (`credits`, `projects`, etc.) |
| `title`           | string   | Yes      | Behavior-oriented title                         |
| `preconditions`   | string[] | Yes      | Required test state and fixtures                |
| `action`          | string   | Yes      | HTTP request or workflow trigger                |
| `expectedOutcome` | string[] | Yes      | Assertions over status/body/side-effects        |
| `cleanupPolicy`   | enum     | Yes      | `automatic`, `explicit`                         |

Validation rules:

- `scenarioId` must be unique in the suite.
- `expectedOutcome` must include at least one externally visible result.

### Test Utility

| Field            | Type     | Required | Notes                                                  |
| ---------------- | -------- | -------- | ------------------------------------------------------ |
| `utilityName`    | string   | Yes      | Shared helper identifier                               |
| `category`       | enum     | Yes      | `bootstrap`, `auth`, `fixture`, `cleanup`, `assertion` |
| `inputContract`  | string[] | Yes      | Required inputs and assumptions                        |
| `outputContract` | string[] | Yes      | Returned objects/effects                               |
| `failureMode`    | string[] | Yes      | Defined failure behaviors                              |

Validation rules:

- Utility behavior must be deterministic for same inputs.
- Side effects must be documented and reversible where applicable.

### Unit Test Standard

| Field                 | Type     | Required | Notes                                          |
| --------------------- | -------- | -------- | ---------------------------------------------- |
| `namingConvention`    | string   | Yes      | File/test-name pattern guidance                |
| `structurePattern`    | string   | Yes      | Recommended `arrange-act-assert` or equivalent |
| `coverageExpectation` | string[] | Yes      | Minimum business-path expectations             |
| `reviewChecklist`     | string[] | Yes      | Criteria for PR review                         |

Validation rules:

- Coverage expectations must be behavior-focused, not implementation-coupled.
- Review checklist items must be objectively verifiable.

### Test Run Result

| Field             | Type     | Required | Notes                          |
| ----------------- | -------- | -------- | ------------------------------ |
| `runId`           | string   | Yes      | Execution correlation id       |
| `profile`         | enum     | Yes      | `full` or `targeted`           |
| `scenarioResults` | object[] | Yes      | Per-scenario pass/fail details |
| `failedCount`     | number   | Yes      | Number of failed scenarios     |
| `durationMs`      | number   | Yes      | Total run time                 |

Validation rules:

- `failedCount` must match count of failed scenario results.
- `durationMs` must be non-negative integer.

## Relationships

- One `E2E Test Suite` contains many `E2E Test Scenario` entries.
- Many `E2E Test Scenario` entries may reuse one `Test Utility`.
- One `Unit Test Standard` governs many module-level unit test files.
- One `Test Run Result` is produced for each suite execution profile.

## State Transitions

### Scenario Lifecycle

1. `Draft` -> scenario skeleton defined with preconditions and expected outcomes.
2. `Runnable` -> scenario executes and produces deterministic pass/fail output.
3. `Stable` -> scenario passes repeatedly under expected profiles.
4. `Quarantined` (exception state) -> scenario marked unstable with tracked remediation issue.
5. `Retired` -> scenario replaced or removed due to obsolete behavior.

Transition rules:

- `Quarantined` requires explicit reason and follow-up owner.
- `Stable` requires at least one successful run in full profile after changes.
