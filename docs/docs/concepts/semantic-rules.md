# Semantic Rules

The core innovation of lintent: every lint violation gets `illegal`, `legal`, and `why` context.

## The Three Fields

### `illegal` - What's Wrong

Describes the pattern that triggered the lint rule.

```yaml
illegal: "Importing modules that are not used"
```

This answers: **"What did I do wrong?"**

### `legal` - What's Right

Describes what correct code looks like.

```yaml
legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
```

This answers: **"What should I do instead?"**

### `why` - The Reasoning

Explains why this rule exists.

```yaml
why: "Clean dependency graph, faster startup, clearer code"
```

This answers: **"Why does this matter?"**

## Why All Three Matter

Consider this violation:

```
F401: `os` imported but unused
```

### Without Semantic Context

An AI might:
- Just delete the import (correct, but doesn't understand why)
- Not recognize when imports are intentional (false positives)

### With Semantic Context

```json
{
  "illegal": "Importing modules that are not used",
  "legal": "Only import what you use, or mark with # noqa: F401 if for side-effects",
  "why": "Clean dependency graph, faster startup, clearer code"
}
```

Now an AI:
- Understands the *intent* (clean dependencies)
- Knows the *exception* (side-effect imports)
- Can make *intelligent* decisions

## Writing Effective Rules

### Be Specific and Actionable

```yaml
# Good
illegal: "Using mutable default argument (list, dict, set)"
legal: "Use None as default, create mutable inside function"
why: "Mutable defaults are shared across calls, causing subtle bugs"

# Bad
illegal: "Bad practice"
legal: "Don't do this"
why: "It's wrong"
```

### Include Edge Cases

```yaml
# Covers the common exception
legal: "Only import what you use, or mark with # noqa: F401 if for side-effects"
```

### Connect to Real Impact

```yaml
# Explains concrete consequences
why: "Long lines force horizontal scrolling, break visual flow, and often indicate complexity that should be decomposed"
```

## Coverage Matters

lintent reports semantic coverage:

```json
{
  "summary": {
    "total": 25,
    "with_semantic": 20,
    "without_semantic": 5
  }
}
```

Violations without semantic rules still appear - just with `"semantic": null`. This lets you:

1. Start with partial coverage
2. See what rules you're missing
3. Incrementally add semantics

## Presets Get You Started

```bash
lintent init --preset python
```

Presets include semantic rules for common violations:

| Preset | Linters | Rules |
|--------|---------|-------|
| `python` | ruff, pyright | ~20 rules |
| `typescript` | eslint, tsc | ~20 rules |

Customize after initialization.

## Advanced: Multi-line Values

For complex rules, use YAML multi-line syntax:

```yaml
rules:
  ruff:
    B006:
      illegal: "Mutable default argument in function definition"
      legal: |
        Use None as default and create inside:
        
        def func(items=None):
            items = items or []
            # or
            if items is None:
                items = []
      why: |
        Mutable defaults (list, dict, set) are created once at function 
        definition time, not at call time. All calls share the same object,
        leading to subtle bugs where state persists across calls.
```
