# Tasks: Web-API Integration & MVP Gap Analysis

**Input**: Design documents from `/specs/006-web-api-integration/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/query-keys.md, contracts/hooks-api.md, quickstart.md

**Tests**: Not required (per constitution — testable architecture only).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Frontend**: `apps/platform-web/src/`
- **Backend**: `apps/platform-api/src/` (no backend changes in this feature)
- **Shared**: `packages/contracts/src/`
- **Docs**: `docs/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create foundational utilities and patterns that all user stories depend on.

- [X] T001 Create query key factory in `apps/platform-web/src/core/packages/query/query-keys.ts` — define the `queryKeys` object with namespaced key generators for projects, visualizations, credits, profile, and storage per `contracts/query-keys.md`
- [X] T002 [P] Create storage API module in `apps/platform-web/src/modules/storage/api/storage.api.ts` — implement `getDownloadUrl(assetId)` function following the existing API module pattern (try/catch, `handleHttpError`, `serverClient` param) calling `GET /api/v1/storage/assets/{assetId}/download-url`
- [X] T003 [P] Add error i18n keys to `apps/platform-web/src/i18n/messages/pl.json` — add an `errors` section with Polish messages for status codes: 401 (session expired), 402 (insufficient credits), 404 (not found), 409 (generation conflict), 500 (server error), and a generic network error message

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core hooks and type alignment that MUST be complete before ANY user story can be implemented.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Create `useAssetUrl` hook in `apps/platform-web/src/modules/storage/hooks/use-asset-url.ts` — React Query hook that resolves an asset ID to a signed download URL via the storage API module; use `staleTime: 50 * 60 * 1000` (50 min), `enabled: !!assetId`; return `{ url, isLoading }`; handle null/undefined assetId gracefully
- [X] T005 [P] Update `apps/platform-web/src/modules/workspace/api/iterations.api.ts` — modify `createIteration` to accept `FormData` body and send as `multipart/form-data` (remove explicit JSON content-type for this call); accept `idempotencyKey` via headers param
- [X] T006 [P] Align component types with `@repo/contracts` — update `apps/platform-web/src/modules/projects/components/ProjectCard/ProjectCard.tsx` to accept `TProjectObject` instead of local `TProject`; update `apps/platform-web/src/modules/projects/components/VisualizationCard/VisualizationCard.tsx` to accept `TVisualizationSummary` instead of local `TVisualization`; update any other components referencing local mock types

**Checkpoint**: Foundation ready — query keys, asset URL resolution, multipart support, and type alignment complete. User story implementation can now begin.

---

## Phase 3: User Story 1 — Browse and Manage Projects via Live Backend (Priority: P1) 🎯 MVP

**Goal**: Replace all mock data in projects and dashboard views with real backend data. Enable full CRUD on projects.

**Independent Test**: Sign in, create a project, refresh page — project persists. Delete it — it disappears. Dashboard shows real stats.

### Implementation for User Story 1

