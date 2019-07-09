const path = require('path');

module.exports = {
  devServer: {
    host: 'localhost',
    writeToDisk: true,
    disableHostCheck: true,
  },
  configureWebpack: {
    resolve: {
      alias: {
        Sdk: path.resolve(__dirname, './myparcel-js-sdk'),
      },
    },
    optimization: {
      // Make all output go into a single file
      splitChunks: false,
    },
  },
};
