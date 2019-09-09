const path = require('path');

module.exports = {
  css: {
    extract: false,
    loaderOptions: {
      sass: {
        /*
         * @see https://stackoverflow.com/questions/50828904/using-environment-variables-with-vue-js
         */
        data: `$classBase: '${process.env.VUE_APP_CLASS_BASE}';`,
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
    output: {
      filename: 'myparcel.js',
    },
    optimization: {
      // Make all output go into a single file
      splitChunks: false,
    },
  },
};
