const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  https: true,
  sassPrefix: '.email',
  modules: ['userPreferences'],
  ...(process.env.BETA ? { deployment: 'beta/apps' } : {}),
});

const modulesConfig = require('@redhat-cloud-services/frontend-components-config/federated-modules')(
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
