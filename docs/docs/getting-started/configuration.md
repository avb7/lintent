# Configuration

lintent uses `lintent.yaml` to define semantic meaning for lint rules.

## Basic Structure

```yaml
rules:
  <linter>:
    <code>:
      illegal: "What the rule catches"
      legal: "What correct code looks like"
      why: "The reasoning"
```

## Minimal Example

```yaml
rules:
  ruff:
    F401:
      illegal: "Importing modules that are not used"
      legal: "Only import what you use"
      why: "Clean dependency graph, faster startup"
```

## Full Example

```yaml
# lintent.yaml

rules:
  ruff:
    E501:
      illegal: "Lines over 88 characters"
      legal: "Break into multiple lines or extract to named variables"
      why: "Readability - code should fit in viewport"
    
    F401:
      illegal: "Importing modules that are not used"
      legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
      why: "Clean dependency graph, faster startup, clearer code"
    
    F841:
      illegal: "Assigning to a variable that is never read"
      legal: "Use the variable, remove it, or prefix with _ if intentional"
      why: "Dead code indicates logic errors or incomplete refactoring"
    
    B006:
      illegal: "Mutable default argument in function definition"
      legal: "Use None as default and create mutable inside function"
      why: "Mutable defaults are shared across calls, causing subtle bugs"

  pyright:
    reportMissingParameterType:
      illegal: "Function parameter without type annotation"
      legal: "def func(param: Type) -> ReturnType"
      why: "Type annotations enable tooling and catch errors early"
```

## Linter Overrides

For monorepos or custom setups, override linter paths:

```yaml
linters:
  ruff:
    enabled: true
    paths: ["./backend/src"]
  
  eslint:
    enabled: true
    config: "./frontend/.eslintrc.js"
    paths: ["./frontend/src"]
  
  pyright:
    enabled: false  # Explicitly disable

rules:
  ruff:
    F401:
      illegal: "Unused imports"
      legal: "Only import what you use"
      why: "Clean dependencies"
```

### Linter Override Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `enabled` | boolean | auto-detected | Force enable or disable |
| `config` | string | auto-detected | Path to linter config file |
| `paths` | string[] | `["."]` | Directories to lint |

## Writing Good Semantic Rules

### Be Specific

```yaml
# Good
illegal: "Using == for None comparison"
legal: "Use 'is None' or 'is not None'"
why: "None is a singleton; identity check is faster and clearer"

# Bad
illegal: "Bad comparison"
legal: "Use better comparison"
why: "It's better"
```

### Include Examples When Helpful

```yaml
illegal: "Mutable default argument"
legal: |
  Use None as default:
  def func(items=None):
      items = items or []
why: "Mutable defaults are shared across calls"
```

### Think About Intent

Ask yourself:
- What is the rule trying to prevent?
- What should the developer do instead?
- Why does this matter?

## Using Presets

Start with a preset and customize:

```bash
lintent init --preset python
```

Then edit `lintent.yaml` to add or modify rules.

## Validation

Check your config for errors:

```bash
lintent validate --pretty
```

```json
{
  "valid": true,
  "linters": ["ruff", "pyright"],
  "rules_count": 10
}
```

## Next Steps

- [Semantic Rules →](../concepts/semantic-rules.md) - Deep dive on illegal/legal/why
- [Config Reference →](../reference/config.md) - Complete schema documentation
