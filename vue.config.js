// const fs = require('fs');
const path = require('path');

module.exports = {
  devServer: {
    // https: {
    //   key: fs.readFileSync('./server.key'),
    //   cert: fs.readFileSync('./server.crt'),
    //   ca: fs.readFileSync('./ca.pem'),
    // },
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
