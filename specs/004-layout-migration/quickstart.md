# Quickstart: Layout Migration

## What This Feature Does

Migrates the authenticated layout shell (navbar, footer, mobile navigation, page header) from `apps/frontend-demo` to `apps/platform-web`, replacing mock auth with Clerk and mock i18n with next-intl.

## Key Files After Implementation

| File                                                     | Purpose                                                       |
| -------------------------------------------------------- | ------------------------------------------------------------- |
| `apps/platform-web/src/app/(app)/layout.tsx`             | Authenticated shell (renders Navbar + Footer around children) |
| `apps/platform-web/src/core/layout/Navbar/Navbar.tsx`    | Top navigation bar (desktop + mobile)                         |
| `apps/platform-web/src/core/layout/Footer/Footer.tsx`    | Site footer                                                   |
| `packages/ui/src/components/page-header/page-header.tsx` | Reusable page header (shared UI)                              |
| `apps/platform-web/src/i18n/messages/pl.json`            | Polish translations (nav, footer, common keys)                |

## How to Verify

```bash
# Start the dev server
bun run dev:web

# Navigate to http://localhost:3000 (should redirect to sign-in if not authenticated)
# After signing in:
# - Navbar visible with logo, nav links, credit badge, user menu
# - Footer visible at bottom
# - Resize to <768px to see mobile hamburger menu
# - Click nav links to verify active state highlighting
# - Click user avatar to see dropdown with Settings + Sign Out
```

## Architecture Decisions

1. **Server layout + client components**: The `(app)/layout.tsx` is a server component. Navbar and Footer are client components (need interactivity).
2. **Sheet for mobile nav**: Uses `@repo/ui` Sheet component instead of custom overlay for better accessibility.
3. **PageHeader in @repo/ui**: Extracted as a shared component with `backHref` prop (framework-agnostic via Link).
4. **Active link detection**: Uses `usePathname()` + `startsWith()` for nested route support.
5. **Credit balance**: Placeholder value initially — API integration in a future feature.
