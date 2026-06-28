---
name: update-deps
description: Update all dependencies across the monorepo. Use when the user asks to update, upgrade, or bump dependencies/packages across all apps and packages.
---

## Overview

This skill updates all npm/bun dependencies across every workspace in the ZaaranżujTo monorepo (apps + packages). It runs one of two commands depending on whether breaking changes (major version bumps) are allowed, then verifies the codebase still type-checks and builds.

## Step 1 — Ask the user

Before running anything, ask the user:

> "Should I update to the **latest** versions including breaking changes (major bumps), or only to the latest **compatible** versions (minor + patch only)?"

- **Latest including breaking changes** → use `bun run deps:update:latest:all`
- **Compatible versions only** → use `bun run deps:update:all`

## Step 2 — Snapshot current versions

Capture the before-state so you can produce a useful diff summary later:

```bash
# Run from monorepo root
bun pm ls --all 2>/dev/null > .claude/skills/update-deps/_before.txt
```

## Step 3 — Run the update

```bash
# Compatible only (minor + patch)
bun run deps:update:all

# OR — latest including breaking changes
bun run deps:update:latest:all
```

Both commands delegate to each workspace's `deps:update` / `deps:update:latest` script, which calls `bun update` / `bun update --latest`.

## Step 4 — Summarize changes

After the update completes, produce a concise summary for the user. Show changed packages grouped by workspace using the git diff:

```bash
git diff --unified=0 "**/package.json" | grep "^\+" | grep -E '"[^"]+": "' | head -60
```

Or compare the before/after snapshots:

```bash
bun pm ls --all 2>/dev/null > .claude/skills/update-deps/_after.txt
diff .claude/skills/update-deps/_before.txt .claude/skills/update-deps/_after.txt
```

Present the summary as a markdown table with columns: **Workspace | Package | Before | After**.

## Step 5 — Ask to verify

After presenting the summary, ask the user:

> "Would you like me to run type checking and a full build to verify everything still works?"

If yes, proceed to Step 6.

## Step 6 — Type check and build

```bash
bun run check-types && bun run build
```

Run them sequentially — if `check-types` fails there is no point building.

## Step 7 — Fix issues (if any)

If type checking or the build fails:

1. Read the full error output carefully.
2. Identify which package(s) are involved.
3. Use **Context7 MCP** to fetch the latest docs for the affected library:
   - Call `resolve-library-id` with the package name and error context.
   - Call `query-docs` with the resolved ID and the specific error or migration question.
4. Apply the fix (update imports, adjust config, adapt API usage to breaking changes).
5. Re-run `bun run check-types && bun run build` to confirm the fix.
6. Repeat for each failing package.

Common causes after a `--latest` update:

- Renamed exports or moved entry points (check the package's CHANGELOG or migration guide via Context7).
- New peer-dependency requirements — install the missing peer with `bun add <pkg> --dev` in the relevant workspace.
- Removed or changed TypeScript types — update call sites to match the new signature.

## Notes

- All commands run from the **monorepo root** (`ZaaranzujTo/`).
- The monorepo uses **Bun + Turborepo**; each workspace exposes its own `deps:update` script wired to `bun update`.
- Temp snapshot files (`_before.txt`, `_after.txt`) are gitignored via the skill directory — delete them after the session or keep for comparison.
- After a successful update, remind the user to commit the lockfile (`bun.lockb`) and all changed `package.json` files together.
