# Feature Specification: Layout Migration (frontend-demo to platform-web)

**Feature Branch**: `004-layout-migration`
**Created**: 2026-03-21
**Status**: Draft
**Input**: User description: "Move layout of the frontend application from the legacy frontend-demo app to platform-web app"

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Authenticated App Shell Navigation (Priority: P1)

An authenticated user navigates the platform-web application and sees a consistent shell: a sticky top navigation bar with logo, navigation links (Dashboard, Projects, Credits, Settings), a credit balance indicator, a user menu, and a footer. The navigation highlights the currently active page. This shell wraps all authenticated pages and provides the structural foundation for the entire app.

**Why this priority**: The app shell (navbar + footer) is the foundational UI structure. Every other page migration depends on having a working authenticated layout in place. Without it, no page can be properly rendered or tested.

**Independent Test**: Can be fully tested by signing in and navigating between any authenticated routes — the shell remains consistent, the active link updates, and the user menu displays correct user information.

**Acceptance Scenarios**:

1. **Given** a signed-in user on any authenticated page, **When** they look at the top of the page, **Then** they see a sticky navigation bar with logo, nav links, credit balance badge, and user avatar/menu.
2. **Given** a signed-in user on the Projects page, **When** they look at the nav links, **Then** the "Projects" link is visually highlighted as active.
3. **Given** a signed-in user, **When** they click the logo in the navbar, **Then** they are navigated to the dashboard.
4. **Given** a signed-in user, **When** they scroll down on any page, **Then** the navbar remains sticky at the top with a backdrop blur effect.
5. **Given** a signed-in user on any authenticated page, **When** they look at the bottom of the page, **Then** they see a footer with copyright information and links.

---

### User Story 2 - Responsive Mobile Navigation (Priority: P2)

A user on a mobile device accesses the platform. The desktop navigation links are replaced with a hamburger menu icon. Tapping the icon reveals a full-screen overlay with all navigation links, credit balance, and a sign-out option. Tapping a link or closing the overlay navigates them appropriately.

**Why this priority**: A significant portion of users will access the app on mobile devices. The mobile navigation experience must work correctly for the app to be usable on smaller screens, but it depends on the desktop nav shell being in place first.

**Independent Test**: Can be tested by resizing the browser below the mobile breakpoint (768px) and verifying the hamburger menu appears, opens an overlay with all navigation items, and allows navigation.

**Acceptance Scenarios**:

1. **Given** a signed-in user on a screen narrower than the mobile breakpoint, **When** they view the navbar, **Then** they see a hamburger menu icon instead of inline navigation links.
2. **Given** a signed-in user on mobile, **When** they tap the hamburger icon, **Then** a full-screen navigation overlay appears with all nav links, credit balance, and sign-out option.
3. **Given** an open mobile overlay, **When** the user taps a navigation link, **Then** they are navigated to that page and the overlay closes.
4. **Given** an open mobile overlay, **When** the user taps the close button or backdrop area, **Then** the overlay closes without navigating.

---

### User Story 3 - Page Header with Back Navigation and Actions (Priority: P3)

On pages that display a title area (e.g., Projects, Project Detail, Credits, Settings), the user sees a consistent page header showing the page title, an optional subtitle, an optional back button for returning to a parent page, and an optional action area (e.g., "Create project" button). This header provides consistent page-level context and navigation across all authenticated pages.

**Why this priority**: The page header is a reusable presentational component used on most authenticated pages. It must be available as a shared UI component before individual pages are migrated, but it is not as foundational as the app shell itself.

**Independent Test**: Can be tested by navigating to any page that uses it (e.g., Projects page) and verifying the title, optional subtitle, optional back button, and optional action buttons render correctly.

**Acceptance Scenarios**:

1. **Given** a user on the Projects page, **When** the page loads, **Then** a page header displays the title "Projekty" and an action button area.
2. **Given** a user on a Project Detail page, **When** the page loads, **Then** the page header shows a back button that navigates to the Projects list.
3. **Given** a user on a page with no subtitle configured, **When** they view the page header, **Then** no subtitle area is rendered.

---

### User Story 4 - Credit Balance Visibility (Priority: P3)

A signed-in user can see their current credit balance displayed prominently in the navigation bar (as a badge/pill) on both desktop and mobile views. Clicking/tapping the credit balance navigates them to the Credits page.

**Why this priority**: The credit balance is a key business element that must be visible at all times for monetization awareness, but it is a detail within the navbar component rather than a structural element.

**Independent Test**: Can be tested by signing in and verifying the credit badge appears in the navbar, shows a number, and navigates to the credits page when clicked.

**Acceptance Scenarios**:

1. **Given** a signed-in user on any authenticated page, **When** they look at the navbar, **Then** they see a credit balance badge with the current balance.
2. **Given** a signed-in user, **When** they click the credit balance badge, **Then** they are navigated to the Credits page.

---

