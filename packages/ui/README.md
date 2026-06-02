# @vertex/ui

Vertex Shared Design System -- UI components shadcn/Radix with brand institutional banking blue #0B3B5C.

Lifted from `ljacobini/vertex-platform` PMI commit 6cedd1b (S53 W2 Phase 5.1+5.2 Next 15 + React 19 + Vitest 4).

## Components (12)

badge | button | card | checkbox | dialog | form | input | label | radio | select | table | textarea

## Consumer

```bash
pnpm add @vertex/ui
```

```ts
import { Button, Card } from '@vertex/ui'
import '@vertex/ui/styles/globals.css'
```

## Brand

VTX deep `#0B3B5C` primary | VTX mid `#1E6091` secondary | severity 5-level (info/warning/alert/breach/success) | dark mode | multi-tenant CSS vars override `data-tenant`.

## Design tokens

CSS custom properties defined in `src/styles/globals.css`:

- `--vtx-deep: 207 79% 21%` -- #0B3B5C institutional banking blue (primary CTA, header)
- `--vtx-mid: 207 67% 34%` -- #1E6091 secondary, link, focus ring
- `--vtx-light: 207 41% 51%` -- #4A90B7 tertiary, badges
- `--vtx-spark: 180 50% 63%` -- #6FD3D3 delight only, never compliance/finance
- Severity: info | warning | alert | breach | success

## Multi-tenant override

```css
:root[data-tenant="banca-bionica"] { --primary: 217 91% 35%; }
:root[data-tenant="vertex"]        { --primary: 222.2 47.4% 11.2%; }
```

## Stack

shadcn/ui + Radix primitives + Tailwind 3.4 + cva variants + React 19. WCAG 2.1 AA.
