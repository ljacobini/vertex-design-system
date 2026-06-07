import * as React from 'react';

import { cn } from '../lib/utils';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table';

/**
 * DataTable — generic, column-driven table wrapper over the @vertex/ui Table primitives (A3, S26).
 * Presentational: no fetching, no sorting state. Host supplies columns + rows + a stable rowKey.
 */
export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T, index: number) => string | number;
  caption?: React.ReactNode;
  emptyText?: React.ReactNode;
  className?: string;
}

const alignClass = { left: 'text-left', right: 'text-right', center: 'text-center' } as const;

function DataTable<T>({
  columns,
  rows,
  rowKey,
  caption,
  emptyText = 'No data.',
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('rounded-lg border border-border', className)}>
      <Table>
        {caption ? <TableCaption>{caption}</TableCaption> : null}
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead
                key={c.key}
                className={cn(c.align ? alignClass[c.align] : undefined, c.className)}
              >
                {c.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-sm text-muted-foreground"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row, i) => (
              <TableRow key={rowKey(row, i)}>
                {columns.map((c) => (
                  <TableCell
                    key={c.key}
                    className={cn(c.align ? alignClass[c.align] : undefined, c.className)}
                  >
                    {c.render ? c.render(row, i) : (row as Record<string, React.ReactNode>)[c.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export { DataTable };
