# Phase 0: Research & Technical Unknowns

## 1. Missing Credit Account Balance Behavior

- **Decision:** Return a successful zero-valued balance object when the authenticated user has no persisted credit account record.
- **Rationale:** This matches the updated feature spec (`FR-001a`) and simplifies client behavior by removing a special not-found branch for first-time users.
- **Alternatives considered:** Return `404 Not Found` for missing credit account. Rejected because it creates inconsistent UX and extra frontend branching for a normal pre-top-up state.

## 2. Atomic Balance Integrity Under Concurrency

- **Decision:** Use atomic Mongo updates with optimistic version checks on `credit_accounts` for reservation/consume/compensate operations.
- **Rationale:** Prevents overspending and stale-write races when concurrent generation requests target the same user balance.
- **Alternatives considered:** Non-versioned read-modify-write in application memory. Rejected due to race risk and potential negative available balances.

## 3. Idempotency Strategy for Credit Mutations

- **Decision:** Persist idempotency keys with operation scope and request fingerprint; replaying an equivalent request returns the same logical result, while same key plus different semantics returns conflict.
- **Rationale:** Ensures retry safety for external callers and cross-module orchestration without duplicate ledger entries.
- **Alternatives considered:** Deduplicate by reservation identifier only. Rejected because first request failures before identifier issuance can still duplicate effects.

## 4. Ledger as Immutable Audit Source

- **Decision:** Record every credit-changing event in immutable `credit_ledger` entries (`reserve`, `consume`, `compensate`, `topUp`) linked to source context.
- **Rationale:** Enables auditability, reconciliation, and post-incident traceability while keeping account balance as computed operational state.
- **Alternatives considered:** Balance-only model without event history. Rejected because it removes traceability for disputes and makes debugging hard.

## 5. Package Catalog Source of Truth

- **Decision:** Serve package catalog from backend configuration (environment-backed), filtered to active entries and validated at startup.
- **Rationale:** Aligns with PRD requirement for non-code package updates while preserving safe schema guarantees.
- **Alternatives considered:** Persist package rows in Mongo for MVP. Rejected as unnecessary complexity before admin workflows exist.

## 6. Cross-Module Consumption Contract

- **Decision:** Expose credit operations as public services inside the `credits` module and keep repositories/schemas private.
- **Rationale:** Matches modular-monolith blueprint and reduces circular dependency risk with `visualizations` and `payments`.
- **Alternatives considered:** Direct repository access from other modules. Rejected due to architectural boundary violation.
