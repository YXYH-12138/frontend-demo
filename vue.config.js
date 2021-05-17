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
        // 这个是加上自己的路径,不能使用(如下:alias)中配置的别名路径
        resolve('./src/assets/css/global.less'),
      ]
    }
  },
}