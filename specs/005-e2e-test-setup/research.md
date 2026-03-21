# Phase 0: Research & Technical Unknowns

## 1. E2E Test Harness Shape for NestJS API

- **Decision:** Keep Jest + Supertest as the primary e2e stack and formalize a reusable app bootstrap helper for consistent test startup and teardown.
- **Rationale:** The project already uses Jest + Supertest (`test/jest-e2e.json`, `app.e2e-spec.ts`), so extending this baseline minimizes migration risk and onboarding cost.
- **Alternatives considered:** Introduce a new e2e framework. Rejected because it increases maintenance burden and fragments testing conventions.

## 2. Test Data Isolation Strategy

- **Decision:** Define fixture factories and deterministic cleanup conventions so each scenario manages only its owned data scope.
- **Rationale:** Deterministic isolation is the most effective control against flaky failures and cross-test interference.
- **Alternatives considered:** Shared mutable fixture data across scenarios. Rejected due to high collision risk in parallel or repeated runs.

## 3. Authentication Handling in E2E Scenarios

- **Decision:** Provide a shared auth-context helper that standardizes how authenticated requests are generated in tests.
- **Rationale:** Authentication setup is repeated in almost every protected endpoint scenario; centralizing this avoids copy/paste drift.
- **Alternatives considered:** Hand-roll auth setup in each test file. Rejected because it creates inconsistency and slower test authoring.

## 4. Unit Test Specification Scope

- **Decision:** Publish a unit-test standard focused on service-level business logic, naming conventions, given-when-then structure, and review criteria.
- **Rationale:** Clear standards improve first-pass review quality and lower subjective debates during PRs.
- **Alternatives considered:** Leave unit testing conventions implicit. Rejected because implicit conventions do not scale across multiple contributors.

## 5. Execution Profiles (Full vs Targeted Runs)

- **Decision:** Document two primary run profiles: full suite execution and targeted scenario execution by file/test-name filters.
- **Rationale:** Developers need fast local loops while still preserving a full-suite safety net.
- **Alternatives considered:** Full suite only. Rejected because slow loops discourage frequent test-driven verification.

## 6. Flaky Test Triage Policy

- **Decision:** Establish a lightweight policy: classify instability, isolate root cause, quarantine only with explicit issue tracking, and prioritize remediation.
- **Rationale:** Flakes erode trust quickly; policy-driven handling prevents silent accumulation.
- **Alternatives considered:** Allow ad-hoc retries without tracking. Rejected due to hidden quality degradation.
