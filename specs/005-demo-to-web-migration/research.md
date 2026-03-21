# Research: Demo to Platform Web Migration

**Feature**: 005-demo-to-web-migration
**Date**: 2026-03-21

## R-001: React Router to Next.js App Router Navigation

**Decision**: Replace all `react-router-dom` APIs with Next.js equivalents.

**Rationale**: Platform-web already uses Next.js App Router. Direct migration path:

- `useNavigate()` → `useRouter()` from `next/navigation`
- `useParams()` → `useParams()` from `next/navigation`
- `<Link to="...">` → `<Link href="...">` from `next/link`
- `<NavLink>` → Custom `Link` + `usePathname()` for active state detection
- `useLocation()` → `usePathname()` + `useSearchParams()` from `next/navigation`

**Alternatives considered**:

- Keep react-router in parallel: Rejected — adds unnecessary dependency and conflicts with App Router.

## R-002: i18n Migration (react-i18next → next-intl)

**Decision**: Migrate all translation keys from `apps/frontend-demo/src/i18n/pl.json` into `apps/platform-web/src/i18n/messages/pl.json` and use `next-intl` APIs. Prefer server-side translations.

**Rationale**: Platform-web already has next-intl configured with Polish locale. The demo app has ~145 translation keys. Platform-web currently has ~10 keys (nav, footer, common). Migration requires:

- Merging ~130 new keys into the existing `pl.json` structure
- In server components: use `getTranslations(namespace)` from `next-intl/server` (preferred)
- In client components (only where interactivity requires `'use client'`): use `useTranslations(namespace)` from `next-intl`
- Pattern: `const t = await getTranslations("namespace"); t("key")` in server components

**Alternatives considered**:

- Keep react-i18next: Rejected — platform-web is already using next-intl; mixing would create confusion.
- Use `useTranslations` everywhere: Rejected — forces unnecessary client components; `getTranslations` keeps components server-rendered.

## R-003: Authentication Migration (Mock → Clerk)

**Decision**: Use existing Clerk integration for auth-dependent UI; do not migrate mock auth flows.

**Rationale**: Platform-web already has:

- `AuthProvider` wrapping Clerk
- `useCurrentUser()`, `useSession()`, `useSignOut()` hooks
- Server-side `getCurrentUser()`, `getSession()`
- Clerk middleware protecting `(app)` routes
- Sign-in/sign-up pages via Clerk hosted components

The demo app's `AuthPage` (mock login/register) is replaced by Clerk's existing pages. Navbar/sidebar auth-aware states will use Clerk hooks instead of props like `isAuthenticated`.

**Alternatives considered**:

- Migrate mock auth UI on top of Clerk: Rejected — Clerk already provides better UX and real auth.

## R-004: Theme System Alignment

**Decision**: Use existing `next-themes` provider and `useTheme` hook from `@repo/ui`.

**Rationale**: Platform-web already has ThemeProvider configured with `attribute="class"`, `defaultTheme="system"`, `enableSystem`. The demo app's custom theme hook does the same thing but manually. No migration of the hook is needed — just use the existing one.

**Alternatives considered**:

- Port demo's custom theme hook: Rejected — duplicates existing functionality.

## R-005: Component Library Strategy

**Decision**: Source all shadcn/ui primitives from `@repo/ui`; keep domain components in `platform-web/modules/`.

**Rationale**: The `@repo/ui` package already has all 44+ shadcn components the demo uses. Key imports:

- `@repo/ui/core/button`, `@repo/ui/core/card`, `@repo/ui/core/dialog`, etc.
- `@repo/ui/components/page-header` — already migrated to shared package
- `@repo/ui/hooks/use-mobile` — already in shared package

No new shadcn components need to be added to `@repo/ui`. Domain-specific composed components (ProjectCard, WorkspaceForm, CreditPackageCard) belong in `platform-web/modules/`.

**Alternatives considered**:

- Copy shadcn components locally into platform-web: Rejected — violates monorepo convention and creates duplicates.

## R-006: Framer Motion Animations

**Decision**: Preserve Framer Motion animations where they exist in the demo app if they are straightforward to migrate. Accept visual parity without animations if complexity is disproportionate.

**Rationale**: The demo uses Framer Motion for page transitions and hover effects. These are mostly simple fade/slide animations. Framer Motion works with Next.js client components. Since the spec marks animation parity as a soft requirement, prioritize layout/content parity first.

**Alternatives considered**:

- Drop all animations: Acceptable fallback if Framer Motion causes hydration issues.
- CSS-only animations: Possible for simple cases but less consistent with demo.

## R-007: Landing Page Routing Strategy

**Decision**: Use the `(app)/page.tsx` root route for the landing page. Signed-in users will be redirected to `/dashboard` via the existing Clerk redirect configuration.

**Rationale**: The demo app uses `/` for the landing page. In platform-web, Clerk is configured with `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/dashboard` and `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/dashboard`, so after auth users land on dashboard. The root page can show the landing page for non-auth visitors. However, since `(app)` routes are protected by middleware, the landing page needs special handling — either move it outside the `(app)` group or make the root route public in middleware.

**Implementation approach**: Make the root `/` route public in Clerk middleware (add to `isPublicRoute` matcher), and conditionally render landing or redirect to dashboard based on auth state.

**Alternatives considered**:

- Separate `(public)` route group: More complex routing structure for a single page.
- Landing page at a different URL: Would break expected UX pattern.

## R-008: Mock Data Strategy

**Decision**: Define mock data as TypeScript constants in `modules/*/data/` files. No mock API server.

**Rationale**: The demo app uses inline mock data in page components. For better organization in the module structure, extract mock data into dedicated `data/` folders per module. This keeps components clean and makes it easy to replace mocks with real API calls later.

Mock data files:

- `modules/projects/data/mock-projects.ts` — Projects and visualizations
- `modules/workspace/data/mock-workspace.ts` — Styles, palettes, room types
- `modules/credits/data/mock-credits.ts` — Credit packages
- `modules/dashboard/data/mock-dashboard.ts` — Dashboard stats and recent items

**Alternatives considered**:

- Keep mocks inline: Messier; harder to replace later.
- MSW (Mock Service Worker): Overkill for static mock data.

## R-009: Form Handling Strategy

**Decision**: Keep `useState`-based forms for this migration scope. Do not convert to `react-hook-form` yet.

**Rationale**: The migration plan doc recommends `react-hook-form` for new forms in platform-web. However, the current scope is a 1:1 migration preserving demo behavior. Converting forms adds complexity without functional benefit at this stage. Forms can be upgraded to `react-hook-form` when API integration is added (next feature scope).

**Alternatives considered**:

- Migrate to react-hook-form now: Extra scope with no immediate benefit; mixes migration with refactoring.

## R-010: Sidebar Integration

**Decision**: Migrate the AppSidebar from the demo app into `modules/navigation/components/AppSidebar/`. Wire it into the `(app)/layout.tsx` alongside the existing navbar.

**Rationale**: The demo has a sidebar component using shadcn's Sidebar primitives. The platform-web currently only has a navbar. The migration plan specifies the sidebar should be included. The shadcn Sidebar component is already available in `@repo/ui`. The sidebar should use Clerk auth hooks for user info and sign-out instead of mock props.

**Alternatives considered**:

- Skip sidebar, keep navbar only: Would miss visual parity with demo.
