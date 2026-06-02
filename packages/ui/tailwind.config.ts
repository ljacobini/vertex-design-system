import type { Config } from 'tailwindcss';

/**
 * Vertex Platform — shared Tailwind preset (ADR-001 frontend stack).
 *
 * Consumer apps (apps/web) extend this via:
 *   import vertexUiPreset from "@vertex/ui/tailwind.config";
 *   export default { presets: [vertexUiPreset], content: [...] }
 *
 * Multi-tenant theming: T1 reseller (Banca Bionica white-label) overrides CSS vars
 * at runtime via `:root[data-tenant="banca-bionica"] { --primary: ... }`.
 */
const config: Config = {
  darkMode: ['class'],
  content: [
    './src/**/*.{ts,tsx}',
    // Consumer apps MUST add their own content globs in their tailwind.config
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: { '2xl': '1400px' },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        /* Vertex Platform Unified Design Language (S45 W2) — cross-modulo design tokens */
        vtx: {
          deep: 'hsl(var(--vtx-deep))',
          mid: 'hsl(var(--vtx-mid))',
          light: 'hsl(var(--vtx-light))',
          spark: 'hsl(var(--vtx-spark))',
        },
        severity: {
          info: 'hsl(var(--severity-info))',
          warning: 'hsl(var(--severity-warning))',
          alert: 'hsl(var(--severity-alert))',
          breach: 'hsl(var(--severity-breach))',
          success: 'hsl(var(--severity-success))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        body: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        numeric: ['Inter', 'tabular-nums', 'sans-serif'],
      },
      transitionDuration: {
        fast: '150ms',
        normal: '250ms',
        slow: '400ms',
        data: '600ms',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
        decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
        accelerate: 'cubic-bezier(0.4, 0.0, 1.0, 1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require('tailwindcss-animate')],
};

export default config;
