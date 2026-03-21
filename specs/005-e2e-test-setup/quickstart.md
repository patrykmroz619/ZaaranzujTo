# Quickstart: API Test Enablement Foundation

## Prerequisites

- Bun installed (`bun --version`)
- API dependencies installed at repository root (`bun install`)
- Local environment configured for `apps/platform-api` (`.env` values set)
- Non-production database available for test runs

## Start API in Development Mode

```bash
cd apps/platform-api
bun run dev
```

Default local base URL:

```text
http://localhost:3001/api/v1
```

## Run Baseline E2E Suite

```bash
cd apps/platform-api
bun run test:e2e
```

Expected outcome:

- Jest reports scenario-level pass/fail output.
- Baseline smoke scenarios complete without manual setup beyond documented prerequisites.

## Run Targeted E2E Scenario During Development

Use Jest file/test-name filters to speed up iteration.

```bash
cd apps/platform-api
bun run test:e2e -- test/app.e2e-spec.ts
```

Or using script profiles:

```bash
cd apps/platform-api
bun run test:e2e:file test/health.e2e-spec.ts
```

Or with test-name pattern:

```bash
cd apps/platform-api
bun run test:e2e -- -t "health"
```

Or:

```bash
cd apps/platform-api
bun run test:e2e:name "profile-me-unauthorized"
```

## Add a New E2E Scenario (Workflow)

1. Choose owning module and define `scenarioId` following contract.
2. Reuse shared helper(s) for bootstrap/auth/fixtures/cleanup.
3. Implement positive-path assertions first (status + payload).
4. Add at least one negative-path assertion where relevant.
5. Verify targeted run pass, then verify full suite pass.

## Write a Unit Test Using Standard Contract

1. Select a single service behavior.
2. Build clear arrange/act/assert structure.
3. Cover happy path + at least one failure/guard path.
4. Ensure deterministic assertions focused on business outcomes.

## Troubleshooting

- Missing environment prerequisites: verify `.env` and local database connectivity.
- Auth-related failures: verify test auth-context helper setup and token assumptions.
- Flaky behavior: isolate scenario dependencies, confirm cleanup, and track quarantine with explicit issue.

## Recommended Verification Checklist

- Baseline e2e command runs successfully.
- One targeted e2e scenario runs successfully.
- `test:e2e:file` profile runs successfully for one scenario file.
- `test:e2e:name` profile runs successfully for one scenario name pattern.
- One newly added e2e scenario follows contract and passes.
- One unit test follows standard contract and passes local Jest run.
- Flaky scenario triage flow is documented before any quarantine is applied.
