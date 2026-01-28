import type { LinterViolation } from "./types.js";

/**
 * ESLint JSON output format
 */
interface EslintResult {
  filePath: string;
  messages: EslintMessage[];
  suppressedMessages: EslintMessage[];
  errorCount: number;
  fatalErrorCount: number;
  warningCount: number;
  fixableErrorCount: number;
  fixableWarningCount: number;
  source?: string;
  usedDeprecatedRules?: Array<{ ruleId: string; replacedBy: string[] }>;
}

interface EslintMessage {
  ruleId: string | null;
  severity: 1 | 2;
  message: string;
  line: number;
  column: number;
  nodeType?: string;
  messageId?: string;
  endLine?: number;
  endColumn?: number;
  fix?: {
    range: [number, number];
    text: string;
  };
}

/**
 * Parse ESLint JSON output into normalized violations
 */
export function parseEslintOutput(output: string): LinterViolation[] {
  if (!output.trim()) {
    return [];
  }

  try {
    const results: EslintResult[] = JSON.parse(output);

    if (!Array.isArray(results)) {
      return [];
    }

    const violations: LinterViolation[] = [];

    for (const result of results) {
      for (const msg of result.messages) {
        violations.push({
          file: result.filePath,
          line: msg.line,
          column: msg.column,
          tool: "eslint",
          code: msg.ruleId ?? "eslint-error",
          message: msg.message,
        });
      }
    }

    return violations;
  } catch {
    // If parsing fails, return empty array
    return [];
  }
}
