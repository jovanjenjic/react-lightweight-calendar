import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: (viteConfig) => ({
    ...viteConfig,
    // Storybook's own preview runtime is a ~1 MB chunk; this only silences the size hint.
    build: { ...viteConfig.build, chunkSizeWarningLimit: 1500 },
  }),
};
export default config;
