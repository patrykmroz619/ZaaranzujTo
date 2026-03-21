# Tasks: Layout Migration (frontend-demo → platform-web)

**Input**: Design documents from `/specs/004-layout-migration/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Not requested — no test tasks included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: i18n translations, shared types, and directory scaffolding

- [x] T001 Add navigation, footer, and common translation keys to `apps/platform-web/src/i18n/messages/pl.json` — migrate `nav`, `footer`, and `common` sections from `apps/frontend-demo/src/i18n/pl.json` per the i18n keys contract in `specs/004-layout-migration/contracts/ui-components.md`
- [x] T002 [P] Create `TNavItem` type and nav items config array in `apps/platform-web/src/core/layout/Navbar/nav-items.ts` — define `TNavItem` type (`label`, `href`, `icon`) and export a `getNavItems` function that takes a translation function and returns the nav links array (Dashboard, Projects, Credits, Settings) with Lucide icons (Home, FolderOpen, Coins, Settings)
- [x] T003 [P] Create directory structure and barrel `index.ts` files for new layout components: `apps/platform-web/src/core/layout/Navbar/index.ts`, `apps/platform-web/src/core/layout/Footer/index.ts`, `apps/platform-web/src/core/layout/AppShell/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: The app shell wrapper and footer that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create `Footer` component in `apps/platform-web/src/core/layout/Footer/Footer.tsx` — client component using `useTranslations("footer")` from next-intl, matching the visual design from `apps/frontend-demo/src/components/Footer.tsx` (border-t, bg-muted/30, copyright + Contact mailto link + Terms link), export from `index.ts`
- [x] T005 Create `AppShell` component in `apps/platform-web/src/core/layout/AppShell/AppShell.tsx` — client component that renders a `min-h-screen flex flex-col` wrapper with a Navbar placeholder slot, `<main className="flex-1">{children}</main>`, and the `Footer` component. Export from `index.ts`
- [x] T006 Update `apps/platform-web/src/app/(app)/layout.tsx` to import and render the `AppShell` component wrapping `{children}`, replacing the current bare `<div>{children}</div>`

**Checkpoint**: The app group now has a structural shell (placeholder navbar area + footer) visible on all authenticated pages.

---

## Phase 3: User Story 1 — Authenticated App Shell Navigation (Priority: P1) 🎯 MVP

**Goal**: A signed-in user sees a sticky top navigation bar with logo, navigation links (Dashboard, Projects, Credits, Settings), and a footer on every authenticated page. The active page is highlighted in the nav.

**Independent Test**: Sign in, navigate between authenticated routes — verify the shell is consistent, active link updates, logo navigates to dashboard, navbar is sticky with backdrop blur, footer is visible at the bottom.

### Implementation for User Story 1

- [x] T007 Create `NavLinks` component in `apps/platform-web/src/core/layout/Navbar/NavLinks.tsx` — client component that renders horizontal desktop nav links using `useTranslations("nav")` and `usePathname()` from next/navigation. Use `Button` from `@repo/ui/core/button` with `variant="ghost"` and `size="sm"`. Highlight active link using `pathname.startsWith(href)` comparison. Apply `bg-accent text-accent-foreground` for active, `text-muted-foreground` for inactive. Wrap in `<nav className="hidden items-center gap-1 md:flex">` to hide on mobile.
- [x] T008 Create `Navbar` component in `apps/platform-web/src/core/layout/Navbar/Navbar.tsx` — client component with sticky header (`sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md`), container div with `h-14 items-center justify-between`. Render: (1) logo link (`<Link href="/dashboard">`) with brand text "Zaaranżuj<span className="text-primary">To</span>" using `font-display text-xl`, (2) `NavLinks` component to the right of logo with `gap-6`. Right side: placeholder slots for CreditBadge and UserMenu (to be filled in US4/US5). Export from `index.ts`.
- [x] T009 Wire `Navbar` into `AppShell` in `apps/platform-web/src/core/layout/AppShell/AppShell.tsx` — import and render `Navbar` at the top of the shell, above `<main>`.
- [x] T010 Create `apps/platform-web/src/app/(app)/not-found.tsx` — a simple not-found page for the app route group displaying a 404 message with a link back to dashboard (FR-013).

**Checkpoint**: User Story 1 is complete — authenticated pages show sticky navbar with logo + desktop nav links + footer. Active link highlighting works. Logo links to dashboard.

---

## Phase 4: User Story 2 — Responsive Mobile Navigation (Priority: P2)

**Goal**: On viewports below 768px, inline nav links are replaced with a hamburger menu icon. Tapping it opens a Sheet overlay with all nav links, credit balance, and sign-out option.

**Independent Test**: Resize browser below 768px — verify hamburger appears, desktop links are hidden, Sheet opens with all nav items, clicking a link navigates and closes the overlay, clicking backdrop/close closes without navigation.

