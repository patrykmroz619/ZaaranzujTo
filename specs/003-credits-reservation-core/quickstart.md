# Quickstart: Credits Balance and Reservation Core

## Prerequisites

- Bun installed
- MongoDB configured for `platform-api`
- Environment variables configured for Clerk and database access
- API running on local default base URL

## Start API

```bash
cd apps/platform-api
bun run dev
```

Local API base:

```text
http://localhost:3001/api/v1
```

## Verify Read Endpoints

Use a valid Clerk bearer token in all protected requests.

### 1) Get balance when account exists

```bash
curl -X GET "http://localhost:3001/api/v1/credits/balance" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

Expected:

- `200 OK`
- `balance`, `reserved`, `available`, `updatedAt` fields present

### 2) Get balance when account does not exist yet

```bash
curl -X GET "http://localhost:3001/api/v1/credits/balance" \
  -H "Authorization: Bearer <token-for-new-user>" \
  -H "Accept: application/json"
```

Expected:

- `200 OK`
- `balance = 0`, `reserved = 0`, `available = 0`
- no not-found error

### 3) Get active credit packages

```bash
curl -X GET "http://localhost:3001/api/v1/credits/packages" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

Expected:

- `200 OK`
- `items` array with active package objects (`packageCode`, `name`, `credits`, `price`, `isActive`)

## Verify Credit Reservation Lifecycle (Service-Level)

Use module services via integration harness or temporary command endpoint in local-only mode:

1. Reserve one credit for user with available balance.
2. Confirm account reflects increased `reserved` and unchanged consumed total.
3. Consume reservation and confirm `reserved` decreases and final balance is updated once.
4. Repeat with compensation path and confirm returned `available` matches pre-reserve level.
5. Replay same idempotency key and equivalent input; confirm no duplicate ledger entry.
6. Replay same key with changed semantic input; confirm conflict outcome.

## Error Verification

- Insufficient available credits yields business error without mutating account.
- Unauthorized requests return authentication error envelope.
- Conflicting idempotency replay returns conflict error envelope.