### User Story 5 - User Menu and Sign-Out (Priority: P3)

A signed-in user can access a dropdown menu from their avatar in the navbar. The menu shows their name/email and offers quick access to Settings and a Sign Out action. Signing out redirects them to the sign-in page.

**Why this priority**: User account actions are essential but depend on the navbar being in place. They are lower priority because the auth provider (Clerk) already handles the sign-out flow — this is about surfacing it in the UI.

**Independent Test**: Can be tested by clicking the user avatar, verifying the dropdown shows user info, and verifying the sign-out action logs the user out.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they click their avatar in the navbar, **Then** a dropdown menu appears showing their name and email.
2. **Given** an open user dropdown, **When** the user clicks "Sign Out", **Then** they are signed out and redirected to the sign-in page.
3. **Given** an open user dropdown, **When** the user clicks "Settings", **Then** they are navigated to the Settings page.

---

### Edge Cases

- What happens when the user's name or email is unavailable (e.g., during loading)? The navbar should show a placeholder avatar without crashing.
- What happens when the credit balance is not yet loaded? The badge should show a loading state or be hidden until data is available.
- What happens when the user navigates to a route that does not exist within the app group? They should see the not-found page.
- What happens when the viewport is resized from mobile to desktop while the overlay is open? The overlay should close and desktop navigation should appear.
- What happens when the user is on a page with a very long title? The page header should handle text overflow gracefully (truncation or wrapping).

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: The system MUST display a persistent top navigation bar on all authenticated pages containing the app logo, navigation links, credit balance indicator, and user menu.
- **FR-002**: The navigation bar MUST visually indicate which page the user is currently on by highlighting the active navigation link.
- **FR-003**: The navigation bar MUST remain fixed/sticky at the top of the viewport when the user scrolls.
- **FR-004**: The system MUST display a footer on all authenticated pages with copyright information and relevant links.
- **FR-005**: On viewports below the mobile breakpoint (768px), the system MUST replace inline navigation links with a hamburger menu that opens a full-screen navigation overlay.
- **FR-006**: The mobile navigation overlay MUST include all navigation links, credit balance, and a sign-out action.
- **FR-007**: The system MUST provide a reusable page header component that supports a title, optional subtitle, optional back navigation, and optional action slot.
- **FR-008**: The page header component MUST be business-agnostic and reusable across different applications (placed in the shared UI package).
- **FR-009**: The credit balance MUST be displayed as a badge/pill in the navigation bar and MUST link to the Credits page.
- **FR-010**: The user menu MUST display the user's name and email and provide access to Settings and Sign Out actions.
- **FR-011**: The authenticated layout shell MUST wrap all pages within the app route group, providing consistent structure without requiring each page to include navigation individually.
- **FR-012**: The layout MUST preserve visual parity with the existing frontend-demo application — spacing, typography, colors, component sizes, hierarchy, and responsive behavior must match.
- **FR-013**: The system MUST provide a 404 / not-found page for unmatched routes.
- **FR-014**: All user-facing text in the layout components MUST support internationalization (Polish as the primary language).

### Key Entities

- **Navigation Item**: Represents a link in the navigation bar/sidebar — has a label, destination path, and icon. May have an active state.
- **App Shell**: The structural wrapper for authenticated pages — composed of navbar, main content area, and footer.
- **Page Header**: A reusable UI block with title, optional subtitle, optional back link, and optional action slot.

## Assumptions

- The existing Clerk authentication integration in platform-web will be used for user session data (name, email, avatar) instead of the mock auth from frontend-demo.
- The existing next-themes integration in platform-web will be used for dark/light mode theming.
- The existing next-intl integration in platform-web will be used for internationalization, with translation keys migrated from the frontend-demo i18n files.
- The AppSidebar component from frontend-demo is documented but not currently wired into the layout. This migration focuses on the navbar-based layout that is actively used. Sidebar integration can be addressed separately if needed.
- Credit balance data will initially be placeholder/mock data, with real API integration to follow in a separate feature.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All authenticated pages render within a consistent shell (navbar + footer) — 100% of app-group routes display the same navigation structure.
- **SC-002**: Navigation between all authenticated pages works correctly — clicking any nav link loads the target page within the shell without full page reload.
- **SC-003**: The mobile navigation overlay is fully functional on viewports below 768px — all navigation items are accessible and tappable.
- **SC-004**: Visual parity with frontend-demo is maintained — side-by-side comparison of each layout element (navbar, footer, page headers) at desktop and mobile viewports shows no unintended differences in spacing, typography, colors, or hierarchy.
- **SC-005**: The page header component is available as a shared UI component and renders correctly with all prop combinations (title only, title + subtitle, title + back button, title + actions).
- **SC-006**: All layout text is internationalized — switching locale renders all navigation labels, footer text, and page header defaults in the configured language.
- **SC-007**: The credit balance badge is visible and clickable on both desktop and mobile layouts, navigating to the Credits page.
