# Frontend Migration Plan: `frontend-demo` -> `platform-web`

## 1) Goal and scope

Migrate the demo frontend from React + Vite + React Router (`apps/frontend-demo`) to Next.js App Router (`apps/platform-web`) while preserving current UX scope and following repository AI rules:

- Bun runtime
- Vertical slice architecture in `modules`
- Reusable, business-agnostic UI in shared `@repo/ui` package
- Small, focused components and thin `page.tsx` files
- Type-first style (`type`, `T` prefixes)
- Arrow functions and object-based function params
- Visual parity with `frontend-demo` (no visual regressions)

This plan focuses on **routing, folder structure, layout migration, global features, and file-by-file migration references**.

### Visual parity requirement (hard constraint)

- The migrated `platform-web` UI must preserve current `frontend-demo` look-and-feel without intentional differences.
- Spacing, typography, colors, component sizes, hierarchy, and responsive behavior must match `frontend-demo`.
- Any deviation must be treated as a regression and fixed before accepting migration of a screen.
- Use side-by-side comparison per page and viewport (mobile/tablet/desktop) during migration sign-off.

---

## 2) Routing migration plan (React Router -> Next App Router)

### Source routes in `frontend-demo`

Defined in `apps/frontend-demo/src/App.tsx`:

- `/` -> `LandingPage`
- `/login` -> `AuthPage mode=login`
- `/register` -> `AuthPage mode=register`
- `/dashboard` -> `DashboardPage`
- `/projects` -> `ProjectsPage`
- `/project/:projectId` -> `ProjectDetailPage`
- `/workspace/:projectId/:visualizationId` -> `WorkspacePage`
- `/credits` -> `CreditsPage`
- `/settings` -> `SettingsPage`
- `*` -> `NotFound`

### Target routes in `platform-web` (Next App Router)

Use existing route groups: `(auth)` and `(app)`.

| Old path                                 | New path                                            | Next file                                                                 | Notes                                                                     |
| ---------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `/`                                      | `/`                                                 | `src/app/(app)/page.tsx`                                                  | Initial decision: keep as app entry (dashboard or landing based on auth). |
| `/login`                                 | `/sign-in`                                          | `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx`                          | Already present (Clerk).                                                  |
| `/register`                              | `/sign-up`                                          | `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`                          | Already present (Clerk).                                                  |
| `/dashboard`                             | `/dashboard`                                        | `src/app/(app)/dashboard/page.tsx`                                        | New.                                                                      |
| `/projects`                              | `/projects`                                         | `src/app/(app)/projects/page.tsx`                                         | New.                                                                      |
| `/project/:projectId`                    | `/projects/[projectId]`                             | `src/app/(app)/projects/[projectId]/page.tsx`                             | Rename from singular to collection-based segment.                         |
| `/workspace/:projectId/:visualizationId` | `/projects/[projectId]/workspace/[visualizationId]` | `src/app/(app)/projects/[projectId]/workspace/[visualizationId]/page.tsx` | Keeps resource nesting.                                                   |
| `/credits`                               | `/credits`                                          | `src/app/(app)/credits/page.tsx`                                          | New.                                                                      |
| `/settings`                              | `/settings`                                         | `src/app/(app)/settings/page.tsx`                                         | New.                                                                      |
| `*`                                      | fallback                                            | `src/app/not-found.tsx`                                                   | Next global not-found page.                                               |

### Route behavior rules

1. All `(app)` routes protected by Clerk middleware (`src/proxy.ts`).
2. `(auth)` routes stay public (`/sign-in`, `/sign-up`).
3. Use server components by default; add `'use client'` only for interactive UI.
4. Keep `page.tsx` as orchestration only; move page UI and logic to modules/views.

---

## 3) Target folder structure for `platform-web` (following AI rules)

Recommended structure under `apps/platform-web/src`:

```text
src/
  app/
    layout.tsx
    not-found.tsx
    (auth)/
      sign-in/[[...sign-in]]/page.tsx
      sign-up/[[...sign-up]]/page.tsx
    (app)/
      layout.tsx
      page.tsx
      dashboard/page.tsx
      projects/page.tsx
      projects/[projectId]/page.tsx
      projects/[projectId]/workspace/[visualizationId]/page.tsx
      credits/page.tsx
      settings/page.tsx

  views/
    dashboard/
      DashboardView.tsx
      index.ts
    projects/
      ProjectsView.tsx
      ProjectDetailView.tsx
      index.ts
    workspace/
      WorkspaceView.tsx
      index.ts
    credits/
      CreditsView.tsx
      index.ts
    settings/
      SettingsView.tsx
      index.ts
    landing/
      LandingView.tsx
      index.ts

  modules/
    navigation/
      components/
        AppNavbar/
          AppNavbar.tsx
          index.ts
        AppSidebar/
          AppSidebar.tsx
          index.ts
        AppFooter/
          AppFooter.tsx
          index.ts
      config/
        app-nav-items.ts
      types/
        navigation.types.ts

    projects/
      components/
      hooks/
      api/
      types/
      utils/

    workspace/
      components/
      hooks/
      api/
      types/
      utils/

    credits/
      components/
      api/
      types/

    settings/
      components/
      types/

  core/
    layout/
      RootLayout/
    packages/
      auth/
      theme/

  i18n/
    request.ts
    messages/
      pl.json
```

### Why this split

- `app/` = routing only (thin pages/layouts)
- `views/` = page composition/orchestration
- `modules/` = domain logic and feature UI (vertical slices)
- shared UI without domain logic remains in monorepo `packages/ui`

### Reusable presentational components to migrate to `@repo/ui`

Based on analysis of `apps/frontend-demo/src/components/*` and page composition patterns:

| Component                        | Source                                             | Why reusable                                                     | Target in `@repo/ui`                                                                     | Notes                                                                                                                       |
| -------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `PageHeader`                     | `apps/frontend-demo/src/components/PageHeader.tsx` | Generic page title/subtitle/back + actions slot; no domain logic | `packages/ui/src/components/page-header.tsx` (or `packages/ui/src/core/page-header.tsx`) | **Must be migrated to `@repo/ui`**; replace router-specific back handling with callback prop (`onBack`) or `backHref` prop. |
| Existing shadcn-style primitives | `apps/frontend-demo/src/components/ui/*`           | Business-agnostic UI primitives                                  | `packages/ui/src/core/*`                                                                 | Most already exist; reuse from `@repo/ui` and avoid local duplicates in `platform-web`.                                     |

Components that should stay in `platform-web` modules (not `@repo/ui`):

- `Navbar`, `AppSidebar`, `Footer`, `AppLayout`, `DashboardLayout`, `NavLink` (they are route/auth/branding-aware and app-shell specific).

---

## 4) How to migrate layout architecture

## 4.1 Current demo layout

- `AppLayout` (`Navbar + main + Footer`) for public/auth pages
- `DashboardLayout` (`Navbar + main + Footer`) for authenticated area
- Extra sidebar implementation exists (`AppSidebar`) but not wired to all pages

## 4.2 Target layout in Next

### Root level

- Keep `src/app/layout.tsx` delegating to `core/layout/RootLayout` (already present).
- Keep global providers in `RootLayout`:
  - ThemeProvider
  - AuthProvider (Clerk)
  - NextIntlClientProvider

### App area layout

Implement `src/app/(app)/layout.tsx` as the authenticated shell:

- Top navigation and/or sidebar from `modules/navigation/components`
- Main content wrapper
- Optional footer

Pseudo composition:

```tsx
<AppShell>
  <AppNavbar />
  <AppBody>
    <AppSidebar />
    <main>{children}</main>
  </AppBody>
  <AppFooter />
</AppShell>
```

### Page-level guidance

- `page.tsx` in route folder only loads data and renders `*View`.
- Reusable header block from `PageHeader` becomes `modules/navigation/components/PageHeader`.
- Remove React Router hooks (`useNavigate`, `Link` from `react-router-dom`) and replace with Next `Link`, `useRouter`, `useParams`.

