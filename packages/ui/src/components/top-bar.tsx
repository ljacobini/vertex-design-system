'use client';

import * as React from 'react';
import { Menu } from 'lucide-react';

import { cn } from '../lib/utils';
import { Badge } from './badge';

/**
 * TopBar — application header (A3, S26).
 * Shows tenant + user + role badge + actions slot, and a mobile menu button that the
 * AppShell wires to toggle the off-canvas sidebar (onMenuClick). Client component.
 */
export interface TopBarProps {
  title?: React.ReactNode;
  tenantName?: React.ReactNode;
  userName?: React.ReactNode;
  role?: React.ReactNode;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  className?: string;
}

function TopBar({
  title,
  tenantName,
  userName,
  role,
  actions,
  onMenuClick,
  className,
}: TopBarProps) {
  return (
    <header
      className={cn(
        'flex h-14 items-center gap-3 border-b border-border bg-background px-4',
        className,
      )}
    >
      {onMenuClick ? (
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Toggle navigation"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      ) : null}
      {title ? <div className="text-sm font-semibold text-foreground">{title}</div> : null}
      <div className="ml-auto flex items-center gap-3">
        {actions}
        {tenantName ? (
          <span className="hidden text-xs text-muted-foreground sm:inline">{tenantName}</span>
        ) : null}
        {userName ? (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">{userName}</span>
            {role ? <Badge variant="outline">{role}</Badge> : null}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export { TopBar };
