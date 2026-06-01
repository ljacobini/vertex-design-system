/**
 * @vertex/api-client — public API
 *
 * S18 status: SKELETON. Full lift from vertex-platform/packages/api-client/ deferred S19.
 *
 * Planned (Design_System_Spec_v1.0 §7):
 *   - createClient<paths>({ baseUrl, fetch, tenantId })
 *   - Tenant header injection (X-Tenant-ID)
 *   - JWT auth bearer interceptor
 *   - Retry policy (3 attempts, exp backoff)
 *   - Error normalization (VtxApiError)
 *
 * Q-DS-S17-04 (S20 cutoff): 2 client distinti — @vertex/api-client-pmi + @vertex/api-client-saas.
 * S18 W1: keep single skeleton, fork S20.
 */

export interface VtxClientConfig {
  baseUrl: string;
  tenantId: string;
  getToken?: () => Promise<string | null>;
}

export const __vertex_api_client_skeleton__ = "0.1.0";
