import { join } from "path";
import { existsSync } from "fs";
import { loadConfig, getRuleKeys } from "../config.js";
import { outputJson, formatError } from "../output.js";

export interface ListOptions {
  config?: string;
  pretty?: boolean;
}

/**
 * List all defined semantic rules
 */
export async function listCommand(options: ListOptions): Promise<void> {
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
    const config = loadConfig(configPath);
    const rules = getRuleKeys(config);

    const result = {
      rules,
      count: rules.length,
    };
    console.log(outputJson(result, options.pretty ?? false));
  } catch (error) {
    const err = formatError(
      "RUNTIME_ERROR",
      error instanceof Error ? error.message : String(error)
    );
    console.log(outputJson(err, options.pretty ?? false));
    process.exit(1);
  }
}
