# platform-api — CLAUDE.md

> **Root instructions:** [`../../CLAUDE.md`](../../CLAUDE.md) — repo-wide commands, tech stack, and code style. This file adds rules specific to `platform-api`.

NestJS REST API (backend). Mongoose/MongoDB, Clerk JWT verification, nestjs-zod.

## Structure

`src/` is organized as:

- `modules/` — feature modules (`ai`, `credits`, `health`, `images`, `profile`, `projects`, `storage`, `users`, `visualizations`). Each module owns its controllers, services, and repositories.
- `shared/` — cross-cutting providers, guards, and utilities
- `config/` — configuration setup
- `database/` — database connection and Mongoose setup
- `app.module.ts`, `main.ts` — application bootstrap

## Commands

Run from this directory (`apps/platform-api/`):

```sh
bun run test             # Jest unit tests
bun run test:watch
bun run test:e2e
```

## Rules — NestJS

- Use `AuthGuard` to protect routes using `@UseGuards(AuthGuard)`.
- Favor single responsibility principle for services.
- If a module contains more than one service/controller/repository, store them in a dedicated folder called `services`, `controllers`, or `repositories` in the module directory.
- Define DTOs using the `nestjs-zod` package in `<module-name>.dto.ts` files and use them in controllers to validate request data.
- Do not export repositories from modules. If you need to use a repository in another module, create a service in the module that owns the repository and export the service instead.
- Repositories shouldn't contain any business logic; they should be simple wrappers around database operations. Services should contain all the business logic and use repositories to interact with the database.
- Validation DTOs and shared request/response shapes come from `@repo/contracts` — keep them in sync rather than redefining schemas here.
