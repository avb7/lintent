# Auto-Detection

lintent automatically finds and runs linters based on your existing configuration files.

## How Detection Works

When you run `lintent run`, it scans your project root for known config files:

| Config File | Linter | Command |
|-------------|--------|---------|
| `pyproject.toml` with `[tool.ruff]` | ruff | `ruff check --output-format json` |
| `ruff.toml` | ruff | `ruff check --output-format json` |
| `pyrightconfig.json` | pyright | `pyright --outputjson` |
| `pyproject.toml` with `[tool.pyright]` | pyright | `pyright --outputjson` |
| `eslint.config.js` | eslint | `eslint --format json` |
| `.eslintrc.*` | eslint | `eslint --format json` |
| `package.json` with eslint dep | eslint | `eslint --format json` |
| `tsconfig.json` | typescript | `tsc --noEmit --pretty false` |

## Zero Configuration Required

If you have a Python project with `pyproject.toml`:

```toml
[tool.ruff]
line-length = 88
select = ["E", "F", "I"]
```

Just run:

```bash
lintent run
```

lintent will:
1. Find `pyproject.toml`
2. Detect `[tool.ruff]` section
3. Run `ruff check --output-format json`
4. Parse and enrich the output

## Detection Priority

If multiple config files exist for the same linter, lintent uses the first found:

1. Dedicated config file (`ruff.toml`, `pyrightconfig.json`)
2. `pyproject.toml` section
3. Package manager detection (`package.json` dependencies)

## Checking What's Detected

Run lintent to see detected linters:

```bash
lintent run --pretty
```

```json
{
  "linters": {
    "detected": ["ruff", "pyright"],
    "results": [
      { "name": "ruff", "status": "success", "violations_count": 5 },
      { "name": "pyright", "status": "not_found", "error": "..." }
    ]
  }
}
```

- `detected`: Linters found from config files
- `results`: What happened when running them

## Overriding Detection

For monorepos or custom setups, override in `lintent.yaml`:

```yaml
linters:
  ruff:
    paths: ["./backend/src"]  # Only lint backend
  
  eslint:
    config: "./frontend/.eslintrc.js"
    paths: ["./frontend/src"]
  
  pyright:
    enabled: false  # Disable even if config exists

rules:
  # ... semantic rules
```

### Override Options

| Option | Description |
|--------|-------------|
| `enabled` | `true`/`false` - Force enable or disable |
| `config` | Path to linter's config file |
| `paths` | Array of paths to lint |

## When Detection Fails

If a linter config exists but the linter isn't installed:

```json
{
  "name": "ruff",
  "status": "not_found",
  "error": "'ruff' is not installed. Install it with: pip install ruff"
}
```

lintent continues with other linters - one failure doesn't stop the run.

## Supported Linters

### Currently Supported

| Language | Linters |
|----------|---------|
| Python | ruff, pyright |
| JavaScript/TypeScript | eslint, tsc |

### Coming Soon

We're actively working on support for:

| Language | Linter | Status |
|----------|--------|--------|
| Rust | clippy | Planned |
| Go | golangci-lint | Planned |
| Java | checkstyle | Planned |
| C/C++ | clang-tidy | Planned |
| Ruby | rubocop | Planned |

Want to help? Check the [Developer Guide](https://github.com/lintent/lintent/blob/main/DEVGUIDE.md) for how to add new linter support.

## Adding New Linters

New linters can be added by implementing a parser module. The process:

1. Create a parser for the linter's output
2. Add detection logic for config files
3. Register the parser in the runner

See [DEVGUIDE.md](https://github.com/lintent/lintent/blob/main/DEVGUIDE.md) for detailed instructions.
