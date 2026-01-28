---
title: lintent - Make Slop Illegal
hide:
  - navigation
  - toc
  - footer
---

<style>
/* Reset MkDocs content constraints for full-width landing */
.md-main__inner { margin: 0 !important; max-width: 100% !important; }
.md-content__inner { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
.md-content { max-width: 100% !important; margin: 0 !important; }
.md-main { width: 100% !important; }
.md-container { max-width: 100% !important; }
.md-grid { max-width: 100% !important; margin: 0 !important; }

/* ===== HERO SECTION ===== */
.hero-section {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(180deg, hsl(240 10% 3.9%) 0%, hsl(240 6% 8%) 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

[data-md-color-scheme="default"] .hero-section {
  background: linear-gradient(180deg, hsl(0 0% 98%) 0%, hsl(240 5% 96%) 100%);
  color: hsl(240 10% 3.9%);
}

/* ASCII Logo */
.ascii-logo {
  font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', monospace;
  font-size: clamp(0.35rem, 1.2vw, 0.7rem);
  line-height: 1.1;
  white-space: pre;
  color: #f97316;
  margin-bottom: 1.5rem;
  text-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
  overflow-x: auto;
  max-width: 100%;
}

[data-md-color-scheme="default"] .ascii-logo {
  color: #ea580c;
  text-shadow: none;
}

/* Hide ASCII on very small screens, show text logo instead */
@media (max-width: 480px) {
  .ascii-logo { display: none; }
  .text-logo { display: block !important; }
}

.text-logo {
  display: none;
  font-size: 3rem;
  font-weight: 800;
  color: #f97316;
  letter-spacing: -0.05em;
  margin-bottom: 1rem;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: hsla(0, 0%, 100%, 0.1);
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  font-size: 0.875rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

[data-md-color-scheme="default"] .hero-badge {
  background: hsla(240, 10%, 3.9%, 0.05);
  border-color: hsla(240, 10%, 3.9%, 0.1);
}

.hero-tagline {
  font-size: clamp(1.5rem, 5vw, 3rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  margin: 0 0 1rem;
  max-width: 700px;
}

.hero-tagline .highlight {
  background: linear-gradient(135deg, #f97316 0%, #ef4444 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: clamp(1rem, 2.5vw, 1.25rem);
  opacity: 0.8;
  max-width: 550px;
  line-height: 1.6;
  margin: 0 0 2.5rem;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.hero-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-weight: 600;
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.2s;
}

.hero-btn-primary {
  background: white;
  color: hsl(240 10% 3.9%);
}

[data-md-color-scheme="default"] .hero-btn-primary {
  background: hsl(240 10% 3.9%);
  color: white;
}

.hero-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -10px rgba(0,0,0,0.3);
}

.hero-btn-secondary {
  background: transparent;
  color: white;
  border: 1px solid hsla(0, 0%, 100%, 0.3);
}

[data-md-color-scheme="default"] .hero-btn-secondary {
  color: hsl(240 10% 3.9%);
  border-color: hsla(240, 10%, 3.9%, 0.2);
}

.hero-btn-secondary:hover {
  background: hsla(0, 0%, 100%, 0.1);
}

/* Terminal preview */
.hero-terminal {
  margin-top: 3rem;
  background: hsla(0, 0%, 0%, 0.4);
  border: 1px solid hsla(0, 0%, 100%, 0.1);
  padding: 1rem 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: clamp(0.7rem, 1.5vw, 0.875rem);
  text-align: left;
  max-width: 650px;
  width: 100%;
  overflow-x: auto;
  backdrop-filter: blur(10px);
}

[data-md-color-scheme="default"] .hero-terminal {
  background: white;
  border-color: hsl(240 5.9% 90%);
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.1);
}

.hero-terminal .prompt { color: #a1a1aa; }
.hero-terminal .cmd { color: #22c55e; }
.hero-terminal .key { color: #f97316; }
.hero-terminal .str { color: #a5f3fc; }
.hero-terminal .brace { color: #22c55e; }

/* ===== PROBLEM SECTION ===== */
.problem-section {
  padding: 5rem 1.5rem;
  background: hsl(240 4.8% 95.9%);
}

[data-md-color-scheme="slate"] .problem-section {
  background: hsl(240 3.7% 15.9%);
}

.section-container {
  max-width: 1000px;
  margin: 0 auto;
}

.section-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  text-align: center;
  margin: 0 0 0.75rem;
}

.section-subtitle {
  text-align: center;
  opacity: 0.7;
  font-size: 1.125rem;
  margin: 0 0 3rem;
}

.comparison-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .comparison-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.comparison-card {
  background: white;
  padding: 1.5rem;
  border: 1px solid hsl(240 5.9% 90%);
}

[data-md-color-scheme="slate"] .comparison-card {
  background: hsl(240 10% 3.9%);
  border-color: hsl(240 3.7% 20%);
}

.comparison-card h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.125rem;
  margin: 0 0 1rem;
}

.comparison-card.bad h3 { color: #ef4444; }
.comparison-card.good h3 { color: #22c55e; }

.comparison-card pre {
  background: hsl(240 4.8% 95.9%);
  padding: 1rem;
  font-size: 0.75rem;
  overflow-x: auto;
  margin: 0;
  line-height: 1.5;
}

[data-md-color-scheme="slate"] .comparison-card pre {
  background: hsl(240 3.7% 12%);
}

/* ===== FEATURES SECTION ===== */
.features-section {
  padding: 5rem 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
}

.feature-card {
  padding: 1.5rem;
  border: 1px solid hsl(240 5.9% 90%);
  transition: all 0.2s;
}

[data-md-color-scheme="slate"] .feature-card {
  border-color: hsl(240 3.7% 20%);
}

.feature-card:hover {
  border-color: #f97316;
  transform: translateY(-2px);
}

.feature-icon {
  width: 2.75rem;
  height: 2.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: hsl(240 4.8% 95.9%);
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

[data-md-color-scheme="slate"] .feature-icon {
  background: hsl(240 3.7% 15.9%);
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.feature-card p {
  opacity: 0.7;
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.6;
}

/* ===== AGENTS SECTION ===== */
.agents-section {
  padding: 5rem 1.5rem;
  background: linear-gradient(135deg, hsl(240 10% 3.9%) 0%, hsl(240 6% 10%) 100%);
  color: white;
  text-align: center;
}

[data-md-color-scheme="default"] .agents-section {
  background: linear-gradient(135deg, hsl(0 0% 98%) 0%, hsl(240 5% 96%) 100%);
  color: hsl(240 10% 3.9%);
}

.agents-content {
  max-width: 700px;
  margin: 0 auto;
}

.agents-section h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  margin: 0 0 1rem;
}

.agents-section p {
  opacity: 0.8;
  font-size: 1.125rem;
  margin: 0 0 2rem;
}

/* ===== LINTERS SECTION ===== */
.linters-section {
  padding: 4rem 1.5rem;
  text-align: center;
}

.linters-grid {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.linter-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: hsl(240 4.8% 95.9%);
  font-weight: 500;
  font-size: 0.9rem;
}

[data-md-color-scheme="slate"] .linter-badge {
  background: hsl(240 3.7% 15.9%);
}

.coming-soon {
  opacity: 0.5;
  font-size: 0.875rem;
  margin-top: 1.5rem;
}

/* ===== CTA SECTION ===== */
.cta-section {
  padding: 5rem 1.5rem;
  text-align: center;
}

.cta-terminal {
  margin: 2rem auto;
  background: hsl(240 4.8% 95.9%);
  border: 1px solid hsl(240 5.9% 90%);
  padding: 1.25rem 1.5rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  text-align: left;
  max-width: 450px;
}

[data-md-color-scheme="slate"] .cta-terminal {
  background: hsl(240 3.7% 12%);
  border-color: hsl(240 3.7% 20%);
}

.cta-terminal .comment { opacity: 0.5; }
</style>

<div class="hero-section">
  <div class="hero-badge">
    <span>🚀</span>
    <span>Now in Beta</span>
  </div>
  
  <div class="ascii-logo">░██ ░██              ░██                             ░██    
░██                  ░██                             ░██    
░██ ░██░████████  ░████████  ░███████  ░████████  ░████████ 
░██ ░██░██    ░██    ░██    ░██    ░██ ░██    ░██    ░██    
░██ ░██░██    ░██    ░██    ░█████████ ░██    ░██    ░██    
░██ ░██░██    ░██    ░██    ░██        ░██    ░██    ░██    
░██ ░██░██    ░██     ░████  ░███████  ░██    ░██     ░████</div>
  
  <div class="text-logo">lintent</div>
  
  <h1 class="hero-tagline">
    Make <span class="highlight">Slop</span> Illegal
  </h1>
  
  <p class="hero-subtitle">
    Give your AI agent a map to write clean code. Linters say what's wrong — lintent explains why and how to fix it.
  </p>
  
  <div class="hero-buttons">
    <a href="getting-started/installation/" class="hero-btn hero-btn-primary">
      Get Started →
    </a>
    <a href="https://github.com/lintent/lintent" class="hero-btn hero-btn-secondary">
      View on GitHub
    </a>
  </div>
  
  <div class="hero-terminal">
<pre style="margin:0;background:transparent;border:none;color:inherit;"><span class="prompt">$</span> <span class="cmd">lintent run</span>

<span class="brace">{</span>
  <span class="key">"code"</span>: <span class="str">"F401"</span>,
  <span class="key">"message"</span>: <span class="str">"unused import"</span>,
  <span class="key">"semantic"</span>: <span class="brace">{</span>
    <span class="key">"illegal"</span>: <span class="str">"Importing modules not used"</span>,
    <span class="key">"legal"</span>: <span class="str">"Only import what you use"</span>,
    <span class="key">"why"</span>: <span class="str">"Clean dependency graph"</span>
  <span class="brace">}</span>
<span class="brace">}</span></pre>
  </div>
</div>

<div class="problem-section">
  <div class="section-container">
    <h2 class="section-title">AI Agents Need Context, Not Just Errors</h2>
    <p class="section-subtitle">Traditional linters tell you what's wrong. That's not enough for AI to fix it right.</p>
    
    <div class="comparison-grid">
      <div class="comparison-card bad">
        <h3>❌ Without lintent</h3>
        <pre><code>{
  "code": "F401",
  "message": "`os` imported but unused"
}

// AI: *deletes the import*
// But what if it was for side effects?
// What's the actual principle here?</code></pre>
      </div>
      
      <div class="comparison-card good">
        <h3>✓ With lintent</h3>
        <pre><code>{
  "code": "F401",
  "semantic": {
    "illegal": "Unused imports",
    "legal": "Import only what you use, 
              or use # noqa for side-effects",
    "why": "Clean deps, faster startup"
  }
}
// AI understands the INTENT</code></pre>
      </div>
    </div>
  </div>
</div>

<div class="features-section">
  <div class="section-container">
    <h2 class="section-title">Why lintent?</h2>
    <p class="section-subtitle">Built from first principles for AI-assisted development</p>
    
    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-icon">🎯</div>
        <h3>Semantic Context</h3>
        <p>Every violation includes <code>illegal</code>, <code>legal</code>, and <code>why</code> — the full picture for intelligent fixes.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">⚡</div>
        <h3>Zero Config</h3>
        <p>Auto-detects ruff, pyright, eslint, and tsc from your existing config files. Just run it.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🤖</div>
        <h3>Agent-First</h3>
        <p>JSON output optimized for LLMs. Self-documenting with semantic context.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📦</div>
        <h3>Presets Included</h3>
        <p>Start with semantic rules for common violations. Customize as you grow.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">🔧</div>
        <h3>Your Linters</h3>
        <p>lintent runs YOUR existing linters. No new tool to learn — just enriched output.</p>
      </div>
      
      <div class="feature-card">
        <div class="feature-icon">📊</div>
        <h3>Full Visibility</h3>
        <p>See which linters ran, which failed, and track semantic coverage over time.</p>
      </div>
    </div>
  </div>
</div>

<div class="agents-section">
  <div class="agents-content">
    <h2>Works with Your Favorite AI Tools</h2>
    <p>Cursor, Copilot, Aider, Claude — any agent that can run shell commands can use lintent to write better code.</p>
    <a href="guides/cursor-integration/" class="hero-btn hero-btn-primary">
      See Integration Guide →
    </a>
  </div>
</div>

<div class="linters-section">
  <div class="section-container">
    <h2 class="section-title">Supported Linters</h2>
    
    <div class="linters-grid">
      <div class="linter-badge">🐍 ruff</div>
      <div class="linter-badge">🐍 pyright</div>
      <div class="linter-badge">📜 eslint</div>
      <div class="linter-badge">📜 typescript</div>
    </div>
    
    <p class="coming-soon">
      More coming soon: Rust (clippy), Go (golangci-lint), Java (checkstyle), and more
    </p>
  </div>
</div>

<div class="cta-section">
  <div class="section-container">
    <h2 class="section-title">Ready to Make Slop Illegal?</h2>
    <p class="section-subtitle">Get started in under 2 minutes.</p>
    
    <div class="cta-terminal">
<pre style="margin:0;background:transparent;border:none;"><span class="comment"># Install</span>
npm install -g lintent

<span class="comment"># Initialize with preset</span>
lintent init --preset python

<span class="comment"># Run</span>
lintent run --pretty</pre>
    </div>
    
    <a href="getting-started/installation/" class="hero-btn hero-btn-primary" style="margin-top: 1.5rem;">
      Get Started →
    </a>
  </div>
</div>
