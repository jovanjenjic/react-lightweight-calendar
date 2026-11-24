import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { defineConfig, type Options } from 'tsup';

const OUT_DIR = 'dist';
const ESM_OUT_DIR = `${OUT_DIR}/esm`;
const ENTRY = 'src/components/Calendar/CalendarWrapper.tsx';

// Sources import the SCSS entry, but the package ships the compiled CSS
// (`npm run build:css`, written to dist/styles/styles.css).
const scssToCss = (path: string) => path.replace(/\.scss$/, '.css');

const shared: Options = {
  // The two builds run in parallel and tsup's `clean` would race between them,
  // so `npm run build:js` empties dist/ before tsup starts instead.
  clean: false,
  dts: true,
  minify: false,
  target: 'es2020',
};

export default defineConfig([
  // CommonJS: one file per source module (dist/components/**, dist/utils/**).
  // This is `main`/`require`, used by CJS consumers and deep `dist/*` imports.
  {
    ...shared,
    // Keep `splitting`: with cjs it makes tsup emit ESM and convert it via sucrase, which yields
    // plain `exports.default = ...` that bundlers (Vite, webpack) detect for default imports.
    splitting: true,
    format: ['cjs'],
    bundle: false,
    skipNodeModulesBundle: true,
    outDir: OUT_DIR,
    // Library sources only: no tests, stories or the local playground.
    entry: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.cy.{ts,tsx}',
      '!src/**/*.stories.{ts,tsx}',
      '!src/index.tsx',
    ],
    async onSuccess() {
      const files = await readdir(OUT_DIR, { recursive: true });
      for (const file of files.filter((f) => f.endsWith('.js'))) {
        const path = join(OUT_DIR, file);
        const code = await readFile(path, 'utf8');
        const fixed = code.replace(/(['"][^'"]+)\.scss(['"])/g, '$1.css$2');
        if (fixed !== code) await writeFile(path, fixed);
      }
    },
  },
  // ESM: a single bundled file (dist/esm/index.mjs) for `import`. Bundling avoids
  // extensionless relative imports, which strict ESM resolvers (Node, webpack 5
  // `fullySpecified`) reject. Dependencies and peer dependencies (react, react-dom,
  // date-fns, classnames) stay external.
  {
    ...shared,
    format: ['esm'],
    bundle: true,
    splitting: false,
    outDir: ESM_OUT_DIR,
    entry: { index: ENTRY },
    outExtension: () => ({ js: '.mjs' }),
    esbuildPlugins: [
      {
        // Keep the stylesheet as a side-effect import of the compiled CSS,
        // e.g. `import '../styles/styles.css'`, relative to dist/esm.
        name: 'external-compiled-css',
        setup(build) {
          build.onResolve({ filter: /\.scss$/ }, (args) => {
            const source = resolve(args.resolveDir, args.path);
            const compiled = resolve(OUT_DIR, relative(resolve('src'), source));
            const path = relative(resolve(ESM_OUT_DIR), scssToCss(compiled));
            return { path: path.startsWith('.') ? path : `./${path}`, external: true };
          });
        },
      },
    ],
  },
]);
