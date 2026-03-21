# Implementation Plan: Demo to Platform Web Migration

**Branch**: `005-demo-to-web-migration` | **Date**: 2026-03-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-demo-to-web-migration/spec.md`

## Summary

Migrate all pages and UI from `apps/frontend-demo` (React + Vite + React Router) to `apps/platform-web` (Next.js App Router), preserving visual parity and using mock data. The platform-web app already has Clerk auth, next-themes, next-intl, and a layout shell (navbar, footer) in place. Migration fills in: route pages, views, domain modules, i18n keys, and any missing UI components.

## Technical Context

**Language/Version**: TypeScript 5.9, React 19, Next.js 16.2
**Primary Dependencies**: next-intl 4.8.3, @clerk/nextjs 7.0.6, next-themes 0.4.6, lucide-react, @repo/ui (shadcn components), Tailwind CSS v4
**Storage**: N/A (mock data only, no persistence)
**Testing**: Manual visual comparison (no automated tests in scope)
**Target Platform**: Web (browser), responsive (375px–1440px+)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: Standard web app expectations — pages load and render without perceptible delay
**Constraints**: Visual parity with frontend-demo; Polish language only; mock data only (no API)
**Scale/Scope**: 9 pages, ~7 domain modules, ~145 i18n keys to migrate

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                | Status  | Notes                                                                                                         |
| ------------------------ | ------- | ------------------------------------------------------------------------------------------------------------- |
| Code Quality             | ✅ Pass | Will use shared TS/ESLint configs, arrow functions, object params, type inference, `T` prefix types           |
| Testing Standards        | ✅ Pass | No tests required (spec excludes tests); architecture remains testable via module separation                  |
| UX Consistency           | ✅ Pass | All UI components sourced from `@repo/ui`; visual parity enforced per spec                                    |
| Performance Requirements | ✅ Pass | Next.js App Router with server components by default; client components only where needed                     |
| Architecture Guidelines  | ✅ Pass | Follows monorepo boundaries: `@repo/ui` for presentational, `modules/` for domain, `views/` for orchestration |
| Development Workflow     | ✅ Pass | Shared linting/type-checking; no DB/API changes in scope                                                      |

No violations. No complexity tracking needed.

## Project Structure

### Documentation (this feature)

```text
specs/005-demo-to-web-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (N/A — no external interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
apps/platform-web/src/
├── app/
│   ├── layout.tsx                                              # Existing root layout (RootLayout)
│   ├── not-found.tsx                                           # NEW: Global 404 page
│   ├── (auth)/
│   │   ├── sign-in/[[...sign-in]]/page.tsx                     # Existing (Clerk)
│   │   └── sign-up/[[...sign-up]]/page.tsx                     # Existing (Clerk)
│   └── (app)/
│       ├── layout.tsx                                          # Existing app shell layout
│       ├── page.tsx                                            # MODIFY: Landing/dashboard decision based on auth
│       ├── dashboard/page.tsx                                  # NEW: Dashboard route
│       ├── projects/page.tsx                                   # NEW: Projects list route
│       ├── projects/[projectId]/page.tsx                       # NEW: Project detail route
│       ├── projects/[projectId]/workspace/[visualizationId]/
│       │   └── page.tsx                                        # NEW: Workspace route
│       ├── credits/page.tsx                                    # NEW: Credits route
│       └── settings/page.tsx                                   # NEW: Settings route
│
├── views/
│   ├── landing/
│   │   ├── LandingView.tsx                                     # NEW
│   │   └── index.ts
│   ├── dashboard/
│   │   ├── DashboardView.tsx                                   # NEW
│   │   └── index.ts
│   ├── projects/
│   │   ├── ProjectsView.tsx                                    # NEW
│   │   ├── ProjectDetailView.tsx                               # NEW
│   │   └── index.ts
│   ├── workspace/
│   │   ├── WorkspaceView.tsx                                   # NEW
│   │   └── index.ts
│   ├── credits/
│   │   ├── CreditsView.tsx                                     # NEW
│   │   └── index.ts
│   └── settings/
│       ├── SettingsView.tsx                                    # NEW
│       └── index.ts
│
├── modules/
│   ├── navigation/
│   │   └── components/
│   │       └── AppSidebar/                                     # NEW (if sidebar is added to layout)
│   │           ├── AppSidebar.tsx
│   │           └── index.ts
│   ├── projects/
│   │   ├── components/
│   │   │   ├── ProjectCard/
│   │   │   ├── CreateProjectDialog/
│   │   │   ├── DeleteProjectDialog/
│   │   │   └── VisualizationCard/
│   │   ├── data/
│   │   │   └── mock-projects.ts                                # NEW: Mock project/visualization data
│   │   └── types/
│   │       └── projects.types.ts                               # NEW: TProject, TVisualization, TIteration
│   ├── workspace/
│   │   ├── components/
│   │   │   ├── WorkspaceForm/
│   │   │   ├── WorkspacePreview/
│   │   │   ├── IterationStrip/
│   │   │   ├── PhotoUpload/
│   │   │   └── ModeToggle/
│   │   ├── data/
│   │   │   └── mock-workspace.ts                               # NEW: Mock styles, palettes, room types
│   │   └── types/
│   │       └── workspace.types.ts
│   ├── credits/
│   │   ├── components/
│   │   │   └── CreditPackageCard/
│   │   ├── data/
│   │   │   └── mock-credits.ts                                 # NEW: Mock credit packages
│   │   └── types/
│   │       └── credits.types.ts
│   ├── settings/
│   │   ├── components/
│   │   │   ├── ThemeSelector/
│   │   │   └── AccountActions/
│   │   └── types/
│   │       └── settings.types.ts
│   └── dashboard/
│       ├── components/
│       │   ├── StatsCard/
│       │   ├── QuickActions/
│       │   └── RecentProjects/
│       ├── data/
│       │   └── mock-dashboard.ts                               # NEW: Mock stats
│       └── types/
│           └── dashboard.types.ts
│
├── core/
│   ├── layout/
│   │   ├── RootLayout/                                         # Existing
│   │   └── AppLayout/                                          # Existing (navbar, footer, nav items)
│   └── packages/
│       ├── auth/                                               # Existing (Clerk)
│       └── theme/                                              # Existing (next-themes)
│
└── i18n/
    ├── request.ts                                              # Existing
    └── messages/
        └── pl.json                                             # MODIFY: Add ~130 missing translation keys
```

**Structure Decision**: Follows the vertical slice architecture defined in `docs/frontend-demo-to-platform-web-migration-plan.md` and CLAUDE.md rules. The existing `core/layout/AppLayout` already handles navbar+footer; sidebar may be added as a navigation module component. Each page has a thin `page.tsx` delegating to a `View` component, with domain logic in `modules/`.

## Complexity Tracking

No constitution violations — section not applicable.
