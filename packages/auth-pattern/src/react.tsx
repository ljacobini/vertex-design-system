"use client";

/**
 * @vertex/auth-pattern — react.tsx
 *
 * Client-side tenant + role context for the shared app shell. Provider-agnostic:
 * the app feeds in a resolved VtxAuthSession (from Auth.js `auth()` server-side,
 * or from a decoded demo token in pilot), and components below gate on
 * permissions/roles consistently across SAAS / PB / PMI.
 *
 * `react` is a peer dependency (the app owns React 19).
 */

import { createContext, useContext, useMemo, type ReactNode } from "react";

import type { AnyRole, VtxPermission } from "./roles";
import type { VtxAuthSession } from "./types";

interface VtxSessionContextValue {
  session: VtxAuthSession | null;
  hasPermission: (p: VtxPermission) => boolean;
  hasRole: (r: AnyRole | AnyRole[]) => boolean;
}

const VtxSessionContext = createContext<VtxSessionContextValue | null>(null);

export interface VtxSessionProviderProps {
  session: VtxAuthSession | null;
  children: ReactNode;
}

/** Wrap the app shell with the current session. */
export function VtxSessionProvider({ session, children }: VtxSessionProviderProps) {
  const value = useMemo<VtxSessionContextValue>(() => {
    const perms = session?.permissions ?? [];
    const role = session?.role ?? null;
    return {
      session,
      hasPermission: (p) => perms.includes(p),
      hasRole: (r) => {
        if (role === null) return false;
        return Array.isArray(r) ? r.includes(role) : r === role;
      },
    };
  }, [session]);

  return <VtxSessionContext.Provider value={value}>{children}</VtxSessionContext.Provider>;
}

/** Read the full session context (throws if used outside the provider). */
export function useVtxSessionContext(): VtxSessionContextValue {
  const ctx = useContext(VtxSessionContext);
  if (ctx === null) {
    throw new Error("useVtxSession* must be used within <VtxSessionProvider>.");
  }
  return ctx;
}

/** The current resolved session (or null if signed out). */
export function useVtxSession(): VtxAuthSession | null {
  return useVtxSessionContext().session;
}

/** Reactive permission check. */
export function useHasPermission(permission: VtxPermission): boolean {
  return useVtxSessionContext().hasPermission(permission);
}

/** Reactive role check (single role or any-of list). */
export function useHasRole(role: AnyRole | AnyRole[]): boolean {
  return useVtxSessionContext().hasRole(role);
}

export interface GateProps {
  fallback?: ReactNode;
  children: ReactNode;
}

/** Render children only if the session holds `require` permission. */
export function PermissionGate({
  require: permission,
  fallback = null,
  children,
}: GateProps & { require: VtxPermission }) {
  return useHasPermission(permission) ? <>{children}</> : <>{fallback}</>;
}

/** Render children only if the session holds one of `require` roles. */
export function RoleGate({
  require: role,
  fallback = null,
  children,
}: GateProps & { require: AnyRole | AnyRole[] }) {
  return useHasRole(role) ? <>{children}</> : <>{fallback}</>;
}
