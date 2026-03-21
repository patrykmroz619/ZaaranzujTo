# Quickstart: Demo to Platform Web Migration

**Feature**: 005-demo-to-web-migration
**Date**: 2026-03-21

## Prerequisites

- Bun installed (monorepo runtime)
- Node.js 20+ (for Next.js compatibility)
- Clerk account with keys configured in `apps/platform-web/.env`

## Getting Started

```sh
# From monorepo root
bun install

# Start platform-web dev server
bun run dev:web

# App available at http://localhost:3000
```

## Key Development Patterns

### Adding a new page

1. Create route file: `src/app/(app)/[route]/page.tsx` (thin, imports view)
2. Create view: `src/views/[name]/[Name]View.tsx` (orchestration component)
3. Create module components: `src/modules/[domain]/components/[Component]/`
4. Add i18n keys to `src/i18n/messages/pl.json`

### Using shared UI components

```tsx
import { Button } from "@repo/ui/core/button";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/core/card";
import { PageHeader } from "@repo/ui/components/page-header";
import { useIsMobile } from "@repo/ui/hooks/use-mobile";
```

### Using auth hooks

```tsx
import { useCurrentUser, useSignOut } from "@/core/packages/auth";
// or server-side:
import { getCurrentUser } from "@/core/packages/auth";
```

### Using translations

Prefer server-side translations (`getTranslations`) over client-side (`useTranslations`).

```tsx
// Server component (preferred)
import { getTranslations } from "next-intl/server";

const MyComponent = async () => {
  const t = await getTranslations("namespace");
  return <p>{t("key")}</p>;
};

// Client component (only when 'use client' is required for interactivity)
import { useTranslations } from "next-intl";

const MyClientComponent = () => {
  const t = useTranslations("namespace");
  return <p>{t("key")}</p>;
};
```

### Using theme

```tsx
import { useTheme } from "@repo/ui/hooks/use-theme";
// or from local wrapper:
import { useTheme } from "@/core/packages/theme";
```

## Verification

After migration of each page:

1. Run `bun run dev:web` and navigate to the page
2. Compare visually with `bun run dev` (frontend-demo at its port)
3. Check at 375px, 768px, and 1440px widths
4. Verify all text is in Polish (no hardcoded strings)
5. Verify navigation links work
6. Verify theme switching (light/dark/system)

## Useful Commands

```sh
bun run lint          # Lint all workspaces
bun run check-types   # Type-check all workspaces
bun run format:check  # Prettier check
bun run build         # Build all apps
```
