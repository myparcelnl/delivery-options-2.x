module.exports = {
  devServer: {
    host: 'localhost',
    writeToDisk: true,
  },
  configureWebpack: {
    optimization: {
      // Make all output go into a single file
      splitChunks: false,
    },
  },
};
