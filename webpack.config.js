var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var webpackConfig = {
  entry: {
    'app': './src/app.js'
  },
  output: {
    path: __dirname + '/dist',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [{
            loader: "style-loader"
        }, {
            loader: "css-loader"
        }, {
            loader: "less-loader"
        }]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.htm',
      template: 'src/index.htm'
    }),

    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, './src/vendor'),
        to: path.resolve(__dirname, './dist/vendor'),
        ignore: ['.*']
      }
    ])
  ]
}

module.exports = webpackConfig
