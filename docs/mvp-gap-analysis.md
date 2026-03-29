# MVP Gap Analysis: ZaaranżujTo

**Date**: 2026-03-29
**Branch**: `006-web-api-integration`
**Author**: Generated as part of feature 006

---

## Executive Summary

The platform-web frontend is now connected to all 18 existing platform-api endpoints. All 6 primary views (Dashboard, Projects, Project Detail, Workspace, Credits, Settings) fetch real data. Mock data has been removed. The core AI generation workflow is functional end-to-end.

**Remaining MVP gaps**: Payment processing (credit purchase) and full account deletion are not yet implemented on the backend. These block the monetization and account management user stories.

---

## Feature Status Table

| # | User Story | Status | Missing |
|---|-----------|--------|---------|
| US-1 | Browse and manage projects via live backend | ✅ Complete | — |
| US-2 | View visualizations and iteration history | ✅ Complete | — |
| US-3 | Generate visualizations via live AI backend | ✅ Complete | — |
| US-4 | Iterate on existing visualizations | ✅ Complete | — |
| US-5 | View credit balance and packages | ✅ Complete | — |
| US-6 | Manage profile and settings (theme) | ✅ Complete | — |
| US-7 | MVP gap analysis document | ✅ Complete | — |
| US-8 | Purchase credits via BLIK | ❌ Not started | `POST /payments`, `POST /payments/webhook`, frontend purchase flow |
| US-9 | Delete account | ⚠️ Partial | Full cascade deletion in `DELETE /me` not implemented |

**PRD User Stories Coverage**: 7 of 9 scoped MVP stories complete (78%).

---

## Missing Backend Endpoints

### 1. `POST /payments` — Initialize BLIK payment

**Priority**: P1 (blocks monetization)

**Required contract**:
```typescript
// Request
{
  packageCode: string;     // credit package to purchase
  returnUrl: string;       // redirect after payment
}

// Response
{
  paymentId: string;
  redirectUrl: string;     // BLIK gateway URL
  expiresAt: string;       // ISO timestamp
}
```

**Implementation scope**:
- `payments` NestJS module (schema, repository, controller, service)
- BLIK payment gateway integration
- Payment record creation with `pending` status
- Redirect URL generation

---

### 2. `POST /payments/webhook` — Process payment gateway callback

**Priority**: P1 (blocks credit top-up)

**Required contract**:
```typescript
// Request (gateway-specific, likely signed)
{
  paymentId: string;
  status: "completed" | "failed" | "cancelled";
  signature: string;
}

// Response
{
  received: true;
}
```

**Implementation scope**:
- Webhook signature verification (HMAC or similar)
- Payment status update
- Credit top-up on `completed` status via credits module
- Idempotency guard (replayed webhooks must not double-charge)

---

### 3. Full `DELETE /me` cascade

**Priority**: P2 (blocks account deletion)

**Current state**: Endpoint exists but is a placeholder — no cascade deletion.

**Required cascade**:
1. Delete all iterations (storage files from R2)
2. Delete all visualizations
3. Delete all projects
4. Delete credit account and transaction history
5. Delete user record
6. Revoke Clerk session / schedule Clerk user deletion

---

## Missing Frontend Features

### Credit Purchase Flow

**Blocked by**: `POST /payments`, `POST /payments/webhook`

**Scope when backend is ready**:
- `CreditsView`: wire Buy button to `POST /payments`, redirect to gateway
- New `/payments/success` and `/payments/cancel` pages
- Credit balance refresh after successful payment

### Account Deletion

**Blocked by**: Full `DELETE /me` cascade

**Scope when backend is ready**:
- `AccountActions` component: call `DELETE /me` with `{ confirm: true }`
- Clear session and redirect to landing page

---

## Implemented Backend Endpoints (Inventory)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/me` | Get current user profile |
| PATCH | `/api/v1/me` | Update profile (theme) |
| DELETE | `/api/v1/me` | Delete account (placeholder) |
| GET | `/api/v1/projects` | List projects (paginated) |
| POST | `/api/v1/projects` | Create project |
| GET | `/api/v1/projects/:id` | Get project details |
| PATCH | `/api/v1/projects/:id` | Update project |
| DELETE | `/api/v1/projects/:id` | Delete project |
| GET | `/api/v1/projects/:id/visualizations` | List project visualizations |
| POST | `/api/v1/projects/:id/visualizations` | Create visualization |
| GET | `/api/v1/visualizations/:id` | Get visualization details |
| GET | `/api/v1/visualizations/:id/iterations` | List iterations |
| POST | `/api/v1/visualizations/:id/iterations` | Create iteration (AI generation) |
| GET | `/api/v1/credits/balance` | Get credit balance |
| GET | `/api/v1/credits/packages` | List credit packages |
| POST | `/api/v1/credits/topup` | Manual credit top-up (x-api-key) |
| GET | `/api/v1/storage/assets/:id/download-url` | Get signed download URL |

**Total**: 17 endpoints implemented (payments: 0 of 2, me cascade: partial)

---

## Prioritized Development Roadmap

### P1 — Unblock Monetization

1. **Payments module** — NestJS module with schema, repository, service, controller
2. **BLIK gateway integration** — payment initialization, status callbacks
3. **Webhook handler** — signature verification + credit top-up
4. **Frontend purchase flow** — wire Buy button, success/cancel pages

### P2 — Complete Account Management

5. **`DELETE /me` cascade** — orchestrate deletion across all modules + R2 cleanup
6. **Frontend account deletion** — confirmation dialog + redirect

### P3 — Production Hardening

7. **Optimistic updates** — for project and visualization mutations
8. **Polling for generation status** — long-running AI jobs (currently synchronous)
9. **Error boundary** — global error fallback for unexpected crashes
10. **Rate limiting** — protect iteration creation endpoint
