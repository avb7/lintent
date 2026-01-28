import type { LinterViolation } from "./types.js";

/**
 * Ruff JSON output format
 */
interface RuffViolation {
  cell: number | null;
  code: string;
  filename: string;
  location: {
    column: number;
    row: number;
  };
  end_location: {
    column: number;
    row: number;
  };
  message: string;
  noqa_row: number;
  url: string;
  fix?: {
    applicability: string;
    edits: Array<{
      content: string;
      location: { column: number; row: number };
      end_location: { column: number; row: number };
    }>;
    message: string;
  };
}

/**
 * Parse ruff JSON output into normalized violations
 */
export function parseRuffOutput(output: string): LinterViolation[] {
  if (!output.trim()) {
    return [];
  }

  try {
    const violations: RuffViolation[] = JSON.parse(output);

    if (!Array.isArray(violations)) {
      return [];
    }

    return violations.map((v) => ({
      file: v.filename,
      line: v.location.row,
      column: v.location.column,
      tool: "ruff",
      code: v.code,
      message: v.message,
    }));
  } catch {
    // If parsing fails, return empty array
    return [];
  }
}
