# Quickstart: Iteration Generation Orchestration

## Prerequisites

- Bun installed
- MongoDB configured for platform-api
- Object storage credentials configured
- Clerk auth configured for protected endpoints
- OpenRouter API key configured
- API running locally

## Start API

```bash
cd apps/platform-api
bun install
bun run dev
```

Local API base:

```text
http://localhost:3001/api/v1
```

## Environment Expectations

Ensure backend environment includes AI and storage configuration used by this feature.

Suggested variables:

- `OPENROUTER_API_KEY`
- `OPENROUTER_BASE_URL` (default: `https://openrouter.ai/api/v1`)
- `VISUALIZATION_IMAGE_MODEL`
- Storage bucket/access variables already used by `storage` module

Provider package used by implementation:

- `@openrouter/ai-sdk-provider`

## Verify Primary Flow (Success)

Use a valid bearer token and an existing visualization owned by the same user.

```bash
curl -X POST "http://localhost:3001/api/v1/visualizations/<visualizationId>/iterations" \
  -H "Authorization: Bearer <token>" \
  -F "inputPhoto=@/path/to/input.jpg" \
  -F "referencePhotos=@/path/to/ref1.jpg" \
  -F "referencePhotos=@/path/to/ref2.jpg" \
  -F "stylePreset=minimal" \
  -F "promptContext={\"roomType\":\"living-room\"};type=application/json"
```

Expected:

- Successful iteration creation outcome
- Exactly one new iteration linked to target visualization
- Output asset metadata persisted and linked
- Credit reservation consumed exactly once

## Verify Failure Compensation

Simulate provider failure (invalid model/config or local fault injection).

Expected:

- Deterministic failure outcome returned
- Reserved credit compensated
- Final user available balance equals pre-request value
- No partial success state exposed as completed iteration

## Verify Validation and Ownership Guards

1. Submit oversized or unsupported files.
   Expected: validation failure before generation starts.

2. Submit request for visualization not owned by requester.
   Expected: authorization/ownership failure and no side effects.

3. Submit request with non-image input.
   Expected: `422` invalid input outcome.
