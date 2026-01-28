# TypeScript Projects Guide

Setting up lintent for TypeScript/JavaScript projects with ESLint and tsc.

## Prerequisites

- Node.js 18+
- ESLint and/or TypeScript installed

## Quick Setup

```bash
# Install lintent
npm install -g lintent

# Install linters (if not already)
npm install -D eslint typescript @typescript-eslint/parser @typescript-eslint/eslint-plugin

# Initialize
lintent init --preset typescript

# Run
lintent run --pretty
```

## Project Structure

```
my-ts-project/
├── package.json
├── tsconfig.json           # TypeScript config
├── eslint.config.js        # ESLint config (flat config)
├── lintent.yaml             # Semantic rules
└── src/
    └── ...
```

## Configure ESLint (Flat Config)

`eslint.config.js`:

```javascript
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "no-console": "warn",
      "prefer-const": "error",
      "eqeqeq": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  }
);
```

## Configure TypeScript

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "strict": true,
    "noImplicitAny": true,
    "noEmit": true
  },
  "include": ["src/**/*"]
}
```

## Customize Semantic Rules

Edit `lintent.yaml`:

```yaml
rules:
  eslint:
    # Preset rules...
    
    # Project-specific
    "@typescript-eslint/explicit-function-return-type":
      illegal: "Function without explicit return type"
      legal: "function foo(): ReturnType { ... }"
      why: "Explicit returns improve documentation and catch errors"
    
    "no-restricted-imports":
      illegal: "Importing from restricted module"
      legal: "Use approved alternatives"
      why: "Maintain architecture boundaries"

  typescript:
    TS2571:
      illegal: "Object is of type 'unknown'"
      legal: "Narrow the type with type guards or assertions"
      why: "Unknown requires explicit narrowing for type safety"
```

## Run for Specific Tools

```bash
# Only ESLint
lintent run --tool eslint

# Only TypeScript
lintent run --tool typescript
```

## Frontend Framework Support

### React

```yaml
rules:
  eslint:
    "react-hooks/rules-of-hooks":
      illegal: "Hooks called conditionally or in loops"
      legal: "Call hooks at the top level of the component"
      why: "React relies on hook call order between renders"
    
    "react-hooks/exhaustive-deps":
      illegal: "Missing dependencies in useEffect/useMemo/useCallback"
      legal: "Include all referenced values in dependency array"
      why: "Stale closures cause subtle bugs"
```

### Next.js

```yaml
rules:
  eslint:
    "@next/next/no-img-element":
      illegal: "Using <img> instead of next/image"
      legal: "Use <Image> from 'next/image'"
      why: "Next Image optimizes loading and layout shift"
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
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm ci
      - run: npm install -g lintent
      
      - run: lintent run
```

## Common Issues

### ESLint Flat Config Not Detected

Ensure you're using `eslint.config.js` (not `.eslintrc.*`).

For legacy config, lintent still detects `.eslintrc.js`, `.eslintrc.json`, etc.

### TypeScript Path Aliases

If you use path aliases in `tsconfig.json`, TypeScript errors may show aliased paths:

```json
{
  "file": "@/components/Button.tsx",
  "line": 10
}
```

This is expected - lintent preserves the paths from linter output.

### ESLint + TypeScript Integration

For best results, use `@typescript-eslint/parser`:

```javascript
// eslint.config.js
import tseslint from "typescript-eslint";

export default tseslint.config(
  // This includes the parser setup
  ...tseslint.configs.recommended,
);
```
