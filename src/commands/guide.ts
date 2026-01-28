import { existsSync, readFileSync } from "fs";
import { join } from "path";

export interface GuideOptions {
  topic?: string;
}

/**
 * Output AI agent guides
 */
export async function guideCommand(topic?: string): Promise<void> {
  const guide = generateGuide(topic);
  console.log(guide);
}

/**
 * Generate guide based on topic
 */
function generateGuide(topic?: string): string {
  switch (topic) {
    case "setup":
      return getSetupGuide();
    case "fix":
      return getFixGuide();
    case "config":
      return getConfigGuide();
    case "rules":
      return getRulesGuide();
    case "customize":
      return getCustomizeGuide();
    default:
      return getMainGuide();
  }
}

/**
 * Get current project context
 */
function getProjectContext(): {
  hasConfig: boolean;
  ruleCount: number;
  detectedLinters: string[];
} {
  const cwd = process.cwd();
  const configPath = join(cwd, "lintent.yaml");
  
  let hasConfig = false;
  let ruleCount = 0;
  const detectedLinters: string[] = [];

  if (existsSync(configPath)) {
    hasConfig = true;
    try {
      const content = readFileSync(configPath, "utf-8");
      // Simple rule counting
      const matches = content.match(/^\s{4}\w+:/gm);
      ruleCount = matches ? matches.length : 0;
      
      // Detect linters in config
      if (content.includes("ruff:")) detectedLinters.push("ruff");
      if (content.includes("pyright:")) detectedLinters.push("pyright");
      if (content.includes("eslint:")) detectedLinters.push("eslint");
      if (content.includes("typescript:")) detectedLinters.push("typescript");
    } catch {
      // Ignore parsing errors
    }
  }

  // Check for project files
  if (existsSync(join(cwd, "pyproject.toml")) || existsSync(join(cwd, "requirements.txt"))) {
    if (!detectedLinters.includes("ruff")) detectedLinters.push("ruff (available)");
  }
  if (existsSync(join(cwd, "package.json")) || existsSync(join(cwd, "tsconfig.json"))) {
    if (!detectedLinters.includes("eslint")) detectedLinters.push("eslint (available)");
  }

  return { hasConfig, ruleCount, detectedLinters };
}

/**
 * Main guide for AI agents
 */
function getMainGuide(): string {
  const ctx = getProjectContext();
  
  return `# lintent - AI Agent Guide

## What is lintent?

lintent wraps your existing linters (ruff, eslint, pyright, tsc) and enriches each 
violation with semantic context: what's wrong, how to fix it, and why it matters.

## Quick Commands

\`\`\`bash
lintent run --pretty    # Run linters and get enriched output
lintent init            # Create lintent.yaml config
lintent validate        # Check config validity
lintent list            # List all semantic rules
\`\`\`

## Understanding Output

Each violation includes a \`semantic\` object:

\`\`\`json
{
  "code": "F401",
  "message": "\`os\` imported but unused",
  "semantic": {
    "illegal": "Importing modules that are not used",
    "legal": "Only import what you use, or mark with # noqa if for side-effects",
    "why": "Clean dependency graph, faster startup"
  }
}
\`\`\`

- **illegal**: What pattern triggered the error
- **legal**: What correct code looks like (including valid exceptions!)
- **why**: The reasoning behind the rule

## Fixing Violations Properly

1. **Read \`semantic.legal\`** - It shows the correct pattern AND exceptions
2. **Read \`semantic.why\`** - Understand the principle behind the rule
3. **Check for exceptions** - "or # noqa if for side-effects" means there's a valid case
4. **Fix with understanding** - Don't just silence errors mechanically
5. **Re-run \`lintent run\`** - Verify the fix worked

## Current Project Status

${ctx.hasConfig 
  ? `- Config: lintent.yaml found (${ctx.ruleCount} rules defined)` 
  : "- Config: No lintent.yaml found. Run \`lintent init\` to create one."}
- Detected linters: ${ctx.detectedLinters.length > 0 ? ctx.detectedLinters.join(", ") : "none detected"}

## More Guides

- \`lintent guide setup\` - How to set up lintent in a new project
- \`lintent guide fix\` - How to properly fix violations
- \`lintent guide config\` - How to configure lintent.yaml
- \`lintent guide rules\` - How to write good semantic rules
- \`lintent guide customize\` - **Interactive**: Help analyze codebase and create project-specific rules
`;
}

