# Contributing to ReliefIQ

## Getting Started

1. Clone the repo: `git clone git@github.com:sakibchy/ReliefIQ.git`
2. Read [AGENTS.md](AGENTS.md) — this is the most important file for understanding the codebase
3. Copy `.env.example` to `.env` and fill in your API keys
4. Follow [docs/SETUP.md](docs/SETUP.md) for local setup

## Branching Strategy

```
main          ← stable, production-ready
dev           ← integration branch, PR target
feature/*     ← new features (e.g. feature/pdf-export)
fix/*         ← bug fixes (e.g. fix/map-clustering)
```

## Pull Request Rules

- All PRs must target `dev`, not `main`
- PR title format: `[feat]`, `[fix]`, `[docs]`, `[refactor]`, `[style]`
- Include a short description of what changed and why
- Test locally before opening a PR

## Commit Message Format

```
type(scope): short description

Examples:
feat(ai): add confidence score to analyze_report output
fix(map): prevent heatmap re-render on status update
docs(api): document /api/reports pagination params
```

## Code Style

### Python
- Follow PEP 8
- Use type hints on all functions
- Run `black .` before committing

### JavaScript/React
- Use functional components with hooks only
- Use CSS classes — no inline styles
- Run `npm run lint` before committing

## Adding Environment Variables

If your feature needs a new env variable:
1. Add it to `.env.example` with a placeholder and comment
2. Add it to `backend/config.py` with a default value if optional
3. Document it in `AGENTS.md` under the Environment Variables table
