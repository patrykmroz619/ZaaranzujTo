# Frontend Directory Structure

## Folder Tree

```
src/
├── app/                         # Framework layer — routing and server boundaries only
│   └── ...                      # Structure dictated by Next.js conventions (page.tsx, layout.tsx, route handlers)
│
├── views/                       # One orchestration component per page — composes modules, layouts and ui
│   └── {View}/
│       ├── index.ts             # thin barrel — re-export the View only
│       ├── {View}.tsx
│       ├── {View}.test.tsx
│       └── {segment}/           # purpose-named folders as needed
│
├── modules/                     # Feature vertical slices — NEVER import each other
│   └── {module}/
│       ├── index.ts             # PUBLIC API — the only thing the outside world may import
│       └── {segment}/           # purpose-named folders as needed
│
├── packages/                    # Domain-aware reusable code — shared across modules
│   └── {package}/
|       └── {segment}/           # purpose-named folders as needed
│
├── core/                        # Infrastructure — domain-agnostic packages
│   └── {package}/
|       └── {segment}/           # purpose-named folders as needed
|
├── layouts/                     # Application shell components
│   └── {Layout}/
|       └── {segment}/           # purpose-named folders as needed
│
└── messages/                    # Translation content — namespaced per domain
    └── {locale}/
        ├── common.json
        └── {domain}.json
```

> **Design system** — tokens, primitives, and shared compositions live in the monorepo package `@repo/ui`, not in `src/`. Import design system components from `@repo/ui`.

> **Contracts** — API request/response types and validation schemas live in `@repo/contracts`. Consume them from there; never redeclare in `src/`.

## Import Boundaries

```
app/       →  views/, layouts/, core/, packages/, @repo/ui
views/     →  modules/, packages/, core/, @repo/ui    # never other views/; no api/ — data comes via module public APIs
layouts/   →  modules/, packages/, core/, @repo/ui
modules/   →  packages/, core/, @repo/ui              # never other modules/ — shared domain code goes to packages/
packages/  →  core/, @repo/ui                         # leaf: never imports modules/views/layouts/app — cycles impossible
core/      →  external packages only                  # nothing else in src/
```

Any import direction not listed above is forbidden — this is the whole graph.
`messages/` is content, not part of it — read by `core/i18n` at runtime.

### Hard rules

Constraints the graph above can't express:

- Every module/package/submodule exposes exactly one **public API** (`index.ts`). Nothing outside a slice imports its internals.
- Inside any `ui/` segment (within a module, package, view, or layout), components must not import from data/state segments (`hooks/`, `stores/`, `api/`) — they render props only. Data-wiring lives in `containers/`. (Lint: any `**/ui/**` import to `../hooks|../stores|../api` is a violation.)
- Each module/package owns its query keys in its `config/`; `core/query` provides only the generic builder.
- Every source file lives in its own folder named after it, alongside its colocated `.test.ts(x)`.
- `app/` is a thin Next.js adapter: `page.tsx` renders one View, `layout.tsx` renders one Layout, `api/` handlers cover framework HTTP (webhooks, OAuth) — no business logic, domain types, or data fetching.

## Purpose-named segments

Every slice (modules, views, packages, core packages, layouts, design-system compositions) organizes code into **purpose-named segments** — folders describing the _role_ code plays, not its technical type.

| Segment       | What belongs here                                                                                                                      |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `ui/`         | Presentational components — props in, JSX out. No data/state imports.                                                                  |
| `containers/` | Components that own data/state — via hook, store, or inline server fetch — and compose `ui/`; business logic lives here, not in `ui/`. |
| `hooks/`      | Custom hooks — queries, mutations, non-presentational logic.                                                                           |
| `stores/`     | Client-side state containers (stores, reducers).                                                                                       |
| `types/`      | Types/interfaces scoped to this slice.                                                                                                 |
| `schemas/`    | Validation schemas                                                                                                                     |
| `api/`        | Network access — fetchers, mutations.                                                                                                  |
| `utils/`      | Pure slice-local helpers (formatters, guards, calculations).                                                                           |
| `config/`     | Constants, feature flags, enums, query-key factories.                                                                                  |
| `tests/`      | Integration tests spanning more than one segment within this slice.                                                                    |

Not a closed vocabulary — introduce a new segment when a distinct purpose isn't covered and benefits from a named boundary. Test: does the name describe _why the code exists_, not just _what kind of file it is_?

The `ui/` vs `containers/` split is a tool, not a tax: reach for it only when the presentational half needs isolation or reuse. No reuse needed? Write one component that owns its data — it's a container. A 1:1 container-per-`ui/` everywhere is a smell, not the goal.

## Component folder anatomy

A component's folder is a mini-slice for everything used _exclusively_ by that component — colocated hooks, utils, sub-components, styles — rather than promoting them to segment level.

```
ui/InvoiceListView/
├── InvoiceListView.tsx
├── InvoiceListView.test.tsx
├── InvoiceListView.module.css
├── useInvoiceListSorting/     # hook only meaningful here
├── formatInvoiceDate/         # util only used here
└── InvoiceListRow/            # sub-component not exported beyond InvoiceListView
```

Sub-components nest recursively if they have their own exclusive deps. >2 levels usually signals the component should be rethought.

**Promotion rule** — colocate first, promote when a second consumer appears:

- Used by one component → inside that component's folder.
- Used by two components in the same slice → slice's `hooks/`/`utils/`/`ui/` segment.
- Used across modules → `packages/` (domain-aware) or `@repo/ui` (domain-agnostic, presentational).
- Used across apps → `@repo/ui`.

### Example: invoices module

```
modules/invoices/
├── index.ts               # curated public API — re-exports containers, chosen ui/, hooks, types
├── ui/                    # InvoiceListView/ (+ colocated deps), InvoiceFormView/, InvoiceStatusBadge/
├── containers/            # InvoiceList/ (feeds InvoiceListView), InvoiceForm/ (feeds InvoiceFormView)
├── hooks/                 # useInvoice/, useInvoiceMutations/
├── types/                 # invoice.types.ts
├── schemas/               # invoiceForm.schema.ts
├── api/                   # getInvoice/, createInvoice/
├── utils/                 # formatInvoiceNumber/
├── config/                # invoiceStatuses.ts, invoiceKeys.ts (query-key factory)
└── tests/                 # invoiceCreationFlow.test.tsx (integration)
```

### Submodules

When a module's domain splits into sub-domains, nest a submodule **inside** the parent (`modules/invoices/recurring/`) rather than flattening into a sibling top-level module. The submodule has the same anatomy and its own `index.ts` as sole public surface; the parent's `index.ts` decides what gets re-exported outward. Nothing outside `modules/invoices/**` imports submodule internals directly. **Promote to top-level** when reused from more than one parent, or large/stable enough to own independently.

## Testing conventions

- **Unit tests** — colocate in the file's own folder (`hooks/useInvoice/useInvoice.ts` + `useInvoice.test.ts`). One source file exercised, rest mocked. **Exceptions:** files holding multiple small tightly-related exports (e.g. a `dto.ts` mapper) stay flat with a sibling test; `ui/core/` is exempt when its tooling prescribes layout.
- **Integration tests** — two+ real (non-mocked) units from different segments go in a slice-level `tests/` folder. `modules/{module}/tests/` covers flows within that module (incl. submodules); cross-module flows go in `views/{View}/tests/`. `tests/` needn't exist until there's a test for it.
