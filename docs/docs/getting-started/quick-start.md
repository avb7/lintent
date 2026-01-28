# Quick Start

Get semantic lint reports in under 2 minutes.

## 1. Initialize Configuration

Run this in your project root:

=== "Python Project"

    ```bash
    lintent init --preset python
    ```

=== "TypeScript Project"

    ```bash
    lintent init --preset typescript
    ```

This creates `lintent.yaml` with semantic rules for common lint violations.

## 2. Run lintent

```bash
lintent run --pretty
```

## 3. Understand the Output

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
        "legal": "Only import what you use, or mark with # noqa: F401 if for side-effects",
        "why": "Clean dependency graph, faster startup, clearer code"
      }
    }
  ],
  "linters": {
    "detected": ["ruff", "pyright"],
    "results": [
      { "name": "ruff", "status": "success", "violations_count": 5 },
      { "name": "pyright", "status": "not_found", "error": "..." }
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

### What Each Field Means

| Field | Description |
|-------|-------------|
| `violations[]` | List of all lint violations |
| `semantic.illegal` | What pattern the rule catches |
| `semantic.legal` | What correct code looks like |
| `semantic.why` | The reasoning behind the rule |
| `linters.detected` | Which linters were found |
| `linters.results` | Status of each linter run |
| `summary` | Counts and statistics |

## 4. Fix With Understanding

When fixing violations:

1. Read `semantic.legal` - It tells you the correct pattern
2. Read `semantic.why` - Understand the reasoning
3. Fix with intent, not just to silence the error

!!! tip "For AI Agents"
    If you're using lintent with an AI agent, ensure it reads the `semantic` fields before fixing. This leads to better, more intentional fixes.

## What's Next?

- [Configuration →](configuration.md) - Customize your semantic rules
- [Concepts: Semantic Rules →](../concepts/semantic-rules.md) - Deep dive on illegal/legal/why
- [CLI Reference →](../reference/cli.md) - All commands and options
