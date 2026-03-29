# Implementation Plan: Web-API Integration & MVP Gap Analysis

**Branch**: `006-web-api-integration` | **Date**: 2026-03-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-web-api-integration/spec.md`

## Summary

Connect the platform-web frontend to all existing platform-api backend endpoints, replacing mock data with real API calls across all views (dashboard, projects, project detail, workspace, credits, settings). Establish consistent React Query hooks for data fetching, mutations, and cache invalidation. Produce a gap analysis document identifying missing backend functionality (payments, account deletion cascade) and a prioritized roadmap for completing the full MVP.

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 16.2 (App Router), React 19, @tanstack/react-query, Axios, Clerk, next-intl, Tailwind CSS v4, Zustand, @repo/ui (shadcn), @repo/contracts (Zod schemas)
**Storage**: MongoDB (backend), Cloudflare R2 (file assets via signed URLs)
**Testing**: Not required for MVP (per constitution — testable architecture only)
**Target Platform**: Web browser (desktop + mobile responsive)
**Project Type**: Web application (monorepo — frontend + backend + shared packages)
**Performance Goals**: Standard web app responsiveness; no client-side timeout during AI generation (long-running requests)
**Constraints**: All UI strings in Polish via next-intl; credit deduction before generation (pessimistic); file uploads via multipart/form-data; signed URLs for image retrieval
**Scale/Scope**: MVP — 6 views to integrate, 18 existing backend endpoints, 5 existing API modules to connect

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle | Status | Notes |
| --- | --- | --- |
| Code Quality | PASS | Will use shared ESLint/TS configs, early returns, object destructuring, type inference — consistent with existing codebase patterns |
| Testing Standards | PASS | No tests required per constitution; architecture remains testable with separated API modules, hooks, and components |
| UX Consistency | PASS | All UI uses @repo/ui components, Tailwind CSS utilities, existing component patterns (PageHeader, Card, Dialog, etc.) |
| Performance Requirements | PASS | React Query caching reduces redundant requests; async generation with loading states; no blocking operations |
| Architecture Guidelines | PASS | Shared types from @repo/contracts; no new packages needed; no circular dependencies; follows existing vertical slice module structure |
| Development Workflow | PASS | Type-checking enforced; linting rules applied; API changes documented in docs/ (gap analysis document) |

**Pre-Phase 0 Gate**: PASSED — all principles satisfied.

## Project Structure

### Documentation (this feature)

```text
specs/006-web-api-integration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── query-keys.md
│   └── hooks-api.md
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
apps/platform-web/src/
├── core/packages/
│   ├── http/                    # Existing HTTP client (Axios + Clerk auth) — no changes
│   ├── query/                   # Existing QueryProvider — no changes
│   └── profile/                 # Existing useProfile hook — no changes
├── modules/
│   ├── projects/
│   │   ├── api/
│   │   │   ├── projects.api.ts          # Existing — already has all endpoints
│   │   │   └── visualizations.api.ts    # Existing — already has all endpoints
│   │   ├── hooks/                       # NEW — React Query hooks for projects
│   │   │   ├── use-projects.ts
│   │   │   ├── use-project.ts
│   │   │   ├── use-create-project.ts
│   │   │   ├── use-update-project.ts
│   │   │   └── use-delete-project.ts
│   │   ├── components/                  # Existing — update to use hooks instead of mock state
│   │   ├── data/                        # Existing mock data — to be removed
│   │   └── types/                       # Existing local types — align with @repo/contracts
│   ├── dashboard/
│   │   ├── hooks/                       # NEW — hooks for dashboard data
│   │   │   └── use-dashboard-data.ts
│   │   ├── components/                  # Existing — update to accept real data
│   │   └── data/                        # Existing mock data — to be removed
│   ├── workspace/
│   │   ├── api/
│   │   │   └── iterations.api.ts        # Existing — already has all endpoints
│   │   ├── hooks/                       # NEW — React Query hooks for workspace
│   │   │   ├── use-visualization.ts
│   │   │   ├── use-iterations.ts
│   │   │   ├── use-create-iteration.ts
│   │   │   └── use-create-visualization.ts
│   │   ├── components/                  # Existing — update to use real API data
│   │   └── data/                        # Existing config data (styles, palettes) — keep
│   ├── credits/
│   │   ├── api/
│   │   │   └── credits.api.ts           # Existing — already has all endpoints
│   │   ├── hooks/                       # NEW — React Query hooks for credits
│   │   │   ├── use-credit-packages.ts
│   │   │   └── use-credit-balance.ts
│   │   ├── components/                  # Existing — update to use real data
│   │   └── data/                        # Existing mock data — to be removed
│   ├── settings/
│   │   ├── api/
│   │   │   └── me.api.ts               # Existing — already has all endpoints
│   │   ├── hooks/                       # NEW — React Query hook for settings
│   │   │   └── use-update-profile.ts
│   │   └── components/                  # Existing — connect theme save to API
│   └── storage/                         # NEW — utility for resolving asset URLs
│       └── hooks/
│           └── use-asset-url.ts
├── views/
│   ├── dashboard/DashboardView.tsx      # Update: replace mock data with hooks
│   ├── projects/ProjectsView.tsx        # Update: replace mock state with hooks
│   ├── projects/ProjectDetailView.tsx   # Update: replace mock data with hooks
│   ├── workspace/WorkspaceView.tsx      # Update: connect to generation API
│   ├── credits/CreditsView.tsx          # Update: replace mock data with hooks
│   └── settings/SettingsView.tsx        # Update: connect theme save to API
└── docs/
    └── mvp-gap-analysis.md              # NEW — gap analysis document
```

**Structure Decision**: No new packages or architectural changes. The integration follows the existing vertical slice module structure. New React Query hooks are added alongside existing API modules. Mock data files are removed after their corresponding hooks are wired in.

## Complexity Tracking

No constitution violations — table not needed.
