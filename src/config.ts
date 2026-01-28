import { readFileSync, existsSync } from "fs";
import { parse as parseYaml } from "yaml";
import type { LintentConfig, SemanticRule } from "./linters/types.js";

/**
 * Default config when no lintent.yaml is found
 */
const DEFAULT_CONFIG: LintentConfig = {
  rules: {},
};

/**
 * Load lintent.yaml from the given path
 */
export function loadConfig(configPath: string): LintentConfig {
  if (!existsSync(configPath)) {
    return DEFAULT_CONFIG;
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const parsed = parseYaml(content);

    if (!parsed || typeof parsed !== "object") {
      return DEFAULT_CONFIG;
    }

    return validateConfig(parsed);
  } catch (error) {
    throw new Error(
      `Failed to parse lintent.yaml: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Validate the config structure
 */
function validateConfig(config: unknown): LintentConfig {
  if (typeof config !== "object" || config === null) {
    throw new Error("Config must be an object");
  }

  const obj = config as Record<string, unknown>;

  // Validate linters section (optional)
  if (obj.linters !== undefined) {
    if (typeof obj.linters !== "object" || obj.linters === null) {
      throw new Error("'linters' must be an object");
    }
  }

  // Validate rules section (required for enrichment, but optional overall)
  if (obj.rules !== undefined) {
    if (typeof obj.rules !== "object" || obj.rules === null) {
      throw new Error("'rules' must be an object");
    }

    // Validate each tool's rules
    for (const [tool, rules] of Object.entries(
      obj.rules as Record<string, unknown>
    )) {
      if (typeof rules !== "object" || rules === null) {
        throw new Error(`Rules for '${tool}' must be an object`);
      }

      for (const [code, rule] of Object.entries(
        rules as Record<string, unknown>
      )) {
        validateRule(tool, code, rule);
      }
    }
  }

  return {
    linters: obj.linters as LintentConfig["linters"],
    rules: (obj.rules as LintentConfig["rules"]) ?? {},
  };
}

/**
 * Validate a single rule has required fields
 */
function validateRule(tool: string, code: string, rule: unknown): void {
  if (typeof rule !== "object" || rule === null) {
    throw new Error(`Rule '${tool}/${code}' must be an object`);
  }

  const r = rule as Record<string, unknown>;

  if (typeof r.illegal !== "string") {
    throw new Error(`Rule '${tool}/${code}' must have 'illegal' string`);
  }

  if (typeof r.legal !== "string") {
    throw new Error(`Rule '${tool}/${code}' must have 'legal' string`);
  }

  if (typeof r.why !== "string") {
    throw new Error(`Rule '${tool}/${code}' must have 'why' string`);
  }
}

/**
 * Build a Map for fast rule lookup
 * Key format: "tool/code" (e.g., "ruff/E501")
 */
export function buildRulesMap(
  config: LintentConfig
): Map<string, SemanticRule> {
  const map = new Map<string, SemanticRule>();

  for (const [tool, rules] of Object.entries(config.rules)) {
    for (const [code, rule] of Object.entries(rules)) {
      map.set(`${tool}/${code}`, rule);
    }
  }

  return map;
}

/**
 * Get all rule keys from config
 */
export function getRuleKeys(
  config: LintentConfig
): Array<{ tool: string; code: string }> {
  const keys: Array<{ tool: string; code: string }> = [];

  for (const [tool, rules] of Object.entries(config.rules)) {
    for (const code of Object.keys(rules)) {
      keys.push({ tool, code });
    }
  }

  return keys;
}
