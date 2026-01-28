# AI Agent Integration

lintent is built for AI agents. It transforms cryptic lint errors into actionable guidance with semantic context.

## Why AI Agents Need lintent

### The Problem

When an AI sees a lint error like:

```
F401: `os` imported but unused
```

It knows **what** to fix but not:
- When it's okay to keep (side-effect imports)
- What the principle is (clean dependencies)
- How the codebase prefers to handle it

### The Solution

With lintent, the AI gets full context:

```json
{
  "code": "F401",
  "message": "`os` imported but unused",
  "semantic": {
    "illegal": "Importing modules that are not used",
    "legal": "Only import what you use, or mark with # noqa: F401 if for side-effects",
    "why": "Clean dependency graph, faster startup"
  }
}
```

Now the AI:
- Understands the **intent** (clean dependencies)
- Knows the **exception** (side-effect imports exist)
- Can make **intelligent** decisions

## Supported AI Agents

lintent works with any AI agent that can run shell commands:

| Agent | Integration |
|-------|-------------|
| **Cursor** | [Cursor rules + direct invocation](#cursor) |
| **GitHub Copilot** | [Via chat/terminal](#github-copilot) |
| **Aider** | [Shell commands](#aider) |
| **Claude (API)** | [Tool use](#claude-api-tool-use) |
| **Custom Agents** | [JSON output parsing](#custom-agents) |

## Cursor

Cursor has first-class support through rules.

### Setup

1. Install lintent and initialize:

```bash
npm install -g lintent
lintent init --preset python
```

2. Create `.cursor/rules/lintent.mdc`:

```markdown
---
description: Use lintent for semantic linting
globs: ["**/*.py", "**/*.ts", "**/*.tsx"]
alwaysApply: true
---

# Linting with lintent

When fixing lint errors, run:

\`\`\`bash
lintent run --pretty
\`\`\`

Each violation includes:
- `illegal`: What's wrong
- `legal`: How to fix (the correct pattern)  
- `why`: The reasoning

Always read `legal` and `why` before fixing. Fix with understanding.
```

### Usage

Ask Cursor:

> "Run lintent and fix all violations"

Or more targeted:

> "Check this file with lintent and explain any issues"

[Full Cursor Guide →](../guides/cursor-integration.md)

## GitHub Copilot

### Chat Integration

Ask Copilot Chat:

> "Run `lintent run --pretty` and explain the violations"

Or:

> "Use lintent to check this file for issues and fix them"

### With Copilot Workspace

Add to your workflow instructions:

```markdown
For linting, use lintent:
1. Run `lintent run --pretty`
2. Read the `semantic` field for each violation
3. Fix according to `legal` pattern
4. Re-run to verify
```

## Aider

Aider can run shell commands directly.

### Usage

```bash
aider --message "Run lintent run and fix all violations based on the semantic context"
```

Or in interactive mode:

```
/run lintent run --pretty
```

Then ask Aider to fix based on the output.

## Claude (API / Tool Use)

For Claude API integrations, expose lintent as a tool:

```python
tools = [
    {
        "name": "run_lintent",
        "description": "Run linters and get violations with semantic context (why it's wrong, how to fix)",
        "input_schema": {
            "type": "object",
            "properties": {
                "tool": {
                    "type": "string",
                    "description": "Optional: run only specific linter (ruff, pyright, eslint, typescript)"
                }
            }
        }
    }
]

def run_lintent(tool=None):
    cmd = ["lintent", "run"]
    if tool:
        cmd.extend(["--tool", tool])
    result = subprocess.run(cmd, capture_output=True, text=True)
    return json.loads(result.stdout)
```

### System Prompt

```
When fixing code issues, use the run_lintent tool. Each violation includes:
- semantic.illegal: What pattern is wrong
- semantic.legal: What correct code looks like
- semantic.why: The reasoning

Fix with understanding, not mechanically.
```

## Custom Agents

For custom agent implementations:

### 1. Run lintent

```python
import subprocess
import json

result = subprocess.run(
    ["lintent", "run"],
    capture_output=True,
    text=True
)
report = json.loads(result.stdout)
```

### 2. Process Violations

```python
for violation in report["violations"]:
    file = violation["file"]
    line = violation["line"]
    
    context = f"""
    Error: {violation['code']} at {file}:{line}
    Message: {violation['message']}
    """
    
    if violation["semantic"]:
        context += f"""
    What's wrong: {violation['semantic']['illegal']}
    How to fix: {violation['semantic']['legal']}
    Why: {violation['semantic']['why']}
    """
    
    # Pass context to your LLM for fixing
    fix = your_llm.generate_fix(file, line, context)
```

### 3. Verify Fixes

```python
# After applying fixes, re-run
result = subprocess.run(["lintent", "run"], capture_output=True, text=True)
new_report = json.loads(result.stdout)

if new_report["summary"]["total"] == 0:
    print("All violations fixed!")
```

## Best Practices

### 1. Always Re-run After Fixes

```bash
lintent run  # Check
# ... fix code ...
lintent run  # Verify
```

### 2. Don't Ignore `legal` Exceptions

```yaml
legal: "Only import what you use, or mark with # noqa if for side-effects"
```

The "or" indicates a valid exception. Don't blindly delete.

### 3. Use `why` for Ambiguous Cases

When multiple fixes are valid, `why` helps choose:

```yaml
why: "Clean dependency graph, faster startup"
```

This suggests: prefer removing over silencing.

### 4. Check Semantic Coverage

```json
{
  "summary": {
    "with_semantic": 12,
    "without_semantic": 3
  }
}
```

Violations without semantics need manual review.

### 5. Add Project-Specific Rules

Extend `lintent.yaml` with your codebase conventions:

```yaml
rules:
  ruff:
    # Add rules specific to your project
    PLR0913:
      illegal: "Too many function arguments"
      legal: "Group into dataclass or use **kwargs"
      why: "Our codebase prefers explicit parameter objects"
```