/**
 * Setup guide
 */
function getSetupGuide(): string {
  const ctx = getProjectContext();
  
  // Detect project type
  const cwd = process.cwd();
  const hasPython = existsSync(join(cwd, "pyproject.toml")) || 
                    existsSync(join(cwd, "requirements.txt")) ||
                    existsSync(join(cwd, "setup.py"));
  const hasTypeScript = existsSync(join(cwd, "tsconfig.json")) ||
                        existsSync(join(cwd, "package.json"));
  
  let preset = "python";
  let projectType = "Python";
  if (hasTypeScript && !hasPython) {
    preset = "typescript";
    projectType = "TypeScript/JavaScript";
  } else if (hasTypeScript && hasPython) {
    projectType = "Python + TypeScript";
  }

  return `# lintent Setup Guide

## Detected Project Type: ${projectType}

## Step 1: Install lintent

\`\`\`bash
npm install -g lintent
\`\`\`

## Step 2: Initialize Configuration

${ctx.hasConfig 
  ? "✓ lintent.yaml already exists in this project." 
  : `Run this command to create lintent.yaml:

\`\`\`bash
lintent init --preset ${preset}
\`\`\``}

## Step 3: Install Linters

${hasPython ? `### Python Linters
\`\`\`bash
pip install ruff      # Fast Python linter (recommended)
pip install pyright   # Type checker (optional but recommended)
\`\`\`` : ""}

${hasTypeScript ? `### TypeScript/JavaScript Linters
\`\`\`bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D typescript  # If not already installed
\`\`\`` : ""}

## Step 4: Run lintent

\`\`\`bash
lintent run --pretty
\`\`\`

## Step 5: (Optional) Add Cursor Integration

Create \`.cursor/rules/lintent.mdc\`:

\`\`\`markdown
---
description: Use lintent for semantic linting
globs: ["**/*.py", "**/*.ts", "**/*.tsx", "**/*.js"]
alwaysApply: true
---

# Linting with lintent

When fixing lint errors, run \`lintent run --pretty\` and read the semantic context.
Each violation includes:
- \`illegal\`: What's wrong
- \`legal\`: How to fix (including exceptions)
- \`why\`: The reasoning

Fix with understanding, not mechanically.
\`\`\`

## Verification

After setup, run:
\`\`\`bash
lintent validate --pretty  # Check config is valid
lintent run --pretty       # Run linters
\`\`\`
`;
}

/**
 * Fix guide
 */
function getFixGuide(): string {
  return `# lintent Fix Guide

## How to Properly Fix Lint Violations

### Step 1: Run lintent

\`\`\`bash
lintent run --pretty
\`\`\`

### Step 2: For Each Violation

Read the three semantic fields carefully:

\`\`\`json
{
  "semantic": {
    "illegal": "What pattern triggered the error",
    "legal": "What correct code looks like",
    "why": "The reasoning behind the rule"
  }
}
\`\`\`

### Step 3: Check for Exceptions

The \`legal\` field often includes valid exceptions:

\`\`\`
"legal": "Only import what you use, or mark with # noqa if for side-effects"
\`\`\`

The "or" indicates a valid exception. Don't blindly apply the first option.

### Step 4: Understand the Principle

Use \`why\` to make judgment calls:

\`\`\`
"why": "Clean dependency graph, faster startup"
\`\`\`

This tells you: removing is better than silencing, because the goal is clean deps.

### Step 5: Apply the Fix

Based on understanding:
- If import is truly unused → remove it
- If it's a side-effect import → add \`# noqa: F401\` with comment explaining why
- If unsure → check if removing breaks anything

### Step 6: Verify

\`\`\`bash
lintent run --pretty  # Should show fewer violations
\`\`\`

## Common Patterns

### Unused Import (F401)
\`\`\`python
# Wrong: blindly deleting
import os  # Removed

# Right: checking if it's for side effects
import matplotlib  # noqa: F401 - sets up backend
\`\`\`

### Mutable Default (B006)
\`\`\`python
# Wrong
def process(items=[]):
    items.append("done")

# Right (from semantic.legal)
def process(items=None):
    if items is None:
        items = []
    items.append("done")
\`\`\`

### Missing Type (TS7006)
\`\`\`typescript
// Wrong
function greet(name) { return \`Hello \${name}\`; }

// Right (from semantic.legal)
function greet(name: string): string { return \`Hello \${name}\`; }
\`\`\`

## Violations Without Semantic Context

If \`semantic\` is \`null\`, the rule isn't in lintent.yaml. You can:
1. Add it to lintent.yaml (see \`lintent guide rules\`)
2. Look up the rule in linter documentation
3. Use the raw message to fix
`;
}

