const CracoLessPlugin = require('craco-less');

module.exports = {
  plugins: [
    {
      plugin: require("craco-cesium")()
    }, {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              '@primary-color': '#368AC4',
              '@menu-dark-submenu-bg': '#262626',
              '@layout-header-background': '#1f1f1f',
              '@border-radius-base': '5px',
              '@font-family': "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', SimSun, sans-serif"
            },
            javascriptEnabled: true,
          },
        },
      },
    }
  ]
};
