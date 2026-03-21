# Research: Layout Migration

## R1: Next.js App Router Layout Pattern for Authenticated Shell

**Decision**: Use the `(app)/layout.tsx` route group layout as the authenticated shell. This is a server component that renders the Navbar and Footer around `{children}`. Interactive parts (Navbar, MobileNav) are client components imported into the server layout.

**Rationale**: Next.js App Router route groups `(app)` already exist in platform-web and naturally scope layouts. The `(app)` group is protected by Clerk middleware (`proxy.ts`), so any layout component inside it can safely assume an authenticated user. Server component layout avoids unnecessary client JS for the static shell structure.

**Alternatives considered**:

- Wrapping each page individually (rejected — violates FR-011 and DRY)
- Using a client-only layout (rejected — unnecessary client bundle for static shell)

## R2: Replacing React Router Navigation with Next.js

**Decision**: Replace `useNavigate()` / `useLocation()` / `<Link to>` from react-router-dom with Next.js equivalents: `useRouter()` from `next/navigation`, `usePathname()` for active link detection, and `<Link href>` from `next/link`.

**Rationale**: platform-web uses Next.js App Router, not React Router. Direct 1:1 mapping exists for all navigation patterns used in the frontend-demo Navbar and PageHeader.

**Alternatives considered**:

- None — this is a mandatory framework migration.

## R3: Replacing react-i18next with next-intl

**Decision**: Use `useTranslations()` hook from `next-intl` instead of `useTranslation()` from react-i18next. Translation keys are loaded via `NextIntlClientProvider` already set up in RootLayout. Migrate relevant keys from `frontend-demo/src/i18n/pl.json` to `platform-web/src/i18n/messages/pl.json`.

**Rationale**: platform-web already has next-intl configured with `NextIntlClientProvider` and `getMessages()`. The API differs slightly: `t("nav.dashboard")` in react-i18next becomes `t("dashboard")` with namespace `useTranslations("nav")`, or a flat `useTranslations()` with dot-path access.

**Alternatives considered**:

- Using react-i18next in platform-web (rejected — next-intl is already integrated and recommended for Next.js App Router)

## R4: Clerk Integration for User Info and Sign-Out

**Decision**: Use the existing `useCurrentUser()` hook from `@/core/packages/auth/client` to get user name, email, and initials for the UserMenu. Use `useSignOut()` for the sign-out action. Avatar fallback uses initials derived from `firstName` + `lastName`.

**Rationale**: platform-web already wraps Clerk via typed hooks (`useCurrentUser`, `useSignOut`) that return strongly typed `TUser` objects. This replaces the hardcoded mock data in frontend-demo.

**Alternatives considered**:

- Using Clerk's `<UserButton>` component directly (rejected — doesn't match the custom dropdown design from frontend-demo)
- Keeping mock data (rejected — real auth is available and spec requires it)

## R5: Credit Balance Data Source

**Decision**: Use a placeholder/mock credit balance value initially, exposed via a simple React context or hardcoded prop. The real API integration will follow in a separate feature (per spec assumptions).

**Rationale**: The spec explicitly states "Credit balance data will initially be placeholder/mock data, with real API integration to follow in a separate feature." The CreditBadge component will accept a `balance` prop, making it easy to swap in real data later.

**Alternatives considered**:

- Integrating the credits API now (rejected — out of scope per spec assumptions)
- Hiding the badge until API is ready (rejected — FR-009 requires it visible)

## R6: PageHeader Extraction to @repo/ui

**Decision**: Create `packages/ui/src/components/page-header/page-header.tsx` as a business-agnostic component. Replace `useNavigate()` back-navigation with an `onBack` callback prop and an `href` prop used with Next.js `<Link>`. This makes the component framework-agnostic at the UI level.

**Rationale**: FR-008 requires PageHeader to be reusable across applications. It must not depend on react-router-dom or next/navigation directly. The consuming app passes the navigation handler.

**Alternatives considered**:

- Keeping PageHeader in platform-web only (rejected — FR-008 explicitly requires shared UI package)
- Making it a server component (rejected — back button needs client interactivity)

## R7: Mobile Navigation Pattern in Next.js

**Decision**: Use the `Sheet` component from `@repo/ui` (shadcn/ui Sheet based on Radix Dialog) for the mobile navigation overlay instead of the custom overlay + backdrop div used in frontend-demo.

**Rationale**: The `@repo/ui` package already includes a `Sheet` component which provides accessible overlay behavior (focus trap, escape to close, backdrop click to close) out of the box. This is more robust than the custom implementation and aligns with the constitution's UX consistency principle.

**Alternatives considered**:

- Porting the custom overlay as-is (rejected — Sheet component provides better accessibility and is already available)
- Using Radix Dialog directly (rejected — Sheet wraps Dialog with slide-in animation, better UX for mobile nav)

## R8: Active Link Detection

**Decision**: Use `usePathname()` from `next/navigation` to detect the current route path and compare it with nav link `href` values. Use `startsWith()` for nested routes (e.g., `/projects/123` should highlight the "Projects" link).

**Rationale**: `usePathname()` is the Next.js App Router equivalent of react-router-dom's `useLocation().pathname`. Using `startsWith()` instead of exact match handles nested routes more gracefully.

**Alternatives considered**:

- Exact match only (rejected — would not highlight parent nav item on child pages)
