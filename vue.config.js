const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

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
    // plugins: process.env.NODE_ENV === 'production' ? [
    //   new BundleAnalyzerPlugin({
    //     analyzerPort: 'auto',
    //   }),
    // ] : [],
    resolve: {
      alias: {
        Sdk: path.resolve(__dirname, './myparcel-js-sdk'),
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
