# Epic: Iterative Workflow (Visualization Editing)

## US_23 — Browsing Visualization Iteration History (Thumbnail Strip)

- **Story:** As an authenticated user, I want to browse iteration history of a visualization directly below the current image so I can compare versions and choose the best one.
- **Acceptance Criteria (AC):**
  - [ ] A horizontal thumbnail strip is displayed below the main image in right panel with all iterations of the **current visualization** (not the whole project).
  - [ ] If generation mode is “From photo,” first thumbnail in the strip shows original input photo with clear “Original” label.
  - [ ] Each thumbnail displays: mini image and iteration number/label.
  - [ ] Thumbnails are sorted chronologically (oldest/original on the left to newest on the right).
  - [ ] Clicking a thumbnail loads that iteration as main image in right panel and updates edit form context in left panel.
  - [ ] Currently displayed iteration is visually highlighted in the strip (e.g., border/highlight).
  - [ ] User can select any previous iteration as the starting point for a new iteration.
- **Priority:** Must

---

## US_24 — Editing Existing Visualization (New Iteration)

- **Story:** As a user with credits, I want to edit an existing visualization using an edit form shown next to the visualization so I can iteratively refine the interior design.
- **Acceptance Criteria (AC):**
  - [ ] After first iteration is generated, creation form in left panel automatically switches to dedicated edit form (without clicking “Edit”).
  - [ ] When opening an existing visualization from project view, left panel immediately shows edit form and right panel shows latest iteration.
  - [ ] Edit form is SEPARATE from creation form and includes only fields logically relevant for modifying an existing visualization:
    - Text prompt field describing desired changes (required, configurable character limit).
    - Option to upload new furniture/element photos (validation same as US_19).
    - Option to change selected style parameters (style, color palette).
  - [ ] Edit form does NOT include room photo upload field (room shape is preserved from original visualization).
  - [ ] System prompt instructs AI model to preserve room shape and wall layout (minor differences acceptable).
  - [ ] Each iteration consumes 1 credit (same balance validation as US_20).
  - [ ] Generated **new iteration** replaces previous one in main right-panel view; previous iteration moves to thumbnail strip below.
  - [ ] Thumbnail strip under visualization is automatically updated with new iteration.
  - [ ] User can click any thumbnail to load previous iteration and start a new iteration from it.
- **Priority:** Must
