# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ZaaranżujTo** is a B2C web app for AI-powered interior design visualization. Users upload room photos or describe a space in text, then iteratively refine AI-generated designs. Monetized via a credit system (hard paywall). Interface is in Polish.

## Monorepo Structure

Bun + Turborepo monorepo with the following workspaces:

- `apps/platform-api` — NestJS REST API (backend)
- `apps/platform-web` — Next.js 16 frontend
- `apps/frontend-demo` — Demo/prototype app
- `packages/contracts` — Shared Zod schemas and TypeScript types used by both API and web
- `packages/ui` — Shared React components (no business logic)
- `packages/eslint-config`, `packages/typescript-config` — Shared tooling configs

## Commands

All commands run from the monorepo root (`ZaaranzujTo/`).

```sh
# Dev servers
bun run dev              # All apps
bun run dev:api          # platform-api only
bun run dev:web          # platform-web only

# Build
bun run build            # All apps

# Lint & type check
bun run lint
bun run check-types
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
| Frontend  | Next.js 16, Tailwind CSS v4, Zustand, Clerk (auth), next-intl (i18n) |
| Backend   | NestJS, Mongoose/MongoDB, Clerk JWT verification, nestjs-zod         |
| AI        | OpenRouter API (LLM + Vision)                                        |
| Storage   | Cloudflare R2 (via AWS S3 SDK)                                       |
| Auth      | Clerk (shared between frontend and backend)                          |
| Contracts | `@repo/contracts` — Zod schemas + TypeScript types                   |

## Architecture

App-specific rules are in `.agents/skills/`:

- **Backend** (`platform-api`): `.agents/skills/backend-nestjs/SKILL.md`
- **Frontend** (`platform-web`): `.agents/skills/frontend/SKILL.md`

### packages/contracts

Defines the shared API contract between frontend and backend using Zod schemas. Both apps import from `@repo/contracts`.

## Code Style

- Use `T` prefix for types (e.g., `TUser`, `TProject`)
- Prefer `type` over `interface`
- Use arrow functions, not function declarations
- Group multiple parameters into an object; destructure inside the function body (not in parameters)
- Use `async/await`, not `.then()`
- Prefer type inference over explicit annotations
- Do not write tests unless explicitly asked

## Documentation

`docs/` contains design documents and implementation plans. If a better implementation approach is discovered or a contract/schema needs to change, suggest updating the relevant doc to stay in sync.
