# Troubleshooting

Common issues and solutions.

## Linter Not Found

### Symptom

```json
{
  "status": "not_found",
  "error": "'ruff' is not installed. Install it with: pip install ruff"
}
```

### Cause

The linter binary isn't in your PATH.

### Solution

Install the linter:

=== "ruff"
    ```bash
    pip install ruff
    # or
    brew install ruff
    ```

=== "pyright"
    ```bash
    pip install pyright
    # or
    npm install -g pyright
    ```

=== "eslint"
    ```bash
    npm install -D eslint
    # or globally
    npm install -g eslint
    ```

=== "typescript"
    ```bash
    npm install -D typescript
    ```

Verify installation:

```bash
which ruff
ruff --version
```

---

## No Linters Detected

### Symptom

```json
{
  "error": true,
  "code": "NO_LINTERS",
  "message": "No linters detected..."
}
```

### Cause

lintent couldn't find linter configuration files.

### Solution

Ensure config files exist:

| Linter | Required File |
|--------|---------------|
| ruff | `pyproject.toml` with `[tool.ruff]` or `ruff.toml` |
| pyright | `pyrightconfig.json` or `[tool.pyright]` in pyproject.toml |
| eslint | `eslint.config.js` or `.eslintrc.*` or eslint in package.json |
| typescript | `tsconfig.json` |

---

## Config Validation Error

### Symptom

```json
{
  "valid": false,
  "errors": [
    { "message": "Rule 'ruff/E501' must have 'legal' string" }
  ]
}
```

### Cause

Your `lintent.yaml` has missing or invalid fields.

### Solution

Each rule needs all three fields:

```yaml
rules:
  ruff:
    E501:
      illegal: "Lines too long"     # Required
      legal: "Break into lines"     # Required
      why: "Readability"            # Required
```

Validate your config:

```bash
lintent validate --pretty
```

---

## Violations Without Semantic Context

### Symptom

```json
{
  "code": "E999",
  "message": "Some error",
  "semantic": null
}
```

### Cause

The rule code isn't defined in `lintent.yaml`.

### Solution

Add the rule to your config:

```yaml
rules:
  ruff:
    E999:
      illegal: "Description of what's wrong"
      legal: "How to fix it"
      why: "Why it matters"
```

Check semantic coverage in summary:

```json
{
  "summary": {
    "with_semantic": 10,
    "without_semantic": 2  // ← These need rules added
  }
}
```

---

## Empty Violations Array

### Symptom

```json
{
  "violations": [],
  "summary": { "total": 0 }
}
```

### Possible Causes

1. **Linter ran but found no issues** - Your code is clean!

2. **Linter failed silently** - Check `linters.results`:
   ```json
   {
     "linters": {
       "results": [
         { "name": "ruff", "status": "error", "error": "..." }
       ]
     }
   }
   ```

3. **Wrong paths** - Linter ran on wrong directory:
   ```yaml
   linters:
     ruff:
       paths: ["./src"]  # Make sure this is correct
   ```

---

## lintent Command Not Found

### Symptom

```bash
lintent: command not found
```

### Solution

Install globally:

```bash
npm install -g lintent
```

Or use npx:

```bash
npx lintent run
```

Check installation:

```bash
npm list -g lintent
```

---

## JSON Parse Errors

### Symptom

Garbled output or parse errors.

### Cause

Linter output wasn't valid JSON.

### Solution

Run the linter directly to check its output:

```bash
ruff check . --output-format json
```

If the linter has issues, fix them first.

---

## Slow Performance

### Symptom

lintent takes too long.

### Causes & Solutions

1. **Large codebase** - Use `paths` to limit scope:
   ```yaml
   linters:
     ruff:
       paths: ["./src"]  # Not entire repo
   ```

2. **Many linters** - Run specific ones:
   ```bash
   lintent run --tool ruff
   ```

3. **Linter itself is slow** - Check individual linter performance:
   ```bash
   time ruff check .
   ```

---

## Getting Help

If you're still stuck:

1. Check the [GitHub Issues](https://github.com/lintent/lintent/issues)
2. Run with `--pretty` to see full output
3. Verify linters work independently first
4. Create an issue with:
   - lintent version (`lintent --version`)
   - OS and Node version
   - Your `lintent.yaml`
   - Full error output
