# Feature Specification: Demo to Platform Web Migration

**Feature Branch**: `005-demo-to-web-migration`
**Created**: 2026-03-21
**Status**: Draft
**Input**: User description: "Migration from frontend-demo to platform-web app. For now just move web application based on mock data, like it is in demo app. Integration with API will be done in next steps and is outside of scope."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Authenticated Application Shell (Priority: P1)

An authenticated user navigates between pages of the ZaaranżujTo application using a consistent navigation shell (navbar, sidebar, footer). The shell displays the user's identity, credit balance, and provides access to all main sections: Dashboard, Projects, Credits, and Settings.

**Why this priority**: The application shell is the foundation for every other page. Without working navigation and layout, no other page can be meaningfully used or tested.

**Independent Test**: Can be tested by signing in via Clerk and verifying that the navbar, sidebar, and footer render correctly across desktop and mobile viewports. Navigation links route to correct pages. User info and credit badge display properly.

**Acceptance Scenarios**:

1. **Given** a signed-in user on any app page, **When** the page loads, **Then** the navbar shows the logo, navigation links, credit badge, and user avatar/menu.
2. **Given** a signed-in user on desktop, **When** the sidebar is visible, **Then** it displays navigation items (Dashboard, Projects, Credits, Settings), user card, and sign-out action.
3. **Given** a signed-in user on mobile, **When** the user opens the mobile menu, **Then** all navigation items are accessible and the layout is responsive.
4. **Given** a signed-in user, **When** the user clicks the sign-out action, **Then** they are signed out via Clerk and redirected appropriately.
5. **Given** any page within the app area, **When** the page renders, **Then** a footer with copyright, contact, and terms links is visible.

---

### User Story 2 - Dashboard Page (Priority: P1)

A signed-in user sees their dashboard with summary statistics (projects count, visualizations count, credit balance), quick action buttons, and a list of recent projects. This serves as the primary landing page after sign-in.

**Why this priority**: The dashboard is the first screen users interact with after authentication. It provides orientation and quick access to key workflows.

**Independent Test**: Can be tested by navigating to `/dashboard` and verifying that statistics cards, quick action buttons, and recent project cards render with mock data. Clicking quick actions and project cards navigates to the correct pages.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they navigate to the dashboard, **Then** they see statistics cards showing project count, visualization count, and credit balance.
2. **Given** a signed-in user on the dashboard, **When** they click "New Project" quick action, **Then** they are directed to the projects page or project creation flow.
3. **Given** a signed-in user on the dashboard, **When** recent projects are displayed, **Then** each project card shows the project name, date, and is clickable to navigate to the project detail.
4. **Given** a signed-in user with no projects, **When** they view the dashboard, **Then** an empty state with a call-to-action to create a project is shown.

---

### User Story 3 - Projects List and Management (Priority: P1)

A signed-in user can view all their projects, create new projects via a dialog, rename projects, and delete projects with a confirmation step.

**Why this priority**: Project management is a core workflow. Users must be able to organize their design projects before creating visualizations.

**Independent Test**: Can be tested by navigating to `/projects`, verifying the project list renders, creating a new project via dialog, renaming a project, and deleting a project with confirmation.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they navigate to projects, **Then** they see a list of all their projects with name, date created, and visualization count.
2. **Given** a signed-in user on the projects page, **When** they click "New Project", **Then** a dialog appears with a name field and create button.
3. **Given** the create project dialog is open, **When** the user enters a name and submits, **Then** the project appears in the list (mock behavior).
4. **Given** a project in the list, **When** the user opens the dropdown menu and selects "Edit Name", **Then** they can rename the project.
5. **Given** a project in the list, **When** the user selects "Delete" from the dropdown, **Then** a confirmation dialog appears. Confirming deletes the project (mock behavior).
6. **Given** a signed-in user with no projects, **When** they view the projects page, **Then** an empty state with a call-to-action is shown.

---

### User Story 4 - Project Detail with Visualizations (Priority: P2)

