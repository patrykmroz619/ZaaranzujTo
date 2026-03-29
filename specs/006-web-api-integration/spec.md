# Feature Specification: Web-API Integration & MVP Gap Analysis

**Feature Branch**: `006-web-api-integration`
**Created**: 2026-03-29
**Status**: Draft
**Input**: User description: "Integration of the platform-web app with already implemented backend endpoints in the platform-api app. Plan whole integration and preparation of new document with missing backend endpoints and plan for further development to complete whole app described in docs/prd.md."

## User Scenarios & Testing _(mandatory)_

### User Story 1 — Browse and Manage Projects via Live Backend (Priority: P1)

An authenticated user navigates to the dashboard and projects page. Instead of seeing hardcoded mock data, they see their real projects fetched from the backend API. They can create a new project, rename it, delete it, and see the project list update in real time. The dashboard shows accurate statistics (total projects, total visualizations) and recent projects pulled from the backend.

**Why this priority**: Projects are the foundational entity — every other feature (visualizations, iterations, credits) depends on the user having real, persisted projects. Without this integration, no other feature can function end-to-end.

**Independent Test**: Can be fully tested by signing in, creating a project, refreshing the page, and verifying the project persists. Delivers real data persistence for the first time.

**Acceptance Scenarios**:

1. **Given** an authenticated user with no projects, **When** they visit the dashboard, **Then** they see the empty state with a "Create your first project" call-to-action (data from the projects listing endpoint returning an empty list).
2. **Given** an authenticated user, **When** they create a new project via the dialog, **Then** the project is persisted to the backend and appears in the project list without a page refresh.
3. **Given** an authenticated user with existing projects, **When** they visit the dashboard, **Then** they see their real projects with correct names, creation dates, and visualization counts fetched from the backend.
4. **Given** an authenticated user, **When** they rename a project, **Then** the name updates on the backend and reflects immediately in the UI.
5. **Given** an authenticated user, **When** they delete a project and confirm, **Then** the project is removed on the backend and disappears from the list.
6. **Given** an authenticated user visiting the dashboard, **When** the page loads, **Then** recent projects and statistics (project count, visualization count) are derived from real backend data.

---

### User Story 2 — View Visualizations and Iteration History from Backend (Priority: P1)

An authenticated user navigates to a project detail page and sees real visualizations fetched from the backend. Each visualization shows the latest iteration thumbnail, name, iteration count, and date. Clicking a visualization opens the workspace where the iteration history (thumbnail strip) displays real iterations fetched from the API, with images loaded via signed download URLs.

**Why this priority**: Visualizations are the core product — users must see their real generated designs. This also validates the storage and download URL flow end-to-end.

**Independent Test**: Can be tested by navigating to a project with existing visualizations and verifying thumbnails load from the backend with real images.

**Acceptance Scenarios**:

1. **Given** a project with visualizations, **When** the user opens the project detail page, **Then** all visualizations are listed with correct thumbnails, names, and iteration counts from the backend.
2. **Given** a visualization with multiple iterations, **When** the user opens the workspace, **Then** the thumbnail strip shows all iterations with images loaded through signed download URLs from the storage service.
3. **Given** a visualization, **When** the user clicks a thumbnail in the iteration strip, **Then** that iteration's image loads as the main view.
4. **Given** a project with no visualizations, **When** the user views the project detail page, **Then** an empty state is shown with a "New visualization" call-to-action.

---

### User Story 3 — Generate Visualizations via Live AI Backend (Priority: P1)

An authenticated user with credits opens the workspace, fills out the generation form (mode, style, color palette, room type, optional prompt, optional photos), and submits. The request is sent to the backend which orchestrates credit reservation, AI generation, and asset storage. The user sees a loading state, then the generated image appears in the right panel. The form transitions from creation mode to edit mode.

**Why this priority**: This is the core value proposition of the product — AI-powered interior design generation. Without this, the app delivers no unique value.

**Independent Test**: Can be tested by creating a visualization, filling the form, submitting, and verifying a generated image appears with 1 credit deducted.

**Acceptance Scenarios**:

1. **Given** an authenticated user with at least 1 credit, **When** they fill the creation form and submit, **Then** the request is sent to the backend with form data and uploaded files as a multipart request.
2. **Given** a generation request is in progress, **When** the backend is processing, **Then** the right panel shows a loading state and the "Generate" button is disabled.
3. **Given** a successful generation, **When** the result is returned, **Then** the generated image appears in the right panel, the credit balance updates, and the form transitions to edit mode.
4. **Given** a generation failure, **When** the backend returns an error, **Then** an appropriate error message is shown to the user in Polish.
5. **Given** an authenticated user with 0 credits, **When** they attempt to generate, **Then** the "Generate" button is disabled with a tooltip indicating insufficient credits, and a link to the credits page is shown.

