# CI/CD Integration Guide

Running lintent in continuous integration pipelines.

## GitHub Actions

### Basic Setup

```yaml
name: Lint

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - run: npm install -g lintent
      
      # Install your linters
      - run: pip install ruff  # For Python
      # OR
      - run: npm ci  # For JS/TS (if eslint is in devDeps)
      
      - run: lintent run
```

### Save Report as Artifact

```yaml
- name: Run lintent
  run: lintent run --pretty > lintent-report.json
  continue-on-error: true

- uses: actions/upload-artifact@v4
  with:
    name: lint-report
    path: lintent-report.json
```

### PR Comment with Results

```yaml
- name: Run lintent
  id: lintent
  run: |
    lintent run --pretty > report.json
    echo "violations=$(jq '.summary.total' report.json)" >> $GITHUB_OUTPUT
  continue-on-error: true

- name: Comment on PR
  if: github.event_name == 'pull_request'
  uses: actions/github-script@v7
  with:
    script: |
      const violations = ${{ steps.lintent.outputs.violations }};
      github.rest.issues.createComment({
        issue_number: context.issue.number,
        owner: context.repo.owner,
        repo: context.repo.repo,
        body: `## Lint Report\n\n${violations} violations found.`
      });
```

## GitLab CI

```yaml
lint:
  image: node:20
  
  before_script:
    - npm install -g lintent
    - pip install ruff  # If Python
  
  script:
    - lintent run
  
  artifacts:
    when: always
    paths:
      - lintent-report.json
    reports:
      codequality: lintent-report.json
```

## CircleCI

```yaml
version: 2.1

jobs:
  lint:
    docker:
      - image: cimg/node:20.0
    
    steps:
      - checkout
      
      - run:
          name: Install lintent
          command: npm install -g lintent
      
      - run:
          name: Install linters
          command: pip install ruff
      
      - run:
          name: Run lint
          command: lintent run

workflows:
  main:
    jobs:
      - lint
```

## Exit Codes

lintent uses standard exit codes:

| Code | Meaning |
|------|---------|
| 0 | No violations |
| 1 | Violations found or errors |

This integrates with CI "fail on non-zero" behavior.

## Caching Linters

### GitHub Actions (Python)

```yaml
- uses: actions/setup-python@v5
  with:
    python-version: '3.10'
    cache: 'pip'

- run: pip install ruff pyright
```

### GitHub Actions (Node)

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'

- run: npm ci
```

## Tips

### Fail Fast

By default, lintent runs all linters even if one fails. The exit code reflects any violations or errors.

### Pretty Output for Logs

```yaml
- run: lintent run --pretty
```

Makes the JSON output readable in CI logs.

### Specific Linters Only

```yaml
- run: lintent run --tool ruff
```

Run only specific linters if you have separate CI jobs.

### Custom Config Path

```yaml
- run: lintent run --config ./ci/lintent.yaml
```

Use a CI-specific configuration.

## Troubleshooting CI

### "Command not found"

Ensure linters are installed in the CI environment:

```yaml
# Check installations
- run: which ruff
- run: which eslint
```

### Permission Issues

If lintent can't access files:

```yaml
- run: chmod -R 755 .
```

### Timeout

Long-running linters may need timeout adjustments:

```yaml
- name: Run lintent
  timeout-minutes: 10
  run: lintent run
```
