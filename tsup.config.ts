import type { Options } from 'tsup';

export const tsup: Options = {
  splitting: true,
  clean: true,
  dts: true,
  format: ['cjs'],
  minify: false,
  bundle: false,
  skipNodeModulesBundle: true,
  entryPoints: ['src/index.tsx'],
  watch: true,
  target: 'es2020',
  outDir: 'dist',
  entry: ['src/**/!(*.cy).ts', 'src/**/!(*.cy).tsx'], // Exclude .cy files from the entry array
};