/**
 * Config guide
 */
function getConfigGuide(): string {
  return `# lintent Configuration Guide

## File Structure

\`lintent.yaml\` defines semantic meaning for lint rules:

\`\`\`yaml
rules:
  <linter>:
    <rule_code>:
      illegal: "What pattern is wrong"
      legal: "What correct code looks like"
      why: "The reasoning behind the rule"
\`\`\`

## Available Linters

| Linter | Language | Example codes |
|--------|----------|---------------|
| ruff | Python | E501, F401, B006, I001 |
| pyright | Python | reportMissingTypeStubs, reportUnusedVariable |
| eslint | JS/TS | no-unused-vars, no-console, prefer-const |
| typescript | TS | TS2322, TS2345, TS7006 |

## Example Configuration

\`\`\`yaml
rules:
  ruff:
    F401:
      illegal: "Importing modules that are not used"
      legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
      why: "Clean dependency graph, faster startup"
    
    B006:
      illegal: "Mutable default argument in function definition"
      legal: "Use None as default and create mutable inside function"
      why: "Mutable defaults are shared across calls, causing subtle bugs"

  eslint:
    no-console:
      illegal: "console.log or other console methods in production code"
      legal: "Use a proper logger or remove debug statements"
      why: "Console statements are for debugging only, not production"
\`\`\`

## Adding Project-Specific Rules

Customize for your codebase:

\`\`\`yaml
rules:
  ruff:
    PLR0913:
      illegal: "Function with more than 5 arguments"
      legal: "Group into dataclass, TypedDict, or use **kwargs for builders"
      why: "Many args = function doing too much, hard to test"
    
    # Your project prefers explicit over implicit
    ANN001:
      illegal: "Function argument without type annotation"
      legal: "All public functions must have type hints"
      why: "Our codebase requires full type coverage for maintainability"
\`\`\`

## Validation

Check your config is valid:

\`\`\`bash
lintent validate --pretty
\`\`\`

## See Your Rules

List all defined rules:

\`\`\`bash
lintent list --pretty
\`\`\`
`;
}

/**
 * Rules writing guide
 */
function getRulesGuide(): string {
  return `# Writing Good Semantic Rules

## The Three Fields

Every rule needs three fields that help AI agents understand the rule:

### 1. illegal

**What it is:** Describe the bad pattern clearly and specifically.

❌ Bad:
\`\`\`yaml
illegal: "Bad code"
illegal: "Don't do this"
illegal: "Error"
\`\`\`

✅ Good:
\`\`\`yaml
illegal: "Function with more than 5 arguments"
illegal: "Mutable default argument in function definition"
illegal: "Using == instead of === for comparison"
\`\`\`

### 2. legal

**What it is:** Show what correct code looks like, INCLUDING EXCEPTIONS.

❌ Bad:
\`\`\`yaml
legal: "Fix it"
legal: "Don't do the bad thing"
\`\`\`

✅ Good:
\`\`\`yaml
legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
legal: "Use None as default and create mutable inside function"
legal: "Group into dataclass, or use **kwargs for flexible APIs"
\`\`\`

**Key:** The "or" clauses tell agents about valid exceptions!

### 3. why

**What it is:** The principle behind the rule. Helps agents make judgment calls.

❌ Bad:
\`\`\`yaml
why: "It's bad practice"
why: "Style guide says so"
why: "Linter error"
\`\`\`

✅ Good:
\`\`\`yaml
why: "Mutable defaults are shared across calls, causing subtle bugs"
why: "Clean dependency graph, faster startup, clearer code"
why: "Type safety ensures function contracts are honored"
\`\`\`

## Complete Examples

### Python (ruff)
\`\`\`yaml
rules:
  ruff:
    E501:
      illegal: "Lines over 88 characters"
      legal: "Break into multiple lines or extract to named variables"
      why: "Readability - code should fit in viewport without scrolling"
    
    F401:
      illegal: "Importing modules that are not used"
      legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
      why: "Clean dependency graph, faster startup, clearer code"
\`\`\`

### TypeScript (eslint)
\`\`\`yaml
rules:
  eslint:
    prefer-const:
      illegal: "Using let for variables that are never reassigned"
      legal: "Use const for values that don't change"
      why: "const signals intent and prevents accidental mutation"
    
    eqeqeq:
      illegal: "Using == or != instead of === or !=="
      legal: "Use strict equality (===) to avoid type coercion"
      why: "Loose equality has surprising coercion rules that cause bugs"
\`\`\`

## Testing Your Rules

1. Add rule to lintent.yaml
2. Run \`lintent validate --pretty\` - check for errors
3. Run \`lintent run --pretty\` - see if violations get semantic context
4. Check \`with_semantic\` vs \`without_semantic\` in summary
`;
}

