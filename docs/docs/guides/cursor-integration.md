# Cursor Integration Guide

Use lintent with Cursor to give your AI agent semantic understanding of lint violations.

## Overview

Cursor can run lintent and use the enriched output to fix code with understanding, not just pattern matching.

## Setup

### 1. Install lintent

```bash
npm install -g lintent
```

### 2. Initialize in Your Project

```bash
cd your-project
lintent init --preset python  # or typescript
```

This creates `lintent.yaml` with semantic rules for common lint violations.

### 3. Create a Cursor Rule

Create `.cursor/rules/lintent.mdc` (or add to your existing rules):

```markdown
---
description: Use lintent for linting with semantic context
globs: ["**/*.py", "**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"]
alwaysApply: true
---

# Linting with lintent

When fixing lint errors or checking code quality, use lintent instead of running linters directly.

## How to Use

Run lintent to get lint violations with semantic context:

\`\`\`bash
lintent run --pretty
\`\`\`

## Understanding the Output

Each violation includes:
- `illegal`: What pattern triggered the error (what's wrong)
- `legal`: What correct code looks like (how to fix)
- `why`: The reasoning behind the rule (why it matters)

## Fixing Violations

1. Read the `semantic.legal` field to understand what the fix should look like
2. Read the `semantic.why` field to understand the principle
3. Fix with understanding, not just to silence the error

## Example

If you see:
\`\`\`json
{
  "code": "F401",
  "message": "`os` imported but unused",
  "semantic": {
    "illegal": "Importing modules that are not used",
    "legal": "Only import what you use, or mark with # noqa: F401 if for side-effects",
    "why": "Clean dependency graph, faster startup"
  }
}
\`\`\`

The `legal` field tells you there's an exception for side-effect imports. Don't blindly delete — consider the context.

## After Fixing

Re-run `lintent run` to verify the violations are resolved.
```

## Using lintent in Cursor

### Method 1: Cursor Rule (Recommended)

With the rule above, Cursor will automatically use lintent when working with code files.

### Method 2: Direct Invocation

Ask Cursor to run lintent:

> "Run lintent and fix all the violations"

Or be specific:

> "Run lintent and fix the F401 unused import errors"

## Best Practices

### 1. Customize Semantic Rules

Add project-specific rules to `lintent.yaml`:

```yaml
rules:
  ruff:
    # Add rules specific to your codebase
    PLR0913:
      illegal: "Function with more than 5 arguments"
      legal: "Group related args into a dataclass or TypedDict"
      why: "Many args = function doing too much"
```

### 2. Add Project Context to Cursor Rules

```markdown
# Project-Specific Lint Guidance

When fixing lint errors:
- We use strict type checking - always add annotations
- Prefer composition over inheritance
- Use our custom logger, not print()
```

## Example Workflow

1. **You**: "Check this file for lint errors and fix them"

2. **Cursor** runs: `lintent run --pretty`

3. **Cursor** sees:
   ```json
   {
     "code": "B006",
     "semantic": {
       "illegal": "Mutable default argument",
       "legal": "Use None as default, create inside function",
       "why": "Mutable defaults shared across calls"
     }
   }
   ```

4. **Cursor** fixes with understanding:
   ```python
   # Before (wrong)
   def process(items=[]):
       items.append("done")
   
   # After (correct - following 'legal')
   def process(items=None):
       if items is None:
           items = []
       items.append("done")
   ```

5. **Cursor** re-runs `lintent run` to verify

## Troubleshooting

### "lintent: command not found"

Ensure lintent is installed globally:

```bash
npm install -g lintent
```

Or use npx in your rule:

```markdown
\`\`\`bash
npx lintent run --pretty
\`\`\`
```

### Cursor Not Using lintent

Make sure your rule file:
- Is in `.cursor/rules/` directory
- Has the correct `globs` pattern for your files
- Has `alwaysApply: true` if you want it active by default

### Missing Semantic Context

If `semantic` is `null`, the rule isn't defined in `lintent.yaml`. Add it:

```yaml
rules:
  ruff:
    EXXX:  # The missing rule code
      illegal: "..."
      legal: "..."
      why: "..."
```
