# Tasks: Demo to Platform Web Migration

**Input**: Design documents from `/specs/005-demo-to-web-migration/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Not included — spec explicitly excludes automated tests from scope.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story. US10 (Internationalization) is fulfilled inline — each story adds its own i18n keys to `pl.json`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- All paths relative to `apps/platform-web/src/` unless otherwise noted
- Shared UI components from `@repo/ui` (packages/ui)
- Each component folder includes an `index.ts` barrel export

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Define all shared types and mock data constants used across multiple user stories

- [x] T001 [P] Create project domain types (TProject, TVisualization, TIteration) in `apps/platform-web/src/modules/projects/types/projects.types.ts`
- [x] T002 [P] Create workspace domain types (TWorkspaceStyle, TColorPalette, TRoomType, TGenerationMode) in `apps/platform-web/src/modules/workspace/types/workspace.types.ts`
- [x] T003 [P] Create credits domain types (TCreditPackage) in `apps/platform-web/src/modules/credits/types/credits.types.ts`
- [x] T004 [P] Create dashboard domain types (TDashboardStats, TRecentProject) in `apps/platform-web/src/modules/dashboard/types/dashboard.types.ts`
- [x] T005 [P] Create settings domain types (TThemeOption) in `apps/platform-web/src/modules/settings/types/settings.types.ts`
- [x] T006 [P] Create mock projects and visualizations data in `apps/platform-web/src/modules/projects/data/mock-projects.ts`
- [x] T007 [P] Create mock workspace data (styles, palettes, room types) in `apps/platform-web/src/modules/workspace/data/mock-workspace.ts`
- [x] T008 [P] Create mock credit packages data (Starter/Standard/Pro) in `apps/platform-web/src/modules/credits/data/mock-credits.ts`
- [x] T009 [P] Create mock dashboard stats and recent projects data in `apps/platform-web/src/modules/dashboard/data/mock-dashboard.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T010 Migrate all i18n translation keys from `apps/frontend-demo/src/i18n/pl.json` into `apps/platform-web/src/i18n/messages/pl.json`, merging with existing nav/footer/common keys and adapting namespaces to match next-intl conventions
- [x] T011 Update Clerk middleware to make the root `/` route public (add to `isPublicRoute` matcher) in `apps/platform-web/src/middleware.ts`

**Checkpoint**: Foundation ready — user story implementation can now begin in parallel

---

## Phase 3: User Story 1 — Authenticated Application Shell (Priority: P1) 🎯 MVP

**Goal**: Signed-in users navigate via a consistent shell with navbar, sidebar, and footer showing user identity, credit balance, and links to Dashboard, Projects, Credits, Settings.

**Independent Test**: Sign in via Clerk. Verify navbar, sidebar, and footer render on desktop and mobile. Navigation links route correctly. User info and credit badge display. Sign-out works.

**Note**: Navbar and Footer already exist in `core/layout/AppLayout/`. This story adds the sidebar and verifies the full shell.

### Implementation for User Story 1

- [x] T012 [US1] Create AppSidebar component using `@repo/ui` Sidebar primitives with nav items, user card (Clerk `useCurrentUser`), credit badge, and sign-out action in `apps/platform-web/src/modules/navigation/components/AppSidebar/AppSidebar.tsx` with `index.ts`
- [x] T013 [US1] Wire AppSidebar into the app shell layout, wrapping content with SidebarProvider in `apps/platform-web/src/app/(app)/layout.tsx`
- [x] T014 [US1] Verify and update Navbar to work alongside sidebar — ensure mobile menu and sidebar do not conflict, and CreditBadge shows mock balance in `apps/platform-web/src/core/layout/AppLayout/Navbar.tsx`

**Checkpoint**: App shell is fully functional — navbar, sidebar, and footer render on all app-area pages

---

## Phase 4: User Story 2 — Dashboard Page (Priority: P1)

**Goal**: Signed-in user sees dashboard with summary stats (projects, visualizations, credits), quick action buttons, and recent projects list.

**Independent Test**: Navigate to `/dashboard`. Verify stats cards, quick action buttons, and recent project cards render with mock data. Clicking quick actions and project cards navigates correctly. Empty state shows call-to-action.

### Implementation for User Story 2

