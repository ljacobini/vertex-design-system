import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

/**
 * Badge - status indicator + VTX severity 5-level integration (S46 W3).
 * Variants: default/secondary/destructive/outline + VTX info/warning/alert/breach/success.
 * Severity variants map to compliance UI patterns (D-COMPLIANCE-UI-PATTERNS-APPLICABILITY-MATRIX-S45).
 */
const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground',
        info: 'border-transparent bg-severity-info/10 text-severity-info',
        warning: 'border-transparent bg-severity-warning/10 text-severity-warning',
        alert: 'border-transparent bg-severity-alert/10 text-severity-alert',
        breach: 'border-transparent bg-severity-breach/10 text-severity-breach',
        success: 'border-transparent bg-severity-success/10 text-severity-success',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
