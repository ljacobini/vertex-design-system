/**
 * @vertex/tokens — design tokens public API
 * Re-exports tokens for programmatic use (e.g., Tailwind config integration).
 * For pure CSS consumption: import "@vertex/tokens/tokens.css".
 */

export const brand = {
  primary: "hsl(var(--vtx-brand-primary))",
  accent: "hsl(var(--vtx-brand-accent))",
  bg: "hsl(var(--vtx-brand-bg))",
  fg: "hsl(var(--vtx-brand-fg))",
} as const;

export const severity = {
  critical: "hsl(var(--vtx-sev-critical))",
  high: "hsl(var(--vtx-sev-high))",
  medium: "hsl(var(--vtx-sev-medium))",
  low: "hsl(var(--vtx-sev-low))",
  info: "hsl(var(--vtx-sev-info))",
} as const;

export const radius = {
  sm: "var(--vtx-radius-sm)",
  md: "var(--vtx-radius-md)",
  lg: "var(--vtx-radius-lg)",
} as const;

export const spacing = {
  1: "var(--vtx-spacing-1)",
  2: "var(--vtx-spacing-2)",
  3: "var(--vtx-spacing-3)",
  4: "var(--vtx-spacing-4)",
  6: "var(--vtx-spacing-6)",
  8: "var(--vtx-spacing-8)",
} as const;

export type SeverityLevel = keyof typeof severity;
export type TenantId = "default" | "mediolanum" | string;
