import { createMainConfig } from '@redhat-cloud-services/hcc-storybook-hub/config';
import path from 'path';

export default createMainConfig({
  stories: [
    '../src/docs/*.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  staticDirs: ['../static'],
  extraAliases: {
    '@scalprum/react-core': path.resolve(process.cwd(), '.storybook/hooks/scalprum'),
  },
});
