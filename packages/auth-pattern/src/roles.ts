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
