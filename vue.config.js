const path = require('path');
const webpack = require('webpack');

process.env.VUE_APP_VERSION = require('./package.json').version;
const { VUE_APP_CLASS_BASE } = process.env;

module.exports = {
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        /*
         * @see https://stackoverflow.com/questions/50828904/using-environment-variables-with-vue-js
         */
        prependData: `$classBase: '${VUE_APP_CLASS_BASE}';`,
      },
    },
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
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          VUE_APP_VERSION: JSON.stringify(process.env.VUE_APP_VERSION),
          VUE_APP_CLASS_BASE: JSON.stringify(process.env.VUE_APP_CLASS_BASE),
        },
      }),
    ],
    output: {
      filename: 'myparcel.js',
    },
    optimization: {
      // Make all output go into a single file
      splitChunks: false,
    },
  },
};