A signed-in user can view all visualizations within a specific project and initiate creation of new visualizations.

**Why this priority**: Viewing project contents is required before users can access the workspace, but depends on the project list being functional first.

**Independent Test**: Can be tested by navigating to `/projects/[projectId]` and verifying visualization cards render with mock data, and that the "New Visualization" button is present.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they navigate to a project detail page, **Then** they see the project name as a heading with a back button and a list of visualization cards.
2. **Given** visualizations exist in the project, **When** the page renders, **Then** each visualization card shows its name, iteration count, and latest date.
3. **Given** a visualization card, **When** the user clicks it, **Then** they are navigated to the workspace for that visualization.
4. **Given** no visualizations exist in the project, **When** the page renders, **Then** an empty state with a call-to-action to create a visualization is shown.

---

### User Story 5 - Design Workspace (Priority: P2)

A signed-in user can use the workspace to configure and generate interior design visualizations. The workspace has a two-panel layout: a form panel (left) for inputs and a preview panel (right) for viewing generated results and iteration history.

**Why this priority**: The workspace is the most complex and central feature, but requires projects and navigation to be in place first.

**Independent Test**: Can be tested by navigating to `/projects/[projectId]/workspace/[visualizationId]` and verifying the two-panel layout renders, form fields work (style, palette, room type, prompt, photo upload), generation simulation runs, and iteration carousel displays results.

**Acceptance Scenarios**:

1. **Given** a signed-in user in the workspace, **When** the page loads, **Then** a two-panel layout is shown with a form on the left and a preview area on the right.
2. **Given** the workspace form, **When** the user selects "From Photo" mode, **Then** a room photo upload field appears accepting image files (.jpg, .jpeg, .png, .webp, .avif, .heic).
3. **Given** the workspace form, **When** the user selects "From Scratch" mode, **Then** the room photo field is hidden and only text-based inputs remain.
4. **Given** the workspace form, **When** the user fills in style, color palette, room type, and prompt, **Then** all fields accept selections and text input correctly.
5. **Given** a completed workspace form, **When** the user clicks "Generate", **Then** a loading state is shown for the generation duration, and a new iteration appears in the preview panel.
6. **Given** multiple iterations exist, **When** the user views the preview panel, **Then** a carousel/strip of iteration thumbnails is visible, and clicking one displays that iteration.
7. **Given** the workspace on mobile, **When** the page renders, **Then** the two-panel layout stacks vertically and remains usable.
8. **Given** the user has no credits, **When** they attempt to generate, **Then** a message about insufficient credits is shown with a link to purchase more.

---

### User Story 6 - Credits Page (Priority: P3)

A signed-in user can view available credit packages with pricing and select one to purchase.

**Why this priority**: Credits are important for monetization but the purchase flow is mock-only at this stage, making it lower priority than core design workflows.

**Independent Test**: Can be tested by navigating to `/credits` and verifying that three credit packages (Starter, Standard, Pro) render with correct pricing, credit amounts, and that the "Popular" badge appears on the recommended package.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they navigate to credits, **Then** they see their current credit balance and available packages.
2. **Given** the credits page, **When** packages are displayed, **Then** each package shows the name, credit amount, price, and a buy button.
3. **Given** the credits page, **When** the recommended package is displayed, **Then** it is highlighted with a "Popular" badge.
4. **Given** a user clicks "Buy" on a package, **When** the action completes (mock), **Then** a success toast notification is shown.

---

### User Story 7 - Settings Page (Priority: P3)

A signed-in user can manage their preferences including theme selection (light, dark, system) and account actions (delete account).

**Why this priority**: Settings is a supporting page that doesn't block other workflows.

**Independent Test**: Can be tested by navigating to `/settings` and verifying theme toggle changes the app appearance and the delete account flow shows a confirmation.

**Acceptance Scenarios**:

