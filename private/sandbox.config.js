const FaviconsWebpackPlugin = require('favicons-webpack-plugin/src');
const { createConfig } = require('./config-variables');

const slug = 'sandbox';

/**
 * The Sandbox build. Has features like chunk splitting and favicons because it will actually be a web page.
 *
 * @type {webpack.Configuration}
 */
const sandboxConfig = createConfig('Delivery Options Sandbox', slug, {
  entry: '@/main.js',
  output: {
    filename: 'sandbox.js',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },

  plugins: [
    new FaviconsWebpackPlugin({
      cache: true,
      inject: true,
      logo: './src/assets/images/logo.png',
      prefix: 'img/icons/',
    }),
  ],
});

module.exports = { sandboxConfig };
