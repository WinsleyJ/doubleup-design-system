/** @type { import('@storybook/html-vite').StorybookConfig } */
export default {
  framework: '@storybook/html-vite',
  stories: ['../stories/**/*.mdx', '../stories/**/*.stories.js'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  core: { disableTelemetry: true },
};