- [x] T015 [P] [US2] Create StatsCard component displaying a labeled stat value with icon in `apps/platform-web/src/modules/dashboard/components/StatsCard/StatsCard.tsx` with `index.ts`
- [x] T016 [P] [US2] Create QuickActions component with action buttons (New Project, etc.) in `apps/platform-web/src/modules/dashboard/components/QuickActions/QuickActions.tsx` with `index.ts`
- [x] T017 [P] [US2] Create RecentProjects component rendering project cards with links in `apps/platform-web/src/modules/dashboard/components/RecentProjects/RecentProjects.tsx` with `index.ts`
- [x] T018 [US2] Create DashboardView orchestrating StatsCard, QuickActions, and RecentProjects with mock data and empty state handling in `apps/platform-web/src/views/dashboard/DashboardView.tsx` with `index.ts`
- [x] T019 [US2] Create dashboard route page (thin wrapper importing DashboardView) in `apps/platform-web/src/app/(app)/dashboard/page.tsx`

**Checkpoint**: Dashboard page is fully functional and independently testable

---

## Phase 5: User Story 3 — Projects List and Management (Priority: P1)

**Goal**: Signed-in user views all projects, creates new projects via dialog, renames projects, and deletes with confirmation. All operations use mock data with local state.

**Independent Test**: Navigate to `/projects`. Verify project list renders. Create a project via dialog. Rename a project. Delete with confirmation. Verify empty state.

### Implementation for User Story 3

- [x] T020 [P] [US3] Create ProjectCard component with dropdown menu (edit name, delete) in `apps/platform-web/src/modules/projects/components/ProjectCard/ProjectCard.tsx` with `index.ts`
- [x] T021 [P] [US3] Create CreateProjectDialog component with name input and submit in `apps/platform-web/src/modules/projects/components/CreateProjectDialog/CreateProjectDialog.tsx` with `index.ts`
- [x] T022 [P] [US3] Create DeleteProjectDialog confirmation component in `apps/platform-web/src/modules/projects/components/DeleteProjectDialog/DeleteProjectDialog.tsx` with `index.ts`
- [x] T023 [US3] Create ProjectsView orchestrating project list, create/edit/delete dialogs, empty state, and local state management with mock data in `apps/platform-web/src/views/projects/ProjectsView.tsx` with `index.ts`
- [x] T024 [US3] Create projects route page in `apps/platform-web/src/app/(app)/projects/page.tsx`

**Checkpoint**: Projects list page is fully functional with CRUD operations on mock data

---

## Phase 6: User Story 4 — Project Detail with Visualizations (Priority: P2)

**Goal**: Signed-in user views all visualizations within a specific project and can initiate new visualization creation.

**Independent Test**: Navigate to `/projects/[projectId]`. Verify project name heading with back button. Visualization cards render with mock data. "New Visualization" button present. Empty state for projects with no visualizations.

**Dependencies**: Uses TProject and TVisualization types from Phase 1. Shares mock data with US3.

### Implementation for User Story 4

- [x] T025 [P] [US4] Create VisualizationCard component showing name, iteration count, date, and thumbnail in `apps/platform-web/src/modules/projects/components/VisualizationCard/VisualizationCard.tsx` with `index.ts`
- [x] T026 [US4] Create ProjectDetailView orchestrating visualization cards, back navigation, new visualization action, and empty state with mock data lookup by projectId in `apps/platform-web/src/views/projects/ProjectDetailView.tsx` with `index.ts`
- [x] T027 [US4] Create project detail route page extracting projectId param in `apps/platform-web/src/app/(app)/projects/[projectId]/page.tsx`

**Checkpoint**: Project detail page is fully functional — shows visualizations for a given project

---

## Phase 7: User Story 5 — Design Workspace (Priority: P2)

**Goal**: Signed-in user configures and generates interior design visualizations. Two-panel layout: form panel (left) for inputs and preview panel (right) for results and iteration history.

**Independent Test**: Navigate to `/projects/[projectId]/workspace/[visualizationId]`. Verify two-panel layout. Toggle between photo/scratch modes. Fill form fields (style, palette, room type, prompt). Upload photo. Click Generate — see loading state then new iteration. Browse iteration carousel. Verify mobile stacks vertically. Verify insufficient credits message.

**Dependencies**: Uses TVisualization, TIteration, workspace types and mock data from Phase 1.

### Implementation for User Story 5

