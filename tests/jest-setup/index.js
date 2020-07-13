const fs = require('fs');

/**
 * Import all files here.
 */
fs.readdirSync(__dirname).forEach((file) => {
  require(`./${file}`);
});
