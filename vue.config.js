const path = require('path')

const resolve = url => path.join(__dirname, url);

module.exports = {
  configureWebpack: {
    module: {
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        resolve('./src/assets/css/global.less'),
      ]
    }
  },
}