# lintent

<div class="hero" markdown>

<pre style="color: #f97316; font-family: 'JetBrains Mono', monospace; font-size: clamp(0.4rem, 1.2vw, 0.65rem); line-height: 1.1;">░██ ░██              ░██                             ░██    
░██                  ░██                             ░██    
░██ ░██░████████  ░████████  ░███████  ░████████  ░████████ 
░██ ░██░██    ░██    ░██    ░██    ░██ ░██    ░██    ░██    
░██ ░██░██    ░██    ░██    ░█████████ ░██    ░██    ░██    
░██ ░██░██    ░██    ░██    ░██        ░██    ░██    ░██    
░██ ░██░██    ░██     ░████  ░███████  ░██    ░██     ░████</pre>

## <span style="color: #f97316;">Lint</span> + <span style="color: #f97316;">Intent</span>

**Make slop illegal.** Give your AI agent a map to write clean code. 

Linters say what's wrong — lintent explains **why** and **how** to fix it.

</div>

---

## 🚀 Quickstart: Let Your Agent Set It Up

Copy this prompt to your AI agent:

<div class="tabbed-set" data-tabs="1:3">
<input type="radio" name="__tabbed_1" id="__tabbed_1_1" checked>
<label for="__tabbed_1_1">Cursor</label>
<div class="tabbed-content">

```
Set up lintent in this project for semantic linting:

1. Install: npm install -g lintent
2. Initialize: lintent init
3. Run: lintent run --pretty
4. Fix violations using semantic context (illegal/legal/why)
5. Check summary.without_semantic - if > 0, help me add custom rules:
   - Run: lintent guide customize
   - For each violation without semantic context, analyze my codebase patterns
   - Ask me about conventions and exceptions
   - Add rules to lintent.yaml
6. Create .cursor/rules/lintent.mdc with:
   - Always run `lintent run --pretty` before fixing lint issues
   - Use semantic context to understand violations
   - Follow the "legal" guidance, don't just delete code
```

</div>
<input type="radio" name="__tabbed_1" id="__tabbed_1_2">
<label for="__tabbed_1_2">Claude Code</label>
<div class="tabbed-content">

```
Set up lintent for semantic linting in this project:

1. Run: npm install -g lintent
2. Run: lintent init
3. Run: lintent run --pretty
4. Fix violations using semantic context (illegal/legal/why)
5. Check summary.without_semantic count. If > 0:
   - Run: lintent guide customize
   - Analyze codebase for patterns
   - Ask me about our conventions
   - Create custom rules in lintent.yaml
6. Add to CLAUDE.md:
   ## Linting
   - Run `lintent run --pretty` before fixing lint issues
   - Use semantic context: illegal (what's wrong), legal (how to fix), why (reasoning)
   - Follow "legal" guidance, don't just delete code
```

</div>
<input type="radio" name="__tabbed_1" id="__tabbed_1_3">
<label for="__tabbed_1_3">OpenCode / Other</label>
<div class="tabbed-content">

```
Set up lintent for semantic linting in this project:

1. Install: npm install -g lintent
2. Initialize: lintent init  
3. Run: lintent run --pretty
4. Fix violations using semantic fields (illegal/legal/why)
5. If summary.without_semantic > 0, customize rules:
   - Run: lintent guide customize
   - Search codebase for patterns related to violations
   - Ask about conventions and exceptions
   - Add project-specific rules to lintent.yaml
6. Add to AGENTS.md:
   ## Linting
   - Run `lintent run --pretty` before fixing lint issues
   - Use semantic context (illegal/legal/why)
   - Follow "legal" guidance, don't just delete code
```

</div>
</div>

[Get Started →](getting-started/installation.md){ .btn .btn-primary }
[View on GitHub](https://github.com/avb7/lintent){ .btn .btn-secondary }

---

## The Problem: AI Agents Need Context

<div class="comparison" markdown>

<div class="comparison-card bad" markdown>

### ❌ Without lintent

```json
{
  "code": "F401",
  "message": "`os` imported but unused"
}
```

AI: *deletes the import*

But what if it was for side effects? What's the principle?

</div>

<div class="comparison-card good" markdown>

### ✅ With lintent

```json
{
  "code": "F401",
  "semantic": {
    "illegal": "Unused imports",
    "legal": "Import only what you use, or # noqa for side-effects",
    "why": "Clean deps, faster startup"
  }
}
```

AI understands the **intent**.

</div>

</div>

---

## Why lintent?

<div class="features" markdown>

<div class="feature" markdown>

### 🎯 Semantic Context

Every violation includes `illegal`, `legal`, and `why` — the full picture for intelligent fixes.

</div>

<div class="feature" markdown>

### ⚡ Zero Config

Auto-detects ruff, pyright, eslint, and tsc from your existing config files. Just run it.

</div>

<div class="feature" markdown>

### 🤖 Agent-First

JSON output optimized for LLMs. Includes `lintent guide` for injectable AI instructions.

</div>

<div class="feature" markdown>

### 📦 Presets Included

Start with semantic rules for common violations. Customize as you grow.

</div>

<div class="feature" markdown>

### 🔧 Your Linters

lintent runs YOUR existing linters. No new tool to learn — just enriched output.

</div>

<div class="feature" markdown>

### 📊 Full Visibility

See which linters ran, which failed, and track semantic coverage over time.

</div>

</div>

---

## Supported Linters

<div class="linters" markdown>

<span class="linter-badge">🐍 ruff</span>
<span class="linter-badge">🐍 pyright</span>
<span class="linter-badge">📜 eslint</span>
<span class="linter-badge">📜 typescript</span>

</div>

**Coming soon:** Rust (clippy), Go (golangci-lint), Java (checkstyle), and more.

---

## Manual Setup

```bash
# Install
npm install -g lintent

# Initialize with preset
lintent init --preset python    # or typescript

# Run
lintent run --pretty

# Get AI guide
lintent guide
```

!!! tip "Pro tip"
    Run `lintent guide` to get an injectable AI guide tailored to your project.

<div style="text-align: center; margin-top: 2rem;">

[Full Documentation →](getting-started/installation.md){ .btn .btn-primary }
[Cursor Integration](guides/cursor-integration.md){ .btn .btn-secondary }

</div>