---

### User Story 4 — Iterate on Existing Visualizations (Priority: P1)

An authenticated user opens an existing visualization in the workspace. The edit form is displayed with options to modify style, add a text prompt, and upload new furniture/element photos. Submitting creates a new iteration. The new image replaces the main view, and the previous iteration moves to the thumbnail strip.

**Why this priority**: Iterative refinement is the second core value proposition — users generate, then tweak until satisfied. Without iteration support, the product is a one-shot generator.

**Independent Test**: Can be tested by opening a visualization with at least one iteration, modifying parameters, submitting, and verifying a new iteration appears.

**Acceptance Scenarios**:

1. **Given** a visualization with existing iterations, **When** the user opens the workspace, **Then** the latest iteration is displayed in the right panel and the edit form is shown in the left panel.
2. **Given** the edit form is displayed, **When** the user modifies parameters and submits, **Then** a new iteration is created on the backend referencing the current iteration as the base.
3. **Given** a new iteration is successfully generated, **When** the result appears, **Then** it becomes the main image and the previous iteration is added to the thumbnail strip.
4. **Given** the user clicks a previous iteration thumbnail, **When** they submit a new generation, **Then** the new iteration uses that selected iteration as the base.

---

### User Story 5 — View Credit Balance and Packages from Backend (Priority: P2)

An authenticated user sees their real credit balance in the navigation header (already partially working via the profile endpoint). They can navigate to the credits page to see available credit packages fetched from the backend with real pricing, names, and credit amounts.

**Why this priority**: Credits are essential for the paywall model, but the balance display partially works already. Package listing completes the credits view for the user to understand what they can purchase.

**Independent Test**: Can be tested by navigating to the credits page and verifying packages match backend configuration.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they view any page, **Then** the credit balance in the header reflects the real balance from the profile endpoint (already working).
2. **Given** an authenticated user, **When** they visit the credits page, **Then** available packages are fetched from the backend displaying name, credit amount, and price.
3. **Given** the backend returns no active packages, **When** the user visits the credits page, **Then** an appropriate message is displayed.

---

### User Story 6 — Manage Profile and Settings via Backend (Priority: P2)

An authenticated user navigates to settings and can switch between light, dark, and system themes. The theme preference is persisted to the backend so it survives across devices and sessions. The settings page also displays account management options.

**Why this priority**: Theme persistence improves user experience across sessions. Settings integration completes the profile management flow.

**Independent Test**: Can be tested by changing theme in settings, refreshing, and verifying the theme persists.

**Acceptance Scenarios**:

1. **Given** an authenticated user, **When** they change the theme in settings, **Then** the preference is saved to the backend with the selected theme value.
2. **Given** a user with a saved theme preference, **When** they sign in on a new device or session, **Then** the saved theme is applied automatically.
3. **Given** a user on the settings page, **When** account management actions are available, **Then** the Clerk account portal widget is accessible for password and email changes.

---

### User Story 7 — MVP Gap Analysis Document (Priority: P2)

A development team member can reference a comprehensive document in the `docs/` directory that catalogs: (a) all missing backend endpoints required to complete the MVP, (b) all frontend-backend integration gaps, and (c) a prioritized development roadmap for completing the full application as described in the PRD.

**Why this priority**: Without a clear gap analysis, the team cannot plan the remaining work effectively. This document enables informed sprint planning and resource allocation.

**Independent Test**: Can be tested by reviewing the document against the PRD and verifying all MVP features are accounted for with clear status (done, in-progress, missing).

**Acceptance Scenarios**:

1. **Given** the development team, **When** they open the gap analysis document, **Then** they find a complete mapping of PRD features to implementation status (implemented, partially implemented, not started).
2. **Given** the document, **When** reviewing missing backend endpoints, **Then** each missing endpoint is listed with its purpose, required contract, and priority.
3. **Given** the document, **When** reviewing the development roadmap, **Then** work items are ordered by dependency and priority with clear descriptions of what each delivers.

---

### Edge Cases

