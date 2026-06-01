# Security Policy

## Reporting a Vulnerability

Email: direzione@vertex102.com (PGP key on request).

## Supported Versions

| Version | Supported |
|---|---|
| 0.x   | ✅ Active development |

## Secret hygiene (R-VPCL-LL-S17-01 mandatory cross-progetto Vertex)

This repository enforces the Vertex Platform secret hygiene SOP:

1. `.gitignore` is FIRST commit (verifiable via `git log --reverse --oneline | head -1`).
2. `.env*` files MUST NEVER be committed. Real secrets live in `.env.local` (gitignored) or vendor secret manager (Render env vars, GitHub Actions secrets).
3. `.env.example` template uses `CHANGE_ME` placeholders only.
4. Pre-commit hook `gitleaks` runs on every commit (see `.pre-commit-config.yaml`).
5. GitHub Secret Scanning Push Protection enabled at repo Settings level.

## Incident response

If a secret is committed by accident:
1. Revoke immediately at provider (Anthropic Console, GitHub PAT page, etc.).
2. `git filter-repo --invert-paths --path <file>` to purge history.
3. Force push + notify all clones to re-pull.
4. Document incident in `00_CROSS_PROJECT_COORDINATION/security_incidents/`.
