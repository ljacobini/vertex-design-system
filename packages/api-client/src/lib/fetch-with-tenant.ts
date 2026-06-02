/**
 * fetch-with-tenant -- helper for multi-tenant header injection (ADR-004).
 *
 * Reserved headers (must NOT be overridden by consumer):
 *   - Authorization: Bearer <jwt>
 *   - X-Tenant-Id: <uuid>
 *
 * Used internally by createApiClient middleware (client.ts). Exported for advanced
 * consumers (server actions, SSR data fetchers, tests with custom fetch).
 */

export interface BuildTenantHeadersOptions {
  tenantId: string;
  token: string | null;
  /** Extra headers merged BEFORE reserved headers -- reserved win on conflict. */
  extra?: Record<string, string>;
}

const RESERVED_HEADERS = new Set(['authorization', 'x-tenant-id']);

export function buildTenantHeaders(opts: BuildTenantHeadersOptions): Record<string, string> {
  const headers: Record<string, string> = {};
  if (opts.extra) {
    for (const [key, value] of Object.entries(opts.extra)) {
      if (!RESERVED_HEADERS.has(key.toLowerCase())) {
        headers[key] = value;
      }
    }
  }
  headers['X-Tenant-Id'] = opts.tenantId;
  if (opts.token) {
    headers['Authorization'] = `Bearer ${opts.token}`;
  }
  return headers;
}

/**
 * Drop-in fetch wrapper auto-injecting tenant + auth headers.
 * For use cases where openapi-fetch Client is not applicable (raw multipart upload, etc.).
 */
export async function fetchWithTenant(
  input: RequestInfo | URL,
  init: (RequestInit & BuildTenantHeadersOptions) | BuildTenantHeadersOptions,
): Promise<Response> {
  const { tenantId, token, extra, ...rest } = init as RequestInit & BuildTenantHeadersOptions;
  const headers = new Headers(rest.headers);
  const tenantHeaders = buildTenantHeaders({ tenantId, token, extra });
  for (const [key, value] of Object.entries(tenantHeaders)) {
    headers.set(key, value);
  }
  return fetch(input, { ...rest, headers });
}
