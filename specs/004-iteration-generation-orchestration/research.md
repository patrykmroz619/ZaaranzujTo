# Phase 0: Research & Technical Unknowns

## 1. Reusable AI Integration Module Boundary

- Decision: Introduce a dedicated `ai` module that exports orchestration-facing services (`ai-generation.service.ts`, `ai-prompt-builder.service.ts`) and encapsulates provider configuration details.
- Rationale: This keeps `visualizations` orchestration independent from vendor-specific concerns and makes future provider changes low-risk.
- Alternatives considered: Put provider calls directly in visualizations services. Rejected because it creates tight coupling and raises circular dependency risk.

## 2. AI SDK + OpenRouter Integration Strategy

- Decision: Use AI SDK with `@openrouter/ai-sdk-provider` as the primary provider integration and drive generation through reusable service methods.
- Rationale: Context7 docs show OpenRouter's recommended Vercel AI SDK integration path via `@openrouter/ai-sdk-provider`, while preserving typed SDK workflows.
- Alternatives considered: Use `@ai-sdk/openai-compatible` as a generic adapter fallback only. Rejected as primary path because OpenRouter has a dedicated recommended provider package.

## 3. Multimodal Input Encoding for Generation

- Decision: Normalize uploaded `inputPhoto` and `referencePhotos` into internal message parts for one generation request and keep prompt assembly in a separate prompt-builder service.
- Rationale: OpenRouter docs show OpenAI-compatible multimodal request structures; separating prompt construction from execution keeps prompts reusable and testable.
- Alternatives considered: Build prompts inline in controller/service orchestration. Rejected due to lower readability and weaker reuse.

## 4. Failure Mapping and Credit Neutrality

- Decision: Orchestrate sequence as reserve -> generate -> persist iteration/output -> consume on success; compensate on any downstream failure; map known error categories to deterministic outcomes.
- Rationale: Aligns with WI-07 acceptance criteria and maintains strict credit fairness.
- Alternatives considered: Consume before generation or defer reservation until after generation. Rejected because both break fairness or increase race/conflict risk.

## 5. Upload Validation Timing

- Decision: Validate file constraints (type/size/count) before external provider call and before credit reservation finalization path proceeds.
- Rationale: Fast-fail prevents unnecessary provider costs and reduces orphaned side effects.
- Alternatives considered: Defer some validation until after upload persistence/generation call. Rejected due to wasted compute and inconsistent errors.

## 6. Error Handling Guidance for OpenRouter Calls

- Decision: Classify provider errors by status category (auth/config, rate/model unavailable, validation/upstream) and convert them into domain-level deterministic error outcomes used by orchestration.
- Rationale: Context7 OpenRouter docs provide concrete status handling patterns (401/429/503 etc.), enabling stable retries and operator debugging.
- Alternatives considered: Bubble raw provider errors to API layer. Rejected because it leaks provider details and destabilizes client behavior.
