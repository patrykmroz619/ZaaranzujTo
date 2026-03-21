# Implementation Plan: Layout Migration (frontend-demo → platform-web)

**Branch**: `004-layout-migration` | **Date**: 2026-03-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-layout-migration/spec.md`

## Summary

Migrate the authenticated layout shell (navbar, footer, mobile navigation, page header) from the React Router-based `frontend-demo` SPA to the Next.js 16 App Router-based `platform-web` app. Replace mock auth with Clerk, replace react-i18next with next-intl, and extract the business-agnostic `PageHeader` component into the `@repo/ui` package.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19, Next.js 16.2
**Primary Dependencies**: Next.js (App Router), Tailwind CSS v4, Clerk (auth), next-intl (i18n), Zustand (state), Lucide React (icons), @repo/ui (shadcn components)
**Storage**: N/A (layout-only, no data persistence)
**Testing**: Not applicable (no tests unless explicitly requested per constitution)
**Target Platform**: Web (desktop + mobile, responsive at 768px breakpoint)
**Project Type**: Web application (monorepo workspace)
**Performance Goals**: No layout shift, instant navigation via Next.js client-side routing
**Constraints**: Visual parity with frontend-demo, Polish-only i18n, Clerk for real auth (no mocks)
**Scale/Scope**: 5 layout components, ~10 authenticated routes wrapped by the shell

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

| Principle                    | Status | Notes                                                                                                                                 |
| ---------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| **Code Quality**             | PASS   | Shared ESLint/TS configs used. Arrow functions, object destructuring, type inference per style guide.                                 |
| **Testing Standards**        | PASS   | No tests written (MVP policy). Architecture remains testable — components are pure presentational with injected props.                |
| **UX Consistency**           | PASS   | Reusing `@repo/ui` components (Button, Avatar, DropdownMenu, Sheet). Extracting PageHeader to `@repo/ui`. No inline styles.           |
| **Performance Requirements** | PASS   | Server components where possible. Client components only for interactivity (navbar state, mobile menu). No heavy blocking operations. |
| **Architecture Guidelines**  | PASS   | Shared code in `packages/ui`, app-specific layouts in `apps/platform-web`. No circular dependencies.                                  |
| **Development Workflow**     | PASS   | Type-checking and linting enforced. No DB/API changes — no docs to update.                                                            |

**Gate result: PASS — no violations.**

## Project Structure

### Documentation (this feature)

```text
specs/004-layout-migration/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
apps/platform-web/src/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx              # Authenticated shell layout (Navbar + Footer)
│   │   ├── page.tsx                # Dashboard redirect or root page
│   │   └── not-found.tsx           # 404 page for app group
│   └── (auth)/
│       └── ...                     # Existing Clerk auth pages
├── core/
│   ├── layout/
│   │   ├── RootLayout/             # Existing root layout (providers)
│   │   ├── AppShell/               # New: authenticated shell wrapper
│   │   │   ├── index.ts
│   │   │   └── AppShell.tsx
│   │   ├── Navbar/                 # New: top navigation bar
│   │   │   ├── index.ts
│   │   │   ├── Navbar.tsx
│   │   │   ├── NavLinks.tsx        # Desktop navigation links
│   │   │   ├── MobileNav.tsx       # Mobile hamburger + overlay
│   │   │   ├── CreditBadge.tsx     # Credit balance pill
│   │   │   └── UserMenu.tsx        # User avatar + dropdown
│   │   └── Footer/                 # New: site footer
│   │       ├── index.ts
│   │       └── Footer.tsx
│   └── packages/
│       ├── auth/                   # Existing Clerk integration
│       └── theme/                  # Existing next-themes
├── i18n/
│   └── messages/
│       └── pl.json                 # Add nav, footer, common translation keys
└── modules/                        # Future: domain-specific feature modules

packages/ui/src/
├── components/
│   └── page-header/                # New: extracted PageHeader component
│       ├── index.ts
│       └── page-header.tsx
```

**Structure Decision**: The layout components live in `apps/platform-web/src/core/layout/` following the existing pattern (RootLayout). The `PageHeader` is extracted to `packages/ui/src/components/` since it is business-agnostic and reusable (FR-008). The navbar is split into subcomponents to maintain single responsibility per CLAUDE.md guidelines.

## Complexity Tracking

> No violations — table not needed.
