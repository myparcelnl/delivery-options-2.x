const { deliveryOptionsConfig } = require('./private/delivery-options.config');
const { sandboxConfig } = require('./private/sandbox.config');
const webpack = require('webpack');

process.env.VUE_APP_VERSION = require('./package.json').version;
const { NODE_ENV, VUE_APP_CLASS_BASE, VUE_APP_VERSION } = process.env;

/**
 * @type {import("@vue/cli-service").ProjectOptions}
 */
module.exports = {
  publicPath: NODE_ENV === 'production'
    ? '/checkout/'
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
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_VERSION: JSON.stringify(VUE_APP_VERSION),
          VUE_APP_CLASS_BASE: JSON.stringify(VUE_APP_CLASS_BASE),
        },
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
