# Developer Guide

Guide for contributors adding new linter support to lintent.

## Architecture Overview

```
src/
├── index.ts              # CLI entry point (commander)
├── config.ts             # Load and validate lintent.yaml
├── enricher.ts           # Add semantic context to violations
├── output.ts             # Format JSON output
├── commands/
│   ├── run.ts            # Main run command
│   ├── init.ts           # Initialize config
│   ├── validate.ts       # Validate config
│   └── list.ts           # List rules
└── linters/
    ├── types.ts          # Core interfaces
    ├── detector.ts       # Auto-detect linters from config
    ├── runner.ts         # Execute linters
    ├── ruff.ts           # Ruff output parser
    ├── pyright.ts        # Pyright output parser
    ├── eslint.ts         # ESLint output parser
    └── typescript.ts     # TypeScript output parser
```

## Adding a New Linter

### Step 1: Create the Parser

Create `src/linters/<lintername>.ts`:

```typescript
import type { LinterViolation } from "./types.js";

// Define the shape of the linter's JSON output
interface LinterJsonOutput {
  // ... matches the linter's actual output
}

export function parseLinterOutput(output: string): LinterViolation[] {
  // Handle empty output
  if (!output.trim()) {
    return [];
  }

  try {
    const data: LinterJsonOutput[] = JSON.parse(output);
    
    // Transform to common format
    return data.map((item) => ({
      file: item.filename,
      line: item.line,
      column: item.column,
      tool: "lintername",
      code: item.rule_id,
      message: item.message,
    }));
  } catch {
    // Return empty if parse fails
    return [];
  }
}
```

#### Key Requirements

1. **Handle empty output** - Return `[]`, don't throw
2. **Handle parse errors** - Return `[]` or partial results
3. **Normalize to `LinterViolation`**:

```typescript
interface LinterViolation {
  file: string;      // File path
  line: number;      // 1-indexed line number
  column: number;    // 1-indexed column (use 1 if not provided)
  tool: string;      // Linter name (must match detector)
  code: string;      // Rule code (e.g., "E501", "no-unused-vars")
  message: string;   // Human-readable message
}
```

### Step 2: Add Detection Logic

Update `src/linters/detector.ts`:

```typescript
// Add to imports
import { existsSync } from "fs";
import { join } from "path";

// Add detection function
function detectNewLinter(cwd: string): DetectedLinter | null {
  const configPaths = [
    "newlinter.config.js",
    ".newlinterrc.json",
    ".newlinterrc",
  ];
  
  for (const configPath of configPaths) {
    if (existsSync(join(cwd, configPath))) {
      return {
        name: "newlinter",
        command: "newlinter",
        args: ["--format", "json", "."],  // JSON output is required
        configPath,
      };
    }
  }
  
  return null;
}

// Add to detectLinters function
export function detectLinters(cwd: string): DetectedLinter[] {
  const linters: DetectedLinter[] = [];
  
  // ... existing detectors ...
  
  const newlinter = detectNewLinter(cwd);
  if (newlinter) linters.push(newlinter);
  
  return linters;
}
```

#### Detection Guidelines

1. **Check for config files** - Most linters have config files
2. **Use JSON output** - Essential for parsing
3. **Set correct args** - Match linter's CLI for JSON output
4. **Handle alternatives** - Some linters have multiple config formats

### Step 3: Register the Parser

Update `src/linters/runner.ts`:

```typescript
// Add import
import { parseNewLinterOutput } from "./newlinter.js";

// Add to switch statement in runLinter()
function parseOutput(linter: DetectedLinter, output: string): LinterViolation[] {
  switch (linter.name) {
    case "ruff":
      return parseRuffOutput(output);
    case "pyright":
      return parsePyrightOutput(output);
    case "eslint":
      return parseEslintOutput(output);
    case "typescript":
      return parseTypescriptOutput(output);
    case "newlinter":  // Add this
      return parseNewLinterOutput(output);
    default:
      return [];
  }
}
```

### Step 4: Export the Parser

Update `src/linters/index.ts`:

```typescript
export * from "./newlinter.js";
```

### Step 5: Add a Preset (Optional)

Create `presets/newlang.yaml`:

```yaml
rules:
  newlinter:
    RULE001:
      illegal: "Description of what's wrong"
      legal: "What correct code looks like"
      why: "Reasoning behind the rule"
    
    RULE002:
      illegal: "..."
      legal: "..."
      why: "..."
```

Update `src/commands/init.ts` to include the preset.

### Step 6: Add Tests

Create `src/linters/__tests__/newlinter.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { parseNewLinterOutput } from "../newlinter.js";

describe("parseNewLinterOutput", () => {
  it("parses valid output", () => {
    const output = JSON.stringify([
      {
        filename: "src/main.ts",
        line: 10,
        column: 5,
        rule_id: "RULE001",
        message: "Some error",
      },
    ]);

    const violations = parseNewLinterOutput(output);

    expect(violations).toHaveLength(1);
    expect(violations[0]).toEqual({
      file: "src/main.ts",
      line: 10,
      column: 5,
      tool: "newlinter",
      code: "RULE001",
      message: "Some error",
    });
  });

  it("handles empty output", () => {
    expect(parseNewLinterOutput("")).toEqual([]);
    expect(parseNewLinterOutput("  ")).toEqual([]);
  });

  it("handles invalid JSON", () => {
    expect(parseNewLinterOutput("not json")).toEqual([]);
  });
});
```

### Step 7: Update Documentation

1. **README.md** - Add to supported linters table
2. **docs/docs/concepts/auto-detection.md** - Add detection info
3. **docs/docs/reference/presets.md** - Add preset if created

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/linters/__tests__/newlinter.test.ts

# Run with coverage
npm test -- --coverage
```

## Building

```bash
# Build
npm run build

# Test CLI locally
node dist/index.js run --pretty
```

## Common Linter Output Formats

### JSON Array (ruff, eslint)

```json
[
  { "file": "...", "line": 1, "rule": "E501", "message": "..." }
]
```

### Nested Object (pyright)

```json
{
  "generalDiagnostics": [
    { "file": "...", "range": { "start": { "line": 0 } }, "rule": "...", "message": "..." }
  ]
}
```

### Line-based Text (tsc)

```
src/main.ts(10,5): error TS2322: Type mismatch
```

For text output, use regex parsing (see `typescript.ts`).

## Code Style

- Use TypeScript strict mode
- Handle all edge cases (empty input, parse errors)
- Export only what's needed
- Follow existing patterns in codebase

## Checklist for New Linter Support

- [ ] Parser created in `src/linters/<name>.ts`
- [ ] Parser handles empty output
- [ ] Parser handles invalid JSON
- [ ] Detection added to `detector.ts`
- [ ] Parser registered in `runner.ts`
- [ ] Parser exported in `index.ts`
- [ ] Tests written and passing
- [ ] Preset created (optional but recommended)
- [ ] Documentation updated
- [ ] README updated

## Getting Help

- Open an issue for questions
- Check existing parsers for examples
- Run `npm test` to verify changes