- [x] T028 [P] [US5] Create ModeToggle component for switching between "From Photo" and "From Scratch" generation modes in `apps/platform-web/src/modules/workspace/components/ModeToggle/ModeToggle.tsx` with `index.ts`
- [x] T029 [P] [US5] Create PhotoUpload component with drag-and-drop, file validation (.jpg/.jpeg/.png/.webp/.avif/.heic), and image preview in `apps/platform-web/src/modules/workspace/components/PhotoUpload/PhotoUpload.tsx` with `index.ts`
- [x] T030 [P] [US5] Create IterationStrip component displaying iteration thumbnails in a horizontal carousel with selection state in `apps/platform-web/src/modules/workspace/components/IterationStrip/IterationStrip.tsx` with `index.ts`
- [x] T031 [P] [US5] Create WorkspacePreview component showing the selected iteration image and iteration strip in `apps/platform-web/src/modules/workspace/components/WorkspacePreview/WorkspacePreview.tsx` with `index.ts`
- [x] T032 [US5] Create WorkspaceForm component with mode toggle, photo upload (conditional), style/palette/room-type selects, prompt textarea, and generate button with loading and credit validation in `apps/platform-web/src/modules/workspace/components/WorkspaceForm/WorkspaceForm.tsx` with `index.ts`
- [x] T033 [US5] Create WorkspaceView orchestrating two-panel responsive layout (form left, preview right; stacked on mobile), generation simulation, and iteration state management in `apps/platform-web/src/views/workspace/WorkspaceView.tsx` with `index.ts`
- [x] T034 [US5] Create workspace route page extracting projectId and visualizationId params in `apps/platform-web/src/app/(app)/projects/[projectId]/workspace/[visualizationId]/page.tsx`

**Checkpoint**: Workspace page is fully functional with form, generation simulation, and iteration browsing

---

## Phase 8: User Story 6 — Credits Page (Priority: P3)

**Goal**: Signed-in user views credit balance and available packages (Starter, Standard, Pro) with pricing. Can simulate purchasing a package.

**Independent Test**: Navigate to `/credits`. Verify three packages render with correct pricing and credit amounts. "Popular" badge on Standard. Click "Buy" shows success toast.

### Implementation for User Story 6

- [x] T035 [P] [US6] Create CreditPackageCard component with name, credits, price, popular badge, and buy button in `apps/platform-web/src/modules/credits/components/CreditPackageCard/CreditPackageCard.tsx` with `index.ts`
- [x] T036 [US6] Create CreditsView displaying current balance and credit package cards grid with mock purchase simulation and toast notification in `apps/platform-web/src/views/credits/CreditsView.tsx` with `index.ts`
- [x] T037 [US6] Create credits route page in `apps/platform-web/src/app/(app)/credits/page.tsx`

**Checkpoint**: Credits page is fully functional with package display and mock purchase flow

---

## Phase 9: User Story 7 — Settings Page (Priority: P3)

**Goal**: Signed-in user manages theme preference (light/dark/system) and can trigger account deletion with confirmation.

**Independent Test**: Navigate to `/settings`. Toggle theme — app appearance changes immediately and persists. Click "Delete Account" — confirmation dialog appears.

### Implementation for User Story 7

- [x] T038 [P] [US7] Create ThemeSelector component with light/dark/system radio options using `useTheme` from next-themes in `apps/platform-web/src/modules/settings/components/ThemeSelector/ThemeSelector.tsx` with `index.ts`
- [x] T039 [P] [US7] Create AccountActions component with delete account button and confirmation dialog in `apps/platform-web/src/modules/settings/components/AccountActions/AccountActions.tsx` with `index.ts`
- [x] T040 [US7] Create SettingsView orchestrating ThemeSelector and AccountActions sections in `apps/platform-web/src/views/settings/SettingsView.tsx` with `index.ts`
- [x] T041 [US7] Create settings route page in `apps/platform-web/src/app/(app)/settings/page.tsx`

**Checkpoint**: Settings page is fully functional with theme switching and account management

---

## Phase 10: User Story 8 — Landing Page (Priority: P3)

**Goal**: Unauthenticated visitors see a marketing landing page with hero section, feature highlights, and CTA buttons to sign in or register. Authenticated users are redirected to dashboard.

**Independent Test**: Visit root URL without being signed in. Verify hero, features, CTAs render. Click "Sign In" → Clerk sign-in. Click "Register" → Clerk sign-up. Responsive at all breakpoints.

### Implementation for User Story 8

- [x] T042 [US8] Create LandingView with hero section (tagline, CTA buttons), feature highlights grid (3 cards), and responsive layout in `apps/platform-web/src/views/landing/LandingView.tsx` with `index.ts`
- [x] T043 [US8] Update root page to check auth state — redirect signed-in users to `/dashboard`, render LandingView for visitors in `apps/platform-web/src/app/(app)/page.tsx`

**Checkpoint**: Landing page is fully functional for unauthenticated visitors

---

