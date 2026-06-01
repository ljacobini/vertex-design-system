/**
 * @vertex/auth-pattern — public API
 *
 * S18 status: SKELETON. Full pattern lift from PMI auth/ deferred S19.
 *
 * Planned (Design_System_Spec_v1.0 §8):
 *   - JWT helpers (encode/decode/verify) with HS256 default
 *   - SSO flow (Google Workspace + Microsoft 365 providers)
 *   - Tenant context React provider <TenantProvider tenantId>
 *   - Auth.js v5 callbacks (jwt + session + signIn) Vertex defaults
 *   - Audit log integration (sign-in / sign-out events -> POST audit chain)
 */

export interface VtxAuthSession {
  userId: string;
  tenantId: string;
  email: string;
  roles: string[];
  exp: number;
}

export const __vertex_auth_pattern_skeleton__ = "0.1.0";
