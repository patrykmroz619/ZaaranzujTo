# User Stories — ZaaranzujTo

This directory contains user stories split by epic.

## Personas

- **New User** — an unauthenticated person visiting the app for the first time.
- **Authenticated User** — a user logged in via Clerk who can manage projects, profile, and payments.
- **User Without Credits** — an authenticated user with a credit balance of 0; cannot generate visualizations (Hard Paywall).
- **User With Credits** — an authenticated user with at least 1 credit; can generate and edit visualizations.

## Epic Files

- [Authentication and Account Management](./authentication-and-account-management.md)
- [Credit System and Payments](./credit-system-and-payments.md)
- [Project Management](./project-management.md)
- [Visualization Generation](./visualization-generation.md)
- [Iterative Workflow (Visualization Editing)](./iterative-workflow-visualization-editing.md)
- [Profile and Settings](./profile-and-settings.md)
- [Security and Data Protection](./security-and-data-protection.md)
- [File Storage](./file-storage.md)
- [Contact and Terms](./contact-and-terms.md)

## Naming Conventions

- **User Story IDs:** `US_XX` format, with uppercase suffix when needed (e.g., `US_12A`).
- **Epic titles:** English, Title Case, using `# Epic: ...` heading pattern.
- **Acceptance criteria label:** Always `Acceptance Criteria (AC)`.
- **Priority values:** `Must`, `Should`, `Could`.
- **Mode names:** `From photo` and `From scratch`.
- **Iteration thumbnail source label:** `Original`.
