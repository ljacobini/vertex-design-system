'use client';

import * as React from 'react';

import { cn } from '../lib/utils';

/**
 * AppShell — responsive application frame (A3, S26).
 * Desktop: persistent sidebar. Mobile: off-canvas drawer toggled via the TopBar menu button.
 * Compose with <Sidebar> and <TopBar>. The shell owns the open/close state and passes
 * `onMenuClick` into `renderTopBar` so the host can wire it to its TopBar instance.
 */
export interface AppShellProps {
  sidebar: React.ReactNode;
  renderTopBar?: (opts: { onMenuClick: () => void }) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

function AppShell({ sidebar, renderTopBar, children, className }: AppShellProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={cn('flex h-screen w-full overflow-hidden bg-background', className)}>
      <div className="hidden lg:flex">{sidebar}</div>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full">{sidebar}</div>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        {renderTopBar ? renderTopBar({ onMenuClick: () => setOpen((v) => !v) }) : null}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}

export { AppShell };
