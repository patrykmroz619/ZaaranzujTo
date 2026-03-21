# Feature Specification: Iteration Generation Orchestration

**Feature Branch**: `004-iteration-generation-orchestration`
**Created**: 2026-03-21
**Status**: Draft
**Input**: User description: "/speckit.specify WI-07 work item from #file:platform-api-implementation-plan.md"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Generate a New Visualization Iteration (Priority: P1)

As an authenticated user, I want to submit a new iteration request with my current visualization context and image inputs so that I can receive a newly generated design variant.

**Why this priority**: This is the primary product value flow. Without successful iteration generation, users cannot realize the core output of the platform.

**Independent Test**: Can be fully tested by creating a visualization iteration with valid inputs and confirming that one new iteration is created, linked to the correct visualization, and returned to the requesting user.

**Acceptance Scenarios**:

1. **Given** an authenticated user owns a visualization and has enough credits, **When** the user submits a valid iteration creation request with required images and generation parameters, **Then** the system creates exactly one new iteration and returns it as successful.

---

### User Story 2 - Preserve Credit Fairness on Failure (Priority: P2)

As an authenticated user, I want credits to be consumed only for successful generation attempts so that failed attempts do not permanently reduce my balance.

**Why this priority**: Trust in credit accounting is essential for retention and revenue; users must not be charged for failed generation outcomes.

**Independent Test**: Can be fully tested by triggering a generation failure after reservation and verifying that reserved credits are compensated and final balance remains unchanged from pre-request balance.

**Acceptance Scenarios**:

1. **Given** an authenticated user has enough credits and a generation attempt fails after credit reservation, **When** failure handling completes, **Then** the reserved credits are fully compensated and no successful consumption is recorded for that request.
2. **Given** an authenticated user has insufficient credits, **When** the user submits an iteration request, **Then** the system rejects the request with a clear insufficient-credit outcome and creates no iteration.

---

### User Story 3 - Ensure Reliable Ownership and Input Validation (Priority: P3)

As an authenticated user, I want the system to reject invalid files and unauthorized resource access so that my data remains isolated and requests fail fast with clear feedback.

**Why this priority**: Correct authorization and input boundaries reduce support load, prevent cross-user data exposure, and keep generation processing predictable.

**Independent Test**: Can be tested by submitting out-of-policy files and by using another user's visualization identifier; both attempts should fail with deterministic error outcomes and no persistent side effects.

**Acceptance Scenarios**:

1. **Given** an authenticated user attempts to create an iteration for a visualization they do not own, **When** the request is processed, **Then** the request is denied and no credit or storage side effects are created.
2. **Given** an authenticated user uploads files that exceed allowed input constraints, **When** the request is processed, **Then** the request is rejected with a clear validation outcome and no credit consumption occurs.

### Edge Cases

- A generation provider failure occurs after assets are accepted; the system must preserve a consistent final state (failed iteration outcome, no net credit loss).
- Input includes zero optional reference photos; the request should still be processed if all required inputs are valid.
- A request attempts to upload oversized or unsupported files; the request should fail before generation begins.
- Two requests for the same visualization arrive nearly simultaneously; both may proceed only if business rules allow concurrent generation, otherwise one is rejected with a conflict outcome.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide an authenticated way for a user to create a new iteration for an existing visualization.
- **FR-002**: System MUST verify that the requesting user owns the target visualization before processing any generation operation.
- **FR-003**: System MUST accept one required primary input photo and zero or more optional reference photos in a single iteration creation request.
- **FR-004**: System MUST validate uploaded files against configured policy constraints (including file size and accepted content types) before generation is initiated.
- **FR-005**: System MUST persist metadata for accepted input and output assets and associate them with the created iteration and its parent visualization.
- **FR-006**: System MUST reserve required credits before generation starts.
- **FR-007**: System MUST consume reserved credits only when generation completes successfully and iteration persistence succeeds.
- **FR-008**: System MUST compensate reserved credits when generation fails or when post-generation persistence fails.
- **FR-009**: System MUST return deterministic error outcomes for insufficient credits, invalid input payloads, oversized inputs, upstream generation failures, and active/conflicting generation attempts.
- **FR-010**: System MUST guarantee that failed iteration creation attempts do not leave partially completed user-visible records without an explicit failure state.
- **FR-011**: System MUST make the final iteration outcome queryable by the owner after request completion.

### Key Entities _(include if feature involves data)_

- **Iteration Request**: A user-submitted operation to produce a new visualization iteration, including ownership context, generation parameters, and uploaded input assets.
- **Visualization Iteration**: A single generated version within a visualization lifecycle, including status, links to input/output assets, and creation metadata.
- **Credit Reservation Transaction**: A traceable credit operation that records reservation, consumption, or compensation outcomes for one iteration request.
- **File Asset**: Metadata describing an uploaded or generated file, including ownership, type category (input/output), and linkage to an iteration.
- **Generation Attempt Outcome**: Final result of the orchestration flow (success, failed, rejected), with a machine-consistent reason category for downstream handling.

## Assumptions

- Credits package/balance behavior already exists and can be invoked by this feature.
- Visualization metadata and read flows already exist and provide a valid parent context for iteration creation.
- Storage metadata persistence is available for both uploaded inputs and generated outputs.
- Error response formatting follows platform-wide conventions already established by foundational work.

## Dependencies

- Completed storage baseline for asset metadata and file ownership rules.
- Completed visualization module baseline for visualization existence and ownership checks.
- Completed credits reservation core for reserve/consume/compensate lifecycle.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 95% of valid iteration requests complete with a final user-visible outcome (success or explicit failure) within 30 seconds under normal operating conditions.
- **SC-002**: 100% of failed generation attempts leave user credit balance unchanged from its pre-request value after compensation completes.
- **SC-003**: 100% of unauthorized iteration requests are rejected without creating iteration, credit, or asset side effects.
- **SC-004**: At least 99% of invalid file submissions are rejected during validation before generation processing begins.
