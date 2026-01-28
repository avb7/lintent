# Presets Reference

Pre-built semantic rules for common lint violations.

## Available Presets

| Preset | Linters | Rules |
|--------|---------|-------|
| `python` | ruff, pyright | ~20 rules |
| `typescript` | eslint, tsc | ~20 rules |

## Using Presets

```bash
lintent init --preset python
```

This creates `lintent.yaml` with semantic rules for common violations.

## Python Preset

Rules for ruff and pyright.

### ruff Rules

| Code | Description |
|------|-------------|
| `E501` | Line too long |
| `F401` | Unused import |
| `F841` | Unused variable |
| `I001` | Import sorting |
| `B006` | Mutable default argument |
| `C901` | Function too complex |
| `F821` | Undefined name |
| `F811` | Redefined unused |
| `B011` | Assert False |
| `T201` | Print statement |
| `F403` | Star import |
| `E722` | Bare except |

### pyright Rules

| Code | Description |
|------|-------------|
| `reportMissingTypeStubs` | Missing type stubs |
| `reportUnusedVariable` | Unused variable |
| `reportMissingParameterType` | Missing parameter type |
| `reportGeneralTypeIssues` | General type issues |
| `reportMissingReturnType` | Missing return type |
| `reportUnusedImport` | Unused import |
| `reportOptionalMemberAccess` | Optional member access |
| `reportPrivateUsage` | Private member usage |

## TypeScript Preset

Rules for eslint and TypeScript compiler.

### eslint Rules

| Code | Description |
|------|-------------|
| `no-unused-vars` | Unused variable |
| `@typescript-eslint/no-unused-vars` | TS unused variable |
| `no-console` | Console statement |
| `prefer-const` | Prefer const |
| `eqeqeq` | Strict equality |
| `no-var` | No var |
| `@typescript-eslint/no-explicit-any` | No explicit any |
| `@typescript-eslint/no-floating-promises` | Floating promises |
| `@typescript-eslint/no-misused-promises` | Misused promises |
| `@typescript-eslint/require-await` | Require await |
| `@typescript-eslint/prefer-nullish-coalescing` | Prefer nullish coalescing |
| `@typescript-eslint/prefer-optional-chain` | Prefer optional chain |
| `no-debugger` | No debugger |

### TypeScript Compiler Rules

| Code | Description |
|------|-------------|
| `TS2322` | Type mismatch |
| `TS2345` | Argument type mismatch |
| `TS7006` | Implicit any parameter |
| `TS2304` | Cannot find name |
| `TS2339` | Property doesn't exist |
| `TS2769` | No overload matches |
| `TS2532` | Object possibly undefined |
| `TS2531` | Object possibly null |
| `TS2741` | Missing property |
| `TS2352` | Type conversion error |

## Customizing Presets

After running `lintent init`, edit `lintent.yaml` to:

### Add Rules

```yaml
rules:
  ruff:
    # Existing preset rules...
    
    # Add your own
    S101:
      illegal: "Using assert in production code"
      legal: "Use proper error handling or pytest.raises in tests"
      why: "Assert can be disabled with -O flag"
```

### Modify Rules

```yaml
rules:
  ruff:
    E501:
      illegal: "Lines over 100 characters"  # Changed from 88
      legal: "Break into multiple lines"
      why: "Readability"
```

### Remove Rules

Simply delete rules you don't want.

## Creating Custom Presets

Currently, presets are built into lintent. For custom presets:

1. Run `lintent init`
2. Modify `lintent.yaml` as needed
3. Copy to a shared location
4. Use as a template for new projects
