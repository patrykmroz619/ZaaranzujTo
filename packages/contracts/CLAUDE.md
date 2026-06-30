# contracts — CLAUDE.md

> **Root instructions:** [`../../CLAUDE.md`](../../CLAUDE.md) — repo-wide commands, tech stack, and code style. This file adds rules specific to `@repo/contracts`.

`@repo/contracts` — the shared API contract between frontend and backend, defined with
Zod schemas and the TypeScript types inferred from them. Both `platform-api` and
`platform-web` import from this package.

## Structure

`src/` groups schemas by domain (`common`, `credits`, `me`, `projects`, `storage`,
`visualizations`), re-exported through `src/index.ts`.

## Rules

- This package is the single source of truth for request/response shapes and validation. Add or change a schema here rather than redefining it in an app.
- Derive TypeScript types from Zod schemas with `z.infer` instead of hand-writing them; keep the `T` prefix (e.g., `TProject`).
- Keep this package free of app-specific or business logic — schemas and types only.
- Export new schemas/types through the relevant domain barrel and `src/index.ts`.
