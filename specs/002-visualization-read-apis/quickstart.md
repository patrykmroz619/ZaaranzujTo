# Quickstart: Visualization Metadata and Read APIs

## Prerequisites

- Bun installed
- MongoDB configured for `platform-api`
- Environment variables for authentication and database configured in `apps/platform-api`

## Start API

```bash
cd apps/platform-api
bun run dev
```

API base for local runs:

```text
http://localhost:3001/api/v1
```

## Verify Endpoints

Use a valid Clerk bearer token in all protected requests.

### 1) List project visualizations

```bash
curl -X GET "http://localhost:3001/api/v1/projects/<projectId>/visualizations?page=1&pageSize=20&sort=updatedAt:desc" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

Expected result:

- `200 OK`
- `items` list with visualization summaries
- `pagination` object

### 2) Create visualization metadata only

```bash
curl -X POST "http://localhost:3001/api/v1/projects/<projectId>/visualizations" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: 3f8db8d1-58fd-44d0-a5d7-2f0a61e5f8d9" \
  -d '{
    "name": "Salon",
    "mode": "fromPhoto"
  }'
```

Expected result:

- `201 Created`
- `iterations` is empty
- no side effects in generation or credits

### 3) Get visualization details

```bash
curl -X GET "http://localhost:3001/api/v1/visualizations/<visualizationId>" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

Expected result:

- `200 OK`
- full visualization details with embedded iterations currently persisted

### 4) Get visualization iteration history

```bash
curl -X GET "http://localhost:3001/api/v1/visualizations/<visualizationId>/iterations?page=1&pageSize=50&sort=iterationNo:asc" \
  -H "Authorization: Bearer <token>" \
  -H "Accept: application/json"
```

Expected result:

- `200 OK`
- chronologically ordered iteration items with pagination

## Error Verification

- Non-owned project or visualization returns not-found style response.
- Reusing an idempotency key with different payload returns conflict.
- Invalid pagination or identifier formats return validation errors.
