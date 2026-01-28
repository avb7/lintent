# Python Projects Guide

Setting up lintent for Python projects with ruff and pyright.

## Prerequisites

- Node.js 18+
- Python 3.8+
- ruff and/or pyright installed

## Quick Setup

```bash
# Install lintent
npm install -g lintent

# Install linters
pip install ruff pyright

# Initialize
lintent init --preset python

# Run
lintent run --pretty
```

## Project Structure

```
my-python-project/
├── pyproject.toml        # ruff + pyright config
├── lintent.yaml           # Semantic rules
└── src/
    └── ...
```

## Configure ruff

In `pyproject.toml`:

```toml
[tool.ruff]
line-length = 88
target-version = "py310"

[tool.ruff.lint]
select = [
    "E",    # pycodestyle errors
    "F",    # pyflakes
    "I",    # isort
    "B",    # flake8-bugbear
    "C90",  # mccabe complexity
]
```

lintent auto-detects ruff from this configuration.

## Configure pyright

In `pyproject.toml`:

```toml
[tool.pyright]
typeCheckingMode = "basic"  # or "strict"
pythonVersion = "3.10"
```

Or in `pyrightconfig.json`:

```json
{
  "typeCheckingMode": "basic",
  "pythonVersion": "3.10"
}
```

## Customize Semantic Rules

Edit `lintent.yaml` to add project-specific rules:

```yaml
rules:
  ruff:
    # Preset rules...
    
    # Project-specific
    PLR0913:
      illegal: "Function with too many arguments (>5)"
      legal: "Use dataclass or TypedDict for grouped parameters"
      why: "Many arguments indicate the function does too much"
    
    S101:
      illegal: "Assert in non-test code"
      legal: "Use proper exceptions for validation"
      why: "Assert can be stripped with -O flag"

  pyright:
    reportUnknownMemberType:
      illegal: "Unknown member type in expression"
      legal: "Add type stubs or annotations"
      why: "Full type coverage catches more bugs"
```

## Run for Specific Paths

```bash
# Only check src/
lintent run --tool ruff
```

Or configure in `lintent.yaml`:

```yaml
linters:
  ruff:
    paths: ["./src", "./tests"]
  pyright:
    paths: ["./src"]  # Skip tests for type checking

rules:
  # ...
```

## CI Integration

### GitHub Actions

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: pip install ruff pyright
      - run: npm install -g lintent
      
      - run: lintent run
```

## Common Issues

### ruff Not Found

```json
{
  "status": "not_found",
  "error": "'ruff' is not installed..."
}
```

**Fix**: Install ruff

```bash
pip install ruff
# or
brew install ruff
```

### pyright Type Errors

If pyright reports many type errors, consider:

1. Using `typeCheckingMode = "basic"` instead of "strict"
2. Adding `py.typed` marker or type stubs
3. Adding `# type: ignore` with comments for intentional cases

### Missing Type Stubs

```yaml
pyright:
  reportMissingTypeStubs:
    illegal: "Using untyped libraries"
    legal: "Install types-* package or add py.typed"
    why: "Type boundaries must be explicit"
```

**Fix**: Install type stubs

```bash
pip install types-requests types-redis  # etc.
```
