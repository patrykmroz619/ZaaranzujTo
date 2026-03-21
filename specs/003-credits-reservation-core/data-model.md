# Credits Balance and Reservation Core Data Model

## Overview

This feature introduces the credits domain baseline for read APIs and deterministic credit mutation services used by generation/payment orchestration.

## Entities

### Credit Account

| Field       | Type                         | Required | Notes                                               |
| ----------- | ---------------------------- | -------- | --------------------------------------------------- |
| `_id`       | ObjectId                     | Yes      | Primary identifier                                  |
| `userId`    | ObjectId or string reference | Yes      | Owner scope; unique per user                        |
| `balance`   | number                       | Yes      | Total credits ever available after top-ups/consumes |
| `reserved`  | number                       | Yes      | Credits currently held by active reservations       |
| `version`   | number                       | Yes      | Optimistic concurrency token                        |
| `createdAt` | Date                         | Yes      | Creation timestamp                                  |
| `updatedAt` | Date                         | Yes      | Last state update                                   |

Derived field:

- `available = balance - reserved`

Validation rules:

- `balance >= 0`
- `reserved >= 0`
- `reserved <= balance`
- Exactly one account per user (`unique(userId)`).

Business rule:

- If account record does not exist on balance read, return virtual zero state (`balance=0`, `reserved=0`, `available=0`).

### Credit Ledger Entry

| Field            | Type                         | Required | Notes                                        |
| ---------------- | ---------------------------- | -------- | -------------------------------------------- |
| `_id`            | ObjectId                     | Yes      | Primary identifier                           |
| `userId`         | ObjectId or string reference | Yes      | Owner scope                                  |
| `type`           | enum                         | Yes      | `reserve`, `consume`, `compensate`, `topUp`  |
| `amount`         | number                       | Yes      | Positive integer amount for the event        |
| `reservationId`  | string or null               | No       | Reservation correlation for lifecycle events |
| `source`         | object                       | Yes      | Origin metadata (`module`, `entityId`)       |
| `idempotencyKey` | string or null               | No       | Replay safety correlation                    |
| `createdAt`      | Date                         | Yes      | Event timestamp                              |

Validation rules:

- Immutable after creation.
- `amount > 0`.
- For `reserve/consume/compensate`, `reservationId` is required.

### Credit Reservation Handle

| Field           | Type                         | Required | Notes                                              |
| --------------- | ---------------------------- | -------- | -------------------------------------------------- |
| `reservationId` | string                       | Yes      | Unique operation-level reservation token           |
| `userId`        | ObjectId or string reference | Yes      | Owner scope                                        |
| `amount`        | number                       | Yes      | Reserved credits, MVP fixed to 1 for generation    |
| `status`        | enum                         | Yes      | `active`, `consumed`, `compensated`                |
| `expiresAt`     | Date or null                 | No       | Optional expiration for stale reservation recovery |

Validation rules:

- Status transitions are one-way from `active` to terminal state.
- Terminal transitions are idempotent (replay-safe).

### Credit Package (Config-Sourced)

| Field            | Type    | Required | Notes                                  |
| ---------------- | ------- | -------- | -------------------------------------- |
| `packageCode`    | string  | Yes      | Stable unique business key             |
| `name`           | string  | Yes      | Display name                           |
| `credits`        | number  | Yes      | Credits to grant on confirmed purchase |
| `price.amount`   | number  | Yes      | Monetary amount                        |
| `price.currency` | string  | Yes      | Currency code, MVP: `PLN`              |
| `isActive`       | boolean | Yes      | Visibility flag for clients            |

Validation rules:

- `credits > 0`
- `price.amount > 0`
- Active list must not include duplicate `packageCode`.

## State Transitions

### Reservation Lifecycle

1. `ReserveCredit`: `active` reservation created; account `reserved += amount`.
2. `ConsumeCredit`: reservation `active -> consumed`; account `balance -= amount`, `reserved -= amount`.
3. `CompensateCredit`: reservation `active -> compensated`; account `reserved -= amount` only.

Replay behavior:

- Same idempotency key and equivalent input returns prior resolved result.
- Same idempotency key with changed semantic input returns conflict.

## Relationships

- One User has at most one Credit Account.
- One User has many Credit Ledger Entries.
- One Reservation lifecycle maps to multiple ledger entries over time (`reserve`, then `consume` or `compensate`).

## Indexing Notes

- `credit_accounts`: unique index on `userId`.
- `credit_ledger`: index on `userId, createdAt` for history queries.
- Idempotency storage (collection or embedded strategy): unique `(userId, operation, idempotencyKey)`.

## Non-Goals in This Feature

- Payment gateway integration.
- Public mutation endpoints for reserve/consume/compensate.
- Historical transactions UI contract.