---

## 5) Global feature migration list

## 5.1 Authentication

- Source (demo): mocked login/register flow in `AuthPage`.
- Target: Clerk already integrated in `platform-web`:
  - Sign-in/up pages exist.
  - Middleware (`src/proxy.ts`) protects app routes.
  - Keep auth-aware nav states via Clerk user/session APIs.

## 5.2 Theme

- Source: custom localStorage + `documentElement.classList` (`hooks/use-theme.ts`, `main.tsx`).
- Target: `next-themes` via existing `core/packages/theme/ThemeProvider.tsx` and `use-theme.ts`.
- Migration rule: remove manual theme bootstrap from entrypoints; use provider + hook only.

### Shared UI hooks policy (remove duplicates)

- If `@repo/ui` provides UI hooks (`use-mobile`, `use-theme`, `use-toast`), these hooks must be the default across `platform-web`.
- Remove duplicated hook implementations from `platform-web` and import from `@repo/ui` instead.
- Current duplication to remove in migration scope:
  - `apps/platform-web/src/core/packages/theme/use-theme.ts` -> replace usages with `@repo/ui` hook and delete duplicate wrapper (or keep only a temporary compatibility re-export during transition).
- Do not create new local equivalents for `use-mobile`, `use-theme`, or `use-toast` in `platform-web`.

## 5.3 Internationalization

- Source: `react-i18next` (`src/i18n/index.ts`, `src/i18n/pl.json`).
- Target: `next-intl` (`src/i18n/request.ts`, `src/i18n/messages/pl.json`).
- Migration rule: move translation keys/content into next-intl format and replace `useTranslation` calls with `next-intl` APIs.

## 5.4 Layout and navigation

- Source: `Navbar`, `Footer`, `AppSidebar`, `PageHeader` in `frontend-demo/components`.
- Target: move to `modules/navigation/components/*`; route-aware logic based on Next navigation.

## 5.5 Notifications/toasts

- Source: shadcn toaster + custom `use-toast` state manager.
- Target: keep one toast implementation only:
  - Preferred: shared UI package toaster primitives with a single provider mounted in root/app layout.

## 5.6 Data fetching and state

- Source: React Query provider is mounted but pages use static mock data.
- Target options:
  1. Server Components + fetch for read paths.
  2. Client hooks (React Query/Zustand) where needed for interactivity.
- Keep data logic inside module `api/` + `hooks/`, not in page files.

## 5.7 Forms and uploads

- Source: local state + mock submit flows.
- Target: split into module components and API actions; map room/furniture upload UI to real backend endpoints when available.
- Mandatory library: use `react-hook-form` for all new migrated forms in `platform-web`.
- Validation approach: use schema-based validation (`zod` + resolver) aligned with contracts whenever possible.
- Replace local `useState` form state in migrated screens (`AuthPage`, `ProjectsPage` dialog, `WorkspacePage` inputs, `SettingsPage` preferences/actions) with `react-hook-form` form controllers.

---

## 6) File-by-file migration reference matrix

### App bootstrap and routing

| Source file                       | What it contains                                       | Target location                                 | Migration action                                                 |
| --------------------------------- | ------------------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------------- |
| `apps/frontend-demo/src/App.tsx`  | Global providers + all React Router route declarations | `src/app/**` route files + `src/app/layout.tsx` | Split routes into App Router files; remove BrowserRouter/Routes. |
| `apps/frontend-demo/src/main.tsx` | Root render + manual theme pre-apply                   | `src/app/layout.tsx` + theme package            | Remove manual bootstrapping; rely on Next root layout providers. |

### Layout and navigation

