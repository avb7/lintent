# Output Format

Complete reference for lintent's JSON output structure.

## Top-Level Structure

```typescript
interface LintentReport {
  violations: EnrichedViolation[];
  linters: {
    detected: string[];
    results: LinterResult[];
  };
  summary: Summary;
}
```

## Violations

Each violation includes location, linter info, and semantic context.

```typescript
interface EnrichedViolation {
  file: string;        // Absolute or relative path
  line: number;        // 1-indexed line number
  column: number;      // 1-indexed column number
  tool: string;        // Linter name (ruff, eslint, etc.)
  code: string;        // Rule code (E501, no-unused-vars, etc.)
  message: string;     // Linter's error message
  semantic: SemanticRule | null;
}

interface SemanticRule {
  illegal: string;     // What the rule catches
  legal: string;       // What correct code looks like
  why: string;         // Reasoning behind the rule
}
```

### Example Violation

```json
{
  "file": "src/main.py",
  "line": 3,
  "column": 8,
  "tool": "ruff",
  "code": "F401",
  "message": "`os` imported but unused",
  "semantic": {
    "illegal": "Importing modules that are not used",
    "legal": "Only import what you use, or mark with # noqa: F401",
    "why": "Clean dependency graph, faster startup"
  }
}
```

### Violation Without Semantic Rule

If no semantic rule is defined for a violation, `semantic` is `null`:

```json
{
  "file": "src/main.py",
  "line": 10,
  "column": 1,
  "tool": "ruff",
  "code": "E999",
  "message": "Some uncommon error",
  "semantic": null
}
```

## Linters

Information about detected and executed linters.

```typescript
interface LinterResult {
  name: string;
  status: "success" | "error" | "not_found";
  violations_count: number;
  error?: string;  // Present when status is "error" or "not_found"
}
```

### Example

```json
{
  "linters": {
    "detected": ["ruff", "pyright", "eslint"],
    "results": [
      {
        "name": "ruff",
        "status": "success",
        "violations_count": 5
      },
      {
        "name": "pyright",
        "status": "not_found",
        "violations_count": 0,
        "error": "'pyright' is not installed. Install it with: pip install pyright"
      },
      {
        "name": "eslint",
        "status": "error",
        "violations_count": 0,
        "error": "ESLint configuration error"
      }
    ]
  }
}
```

### Linter Statuses

| Status | Description |
|--------|-------------|
| `success` | Linter ran and produced output (may have 0 violations) |
| `not_found` | Linter binary not found / not installed |
| `error` | Linter ran but encountered an error |

## Summary

Aggregate statistics about the run.

```typescript
interface Summary {
  total: number;           // Total violations
  with_semantic: number;   // Violations with semantic rules
  without_semantic: number; // Violations without semantic rules
  by_tool: Record<string, number>;  // Count per linter
  files_affected: number;  // Unique files with violations
}
```

### Example

```json
{
  "summary": {
    "total": 15,
    "with_semantic": 12,
    "without_semantic": 3,
    "by_tool": {
      "ruff": 10,
      "eslint": 5
    },
    "files_affected": 4
  }
}
```

## Error Responses

When lintent encounters an error, it returns:

```typescript
interface LintentError {
  error: true;
  code: string;
  message: string;
}
```

### Example

```json
{
  "error": true,
  "code": "CONFIG_NOT_FOUND",
  "message": "Config file not found: ./lintent.yaml"
}
```

### Error Codes

| Code | Description |
|------|-------------|
| `CONFIG_NOT_FOUND` | lintent.yaml not found |
| `CONFIG_INVALID` | lintent.yaml has syntax/structure errors |
| `NO_LINTERS` | No linters detected |
| `LINTER_NOT_FOUND` | Specified linter (via `--tool`) not found |
| `RUNTIME_ERROR` | Unexpected error |

## Complete Example

```json
{
  "violations": [
    {
      "file": "/project/src/main.py",
      "line": 1,
      "column": 8,
      "tool": "ruff",
      "code": "F401",
      "message": "`os` imported but unused",
      "semantic": {
        "illegal": "Importing modules that are not used",
        "legal": "Only import what you use",
        "why": "Clean dependency graph"
      }
    },
    {
      "file": "/project/src/main.py",
      "line": 10,
      "column": 89,
      "tool": "ruff",
      "code": "E501",
      "message": "Line too long (120 > 88)",
      "semantic": {
        "illegal": "Lines over 88 characters",
        "legal": "Break into multiple lines",
        "why": "Readability"
      }
    }
  ],
  "linters": {
    "detected": ["ruff", "pyright"],
    "results": [
      {
        "name": "ruff",
        "status": "success",
        "violations_count": 2
      },
      {
        "name": "pyright",
        "status": "not_found",
        "violations_count": 0,
        "error": "'pyright' is not installed..."
      }
    ]
  },
  "summary": {
    "total": 2,
    "with_semantic": 2,
    "without_semantic": 0,
    "by_tool": {
      "ruff": 2
    },
    "files_affected": 1
  }
}
```
