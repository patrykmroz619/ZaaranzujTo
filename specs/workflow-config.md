# Workflow Configuration

Single source of truth for how this project's dev-workflow skills integrate with external systems.
Update by re-running /init-workflow or by editing this file directly.

## Task management

- **System:** Linear
- **Access mechanism:** MCP server (`mcp__linear-server__*` tools)
- **Availability:** verified available
- **Notes:** This repo maps to the "Patryk's Team" Linear team (ID: `543217ff-b9d0-4feb-82ec-dc7bc1f9020f`, key prefix `PAT`). The workspace also contains unrelated projects — only query issues with the `PAT-*` prefix. Use `mcp__linear-server__get_issue` with the ticket ID (e.g. `PAT-31`) to fetch issue details when starting a task.

## Git conventions

- **Branch naming:** `{type}/{ticket}-{slug}` — e.g. `feat/PAT-31-analytics`, `fix/PAT-42-upload-error`
- **Commit style:** Conventional Commits with optional scope — e.g. `feat(web): ...`, `fix(api): ...`, `feat: ...`
