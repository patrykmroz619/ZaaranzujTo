# Epic: Authentication and Account Management

## US_01 — Account Registration

- **Story:** As a new user, I want to register in the application so I can access visualization generation features.
- **Acceptance Criteria (AC):**
  - [ ] Registration is handled by Clerk (embedded form or Clerk Hosted Pages).
  - [ ] The user can register with email + password or Google/Apple account (Social Login).
  - [ ] After successful registration, the user is automatically signed in and redirected to the dashboard.
  - [ ] A user profile record is created in the database and linked to the Clerk identifier.
- **Priority:** Must

---

## US_02 — Application Sign In

- **Story:** As a registered user, I want to sign in to the application so I can continue working on my projects.
- **Acceptance Criteria (AC):**
  - [ ] Sign in is handled by Clerk (email + password or Social Login).
  - [ ] After successful sign in, the user is redirected to the dashboard with a list of their projects.
  - [ ] The user session is persisted (no re-login on page refresh), according to Clerk configuration.
- **Priority:** Must

---

## US_03 — Application Sign Out

- **Story:** As an authenticated user, I want to sign out so I can secure my account after finishing work.
- **Acceptance Criteria (AC):**
  - [ ] A sign-out option is available in the profile menu (e.g., avatar/dropdown in navigation).
  - [ ] After clicking “Sign out,” the session is terminated and the user is redirected to the sign-in page.
  - [ ] Accessing a protected route after sign-out redirects to the sign-in page.
- **Priority:** Must

---

## US_04 — Account Data Management

- **Story:** As an authenticated user, I want to manage my personal data so I have control over my profile.
- **Acceptance Criteria (AC):**
  - [ ] Account data management is handled via the built-in Clerk Account Portal widget from profile settings.
  - [ ] The user can change password, email, and avatar via Clerk UI.
  - [ ] Changes in Clerk profile are automatically reflected in the app (e.g., displayed email, avatar).
- **Priority:** Must

---

## US_05 — Account Deletion

- **Story:** As an authenticated user, I want to delete my account to permanently remove my data from the system.
- **Acceptance Criteria (AC):**
  - [ ] Account deletion option is available in profile settings (Clerk Account Portal widget).
  - [ ] After confirmation, the Clerk account is deleted, and related database data (profile, projects, visualizations) is permanently deleted.
  - [ ] Storage files related to the user are deleted.
  - [ ] The user does not need to contact an administrator to delete their account.
- **Priority:** Must
