/**
 * @vertex/auth-pattern — roles.ts
 *
 * CONTRACT CORE (single source of truth for RBAC across SAAS / PB / PMI).
 * Pure TypeScript, zero runtime deps: must typecheck stand-alone.
 *
 * The Python backend (vertex_agent_platform.rbac) MUST mirror this matrix
 * byte-for-byte (same role names, same permission names, same mapping).
 * Any change here is a cross-project contract change → propagate to all 3 stacks
 * and bump CONTRACT_VERSION in 02_Shared_Kernel/SDL_Orchestrator_AgentRegistry_Contract.
 *
 * Ref: VTX_Programma_360 §1/§5, Design_System_Spec_v1.0 §8.
 */

/** Roles for the SAAS hub (6). Domains (PB/PMI) extend with their own role maps
 *  but reuse the SAME permission vocabulary below. */
export const VTX_ROLES = [
  "PLATFORM_ADMIN",
  "TENANT_ADMIN",
  "COMPLIANCE_OFFICER",
  "ADVISOR",
  "AUDITOR",
  "VIEWER",
] as const;

export type VtxRole = (typeof VTX_ROLES)[number];

/** Permission vocabulary (verb-scoped). Shared across all domains. */
export const VTX_PERMISSIONS = [
  "platform:admin", // manage the whole platform, all tenants
  "tenants:manage", // create / configure tenants
  "users:manage", // invite users, assign roles (within tenant)
  "users:read", // view users of the tenant
  "agents:invoke", // run an agent pipeline (reactive)
  "agents:invoke_restricted", // run an agent in restricted mode (quota+skill subset; domain EXTERNAL_ADVISOR). C1/R-VPCL-010.
  "agents:read", // view the agent catalog
  "audit:read", // read the SHA-256 audit chain (own tenant)
  "billing:read", // view usage / billing dashboards
  "billing:manage", // change plan / payment method
  "compliance:review", // compliance oversight actions
  "proactive:manage", // configure scheduled / proactive agent runs
  "proactive:approve", // approve a human-gate (inderogabile)
] as const;

export type VtxPermission = (typeof VTX_PERMISSIONS)[number];

const ALL: VtxPermission[] = [...VTX_PERMISSIONS];

/**
 * Role → permission matrix. Least-privilege by design.
 * MIRRORED in vertex_agent_platform/rbac.py ROLE_PERMISSIONS.
 */
export const ROLE_PERMISSIONS: Record<VtxRole, readonly VtxPermission[]> = {
  PLATFORM_ADMIN: ALL,
  TENANT_ADMIN: [
    "users:manage",
    "users:read",
    "agents:invoke",
    "agents:invoke_restricted",
    "agents:read",
    "audit:read",
    "billing:read",
    "billing:manage",
    "compliance:review",
    "proactive:manage",
    "proactive:approve",
  ],
  COMPLIANCE_OFFICER: [
    "users:read",
    "agents:invoke",
    "agents:invoke_restricted",
    "agents:read",
    "audit:read",
    "compliance:review",
    "proactive:approve",
  ],
  ADVISOR: ["agents:invoke", "agents:invoke_restricted", "agents:read", "audit:read", "billing:read"],
  AUDITOR: ["users:read", "agents:read", "audit:read", "billing:read", "compliance:review"],
  VIEWER: ["agents:read"],
};

/** Default role applied when a JWT carries no `role` claim. Least privilege. */
export const DEFAULT_ROLE: VtxRole = "VIEWER";

/** Type guard: is `value` a known role? */
export function isVtxRole(value: unknown): value is VtxRole {
  return typeof value === "string" && (VTX_ROLES as readonly string[]).includes(value);
}

/** Normalize an arbitrary claim value to a known role (fallback = DEFAULT_ROLE). */
export function coerceRole(value: unknown): VtxRole {
  return isVtxRole(value) ? value : DEFAULT_ROLE;
}