1. **Given** a signed-in user, **When** they navigate to settings, **Then** they see theme selection options (light, dark, system) and account management section.
2. **Given** the settings page, **When** the user selects a different theme, **Then** the application appearance changes immediately and the preference persists across sessions.
3. **Given** the settings page, **When** the user clicks "Delete Account", **Then** a confirmation dialog appears before any action is taken.

---

### User Story 8 - Landing Page (Priority: P3)

A visitor (not signed in) sees a marketing landing page with a hero section, feature highlights, and call-to-action buttons to sign in or register.

**Why this priority**: The landing page is important for user acquisition but is static content with no complex logic, making it straightforward to migrate.

**Independent Test**: Can be tested by visiting the root URL without being signed in and verifying the hero section, feature highlights, and CTA buttons render and link correctly.

**Acceptance Scenarios**:

1. **Given** a visitor (not signed in), **When** they visit the root URL, **Then** they see a hero section with tagline, feature highlights, and CTA buttons.
2. **Given** the landing page, **When** the visitor clicks "Sign In", **Then** they are navigated to the Clerk sign-in page.
3. **Given** the landing page, **When** the visitor clicks "Register", **Then** they are navigated to the Clerk sign-up page.
4. **Given** the landing page on mobile, **When** the page renders, **Then** all sections are responsive and readable.

---

### User Story 9 - Not Found Page (Priority: P3)

Any user who navigates to a non-existent URL sees a friendly 404 page with a link back to the home page.

**Why this priority**: Error handling for invalid routes. Low complexity but necessary for a complete application.

**Independent Test**: Can be tested by navigating to any invalid URL and verifying the 404 page renders with a home link.

**Acceptance Scenarios**:

1. **Given** any user, **When** they navigate to a URL that does not match any route, **Then** they see a 404 page with a message and a link to return home.

---

### User Story 10 - Internationalization in Polish (Priority: P2)

All user-facing text in the application is displayed in Polish using translation keys, not hardcoded strings.

**Why this priority**: The application targets a Polish-speaking audience. All migrated screens must preserve the existing Polish translations.

**Independent Test**: Can be tested by navigating through all pages and verifying that all visible text matches the Polish translations defined in the translation file.

**Acceptance Scenarios**:

1. **Given** any page in the application, **When** it renders, **Then** all user-facing labels, messages, and headings are displayed in Polish via the i18n system.
2. **Given** the translation file, **When** all demo app translation keys are reviewed, **Then** every key used in the demo app has a corresponding entry in the platform-web translation file.

---

### Edge Cases

- What happens when a user navigates directly to a deep URL (e.g., `/projects/abc123`) without being signed in? They should be redirected to sign-in by Clerk middleware.
- What happens when the project ID or visualization ID in the URL does not match any mock data? An empty state or appropriate fallback should be shown.
- What happens when the user uploads a file in an unsupported format in the workspace? The upload should be rejected with a user-friendly message.
- What happens when the user resizes their browser between mobile and desktop breakpoints? The layout should adapt fluidly without layout breaks.
- What happens when theme preference is set to "system" and the OS changes between light and dark mode? The app should follow the system preference in real time.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST render an authenticated application shell with navbar, sidebar, and footer for all app-area pages.
- **FR-002**: System MUST display responsive navigation that adapts between desktop (sidebar + navbar) and mobile (hamburger menu) layouts.
- **FR-003**: System MUST provide a dashboard page showing summary statistics, quick actions, and recent projects using mock data.
- **FR-004**: System MUST provide a projects list page with create, rename, and delete operations using mock data and dialog-based forms.
- **FR-005**: System MUST provide a project detail page showing visualizations within a project using mock data.
- **FR-006**: System MUST provide a workspace page with a two-panel layout (form + preview) supporting generation mode toggle (photo/scratch), form inputs (style, palette, room type, prompt, photo upload), mock generation simulation, and iteration carousel.
- **FR-007**: System MUST provide a credits page displaying credit packages with pricing, balance, and purchase simulation.
- **FR-008**: System MUST provide a settings page with theme selection (light/dark/system) and account management actions.
- **FR-009**: System MUST provide a landing page with hero section, feature highlights, and CTA buttons for unauthenticated visitors.
- **FR-010**: System MUST provide a 404 not-found page for unmatched routes.
- **FR-011**: System MUST display all user-facing text in Polish using the i18n translation system, migrating all existing translation keys from the demo app.
- **FR-012**: System MUST preserve visual parity with the demo app — spacing, typography, colors, component sizes, hierarchy, and responsive behavior must match.
- **FR-013**: System MUST use Clerk authentication for route protection and user identity (replacing mock auth from the demo app).
- **FR-014**: System MUST use the existing theme integration for theme persistence and switching.
- **FR-015**: System MUST support file uploads in the workspace for room photos (.jpg, .jpeg, .png, .webp, .avif, .heic) with drag-and-drop and preview.
- **FR-016**: System MUST use mock data for all data-driven features (projects, visualizations, credits, dashboard stats) — no real API integration in this scope.
- **FR-017**: System MUST maintain responsive design across mobile, tablet, and desktop viewports.
- **FR-018**: System MUST show toast notifications for user actions (e.g., credit purchase, errors) using a single toast implementation.

