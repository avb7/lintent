import type { LinterViolation } from "./types.js";

/**
 * Pyright JSON output format
 */
interface PyrightOutput {
  version: string;
  time: string;
  generalDiagnostics: PyrightDiagnostic[];
  summary: {
    filesAnalyzed: number;
    errorCount: number;
    warningCount: number;
    informationCount: number;
    timeInSec: number;
  };
}

interface PyrightDiagnostic {
  file: string;
  severity: "error" | "warning" | "information";
  message: string;
  range: {
    start: {
      line: number;
      character: number;
    };
    end: {
      line: number;
      character: number;
    };
  };
  rule?: string;
}

/**
 * Parse pyright JSON output into normalized violations
 */
export function parsePyrightOutput(output: string): LinterViolation[] {
  if (!output.trim()) {
    return [];
  }

  try {
    const result: PyrightOutput = JSON.parse(output);

    if (!result.generalDiagnostics || !Array.isArray(result.generalDiagnostics)) {
      return [];
    }

    return result.generalDiagnostics.map((d) => ({
      file: d.file,
      line: d.range.start.line + 1, // Pyright uses 0-based line numbers
      column: d.range.start.character + 1,
      tool: "pyright",
      code: d.rule ?? `pyright-${d.severity}`,
      message: d.message,
    }));
  } catch {
    // If parsing fails, return empty array
    return [];
  }
}
