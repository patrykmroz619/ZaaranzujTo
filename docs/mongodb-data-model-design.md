# MongoDB Schema Design (Data Access Patterns)

## Assumptions

- 1 credit = 1 generated iteration; credit reservation has an expiration time.
- Users log in via Clerk, with `clerkUserId` as the business key (unique).
- Each `visualization` belongs to a single `project`; iterations are stored as an embedded array.
- Payment confirmations/webhooks may arrive multiple times (idempotency required).
- Files in R2 have metadata in MongoDB; some uploads may become orphaned and should expire via TTL.

## 1. Relationship Analysis

- `users` 1:N `projects`
- `projects` 1:N `visualizations`
- `visualizations` 1:N `iterations` (embedded array)
- `users` 1:1 `credit_accounts`
- `users` 1:N `payments`
- `users` 1:N `credit_ledger`
- `users` 1:N `file_assets` (owner), additionally `visualizations`/`iterations` 1:N `file_assets` (file associations)

## 2. Modeling Decisions: Embedding vs Linking

- `projects` to `users` → **Linking** (1:N, listing/pagination, independent lifecycle).
- `visualizations` to `projects` → **Linking** (1:N, grows, separate filters and permissions).
- `visualizations.iterations` → **Embedding** (1:N, assuming a small number of iterations and the need for fast access to the full history without extra queries).
- `visualizations.latestIterationSnapshot` → **Embedding (computed snapshot)** for fast view rendering.
- `credit_accounts` + `credit_ledger` → **Linking + event log** (balance consistency and audit).
- `payments` to `users` → **Linking** (history, idempotency, webhooks).
- `file_assets` → **Polymorphic linking** (`linkedTo.type/id`) instead of embedding binaries.

## 3. Collection List and Example JSON Documents

### 3.1 `users`

```json
{
  "_id": "ObjectId",
  "clerkUserId": "string",
  "email": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.2 `credit_accounts`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "balance": "number",
  "reserved": "number",
  "version": "number",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.3 `credit_ledger`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "type": "string",
  "amount": "number",
  "reservationId": "string",
  "source": {
    "module": "string",
    "entityId": "ObjectId"
  },
  "idempotencyKey": "string",
  "createdAt": "Date"
}
```

### 3.4 `payments`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "providerPaymentId": "string",
  "packageCode": "string",
  "creditsToAdd": "number",
  "currency": "string",
  "status": "string",
  "idempotencyKey": "string",
  "confirmedAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.5 `projects`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "name": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.6 `visualizations`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "projectId": "ObjectId",
  "name": "string",
  "iterations": [
    {
      "_id": "ObjectId",
      "iterationNo": "number",
      "baseIterationId": "ObjectId",
      "status": "string",
      "generationInput": {
        "mode": "string",
        "inputPhotoAssetId": "ObjectId",
        "stylePreset": "string",
        "colors": ["string"],
        "prompt": "string",
        "referenceAssets": ["ObjectId"]
      },
      "result": {
        "imageAssetId": "ObjectId",
        "model": "string",
        "provider": "string",
        "latencyMs": "number"
      },
      "createdAt": "Date"
    }
  ],
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

### 3.7 `file_assets`

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "bucket": "string",
  "r2Key": "string",
  "mimeType": "string",
  "sizeBytes": "number",
  "width": "number",
  "height": "number",
  "kind": "string",
  "linkedTo": {
    "type": "string",
    "id": "ObjectId"
  },
  "status": "string",
  "expiresAt": "Date",
  "createdAt": "Date",
  "updatedAt": "Date"
}
```

## 4. Applied Design Patterns

- **Embedding Pattern**: iterations as `visualizations.iterations` for fast access to the full history within a single visualization.
- **Extended Reference Pattern**: a small snapshot in `visualizations.latestIteration` instead of a full join to the iteration for every listing.
- **Computed Pattern**: `iterationsCount`, `cover`, balance in `credit_accounts` (incrementally calculated, not ad hoc from events).
- **Event-like Ledger Pattern**: `credit_ledger` as an immutable log of credit operations for audit and state reconstruction.
- **Polymorphic Association**: `file_assets.linkedTo` for multiple types of associations.
- **Idempotency Pattern**: unique `idempotencyKey` and `providerEventId` for duplicate resistance.

## 5. Indexing Strategy (for most common queries)

### 5.1 `users`

- `{ clerkUserId: 1 }` unique

### 5.2 `credit_accounts`

- `{ userId: 1 }` unique

### 5.3 `credit_ledger`

- No additional indexes at start (besides default `_id`).

### 5.4 `payments`

- `{ idempotencyKey: 1 }` unique
- `{ providerEventId: 1 }` unique (partial)

### 5.5 `projects`

- No additional indexes at start (besides default `_id`).

### 5.6 `visualizations`

- No additional indexes at start (besides default `_id`).

### 5.7 `file_assets`

- `{ r2Key: 1 }` unique
- TTL: `{ expiresAt: 1 }` with `expireAfterSeconds: 0` (applies only to documents with `expiresAt` set)

## 6. Performance Notes and MongoDB Limitations

- Embedding iterations is acceptable given the assumed small number of iterations; monitor document size against the 16MB limit.
- Keep small, frequently-read snapshots (`latestIteration`, `cover`) for fast views.
- Perform credit operations transactionally (where required) or with version control (`version`) and idempotency.
- Expand indexes iteratively only after observing real performance issues.
