/**
 * @vertex/ui - public API surface
 *
 * Vertex Shared Design System -- shadcn/Radix components + VTX brand tokens.
 * Lifted from ljacobini/vertex-platform PMI commit 6cedd1b (S53 W2 Phase 5.1+5.2).
 *
 * Components (12):
 *   M2 baseline: Button, Card, Input
 *   S45 W2: Dialog, Table
 *   S46 W3: Textarea, Badge, Label, Checkbox, RadioGroup, Select
 *   S46 W4: Form (RHF wrapper)
 */

/* M2 baseline */
export { Button, buttonVariants, type ButtonProps } from './components/button';
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './components/card';
export { Input, type InputProps } from './components/input';

/* S45 W2 Vertex Platform Unified Design Language additions */
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/dialog';
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/table';

/* S46 W3 primitives extend */
export { Textarea, type TextareaProps } from './components/textarea';
export { Badge, badgeVariants, type BadgeProps } from './components/badge';
export { Label } from './components/label';
export { Checkbox } from './components/checkbox';
export { RadioGroup, RadioGroupItem } from './components/radio';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/select';

/* S46 W4 React Hook Form wrapper */
export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
} from './components/form';

/* S26 A3 — application shell (premium): app frame, role-gated nav, dashboard tiles, agent catalog */
export { AppShell, type AppShellProps } from './components/app-shell';
export { Sidebar, type SidebarProps, type SidebarNavItem } from './components/sidebar';
export { TopBar, type TopBarProps } from './components/top-bar';
export { PageHeader, type PageHeaderProps } from './components/page-header';
export { StatCard, type StatCardProps } from './components/stat-card';
export { AgentCard, type AgentCardProps } from './components/agent-card';
export {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
} from './components/data-table';

/* Utilities */
export { cn } from './lib/utils';

/* Re-export tokens types for convenience */
export type { SeverityLevel, TenantId } from '@vertex/tokens';
