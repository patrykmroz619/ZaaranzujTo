# ZaaranzujTo Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-21

## Active Technologies
- TypeScript 5.9 with NestJS 11 (Bun-managed monorepo) + `@nestjs/testing`, `jest`, `ts-jest`, `supertest`, `@types/jest`, `@types/supertest` (005-e2e-test-setup)
- MongoDB-backed API modules; e2e baseline relies on isolated test data strategy in non-production environment (005-e2e-test-setup)

- TypeScript 5.9 with NestJS 11 on Bun runtime + `@nestjs/common`, `@nestjs/platform-express`, `@nestjs/mongoose`, `mongoose`, `nestjs-zod`, `zod`, `@repo/contracts`, `ai`, `@openrouter/ai-sdk-provider` (004-iteration-generation-orchestration)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.9 with NestJS 11 on Bun runtime: Follow standard conventions

## Recent Changes
- 005-e2e-test-setup: Added TypeScript 5.9 with NestJS 11 (Bun-managed monorepo) + `@nestjs/testing`, `jest`, `ts-jest`, `supertest`, `@types/jest`, `@types/supertest`

- 004-iteration-generation-orchestration: Added TypeScript 5.9 with NestJS 11 on Bun runtime + `@nestjs/common`, `@nestjs/platform-express`, `@nestjs/mongoose`, `mongoose`, `nestjs-zod`, `zod`, `@repo/contracts`, `ai`, `@openrouter/ai-sdk-provider`

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
