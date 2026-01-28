# CLI Reference

Complete reference for all lintent commands.

## Global Options

```bash
lintent [command] [options]
```

| Option | Description |
|--------|-------------|
| `-V, --version` | Output version number |
| `-h, --help` | Display help |

---

## `lintent run`

Run all detected linters and output enriched report.

```bash
lintent run [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <path>` | Path to lintent.yaml | `./lintent.yaml` |
| `-t, --tool <name>` | Run only specific linter | all detected |
| `-p, --pretty` | Pretty-print JSON output | compact |

### Examples

```bash
# Run all linters
lintent run

# Pretty-print output
lintent run --pretty

# Run only ruff
lintent run --tool ruff

# Use custom config
lintent run --config ./configs/lintent.yaml
```

### Output

```json
{
  "violations": [
    {
      "file": "src/main.py",
      "line": 3,
      "column": 8,
      "tool": "ruff",
      "code": "F401",
      "message": "`os` imported but unused",
      "semantic": {
        "illegal": "Importing modules that are not used",
        "legal": "Only import what you use",
        "why": "Clean dependency graph"
      }
    }
  ],
  "linters": {
    "detected": ["ruff", "pyright"],
    "results": [
      { "name": "ruff", "status": "success", "violations_count": 5 },
      { "name": "pyright", "status": "not_found", "error": "..." }
    ]
  },
  "summary": {
    "total": 5,
    "with_semantic": 5,
    "without_semantic": 0,
    "by_tool": { "ruff": 5 },
    "files_affected": 2
  }
}
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | No violations, all linters succeeded |
| 1 | Violations found or linter errors |

---

## `lintent init`

Create starter `lintent.yaml` with preset rules.

```bash
lintent init [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `--preset <name>` | Preset to use | `python` |

### Available Presets

| Preset | Linters | Description |
|--------|---------|-------------|
| `python` | ruff, pyright | Python projects |
| `typescript` | eslint, tsc | TypeScript/JavaScript projects |

### Examples

```bash
# Initialize with Python preset
lintent init --preset python

# Initialize with TypeScript preset
lintent init --preset typescript
```

### Output

```json
{
  "created": ["lintent.yaml"],
  "preset": "python"
}
```

### Created File

**lintent.yaml**
```yaml
rules:
  ruff:
    E501:
      illegal: "Lines over 88 characters"
      legal: "Break into multiple lines"
      why: "Readability"
    # ... more rules
```

---

## `lintent validate`

Validate `lintent.yaml` structure.

```bash
lintent validate [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <path>` | Path to lintent.yaml | `./lintent.yaml` |
| `-p, --pretty` | Pretty-print JSON output | compact |

### Examples

```bash
lintent validate --pretty
```

### Output (Valid)

```json
{
  "valid": true,
  "linters": ["ruff", "pyright"],
  "rules_count": 10
}
```

### Output (Invalid)

```json
{
  "valid": false,
  "errors": [
    { "message": "Rule 'ruff/E501' must have 'legal' string" }
  ]
}
```

---

## `lintent list`

List all defined semantic rules.

```bash
lintent list [options]
```

### Options

| Option | Description | Default |
|--------|-------------|---------|
| `-c, --config <path>` | Path to lintent.yaml | `./lintent.yaml` |
| `-p, --pretty` | Pretty-print JSON output | compact |

### Examples

```bash
lintent list --pretty
```

### Output

```json
{
  "rules": [
    { "tool": "ruff", "code": "E501" },
    { "tool": "ruff", "code": "F401" },
    { "tool": "pyright", "code": "reportMissingParameterType" }
  ],
  "count": 3
}
```

---

## `lintent guide`

Output AI agent guides for setup, fixing, and configuration.

```bash
lintent guide [topic]
```

### Topics

| Topic | Description |
|-------|-------------|
| *(none)* | General AI agent guide with project status |
| `setup` | How to set up lintent in a project |
| `fix` | How to properly fix violations |
| `config` | How to configure lintent.yaml |
| `rules` | How to write good semantic rules |
| `customize` | **Interactive**: Analyze codebase and create project-specific rules |

### Examples

```bash
# Get general guide (includes project context)
lintent guide

# Get setup instructions
lintent guide setup

# Get fix guide
lintent guide fix

# Interactive: create project-specific rules
lintent guide customize

# Pipe to clipboard (macOS)
lintent guide | pbcopy
```

### Output

Markdown-formatted guide that can be:
- Injected into AI agent prompts
- Added to Cursor rules
- Used as documentation

---

## Error Output

All commands use consistent error format:

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
| `CONFIG_NOT_FOUND` | lintent.yaml doesn't exist |
| `CONFIG_INVALID` | lintent.yaml has structural errors |
| `LINTER_NOT_FOUND` | Specified linter not detected |
| `NO_LINTERS` | No linters detected in project |
| `RUNTIME_ERROR` | Unexpected error during execution |
