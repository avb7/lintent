import { join } from "path";
import { loadConfig, buildRulesMap } from "../config.js";
import { detectLinters, mergeLinterOverrides, runAllLinters } from "../linters/index.js";
import { enrich } from "../enricher.js";
import { formatReport, outputJson, formatError } from "../output.js";

export interface RunOptions {
  config?: string;
  tool?: string;
  pretty?: boolean;
}

/**
 * Run all linters and output enriched report
 */
export async function runCommand(options: RunOptions): Promise<void> {
  const cwd = process.cwd();
  const configPath = options.config ?? join(cwd, "lintent.yaml");

  try {
    // Load config
    const config = loadConfig(configPath);
    const rulesMap = buildRulesMap(config);

    // Detect linters
    let linters = detectLinters(cwd);
    const detectedNames = linters.map((l) => l.name);

    // Merge with config overrides
    linters = mergeLinterOverrides(linters, config.linters);

    // Filter by tool if specified
    if (options.tool) {
      linters = linters.filter((l) => l.name === options.tool);
      if (linters.length === 0) {
        const error = formatError(
          "LINTER_NOT_FOUND",
          `Linter '${options.tool}' not found or not configured`
        );
        console.log(outputJson(error, options.pretty ?? false));
        process.exit(1);
      }
    }

    // Check if any linters were detected
    if (linters.length === 0) {
      const error = formatError(
        "NO_LINTERS",
        "No linters detected. To fix: 1) Install a linter (pip install ruff, npm install eslint), 2) Create config file (pyproject.toml, eslint.config.js), 3) Run 'lintent init' to create lintent.yaml"
      );
      console.log(outputJson(error, options.pretty ?? false));
      process.exit(1);
    }

    // Run all linters
    const linterResults = await runAllLinters(linters, cwd);

    // Collect all violations from successful runs
    const allViolations = linterResults.flatMap((r) => r.violations);

    // Enrich with semantic rules
    const enriched = enrich(allViolations, rulesMap);

    // Format and output report with full context
    const report = formatReport(enriched, linterResults, detectedNames);
    console.log(outputJson(report, options.pretty ?? false));

    // Exit with non-zero if there are violations or linter errors
    const hasErrors = linterResults.some((r) => r.status === "error" || r.status === "not_found");
    if (allViolations.length > 0 || hasErrors) {
      process.exit(1);
    }
  } catch (error) {
    const err = formatError(
      "RUNTIME_ERROR",
      error instanceof Error ? error.message : String(error)
    );
    console.log(outputJson(err, options.pretty ?? false));
    process.exit(1);
  }
}
