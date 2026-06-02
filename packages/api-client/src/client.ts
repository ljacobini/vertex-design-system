import createClient, { type Middleware, type Client } from 'openapi-fetch';

import type { paths } from './types/openapi';
import { buildTenantHeaders } from './lib/fetch-with-tenant';

/**
 * Token provider -- async resolver returning current JWT for the session.
 * Consumer (apps/web) typically wraps Auth.js session token retrieval.
 * Async to allow lazy/refresh-aware token fetch.
 */
export type TokenProvider = () => string | null | Promise<string | null>;

export interface ApiClientOptions {
  /** Base URL of apps/api (e.g. https://api.vertex-advisory.com or http://localhost:8000). */
  baseUrl: string;
  /** Resolved tenant_id (UUID) for the current request context. ADR-004 mandatory. */
  tenantId: string;
  /** Async JWT provider -- returns null if unauthenticated (public endpoints only). */
  getToken: TokenProvider;
  /** Optional fetch override (testing, MSW interception). Defaults to global fetch. */
  fetch?: typeof globalThis.fetch;
  /** Optional headers merged after auth/tenant headers (consumer cannot override reserved headers). */
  extraHeaders?: Record<string, string>;
}

/**
 * Typed openapi-fetch Client over generated `paths` interface.
 * Branded for re-export clarity.
 */
export type ApiClient = Client<paths>;

/**
 * Factory creating a typed openapi-fetch client with:
 * - tenant + auth header injection via middleware
 * - end-to-end TypeScript inference from FastAPI OpenAPI 3.1 spec
 *
 * Usage (apps/web):
 *
 *   const api = createApiClient({
 *     baseUrl: process.env.NEXT_PUBLIC_API_URL!,
 *     tenantId: session.tenantId,
 *     getToken: async () => (await getSession())?.accessToken ?? null
 *   });
 *
 *   const { data, error } = await api.GET("/healthz");
 *
 * TODO M3:
 * - error normalization middleware (RFC 7807 problem+json mapping -> typed AppError union)
 * - retry policy w/ exponential backoff (idempotent verbs only)
 * - request_id correlation header (X-Request-Id propagation for distributed tracing)
 * - response logging middleware (dev only, redact PII)
 */
export function createApiClient(opts: ApiClientOptions): ApiClient {
  const client = createClient<paths>({
    baseUrl: opts.baseUrl,
    fetch: opts.fetch,
  });

  const authTenantMiddleware: Middleware = {
    async onRequest({ request }) {
      const token = await opts.getToken();
      const headers = buildTenantHeaders({
        tenantId: opts.tenantId,
        token,
        extra: opts.extraHeaders,
      });
      for (const [key, value] of Object.entries(headers)) {
        request.headers.set(key, value);
      }
      return request;
    },
  };

  client.use(authTenantMiddleware);
  return client;
}
