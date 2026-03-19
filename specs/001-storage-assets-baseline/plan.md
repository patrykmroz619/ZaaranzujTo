# Implementation Plan: Storage and File Assets Baseline

**Branch**: `001-storage-assets-baseline` | **Date**: 2026-03-19 | **Spec**: [specs/001-storage-assets-baseline/spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-storage-assets-baseline/spec.md`

## Summary

Deliver a secure backend abstraction in `platform-api` to manage uploaded assets securely. We will build a unified `storage` NestJS module encompassing a `FileAsset` MongoDB schema, an isolated `@aws-sdk/client-s3`-based service to interface with Cloudflare R2, and controllers to provide secure pre-signed download URLs exclusively to the rightful owners of uploaded files. This implements WI-04 from the roadmap.

## Technical Context

**Language/Version**: TypeScript / NestJS 10 / Bun
**Primary Dependencies**: `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`, `mongoose`, `zod`
**Storage**: MongoDB (file metadata via Mongoose), Cloudflare R2 (blob storage mapping)
**Testing**: Jest
**Target Platform**: Node.js/Bun Backend API (`apps/platform-api`)
**Project Type**: NestJS Controller / Service / Repository Module
**Performance Goals**: <500ms p95 for signed URLs
**Constraints**: 1 hour signed URL expiration, cross-tenant isolation enforcement
**Scale/Scope**: System-level storage abstraction.

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

- **[PASS] Code Quality**: We adhere to the NestJS boundary rules and prefer descriptive TS types mapping to Zod contracts.
- **[PASS] Testing Standards**: Abstraction of `StorageService` using AWS SDK enables future unit test stubbing. Strict error boundaries included (Not Found / Unauthorized).
- **[PASS] User Experience Consistency**: Follows standard REST conventions with uniform `ZodValidationPipe` globally.
- **[PASS] Performance Requirements**: S3 Signed URL generation is executed entirely locally (offline/CPU bound without network dispatch to R2), guaranteeing highly responsive execution well under 500ms. MongoDB querying is strictly indexed.

## Project Structure

### Documentation (this feature)

```text
specs/001-storage-assets-baseline/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
packages/contracts/
└── src/
    └── storage/
        ├── index.ts
        └── storage.contract.ts      # Validations and typings

apps/platform-api/
└── src/
    └── modules/
        └── storage/
            ├── storage.module.ts
            ├── controllers/
            │   └── storage.controller.ts
            ├── services/
            │   ├── file-assets.service.ts
            │   └── cloud-storage.service.ts
            ├── schemas/
            │   └── file-asset.schema.ts
            └── repositories/
                └── file-assets.repository.ts
```

**Structure Decision**: A dedicated `storage/` NestJS module inside `platform-api` to cleanly separate physical file logic and R2 pointers away from primary business domain modules. Shared contracts will be placed strictly in `packages/contracts/src/storage` to be globally accessible in the Turborepo workspace.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| N/A       | N/A        | N/A                                  |
