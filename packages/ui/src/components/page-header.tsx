import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * PageHeader — premium page title block (A3, S26).
 * Title + optional description + right-aligned actions slot. Presentational (no client).
 */
export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col gap-2 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      {...props}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  ),
);
PageHeader.displayName = 'PageHeader';

export { PageHeader };
