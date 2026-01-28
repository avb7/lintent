import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { writeFileSync, mkdirSync, rmSync } from "fs";
import { join } from "path";
import { detectLinters, mergeLinterOverrides } from "../src/linters/detector.js";
import type { DetectedLinter, LinterOverride } from "../src/linters/types.js";

describe("Linter Detection", () => {
  const testDir = join(process.cwd(), "test-detector-temp");

  beforeEach(() => {
    mkdirSync(testDir, { recursive: true });
  });

  afterEach(() => {
    rmSync(testDir, { recursive: true, force: true });
  });

  describe("detectLinters", () => {
    it("should detect no linters in empty directory", () => {
      const linters = detectLinters(testDir);
      expect(linters).toHaveLength(0);
    });

    it("should detect ruff from pyproject.toml", () => {
      writeFileSync(
        join(testDir, "pyproject.toml"),
        `
[tool.ruff]
line-length = 88
`
      );

      const linters = detectLinters(testDir);

      expect(linters).toHaveLength(1);
      expect(linters[0].name).toBe("ruff");
      expect(linters[0].command).toBe("ruff");
      expect(linters[0].args).toContain("--output-format");
    });

    it("should detect ruff from ruff.toml", () => {
      writeFileSync(
        join(testDir, "ruff.toml"),
        `
line-length = 88
`
      );

      const linters = detectLinters(testDir);

      expect(linters).toHaveLength(1);
      expect(linters[0].name).toBe("ruff");
    });

    it("should detect pyright from pyrightconfig.json", () => {
      writeFileSync(
        join(testDir, "pyrightconfig.json"),
        JSON.stringify({ typeCheckingMode: "basic" })
      );

      const linters = detectLinters(testDir);

      expect(linters).toHaveLength(1);
      expect(linters[0].name).toBe("pyright");
      expect(linters[0].args).toContain("--outputjson");
    });

    it("should detect pyright from pyproject.toml", () => {
      writeFileSync(
        join(testDir, "pyproject.toml"),
        `
[tool.pyright]
typeCheckingMode = "basic"
`
      );

      const linters = detectLinters(testDir);

      expect(linters).toHaveLength(1);
      expect(linters[0].name).toBe("pyright");
    });

    it("should detect eslint from eslint.config.js", () => {
      writeFileSync(join(testDir, "eslint.config.js"), "export default [];");

      const linters = detectLinters(testDir);

      expect(linters).toHaveLength(1);
      expect(linters[0].name).toBe("eslint");
      expect(linters[0].args).toContain("--format");
    });

    it("should detect eslint from package.json", () => {
      writeFileSync(
        join(testDir, "package.json"),
        JSON.stringify({ devDependencies: { eslint: "^9.0.0" } })
      );

      const linters = detectLinters(testDir);

      expect(linters).toHaveLength(1);
      expect(linters[0].name).toBe("eslint");
    });

    it("should detect typescript from tsconfig.json", () => {
      writeFileSync(
        join(testDir, "tsconfig.json"),
        JSON.stringify({ compilerOptions: { strict: true } })
      );

      const linters = detectLinters(testDir);

      expect(linters).toHaveLength(1);
      expect(linters[0].name).toBe("typescript");
      expect(linters[0].args).toContain("--noEmit");
    });

    it("should detect multiple linters", () => {
      writeFileSync(
        join(testDir, "pyproject.toml"),
        `
[tool.ruff]
line-length = 88

[tool.pyright]
typeCheckingMode = "basic"
`
      );

      const linters = detectLinters(testDir);

      expect(linters).toHaveLength(2);
      expect(linters.map((l) => l.name)).toContain("ruff");
      expect(linters.map((l) => l.name)).toContain("pyright");
    });
  });

  describe("mergeLinterOverrides", () => {
    const detected: DetectedLinter[] = [
      {
        name: "ruff",
        configPath: "/path/pyproject.toml",
        command: "ruff",
        args: ["check", "--output-format", "json"],
        paths: ["."],
      },
      {
        name: "pyright",
        configPath: "/path/pyrightconfig.json",
        command: "pyright",
        args: ["--outputjson"],
        paths: ["."],
      },
    ];

    it("should return detected linters when no overrides", () => {
      const result = mergeLinterOverrides(detected, undefined);
      expect(result).toEqual(detected);
    });

    it("should disable linters with enabled: false", () => {
      const overrides: Record<string, LinterOverride> = {
        pyright: { enabled: false },
      };

      const result = mergeLinterOverrides(detected, overrides);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe("ruff");
    });

    it("should override paths", () => {
      const overrides: Record<string, LinterOverride> = {
        ruff: { paths: ["./src", "./tests"] },
      };

      const result = mergeLinterOverrides(detected, overrides);

      const ruff = result.find((l) => l.name === "ruff");
      expect(ruff?.paths).toEqual(["./src", "./tests"]);
    });

    it("should override config path", () => {
      const overrides: Record<string, LinterOverride> = {
        ruff: { config: "./custom/pyproject.toml" },
      };

      const result = mergeLinterOverrides(detected, overrides);

      const ruff = result.find((l) => l.name === "ruff");
      expect(ruff?.configPath).toBe("./custom/pyproject.toml");
    });

    it("should add explicitly enabled linter not in detected", () => {
      const overrides: Record<string, LinterOverride> = {
        eslint: { enabled: true, paths: ["./frontend"] },
      };

      const result = mergeLinterOverrides(detected, overrides);

      expect(result).toHaveLength(3);
      const eslint = result.find((l) => l.name === "eslint");
      expect(eslint).toBeDefined();
      expect(eslint?.paths).toEqual(["./frontend"]);
    });
  });
});