| Source file                                             | What it contains                                    | Target location                                               | Migration action                                                                                        |
| ------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `apps/frontend-demo/src/components/AppLayout.tsx`       | Public shell (`Navbar`, `Footer`)                   | `src/app/(auth)/layout.tsx` or shared app shell component     | Recreate shell as Next layout composition.                                                              |
| `apps/frontend-demo/src/components/DashboardLayout.tsx` | Auth shell wrapper                                  | `src/app/(app)/layout.tsx`                                    | Convert into authenticated layout with Next children slot.                                              |
| `apps/frontend-demo/src/components/Navbar.tsx`          | Main nav, auth actions, mobile menu, credit badge   | `src/modules/navigation/components/AppNavbar/AppNavbar.tsx`   | Replace React Router navigation with Next `Link/useRouter`; wire Clerk session.                         |
| `apps/frontend-demo/src/components/AppSidebar.tsx`      | Sidebar nav + user card + credits + sign out action | `src/modules/navigation/components/AppSidebar/AppSidebar.tsx` | Keep UI, replace router dependencies, plug in real user/credits data.                                   |
| `apps/frontend-demo/src/components/Footer.tsx`          | Footer links/contact                                | `src/modules/navigation/components/AppFooter/AppFooter.tsx`   | Keep as presentational reusable app shell part.                                                         |
| `apps/frontend-demo/src/components/PageHeader.tsx`      | Page title/subtitle/back action/CTA slot            | `packages/ui/src/components/page-header.tsx`                  | Migrate as business-agnostic UI component; keep optional app-level wrapper for Next router integration. |
| `apps/frontend-demo/src/components/NavLink.tsx`         | Router NavLink compatibility wrapper                | remove or replace with Next link helper                       | No direct equivalent needed in Next; use `Link` + pathname checks.                                      |

`PageHeader` final placement decision:

- Move `PageHeader` to `@repo/ui` as a presentational component.
- Keep only route-aware wrapper/adapters (if needed) in `platform-web/src/modules/navigation`.

### Pages to routes/views/modules

| Source file                                          | What it contains                                           | Target location                                                                                                          | Migration action                                                                            |
| ---------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| `apps/frontend-demo/src/pages/LandingPage.tsx`       | Marketing hero + features + CTA                            | `src/views/landing/LandingView.tsx`, routed from `src/app/(app)/page.tsx` (or dedicated route)                           | Move static sections into view; keep animation optional and scoped.                         |
| `apps/frontend-demo/src/pages/AuthPage.tsx`          | Mock login/register form UI                                | keep Clerk pages in `(auth)`                                                                                             | Do not migrate mock auth logic; keep only any reusable visual wrappers if needed.           |
| `apps/frontend-demo/src/pages/DashboardPage.tsx`     | Dashboard widgets, quick actions, recent projects          | `src/views/dashboard/DashboardView.tsx`, route `src/app/(app)/dashboard/page.tsx`                                        | Split cards/actions into `modules/projects` and `modules/workspace` components.             |
| `apps/frontend-demo/src/pages/ProjectsPage.tsx`      | Project list, create dialog, delete confirmation           | `src/views/projects/ProjectsView.tsx`, route `src/app/(app)/projects/page.tsx`                                           | Move project CRUD UI and state to `modules/projects/*`.                                     |
| `apps/frontend-demo/src/pages/ProjectDetailPage.tsx` | Visualizations list in one project                         | `src/views/projects/ProjectDetailView.tsx`, route `src/app/(app)/projects/[projectId]/page.tsx`                          | Replace mock data with module API hook/server fetch.                                        |
| `apps/frontend-demo/src/pages/WorkspacePage.tsx`     | Generation/edit workspace with form and preview iterations | `src/views/workspace/WorkspaceView.tsx`, route `src/app/(app)/projects/[projectId]/workspace/[visualizationId]/page.tsx` | Split into components: inputs panel, preview panel, iteration strip in `modules/workspace`. |
| `apps/frontend-demo/src/pages/CreditsPage.tsx`       | Credit package cards and CTA                               | `src/views/credits/CreditsView.tsx`, route `src/app/(app)/credits/page.tsx`                                              | Move packages/pricing UI into `modules/credits`.                                            |
| `apps/frontend-demo/src/pages/SettingsPage.tsx`      | Theme switch + account actions                             | `src/views/settings/SettingsView.tsx`, route `src/app/(app)/settings/page.tsx`                                           | Reuse existing `core/packages/theme/use-theme`; move account actions into module.           |
| `apps/frontend-demo/src/pages/NotFound.tsx`          | 404 page                                                   | `src/app/not-found.tsx`                                                                                                  | Implement Next not-found page.                                                              |
| `apps/frontend-demo/src/pages/Index.tsx`             | fallback placeholder page                                  | remove                                                                                                                   | Not needed after real route migration.                                                      |

