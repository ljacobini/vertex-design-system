'use client';

import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * Sidebar — role-gated primary navigation (A3, S26).
 * Decoupled from auth-pattern: the host passes a `can(permission)` predicate
 * (e.g. useVtxSession().hasPermission). Items without a `permission` are always shown.
 * `linkComponent` lets the host inject next/link; defaults to a plain <a>.
 */
export interface SidebarNavItem {
  label: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  permission?: string;
  badge?: React.ReactNode;
}

export interface SidebarProps {
  items: SidebarNavItem[];
  activeHref?: string;
  can?: (permission: string) => boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  linkComponent?: React.ElementType;
  className?: string;
}

function Sidebar({
  items,
  activeHref,
  can,
  header,
  footer,
  linkComponent,
  className,
}: SidebarProps) {
  const Link = (linkComponent ?? 'a') as React.ElementType;
  const visible = items.filter((it) => !it.permission || (can ? can(it.permission) : true));
  return (
    <aside className={cn('flex h-full w-64 flex-col border-r border-border bg-card', className)}>
      {header ? <div className="border-b border-border px-4 py-4">{header}</div> : null}
      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Primary">
        {visible.map((it) => {
          const active = activeHref === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'border-l-2 border-primary bg-accent font-semibold text-foreground'
                  : 'border-l-2 border-transparent text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {it.icon ? <span className="shrink-0">{it.icon}</span> : null}
              <span className="flex-1 truncate">{it.label}</span>
              {it.badge ? <span className="ml-auto">{it.badge}</span> : null}
            </Link>
          );
        })}
      </nav>
      {footer ? <div className="border-t border-border p-3">{footer}</div> : null}
    </aside>
  );
}

export { Sidebar };
