---
description: Backend development rules and architectural guidelines for NestJS.
---

# Backend (NestJS) Architecture Rules

- Use `AuthGuard` to protect routes using `@UseGuards(AuthGuard)`.
- Favor single responsibility principle for services.
- If a module contains more than one service/controller/repository, store them in a dedicated folder called `services`, `controllers`, or `repositories` in the module directory.
- Do not write e2e tests until explicitly asked to do so.
- Define DTOs using the `nest-zod` package in `<module-name>.dto.ts` files and use them in controllers to validate request data.
- Do not export repositories from modules. If you need to use a repository in another module, create a service in the module that owns the repository and export the service instead. Repositories shouldn't contain any business logic; they should be simple wrappers around database operations. Services should contain all the business logic and use repositories to interact with the database.