## Phase 11: User Story 9 — Not Found Page (Priority: P3)

**Goal**: Any user navigating to a non-existent URL sees a friendly 404 page with a link back to home.

**Independent Test**: Navigate to any invalid URL. Verify 404 page renders with message and home link.

### Implementation for User Story 9

- [x] T044 [US9] Create global not-found page with 404 message and link to home in `apps/platform-web/src/app/not-found.tsx`

**Checkpoint**: 404 page handles all unmatched routes

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and improvements across all user stories

- [x] T045 Visual parity review — compare each page side-by-side with demo app at 375px, 768px, and 1440px viewports and fix discrepancies
- [x] T046 Verify all i18n keys render correctly — no missing translation warnings, no hardcoded Polish strings
- [x] T047 Run `bun run lint`, `bun run check-types`, and `bun run format:check` and fix any issues
- [x] T048 Verify all navigation links work end-to-end — no broken routes or dead links across the entire app

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — BLOCKS US2–US9 (provides sidebar shell)
- **US2–US3 (Phases 4–5)**: Depend on US1 — can run in parallel with each other
- **US4 (Phase 6)**: Depends on US3 (shares project module components and data)
- **US5 (Phase 7)**: Depends on US4 (workspace is accessed from project detail)
- **US6–US9 (Phases 8–11)**: Depend on US1 — can run in parallel with each other and with US2–US5
- **Polish (Phase 12)**: Depends on all user stories being complete

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
Phase 3 (US1: App Shell)
    ↓
    ├── Phase 4 (US2: Dashboard) ──────────────────────────────┐
    ├── Phase 5 (US3: Projects) → Phase 6 (US4: Detail) → Phase 7 (US5: Workspace) ──→ Phase 12
    ├── Phase 8 (US6: Credits) ────────────────────────────────┤      (Polish)
    ├── Phase 9 (US7: Settings) ───────────────────────────────┤
    ├── Phase 10 (US8: Landing) ───────────────────────────────┤
    └── Phase 11 (US9: Not Found) ─────────────────────────────┘
```

### Within Each User Story

- Domain components (marked [P]) before orchestration views
- Views before route pages
- Core implementation before integration

### Parallel Opportunities

- **Phase 1**: All 9 tasks (T001–T009) can run in parallel
- **Phase 2**: T010 and T011 can run in parallel
- **Phase 3**: T012 before T013–T014 (sequential)
- **Phase 4**: T015, T016, T017 in parallel → T018 → T019
- **Phase 5**: T020, T021, T022 in parallel → T023 → T024
- **Phase 6**: T025 in parallel with nothing → T026 → T027
- **Phase 7**: T028, T029, T030, T031 in parallel → T032 → T033 → T034
- **Phases 8–11**: Can all run in parallel after US1

---

## Parallel Example: User Story 5 (Workspace)

```bash
# Launch all independent components together:
Task: "Create ModeToggle in modules/workspace/components/ModeToggle/"
Task: "Create PhotoUpload in modules/workspace/components/PhotoUpload/"
Task: "Create IterationStrip in modules/workspace/components/IterationStrip/"
Task: "Create WorkspacePreview in modules/workspace/components/WorkspacePreview/"

# Then sequentially:
Task: "Create WorkspaceForm (depends on ModeToggle, PhotoUpload)"
Task: "Create WorkspaceView (depends on WorkspaceForm, WorkspacePreview)"
Task: "Create workspace route page (depends on WorkspaceView)"
```

---

## Implementation Strategy

### MVP First (User Stories 1–3)

1. Complete Phase 1: Setup (types + mock data)
2. Complete Phase 2: Foundational (i18n + middleware)
3. Complete Phase 3: US1 (App Shell with sidebar)
4. Complete Phase 4: US2 (Dashboard)
5. Complete Phase 5: US3 (Projects)
6. **STOP and VALIDATE**: App shell, dashboard, and projects are functional
7. Deploy/demo if ready

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 (Shell) → Navigation works → Deploy (MVP shell)
3. Add US2 (Dashboard) + US3 (Projects) → Core pages live → Deploy
4. Add US4 (Detail) + US5 (Workspace) → Full design workflow → Deploy
5. Add US6 (Credits) + US7 (Settings) + US8 (Landing) + US9 (404) → Complete app → Deploy
6. Polish → Visual parity validated → Final deploy

### Suggested MVP Scope

**US1 + US2 + US3** — Delivers a working authenticated app with navigation, dashboard overview, and project management. This covers all P1 stories and provides a meaningful demo.