### Implementation for User Story 2

- [x] T011 Create `MobileNav` component in `apps/platform-web/src/core/layout/Navbar/MobileNav.tsx` — client component using `Sheet`, `SheetTrigger`, `SheetContent`, `SheetHeader`, `SheetTitle` from `@repo/ui/core/sheet` and `Button` from `@repo/ui/core/button`. Render a hamburger `Button` (variant="ghost", size="icon", className="md:hidden") with `Menu` icon as trigger. Sheet side="top" or side="left" containing: (1) vertical nav links list using `getNavItems()` from `nav-items.ts` with active state via `usePathname()`, each as a button that calls `router.push(href)` and closes the sheet, (2) separator, (3) sign-out button with `LogOut` icon and `useSignOut()` from `@/core/packages/auth`. Close the sheet on navigation by controlling open state. Include credit balance display in the sheet (placeholder value for now, to be connected in US4).
- [x] T012 Integrate `MobileNav` into `Navbar` in `apps/platform-web/src/core/layout/Navbar/Navbar.tsx` — add `MobileNav` component to the right side of the navbar, after the placeholder slots for CreditBadge/UserMenu.

**Checkpoint**: User Story 2 is complete — mobile users see hamburger menu, Sheet overlay works with all nav items and sign-out.

---

## Phase 5: User Story 3 — Page Header with Back Navigation and Actions (Priority: P3)

**Goal**: A reusable, business-agnostic `PageHeader` component is available in `@repo/ui` with title, optional subtitle, optional back button, and optional action slot.

**Independent Test**: Import `PageHeader` in any page, render with various prop combinations (title only, title + subtitle, title + backHref, title + children) — verify correct rendering and back navigation.

### Implementation for User Story 3

- [x] T013 Create `PageHeader` component in `packages/ui/src/components/page-header/page-header.tsx` — client component matching the contract in `specs/004-layout-migration/contracts/ui-components.md`. Props: `title` (string), `subtitle?` (string), `backHref?` (string), `backLabel?` (string, defaults to "Wstecz"), `children?` (ReactNode). Render: (1) if `backHref`, show a `Link` styled as ghost button with `ArrowLeft` icon + label, (2) flex row with title/subtitle on left and children (action slot) on right, stacking vertically on mobile (`flex-col gap-3 sm:flex-row sm:items-center sm:justify-between`). Use `font-display text-2xl` for title, `text-sm text-muted-foreground` for subtitle. Use `Link` from `next/link` for the back button.
- [x] T014 Create barrel export in `packages/ui/src/components/page-header/index.ts` and add the `"./components/*"` export pattern to `packages/ui/package.json` if not already present — ensure `@repo/ui/components/page-header` is importable.

**Checkpoint**: User Story 3 is complete — `PageHeader` is available as a shared UI component and can be used in any page.

---

## Phase 6: User Story 4 — Credit Balance Visibility (Priority: P3)

**Goal**: A credit balance badge/pill is visible in the navbar on both desktop and mobile, linking to the Credits page.

**Independent Test**: Sign in, verify credit badge visible in navbar with a number, click it, verify navigation to /credits.

### Implementation for User Story 4

- [x] T015 Create `CreditBadge` component in `apps/platform-web/src/core/layout/Navbar/CreditBadge.tsx` — client component accepting `balance: number` prop. Render a `Link` to `/credits` styled as a rounded pill (`rounded-full bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-primary hover:text-primary-foreground`) with `Coins` icon from lucide-react + balance number. Match the visual from `apps/frontend-demo/src/components/Navbar.tsx` lines 71-77.
- [x] T016 Wire `CreditBadge` into `Navbar` in `apps/platform-web/src/core/layout/Navbar/Navbar.tsx` — replace the placeholder slot with `<CreditBadge balance={4} />` (hardcoded placeholder per spec assumption). Also add credit balance display in `MobileNav` Sheet if not already present.

**Checkpoint**: User Story 4 is complete — credit badge visible and clickable on desktop and within mobile Sheet.

---

## Phase 7: User Story 5 — User Menu and Sign-Out (Priority: P3)

**Goal**: A user dropdown menu accessible from the avatar in the navbar, showing name/email and offering Settings + Sign Out actions.

**Independent Test**: Sign in, click avatar — verify dropdown shows user name/email, clicking Settings navigates to /settings, clicking Sign Out logs out and redirects to sign-in.

### Implementation for User Story 5

