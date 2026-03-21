# Implementation Plan: Iteration Generation Orchestration

**Branch**: `004-iteration-generation-orchestration` | **Date**: 2026-03-21 | **Spec**: [specs/004-iteration-generation-orchestration/spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-iteration-generation-orchestration/spec.md`

## Summary

Deliver WI-07 by implementing a single iteration write flow with multipart upload, AI generation, and strict credit reservation lifecycle guarantees. The technical approach introduces a reusable `ai` module in `platform-api` that exposes a service abstraction for LLM/image generation and internally uses AI SDK with the OpenRouter provider package. The orchestration flow remains ownership-safe and compensation-safe across partial failures.

## Technical Context

**Language/Version**: TypeScript 5.9 with NestJS 11 on Bun runtime
**Primary Dependencies**: `@nestjs/common`, `@nestjs/platform-express`, `@nestjs/mongoose`, `mongoose`, `nestjs-zod`, `zod`, `@repo/contracts`, `ai`, `@openrouter/ai-sdk-provider`
**Storage**: MongoDB (`visualizations`, `file_assets`, credits collections), object storage metadata for uploaded/generated files
**Testing**: Jest + Supertest for API verification and service-level orchestration verification
**Target Platform**: `apps/platform-api` backend service (REST API) in monorepo
**Project Type**: Modular monolith web-service module
**Performance Goals**: Under normal MVP load, 95% of valid iteration requests complete with final outcome in 30 seconds
**Constraints**: strict user ownership isolation, credit neutrality on failed generation, bounded upload validation before generation call, reusable AI integration module
**Scale/Scope**: MVP generation workflow for authenticated users creating iterations within existing projects/visualizations

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

### Pre-Phase 0 Gate

- **[PASS] Code Quality**: Plan enforces module boundaries, exports services (not repositories), and isolates provider-specific AI logic inside a reusable `ai` module.
- **[PASS] Testing Standards**: Design keeps orchestration deterministic and testable while respecting workspace rule to avoid writing tests unless explicitly requested.
- **[PASS] User Experience Consistency**: Error and success contracts are explicit for retries, failures, and insufficient credits to keep frontend handling consistent.
- **[PASS] Performance Requirements**: Upload validation before provider calls avoids unnecessary compute and costs.

### Post-Phase 1 Re-Check

- **[PASS] Code Quality**: Data model and contracts keep `visualizations`, `storage`, `credits`, and new `ai` responsibilities separated with one-way dependencies.
- **[PASS] Testing Standards**: Quickstart defines deterministic verification for success and failure compensation paths.
- **[PASS] User Experience Consistency**: Contracts define predictable status and error categories across orchestration states.
- **[PASS] Performance Requirements**: Research-backed provider integration and failure handling preserve bounded processing and stable retry behavior.

## Project Structure

### Documentation (this feature)

```text
specs/004-iteration-generation-orchestration/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── iterations.contract.ts
└── tasks.md
```

### Source Code (repository root)

```text
apps/platform-api/
└── src/
    ├── modules/
    │   ├── ai/
    │   │   ├── ai.module.ts
    │   │   └── services/
    │   │       ├── ai-generation.service.ts
    │   │       └── ai-prompt-builder.service.ts
    │   ├── visualizations/
    │   │   ├── iterations/
    │   │   │   └── services/
    │   │   │       └── create-iteration.service.ts
    │   │   ├── visualizations.controller.ts
    │   │   └── visualizations.dto.ts
    │   ├── storage/
    │   │   ├── repositories/
    │   │   └── services/
    │   └── credits/
    │       └── services/
    └── shared/
        ├── exception-handling/
        └── request-context/

packages/contracts/
└── src/
    └── visualizations/
        └── iterations.contract.ts
```

**Structure Decision**: Extend existing `visualizations` module for iteration write orchestration, add a dedicated reusable `ai` module for all provider interactions, and keep cross-module communication at service boundaries while contracts stay shareable in `packages/contracts`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
