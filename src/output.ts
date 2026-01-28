import type { EnrichedViolation, LintentReport, LintentError, LinterRunResult } from "./linters/types.js";

/**
 * Format violations and linter results into a lintent report
 */
export function formatReport(
  violations: EnrichedViolation[],
  linterResults: LinterRunResult[],
  detectedLinters: string[]
): LintentReport {
  const withSemantic = violations.filter((v) => v.semantic !== null).length;
  const withoutSemantic = violations.length - withSemantic;

  // Count by tool
  const byTool: Record<string, number> = {};
  for (const v of violations) {
    byTool[v.tool] = (byTool[v.tool] ?? 0) + 1;
  }

  // Count unique files
  const filesAffected = new Set(violations.map((v) => v.file)).size;

  return {
    violations,
    linters: {
      detected: detectedLinters,
      results: linterResults.map((r) => ({
        name: r.name,
        status: r.status,
        violations_count: r.violations.length,
        ...(r.error && { error: r.error }),
      })),
    },
    summary: {
      total: violations.length,
      with_semantic: withSemantic,
      without_semantic: withoutSemantic,
      by_tool: byTool,
      files_affected: filesAffected,
    },
  };
}

/**
 * Output JSON (compact or pretty)
 */
export function outputJson(data: unknown, pretty: boolean): string {
  if (pretty) {
    return JSON.stringify(data, null, 2);
  }
  return JSON.stringify(data);
}

/**
 * Format an error response
 */
export function formatError(code: string, message: string): LintentError {
  return {
    error: true,
    code,
    message,
  };
}
