# Pre-Sales Agent (Claude Agent SDK)

A thin wrapper around the Claude Agent SDK that runs against this repo's `.claude` project (agents + commands). It lets you trigger tasks like `/research`, `/pitch`, `/polish`, and `/sparkle` programmatically.

## Prerequisites
- Node.js 18+
- `ANTHROPIC_API_KEY` set in your environment

## Install
```bash
cd agent
npm install
```

## Build
```bash
npm run build
```

## Run
Execute a one-off prompt:
```bash
ANTHROPIC_API_KEY=... node dist/index.js --prompt "/pitch --company=Slack"
```

Options:
- `--prompt` A prompt or slash command (default: list commands and propose next action)
- `--model` Override model (e.g., `haiku`, `sonnet`, `opus`)
- `--permissionMode` One of `default`, `acceptEdits`, `bypassPermissions`, `plan` (default: `default`)

The SDK loads project settings and subagents from the repo root via:
- `.claude/agents/*`
- `.claude/commands/*`
- `.claude/settings*.json`

## Notes
- This is a minimal bootstrap to run the SDK against your existing `.claude` project. Extend as needed (custom MCP servers, plugins, hooks, richer logging, etc.).
- The current `.claude/settings.local.json` restricts tools; adjust as needed for your environment.
