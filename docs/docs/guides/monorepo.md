# Monorepo Setup Guide

Configuring lintent for monorepos with multiple packages or mixed languages.

## Challenge

Monorepos often have:
- Different linters for different packages
- Backend (Python) and frontend (TypeScript)
- Shared linter configs
- Per-package configurations

## Strategy: Root-Level lintent.yaml

Create one `lintent.yaml` at the monorepo root with path overrides:

```
monorepo/
├── lintent.yaml           # Root config with overrides
├── backend/
│   ├── pyproject.toml    # ruff + pyright config
│   └── src/
├── frontend/
│   ├── tsconfig.json
│   ├── eslint.config.js
│   └── src/
└── shared/
    └── ...
```

## Configuration

```yaml
# lintent.yaml (at monorepo root)

linters:
  ruff:
    config: "./backend/pyproject.toml"
    paths: ["./backend/src"]
  
  pyright:
    config: "./backend/pyproject.toml"
    paths: ["./backend/src"]
  
  eslint:
    config: "./frontend/eslint.config.js"
    paths: ["./frontend/src"]
  
  typescript:
    config: "./frontend/tsconfig.json"
    paths: ["./frontend/src"]

rules:
  # Python rules (backend)
  ruff:
    F401:
      illegal: "Unused import"
      legal: "Only import what you use"
      why: "Clean dependencies"
    
    E501:
      illegal: "Line too long"
      legal: "Break into multiple lines"
      why: "Readability"

  pyright:
    reportMissingParameterType:
      illegal: "Missing parameter type"
      legal: "Add type annotation"
      why: "Type safety"

  # TypeScript rules (frontend)
  eslint:
    no-unused-vars:
      illegal: "Unused variable"
      legal: "Remove or prefix with _"
      why: "Dead code"
    
    no-console:
      illegal: "Console statement"
      legal: "Use logger"
      why: "No debug in production"

  typescript:
    TS2322:
      illegal: "Type mismatch"
      legal: "Fix type alignment"
      why: "Type safety"
```

## Running from Root

```bash
# From monorepo root
lintent run --pretty
```

This runs all configured linters on their respective paths.

## Running Single Package

```bash
# Only backend
lintent run --tool ruff
lintent run --tool pyright

# Only frontend
lintent run --tool eslint
lintent run --tool typescript
```

## Alternative: Per-Package Config

For independent packages, each can have its own `lintent.yaml`:

```
monorepo/
├── backend/
│   ├── lintent.yaml       # Python rules
│   └── pyproject.toml
└── frontend/
    ├── lintent.yaml       # TS rules
    └── tsconfig.json
```

Run from each package directory:

```bash
cd backend && lintent run
cd frontend && lintent run
```

## CI for Monorepos

### Matrix Strategy

```yaml
name: Lint

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        package: [backend, frontend]
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Python
        if: matrix.package == 'backend'
        uses: actions/setup-python@v5
        with:
          python-version: '3.10'
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install linters
        run: |
          if [ "${{ matrix.package }}" == "backend" ]; then
            pip install ruff pyright
          fi
          npm install -g lintent
      
      - name: Lint
        run: |
          cd ${{ matrix.package }}
          lintent run
```

### Single Job

If using root-level config:

```yaml
- run: |
    pip install ruff pyright
    npm ci  # For eslint
    npm install -g lintent
    lintent run
```

## Tips

### Disable Linters Per Package

```yaml
linters:
  pyright:
    enabled: false  # Skip pyright for this repo
```

### Shared Rules Across Packages

The semantic rules in `lintent.yaml` apply to all violations regardless of path. This encourages consistent standards across packages.

### Different Rules Per Package

If you need different semantic rules per package, use separate `lintent.yaml` files in each package directory.