/** Does `role` hold `permission`? */
export function roleHasPermission(role: VtxRole, permission: VtxPermission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

/** Full permission set for a role (as an array copy). */
export function permissionsForRole(role: VtxRole): VtxPermission[] {
  return [...ROLE_PERMISSIONS[role]];
}

// ---------------------------------------------------------------------------
// PB domain role map (T0-T4) — S39. Domains extend with their own role map but
// REUSE the shared VTX_PERMISSIONS vocabulary above. Tier and data-scope are
// orthogonal (carried as JWT claims tier_level / tenant_chain / scope), NOT
// permissions. MIRRORED in vertex_agent_platform/rbac.py PB_ROLE_PERMISSIONS.
// Additive contract change → CONTRACT_VERSION 1.2.0 → 1.3.0.
// ---------------------------------------------------------------------------

/** PB domain roles (commercial line Area→District→Branch→PB + control functions). */
export const PB_ROLES = [
  "PLATFORM_ADMIN",
  "BANK_ADMIN",
  "COMPLIANCE_OFFICER",
  "RISK_OFFICER",
  "AREA_MANAGER",
  "DISTRICT_MANAGER",
  "BRANCH_MANAGER",
  "PRIVATE_BANKER",
  "AUDITOR",
] as const;

export type PbRole = (typeof PB_ROLES)[number];

/** PB role → permission matrix. Reuses VTX_PERMISSIONS. Least-privilege per tier. */
export const PB_ROLE_PERMISSIONS: Record<PbRole, readonly VtxPermission[]> = {
  PLATFORM_ADMIN: ALL,
  BANK_ADMIN: [
    "tenants:manage",
    "users:manage",
    "users:read",
    "agents:read",
    "audit:read",
    "billing:read",
    "billing:manage",
    "proactive:manage",
  ],
  COMPLIANCE_OFFICER: ROLE_PERMISSIONS.COMPLIANCE_OFFICER,
  RISK_OFFICER: ["users:read", "agents:invoke", "agents:read", "audit:read", "compliance:review"],
  AREA_MANAGER: ["users:read", "agents:invoke", "agents:read", "audit:read", "billing:read", "proactive:approve"],
  DISTRICT_MANAGER: ["users:read", "agents:invoke", "agents:read", "audit:read"],
  BRANCH_MANAGER: ["users:read", "agents:invoke", "agents:read", "audit:read"],
  PRIVATE_BANKER: ["agents:invoke", "agents:invoke_restricted", "agents:read", "audit:read"],
  AUDITOR: ROLE_PERMISSIONS.AUDITOR,
};

/** PB role → tenant tier (T0-T4 / RO). Orthogonal to permissions. */
export const PB_ROLE_TIER: Record<PbRole, "T0" | "T1" | "T2" | "T3" | "T4" | "RO"> = {
  PLATFORM_ADMIN: "T0",
  BANK_ADMIN: "T1",
  COMPLIANCE_OFFICER: "T1",
  RISK_OFFICER: "T1",
  AREA_MANAGER: "T2",
  DISTRICT_MANAGER: "T3",
  BRANCH_MANAGER: "T3",
  PRIVATE_BANKER: "T4",
  AUDITOR: "RO",
};

/** Type guard: is `value` a known PB role? */
export function isPbRole(value: unknown): value is PbRole {
  return typeof value === "string" && (PB_ROLES as readonly string[]).includes(value);
}

/** Does a PB `role` hold `permission`? */
export function pbRoleHasPermission(role: PbRole, permission: VtxPermission): boolean {
  return PB_ROLE_PERMISSIONS[role].includes(permission);
}

// ---------------------------------------------------------------------------
// Cross-domain resolution (SAAS hub + PB) — S39 PB-4. Used by the cockpit
// session resolver so PB roles resolve permissions + tier (else they would
// coerce to VIEWER via the SAAS-only coerceRole).
// ---------------------------------------------------------------------------

/** Union of SAAS hub and PB domain role names. */
// ---------------------------------------------------------------------------
// PMI domain role map (S40). PMI Advisory Direct (T1 channel SKIPPABLE).
// Reuses shared VTX_PERMISSIONS. MIRRORED in rbac.py PMI_ROLE_PERMISSIONS.
// Additive contract change -> CONTRACT_VERSION 1.3.0 -> 1.4.0.
// ---------------------------------------------------------------------------

/** PMI domain roles (4 new + reused PLATFORM_ADMIN). */
export const PMI_ROLES = [
  "PLATFORM_ADMIN",
  "CFO",
  "CONTROLLER_ANALYST",
  "PMI_ADMIN",
  "EXTERNAL_ADVISOR",
] as const;

export type PmiRole = (typeof PMI_ROLES)[number];

/** PMI role to permission matrix. Reuses VTX_PERMISSIONS. Least-privilege. */
export const PMI_ROLE_PERMISSIONS: Record<PmiRole, readonly VtxPermission[]> = {
  PLATFORM_ADMIN: ALL,
  CFO: ["agents:invoke", "agents:read", "audit:read", "billing:read", "users:read"],
  CONTROLLER_ANALYST: ["agents:invoke", "agents:read", "audit:read"],
  PMI_ADMIN: [
    "users:manage",
    "users:read",
    "agents:read",
    "audit:read",
    "billing:read",
    "billing:manage",
    "proactive:manage",
  ],
  EXTERNAL_ADVISOR: ["agents:invoke", "agents:invoke_restricted", "agents:read", "audit:read"],
};

/** PMI role to tenant tier. EXTERNAL_ADVISOR = T2 cross-tenant (time-boxed). */
export const PMI_ROLE_TIER: Record<PmiRole, "T0" | "T2" | "T4"> = {
  PLATFORM_ADMIN: "T0",
  CFO: "T4",
  CONTROLLER_ANALYST: "T4",
  PMI_ADMIN: "T2",
  EXTERNAL_ADVISOR: "T2",
};

/** Type guard: is `value` a known PMI role? */
export function isPmiRole(value: unknown): value is PmiRole {
  return typeof value === "string" && (PMI_ROLES as readonly string[]).includes(value);
}

/** Does a PMI `role` hold `permission`? */
export function pmiRoleHasPermission(role: PmiRole, permission: VtxPermission): boolean {
  return PMI_ROLE_PERMISSIONS[role].includes(permission);
}

export type AnyRole = VtxRole | PbRole | PmiRole;

/** Combined role→permission lookup (SAAS 6 + PB). Reused keys map to identical lists. */
const ANY_ROLE_PERMISSIONS: Record<string, readonly VtxPermission[]> = {
  ...ROLE_PERMISSIONS,
  ...PB_ROLE_PERMISSIONS,
  ...PMI_ROLE_PERMISSIONS,
};

const _ANY_ROLES: readonly string[] = [...new Set<string>([...VTX_ROLES, ...PB_ROLES, ...PMI_ROLES])];

/** Is `value` a known role in any domain (SAAS or PB)? */
export function isAnyRole(value: unknown): value is AnyRole {
  return typeof value === "string" && _ANY_ROLES.includes(value);
}

/** Normalize a claim to any known role (SAAS or PB); fallback DEFAULT_ROLE. */
export function coerceAnyRole(value: unknown): AnyRole {
  return isAnyRole(value) ? (value as AnyRole) : DEFAULT_ROLE;
}

/** Permission set for any role (SAAS or PB) — array copy. */
export function anyRolePermissions(role: AnyRole): VtxPermission[] {
  return [...(ANY_ROLE_PERMISSIONS[role] ?? ROLE_PERMISSIONS[DEFAULT_ROLE])];
}

/** Tenant tier (T0-T4 / RO) for a role, or null for SAAS roles without a tier. */
export function tierForRole(role: AnyRole): string | null {
  return (
    (PB_ROLE_TIER as Record<string, string>)[role] ??
    (PMI_ROLE_TIER as Record<string, string>)[role] ??
    null
  );
}