- [X] T007 [P] [US1] Create `useProjects` query hook in `apps/platform-web/src/modules/projects/hooks/use-projects.ts` — call `projectsApi.list()` with query key `queryKeys.projects.all`; accept optional `query` param for pagination/sorting; return `{ projects, isLoading, error }`
- [X] T008 [P] [US1] Create `useCreateProject` mutation hook in `apps/platform-web/src/modules/projects/hooks/use-create-project.ts` — call `projectsApi.create()`; on success invalidate `queryKeys.projects.all`; show success toast
- [X] T009 [P] [US1] Create `useUpdateProject` mutation hook in `apps/platform-web/src/modules/projects/hooks/use-update-project.ts` — call `projectsApi.update()`; on success invalidate `queryKeys.projects.all` and `queryKeys.projects.detail(projectId)`
- [X] T010 [P] [US1] Create `useDeleteProject` mutation hook in `apps/platform-web/src/modules/projects/hooks/use-delete-project.ts` — call `projectsApi.delete()`; on success invalidate `queryKeys.projects.all`; show success toast
- [X] T011 [US1] Update `apps/platform-web/src/views/projects/ProjectsView.tsx` — replace `useState<TProject[]>(MOCK_PROJECTS)` with `useProjects()` hook; replace local `handleCreateProject` with `useCreateProject().mutate`; replace local `handleDeleteProject` with `useDeleteProject().mutate`; add loading and error states; remove mock data import
- [X] T012 [US1] Update `apps/platform-web/src/modules/projects/components/CreateProjectDialog/CreateProjectDialog.tsx` — wire `onCreate` to accept the mutation's `mutateAsync` and handle isPending state (disable button during submission)
- [X] T013 [US1] Update `apps/platform-web/src/views/dashboard/DashboardView.tsx` — replace `MOCK_STATS`, `MOCK_RECENT_PROJECTS`, `MOCK_LAST_VISUALIZATION` with data derived from `useProjects({ query: { sort: "updatedAt:desc", pageSize: 5 } })` and `useProfile()`; compute `projectCount` from `pagination.totalItems`, `visualizationCount` from sum of `visualizationsCount`, `creditBalance` from profile; add loading states
- [X] T014 [US1] Remove mock data files: `apps/platform-web/src/modules/projects/data/mock-projects.ts` and `apps/platform-web/src/modules/dashboard/data/mock-dashboard.ts` — verify no remaining imports reference these files

**Checkpoint**: Projects CRUD works end-to-end. Dashboard shows real data. User Story 1 is fully functional and testable independently.

---

## Phase 4: User Story 2 — View Visualizations and Iteration History from Backend (Priority: P1)

**Goal**: Replace mock visualizations in the project detail view with real data. Display real iteration images via signed URLs.

**Independent Test**: Navigate to a project with visualizations — see real thumbnails loaded from R2. Click thumbnails in iteration strip — images load.

### Implementation for User Story 2

- [X] T015 [P] [US2] Create `useProjectVisualizations` query hook in `apps/platform-web/src/modules/projects/hooks/use-project-visualizations.ts` — call `visualizationsApi.list()` with `projectId`; use query key `queryKeys.projects.visualizations(projectId)`; return `{ visualizations, isLoading, error }`
- [X] T016 [P] [US2] Create `useVisualization` query hook in `apps/platform-web/src/modules/workspace/hooks/use-visualization.ts` — call `visualizationsApi.get()` with `visualizationId`; use query key `queryKeys.visualizations.detail(visualizationId)`; return `{ visualization, isLoading, error }`
- [X] T017 [P] [US2] Create `useIterations` query hook in `apps/platform-web/src/modules/workspace/hooks/use-iterations.ts` — call `iterationsApi.list()` with `visualizationId`; use query key `queryKeys.visualizations.iterations(visualizationId)`; return `{ iterations, isLoading, error }`
- [X] T018 [US2] Update `apps/platform-web/src/views/projects/ProjectDetailView.tsx` — replace `MOCK_VISUALIZATIONS` lookup with `useProjectVisualizations(projectId)` hook; render real visualizations with `latestIteration.imageAssetId` resolved through `useAssetUrl`; add loading and empty states
- [X] T019 [US2] Update `apps/platform-web/src/modules/projects/components/VisualizationCard/VisualizationCard.tsx` — display thumbnail via `useAssetUrl(visualization.latestIteration?.imageAssetId)`; show placeholder when no iterations exist; display iteration count and date from real data

**Checkpoint**: Project detail page shows real visualizations with thumbnails from R2. User Story 2 is independently testable.

---

## Phase 5: User Story 3 — Generate Visualizations via Live AI Backend (Priority: P1)

**Goal**: Connect the workspace creation form to the backend's iteration creation endpoint. Enable real AI generation with credit deduction.

**Independent Test**: Create a new visualization, fill the form, submit — get a real AI-generated image. Credit balance decreases by 1.

### Implementation for User Story 3

