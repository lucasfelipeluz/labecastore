const path = require('path');

module.exports = {
  entry: ['@babel/polyfill', './src/script/modules/index.js'],
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './src/script/'),
  }
}
