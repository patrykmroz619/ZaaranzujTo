# Feature Specification: Credits Balance and Reservation Core

**Feature Branch**: `003-credits-reservation-core`
**Created**: 2026-03-21
**Status**: Draft
**Input**: User description: "implementation of WI-06 work item from platform-api-implementation-plan.md; read all referenced documentation before planning"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Current Credit Balance (Priority: P1)

As an authenticated user, I can view my current credit summary (total, reserved, available) so I can decide whether I can start another paid generation.

**Why this priority**: Users need immediate visibility of spendable credits before any monetized action. Without this, they cannot make informed decisions.

**Independent Test**: Can be fully tested by creating a user credit account with known values and requesting balance data; the returned summary must match stored state and be understandable without any payment flow.

**Acceptance Scenarios**:

1. **Given** an authenticated user with a credit account, **When** the user requests their balance, **Then** the system returns total, reserved, available, and last update time.
2. **Given** an authenticated user without a credit account, **When** the user requests their balance, **Then** the system returns a valid balance object with `total = 0`, `reserved = 0`, and `available = 0` instead of a not-found error.

---

### User Story 2 - Browse Purchasable Credit Packages (Priority: P2)

As an authenticated user, I can view available credit packages and pricing so I can choose what to buy next.

**Why this priority**: Package visibility is required for monetization and informs purchase intent, but it is secondary to knowing current available credits.

**Independent Test**: Can be tested by configuring active and inactive packages, then requesting the package catalog and verifying only active packages are returned with complete pricing metadata.

**Acceptance Scenarios**:

1. **Given** an authenticated user and at least one active package, **When** the user requests packages, **Then** the system returns all active packages with package code, name, credit count, and price.
2. **Given** an authenticated user and no active packages, **When** the user requests packages, **Then** the system returns an empty package list without server error.

---

### User Story 3 - Protect Credit Integrity During Generation (Priority: P3)

As a platform operator, I need credit reservation, consumption, and compensation to behave consistently so users are charged exactly once for successful generations and refunded on failed runs.

**Why this priority**: This protects user trust and revenue accuracy, but depends on having the basic balance and package visibility in place first.

**Independent Test**: Can be tested with simulated generation success/failure flows using idempotent retries and concurrent requests to verify no duplicate charging and correct compensation behavior.

**Acceptance Scenarios**:

1. **Given** a user with at least one available credit, **When** a generation starts, **Then** one credit is reserved and no immediate permanent deduction occurs.
2. **Given** a reserved credit and generation success, **When** completion is confirmed, **Then** the reservation is finalized as consumption and available balance decreases by exactly one.
3. **Given** a reserved credit and generation failure, **When** failure is finalized, **Then** the reservation is compensated and available balance returns to the pre-reservation value.
4. **Given** a retried mutating request with the same idempotency key and equivalent payload, **When** it is re-submitted, **Then** the system returns a logically equivalent result without duplicate credit side effects.

### Edge Cases

- User requests balance before any credit account record exists.
- User attempts a reservation when available credits are zero.
- A compensation request is received for a reservation that was already compensated.
- A consume request is received for a reservation that is already finalized.
- Two generation starts race for the last available credit.
- A repeated idempotency key is submitted with a different payload.
- The package catalog is misconfigured with duplicate package codes.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST provide an authenticated balance view that includes total credits, reserved credits, available credits, and last update timestamp for the requesting user only.
- **FR-001a**: If the requesting user has no persisted credit account yet, the system MUST return a successful balance response with zero-valued credits (`total = 0`, `reserved = 0`, `available = 0`) rather than a not-found error.
- **FR-002**: The system MUST provide an authenticated package catalog containing only active credit packages with package identifier, display name, credit amount, price amount, and currency.
- **FR-003**: The system MUST enforce user-level data isolation so no user can access another user's credit account or ledger outcomes.
- **FR-004**: The system MUST support a credit reservation operation that decreases available credits and increases reserved credits atomically when sufficient credits exist.
- **FR-005**: The system MUST reject reservation attempts when sufficient available credits do not exist, without changing account balances.
- **FR-006**: The system MUST support a credit consumption operation that finalizes a valid reservation exactly once.
- **FR-007**: The system MUST support a credit compensation operation that releases a valid reservation exactly once when downstream generation fails.
- **FR-008**: The system MUST maintain an immutable ledger of credit-changing events, including event type, amount, source context, and event timestamp.
- **FR-009**: The system MUST guarantee idempotent behavior for mutating credit operations so repeated equivalent requests do not produce duplicate balance or ledger side effects.
- **FR-010**: The system MUST detect conflicting idempotency replays (same key, different payload semantics) and return a conflict response without applying new side effects.
- **FR-011**: The system MUST preserve balance consistency under concurrent requests so final account totals remain correct.
- **FR-012**: The system MUST ensure each user has at most one credit account lifecycle record used for balance tracking.
- **FR-013**: The system MUST expose business-level errors using the platform-wide error envelope so clients can consistently handle authorization, insufficient-credit, validation, and conflict outcomes.

### Key Entities _(include if feature involves data)_

- **Credit Account**: Per-user aggregate balance state containing total credits, reserved credits, available credits, version for consistency control, and update timestamps.
- **Credit Ledger Entry**: Immutable audit event representing one balance-impacting action (reservation, consumption, compensation, top-up) with amount, source, idempotency key, and timestamp.
- **Credit Package**: Configured commercial offer containing package code, label, credits granted, price amount, currency, and active flag.
- **Credit Reservation**: A traceable hold on credits tied to a user operation lifecycle, later finalized as consumed or compensated.

## Assumptions

- One completed generation consumes exactly one credit.
- Package definitions are managed by operations through environment-backed configuration and are read-only for end users.
- Requests that require authentication are invoked only after successful token validation by shared platform mechanisms.
- Users may exist before any credit account record is created; in that case the balance endpoint returns a virtual zero state.
- The first scope of this feature covers balance visibility and package catalog read APIs plus service-level reservation lifecycle behavior required by generation orchestration.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 99% of successful balance and package read requests return a complete response within 1 second under normal MVP load.
- **SC-002**: In validation sampling of at least 500 mixed reservation/consume/compensate operations, zero users end with a negative available credit balance.
- **SC-003**: In replay tests of duplicate mutating requests, 100% of equivalent retries avoid duplicate ledger entries and duplicate balance mutations.
- **SC-004**: In failure-path tests where generation fails after reservation, 100% of affected users recover their pre-reservation available balance.
- **SC-005**: Support incidents related to incorrect credit deductions remain below 1% of all paid generation attempts during the first MVP month.
- **SC-006**: 100% of authenticated balance requests for users without an existing credit account return a successful response with zero-valued credits and no not-found error.
