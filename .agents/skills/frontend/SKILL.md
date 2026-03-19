---
description: Frontend development rules and architectural guidelines (React, components, vertical slice).
---

# Frontend Architecture Rules

- Keep components small and focused on a single responsibility.
- If a component starts mixing data fetching, mapping logic, and complex JSX structure, split it into smaller components and helper files.
- For larger views, keep one orchestration component for data loading and delegate rendering to presentational child components.
- Follow vertical slice architecture, grouping related components, hooks, and styles together.
- Each component should have its own folder with `index.ts` file.
- Store reusable components without business logic in the `@repo/ui` package. In newly added views, analyze if there is a potential for reuse of some parts of the code and, if so, extract them to the `@repo/ui` package.
- Domain-specific logic should be stored in the `modules` folder following vertical slice architecture.
- When creating new pages, add a dedicated component in the `views` folder and keep `page.tsx` as thin as possible.
