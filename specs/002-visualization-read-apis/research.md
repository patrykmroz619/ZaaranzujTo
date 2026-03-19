# Phase 0: Research & Technical Unknowns

## 1. Visualization Creation Idempotency

- **Decision:** Persist idempotency by user and endpoint intent, storing request fingerprint and resolved visualization reference. Replays with identical payload return the same logical result; mismatched payload with reused key returns conflict.
- **Rationale:** This matches the REST plan conflict behavior while preventing duplicate visualizations from retries caused by network instability.
- **Alternatives considered:** Best-effort deduplication by visualization name and project only. Rejected because names are mutable and not safe as idempotency identity.

## 2. Read Model for List and Details

- **Decision:** Use one visualization aggregate with embedded iterations and a nullable latest-iteration snapshot for fast list rendering.
- **Rationale:** The Mongo data model already assumes embedded iteration history for bounded iteration counts and quick single-document reads.
- **Alternatives considered:** Splitting iterations into a standalone collection for WI-05. Rejected because it adds query joins and complexity before generation scale requires it.

## 3. Ownership and Not-Found Behavior

- **Decision:** Ownership checks are enforced through user-scoped queries; unauthorized ownership access returns not found for project and visualization resources.
- **Rationale:** This aligns with the global API rule to avoid leaking resource existence across users.
- **Alternatives considered:** Returning forbidden for ownership mismatch. Rejected to keep behavior aligned with current API security conventions.

## 4. Pagination and Sorting Defaults

- **Decision:** Apply stable defaults aligned with REST plan: visualization list sorted by most recently updated, iteration history sorted by iteration number ascending.
- **Rationale:** Supports project detail UX by showing newest visualizations first and preserving chronological iteration timeline for thumbnails/history.
- **Alternatives considered:** Name-based default sorting. Rejected because it hides recent active work and worsens workflow continuity.

## 5. Contract Placement Strategy

- **Decision:** Keep WI-level API contract draft in this feature folder and mirror finalized schemas to `packages/contracts` during implementation.
- **Rationale:** Speckit phase artifacts remain self-contained while preserving the repository rule that shared schemas live in contracts package.
- **Alternatives considered:** Defining contracts only in code implementation stage. Rejected because it delays interface review and increases integration risk.
