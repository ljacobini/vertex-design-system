// STUB lifted from PMI 6cedd1b -- Q-DS-S17-04 deferred S20 (fork multi-backend OR keep single client TBD post-MVP)
// Regen via: openapi-typescript <api-url>/openapi.json -o ./openapi.ts

/**
 * AUTO-GENERATED -- DO NOT EDIT
 * Generated from apps/api OpenAPI 3.1 spec via openapi-typescript.
 *
 * Status: STUB lifted from PMI commit 6cedd1b. Replace via `pnpm --filter @vertex/api-client gen:types` (M3).
 * Pre-requisite: apps/api running on $OPENAPI_URL (default http://localhost:8000),
 *                OR static spec file at $OPENAPI_SPEC_FILE.
 *
 * See ./README.md for full generation workflow.
 */

export interface paths {
  '/healthz': {
    get: {
      responses: {
        200: {
          content: {
            'application/json': {
              status: string;
            };
          };
        };
      };
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type components = Record<string, never>; // placeholder M3

export type operations = Record<string, never>; // placeholder M3
