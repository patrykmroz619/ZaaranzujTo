# Research: Web-API Integration & MVP Gap Analysis

**Feature**: 006-web-api-integration
**Date**: 2026-03-29

## 1. Current Integration State

### Decision: Frontend API infrastructure is complete — only hook wiring is missing

**Rationale**: The platform-web app already has:
- A fully configured Axios HTTP client with Clerk auth token injection (client-side interceptor + server-side factory)
- All 5 API modules with complete endpoint mappings (`projectsApi`, `visualizationsApi`, `iterationsApi`, `creditsApi`, `meApi`)
- React Query configured as a provider with sensible defaults (`refetchOnWindowFocus: false`, `refetchOnMount: false`, `retry: 1`)
- One working example hook (`useProfile`) demonstrating the exact pattern to follow
- All TypeScript types imported from `@repo/contracts`

**What's missing**: React Query hooks that call the API modules, and view components updated to use those hooks instead of mock data.

**Alternatives considered**:
- Server Components with server-side fetching: Rejected because most views need client-side interactivity (forms, dialogs, optimistic updates). The existing `useProfile` pattern (client-side React Query) is the established convention.
- Zustand for server state: Rejected — React Query is already configured and is the standard tool for server state management. Zustand is available but better suited for purely client-side state (form state, UI toggles).

---

## 2. React Query Hook Patterns

### Decision: Follow the existing `useProfile` pattern with query key namespacing

**Rationale**: The `useProfile` hook establishes the pattern:
```
useQuery({ queryKey: ["profile"], queryFn: service, enabled: condition })
→ returns { data, isLoading, error }
```

For mutations (create, update, delete), use `useMutation` with `onSuccess` callbacks that call `queryClient.invalidateQueries()` to refresh related queries.

**Query Key Strategy**:
- `["projects"]` — project list
- `["projects", projectId]` — single project
- `["projects", projectId, "visualizations"]` — visualizations for a project
- `["visualizations", visualizationId]` — visualization details
- `["visualizations", visualizationId, "iterations"]` — iterations for a visualization
- `["credits", "packages"]` — credit packages
- `["credits", "balance"]` — credit balance (or reuse `["profile"]`)
- `["profile"]` — user profile (existing)

**Cache Invalidation Rules**:
- Create project → invalidate `["projects"]`
- Update project → invalidate `["projects"]` + `["projects", projectId]`
- Delete project → invalidate `["projects"]`
- Create visualization → invalidate `["projects", projectId, "visualizations"]` + `["projects", projectId]` (visualizationsCount changes)
- Create iteration → invalidate `["visualizations", visualizationId]` + `["visualizations", visualizationId, "iterations"]` + `["profile"]` (credit balance changes)

**Alternatives considered**:
- Optimistic updates via `onMutate`: Considered but deferred. For MVP, post-mutation invalidation is simpler and sufficient. Optimistic updates can be added later for perceived performance.
- SWR instead of React Query: Rejected — React Query is already installed and configured.

---

## 3. Image Loading via Signed URLs

### Decision: Create a utility hook `useAssetUrl` for resolving asset IDs to download URLs

**Rationale**: Multiple components need to display images from R2 (visualization thumbnails, iteration images, original photos). The backend provides `GET /storage/assets/{assetId}/download-url` which returns a signed URL with 1-hour TTL.

**Approach**:
- Create `useAssetUrl(assetId)` hook that uses React Query to fetch the signed URL
- Cache the result with `staleTime` matching the URL TTL (e.g., 50 minutes to avoid expired URLs)
- Return `{ url, isLoading }` for components to use in `<img src={url} />`
- Handle null/undefined assetId gracefully (return null URL, no request)

**Alternatives considered**:
- Inline fetch in each component: Rejected — duplicates logic, no caching, inconsistent loading states
- Backend proxy endpoint that streams images: Rejected — adds unnecessary backend load. Signed URLs are the standard pattern for R2/S3.

---

## 4. Multipart Form Data for Iteration Creation

### Decision: Build FormData in the mutation hook, set Content-Type to multipart/form-data

**Rationale**: The `POST /visualizations/{visualizationId}/iterations` endpoint accepts `multipart/form-data` with fields:
- `inputPhoto` (max 1 file) — room photo for "from photo" mode
- `referencePhotos` (max 8 files) — furniture/element photos
- `stylePreset`, `promptContext` — text fields
- Headers: `Idempotency-Key` (UUID)

The existing `iterationsApi.create()` currently sends JSON body. It needs to be updated to build `FormData` and send with the correct content type.

**Approach**:
- The mutation hook builds a `FormData` object from the form state
- Override the `Content-Type` header to `multipart/form-data` (Axios sets boundary automatically)
- Generate a UUID for the `Idempotency-Key` header using `crypto.randomUUID()`
- The API module function accepts the FormData directly

**Alternatives considered**:
- Separate upload endpoint + reference by ID: Not available — the backend handles upload inline with iteration creation
- Base64 encoding in JSON: Rejected — large payloads, not aligned with backend's multipart expectation

