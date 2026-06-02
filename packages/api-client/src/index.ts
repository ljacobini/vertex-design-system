/**
 * @vertex/api-client -- public API surface
 *
 * Lifted from ljacobini/vertex-platform PMI commit 6cedd1b (S53 W2).
 * Design System Spec v1.0 sec.7: openapi-fetch typed HTTP client + tenant injection middleware.
 *
 * ADR-002 backend stack: FastAPI exposes OpenAPI 3.1; consumer TS via openapi-typescript + openapi-fetch.
 * ADR-004 multi-tenant: every request propagates `Authorization: Bearer <jwt>` + `X-Tenant-Id` headers.
 *
 * Q-DS-S17-04 (S20 cutoff): 2 separate clients -- @vertex/api-client-pmi + @vertex/api-client-saas.
 * S19 W3: single lifted client, fork S20.
 */

export {
  createApiClient,
  type ApiClient,
  type ApiClientOptions,
  type TokenProvider,
} from './client';

export { fetchWithTenant, buildTenantHeaders } from './lib/fetch-with-tenant';

export type { paths, components } from './types/openapi';
