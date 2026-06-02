import { defineConfig } from 'tsup';

/**
 * tsup build config for @vertex/api-client
 * - ESM-first + CJS fallback
 * - DTS for end-to-end type safety (paths <- OpenAPI spec)
 * Lifted from PMI commit 6cedd1b (S53 W2).
 */
export default defineConfig({
  entry: ['src/index.ts', 'src/client.ts', 'src/types/openapi.ts', 'src/lib/fetch-with-tenant.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  treeshake: true,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: 'dist',
});
