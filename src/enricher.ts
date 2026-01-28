import type {
  LinterViolation,
  EnrichedViolation,
  SemanticRule,
} from "./linters/types.js";

/**
 * Enrich violations with semantic rules
 */
export function enrich(
  violations: LinterViolation[],
  rules: Map<string, SemanticRule>
): EnrichedViolation[] {
  return violations.map((v) => {
    const key = `${v.tool}/${v.code}`;
    const semantic = rules.get(key) ?? null;
    return { ...v, semantic };
  });
}
