import type { LinterViolation } from "./types.js";

/**
 * Parse TypeScript compiler output into normalized violations
 *
 * TSC output format (with --pretty false):
 * src/index.ts(5,3): error TS2322: Type 'string' is not assignable to type 'number'.
 */
export function parseTypescriptOutput(output: string): LinterViolation[] {
  if (!output.trim()) {
    return [];
  }

  const violations: LinterViolation[] = [];
  const lines = output.split("\n");

  // Regex to match TSC error format: file(line,col): error TSxxxx: message
  const errorRegex = /^(.+?)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)$/;

  for (const line of lines) {
    const match = line.match(errorRegex);
    if (match) {
      const [, file, lineNum, column, code, message] = match;
      violations.push({
        file: file.trim(),
        line: parseInt(lineNum, 10),
        column: parseInt(column, 10),
        tool: "typescript",
        code,
        message: message.trim(),
      });
    }
  }

  return violations;
}
