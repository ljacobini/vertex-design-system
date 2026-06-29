/**
 * @vertex/auth-pattern — public API (FULL, S24)
 *
 * SKELETON -> FULL. The cross-project authentication + RBAC foundation,
 * consumed identically by SAAS / PB / PMI (build-once, consume-3x).
 *
 * Modules:
 *   roles        — role + permission contract (source of truth, mirrored in Python)
 *   types        — JWT claim + session shapes
 *   session      — pure claims -> resolved session mapping
 *   jwt          — verify / decode / dev-sign (jose, edge-compatible)
 *   auth-config  — Auth.js v5 NextAuthConfig factory (tenant + role callbacks)
 *   react        — VtxSessionProvider + hooks + PermissionGate / RoleGate ("use client")
 *
 * Note: next-auth, jose, react are peer dependencies — the consuming app owns
 * the versions. The package is consumed as source (Next transpiles), like
 * @vertex/ui; no separate build step is required for consumption.
 *
 * Ref: VTX_Programma_360 §1/§2; Design_System_Spec_v1.0 §8;
 *      02_Shared_Kernel/SDL_Orchestrator_AgentRegistry_Contract.
 */

export const VTX_AUTH_PATTERN_VERSION = "1.1.0";

// --- contract core ---
export {
  VTX_ROLES,
  VTX_PERMISSIONS,
  ROLE_PERMISSIONS,
  DEFAULT_ROLE,
  isVtxRole,
  coerceRole,
  roleHasPermission,
  permissionsForRole,
  PB_ROLES,
  PB_ROLE_PERMISSIONS,
  PB_ROLE_TIER,
  isPbRole,
  pbRoleHasPermission,
  isAnyRole,
  coerceAnyRole,
  anyRolePermissions,
  tierForRole,
} from "./roles";
export type { VtxRole, VtxPermission, PbRole, AnyRole } from "./roles";

// --- types ---
export type {
  VtxClaims,
  VtxAuthSession,
  VtxVerifyResult,
  VtxAuthErrorReason,
} from "./types";

// --- session helpers ---
export {
  sessionFromClaims,
  missingRequiredClaims,
  sessionHasAll,
  sessionHasAny,
} from "./session";

// --- jwt ---
export {
  verifyVtxToken,
  verifyVtxTokenWithKey,
  verifyVtxTokenDual,
  decodeVtxTokenUnsafe,
  signVtxDevToken,
} from "./jwt";

// --- auth.js config ---
export { createVertexAuthConfig } from "./auth-config";
export type { VertexAuthOptions } from "./auth-config";

// --- react (re-exported from ./react; "use client") ---
export {
  VtxSessionProvider,
  useVtxSession,
  useVtxSessionContext,
  useHasPermission,
  useHasRole,
  PermissionGate,
  RoleGate,
} from "./react";
export type { VtxSessionProviderProps, GateProps } from "./react";

// --- SDL client/KYC data contract (CONTRACT_VERSION 1.2.0, S26 SYNC-1) ---
export * from "./sdl-client";