- [x] T017 Create `UserMenu` component in `apps/platform-web/src/core/layout/Navbar/UserMenu.tsx` — client component using `useCurrentUser()` and `useSignOut()` from `@/core/packages/auth`. Render: (1) `DropdownMenu` from `@repo/ui/core/dropdown-menu` with trigger being a button containing `Avatar` + `AvatarFallback` (initials from firstName/lastName) from `@repo/ui/core/avatar`, plus user name + email text (hidden on mobile via `hidden md:block` or `useIsMobile`), (2) dropdown content with: user info block (on mobile only, when name is hidden in trigger), `DropdownMenuItem` for Settings (Settings icon + nav to /settings), separator, `DropdownMenuItem` for Sign Out (LogOut icon + `signOut()` call). Handle loading state: show placeholder avatar without crashing when user data is not yet loaded (edge case from spec).
- [x] T018 Wire `UserMenu` into `Navbar` in `apps/platform-web/src/core/layout/Navbar/Navbar.tsx` — replace the placeholder slot with `<UserMenu />`, positioned between CreditBadge and MobileNav hamburger.

**Checkpoint**: User Story 5 is complete — user menu works with real Clerk data, sign-out functional.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Edge cases, visual parity, and final integration checks

- [x] T019 Handle edge case: viewport resize from mobile to desktop while Sheet is open — ensure Sheet closes when viewport crosses the 768px breakpoint. Add a `useEffect` in `MobileNav` that listens to `useIsMobile()` from `@repo/ui/hooks/use-mobile` and closes the Sheet when `isMobile` becomes `false`.
- [x] T020 Handle edge case: credit balance loading state — update `CreditBadge` to accept an optional `isLoading` prop and show a skeleton/placeholder when true, or hide gracefully.
- [x] T021 Visual parity review — compare `Navbar`, `Footer`, `CreditBadge`, and `UserMenu` side-by-side with `apps/frontend-demo` at both desktop (1280px) and mobile (375px) viewports. Fix any spacing, typography, color, or hierarchy differences per FR-012 and SC-004.
- [x] T022 Run `bun run check-types` and `bun run lint` from monorepo root — fix any TypeScript or ESLint errors introduced by the new components.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T001 (i18n keys) — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Phase 2 completion (AppShell + Footer in place)
- **US2 (Phase 4)**: Depends on Phase 3 (Navbar must exist to add MobileNav)
- **US3 (Phase 5)**: Depends on Phase 1 only (independent of Navbar — builds in @repo/ui)
- **US4 (Phase 6)**: Depends on Phase 3 (Navbar must exist to add CreditBadge)
- **US5 (Phase 7)**: Depends on Phase 3 (Navbar must exist to add UserMenu)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1)**: Depends on Foundational only — no cross-story dependencies
- **US2 (P2)**: Depends on US1 (Navbar structure needed for hamburger placement)
- **US3 (P3)**: Independent of all other stories — can run in parallel with US1
- **US4 (P3)**: Depends on US1 (Navbar structure needed for badge placement)
- **US5 (P3)**: Depends on US1 (Navbar structure needed for UserMenu placement)

### Parallel Opportunities

- **T002 + T003**: Setup tasks on different files — run in parallel
- **T004 + T005**: Footer and AppShell can be developed in parallel (AppShell references Footer but can use placeholder)
- **US3 (Phase 5)** can run in parallel with **US1 (Phase 3)** — completely different packages
- **US4 (Phase 6) + US5 (Phase 7)**: Can run in parallel after US1 — different component files
- **T019 + T020**: Polish edge cases on different components — run in parallel

---

## Parallel Example: After Phase 2 Completion

```text
# These can be launched in parallel:
Task: "US1 — NavLinks component in apps/platform-web/src/core/layout/Navbar/NavLinks.tsx"
Task: "US3 — PageHeader component in packages/ui/src/components/page-header/page-header.tsx"

# After US1 completes, these can run in parallel:
Task: "US4 — CreditBadge in apps/platform-web/src/core/layout/Navbar/CreditBadge.tsx"
Task: "US5 — UserMenu in apps/platform-web/src/core/layout/Navbar/UserMenu.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (i18n keys + types)
2. Complete Phase 2: Foundational (Footer + AppShell + layout.tsx)
3. Complete Phase 3: User Story 1 (Navbar with desktop nav links + active state)
4. **STOP and VALIDATE**: Sign in and verify shell on all authenticated routes
5. Deploy/demo if ready — basic authenticated layout is functional

### Incremental Delivery

1. Setup + Foundational → Shell structure ready
2. Add US1 (Navbar + desktop nav) → MVP deployed
3. Add US2 (Mobile nav) → Mobile-ready
4. Add US3 (PageHeader) → Shared component ready for page migrations
5. Add US4 + US5 (Credit badge + User menu) → Full navbar feature parity
6. Polish → Visual parity confirmed, edge cases handled

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Credit balance is hardcoded (value 4) as placeholder — real API integration is a separate feature
- PageHeader uses `next/link` for back navigation — not fully framework-agnostic but acceptable since both consuming apps are Next.js
- No tests included — constitution policy is no proactive tests during MVP unless requested
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
