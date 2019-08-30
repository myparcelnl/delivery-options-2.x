const path = require('path');

module.exports = {
  css: {
    extract: false,
  },
  devServer: {
    host: 'localhost',
    writeToDisk: true,
    disableHostCheck: true,
  },
  productionSourceMap: false,
  configureWebpack: {
    resolve: {
      alias: {
        '@myparcel/sdk': path.resolve(__dirname, './myparcel-js-sdk'),
      },
    },
    output: {
      filename: 'myparcel.js',
    },
    optimization: {
      // Make all output go into a single file
      splitChunks: false,
    },
  },
};
