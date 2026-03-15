# Platform API — Implementation Plan

## 1. Scope and Inputs

This plan is based on (IMPORTANT: read these documents for context before implementation):

- `docs/prd.md`
- `docs/platform-api-rest-api-plan.md`
- `docs/platform-api-modular-monolith-blueprint.md`
- `docs/tech-stack.md`
- `docs/mongodb-data-model-design.md`
- current code state in `apps/platform-api`

Goal: deliver the MVP backend as a NestJS modular monolith, in the most efficient order, with **payments implemented at the end**.

---

## 2. Current State Analysis (as-is)

### Already implemented

- App bootstrap with global prefix `/api/v1`, CORS, and global `ZodValidationPipe`.
- Config module with runtime validation.
- MongoDB connection module.
- Basic auth guard (Clerk token verification + local skip mode).
- `users` module with Mongoose schema + repository.
- `profile` module with `GET /me` and profile update flow.

### Key gaps vs target blueprint and REST plan

- Missing domain modules: `credits`, `payments`, `projects`, `visualizations`, `storage`.
- `users` exports repository directly (target requires exporting services only).
- Duplicate file in profile module: `modules/profile/me-profile.service.ts` (outside `services/`).
- API mismatch: profile update endpoint is `PATCH /me/profile`, target plan is `PATCH /me`.
- No health endpoint.
- No shared technical package structure from blueprint (`pipes`, `decorators`, `interceptors`, `errors`, constants).
- No schemas/repositories for collections defined in Mongo design (`projects`, `visualizations`, `credit_accounts`, `credit_ledger`, `payments`, `file_assets`).
- No idempotency handling, webhook handling, credit reservation/compensation flow, upload flow, or signed URL flow.
- Existing e2e test is outdated (expects `GET /` returning `Hello World!`).

---

## 3. Delivery Strategy and Sequencing

### Sequencing principles

1. Build stable platform foundations first (config, shared infra, module boundaries).
2. Implement core user workspace value before monetization (projects + visualizations + storage + credits).
3. Implement payments last, after credits are stable, so payment confirmation can safely top up balances.
4. Keep each work item independently testable and mergeable.

### Suggested milestone order

1. Foundation and architecture alignment
2. User/Profile hardening
3. Projects
4. Storage
5. Visualizations (metadata + iterations)
6. Credits
7. Generation orchestration with credit reservation
8. **Payments (last feature)**
9. Hardening and release readiness

---

## 4. Work Items (ordered implementation backlog)

## WI-01 — Foundation and Architecture Alignment

**Objective:** align current codebase with blueprint conventions and create reusable technical base.

**Actions**

- Add public health endpoint `GET /health`.
- Introduce shared structure under `shared/libs`: `pipes`, `decorators`, `interceptors`, `errors`, `constants`.
- Add `CurrentUser` decorator and migrate controllers away from `@Req()` where practical.
- Introduce consistent app error mapping (`ErrorObject` shape from REST plan).
- Add request logging interceptor and requestId propagation.
- Add module tokens/constants where useful to prevent accidental circular imports.
- Update bootstrap for global filters/interceptors.

**Definition of Done**

- Health endpoint works.
- Shared technical primitives exist and are used by at least profile module.
- Error responses follow a consistent shape.

**Dependencies:** none.

---

## WI-02 — Users and Profile Refactor

**Objective:** make current user/profile implementation compliant with module boundary rules and API contract.

**Actions**

- Replace exported `UsersRepository` with exported `users/services/*` use-case services:
  - `get-user-by-clerk-id.service.ts`
  - `create-user-if-missing.service.ts`
  - optional `update-user-profile.service.ts`
- Keep repository private to `users` module.
- Remove duplicate `modules/profile/me-profile.service.ts`; keep `services/` version only.
- Adjust profile controller routes to REST plan:
  - `GET /me`
  - `PATCH /me`
- Prepare placeholder service for future `DELETE /me` account deletion flow (or mark explicitly as pending if postponed).
- Align DTO contracts with `@repo/contracts` and ensure zod validation is strict.

**Definition of Done**

- `profile` no longer depends on `UsersRepository` directly.
- Duplicate service removed.
- Profile endpoints match planned paths.

**Dependencies:** WI-01.

---

## WI-03 — Projects Module (CRUD + Pagination)

**Objective:** deliver project management API needed by dashboard and workspace navigation.

**Actions**

- Create `projects` module with schema, repository, dto, controller, services.
- Implement endpoints:
  - `GET /projects`
  - `POST /projects`
  - `GET /projects/{projectId}`
  - `PATCH /projects/{projectId}`
  - `DELETE /projects/{projectId}`
- Enforce per-user ownership filtering (`userId` isolation).
- Add sorting/pagination primitives and response model.
- Add basic `visualizationsCount` computation strategy (initially persisted or computed per query; choose one and keep consistent).

**Definition of Done**

- Full project CRUD works for authenticated user with isolation.
- DTO validation and error handling match global conventions.

**Dependencies:** WI-02.

---

## WI-04 — Storage and File Assets Baseline

**Objective:** establish file metadata model and signed download capability.

**Actions**

- Create `file_assets` schema and repository (inside `storage` module or dedicated private storage persistence layer).
- Implement `GET /storage/assets/{assetId}/download-url`.
- Add ownership checks and `expiresInSeconds` validation.
- Define storage service abstraction for Cloudflare R2 interactions (signed URL generation).
- Add MIME/size metadata conventions used by visualization flows.

**Definition of Done**

- Signed URL endpoint works for owned assets only.
- `file_assets` model is ready for upload associations.

**Dependencies:** WI-03.

---

## WI-05 — Visualizations Module (Metadata + Read APIs)

**Objective:** deliver visualization domain structure before generation orchestration.

