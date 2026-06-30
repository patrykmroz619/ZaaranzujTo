# ui — CLAUDE.md

> **Root instructions:** [`../../CLAUDE.md`](../../CLAUDE.md) — repo-wide commands, tech stack, and code style. This file adds rules specific to `@repo/ui`.

`@repo/ui` — shared React components with **no business logic**, reused across
`platform-web` and `landing-page`.

## Structure

`src/` is organized as: `components/`, `core/`, `hooks/`, `lib/`, `styles/`.

## Rules — React (common)

- Keep components small and focused on a single responsibility.
- If a component starts mixing data fetching, mapping logic, and complex JSX structure, split it into smaller components and helper files.
- Each component should have its own folder with an `index.ts` file.

## Rules — UI package

- Only place reusable components **without** business logic or data fetching here. Domain logic stays in the consuming app's `modules`.
- Components should be presentational and configured via props; no API calls, no app-specific state.
