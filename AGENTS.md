# General Workspace Rules

- Suggest adding new agent rules in response to user concerns during coding sessions. Give exact content of the instruction to copy and paste.
- Use Bun as the runtime for both frontend and backend.
- Do not write tests during implementation unless explicitly asked to do so.

## Code Style

- Use `T` prefixes for types (e.g., `TUser`, `TProfile`)
- Prefer types over interfaces
- Use arrow functions instead of function declarations.
- Prefer object instead of many parameters in functions to group them and improve readability.
- Use async/await instead of `.then()`
- Avoid destructuring in function parameters; instead, accept an object parameter and destructure in the function body
- Prefer type inference over explicit type annotations

## Packages

- **contracts**: Package to define shared types and Zod schemas for both frontend and backend.
- **ui**: Shared package for reusable UI components without business logic.

## Docs

- In `docs` folder there are markdown files with documentation for different parts of the project. If during coding session there is a better way to implement something or some contract or schema should be modified, suggest modifying the documentation to reflect the new approach.