- What happens when the backend API is unreachable? The frontend displays user-friendly error messages and allows retry, not crash or show raw error data.
- What happens when a user's session token expires mid-operation? The app redirects to sign-in gracefully without losing unsaved form state where possible.
- What happens when a file upload exceeds size limits? Client-side validation catches this before the request is sent; if the server rejects it, a clear error message is shown.
- What happens when a generation request takes longer than expected? The UI maintains the loading state indefinitely (no client-side timeout) as per PRD requirements.
- What happens when two browser tabs attempt simultaneous generation for the same visualization? The backend returns a conflict error; the frontend displays an appropriate message.
- What happens when a project or visualization is deleted while another tab has it open? The frontend handles "not found" responses gracefully with a redirect or informational state.

## Requirements _(mandatory)_

### Functional Requirements

**Frontend-Backend Integration:**

- **FR-001**: System MUST replace all mock data in the projects view with real data fetched from the backend and support create, update, and delete operations via the corresponding API endpoints.
- **FR-002**: System MUST replace all mock data in the project detail view with real visualizations fetched from the backend, displaying latest iteration thumbnails via signed download URLs.
- **FR-003**: System MUST replace all mock data in the workspace view with real iteration data fetched from the backend.
- **FR-004**: System MUST connect the workspace generation form to the backend's iteration creation endpoint with multipart form data for file uploads (input photo, reference photos) and form fields (style, colors, room type, prompt).
- **FR-005**: System MUST replace mock data in the credits page with real packages fetched from the backend.
- **FR-006**: System MUST persist theme preference changes to the backend and restore the saved theme on subsequent sessions.
- **FR-007**: System MUST replace mock dashboard statistics and recent projects with data derived from real backend responses.
- **FR-008**: System MUST load visualization images through signed download URLs obtained from the storage service.
- **FR-009**: System MUST disable the "Generate" button and show appropriate messaging when the user's credit balance is 0.
- **FR-010**: System MUST show a loading state in the workspace right panel during generation and prevent duplicate submissions.
- **FR-011**: System MUST transition the workspace form from creation mode to edit mode after the first iteration is successfully generated.
- **FR-012**: System MUST support selecting a previous iteration as the base for a new generation.

**Data Fetching Patterns:**

- **FR-013**: System MUST use a consistent data fetching and caching strategy for all backend data to provide loading states and error handling across views.
- **FR-014**: System MUST invalidate and refetch relevant cached data after mutation operations (create, update, delete) to keep the UI in sync with the backend.
- **FR-015**: System MUST handle API errors gracefully, displaying user-friendly messages in Polish for common error scenarios (authentication failure, insufficient credits, not found, conflicts, server errors).

**Gap Analysis Document:**

- **FR-016**: A document MUST be created in the `docs/` directory cataloging all missing backend endpoints, frontend integration gaps, and a prioritized development roadmap for completing the MVP.
- **FR-017**: The gap analysis document MUST map every PRD feature and user story to its current implementation status (complete, partial, not started) with specific details about what is missing.

### Key Entities

- **Project**: User-owned container for visualizations. Attributes: name, visualization count, timestamps. Full CRUD supported.
- **Visualization**: Represents one room or space within a project. Attributes: name, mode (from photo or from scratch), input photo reference, iteration history.
- **Iteration**: A single AI-generated image within a visualization. Attributes: sequence number, generation parameters, input and output assets, status. Created via multipart upload.
- **Credit Balance**: User's available credits for generation. Read via profile endpoint, deducted during iteration creation.
- **Credit Package**: Purchasable bundle of credits. Attributes: name, credit amount, price. Listed from backend configuration.
- **File Asset**: Uploaded or generated image stored in cloud storage. Accessed via signed download URLs with expiration.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: All six main views (dashboard, projects, project detail, workspace, credits, settings) display real data from the backend with zero hardcoded mock data remaining in production code paths.
- **SC-002**: Users can complete the full project lifecycle (create project, create visualization, generate iteration, iterate, view history) entirely through the live backend without any mock fallbacks.
- **SC-003**: Users can view their real credit balance on every page and see it update after a generation without requiring a page refresh.
- **SC-004**: Users can view available credit packages with real pricing and credit amounts from the backend configuration.
- **SC-005**: Theme preference changes persist across browser sessions and devices for the same user account.
- **SC-006**: File uploads (room photos, furniture photos) are sent to the backend and stored in cloud storage, with generated images retrievable via signed URLs.
- **SC-007**: Error scenarios (network failure, insufficient credits, expired session, server errors) display user-friendly messages in Polish without exposing technical details.
- **SC-008**: A comprehensive gap analysis document exists in `docs/` that accounts for every MVP feature from the PRD with clear implementation status and a prioritized roadmap for remaining work.
- **SC-009**: The gap analysis document identifies all missing backend endpoints (payments module, full account deletion cascade) with sufficient detail for implementation planning.
