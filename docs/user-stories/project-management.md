# Epic: Project Management

## US_11 — Creating a New Project

- **Story:** As an authenticated user, I want to create a new project so I can organize my visualizations.
- **Acceptance Criteria (AC):**
  - [ ] “New project” option is available on the dashboard (button).
  - [ ] Project creation form requires a name (min/max length is constrained — configurable).
  - [ ] Empty name shows validation message: “Project name is required.”
  - [ ] Exceeding max length shows an appropriate validation message.
  - [ ] After creation, project appears on dashboard list.
  - [ ] Newly created project is empty (0 visualizations) and shows Empty State with CTA “Add first visualization.”
- **Priority:** Must

---

## US_12 — Viewing Project List (Dashboard)

- **Story:** As an authenticated user, I want to see the list of my projects on the dashboard so I can quickly navigate to a selected project.
- **Acceptance Criteria (AC):**
  - [ ] Dashboard displays a list/grid of user projects.
  - [ ] Each project card displays: project name, creation date, modification date, number of visualizations.
  - [ ] List is sorted by newest projects by default.
  - [ ] Clicking a project navigates to project detail view (visualization list for that project).
  - [ ] Data from other users is not visible (data isolation — NFR-05).
- **Priority:** Must

---

## US_12A — Project Detail View (Visualization List)

- **Story:** As an authenticated user, I want to see visualizations inside a selected project so I can navigate to specific rooms.
- **Acceptance Criteria (AC):**
  - [ ] Project detail view displays list/grid of all visualizations in the project.
  - [ ] Each visualization item displays: **latest iteration** thumbnail (not first), visualization name/description, latest iteration date, iteration count.
  - [ ] If visualization has no iterations yet (e.g., interrupted generation), a placeholder is displayed.
  - [ ] Clicking a visualization opens split-screen workspace with latest iteration and edit form.
  - [ ] “New visualization” button is available to create another visualization (e.g., another room) inside the same project.
  - [ ] When project has no visualizations yet, Empty State with CTA “Add first visualization” is displayed.
- **Priority:** Must

---

## US_13 — Editing Project Name

- **Story:** As an authenticated user, I want to edit an existing project name so I can better describe it as work evolves.
- **Acceptance Criteria (AC):**
  - [ ] Name edit option is available in project detail view or dashboard context menu.
  - [ ] Name validation is identical to creation (min and max length).
  - [ ] After save, new name is immediately visible on dashboard and project view.
  - [ ] Canceling edit restores previous name.
- **Priority:** Should

---

## US_14 — Deleting a Project

- **Story:** As an authenticated user, I want to delete a project so I can keep my workspace organized and remove unnecessary data.
- **Acceptance Criteria (AC):**
  - [ ] Delete option is available in project context menu on dashboard or in project detail view.
  - [ ] Before deletion, a confirmation modal is shown: “Are you sure you want to delete project ‘{name}’? All visualizations and their iterations in this project will be permanently deleted.”
  - [ ] After confirmation, project and all related visualizations, iterations, and files are permanently deleted.
  - [ ] After deletion, user is redirected to dashboard and deleted project disappears from list.
  - [ ] Deletion does not refund credits used to generate visualizations in that project.
- **Priority:** Must

---

## US_15 — Empty State on Dashboard

- **Story:** As a newly authenticated user with no projects, I want to see a friendly Empty State so I know how to start using the app.
- **Acceptance Criteria (AC):**
  - [ ] When the user has no projects, dashboard shows dedicated Empty State instead of an empty list.
  - [ ] Empty State includes: illustration/graphic, short message (e.g., “You don’t have any projects yet”), CTA button “Create first project.”
  - [ ] Clicking CTA navigates to new project creation form.
  - [ ] Empty State disappears after first project is created.
- **Priority:** Must
