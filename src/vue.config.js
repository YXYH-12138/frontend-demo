module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.less$/,
          loader: "style-loader!css-loader!less-loader",
        }
      ]
    }
  }
}