- [X] T020 [P] [US3] Create `useCreateVisualization` mutation hook in `apps/platform-web/src/modules/workspace/hooks/use-create-visualization.ts` — call `visualizationsApi.create()` with `projectId`, body (`name`, `mode`), and `idempotencyKey` header (UUID); on success invalidate `queryKeys.projects.visualizations(projectId)` and `queryKeys.projects.detail(projectId)`
- [X] T021 [P] [US3] Create `useCreateIteration` mutation hook in `apps/platform-web/src/modules/workspace/hooks/use-create-iteration.ts` — build `FormData` from form state (inputPhoto file, referencePhotos files, stylePreset, promptContext); generate `idempotencyKey` UUID; call updated `iterationsApi.create()`; on success invalidate `queryKeys.visualizations.detail(vizId)`, `queryKeys.visualizations.iterations(vizId)`, and `queryKeys.profile`
- [X] T022 [US3] Update `apps/platform-web/src/views/workspace/WorkspaceView.tsx` — creation flow: replace `creditBalance = 12` with `useProfile().profile?.creditBalance`; replace `setTimeout` mock generation with `useCreateIteration().mutateAsync`; on successful first iteration, transition to edit mode; wire the "Generate" button disabled state to real credit balance check and `isPending` from mutation; handle generation errors with toast notifications using i18n error messages
- [X] T023 [US3] Update `apps/platform-web/src/modules/workspace/components/WorkspaceForm/WorkspaceForm.tsx` — update the credit balance guard to use the real balance prop; ensure the "Generate" button shows loading spinner from mutation's `isPending` state; display error toasts on failure using Polish error messages

**Checkpoint**: Users can generate real AI visualizations. Credit balance updates. Form transitions to edit mode. User Story 3 is independently testable.

---

## Phase 6: User Story 4 — Iterate on Existing Visualizations (Priority: P1)

**Goal**: Enable loading existing visualizations in the workspace with real iteration data. Support creating new iterations from previous ones.

**Independent Test**: Open an existing visualization — see real iterations in thumbnail strip. Submit edit form — new iteration appears.

### Implementation for User Story 4

