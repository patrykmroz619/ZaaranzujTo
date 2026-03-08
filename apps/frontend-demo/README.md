# frontend-demo

Sandbox frontend app in the `ZaaranzujTo` monorepo.

## Run in monorepo (recommended)

From repository root:

```sh
bun install
bun run dev:frontend-demo
```

This command runs `turbo run dev --filter=frontend-demo` and starts Vite for this app only.

## App-level scripts

From `apps/frontend-demo`:

```sh
bun run dev
bun run build
bun run test
```

## Tech stack

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS
