# `src/types/` -- OpenAPI generated types

## Status: STUB (lifted from PMI 6cedd1b)

`openapi.ts` contains a placeholder with a single `/healthz` endpoint to validate
end-to-end type inference. Regenerate from the live API spec when available.

Q-DS-S17-04 (S20 decision): fork into @vertex/api-client-pmi + @vertex/api-client-saas
OR keep single multi-backend client. Default: 2 separate clients (S20 decision gate).

## Generation workflow

### Option A -- live API (preferred dev flow)

```bash
# 1. start apps/api FastAPI (separate shell)
cd apps/api
uvicorn src.main:app --reload --port 8000

# 2. generate types from live OpenAPI endpoint
cd ../../packages/api-client
pnpm gen:types
```

### Option B -- static spec file (CI / offline)

```bash
# 1. export OpenAPI spec from apps/api
cd apps/api
python -m src.export_openapi > openapi.json

# 2. generate types from file
cd ../../packages/api-client
pnpm gen:types:file
```

## DO NOT EDIT manually

`openapi.ts` is deterministic output. Manual changes are lost on next `gen:types`.

If you need a type-side extension (branded types, custom type guards):

- create a new file `src/types/extensions.ts`
- re-export via `src/index.ts`
- do NOT touch `openapi.ts`

## CI gate (M3)

Pipeline GitHub Actions:

1. `apps/api` tests pass -- generate `openapi.json` artifact
2. `packages/api-client` job: `pnpm gen:types:file` from artifact
3. Diff check vs committed `openapi.ts` -- fail if drift
4. `pnpm build` + type-check downstream `apps/web`

## ADR cross-reference

- **ADR-002 backend stack**: FastAPI emits OpenAPI 3.1, frontend consumes type-safe
- **ADR-001 frontend stack**: api-client is dependency `apps/web` end-to-end typed
