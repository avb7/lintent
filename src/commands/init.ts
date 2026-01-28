import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { outputJson, formatError } from "../output.js";

export interface InitOptions {
  preset?: string;
  pretty?: boolean;
}

/**
 * Create starter lintent.yaml
 */
export async function initCommand(options: InitOptions): Promise<void> {
  const cwd = process.cwd();
  const configPath = join(cwd, "lintent.yaml");
  const preset = options.preset ?? "python";

  // Check if config already exists
  if (existsSync(configPath)) {
    const error = formatError(
      "CONFIG_EXISTS",
      "lintent.yaml already exists. Delete it first if you want to reinitialize."
    );
    console.log(outputJson(error, options.pretty ?? false));
    process.exit(1);
  }

  try {
    // Get preset content
    const presetContent = getPresetContent(preset);
    if (!presetContent) {
      const error = formatError(
        "INVALID_PRESET",
        `Unknown preset '${preset}'. Available: python, typescript`
      );
      console.log(outputJson(error, options.pretty ?? false));
      process.exit(1);
    }

    // Write lintent.yaml
    writeFileSync(configPath, presetContent);

    // Output success with next steps
    const result = {
      created: ["lintent.yaml"],
      preset,
      next_steps: [
        "Install linter: " + (preset === "python" ? "pip install ruff" : "npm install -D eslint"),
        "Run: lintent run --pretty",
        "Optional: lintent guide - get AI agent setup instructions"
      ]
    };
    console.log(outputJson(result, options.pretty ?? false));
  } catch (error) {
    const err = formatError(
      "INIT_ERROR",
      error instanceof Error ? error.message : String(error)
    );
    console.log(outputJson(err, options.pretty ?? false));
    process.exit(1);
  }
}

/**
 * Get preset content by name
 */
function getPresetContent(preset: string): string | null {
  switch (preset) {
    case "python":
      return getPythonPreset();
    case "typescript":
      return getTypescriptPreset();
    default:
      return null;
  }
}

/**
 * Python preset content
 */
function getPythonPreset(): string {
  return `# lintent.yaml - Semantic meaning for lint rules
# Linters are auto-detected from pyproject.toml, pyrightconfig.json, etc.

rules:
  ruff:
    E501:
      illegal: "Lines over 88 characters"
      legal: "Break into multiple lines or extract to named variables"
      why: "Readability - code should fit in viewport without horizontal scrolling"
    
    F401:
      illegal: "Importing modules that are not used"
      legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
      why: "Clean dependency graph, faster startup, clearer code"
    
    F841:
      illegal: "Assigning to a variable that is never read"
      legal: "Use the variable, remove the assignment, or prefix with _ if intentional"
      why: "Dead code indicates logic errors or incomplete refactoring"
    
    I001:
      illegal: "Imports not sorted correctly"
      legal: "Group imports: stdlib, third-party, local. Sort alphabetically within groups"
      why: "Consistent import ordering makes dependencies scannable"
    
    B006:
      illegal: "Mutable default argument in function definition"
      legal: "Use None as default and create mutable inside function"
      why: "Mutable defaults are shared across calls, causing subtle bugs"
    
    C901:
      illegal: "Function is too complex (high cyclomatic complexity)"
      legal: "Break into smaller functions with single responsibilities"
      why: "Complex functions are hard to test, understand, and maintain"

  pyright:
    reportMissingTypeStubs:
      illegal: "Using untyped libraries without acknowledgment"
      legal: "Install type stubs (types-*), use py.typed packages, or add explicit ignore"
      why: "Type boundaries must be explicit for full type safety"
    
    reportUnusedVariable:
      illegal: "Variable declared but never read"
      legal: "Use the variable or prefix with _ to indicate intentional discard"
      why: "Unused variables suggest incomplete logic or dead code"
    
    reportMissingParameterType:
      illegal: "Function parameter without type annotation"
      legal: "Add type hints: def func(param: Type) -> ReturnType"
      why: "Type annotations enable tooling and catch errors at edit time"
    
    reportGeneralTypeIssues:
      illegal: "Type mismatch or incompatible types"
      legal: "Fix the type error or use explicit type narrowing"
      why: "Type errors often indicate logic bugs that would fail at runtime"
`;
}

/**
 * TypeScript preset content
 */
function getTypescriptPreset(): string {
  return `# lintent.yaml - Semantic meaning for lint rules
# Linters are auto-detected from tsconfig.json, eslint.config.js, etc.

rules:
  eslint:
    no-unused-vars:
      illegal: "Variable declared but never read"
      legal: "Remove unused variables or prefix with _ to indicate intentional"
      why: "Dead code clutters the codebase and suggests incomplete logic"
    
    no-console:
      illegal: "console.log or other console methods in production code"
      legal: "Use a proper logger or remove debug statements"
      why: "Console statements are for debugging only, not production"
    
    prefer-const:
      illegal: "Using let for variables that are never reassigned"
      legal: "Use const for values that don't change"
      why: "const signals intent and prevents accidental mutation"
    
    eqeqeq:
      illegal: "Using == or != instead of === or !=="
      legal: "Use strict equality (===) to avoid type coercion"
      why: "Loose equality has surprising coercion rules that cause bugs"
    
    no-var:
      illegal: "Using var to declare variables"
      legal: "Use let or const instead of var"
      why: "var has function scope and hoisting that causes confusion"

  typescript:
    TS2322:
      illegal: "Type mismatch in assignment"
      legal: "Ensure types align or use proper type conversion"
      why: "Type mismatches indicate logic errors that would fail at runtime"
    
    TS2345:
      illegal: "Argument type doesn't match parameter type"
      legal: "Pass correct type or fix function signature"
      why: "Type safety ensures function contracts are honored"
    
    TS7006:
      illegal: "Parameter implicitly has 'any' type"
      legal: "Add explicit type annotation to parameter"
      why: "Explicit types enable tooling and catch errors early"
    
    TS2304:
      illegal: "Cannot find name (undefined variable or missing import)"
      legal: "Import the module or define the variable"
      why: "Referencing undefined names will fail at runtime"
    
    TS2339:
      illegal: "Property does not exist on type"
      legal: "Check type definition or add missing property"
      why: "Accessing non-existent properties indicates wrong type assumption"
`;
}
