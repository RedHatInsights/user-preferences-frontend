const { apiRoutes } = require('./api-routes');

const { resolve } = require('path');

const env = () => {
  const type = process.env.USE_PROD ? 'prod' : 'stage';
  const stable = process.env.BETA ? 'beta' : 'stable';
  return `${type}-${stable}`;
};

const routes = () => {
  return process.env.USE_CUSTOM_ROUTES ? apiRoutes : undefined;
};

const config = require('@redhat-cloud-services/frontend-components-config');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useProxy: true,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  appUrl: process.env.BETA ? '/beta/user-preferences' : '/user-preferences',
  env: env(),
  routes: routes()
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