/**
 * Interactive customize guide for AI agents
 */
function getCustomizeGuide(): string {
  const ctx = getProjectContext();
  
  const configStatus = ctx.hasConfig 
    ? `- Config: lintent.yaml found (${ctx.ruleCount} rules)
- Run \`lintent run --pretty\` to find violations without semantic context`
    : `- Config: No lintent.yaml found
- Run \`lintent init --preset <python|typescript>\` first`;

  return `# Interactive Rules Setup Guide

## For AI Agents: Help Users Create Project-Specific Rules

This guide walks you through analyzing a codebase and creating custom semantic rules.

## Step 1: Run lintent and Find Gaps

\`\`\`bash
lintent run --pretty
\`\`\`

Look at the output:
- \`summary.with_semantic\`: violations that have rules
- \`summary.without_semantic\`: violations that NEED rules

## Step 2: Identify Violations Without Semantic Context

For each violation where \`semantic\` is null:

\`\`\`json
{
  "code": "PLR0913",
  "message": "Too many arguments in function definition (6 > 5)",
  "semantic": null
}
\`\`\`

The null semantic means this rule needs to be added to lintent.yaml.

## Step 3: Analyze the Codebase Pattern

Before writing a rule, understand the project's conventions:

1. **Search for similar patterns**: How does this codebase handle this elsewhere?
2. **Check existing code**: What's the "legal" pattern already in use?
3. **Ask the user**: "I see you have functions with many args. Do you prefer dataclasses, **kwargs, or builder pattern?"

## Step 4: Create the Rule

Add to lintent.yaml:

\`\`\`yaml
rules:
  <linter>:
    <code>:
      illegal: "<describe what triggers this - be specific>"
      legal: "<show correct pattern from THIS codebase, include exceptions>"
      why: "<project-specific reasoning>"
\`\`\`

### Example Workflow

**Violation found:**
\`\`\`
code: "no-console"
message: "Unexpected console statement"
\`\`\`

**Agent analysis:**
1. Search codebase for console usage patterns
2. Find: Some console.logs are in debug utilities, others are mistakes
3. Check if project has a logger

**Ask user:**
"I found console.log usage. Do you have a preferred logger? Should debug utils be exempt?"

**Create rule based on response:**
\`\`\`yaml
eslint:
  no-console:
    illegal: "console.log in production code"
    legal: "Use logger.debug() for debugging, logger.info() for user messages. Console OK in scripts/"
    why: "Structured logging enables filtering and monitoring in production"
\`\`\`

## Step 5: Validate and Test

\`\`\`bash
lintent validate --pretty  # Check syntax
lintent run --pretty       # Verify violations now have semantic context
\`\`\`

## Current Project Status

${configStatus}

## Interactive Prompts for Users

When helping a user set up rules, ask:

1. **"What linter violations do you see most often?"**
   → Prioritize rules for common violations

2. **"Are there exceptions to this rule in your codebase?"**
   → Include "or <exception>" in the legal field

3. **"Why does your team care about this rule?"**
   → Use their words in the why field for team buy-in

4. **"Show me an example of the correct pattern in your code"**
   → Use real code patterns in the legal field

## Full Customization Workflow

\`\`\`
1. lintent run --pretty              # Find violations
2. Identify violations with semantic: null
3. For each:
   a. Search codebase for patterns
   b. Ask user about conventions
   c. Write rule with project-specific context
   d. Add to lintent.yaml
4. lintent validate --pretty         # Verify
5. lintent run --pretty              # Confirm coverage improved
\`\`\`
`;
}
