# Configuration Reference

Complete schema for `lintent.yaml`.

## File Location

lintent looks for config in this order:

1. Path specified with `--config`
2. `./lintent.yaml` in current directory

## Schema

```yaml
# Optional: Linter overrides
linters:
  <linter_name>:
    enabled: boolean      # Force enable/disable
    config: string        # Path to linter config
    paths: string[]       # Paths to lint

# Required for enrichment: Semantic rules
rules:
  <linter_name>:
    <rule_code>:
      illegal: string     # What the rule catches (required)
      legal: string       # What correct code looks like (required)
      why: string         # The reasoning (required)
```

## Linters Section

Override auto-detection behavior.

### Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | auto-detected | Force enable or disable linter |
| `config` | string | auto-detected | Path to linter's config file |
| `paths` | string[] | `["."]` | Directories/files to lint |

### Example

```yaml
linters:
  ruff:
    enabled: true
    config: "./backend/pyproject.toml"
    paths: ["./backend/src", "./backend/tests"]
  
  eslint:
    enabled: true
    paths: ["./frontend/src"]
  
  pyright:
    enabled: false  # Disable even if config exists
```

### Supported Linters

| Name | Language | Detection |
|------|----------|-----------|
| `ruff` | Python | `pyproject.toml`, `ruff.toml` |
| `pyright` | Python | `pyrightconfig.json`, `pyproject.toml` |
| `eslint` | JS/TS | `eslint.config.js`, `.eslintrc.*`, `package.json` |
| `typescript` | JS/TS | `tsconfig.json` |

## Rules Section

Define semantic meaning for lint rules.

### Structure

```yaml
rules:
  <linter_name>:
    <rule_code>:
      illegal: "Description of what triggers the rule"
      legal: "Description of correct code"
      why: "Reasoning behind the rule"
```

### Required Fields

All three fields are required for each rule:

| Field | Type | Description |
|-------|------|-------------|
| `illegal` | string | What pattern the lint rule catches |
| `legal` | string | What correct code looks like |
| `why` | string | Why this rule exists |

### Example

```yaml
rules:
  ruff:
    E501:
      illegal: "Lines over 88 characters"
      legal: "Break into multiple lines or extract to named variables"
      why: "Readability - code should fit in viewport without scrolling"
    
    F401:
      illegal: "Importing modules that are not used"
      legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
      why: "Clean dependency graph, faster startup, clearer code"
    
    F841:
      illegal: "Assigning to a variable that is never read"
      legal: "Use the variable, remove the assignment, or prefix with _ if intentional"
      why: "Dead code indicates logic errors or incomplete refactoring"

  pyright:
    reportMissingParameterType:
      illegal: "Function parameter without type annotation"
      legal: "Add type hints: def func(param: Type) -> ReturnType"
      why: "Type annotations enable tooling and catch errors early"

  eslint:
    no-unused-vars:
      illegal: "Variable declared but never read"
      legal: "Remove unused variables or prefix with _ to indicate intentional"
      why: "Dead code clutters the codebase and suggests incomplete logic"

  typescript:
    TS2322:
      illegal: "Type mismatch in assignment"
      legal: "Ensure types align or use proper type conversion"
      why: "Type mismatches indicate logic errors that would fail at runtime"
```

### Multi-line Values

For longer descriptions, use YAML multi-line syntax:

```yaml
rules:
  ruff:
    B006:
      illegal: "Mutable default argument in function definition"
      legal: |
        Use None as default and create mutable inside:
        
        def func(items=None):
            items = items or []
      why: |
        Mutable defaults (list, dict, set) are created once at 
        function definition time. All calls share the same object,
        leading to subtle bugs.
```

## Complete Example

```yaml
# lintent.yaml

linters:
  ruff:
    paths: ["./src"]
  pyright:
    enabled: false

rules:
  ruff:
    E501:
      illegal: "Lines over 88 characters"
      legal: "Break into multiple lines or extract to named variables"
      why: "Readability"
    
    F401:
      illegal: "Unused imports"
      legal: "Only import what you use"
      why: "Clean dependencies"
    
    F841:
      illegal: "Unused variable assignment"
      legal: "Use it or remove it"
      why: "Dead code indicates bugs"
```

## Validation

Validate your config:

```bash
lintent validate --pretty
```

Common errors:

- Missing `illegal`, `legal`, or `why` field
- Rule code that doesn't match linter format
- Invalid YAML syntax
