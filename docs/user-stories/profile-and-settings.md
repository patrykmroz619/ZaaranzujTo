# Epic: Profile and Settings

## US_25 — Theme Switching (Dark / Light Mode)

- **Story:** As an authenticated user, I want to switch the interface theme between light and dark so I can adapt the app to my visual preferences.
- **Acceptance Criteria (AC):**
  - [ ] Theme toggle is available in profile settings or in main navigation.
  - [ ] Available options: Light, Dark, System (follow operating system preference).
  - [ ] Theme change is immediate (without page reload).
  - [ ] Selected theme is persisted (localStorage/user profile) and applied on future visits.
  - [ ] Default theme on first visit: System.
- **Priority:** Should

---

## US_26 — Polish Interface (i18n)

- **Story:** As a user, I want to use the application in Polish so I can fully understand the interface and messages.
- **Acceptance Criteria (AC):**
  - [ ] All UI elements (buttons, labels, validation messages, error messages, placeholders, tooltips) are translated to Polish.
  - [ ] Translations are extracted into translation files (e.g., JSON), not hard-coded in source.
  - [ ] i18n library is integrated from day one (e.g., next-intl / react-i18next), enabling future language additions without refactor.
  - [ ] In MVP, Polish is the only available language.
  - [ ] Architecture supports future language switcher and additional language versions (out of scope for MVP, but infrastructure-ready).
- **Priority:** Must
