import * as React from 'react';

import { cn } from '../lib/utils';
import { Card, CardContent } from './card';

/**
 * StatCard — KPI / metric tile for dashboards (A3, S26).
 * Brand-tokened value with optional delta + trend colour + severity accent. Presentational.
 */
type StatTrend = 'up' | 'down' | 'flat';
type StatSeverity = 'info' | 'warning' | 'alert' | 'breach' | 'success';

const trendClass: Record<StatTrend, string> = {
  up: 'text-severity-success',
  down: 'text-severity-alert',
  flat: 'text-muted-foreground',
};

const accentClass: Record<StatSeverity, string> = {
  info: 'text-severity-info',
  warning: 'text-severity-warning',
  alert: 'text-severity-alert',
  breach: 'text-severity-breach',
  success: 'text-severity-success',
};

export interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value: React.ReactNode;
  delta?: React.ReactNode;
  trend?: StatTrend;
  severity?: StatSeverity;
  icon?: React.ReactNode;
  hint?: React.ReactNode;
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, label, value, delta, trend = 'flat', severity, icon, hint, ...props }, ref) => (
    <Card ref={ref} className={cn('overflow-hidden', className)} {...props}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {icon ? (
            <span className={cn('shrink-0', severity ? accentClass[severity] : 'text-primary')}>
              {icon}
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight text-foreground">{value}</span>
          {delta ? (
            <span className={cn('text-sm font-medium', trendClass[trend])}>{delta}</span>
          ) : null}
        </div>
        {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  ),
);
StatCard.displayName = 'StatCard';

export { StatCard };
