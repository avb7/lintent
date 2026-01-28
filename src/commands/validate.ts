import { join } from "path";
import { existsSync } from "fs";
import { loadConfig, getRuleKeys } from "../config.js";
import { outputJson, formatError } from "../output.js";

export interface ValidateOptions {
  config?: string;
  pretty?: boolean;
}

/**
 * Validate lintent.yaml structure
 */
export async function validateCommand(options: ValidateOptions): Promise<void> {
  const cwd = process.cwd();
  const configPath = options.config ?? join(cwd, "lintent.yaml");

  // Check if config exists
  if (!existsSync(configPath)) {
    const error = formatError(
      "CONFIG_NOT_FOUND",
      `Config file not found: ${configPath}`
    );
    console.log(outputJson(error, options.pretty ?? false));
    process.exit(1);
  }

  try {
    // Try to load and validate config
    const config = loadConfig(configPath);
    const rules = getRuleKeys(config);

    // Get list of tools
    const tools = [...new Set(rules.map((r) => r.tool))];

    const result = {
      valid: true,
      linters: tools,
      rules_count: rules.length,
    };
    console.log(outputJson(result, options.pretty ?? false));
  } catch (error) {
    const result = {
      valid: false,
      errors: [
        {
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
    console.log(outputJson(result, options.pretty ?? false));
    process.exit(1);
  }
}
