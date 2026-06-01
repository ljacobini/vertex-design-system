# vertex-design-system

Vertex Platform shared design system, foundation extraction Wave 1-5 (S18).

Consumed cross-progetto Vertex via **git submodule pin commit** (ADR D-CROSS-002):

- `vertex-platform` (Advisory PMI) — `packages/web/` submodule consumer
- `vertex-102-pb-platform` — `packages/` submodule consumer
- `vertex-102-saas` — `saas-frontend/` submodule consumer

## Packages

| Package | Purpose | Source lift |
|---|---|---|
| `@vertex/tokens` | HSL CSS vars + brand `#0B3B5C` + severity 5-level + dark mode + multi-tenant override (CSS var `data-tenant`) | NEW (extracted from PMI globals.css) |
| `@vertex/ui` | 12 components shadcn/Radix (Button, Card, Form, Layout, Dialog, Toast, Tooltip, Tabs, Select, Input, Textarea, Badge) | Lift from `vertex-platform/packages/ui/` |
| `@vertex/api-client` | typed fetch + tenant injection + retry + error handling (openapi-fetch backbone) | Lift from `vertex-platform/packages/api-client/` |
| `@vertex/auth-pattern` | Auth.js v5 portable JWT helpers + SSO flow + tenant context | NEW (extracted from PMI auth/ as portable template) |

## Stack

- pnpm 9 workspaces
- TypeScript 5.5 strict
- React 19 (peer) / Next.js 15 compat
- shadcn/Radix components base
- Tailwind CSS v4 (peer)
- Auth.js v5 (peer)

## Quick start

```bash
pnpm install
pnpm build       # build all 4 packages
pnpm test
pnpm typecheck
```

## Consumer integration (downstream projects)

```bash
# In consumer repo root:
git submodule add https://github.com/ljacobini/vertex-design-system packages/design-system
git submodule update --init --recursive

# Pin to specific commit (immutable — D-CROSS-002):
cd packages/design-system
git checkout <commit-sha>
cd ../..
git add packages/design-system
git commit -m "chore: pin vertex-design-system @ <commit-sha>"
```

## Roadmap

- **S18 (this)**: Wave 1 scaffold + R-VPCL-LL-S17-01 secret hygiene + 4 package skeletons
- **S18-S19**: Wave 2-5 lift `@vertex/ui` + `@vertex/api-client` from PMI + create `@vertex/auth-pattern` + `@vertex/tokens`
- **S19-S20**: Consumer wiring PMI + PB + SAAS (submodule integration)
- **S20+**: AuditChainViz + TenantSwitcher + Sidebar + NotificationBell (4 net-new SAAS components, Design_System_Spec_v1.0 §6)

## Governance

- ADR D-CROSS-002 PROPOSED S17 → ACCEPTED S18 W1 (CEO ratify Q-DS-S17-01..03)
- Spec source: `00_CROSS_PROJECT_COORDINATION/02_Shared_Kernel/Design_System_Spec_v1.0_01.06.26.md`
- License: UNLICENSED (private, Vertex Platform proprietary)

## Security

See [SECURITY.md](./SECURITY.md). Secret hygiene SOP R-VPCL-LL-S17-01 mandatory.
