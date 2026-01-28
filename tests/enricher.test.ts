import { describe, it, expect } from "vitest";
import { enrich } from "../src/enricher.js";
import type { LinterViolation, SemanticRule } from "../src/linters/types.js";

describe("Enricher", () => {
  const sampleRules = new Map<string, SemanticRule>([
    [
      "ruff/E501",
      {
        illegal: "Lines over 88 characters",
        legal: "Break into multiple lines",
        why: "Readability",
      },
    ],
    [
      "ruff/F401",
      {
        illegal: "Unused imports",
        legal: "Remove unused imports",
        why: "Clean dependencies",
      },
    ],
    [
      "eslint/no-unused-vars",
      {
        illegal: "Variable declared but never used",
        legal: "Remove unused variables",
        why: "Dead code",
      },
    ],
  ]);

  it("should enrich violations with matching semantic rules", () => {
    const violations: LinterViolation[] = [
      {
        file: "src/main.py",
        line: 10,
        column: 89,
        tool: "ruff",
        code: "E501",
        message: "Line too long",
      },
    ];

    const enriched = enrich(violations, sampleRules);

    expect(enriched).toHaveLength(1);
    expect(enriched[0].semantic).toEqual({
      illegal: "Lines over 88 characters",
      legal: "Break into multiple lines",
      why: "Readability",
    });
  });

  it("should return null semantic for violations without matching rules", () => {
    const violations: LinterViolation[] = [
      {
        file: "src/main.py",
        line: 10,
        column: 1,
        tool: "ruff",
        code: "E999",
        message: "Unknown error",
      },
    ];

    const enriched = enrich(violations, sampleRules);

    expect(enriched).toHaveLength(1);
    expect(enriched[0].semantic).toBeNull();
  });

  it("should handle mixed violations with and without semantic rules", () => {
    const violations: LinterViolation[] = [
      {
        file: "src/main.py",
        line: 1,
        column: 1,
        tool: "ruff",
        code: "F401",
        message: "Unused import",
      },
      {
        file: "src/main.py",
        line: 5,
        column: 1,
        tool: "ruff",
        code: "F999",
        message: "Unknown",
      },
      {
        file: "src/index.ts",
        line: 3,
        column: 7,
        tool: "eslint",
        code: "no-unused-vars",
        message: "Unused var",
      },
    ];

    const enriched = enrich(violations, sampleRules);

    expect(enriched).toHaveLength(3);
    expect(enriched[0].semantic).not.toBeNull();
    expect(enriched[1].semantic).toBeNull();
    expect(enriched[2].semantic).not.toBeNull();
  });

  it("should handle empty violations array", () => {
    const violations: LinterViolation[] = [];
    const enriched = enrich(violations, sampleRules);
    expect(enriched).toHaveLength(0);
  });

  it("should handle empty rules map", () => {
    const violations: LinterViolation[] = [
      {
        file: "src/main.py",
        line: 10,
        column: 89,
        tool: "ruff",
        code: "E501",
        message: "Line too long",
      },
    ];

    const enriched = enrich(violations, new Map());

    expect(enriched).toHaveLength(1);
    expect(enriched[0].semantic).toBeNull();
  });

  it("should preserve all violation properties", () => {
    const violations: LinterViolation[] = [
      {
        file: "src/main.py",
        line: 10,
        column: 89,
        tool: "ruff",
        code: "E501",
        message: "Line too long (120 > 88)",
      },
    ];

    const enriched = enrich(violations, sampleRules);

    expect(enriched[0].file).toBe("src/main.py");
    expect(enriched[0].line).toBe(10);
    expect(enriched[0].column).toBe(89);
    expect(enriched[0].tool).toBe("ruff");
    expect(enriched[0].code).toBe("E501");
    expect(enriched[0].message).toBe("Line too long (120 > 88)");
  });
});
