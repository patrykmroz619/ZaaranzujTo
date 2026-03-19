<!-- Sync Impact Report:
- Version change: INITIAL -> 1.0.0
- Modified principles: Defined new principles from template (Code Quality, Testing Standards, UX Consistency, Performance Requirements)
- Added sections: Core Principles, Architecture Guidelines, Development Workflow, Governance
- Removed sections: N/A
- Templates requiring updates:
  - ⚠ .specify/templates/plan-template.md
  - ⚠ .specify/templates/spec-template.md
  - ⚠ .specify/templates/tasks-template.md
-->

# ZaaranzujTo Constitution

## Core Principles

### Code Quality

Code MUST be consistently styled, leveraging shared Typescript/ESLint configurations across all frontend, backend, and shared packages in the Turborepo workspace. We MUST use early returns, descriptive naming, type inference over explicit annotations for TS, and object destructuring for parameters. Complexity and technical debt MUST be justified.

### Testing Standards

Key logic MUST be verifiable by tests (especially shared schemas in \`contracts\`). We DO NOT proactively write tests during MVP implementation unless explicitly requested by the user, but we MUST maintain testable architecture to support future coverage.

### User Experience Consistency

User interfaces MUST reuse components from the shared \`ui\` package to maintain consistent branding, spacing, and interaction patterns. Direct DOM manipulation or inline styles MUST be avoided in favor of Tailwind CSS utility classes and robust React components.

### Performance Requirements

Applications MUST remain extremely responsive. The frontend MUST bundle efficiently with Vite/Next.js, and backend operations MUST resolve quickly using our selected Bun runtime. Database queries MUST be optimized, and heavy generation or visualization tasks MUST execute asynchronously without blocking the main event loops.

## Architecture Guidelines

We maintain a modular monorepo using Turborepo and Bun. Shared code and schemas MUST live in \`packages/contracts\`, reusable UI in \`packages/ui\`, and concrete applications MUST consume these boundaries clearly without circular dependencies.

## Development Workflow

All changes MUST adhere to strict type-checking and unified linting rules. Ensure all affected dependent packages build correctly before merging. Changes to database models or APIs MUST update corresponding markdown documentation in the \`/docs\` directory.

## Governance

This Constitution establishes the core non-negotiable standards for the ZaaranzujTo project.
Amendments MUST be documented by bumping the CONSTITUTION_VERSION according to SemVer rules (Major for removing principles, Minor for new rules, Patch for clarifications).
All implementation tasks, feature specs, and design plans MUST align with these principles.

**Version**: 1.0.0 | **Ratified**: 2026-03-19 | **Last Amended**: 2026-03-19
