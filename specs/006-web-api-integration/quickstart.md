# Quickstart: Web-API Integration

**Feature**: 006-web-api-integration
**Date**: 2026-03-29

## Prerequisites

- Node.js / Bun installed
- MongoDB running locally (or connection string configured)
- Environment variables configured in both apps

## Setup

```sh
# From monorepo root
bun install

# Start backend (required for API calls)
bun run dev:api

# Start frontend
bun run dev:web
```

Backend runs on `http://localhost:3001` (configurable via `PORT` env).
Frontend runs on `http://localhost:3000` with `NEXT_PUBLIC_PLATFORM_API_URL=http://localhost:3001`.

## Environment Variables

### platform-web (.env)

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_PLATFORM_API_URL=http://localhost:3001
```

### platform-api (.env)

```
ENV=local
PORT=3001
DATABASE_URI=mongodb://localhost:27017/zaaranzujto
DATABASE_USER=...
DATABASE_PASSWORD=...
R2_ENDPOINT=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=...
OPENROUTER_API_KEY=...
OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
VISUALIZATION_IMAGE_MODEL=...
```

## Verification

1. Open `http://localhost:3000` and sign in via Clerk
2. Navigate to `/projects` — should show real projects from backend (empty list if new account)
3. Create a project — should persist and appear after refresh
4. Navigate to `/credits` — should show packages from backend config
5. Check the header credit badge — should show real balance

## Key Files for This Feature

| File | Purpose |
| --- | --- |
| `apps/platform-web/src/core/packages/http/` | HTTP client with Clerk auth |
| `apps/platform-web/src/core/packages/query/` | React Query provider |
| `apps/platform-web/src/core/packages/profile/` | Existing useProfile hook (reference pattern) |
| `apps/platform-web/src/modules/*/api/` | API modules (already have all endpoint mappings) |
| `apps/platform-web/src/modules/*/hooks/` | New React Query hooks (to be created) |
| `apps/platform-web/src/views/` | View components (to be updated) |
| `apps/platform-web/src/modules/*/data/` | Mock data files (to be removed) |
| `docs/mvp-gap-analysis.md` | New gap analysis document (to be created) |

## Development Order

1. **Query key factory + hook infrastructure** — create shared query keys and first hook
2. **Projects integration** — hooks + view update (most foundational)
3. **Dashboard integration** — derive stats from project data + profile
4. **Visualizations integration** — project detail view + asset URL resolution
5. **Workspace integration** — generation form + iteration display (most complex)
6. **Credits integration** — packages list (simple)
7. **Settings integration** — theme persistence (simple)
8. **Mock data cleanup** — remove all mock data files
9. **Gap analysis document** — create docs/mvp-gap-analysis.md
