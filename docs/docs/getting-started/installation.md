# Installation

lintent is distributed as an npm package and works with Node.js 18+.

## Install Globally

```bash
npm install -g lintent
```

Verify the installation:

```bash
lintent --version
```

## Run Without Installing

Use `npx` to run lintent directly:

```bash
npx lintent run
```

## Install Linters

lintent runs your linters - it doesn't replace them. Install the linters you need:

=== "Python"

    ```bash
    # ruff - Fast Python linter
    pip install ruff
    
    # pyright - Python type checker (optional)
    pip install pyright
    # or
    npm install -g pyright
    ```

=== "TypeScript"

    ```bash
    # ESLint
    npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
    
    # TypeScript compiler (for type checking)
    npm install -D typescript
    ```

## Verify Setup

Check that lintent can detect your linters:

```bash
lintent run --pretty
```

If linters aren't installed, you'll see helpful messages:

```json
{
  "linters": {
    "detected": ["ruff"],
    "results": [
      {
        "name": "ruff",
        "status": "not_found",
        "error": "'ruff' is not installed. Install it with: pip install ruff"
      }
    ]
  }
}
```

## Next Steps

- [Quick Start →](quick-start.md) - Run your first lint check
- [Configuration →](configuration.md) - Set up `lintent.yaml`
