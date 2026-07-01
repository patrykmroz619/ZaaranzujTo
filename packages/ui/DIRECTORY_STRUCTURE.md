# @repo/ui — Directory Structure

Shared design system package consumed by `platform-web` and `landing-page`. No business logic, no data fetching, no app-specific state — props in, JSX out.

## Folder Tree

```
src/
├── tokens/              # Design tokens — single source of truth for the visual language
│   ├── globals.css      # CSS custom properties (colors, spacing, radii, shadows, …)
│   ├── theme.ts         # Typed TS accessors mirroring the CSS vars
│   └── preset.ts        # Tailwind preset (extends tokens for consuming apps)
│
├── core/                # Third-party / generated primitives — structure dictated by the tool
│   └── *.tsx            # shadcn/ui components (flat; shadcn tooling prescribes this layout)
│
├── components/          # Hand-authored compositions built from core/ + tokens/
│   └── {Component}/
│       ├── index.ts     # Re-export only — public surface for this component
│       ├── {Component}.tsx
│       └── {Component}.test.tsx
│
├── hooks/               # Presentation-only hooks — no API calls, no app state
│   └── {useHook}/
│       ├── index.ts
│       ├── {useHook}.ts
│       └── {useHook}.test.ts
│
└── lib/                 # Pure utility helpers (e.g. cn — class merging)
    └── *.ts             # Flat; helpers are small and tightly related
```

## Import Boundaries

```
components/  →  core/, tokens/, lib/
hooks/       →  lib/
core/        →  external packages (e.g. Radix UI, shadcn deps)
tokens/      →  (none — pure CSS / typed constants)
lib/         →  external packages only
```

Nothing in this package may import from `platform-web`, `platform-api`, or `@repo/contracts`.

## Segment rules

### `tokens/`

Single source of truth for the visual language. CSS custom properties live in `globals.css`; `theme.ts` re-exports them as typed TS constants so components can reference tokens without string literals; `preset.ts` wires them into Tailwind for consuming apps.

### `core/`

Generated or vendored primitives managed by shadcn/ui CLI. Files stay **flat** — the tool regenerates them in place and folder nesting would break its conventions. Do not hand-edit generated files beyond the minimal theming the tool supports; patch in `components/` instead.

### `components/`

Hand-authored compositions. Each component lives in its own folder:
- `index.ts` — thin barrel re-exporting the component only
- `{Component}.tsx` — implementation; may import from `core/`, `tokens/`, `lib/`
- colocated sub-components, hooks, utils that are **exclusive** to this component nest inside the same folder

**Promotion rule** (mirrors `platform-web`):
- Used by one component → inside that component's folder
- Used by two components → `components/` segment level (`hooks/` or `lib/`)
- Needed by a consuming app → stays in this package and is imported via `@repo/ui`

### `hooks/`

Presentation-only hooks (e.g. `useIsMobile`, `useTheme`). No queries, mutations, or app-specific logic. Each hook follows the same folder anatomy as `components/`.

### `lib/`

Pure utilities (currently just `cn`). Flat layout is fine — these are small, tightly related helpers with no sub-structure needed.

## Public API

The package root `src/index.ts` (or per-path exports in `package.json`) is the **only** surface consuming apps may import from. Internal paths are package-private.

Export order convention:
1. `tokens/` exports (theme constants, preset)
2. `core/` exports (primitive components)
3. `components/` exports (compositions)
4. `hooks/` exports
5. `lib/` exports
