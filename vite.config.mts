import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Shared Vite config for the local playground (`npm start`), Storybook and Cypress component tests.
// The playground port lives in the `start` script so Cypress and Storybook pick their own ports.
// The published library itself is built with tsup + sass (`npm run build`).
export default defineConfig({
  plugins: [react()],
});
