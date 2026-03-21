# Data Model: Layout Migration

This feature is UI/layout only — there are no database entities or persistent state models. The "entities" below are component prop interfaces and configuration types.

## Navigation Item

Represents a link displayed in the navbar and mobile navigation.

| Field | Type | Description |
|-------|------|-------------|
| `label` | `string` | Translated display text |
| `href` | `string` | Route path |
| `icon` | `LucideIcon` | Lucide icon component |

```typescript
type TNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};
```

**Used by**: Navbar (desktop links), MobileNav (overlay links)

## Page Header Props

Props for the reusable PageHeader component extracted to `@repo/ui`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | Yes | Page heading |
| `subtitle` | `string` | No | Secondary description |
| `backHref` | `string` | No | URL for back navigation |
| `backLabel` | `string` | No | Label for back button (defaults to "Wstecz") |
| `children` | `ReactNode` | No | Action slot (CTA buttons) |

```typescript
type TPageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: ReactNode;
};
```

## User Menu Data

Derived from Clerk's `TUser` type (already defined in `@/core/packages/auth`).

| Field | Type | Source |
|-------|------|--------|
| `fullName` | `string \| null` | `useCurrentUser().fullName` |
| `email` | `string` | `useCurrentUser().email` |
| `initials` | `string` | Derived from firstName/lastName |

No new type needed — uses existing `TUser` from auth package.

## Credit Balance

| Field | Type | Description |
|-------|------|-------------|
| `balance` | `number` | Current credit count |

Initially hardcoded. Will be replaced by API data in a future feature.

## State Transitions

### Mobile Navigation Overlay

```
CLOSED → [hamburger click] → OPEN
OPEN → [link click / close button / backdrop click / route change / viewport resize ≥768px] → CLOSED
```

### User Dropdown Menu

```
CLOSED → [avatar click] → OPEN
OPEN → [item click / outside click / escape] → CLOSED
```

Both managed by Radix UI primitives (Sheet, DropdownMenu) — no custom state machine needed.
