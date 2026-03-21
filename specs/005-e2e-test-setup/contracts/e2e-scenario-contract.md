# Contract: E2E Scenario Definition

## Purpose

Define the required structure and quality bar for adding new e2e API scenarios in `platform-api`.

## Scenario Metadata Contract

Each scenario MUST declare:

- `scenarioId`: unique, stable identifier (`<module>-<behavior>-<variant>`)
- `module`: owning domain module
- `priority`: `P1`, `P2`, or `P3`
- `tags`: list of execution tags (for targeted runs)

## Scenario Structure Contract

Each scenario MUST include:

1. Preconditions

- Data/setup assumptions
- Auth context assumptions
- Isolation/cleanup expectations

2. Action

- Endpoint/method under test
- Input payload or query

3. Assertions

- Status code assertions
- Response shape/value assertions
- Side effect assertions when applicable

## Determinism Contract

- Scenario MUST be independent from execution order.
- Scenario MUST clean up owned side effects (directly or via shared cleanup helper).
- Scenario MUST avoid dependency on wall-clock timing unless explicitly controlled.

## Error Path Contract

When relevant, scenario set MUST include at least one negative-path case covering:

- Authentication/authorization failure, or
- Validation/business-rule failure

## Definition of Done for New Scenario

- Scenario passes in targeted profile.
- Scenario passes in full suite profile.
- Scenario uses shared utility helpers when applicable.
- Scenario includes readable title and diagnostic assertion messages.