### Hooks, i18n, and utilities

| Source file                                   | What it contains        | Target location                                     | Migration action                                           |
| --------------------------------------------- | ----------------------- | --------------------------------------------------- | ---------------------------------------------------------- |
| `apps/frontend-demo/src/hooks/use-theme.ts`   | custom theme hook       | keep `src/core/packages/theme/use-theme.ts`         | Do not copy old hook; use existing next-themes wrapper.    |
| `apps/frontend-demo/src/hooks/use-mobile.tsx` | mobile breakpoint hook  | `src/core/hooks/use-mobile.ts` or module-level hook | Keep if needed by nav/workspace responsive behavior.       |
| `apps/frontend-demo/src/hooks/use-toast.ts`   | custom toast store      | `packages/ui` or `platform-web/core`                | Keep one toast strategy, avoid duplicate stores.           |
| `apps/frontend-demo/src/i18n/index.ts`        | i18next initialization  | remove in platform-web                              | Replace fully with next-intl request config.               |
| `apps/frontend-demo/src/i18n/pl.json`         | Polish translation keys | `src/i18n/messages/pl.json`                         | Merge/normalize keys used by migrated screens.             |
| `apps/frontend-demo/src/lib/utils.ts`         | `cn` helper             | use `@repo/ui` utilities or local core util         | Avoid duplicate `cn` implementations if shared one exists. |

Hook consolidation rule for migration:

- Prefer `@repo/ui` hooks as single source of truth:
  - `packages/ui/src/hooks/use-mobile.ts`
  - `packages/ui/src/hooks/use-theme.ts`
  - `packages/ui/src/hooks/use-toast.ts`
- Remove duplicated implementations in app-level folders once imports are switched.

### UI component library note

- `apps/frontend-demo/src/components/ui/*` contains mostly reusable shadcn-style primitives.
- Business-agnostic primitives should live in `packages/ui` and be imported from there in `platform-web`.
- Domain-specific wrappers stay inside `platform-web/src/modules/*`.

---

## 7) Recommended migration sequence

1. **Routing skeleton first**
   - Create all App Router paths and route groups.
   - Add `not-found.tsx`.

2. **Shell/layout migration**
   - Build `(app)/layout.tsx` with navbar/sidebar/footer from `modules/navigation`.

3. **Global features alignment**
   - Keep Clerk + middleware auth.
   - Keep next-themes provider/hook.
   - Migrate i18n keys from old `pl.json` into `next-intl` messages.

4. **Page-by-page migration (vertical slices)**
   - Dashboard -> Projects -> Project detail -> Workspace -> Credits -> Settings.
   - For each page: route file (thin) -> view -> module components/hooks/api.

5. **Cleanup**
   - Remove React Router dependencies from migrated code.
   - Remove obsolete mock-only helpers/components after replacement.

---

## 8) Technical decisions to keep consistent

- Use Bun for commands/runtime.
- Keep `type` declarations with `T` prefixes.
- Prefer arrow functions and object params (destructure inside function body).
- Keep components in dedicated folders with `index.ts` exports.
- Do not move business logic into shared UI package.

---

## 9) Existing `platform-web` foundations already reusable

- Root providers and fonts: `src/core/layout/RootLayout/RootLayout.tsx`
- Clerk provider: `src/core/packages/auth/AuthProvider.tsx`
- Theme provider/hook: `src/core/packages/theme/ThemeProvider.tsx`, `src/core/packages/theme/use-theme.ts`
- Route protection: `src/proxy.ts`
- i18n request/messages: `src/i18n/request.ts`, `src/i18n/messages/pl.json`

These should remain the backbone; migration should adapt demo screens to this foundation instead of re-implementing it.
