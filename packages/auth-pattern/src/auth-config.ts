/**
 * @vertex/auth-pattern — auth-config.ts
 *
 * Auth.js v5 (next-auth@5) configuration factory shared by SAAS / PB / PMI.
 * Produces a NextAuthConfig whose jwt + session callbacks carry the Vertex
 * contract claims (tenant_id, role) end-to-end, so RBAC is identical across
 * the three frontends.
 *
 * Usage (per app):
 *   // app/auth.ts
 *   import NextAuth from "next-auth";
 *   import Credentials from "next-auth/providers/credentials";
 *   import { createVertexAuthConfig } from "@vertex/auth-pattern";
 *   export const { handlers, auth, signIn, signOut } = NextAuth(
 *     createVertexAuthConfig({ providers: [Credentials({ ... })] })
 *   );
 *
 * `next-auth` is a peer dependency: the consuming app owns the version.
 */

import type { NextAuthConfig } from "next-auth";

import { coerceRole, permissionsForRole } from "./roles";
import type { VtxRole } from "./roles";

export interface VertexAuthOptions {
  /** Auth.js providers (Credentials, Google Workspace, Microsoft Entra ID, ...). */
  providers: NextAuthConfig["providers"];
  /** Route the user is sent to for sign-in. Default: "/login". */
  signInPage?: string;
  /** Session max age (seconds). Default: 1800 (30 min, banking-grade short). */
  maxAgeSeconds?: number;
  /** Optional hook fired on sign-in/sign-out for audit-chain integration. */
  onAuthEvent?: (event: "signIn" | "signOut", info: Record<string, unknown>) => void;
}

/**
 * Build the shared NextAuthConfig. The jwt callback is the contract boundary:
 * on first sign-in it copies tenant_id + role from the authorized user onto the
 * token; the session callback re-exposes them (with expanded permissions) to
 * the React layer.
 */
export function createVertexAuthConfig(opts: VertexAuthOptions): NextAuthConfig {
  const maxAge = opts.maxAgeSeconds ?? 1800;

  return {
    providers: opts.providers,
    session: { strategy: "jwt", maxAge },
    pages: { signIn: opts.signInPage ?? "/login" },
    callbacks: {
      async jwt({ token, user }) {
        // On first sign-in `user` is the object returned by the provider's
        // authorize(): it must expose tenant_id + role (Vertex contract).
        if (user) {
          const u = user as Record<string, unknown>;
          if (typeof u.tenant_id === "string") token.tenant_id = u.tenant_id;
          if (u.role !== undefined) token.role = coerceRole(u.role);
        }
        if (token.role === undefined) token.role = "VIEWER";
        return token;
      },
      async session({ session, token }) {
        const role = coerceRole(token.role);
        const s = session as unknown as Record<string, unknown>;
        s.tenantId = (token.tenant_id as string) ?? null;
        s.role = role as VtxRole;
        s.permissions = permissionsForRole(role);
        if (session.user) {
          const su = session.user as Record<string, unknown>;
          su.tenantId = (token.tenant_id as string) ?? null;
          su.role = role;
        }
        return session;
      },
    },
    events: {
      async signIn(message) {
        opts.onAuthEvent?.("signIn", { user: message.user?.email });
      },
      async signOut() {
        opts.onAuthEvent?.("signOut", {});
      },
    },
  };
}
