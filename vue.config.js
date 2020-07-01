const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  pluginOptions: { // 第三方插件配置
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/css/base.less')] // less所在文件路径
    }
  },
  //正式环境请注释下面代码块
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://193.193.50.98:8080',
        target: 'http://www.lz-10086.com/webupload',
        // 允许跨域
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? './'
    : '/'
}