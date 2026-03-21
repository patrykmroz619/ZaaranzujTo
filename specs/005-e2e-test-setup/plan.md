# Implementation Plan: API Test Enablement Foundation

**Branch**: `005-e2e-test-setup` | **Date**: 2026-03-21 | **Spec**: [specs/005-e2e-test-setup/spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-e2e-test-setup/spec.md`

## Summary

Establish a developer-friendly testing foundation for `platform-api` by introducing a stable e2e test harness, shared test utilities, and a concrete unit-testing specification. The approach builds on existing NestJS + Jest + Supertest setup, adds deterministic data/setup conventions, and provides runbook-quality documentation so developers can quickly add and maintain both e2e and unit tests.

## Technical Context

**Language/Version**: TypeScript 5.9 with NestJS 11 (Bun-managed monorepo)
**Primary Dependencies**: `@nestjs/testing`, `jest`, `ts-jest`, `supertest`, `@types/jest`, `@types/supertest`
**Storage**: MongoDB-backed API modules; e2e baseline relies on isolated test data strategy in non-production environment
**Testing**: Jest 30 + Supertest with `test/jest-e2e.json`; unit tests use Jest module-level specs
**Target Platform**: `apps/platform-api` service in local developer environment and CI pipelines
**Project Type**: Modular monolith REST backend
**Performance Goals**: Baseline e2e smoke suite completes in under 3 minutes locally; targeted test runs complete in under 45 seconds for one scenario
**Constraints**: Deterministic outcomes across repeated runs; no production data usage; strict auth/context isolation per scenario
**Scale/Scope**: Initial rollout focused on highest-value API paths (health/auth/profile/projects/credits/visualizations entry flows), with conventions scalable to full API suite

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate

- **[PASS] Code Quality**: Plan keeps changes modular (`apps/platform-api/test` + docs artifacts), enforces explicit naming/structure conventions, and avoids ad-hoc one-off test setup.
- **[PASS] Testing Standards**: Feature directly strengthens testability with reusable harness/utilities and a unit-test standard; no conflict with current project rule about writing tests only when requested.
- **[PASS] User Experience Consistency**: API test contracts preserve stable response/error envelopes expected by frontend consumers.
- **[PASS] Performance Requirements**: Test execution profiles and targeted runs are planned to keep local feedback loops fast.

### Post-Phase 1 Re-Check

- **[PASS] Code Quality**: Data model and contracts define clear ownership for test artifacts and avoid cross-module coupling.
- **[PASS] Testing Standards**: Research + quickstart provide deterministic test workflows and reviewer-ready criteria.
- **[PASS] User Experience Consistency**: Contracts include error and auth handling checks that align with expected API behavior.
- **[PASS] Performance Requirements**: Run profiles and isolation rules minimize flaky reruns and control suite duration growth.

## Project Structure

### Documentation (this feature)

```text
specs/005-e2e-test-setup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── e2e-scenario-contract.md
│   └── unit-test-standard-contract.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/platform-api/
├── src/
│   ├── app.module.ts
│   ├── main.ts
│   ├── modules/
│   │   ├── health/
│   │   ├── profile/
│   │   ├── projects/
│   │   ├── credits/
│   │   ├── storage/
│   │   └── visualizations/
│   └── shared/
└── test/
  ├── app.e2e-spec.ts
  ├── jest-e2e.json
  ├── helpers/
  ├── fixtures/
  └── setup/

specs/005-e2e-test-setup/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
```

**Structure Decision**: Keep all executable test harness artifacts under `apps/platform-api/test` and keep planning/specification artifacts under `specs/005-e2e-test-setup`. This preserves the monorepo modular boundaries and keeps test ownership local to the API workspace.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
