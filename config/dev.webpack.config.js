const { resolve } = require('path');

const webpackProxy = {
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  env: 'stage-beta',
  appUrl: process.env.BETA
    ? '/beta/user-preferences/email'
    : '/user-preferences/email',
};

const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  sassPrefix: '.email, .userPreferences',
  modules: ['userPreferences'],
  ...(process.env.BETA ? { deployment: 'beta/apps' } : {}),
  ...(process.env.PROXY && webpackProxy),
});

const modulesConfig =
  require('@redhat-cloud-services/frontend-components-config/federated-modules')(
    {
      root: resolve(__dirname, '../'),
      moduleName: 'userPreferences',
    }
  );

plugins.push(modulesConfig);

module.exports = {
  ...webpackConfig,
  plugins,
};
