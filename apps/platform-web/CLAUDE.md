# platform-web — CLAUDE.md

> **Root instructions:** [`../../CLAUDE.md`](../../CLAUDE.md) — repo-wide commands, tech stack, and code style. This file adds rules specific to `platform-web`.

Next.js 16 App Router frontend. Tailwind CSS v4, Zustand, Clerk (auth), next-intl (i18n).

## Structure

> Full folder anatomy, import boundaries, segment vocabulary, and component conventions: [`DIRECTORY_STRUCTURE.md`](./DIRECTORY_STRUCTURE.md).

`src/` is organized as:

- `app/` — App Router routes, grouped by `(auth)` and `(app)`. Keep `page.tsx` thin.
- `views/` — one orchestration component per page (composes module containers + page layout; no data fetching — that lives in modules)
- `modules/` — domain vertical slices (`credits`, `dashboard`, `projects`, `settings`, `storage`, `workspace`); never import each other
- `packages/` — domain-aware reusable code shared across modules
- `ui/` — design system: tokens, core primitives, hand-authored compositions
- `core/` — domain-agnostic infrastructure packages
- `layouts/` — application shell components
- `messages/` — next-intl translation content, namespaced per domain (`{locale}/{domain}.json`)

## Commands

Run from the monorepo root: `bun run dev:web`.

