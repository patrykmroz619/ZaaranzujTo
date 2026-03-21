# Contract: Unit Test Standard for platform-api

## Purpose

Define a consistent standard for module-level unit tests in `platform-api` services.

## File and Naming Contract

- Unit test files SHOULD use `<subject>.spec.ts` naming.
- Test titles MUST describe behavior and expected outcome, not implementation detail.
- Group tests by subject behavior using `describe` blocks.

## Structure Contract

Each unit test SHOULD follow:

1. Arrange

- Build explicit input state and mocks/stubs.

2. Act

- Execute exactly one primary behavior under test.

3. Assert

- Verify observable outputs and interactions.

## Coverage Expectation Contract

Per service subject, tests SHOULD cover:

- Happy path behavior
- Validation or guard path
- At least one business failure path
- Idempotency/retry-sensitive behavior when applicable

## Review Contract

A unit test is review-ready when:

- It is deterministic and independent.
- Assertions are behavior-focused and meaningful.
- Mocks verify critical interactions without overspecifying internals.
- Test names communicate intent clearly.

## Reviewer Criteria (Operational)

Reviewers SHOULD evaluate each new unit test with this pass/fail list:

- Behavior intent is clear from `describe` and `it` names.
- Arrange/Act/Assert structure is readable and complete.
- Happy path and at least one failure/guard path are covered.
- Assertions target externally observable behavior.
- Test remains deterministic under repeated runs.

## Anti-Patterns (Disallowed)

- Asserting private implementation details.
- Shared mutable state across unrelated tests.
- Test cases that only repeat framework behavior with no business assertion.
