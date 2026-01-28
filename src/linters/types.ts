/**
 * A violation reported by a linter
 */
export interface LinterViolation {
  file: string;
  line: number;
  column: number;
  tool: string;
  code: string;
  message: string;
}

/**
 * Semantic meaning for a lint rule
 */
export interface SemanticRule {
  illegal: string;
  legal: string;
  why: string;
}

/**
 * A violation enriched with semantic meaning
 */
export interface EnrichedViolation extends LinterViolation {
  semantic: SemanticRule | null;
}

/**
 * A detected linter with its configuration
 */
export interface DetectedLinter {
  name: string;
  configPath: string | null;
  command: string;
  args: string[];
  paths: string[];
}

/**
 * Override configuration for a linter in lintent.yaml
 */
export interface LinterOverride {
  enabled?: boolean;
  config?: string;
  paths?: string[];
}

/**
 * The lintent.yaml configuration structure
 */
export interface LintentConfig {
  linters?: Record<string, LinterOverride>;
  rules: Record<string, Record<string, SemanticRule>>;
}

/**
 * Result of running a single linter
 */
export interface LinterRunResult {
  name: string;
  status: "success" | "error" | "not_found";
  violations: LinterViolation[];
  error?: string;
  command?: string;
}

/**
 * The output report from lintent run
 */
export interface LintentReport {
  violations: EnrichedViolation[];
  linters: {
    detected: string[];
    results: Array<{
      name: string;
      status: "success" | "error" | "not_found";
      violations_count: number;
      error?: string;
    }>;
  };
  summary: {
    total: number;
    with_semantic: number;
    without_semantic: number;
    by_tool: Record<string, number>;
    files_affected: number;
  };
}

/**
 * Error output format
 */
export interface LintentError {
  error: true;
  code: string;
  message: string;
}

/**
 * Interface for linter implementations
 */
export interface Linter {
  name: string;
  detect(cwd: string): DetectedLinter | null;
  parse(output: string): LinterViolation[];
}
