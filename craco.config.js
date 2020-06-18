const CracoLessPlugin = require('craco-less');
const CrocoCesiumPlugin = require('craco-cesium')

module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#1890ff',
              '@menu-dark-submenu-bg': '#262626',
              '@layout-header-background': '#1f1f1f',
              '@card-radius': '5px',
              '@font-family': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif"
            },
            javascriptEnabled: true,
          },
        },
      },
    }, {
      plugin: CrocoCesiumPlugin
    }
  ],
};
