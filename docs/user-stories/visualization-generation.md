# Epic: Visualization Generation

## US_16 — Visualization Generation Form (Mode Selection)

- **Story:** As a user with credits, I want to choose a generation mode in a single-step form so I can quickly match the process to my needs.
- **Acceptance Criteria (AC):**
  - [ ] Generation form is single-step — all fields (mode, configuration, uploads) are displayed in one view.
  - [ ] At the top of the form, user selects mode: “From photo” (existing interior/raw space) or “From scratch” (text description/inspiration).
  - [ ] “From photo” mode is selected by default.
  - [ ] Mode selection controls conditional fields:
    - “From photo”: room photo upload field is shown (required). Open prompt text field is optional.
    - “From scratch”: room photo upload field is hidden. Open prompt text field becomes required (main interior vision description).
  - [ ] Shared fields for both modes (interior style, color palette, room type, furniture/element upload) are always visible.
  - [ ] Switching mode dynamically shows/hides conditional fields without page reload.
- **Priority:** Must

---

## US_17 — Room Photo Upload ("From Photo" Mode)

- **Story:** As a user with credits in “From photo” mode, I want to upload my room photo so AI can generate a visualization based on it.
- **Acceptance Criteria (AC):**
  - [ ] Room photo upload field is required in “From photo” mode.
  - [ ] Supported file formats: JPG, PNG, WEBP, AVIF.
  - [ ] HEIC files (common on Apple devices) are automatically converted client-side to a supported format.
  - [ ] Maximum file size is limited (configurable). Exceeding limit shows a file-too-large message with allowed max size.
  - [ ] Unsupported format shows an unsupported-format message with list of allowed formats.
  - [ ] Format and size validation is client-side (before server upload) — NFR-03.
  - [ ] Uploaded file preview (thumbnail) is displayed.
  - [ ] User can remove uploaded photo and upload another one.
- **Priority:** Must

---

## US_18 — Visualization Configuration Form

- **Story:** As a user with credits, I want to fill in a configuration form (style, color palette) so I can precisely define my interior vision.
- **Acceptance Criteria (AC):**
  - [ ] Form includes predefined options (dropdown/tiles):
    - Interior style (e.g., Scandinavian, Industrial, Minimalist, Classic, Boho, Modern — configurable list).
    - Color palette (e.g., Light / Dark / Warm / Cool / Pastel — configurable list).
    - Room type (e.g., Living room, Bedroom, Kitchen, Bathroom, Office — configurable list).
  - [ ] “Interior style” and “Room type” are required. Missing selection shows message: “This field is required.”
  - [ ] “Color palette” is optional.
  - [ ] Open prompt text field is available with configurable character limit. Exceeding limit shows validation message. Requiredness depends on selected generation mode (see US_16).
  - [ ] Form is part of single-step generation view (see US_16), shared for both modes.
- **Priority:** Must

---

## US_19 — Uploading Furniture and Element Photos

- **Story:** As a user with credits, I want to upload photos of my furniture or decor elements so AI can include them in the visualization.
- **Acceptance Criteria (AC):**
  - [ ] Furniture/element photo upload field is optional and available in both generation modes.
  - [ ] User can upload multiple files (maximum count is configurable).
  - [ ] Supported formats: JPG, PNG, WEBP, AVIF. HEIC conversion is handled client-side.
  - [ ] Maximum size per file is limited (validation same as US_17).
  - [ ] User can paste image from clipboard (screenshot) instead of selecting file from disk.
  - [ ] Uploaded photos are displayed as thumbnails with option to remove each file.
  - [ ] Format and size validation is client-side (before server upload).
- **Priority:** Must

---

## US_20 — Generating a Visualization (Submitting Request)

- **Story:** As a user with credits, I want to submit the form and generate a visualization so I can see an interior design proposal.
- **Acceptance Criteria (AC):**
  - [ ] “Generate” button is enabled only when: credit balance ≥ 1 AND required form fields are filled.
  - [ ] On click, client-side form validation runs. If validation fails, generation does not start and invalid fields are marked.
  - [ ] On successful validation, system performs: deduct 1 credit from balance → send request to backend → backend calls AI model API (OpenRouter) with proper prompt and data.
  - [ ] Credit deduction happens before request is sent to AI (pessimistic approach).
  - [ ] On AI API error (timeout, 5xx, model error), user sees message: “An error occurred while generating the visualization. Please try again or contact us.” Credit is NOT refunded in MVP.
  - [ ] Generated image is saved in storage and linked to user visualization as first iteration.
  - [ ] In project context, a new visualization is created with first iteration (output image), form parameters, system prompt, and input photos. If generation happens in context of existing visualization (editing), a new iteration record is created (see US_24).
- **Priority:** Must

---

## US_21 — Loading State During Visualization Generation

- **Story:** As a user, I want to see a loading state during generation so I know the process is running and the app is not frozen.
- **Acceptance Criteria (AC):**
  - [ ] After generation submission, right panel (visualization panel) shows loading state (spinner/progress/animation). Left form remains visible.
  - [ ] Loading state includes message: “Your visualization is being generated. This may take up to a few minutes.”
  - [ ] User is NOT redirected to another page — loading and result are shown in-place in right panel.
  - [ ] App does NOT set client-side timeout for generation request (supports long AI response times) — NFR-02.
  - [ ] User cannot submit another generation request until current request finishes (“Generate” button is blocked).
  - [ ] On success, generated visualization (first iteration) appears automatically in right panel and left form switches from creation mode to edit mode.
  - [ ] On error, loading state is replaced by error message from US_20.
- **Priority:** Must

---

## US_22 — Displaying Generated Visualization (Split-Screen Layout)

- **Story:** As a user, I want to see the generated visualization next to the form so I can immediately evaluate the result and continue iterative work without changing views.
- **Acceptance Criteria (AC):**
  - [ ] Generated visualization is displayed in right panel of split-screen layout, next to the left-panel form.
  - [ ] User is NOT redirected to a separate page/view — visualization appears in-place.
  - [ ] Result image is displayed at full available resolution within right panel (responsive scaling).
  - [ ] After generation, creation form in left panel automatically switches to edit form (see US_24), enabling immediate iteration.
  - [ ] A thumbnail strip with previous visualization versions is shown below main visualization (see US_23).
  - [ ] If visualization was generated in “From photo” mode, the first thumbnail in the strip shows original input photo labeled “Original”.
  - [ ] Clicking a thumbnail loads that version as main visualization and updates edit form context.
  - [ ] Parameters used for generation (style, colors, prompt) are displayed (e.g., collapsible section below visualization or tooltip).
- **Priority:** Must