- [X] T024 [US4] Update `apps/platform-web/src/views/workspace/WorkspaceView.tsx` — edit/iteration flow: when opening an existing visualization (`visualizationId !== "new"`), fetch visualization details via `useVisualization(visualizationId)` and iterations via `useIterations(visualizationId)`; populate the iteration thumbnail strip with real data; set `activeIteration` to the latest iteration; pass `baseIterationId` (the selected iteration's ID) when submitting a new generation; replace hardcoded iterations array with fetched data
- [X] T025 [US4] Update `apps/platform-web/src/modules/workspace/components/WorkspacePreview/WorkspacePreview.tsx` — render real iteration images via `useAssetUrl(iteration.result.imageAssetId)`; show original input photo thumbnail (if `fromPhoto` mode) via `useAssetUrl(visualization.inputRoomPhotoAssetId)`; handle loading states for image URL resolution
- [X] T026 [US4] Update `apps/platform-web/src/modules/workspace/components/IterationStrip/IterationStrip.tsx` — accept real `TIterationObject[]` data; render thumbnails using `useAssetUrl` for each iteration's `result.imageAssetId`; highlight the active iteration; support clicking to select an iteration as the base for new generation

**Checkpoint**: Full iteration workflow works — view history, select base, generate new iteration. User Story 4 is independently testable.

---

## Phase 7: User Story 5 — View Credit Balance and Packages from Backend (Priority: P2)

**Goal**: Replace mock credit packages with real data from the backend.

**Independent Test**: Navigate to `/credits` — see packages with real names, prices, and credit amounts matching backend config.

### Implementation for User Story 5

- [X] T027 [P] [US5] Create `useCreditPackages` query hook in `apps/platform-web/src/modules/credits/hooks/use-credit-packages.ts` — call `creditsApi.getPackages()`; use query key `queryKeys.credits.packages`; set `staleTime: 5 * 60 * 1000`; return `{ packages, isLoading, error }`
- [X] T028 [US5] Update `apps/platform-web/src/views/credits/CreditsView.tsx` — replace `MOCK_CREDIT_PACKAGES` with `useCreditPackages()` hook; render real packages via `CreditPackageCard`; add loading and empty states; keep purchase button as non-functional CTA (payment integration is out of scope)
- [X] T029 [US5] Remove mock data file `apps/platform-web/src/modules/credits/data/mock-credits.ts` — verify no remaining imports reference this file

**Checkpoint**: Credits page shows real packages. User Story 5 is independently testable.

---

## Phase 8: User Story 6 — Manage Profile and Settings via Backend (Priority: P2)

**Goal**: Persist theme preference to the backend. Restore saved theme on login.

**Independent Test**: Change theme to "dark", refresh page — theme persists. Sign in on new session — saved theme applied.

### Implementation for User Story 6

- [X] T030 [P] [US6] Create `useUpdateProfile` mutation hook in `apps/platform-web/src/modules/settings/hooks/use-update-profile.ts` — call `meApi.updateProfile()`; on success invalidate `queryKeys.profile`; show success toast
- [X] T031 [US6] Update `apps/platform-web/src/views/settings/SettingsView.tsx` — connect `ThemeSelector` to `useUpdateProfile` mutation; when user selects a theme, call `mutate({ body: { theme } })`; use `useProfile()` to get current theme preference and set initial state; handle loading/error states
- [X] T032 [US6] Update `apps/platform-web/src/modules/settings/components/ThemeSelector/ThemeSelector.tsx` — accept `onThemeChange` callback and `isPending` prop; disable selector while saving; apply theme locally AND persist to backend simultaneously

**Checkpoint**: Theme persistence works end-to-end. User Story 6 is independently testable.

---

## Phase 9: User Story 7 — MVP Gap Analysis Document (Priority: P2)

**Goal**: Create a comprehensive gap analysis document mapping all PRD features to implementation status.

**Independent Test**: Review document against PRD — every MVP feature accounted for with clear status.

### Implementation for User Story 7

- [X] T033 [US7] Create `docs/mvp-gap-analysis.md` — document must include: (1) Executive summary of current implementation state, (2) Feature-by-feature status table mapping all 24 PRD user stories to status (complete/partial/not started) with details of what's missing, (3) Missing backend endpoints section listing `POST /payments`, `POST /payments/webhook`, and full `DELETE /me` cascade with required contracts and priority, (4) Missing frontend features section (credit purchase flow, account deletion), (5) Prioritized development roadmap with ordered work items and dependencies, (6) Backend endpoint inventory table showing all 18 implemented endpoints

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Cleanup, error handling hardening, and final verification.

- [X] T034 Remove remaining local mock type files — delete `apps/platform-web/src/modules/projects/types/projects.types.ts` if fully replaced by `@repo/contracts` types; delete `apps/platform-web/src/modules/dashboard/types/dashboard.types.ts` if only used by mock data; verify no broken imports
- [X] T035 [P] Add inline error states to all query-backed views — ensure `ProjectsView`, `ProjectDetailView`, `DashboardView`, `CreditsView`, and `WorkspaceView` display user-friendly error messages with retry buttons when queries fail; use Polish i18n error messages from T003
- [X] T036 [P] Add loading skeletons/states to all query-backed views — ensure `ProjectsView`, `ProjectDetailView`, `DashboardView`, `CreditsView`, and `WorkspaceView` show loading indicators while data is being fetched
- [X] T037 Verify build and lint pass — run `bun run build`, `bun run lint`, and `bun run check-types` from monorepo root; fix any compilation or lint errors introduced by the integration
- [X] T038 Run quickstart.md validation — follow the verification steps from `specs/006-web-api-integration/quickstart.md` manually: sign in, create project, verify persistence, check credits page, verify header badge

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T001 (query keys); T004 depends on T002 (storage API); T005 and T006 are independent
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 (Phase 3): Can start after Phase 2
  - US2 (Phase 4): Can start after Phase 2 (independent of US1)
  - US3 (Phase 5): Can start after Phase 2 (independent of US1, US2)
  - US4 (Phase 6): Depends on US2 (uses useVisualization, useIterations) and US3 (uses useCreateIteration)
  - US5 (Phase 7): Can start after Phase 2 (independent)
  - US6 (Phase 8): Can start after Phase 2 (independent)
  - US7 (Phase 9): No code dependencies — can start anytime
- **Polish (Phase 10)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Independent — no dependencies on other stories
- **US2 (P1)**: Independent — no dependencies on other stories
- **US3 (P1)**: Independent — no dependencies on other stories
- **US4 (P1)**: Depends on US2 (visualization/iteration query hooks) and US3 (iteration creation hook)
- **US5 (P2)**: Independent — no dependencies on other stories
- **US6 (P2)**: Independent — no dependencies on other stories
- **US7 (P2)**: Independent — documentation only, no code dependencies

### Within Each User Story

- Hooks before view updates (hooks are consumed by views)
- Query hooks before mutation hooks (mutations reference query keys for invalidation)
- View updates after all hooks for that story are ready
- Mock data removal after views are fully updated

### Parallel Opportunities

- T002 and T003 can run in parallel with each other (and after T001)
- T004, T005, T006 can all run in parallel (Phase 2)
- T007, T008, T009, T010 can all run in parallel (US1 hooks)
- T015, T016, T017 can all run in parallel (US2 hooks)
- T020, T021 can run in parallel (US3 hooks)
- T027 can run in parallel with US3/US4 work (US5 hook)
- T030 can run in parallel with other story work (US6 hook)
- US1, US2, US3, US5, US6, US7 can all proceed in parallel after Phase 2

---

## Parallel Example: User Story 1

```
# Launch all hooks for US1 together (T007-T010 are [P]):
Task: "Create useProjects hook in apps/platform-web/src/modules/projects/hooks/use-projects.ts"
Task: "Create useCreateProject hook in apps/platform-web/src/modules/projects/hooks/use-create-project.ts"
Task: "Create useUpdateProject hook in apps/platform-web/src/modules/projects/hooks/use-update-project.ts"
Task: "Create useDeleteProject hook in apps/platform-web/src/modules/projects/hooks/use-delete-project.ts"

# Then sequentially update views (T011-T014):
Task: "Update ProjectsView to use hooks"
Task: "Update CreateProjectDialog for mutation"
Task: "Update DashboardView with real data"
Task: "Remove mock data files"
```

## Parallel Example: Multiple Stories

```
# After Phase 2 (Foundational) is complete, launch independent stories in parallel:
Story US1: T007-T014 (Projects + Dashboard)
Story US2: T015-T019 (Visualizations + Iteration History)
Story US3: T020-T023 (Generation)
Story US5: T027-T029 (Credits)
Story US6: T030-T032 (Settings)
Story US7: T033 (Gap Analysis Document)

# Then: US4 (T024-T026) after US2 + US3 complete
# Finally: Phase 10 (T034-T038) after all stories complete
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T006)
3. Complete Phase 3: User Story 1 (T007-T014)
4. **STOP and VALIDATE**: Sign in, create/delete projects, verify dashboard shows real data
5. Deploy/demo if ready — real data persistence is the first meaningful milestone

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Projects + Dashboard) → Test independently → **MVP!**
3. Add US2 (Visualizations) → Test independently → Can view real designs
4. Add US3 (Generation) → Test independently → Core value: AI generation works
5. Add US4 (Iteration) → Test independently → Full creative workflow
6. Add US5 (Credits) → Test independently → Paywall visibility complete
7. Add US6 (Settings) → Test independently → Theme persistence
8. Add US7 (Gap Analysis) → Review document → Planning artifact ready
9. Polish (Phase 10) → Error handling + cleanup → Production-ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: US1 (Projects + Dashboard)
   - Developer B: US2 (Visualizations) → then US4 (Iteration)
   - Developer C: US3 (Generation) + US5 (Credits)
   - Developer D: US6 (Settings) + US7 (Gap Analysis)
3. Stories complete and integrate independently
4. Regroup for Phase 10 (Polish)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete tasks
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable (except US4 which depends on US2+US3 hooks)
- No tests are included (per constitution — testable architecture only)
- All React Query hooks follow the established `useProfile` pattern from `apps/platform-web/src/core/packages/profile/use-profile.ts`
- All API modules already exist — this feature only adds hooks and updates views
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
