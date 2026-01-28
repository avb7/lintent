import { existsSync, readFileSync } from "fs";
import { join } from "path";
import type { DetectedLinter, LinterOverride } from "./types.js";

/**
 * Detect all available linters in the given directory
 */
export function detectLinters(cwd: string): DetectedLinter[] {
  const detected: DetectedLinter[] = [];

  const ruff = detectRuff(cwd);
  if (ruff) detected.push(ruff);

  const pyright = detectPyright(cwd);
  if (pyright) detected.push(pyright);

  const eslint = detectEslint(cwd);
  if (eslint) detected.push(eslint);

  const typescript = detectTypescript(cwd);
  if (typescript) detected.push(typescript);

  return detected;
}

/**
 * Detect ruff configuration
 */
function detectRuff(cwd: string): DetectedLinter | null {
  // Check for ruff.toml
  const ruffToml = join(cwd, "ruff.toml");
  if (existsSync(ruffToml)) {
    return {
      name: "ruff",
      configPath: ruffToml,
      command: "ruff",
      args: ["check", "--output-format", "json"],
      paths: ["."],
    };
  }

  // Check for pyproject.toml with [tool.ruff]
  const pyprojectPath = join(cwd, "pyproject.toml");
  if (existsSync(pyprojectPath)) {
    try {
      const content = readFileSync(pyprojectPath, "utf-8");
      if (content.includes("[tool.ruff]")) {
        return {
          name: "ruff",
          configPath: pyprojectPath,
          command: "ruff",
          args: ["check", "--output-format", "json"],
          paths: ["."],
        };
      }
    } catch {
      // Ignore read errors
    }
  }

  return null;
}

/**
 * Detect pyright configuration
 */
function detectPyright(cwd: string): DetectedLinter | null {
  // Check for pyrightconfig.json
  const pyrightConfig = join(cwd, "pyrightconfig.json");
  if (existsSync(pyrightConfig)) {
    return {
      name: "pyright",
      configPath: pyrightConfig,
      command: "pyright",
      args: ["--outputjson"],
      paths: ["."],
    };
  }

  // Check for pyproject.toml with [tool.pyright]
  const pyprojectPath = join(cwd, "pyproject.toml");
  if (existsSync(pyprojectPath)) {
    try {
      const content = readFileSync(pyprojectPath, "utf-8");
      if (content.includes("[tool.pyright]")) {
        return {
          name: "pyright",
          configPath: pyprojectPath,
          command: "pyright",
          args: ["--outputjson"],
          paths: ["."],
        };
      }
    } catch {
      // Ignore read errors
    }
  }

  return null;
}

/**
 * Detect ESLint configuration
 */
function detectEslint(cwd: string): DetectedLinter | null {
  // Check for eslint config files
  const eslintConfigs = [
    "eslint.config.js",
    "eslint.config.mjs",
    "eslint.config.cjs",
    ".eslintrc.js",
    ".eslintrc.cjs",
    ".eslintrc.json",
    ".eslintrc.yml",
    ".eslintrc.yaml",
  ];

  for (const configFile of eslintConfigs) {
    const configPath = join(cwd, configFile);
    if (existsSync(configPath)) {
      return {
        name: "eslint",
        configPath,
        command: "eslint",
        args: ["--format", "json"],
        paths: ["."],
      };
    }
  }

  // Check for package.json with eslint dependency
  const packageJsonPath = join(cwd, "package.json");
  if (existsSync(packageJsonPath)) {
    try {
      const content = readFileSync(packageJsonPath, "utf-8");
      const pkg = JSON.parse(content);
      const deps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
      };
      if (deps.eslint) {
        return {
          name: "eslint",
          configPath: null,
          command: "eslint",
          args: ["--format", "json"],
          paths: ["."],
        };
      }
    } catch {
      // Ignore read errors
    }
  }

  return null;
}

/**
 * Detect TypeScript configuration
 */
function detectTypescript(cwd: string): DetectedLinter | null {
  const tsconfig = join(cwd, "tsconfig.json");
  if (existsSync(tsconfig)) {
    return {
      name: "typescript",
      configPath: tsconfig,
      command: "tsc",
      args: ["--noEmit", "--pretty", "false"],
      paths: ["."],
    };
  }

  return null;
}

/**
 * Merge detected linters with config overrides
 */
export function mergeLinterOverrides(
  detected: DetectedLinter[],
  overrides: Record<string, LinterOverride> | undefined
): DetectedLinter[] {
  if (!overrides) {
    return detected;
  }

  const result: DetectedLinter[] = [];
  const detectedNames = new Set(detected.map((d) => d.name));

  // Process detected linters with overrides
  for (const linter of detected) {
    const override = overrides[linter.name];

    if (override?.enabled === false) {
      // Explicitly disabled
      continue;
    }

    result.push({
      ...linter,
      configPath: override?.config ?? linter.configPath,
      paths: override?.paths ?? linter.paths,
    });
  }

  // Add explicitly enabled linters that weren't detected
  for (const [name, override] of Object.entries(overrides)) {
    if (override.enabled === true && !detectedNames.has(name)) {
      // User explicitly enabled a linter that wasn't detected
      // We need to create a default config for it
      const defaultLinter = getDefaultLinterConfig(name);
      if (defaultLinter) {
        result.push({
          ...defaultLinter,
          configPath: override.config ?? null,
          paths: override.paths ?? ["."],
        });
      }
    }
  }

  return result;
}

/**
 * Get default linter configuration by name
 */
function getDefaultLinterConfig(name: string): DetectedLinter | null {
  switch (name) {
    case "ruff":
      return {
        name: "ruff",
        configPath: null,
        command: "ruff",
        args: ["check", "--output-format", "json"],
        paths: ["."],
      };
    case "pyright":
      return {
        name: "pyright",
        configPath: null,
        command: "pyright",
        args: ["--outputjson"],
        paths: ["."],
      };
    case "eslint":
      return {
        name: "eslint",
        configPath: null,
        command: "eslint",
        args: ["--format", "json"],
        paths: ["."],
      };
    case "typescript":
      return {
        name: "typescript",
        configPath: null,
        command: "tsc",
        args: ["--noEmit", "--pretty", "false"],
        paths: ["."],
      };
    default:
      return null;
  }
}
