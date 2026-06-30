# platform-web — CLAUDE.md

> **Root instructions:** [`../../CLAUDE.md`](../../CLAUDE.md) — repo-wide commands, tech stack, and code style. This file adds rules specific to `platform-web`.

Next.js 16 App Router frontend. Tailwind CSS v4, Zustand, Clerk (auth), next-intl (i18n).

## Structure

`src/` is organized as:

- `app/` — App Router routes, grouped by `(auth)` and `(app)`. Keep `page.tsx` thin.
- `views/` — one orchestration component per page (data loading + composition)
- `modules/` — domain vertical slices (`credits`, `dashboard`, `projects`, `settings`, `storage`, `workspace`)
- `core/` — shared app infrastructure (`lib`, `packages`)
- `layouts/` — layout components
- `i18n/` — next-intl configuration and messages

## Commands

Run from the monorepo root: `bun run dev:web`.

## Rules — React (common)

- Keep components small and focused on a single responsibility.
- If a component starts mixing data fetching, mapping logic, and complex JSX structure, split it into smaller components and helper files.
- For larger views, keep one orchestration component for data loading and delegate rendering to presentational child components.
- Each component should have its own folder with an `index.ts` file.

## Rules — Next.js

- Follow vertical slice architecture, grouping related components, hooks, and styles together.
- Domain-specific logic should be stored in the `modules` folder following vertical slice architecture.
- When creating new pages, add a dedicated component in the `views` folder and keep `page.tsx` as thin as possible.
- Store reusable components without business logic in the `@repo/ui` package. In newly added views, analyze if there is a potential for reuse of some parts of the code and, if so, extract them to the `@repo/ui` package.
- Consume API request/response types and validation schemas from `@repo/contracts`.
