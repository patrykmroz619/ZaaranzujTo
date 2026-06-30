# landing-page — CLAUDE.md

> **Root instructions:** [`../../CLAUDE.md`](../../CLAUDE.md) — repo-wide commands, tech stack, and code style. This file adds rules specific to `landing-page`.

Static marketing site built with Astro 6. React 19 (islands), Tailwind CSS v4, static output.

## Structure

`src/` is organized as:

- `pages/` — Astro routes (static output)
- `modules/` — page sections (`hero`, `gallery`, `pricing`, `faq`, `how-it-works`, `comparison`, `final-cta`, `nav`, `footer`)
- `components/` — shared presentational components
- `layouts/` — page layouts
- `lib/`, `styles/` — utilities and global styles

## Commands

Run from the monorepo root: `bun run dev:landing` (port 3001).

## Rules — React (common)

- Keep components small and focused on a single responsibility.
- If a component starts mixing data fetching, mapping logic, and complex JSX structure, split it into smaller components and helper files.
- Each component should have its own folder with an `index.ts` file.

## Rules — Astro

- Prefer React for all components (`.tsx`), even static ones — avoid writing `.astro` components.
- Minimize JavaScript shipped to the browser — use `client:visible` or `client:idle` for islands that don't need to be interactive immediately; only use `client:load` when the component must be interactive on page load.
