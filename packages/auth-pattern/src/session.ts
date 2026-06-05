/**
 * @vertex/auth-pattern — session.ts
 *
 * Pure (zero runtime deps) mapping from raw JWT claims to a resolved
 * VtxAuthSession: coerces the role and expands the permission set.
 * Used by both the JWT verifier (jwt.ts) and the Auth.js session callback.
 */

import { coerceRole, permissionsForRole } from "./roles";
import type { VtxAuthSession, VtxClaims } from "./types";

/** Claims that must be present for a usable session. */
const REQUIRED_CLAIMS = ["sub", "tenant_id"] as const;

/** Returns the list of missing required claims (empty array = valid). */
export function missingRequiredClaims(claims: Partial<VtxClaims>): string[] {
  return REQUIRED_CLAIMS.filter((k) => {
    const v = claims[k];
    return v === undefined || v === null || v === "";
  });
}

/** Build a resolved, app-facing session from verified claims. */
export function sessionFromClaims(claims: VtxClaims): VtxAuthSession {
  const role = coerceRole(claims.role);
  return {
    userId: claims.sub,
    tenantId: claims.tenant_id,
    email: claims.email ?? null,
    role,
    permissions: permissionsForRole(role),
    exp: typeof claims.exp === "number" ? claims.exp : null,
  };
}

/** True if `session` holds every permission in `required`. */
export function sessionHasAll(
  session: Pick<VtxAuthSession, "permissions">,
  required: VtxAuthSession["permissions"],
): boolean {
  return required.every((p) => session.permissions.includes(p));
}

/** True if `session` holds at least one permission in `any`. */
export function sessionHasAny(
  session: Pick<VtxAuthSession, "permissions">,
  any: VtxAuthSession["permissions"],
): boolean {
  return any.some((p) => session.permissions.includes(p));
}
