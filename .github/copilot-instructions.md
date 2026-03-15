# AI Rules for coding agents

## General

- Suggest adding new copilot instructions in response to user concerns during coding sessions. Give exact content of the instruction to copy and paste.
- Use Bun as the runtime for both frontend and backend.
- Do not write tests during implementation unless explicitly asked to do so.

## Code Style

- Use 'T' prefixes for types (e.g., `TUser`, `TProfile`)
- Prefer types over interfaces
- Use arrow functions instead of function declarations.
- Prefer object instead of many parameters in functions to group them and improve readability.
- Use async/await instead of .then()
- Avoid destructuring in function parameters; instead, accept an object parameter and destructure in the function body
- Prefer type inference over explicit type annotations

## Frontend

- Keep components small and focused on a single responsibility.
- If a component starts mixing data fetching, mapping logic, and complex JSX structure, split it into smaller components and helper files.
- For larger views, keep one orchestration component for data loading and delegate rendering to presentational child components.
- Follow vertical slice architecture, grouping related components, hooks, and styles together.
- Each component should have its own folder with index.ts file
- Store reusable components without business logic in the "@repo/ui" package, in newly added views analyze if there is a potential for reuse some parts of the code and if so, extract them to the "@repo/ui" package.
- Domain specific logic should be stored in the "modules" folder following vertical slice architecture
- When creating new pages add dedicated component in "views" folder and keep page.tsx as thin as possible

## Backend (NestJS)

- Use AuthGuard to protect routes using @UseGuards(AuthGuard)
- Favor single responsibility principle for services
- If module contains more than one service/controller/repository, store them in a dedicated folder called "services/controllers/repositories" in the module directory.
- Do not write e2e tests until you are explicitly asked to do so.
- Define dtos using nest-zod package in <module-name>.dto.ts files and use them in controllers to validate requests data.
- Do not export repositories from modules. If you need to use a repository in another module, create a service in the module that owns the repository and export the service instead. Repositories shoudn't contain any business logic, they should be simple wrappers around database operations. Services should contain all the business logic and use repositories to interact with the database.

## Packages

### packages/contracts

Package to define shared types and Zod schemas for both frontend and backend.

### packages/ui

Shared package for reusable UI components without business logic.

## Docs

- In 'docs' folder there are markdown files with documentation for different parts of the project. If during coding session there is a better way to implement something or some contract or schema should be modified, suggest modifying the documentation to reflect the new approach
