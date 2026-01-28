import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { loadConfig, buildRulesMap, getRuleKeys } from "../src/config.js";

describe("Config Parser", () => {
  const testDir = join(process.cwd(), "test-config-temp");

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  it("should return default config for missing file", () => {
    const config = loadConfig(join(testDir, "nonexistent.yaml"));
    expect(config).toEqual({ rules: {} });
  });

  it("should parse valid lintent.yaml", () => {
    const configPath = join(testDir, "lintent.yaml");
    writeFileSync(
      configPath,
      `
rules:
  ruff:
    E501:
      illegal: "Lines over 88 characters"
      legal: "Break into multiple lines"
      why: "Readability"
    F401:
      illegal: "Unused imports"
      legal: "Remove them"
      why: "Clean code"
`
    );

    const config = loadConfig(configPath);

    expect(config.rules.ruff).toBeDefined();
    expect(config.rules.ruff.E501).toEqual({
      illegal: "Lines over 88 characters",
      legal: "Break into multiple lines",
      why: "Readability",
    });
    expect(config.rules.ruff.F401).toEqual({
      illegal: "Unused imports",
      legal: "Remove them",
      why: "Clean code",
    });
  });

  it("should parse config with linters section", () => {
    const configPath = join(testDir, "lintent.yaml");
    writeFileSync(
      configPath,
      `
linters:
  ruff:
    enabled: true
    paths:
      - ./src
  eslint:
    enabled: false

rules:
  ruff:
    E501:
      illegal: "Too long"
      legal: "Break it"
      why: "Readability"
`
    );

    const config = loadConfig(configPath);

    expect(config.linters).toBeDefined();
    expect(config.linters?.ruff?.enabled).toBe(true);
    expect(config.linters?.ruff?.paths).toEqual(["./src"]);
    expect(config.linters?.eslint?.enabled).toBe(false);
  });

  it("should throw on missing required fields", () => {
    const configPath = join(testDir, "lintent.yaml");
    writeFileSync(
      configPath,
      `
rules:
  ruff:
    E501:
      illegal: "Too long"
      # missing legal and why
`
    );

    expect(() => loadConfig(configPath)).toThrow("must have 'legal' string");
  });

  it("should throw on invalid rule structure", () => {
    const configPath = join(testDir, "lintent.yaml");
    writeFileSync(
      configPath,
      `
rules:
  ruff:
    E501: "not an object"
`
    );

    expect(() => loadConfig(configPath)).toThrow("must be an object");
  });
});

describe("buildRulesMap", () => {
  it("should build map from config", () => {
    const config = {
      rules: {
        ruff: {
          E501: {
            illegal: "Too long",
            legal: "Break it",
            why: "Readability",
          },
          F401: {
            illegal: "Unused",
            legal: "Remove",
            why: "Clean",
          },
        },
        eslint: {
          "no-unused-vars": {
            illegal: "Unused var",
            legal: "Remove",
            why: "Dead code",
          },
        },
      },
    };

    const map = buildRulesMap(config);

    expect(map.size).toBe(3);
    expect(map.get("ruff/E501")).toEqual({
      illegal: "Too long",
      legal: "Break it",
      why: "Readability",
    });
    expect(map.get("ruff/F401")).toBeDefined();
    expect(map.get("eslint/no-unused-vars")).toBeDefined();
  });

  it("should return empty map for empty rules", () => {
    const config = { rules: {} };
    const map = buildRulesMap(config);
    expect(map.size).toBe(0);
  });
});

describe("getRuleKeys", () => {
  it("should return all rule keys", () => {
    const config = {
      rules: {
        ruff: {
          E501: { illegal: "a", legal: "b", why: "c" },
          F401: { illegal: "a", legal: "b", why: "c" },
        },
        eslint: {
          "no-unused-vars": { illegal: "a", legal: "b", why: "c" },
        },
      },
    };

    const keys = getRuleKeys(config);

    expect(keys).toHaveLength(3);
    expect(keys).toContainEqual({ tool: "ruff", code: "E501" });
    expect(keys).toContainEqual({ tool: "ruff", code: "F401" });
    expect(keys).toContainEqual({ tool: "eslint", code: "no-unused-vars" });
  });

  it("should return empty array for empty rules", () => {
    const config = { rules: {} };
    const keys = getRuleKeys(config);
    expect(keys).toHaveLength(0);
  });
});
