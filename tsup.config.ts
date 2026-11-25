import { defineConfig } from 'tsup';

// One bundled file per format: dist/index.mjs (import) and dist/index.cjs (require),
// with type definitions for both. React, date-fns and classnames stay external.
//
// The source imports the SCSS stylesheet; the package ships it compiled to
// dist/styles.css (`npm run build:css`), so the bundles import that file instead.
export default defineConfig({
  entry: { index: 'src/index.ts' },
  format: ['esm', 'cjs'],
  dts: true,
  clean: false,
  splitting: false,
  sourcemap: false,
  minify: false,
  target: 'es2020',
  outDir: 'dist',
  skipNodeModulesBundle: true,
  // The calendar uses state and effects: mark it as a Client Component for the
  // Next.js App Router, so it can be imported from Server Components directly.
  banner: { js: "'use client';" },
  outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.cjs' }),
  esbuildPlugins: [
    {
      name: 'compiled-stylesheet',
      setup(build) {
        build.onResolve({ filter: /\.scss$/ }, () => ({
          path: './styles.css',
          external: true,
        }));
      },
    },
  ],
});
