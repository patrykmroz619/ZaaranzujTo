# Epic: Security and Data Protection

## US_27 — Resource Access Authorization (API Guard)

- **Story:** As the system, I want all API endpoints to be protected by authorization so unauthorized users cannot access data.
- **Acceptance Criteria (AC):**
  - [ ] All API endpoints (except healthcheck/public ones) require a valid Clerk session token in `Authorization` header.
  - [ ] Request without token or with invalid token returns HTTP 401 Unauthorized with message: `{ "message": "Unauthorized" }`.
  - [ ] Request with expired token returns HTTP 401 with message: `{ "message": "Token expired" }`.
  - [ ] Unit tests cover scenarios: missing token, invalid token, expired token, valid token.
- **Priority:** Must

---

## US_28 — User Data Isolation

- **Story:** As the system, I want to guarantee data isolation so each user can access only their own projects and visualizations.
- **Acceptance Criteria (AC):**
  - [ ] Every database query for projects/visualizations includes `userId` filter of authenticated user.
  - [ ] Attempt to access another user's resource (e.g., by URL ID manipulation) returns HTTP 403 Forbidden or HTTP 404 Not Found.
  - [ ] Resource listing endpoints (GET /projects, GET /projects/:id/visualizations) return ONLY authenticated user's resources.
  - [ ] Unit and integration tests verify isolation for scenarios: reading, editing, deleting resources owned by another user.
- **Priority:** Must

---

## US_29 — Secure API Key Storage

- **Story:** As the system, I want external service API keys to never be exposed on the frontend so key theft is prevented.
- **Acceptance Criteria (AC):**
  - [ ] API keys (OpenRouter, payment gateway, storage) are stored only on backend side (environment variables).
  - [ ] No API key is sent to browser (not present in JS bundle, API responses, frontend logs).
  - [ ] Frontend env configuration contains only public identifiers (e.g., Clerk Publishable Key).
  - [ ] Code Review Checklist includes an item to verify that no secrets are exposed in frontend code.
- **Priority:** Must
