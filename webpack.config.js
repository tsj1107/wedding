var path = require('path')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin");
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("[name].css"),

    new HtmlWebpackPlugin({
      filename: 'index.htm',
      template: 'src/index.htm',
      inject: true
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
