const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    index: './src/javascript/index.js',
    game: './src/javascript/game-script.js',
    spinster: './src/javascript/spinster.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'javascript'),
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000,
    ignored: '**/node_modules'
  }
};