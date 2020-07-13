const { createConfig, deliveryOptions } = require('./config-variables');

/**
 * The base delivery options build. Includes all Vue code and compiles everything into one file.
 *
 * @type {webpack.Configuration}
 */
const deliveryOptionsConfig = createConfig(deliveryOptions, null, {
  entry: '@/delivery-options/main.js',
  output: {
    filename: 'myparcel.js',
  },

  optimization: {
    splitChunks: false,
  },
});

module.exports = { deliveryOptionsConfig };
