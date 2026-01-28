# Lintent

[![npm version](https://img.shields.io/npm/v/lintent.svg)](https://www.npmjs.com/package/lintent)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Lint + Intent. Make slop illegal.** Give your AI agent a map to write clean code.

Linters tell you what's wrong. lintent tells you **why** it's wrong and **how** to fix it properly.

## The Problem

```json
{ "code": "F401", "message": "`os` imported but unused" }
```

This tells an AI agent **what** to fix, but not:
- **Why** the rule exists
- **How** to fix it correctly

Result: Mechanical fixes that miss the point.

## The Solution

```bash
$ lintent run --pretty
```

```json
{
  "code": "F401",
  "message": "`os` imported but unused",
  "semantic": {
    "illegal": "Importing modules that are not used",
    "legal": "Only import what you use, or mark with # noqa if for side-effects",
    "why": "Clean dependency graph, faster startup"
  }
}
```

Now the AI understands:
- **illegal**: What pattern triggered the error
- **legal**: What correct code looks like (including exceptions!)
- **why**: The reasoning behind the rule

## Installation

```bash
npm install -g lintent
```

Or run directly:

```bash
npx lintent run
```

## Quick Start

```bash
# Initialize with preset
lintent init --preset python      # For Python (ruff + pyright)
lintent init --preset typescript  # For TypeScript (eslint + tsc)

# Run
lintent run --pretty
```

## Using with AI Agents

### Quick Setup with Agent Prompt

Copy this prompt to your AI agent (Cursor, Copilot, etc.) to set up lintent:

> Set up lintent in this project: `npm install -g lintent && lintent init && lintent guide`

### AI Agent Guide

Generate context-aware instructions for your AI agent:

```bash
lintent guide           # General guide with project status
lintent guide setup     # Setup instructions
lintent guide fix       # How to fix violations properly
lintent guide config    # How to configure lintent.yaml
```

### Cursor

Create `.cursor/rules/lintent.mdc`:

```markdown
---
description: Use lintent for linting with semantic context
globs: ["**/*.py", "**/*.ts", "**/*.tsx"]
alwaysApply: true
---

# Linting with lintent

When fixing lint errors, use lintent:

\`\`\`bash
lintent run --pretty
\`\`\`

Each violation includes:
- `illegal`: What's wrong
- `legal`: How to fix (the correct pattern)
- `why`: The reasoning

Fix with understanding, not just to silence errors.
```

### Other AI Agents (Copilot, Aider, Claude, etc.)

lintent's JSON output is self-documenting. Each violation includes `semantic.illegal`, `semantic.legal`, and `semantic.why` fields that explain what's wrong and how to fix it.

For custom integrations, parse the JSON output and pass the semantic context to your LLM.

### Workflow

1. Run `lintent run` to get enriched violations
2. For each violation, read `semantic.legal` for the correct pattern
3. Read `semantic.why` to understand the principle
4. Fix with intent, not mechanically
5. Re-run `lintent run` to verify

## Configuration

`lintent.yaml` defines semantic meaning for lint rules:

```yaml
rules:
  ruff:
    E501:
      illegal: "Lines over 88 characters"
      legal: "Break into multiple lines or extract to named variables"
      why: "Readability - code should fit in viewport"
    
    F401:
      illegal: "Importing modules that are not used"
      legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
      why: "Clean dependency graph, faster startup"

  pyright:
    reportMissingParameterType:
      illegal: "Function parameter without type annotation"
      legal: "def func(param: Type) -> ReturnType"
      why: "Type annotations enable tooling and catch errors early"
```

### Auto-Detection

lintent automatically detects linters from your existing config files:

| Config file | Linter detected |
|-------------|-----------------|
| `pyproject.toml` with `[tool.ruff]` | ruff |
| `pyrightconfig.json` | pyright |
| `eslint.config.js` or `.eslintrc.*` | eslint |
| `tsconfig.json` | typescript |

No extra configuration needed — lintent uses your existing setup.

## Commands

### `lintent run`

Run all detected linters and output enriched report.

```bash
lintent run [options]

Options:
  -c, --config <path>  Path to lintent.yaml (default: ./lintent.yaml)
  -t, --tool <name>    Run only specific linter
  -p, --pretty         Pretty-print JSON output
```

### `lintent init`

Create starter `lintent.yaml` with preset rules.

```bash
lintent init --preset python
lintent init --preset typescript
```

### `lintent validate`

Validate `lintent.yaml` structure.

```bash
lintent validate --pretty
```

### `lintent list`

List all defined semantic rules.

```bash
lintent list --pretty
```

## Output Format

```json
{
  "violations": [
    {
      "file": "src/main.py",
      "line": 3,
      "column": 8,
      "tool": "ruff",
      "code": "F401",
      "message": "`os` imported but unused",
      "semantic": {
        "illegal": "Importing modules that are not used",
        "legal": "Only import what you use",
        "why": "Clean dependency graph"
      }
    }
  ],
  "linters": {
    "detected": ["ruff", "pyright"],
    "results": [
      { "name": "ruff", "status": "success", "violations_count": 5 }
    ]
  },
  "summary": {
    "total": 5,
    "with_semantic": 5,
    "without_semantic": 0,
    "files_affected": 2
  }
}
```

## Supported Linters

| Language | Linters |
|----------|---------|
| Python | ruff, pyright |
| JavaScript/TypeScript | eslint, tsc |

### Coming Soon

We're actively working on support for:

- **Rust**: clippy
- **Go**: golangci-lint
- **Java**: checkstyle, spotbugs
- **C/C++**: clang-tidy
- **Ruby**: rubocop

Want to help? See our [Contributing Guide](./DEVGUIDE.md).

## Documentation

Full documentation at [avb7.github.io/lintent](https://avb7.github.io/lintent)

Or run locally:

```bash
cd docs
pip install -r requirements.txt
mkdocs serve
```

## Contributing

See [DEVGUIDE.md](./DEVGUIDE.md) for how to add support for new linters.

## License

MIT
