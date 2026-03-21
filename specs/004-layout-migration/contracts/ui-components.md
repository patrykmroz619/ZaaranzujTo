# UI Component Contracts: Layout Migration

This feature exposes no external APIs. The contracts below define the public interfaces of the shared/reusable UI components created by this feature.

## PageHeader (`@repo/ui`)

**Location**: `packages/ui/src/components/page-header/page-header.tsx`
**Export**: `PageHeader` component, `TPageHeaderProps` type

### Props Contract

```typescript
type TPageHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
};
```

### Rendering Rules

| Prop Combination | Renders |
|-----------------|---------|
| `title` only | Heading text |
| `title` + `subtitle` | Heading + muted subtext below |
| `title` + `backHref` | Back button (ArrowLeft icon + label) above heading |
| `title` + `children` | Heading on left, action slot on right (stacked on mobile) |
| All props | Back button, heading row with title/subtitle left + actions right |

### Back Button Behavior

- Renders as a `<Link>` to `backHref` (Next.js client navigation)
- Default label: `"Wstecz"` (overridable via `backLabel`)
- Styled as ghost button with ArrowLeft icon

---

## Navbar Component API (internal to platform-web)

**Location**: `apps/platform-web/src/core/layout/Navbar/Navbar.tsx`

Not exported as a shared component — internal to the `(app)` layout.

### Sub-components

| Component | Purpose | Props |
|-----------|---------|-------|
| `NavLinks` | Desktop horizontal nav links | None (uses i18n + pathname internally) |
| `MobileNav` | Hamburger + Sheet overlay | None (uses i18n + pathname internally) |
| `CreditBadge` | Credit balance pill | `balance: number` |
| `UserMenu` | Avatar + dropdown | None (uses `useCurrentUser()` internally) |

---

## i18n Keys Contract

Keys that MUST exist in `platform-web/src/i18n/messages/pl.json` for layout components:

```json
{
  "nav": {
    "dashboard": "string",
    "projects": "string",
    "credits": "string",
    "settings": "string",
    "signOut": "string"
  },
  "footer": {
    "contact": "string",
    "terms": "string"
  },
  "common": {
    "back": "string"
  }
}
```
