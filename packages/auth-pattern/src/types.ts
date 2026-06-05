/**
 * @vertex/auth-pattern — types.ts
 *
 * Shared claim + session shapes. Pure TypeScript, zero runtime deps.
 * These match the JWT contract emitted by the backend (HS256 in pilot,
 * RS256 via IdP in production) and consumed by Auth.js v5 callbacks.
 */

import type { VtxPermission, VtxRole } from "./roles";

/**
 * Canonical JWT claim set (the wire contract).
 * `role` is OPTIONAL on the wire for backward compatibility: a token without
 * `role` is treated as DEFAULT_ROLE (VIEWER) by every consumer. This is what
 * keeps the legacy `/invoke` demo path additive — old demo tokens still work.
 */
export interface VtxClaims {
  /** subject — user id */
  sub: string;
  /** tenant the user belongs to */
  tenant_id: string;
  /** RBAC role (optional on wire → coerced to VIEWER if absent) */
  role?: VtxRole | string;
  /** display email (optional) */
  email?: string;
  /** issued-at (epoch seconds) */
  iat?: number;
  /** expiry (epoch seconds) */
  exp?: number;
  /** issuer */
  iss?: string;
}

/** Resolved, app-facing session (role coerced, permissions expanded). */
export interface VtxAuthSession {
  userId: string;
  tenantId: string;
  email: string | null;
  role: VtxRole;
  permissions: VtxPermission[];
  /** expiry epoch seconds, or null if not present */
  exp: number | null;
}

/** Result of verifying a token: either a session or a typed failure. */
export type VtxVerifyResult =
  | { ok: true; session: VtxAuthSession; claims: VtxClaims }
  | { ok: false; reason: VtxAuthErrorReason; message: string };

export type VtxAuthErrorReason =
  | "missing_token"
  | "token_expired"
  | "token_invalid"
  | "token_missing_claims";
