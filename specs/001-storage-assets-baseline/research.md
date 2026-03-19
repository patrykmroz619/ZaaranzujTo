# Phase 0: Research & Technical Unknowns

## 1. Cloudflare R2 Integration

- **Decision:** Use `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` via an abstracted `StorageService` in NestJS.
- **Rationale:** Cloudflare R2 is fully S3-compatible. The official AWS SDK standardizes the `GetObjectCommand` and `getSignedUrl` methods cleanly, and allows mocking or switching to another S3-compatible cloud.
- **Alternatives considered:** Calling Cloudflare's HTTP API directly. Rejected because it requires manually forming and signing complex AWS v4 signatures. Use standard tooling.

## 2. NestJS Module Structure

- **Decision:** Create a cohesive `storage` module inside `apps/platform-api/src/modules/storage`. This will contain `services/storage.service.ts`, `schemas/file-asset.schema.ts`, `repositories/file-assets.repository.ts`, and `storage.controller.ts`.
- **Rationale:** Keeps file management, physical storage connection, and persistence boundary completely isolated from business domains like `visualizations` and `projects`.
- **Alternatives considered:** Grouping file logic directly into projects/visualizations. Rejected as it violates the Blueprint's isolation strategy.

## 3. Storage Metadata Contract

- **Decision:** Shared Zod schemas in `packages/contracts/src/storage` for standardizing asset IDs, creation outputs, and signed URL responses.
- **Rationale:** Enforces strict validation rules between frontend requests and backend logic. Consistent with existing `packages/contracts` layout.
- **Alternatives considered:** Using inline `class-validator` DTOs. Rejected because we must share contracts with frontend components.
