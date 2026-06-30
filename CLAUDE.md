# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ZaaranżujTo** is a B2C web app for AI-powered interior design visualization. Users upload room photos or describe a space in text, then iteratively refine AI-generated designs. Monetized via a credit system (hard paywall). Interface is in Polish.

## Monorepo Structure

Bun + Turborepo monorepo with the following workspaces:

- `apps/landing-page` — Astro 6 static landing page (marketing site)
- `apps/platform-api` — NestJS REST API (backend)
- `apps/platform-web` — Next.js 16 frontend (app)
- `packages/contracts` — Shared Zod schemas and TypeScript types used by both API and web
- `packages/ui` — Shared React components (no business logic)
- `packages/eslint-config`, `packages/typescript-config` — Shared tooling configs

Each workspace has its own `CLAUDE.md` with stack-specific rules. This root file
holds only repo-wide guidance; the nested files load on demand when Claude works
in that workspace (or at launch when you start Claude from that directory):

- `apps/platform-api/CLAUDE.md` — NestJS backend
- `apps/platform-web/CLAUDE.md` — Next.js frontend
- `apps/landing-page/CLAUDE.md` — Astro landing page
- `packages/contracts/CLAUDE.md` — shared Zod contracts
- `packages/ui/CLAUDE.md` — shared React components

## Commands

All commands run from the monorepo root (`ZaaranzujTo/`).

```sh
# Dev servers
bun run dev              # All apps
bun run dev:api          # platform-api only
bun run dev:web          # platform-web only
bun run dev:landing      # landing-page only (port 3001)

# Build
bun run build            # All apps

# Lint & type check
bun run lint
bun run check-types      # TypeScript type check
bun run format           # Prettier write
bun run format:check     # Prettier check

# API tests (run from apps/platform-api)
bun run test             # Jest unit tests
bun run test:watch
bun run test:e2e
```

## Tech Stack

| Layer     | Technology                                                           |
| --------- | -------------------------------------------------------------------- |
| Landing   | Astro 6, React 19 (islands), Tailwind CSS v4, static output          |
| Frontend  | Next.js 16, Tailwind CSS v4, Zustand, Clerk (auth), next-intl (i18n) |
| Backend   | NestJS, Mongoose/MongoDB, Clerk JWT verification, nestjs-zod         |
| AI        | OpenRouter API (LLM + Vision)                                        |
| Storage   | Cloudflare R2 (via AWS S3 SDK)                                       |
| Auth      | Clerk (shared between frontend and backend)                          |
| Contracts | `@repo/contracts` — Zod schemas + TypeScript types                   |

## Code Style

These conventions apply across every workspace.

- Use `T` prefix for types (e.g., `TUser`, `TProject`)
- Prefer `type` over `interface`
- Use arrow functions, not function declarations
- Group multiple parameters into an object; destructure inside the function body (not in parameters)
- Use `async/await`, not `.then()`
- Prefer type inference over explicit annotations
- Do not write tests unless explicitly asked

## Documentation

`docs/` contains design documents and implementation plans. If a better implementation approach is discovered or a contract/schema needs to change, suggest updating the relevant doc to stay in sync.
