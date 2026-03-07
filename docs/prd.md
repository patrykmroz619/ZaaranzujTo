# PRD: ZaaranżujTo

## 1. Product Vision

"ZaaranżujTo" (zaaranzujto.pl) is a B2C web application powered by multimodal AI models that allows users to quickly and intuitively generate interior design visualizations. A user can generate a room design based on a photo of an existing interior, a raw/empty space, or a plain text description, and then iteratively refine it — changing the style, furniture, color palette, and other elements. The application is monetized through a paid credit system (Hard Paywall).

---

## 2. Target Users

**Primary segment (MVP):** Individual (B2C) customers planning a renovation, redesign, or refresh of their apartment/home. People looking for fast and affordable visual inspiration without engaging a professional interior designer.

---

## 3. User Stories and Acceptance Criteria

Detailed user stories and acceptance criteria are maintained in dedicated files under `docs/user-stories/`.

### 3.1 References

- [User Stories Index](./user-stories/README.md)
- [Authentication and Account Management](./user-stories/authentication-and-account-management.md)
- [Credit System and Payments](./user-stories/credit-system-and-payments.md)
- [Project Management](./user-stories/project-management.md)
- [Visualization Generation](./user-stories/visualization-generation.md)
- [Iterative Workflow (Visualization Editing)](./user-stories/iterative-workflow-visualization-editing.md)
- [Profile and Settings](./user-stories/profile-and-settings.md)
- [Security and Data Protection](./user-stories/security-and-data-protection.md)
- [File Storage](./user-stories/file-storage.md)
- [Contact and Terms](./user-stories/contact-and-terms.md)

---

## 4. Non-Functional Requirements

### 4.1 Performance

**NFR-01 — UI Response Time**
Standard CRUD operations (projects, profile) should respond smoothly, without noticeable delays.

**NFR-02 — Visualization Generation**
Generation time depends on the external AI model API. The application must handle long wait times without a client-side timeout, displaying a loading state.

**NFR-03 — File Upload**
File format and size validation performed client-side (before sending to the server) to minimize unnecessary requests.

### 4.2 Security

**NFR-04 — Authorization**
Full authentication and authorization handled by Clerk. No project/visualization data is accessible without being logged in.

**NFR-05 — Data Isolation**
The user has access only to their own projects and visualizations.

**NFR-06 — API Keys**
Keys for external services (OpenRouter, payment gateway, Cloudflare R2) stored exclusively on the backend, never exposed to the frontend.

### 4.3 Scalability and Maintainability

**NFR-07 — Configurable Packages**
The definition of credit packages (price, quantity) must be modifiable without changing source code (env / config).

**NFR-08 — Internationalization**
i18n architecture integrated from the start, with all UI strings extracted to translation files.

**NFR-09 — Storage**
Generated images stored in Cloudflare R2. In the MVP there is no automatic data retention/deletion policy.

---

## 5. Information Architecture and Flows

### 5.1 Data Model (Conceptual)

```
User (Clerk)
 └── Project (name, creation date)
      └── Visualization (room/space name, generation mode, original input photo)
           └── Iteration (output image, form parameters, prompt, furniture/element photos, iteration number)
```

**Key distinction:**

- A **Visualization** represents one room or space within a project (e.g., living room, kitchen, bathroom). It holds the generation mode and (if applicable) the original room photo.
- An **Iteration** is a single AI-generated image within a visualization. The first iteration is produced by the creation form; subsequent iterations are produced by the edit form. Each iteration consumes 1 credit.

### 5.2 Main User Flows

**Flow 1: First Visit (Happy Path)**

1. Registration / Login (Clerk)
2. Dashboard → Empty State → CTA "Create your first project"
3. Redirect to credit purchase (Hard Paywall)
4. Purchase a credit package (BLIK)
5. Return to project creation

**Flow 2: Generating a New Visualization (First Iteration)**

1. Create a new project (or select an existing one)
2. In the project detail view, click "New visualization"
3. The workspace opens in a split-screen layout: creation form on the left, visualization panel on the right (initially empty / placeholder)
4. Choose mode: from photo / from scratch
5. (Optional) Upload a photo of the room
6. Fill out the configuration form (style, colors)
7. (Optional) Upload photos of furniture/elements
8. (Optional) Additional text prompt
9. Confirm → Deduct 1 credit → Loading state shown in the right panel
10. First iteration appears in the right panel (no page redirect); the creation form transitions to the edit form

**Flow 3: Iterative Work (Subsequent Iterations)**

1. Open an existing visualization from the project detail view → split-screen layout loads with the latest iteration in the right panel and the edit form in the left panel
2. (Alternatively) After generating the first iteration (Flow 2), the edit form is already displayed
3. Modify parameters in the edit form: change selected style options, add a text prompt describing changes, upload new furniture/elements
4. Confirm → Deduct 1 credit → Loading state shown in the right panel
5. New iteration replaces the previous one as the main image in the right panel; the previous iteration moves to the thumbnail strip below
6. Thumbnail strip below the main image shows all iterations of this visualization and the original input photo (if applicable)

### 5.3 Workspace Layout (Split-Screen)

The primary workspace for generating and editing visualizations uses a **split-screen (two-panel) layout**:

- **Left panel — Form:** Displays the creation form (first iteration of a new visualization) or the edit form (subsequent iterations). The form transitions automatically from creation mode to edit mode after the first iteration is generated.
- **Right panel — Visualization:** Displays the current (latest) iteration of the visualization, or a loading state while generation is in progress. Before the first iteration, this panel shows a placeholder / empty state.
- **Thumbnail strip (below main image):** Displays a horizontal row of clickable thumbnails for all iterations of the **current visualization**. If the generation mode was "From photo", the first thumbnail shows the original input photo (labeled, e.g., "Original"). Clicking on a thumbnail loads that iteration as the main image and sets it as the context for the edit form.

This layout ensures the user never leaves the workspace during generation or iteration — everything happens in-place.

**Note:** The split-screen workspace is scoped to a **single visualization** (one room/space). To switch to a different visualization (e.g., from kitchen to bathroom), the user navigates back to the project detail view.

---

## 6. MVP Scope — Summary (In Scope / Out of Scope)

### In Scope (MVP)

- Registration and login (Clerk) with account management widget
- Credit purchase (BLIK, Hard Paywall, configurable packages)
- Visualization generation: from photo mode and from scratch mode
- Configuration form with predefined options + optional prompt
- Upload of room and furniture photos (JPG, PNG, WEBP, AVIF, HEIC conversion, size validation)
- Iterative work with a dedicated edit form (new iterations within a visualization)
- Project management (CRUD) with multiple visualizations per project
- Iteration history within each visualization (thumbnail strip)
- Project detail view showing all visualizations with latest-iteration thumbnails
- User profile (balance, account deletion)
- Dark/Light mode
- Interface in Polish (with integrated i18n library)
- Empty State on the dashboard
- Split-screen workspace layout (form + visualization side by side)
- In-place loading state during generation (no page redirect)
- Image storage in Cloudflare R2
- Contact: mailto link in the footer / terms of service

### Out of Scope (Post-MVP)

- Transaction history / payment history view
- Freemium model / free starter credits
- One free generation retry
- Watermark on generated images
- Upscaling / export at higher resolution
- Pre-processing of input photos (cropping, brightening, aspect ratio optimization)
- Abandoned cart recovery
- Landing Page with a gallery of capabilities
- Advanced analytics and KPI metrics
- Retention policy / automatic deletion of old images
- Additional language versions (EN and others)
- In-app bug reporting / ticketing system
- Legal aspects / ToS / GDPR (to be implemented as the product grows)
