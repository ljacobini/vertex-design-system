import { defineConfig } from 'tsup';

/**
 * tsup build config for @vertex/ui
 * - ESM-first + CJS fallback (ADR-001 ecosystem alignment)
 * - DTS emission for end-to-end type safety with apps/web consumer
 * - react / react-dom externalized to peer dep (consumer-resolved)
 */
export default defineConfig({
  entry: ['src/index.ts', 'src/components/*.tsx', 'src/lib/utils.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  treeshake: true,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['react', 'react-dom', 'react-hook-form'],
  outDir: 'dist',
  // S52 W1-quinquies: inject 'use client' directive in bundled output.
  // tsup/esbuild strips directives during bundle. Without 'use client' Next.js 14
  // App Router resolves react-hook-form via "react-server" exports condition
  // (stub package for RSC) → useFormContext/Controller/FormProvider missing.
  // Banner forza Next.js a trattare dist/ come client component → resolve
  // react-hook-form via "import" condition (full client exports).
  banner: {
    js: "'use client';",
  },
});