---

## 5. Dashboard Data Strategy

### Decision: Derive dashboard stats from existing endpoints, not a dedicated dashboard API

**Rationale**: There is no dedicated dashboard endpoint. The backend provides:
- `GET /projects` — returns project list with `visualizationsCount` per project and pagination with `totalItems`
- `GET /me` — returns `creditBalance`

Dashboard stats can be derived:
- `projectCount` → `pagination.totalItems` from projects list
- `visualizationCount` → sum of `visualizationsCount` across projects (first page is sufficient for MVP)
- `creditBalance` → from profile (already fetched via `useProfile`)
- Recent projects → first N items from `GET /projects?sort=updatedAt:desc&pageSize=5`

**Alternatives considered**:
- Create a dedicated `GET /dashboard` backend endpoint: Over-engineering for MVP — existing endpoints provide all needed data
- Use the full projects list to compute exact totals: For MVP, first-page approximation is acceptable; exact totals available via `pagination.totalItems`

---

## 6. Form State Management in Workspace

### Decision: Keep useState-based form state in WorkspaceView, add mutation hooks for submission

**Rationale**: The current WorkspaceView manages form state with individual `useState` calls. This works well and is simple. The change needed is:
1. Replace `creditBalance = 12` with data from `useProfile().profile?.creditBalance`
2. Replace `setTimeout(() => ..., 3000)` with `useMutation` calling `iterationsApi.create()`
3. Replace hardcoded iterations array with `useQuery` calling `iterationsApi.list()`
4. Replace image placeholders with real URLs from `useAssetUrl`

**Alternatives considered**:
- Zustand store for workspace state: Over-engineering — the existing useState pattern is sufficient for a single-component form
- React Hook Form: The form is simple enough that native useState works fine; no complex validation or dynamic fields

---

## 7. Error Handling Strategy

### Decision: Use React Query error state + toast notifications for user-facing errors

**Rationale**: The existing `ApiError` class captures `statusCode` and `message`. React Query exposes `error` in both `useQuery` and `useMutation` results.

**Approach**:
- For query errors (data fetching): Show inline error states with retry buttons
- For mutation errors (create, update, delete, generate): Show toast notifications with Polish-language messages
- Map common status codes to user-friendly Polish messages:
  - 401 → "Sesja wygasła. Zaloguj się ponownie." (redirect to sign-in)
  - 402 → "Brak wystarczającej liczby kredytów." (link to credits page)
  - 404 → "Nie znaleziono zasobu." (redirect or show empty state)
  - 409 → "Generowanie już trwa. Poczekaj na zakończenie."
  - 500 → "Wystąpił błąd serwera. Spróbuj ponownie."
- Add error messages to the `pl.json` i18n file

**Alternatives considered**:
- Global error boundary: Too coarse — individual query/mutation errors should be handled locally
- Custom error interceptor in Axios: The existing `handleHttpError` already throws `ApiError`; handling should be at the component/hook level

---

## 8. Missing Backend Endpoints (Gap Analysis Input)

### Decision: Document 3 categories of gaps — missing endpoints, incomplete endpoints, missing frontend features

**Findings**:

**Missing Backend Endpoints (not implemented):**
1. `POST /payments` — Initialize BLIK payment, create payment record, return gateway redirect URL
2. `POST /payments/webhook` — Process payment gateway callbacks, top up credits on confirmation
3. Full `DELETE /me` cascade — Currently a placeholder; needs to cascade delete projects, visualizations, iterations, storage files, credit accounts

**Missing Backend Functionality:**
- Payments module (schema, repository, controller, services — entire module)
- Payment gateway integration (BLIK provider)
- Webhook signature verification
- Credit top-up on payment confirmation
- Account deletion orchestration (cascade across all modules)

**Missing Frontend Features (blocked on backend):**
- Credit purchase flow (needs payments endpoints)
- Account deletion with confirmation (needs full DELETE /me)

**Frontend Features Not Blocked:**
- All 6 view integrations can proceed with existing endpoints
- Gap analysis document can be created independently

---

## 9. Local Frontend Types vs @repo/contracts

### Decision: Replace local mock types with @repo/contracts types where contracts exist

**Rationale**: The `modules/projects/types/projects.types.ts` defines local `TProject` and `TVisualization` types that don't match the contract types (`TProjectObject`, `TVisualizationSummary`). The contracts are the source of truth.

**Approach**:
- Use `TProjectObject` from `@repo/contracts` instead of local `TProject`
- Use `TVisualizationSummary` from `@repo/contracts` instead of local `TVisualization`
- Use `TIterationObject` from `@repo/contracts` instead of local `TIteration`
- Keep UI-specific derived types (e.g., dashboard stats) as local types since they don't correspond to API responses
- Remove local type files that are fully replaced by contracts

**Alternatives considered**:
- Keep local types as adapters: Unnecessary complexity — the contract types are well-shaped for UI consumption
- Create mapping layers: Over-engineering for MVP — contract types can be used directly in components
