# Epic: Credit System and Payments

## US_06 — Viewing Available Credit Packages

- **Story:** As an authenticated user, I want to see available credit packages so I can choose the best offer.
- **Acceptance Criteria (AC):**
  - [ ] The credit packages page is accessible from navigation and from Hard Paywall messaging (when the user tries to generate without credits).
  - [ ] A package list is displayed with: package name, number of credits, and price in PLN.
  - [ ] Packages are configurable without source code changes (env/config definition).
- **Priority:** Must

---

## US_07 — Purchasing a Credit Package (BLIK)

- **Story:** As an authenticated user, I want to buy a credit package via BLIK so I can generate visualizations.
- **Acceptance Criteria (AC):**
  - [ ] The user selects a package and clicks “Buy.”
  - [ ] The system shows order summary: package name, credits count, amount to pay.
  - [ ] The user confirms payment and is redirected to a payment gateway that supports BLIK.
  - [ ] After successful payment, user credit balance is immediately increased by the purchased amount.
  - [ ] After successful payment, the user is redirected back to the app with message: “Payment completed successfully. Credits have been added to your account.”
  - [ ] The transaction is recorded in the system (date, amount, package, status) for accounting purposes.
  - [ ] On payment failure (rejection, timeout, gateway error), the message “Payment failed. Please try again.” is shown and credits are NOT added.
  - [ ] The user can retry payment independently without limits.
  - [ ] Abandoned cart recovery is not implemented (out of scope).
- **Priority:** Must

---

## US_08 — Displaying Credit Balance

- **Story:** As an authenticated user, I want to always see my current credit balance so I know how many visualizations I can still generate.
- **Acceptance Criteria (AC):**
  - [ ] Current credit balance is visible in main navigation (e.g., next to avatar) on every app page.
  - [ ] Balance is shown as an integer (e.g., “12 credits”).
  - [ ] After purchase or credit usage, the balance updates without page refresh.
  - [ ] Balance is also visible in user profile section.
- **Priority:** Must

---

## US_10 — Blocking Generation Without Credits (Hard Paywall)

- **Story:** As a user without credits, I want clear information that I need to purchase credits so I understand why I cannot generate visualizations.
- **Acceptance Criteria (AC):**
  - [ ] Attempting to generate at 0 credits blocks the operation (request is not sent to AI API).
  - [ ] Message shown: “No credits available. Buy a package to generate visualizations.” with CTA button “Buy credits” that navigates to purchase page.
  - [ ] “Generate” button is disabled when balance = 0, with tooltip: “Requires at least 1 credit.”
- **Priority:** Must