**Actions**

- Create `visualizations` module with internal folders:
  - `repositories/`
  - `schemas/`
  - `services/`
  - `iterations/services/`
  - `generation/services/` (scaffold only in this WI)
- Implement base schema with embedded `iterations` array and latest snapshot fields.
- Implement endpoints:
  - `GET /projects/{projectId}/visualizations`
  - `POST /projects/{projectId}/visualizations` (metadata only, no generation)
  - `GET /visualizations/{visualizationId}`
  - `GET /visualizations/{visualizationId}/iterations`
- Enforce ownership through project/user validation.

**Definition of Done**

- Visualization metadata and read flows are complete.
- No generation side effects in create visualization endpoint.

**Dependencies:** WI-03, WI-04.

---

## WI-06 — Credits Module (Balance + Reservation Core)

**Objective:** implement credit accounting independently from payments.

**Actions**

- Create `credits` module with:
  - `credit_accounts` schema/repository
  - `credit_ledger` schema/repository
  - controller + dto + services
- Implement endpoints:
  - `GET /credits/balance`
  - `GET /credits/packages` (config-driven package catalog)
- Implement services:
  - `get-balance.service.ts`
  - `reserve-credit.service.ts`
  - `consume-credit.service.ts`
  - `compensate-credit.service.ts`
- Implement idempotency key handling for credit operations where applicable.
- Add balance consistency strategy (versioning / atomic updates).

**Definition of Done**

- Credit account lifecycle works for user.
- Reservation/consume/compensate path is test-covered at service level.

**Dependencies:** WI-02.

---

## WI-07 — Iteration Creation + Generation Orchestration

**Objective:** deliver core product flow: new iterations with upload + AI generation + credit reservation compensation.

**Actions**

- Implement `POST /visualizations/{visualizationId}/iterations` as the only iteration write endpoint.
- Add multipart handling for `inputPhoto` and `referencePhotos`.
- Persist uploaded assets metadata in `file_assets` and link to visualization/iteration.
- Implement OpenRouter client service and prompt builder service.
- Orchestrate flow:
  1. reserve credit,
  2. generate image,
  3. persist iteration and output asset,
  4. consume credit on success,
  5. compensate on failure.
- Handle known failure mappings (`402`, `413`, `422`, `502`, `409` for active generation/idempotency).

**Definition of Done**

- End-to-end iteration generation works with proper credit behavior.
- Idempotent retry does not create duplicate side effects.

**Dependencies:** WI-04, WI-05, WI-06.

---

## WI-08 — Profile Completion and Account Deletion

**Objective:** close profile scope from REST plan and PRD.

**Actions**

- Implement `DELETE /me` orchestration endpoint.
- Define deletion strategy (sync vs scheduled soft-delete marker) and return contract.
- Cascade deletion workflow for user-owned projects/visualizations/file metadata (and physical assets removal strategy).
- Add conflict handling for "deletion already in progress".

**Definition of Done**

- `DELETE /me` works and follows contract semantics.
- Data isolation and cleanup behavior is deterministic.

**Dependencies:** WI-03, WI-04, WI-05.

---

## WI-09 — Payments Module (**Implement Last**)

**Objective:** add monetization after credits and generation are stable.

**Actions**

- Create `payments` module with schema/repository/controller/dto/services.
- Implement `POST /payments` (init payment, idempotency key, provider init data).
- Implement public `POST /payments/webhook` with provider signature verification.
- Implement idempotent webhook processing using `eventId`/`providerPaymentId` uniqueness strategy.
- On confirmed payment call credits top-up flow synchronously.
- Handle replayed webhook events safely.
- Add env/config keys for payment provider and signature secret.

**Definition of Done**

- Payment creation and confirmation reliably top up credits.
- Duplicate webhook deliveries are safe and idempotent.

**Dependencies:** WI-06.

---

## WI-10 — Hardening, Observability, and Release Readiness

**Objective:** production readiness pass across all completed modules.

**Actions**

- Replace outdated e2e tests with API-level tests aligned to current endpoints.
- Add integration tests for critical flows:
  - profile,
  - project CRUD,
  - visualization read/write,
  - credit reservation lifecycle,
  - payment webhook idempotency.
- Add structured logging around generation and payment lifecycle.
- Validate env template (`.env.example`) contains all required variables.
- Add/update backend README with run instructions (`bun`), architecture, and module boundaries.
- Run lint/build/test and fix only relevant issues.

**Definition of Done**

- CI-quality baseline exists for MVP critical flows.
- Runbook/documentation is sufficient for team implementation handoff.

**Dependencies:** WI-01..WI-09.

---

## 5. Suggested Execution Cadence (example)

- Week 1: WI-01, WI-02
- Week 2: WI-03, WI-04
- Week 3: WI-05, WI-06
- Week 4: WI-07, WI-08
- Week 5: WI-09 (payments last), WI-10

If team capacity is smaller, keep WI-09 strictly at the end and shift WI-10 partly in parallel only for non-payment test infrastructure.

---

## 6. Risks and Mitigations

- **Risk:** circular dependencies between visualizations, credits, storage.
  **Mitigation:** export services only; keep repositories private; enforce one-way imports.

- **Risk:** embedded iterations growth in `visualizations` document size.
  **Mitigation:** track document size and iteration count; cap or split strategy if needed.

- **Risk:** payment webhook duplication/inconsistency.
  **Mitigation:** strict idempotency keys and unique indexes on provider event identifiers.

- **Risk:** long-running generation request reliability.
  **Mitigation:** strict timeout/error mapping, then future queue migration preserving API contract.

---

## 7. Out-of-Scope for This Plan

- Frontend implementation details.
- Post-MVP analytics and retention automation.
- E2E tests beyond MVP-critical backend flows.
