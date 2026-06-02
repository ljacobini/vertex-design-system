# @vertex/api-client

Vertex Shared Design System -- Typed HTTP client (openapi-fetch + tenant injection middleware).

Lifted from `ljacobini/vertex-platform` PMI commit 6cedd1b (S53 W2).

## Features

- openapi-fetch typed HTTP client (zero-runtime cost)
- Tenant ID injection middleware (X-Vertex-Tenant-Id header)
- Retry + error handling primitives
- OpenAPI types stub regen-ready (Q-DS-S17-04 fork multi-backend S20 decision)

## Consumer

```typescript
import { createApiClient } from '@vertex/api-client'
const api = createApiClient({ baseUrl: '/api', tenantId: 'tenant-x', getToken: async () => null })
```

## Open questions

- Q-DS-S17-04 (S20): fork into @vertex/api-client-pmi + @vertex/api-client-saas OR keep single client multi-backend? Default: 2 separate clients (S20 decision).

## Package structure

```
src/
  client.ts                 -- createApiClient factory (openapi-fetch + middleware)
  lib/fetch-with-tenant.ts  -- tenant injection middleware (buildTenantHeaders, fetchWithTenant)
  types/openapi.ts          -- OpenAPI generated types (STUB -- regen from live spec)
  types/README.md           -- regen instructions + CI gate (M3)
  index.ts                  -- public re-exports
tsup.config.ts              -- ESM + CJS dual build
tsconfig.json               -- extends tsconfig.base.json
```

## Regen types

```bash
# from live API
pnpm gen:types

# from static spec file
pnpm gen:types:file
```
