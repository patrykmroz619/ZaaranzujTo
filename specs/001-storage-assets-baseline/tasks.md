# Implementation Tasks: Storage and File Assets Baseline

**Feature**: `001-storage-assets-baseline`
**Strategy**: MVP First. We will establish the repository and cloud service, then implement secure pre-signed URLs, followed by metadata tracking.

## Phase 1: Setup

- [ ] T001 Export provided Zod contracts by creating `packages/contracts/src/storage/index.ts` and exporting `storage.contract.ts`
- [ ] T002 Install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` as dependencies in `apps/platform-api/package.json`

## Phase 2: Foundational

- [ ] T003 Create `FileAsset` schema using Mongoose in `apps/platform-api/src/modules/storage/schemas/file-asset.schema.ts` based on data-model.md
- [ ] T004 Create `FileAssetsRepository` in `apps/platform-api/src/modules/storage/repositories/file-assets.repository.ts` to manage MongoDB persistence
- [ ] T005 [P] Create `CloudStorageService` base structure in `apps/platform-api/src/modules/storage/services/cloud-storage.service.ts` using external S3 SDK setup
- [ ] T006 Create `StorageModule` registering the models, repositories, and services in `apps/platform-api/src/modules/storage/storage.module.ts` and import into `app.module.ts`

## Phase 3: [US1] Secure File Download

**Goal**: Securely fetch pre-signed URLs for authenticated users ensuring access control.
**Independent Test**: Mock a requested file asset ID and generate a localized offline signed URL validating that it expires in 3600 seconds.

- [ ] T007 [US1] Implement `getSignedUrl` capability in `apps/platform-api/src/modules/storage/services/cloud-storage.service.ts` utilizing `s3-request-presigner`
- [ ] T008 [US1] Implement `generateDownloadUrl` business logic in `apps/platform-api/src/modules/storage/services/file-assets.service.ts` verifying user ownership
- [ ] T009 [US1] Expose `GET /storage/assets/:id/download-url` in `apps/platform-api/src/modules/storage/controllers/storage.controller.ts` returning `TSignedUrlResponse`

## Phase 4: [US2] File Metadata Tracking

**Goal**: Persist standard metadata for assets so downstream processes can depend on file validation.
**Independent Test**: Register a file asset by passing its constraints, and fetch it from the database yielding exact metrics.

- [ ] T010 [US2] Implement `registerFileAsset` logic inside `apps/platform-api/src/modules/storage/services/file-assets.service.ts` creating a database record.
- [ ] T011 [US2] (Optional) Expose `GET /storage/assets/:id` in `apps/platform-api/src/modules/storage/controllers/storage.controller.ts` to fetch `TFileAssetResponse`

## Phase 5: Polish & Cross-Cutting Concerns

- [ ] T012 Add necessary environment keys (R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME) to `apps/platform-api/.env.example` and validate them in ConfigModule.

## Execution Requirements

- Tasks should be executed sequentially by ID.
- Parallel execution: [P] tasks can be executed simultaneously.

