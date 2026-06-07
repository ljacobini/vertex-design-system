'use client';

import * as React from 'react';

import { cn } from '../lib/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card';
import { Button } from './button';
import { Badge, type BadgeProps } from './badge';

/**
 * AgentCard — catalog tile for an orchestration agent (A3, S26).
 * Permission-aware CTA: pass `canInvoke` (e.g. from auth-pattern hasPermission('agents:invoke')).
 * Client component (onInvoke handler).
 */
type AgentStatus = 'active' | 'beta' | 'disabled';

const statusVariant: Record<AgentStatus, BadgeProps['variant']> = {
  active: 'success',
  beta: 'warning',
  disabled: 'secondary',
};

export interface AgentCardProps {
  name: React.ReactNode;
  description?: React.ReactNode;
  category?: React.ReactNode;
  status?: AgentStatus;
  icon?: React.ReactNode;
  ctaLabel?: string;
  canInvoke?: boolean;
  onInvoke?: () => void;
  className?: string;
}

function AgentCard({
  name,
  description,
  category,
  status = 'active',
  icon,
  ctaLabel = 'Invoke',
  canInvoke = true,
  onInvoke,
  className,
}: AgentCardProps) {
  const blocked = status === 'disabled' || !canInvoke;
  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {icon ? <span className="text-primary">{icon}</span> : null}
            <CardTitle>{name}</CardTitle>
          </div>
          <Badge variant={statusVariant[status]}>{status}</Badge>
        </div>
        {category ? <CardDescription>{category}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex-1">
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </CardContent>
      <CardFooter>
        <Button onClick={onInvoke} disabled={blocked} className="w-full">
          {!canInvoke ? 'No permission' : ctaLabel}
        </Button>
      </CardFooter>
    </Card>
  );
}

export { AgentCard };
