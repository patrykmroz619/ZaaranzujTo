# Implementation Plan: Credits Balance and Reservation Core

**Branch**: `003-credits-reservation-core` | **Date**: 2026-03-21 | **Spec**: [specs/003-credits-reservation-core/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-credits-reservation-core/spec.md`

## Summary

Deliver WI-06 credits foundation in `platform-api`: read current balance, read active packages, and define deterministic credit reservation/consume/compensation behavior for downstream generation orchestration. The approach is contract-first, keeps repositories private to the `credits` module, enforces user isolation, guarantees idempotent credit side effects, and returns zero-valued balance when the user has no persisted credit account yet.

## Technical Context

**Language/Version**: TypeScript 5.9 with NestJS 11 on Bun runtime
**Primary Dependencies**: `@nestjs/common`, `@nestjs/core`, `@nestjs/mongoose`, `mongoose`, `nestjs-zod`, `zod`, `@clerk/backend`, `@repo/contracts`
**Storage**: MongoDB collections `credit_accounts` and `credit_ledger` (plus config-sourced package catalog)
**Testing**: Jest + Supertest for API verification; service-level deterministic flow verification (no new tests authored in planning)
**Target Platform**: `apps/platform-api` backend service in monorepo deployment
**Project Type**: Modular monolith REST web-service module
**Performance Goals**: 99% of successful credits read requests under 1 second during normal MVP load
**Constraints**: strict user isolation; zero-balance response for missing account; atomic balance updates under concurrency; idempotent mutation semantics for reservation lifecycle
**Scale/Scope**: MVP B2C workload, credits domain baseline supporting future generation and payments modules

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate

- **[PASS] Code Quality**: Plan preserves modular monolith boundaries and contract-first schemas; repositories stay private to `credits` module.
- **[PASS] Testing Standards**: Design remains testable by isolated services and stable contracts while honoring team rule to avoid writing tests unless explicitly requested.
- **[PASS] User Experience Consistency**: API contracts maintain predictable response and error shapes for frontend consumers.
- **[PASS] Performance Requirements**: Bounded reads and atomic updates are planned to keep API responsiveness and balance integrity.

### Post-Phase 1 Re-Check

- **[PASS] Code Quality**: Data model and contracts avoid cross-module leakage and keep service boundaries explicit.
- **[PASS] Testing Standards**: Research decisions and quickstart verification steps provide deterministic paths for later API/integration test coverage.
- **[PASS] User Experience Consistency**: Contracts include explicit zero-balance behavior to avoid ambiguous client fallback states.
- **[PASS] Performance Requirements**: Concurrency and idempotency strategy is documented with index and version-control guidance.

## Project Structure

### Documentation (this feature)

```text
specs/003-credits-reservation-core/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── credits.contract.ts
└── tasks.md
```

### Source Code (repository root)

```text
apps/platform-api/
└── src/
    ├── modules/
    │   ├── credits/
    │   │   ├── credits.module.ts
    │   │   ├── credits.controller.ts
    │   │   ├── credits.dto.ts
    │   │   ├── repositories/
    │   │   ├── schemas/
    │   │   └── services/
    │   └── users/
    │       └── services/
    └── shared/
        └── libs/

packages/contracts/
└── src/
    └── credits/
        └── credits.contract.ts
```

**Structure Decision**: Implement the feature in `apps/platform-api/src/modules/credits` with shared contracts mirrored into `packages/contracts` to keep frontend/backend schema parity and align with monorepo architecture rules.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
