/**
 * @vertex/auth-pattern — jwt.ts
 *
 * JWT encode/decode/verify helpers built on `jose` (edge-compatible:
 * usable from Next.js middleware, route handlers and server components).
 *
 * HS256 is the pilot default (matches the backend demo-token path).
 * In production use RS256 with the IdP's JWKS — `verifyVtxToken` accepts a
 * pre-built key so the same code path serves both.
 *
 * SECURITY: never embed a real secret in client bundles. Call these helpers
 * only from server contexts (middleware, route handlers, server components).
 */

import { jwtVerify, SignJWT, type JWTPayload } from "jose";

import { sessionFromClaims, missingRequiredClaims } from "./session";
import type { VtxClaims, VtxVerifyResult } from "./types";

const ALG_HS256 = "HS256";

function hsKey(secret: string): Uint8Array {
  return new TextEncoder().encode(secret);
}

/**
 * Verify a JWT and resolve it to a VtxAuthSession.
 * Returns a typed result instead of throwing, so callers (middleware, guards)
 * can branch cleanly.
 *
 * @param token   the raw bearer token (no "Bearer " prefix)
 * @param secret  HS256 shared secret (pilot) — for RS256 use `verifyVtxTokenWithKey`
 */
export async function verifyVtxToken(token: string, secret: string): Promise<VtxVerifyResult> {
  if (!token) {
    return { ok: false, reason: "missing_token", message: "Bearer token assente." };
  }
  return verifyWith(token, hsKey(secret), [ALG_HS256]);
}

/**
 * Verify a JWT against a pre-built key (e.g. RS256 public key / JWKS entry).
 * Use this path in production with the customer IdP.
 */
export async function verifyVtxTokenWithKey(
  token: string,
  key: Parameters<typeof jwtVerify>[1],
  algorithms: string[] = ["RS256"],
): Promise<VtxVerifyResult> {
  if (!token) {
    return { ok: false, reason: "missing_token", message: "Bearer token assente." };
  }
  return verifyWith(token, key, algorithms);
}

async function verifyWith(
  token: string,
  key: Parameters<typeof jwtVerify>[1],
  algorithms: string[],
): Promise<VtxVerifyResult> {
  let payload: JWTPayload;
  try {
    const res = await jwtVerify(token, key, { algorithms });
    payload = res.payload;
  } catch (err) {
    const name = (err as { code?: string; name?: string }).code ?? (err as Error).name ?? "";
    if (String(name).includes("JWTExpired")) {
      return { ok: false, reason: "token_expired", message: "Token JWT scaduto." };
    }
    return { ok: false, reason: "token_invalid", message: "Token JWT non valido." };
  }

  const claims = payload as unknown as VtxClaims;
  const missing = missingRequiredClaims(claims);
  if (missing.length > 0) {
    return {
      ok: false,
      reason: "token_missing_claims",
      message: `Claim obbligatori mancanti: ${missing.join(", ")}`,
    };
  }

  return { ok: true, session: sessionFromClaims(claims), claims };
}

/**
 * Decode a JWT WITHOUT verifying the signature. Client-safe (no secret), but
 * NEVER trust the result for authorization — display only.
 */
export function decodeVtxTokenUnsafe(token: string): VtxClaims | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const json =
      typeof atob === "function"
        ? atob(parts[1]!.replace(/-/g, "+").replace(/_/g, "/"))
        : Buffer.from(parts[1]!, "base64").toString("utf-8");
    return JSON.parse(json) as VtxClaims;
  } catch {
    return null;
  }
}

/**
 * Sign a short-lived HS256 token. DEV / PILOT ONLY — mirrors the backend
 * `create_dev_token`. Production tokens come from a certified IdP.
 */
export async function signVtxDevToken(
  claims: VtxClaims,
  secret: string,
  ttlSeconds = 1800,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: claims.sub,
    tenant_id: claims.tenant_id,
    role: claims.role ?? "ADVISOR",
    email: claims.email,
    iss: claims.iss ?? "vertex-auth-pattern-dev",
  };
  return new SignJWT(payload)
    .setProtectedHeader({ alg: ALG_HS256 })
    .setIssuedAt(now)
    .setExpirationTime(now + ttlSeconds)
    .sign(hsKey(secret));
}