### Key Entities

- **Project**: Represents a user's interior design project. Attributes: name, creation date, modification date, visualization count.
- **Visualization**: A single design output within a project. Attributes: name, iteration count, latest date, optional thumbnail.
- **Iteration**: A single generation result within a visualization. Attributes: label, whether it is the original.
- **Credit Package**: A purchasable bundle of credits. Attributes: name, credit amount, price, popularity flag.
- **User Statistics**: Aggregated dashboard data. Attributes: project count, visualization count, credit balance.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All 9 pages from the demo app (landing, dashboard, projects, project detail, workspace, credits, settings, auth redirect to Clerk, not-found) are accessible and functional in the platform-web app.
- **SC-002**: Side-by-side visual comparison of each page between demo and platform-web shows no unintended differences in spacing, typography, colors, component sizes, or responsive behavior at mobile (375px), tablet (768px), and desktop (1440px) widths.
- **SC-003**: All Polish translation keys from the demo app are present and correctly rendered in the platform-web app.
- **SC-004**: Users can navigate between all pages without encountering broken links or routing errors.
- **SC-005**: Theme switching between light, dark, and system modes works correctly and persists across page reloads.
- **SC-006**: The workspace generation simulation completes and displays iteration results identically to the demo app behavior.
- **SC-007**: All dialog-based interactions (create project, delete confirmation, visualization creation) function correctly with mock data.
- **SC-008**: The application passes accessibility checks at the same level as the demo app (no regressions in keyboard navigation, focus management, or screen reader support).

## Assumptions

- Authentication pages (sign-in, sign-up) are already handled by Clerk in platform-web and do not need visual migration from the demo app's mock auth forms.
- The existing platform-web root layout, Clerk provider, theme provider, and i18n setup are functional and will be reused as-is.
- Mock data structures will be defined inline or in module-level constants, matching the demo app's patterns. No mock API server is needed.
- Framer Motion animations from the demo app will be preserved where they exist but are not a hard requirement if they cause complexity — visual parity focuses on static layout and interactive states.
- The `@repo/ui` package already contains most shadcn/ui primitives needed. Any missing components will be added to `@repo/ui` during migration.
- API integration, real data fetching, and backend connectivity are explicitly out of scope and will be addressed in a subsequent feature.

## Scope Boundaries

**In scope**:

- All pages and their UI from frontend-demo
- Navigation shell (navbar, sidebar, footer)
- Mock data and simulated interactions
- Polish translations
- Theme support
- Responsive layout
- File upload UI (client-side only, no server upload)

**Out of scope**:

- Real API integration and data fetching
- Real authentication logic (use Clerk as-is)
- Real credit purchase processing
- Real AI generation
- New features not present in the demo app
- Backend changes
- Multi-language support beyond Polish
