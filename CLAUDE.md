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

### packages/contracts

Defines the shared API contract between frontend and backend using Zod schemas. Both apps import from `@repo/contracts`.

### Backend Rules — NestJS

- Use `AuthGuard` to protect routes using `@UseGuards(AuthGuard)`.
- Favor single responsibility principle for services.
- If a module contains more than one service/controller/repository, store them in a dedicated folder called `services`, `controllers`, or `repositories` in the module directory.
- Define DTOs using the `nestjs-zod` package in `<module-name>.dto.ts` files and use them in controllers to validate request data.
- Do not export repositories from modules. If you need to use a repository in another module, create a service in the module that owns the repository and export the service instead.
- Repositories shouldn't contain any business logic; they should be simple wrappers around database operations. Services should contain all the business logic and use repositories to interact with the database.

### Frontend Rules — Next.js / React

- Keep components small and focused on a single responsibility.
- If a component starts mixing data fetching, mapping logic, and complex JSX structure, split it into smaller components and helper files.
- For larger views, keep one orchestration component for data loading and delegate rendering to presentational child components.
- Follow vertical slice architecture, grouping related components, hooks, and styles together.
- Each component should have its own folder with `index.ts` file.
- Store reusable components without business logic in the `@repo/ui` package. In newly added views, analyze if there is a potential for reuse of some parts of the code and, if so, extract them to the `@repo/ui` package.
- Domain-specific logic should be stored in the `modules` folder following vertical slice architecture.
- When creating new pages, add a dedicated component in the `views` folder and keep `page.tsx` as thin as possible.

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

## Active Technologies

- TypeScript 5.x, React 19, Next.js 16.2 + Next.js (App Router), Tailwind CSS v4, Clerk (auth), next-intl (i18n), Zustand (state), Lucide React (icons), @repo/ui (shadcn components) (004-layout-migration)
- N/A (layout-only, no data persistence) (004-layout-migration)
- TypeScript 5.9, React 19, Next.js 16.2 + next-intl 4.8.3, @clerk/nextjs 7.0.6, next-themes 0.4.6, lucide-react, @repo/ui (shadcn components), Tailwind CSS v4 (005-demo-to-web-migration)
- N/A (mock data only, no persistence) (005-demo-to-web-migration)

## Recent Changes

- 004-layout-migration: Added TypeScript 5.x, React 19, Next.js 16.2 + Next.js (App Router), Tailwind CSS v4, Clerk (auth), next-intl (i18n), Zustand (state), Lucide React (icons), @repo/ui (shadcn components)
