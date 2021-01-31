const path = require('path');

module.exports = {
  entry: './src/javascript/index.js',
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, 'javascript'),
  },
  watch: true,
  watchOptions: {
    ignored: '**/node_modules'
  }
};