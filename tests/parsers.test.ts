import { describe, it, expect } from "vitest";
import { parseRuffOutput } from "../src/linters/ruff.js";
import { parsePyrightOutput } from "../src/linters/pyright.js";
import { parseEslintOutput } from "../src/linters/eslint.js";
import { parseTypescriptOutput } from "../src/linters/typescript.js";

describe("Ruff Parser", () => {
  it("should parse ruff JSON output", () => {
    const ruffOutput = JSON.stringify([
      {
        cell: null,
        code: "F401",
        filename: "src/main.py",
        location: { column: 8, row: 1 },
        end_location: { column: 10, row: 1 },
        message: "`os` imported but unused",
        noqa_row: 1,
        url: "https://docs.astral.sh/ruff/rules/unused-import",
      },
      {
        cell: null,
        code: "E501",
        filename: "src/main.py",
        location: { column: 89, row: 15 },
        end_location: { column: 120, row: 15 },
        message: "Line too long (120 > 88)",
        noqa_row: 15,
        url: "https://docs.astral.sh/ruff/rules/line-too-long",
      },
    ]);

    const violations = parseRuffOutput(ruffOutput);

    expect(violations).toHaveLength(2);
    expect(violations[0]).toEqual({
      file: "src/main.py",
      line: 1,
      column: 8,
      tool: "ruff",
      code: "F401",
      message: "`os` imported but unused",
    });
    expect(violations[1]).toEqual({
      file: "src/main.py",
      line: 15,
      column: 89,
      tool: "ruff",
      code: "E501",
      message: "Line too long (120 > 88)",
    });
  });

  it("should return empty array for empty output", () => {
    expect(parseRuffOutput("")).toEqual([]);
    expect(parseRuffOutput("   ")).toEqual([]);
  });

  it("should return empty array for invalid JSON", () => {
    expect(parseRuffOutput("not json")).toEqual([]);
  });

  it("should return empty array for empty array", () => {
    expect(parseRuffOutput("[]")).toEqual([]);
  });
});

describe("Pyright Parser", () => {
  it("should parse pyright JSON output", () => {
    const pyrightOutput = JSON.stringify({
      version: "1.1.0",
      time: "0.5s",
      generalDiagnostics: [
        {
          file: "src/main.py",
          severity: "error",
          message: 'Argument of type "str" cannot be assigned to parameter of type "int"',
          range: {
            start: { line: 10, character: 4 },
            end: { line: 10, character: 20 },
          },
          rule: "reportGeneralTypeIssues",
        },
        {
          file: "src/utils.py",
          severity: "warning",
          message: '"x" is not accessed',
          range: {
            start: { line: 5, character: 0 },
            end: { line: 5, character: 1 },
          },
          rule: "reportUnusedVariable",
        },
      ],
      summary: {
        filesAnalyzed: 2,
        errorCount: 1,
        warningCount: 1,
        informationCount: 0,
        timeInSec: 0.5,
      },
    });

    const violations = parsePyrightOutput(pyrightOutput);

    expect(violations).toHaveLength(2);
    expect(violations[0]).toEqual({
      file: "src/main.py",
      line: 11, // 0-based to 1-based
      column: 5,
      tool: "pyright",
      code: "reportGeneralTypeIssues",
      message: 'Argument of type "str" cannot be assigned to parameter of type "int"',
    });
    expect(violations[1]).toEqual({
      file: "src/utils.py",
      line: 6,
      column: 1,
      tool: "pyright",
      code: "reportUnusedVariable",
      message: '"x" is not accessed',
    });
  });

  it("should return empty array for empty output", () => {
    expect(parsePyrightOutput("")).toEqual([]);
  });

  it("should return empty array for invalid JSON", () => {
    expect(parsePyrightOutput("not json")).toEqual([]);
  });
});

describe("ESLint Parser", () => {
  it("should parse eslint JSON output", () => {
    const eslintOutput = JSON.stringify([
      {
        filePath: "/project/src/index.ts",
        messages: [
          {
            ruleId: "no-unused-vars",
            severity: 2,
            message: "'x' is defined but never used.",
            line: 5,
            column: 7,
          },
          {
            ruleId: "no-console",
            severity: 1,
            message: "Unexpected console statement.",
            line: 10,
            column: 3,
          },
        ],
        suppressedMessages: [],
        errorCount: 1,
        fatalErrorCount: 0,
        warningCount: 1,
        fixableErrorCount: 0,
        fixableWarningCount: 0,
      },
    ]);

    const violations = parseEslintOutput(eslintOutput);

    expect(violations).toHaveLength(2);
    expect(violations[0]).toEqual({
      file: "/project/src/index.ts",
      line: 5,
      column: 7,
      tool: "eslint",
      code: "no-unused-vars",
      message: "'x' is defined but never used.",
    });
    expect(violations[1]).toEqual({
      file: "/project/src/index.ts",
      line: 10,
      column: 3,
      tool: "eslint",
      code: "no-console",
      message: "Unexpected console statement.",
    });
  });

  it("should return empty array for empty output", () => {
    expect(parseEslintOutput("")).toEqual([]);
  });

  it("should return empty array for files with no messages", () => {
    const eslintOutput = JSON.stringify([
      {
        filePath: "/project/src/clean.ts",
        messages: [],
        errorCount: 0,
        warningCount: 0,
      },
    ]);

    expect(parseEslintOutput(eslintOutput)).toEqual([]);
  });
});

describe("TypeScript Parser", () => {
  it("should parse tsc output", () => {
    const tscOutput = `
src/index.ts(5,3): error TS2322: Type 'string' is not assignable to type 'number'.
src/utils.ts(10,15): error TS7006: Parameter 'x' implicitly has an 'any' type.
`;

    const violations = parseTypescriptOutput(tscOutput);

    expect(violations).toHaveLength(2);
    expect(violations[0]).toEqual({
      file: "src/index.ts",
      line: 5,
      column: 3,
      tool: "typescript",
      code: "TS2322",
      message: "Type 'string' is not assignable to type 'number'.",
    });
    expect(violations[1]).toEqual({
      file: "src/utils.ts",
      line: 10,
      column: 15,
      tool: "typescript",
      code: "TS7006",
      message: "Parameter 'x' implicitly has an 'any' type.",
    });
  });

  it("should return empty array for empty output", () => {
    expect(parseTypescriptOutput("")).toEqual([]);
  });

  it("should ignore non-error lines", () => {
    const tscOutput = `
Version 5.0.0
src/index.ts(5,3): error TS2322: Type error.
Some other output
`;

    const violations = parseTypescriptOutput(tscOutput);
    expect(violations).toHaveLength(1);
    expect(violations[0].code).toBe("TS2322");
  });
});
