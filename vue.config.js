const path = require('path');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  outputDir: path.resolve(__dirname, './docs'),
  assetsDir: './assets',
  publicPath: ''
}
