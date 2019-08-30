const path = require('path');

module.exports = {
  publicPath: 'checkout/sandbox',
  configureWebpack: {
    resolve: {
      alias: {
        /*
         * Override the existing alias for @ to be able to import assets from the checkout, otherwise their imports
         * using this alias will break.
         *
         * This does mean relative paths without @ have to be used within the sandbox vue app.
         */
        '@': path.resolve(__dirname, '../src'),
      },
    },
  },
};
