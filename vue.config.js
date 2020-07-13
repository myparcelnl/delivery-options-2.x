const { deliveryOptionsConfig } = require('./private/delivery-options.config');
const { sandboxConfig } = require('./private/sandbox.config');
const webpack = require('webpack');
const { version, repository } = require('./package.json');

process.env.VUE_APP_VERSION = version;
process.env.VUE_APP_REPOSITORY_URL = repository.url.replace('.git', '');
process.env.VUE_APP_COMMIT_HASH = require('child_process')
  .execSync('git rev-parse HEAD')
  .toString()
  .trim();

const {
  NODE_ENV,
  VUE_APP_CLASS_BASE,
  VUE_APP_VERSION,
  VUE_APP_COMMIT_HASH,
  VUE_APP_REPOSITORY_URL,
} = process.env;

/**
 * @type {import("@vue/cli-service").ProjectOptions}
 */
module.exports = {
  publicPath: NODE_ENV === 'production'
    ? '/delivery-options/'
    : '/',
  productionSourceMap: false,
  devServer: {
    host: '0.0.0.0',
    writeToDisk: true,
    disableHostCheck: true,
  },

  css: {
    sourceMap: NODE_ENV === 'development',
    extract: false,
    loaderOptions: {
      sass: {
        prependData: `$classBase: '${VUE_APP_CLASS_BASE}';`,
      },
    },
  },

  pwa: {
    name: 'MyParcel delivery options sandbox',
    themeColor: '#0f5c47',
    msTileColor: '#0f5c47',
    appleMobileWebAppCapable: 'yes',
    manifest: {
      short_name: 'Delivery options',
    },
    manifestOptions: {
      background_color: '#0f5c47',
    },
  },

  configureWebpack: {
    resolve: {
      symlinks: false,
    },
    plugins: [
      new webpack.EnvironmentPlugin({
        VUE_APP_CLASS_BASE: JSON.stringify(VUE_APP_CLASS_BASE),
        VUE_APP_COMMIT_HASH: JSON.stringify(VUE_APP_COMMIT_HASH),
        VUE_APP_REPOSITORY_URL: JSON.stringify(VUE_APP_REPOSITORY_URL),
        VUE_APP_VERSION: JSON.stringify(VUE_APP_VERSION),
      }),
    ],
  },

  pluginOptions: {
    configureMultiCompilerWebpack: [
      sandboxConfig,
      deliveryOptionsConfig,
    ],
  },
};
