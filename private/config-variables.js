const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const deliveryOptions = 'Delivery Options';

/**
 * @param {String} name - Name.
 * @param {String} slug - Slug to use for folders and such.
 * @param {webpack.Configuration} config - Config.
 *
 * @returns {webpack.Configuration}
 */
function createConfig(name, slug = null, config = {}) {
  slug = slug || name.toLowerCase().replace(/[^\w\d]/, '-');

  // Destructure things we are inserting manually.
  const {
    plugins = [],
    output = {},
    ...configObject
  } = config;

  return {
    output: {
      filename: `${slug}.js`,
      ...output,
    },

    plugins: [
      new webpack.BannerPlugin(`MyParcel ${name} ${process.env.VUE_APP_VERSION}`),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        defaultSizes: 'parsed',
        openAnalyzer: false,
        logLevel: 'info',
        reportFilename: `analysis/${slug}-report.html`,
      }),
      ...plugins,
    ],
    ...configObject,
  };
}

module.exports = { createConfig, deliveryOptions };
